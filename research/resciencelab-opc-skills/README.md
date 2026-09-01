# ReScienceLab OPC Skills

> 一套面向一人公司的 Agent Skill 探索脚手架：它提供可重复的方法和工具，不替创业者做最终判断。

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 上游仓库 | <https://github.com/ReScienceLab/opc-skills> |
| 研究基线 | `6ff218dfc5316c231309e0c1a74eda6d78161697` |
| 上游许可证 | [Apache License 2.0](https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/LICENSE) |
| 研究状态 | `validated` |
| 首次研究 | `2026-09-01` |
| 最近更新 | `2026-09-01` |
| 标签 | `agent-skills, solopreneur, opportunity-research, branding, seo, memory` |

## 核心理解

OPC Skills 不是一个自动经营公司的应用，也不是搜索一次就能给出创业答案的系统。它把需求研究、品牌入口、视觉表达、搜索增长与经验归档拆成十个可组合 Skills。

最有价值的使用方式是：

```text
用同一套方法探索 3–5 个真实候选
→ 保存证据和反例
→ 横向比较
→ 加入个人经验、资源、兴趣和用户关系
→ 执行最小现实动作
→ 根据反馈复盘
→ 改写自己的提问、权重、Skill 与停止条件
```

因此：仓库提供方法，Agent 负责搜集和整理，现实提供反馈，人保留继续、补充研究或停止的最终决策权。

## 能力范围

| 阶段 | Skills | 能力 |
| --- | --- | --- |
| 发现与验证 | `requesthunt`、`reddit`、`twitter`、`producthunt` | 发现公开需求、痛点语言、竞品和趋势信号 |
| 品牌入口 | `domain-hunter` | 生成域名候选并组织购买前检查 |
| 视觉表达 | `nanobanana`、`logo-creator`、`banner-creator` | 生成、选择、裁切和交付品牌素材 |
| 搜索增长 | `seo-geo` | 检查页面 SEO、关键词、SERP 与 AI 搜索可见性 |
| 经验沉淀 | `archive` | 保存判断、失败原因和下一轮可复用经验 |

完整逐项能力、依赖和实例见 [能力报告](notes/capabilities.md)，方法与平台选择见 [方法指南](notes/method.md)。

## 真实验证

支撑本次研究的一次项目内工具运行完成了五步真实链路：

1. 执行仓库 Reddit 探针并如实记录 HTTP 403，同时从 GitHub Issues API 获得 5 条公开信号；
2. 通过 RDAP 检查 3 个域名候选，并保留“无记录不等于可购买”的边界；
3. 根据证据生成最小落地页和机会简报；
4. 使用仓库 `seo-geo` 脚本审计刚生成的页面；
5. 使用 `archive` Hook 读取本轮记录，并为六份核心证据生成 SHA-256。

所有五步退出码均为 `0`。原始公开证据位于 [evidence/real-run](evidence/real-run/)，但工具运行只是研究证据层，不是 OPC 方法本身，更不是市场结论。交互 Demo 的主线按实际理解过程组织为：想法提出、能力探索、真实取证、认知纠偏和资产沉淀。

## Demo

- 源码：[apps/opc-skills-capability-lab](../../apps/opc-skills-capability-lab/README.md)
- 在线能力地图：<https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/>
- 已验证记录：<https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/?run=latest#interactive-demo>

## 可复用结论

- 平台数量不是目标；应按“问题、搜索、竞品、付费”四类证据选择互补来源。
- 单一热度、Agent 评分和创始人兴趣都不能独立完成项目决策。
- 一套 Skill 只有经过多项目复用、现实行动和复盘改写，才会逐渐成为个人创业操作系统。
- 外部数据 Skill 必须公开凭据、登录、网络、价格和平台稳定性边界。

## 变更记录

- `2026-09-01`：完成十个 Skills 能力审计、方法总结、真实研究轨迹、支撑证据归档与静态交互 Demo。
