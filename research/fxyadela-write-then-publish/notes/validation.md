# 验证记录

本文件记录 2026-08-31 至 2026-09-01（Asia/Shanghai）完成的源码、工程与真实浏览器验证。Revision 2 把原能力实验页整理为“研究档案 + 互动实验”；Revision 3 进一步集中最终理解、关联上游真实卡片/长文证据并接入 GitHub Pages。决策只使用 `pass`、`continue`、`defer` 或 `blocked`；未把平台真实发布能力纳入 Demo 验收范围。

## 运行环境与基线

- 上游基线：`fxyadela/write-then-publish@7a708312247e69155ca586c49c65c5306fd88e9e`；本地研究镜像 `HEAD` 与该提交一致，工作区为 clean。
- 工具链：Node.js 22.15.0、npm 10.9.2、Python 3.10.11、Headless Chrome 151。
- Demo 安装与构建：在 `apps/write-then-publish-lab` 执行 `npm install`、`npm run build`。
- Demo 规范 URL：`http://127.0.0.1:4177/`。
- 支持主题：light、dark。
- 验证视口：1440×1000、768×900、390×844。
- 浏览器证据：[1440px light](../assets/lab-1440-light.png)、[1440px dark](../assets/lab-1440-dark.png)、[768px light](../assets/lab-768-light.png)、[390px 输出区](../assets/lab-390-output.png)。
- Revision 3 证据：[1440px 真实演示区](../assets/lab-real-demo.png)、[390px 真实演示区](../assets/lab-real-demo-390.png)。

## 上游基线检查

| 检查 | 可复现方式 | 结果 | 决策 |
| --- | --- | --- | --- |
| 提交固定与工作区状态 | `git rev-parse HEAD`、`git status --short` | HEAD 为 `7a708312247e69155ca586c49c65c5306fd88e9e`，无未提交文件 | pass |
| JavaScript 语法 | 对 `src/app.js`、`src/live-photo-browser.js`、`src/supabase.js`、`src/supabase-config.js` 分别执行 `node --check` | 四项退出码均为 0 | pass |
| Python 语法 | `python -m py_compile server.py scripts/cloud_live_photo_worker.py` | 退出码为 0 | pass |
| 本地服务最小冒烟 | `python server.py` 后请求 `/` 与 `/api/live-photo/status` | `/` 返回 200；状态接口返回 200，`ok: true`、`macos: false`、`ready: false` | pass |

状态接口在 Windows 上报告 `ready: false` 是符合源码约束的预期结果：Live Photo 本地发布包要求 macOS 与对应工具链，并非服务故障。

## Demo 构建与浏览器验证

| 覆盖项 | 浏览器或工程证据 | 观察结果 | 决策 |
| --- | --- | --- | --- |
| 生产构建 | `npm run build` | 构建成功；Revision 3 产物约为 HTML 1.83 kB、CSS 43.77 kB、JS 43.22 kB，真实证据资源约 0.86 MB | pass |
| 首屏与主流程 | 1440×1000 实机截图与 DOM 断言 | 一句话结论、五问研究目录、互动实验、分析章节与证据入口均可识别 | pass |
| 研究目录 | DOM 数量、真实点击、Tab + Enter | 5 个问题卡分别连接定位、能力、原理、场景和扩展；`#overview` 落点可见 | pass |
| 证据账本 | DOM 数量与页面可读性 | 4 类证据清楚区分固定版本、浏览器验证、教学模型和尚未实测 | pass |
| 同源双输出 | 编辑 Markdown 后读取卡片与长文 DOM | 两种输出同步更新；标题和正文一致 | pass |
| 视图与恢复 | 点击“并排 / 聚焦卡片 / 聚焦长文 / 恢复示例” | 状态、`aria-pressed`、可见输出及恢复内容一致 | pass |
| 原理步进器 | 点击步骤并用方向键移动 Tab | 六步均可到达；选中态、焦点与说明同步 | pass |
| 明暗主题 | 双向切换并截图 | light/dark 层级和控件状态完整 | pass |
| 响应式 | 1440×1000、768×900、390×844 的 `scrollWidth`/`clientWidth` 与截图 | 三个视口均无根级横向溢出，手机可完成主流程 | pass |
| reduced motion | 浏览器模拟 `prefers-reduced-motion: reduce` | 非必要过渡降至近零，信息与操作保留 | pass |
| 远程依赖 | 检查 Performance Resource Timing | 外部运行时资源列表为 `[]` | pass |
| 无障碍自动检查 | light、dark、390px 分别运行 Axe | 三轮均为 0 violations | pass |
| 无障碍人工补充 | 检查 Axe incomplete、控件尺寸和截图 | 透明/装饰符号的 contrast 为自动工具无法判定项，已人工核查；无按钮低于 24px | pass |

