# RealHuman 场景产品中心 V2

> XPADE Face Liquify V1 研究的产品化续作：不把单一人脸几何能力包装成完整产品，而是把照片、实时视频和需要专用模型的扩展能力分层组织并真实演示。

## 项目关系

| 字段 | 内容 |
| --- | --- |
| 研究来源 | [XPADE Face Liquify V1](../xpade-face-liquify/README.md) |
| 产品源码 | [apps/realhuman-scenario-showcase](../../apps/realhuman-scenario-showcase/) |
| 版本 | `2.0.0` / `realhuman-v2.0.0` |
| 状态 | `validated` |
| 发布提交 | `61ee0a4c2911fa58c364cee69702f30cac42eb4a` |
| 最近更新 | `2026-09-03` |

V1 负责回答“原网页具备什么能力、技术原理和边界”；V2 负责回答“这些底层能力如何组合为可以操作、比较、导出和继续扩展的产品场景”。两版使用不同源码目录和线上路径，V2 不覆盖 V1。

## 页面与场景

| 页面 | 主要场景 | 当前结论 |
| --- | --- | --- |
| [产品总览](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/) | 照片与视频能力分流 | 已发布 |
| [照片能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/photo.html) | 企业职业头像、婚纱单人、电商人像底座 | 单张本地处理闭环可运行 |
| [视频能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/video.html) | 视频会议、在线面试、远程授课 | 本机实时预览可运行 |
| [扩展能力](https://yydshly.github.io/0831_codex_project/demos/realhuman-scenario-showcase/extensions.html) | 老照片基础修复、图片风格、职业头像、婚纱、电商、试穿和正式视频输出 | 基础工具和共享底座可运行；专用模型缺口明确保留 |

内部 `engine/r34/index.html` 是四个产品页面共享的冻结能力引擎和调试入口，不是独立的第五类产品。

## 能力分层

- **已实现**：本地图片输入、确定性基础修复与风格处理、单人人脸感知、人像增强、实时摄像头预览、比较、撤销和导出。
- **底座可复用**：企业头像、婚纱单人、电商人像和视频会议已经拥有独立产品动作，但部分结果仍来自共享底座。
- **需要专用模型或工程链**：身份保持换装换景、多人逐人处理、商品保护、复杂老照片补全、全身试穿、虚拟摄像头和批处理审核。

## 验证与边界

- [设计契约](../../apps/realhuman-scenario-showcase/notes/design-contract.md)
- [验收记录](../../apps/realhuman-scenario-showcase/notes/validation.md)
- [第三方说明](../../apps/realhuman-scenario-showcase/THIRD_PARTY_NOTICES.md)

V2 是可运行研究产品和后续定制的技术基线，不等于上述所有行业场景已经达到商业交付质量。页面会持续区分真实运行结果、共享底座结果与尚未接入的模型能力。
