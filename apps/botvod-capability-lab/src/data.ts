export type PlatformId = 'youtube' | 'bilibili' | 'x' | 'tiktok' | 'douyin' | 'instagram'

export type FormatKind = 'muxed' | 'video' | 'audio'

export interface FormatOption {
  id: string
  kind: FormatKind
  label: string
  resolution: string
  ext: string
  size: string
  codec: string
  note: string
}

export interface PlatformPreset {
  id: PlatformId
  label: string
  shortLabel: string
  url: string
  hostnames: string[]
  title: string
  author: string
  duration: string
  cachedByDefault: boolean
  formats: FormatOption[]
}

const youtubeFormats: FormatOption[] = [
  {
    id: 'yt-muxed-360',
    kind: 'muxed',
    label: '完整视频',
    resolution: '360p · 640×360',
    ext: 'MP4',
    size: '约 27.2 MB',
    codec: 'H.264 + AAC',
    note: '音画合一，兼容性最好',
  },
  {
    id: 'yt-video-4k',
    kind: 'video',
    label: '纯视频',
    resolution: '2160p60 · 3840×2160',
    ext: 'WebM',
    size: '约 1.3 GB',
    codec: 'VP9 · 无音轨',
    note: '高画质不代表自带声音',
  },
  {
    id: 'yt-audio',
    kind: 'audio',
    label: '纯音频',
    resolution: '中等码率',
    ext: 'M4A',
    size: '约 9.8 MB',
    codec: 'AAC',
    note: '适合授权内容的音频提取',
  },
]
const socialFormats: FormatOption[] = [
  {
    id: 'social-muxed-hd',
    kind: 'muxed',
    label: '完整视频',
    resolution: '1080p · 1080×1920',
    ext: 'MP4',
    size: '约 18.6 MB',
    codec: 'H.264 + AAC',
    note: '纵向短视频示例',
  },
  {
    id: 'social-muxed-sd',
    kind: 'muxed',
    label: '完整视频',
    resolution: '720p · 720×1280',
    ext: 'MP4',
    size: '约 8.4 MB',
    codec: 'H.264 + AAC',
    note: '文件更小，便于移动端使用',
  },
  {
    id: 'social-audio',
    kind: 'audio',
    label: '纯音频',
    resolution: '原始音轨',
    ext: 'M4A',
    size: '约 1.7 MB',
    codec: 'AAC',
    note: '模拟从容器中提取音轨',
  },
]

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    shortLabel: 'YT',
    url: 'https://www.youtube.com/watch?v=capability-demo',
    hostnames: ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'],
    title: '公开动画样本 · 4K 60fps（模拟元数据）',
    author: 'Capability Lab',
    duration: '10:35',
    cachedByDefault: false,
    formats: youtubeFormats,
  },
  {
    id: 'bilibili',
    label: 'Bilibili',
    shortLabel: 'B站',
    url: 'https://www.bilibili.com/video/BV1CapabilityDemo',
    hostnames: ['bilibili.com', 'www.bilibili.com', 'b23.tv'],
    title: '公开视频课程片段（模拟元数据）',
    author: 'Capability Lab',
    duration: '04:06',
    cachedByDefault: true,
    formats: [
      {
        id: 'bili-muxed-1080',
        kind: 'muxed',
        label: '完整视频',
        resolution: '1080p · 1920×1080',
        ext: 'MP4',
        size: '约 42.8 MB',
        codec: 'H.264 + AAC',
        note: '模拟音视频合一结果',
      },
      {
        id: 'bili-muxed-720',
        kind: 'muxed',
        label: '完整视频',
        resolution: '720p · 1280×720',
        ext: 'MP4',
        size: '约 24.1 MB',
        codec: 'H.264 + AAC',
        note: '通用清晰度',
      },
      youtubeFormats[2],
    ],
  },
  {
    id: 'x',
    label: 'Twitter / X',
    shortLabel: 'X',
    url: 'https://x.com/capability_lab/status/1000000000000000000',
    hostnames: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'],
    title: '公开短视频动态（模拟元数据）',
    author: '@capability_lab',
    duration: '00:12',
    cachedByDefault: true,
    formats: socialFormats,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    shortLabel: 'TK',
    url: 'https://www.tiktok.com/@capability_lab/video/1000000000000000000',
    hostnames: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
    title: '公开纵向短视频（模拟元数据）',
    author: '@capability_lab',
    duration: '00:21',
    cachedByDefault: false,
    formats: socialFormats,
  },
  {
    id: 'douyin',
    label: '抖音',
    shortLabel: '抖音',
    url: 'https://www.douyin.com/video/1000000000000000000',
    hostnames: ['douyin.com', 'www.douyin.com', 'v.douyin.com'],
    title: '公开竖屏作品（模拟元数据）',
    author: 'Capability Lab',
    duration: '00:39',
    cachedByDefault: true,
    formats: socialFormats,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    shortLabel: 'IG',
    url: 'https://www.instagram.com/reel/CapabilityDemo/',
    hostnames: ['instagram.com', 'www.instagram.com'],
    title: '公开 Reel（模拟元数据）',
    author: '@capability_lab',
    duration: '00:30',
    cachedByDefault: false,
    formats: socialFormats,
  },
]

