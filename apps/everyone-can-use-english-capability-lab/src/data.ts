export type RuntimeBoundary = "local" | "cloud" | "hybrid" | "missing";
export type CapabilityCategory =
  | "content"
  | "speech"
  | "practice"
  | "intelligence"
  | "platform";

export type Evidence = {
  label: string;
  url: string;
};

export type Capability = {
  id: string;
  index: string;
  category: CapabilityCategory;
  boundary: RuntimeBoundary;
  title: string;
  summary: string;
  input: string;
  process: string;
  output: string;
  implementation: string[];
  limits: string;
  evidence: Evidence[];
};

export type PipelineStep = {
  id: string;
  index: string;
  title: string;
  short: string;
  input: string;
  process: string;
  output: string;
  technology: string[];
  boundary: RuntimeBoundary;
  takeaway: string;
  evidence: Evidence;
};

export type Scenario = {
  id: string;
  fit: "direct" | "adapt" | "reference";
  audience: string;
  title: string;
  description: string;
  value: string;
  condition: string;
};

export type Extension = {
  horizon: "近期" | "中期" | "重构级";
  title: string;
  description: string;
  value: "高" | "中";
  effort: "低" | "中" | "高";
  prerequisite: string;
};

const commit =
  "https://github.com/ZuodaoTech/everyone-can-use-english/blob/3d799132046993eade5a364ddd1e557906854eda";

export const categories: Array<{
  id: "all" | CapabilityCategory;
  label: string;
  short: string;
}> = [
  { id: "all", label: "全部能力", short: "ALL" },
  { id: "content", label: "内容接入", short: "INGEST" },
  { id: "speech", label: "语音智能", short: "SPEECH" },
  { id: "practice", label: "训练反馈", short: "PRACTICE" },
  { id: "intelligence", label: "知识与 AI", short: "AI" },
  { id: "platform", label: "平台能力", short: "PLATFORM" }
];

export const boundaryLabels: Record<
  RuntimeBoundary,
  { label: string; description: string }
> = {
  local: { label: "本地", description: "核心数据和计算可留在设备内" },
  cloud: { label: "云端", description: "需要外部服务或 Enjoy 后端" },
  hybrid: { label: "混合", description: "可在本地与云端实现之间选择" },
  missing: { label: "未开源", description: "客户端能看到契约，但服务端源码缺失" }
};

