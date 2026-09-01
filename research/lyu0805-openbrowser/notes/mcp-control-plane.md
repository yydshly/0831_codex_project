# MCP 控制面

## 1. MCP 的真正角色

OpenBrowser 的 MCP 进程不是浏览器驱动，也不直接建立 CDP 连接。它是协议适配层：

```text
AI Client / MCP Host
  → stdin/stdout JSON-RPC 2.0
  → mcp-server.js
      - tools/list
      - tools/call
      - 能力等级与黑白名单
      - MCP 参数 → Local API DTO
  → HTTP 127.0.0.1:50325 + API Key
  → local-api-server.js
  → BrowserEngine / RPA / Proxy / Sync
```

这种结构的意义是：Electron UI、本地脚本和 AI 可以复用同一业务控制入口，MCP 层只关注“怎样让模型发现并调用工具”。

## 2. 传输和协议实现

[`mcp-server.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/mcp-server.js) 是手写的 stdio 服务：逐行读取 JSON-RPC 2.0 消息，处理 `initialize`、`tools/list` 和 `tools/call`，声明 MCP protocol version `2024-11-05`。

stdio 模式适合本地桌面集成：不需要额外监听端口，MCP Host 是父进程，也便于把 API Key 放入子进程环境变量。需要特别注意：stdout 必须只输出协议消息，调试日志应写 stderr，否则一行普通日志就可能破坏 JSON-RPC 帧。

当前实现专注 tools，没有实现 resources、prompts 或远程 MCP 认证。这与它“本机适配器”的定位一致。

控制面自测还揭示一个小但典型的端口问题：`LocalApiServer` 用 `Number(options.port) || 50325` 取默认值，因此测试传入 `0` 并不能请求操作系统分配临时端口，而会固定到 `50325`。在 Windows excluded port range 或已有实例占用该端口时，自测会启动失败。更稳妥的写法应只在 `port` 为 `undefined/null/非法值` 时使用默认端口，并保留合法的 `0`。

## 3. 工具面

固定提交实际注册 50 个工具。按最小能力等级统计：

| 等级 | 数量 | 代表能力 |
| --- | ---: | --- |
| `read` | 18 | 应用状态、Profile、代理、扩展、计划、任务、模板、窗口同步状态 |
| `run` | 13 | 启停环境、运行/停止 RPA、窗口排列与同步、出口检测 |
| `manage` | 18 | 创建更新删除 Profile、计划、代理、扩展、模板、导入导出 |
| `admin` | 1 | 高权限维护能力 |

等级是累积的：`manage` 可看见 `read/run/manage`，`admin` 可见全部。`tools/list` 与 `tools/call` 都再次执行过滤，能防止客户端绕过列表直接猜工具名。

精确工具清单和实现入口见[源码地图](source-map.md)。

## 4. 能力过滤不等于后端授权

MCP 支持 `read/run/manage/admin`、黑名单和白名单，但这些检查只存在于该 MCP 子进程。Local API 只有一枚全权限 Key；得到 Key 的本机进程可以绕过 MCP，直接调用任意 Local API 路由。

因此它更准确的描述是“对一个 AI 会话暴露哪些工具”，而不是服务端 RBAC：

| 控制 | 当前作用 | 不能保证 |
| --- | --- | --- |
| MCP mode | 隐藏高等级工具并拒绝调用 | Key 持有者不能直接访问 API |
| whitelist | 只暴露列出的工具 | 工具内部只能操作指定 Profile/域名 |
| blacklist | 排除指定工具 | 黑名单解析失败时安全关闭 |
| API Key | 识别本地 API 调用者 | 区分用户、Agent、Profile 和动作 scope |

默认 mode 是 `admin`；非法 mode 会回退到 `admin`。黑白名单 JSON 解析失败时会回退为空列表，其中 whitelist 空值等价于不限制。这些默认值对“开箱即用”友好，但对最小权限是 fail-open。

## 5. Local API 的基础防护

[`local-api-server.js`](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/local-api-server.js) 提供了一些有价值的本地服务防护：

- 默认只绑定 `127.0.0.1`；
- 首次生成高熵 base64url API Key；
- Key 文件以原子方式写入，并尝试使用 `0600` 权限；
- 支持专用 header/Bearer，比较时使用 `timingSafeEqual`；
- 请求体上限约 1MiB；
- 返回 `Cache-Control: no-store` 和 `X-Content-Type-Options: nosniff`；
- 浏览器 Origin 使用显式 CORS allowlist，默认不接受任意网页来源。

无 Origin 的 curl/Node 请求仍被允许，这是本地工具运行所需，但也意味着同一操作系统账号下的进程属于信任边界。

API Key 还可通过 query string 传递；该方式容易进入日志、历史和错误报告，不宜继续使用。部分变更路由没有严格限制 HTTP method，也增加了误调用和 CSRF 类推理的复杂度。

## 6. 输入 schema 的真实边界

MCP 工具的 `inputSchema` 主要用于告诉模型和客户端参数形态；实现没有统一使用 Ajv 等运行时校验器。随后，手写 `switch` 把参数转换为 HTTP method、path 和 body。

这会形成三份可能漂移的事实：

```text
MCP inputSchema
  ≠ MCP dispatcher mapping
  ≠ Local API route validation
```

工具注册表虽然保存 method/path 元数据，但 dispatcher 并没有完全以元数据驱动。生产实现应让同一份契约生成三者，并对每个工具做正例、缺字段、错类型、越权资源和下游错误的端到端测试。

## 7. 错误语义

至少要区分四层失败：

1. JSON-RPC/MCP 协议错误；
2. 工具不存在或权限拒绝；
3. HTTP/鉴权/Local API 路由失败；
4. RPA 业务执行失败。

当前 RPA 路由可能把任务失败包装成 HTTP 成功和外层 `code=0`，MCP 因而返回 `isError: false`，实际失败位于内层 `data.success`。这会使模型把“工具成功返回”误读成“业务成功完成”。工具结果应有稳定的 discriminated union，例如：

```json
{
  "ok": false,
  "error": {
    "kind": "task_failed",
    "retryable": false,
    "message": "...",
    "task_id": "..."
  }
}
```

对于异步任务，提交成功和任务最终成功必须是两个不同事件。

## 8. 敏感数据与最小权限

当前 `read` 不等于无害读取：代理记录可能包含用户名/密码，Task 结果和日志可能包含页面数据、Cookie 或账号信息，本地路径与调试端口也可能辅助进一步访问。`run` 级 RPA 又能调用页面 JavaScript、Cookie 和文件类动作。

建议把能力从四个粗等级细分为 scope：

```text
profiles:read-metadata
profiles:start
profiles:delete
rpa:read-plan
rpa:run-safe
rpa:run-script
secrets:use-proxy-ref
secrets:read-never
files:upload-from:/approved/root
navigation:domains:[internal.example]
```

返回值还需要字段级投影：代理列表默认只返回 ID、名称、协议和脱敏 host；密码、Cookie、TOTP 不应存在“读取” scope，只允许执行器按引用使用。

## 9. 推荐部署方式

### 只读研究或诊断

- mode 使用 `read`；
- whitelist 只保留必要状态工具；
- Local API Key 不提供给其他进程；
- 输出做脱敏和大小限制。

### 受控执行

- 使用 `run` 加精确 whitelist；
- 限定 Profile IDs、域名和文件根；
- 页面脚本、Cookie、上传下载默认禁用；
- 每个 Task 有预算、超时和人工可见日志。

### 管理操作

- `manage/admin` 不长期交给模型；
- 删除、导入、安装模板和扩展需要一次性批准；
- 使用短期 token，完成后撤销；
- 所有写操作进入不可篡改审计日志。

## 10. 面向生产的控制面拆分

```text
MCP Adapter
  → Auth Gateway（短期 token、client identity）
  → Policy Engine（tool + resource + argument scopes）
  → Application Service（统一 DTO 与业务错误）
  → Job Queue（幂等、租约、取消、状态）
  → Browser Worker（Profile/CDP）
  → Secret Broker（只下发使用权，不返回明文）
  → Audit Sink（调用者、参数摘要、结果、副作用）
```

MCP 适合做模型友好的“入口”，但授权、密钥、任务状态和审计都应属于入口之后的服务端能力。这样即使未来换成 REST、CLI 或另一个 Agent 协议，安全边界也不会随适配器一起消失。

## 11. 技术人员可复用的重点

1. MCP 作为薄适配层，共用 Local API，而不是复制一套浏览器业务逻辑。
2. `tools/list` 和 `tools/call` 双重过滤，防止仅靠隐藏工具名实现权限。
3. stdio 协议输出与日志通道严格分离。
4. 输入 schema、路由和下游 DTO 应单一来源生成。
5. MCP 工具结果要区分传输成功、受理成功和业务完成。
6. 工具级权限必须下沉为资源级、参数级和敏感字段级授权。
