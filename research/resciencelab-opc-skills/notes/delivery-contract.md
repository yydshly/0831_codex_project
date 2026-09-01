# OPC Skills 子项目交付契约

```text
Entry mode: Revision-led migration into the existing umbrella repository
Request revision: 8
Target user and context: 在统一研究站点理解 OPC Skills 能力、边界和个人化方法的中文用户
Desired first impression: 这是可被真实项目和复盘改写的探索脚手架，不是自动创业答案
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 保留原有黑白像素/终端语言与克制琥珀色；静态页面完整可读
Information constraints: 覆盖十个 Skills、四类判断输入、多项目探索、人类决策门、真实证据和限制
Operation constraints: 搜索、阶段/状态筛选、details、已验证记录打开/浏览/重置、键盘可达
State constraints: 默认、筛选、零结果、公开回放入口、最近记录、完成、重置、reduced motion
Environment constraints: 归入 0831_codex_project 的 research/apps 结构；GitHub Pages 静态托管；依赖只安装在子项目；不提交完整上游克隆
Primary journey: 从想法开始 → 检查十项能力和平台 → 查看真实取证与失败 → 理解认知纠偏 → 查看沉淀资产并保留个人决策权
User-defined phases: 汇总理解；关联网页和演示；作为父仓库子项目提交；通过统一 GitHub Pages 部署
Required artifacts: 研究条目、能力/方法笔记、静态 Demo、真实证据、Pages 工作流入口、索引、浏览器验证
Autonomy authorization: 用户明确要求按已关联父仓库的子项目方式提交和部署
User-decision boundary: 新增外部凭据、改变上游 Skill 行为或提交其他未完成项目
Observable completion criteria: 父仓库只暂存 OPC 相关文件；构建通过；桌面/平板/390px 主流程、筛选、回放、键盘与 reduced motion 通过；GitHub Pages 工作流成功；线上路径可访问
```

## 覆盖记录

| 要求 | 表面/状态 | 证据 | 状态 | 下一步 |
| --- | --- | --- | --- | --- |
| 研究条目与方法/能力总结 | `research/resciencelab-opc-skills` | 文件和链接检查 | pass | 无 |
| 静态能力地图 | 本地构建 | 构建输出与浏览器 | pass | 无 |
| 已验证真实研究回放 | 想法、能力探索、取证、纠偏、沉淀、完成、重置 | 浏览器、十份公开研究资产与原始工具运行 | pass | 无 |
| 响应式、键盘、reduced motion | 1440/768/390 | 浏览器证据 | pass | 无 |
| 父仓库索引 | 根 README、apps README、site 首页 | 差异和链接检查 | pass | 无 |
| GitHub Pages | 工作流、线上子路径 | Actions 与生产浏览器 | pass | 无 |

## 本地验证记录

- 时间：`2026-09-01T11:40:00+08:00`
- 构建：在 `apps/opc-skills-capability-lab` 执行 `npm install`、`npm run build`，输出十份公开研究资产和两份数据记录。
- 规范本地地址：`http://127.0.0.1:8791/`
- 默认页：10 张能力卡、真实研究轨迹入口和所有四张上游图片均加载；无错误覆盖层。
- 真实轨迹：依次显示 `IDEA`、`CAPABILITY EXPLORATION`、`LIVE EVIDENCE`、`REFRAMING`、`ACCUMULATION`；最终焦点移动到沉淀标题。
- 概念边界：主线说明理解如何变化；Reddit 403、GitHub Issues、RDAP、SEO 和 Archive 仅作为证据层，页面没有把技术执行表述为市场验证。
- 交互：搜索 `SEO` 返回 1 张卡；重置恢复 10 张；回放重置返回想法入口并把焦点交还按钮。
- 视口：`1440px`、`768px`、`390px` 均为 `0px` 水平溢出。
- 可访问性：键盘首焦点为“跳到主要内容”；reduced-motion 命中，动画缩短为 `0.00001s`，滚动变为 `auto`。
- 资源：`latest-run.json`、`raw-tool-run.json` 和十份公开资产均返回 HTTP 200；浏览器 console 与 page errors 为空。
- 页面截图保存在被忽略的 `.tmp/`，不提交到产品仓库。

## 生产验收记录

- 首次提交：[`475a922`](https://github.com/yydshly/0831_codex_project/commit/475a922bce3f85e6fc52a6bff926a265cdcf1b5b)
- Pages 工作流：[`33466639740`](https://github.com/yydshly/0831_codex_project/actions/runs/33466639740)，结论 `success`
- 线上首页：<https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/>
- 最终阶段深链接：<https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/?run=latest#interactive-demo>
- 默认页：标题正确、10 张能力卡、运行状态为 `GitHub 已验证记录`、正文约 5,000 字符、水平溢出 `0px`。
- 深链接：直接恢复“沉淀”阶段，状态为 `EVIDENCE ARCHIVED`，当前阶段 6 份产物、全程 10 份公开资产、0 个自动市场结论。
- 移动端：`390 × 844` 视口水平溢出 `0px`。
- 公开交付说明返回 HTTP 200；浏览器 console 与 page errors 为空。
