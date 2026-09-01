# AI、云服务与数据边界

## AI 并非单一能力

仓库里“AI”至少分成四类，数据边界和替换方式不同：

| 类别 | 用途 | 可选实现 |
| --- | --- | --- |
| LLM | 翻译、查词、分析、润色、补标点、角色聊天 | EnjoyAI、OpenAI-compatible、Ollama |
| STT | 音视频转写 | 本地 Whisper、OpenAI、Cloudflare AI、Azure |
| TTS | 文本生成语音 | OpenAI-compatible、Azure Speech |
| Pronunciation Assessment | 参考文本下的发音评分 | Azure Speech |

把这四类服务分开非常重要：即使使用本地 LLM，对云端发音评测的依赖也不会自动消失；反之，使用本地 Whisper 也不意味着聊天和 TTS 已离线。

## LLM 调用方式

通用命令位于 `enjoy/src/commands/`：

- `translate.command.ts`
- `lookup.command.ts`
- `analyze.command.ts`
- `refine.command.ts`
- `punctuate.command.ts`
- `extract-story.command.ts`
- `chat-suggestion.command.ts`

[`text.command.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/commands/text.command.ts) 和 `json.command.ts` 使用 LangChain `ChatOpenAI`，通过 `key + modelName + baseURL` 调用 OpenAI-compatible 接口。因此大多数“智能能力”本质是：

```text
业务上下文
   ↓
任务 Prompt 模板
   ↓
OpenAI-compatible Chat Model
   ↓
文本或 JSON 结果
   ↓
缓存 / SQLite / Enjoy API
```

角色对话额外支持 [`ChatOllama`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-conversation.tsx)。客户端会探测 `http://localhost:11434/api/tags` 获取本地模型列表。

需要注意：通用翻译、查词等 `useAiCommand` 默认仍围绕 `currentGptEngine` 的 OpenAI-compatible 调用设计；“角色对话支持 Ollama”不应直接扩大成“所有 AI 功能都已完整支持 Ollama”。

## TTS

[`use-speech.tsx`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-speech.tsx) 有两条路径：

### OpenAI-compatible

- EnjoyAI：使用登录 access token 调 `${apiUrl}/api/ai`；
- 自带服务：使用用户配置的 API Key 和 base URL；
- 返回音频 ArrayBuffer，Main Process 保存为 Speech 文件和数据库记录。

### Azure

- 先向 Enjoy API 申请短期 Speech token；
- 客户端直接调用 Azure Speech SDK；
- 成功后通知 Enjoy API 消耗 token，失败则撤销。

生成结果不是聊天窗口中的临时附件，而是可进入资源库、继续分句和跟读的正式学习资产。

## 云端依赖矩阵

| 功能 | 仅靠公开仓库可实现 | 默认是否依赖 Enjoy 后端 | 可替代方向 |
| --- | --- | --- | --- |
| 本地媒体管理 | 是 | 否 | 保持本地文件 + SQLite |
| 本地 Whisper STT | 大体是 | 模型镜像/初始化可能联网 | 自托管模型包 |
| Ollama 角色对话 | 是 | 否 | 本地 Ollama |
| 自带 OpenAI-compatible LLM/TTS/STT | 是 | 否 | 任意兼容服务，但需验证各 API 子集 |
| Azure STT/TTS/评测 | 客户端存在 | 是，token 由 Enjoy API 发放 | 自行接 Azure 凭证与计费层 |
| EnjoyAI | 否 | 是 | 自建 AI Gateway |
| 登录、余额、配置 | 否 | 是 | 自建账户和配置服务 |
| 社区 SSO、课程和部分同步 | 否 | 是 | 重新实现业务后端 |
| storage.enjoy.bot 上传 | 否 | 是 | 本地对象存储或 S3-compatible 服务 |

“可实现”只表示代码路径和公开依赖足够，不代表当前已经完成运行验证。

## 数据流向

### 保留本地

- 导入的媒体文件；
- 用户录音；
- SQLite 数据库；
- 波形、临时转码和 Whisper 模型；
- Ollama 对话内容在只使用本地 Ollama 时可不离机。

### 可能发送到外部服务

- 云端 STT：音频；
- TTS：待合成文本；
- 发音评测：录音和 reference text；
- LLM：原文、上下文、角色定义和历史消息；
- 查词、翻译缓存或社区功能：相关文本、用户和资源标识；
- 媒体同步：媒体文件和元数据。

因此产品设置应该把“服务名称、是否上传、上传什么、费用、保留策略”作为一组信息呈现，而不是只显示模型下拉框。

## 安全研究观察

以下是静态源码层面的研究判断，尚未完成专门渗透测试：

1. **Renderer 中的 API Key。** OpenAI SDK 使用 `dangerouslyAllowBrowser: true`，意味着自带 Key 会进入渲染进程。Electron 虽有 context isolation，但任意 Renderer 注入仍值得严肃对待。
2. **较大的 Preload API 面。** 文件、下载、Shell、数据库和媒体能力均通过 IPC 暴露，所有 Main handler 都应做参数、来源和路径校验。
3. **高权限自定义协议。** `enjoy://` 配置包含 CSP/CORS 相关高权限，需验证能否访问资料库之外的路径。
4. **WebSocket token 位于查询参数。** ActionCable 连接使用 `?token=...`，需要确认代理、日志和错误上报不会记录完整 URL。
5. **日志与遥测。** 本地日志、Bugsnag 和云端错误信息可能包含文件路径或服务错误细节，应检查脱敏策略。

## 自部署建议

如果目标是做一个可控的自托管版本，不建议先复刻全部 Enjoy 后端。更小的可行切面是：

```text
Electron/本地 Web UI
  + SQLite / 本地媒体
  + 本地 Whisper
  + Ollama 或自有 OpenAI-compatible Gateway
  + 本地 TTS 或单一云 TTS
  - 登录/余额/社区/云同步
```

先闭合“导入 → 转写 → 对齐 → 跟读 → 录音”即可验证核心价值。账户、社区、计费和多设备同步属于另一套产品问题，不应成为第一阶段前置条件。

## 许可证边界

根 `LICENSE` 是 GPL-3.0，但 `enjoy/package.json` 的 `license` 字段写为 MIT。仓库没有在子包中提供独立 MIT 正文来明确分界。

因此：

- 研究、阅读和内部实验可以继续；
- 复制代码、发布修改版或商业再分发前，应向维护者确认 `enjoy/` 的确切许可证；
- 不能仅凭 npm package metadata 就忽略根许可证；
- 第三方模型、词典和媒体素材还需要分别核对许可证。