export const capabilities: Capability[] = [
  {
    id: "media-ingest",
    index: "01",
    category: "content",
    boundary: "local",
    title: "多源媒体接入",
    summary: "把本地音视频、在线 URL 与 YouTube 内容纳入统一资源库。",
    input: "本地文件、音频/视频 URL、YouTube 地址",
    process: "下载或复制文件，读取媒体信息，建立 Audio / Video 元数据",
    output: "可追踪、可裁剪、可播放的本地媒体资产",
    implementation: [
      "Electron Main Process 处理文件与下载",
      "Audio / Video Sequelize 模型保存元数据",
      "enjoy:// 协议统一暴露本地资源"
    ],
    limits: "新版浏览器扩展如何接入 YouTube/Netflix 不在该仓库中。",
    evidence: [
      { label: "音频文档", url: commit + "/1000-hours/enjoy-app/audios.md" },
      { label: "Main 入口", url: commit + "/enjoy/src/main.ts" }
    ]
  },
  {
    id: "document-ingest",
    index: "02",
    category: "content",
    boundary: "hybrid",
    title: "文档与网页阅读",
    summary: "导入 EPUB、TXT、Markdown 或网页文章，按段翻译、朗读和跟读。",
    input: "本地电子书、文本文件、文章 URL",
    process: "解析文档或抓取网页正文，分段生成翻译与语音",
    output: "可阅读、可朗读、可转成跟读材料的文档",
    implementation: [
      "foliate-js 处理 EPUB",
      "Readability / Cheerio 处理网页内容",
      "Document 模型保存内容和阅读配置"
    ],
    limits: "网页抓取受站点结构、登录和反自动化规则限制。",
    evidence: [
      {
        label: "电子书文档",
        url: commit + "/1000-hours/enjoy-app/document-ebook.md"
      },
      {
        label: "网页文档",
        url: commit + "/1000-hours/enjoy-app/document-webpage.md"
      }
    ]
  },
  {
    id: "media-normalization",
    index: "03",
    category: "speech",
    boundary: "local",
    title: "音频归一化",
    summary: "先把不同媒体输入转换为统一的 16 kHz WAV，再交给识别和评测。",
    input: "任意可被解码的媒体",
    process: "EchoGarden / FFmpeg 解码、重采样并编码为 WAV",
    output: "各语音引擎可稳定消费的标准音频",
    implementation: [
      "EchoGarden ensureRawAudio",
      "默认 sampleRate = 16000",
      "临时 WAV 写入本地 cache"
    ],
    limits: "原生依赖、长音频内存和不同平台编解码兼容性需要运行验证。",
    evidence: [
      {
        label: "EchoGarden 封装",
        url: commit + "/enjoy/src/main/echogarden.ts"
      }
    ]
  },
  {
    id: "multi-stt",
    index: "04",
    category: "speech",
    boundary: "hybrid",
    title: "多引擎语音转写",
    summary: "在本地 Whisper、OpenAI、Cloudflare AI 和 Azure Speech 之间选择。",
    input: "标准化音频、语言、识别服务配置",
    process: "按供应商调用本地模型或云端 API，统一转成 transcript + timeline",
    output: "文字、粗 Segment 时间戳与供应商元数据",
    implementation: [
      "EchoGarden Whisper / whisper.cpp",
      "OpenAI whisper-1 verbose_json",
      "Cloudflare AI VTT",
      "Azure detailed word timestamps"
    ],
    limits: "云端路径会发送音频并可能收费；识别质量与字幕可用性不是固定承诺。",
    evidence: [
      {
        label: "转写 Hook",
        url: commit + "/enjoy/src/renderer/hooks/use-transcribe.tsx"
      }
    ]
  },
  {
    id: "forced-alignment",
    index: "05",
    category: "speech",
    boundary: "local",
    title: "DTW 精确对齐",
    summary: "把“说了什么”和“每个词何时发生”拆成两个步骤。",
    input: "音频、transcript、STT 粗时间戳",
    process: "EchoGarden 使用 DTW 对齐，再将词级时间轴聚合为句子",
    output: "可逐词、逐句操作的 Segment Timeline",
    implementation: [
      "alignSegments 处理已有粗时间戳",
      "align 处理只有全文的情况",
      "wordToSentenceTimeline 生成训练单元"
    ],
    limits: "错误字幕、多人说话和背景音乐可能造成边界漂移。",
    evidence: [
      {
        label: "对齐编排",
        url: commit + "/enjoy/src/renderer/hooks/use-transcribe.tsx"
      }
    ]
  },
  {
    id: "shadowing",
    index: "06",
    category: "practice",
    boundary: "local",
    title: "逐句跟读训练",
    summary: "按句播放、单句循环、连续播放，并把词或短语缩小成训练片段。",
    input: "媒体文件与 Segment Timeline",
    process: "播放器消费时间轴，维护当前句、循环模式和选中词范围",
    output: "低操作成本、可重复的影子跟读循环",
    implementation: [
      "React Media Shadow Context",
      "Segment 作为播放器与录音共享主键",
      "快捷键控制播放与录音"
    ],
    limits: "它提供训练工具，不提供真人教师式的即时纠错与教学策略。",
    evidence: [
      { label: "音频训练", url: commit + "/1000-hours/enjoy-app/audios.md" },
      {
        label: "Media Shadow",
        url: commit + "/enjoy/src/renderer/context/media-shadow-provider.tsx"
      }
    ]
  },
  {
    id: "recording-feedback",
    index: "07",
    category: "practice",
    boundary: "local",
    title: "录音与音高对比",
    summary: "保存逐句录音，并将原音与录音同步播放、对照 Pitch contour。",
    input: "麦克风录音、当前 Segment、reference text",
    process: "录音文件落盘，关联 target/segment，并与原音波形同步显示",
    output: "可重复回听的个人发音记录与视觉反馈",
    implementation: [
      "Recording 模型与 recordings/ 文件目录",
      "波形 JSON 缓存",
      "录音统计与按资源/日期聚合"
    ],
    limits: "音高相似不等于音素正确，也不等于自然度或口音质量。",
    evidence: [
      { label: "录音对比说明", url: commit + "/1000-hours/enjoy-app/audios.md" },
      {
        label: "Recording 模型",
        url: commit + "/enjoy/src/main/db/models/recording.ts"
      }
    ]
  },
  {
    id: "pronunciation",
    index: "08",
    category: "practice",
    boundary: "cloud",
    title: "发音评估",
    summary: "使用参考文本和 Azure Speech 返回音素级、流利度与韵律评分。",
    input: "录音、reference text、语言",
    process: "申请短期 Azure token，执行 scripted pronunciation assessment",
    output: "准确度、完整度、流利度、韵律和音素明细",
    implementation: [
      "百分制、Phoneme 粒度、IPA",
      "短录音单次识别，长录音连续识别并合并",
      "PronunciationAssessment 模型本地保存"
    ],
    limits: "依赖 Enjoy token 服务和 Azure；分数不应被当作完整人工口语评价。",
    evidence: [
      {
        label: "评测 Hook",
        url:
          commit +
          "/enjoy/src/renderer/hooks/use-pronunciation-assessments.tsx"
      }
    ]
  },
  {
    id: "ai-assistant",
    index: "09",
    category: "intelligence",
    boundary: "hybrid",
    title: "AI 助教与角色对话",
    summary: "用 Prompt 模板和角色定义提供翻译、润色、分析、查词与对话。",
    input: "文本、上下文、角色定义、历史消息",
    process: "LangChain 调用 EnjoyAI、OpenAI-compatible 或 Ollama",
    output: "文本或结构化结果，可继续 TTS 和跟读",
    implementation: [
      "ChatOpenAI + 可配置 baseURL",
      "ChatOllama 角色对话",
      "翻译、查词、分析、补标点等独立命令"
    ],
    limits: "这是模型编排，不是仓库训练的自研大模型；通用命令与 Ollama 支持范围并不完全相同。",
    evidence: [
      { label: "文本命令", url: commit + "/enjoy/src/commands/text.command.ts" },
      {
        label: "角色对话",
        url: commit + "/enjoy/src/renderer/hooks/use-conversation.tsx"
      }
    ]
  },
  {
    id: "tts-loop",
    index: "10",
    category: "intelligence",
    boundary: "hybrid",
    title: "文本到训练材料",
    summary: "把 AI 回复或任意文本生成语音，并立即纳入跟读资源库。",
    input: "文本、voice、TTS provider",
    process: "OpenAI-compatible Speech API 或 Azure TTS 生成音频",
    output: "Speech 文件，可进入转写、分句和跟读链路",
    implementation: [
      "useSpeech 统一 TTS 调用",
      "Speech 模型保存来源和配置",
      "AI 输出进入真实业务闭环"
    ],
    limits: "云端 TTS 会发送文本并产生费用；本仓库没有完整的本地 TTS 路径。",
    evidence: [
      {
        label: "TTS Hook",
        url: commit + "/enjoy/src/renderer/hooks/use-speech.tsx"
      },
      {
        label: "生成材料案例",
        url:
          commit +
          "/1000-hours/enjoy-app/use-case-generate-audio-resources.md"
      }
    ]
  },
  {
    id: "knowledge-assets",
    index: "11",
    category: "intelligence",
    boundary: "local",
    title: "词典、笔记与知识资产",
    summary: "把查词、笔记、字幕、录音和对话沉淀为可回看的本地学习数据。",
    input: "选词、上下文、用户笔记、导入词典",
    process: "MDX/适配词典查询，SQLite 记录 Note、CacheObject 与关系",
    output: "与具体媒体和 Segment 关联的个人知识资产",
    implementation: [
      "MDX / MDict 导入与资源读取",
      "Note 按 target 和 segment 聚合",
      "UserSetting 与 CacheObject"
    ],
    limits: "词典素材许可、体积和多设备同步需要独立处理。",
    evidence: [
      { label: "设置文档", url: commit + "/1000-hours/enjoy-app/settings.md" },
      { label: "Preload API", url: commit + "/enjoy/src/preload.ts" }
    ]
  },
  {
    id: "cloud-platform",
    index: "12",
    category: "platform",
    boundary: "missing",
    title: "账户、上传与社区客户端入口",
    summary: "客户端包含登录、实时消息、媒体上传、课程和社区入口，但服务端实现不在仓库中。",
    input: "账户 token、客户端数据、社区和课程请求",
    process: "enjoy.bot REST、ActionCable、storage.enjoy.bot 与 SSO",
    output: "账户状态、云端对象、实时消息和社区体验",
    implementation: [
      "Client Bearer Token REST",
      "ActionCable WebSocket",
      "Discourse SSO 与云存储端点"
    ],
    limits: "服务端源码不在仓库中，无法确认内部架构、同步冲突和当前线上实现。",
    evidence: [
      { label: "API Client", url: commit + "/enjoy/src/api/client.ts" },
      {
        label: "App Settings",
        url: commit + "/enjoy/src/renderer/context/app-settings-provider.tsx"
      }
    ]
  }
];

