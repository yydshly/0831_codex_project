# 技术能力研究网页交付契约

## Design contract

```text
Entry mode: Brief-led greenfield implementation
Request revision: 2
Target user and context: 需要快速判断该仓库技术能力、边界和复用价值的技术负责人、产品研究者与工程师
Desired first impression: 一张可信、克制、层次清晰的技术能力图谱，而不是产品宣传页或文档堆叠
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 高信息密度但不拥挤；语义色区分本地、云端、混合与缺失实现；支持浅色/深色；不用外部图片或字体
Information constraints: 必须覆盖能力、能力范围、实现原理、使用场景、扩展方向、参考价值；事实、源码审查与研究判断必须区分
Operation constraints: 纯静态前端；不接后端、不登录、不调用真实 AI/STT/TTS；通过仓库现有 GitHub Pages 聚合工作流发布
State constraints: 能力分类筛选、技术链路步骤选择、主题切换、窄屏导航；所有信息在禁用 JavaScript 时仍有摘要入口
Environment constraints: 独立 Vite + TypeScript；相对资源路径；目标 1440×1000、768×900、390×844；键盘可达；prefers-reduced-motion
Primary journey: 首屏理解定位与边界 → 浏览/筛选能力 → 选择技术链路步骤 → 对照本地/云端/缺失源码边界 → 阅读场景、扩展方向与参考价值 → 查看证据来源
User-defined phases: 能力分析；能力范围；实现原理；使用场景；可扩展方向；可参考价值；网页展示；远端 GitHub 发布与索引
Required artifacts: 可运行网页、应用 README、研究与站点索引、设计契约、浏览器验证记录、桌面/平板/手机最终证据截图、GitHub Pages 在线页面
Autonomy authorization: 用户在 revision 2 明确要求将架构理解接入 Web、部署到远端 GitHub、整理信息并提交；授权修改现有 Pages 工作流、站点与相关索引
User-decision boundary: 只有新增后端、真实外部调用、改变研究结论或扩大到无关工作区改动时需要用户决定
Observable completion criteria: 页面可构建和预览；六类研究内容完整；主摘要统一；筛选/步骤/主题可操作；桌面/平板/手机无关键裁切；键盘焦点可见；reduced-motion 不隐藏信息；来源链接锚定固定提交；Pages workflow 成功且线上页面可访问
Coverage record: 见下表
```

## 授权变更记录

- Revision 1：用户要求先完成技术研究与网页展示，明确暂不部署。
- Revision 2：用户随后明确要求将主摘要和架构理解接入 Web，部署到远端 GitHub，并整理 README 与索引后提交；因此部署、工作流和远端验证进入本次授权范围。

## Brief-led design direction

| 决策 | 选择 | 为什么适合目标 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- | --- |
| 构图 | 研究封面 + 粘性目录 + 分段长页 | 支持从总览逐层深入 | 首屏只承担定位、边界和主要入口 | 1440 与 390 首屏都能识别“是什么、研究什么” |
| 焦点层级 | “训练材料加工流水线”作为唯一主命题 | 它是仓库最有复用价值的技术闭环 | 次级指标和装饰不得压过主命题 | 首次扫描先看到核心闭环和本地/云端边界 |
| 字体角色 | 系统无衬线正文 + 紧凑技术标签 + 等宽代码 | 离线稳定且适合技术内容 | 正文行宽控制，标签不替代正文 | 中英文在三种视口均不溢出 |
| 颜色语义 | 蓝=主交互，绿=本地，橙=云端，紫=混合，灰=仓库缺失 | 直接表达能力边界 | 颜色之外保留文字和图形标签 | 黑白/弱色觉下仍能读懂含义 |
| 材质与深度 | 纸张式分区、细边框、极轻阴影 | 呈现研究档案而非营销卡片 | 不使用重玻璃、连续背景动画 | 长页滚动中区域边界清楚 |
| 密度 | 先摘要、后展开；卡片统一限制摘要长度 | 兼顾决策者和工程师 | 同屏不堆叠过多长段落 | 能力卡首屏可扫读，细节按需展开 |
| 交互 | 筛选、步骤选择、主题切换、跳转目录 | 交互服务于理解，不模拟真实产品 | 无真实网络请求和伪造运行数据 | 所有控件有可见状态和键盘语义 |
| 动效 | 仅状态切换和进入反馈；reduced-motion 关闭 | 不分散对技术内容的注意力 | 无连续或强制动画 | reduced-motion 下信息与布局不变 |

