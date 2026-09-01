import "./styles.css";

import {
  boundaryLabels,
  capabilities,
  categories,
  extensions,
  pipelineSteps,
  researchSources,
  scenarios,
  valueSignals,
  type Capability,
  type CapabilityCategory,
  type Extension,
  type PipelineStep,
  type RuntimeBoundary
} from "./data";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App mount point not found");
}

type CapabilityFilter = "all" | CapabilityCategory;
type ExtensionFilter = "全部" | Extension["horizon"];
type Theme = "light" | "dark";

let capabilityFilter: CapabilityFilter = "all";
let activeCapabilityId = capabilities[0].id;
let activePipelineId = pipelineSteps[0].id;
let extensionFilter: ExtensionFilter = "全部";

const icon = (name: "arrow" | "check" | "moon" | "sun") => {
  const common = 'viewBox="0 0 24 24" aria-hidden="true" focusable="false"';

  if (name === "arrow") {
    return '<svg ' + common + '><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  }
  if (name === "check") {
    return '<svg ' + common + '><path d="m5 12 4 4L19 6"/></svg>';
  }
  if (name === "moon") {
    return '<svg ' + common + '><path d="M20 16.5A8.5 8.5 0 0 1 7.5 4 8.5 8.5 0 1 0 20 16.5Z"/></svg>';
  }
  return '<svg ' + common + '><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
};

const boundaryPill = (boundary: RuntimeBoundary) =>
  '<span class="boundary-pill" data-boundary="' +
  boundary +
  '"><span class="boundary-dot"></span>' +
  boundaryLabels[boundary].label +
  "</span>";

const sourceLink = (label: string, url: string) =>
  '<a class="source-link" href="' +
  url +
  '" target="_blank" rel="noreferrer">' +
  label +
  icon("arrow") +
  "</a>";

app.innerHTML = [
  '<header class="topbar">',
  '<a class="brand" href="#top" aria-label="返回页面顶部">',
  '<span class="brand-mark">ECU</span>',
  '<span class="brand-copy"><strong>技术研究档案</strong><small>everyone-can-use-english</small></span>',
  "</a>",
  '<div class="topbar-meta">',
  '<span class="commit-label"><span>研究基线</span><code>3d79913</code></span>',
  '<a class="repo-link" href="https://github.com/ZuodaoTech/everyone-can-use-english" target="_blank" rel="noreferrer">查看仓库' +
    icon("arrow") +
    "</a>",
  '<button class="icon-button" id="theme-toggle" type="button" aria-label="切换到深色主题"><span class="theme-icon"></span></button>',
  "</div>",
  "</header>",

  '<main id="main-content" tabindex="-1">',
  '<section class="hero" id="top">',
  '<div class="hero-grid">',
  '<div class="hero-copy">',
  '<p class="eyebrow">OPEN-SOURCE RESEARCH / 2026.09</p>',
  '<h1>把任意内容加工成英语训练材料的工作台，<br><em>而不是完整的英语教学体系。</em></h1>',
  '<p class="hero-lead">它将 <strong>内容获取、智能处理、学习适配和结果沉淀</strong> 组织成一条产品闭环：程序负责流程编排，AI 负责转写、翻译、生成、朗读和评测等智能节点，用户仍然决定素材、目标与下一步训练。</p>',
  '<div class="hero-actions">',
  '<a class="primary-action" href="#capabilities">查看能力地图' + icon("arrow") + "</a>",
  '<a class="text-action" href="#principles">拆解实现原理</a>',
  "</div>",
  "</div>",
  '<aside class="thesis-card" aria-label="研究结论摘要">',
  '<div class="card-kicker">ARCHITECTURE THESIS</div>',
  '<p>内容输入 <span>→</span> 标准音频 <span>→</span> STT <span>→</span> DTW 对齐 <span>→</span> Segment 训练 <span>→</span> 多层反馈</p>',
  '<dl class="hero-stats">',
  '<div><dt>12</dt><dd>项可确认能力</dd></div>',
  '<div><dt>6</dt><dd>步核心流水线</dd></div>',
  '<div><dt>4</dt><dd>类运行边界</dd></div>',
  "</dl>",
  '<div class="scope-note"><strong>范围边界</strong><span>“任意内容”是可适配来源的架构抽象，不代表兼容所有格式与网站；公开代码可确认本地/在线音视频、YouTube、EPUB、TXT、Markdown、网页文章、用户文本和 AI 文本。仓库主要代表 Electron 0.7.9 历史客户端。</span></div>',
  "</aside>",
  "</div>",
  "</section>",

  '<nav class="section-nav" aria-label="研究章节">',
  '<a href="#positioning">01 定位</a>',
  '<a href="#capabilities">02 能力</a>',
  '<a href="#principles">03 原理</a>',
  '<a href="#boundaries">04 边界</a>',
  '<a href="#scenarios">05 场景</a>',
  '<a href="#extensions">06 扩展</a>',
  '<a href="#value">07 价值</a>',
  "</nav>",

  '<div class="research-layout">',
  '<aside class="rail" aria-label="页面说明">',
  '<p>RESEARCH DOSSIER</p>',
  '<span>以源码为证据，区分“仓库能证明什么”与“线上产品可能具有什么”。</span>',
  "</aside>",
  '<div class="research-content">',

  '<section class="section-block" id="positioning" data-nav-section>',
  '<div class="section-heading">',
  '<div><span class="section-index">01 / POSITIONING</span><h2>能力定位：一套 local-first 的英语训练工作台</h2></div>',
  '<p>它的能力可分为三层。越接近底层媒体与时间轴，仓库证据越完整；越接近在线账户、同步和社区，公开实现越不完整。</p>',
  "</div>",
  '<div class="layer-stack">',
  '<article class="layer-card layer-core"><span>CORE / 完整度高</span><h3>媒体与训练内核</h3><p>导入、转码、识别、强制对齐、播放、录音、波形、笔记。</p><div>可本地运行 · 数据可落盘 · 代码路径清晰</div></article>',
  '<article class="layer-card layer-provider"><span>PROVIDER / 可替换</span><h3>语音与生成式 AI</h3><p>Whisper、OpenAI-compatible、Cloudflare、Azure、Ollama。</p><div>统一编排 · 成本与隐私取决于配置</div></article>',
  '<article class="layer-card layer-service"><span>SERVICE / 源码缺失</span><h3>账户与云平台</h3><p>登录、同步、课程、社区、云存储、实时消息。</p><div>只能看到客户端契约 · 无法验证服务端内部实现</div></article>',
  "</div>",
  '<div class="teaching-gap-note"><strong>为什么不是完整教学体系</strong><span>公开实现没有形成课程图谱、学习者模型、长期记忆、复习调度、自适应难度与 AI 教练决策层；它解决的是“如何把内容变成训练”，不是“完整决定一个人应该怎样学”。</span></div>',
  '<figure class="capability-panorama" aria-labelledby="panorama-title">',
  '<figcaption><div><span class="section-index">ONE MAP / FULL CAPABILITY</span><h3 id="panorama-title">一张图看懂：内容如何变成可持续的英语训练</h3></div><p>从输入适配到智能处理，再到训练动作和学习资产落地；颜色标签同时标明本地、混合、云端和未开源边界。</p></figcaption>',
  '<div class="panorama-flow" aria-label="Everyone Can Use English 完整能力流">',
  '<article class="panorama-stage stage-ingest">',
  '<header><span>01</span><div><small>INGEST</small><h4>内容获取</h4></div></header>',
  '<div class="panorama-cluster"><strong>音视频</strong><span>本地音频 / 视频</span><span>在线媒体 URL</span><span>YouTube 地址</span></div>',
  '<div class="panorama-cluster"><strong>文档与网页</strong><span>EPUB / TXT / Markdown</span><span>网页文章 URL</span></div>',
  '<div class="panorama-cluster"><strong>文本与生成</strong><span>用户输入文本</span><span>AI 生成或改写内容</span></div>',
  '<footer>' + boundaryPill("local") + '<span>输出：原始内容资产</span></footer>',
  "</article>",
  '<div class="panorama-arrow" aria-hidden="true"><span>→</span><small>解析</small></div>',
  '<article class="panorama-stage stage-process">',
  '<header><span>02</span><div><small>PROCESS</small><h4>智能处理</h4></div></header>',
  '<div class="panorama-cluster"><strong>媒体标准化</strong><span>下载 / 复制 / 元数据</span><span>EchoGarden / FFmpeg</span><span>16 kHz WAV</span></div>',
  '<div class="panorama-cluster"><strong>语音与时间</strong><span>Whisper / OpenAI / Cloudflare / Azure STT</span><span>DTW 词级对齐 → 句子聚合</span></div>',
  '<div class="panorama-cluster"><strong>语言生成</strong><span>翻译 / 润色 / 查词 / 补标点</span><span>OpenAI-compatible / Ollama</span><span>OpenAI-compatible / Azure TTS</span></div>',
  '<footer>' + boundaryPill("hybrid") + '<span>输出：文本、语音与时间轴</span></footer>',
  "</article>",
  '<div class="panorama-arrow" aria-hidden="true"><span>→</span><small>统一</small></div>',
  '<article class="panorama-stage stage-model">',
  '<header><span>03</span><div><small>MODEL</small><h4>学习中间层</h4></div></header>',
  '<div class="panorama-cluster"><strong>内容对象</strong><span>Audio / Video</span><span>Document / Speech</span></div>',
  '<div class="panorama-cluster core-cluster"><strong>时间语义核心</strong><span>Transcript：说了什么</span><span>Timeline：词在何时</span><span>Segment：训练哪一句</span></div>',
  '<div class="panorama-cluster"><strong>统一关联</strong><span>target + segment</span><span>原音、录音、笔记与评测共享引用</span></div>',
  '<footer>' + boundaryPill("local") + '<span>价值：解耦来源、模型与交互</span></footer>',
  "</article>",
  '<div class="panorama-arrow" aria-hidden="true"><span>→</span><small>驱动</small></div>',
  '<article class="panorama-stage stage-practice">',
  '<header><span>04</span><div><small>PRACTICE</small><h4>学习驱动</h4></div></header>',
  '<div class="panorama-cluster"><strong>输入训练</strong><span>逐句播放 / 单句循环 / 连续播放</span><span>选词与短语训练</span><span>文章朗读与跟读</span></div>',
  '<div class="panorama-cluster"><strong>输出训练</strong><span>逐句录音 / 回听</span><span>原音与录音同步</span><span>波形 / Pitch contour</span></div>',
  '<div class="panorama-cluster"><strong>反馈与辅助</strong><span>Azure 音素 / 流利度 / 韵律</span><span>AI 角色对话 / 表达建议</span><span>词典 / 笔记 / 训练统计</span></div>',
  '<footer>' + boundaryPill("hybrid") + '<span>输出：训练行为与反馈记录</span></footer>',
  "</article>",
  '<div class="panorama-arrow" aria-hidden="true"><span>→</span><small>沉淀</small></div>',
  '<article class="panorama-stage stage-store">',
  '<header><span>05</span><div><small>PERSIST</small><h4>信息存储</h4></div></header>',
  '<div class="panorama-cluster"><strong>SQLite 数据</strong><span>媒体 / 文档 / 转写 / Segment</span><span>录音 / 评测 / 笔记 / 对话</span><span>设置 / 缓存 / 统计关系</span></div>',
  '<div class="panorama-cluster"><strong>本地文件</strong><span>媒体 / Speech / Recordings</span><span>Waveform / 模型 / 词典</span></div>',
  '<div class="panorama-cluster"><strong>云端契约</strong><span>账户 / REST / ActionCable</span><span>上传 / 课程 / 社区 / 同步入口</span><span>服务端内部实现不可确认</span></div>',
  '<footer><div class="panorama-footer-pills">' + boundaryPill("local") + boundaryPill("missing") + '</div><span>本地学习资产完整；云平台只见客户端契约</span></footer>',
  "</article>",
  "</div>",
  '<div class="panorama-model-band">',
  '<div><small>统一数据骨架</small><strong>Media</strong><b>→</b><strong>Transcript</strong><b>→</b><strong>Timeline</strong><b>→</b><strong>Segment</strong><b>→</b><strong>Recording · Assessment · Note</strong></div>',
  '<p>只要新内容最终能产出音频、文本和时间轴，就能复用同一套播放、跟读、录音、评测和数据沉淀能力。</p>',
  "</div>",
  '<div class="panorama-responsibility">',
  '<div><span>USER / 决策者</span><strong>选择素材、目标、供应商、练习句子和下一步</strong></div>',
  '<div><span>PROGRAM / 编排者</span><strong>执行接入、任务流、状态管理、文件与数据一致性</strong></div>',
  '<div><span>AI / 智能节点</span><strong>转写、翻译、生成、朗读和评分；当前不是自主课程教练</strong></div>',
  "</div>",
  '<div class="panorama-legend"><span>' + boundaryPill("local") + '媒体、数据与部分模型可留在设备内</span><span>' + boundaryPill("hybrid") + '可在本地与云服务间选择</span><span>' + boundaryPill("cloud") + 'Azure 评测、令牌和在线平台依赖外部服务</span><span>' + boundaryPill("missing") + '新版 Web、扩展与后端源码缺失</span></div>',
  "</figure>",
  "</section>",

  '<section class="section-block" id="capabilities" data-nav-section>',
  '<div class="section-heading split-heading">',
  '<div><span class="section-index">02 / CAPABILITY MAP</span><h2>它具体能做什么</h2></div>',
  '<p><span id="capability-count">12</span> 项能力；点击卡片查看输入、处理、输出、实现证据和限制。</p>',
  "</div>",
  '<div class="filter-row" id="capability-filters" aria-label="筛选能力"></div>',
  '<div class="capability-grid" id="capability-grid"></div>',
  '<div class="capability-inspector" id="capability-inspector" role="region" aria-live="polite" aria-label="能力详情"></div>',
  "</section>",

  '<section class="section-block" id="principles" data-nav-section>',
  '<div class="section-heading">',
  '<div><span class="section-index">03 / IMPLEMENTATION</span><h2>核心原理：把识别与时间定位拆开</h2></div>',
  '<p>STT 回答“说了什么”，DTW forced alignment 回答“每个词在什么时候”。Segment 时间轴再驱动播放器、录音、笔记和评测。</p>',
  "</div>",
  '<div class="pipeline" id="pipeline">',
  '<div class="pipeline-track" id="pipeline-tabs" role="tablist" aria-label="语音训练处理流程"></div>',
  '<div class="pipeline-detail" id="pipeline-detail" role="tabpanel" aria-live="polite"></div>',
  "</div>",
  '<div class="architecture-note">',
  '<div class="architecture-code" aria-label="数据流示意">',
  '<span>Media</span><b>→</b><span>Audio 16 kHz</span><b>→</b><span>Transcript</span><b>→</b><span>Timeline</span><b>→</b><span>Segment</span>',
  "</div>",
  '<p><strong>关键设计判断：</strong>Segment 不是字幕展示用的附件，而是原音、录音、评测、笔记和统计共享的业务主键。这个抽象让内容来源和模型供应商都可以变化，而训练交互仍保持稳定。</p>',
  "</div>",
  "</section>",

  '<section class="section-block" id="boundaries" data-nav-section>',
  '<div class="section-heading">',
  '<div><span class="section-index">04 / RUNTIME BOUNDARY</span><h2>本地、云端与未开源边界</h2></div>',
  '<p>“开源客户端”不等于“所有能力都能离线运行”，也不等于“线上产品已完整开源”。</p>',
  "</div>",
  '<div class="boundary-grid">',
  '<article data-boundary-card="local"><header>' + boundaryPill("local") + '<strong>设备内闭环</strong></header><ul><li>SQLite 学习数据</li><li>媒体、录音与波形文件</li><li>Whisper / EchoGarden</li><li>DTW 对齐与播放器状态</li></ul></article>',
  '<article data-boundary-card="hybrid"><header>' + boundaryPill("hybrid") + '<strong>供应商可选</strong></header><ul><li>STT：本地或云端</li><li>LLM：OpenAI-compatible / Ollama</li><li>TTS：OpenAI-compatible / Azure</li><li>隐私与成本随配置变化</li></ul></article>',
  '<article data-boundary-card="cloud"><header>' + boundaryPill("cloud") + '<strong>外部服务依赖</strong></header><ul><li>Azure 发音评测</li><li>Enjoy 短期 token</li><li>账户、上传与社区</li><li>云端请求可能计费</li></ul></article>',
  '<article data-boundary-card="missing"><header>' + boundaryPill("missing") + '<strong>只能看到契约</strong></header><ul><li>当前 Web 产品</li><li>Chrome 扩展</li><li>enjoy.bot 服务端</li><li>同步与冲突策略</li></ul></article>',
  "</div>",
  '<div class="source-boundary">',
  '<div><span>公开可审查</span><strong>Electron 客户端 / 文档 / 数据模型 / Provider 编排</strong></div>',
  '<div class="boundary-arrow">CLIENT CONTRACT <b>→</b> UNKNOWN IMPLEMENTATION</div>',
  '<div><span>不可由仓库确认</span><strong>当前 SaaS 后端 / Web 内核 / 扩展机制 / 线上部署拓扑</strong></div>',
  "</div>",
  '<p class="license-note"><strong>额外风险：</strong>根目录声明 GPL-3.0，而旧 Electron 子包元数据标记 MIT。若要复用代码，需要在发布前确认文件级版权与适用许可证，不能只读一个 package.json。</p>',
  "</section>",

  '<section class="section-block" id="scenarios" data-nav-section>',
  '<div class="section-heading">',
  '<div><span class="section-index">05 / USE CASES</span><h2>适合用在哪里</h2></div>',
  '<p>场景分为直接适用、需要适配和只建议参考三档，避免把原型价值误读成生产成熟度。</p>',
  "</div>",
  '<div class="scenario-grid" id="scenario-grid"></div>',
  "</section>",

  '<section class="section-block" id="extensions" data-nav-section>',
  '<div class="section-heading split-heading">',
  '<div><span class="section-index">06 / EXTENSION</span><h2>可扩展方向</h2></div>',
  '<p>按改造半径排序：先补强单机工作流，再抽象跨端内核，最后处理平台级同步与安全。</p>',
  "</div>",
  '<div class="filter-row" id="extension-filters" aria-label="筛选扩展阶段"></div>',
  '<div class="extension-list" id="extension-list"></div>',
  "</section>",

  '<section class="section-block" id="value" data-nav-section>',
  '<div class="section-heading">',
  '<div><span class="section-index">07 / REFERENCE VALUE</span><h2>它最值得参考什么</h2></div>',
  '<p>适合研究“语音 AI 如何进入真实产品闭环”，不适合把旧客户端原样当成当前完整产品模板。</p>',
  "</div>",
  '<div class="value-layout">',
  '<div class="signal-list" id="signal-list"></div>',
  '<div class="reference-card">',
  '<span class="card-kicker">REUSABLE PATTERNS</span>',
  '<ol><li><strong>稳定的中间表示：</strong>用 Timeline / Segment 解耦媒体、模型与交互。</li><li><strong>本地资产优先：</strong>先保存可迁移的数据，再叠加在线能力。</li><li><strong>Provider 可替换：</strong>让同一业务流程选择本地、云端或自建模型。</li><li><strong>AI 输出回到业务：</strong>生成文本不止显示出来，而是继续进入 TTS、分句和跟读。</li></ol>',
  '<div class="not-copy-list"><strong>不建议直接照搬</strong><span>旧版依赖栈</span><span>宽泛的 Preload API</span><span>未知的云端契约</span><span>未澄清的许可证边界</span></div>',
  "</div>",
  "</div>",
  "</section>",

  '<section class="section-block sources-section" id="sources">',
  '<div class="section-heading">',
  '<div><span class="section-index">SOURCE INDEX</span><h2>研究证据索引</h2></div>',
  '<p>所有关键判断均锚定到固定 commit，避免主分支变化后证据漂移。</p>',
  "</div>",
  '<div class="sources-grid" id="sources-grid"></div>',
  '<div class="method-note"><strong>研究方法</strong><p>静态阅读仓库结构、文档、Electron 主进程、Preload Bridge、SQLite 模型、语音 Hooks 与 API Client；结论区分“源码直接证明”“由调用契约推断”“仓库无法确认”三种置信度。本页面不代表官方说明。</p></div>',
  "</section>",
  "</div>",
  "</div>",
  "</main>",

  '<footer><a href="https://github.com/yydshly/0831_codex_project/tree/main/research/zuodaotech-everyone-can-use-english" target="_blank" rel="noreferrer">Everyone Can Use English · 研究记录</a><span>固定提交研究 · GitHub Pages · 非官方</span></footer>'
].join("");

const capabilityFilters = document.querySelector<HTMLDivElement>("#capability-filters");
const capabilityGrid = document.querySelector<HTMLDivElement>("#capability-grid");
const capabilityInspector = document.querySelector<HTMLDivElement>("#capability-inspector");
const capabilityCount = document.querySelector<HTMLSpanElement>("#capability-count");
const pipelineTabs = document.querySelector<HTMLDivElement>("#pipeline-tabs");
const pipelineDetail = document.querySelector<HTMLDivElement>("#pipeline-detail");
const extensionFilters = document.querySelector<HTMLDivElement>("#extension-filters");
const extensionList = document.querySelector<HTMLDivElement>("#extension-list");

const renderCapabilityFilters = () => {
  if (!capabilityFilters) return;
  capabilityFilters.innerHTML = categories
    .map(
      (category) =>
        '<button type="button" class="filter-button' +
        (category.id === capabilityFilter ? " is-active" : "") +
        '" data-capability-filter="' +
        category.id +
        '" aria-pressed="' +
        String(category.id === capabilityFilter) +
        '"><small>' +
        category.short +
        "</small>" +
        category.label +
        "</button>"
    )
    .join("");

  capabilityFilters.querySelectorAll<HTMLButtonElement>("[data-capability-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      capabilityFilter = button.dataset.capabilityFilter as CapabilityFilter;
      const visible = capabilities.filter(
        (capability) => capabilityFilter === "all" || capability.category === capabilityFilter
      );
      if (!visible.some((capability) => capability.id === activeCapabilityId)) {
        activeCapabilityId = visible[0]?.id ?? capabilities[0].id;
      }
      renderCapabilityFilters();
      renderCapabilities();
    });
  });
};

