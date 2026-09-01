# Everyone Can Use English / Enjoy 研究

> **把任意内容加工成英语训练材料的工作台，而不是完整的英语教学体系。**

这是本子项目的主要摘要。研究重点不是罗列英语学习功能，而是解释内容获取、媒体与语言处理、Timeline / Segment 学习中间层、训练动作、AI 智能节点和信息存储如何组成一条可落地的产品闭环。

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 上游仓库 | [`ZuodaoTech/everyone-can-use-english`](https://github.com/ZuodaoTech/everyone-can-use-english) |
| 研究基线 | [`3d799132046993eade5a364ddd1e557906854eda`](https://github.com/ZuodaoTech/everyone-can-use-english/tree/3d799132046993eade5a364ddd1e557906854eda)（`main`，2026-06-29） |
| 产品基线 | 公开 Electron 客户端 `0.7.9`；仓库 README 同时指向新版 Web 和 Chrome 扩展 |
| 上游许可证 | 根目录为 [GPL-3.0](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/LICENSE)；`enjoy/package.json` 声明 `MIT`，再分发前需要上游澄清适用范围 |
| 研究状态 | `studying`；已完成固定提交的静态源码审查，尚未安装完整依赖或运行桌面端 |
| 本地源码 | `sources/zuodaotech-everyone-can-use-english/`，稀疏克隆且不提交进总库 |
| 在线能力图谱 | [GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/) |
| 首次研究 | `2026-09-01`（Asia/Shanghai） |
| 标签 | `language-learning`、`Electron`、`React`、`STT`、`TTS`、`Whisper`、`DTW`、`local-first`、`LLM` |

## 网页版能力图谱

本研究已经整理为独立静态网页，位于 `apps/everyone-can-use-english-capability-lab/`，并通过仓库统一的 [GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/) 发布。它首先用一张全景图串联内容获取、智能处理、学习中间层、学习驱动与信息存储，再提供能力分类筛选、六步实现链路、运行边界、使用场景、扩展路线、参考价值与固定源码证据索引。

[![Everyone Can Use English 完整能力全景图](evidence/web/capability-panorama.png)](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/#positioning)

验证记录见[技术研究网页验证](notes/web-validation.md)，启动与维护方式见[网页交接](notes/web-handoff.md)。

## 证据标记

- **[官方声明]**：来自固定提交中的 README、产品文档或界面说明。
- **[源码审查]**：由固定提交中的代码、依赖、配置或数据模型直接确认。
- **[研究判断]**：基于源码作出的价值、边界或风险判断，不代表上游承诺。
- **[待运行验证]**：代码路径存在，但本研究尚未在实际安装包或开发环境中复现。

## 先给结论

**它最值得研究的不是某个 AI 模型，而是“把内容变成练习”的流水线。**

一段普通音频进入 Enjoy 后，会被转码、识别、对齐为句子时间轴，再变成可循环播放、逐句录音、音高对比和发音评测的训练单元。文章和 AI 回复也会通过 TTS 进入同一条训练链路。这样，内容来源可以变化，但训练交互和数据结构保持稳定。

另外需要明确三条产品边界：

1. **仓库不是单一应用。** 根 workspace 包含 `enjoy` Electron 客户端、`1000-hours` VitePress 文档站和 `1000h-portal` Nuxt 门户，另有书稿与入口路由代码。
2. **公开实现主要对应旧桌面端。** 当前 README 说明新版 Web 已上线、Chrome 扩展支持 YouTube/Netflix，而新版桌面端将成为 Web 套壳和增强；新版 Web、扩展和 Enjoy 云端后端的完整源码不在这个仓库中。
3. **本地优先不等于完全离线。** 媒体、录音、SQLite、波形和 Whisper 模型主要在本地，但登录、EnjoyAI、Azure 令牌、社区、部分同步与云存储仍依赖 `enjoy.bot`。

## 能力是什么

| 能力 | 用户侧表现 | 关键实现 |
| --- | --- | --- |
| 音视频跟读 | 本地或在线音视频、YouTube；逐句播放、循环、短语选择 | FFmpeg/EchoGarden 转码，STT 生成文字，DTW 生成句子/单词时间轴 |
| 录音反馈 | 按句录音、原音与录音同步播放、Pitch contour 对比 | 录音文件和元数据本地保存，播放器按 Segment 时间轴组织训练 |
| 发音评估 | 音素、准确度、完整度、流利度、韵律等评分 | Azure Pronunciation Assessment，以当前句子文本为 reference |
| 阅读训练 | EPUB、TXT、Markdown、网页文章；翻译、朗读、跟读 | 文档导入/抓取，按段调用翻译和 TTS，再复用媒体训练链路 |
| AI 助教 | 角色对话、翻译、润色、查词、分析、补标点、表达建议 | LangChain `ChatOpenAI` / `ChatOllama` 与任务 Prompt 模板 |
| 语音生成 | 把 AI 回复或任意文本生成语音并加入资源库 | OpenAI-compatible TTS 或 Azure TTS，结果保存为 Speech/Audio |
| 本地知识资产 | MDX 词典、生词、笔记、录音统计、对话与文档 | SQLite + Sequelize 模型，本地媒体目录和缓存目录 |
| 云端与社区 | 登录、配置、课程/社区、令牌、上传与实时消息 | `enjoy.bot` REST API、ActionCable WebSocket、云存储端点 |

官方功能描述可从[音频训练](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/1000-hours/enjoy-app/audios.md)、[电子书阅读](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/1000-hours/enjoy-app/document-ebook.md)和[利用 AI 生成训练材料](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/1000-hours/enjoy-app/use-case-generate-audio-resources.md)交叉核对。

## 核心原理

```text
本地文件 / URL / YouTube / 文档 / AI 回复
                    ↓
              音频或 TTS 语音
                    ↓
          16 kHz WAV + STT 转写
                    ↓
       DTW 音频—文本对齐 + 句子时间轴
                    ↓
        单句播放 / 循环 / 选词 / 跟读
                    ↓
        录音 + 音高对比 + Azure 评分
                    ↓
               继续重复训练
```

这个设计把“获取内容”和“训练交互”解耦：新增一个内容来源或 AI 模型，不需要重做跟读、录音和统计系统；只要能产出音频、文本和时间轴，就能进入统一训练循环。

详细拆解见[音视频与跟读流水线](notes/audio-training-pipeline.md)。

## 架构速览

```text
React Renderer
  ├─ 页面、Context、Hooks、Reducer
  └─ window.__ENJOY_APP__
                 ↓ contextBridge / IPC
Electron Main Process
  ├─ SQLite / Sequelize / Umzug
  ├─ 文件、词典、下载器和自定义 enjoy:// 协议
  ├─ FFmpeg / EchoGarden / Whisper / 波形缓存
  └─ BrowserWindow、更新器和系统能力
                 ↓
外部服务
  ├─ enjoy.bot REST + ActionCable
  ├─ OpenAI-compatible API / Ollama
  ├─ Azure Speech
  └─ Cloudflare AI / storage.enjoy.bot
```

Renderer 不直接操作 Node 文件系统，而是通过 [`preload.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/preload.ts) 暴露的受控接口调用 Main Process。数据库写入后，主进程发送事务事件，Renderer 中的 Context/Hook 再增量更新界面。

完整分层、数据流和持久化方式见[架构与数据流](notes/architecture.md)。

## AI 在系统中的真实角色

**[源码审查]** 这里的 AI 能力主要是模型编排，不是仓库训练出的自研模型：

- 翻译、查词、润色、分析、补标点等能力是不同 Prompt 模板；
- 通用文本命令使用 LangChain `ChatOpenAI`，支持可配置 `baseURL`；
- 角色对话可使用 EnjoyAI、自带 OpenAI-compatible 服务或本地 Ollama；
- TTS 使用 OpenAI-compatible Speech API 或 Azure Speech；
- STT 可使用本地 Whisper、OpenAI Whisper、Cloudflare AI 或 Azure Speech；
- 生成的语音最终仍回到同一套本地训练数据模型。

实现和隐私/自部署边界见[AI、云服务与数据边界](notes/ai-cloud-boundaries.md)。

## 优点与局限

### 优点

- **训练闭环完整。** 从素材、转写、对齐、播放到录音反馈，关键环节在一个产品内闭合。
- **内容来源开放。** 用户自己的音视频、网页和表达都能成为训练材料，减少对固定课程的依赖。
- **时间轴是稳定中间层。** STT 提供商可以更换，播放器仍消费统一的 Segment/Timeline 数据。
- **本地优先。** 大体积媒体、录音和数据库不必默认全部进入云端。
- **桌面端边界清晰。** Renderer、Preload、Main Process 和本地持久化的职责较容易追踪。

### 局限

- **仓库不能还原当前完整 SaaS。** 新版 Web、浏览器扩展和服务端实现缺失。
- **桌面公开版本较旧。** `enjoy/package.json` 仍为 `0.7.9`，README 已把产品主线指向 Web。
- **语音功能依赖复杂。** 本地模型、原生依赖、FFmpeg、平台差异和云端额度都会影响可用性。
- **自动评分不是人工反馈。** Azure 评测更适合判断参考文本下的词和音素，不应当成完整口音或自然度裁判。
- **同步并非纯本地问题。** 本地数据库和媒体文件的多设备并发、冲突与备份需要额外设计。
- **许可证元数据不一致。** 根 GPL-3.0 与子包 `MIT` 声明需要在复用前澄清。

## 对我们的可复用结论

1. **先定义训练中间表示，再接模型。** `Audio/Video + Transcription + Segment + Recording + Assessment` 比绑定某个 STT 或 LLM 更耐用。
2. **将粗转写和精对齐分开。** STT 负责“说了什么”，DTW/forced alignment 负责“每个词何时发生”，两者职责不同。
3. **AI 输出应该进入业务闭环。** AI 生成文本之后立即 TTS 并成为训练素材，比孤立的聊天框更有产品价值。
4. **本地优先需要显式云边界。** 每个 STT/TTS/LLM 选项都应说明数据是否离机、费用和失败回退。
5. **评测反馈要分层。** 可视化音高用于自我观察，云端音素评分用于参考；不要把单一分数包装成绝对发音质量。

## 下一阶段研究

下一轮应以运行验证为主，计划和验收标准见[验证计划](notes/validation-plan.md)。优先级为：

1. 在 Windows 上安装依赖并验证 Electron 开发模式能启动；
2. 用短音频验证本地 Whisper → DTW → Segment → 单句循环；
3. 验证录音创建、文件落盘和数据库事务事件；
4. 在不发送敏感数据的前提下分别测试 Ollama、本地 STT 与一个云端 STT；
5. 对 Web 新版和 Chrome 扩展另建研究基线，避免继续用旧桌面源码推断当前产品。

## 研究导航

- [架构与数据流](notes/architecture.md)
- [音视频与跟读流水线](notes/audio-training-pipeline.md)
- [AI、云服务与数据边界](notes/ai-cloud-boundaries.md)
- [运行与验证计划](notes/validation-plan.md)
- [网页设计与交付契约](notes/web-delivery-contract.md)
- [技术研究网页验证](notes/web-validation.md)
- [网页交接](notes/web-handoff.md)

## 主要一手来源

- [仓库 README](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/README.md)
- [根 workspace 配置](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/package.json)
- [Enjoy 依赖与版本](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/package.json)
- [Electron 主进程入口](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main.ts)
- [Preload IPC 桥](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/preload.ts)
- [STT 与对齐编排](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-transcribe.tsx)
- [发音评估](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-pronunciation-assessments.tsx)
- [SQLite 数据库入口](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main/db/index.ts)

## 变更记录

- `2026-09-01`：创建研究子项目，固定上游提交，完成能力、架构、语音流水线、AI/云边界和验证计划的第一轮静态研究。
- `2026-09-01`：完成技术能力研究网页，覆盖能力范围、实现原理、场景、扩展和参考价值，并通过三视口、双主题、键盘与 reduced-motion 验证。
- `2026-09-01`：以提交 [`e4cb4d8`](https://github.com/yydshly/0831_codex_project/commit/e4cb4d866bef045c82ba615c20e03bc068491e05) 接入仓库 Pages 工作流与三级索引；[`Run 33459561107`](https://github.com/yydshly/0831_codex_project/actions/runs/33459561107) 发布成功，线上 HTML、JS、CSS、桌面与手机交互复验通过。
