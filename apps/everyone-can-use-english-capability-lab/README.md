# Everyone Can Use English · 技术能力研究网页

> **把任意内容加工成英语训练材料的工作台，而不是完整的英语教学体系。**

这是本子项目的主要摘要，也是网页组织全部研究信息的架构主线。它不是把英语功能简单堆叠在一起，而是把内容获取、媒体与语言处理、统一学习数据结构、训练动作、反馈和信息存储连接成可落地的产品闭环。

## 在线页面

- [GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/)
- [关联研究](../../research/zuodaotech-everyone-can-use-english/README.md)

## 架构理解

```text
本地媒体 / URL / YouTube / 文档 / 网页 / 用户文本 / AI 回复
                              ↓
下载与解析 → 16 kHz WAV → STT → DTW 对齐 → Timeline / Segment
                              ↓
逐句播放 / 循环 / 跟读 / 录音 / Pitch 对比 / 发音评测 / 笔记
                              ↓
SQLite 学习关系 + 本地媒体、录音、波形、模型和词典文件
```

- **用户是决策者：**选择素材、目标、供应商、练习句子和下一步。
- **程序是编排者：**执行接入、媒体处理、模型调用、状态管理和持久化。
- **AI 是智能节点：**完成转写、翻译、生成、朗读和评分；当前不是自主课程教练。
- **Timeline / Segment 是稳定中间层：**解耦内容来源、模型供应商与训练交互。

页面包含一张完整能力全景图，以及 12 项能力、六步实现链路、四类运行边界、六类场景、九项扩展方向和固定源码证据索引。

研究基线固定在 commit `3d799132046993eade5a364ddd1e557906854eda`。页面只陈述公开仓库能够证明或合理推断的内容，并明确标注当前 Web、浏览器扩展和服务端源码缺失的边界。

## 本地查看

```powershell
npm install
npm run dev
```

生产构建检查：

```powershell
npm run build
```

GitHub Pages 由仓库统一的 `.github/workflows/pages.yml` 构建，本应用通过相对资源路径发布到 `/demos/everyone-can-use-english-capability-lab/`。

## 验证范围

- TypeScript 检查与 Vite 生产构建；
- 1440、768、390 三种视口；
- 浅色与深色主题；
- 能力筛选、技术步骤和扩展阶段交互；
- 键盘 skip link、可见焦点和 reduced-motion；
- GitHub Pages 聚合 artifact 的嵌套路径、HTML、JavaScript 与 CSS 加载。

## 已知边界

- 这是非官方、纯静态的技术研究页，不调用真实 STT、TTS、LLM 或发音评测服务；
- “任意内容”表示可扩展的内容适配架构，不承诺支持所有文件格式和网站；
- 当前 Web、Chrome 扩展和 enjoy.bot 后端没有完整开源，不能由旧 Electron 客户端推断其全部内部实现；
- 网页验证通过不等于上游 Electron 客户端已经完成动态运行验证。

## 研究与验证索引

- [研究总览](../../research/zuodaotech-everyone-can-use-english/README.md)
- [架构与数据流](../../research/zuodaotech-everyone-can-use-english/notes/architecture.md)
- [音视频与跟读流水线](../../research/zuodaotech-everyone-can-use-english/notes/audio-training-pipeline.md)
- [AI、云服务与数据边界](../../research/zuodaotech-everyone-can-use-english/notes/ai-cloud-boundaries.md)
- [网页设计与交付契约](../../research/zuodaotech-everyone-can-use-english/notes/web-delivery-contract.md)
- [网页验证记录](../../research/zuodaotech-everyone-can-use-english/notes/web-validation.md)
- [网页交接](../../research/zuodaotech-everyone-can-use-english/notes/web-handoff.md)
