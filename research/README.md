# 研究区

`research/` 保存对优秀 GitHub 项目、公开产品或相关主题的结构化研究。每个一级子目录对应一个研究单元；单一 GitHub 仓库默认命名为：

```text
research/<owner>-<repository>/
```

根 README 为每个条目分配稳定的三位研究编号。编号只用于索引和跨 Demo 关联，不写入目录名；已经发布的编号不修改、不复用，新条目从当前最大编号继续递增。

当一个研究单元包含多个互补仓库、网页来源或原创延伸时，使用含义明确的稳定 `kebab-case` slug，并在条目 README 中完整列出来源与关系。

## 推荐结构

```text
research/<owner>-<repository>/
├─ README.md        # 项目信息、结论与入口
├─ notes/           # 可选：专题笔记
├─ experiments/     # 可选：最小验证代码
├─ patches/         # 可选：补丁或差异文件
└─ assets/          # 可选：合规素材
```

从 [`_template/README.md`](_template/README.md) 开始创建新条目。条目 README 是该研究项目的事实入口；较长的主题再拆入 `notes/`，避免让根目录 README 变成细节堆积。

## 内容边界

- 记录“为什么值得研究”和“哪些结论已经验证”，不只做功能摘录。
- 对事实、推断和个人评价作清晰区分。
- 记录研究所依据的 commit 或 tag，避免上游变化后结论失去语境。
- 记录上游许可证；引用代码或素材时同时保留必要的权利声明。
- 完整上游源码默认只放在本地 `sources/`，不提交进总库。
