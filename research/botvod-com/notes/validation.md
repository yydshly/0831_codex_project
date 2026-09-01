# 验证记录

本文件随研究、实现和浏览器检查更新。结论只使用 `pass`、`continue`、`defer` 或 `blocked`。

## 运行环境

- 安装命令：`npm install`
- 启动命令：`npx vite --host=127.0.0.1`
- 类型检查：`npm run check`
- 生产构建：`npm run build`
- 本地 URL：`http://127.0.0.1:5173/`
- 支持主题：固定深色主题
- 支持语言：简体中文
- 目标视口：1440×1000、768×900、390×844
- 首次记录：2026-08-31（Asia/Shanghai）
- 最近验证：2026-09-01（Asia/Shanghai）

## 2026-09-01 Revision 3 结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| MediaCMS 后期理解 | `pass` | DOM 同时包含一句话模型、BotVod/我方平台/MediaCMS/CDN 四类职责和六段媒体生命周期 |
| 桌面系统全景 | `pass` | [`validation-ecosystem-desktop-2026-09-01.png`](../evidence/validation-ecosystem-desktop-2026-09-01.png)；标题、一句话模型和端到端链路在首个视口形成连续阅读路径 |
| 移动系统全景 | `pass` | [`validation-ecosystem-mobile-2026-09-01.png`](../evidence/validation-ecosystem-mobile-2026-09-01.png)；链路改为纵向流，标题、结论与卡片均未裁切 |
| 响应式几何 | `pass` | Chrome CDP：1440/768/390 三个视口均满足 `scrollWidth === clientWidth` |
| 新增外部链接 | `pass` | MediaCMS 官方仓库链接可聚焦；键盘模式下 `:focus-visible=true`，轮廓为 `3px solid` |
| 原有状态机回归 | `pass` | reduced-motion 下 YouTube 示例到达 `ready`、3 个格式、queue 分支；交付到 `success`/100%；非法 URL 到达 `invalid` 且 `aria-invalid=true` |
| 浏览器运行时 | `pass` | Chrome CDP 记录 `runtimeErrors=[]` |
| BotVod 生产构建 | `pass` | TypeScript 无错误；Vite 7.3.6，5 modules transformed |
| Pages 相邻 Demo 构建 | `pass` | early.tools Capability Lab 生产构建通过，避免工作流扩展破坏已有发布 |
| Markdown 相对链接 | `pass` | 检查根 README、Demo README、研究 README 与 5 份相关笔记，0 个失效相对链接 |
| Mermaid 覆盖 | `pass` | BotVod 研究区共 17 个 Mermaid 图；新增系统全景、MediaCMS 职责架构与转码流程 |
| GitHub Pages 发布 | `continue` | 工作流已加入 BotVod 构建和 `/demos/botvod-capability-lab/` artifact；等待提交、推送与线上 HTTP 验证 |

### Revision 3 refinement ledger

| 阶段 | 覆盖项 | 浏览器或工程证据 | 观察结果 | 决策 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| Stage 0 | Revision 3 目标与范围 | `delivery-contract.md` | 新增媒体系统全景、三层 README 和 GitHub Pages 发布要求 | pass | — |
| Stage 1 | 修订前浏览器基线 | `.tmp/botvod-r3-baseline.png` | 原首屏稳定，但没有 MediaCMS 与完整系统分层 | pass | — |
| Stage 2–3 | 一句话模型与系统层级 | 桌面/移动系统全景截图＋DOM 文本 | BotVod、我方适配层、MediaCMS、CDN 的上下游关系清晰 | pass | — |
| Stage 3 | MediaCMS 能力边界 | 六段生命周期、四类系统职责卡、官方来源链接 | 明确存储/处理/管理/分发/展示，同时排除任意网页搜源 | pass | — |
| Stage 5–6 | 原有交互与状态回归 | CDP 状态、格式数量、进度和错误状态 | 两条核心状态路径与无效输入反馈未回归 | pass | — |
| Stage 7 | 视口、键盘与语义 | 1440/768/390 几何、键盘焦点、原生链接 | 无横向溢出；新增官方链接可达且焦点可见 | pass | — |
| Stage 8 | reduced-motion 与本地回退 | CDP 媒体偏好模拟＋完整交互 | 降低动效后状态完整，核心内容不依赖外部请求 | pass | — |
| Stage 9 | README、构建与 Pages 配置 | 0 失效相对链接、两个 Demo 构建通过、工作流 diff | 本地工程闭环完成；线上发布待推送 | continue | 提交并推送，等待 Actions 后验证在线 URL |