export const pipelineSteps: PipelineStep[] = [
  {
    id: "ingest",
    index: "01",
    title: "接入",
    short: "把内容变成资产",
    input: "本地媒体、URL、YouTube、文档或 AI 文本",
    process: "下载/复制、解析元数据、写入本地资源库",
    output: "Audio / Video / Document / Speech",
    technology: ["Electron", "FFmpeg", "Sequelize", "enjoy://"],
    boundary: "local",
    takeaway: "内容来源可以变化，但先转换成稳定的本地资产。",
    evidence: { label: "Audio 模型", url: commit + "/enjoy/src/main/db/models/audio.ts" }
  },
  {
    id: "normalize",
    index: "02",
    title: "归一化",
    short: "统一语音输入",
    input: "不同编码、采样率和容器的媒体",
    process: "解码并重采样为 16 kHz WAV",
    output: "识别与评测可共享的标准音频",
    technology: ["EchoGarden", "FFmpeg", "WAV", "16 kHz"],
    boundary: "local",
    takeaway: "先消除输入差异，后续才能可靠切换语音供应商。",
    evidence: { label: "EchoGarden", url: commit + "/enjoy/src/main/echogarden.ts" }
  },
  {
    id: "transcribe",
    index: "03",
    title: "转写",
    short: "回答说了什么",
    input: "标准音频、语言和 provider 配置",
    process: "本地 Whisper 或云端 STT 生成 transcript 与粗时间戳",
    output: "统一的转写结果",
    technology: ["Whisper", "OpenAI", "Cloudflare AI", "Azure Speech"],
    boundary: "hybrid",
    takeaway: "STT 是可替换供应商层，不应直接绑死播放器。",
    evidence: {
      label: "useTranscribe",
      url: commit + "/enjoy/src/renderer/hooks/use-transcribe.tsx"
    }
  },
  {
    id: "align",
    index: "04",
    title: "对齐",
    short: "回答何时说到每个词",
    input: "音频、全文和粗 Segment",
    process: "DTW forced alignment，词级时间轴再聚合成句子",
    output: "Segment + word start/end",
    technology: ["DTW", "EchoGarden", "Timeline", "Segment"],
    boundary: "local",
    takeaway: "将识别与时间定位拆开，是训练交互稳定的关键。",
    evidence: {
      label: "对齐分支",
      url: commit + "/enjoy/src/renderer/hooks/use-transcribe.tsx"
    }
  },
  {
    id: "practice",
    index: "05",
    title: "训练",
    short: "让时间轴变成动作",
    input: "媒体、Segment、reference text",
    process: "单句播放、循环、选词、录音与笔记",
    output: "可重复的影子跟读记录",
    technology: ["React Context", "Media APIs", "Recording", "Note"],
    boundary: "local",
    takeaway: "时间轴不是字幕附件，而是播放、录音和学习数据的共同主轴。",
    evidence: {
      label: "Media Shadow",
      url: commit + "/enjoy/src/renderer/context/media-shadow-provider.tsx"
    }
  },
  {
    id: "feedback",
    index: "06",
    title: "反馈",
    short: "用多层证据修正",
    input: "原音、录音、Pitch、reference text",
    process: "自我回听、音高曲线对比与 Azure scripted assessment",
    output: "录音历史、视觉反馈与音素级评分",
    technology: ["Waveform", "Pitch", "Azure SDK", "IPA"],
    boundary: "hybrid",
    takeaway: "视觉对比与自动评分解决不同问题，不能压成一个绝对分数。",
    evidence: {
      label: "Pronunciation Assessment",
      url:
        commit +
        "/enjoy/src/renderer/hooks/use-pronunciation-assessments.tsx"
    }
  }
];