const renderInspector = (capability: Capability) => {
  if (!capabilityInspector) return;

  capabilityInspector.innerHTML = [
    '<div class="inspector-title"><span>' + capability.index + " / DETAIL</span><div>" + boundaryPill(capability.boundary) + "<h3>" + capability.title + "</h3></div><p>" + capability.summary + "</p></div>",
    '<div class="io-flow"><div><small>INPUT</small><strong>' + capability.input + '</strong></div><b>→</b><div><small>PROCESS</small><strong>' + capability.process + '</strong></div><b>→</b><div><small>OUTPUT</small><strong>' + capability.output + "</strong></div></div>",
    '<div class="inspector-columns"><div><h4>实现组件</h4><ul>' + capability.implementation.map((item) => "<li>" + icon("check") + item + "</li>").join("") + '</ul></div><div><h4>能力限制</h4><p>' + capability.limits + '</p><div class="evidence-links">' + capability.evidence.map((evidence) => sourceLink(evidence.label, evidence.url)).join("") + "</div></div></div>"
  ].join("");
};

const renderCapabilities = () => {
  if (!capabilityGrid || !capabilityCount) return;
  const visible = capabilities.filter(
    (capability) => capabilityFilter === "all" || capability.category === capabilityFilter
  );
  capabilityCount.textContent = String(visible.length);
  capabilityGrid.innerHTML = visible
    .map(
      (capability) =>
        '<button class="capability-card' +
        (capability.id === activeCapabilityId ? " is-active" : "") +
        '" type="button" data-capability-id="' +
        capability.id +
        '" aria-pressed="' +
        String(capability.id === activeCapabilityId) +
        '"><span class="capability-top"><span class="capability-index">' +
        capability.index +
        "</span>" +
        boundaryPill(capability.boundary) +
        '</span><strong>' +
        capability.title +
        "</strong><p>" +
        capability.summary +
        '</p><span class="card-open">查看实现' +
        icon("arrow") +
        "</span></button>"
    )
    .join("");

  capabilityGrid.querySelectorAll<HTMLButtonElement>("[data-capability-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCapabilityId = button.dataset.capabilityId ?? capabilities[0].id;
      renderCapabilities();
      document.querySelector("#capability-inspector")?.scrollIntoView({ block: "nearest" });
    });
  });

  const active = capabilities.find((capability) => capability.id === activeCapabilityId) ?? visible[0];
  if (active) renderInspector(active);
};

