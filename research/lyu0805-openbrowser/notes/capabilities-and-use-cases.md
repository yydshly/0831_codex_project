# 能力、使用场景与边界

## 1. 产品定位

OpenBrowser 是一个本地桌面“浏览器环境控制器”。它管理的不是抽象 HTTP 会话，而是真实 Chromium 进程及其持久化 Profile。

因此，它与几类常见工具的区别是：

| 类别 | 主要对象 | OpenBrowser 的差异 |
| --- | --- | --- |
| 普通 Chrome 多用户 | 人工浏览 Profile | OpenBrowser 增加代理、环境参数、批量管理、同步、RPA 和外部控制面 |
| Playwright/Puppeteer | 测试脚本和临时 BrowserContext | OpenBrowser 更强调长期 Profile、桌面可视化和本地环境管理，测试框架能力反而较弱 |
| Selenium Grid/云浏览器 | 远程节点和浏览器会话 | OpenBrowser 是单机 Electron 应用，没有多租户节点调度 |
| 自主浏览器 Agent | 视觉/DOM 感知、规划、反思 | OpenBrowser 本身不规划；MCP 只把确定性能力暴露给外部 Agent |
| HTTP 爬虫 | 请求、响应和数据管线 | OpenBrowser 使用真实浏览器，资源成本更高，但能保留完整会话和页面执行环境 |

## 2. 能力分层

### 2.1 环境管理能力

- 创建、更新、复制和删除 Profile；
- 分组、标签、编号和启动页；
- 批量启动/停止和窗口排列；
- 为每个 Profile 保存浏览器数据、扩展分配和运行参数；
- 记录启动进度、运行状态、CDP 端口和诊断日志。

这部分的核心价值是“稳定复现一个浏览器工作环境”，而不是模拟登录本身。登录状态只是独立 Cookie、Storage 和 Profile 数据持久化后的自然结果。

### 2.2 网络与代理能力

- Direct、HTTP、HTTPS、SOCKS 代理；
- 认证代理的本地 forwarder；
- 代理库、批量导入和检查；
- 检测出口 IP、国家、时区、经纬度和延迟；
- 将出口信息回填到 Profile 的语言、时区、地理位置和 WebRTC 动态层。

技术上要区分：

- **路由出口**决定网站看到的网络来源；
- **页面环境**决定 JavaScript API 报告的时区、语言、地理位置等；
- **传输指纹**还包括 TLS、HTTP/2、DNS 和代理实现细节，并不由页面 JS 完全控制。

### 2.3 环境参数与指纹能力

固定提交使用三条路径组合：

1. Chromium 启动参数：UA、语言、WebRTC 策略、WebGL 开关、窗口尺寸等；
2. CDP Emulation/Network：UA Client Hints、时区、语言、地理位置；
3. document-start JavaScript：Navigator、Canvas、WebGL、Audio、ClientRects、媒体设备、Speech、Battery、WebGPU 等。

项目把配置拆为稳定静态层和随出口变化的动态层：

```text
staticConfig
  profile seed / UA / platform / CPU / memory / screen
  canvas / webgl / audio / client rect marks
  media / battery / device name / local WebRTC identity

dynamicConfig
  exit timezone / geolocation / public WebRTC address
```

这种拆分的参考价值是避免“换一个代理就把整个设备身份随机一遍”。但页面脚本层的覆盖仍可能被更底层信号、执行时序、函数特征、真实字体测量或行为模型识别，不能等同匿名能力。

### 2.4 扩展与窗口同步

- 扩展按 Profile 分配，并在启动时合并 `--load-extension`；
- 同步模块将一个主窗口的输入事件转换成协议动作，再向多个从窗口 fan-out；
- 页面内容可走 CDP `Input`，Windows 浏览器外壳或后台输入还使用原生消息桥；
- 同步设置包含动作开关、延迟、布局和窗口状态处理。

合理用途包括演示、兼容性测试、重复配置和受控回归。若用于制造虚假互动、批量刷量或规避平台限制，则超出正常测试工具边界。

### 2.5 RPA

RPA 的核心是确定性步骤解释器。上游支持 50 余种兼容动作名称，能力可以归纳为：

