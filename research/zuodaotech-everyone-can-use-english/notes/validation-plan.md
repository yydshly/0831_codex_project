# 运行与验证计划

## 当前完成度

已完成：

- 固定上游提交 `3d799132046993eade5a364ddd1e557906854eda`；
- 稀疏克隆核心源码、产品文档和书稿；
- 审查 Electron Main/Preload/Renderer 分层；
- 审查 SQLite 模型和本地资料库结构；
- 审查 STT、DTW 对齐、TTS、发音评估和 LLM 调用链；
- 识别当前 Web/扩展/服务端不在仓库中的产品边界。

尚未完成：

- 安装 Yarn 依赖；
- 启动 Electron 开发模式；
- 下载 Whisper/EchoGarden 模型；
- 用真实媒体验证完整训练流程；
- 对网络流量、权限和本地文件访问做动态安全审计。

## 阶段 1：构建可行性

目标：确认固定提交在 Windows 当前环境中可以安装并启动。

建议命令：

```powershell
cd E:\0831_codex_project\sources\zuodaotech-everyone-can-use-english
corepack enable
yarn install --immutable
yarn enjoy:dev
```

验收：

- Yarn 4.6.0 和 Node >=20 生效；
- Main、Preload、Renderer 均能被 Vite 构建；
- Electron 窗口出现，控制台无阻断性异常；
- 数据库可以在临时资料库创建和迁移；
- 不修改用户真实 `Documents/EnjoyLibrary`。

风险：原生 SQLite、FFmpeg、EchoGarden、词典和 Whisper 资源可能导致较大下载或平台兼容问题。运行前应通过环境变量把 Library/Settings 路径指向专用实验目录。

## 阶段 2：本地核心闭环

测试素材：准备 10–20 秒、单人、无背景音乐、带准确英文文本的 WAV/MP3。

步骤：

1. 导入音频；
2. 验证 Audio 记录和本地文件；
3. 使用本地 Whisper 转写；
4. 检查 transcript、word timeline 和 sentence segment；
5. 验证当前句、单句循环和连续播放；
6. 录制一条跟读；
7. 检查 Recording 文件和 SQLite 关系；
8. 重启应用，确认结果可恢复。

验收证据：

- SQLite 查询快照；
- 资料库目录清单；
- Transcript/Segment JSON；
- 页面截图；
- 主进程日志中的转码、识别和对齐耗时。

## 阶段 3：异常样本

依次测试：

- 背景音乐；
- 两人对话；
- 明显非母语口音；
- 错误字幕；
- 没有标点的长文本；
- 5 分钟以上音频；
- 中途取消 STT；
- 网络断开后误选云端服务。

关注指标：

- STT 文字错误率的可感知变化；
- DTW 是否出现句子边界漂移或倒序；
- 峰值内存和缓存体积；
- 取消后是否残留孤儿文件、数据库记录或付费 token；
- 用户能否修改错误字幕并重新对齐。

## 阶段 4：模型与服务替换

对比三条最小路径：

| 方案 | STT | LLM | TTS | 目的 |
| --- | --- | --- | --- | --- |
| 全本地优先 | Whisper | Ollama | 暂不启用或本地替代 | 验证隐私和离线可用性 |
| 自带兼容 API | OpenAI-compatible | OpenAI-compatible | OpenAI-compatible | 验证 BYOK/base URL 契约 |
| Enjoy/Azure | Azure | EnjoyAI | Azure | 验证原产品云端闭环与计费令牌 |

所有测试使用非敏感短文本和专用测试账户，禁止使用个人录音或正式 API Key 截图。

## 阶段 5：安全与隐私

检查清单：

- Renderer 是否能读取或导出配置中的 API Key；
- `enjoy://` 是否能访问资料库之外的文件；
- IPC handler 是否接受未经规范化的路径；
- WebContentsView 加载第三方网页时是否与主应用隔离；
- ActionCable、日志和 Bugsnag 是否泄露 access token；
- 删除资源是否同时处理文件、数据库、缓存和云端对象；
- 重置功能的删除范围是否准确。

## 阶段 6：当前产品分线

对新版 Web 和 Chrome 扩展建立独立研究条目，回答：

- 旧桌面端的 Audio/Segment/Recording 数据模型是否仍被沿用；
- 浏览器扩展如何从 YouTube/Netflix 获取字幕、时间轴和播放控制；
- Web 端如何处理本地文件、录音、持久化和大媒体；
- 哪些功能迁移到了服务端，哪些仍在浏览器本地；
- 账户、课程、社区和同步的当前行为是否与旧文档一致。

在完成这一步前，旧 Electron 源码只能作为历史架构基线，不能代表 2026 年在线产品的全部实现。

## 研究完成标准

本研究从 `studying` 进入 `validated` 至少需要：

- 一个固定环境能重复启动；
- 一个短音频完成“导入—STT—对齐—播放—录音—重启恢复”；
- 本地和至少一个云端 STT 的对照结果；
- Ollama 或 OpenAI-compatible 对话成功；
- 关键文件和网络数据流被记录；
- 已知失败场景和数据清理行为有证据；
- 许可证问题得到上游说明，或研究结论明确保持为不可分发。