const renderPipelineDetail = (step: PipelineStep) => {
  if (!pipelineDetail) return;
  pipelineDetail.innerHTML = [
    '<div class="pipeline-copy"><span>' + step.index + " / " + boundaryLabels[step.boundary].label + "</span><h3>" + step.title + '：' + step.short + '</h3><p>' + step.takeaway + '</p><div class="technology-list">' + step.technology.map((technology) => "<span>" + technology + "</span>").join("") + "</div>" + sourceLink(step.evidence.label, step.evidence.url) + "</div>",
    '<div class="pipeline-io"><div><small>输入</small><strong>' + step.input + '</strong></div><div><small>核心处理</small><strong>' + step.process + '</strong></div><div><small>输出</small><strong>' + step.output + "</strong></div></div>"
  ].join("");
};

const renderPipeline = () => {
  if (!pipelineTabs) return;
  pipelineTabs.innerHTML = pipelineSteps
    .map(
      (step) =>
        '<button type="button" role="tab" class="pipeline-step' +
        (step.id === activePipelineId ? " is-active" : "") +
        '" data-pipeline-id="' +
        step.id +
        '" aria-selected="' +
        String(step.id === activePipelineId) +
        '"><span>' +
        step.index +
        "</span><strong>" +
        step.title +
        "</strong><small>" +
        step.short +
        "</small></button>"
    )
    .join("");

  pipelineTabs.querySelectorAll<HTMLButtonElement>("[data-pipeline-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activePipelineId = button.dataset.pipelineId ?? pipelineSteps[0].id;
      renderPipeline();
    });
  });

  const active = pipelineSteps.find((step) => step.id === activePipelineId) ?? pipelineSteps[0];
  renderPipelineDetail(active);
};