export const CAPABILITIES = [
  {
    index: '01',
    title: '跨平台链接解析',
    description: '把页面 URL 识别为来源平台，再提取标题、作者、封面、时长和媒体清单。',
    evidence: '官网声明 + 公开缓存观察',
    tag: '公开观察',
    tone: 'observed',
  },
  {
    index: '02',
    title: '格式与轨道选择',
    description: '将完整视频、无声视频轨和音频轨分开展示，并暴露分辨率、容器、编码和预计大小。',
    evidence: '公开解析响应 + 页面代码路径',
    tag: '已验证',
    tone: 'verified',
  },
  {
    index: '03',
    title: '缓存优先交付',
    description: '相同链接与格式若已存在于服务器缓存，可绕过重复抓取，直接向浏览器返回文件。',
    evidence: '公开缓存接口 + 前端缓存命中逻辑',
    tag: '已验证',
    tone: 'verified',
  },
  {
    index: '04',
    title: '队列与进度反馈',
    description: '冷启动任务进入服务端通道，展示等待、下载、处理和完成状态，并限制并发。',
    evidence: '首页队列界面 + 公开站点配置',
    tag: '公开观察',
    tone: 'observed',
  },
  {
    index: '05',
    title: '浏览器预览与社区层',
    description: '缓存内容可预览、倍速播放，并叠加收藏、评论、分享、榜单、积分和举报。',
    evidence: '首页、缓存页与公开交互接口',
    tag: '公开观察',
    tone: 'observed',
  },
  {
    index: '06',
    title: '等级与额度治理',
    description: '游客和注册用户有不同日额度；等级影响额度与加速能力，绑定 Cookie 会扩大权限。',
    evidence: '公开配置与等级接口',
    tag: '高风险入口',
    tone: 'risk',
  },
]

export const SCENARIOS = [
  {
    fit: '适合',
    tone: 'good',
    title: '公开且已获授权的单条素材',
    description: '保存自己发布的视频、供应商已授权演示或可公开流转的参考素材。',
    value: '省去安装工具，快速进入本地剪辑或归档。',
  },
  {
    fit: '适合',
    tone: 'good',
    title: '教学与产品机制说明',
    description: '用格式清单、缓存和队列展示在线视频落地为文件的完整链路。',
    value: '把抽象的媒体分发架构变成可观察状态。',
  },
  {
    fit: '慎用',
    tone: 'warn',
    title: '竞品与趋势素材收集',
    description: '可以保存公开样本用于内部研究，但链接和兴趣可能进入第三方缓存。',
    value: '效率高，但需先判断隐私、来源与使用授权。',
  },
  {
    fit: '慎用',
    tone: 'warn',
    title: '持续批量生产',
    description: '站点没有公开 SLA、批处理 API、团队权限和授权审计。',
    value: '只适合作为可替代的临时工具，不宜成为关键链路。',
  },
  {
    fit: '不适用',
    tone: 'bad',
    title: '私密链接与客户未发布内容',
    description: '服务端解析和缓存会扩大数据接触面，公开策略与留存说明也不充分。',
    value: '应改用本地工具或受控的企业素材系统。',
  },
  {
    fit: '不适用',
    tone: 'bad',
    title: '上传主账号 Cookie',
    description: 'Cookie 是有效会话凭证；第三方持有后可能代表账号访问源站。',
    value: '便利不足以覆盖账号接管和数据暴露风险。',
  },
]

export type RoadmapTrack = 'product' | 'engineering' | 'governance'

export interface RoadmapItem {
  priority: string
  track: RoadmapTrack
  title: string
  description: string
  impact: string
  effort: string
}

export const ROADMAP: RoadmapItem[] = [
  {
    priority: 'P0',
    track: 'governance',
    title: '隐私模式与默认不公开',
    description: '提交前明确告知缓存策略，提供真正的私密任务、自动清理和可验证删除。',
    impact: '信任基础',
    effort: '中',
  },
  {
    priority: 'P0',
    track: 'governance',
    title: '运营主体与法律页面',
    description: '公开隐私政策、服务条款、版权投诉、数据留存和安全联系人。',
    impact: '降低合规不确定性',
    effort: '低',
  },
  {
    priority: 'P1',
    track: 'product',
    title: '格式智能推荐',
    description: '按“剪辑、播放、音频、移动端”目标推荐音画组合，提前提示无音轨和编码兼容性。',
    impact: '减少误选',
    effort: '中',
  },
  {
    priority: 'P1',
    track: 'engineering',
    title: '可观察的媒体处理管线',
    description: '将提取器版本、缓存命中、队列等待、源站失败和转封装状态分开呈现。',
    impact: '可诊断性',
    effort: '中',
  },
  {
    priority: 'P1',
    track: 'engineering',
    title: '本地优先 / 自托管 Worker',
    description: '让敏感链接和 Cookie 留在用户设备或自有环境，只把非敏感任务交给公共服务。',
    impact: '隐私与可靠性',
    effort: '高',
  },
  {
    priority: 'P2',
    track: 'product',
    title: '授权与来源侧车信息',
    description: '为每个文件记录来源、授权状态、用途限制、下载时间和内容指纹。',
    impact: '支持团队使用',
    effort: '高',
  },
  {
    priority: 'P2',
    track: 'product',
    title: '字幕、封面与元数据包',
    description: '在授权前提下导出字幕、封面和结构化元数据，而不只交付媒体文件。',
    impact: '扩展创作工作流',
    effort: '中',
  },
  {
    priority: 'P2',
    track: 'governance',
    title: '内容生命周期与审计',
    description: '提供公开/私密状态历史、下载审计、举报处理和定期清理证明。',
    impact: '可追责性',
    effort: '高',
  },
]
