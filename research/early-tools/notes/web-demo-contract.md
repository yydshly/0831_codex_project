# Web Demo 设计契约

## Contract

```text
Entry mode: revision-led refinement（基于已验证 Web Demo）
Request revision: 2
Target user and context: 希望快速理解 early.tools 的中文用户，以及本仓库的研究者、产品团队和创业者
Desired first impression: 这是一个先交代“信息从哪里来、如何被加工、能信到什么程度”，再解释能力与价值的早期产品情报地图
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 原创中文编辑式界面；高对比；无需外部字体、图片、脚本或 CDN；不复制 early.tools UI
Information constraints: 中文优先；数据来源提升为一级信息；已确认事实、合理推断、未知项、对我们的意义、边界和扩展建议明确分层；数量固定到 2026-09-01 快照
Operation constraints: 纯静态前端；无后端、登录、支付、会员数据抓取或真实 early.tools API
State constraints: 能力选择、角色选择、明暗主题和收起/展开状态需要可理解反馈；核心内容无脚本时仍有摘要
Environment constraints: Vite + Vanilla JavaScript；支持相对资源路径与 GitHub Pages 子路径
Primary journey: 阅读一句话定位 → 理解五类数据来源及处理链 → 判断可信度 → 选择角色查看对我们的意义 → 选择子库理解能力 → 阅读工作原理、场景与扩展路线
User-defined phases: 信息收集来源梳理；能力整理；中文介绍和解释；对我们的意义
Required artifacts: 可运行 Web 页面、README、设计契约、浏览器验证记录、根索引与研究条目入口
Autonomy authorization: 用户明确要求使用 Web 方式整理；允许在现有仓库内直接创建关联 Demo
User-decision boundary: 不引入真实服务、账号、后端、支付或对外发布；如需上线或改变品牌方向再询问
Observable completion criteria: 页面可构建；信息来源作为一级章节可从首屏直接到达；五类来源、确认程度、数据处理链和我们的复用原则清晰；1440px、768px、390px 可读且无根级横向溢出；角色和能力选择、主题切换、折叠、键盘路径可运行；reduced-motion 不依赖动画传达信息；中文事实和边界准确
Coverage record: 见下表
```

## 设计方向

| 决策 | 选择 | 服务目标 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- | --- |
| 信息层级 | 结论先行，随后来源链、角色意义、库能力、原理、场景和扩展 | 用户先知道“它是什么、数据从哪里来”，再判断用途 | 首屏只保留一个主结论；来源章节紧随规模概览 | 5 秒内能复述定位，继续阅读可区分确认来源与推断来源 |
| 视觉语言 | 原创“产品情报编辑部”：纸张色、深墨色、蓝青主色、琥珀提示色 | 体现研究和可读性，不复刻上游 | 颜色承担语义而非装饰 | 明暗主题都保持层级和对比 |
| 交互 | 角色切换与能力卡片选择 | 把同一平台对不同人的价值解释清楚 | 所有控制均为语义按钮、支持键盘 | 选择后标题、结论和建议同步更新 |
| 数据可视化 | CSS 比例条和简洁数字卡 | 解释产品组成而不引入图表依赖 | 数值同时有文字，不只靠颜色 | 屏幕阅读和窄屏仍能理解 |
| 运动 | 小范围状态与入场过渡 | 解释选择变化 | reduced-motion 下关闭非必要动画 | 信息不因关闭动画而丢失 |

## Coverage Manifest

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | 所属阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 信息收集来源梳理 | 五类数据来源、确认程度和字段示例 | Desktop / light | `web-demo-sources-1440-light.png` 与 DOM 断言 | Stage 3 | `pass` | — |
| 信息收集来源梳理 | 来源 → 审核 → 规范化 → 跟踪 → 分发的数据链 | Desktop / light + dark | 双主题来源截图与内容检查 | Stage 3 | `pass` | — |
| 信息收集来源梳理 | 对我们的复用原则 | Desktop / light | `web-demo-source-principles.png` | Stage 6 | `pass` | — |
| 信息收集来源梳理 | 窄屏阅读与无障碍 | 768 / 390 / keyboard | 来源手机截图、宽度断言与 Axe | Stage 7 | `pass` | — |
| 能力整理 | 一句话定位与规模概览 | Desktop / light | `web-demo-1440-light.png` | Stage 2 | `pass` | — |
| 能力整理 | 七个能力库可选择并解释 | Desktop / selected states | `web-demo-library-experiments.png`、DOM 断言 | Stage 5 | `pass` | — |
| 中文介绍和解释 | 原理、边界、场景均为中文 | Desktop / content flow | 页面内容与浏览器检查 | Stage 3 | `pass` | — |
| 对我们的意义 | 四类角色切换并显示价值与建议 | Desktop / 4 states | `web-demo-role-builder.png`、DOM 断言 | Stage 5 | `pass` | — |
| 扩展方向 | P0–P3 路线和优先级 | Desktop / expanded | 折叠状态断言与视觉检查 | Stage 3 | `pass` | — |
| 交付 | 明暗主题 | Desktop / light + dark | `web-demo-1440-light.png`、`web-demo-1440-dark.png` | Stage 7 | `pass` | — |
| 交付 | 响应式 | 1440 / 768 / 390 | 三视口截图与宽度断言 | Stage 7 | `pass` | — |
| 交付 | 键盘和可见焦点 | Keyboard | ArrowRight 焦点与选中态断言 | Stage 7 | `pass` | — |
| 交付 | reduced-motion | OS emulation | 媒体查询与计算样式 | Stage 7 | `pass` | — |
| 交付 | 构建与静态子路径 | Production build | `npm run build` | Stage 9 | `pass` | — |
| 交付 | README、验证记录和索引 | Repository files | 文件与相对链接检查 | Stage 9 | `pass` | — |

## 支持边界

- 支持 light 与 dark 两种主题。
- 支持现代桌面与移动浏览器；不承诺 IE 或无 CSS 环境。
- 无 JavaScript 时显示核心定位、能力和边界摘要，但交互式筛选不可用。
- 所有数量都是 2026-09-01 公开快照，不模拟实时同步。
- 页面不提供 early.tools 的产品访问、提交、登录、付费或会员解锁功能。