export const scenarios: Scenario[] = [
  {
    id: "self-training",
    fit: "direct",
    audience: "个人学习者",
    title: "用真实内容做影子跟读",
    description: "把播客、演讲、视频和文章转成逐句训练材料，积累自己的表达库。",
    value: "最贴合原产品闭环",
    condition: "本地媒体与短音频可直接使用；云端评测按需开启。"
  },
  {
    id: "material-authoring",
    fit: "direct",
    audience: "内容创作者 / 教师",
    title: "快速制作个性化口语材料",
    description: "用 LLM 改写文本、TTS 生成语音，再自动分句和建立训练页面。",
    value: "显著降低材料制作成本",
    condition: "需要人工检查文本、音色和版权，不应全自动发布。"
  },
  {
    id: "coaching",
    fit: "adapt",
    audience: "口语教练 / 小班",
    title: "基于录音和 Segment 做反馈",
    description: "用逐句录音、笔记和评测记录支持异步批注与针对性复练。",
    value: "本地数据模型可复用",
    condition: "需要补充教师端、权限、作业流和多人数据治理。"
  },
  {
    id: "research",
    fit: "direct",
    audience: "语音与 HCI 研究者",
    title: "研究 STT、对齐与学习交互",
    description: "对比不同 STT，观察 DTW 对齐误差如何影响逐句训练体验。",
    value: "算法与交互连接清晰",
    condition: "需要建立可复现语料、误差指标和隐私审查。"
  },
  {
    id: "desktop-ai",
    fit: "reference",
    audience: "桌面 AI 产品团队",
    title: "参考 local-first AI 工作台",
    description: "研究 Electron、SQLite、本地媒体、模型供应商和云端边界如何共存。",
    value: "架构模式比业务代码更可复用",
    condition: "不能直接复用缺失的服务端和当前 Web 产品实现。"
  },
  {
    id: "enterprise",
    fit: "adapt",
    audience: "企业培训 / 合规环境",
    title: "构建私有语言训练系统",
    description: "保留本地媒体、Whisper 和统一时间轴，替换账户、AI Gateway 与存储。",
    value: "核心媒体链路可作为原型",
    condition: "必须重做安全、审计、同步、授权和许可证评估。"
  }
];

