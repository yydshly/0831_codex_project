# CDP 控制层

## 1. CDP 在项目中的位置

Chrome DevTools Protocol（CDP）是 Chromium 暴露的调试与自动化协议。OpenBrowser 启动的是真实 Chromium，CDP 负责把“配置环境”和“执行动作”转成浏览器能理解的命令：

```text
BrowserEngine 启动 Chromium
  → Chromium 写出随机调试端口
  → HTTP /json/version、/json/list 发现 Target
  → WebSocket 建立 Browser/Page Session
  → 应用环境配置或执行 RPA
```

因此 CDP 不是浏览器模拟器，也不等于登录绕过。登录成功后产生的 Cookie、LocalStorage 和 IndexedDB 主要由独立 Profile 目录持久化；CDP 只是可以读取、写入或驱动这些状态的控制通道。

## 2. 为什么不用固定端口

[`engine.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js) 以 `--remote-debugging-port=0` 启动 Chromium，让操作系统分配空闲端口，然后从 Profile 目录中的 `DevToolsActivePort` 获取结果。

这样做有三个价值：

- 多 Profile 同时启动时不需要集中分配端口号；
- 避免旧进程占用固定端口导致新环境误连；
- 配合回环地址，减少调试接口意外暴露到局域网的概率。

随机端口并不是鉴权。任何能够在本机读取端口并连接该 WebSocket 的进程，原则上都能获得很强的页面控制能力，所以操作系统账号隔离、进程权限和本机恶意软件仍在信任边界内。

## 3. 两类连接模型

项目在 [`cdp.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/cdp.js) 中实现了轻量客户端，而不是引入 Puppeteer。

### 3.1 一次性调用

一次性 `call()` 的生命周期是：连接 WebSocket、发送一个带递增 ID 的请求、等待对应响应、关闭连接。它适合低频状态查询或单个命令，优点是调用边界清楚，缺点是无法高效消费事件，连续操作也会反复握手。

### 3.2 持久连接

`PersistentConnection` 维护：

- 单调递增的请求 ID；
- `id → Promise resolve/reject/timeout` 的 pending Map；
- CDP 事件监听器；
- Session ID 与 Target 事件分发；
- 断线时对所有未完成请求的统一失败处理。

它适合 RPA、窗口同步和新 Target 注入。这个实现体现了一个通用 RPC 客户端模式：请求和响应靠 ID 关联，无 ID 消息视为事件，连接关闭必须主动清空 pending，避免调用永远悬挂。

## 4. Browser Target、Page Target 与 Session

CDP 中浏览器进程和每个页面、iframe、Worker 都可能是独立 Target。只连接当前 Page 并注入一次脚本，无法覆盖之后创建的标签页、子框架或 Worker。

OpenBrowser 的处理思路是：

1. 从 `/json/version` 获取 Browser WebSocket；
2. 调用 `Target.setDiscoverTargets`；
3. 调用 `Target.setAutoAttach`，使用 `flatten: true`；
4. 设置 `waitForDebuggerOnStart: true`，让新 Target 先暂停；
5. 按 Target 类型和 Session 应用配置；
6. 调用 `Runtime.runIfWaitingForDebugger` 恢复执行。

`flatten: true` 使所有 Session 复用同一 WebSocket，并用 `sessionId` 路由。这比为每个 iframe/Worker 单独建立连接更容易统一管理。

“先暂停、注入、再恢复”非常关键。若页面脚本在配置前已经读取 `navigator`、时区或 WebGL 信息，之后再修改只能影响后续读取，无法撤回已经上报的数据。

## 5. 环境配置如何落到浏览器

OpenBrowser 组合使用三层手段：

