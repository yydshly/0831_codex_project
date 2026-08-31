# 0831 Codex Project

> 一个用于研究优秀 GitHub 开源项目、沉淀可复用结论并展示验证型 Demo 的总项目库。

本仓库聚焦于项目的设计思路、架构取舍、关键实现和可复用经验。每个研究条目都会记录上游来源、研究基线与许可证；必要时可附带最小实验或静态 Web Demo，但不会默认镜像完整的第三方仓库。

## 研究索引

| 研究项目 | 上游仓库 | 研究重点 | 状态 | 研究笔记 | Demo | 最近更新 |
| --- | --- | --- | --- | --- | --- | --- |
| Microduck 机器人与强化学习 | [microduck](https://github.com/pollen-robotics/microduck) · [microduck_rl](https://github.com/pollen-robotics/microduck_rl) | 从 MuJoCo/PPO/Sim2Real 到 50 Hz 实机运行时的完整链路，以及能力边界和研究价值 | `studying` | [研究笔记](research/pollen-robotics-microduck/README.md) | [官方模拟器](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) | 2026-09-01 |

> 新条目会按 `owner-repository` 命名并加入此表。研究状态统一使用 `planned`、`studying`、`validated` 或 `archived`。

Microduck 条目将两个互补仓库作为一个系统研究：`microduck_rl` 负责仿真、PPO 训练、执行器建模与 ONNX 导出，`microduck` 负责实机推理、安全约束、通信和 OTA。它是机器人强化学习与产品化衔接的优秀案例，但不是通用机器人基础库，也不是已经完成的自主智能体方案。

## Web Demo 索引

| Demo | 关联研究 | 简介 | 在线地址 | 源码 | 状态 |
| --- | --- | --- | --- | --- | --- |

Web Demo 将汇总到同一个 GitHub Pages 站点，并通过独立子路径访问。具体约定见 [apps/README.md](apps/README.md)。

## 仓库结构

```text
.
├─ research/              # 研究条目、笔记、实验与补丁
│  └─ _template/          # 新研究条目的起始模板
├─ apps/                  # 可选的独立 Web Demo
├─ CONTRIBUTING.md        # 新增研究与 Demo 的操作约定
└─ README.md              # 对外摘要与总索引
```

- [研究区说明](research/README.md)
- [研究条目模板](research/_template/README.md)
- [Web Demo 约定](apps/README.md)
- [贡献与维护指南](CONTRIBUTING.md)

## 来源与许可证

第三方项目、代码片段、截图和其他素材仍受其各自许可证与权利声明约束。每个研究条目必须清楚标注上游仓库、研究基线和上游许可证。

本仓库目前未设置统一的开源许可证；后续会根据原创内容与第三方材料的边界单独确定。仓库中的研究观点不代表上游项目或其维护者。