## Coverage manifest

| 用户阶段 | 要求或产物 | 表面 / 状态 | 所需证据 | Owning stage | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| 能力分析 | 全景图、核心能力地图与分类筛选 | 桌面/手机，全部与分类状态 | 五阶段全景图；12 项能力；语音筛选返回 3 项；详情面板通过 | Stage 3/5 | `pass` | 无 |
| 能力范围 | 本地、云端、混合、缺失源码边界 | 边界矩阵 | 四类边界矩阵与源码边界图完成 | Stage 3 | `pass` | 无 |
| 实现原理 | 媒体、STT、DTW、训练、评测与 AI 链路 | 六步步骤选择 | 选择“对齐”后显示 DTW forced alignment | Stage 5 | `pass` | 无 |
| 使用场景 | 学习者、内容创作者、研究者、产品团队 | 场景卡 | 6 类场景、适用等级和前提完成 | Stage 3/7 | `pass` | 无 |
| 可扩展方向 | 近期、中期、重构级扩展及约束 | 扩展路线 | 9 项路线；中期筛选返回 3 项 | Stage 3 | `pass` | 无 |
| 参考价值 | 可复用模式、谨慎项和研究结论 | 价值区 | 4 项判断、4 个可复用模式和 4 个谨慎项 | Stage 3 | `pass` | 无 |
| 网页展示 | 独立 Vite + TypeScript 应用 | canonical runtime | Vite dev 与生产构建均通过 | Stage 1/9 | `pass` | 无 |
| 主题 | 浅色与深色完整可读 | light/dark + 双向切换 | 两主题截图；Enter 双向切换通过 | Stage 6/7 | `pass` | 无 |
| 响应式 | 1440、768、390 无关键裁切 | 三视口 | 三视口 `scrollWidth <= innerWidth` | Stage 7 | `pass` | 无 |
| 键盘 | 目录、筛选、步骤、主题均可达 | Tab/Enter/Space | 首个 Tab 到 skip link；Enter 聚焦 main；主题按钮 Enter 可用 | Stage 7 | `pass` | 无 |
| Reduced motion | 关闭非必要动画 | reduced-motion | 浏览器模拟返回 `matches = true`，信息完整 | Stage 7/8 | `pass` | 无 |
| 工程质量 | 类型检查、生产构建、无控制台错误 | CLI/runtime | `npm run check`、`npm run build`、浏览器 errors 均通过 | Stage 9 | `pass` | 无 |
| 文档 | README、契约、验证与交接完整 | 文件 | 应用 README、验证记录和交接文档完成 | Stage 9 | `pass` | 无 |
| 远端发布 | 统一 GitHub Pages 子路径 | workflow / artifact / online | Run 33459561107 成功；HTML/JS/CSS 200；桌面与手机浏览器复验通过 | Stage 10 | `pass` | 无 |

## 支持边界

- 页面只展示固定提交的技术研究，不声称代表 2026 年新版 Web 的全部实现。
- 页面中的流程和指标是源码解释，不调用或模拟真实识别质量、评分结果和计费。
- 只修改仓库既有 GitHub Pages 聚合工作流和相关索引，不创建第二套发布系统。
- 不复制上游截图、商标素材或大体积媒体；视觉完全由 HTML/CSS 构成。
