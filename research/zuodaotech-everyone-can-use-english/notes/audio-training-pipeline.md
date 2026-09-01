# 音视频与跟读流水线

## 为什么这是核心

Enjoy 的产品价值不只是“播放音频”或“调用 Whisper”，而是把不规则的外部内容转换成统一、可交互、可重复的训练数据：

```text
Media → Transcript → Word/Sentence Timeline → Segment
      → Playback → Recording → Comparison/Assessment
```

其中 `Segment` 和时间轴是连接媒体处理与学习交互的关键中间层。

## 1. 素材进入资源库

入口可以是本地文件、URL、YouTube 或由 TTS 生成的语音。Main Process 负责下载、文件复制、媒体信息读取、必要的压缩或裁剪，并在 SQLite 创建 Audio/Video/Speech 记录。

自定义 `enjoy://` 协议把本地路径包装成 Renderer 可读取的 URL。这样页面不直接持有操作系统路径，也能统一访问用户资料库和缓存文件。

## 2. 统一转码

[`main/echogarden.ts`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/main/echogarden.ts) 的 `transcode()` 默认把输入解码为 `16 kHz` WAV，并写入缓存目录：

```text
任意可解码音频
    ↓ ensureRawAudio(sampleRate = 16000)
RawAudio
    ↓ encodeRawAudioToWave
缓存 WAV
```

统一采样率和格式减少了 Whisper、Azure 与对齐引擎之间的输入差异。

## 3. STT 可替换层

[`use-transcribe.tsx`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-transcribe.tsx) 根据配置选择不同转写路径：

| 路径 | 执行位置 | 主要返回 | 数据是否离机 |
| --- | --- | --- | --- |
| 本地 EchoGarden/Whisper | Main Process / 本地模型 | transcript + timeline | 否 |
| OpenAI Whisper | OpenAI-compatible API | verbose JSON + segment timestamps | 是 |
| Cloudflare AI Whisper | Enjoy 配置的 Worker | text + VTT | 是 |
| Azure Speech | Azure SDK | detailed result + word timestamps | 是 |
| 上传字幕/原文 | 本地解析与对齐 | transcript 或 SRT segment timeline | 原文本身可本地；补标点可能调用 LLM |

STT 供应商返回的数据形态不同，但最终都会被规整为：

```ts
{
  engine,
  model,
  transcript,
  segmentTimeline,
  tokenId?
}
```

## 4. 粗时间戳到精时间轴

STT 的 Segment 边界通常只够做字幕，不一定适合逐词、逐句训练。Enjoy 会进一步调用 EchoGarden：

- 如果已有 `segmentTimeline`，使用 `alignSegments(..., engine: "dtw")` 生成词级时间轴；
- 如果只有 transcript，使用 `align(..., engine: "dtw")` 对整段音频与文本做对齐；
- 再通过 `wordToSentenceTimeline()` 转换成句子/片段结构。

```text
STT transcript + 粗 segment timestamp
                 ↓
        DTW 音频—文本对齐
                 ↓
 word start/end + sentence grouping
                 ↓
        可播放的 Segment 列表
```

这体现了一个重要原则：

> STT 解决“说了什么”，forced alignment 解决“何时说到每个词”。

把两者分开后，可以替换 STT 供应商而不牺牲训练交互。

## 5. 播放和智能断句

页面不再把媒体视为一条连续文件，而是把它视为一系列时间片：

- 当前句播放；
- 单句循环；
- 连续播放；
- 点击单词或短语缩小播放范围；
- 依据原音停顿和标点进一步拆分练习片段。

播放状态、当前 Segment、循环策略与跟读录音由 Renderer Context 和组件协作维护。这里最值得复用的是“播放器消费结构化时间轴”，而不是把所有行为塞进 `<audio>` 或 `<video>` 元素事件中。

## 6. 录音与对比

用户以当前 Segment 的 reference text 为目标录音。录音文件保存在 `recordings/`，SQLite 保存：

- 对应的 target 和 segment；
- reference text；
- 时长、语言和文件位置；
- 可选同步状态和发音评测关系。

Pitch contour 对比与 Azure 发音评估是两种不同反馈：

| 反馈 | 主要用途 | 不应被理解为 |
| --- | --- | --- |
| 原音/录音波形与 Pitch 对比 | 自己观察节奏、停顿和音调变化 | 自动判断“口音是否像母语者” |
| Azure Pronunciation Assessment | 根据参考文本评估音素、准确度、完整度、流利度与韵律 | 全面的人工口语评价 |

## 7. 发音评估

[`use-pronunciation-assessments.tsx`](https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda/enjoy/src/renderer/hooks/use-pronunciation-assessments.tsx) 的流程为：

1. 将 Recording 转成 WAV；
2. 向 Enjoy API 申请短期 Azure Speech token；
3. 使用当前录音的 `referenceText` 创建 scripted assessment；
4. 选择百分制、音素粒度和 IPA；
5. 30 秒以内单次识别，较长录音使用连续识别；
6. 合并结果并保存 PronunciationAssessment 模型。

结果包括 pronunciation、accuracy、completeness、fluency、prosody，以及 SDK 可用时的内容评估字段。

## 8. 缓存与重复使用

波形保存在 `waveforms/<id>.waveform.json`，转码 WAV 写入 cache，字幕、Segment 和评测结果进入 SQLite。首次打开媒体需要计算；后续可以复用结果。

这里需要区分：

- **必须持久化**：用户原始媒体、录音、文本修改、Segment 调整和评测历史；
- **可以重算**：临时 WAV、可由原始媒体恢复的波形；
- **重算有成本**：云端 STT/TTS/评测结果，即使技术上能重算，也可能产生费用。

## 可复用设计

如果在其他产品实现类似能力，建议最先稳定以下契约：

```ts
type Segment = {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
};
```

之后让播放器、录音、字幕、笔记和评测都引用 `segmentId`，而不是各自维护一套时间位置。

## 待验证问题

- 本地 Whisper 在 Windows/macOS/Linux 的实际模型下载、内存占用和实时倍率；
- DTW 对齐在口音重、背景音乐、多人说话和字幕错误时的失败表现；
- Pitch contour 的具体提取算法、平滑策略和不同声线下的可比性；
- 长音频的峰值内存、缓存体积和取消任务行为；
- 修改字幕后 Segment、录音和历史评测是否能稳定迁移。
