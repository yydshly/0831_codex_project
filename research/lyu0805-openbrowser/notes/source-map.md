# 源码地图

本页对应固定提交 [`405201583b39a90ae785193d82653f62a0ed9f91`](https://github.com/lyu0805/OpenBrowser/tree/405201583b39a90ae785193d82653f62a0ed9f91)。行号会随上游变化，因此链接固定到提交，正文按职责定位。

## 1. 顶层与 Electron 外壳

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`package.json`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/package.json) | Electron 启动、打包、版本与自测脚本 | `private: true` 证明它是应用而非 npm 库 |
| [`main.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/main.js) | Electron 主进程、窗口安全选项、可信 IPC、服务装配 | `contextIsolation`、`sandbox`、sender 校验、生命周期 |
| [`preload.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/preload.js) | Renderer 到主进程的受限桥 | 暴露面是否小于主进程能力 |
| [`renderer.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/renderer.js) | 桌面 UI 状态和交互 | 哪些字段在 UI/localStorage 被脱敏，哪些交给主进程 |
| [`automation/index.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/index.js) | 自动化模块 composition root | RpaStore、RpaEngine、ProxyStore、Sync、App Center、Local API 的依赖关系 |

## 2. 浏览器执行面

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`engine.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js) | Profile schema、持久化、内核、启动停止、代理、指纹、Cookie、扩展 | `sanitizeProfile`、`syncProfiles`、`start/_start`、`stop/_stop`、生命周期 Map |
| [`automation/isolation.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/isolation.js) | ID/数据根验证、Profile 锁、进程扫描、隔离审计 | `wx` 锁、PID/token、fail-closed 恢复 |
| [`automation/browser-kernel.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/browser-kernel.js) | 独立 Chromium 内核发现、状态与版本 | 第三方二进制和平台目录边界 |
| [`proxy-forwarder.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/proxy-forwarder.js) | 认证代理与 Chromium 之间的本地转发 | 本地监听、认证、关闭和错误传播 |
| [`automation/proxy-store.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/proxy-store.js) | 代理库 CRUD、检测状态与持久化 | 明文凭据、导入导出和 MCP read 边界 |
| [`automation/fingerprint.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/fingerprint.js) | 确定性指纹、动态网络配置、注入脚本 | seed、static/dynamic、跨字段一致性和能力声明限制 |

## 3. CDP 与窗口同步

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`cdp.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/cdp.js) | Target 发现、一次性命令、持久 WebSocket RPC、常用动作 | pending Map、超时、事件、断线、Session |
| [`live-sync-v5.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/live-sync-v5.js) | 页面/窗口群控的 CDP 同步逻辑 | 主从 Target、坐标、标签页、事件抑制 |
| [`automation/window-sync-bridge.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/window-sync-bridge.js) | Local API 与同步实现的适配 | 启停、设置、窗口排列、状态映射 |
| [`native-input-mirror.cs`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/native-input-mirror.cs) | Windows 原生后台输入镜像 | 平台限制、原生权限、AGPL 来源声明 |

## 4. RPA

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`automation/rpa-engine.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/rpa-engine.js) | DSL 解析、变量、动作、计划并行、Task 状态与取消 | `runPlan`、`runTask`、`executeStep`、取消检查点 |
| [`automation/rpa-store.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/rpa-store.js) | Plan/Task/Template JSON 存储、迁移、裁剪和导入导出 | 状态可任意写、串行保存、50MB 预算、终态历史 |
| [`automation/protocol/`](https://github.com/lyu0805/OpenBrowser/tree/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/protocol) | 自动化协议的规范化/兼容逻辑 | 动作别名、版本和契约测试覆盖 |
| [`automation/rpa-templates-builtin.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/rpa-templates-builtin.js)、[`catalog-templates.json`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/data/catalog-templates.json) | 内置/目录模板 | 模板来源、参数语义和安装后 Profile 绑定 |

## 5. 控制面

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`automation/local-api-server.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/local-api-server.js) | 回环 HTTP API、Key、CORS、Profile/RPA/代理/同步路由 | route method 约束、DTO、敏感输出、duplicate 路由 |
| [`automation/mcp-server.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/mcp-server.js) | stdio JSON-RPC、50 个工具、等级/黑白名单、HTTP 代理 | fail-open 默认、schema/dispatcher 漂移、错误映射 |
| [`automation/app-center.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/app-center.js) | 应用中心数据 | 外部数据来源、缓存与展示边界 |
| [`automation/cloud-sync.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/cloud-sync.js) | 本地/WebDAV/GitHub 备份恢复 | 备份内容、加密、凭据和冲突语义 |

## 6. 安全与许可证

| 文件 | 职责 | 阅读重点 |
| --- | --- | --- |
| [`security-hardening-selftest.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/security-hardening-selftest.js) | Electron/IPC/路径等安全回归检查 | 它覆盖的是静态/Node 行为，不等于完整渗透测试 |
| [`environment-audit-selftest.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/environment-audit-selftest.js) | 环境隔离审计自测 | 碰撞、错误数据根和进程边界 |
| [`THIRD-PARTY-NOTICES.md`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/THIRD-PARTY-NOTICES.md) | 第三方来源说明 | 原生输入 AGPL 适配和内核单独许可 |
| [`DISCLAIMER.md`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/DISCLAIMER.md) | 上游免责声明 | 不保证匿名、过检测、账号登录或网站兼容性 |

## 7. 推荐阅读顺序

### 快速理解产品

1. 上游 `README_CN.md` 和 `automation/README.md`；
2. `automation/index.js`；
3. `local-api-server.js` 的路由目录；
4. `mcp-server.js` 的 `toolsMeta()`。

### 深入 Profile/CDP

1. `engine.js` 的 constructor、`sanitizeProfile`、`syncProfiles`；
2. `isolation.js`；
3. `engine.js` 的启动/停止流程；
4. `cdp.js`；
5. `fingerprint.js` 和环境应用调用点。

### 深入 RPA/MCP

1. `rpa-store.js` 的 Plan/Task/Template 数据模型；
2. `rpa-engine.js` 的 `runPlan`、`runTask`、`executeStep`；
3. `local-api-server.js` 的 RPA 路由；
4. `mcp-server.js` 的 `toolsMeta`、`toolsForMode`、`callTool`；
5. 相应 selftest 和本研究 [`experiments/`](../experiments/)。

## 8. 源码规模提示

`engine.js`、`main.js`、`renderer.js`、`fingerprint.js` 和 `rpa-engine.js` 都是高认知负荷文件。阅读时不要按行从头到尾推进，先用类、导出函数和调用路径建立地图，再针对一个生命周期追踪：

```text
create Profile
  → sanitize/persist
  → start/lock/launch
  → discover CDP/apply config
  → run action
  → stop/cleanup/unlock
```

这条路径能把大多数关键模块串起来，也更容易识别职责耦合和错误边界。
