# 关键技术与参考实现建议

本文抽取 OpenBrowser 中可迁移到合规浏览器测试、桌面自动化和 Agent 执行器的工程方法，同时区分“值得学习的模式”和“需要加强的实现”。

## 1. 用确定性种子构造可重复环境

[`fingerprint.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/fingerprint.js) 从 Profile ID 派生 SHA-256 种子，再生成静态配置。其核心思想不是追求每次随机，而是保证：

```text
same profile + same generator version + same overrides
  → same test persona
```

这对回归测试非常有用。若 CPU、内存、屏幕和 UA 每次启动都变化，失败可能来自环境漂移而不是业务代码。

可将配置拆成：

- `staticConfig`：设备、OS、UA、Client Hints、屏幕、CPU、内存、Canvas/WebGL/Audio 种子；
- `dynamicConfig`：代理出口、时区、地理位置、WebRTC 可见地址；
- `explicitOverrides`：测试用例强制指定的值；
- `generatorVersion`：生成规则版本，用于解释旧 Profile。

推荐通过设备 persona 数据集生成互相协调的一组字段，而不是每个维度独立抽样。Windows UA 配 macOS platform、低端 CPU 配极高分辨率 GPU 等跨字段矛盾，比单个字段是否随机更值得关注。

## 2. Profile 隔离是资源所有权协议

Profile 的正确抽象不是“一堆文件”，而是一项只能被一个浏览器实例持有的资源：

```text
validate path
  → atomic acquire lock
  → launch child
  → record owner PID + browser PID + token
  → operate
  → terminate process tree
  → release lock
```

OpenBrowser 值得参考的点包括：安全 Profile ID、系统目录拒绝、符号链接检查、`wx` 原子锁、双 PID、旧锁恢复前的进程扫描以及 `starting/running/stopping` 生命周期屏障。

进一步改进时，锁记录应包含进程启动时间或 OS process identity，而不只 PID，避免 PID 重用；释放锁应比较随机 ownership token，防止旧进程删除新持有者的锁。

## 3. 控制面与执行面分离

项目用同一 BrowserEngine 支撑 UI、Local API、MCP、RPA 和窗口同步。这比每个入口各自启动浏览器、拼接参数和连接 CDP 更容易保持一致。

参考分层：

```text
Adapters
  ├─ Electron IPC
  ├─ REST/Local API
  └─ MCP
Application Services
  ├─ ProfileService
  ├─ AutomationService
  └─ SyncService
Execution
  ├─ BrowserProcessManager
  ├─ CdpGateway
  └─ NativeInputAdapter
Persistence / Secrets / Artifacts
```

OpenBrowser 当前 Local API 直接持有多个具体模块，已经形成 composition root，但 `engine.js` 仍承担 Profile schema、内核发现、进程启动、代理、指纹、Cookie 和持久化等多项职责。若要扩展，可优先按上图拆出显式接口。

## 4. 一次性 RPC 与事件连接分开

轻量 CDP 客户端展示了通用选择：

- 少量查询用一次性连接，减少长期资源管理；
- 自动化和 Target 生命周期用持久连接，集中管理 pending、事件和断线；
- 所有请求必须有超时；
- 断线必须 reject 全部 pending；
- Session/Target 是连接层的路由概念，不让业务层手工拼消息。

同样的模式可复用于 WebSocket RPC、设备调试桥和本地守护进程协议。

## 5. 在文档执行前注入环境

新页面脚本可以在极早阶段读取环境。OpenBrowser 用 Browser Target 自动附加新 Target，并在 `waitForDebuggerOnStart` 暂停期间应用配置，再恢复执行。

这是一种通用“初始化屏障”：

```text
resource created
  → hold
  → apply invariant/configuration
  → mark ready
  → release user code
```

它也适用于 worker sandbox、数据库 session、容器启动和插件宿主。关键是失败时不能静默放行，否则同一 Profile 会出现部分 Target 已配置、部分未配置的混合状态。

## 6. 串行持久化和原子替换

BrowserEngine 与 RpaStore 都使用 Promise 写队列，避免多个并发更新同时覆盖同一 JSON；写入时采用临时文件后重命名，减少崩溃留下半截 JSON 的概率。

```text
state mutation
  → enqueue save
  → serialize JSON
  → write state.tmp
  → rename state.tmp → state.json
```

这是小型桌面应用的实用模式，但需要明确边界：

- 只解决单进程内写入排序，不解决两个进程并发；
- rename 的原子性和覆盖语义依赖文件系统；
- 目录数据和状态 JSON 不是同一事务；
- JSON 越大，写放大和恢复时间越明显；
- 密钥不应因方便而与普通配置同库存储。

当任务、日志和 artifact 增长时，应迁移到 SQLite/数据库和对象文件，保留原子更新、版本与校验和。

## 7. 资源预算与降级顺序

RpaStore 设置历史数量和文件大小上限，并先删除最旧终态 Task，再裁剪日志和结果，尽量保留活动任务与计划。这体现了一个好原则：在资源紧张时，系统需要预先定义“什么最重要”。

生产设计还应：

- 不在主状态记录中嵌入截图、大 HTML 或大列表；
- artifact 使用内容哈希、大小、MIME、保留期和 owner task；
- 明确日志裁剪是否影响审计要求；
- 在达到硬上限前发出可观测告警；
- 活动任务也要有单任务输出预算，避免单个任务耗尽磁盘。

## 8. RPA DSL 的单一契约来源

动作 DSL、MCP schema、Local API DTO 和执行器若分别手写，必然产生漂移。推荐维护一份机器可读定义：

```ts
type ActionDefinition = {
  name: string;
  aliases: string[];
  version: number;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  permission: string;
  sideEffect: 'read' | 'reversible' | 'irreversible';
  supportsAbort: boolean;
  defaultTimeoutMs: number;
};
```

由它生成模板校验、MCP 工具描述、API 校验、文档和测试 fixture。计划保存时固定 DSL 版本；执行旧计划时先迁移，不依赖执行器长期保留无限别名。

## 9. 状态机必须拥有转移权

Task 状态不应由任意调用点直接 `updateTask({status})`。参考接口：

```text
transition(taskId, expectedState, event, patch)
  → validate transition
  → compare version
  → write event + new state atomically
```

这样才能防止取消与成功竞态、两个 worker 同时完成、重试覆盖旧结果。取消使用 AbortSignal 传播，但最终状态仍要通过原子转移裁决。

事件日志还可以重建“为什么失败、谁取消、是否已产生副作用”，比只保留最终字符串更适合 Agent 自动化。

## 10. MCP 是协议适配器，不是安全边界

MCP 的最佳职责是：用模型友好的名称/schema 表达应用能力，转换协议并返回结构化结果。认证、授权、密钥、审计和资源约束应在应用服务端重新检查。

可复用原则：

- 默认最小权限，非法配置 fail-closed；
- 工具列表隐藏和调用时拒绝都要有；
- 工具名之外还要验证资源 ID、域名、文件路径和参数；
- 明文 secret 永不作为 read 结果返回；
- 破坏性调用支持 dry-run/preview/approval；
- 调用结果区分 accepted、running、succeeded、failed；
- 模型可见错误应稳定、简洁，不泄露路径、密钥和堆栈。

## 11. Secret 与普通配置分离

Profile 当前可同时包含账号密码、TOTP、Cookie 和认证代理。这让保存、复制、导入导出、备份和 MCP 读取都必须反复记住哪些字段敏感，容易遗漏。

推荐使用引用模型：

```json
{
  "proxy_ref": "secret://proxy/42",
  "credential_ref": "secret://account/7",
  "cookie_jar_ref": "secret://browser-session/profile-a"
}
```

执行器按任务 scope 向 Secret Broker 申请“使用”而非“读取”；UI 只显示是否已配置。Profile duplicate 默认生成新引用或不带引用，只有显式的受审操作才共享会话。

## 12. 行为契约比文档声明更可靠

“复制环境不带 Cookie/凭据”属于安全性质，应该以测试证明。当前固定提交的实现与工具描述不一致，正说明文档不能成为唯一防线。

推荐每个安全承诺都有负向契约测试：

- duplicate 后哪些字段必须为空；
- `read` token 无法读取代理密码；
- 删除只能作用于允许的 Profile；
- cancel 被确认后不可能再进入 success；
- 超时重试不会重复不可逆动作；
- 日志和 MCP 结果不包含 fixture secret canary。

本研究把其中两个契约写成可执行实验，见 [`experiments/`](../experiments/)。

## 13. 建议的学习/重构顺序

1. 先阅读 Profile schema、数据根和锁，理解执行资源的所有权。
2. 再阅读启动序列和 CDP Target 自动附加，理解环境如何建立。
3. 接着阅读 RPA 动作解释器和 Store，画出真实状态转移与副作用。
4. 最后阅读 Local API/MCP，检查每项能力如何暴露、鉴权和返回错误。
5. 用行为实验验证关键假设，再决定抽取、重构或复用哪些部分。

如果目标是合规 QA 平台，建议优先保留 Profile 隔离、CDP 抽象、任务状态和控制面思想；去掉针对规避检测的产品叙事，增加域名/文件策略、Secret Broker、严格状态机与审计。