export const extensions: Extension[] = [
  {
    horizon: "近期",
    title: "Provider 能力契约",
    description: "为 STT/TTS/LLM 声明 timestamps、streaming、language、cost 和 data residency。",
    value: "高",
    effort: "中",
    prerequisite: "先统一配置和错误模型"
  },
  {
    horizon: "近期",
    title: "字幕编辑与重新对齐",
    description: "允许用户修正 transcript，并对受影响 Segment 做局部重算。",
    value: "高",
    effort: "中",
    prerequisite: "版本化 Timeline 与 Recording 引用"
  },
  {
    horizon: "近期",
    title: "任务取消与资源清理",
    description: "统一长音频转码、STT、对齐、下载的进度、取消和孤儿清理。",
    value: "高",
    effort: "中",
    prerequisite: "后台任务状态机"
  },
  {
    horizon: "中期",
    title: "本地 TTS 与全离线模式",
    description: "补齐离线语音生成，显式阻止任何外部请求并展示数据边界。",
    value: "高",
    effort: "高",
    prerequisite: "模型分发、硬件探测与许可证"
  },
  {
    horizon: "中期",
    title: "内容适配器插件",
    description: "把 YouTube、网页、播客和未来来源做成声明式 Source Adapter。",
    value: "高",
    effort: "中",
    prerequisite: "稳定 Media Manifest"
  },
  {
    horizon: "中期",
    title: "学习数据导出",
    description: "导出媒体引用、Segment、录音、笔记和评测，支持可迁移备份。",
    value: "高",
    effort: "中",
    prerequisite: "定义跨版本数据格式"
  },
  {
    horizon: "重构级",
    title: "同步与冲突模型",
    description: "为多设备编辑、离线录音和字幕修改建立增量同步与冲突策略。",
    value: "高",
    effort: "高",
    prerequisite: "服务端契约与对象版本"
  },
  {
    horizon: "重构级",
    title: "Web / 扩展共享内核",
    description: "将 Timeline、训练状态和 Provider 契约抽成跨 Electron、Web、Extension 的核心包。",
    value: "高",
    effort: "高",
    prerequisite: "先研究当前新版实现"
  },
  {
    horizon: "重构级",
    title: "安全与可观测性基线",
    description: "收窄 Preload API，审计自定义协议、token、日志和云端数据路径。",
    value: "高",
    effort: "高",
    prerequisite: "威胁模型与动态测试"
  }
];

