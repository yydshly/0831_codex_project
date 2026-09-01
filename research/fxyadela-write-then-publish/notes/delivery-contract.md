# Write Then Publish Capability Lab：交付契约

## 设计契约

| 字段 | 决策 |
| --- | --- |
| Entry mode | Brief-led greenfield implementation，以上游仓库源码与文档作为研究证据 |
| Request revision | 3 |
| Target user and context | 需要判断该项目是否值得使用、研究或扩展的中文内容创作者、产品经理与开发者 |
| Desired first impression | 先看懂我们的最终判断：“一次输入、统一处理、按平台编译、分别交付”；随后能核对上游真实卡片/长文导出证据，再进入教学实验与完整研究 |
| Visual ambition | Editorial |
| Experience architecture | Editorial Flow |
| Visual constraints | 克制的技术编辑部风格；不复制上游版式作为页面设计、不重新分发其源码；真实运行截图和导出仅作为有归属说明的研究证据；信息层级高于装饰；支持明暗主题 |
| Information constraints | 明确区分上游已实现能力、当前 Demo 的教学模拟、源码审查推断与未来建议；事实绑定研究基线 |
| Operation constraints | 公开页保持纯静态；无后端、登录、真实 Supabase、公众号或小红书 API；核心体验不依赖远程资源；不把上游完整应用重新托管到 Pages |
| State constraints | 默认示例、正文编辑、卡片/长文切换、主题切换、原理步骤切换、恢复示例均需有清晰反馈 |
| Environment constraints | 独立 Vite + Vanilla JavaScript 应用；`base: './'`；支持桌面、平板、390px 手机、键盘与 reduced-motion |
| Primary journey | 阅读最终理解 → 查看上游真实导出效果与可复现记录 → 按五问进入研究章节 → 操作教学实验 → 查看证据、边界与最终判断 |
| User-defined phases | 总结理解；关联研究 Web；关联真实演示效果；部署 GitHub Pages；提交并推送 GitHub |
| Required artifacts | 研究 README、真实演示记录与导出 PNG、技术与扩展笔记、包含理解总结与真实证据区的可运行网页、Demo README、Pages 站点索引与工作流、浏览器验证记录、Git 提交与线上 URL |
| Autonomy authorization | 用户明确要求总结、关联、部署并提交到 GitHub；允许修改 Pages 工作流与索引、构建、提交本次相关文件并推送 `origin/main` |
| User-decision boundary | 不重新分发上游完整应用，不接入真实账号或平台发布接口，不申请或代表版权方授予商业许可；工作区其他未提交项目不进入本次提交 |
| Observable completion criteria | 最终理解与真实演示证据可在同一公开页面访问；真实 PNG 与来源边界清楚；教学主流程仍可操作；1440px、768px、390px、明暗主题、键盘与 reduced-motion 可用；Pages 工作流包含新应用；本地模拟 artifact 通过；仅相关文件被提交并推送；线上 URL 返回成功且页面主内容可读 |

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 首屏以研究结论与五问目录为入口，实验台紧随其后 | 一句话定位、作用、能力、原理、场景、扩展和事实边界先于细节 | 首次扫描能识别项目定位，并可按问题进入对应章节与实验 |
| 字体角色 | 编辑型展示标题、易读中文正文、等宽技术标签 | 正文保持舒适行长；代码与尺寸使用等宽字体 | 窄屏无逐字竖排、截断或不可读小字 |
| 色彩与材质 | 纸张/墨色中性色，珊瑚色表示主动操作，青绿色表示已验证数据流 | 颜色必须同时配合文字、图标或形状表达 | 明暗主题中正文、边界和交互状态均清晰 |
| 动效 | 只解释分页、模式切换和步骤迁移 | 不循环、不制造等待；尊重 `prefers-reduced-motion` | 减少动态时信息与操作完整保留 |
| 响应式 | 桌面为编辑器与双输出工作台；平板和手机按阅读顺序堆叠 | 不使用固定侧栏；控制随内容流动 | 390px 可完成全部主流程且无横向滚动 |
| 演示真实性 | 用原创 CSS/DOM 预览模拟能力，不实现 Live Photo 编码或真实发布 | 页面持续标注“教学模拟”，不伪装成上游运行结果 | 用户可区分上游事实、Demo 模拟和扩展建议 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面 / 状态 | 所需证据 | 负责阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 项目分析 | 作用、定位、能力与边界 | 研究总览、五问目录、页面概览 | 文件检查＋浏览器可读性 | Stage 3 | pass | 一句话结论、五问目录与章节摘要均可读 |
| 研究整理 | 五问目录、证据账本与阅读路径 | 首屏到互动实验之间、证据区 | 浏览器截图＋锚点交互＋DOM 检查 | Stage 3 | pass | 5 个问题连接对应章节，4 类证据集中呈现 |
| 能力演示 | 同一 Markdown 更新两种输出 | 默认态、编辑态、恢复态 | 浏览器交互＋DOM 断言 | Stage 5 | pass | 编辑同步与恢复断言通过 |
| 能力演示 | 卡片分页与长文主题切换 | 卡片/长文、主题状态 | 浏览器交互 | Stage 5 | pass | 并排、双聚焦与双主题通过 |
| 技术原理 | 数据流与核心模块 | 六步原理导航 | 浏览器交互＋技术笔记 | Stage 5 | pass | 六步导航、点击与方向键通过 |
| 使用场景 | 适用、不适用和平台边界 | 场景矩阵 | 浏览器可读性 | Stage 3 | pass | 场景矩阵与平台边界可读 |
| 可扩展方向 | 产品路线与工程前置条件 | 优先级路线图 | 浏览器可读性＋研究文档 | Stage 3 | pass | 路线图与架构笔记完成 |
| 事实边界 | 上游事实、Demo 模拟、研究判断、建议可辨识 | 全页标识、证据索引与许可提醒 | DOM 检查＋文件检查 | Stage 6 | pass | 证据账本明确列出已核对、已验证、教学模型和尚未实测 |
| 响应式 | 修订后的主流程无裁切或横向溢出 | 1440×1000、768×900、390×844 | 浏览器截图＋尺寸检查 | Stage 7 | pass | 三视口根级 `scrollWidth` 与 `clientWidth` 一致 |
| 主题 | 明暗主题层级与控件状态一致 | light、dark、双向切换 | 浏览器截图＋交互 | Stage 7 | pass | 新增研究目录和证据区在 light/dark 中均清晰 |
| 键盘与语义 | 研究目录与主控件顺序、焦点、按钮和状态语义 | 主流程 | 键盘路径＋DOM 检查 | Stage 7 | pass | Tab 可进入首个研究问题，Enter 到达锚点；原理方向键仍通过 |
| 动效降级 | 非必要过渡被禁用 | reduced-motion | 浏览器媒体模拟 | Stage 7 | pass | `scroll-behavior: auto`，过渡降为 `0.01ms` |
| 性能与回退 | 无远程资源；JavaScript 失败时研究结论仍可读 | 构建产物、无脚本内容 | 构建＋浏览器观察 | Stage 8 | pass | 运行时外部资源 `[]`，noscript 摘要已同步研究定位 |
| 工程交付 | 启动、构建、检查可复现 | README、锁文件、dist | 命令输出 | Stage 9 | pass | Revision 2 构建成功，README 与验证记录已更新 |
| 仓库索引 | 研究和 Demo 可发现 | 根 README、研究索引、应用索引 | 文件检查 | Stage 9 | pass | 根索引与两个子项目入口已链接 |
| 总结理解 | “一次输入、统一处理、按平台编译、分别交付”及参考价值 | 首屏摘要与独立总结区 | 浏览器截图＋DOM 检查 | Stage 3 | pass | 最终理解、AI 角色、参考价值与不可照搬边界已集中呈现 |
| 真实演示关联 | 上游原生卡片、长文工作区与实际 PNG 导出 | 真实演示证据区、静态资源 | 浏览器截图＋文件尺寸/哈希＋链接检查 | Stage 3 | pass | 四项真实证据、输入夹具与固定提交已建立公开关联 |
| 公开部署 | GitHub Pages 子路径可构建并访问 | Pages workflow、artifact、线上 URL | 本地构建＋工作流检查＋HTTP/浏览器验证 | Stage 9 | pass | Pages run 33462346180 成功；线上页面和四张真实证据图均返回 200 |
| Pages 索引 | 公开站点、根 README、apps README 均能发现本项目 | 站点首页与仓库索引 | 文件检查＋线上点击 | Stage 9 | pass | Pages 首页、根 README、apps README 和研究 README 均已关联 |
| 修订后响应式与主题 | 新增理解和真实证据区不破坏既有阅读路径 | 1440×1000、768×900、390×844；light/dark | 浏览器截图＋尺寸与 Axe | Stage 7 | pass | 三视口无根级溢出，图片加载成功，light/dark Axe 0 violations |
| GitHub 提交 | 只提交 WTP 研究、应用、Pages 工作流与索引 | staged diff、commit、origin/main | Git 状态＋提交输出＋远端检查 | Stage 9 | pass | 主提交 40aff36 已推送 origin/main；其他未跟踪项目未进入提交 |
