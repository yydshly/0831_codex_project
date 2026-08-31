# Microduck 机器人与强化学习研究

> 这不是两个彼此独立的“机器人技能库”，而是一套小型桌面机器人从仿真训练到实机运行的上下游工程：`microduck_rl` 训练并导出策略，`microduck` 在真实机器人上以固定频率执行策略并承担安全、感知、通信和升级。

## 项目信息

| 字段 | 内容 |
| --- | --- |
| 上游仓库 | [`pollen-robotics/microduck`](https://github.com/pollen-robotics/microduck) · [`pollen-robotics/microduck_rl`](https://github.com/pollen-robotics/microduck_rl) |
| 研究基线 | [`microduck@590b986`](https://github.com/pollen-robotics/microduck/tree/590b986bd8c0d50ae02cb3ea2f59c463b6828168)（`main`）· [`microduck_rl@d424a0c`](https://github.com/pollen-robotics/microduck_rl/tree/d424a0c899f6b33cbd3daeb279913134349c0b63)（默认 `develop`） |
| 上游许可证 | 两个软件仓库均为 [Apache-2.0](https://github.com/pollen-robotics/microduck/blob/590b986bd8c0d50ae02cb3ea2f59c463b6828168/LICENSE)；[`microduck_rl` README](https://github.com/pollen-robotics/microduck_rl/blob/d424a0c899f6b33cbd3daeb279913134349c0b63/README.md#license) 另说明 3D 模型使用 Creative Commons BY-SA-NC，固定提交中未发现单独的模型许可证文件 |
| 研究状态 | `studying`；完成官方资料与固定提交源码审查，未在真实 Microduck 硬件上复现 |
| 首次研究 | `2026-09-01`（Asia/Shanghai） |
| 标签 | `robotics`、`reinforcement-learning`、`PPO`、`MuJoCo`、`Sim2Real`、`ONNX`、`Rust`、`embedded-linux` |

## 证据标记

- **[官方声明]**：来自项目 README、设计文档、路线图或官方产品资料。
- **[源码审查]**：由固定提交中的配置、实现或随仓库策略文件直接确认。
- **[研究判断]**：我们基于证据作出的价值、成熟度或适用性判断，不代表上游承诺。
- **[待实机验证]**：源码或训练配置存在，但本研究没有在真实硬件上复现。

## 先给结论

**它们有研究意义，但研究价值高度依赖你的方向。**

- 如果目标是机器人强化学习、运动控制或 Sim2Real，`microduck_rl` 值得深入研究，重点是奖励设计、执行器建模、域随机化和策略导出契约。
- 如果目标是把机器人做成可交付产品，`microduck` 值得选择性深入，重点是固定频率控制、安全限制、感知与通信服务、策略部署和 OTA 回滚。
- 如果目标是通用 AI、普通 Web/应用开发或与机器人无关的业务，两者更适合做一次架构案例阅读，不必长期深挖。
- 它们不是“没有研究价值”，也不是人人必学的基础库；更准确的定位是一个透明度很高的机器人全栈工程样本。

## 两个仓库分别做什么

| 仓库 | 角色 | 主要输入 | 主要输出 | 不负责什么 |
| --- | --- | --- | --- | --- |
| [`microduck_rl`](https://github.com/pollen-robotics/microduck_rl) | 离线训练与仿真研究 | 机器人模型、任务、奖励、随机化范围、PPO 配置 | 可部署的 ONNX 运动策略 | 相机理解、语音对话、产品通信、OTA 与实机守护 |
| [`microduck`](https://github.com/pollen-robotics/microduck) | 真实机器人的运行时与产品软件 | 传感器、命令、ONNX 策略、设备配置 | 电机目标、视频/ToF/音频服务、遥控与设备生命周期 | 大规模强化学习训练、通用视觉语言推理 |

它们的关系可以压缩为：

```text
MuJoCo / mjlab 并行仿真
        ↓
PPO 学习 14 关节运动策略
        ↓
导出 ONNX（包含观测归一化）
        ↓
microduck / robotd 以 50 Hz 推理
        ↓
动作缩放、滤波、安全限制和电机总线
        ↓
真实 Microduck
```

详细组件和数据流见[架构与运行链路](notes/architecture.md)。

## 能力是什么

### 已形成的低层运动能力

**[源码审查]** `microduck` 固定提交随仓库包含 9 个 ONNX 策略文件，覆盖：

- 行走/速度控制、站立；
- 坐下—站起；
- 贴地拾取；
- 左脚和右脚踢球；
- 轮式/滚轮运动及低姿态；
- 前滚翻（roulade）。

**[源码审查]** `microduck_rl` 还定义了粗糙地形、swizzle、斜坡、旋转、轮式起身等训练任务。这里必须区分三层事实：

```text
存在训练环境 ≠ 已发布策略权重 ≠ 已通过真实机器人验证
```

能力清单、软硬件边界与成熟度见[能力、场景与边界](notes/capabilities-and-boundaries.md)。

### 机器人运行与产品能力

**[源码审查]** 实机仓库不只是一个策略播放器，还包含电机与传感器接入、手柄/BLE 控制、摄像头 WebRTC、ToF、音频、配置服务、健康检查、签名升级和失败回滚等模块。它展示的是“让学习策略安全地活在产品中”的外围系统。

## 原理是什么

策略的核心接口是一个稳定的 `61 → 14` 契约：

```text
61 维观测
  = 角速度 3
  + 重力方向 3
  + 关节位置 14
  + 关节速度 14
  + 上一次动作 14
  + 命令 13（速度 3 + 头部姿态 4 + 身体姿态 6）

PPO Actor：61 → 512 → 256 → 128 → 14
输出：14 个受控关节的位置偏移
```

第 15 个电机用于嘴部机构，不在这组运动策略动作中。实机运行时将策略输出与 home pose、动作缩放、滤波、增益和安全约束组合后才发送给电机，因此“ONNX 输入输出尺寸相同”只是兼容的必要条件，不是充分条件。

训练能迁移到实机，依赖的不是单一算法技巧，而是一组协同设计：

- BAM 执行器模型近似电压、反电动势、库仑/Stribeck 摩擦与负载效应；
- 对电压下降、延迟、摩擦、质量/惯量、质心、外力、IMU 安装误差、编码器偏置和噪声进行域随机化；
- 提供每个舵机约 `±1°` 间隙的 backlash 变体；
- 将观测归一化一起固化进 ONNX，减少训练端和部署端预处理漂移；
- 以稳定的策略 ABI 让不同动作策略共享同一实机推理框架。

详见[强化学习与 Sim2Real](notes/rl-and-sim2real.md)。

## 使用场景

### 适合

| 场景 | 可复用价值 |
| --- | --- |
| 学习机器人强化学习 | 可观察任务、奖励、PPO、仿真和部署如何闭环，而不只是运行一个算法示例 |
| 研究 Sim2Real | 执行器摩擦、回差、延迟、传感器噪声与域随机化都给出了具体工程入口 |
| 为 Microduck 增加运动技能 | 可新建环境、奖励和课程，训练后沿 ONNX 契约部署 |
| 设计小型机器人软件栈 | 可参考 50 Hz 控制、服务拆分、安全状态和升级健康门禁 |
| 高层 AI/VLM/LLM 控制 | 可把稳定动作策略封装为 `walk`、`sit`、`kick` 等意图，由高层智能体调度 |
| 教学、桌面陪伴和人机交互原型 | 尺寸、传感器和表现力适合近距离交互实验 |

### 不适合直接套用

- 工业负载、精密操作或安全关键机器人；
- 任意机械结构的通用控制器；
- 已完成的自主导航、视觉语言行动或通用具身智能系统；
- 仅凭两个软件仓库复制整机——官方公开的是软件，机械与电子设计文件并未完整开放；
- 未核对模型素材许可就用于商业硬件或商业数据管线。

## 可扩展方向

1. **补齐策略交付协议**：版本化观测、动作、缩放、滤波、增益和训练元数据，建立仿真—ONNX—实机契约测试。
2. **从技能切换升级为技能组合**：增加策略目录、热加载、平滑切换、失败恢复和高层行为树/规划器。
3. **把视觉和 ToF 接入高层闭环**：先做目标检测、定位和状态估计，再把低层运动策略当作可靠执行器；不宜直接把所有传感器塞进单一策略。
4. **强化 Sim2Real 校准**：用实机日志反推摩擦、回差、延迟和电压模型，建立系统辨识与回归基准。
5. **提高策略安全性**：加入在线异常检测、动作投影、跌倒风险预测、看门狗和策略级灰度发布。
6. **完善开发者体验**：稳定 SDK/Python 客户端、仿真器、日志回放、遥测和远程诊断。
7. **多机器人与持续学习**：在明确隐私、数据治理和安全边界后，收集失败样本并进行离线评估与再训练。

这些方向的优先级和进入条件见[研究价值与建议](notes/research-value.md)。

## 对我们的意义

最值得带走的不是某个动作，也不是“PPO 比其他算法更好”，而是三个工程认识：

1. **机器人技能必须有部署契约。** 训练代码、模型文件、运行时参数和硬件标定共同决定行为，缺一块都不能声称可迁移。
2. **Sim2Real 的关键是系统误差建模。** 执行器、电源、摩擦、间隙、延迟和传感器误差往往比换一个网络结构更重要。
3. **产品化远大于模型推理。** 安全、通信、日志、健康检查、升级回滚和人工接管，决定策略是否真的能交付。

因此，这个项目值得作为我们的第一个“机器人全栈案例”保留：以后遇到具身智能、运动策略、机器人技能平台或边缘部署问题，可以把它当作对照基线；如果近期没有机器人方向，则停留在架构理解即可，不需要为了“优秀库”而深入每一行代码。

## 研究导航

- [架构与运行链路](notes/architecture.md)
- [强化学习与 Sim2Real](notes/rl-and-sim2real.md)
- [能力、场景与边界](notes/capabilities-and-boundaries.md)
- [研究价值与建议](notes/research-value.md)

## 主要一手来源

- [Microduck 主仓库](https://github.com/pollen-robotics/microduck)
- [Microduck RL 仓库](https://github.com/pollen-robotics/microduck_rl)
- [运行时总体架构](https://github.com/pollen-robotics/microduck/blob/590b986bd8c0d50ae02cb3ea2f59c463b6828168/docs/design/architecture.md)
- [`robotd` 控制守护进程设计](https://github.com/pollen-robotics/microduck/blob/590b986bd8c0d50ae02cb3ea2f59c463b6828168/docs/design/robotd-design.md)
- [产品路线图](https://github.com/pollen-robotics/microduck/blob/590b986bd8c0d50ae02cb3ea2f59c463b6828168/docs/project/roadmap.md)
- [随仓库策略说明](https://github.com/pollen-robotics/microduck/blob/590b986bd8c0d50ae02cb3ea2f59c463b6828168/policies/README.md)
- [RL 任务与开发约定](https://github.com/pollen-robotics/microduck_rl/blob/d424a0c899f6b33cbd3daeb279913134349c0b63/AGENTS.md)
- [官方产品与 press kit](https://pollen-robotics.com/microduck/press-kit/)
- [官方在线模拟器](https://huggingface.co/spaces/pollen-robotics/microduck-simulator)
- [BAM 执行器模型](https://github.com/Rhoban/bam)

## 变更记录

- `2026-09-01`：创建研究条目，整理两个仓库的关系、能力、原理、边界、扩展方向与研究价值。