const fitLabels: Record<string, string> = {
  direct: "直接适用",
  adapt: "需要适配",
  reference: "仅作参考"
};

const renderScenarios = () => {
  const grid = document.querySelector<HTMLDivElement>("#scenario-grid");
  if (!grid) return;
  grid.innerHTML = scenarios
    .map(
      (scenario) =>
        '<article class="scenario-card" data-fit="' +
        scenario.fit +
        '"><div class="scenario-meta"><span>' +
        fitLabels[scenario.fit] +
        "</span><small>" +
        scenario.audience +
        "</small></div><h3>" +
        scenario.title +
        "</h3><p>" +
        scenario.description +
        '</p><dl><div><dt>价值</dt><dd>' +
        scenario.value +
        "</dd></div><div><dt>前提</dt><dd>" +
        scenario.condition +
        "</dd></div></dl></article>"
    )
    .join("");
};

const extensionStages: ExtensionFilter[] = ["全部", "近期", "中期", "重构级"];

const renderExtensionFilters = () => {
  if (!extensionFilters) return;
  extensionFilters.innerHTML = extensionStages
    .map(
      (stage) =>
        '<button type="button" class="filter-button' +
        (stage === extensionFilter ? " is-active" : "") +
        '" data-extension-filter="' +
        stage +
        '" aria-pressed="' +
        String(stage === extensionFilter) +
        '"><small>ROADMAP</small>' +
        stage +
        "</button>"
    )
    .join("");
  extensionFilters.querySelectorAll<HTMLButtonElement>("[data-extension-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      extensionFilter = button.dataset.extensionFilter as ExtensionFilter;
      renderExtensionFilters();
      renderExtensions();
    });
  });
};

