# OpenBrowser Architecture Lab 设计契约

## 交付契约

| 字段 | 内容 |
| --- | --- |
| Entry mode | Brief-led / greenfield implementation |
| Request revision | `1` |
| Target user and context | 已读过 OpenBrowser 基本介绍、希望快速判断是否值得继续研究的技术负责人、架构师和开发者 |
| Desired first impression | “它不是自研浏览器内核，而是在真实 Chromium 上构建隔离、自动化与控制面” |
| Visual ambition | `Editorial`，技术研究报告感，不复刻上游 UI |
| Experience architecture | `Editorial Flow`，单页阅读路径配合三个轻量交互工作区 |
| Visual constraints | 中文优先；高信息密度但可扫描；原创 CSS 架构图；不使用上游截图、Logo、远程字体或 CDN |
| Information constraints | 明确区分 Chromium 原生能力、OpenBrowser 增加的能力、不能保证的结果；突出原理与后期价值，不制造“保证过风控”结论 |
| Operation constraints | 静态站点，无后端、登录、账号、代理或真实浏览器控制；交互只改变本地展示状态 |
| State constraints | 支持 light/dark；架构层、启动步骤、未来场景均有明确选中态；无数据加载态 |
| Environment constraints | Vite 静态构建；相对资源路径；部署到 `/0831_codex_project/demos/openbrowser-architecture-lab/` |
| Primary journey | 读者先理解一句话定位，再操作架构层与启动流程，最后按未来需求判断哪些模块值得复用、现在是否需要继续投入 |
| User-defined phases | 新建子项目 → 网页整理原理与后期价值 → 完善外层 README/索引/源库关联 → 部署并提交远端 GitHub |
| Required artifacts | 可运行网页、应用 README、研究契约、浏览器验证记录、Pages 工作流、外层索引和在线地址 |
| Autonomy authorization | 用户明确要求新建、部署、提交远端；允许在范围内直接实现、验证、提交和推送 |
| User-decision boundary | 只有更换仓库、引入真实后端/账号能力、删除他人改动或远端权限失败才需要新决定 |
| Observable completion criteria | 页面构建通过；桌面/平板/390px 手机无横向溢出；明暗主题、键盘、三个交互工作区和 reduced-motion 通过；外链到上游固定提交与研究条目；Pages 成功发布 |

## 设计方向

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 一句结论 → 五层架构 → 环境启动序列 → 隔离边界 → 后期价值 → 研究决策 | 首屏不把它描述成自研内核或登录绕过器 | 首屏标题与架构图在桌面和手机首屏均可理解 |
| 视觉语言 | 深蓝黑文本、暖白纸面、酸绿色控制信号、蓝紫协议层；暗色主题保持相同语义 | 颜色只加强层级，不独立承担含义 | 所有状态同时有文字、序号或轮廓差异 |
| 字体角色 | 系统无衬线负责正文，等宽系统字体负责协议、状态和技术标签 | 不加载远程字体 | 首屏、卡片与代码标签在三种视口不截断关键语义 |
| 架构图 | 用 CSS 网格和连线表达真实 Chromium 与上层编排 | 不依赖 Canvas/WebGL | 无 JS 时仍有完整文字摘要；图形失败不影响核心内容 |
| 交互 | 原生 button/tab 语义切换架构层、生命周期步骤和未来场景 | 键盘可达、焦点可见、状态写入 ARIA | 点击、Tab、方向键和主题切换均有可见结果 |
| 动效 | 仅用于选中态和连接流提示 | reduced-motion 下取消非必要动画和长过渡 | 浏览器模拟 `reduce` 时主要过渡接近零 |

## 覆盖清单

| 用户阶段 | 要求或产物 | Surface / state | 证据 | Owning stage | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 新建子项目 | 可运行静态页面 | 本地 canonical runtime | 浏览器可访问、DOM 可见 | Stage 1 | `pass` | — |
| 网页整理 | 首屏准确表达核心定位 | Desktop light 1440px | 截图和文字断言 | Stage 2 | `pass` | — |
| 网页整理 | 五层架构及 CDP/RPA/MCP 原理 | Architecture workspace | 点击、方向键与面板更新 | Stage 4–5 | `pass` | — |
| 网页整理 | Profile 启动与隔离序列 | Lifecycle workspace | 六步骤切换与结果断言 | Stage 5 | `pass` | — |
| 网页整理 | 后期价值与触发条件 | Value workspace | 四场景切换与结果断言 | Stage 5–6 | `pass` | — |
| 网页整理 | 隔离边界与审计发现 | Static content | DOM 断言 | Stage 3 | `pass` | — |
| 跨端验收 | 明暗主题 | Desktop light/dark | 截图、主题状态、Axe | Stage 7 | `pass` | — |
| 跨端验收 | 桌面、平板、手机 | 1440 / 768 / 390px | 截图、无横向溢出 | Stage 7 | `pass` | — |
| 跨端验收 | 键盘与可访问性 | Primary journey | 焦点顺序、方向键、Axe | Stage 7 | `pass` | — |
| 跨端验收 | reduced-motion 和无 JS 摘要 | Capability fallback | 浏览器模拟与截图 | Stage 8 | `pass` | — |
| 外部 README | 项目介绍、运行方式、源库关联 | App README | 文件与链接检查 | Stage 9 | `pass` | — |
| 外层索引 | 根 README、apps README、站点首页 | Repository surfaces | 文件与链接检查 | Stage 9 | `pass` | — |
| 远端部署 | GitHub Pages 子路径 | Production URL | Actions/HTTP 验证 | Stage 9 | `continue` | 修改工作流并推送 |
| 远端提交 | 只提交 OpenBrowser 相关变更 | Git commit / origin main | commit 与远端状态 | Stage 9 | `continue` | 精确暂存、提交、推送 |

## 非目标

- 不运行或嵌入 OpenBrowser、Chromium、CDP 或 MCP 服务。
- 不演示账号登录、代理、指纹绕过、验证码或多账号运营。
- 不复制上游界面、商标、第三方内核或源代码。
- 不把源码审查推断包装成真实网站兼容性或匿名性验证。