| 层 | 示例 | 作用与边界 |
| --- | --- | --- |
| Chromium 启动参数 | 语言、代理、分辨率、WebRTC、扩展、内核选项 | 在进程创建时生效；修改通常需要重启 |
| CDP Emulation/Network | UA 与 Client Hints、时区、地理位置、Locale、设备指标 | 浏览器原生协议支持较好，但可覆盖面受 Chromium 版本限制 |
| 文档开始脚本 | Canvas、WebGL、Audio、ClientRect、媒体设备等 JS 可见属性 | 需要覆盖新文档和子上下文；仍可能留下原型、时序或跨层不一致 |

[`fingerprint.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/fingerprint.js) 先从 Profile ID 派生稳定配置，再由 BrowserEngine 在启动参数、CDP 和 document-start 脚本三个层面应用。当前文档也明确保留了“某些能力只能由定制内核完成”和真实字体差异等限制。

这套实现适合研究“如何让测试环境可重复”，不应推导为“网站无法识别”。真实检测还会交叉验证 TLS/HTTP2、字体栅格、GPU、扩展、输入行为、IP 信誉、账号关系和服务端历史。

## 6. RPA 如何使用 CDP

RPA 的常见映射如下：

| RPA 意图 | 典型 CDP Domain |
| --- | --- |
| 导航、生命周期、截图 | `Page` |
| 执行选择器脚本、读取页面值 | `Runtime` |
| 鼠标、键盘、滚动 | `Input` |
| 请求监听、UA、缓存 | `Network` |
| Cookie | `Storage` / `Network` |
| 下载行为 | `Browser` / `Page` |
| 新标签页和 iframe | `Target` |

项目大量动作通过 `Runtime.evaluate` 执行 DOM 查询，再使用 `Input.dispatchMouseEvent` 或键盘事件执行交互。这比直接调用 DOM 的 `element.click()` 更接近用户输入，但仍不是物理输入，也不自动解决遮挡、动画、跨域 iframe、Shadow DOM 和页面重渲染问题。

## 7. 实现中的工程价值

### 请求超时必须属于连接层

每个请求都有定时器；收到响应后清理，断线时统一 reject。这避免上层 RPA 为每个 CDP 命令重复实现超时和断线逻辑。

### Target 生命周期必须是一等事件

页面刷新、弹窗和 iframe 都会改变执行上下文。持续自动化不能只保存一个旧 executionContextId，而应在上下文销毁后重建定位和注入。

### 配置应用要幂等

同一个 Target 可能经多条事件路径被发现。注入操作应允许重复调用，或记录 `(sessionId, configVersion)`，避免重复 patch 原型造成行为叠加。

### 版本兼容要显式管理

CDP 随 Chromium 演进。生产实现应记录浏览器版本与协议版本，对可选命令识别“不支持”和“执行失败”，并用固定内核矩阵做契约测试。

## 8. 安全与可靠性边界

- CDP 权限接近对浏览器的远程代码执行能力，应只监听回环地址，不应直接暴露公网。
- `Runtime.evaluate` 的脚本、页面内容和返回值都应视为不可信数据。
- 自动化上传、下载和文件读取需要限定根目录，防止页面或 Agent 拼接任意路径。
- 页面导航应有协议和域名策略，至少阻止 `file:`、浏览器内部页以及云元数据地址等高风险目标。
- CDP 命令超时不代表命令一定没有执行；有副作用的操作需要幂等键或执行后核验。
- 浏览器崩溃后应废弃所有旧 Session，不要把新进程误认为旧连接的延续。

## 9. 推荐的独立抽象

若把这部分迁移到其他项目，可以拆成四层：

```text
CdpTransport
  ├─ connect / close / request / event
TargetRegistry
  ├─ discover / attach / detach / context lifecycle
EnvironmentApplicator
  ├─ apply launch config / CDP overrides / init scripts
BrowserActions
  └─ navigate / locate / click / type / capture / cookies
```

RPA 只依赖 `BrowserActions`，而不是直接散落 CDP method 字符串。这样更容易做浏览器版本适配、动作级超时、审计和假实现测试。
