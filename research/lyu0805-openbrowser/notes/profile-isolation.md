# Profile 隔离

## 1. “隔离”到底隔离什么

Chromium 的登录态和页面持久化数据主要依赖 `user-data-dir` 下的 Profile 文件，包括：

- Cookie、LocalStorage、IndexedDB、Service Worker；
- Cache、历史记录、下载记录；
- 扩展状态与站点权限；
- Preferences、Session/Tabs；
- 网络和页面运行产生的其他本地状态。

OpenBrowser 的核心规则是：

```text
一个环境 ID
  = 一个固定 Profile 根目录
  = 同时最多一个 Chromium 所有者
  = 一个运行时 CDP 端口
```

这能防止本机多个环境共享 Cookie/Storage，但不能自动保证：

- 网站无法通过同一网络出口、支付方式、行为或账号信息关联环境；
- 页面看到的所有硬件/传输信号完全独立；
- 操作系统级 Secret、剪贴板、文件或 DNS 完全隔离；
- 多环境代表多个真实用户。

因此，Profile 隔离首先是数据完整性和测试可重复性能力，而不是匿名证明。

## 2. 目录模型

`BrowserEngine` 构造时确定 `profileDataRootPath`，每个 Profile 路径严格为：

```js
profileRoot(id) = path.join(profileDataRootPath, assertProfileId(id))
```

Profile ID 只允许 `[A-Za-z0-9_-]{1,64}`。这同时降低路径穿越、平台保留字符和日志注入风险。

### 2.1 数据根防护

`validateDataRootIsolationSecure()` 做两层判断：

1. **词法路径检查**：不能是盘符/文件系统根，不能与已知 Chrome、Edge、Chromium、Brave、Vivaldi 数据目录包含或被包含；
2. **真实路径检查**：解析 realpath 后再次比较，拒绝数据根本身是 symlink/junction。

Windows 特别使用 `LOCALAPPDATA` 构造真实浏览器数据路径，而不是只检查 Roaming `APPDATA`。

证据：[`systemBrowserDataRoots`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L379-L428)与[`validateDataRootIsolationSecure`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L465-L492)。

### 2.2 Profile 根防护

`validateProfileRoot()` 要求 Profile 必须严格位于 `{dataRoot}/{profileId}`，不能等于 dataRoot，也不能使用自定义子路径。安全版本还检查 realpath 和 symlink/junction。

`assertSafeProfileChild()` 从 Profile 根逐级检查目标路径，阻止中间路径通过 symlink 跳出根目录。删除、缓存清理和文件准备操作应在该边界内执行。

证据：[`validateProfileRootSecure`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L548-L608)。

## 3. 原子 Profile 锁

目录不同只能防止两个不同 Profile 共享数据，不能防止同一个 Profile 被并发打开。Chromium 自己有 SingletonLock，但 OpenBrowser 还需要在启动前协调代理、Preferences、Cookie 和进程状态，因此实现了应用级锁。

锁文件为：

```text
{profileRoot}/.openbrowser-instance.lock
```

### 3.1 获取协议

`acquireProfileLock()`：

1. 创建 Profile 根；
2. 使用 `fsp.open(file, 'wx', 0o600)` 原子创建锁；
3. 写入 Electron PID、随机 token、Profile ID、Profile 根和创建时间；
4. 初始 `browserPid = null`，表示 spawn 身份尚未绑定；
5. spawn 成功后用 `updateProfileLock()` 原子回写 Chromium PID。

`wx` 是真正的跨进程排他点，不存在“先建目录、再写 owner”之间的空窗。

### 3.2 陈旧锁恢复

遇到已有锁时不会直接删除，而是验证：

- JSON 结构、Profile ID 和绝对根目录匹配；
- Electron PID 是否存活；
- 已绑定 Chromium PID 是否存活；
- 系统进程列表中是否仍有命令行使用精确 `--user-data-dir`；
- `browserPid=null` 的启动中锁是否已经超过保护时间。

如果进程扫描结果未知、PID 不合法或所有权无法证明，会 fail-closed，返回不可恢复错误，而不是冒险抢占目录。

证据：[`acquireProfileLock`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L138-L260)。

### 3.3 释放协议

释放不是简单删除：调用者必须提供原 owner 的 token，并再次核对 PID、token 和 Profile 根。这样一个旧异步清理任务不能误删后来启动实例的锁。

证据：[`updateProfileLock/releaseProfileLock`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L287-L333)。

## 4. 进程级生命周期屏障

`BrowserEngine` 维护三张 Map：

```text
starting: profileId -> start Promise
running:  profileId -> live process/runtime object
stopping: profileId -> stop Promise
```

启动规则：

