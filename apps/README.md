# Web Demo 区

`apps/` 用于保存与研究条目相关的可运行 Web Demo。Demo 应服务于某个明确的研究问题或验证目标，而不是无来源的项目集合。

## 应用约定

```text
apps/<app-slug>/
├─ README.md        # 关联研究、运行方式、部署地址与限制
├─ package.json     # 按技术栈需要创建
├─ src/
└─ ...
```

- 每个应用自包含依赖、锁文件、构建配置和说明，不预设统一前端框架。
- JavaScript/TypeScript 应用建议提供 `npm run build`，并输出到应用内的 `dist/`。
- 应用不得包含密钥；GitHub Pages 中的所有静态资源均视为公开内容。
- 应用 README 必须链接相关的 `research/<owner>-<repository>/` 条目。

## GitHub Pages 部署

本仓库只使用一个 GitHub Pages 站点。`.github/workflows/pages.yml` 负责构建需要发布的 Demo，并汇总为单个 Pages artifact：

```text
pages-dist/
├─ index.html
└─ demos/
   ├─ <app-a>/
   └─ <app-b>/
```

默认访问路径规划为：

```text
https://yydshly.github.io/0831_codex_project/
https://yydshly.github.io/0831_codex_project/demos/<app-slug>/
```

因此每个应用都要支持 `/0831_codex_project/demos/<app-slug>/` 资源基路径，或只使用可靠的相对路径。单页应用优先使用 hash 路由；GitHub Pages 不提供普通服务器式的 history fallback。

当前在线 Demo：

| Demo | 在线地址 | 构建来源 |
| --- | --- | --- |
| BotVod 媒体系统能力地图 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/botvod-capability-lab/) | `apps/botvod-capability-lab` |
| early.tools 中文能力地图 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/early-tools-capability-lab/) | `apps/early-tools-capability-lab` |
| OpenBrowser 原理与后期价值地图 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/) | `apps/openbrowser-architecture-lab` |
| Everyone Can Use English 技术能力图谱 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/) | `apps/everyone-can-use-english-capability-lab` |
| Write Then Publish 独立研究档案 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/write-then-publish-lab/) | `apps/write-then-publish-lab` |
| OPC Skills 能力与方法地图 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/) | `apps/opc-skills-capability-lab` |
| XPADE Face Liquify 能力实验室 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/xpade-face-liquify-lab/) | `apps/xpade-face-liquify-lab` |
| RealHuman 场景产品中心 V2 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/) | `apps/realhuman-scenario-showcase` |

后续新增 Demo 时，在工作流的构建与 artifact 汇总步骤中增加对应子路径，并同步更新根 README 和本索引。
