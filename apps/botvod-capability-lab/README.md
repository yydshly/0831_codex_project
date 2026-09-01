# BotVod Capability Lab

> 一句话：BotVod 是把已知 URL 变成媒体资产的上游摄取样本，MediaCMS 是管理并分发已入库媒体的下游资产样本；我们的核心是用可插拔 Source Adapter 与统一 Media Manifest 把两层连接起来。

这是一个独立、离线可运行的 Vite + TypeScript 研究型网页，用确定性的本地模拟解释 [BotVod 研究条目](../../research/botvod-com/) 中梳理的能力、技术原理、使用场景、风险边界和扩展路线。页面先回答三个核心问题：它如何定位、怎样“找源”、以及为什么播放和下载只是交付层；随后通过 MediaCMS 对照图解释存储、处理、管理、分发和门户展示属于下游资产系统。

- 在线页面：[GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/botvod-capability-lab/)

研究文档入口：

- [能力与使用场景](../../research/botvod-com/notes/capabilities-and-use-cases.md)
- [实现原理与架构](../../research/botvod-com/notes/architecture.md)
- [媒体平台全景](../../research/botvod-com/notes/media-platform-landscape.md)
- [对我们的价值](../../research/botvod-com/notes/value-assessment.md)
- [证据与风险](../../research/botvod-com/notes/evidence-and-risks.md)

> 本项目不是 BotVod 官方产品，也不是下载器。它不会调用 BotVod 或任何视频平台的解析/下载接口，不会抓取媒体，不接收 Cookie；输入的链接只在当前浏览器内存中用于识别平台和驱动模拟状态。

## 运行

```bash
npm install
npm run dev
```

类型检查、生产构建与预览：

```bash
npm run check
npm run build
npm run preview
```

`vite.config.js` 使用 `base: './'`，构建产物可部署到 GitHub Pages 子路径或任意静态目录。

## 可以演示什么

- 对比“公网内容搜索、站内缓存检索、已知 URL 媒体找源”，明确 BotVod 不是公网视频搜索引擎。
- 沿 6 步找源流程查看哪些环节来自公开观察，哪些只是职责推断。
- 用难度分层理解：找源与归一化决定能力上限，缓存/队列决定可靠性，播放/下载决定交付体验。
- 用同一张系统地图区分 BotVod、我们的 Source Adapter、MediaCMS 和 CDN，并明确各自输入、输出和不负责事项。
- 将 MediaCMS 拆成接入、存储、处理、管理、分发、展示六段生命周期，避免把它误解为任意源下载器。
- 选择 YouTube、Bilibili、X、TikTok、抖音或 Instagram 示例，或输入同类公开链接。
- 观察链接识别、元数据抽取、格式清单、缓存索引、工作队列、转封装与浏览器交付的状态变化。
- 切换“自动判断 / 强制缓存命中 / 强制冷启动”以复现两种交付路径。
- 选择完整视频、纯视频或音频格式，理解高画质视频轨不一定自带音频。
- 对照能力证据、使用场景、风险和产品/工程/治理三类扩展路线。

## 真实性边界

- “公开观察”来自 2026-08-31 至 2026-09-01 对官网页面和公开接口的检查。
- “本地模拟”使用内置固定数据，不表示 BotVod 当前可下载该示例或承诺相同性能。
- “扩展建议”是基于现有架构的产品与工程推演，不代表站点路线图。

## 无障碍与响应式

- 使用原生链接、按钮、输入框与单选控件；主要状态通过 `aria-live` 播报。
- 支持键盘操作、可见焦点和 `prefers-reduced-motion`。
- 目标视口为 1440×1000、768×900 与 390×844；固定深色主题、简体中文。