- 已有 `starting`：复用相同 Promise；
- 已有 `stopping`：等待停止完成；
- 停止后仍有未确认清理的运行项：拒绝重新启动；
- 已稳定运行：返回现有运行信息；
- 否则创建唯一 `_start()` Promise。

停止规则：

- 已有 `stopping`：复用相同 Promise；
- 仍在 `starting`：先等待启动完成；
- 没有运行项：幂等返回 alreadyStopped；
- 否则创建唯一 `_stop()` Promise。

这是一种 per-key async barrier，可复用于本地服务、容器、数据库连接或硬件设备的生命周期管理。

证据：[`start`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js#L2201-L2231)与[`stop`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js#L2844-L2864)。

## 5. Chromium 启动参数中的隔离

每个进程至少使用：

```text
--user-data-dir={profileRoot}
--disk-cache-dir={profileRoot}/OpenBrowserCache
--crash-dumps-dir={profileRoot}/OpenBrowserCrashReports
--profile-directory=Default
--remote-debugging-port=0
```

这里使用相同的 `Default` 子 Profile 并不构成跨环境共享，因为每个 Chromium 的顶层 `user-data-dir` 不同。

随机调试端口让每次运行由 Chromium 选择可用回环端口。运行项记录实际端口，隔离审计检查不同 Profile 是否意外使用相同端口。

证据：[`engine.js` 启动参数](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js#L2335-L2354)。

## 6. 隔离审计

`auditIsolation()` 检查运行项：

- 是否缺失 user-data-dir；
- 规范化后是否出现根目录碰撞；
- 是否出现 CDP 端口碰撞。

Windows 路径比较大小写不敏感。这是运行时不变量检查，而不仅是配置校验。

局限：当前审计不检查代理出口重复、扩展分配、Cookie hash、环境指纹重复、系统级资源共享或 Profile 文件权限。

证据：[`auditIsolation`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js#L495-L546)。

## 7. Profile 配置与浏览器数据不是同一层

需要区分：

- `openbrowser-engine.json` 中的 Profile 元数据：名称、代理、指纹意图、平台账号字段、可选 Cookie 导出等；
- `{profileRoot}` 中 Chromium 的实际持久化数据：Cookie DB、Storage、扩展状态等。

删除 Profile 时可以选择是否删除数据目录。复制 Profile 路由复制的是配置对象，不会复制整个 Chromium 目录；但配置对象本身可能含 Cookie 导出和凭据，因此“没有复制目录”不等于“没有复制登录信息”。

## 8. duplicate 行为审计

上游自动化文档写道复制环境“不复制 Cookie/凭据/出口检测/指纹身份”。固定提交当前实现：

```js
const base = this.engine.sanitizeProfile(source);
const next = this.engine.sanitizeProfile({
  ...base,
  id,
  // 只清除部分字段
  exitCheckedAt: undefined,
  exitNetwork: undefined,
  privacy: {
    ...(base.privacy || {}),
    fingerprint: undefined,
    batterySnapshot: undefined,
    mediaLabels: undefined,
  },
});
```

由于先展开 `...base`，以下字段仍可能保留：

- `cookies`；
- `proxy` 中的 username/password；
- `platform.username/password/totpSecret`；
- `exitIp`、`exitCountryCode`、`exitTimezone` 等未被明确清除的字段。

若新 Profile 启动且 `cookies` 有值，`engine.js` 会通过 CDP `Storage.setCookies` 导入配置 Cookie。因此这是会话隔离契约中的实质风险，而不是单纯 UI 显示问题。

证据：[`duplicate` 路由](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/local-api-server.js#L402-L430)与[Cookie 导入](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js#L970-L1005)。本研究复现脚本见[`../experiments/duplicate-profile-audit.js`](../experiments/duplicate-profile-audit.js)。

建议修复方式：

1. 定义 `cloneProfileConfiguration(source, policy)` 白名单，而不是对象展开后做黑名单删除；
2. 默认清除所有 Secret、Cookie、出口检测和稳定身份种子；
3. 提供显式 `includeSession/includeSecrets`，并要求人工确认；
4. 对“复制后的字段集合”建立契约测试；
5. MCP `duplicate_profile` 文档必须与实际 policy 同源生成。

## 9. 参考实现原则

若独立实现 Profile 隔离，最小正确集合应包括：

- 安全、唯一、可验证的 Profile ID；
- 严格 `{root}/{id}` 映射；
- 拒绝系统浏览器数据目录和 symlink/junction；
- 原子锁和不可伪造 owner token；
- PID + 实际命令行所有权验证；
- per-profile start/stop barrier；
- 随机回环 CDP 端口；
- 启动失败和异常退出的统一资源清理；
- 删除前重新验证根目录；
- 运行时碰撞审计；
- 复制、导出和备份的敏感字段 policy；
- Windows/macOS/Linux 的进程树和文件锁专项测试。