| 类别 | 代表动作 |
| --- | --- |
| 页面生命周期 | `goto`、`reload`、`newTab`、`closeTab`、`goBack`、`switchPage` |
| 元素操作 | `click`、`type`、`focusElement`、`selectElement`、`waitForSelector` |
| 输入与导航 | `key`、`keyCombination`、`scroll` |
| 控制流 | `forTimes`、`forElements`、`forLists`、`ifElse`、`whileData` |
| 脚本和变量 | `evaluate`、`${variable}` 插值、`variableOperation`、`toJson`、`extractKey` |
| 数据提取 | `getElement`、`extractData`、`getUrl`、`getCookies`、`getResponse` |
| 文件与输出 | `screenshotPage`、`uploadAttachment`、`downloadFile`、`exportExcel`、`saveData` |
| 外部连接 | `getOpenAI`、`googleSheet`、`useExcel`、`get2faCode` 等兼容入口 |

这些动作并不都具有相同成熟度；“动作名存在”只证明解释器有分支，不能替代参数契约和端到端测试。

### 2.6 Local API 与 MCP

Local API 是应用内部服务的 HTTP 门面。MCP 是外部 Agent 入口，它把工具调用翻译成 Local API 请求，而不是直接连接 CDP。

固定提交实际注册 50 个 MCP 工具，分为：

| 分组 | 工具数 | 典型能力 |
| --- | ---: | --- |
| 系统/策略 | 4 | 状态、策略、Key 配置状态、运行时策略更新 |
| Profile | 9 | 列表、CRUD、复制、启停 |
| 指纹/隔离 | 5 | 获取、覆盖、重置、重新生成、隔离审计 |
| 代理 | 7 | 列表、CRUD、批量导入、检测 |
| 扩展/应用 | 3 | 扩展列表、应用列表、扩展分配 |
| 窗口同步 | 7 | 状态、设置、启动、停止、重启、排列 |
| RPA | 15 | 计划、任务、模板、运行、停止、结果 |

## 3. 合理使用场景

### 3.1 多会话测试与内部运营工具

当一个团队合法拥有多组测试账号、商家账号或客服身份时，Profile 隔离能减少 Cookie 串号和人工切换成本。规范做法是：

- 明确账号所有者和授权范围；
- 为测试账号设置独立数据生命周期；
- 不用环境隔离绕过账号数量、设备或封禁限制；
- 对自动写操作建立审批与审计记录。

### 3.2 地区化、设备画像和风控 QA

测试矩阵可包含：

```text
代理出口 × 语言 × 时区 × 地理位置 × UA/OS × 分辨率 × 登录状态
```

该场景的目标是验证自己的产品，而不是让第三方平台误判真实用户身份。建议保存矩阵配置和期望结果，让每个 Profile 都是可复现测试夹具。

### 3.3 Agent 执行器

AI Agent 擅长生成计划和处理非结构化目标，OpenBrowser 负责持久 Profile 和确定性执行。一个安全的分层方式是：

```text
Agent：理解目标、选择只读/执行工具、解释结果
Policy：限制工具、Profile、URL、文件和写操作
OpenBrowser：管理 Profile、运行步骤、返回结构化结果
Human：批准登录、支付、删除、发布等高影响动作
```

当前项目只实现了其中部分 Policy，因此若用于 Agent，应在外部再加批准层和资源 scope。

### 3.4 本地浏览器研究与协议教学

该仓库适合学习：

- Electron Renderer/Main 权限边界；
- Chromium Profile 文件和进程生命周期；
- CDP HTTP discovery、WebSocket request/response/event 模型；
- Target 自动附加和 Session 路由；
- DSL 解释、任务记录、结果存储和容量治理；
- MCP 工具注册、stdio JSON-RPC 和 HTTP adapter。

## 4. 不合理或高风险使用

以下目标不是本研究推荐的用途：

- 伪造多个独立真人身份；
- 绕过封号、设备限制、实名或账号关联规则；
- 未经授权批量注册、登录、抓取或互动；
- 操作他人凭据、Cookie、2FA Secret 或私有 Profile；
- 把 Local API 暴露到公网；
- 将 `admin/manage` MCP 权限直接交给不可信模型；
- 未核查第三方内核条款就进行商业打包或分发。

## 5. 选型建议

优先选择更简单工具：

| 需求 | 更合适的首选 |
| --- | --- |
| 普通个人多账号切换 | Chrome/Edge 原生多用户 |
| 标准 Web E2E | Playwright |
| 临时无状态并发 | Playwright BrowserContext |
| HTTP 数据采集 | 合规 API 或 HTTP 客户端 |
| 云端浏览器集群 | 专门的 Browser-as-a-Service/调度平台 |
| 长期可视 Profile + 本地代理/同步/RPA/MCP | OpenBrowser 类架构才有明显价值 |

判断原则是：如果原生 Profile 或 Playwright 已能解决，就不应为了“更像真人”而引入指纹浏览器；只有当长期环境、桌面人工参与和本地控制面确实是核心需求时，这类架构才合理。
