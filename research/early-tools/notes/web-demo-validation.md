# Web Demo 验证记录

本文件记录 2026-09-01（Asia/Shanghai）完成的生产构建与真实浏览器验证。结论只使用 `pass`、`defer`、`blocked`；本轮交付项均为 `pass`。

## 运行环境

- Demo：`apps/early-tools-capability-lab`
- 工具链：Node.js 22.15.0、npm 10.9.2、Vite 7.3.6。
- 浏览器：Google Chrome 151.0.7922.174，通过 Playwright Core 驱动本机 Chrome。
- 验证 URL：`http://127.0.0.1:4178/`。
- 支持主题：light、dark。
- 验证视口：1440×1000、768×900、390×844。
- 数据基线：2026-09-01 的 early.tools 公开网页快照；不访问会员内容，不执行外部写操作。

## 浏览器证据

| 表面 / 状态 | 证据 | 决策 |
| --- | --- | --- |
| 1440px light 首屏 | [截图](../assets/web-demo-1440-light.png) | `pass` |
| 1440px dark 首屏 | [截图](../assets/web-demo-1440-dark.png) | `pass` |
| 768px light 首屏 | [截图](../assets/web-demo-768-light.png) | `pass` |
| 390px light 首屏 | [截图](../assets/web-demo-390-light.png) | `pass` |
| 五类数据来源与处理链（light） | [截图](../assets/web-demo-sources-1440-light.png) | `pass` |
| 五类数据来源与处理链（dark） | [截图](../assets/web-demo-sources-1440-dark.png) | `pass` |
| 来源、时间、置信度三项原则 | [截图](../assets/web-demo-source-principles.png) | `pass` |
| 390px 数据来源入口 | [截图](../assets/web-demo-sources-390-light.png) | `pass` |
| 390px 无 JavaScript 来源摘要 | [截图](../assets/web-demo-390-noscript.png) | `pass` |
| “我们做产品”角色状态 | [截图](../assets/web-demo-role-builder.png) | `pass` |
| “验证实验库”能力状态 | [截图](../assets/web-demo-library-experiments.png) | `pass` |

## 构建与功能检查

| 覆盖项 | 可复现方式或浏览器证据 | 观察结果 | 决策 |
| --- | --- | --- | --- |
| 生产构建 | `npm run build` | Vite 构建成功，产出静态 HTML、CSS 与 JavaScript | `pass` |
| 首屏定位 | 四视口截图与 DOM 断言 | 一句话结论、公开规模、边界和主操作均可见 | `pass` |
| 数据来源层级 | DOM 顺序与来源章节截图 | 五类来源位于角色价值和能力库之前，首屏主操作可直接到达 | `pass` |
| 来源确认程度 | 5 个来源卡与图例断言 | 已确认与“结果可见、采集方式未完全公开”未混写 | `pass` |
| 信息处理链 | 5 个处理步骤断言 | 输入、审核、规范化、跟踪、分发顺序完整 | `pass` |
| 对我们的复用原则 | 3 个原则断言和截图 | 来源、时间、置信度均有独立说明，并列出当前缺口 | `pass` |
| 角色解释 | 点击四个角色标签；对 builder 状态做文本与选中态断言 | 标题、解释、收益和行动建议同步更新 | `pass` |
| 七类能力库 | 点击能力标签；对 experiments 状态做文本与选中态断言 | 数量、收集内容、价值、样例和边界同步更新 | `pass` |
| 路线图 | 连续点击首项 summary | `details.open` 能正确收起和重新展开 | `pass` |
| 明暗主题 | 点击主题按钮并读取根节点与 `aria-pressed` | 主题与辅助状态双向同步 | `pass` |
| 键盘路径 | 聚焦角色标签后发送 `ArrowRight` | 焦点和选中态移动到下一角色 | `pass` |
| 响应式 | 1440、768、390 的 `scrollWidth` 与 `clientWidth` | 三种宽度均无根级横向溢出 | `pass` |
| reduced motion | 浏览器模拟 `prefers-reduced-motion: reduce` | 媒体查询命中，非必要过渡降到 `0.01ms` | `pass` |
| 远程运行时依赖 | 检查 Performance Resource Timing | 外部资源列表为 `[]` | `pass` |
| 控制台 | 监听 `console.error` 与 `pageerror` | 四轮均无错误 | `pass` |
| 自动无障碍检查 | 四个表面运行 Axe WCAG 2/2.1 A、AA 规则 | 四轮均为 0 violations | `pass` |
| 无脚本回退 | 在 390px Context 禁用 JavaScript | 定位、对我们的意义、五类来源摘要和边界可读，无横向溢出 | `pass` |

Axe 对网格渐变、透明背景和 `color-mix()` 组合下的部分文字给出 `color-contrast` incomplete，无法自动计算最终底色；本轮已用截图人工检查，并修正了自动审计最初识别出的 5 处实际对比度问题。这里的 `0 violations` 不应被解释为对所有视觉组合的形式化 WCAG 认证。

## Refinement ledger

| 阶段 | 覆盖项 | 证据 | 观察结果 | 决策 |
| --- | --- | --- | --- | --- |
| Stage 0 | 目标、范围与边界 | `web-demo-contract.md` Revision 2 | 信息来源提升为一级主线；原创表达和不接真实服务的边界保留 | `pass` |
| Stage 1 | 公开研究基线 | 研究 README 与 evidence | 五类来源、数量、公开能力、事实和推断已分层 | `pass` |
| Stage 2 | 信息架构 | 首屏、来源、角色、能力库、原理、场景、路线 | 从定位到来源可信度，再到能力与采用判断的阅读路径完整 | `pass` |
| Stage 3 | 可运行基线 | Vite 开发服务与生产构建 | 页面加载完成，无错误遮罩 | `pass` |
| Stage 4 | 视觉系统 | light/dark 来源截图与三视口截图 | 来源卡、确认状态和处理链在双主题中层级稳定 | `pass` |
| Stage 5 | 核心交互 | 角色、能力、路线图与主题断言 | 状态、文本和 ARIA 同步 | `pass` |
| Stage 6 | 内容与事实边界 | 来源图例、来源原则、研究笔记 | 已确认来源、部分确认、未知采集方式和研究建议未混写 | `pass` |
| Stage 7 | 响应式与可访问性 | 三视口、键盘、Axe、reduced motion | 无根级溢出；Axe 0 violations | `pass` |
| Stage 8 | 回退与依赖 | `noscript` 摘要、远程资源检查 | 无脚本仍有核心说明；无远程运行时资源 | `pass` |
| Stage 9 | 工程交付 | 锁文件、README、验证脚本和索引 | 安装、构建和浏览器验证可复现 | `pass` |

## 已知边界

- 页面使用固定快照，不会随 early.tools 数据变化自动更新。
- 验证脚本默认从 Windows Chrome 路径启动浏览器；其他系统可通过 `CHROME_PATH` 指定可执行文件。
- Demo 不测试 early.tools 的登录、提交、支付、会员、CSV 导出或 Sponsor 流程。
- 页面中的扩展路线是本研究建议，不是 early.tools 已公开承诺的 Roadmap。