## 2026-09-01 结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| TypeScript | `pass` | `tsc --noEmit` 无错误 |
| 生产构建 | `pass` | Vite 7.3.6，5 modules transformed，构建完成 |
| 真实浏览器加载 | `pass` | Edge Headless + CDP DOM 包含三项核心判断、三类搜索、6 步找源流程和交付层结论 |
| 桌面首屏 | `pass` | [`validation-desktop-2026-09-01.png`](../evidence/validation-desktop-2026-09-01.png) |
| 核心判断区 | `pass` | [`validation-core-2026-09-01.png`](../evidence/validation-core-2026-09-01.png)；三项问题在首个内容章节直接回答 |
| 找源流程 | `pass` | [`validation-source-flow-2026-09-01.png`](../evidence/validation-source-flow-2026-09-01.png)；6 个步骤含公开观察/技术推断标签 |
| 交付层判断 | `pass` | [`validation-delivery-layer-2026-09-01.png`](../evidence/validation-delivery-layer-2026-09-01.png)；找源、治理、播放/下载三层关系可见 |
| 390px 首屏 | `pass` | [`validation-mobile-2026-09-01.png`](../evidence/validation-mobile-2026-09-01.png)；标题、说明和主操作完整可见，顶部导航按设计在内部横向滚动 |
| 响应式几何 | `pass` | CDP：1425/753/390 三个实际内容视口均满足 `scrollWidth === clientWidth` |
| 状态机回归 | `pass` | 队列未命中与缓存命中均进入 `ready`、3 个格式；队列交付到 `success`/100%；非法 URL 进入 `invalid` 并设置 `aria-invalid=true` |
| 键盘主流程 | `pass` | 原生 Tab 从 URL 输入到解析按钮；Space 启动解析；继续 Tab 到格式与交付按钮；完成状态为 `success`；焦点轮廓为 3px solid |
| reduced-motion | `pass` | CDP 模拟 `prefers-reduced-motion: reduce`，解析和交付状态完整到达，不丢信息 |
| Markdown 相对链接 | `pass` | 检查 9 个项目入口/专题文件，0 个失效相对链接 |
| Mermaid 覆盖 | `pass` | 13 个 Mermaid 图，覆盖能力、旅程、找源、架构、流程、时序、状态、数据和价值决策 |
| 外部副作用 | `pass` | Demo 使用固定数据；不访问输入 URL，不调用下载接口，不接收 Cookie |

## Refinement ledger

| 阶段 | 覆盖项 | 浏览器或工程证据 | 观察结果 | 决策 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| Stage 0 | Revision 2 目标与范围 | `delivery-contract.md` | 保留旧页面，重开定位、搜源、交付边界三项覆盖 | pass | — |
| Stage 1 | 浏览器基线 | 改造前桌面/移动截图 | 原视觉骨架稳定；核心问题埋在后续章节 | pass | — |
| Stage 2 | 首屏层级 | Edge 1440×1000、390×844 | 首屏明确“不是搜全网，是给链接找媒体源” | pass | — |
| Stage 3 | 核心信息与图表 | 核心判断、搜索对照、找源流程、难度分层截图 | 三项用户问题均在网页中直接回答，事实与推断有标签 | pass | — |
| Stage 5 | 交互回归 | CDP 触发解析、缓存/队列、交付和错误状态 | 原有状态机两条分支与恢复状态均通过 | pass | — |
| Stage 6 | 状态反馈 | `ready`、`success`、`invalid` 与进度值 | 状态文字、进度和 ARIA 均一致 | pass | — |
| Stage 7 | 多视口与键盘 | 1440/768/390 几何；Tab/Space 主流程 | 无文档级横向溢出；导航内部滚动；焦点可见且主流程完成 | pass | — |
| Stage 8 | 动效与能力回退 | reduced-motion + 本地固定数据 | 动效降级不丢状态；核心内容不依赖外部媒体能力 | pass | — |
| Stage 9 | 文档与构建 | `npm run build`、9 文件链接、13 Mermaid | 工程与研究交付一致 | pass | — |

## 已知限制

- `agent-browser` CLI 在当前环境不可用，因此按技能回退路径使用 Chrome Headless + Chrome DevTools Protocol，仍保留真实浏览器 DOM、截图、键盘和状态证据。
- 未执行真实 BotVod 下载、注册、登录或 Cookie 操作；这是研究边界，不是测试遗漏。
- Mermaid 图尚未用独立 CLI 批量渲染；已检查代码块数量和 Markdown 链接，渲染器兼容性以 GitHub/Codex 当前 Mermaid 支持为准。
