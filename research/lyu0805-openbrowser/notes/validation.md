# 验证记录

## 1. 基线与方法

| 项目 | 值 |
| --- | --- |
| 上游 | `lyu0805/OpenBrowser` |
| 固定提交 | `405201583b39a90ae785193d82653f62a0ed9f91` |
| 提交时间 | `2026-08-29 08:46:21 +0800` |
| 上游版本 | `1.0.4` |
| 研究日期 | `2026-08-31` |
| 研究系统 | Windows，Asia/Shanghai |
| 本地源码 | `sources/lyu0805-openbrowser`，由 `.gitignore` 排除，不作为本研究提交内容 |

本研究使用固定提交的稀疏检出，排除了体积较大且 Windows 长路径敏感的 `Browserapp/kernels/` 二进制目录。验证重点是源码结构、Node 自测与两个最小行为实验。

## 2. 上游核心自测

在 `sources/lyu0805-openbrowser/Browserapp` 目录运行：

```powershell
node environment-audit-selftest.js
node automation/isolation-fingerprint-selftest.js
node cdp-connection-selftest.js
node automation/automation-selftest.js
node automation/local-api-profile-selftest.js
node automation/mcp-control-selftest.js
node automation/protocol/protocol-selftest.js
node security-hardening-selftest.js
```

结果：七组命令直接退出码为 `0`。`mcp-control-selftest.js` 在本机首次运行时因为 Windows 将默认端口 `50325` 列入 TCP excluded range 而报 `listen EACCES`；将该自测本地临时改到未保留端口 `48025` 后，26 项检查全部通过，随后已恢复上游文件。

该现象也暴露了一项测试可移植性问题：自测传入 `port: 0` 本意是请求系统分配临时端口，但 `LocalApiServer` 构造函数使用 `Number(options.port) || 50325`，使 `0` 被折回 `50325`。因此下表中的 MCP 结论是“26 项逻辑检查在替代端口通过”，不是“默认端口在当前 Windows 网络配置可绑定”。

| 自测 | 结果 | 能证明的范围 |
| --- | --- | --- |
| environment audit | 通过 | 数据根/Profile 隔离审计的 Node 逻辑 |
| isolation + fingerprint | 通过 | 路径、锁与部分确定性配置行为 |
| CDP connection | 通过 | 连接层请求、响应、事件和断线场景 |
| automation | 通过 | RPA Store/Engine 的主要 Node 行为；运行中出现 FileHandle GC 警告 |
| Local API profile | 30 assertions 通过 | Profile API 的主要输入/输出路径；运行中出现 FileHandle GC 警告 |
| MCP control | 替代端口下 26 checks 通过 | 工具过滤、映射和控制面主要行为；默认端口受本机 Windows excluded range 阻挡 |
| automation protocol | 通过 | 协议规范化/兼容逻辑 |
| security hardening | 通过 | 上游编码的安全回归项，不是外部渗透测试 |

FileHandle GC 警告没有导致测试失败，但提示部分测试或实现路径存在句柄未显式关闭的可能，应单独用资源泄漏测试确认。

## 3. 本研究实验：Profile 复制边界

命令：

```powershell
node research/lyu0805-openbrowser/experiments/duplicate-profile-audit.js
```

结果：退出码 `0`，`upstreamBehaviorReproduced: true`。

复制后仍与源 Profile 相同的字段类别：

- Cookie 字符串；
- 带用户名/密码的认证代理 URL；
- `platform.username`、`platform.password`、`platform.totpSecret`；
- 出口 IP、国家、时区、经纬度。

被重置的部分：实验 fingerprint marker、电池快照、媒体标签和 `exitCheckedAt`。

结论：固定提交的 duplicate 行为不符合 MCP 工具描述中“Cookies, credentials and exit detection results are not copied”的完整承诺。实验只打印字段名，不打印 fixture secret。

## 4. 本研究实验：RPA 最后一步取消

命令：

```powershell
node research/lyu0805-openbrowser/experiments/rpa-cancellation-audit.js
```

结果：退出码 `0`，并观察到：

```text
cancellationRequested = true
returnedSuccess = true
persistedStatus = success
upstreamBehaviorReproduced = true
```

实验创建一个只有 250ms `wait` 的 Task，在等待期间调用 `stop(taskId)`。因为执行循环只在步骤开始前检查 cancellation Set，最后一步完成后直接写入 success，取消没有赢得终态竞态。

结论：`stop()` 当前表示“提交协作式取消请求”，不能解释为“任务已经停止”；调用方必须等待明确的终态确认。修复需要在步骤调用链传播 AbortSignal，并对终态使用原子状态转移。

## 5. 静态核对

源码审查重点交叉核对了：

- `package.json` 的产品形态、版本、脚本和依赖；
- Electron `BrowserWindow` 安全选项和可信 IPC sender 校验；
- Profile 数据根、锁文件、PID/token、进程扫描和生命周期 Map；
- Chromium 启动参数、随机 CDP 端口、Target 自动附加和环境注入；
- RPA 的动作集合、计划展开、状态写入、取消、日志和历史预算；
- Local API 的绑定地址、Key、CORS、请求体限制、路由和错误 envelope；
- MCP 的工具数量、等级、黑白名单、默认值、HTTP timeout 和 dispatcher；
- 顶层 MIT、第三方通知以及浏览器内核的单独许可边界。

## 6. 未验证项目

以下事项没有因 Node 自测通过而得到证明：

- Electron UI 与真实 Chromium/第三方内核能在当前机器完整启动；
- 内核二进制来源、签名、更新链和全部平台包完整性；
- 真实代理认证、出口时区/地理位置和 WebRTC 行为；
- 登录、验证码、目标网站风控或特定网站兼容性；
- Canvas/WebGL/Audio/字体等面对第三方检测服务的结果；
- Windows 原生输入镜像在多窗口、缩放、弹窗中的可靠性；
- WebDAV/GitHub 等真实备份、恢复、加密和冲突处理；
- 长时间运行的句柄/内存/磁盘泄漏；
- 多机、多用户、多租户、并发队列和灾难恢复；
- 安全渗透、恶意 MCP Host、本机恶意进程或供应链攻击。

所以本文使用“源码审查”“已验证”“上游声明”区分证据，且不对过风控、匿名、账号安全或网站使用合规作效果保证。

## 7. 如何复核

1. 检出同一上游提交，不使用滚动 `main`；
2. 安装该提交声明的 Node/Electron 依赖；
3. 先运行八组上游自测；
4. 运行 [`experiments/README.md`](../experiments/README.md) 中两个实验；
5. 若实验开始失败，先判断上游是否已经修复，不要为了“通过”而修改预期；
6. 若要验证产品能力，另建隔离测试账号和测试站点，记录内核哈希、浏览器版本、代理和测试矩阵。

## 8. 验证状态定义

- `studying`：固定源码与专项自测已经分析，但真实产品链路仍有明显未验证面；
- `validated`：需要在授权环境完成真实内核启动、Profile 生命周期、CDP、RPA、MCP、安全边界和恢复测试，并记录可重复证据。

本条目保持 `studying`。