const renderExtensions = () => {
  if (!extensionList) return;
  const visible = extensions.filter(
    (extension) => extensionFilter === "全部" || extension.horizon === extensionFilter
  );
  extensionList.innerHTML = visible
    .map(
      (extension, index) =>
        '<article class="extension-row"><span class="extension-number">' +
        String(index + 1).padStart(2, "0") +
        '</span><div class="extension-main"><div><span class="horizon-tag">' +
        extension.horizon +
        "</span><h3>" +
        extension.title +
        "</h3></div><p>" +
        extension.description +
        '</p></div><dl><div><dt>价值</dt><dd>' +
        extension.value +
        "</dd></div><div><dt>投入</dt><dd>" +
        extension.effort +
        '</dd></div></dl><div class="prerequisite"><span>前置条件</span><strong>' +
        extension.prerequisite +
        "</strong></div></article>"
    )
    .join("");
};

const renderSignals = () => {
  const list = document.querySelector<HTMLDivElement>("#signal-list");
  if (!list) return;
  list.innerHTML = valueSignals
    .map(
      (signal) =>
        '<article class="signal-card"><div><span>' +
        signal.label +
        "</span><strong>" +
        signal.level +
        '</strong></div><p>' +
        signal.text +
        '</p><div class="signal-meter" data-level="' +
        signal.level +
        '"><span></span></div></article>'
    )
    .join("");
};