Revision 2 的 Axe 结果为：1440px light 0 violations、1440px dark 0 violations、390px light 0 violations。自动工具仍将卡片伪元素背景与纯装饰箭头列为 contrast incomplete；这些节点没有新增文本对比失败，人工截图复核通过。

## 上游真实能力演示

这部分不使用研究网页的教学渲染器，而是直接运行固定提交的 `server.py` 与原生前端。上游工作区在演示前后保持 clean。

| 覆盖项 | 操作与断言 | 实测结果 | 决策 |
| --- | --- | --- | --- |
| 真实样稿输入 | 新建图文并输入 [`fixtures/real-demo.md`](../fixtures/real-demo.md) | 499 字 Markdown 被上游编辑器接收，历史项目标题随 H1 更新 | pass |
| 原生卡片分页 | 等待上游解析、字体测量和 Canvas 渲染 | 自动生成 3 张图片；页面报告高清尺寸 `1728x2304` | pass |
| 原生卡片导出 | 点击第一张卡片下载按钮 | 生成 `layout-page-01.png`，`1728 × 2304`，395,985 bytes | pass |
| 同源长文切换 | 在同一项目点击“长文” | 原正文保留，长文预览出现 H1、3 个 H2、列表、引用与强调 | pass |
| 长文主题设置 | 选择“优雅 / 衬线 / 活力橘” | 预览和最终导出均反映所选主题 | pass |
| 原生长图导出 | 点击“下载长图”并进入普通浏览器下载兜底 | 页面状态为“长图下载完成”；生成 `write-then-publish-article.png`，`482 × 1479`，103,879 bytes | pass |

真实演示的完整步骤、文件哈希和未覆盖能力见[上游真实能力演示](real-demo.md)。本轮没有接入真实图片、Live Photo、Supabase、Obsidian 或平台账号，因此不把普通 PNG 导出升级解释为真实平台发布成功。

## 分页与安全压力检查

这些检查验证的是本研究 Demo 的教学渲染器，不代表上游产品的性能承诺。

| 输入夹具 | 断言 | 结果 | 决策 |
| --- | --- | --- | --- |
| 50,000 个中文字符 | 完成分页；页面无溢出；卡片拼接文本与输入一致 | 生成 512 页，0 个卡片溢出，文本一致 | pass |
| 跨页长粗体 | 强调结构不丢失；不暴露原始 `**`；页面无溢出 | 32 页、32 个 `strong`、无 raw marker、0 溢出 | pass |
| 5,000 个 emoji | 不切断代理对或字素簇 | 未发现代理对/字素断裂 | pass |
| 未闭合 `**` | 不错误执行半截强调 | 标记按字面文本保留 | pass |
| HTML/XSS 字符串 | 不进入可执行 HTML | 仅作为文本节点呈现 | pass |

50,000 字测试说明数万字输入可被当前实现处理，但 512 个同步 DOM 卡片会带来明显页面体量；这是一项规模边界证据，不应被解释为无限输入或生产级虚拟化承诺。

## Refinement ledger

