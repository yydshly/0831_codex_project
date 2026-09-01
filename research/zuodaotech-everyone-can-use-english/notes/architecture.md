# 架构与数据流

## 研究范围

本文基于上游提交 [`3d799132`](https://github.com/ZuodaoTech/everyone-can-use-english/tree/3d799132046993eade5a364ddd1e557906854eda) 的静态源码审查。重点是公开 Electron 客户端 `enjoy/`；新版 Web 和服务端实现不在仓库中，因此不推断其内部技术栈。

## Monorepo 结构

根 [`package.json`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/package.json) 定义三个 Yarn 4 workspace，并要求 Node `>=20`：

```text
everyone-can-use-english/
├─ enjoy/          Electron 0.7.9 桌面客户端
├─ 1000-hours/     VitePress 训练方法与产品文档
├─ 1000h-portal/   Nuxt 门户
├─ entry/          文档/门户入口转发，不是 Enjoy 业务后端
├─ book/           《人人都能用英语》书稿
└─ README.md       当前产品入口与版本分线说明
```

`entry/` 中的 Cloudflare Worker 只负责在门户和文档站之间转发请求，不能据此认为 Enjoy 后端已经开源。

## Electron 分层

### Main Process

[`enjoy/src/main.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main.ts) 负责：

- 初始化 Electron 与主窗口；
- 注册 `enjoy://` 自定义协议；
- 把 `enjoy://library/...` 映射到本地资料库、用户媒体或缓存；
- 初始化错误上报和应用生命周期；
- 退出时清理临时缓存。

[`enjoy/src/main/window.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main/window.ts) 是主要系统服务装配点，注册数据库、设置、词典、EchoGarden、波形、下载器、解压、FFmpeg、Audible、TED、YouTube 和系统窗口相关的 IPC handler。

### Preload Bridge

[`enjoy/src/preload.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/preload.ts) 通过 `contextBridge.exposeInMainWorld` 暴露 `window.__ENJOY_APP__`。

公开给 Renderer 的接口包括：

- App、窗口、权限、代理、Shell 和文件选择；
- 数据库连接和事务事件；
- 音频、视频、录音、文档、字幕、Segment 和 Note CRUD；
- 对话、消息、Speech 和发音评估；
- 字典、下载、波形、FFmpeg 和 EchoGarden；
- 本地文件与缓存访问。

因此主调用链是：

```text
React Hook
  → window.__ENJOY_APP__.audios.create(...)
  → ipcRenderer.invoke("audios-create", ...)
  → ipcMain.handle("audios-create", ...)
  → Sequelize Model + 文件系统
  → JSON 返回 Renderer
```

### Renderer

[`router.tsx`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/router.tsx) 使用 React Router Hash Router，公开路由覆盖：

- Chat、Conversation 和 Copilot；
- Course、Community 和用户资料；
- Audio、Video、Document 和 Story；
- Pronunciation Assessment、Vocabulary 和 Note。

状态管理主要是 React Context、Hooks 和 reducer，不是集中式 Redux store。重要 Context 包括 App Settings、AI Settings、DB、Media Shadow、Document、Dictionary、Course、Chat Session 和 Copilot。

## 数据模型

[`db/index.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main/db/index.ts) 使用 SQLite、Sequelize Typescript 和 Umzug。模型包括：

```text
学习资源：Audio, Video, Document, Story(远端)
时间结构：Transcription, Segment
用户产出：Recording, Note, Speech
反馈数据：PronunciationAssessment
AI 对话：Conversation, Message, Chat, ChatAgent, ChatMember, ChatMessage
配置缓存：UserSetting, CacheObject
```

数据库迁移前会强制备份；普通启动最多每日备份一次，并只保留最近十份。

## 本地目录

默认资料库是文档目录下的 `EnjoyLibrary`。用户数据按账户 ID 分目录，主要结构为：

```text
EnjoyLibrary/
├─ <user-id>/
│  ├─ audios/
│  ├─ videos/
│  ├─ recordings/
│  ├─ speeches/
│  ├─ segments/
│  ├─ documents/
│  ├─ backup/
│  └─ enjoy_database.sqlite
├─ waveforms/
├─ cache/
├─ logs/
└─ whisper/
```

这里有三类不同的数据：

1. **业务事实**：SQLite 中的资源、时间轴、录音和评测记录；
2. **不可轻易重建的用户资产**：媒体、录音、TTS 语音和笔记；
3. **可重建缓存**：临时 WAV、波形和部分计算结果。

备份策略只直接覆盖 SQLite，不等于完整备份所有媒体与录音。因此迁移资料库时应复制整个用户目录，而不是只复制数据库。

## 数据库事件与界面更新

数据库模型在创建、更新或删除后，会从 Main Process 发送 `db-on-transaction`。Renderer 的 DB Provider 将其转为应用内事件，各 Hook 根据模型和动作更新 reducer。

```text
Sequelize Model change
        ↓
BrowserWindow.webContents.send("db-on-transaction")
        ↓
DbProvider
        ↓
CustomEvent / Hook listener
        ↓
reducer prepend / update / remove
```

这个模式让本地数据库成为事实来源，同时避免每次写入后重新拉取完整列表。代价是事件契约、模型名和 reducer 行为需要保持一致。

## 本地与远端边界

[`constants/index.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/constants/index.ts) 和客户端调用确认了以下外部端点：

- `https://enjoy.bot`：REST API、登录、配置、AI 代理与语音令牌；
- `wss://enjoy.bot/cable`：ActionCable 实时消息；
- `https://storage.enjoy.bot`：媒体上传/存储；
- Azure Speech：STT、TTS 和 Pronunciation Assessment；
- OpenAI-compatible API：LLM、STT 和 TTS；
- Cloudflare AI Worker：Whisper 转写；
- Ollama：本地角色对话。

客户端允许覆盖 API、WebSocket 和 OpenAI-compatible base URL，但仓库缺少 Enjoy 后端实现。因此完整自部署需要重新实现客户端使用的服务端契约，或者关闭依赖它们的功能。

## 构建与交付

`enjoy/` 使用 Electron Forge + Vite，分别构建 Main、Preload 和 Renderer。打包配置覆盖 macOS DMG/ZIP、Windows Squirrel/ZIP 和 Linux DEB/RPM/ZIP，并对 FFmpeg、SQLite、Whisper、EchoGarden 与词典相关原生资源做 ASAR 解包。

这解释了为什么“源码可读”不等于“轻量运行”：真正安装和打包需要处理多平台原生依赖、二进制体积和模型下载。

## 架构评价

### 值得复用

- Renderer/Main 的职责边界清楚；
- 本地媒体和结构化元数据分开持久化；
- STT/TTS/LLM 供应商被配置层隔离；
- 时间轴作为播放器、录音和评测的共享契约；
- 数据库事务事件适合本地优先桌面应用。

### 需要谨慎

- Preload 暴露的 IPC 面较大，增加新接口时需要校验参数和文件路径；
- `enjoy://` 协议被赋予较高权限，应单独做路径穿越、CSP 和来源校验审计；
- OpenAI SDK 在 Renderer 中启用 `dangerouslyAllowBrowser`，自带 API Key 的安全性依赖渲染层不被注入；
- 本地数据与云端对象之间存在同步逻辑，但服务端不可见，冲突处理无法从本仓库完整验证；
- 根许可证和子包许可证声明不一致。
