# 0831 Codex Project

> 一个用于研究优秀 GitHub 开源项目、沉淀可复用结论并展示验证型 Demo 的总项目库。

本仓库聚焦于项目的设计思路、架构取舍、关键实现和可复用经验。每个研究条目都会记录上游来源、研究基线与许可证；必要时可附带最小实验或静态 Web Demo，但不会默认镜像完整的第三方仓库。

当前重点案例：[BotVod 媒体系统能力地图](https://yydshly.github.io/0831_codex_project/demos/botvod-capability-lab/)——一句话理解：**BotVod 是把已知 URL 变成媒体资产的上游摄取样本，MediaCMS 是管理并分发已入库媒体的下游资产样本；我们应以可插拔 Source Adapter 与统一 Media Manifest 把两层连接起来。**

其他在线案例：[early.tools 中文能力地图](https://yydshly.github.io/0831_codex_project/demos/early-tools-capability-lab/)——从五类信息来源及其处理链出发，解释早期产品情报库如何形成、如何使用，以及为什么“来源、验证时间、置信度”比单纯扩大收录量更重要。

浏览器架构案例：[OpenBrowser 原理与后期价值地图](https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/)——明确它不是重新实现浏览器内核，而是在真实 Chromium 之上组织 Profile 隔离、CDP、RPA、Local API 与 MCP；当前保留架构认知，等 AI 浏览器执行器、企业 QA、RPA 或定制 Chromium 需求出现后再深入。

英语训练架构案例：[Everyone Can Use English 技术能力图谱](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/)——核心定位：**把任意内容加工成英语训练材料的工作台，而不是完整的英语教学体系。** 它用 Timeline / Segment 中间层连接内容获取、AI 处理、跟读训练、反馈与学习资产沉淀。

当前人像产品化版本：[RealHuman 场景产品中心 V2](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/)——在 XPADE V1 研究结论之上，把能力拆为照片、实时视频和扩展产品三条入口；V1 研究演示继续独立保留，不被 V2 覆盖。

## 研究索引

| 研究项目 | 上游仓库 | 研究重点 | 状态 | 研究笔记 | Demo | 最近更新 |
| --- | --- | --- | --- | --- | --- | --- |
| BotVod + MediaCMS 对照研究 | [BotVod](https://botvod.com/) · [MediaCMS](https://github.com/mediacms-io/mediacms) | 上游 URL 媒体摄取与下游资产管理分发如何通过 Source Adapter 和统一 Manifest 连接 | `validated` | [研究笔记](research/botvod-com/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/botvod-capability-lab/) | 2026-09-01 |
| Everyone Can Use English / Enjoy | [GitHub](https://github.com/ZuodaoTech/everyone-can-use-english) | 把任意内容加工成英语训练材料的工作台；研究内容接入、STT、DTW 时间轴、跟读反馈、AI 节点和本地学习资产 | `studying` | [研究笔记](research/zuodaotech-everyone-can-use-english/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/) | 2026-09-01 |
| early.tools | [在线网页](https://www.early.tools/) | 将分散的早期产品线索策展为可筛选、可持续跟踪的产品情报，帮助用户更早发现机会，并帮助创始人完成验证与分发 | `validated` | [研究笔记](research/early-tools/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/early-tools-capability-lab/) | 2026-09-01 |
| Microduck 机器人与强化学习 | [microduck](https://github.com/pollen-robotics/microduck) · [microduck_rl](https://github.com/pollen-robotics/microduck_rl) | 从 MuJoCo/PPO/Sim2Real 到 50 Hz 实机运行时的完整链路，以及能力边界和研究价值 | `studying` | [研究笔记](research/pollen-robotics-microduck/README.md) | [官方模拟器](https://huggingface.co/spaces/pollen-robotics/microduck-simulator) | 2026-09-01 |
| XPADE Face Liquify | [在线网页](https://xpade.dothome.co.kr/) | 浏览器端人脸关键点、网格液化与本地导出，并扩展为企业职业头像业务演示 | `validated` | [研究笔记](research/xpade-face-liquify/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/xpade-face-liquify-lab/) | 2026-09-01 |
| RealHuman 场景产品中心 V2 | [XPADE V1 研究](research/xpade-face-liquify/README.md) | 将人脸几何研究扩展为照片精修、实时摄像头增强、老照片基础修复与产品场景编排；明确区分已实现底座和待接专用模型 | `validated` | [V2 产品化记录](research/realhuman-scenario-showcase/README.md) | [总览](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/) · [照片](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/photo.html) · [视频](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/video.html) · [扩展](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/extensions.html) | 2026-09-03 |
| Write Then Publish | [GitHub](https://github.com/fxyadela/write-then-publish) | Markdown 单一内容源、多形态排版、媒体处理与发布前交付 | `validated` | [研究笔记](research/fxyadela-write-then-publish/README.md) | [在线研究档案](https://yydshly.github.io/0831_codex_project/demos/write-then-publish-lab/) | 2026-09-01 |
| OpenBrowser | [GitHub](https://github.com/lyu0805/OpenBrowser) | 真实 Chromium 之上的 Profile 隔离、CDP、RPA 状态流与 MCP 控制面 | `studying` | [研究笔记](research/lyu0805-openbrowser/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/) | 2026-09-01 |
| OPC Skills | [GitHub](https://github.com/ReScienceLab/opc-skills) | 用同一方法探索多个真实候选，把外部证据、Agent 整理、个人认知和行动反馈改写成自己的创业操作系统 | `validated` | [研究笔记](research/resciencelab-opc-skills/README.md) | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/) | 2026-09-01 |

> 新条目会按 `owner-repository` 命名并加入此表。研究状态统一使用 `planned`、`studying`、`validated` 或 `archived`。

Microduck 条目将两个互补仓库作为一个系统研究：`microduck_rl` 负责仿真、PPO 训练、执行器建模与 ONNX 导出，`microduck` 负责实机推理、安全约束、通信和 OTA。它是机器人强化学习与产品化衔接的优秀案例，但不是通用机器人基础库，也不是已经完成的自主智能体方案。

## Web Demo 索引

| Demo | 关联研究 | 简介 | 在线地址 | 源码 | 状态 |
| --- | --- | --- | --- | --- | --- |
| BotVod Capability Lab | [BotVod + MediaCMS 对照研究](research/botvod-com/README.md) | 演示 URL 找源与缓存/队列，并用系统全景解释 MediaCMS 的存储、处理、管理、分发和展示职责 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/botvod-capability-lab/) | [源码](apps/botvod-capability-lab/) | `validated` |
| Everyone Can Use English 技术能力图谱 | [Everyone Can Use English / Enjoy](research/zuodaotech-everyone-can-use-english/README.md) | 用五阶段全景和 12 项能力解释内容如何经过 AI 与语音处理，成为可播放、跟读、录音、评测和沉淀的训练材料 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/) | [源码](apps/everyone-can-use-english-capability-lab/) | `validated` |
| XPADE Face Liquify Capability Lab | [XPADE Face Liquify](research/xpade-face-liquify/README.md) | 以原创合成肖像演示语义人脸变形、职业头像业务闭环，并解释当前几何库与产品层能力的关系 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/xpade-face-liquify-lab/) | [源码](apps/xpade-face-liquify-lab/) | `validated` |
| RealHuman 场景产品中心 V2 | [V2 产品化记录](research/realhuman-scenario-showcase/README.md) | 在 V1 研究结论之上，以照片、实时视频和扩展产品场景组织真实本地能力；V1 页面及地址继续独立保留 | [总览](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/) · [照片](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/photo.html) · [视频](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/video.html) · [扩展](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/extensions.html) | [源码](apps/realhuman-scenario-showcase/) | `validated` |
| Write Then Publish 独立研究档案 | [Write Then Publish](research/fxyadela-write-then-publish/README.md) | 总结“一次输入、统一处理、按平台编译、分别交付”，关联上游真实卡片/长文 PNG，并用教学实验解释同源双输出 | [在线 Demo](https://yydshly.github.io/0831_codex_project/demos/write-then-publish-lab/) | [源码](apps/write-then-publish-lab/) | `validated` |
| early.tools 中文能力地图 | [early.tools](research/early-tools/README.md) | 从五类信息来源和来源处理链出发，按角色与七类能力库解释早期产品发现、策展飞轮、使用边界和扩展路线 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/early-tools-capability-lab/) | [源码](apps/early-tools-capability-lab/) | `validated` |
| OpenBrowser 原理与后期价值地图 | [OpenBrowser](research/lyu0805-openbrowser/README.md) | 区分浏览器内核与运行平台，交互拆解 Profile、CDP、RPA、MCP、隔离边界和未来研究触发条件 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/) | [源码](apps/openbrowser-architecture-lab/) | `validated` |
| OPC Skills 能力与方法地图 | [OPC Skills](research/resciencelab-opc-skills/README.md) | 用多项目探索循环解释十个 Skills、个人决策门，并回放“想法—探索—取证—纠偏—沉淀”的真实研究轨迹及其原始证据 | [在线访问](https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/) | [源码](apps/opc-skills-capability-lab/) | `validated` |

Web Demo 将汇总到同一个 GitHub Pages 站点，并通过独立子路径访问。具体约定见 [apps/README.md](apps/README.md)。

### RealHuman V2 页面清单

| 页面 | 面向的任务 | 能力边界 |
| --- | --- | --- |
| [产品总览](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/) | 选择照片或视频产品线 | 负责导航和能力分层，不直接处理素材 |
| [照片能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/photo.html) | 企业头像、婚纱单人和电商人像底座 | 单张照片高质量处理；多人和生成式换装仍是后续能力 |
| [视频能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/video.html) | 视频会议、在线面试和远程授课 | 本地实时预览；虚拟摄像头与会议软件输出尚未接入 |
| [扩展能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/extensions.html) | 老照片基础修复、风格处理及产品化路线 | 两项本地像素工具可运行；复杂补全、试穿等需要专用模型 |

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
