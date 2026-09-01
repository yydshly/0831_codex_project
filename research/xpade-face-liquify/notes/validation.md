# 验证记录

验证对象是本仓库中的概念实验室，不是对上游站点生产算法精度的认证。每条结论只使用 `pass`、`continue`、`defer` 或 `blocked`。

## 运行环境

- 工作目录：`apps/xpade-face-liquify-lab/`
- 启动命令：`npm run dev -- --host 127.0.0.1 --port 4180`
- 验证 URL：`http://127.0.0.1:4180/`
- 构建命令：`npm run build`
- 支持主题：固定深色主题
- 目标视口：1440×1000、768×900、390×844
- 验证日期：2026-09-01（Asia/Shanghai）

## Refinement ledger

| 阶段 | 覆盖项 | 浏览器或命令证据 | 观察结果 | 决策 | 后续动作 |
| --- | --- | --- | --- | --- | --- |
| Stage 0 | 目标与范围 | `delivery-contract.md` | 交付范围、边界、主流程与验收条件已明确 | pass | 已闭环 |
| Stage 3 | 能力、场景、扩展分析 | 研究 README 与技术笔记文件检查 | 事实、推断、建议分别标注；适用和不适用边界清晰 | pass | 已闭环 |
| Stage 5 | 六项语义变形参数 | 1440×1000 浏览器交互；`eyeSize` 从 0 调到 +28 | 数值、`1 / 6` 变化计数和合成肖像眼部几何同步改变 | pass | 已闭环 |
| Stage 5 | 网格、按住看原图、撤销、重做、重置 | 指针按下/松开与按钮状态检查 | `aria-pressed`、渲染模式和画面状态同步；重置恢复 0 / 6、默认网格与步骤 01 / 05 | pass | 已闭环 |
| Stage 5 | 五阶段技术原理 | 直接切换步骤 01–05 | 标题、解释、输入输出与进度同步；步骤 05 显示“三角网格重采样与导出” | pass | 已闭环 |
| Stage 7 | 桌面响应式 | 1440×1000；文档与 body 横向溢出检查 | 双栏实验台完整，横向溢出均为 0 | pass | 已闭环 |
| Stage 7 | 平板响应式 | 768×900；文档与 body 横向溢出检查 | 画布与控制区顺序堆叠，横向溢出均为 0 | pass | 已闭环 |
| Stage 7 | 手机响应式 | 390×844；`#lab`、`#principle` 锚点检查 | 控件可读可操作；步骤按钮换行；锚点未被粘性导航遮挡；横向溢出均为 0 | pass | 已闭环 |
| Stage 7 | 键盘与焦点 | 聚焦眼睛大小滑杆并按 `ArrowRight` | 值从 0 变为 +1；焦点保留；3px 可见焦点环正常 | pass | 已闭环 |
| Stage 7 | 语义与状态播报 | DOM 可访问性快照 | 原生 range、button、`aria-pressed` 与 `aria-live` 状态可识别 | pass | 已闭环 |
| Stage 7 | reduced-motion | 模拟 `prefers-reduced-motion: reduce` | 媒体查询生效，活动动画数量为 0，内容和操作不丢失 | pass | 已闭环 |
| Stage 8 | 独立运行与资源回退 | 构建产物搜索外部 URL 与根路径；模拟 `/demos/xpade-face-liquify-lab/` 子路径加载 | 运行时无外部资源依赖；HTML、JS、CSS 与 12 张 WebP 均从 Demo 子路径返回 `200` | pass | 已闭环 |
| Stage 9 | 生产构建 | `npm run build` | Vite 7.3.6 成功输出 HTML、CSS、JavaScript；无构建错误 | pass | 已闭环 |
| Stage 9 | 文档与索引 | 根 README、Demo README、研究 README 链接检查 | 研究、演示、原理与复现说明可从仓库索引发现 | pass | 已闭环 |
| Stage 5 | 职业头像一键处理 | `#headshot` 从 `ready` 进入 `processing` 与 `result`；前后全页截图 | 处理中 `aria-busy=true` 且按钮锁定；结果同时改变背景、构图、光线、皮肤纹理、着装与克制几何 | pass | 已闭环 |
| Stage 5 | XPADE 层独立贡献 | 结果态关闭几何层并读取 SVG `face-clip` 路径与背景渐变 | 脸部路径发生变化，企业背景首个色值保持一致；能力隔离文案同步 | pass | 已闭环 |
| Stage 5 | 企业模板与强度控制 | 企业蓝、中性灰、暖白；磨皮 65%；补光 +44 | 三个背景首色依次匹配预设；滑杆输出与 SVG 纹理/光线同步 | pass | 已闭环 |
| Stage 5 | 员工确认与 HR 本地审核 | `result → confirmed → approved → reset`，并刷新批准态 | 编辑按序锁定；批准态可恢复；硬重置清除流程存储；全程明示未发送 HR 或服务器 | pass | 已闭环 |
| Stage 7 | 增量响应式、键盘与 reduced-motion | 1440×1000、768×900、390×844；Enter、Space、ArrowRight；`reduce` 媒体模拟 | 三尺寸文档与 body 横向溢出均为 0，关键卡片在视口内；键盘完成生成、调节、确认、批准、重置；reduced-motion 约 95ms 完成 | pass | 已闭环 |
| Stage 8 | 增量网络、错误与状态隐私 | 浏览器完整请求、页面错误、控制台错误、localStorage 内容 | 外部请求、页面错误、控制台错误均为 0；持久化 JSON 不含 `data:`、`blob:` 或图片字节 | pass | 已闭环 |
| Stage 5 | 写实图片前后对比 | 六类本地虚拟人物样片；`#photo-compare-range` 依次为 0、50、100 | 画面 `--reveal`、输出值和 `aria-valuetext` 同步；当前图片均成功解码为 760×1014 | pass | 已闭环 |
| Stage 5 | 多业务场景 | 依次选择 enterprise、resume、video、ecommerce、makeup、creator | 每次仅一个按钮 `aria-pressed=true`；before/after 路径、标题、业务对象、价值与边界同步；切换后分界回到 50 | pass | 已闭环 |
| Stage 3 | 图片真实性边界 | 场景主区、动态图片替代文本、Demo README 与研究 README | 均明示“AI 生成虚拟人物、预生成目标效果、非运行时 AI”；视频场景注明静态单帧不能证明时序稳定与防抖 | pass | 已闭环 |
| Stage 8 | 图片性能与错误回退 | 12 张 WebP 文件审计、PerformanceResourceTiming、缺失图片注入 | 资产总量 990,876 B；所有图片同源；初始只挂当前 pair；缺失图显示可读占位，切换场景后恢复 | pass | 已闭环 |
| Stage 7 | 写实场景跨端与键盘 | 1440×1000、768×900、390×844；Home、End、ArrowRight | 三尺寸文档与 body 横向溢出均为 0，关键矩形在视口内，触控目标最小 44px；键盘将 range 正确置为 0、1、100 | pass | 已闭环 |
| Stage 9 | GitHub Pages 子路径验收 | 生产构建放入 `/demos/xpade-face-liquify-lab/` 后用无头 Chromium访问 | 入口、JS、CSS 与全部 12 张图片无 4xx；图片路径保留 Demo 前缀；外部请求、页面错误和控制台错误均为 0；390px 横向溢出为 0 | pass | 推送后再做线上同路径复核 |

## 已知边界

- Demo 使用 AI 生成的虚拟人物写实样片、原创合成 SVG 肖像和确定性几何规则；写实样片只说明产品目标效果，SVG 只证明交互模型与数据流可讲清、可操作。
- Demo 不读取照片、不执行 Human.js/MediaPipe、不评估 468 点检测精度，也不导出真实变形图片。
- 职业头像的质检、背景、光线、皮肤、着装、员工确认与 HR 审核均为合成或本地状态模拟，不代表已接入真实企业工作流。
- 上游站点的源码许可未声明；本项目没有复制其源码、图像资产或部署代码。