export const valueSignals = [
  {
    label: "研究价值",
    level: "高",
    text: "完整展示内容如何进入 AI 语音训练闭环。"
  },
  {
    label: "架构复用",
    level: "高",
    text: "时间轴、Provider、本地存储和 Electron 分层具有迁移价值。"
  },
  {
    label: "直接产品化",
    level: "低",
    text: "新版 Web、扩展和服务端缺失，不能直接还原当前 SaaS。"
  },
  {
    label: "当前代表性",
    level: "中低",
    text: "公开客户端是 0.7.9，适合作为历史架构基线。"
  }
];

export const researchSources: Evidence[] = [
  { label: "仓库 README", url: commit + "/README.md" },
  { label: "Monorepo package.json", url: commit + "/package.json" },
  { label: "Enjoy package.json", url: commit + "/enjoy/package.json" },
  { label: "Electron Main", url: commit + "/enjoy/src/main.ts" },
  { label: "Preload Bridge", url: commit + "/enjoy/src/preload.ts" },
  { label: "SQLite 入口", url: commit + "/enjoy/src/main/db/index.ts" },
  {
    label: "STT / Alignment",
    url: commit + "/enjoy/src/renderer/hooks/use-transcribe.tsx"
  },
  {
    label: "Pronunciation Assessment",
    url:
      commit +
      "/enjoy/src/renderer/hooks/use-pronunciation-assessments.tsx"
  },
  { label: "TTS", url: commit + "/enjoy/src/renderer/hooks/use-speech.tsx" },
  { label: "AI Commands", url: commit + "/enjoy/src/commands/text.command.ts" }
];