const renderSources = () => {
  const grid = document.querySelector<HTMLDivElement>("#sources-grid");
  if (!grid) return;
  grid.innerHTML = researchSources
    .map(
      (source, index) =>
        '<a href="' +
        source.url +
        '" target="_blank" rel="noreferrer"><span>' +
        String(index + 1).padStart(2, "0") +
        "</span><strong>" +
        source.label +
        "</strong>" +
        icon("arrow") +
        "</a>"
    )
    .join("");
};

const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem("ecu-research-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  const buttonIcon = document.querySelector<HTMLSpanElement>(".theme-icon");
  if (button) button.setAttribute("aria-label", theme === "light" ? "切换到深色主题" : "切换到浅色主题");
  if (buttonIcon) buttonIcon.innerHTML = icon(theme === "light" ? "moon" : "sun");
};

const setupTheme = () => {
  applyTheme(getInitialTheme());
  document.querySelector<HTMLButtonElement>("#theme-toggle")?.addEventListener("click", () => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("ecu-research-theme", next);
    applyTheme(next);
  });
};

const setupSectionNavigation = () => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".section-nav a"));
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-section]"));
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + visible.target.id);
      });
    },
    { rootMargin: "-20% 0px -65%", threshold: [0, 0.1, 0.5] }
  );
  sections.forEach((section) => observer.observe(section));
};

renderCapabilityFilters();
renderCapabilities();
renderPipeline();
renderScenarios();
renderExtensionFilters();
renderExtensions();
renderSignals();
renderSources();
setupTheme();
setupSectionNavigation();
