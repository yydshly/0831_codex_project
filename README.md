# 0831 Codex Project

> 一个用于研究优秀 GitHub 开源项目、沉淀可复用结论并展示验证型 Demo 的总项目库。

本仓库聚焦于项目的设计思路、架构取舍、关键实现和可复用经验。每个研究条目都会记录上游来源、研究基线与许可证；必要时可附带最小实验或静态 Web Demo，但不会默认镜像完整的第三方仓库。

## 研究索引

| 研究项目 | 上游仓库 | 研究重点 | 状态 | 研究笔记 | Demo | 最近更新 |
| --- | --- | --- | --- | --- | --- | --- |

> 新条目会按 `owner-repository` 命名并加入此表。研究状态统一使用 `planned`、`studying`、`validated` 或 `archived`。

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