| 阶段 | 覆盖项 | 证据 | 观察结果 | 决策 |
| --- | --- | --- | --- | --- |
| Stage 0 | 目标、范围、边界 | `delivery-contract.md` | 交付契约和不实现项已明确 | pass |
| Stage 1 | 上游基线 | 固定提交、clean 状态、语法与服务冒烟 | 研究来源可复现；平台条件差异被如实记录 | pass |
| Stage 2 | 信息架构 | 研究 README、五问网页目录与三份专题笔记 | 作用、能力、原理、场景、扩展和许可证均可发现 | pass |
| Stage 3 | 可运行基线 | Vite 开发服务、研究索引、证据账本、首屏浏览器检查 | 无空白页、错误遮罩或远程运行时依赖；研究入口可按问题浏览 | pass |
| Stage 4 | 视觉系统 | light/dark 桌面截图 | 编辑部式层级稳定，事实标签可辨认 | pass |
| Stage 5 | 核心交互 | 双输出、聚焦、恢复、六步导航 | 主流程与状态反馈均可操作 | pass |
| Stage 6 | 内容与事实边界 | 页面标签、许可证提醒、研究笔记 | 上游事实、教学模拟、推断和建议未混写 | pass |
| Stage 7 | 响应式与可访问性 | 三视口、键盘、Axe、reduced motion | 无根横向溢出；三轮 Axe 0 violations | pass |
| Stage 8 | 极端输入与回退 | 50k 中文、长粗体、emoji、未闭合标记、XSS 夹具 | 分页完整、安全文本渲染，极端滚动兜底可用 | pass |
| Stage 9 | 工程交付 | Revision 2 生产构建、锁文件、README、根索引 | 构建成功，启动、研究浏览和验证路径可复现 | pass |

## Revision 2 浏览器断言

| 断言 | 实测结果 | 决策 |
| --- | --- | --- |
| 研究整理完整性 | `.research-question-card` 为 5 个，`.evidence-card` 为 4 个 | pass |
| 锚点阅读路径 | 键盘进入首个研究问题后按 Enter，URL 变为 `#overview`，目标区进入视口 | pass |
| 原交互不回归 | Markdown 编辑后卡片与长文同步；恢复示例成功；原理 Tab 右方向键从“摄取”切到“规范化”并保留焦点 | pass |
| 三视口根布局 | 1440、768、390 下 `scrollWidth === clientWidth` | pass |
| 390px 研究布局 | 五问目录与证据账本均为单列，卡片输出可横向浏览 | pass |
| reduced motion | 媒体查询命中；HTML 平滑滚动关闭，交互过渡为 `0.01ms` | pass |
| 运行时依赖 | Performance Resource Timing 外部 URL 列表为 `[]` | pass |
| 页面错误 | 浏览器 page errors 为空；控制台仅有 Vite 开发连接日志 | pass |
| 50k 回归 | 50,010 字输入生成 512 张卡片，0 个卡片正文溢出；长文正文保留 | pass |

## Revision 3 公开成果页断言

| 断言 | 实测结果 | 决策 |
| --- | --- | --- |
| 最终理解 | 页面集中呈现“一次输入、统一处理、按平台编译、分别交付”，并分别说明本质、AI 角色、参考价值与不可照搬边界 | pass |
| 真实证据加载 | 两张 `1440 × 1000` 工作区截图、`1728 × 2304` 卡片 PNG 与 `482 × 1479` 长文 PNG 均按原始尺寸加载 | pass |
| Pages 子路径 | 本地 artifact 的 `/demos/write-then-publish-lab/` 返回完整页面；站点首页点击新卡片可进入该路径 | pass |
| 三视口布局 | 1440、768、390 下 `scrollWidth === clientWidth`；真实证据区分别为双列或单列响应式布局 | pass |
| 明暗主题 | 真实证据区在 light / dark 中层级完整，主题控件实际切换成功 | pass |
| 无障碍 | Revision 3 light 与 dark Axe 均为 0 violations；ARIA incomplete 已修复，剩余仅为伪元素/装饰符号的 contrast incomplete | pass |
| reduced motion | 浏览器模拟命中，`scroll-behavior` 为 `auto`，新增图片过渡降为 `0.01ms` | pass |
| 运行时依赖与错误 | 外部 Resource Timing 列表为 `[]`，页面错误为空 | pass |

## 已知边界

- Axe 对带透明背景或装饰符号的少量对比度项只能标记为 incomplete；本轮用计算样式和截图做人工补充，不声称自动证明所有视觉组合。
- Demo 只解析标题、段落、引用、无序列表与成对 `**粗体**` 子集，不是通用 Markdown 兼容性测试。
- Demo 不调用公众号、小红书、Supabase、Obsidian 或 Live Photo 真实接口；这些能力只作为上游事实与架构研究展示。
- 上游个人非商业许可证仍是使用边界；本验证不构成商业授权判断。
