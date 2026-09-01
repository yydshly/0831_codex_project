import './styles.css'
import {
  CAPABILITIES,
  PLATFORM_PRESETS,
  ROADMAP,
  SCENARIOS,
  type FormatOption,
  type PlatformPreset,
  type RoadmapTrack,
} from './data'

type DemoState =
  | 'idle'
  | 'invalid'
  | 'unsupported'
  | 'analyzing'
  | 'ready'
  | 'delivering'
  | 'success'

type BranchMode = 'auto' | 'cached' | 'queue'

type PipelineNode = 'client' | 'extractor' | 'manifest' | 'cache' | 'worker' | 'package' | 'delivery'

interface RuntimeState {
  demoState: DemoState
  preset: PlatformPreset | null
  selectedFormat: FormatOption | null
  branchMode: BranchMode
  resolvedBranch: Exclude<BranchMode, 'auto'> | null
  generation: number
  logIndex: number
}

const runtime: RuntimeState = {
  demoState: 'idle',
  preset: null,
  selectedFormat: null,
  branchMode: 'auto',
  resolvedBranch: null,
  generation: 0,
  logIndex: 0,
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

const capabilityCards = CAPABILITIES.map(
  (item) => `
    <article class="capability-card" data-tone="${item.tone}">
      <div class="card-kicker">
        <span class="card-index">${item.index}</span>
        <span class="evidence-chip">${item.tag}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="evidence-line">
        <span>证据</span>
        <strong>${item.evidence}</strong>
      </div>
    </article>
  `,
).join('')

const presetButtons = PLATFORM_PRESETS.map(
  (preset, index) => `
    <button
      class="preset-button"
      type="button"
      data-preset="${preset.id}"
      aria-pressed="${index === 0 ? 'true' : 'false'}"
    >
      <span>${preset.shortLabel}</span>
      ${preset.label}
    </button>
  `,
).join('')

const scenarioCards = SCENARIOS.map(
  (scenario) => `
    <article class="scenario-card" data-tone="${scenario.tone}">
      <div class="scenario-heading">
        <span class="fit-chip">${scenario.fit}</span>
        <h3>${scenario.title}</h3>
      </div>
      <p>${scenario.description}</p>
      <div class="scenario-value"><span>实际意义</span>${scenario.value}</div>
    </article>
  `,
).join('')

app.innerHTML = `
  <div class="offline-banner" id="offline-banner" role="status" hidden>
    当前离线：页面仍使用内置数据完成本地演示，不会尝试联网。
  </div>

  <header class="site-header">
    <a class="brand" href="#overview" aria-label="BotVod Capability Lab 首页">
      <span class="brand-mark" aria-hidden="true">BV</span>
      <span><strong>Capability Lab</strong><small>Independent research</small></span>
    </a>
    <nav class="site-nav" aria-label="页面导航">
      <a href="#core-questions">核心判断</a>
      <a href="#capability-demo">交互演示</a>
      <a href="#principles">技术原理</a>
      <a href="#ecosystem">系统全景</a>
      <a href="#scenarios">使用场景</a>
      <a href="#roadmap">对我方价值</a>
      <a href="#risks">风险边界</a>
    </nav>
    <a class="source-link" href="https://botvod.com/" target="_blank" rel="noreferrer">
      查看目标网页 <span aria-hidden="true">↗</span>
    </a>
  </header>

  <main id="main-content">
    <section class="hero section-shell" id="overview" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span></span>更新于 2026-09-01 · 独立研究</div>
        <h1 id="hero-title">不是搜全网，<br />是给链接<span>找媒体源</span></h1>
        <p class="hero-lead">
          BotVod 的核心不是搜索引擎，也不是播放器。<br class="mobile-only-break" />它接收一个已知视频页面 URL，解析出媒体清单，<br class="mobile-only-break" />再用缓存或服务端任务把文件交付给浏览器。
        </p>
        <div class="hero-actions">
          <a class="button primary-button" href="#core-questions">先看三个结论</a>
          <a class="button ghost-button" href="#capability-demo">运行本地演示</a>
        </div>
        <p class="independence-note">
          非官方项目 · 不连接 BotVod · 不访问输入链接 · 不产生真实下载
        </p>
      </div>

      <aside class="verdict-card" aria-label="产品判断">
        <div class="verdict-topline"><span>产品定位</span><strong>MEDIA INTAKE</strong></div>
        <p>URL 媒体找源</p>
        <div class="verdict-operator">＋</div>
        <p>任务与缓存底座</p>
        <div class="verdict-operator">＋</div>
        <p>文件交付与内容目录</p>
        <div class="verdict-footer">
          <span>核心</span><strong>把异构平台页面变成统一媒体清单</strong>
          <span>边界</span><strong>没有证据表明它会按关键词搜索整个公网</strong>
        </div>
      </aside>

      <div class="hero-metrics" aria-label="研究摘要">
        <div><strong>1</strong><span>核心输入：已知 URL</span></div>
        <div><strong>3</strong><span>需区分的“搜索”</span></div>
        <div><strong>2</strong><span>文件交付分支</span></div>
        <div><strong>0</strong><span>公网关键词搜索证据</span></div>
      </div>
    </section>

    <section class="thesis-section section-shell" id="core-questions" aria-labelledby="core-questions-title">
      <div class="section-heading split-heading">
        <div>
          <div class="section-number">01 / CORE TECHNICAL JUDGMENT</div>
          <h2 id="core-questions-title">先把三个问题说透</h2>
        </div>
        <p>核心判断来自公开页面、接口形态与前端行为；服务端私有实现只能按行业常见职责做推断。</p>
      </div>

      <div class="core-thesis" aria-label="三个核心问题的结论">
        <article>
          <span class="question-index">Q1 · 产品定位</span>
          <h3>URL 驱动的媒体摄取服务</h3>
          <p>输入不是关键词，而是一个已知视频页面链接；输出不是网页列表，而是统一的元数据、媒体轨与可交付文件。</p>
          <div class="thesis-formula"><span>页面 URL</span><b>→</b><span>Media Manifest</span><b>→</b><span>Asset</span></div>
        </article>
        <article>
          <span class="question-index">Q2 · 如何“搜源”</span>
          <h3>它不是搜全网，而是解析已知页面</h3>
          <p>核心动作是识别平台、读取页面/API/播放器元数据，拿到该页面对应的媒体清单；站内搜索只查自己的缓存目录。</p>
          <div class="answer-mark"><strong>NO</strong><span>公网视频搜索引擎</span></div>
        </article>
        <article>
          <span class="question-index">Q3 · 播放与下载</span>
          <h3>交付更标准化，找源决定上限</h3>
          <p>若已经得到稳定、授权、可直接访问的媒体对象，播放和下载确实是成熟工程；难点前移到签名、凭证、分轨和生命周期。</p>
          <div class="answer-mark positive"><strong>YES</strong><span>但不是零工程问题</span></div>
        </article>
      </div>

      <div class="search-boundary" aria-labelledby="search-boundary-title">
        <div class="search-boundary-heading">
          <div>
            <span class="mini-kicker">SEARCH ≠ SEARCH</span>
            <h3 id="search-boundary-title">“搜索”必须拆成三种能力</h3>
          </div>
          <p>把这三件事混在一起，会高估 BotVod 的发现能力，也会低估平台适配器的技术价值。</p>
        </div>
        <div class="search-grid">
          <article class="search-card" data-status="absent">
            <div class="search-status"><span>01</span><strong>未观察到</strong></div>
            <h4>公网内容搜索</h4>
            <p>用标题、主题或自然语言，从整个互联网返回候选视频页面。</p>
            <div class="io-line"><span>关键词</span><b>→</b><span>网页结果集</span></div>
            <small>BotVod 没有公开证据支持这一层。</small>
          </article>
          <article class="search-card" data-status="observed">
            <div class="search-status"><span>02</span><strong>公开观察</strong></div>
            <h4>站内缓存检索</h4>
            <p>按标题、作者或平台，在已经被 BotVod 解析并缓存的资产目录里查找。</p>
            <div class="io-line"><span>检索词</span><b>→</b><span>缓存资产</span></div>
            <small>这是内容发现层，不负责发现新的源站页面。</small>
          </article>
          <article class="search-card" data-status="core">
            <div class="search-status"><span>03</span><strong>核心能力</strong></div>
            <h4>已知 URL 媒体找源</h4>
            <p>给定页面链接，解析出标题、轨道、容器、分辨率以及可供后续任务取得的媒体信息。</p>
            <div class="io-line"><span>页面 URL</span><b>→</b><span>媒体清单</span></div>
            <small>这才是 BotVod 的“找源”。</small>
          </article>
        </div>
      </div>

      <div class="source-system" aria-labelledby="source-system-title">
        <div class="source-system-intro">
          <span class="mini-kicker">SOURCE RESOLUTION</span>
          <h3 id="source-system-title">它怎样从页面链接找到媒体源</h3>
          <p>站点没有公开服务端代码。右侧是依据 <code>/api/info</code>、格式字段、缓存与任务状态还原的职责流程，不代表已确认具体库或厂商。</p>
          <div class="evidence-key" aria-label="证据类型">
            <span data-evidence="observed">公开观察</span>
            <span data-evidence="inferred">技术推断</span>
          </div>
        </div>
        <ol class="source-flow-list">
          <li>
            <span class="flow-id">01</span>
            <div><strong>规范化 URL</strong><p>识别域名、短链、内容 ID 与必要参数，形成稳定的内容键。</p></div>
            <small data-evidence="inferred">技术推断</small>
          </li>
          <li>
            <span class="flow-id">02</span>
            <div><strong>路由到平台适配器</strong><p>不同站点的页面结构、接口、签名与访问约束各不相同。</p></div>
            <small data-evidence="inferred">技术推断</small>
          </li>
          <li>
            <span class="flow-id">03</span>
            <div><strong>读取页面 / API / 播放器元数据</strong><p>获取标题、作者、封面、时长，以及平台暴露的播放清单或轨道描述。</p></div>
            <small data-evidence="inferred">技术推断</small>
          </li>
          <li>
            <span class="flow-id">04</span>
            <div><strong>生成统一 Media Manifest</strong><p>将容器、清晰度、码率、视频编码和音频编码归一到同一格式列表。</p></div>
            <small data-evidence="observed">公开观察</small>
          </li>
          <li>
            <span class="flow-id">05</span>
            <div><strong>查询格式级缓存</strong><p>同一规范化链接与格式若已有文件，直接复用资产；否则进入冷任务。</p></div>
            <small data-evidence="observed">公开观察</small>
          </li>
          <li>
            <span class="flow-id">06</span>
            <div><strong>拉流、合并并落为资产</strong><p>Worker 取得选定轨道，必要时合并音视频或转封装，再统一交付。</p></div>
            <small data-evidence="inferred">部分推断</small>
          </li>
        </ol>
      </div>

      <div class="delivery-boundary" aria-labelledby="delivery-boundary-title">
        <div class="delivery-boundary-heading">
          <span class="mini-kicker">WHERE THE HARD PART LIVES</span>
          <h3 id="delivery-boundary-title">找源决定能力上限，交付决定使用体验</h3>
          <p>用户的判断基本成立：找到稳定且可下载的源后，播放与下载不再是最核心的未知数。但真实平台的“源”经常是临时、分片、分轨并带访问上下文的。</p>
        </div>
        <div class="difficulty-chain" aria-label="技术难度与价值分层">
          <article data-layer="core">
            <span>核心壁垒 · HIGH</span>
            <strong>找源与归一化</strong>
            <p>平台适配、签名与凭证、页面变化、轨道识别、格式语义。</p>
          </article>
          <b aria-hidden="true">→</b>
          <article data-layer="system">
            <span>工程底座 · MEDIUM</span>
            <strong>缓存与任务治理</strong>
            <p>去重、队列、限流、重试、合并、存储生命周期。</p>
          </article>
          <b aria-hidden="true">→</b>
          <article data-layer="delivery">
            <span>标准交付 · LOWER</span>
            <strong>在线播放与下载</strong>
            <p>HTTP Range / 流式响应、Content-Disposition、浏览器兼容。</p>
          </article>
        </div>
        <div class="delivery-caveats" aria-label="找到源后的残余工程问题">
          <span>签名 URL 可能过期</span>
          <span>Cookie / Referer / Header</span>
          <span>HLS / DASH 分片</span>
          <span>音视频可能分轨</span>
          <span>编码与容器兼容性</span>
          <span>授权、审计与删除</span>
        </div>
        <p class="delivery-conclusion"><strong>结论：</strong>播放与下载是交付层，不是产品的核心壁垒；真正值得研究和复用的是“URL → 统一媒体清单 → 可治理资产”的能力。</p>
      </div>
    </section>

    <section class="lab-section section-shell" id="capability-demo" data-state="idle" aria-labelledby="demo-title">
      <div class="section-heading split-heading">
        <div>
          <div class="section-number">02 / INTERACTIVE LAB</div>
          <h2 id="demo-title">亲手走一遍：链接如何变成文件</h2>
        </div>
        <div class="truth-legend" aria-label="内容真实性图例">
          <span data-tone="local">本地模拟</span>
          <span data-tone="observed">公开观察</span>
          <span data-tone="proposal">扩展建议</span>
        </div>
      </div>

      <div class="demo-disclaimer" role="note">
        <strong>安全边界</strong>
        <span>输入内容只在当前浏览器内存中用于识别平台；不会发送到服务器，也不会生成媒体文件。</span>
      </div>

      <div class="lab-grid">
        <div class="control-console" aria-busy="false">
          <div class="console-header">
            <div>
              <span class="status-dot" aria-hidden="true"></span>
              <strong>LOCAL SIMULATOR</strong>
            </div>
            <span class="console-state" id="console-state">待机</span>
          </div>

          <div class="console-body">
            <label class="field-label" for="demo-url">输入一个演示链接</label>
            <div class="url-control">
              <input
                id="demo-url"
                type="url"
                inputmode="url"
                autocomplete="off"
                spellcheck="false"
                aria-describedby="url-help demo-error"
                value="${PLATFORM_PRESETS[0].url}"
              />
              <button class="parse-button" id="parse-button" type="button">模拟解析</button>
            </div>
            <p class="field-help" id="url-help">支持识别本页内置的六类公开平台 URL；不会真正打开链接。</p>
            <p class="field-error" id="demo-error" role="alert" hidden></p>

            <div class="preset-row" aria-label="载入演示链接">
              ${presetButtons}
            </div>

            <fieldset class="branch-fieldset">
              <legend>交付路径</legend>
              <label>
                <input type="radio" name="branch" value="auto" checked />
                <span><strong>自动判断</strong><small>按预设复现真实分支</small></span>
              </label>
              <label>
                <input type="radio" name="branch" value="cached" />
                <span><strong>缓存命中</strong><small>跳过源站抓取与队列</small></span>
              </label>
              <label>
                <input type="radio" name="branch" value="queue" />
                <span><strong>冷启动</strong><small>创建任务并进入工作队列</small></span>
              </label>
            </fieldset>

            <div class="phase-strip" aria-label="演示进度">
              <ol>
                <li data-step="recognize"><span>1</span>识别</li>
                <li data-step="manifest"><span>2</span>格式</li>
                <li data-step="cache"><span>3</span>缓存</li>
                <li data-step="worker"><span>4</span>处理</li>
                <li data-step="delivery"><span>5</span>交付</li>
              </ol>
              <div
                class="phase-progress"
                id="phase-progress"
                role="progressbar"
                aria-label="模拟处理进度"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0"
              ><span></span></div>
            </div>

            <div class="status-copy" aria-live="polite" aria-atomic="true">
              <strong id="status-title">选择示例，然后开始解析</strong>
              <span id="status-detail">这是一条确定性的本地状态机，不依赖网络。</span>
            </div>

            <section class="result-panel" id="result-panel" aria-label="模拟解析结果">
              <div class="empty-result" id="empty-result">
                <span aria-hidden="true">⌁</span>
                <p>解析结果会在这里出现</p>
                <small>标题、来源、时长和格式均为模拟数据</small>
              </div>
              <div class="resolved-result" id="resolved-result" hidden>
                <div class="media-summary">
                  <div class="media-poster" id="media-poster" aria-hidden="true"><span>YT</span></div>
                  <div>
                    <div class="simulation-label">SIMULATED METADATA</div>
                    <h3 id="media-title"></h3>
                    <p><span id="media-author"></span><span id="media-duration"></span><span id="media-source"></span></p>
                  </div>
                </div>
                <div class="route-summary">
                  <span>本次路径</span>
                  <strong id="route-status">待判断</strong>
                </div>
                <div class="format-list" id="format-list" aria-label="选择模拟格式"></div>
                <button class="deliver-button" id="deliver-button" type="button" disabled>
                  选择格式后模拟交付
                </button>
              </div>
            </section>

            <div class="console-actions">
              <button class="text-button" id="reset-button" type="button">重置演示</button>
              <a class="text-link" href="#principles">查看这一步的技术原理 ↓</a>
            </div>
          </div>
        </div>

        <aside class="pipeline-panel" aria-labelledby="pipeline-title">
          <div class="pipeline-heading">
            <div>
              <span>LIVE ARCHITECTURE</span>
              <h3 id="pipeline-title">一条任务的服务端旅程</h3>
            </div>
            <span class="pipeline-mode" id="pipeline-mode">IDLE</span>
          </div>

          <ol class="pipeline" aria-label="媒体处理链路">
            <li data-node="client">
              <span class="node-id">01</span>
              <div><strong>浏览器客户端</strong><small>收集 URL 与格式选择</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="extractor">
              <span class="node-id">02</span>
              <div><strong>平台适配 / 提取器</strong><small>规范化链接，读取公开元数据</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="manifest">
              <span class="node-id">03</span>
              <div><strong>格式清单</strong><small>区分完整视频、视频轨、音频轨</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="cache">
              <span class="node-id">04</span>
              <div><strong>缓存索引</strong><small>用规范化 URL 与格式键查询文件</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="worker">
              <span class="node-id">05</span>
              <div><strong>下载工作队列</strong><small>限流、排队、拉取源媒体流</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="package">
              <span class="node-id">06</span>
              <div><strong>合并 / 转封装</strong><small>按选择处理音视频与容器</small></div>
              <span class="node-state">WAIT</span>
            </li>
            <li data-node="delivery">
              <span class="node-id">07</span>
              <div><strong>文件交付</strong><small>缓存文件、历史与浏览器入口</small></div>
              <span class="node-state">WAIT</span>
            </li>
          </ol>

          <div class="event-log">
            <div class="event-log-header"><span>事件日志</span><span>LOCAL ONLY</span></div>
            <div id="event-log" role="log" aria-label="本地模拟事件日志">
              <p><time>T+0.0s</time><span>等待启动本地演示</span></p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="content-section section-shell" id="capabilities" aria-labelledby="capabilities-title">
      <div class="section-heading">
        <div class="section-number">03 / CAPABILITY MAP</div>
        <h2 id="capabilities-title">它真正实现的六类能力</h2>
        <p>核心不是“下载按钮”，而是把不同平台的媒体取得方式统一成一条可管理的任务链路。</p>
      </div>
      <div class="capability-grid">${capabilityCards}</div>
      <div class="core-boundary">
        <span>能力边界</span>
        <p><strong>不会提升原始画质。</strong>所谓 4K 或 8K，只表示源平台提供对应媒体流；高分辨率选项可能只有画面、没有声音。</p>
      </div>
    </section>

    <section class="principles-section section-shell" id="principles" aria-labelledby="principles-title">
      <div class="section-heading split-heading">
        <div>
          <div class="section-number">04 / TECHNICAL PRINCIPLES</div>
          <h2 id="principles-title">端到端链路：找源在前，交付在后</h2>
        </div>
        <p>以下将“公开可观察行为”和“行业常见实现推断”分开表达。</p>
      </div>

      <div class="principle-flow" aria-label="技术数据流">
        <article><span>01</span><strong>URL 规范化</strong><p>识别平台与内容 ID，处理短链和必要参数，减少重复缓存键。</p><small>合理推断</small></article>
        <article><span>02</span><strong>元数据提取</strong><p>返回标题、作者、时长、封面和平台提供的格式列表。</p><small>公开观察</small></article>
        <article><span>03</span><strong>轨道分类</strong><p>依据容器、分辨率、码率、视频编码与音频编码标记媒体类型。</p><small>公开观察</small></article>
        <article><span>04</span><strong>缓存 / 队列分流</strong><p>缓存命中直接交付；未命中创建异步任务并进入并发受限的 Worker。</p><small>公开观察</small></article>
        <article><span>05</span><strong>媒体处理</strong><p>必要时执行音视频合并或重新封装，再写入文件存储与缓存索引。</p><small>实现未验证</small></article>
        <article><span>06</span><strong>产品状态层</strong><p>进度、历史、预览、收藏、评论、积分和榜单围绕文件生命周期展开。</p><small>公开观察</small></article>
      </div>

      <div class="principle-notes">
        <article>
          <span class="note-label">为什么要队列？</span>
          <h3>带宽、CPU、磁盘都不是无限资源</h3>
          <p>高分辨率文件会占用更长连接和更多存储。队列将瞬时请求变成可限流、可重试、可观察的后台任务。</p>
        </article>
        <article>
          <span class="note-label">为什么要缓存？</span>
          <h3>同一内容不应反复拉取</h3>
          <p>以规范化链接和格式作为缓存键，可以降低源站请求与处理成本，但同时产生公开性、留存和删除责任。</p>
        </article>
        <article>
          <span class="note-label">为什么会无声？</span>
          <h3>高画质视频和音频经常是独立轨道</h3>
          <p>播放器可以自适应组合多个流；落地为单文件时，则需要选择完整格式或由服务端执行合并。</p>
        </article>
      </div>
    </section>

    <section class="ecosystem-section section-shell" id="ecosystem" aria-labelledby="ecosystem-title">
      <div class="section-heading split-heading">
        <div>
          <div class="section-number">05 / MEDIA SYSTEM LANDSCAPE</div>
          <h2 id="ecosystem-title">下载只是入口，后面才是媒体系统</h2>
        </div>
        <p>把 BotVod 与 MediaCMS 放进同一条链路，才能看清“搜源摄取”和“资产管理分发”是上下游，而不是同一种产品。</p>
      </div>

      <div class="system-thesis" role="note" aria-label="我们对媒体系统的一句话理解">
        <span>ONE-SENTENCE MODEL</span>
        <p><strong>BotVod</strong> 负责把已知 URL 变成可取得的媒体资产，<strong>MediaCMS</strong> 负责把进入系统的媒体存储、处理、管理并分发；<strong>我们的核心</strong>是用可插拔 Source Adapter 与统一 Manifest 把两端连接起来。</p>
      </div>

      <div class="system-spine" aria-label="从内容源到用户播放的系统链路">
        <article data-stage="source">
          <span>01 · INPUT</span>
          <strong>外部内容源</strong>
          <p>视频平台、站点页面、RSS、开放 API、用户上传。</p>
          <small>来源可能持续增加</small>
        </article>
        <b aria-hidden="true">→</b>
        <article data-stage="adapter">
          <span>02 · OUR CORE</span>
          <strong>Source Adapter Platform</strong>
          <p>识别来源、解析页面、归一元数据、策略校验、取得文件。</p>
          <small>统一输出 Media Manifest</small>
        </article>
        <b aria-hidden="true">→</b>
        <article data-stage="asset">
          <span>03 · ASSET CMS</span>
          <strong>MediaCMS 式资产中心</strong>
          <p>存储、转码、HLS、字幕、权限、站内搜索与门户展示。</p>
          <small>管理已经进入系统的媒体</small>
        </article>
        <b aria-hidden="true">→</b>
        <article data-stage="delivery">
          <span>04 · DELIVERY</span>
          <strong>对象存储 / CDN / 用户</strong>
          <p>承担大规模文件传输、边缘缓存和最终播放下载体验。</p>
          <small>按规模选择性接入</small>
        </article>
      </div>

      <div class="system-role-grid" aria-label="四类系统的职责边界">
        <article>
          <div><span>BotVod</span><small>UPSTREAM SAMPLE</small></div>
          <h3>媒体摄取与缓存交付</h3>
          <dl>
            <div><dt>输入</dt><dd>已知视频页面 URL</dd></div>
            <div><dt>核心</dt><dd>平台识别、媒体找源、格式清单、任务与缓存</dd></div>
            <div><dt>输出</dt><dd>可播放或可下载文件</dd></div>
            <div><dt>不负责</dt><dd>完整企业资产治理与全球 CDN</dd></div>
          </dl>
        </article>
        <article data-focus="ours">
          <div><span>我们的平台</span><small>STRATEGIC CORE</small></div>
          <h3>可持续扩展的适配层</h3>
          <dl>
            <div><dt>输入</dt><dd>收集到的网站、RSS、API 与授权连接器</dd></div>
            <div><dt>核心</dt><dd>Adapter 注册、统一 Manifest、策略门、任务编排</dd></div>
            <div><dt>输出</dt><dd>可治理、可导入的媒体资产</dd></div>
            <div><dt>价值</dt><dd>新增来源不改变下游业务模型</dd></div>
          </dl>
        </article>
        <article data-focus="mediacms">
          <div><span>MediaCMS</span><small>DOWNSTREAM SAMPLE</small></div>
          <h3>媒体资产与分发管理</h3>
          <dl>
            <div><dt>输入</dt><dd>上传文件或 API 推送的媒体</dd></div>
            <div><dt>核心</dt><dd>存储、转码、HLS、元数据、权限与站内搜索</dd></div>
            <div><dt>输出</dt><dd>视频门户、播放、下载、分享和嵌入</dd></div>
            <div><dt>不负责</dt><dd>任意网页搜源与通用站点下载</dd></div>
          </dl>
        </article>
        <article>
          <div><span>CDN</span><small>DELIVERY INFRA</small></div>
          <h3>规模化文件传输</h3>
          <dl>
            <div><dt>输入</dt><dd>源站 MP4、HLS 清单和分片</dd></div>
            <div><dt>核心</dt><dd>边缘缓存、带宽调度、Range 与回源控制</dd></div>
            <div><dt>输出</dt><dd>稳定的全球播放和下载</dd></div>
            <div><dt>不负责</dt><dd>找源、转码策略和内容权限模型</dd></div>
          </dl>
        </article>
      </div>

      <div class="mediacms-capabilities" aria-labelledby="mediacms-capabilities-title">
        <div class="mediacms-intro">
          <span class="mini-kicker">WHAT MEDIACMS ADDS</span>
          <h3 id="mediacms-capabilities-title">它不只是“允许下载”，而是管理媒体全生命周期</h3>
          <p>MediaCMS 从文件进入系统后开始发挥作用。默认部署可直接作为媒体源站和视频网站门户；规模变大时，再在文件存储和 Nginx 前增加对象存储或 CDN。</p>
          <a href="https://github.com/mediacms-io/mediacms" target="_blank" rel="noreferrer">查看 MediaCMS 官方仓库 ↗</a>
        </div>
        <ol class="media-lifecycle-grid">
          <li><span>01</span><strong>接入</strong><p>网页上传、分片续传、REST API 推送。</p></li>
          <li><span>02</span><strong>存储</strong><p>原件、转码文件、HLS、字幕、封面与元数据。</p></li>
          <li><span>03</span><strong>处理</strong><p>FFmpeg 多清晰度转码、Bento4 HLS、裁剪与 Whisper 字幕。</p></li>
          <li><span>04</span><strong>管理</strong><p>分类、标签、播放列表、审核、用户和 RBAC 权限。</p></li>
          <li><span>05</span><strong>分发</strong><p>Nginx 交付 MP4/HLS；可继续接对象存储与 CDN。</p></li>
          <li><span>06</span><strong>展示</strong><p>站内搜索、Video.js 播放、下载、分享、嵌入与门户页面。</p></li>
        </ol>
      </div>

      <div class="system-boundary" aria-label="MediaCMS 能力边界">
        <article data-tone="yes"><span>它是什么</span><strong>媒体资产管理 + 视频处理 + 分发源站 + 门户展示</strong></article>
        <article data-tone="no"><span>它不是什么</span><strong>全网视频搜索、任意网页解析或通用下载器</strong></article>
      </div>

      <div class="strategy-conclusion">
        <span>BUILD ORDER</span>
        <div>
          <h3>先把可插拔适配层与统一 Manifest 做成核心，再接入或参考 MediaCMS 式下游。</h3>
          <p>这样新增来源只需增加 Adapter；存储、转码、权限、搜索、播放和展示保持稳定。MediaCMS 可以作为验证下游闭环的现成样本，也可以只借鉴它的任务、资产和权限模型。</p>
        </div>
      </div>
    </section>

    <section class="content-section section-shell" id="scenarios" aria-labelledby="scenarios-title">
      <div class="section-heading">
        <div class="section-number">06 / USE CASES</div>
        <h2 id="scenarios-title">价值取决于素材是否公开、授权且可替代</h2>
        <p>下载能力只解决“取得文件”，不会自动补齐版权、审批、素材治理和生产可靠性。</p>
      </div>
      <div class="scenario-grid">${scenarioCards}</div>
    </section>

    <section class="roadmap-section section-shell" id="roadmap" aria-labelledby="roadmap-title">
      <div class="section-heading split-heading">
        <div>
          <div class="section-number">07 / VALUE TO US</div>
          <h2 id="roadmap-title">对我们的价值：把“下载”升级为受控媒体摄取</h2>
        </div>
        <p>直接依赖 BotVod 的生产价值有限；把它当作职责架构样本，重建授权策略门、统一 Manifest、私有缓存和可解释任务链路，研究价值更高。</p>
      </div>

      <div class="roadmap-controls" aria-label="筛选扩展路线">
        <button type="button" data-track="all" aria-pressed="true">全部方向</button>
        <button type="button" data-track="product" aria-pressed="false">产品体验</button>
        <button type="button" data-track="engineering" aria-pressed="false">工程底座</button>
        <button type="button" data-track="governance" aria-pressed="false">治理与信任</button>
      </div>
      <div class="roadmap-list" id="roadmap-list"></div>
    </section>

    <section class="risk-section section-shell" id="risks" aria-labelledby="risks-title">
      <div class="risk-intro">
        <div class="section-number">08 / RISK BOUNDARY</div>
        <h2 id="risks-title">技术上能够取得，<br />不代表法律上可以使用</h2>
        <p>适合公开、已授权、非敏感、偶发使用；不适合私密链接、客户未发布素材、主账号 Cookie 或关键批处理。</p>
      </div>
      <div class="risk-grid">
        <article><span>R01</span><h3>版权与平台条款</h3><p>下载、转载和商业使用是三种不同授权问题。能拿到文件，不等于获得传播或改编权。</p></article>
        <article><span>R02</span><h3>Cookie 是会话凭证</h3><p>第三方取得有效 Cookie 后可能代表账号访问源站。不要上传主账号 Cookie。</p></article>
        <article><span>R03</span><h3>公开缓存扩大暴露面</h3><p>原始链接、标题、提交者和兴趣可能被保留或展示；敏感链接不应进入公共服务。</p></article>
        <article><span>R04</span><h3>运营成熟度有限</h3><p>观察时域名较新，运营主体、隐私政策、服务条款与独立口碑仍不足以支撑关键业务依赖。</p></article>
      </div>
    </section>

    <section class="sources-section section-shell" id="sources" aria-labelledby="sources-title">
      <div>
        <div class="section-number">09 / SOURCES</div>
        <h2 id="sources-title">证据来源与研究边界</h2>
        <p>BotVod 为 2026-08-31 至 2026-09-01 的黑盒观察；MediaCMS 结论来自其官方仓库、部署文件和技术文档。未登录账号、未上传 Cookie、未提交真实下载。</p>
      </div>
      <ul>
        <li><a href="https://botvod.com/" target="_blank" rel="noreferrer"><span>BotVod 首页</span><small>产品定位、格式、队列、预览与榜单</small><b>↗</b></a></li>
        <li><a href="https://botvod.com/api/site/config" target="_blank" rel="noreferrer"><span>公开站点配置</span><small>游客额度、并发和缓存配置</small><b>↗</b></a></li>
        <li><a href="https://botvod.com/api/levels" target="_blank" rel="noreferrer"><span>公开等级规则</span><small>注册用户额度与等级能力</small><b>↗</b></a></li>
        <li><a href="https://botvod.com/api/cache/list" target="_blank" rel="noreferrer"><span>公开缓存数据</span><small>来源、格式与缓存可见性</small><b>↗</b></a></li>
        <li><a href="https://rdap.verisign.com/com/v1/domain/botvod.com" target="_blank" rel="noreferrer"><span>Verisign RDAP</span><small>域名注册时间与注册商记录</small><b>↗</b></a></li>
        <li><a href="https://www.youtube.com/static?template=terms" target="_blank" rel="noreferrer"><span>YouTube 服务条款</span><small>下载与内容使用边界</small><b>↗</b></a></li>
        <li><a href="https://github.com/mediacms-io/mediacms" target="_blank" rel="noreferrer"><span>MediaCMS 官方仓库</span><small>产品能力、技术栈、使用场景与许可证</small><b>↗</b></a></li>
        <li><a href="https://github.com/mediacms-io/mediacms/blob/main/docs/developers_docs.md" target="_blank" rel="noreferrer"><span>MediaCMS 开发文档</span><small>上传 API、分块转码、Worker 与 HLS 流程</small><b>↗</b></a></li>
        <li><a href="https://github.com/mediacms-io/mediacms/blob/main/docker-compose.yaml" target="_blank" rel="noreferrer"><span>MediaCMS 部署编排</span><small>Web、Celery、Redis、PostgreSQL 与共享存储</small><b>↗</b></a></li>
      </ul>
    </section>
  </main>

  <footer class="site-footer section-shell">
    <div><strong>BotVod Capability Lab</strong><span>Independent research · Local simulation only</span></div>
    <p>本项目不隶属于 BotVod；不复制其代码、视觉资产或媒体内容。</p>
    <a href="#overview">回到顶部 ↑</a>
  </footer>

  <div class="sr-only" id="live-status" aria-live="polite" aria-atomic="true"></div>
`

if (window.location.hash) {
  let initialTargetId = window.location.hash.slice(1)
  try {
    initialTargetId = decodeURIComponent(initialTargetId)
  } catch {
    // Keep the raw hash when it is not valid percent-encoded text.
  }
  window.setTimeout(() => {
    document.getElementById(initialTargetId)?.scrollIntoView()
  }, 80)
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required element missing: ${selector}`)
  }
  return element
}

const demoSection = requireElement<HTMLElement>('#capability-demo')
const consolePanel = requireElement<HTMLElement>('.control-console')
const urlInput = requireElement<HTMLInputElement>('#demo-url')
const parseButton = requireElement<HTMLButtonElement>('#parse-button')
const resetButton = requireElement<HTMLButtonElement>('#reset-button')
const errorElement = requireElement<HTMLElement>('#demo-error')
const emptyResult = requireElement<HTMLElement>('#empty-result')
const resolvedResult = requireElement<HTMLElement>('#resolved-result')
const formatList = requireElement<HTMLElement>('#format-list')
const deliverButton = requireElement<HTMLButtonElement>('#deliver-button')
const consoleState = requireElement<HTMLElement>('#console-state')
const statusTitle = requireElement<HTMLElement>('#status-title')
const statusDetail = requireElement<HTMLElement>('#status-detail')
const progressBar = requireElement<HTMLElement>('#phase-progress')
const progressFill = requireElement<HTMLElement>('#phase-progress span')
const eventLog = requireElement<HTMLElement>('#event-log')
const pipelineMode = requireElement<HTMLElement>('#pipeline-mode')
const liveStatus = requireElement<HTMLElement>('#live-status')
const offlineBanner = requireElement<HTMLElement>('#offline-banner')
const roadmapList = requireElement<HTMLElement>('#roadmap-list')

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

const stateLabels: Record<DemoState, string> = {
  idle: '待机',
  invalid: '链接错误',
  unsupported: '平台不支持',
  analyzing: '解析中',
  ready: '格式就绪',
  delivering: '交付中',
  success: '演示完成',
}

const progressByNode: Record<PipelineNode, number> = {
  client: 8,
  extractor: 24,
  manifest: 42,
  cache: 58,
  worker: 72,
  package: 88,
  delivery: 100,
}

const stepByNode: Record<PipelineNode, string> = {
  client: 'recognize',
  extractor: 'recognize',
  manifest: 'manifest',
  cache: 'cache',
  worker: 'worker',
  package: 'worker',
  delivery: 'delivery',
}

function delay(milliseconds: number): Promise<void> {
  const duration = motionQuery.matches ? 20 : milliseconds
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

function isCurrent(generation: number): boolean {
  return generation === runtime.generation
}

function setDemoState(state: DemoState): void {
  runtime.demoState = state
  demoSection.dataset.state = state
  consolePanel.setAttribute('aria-busy', String(state === 'analyzing' || state === 'delivering'))
  consoleState.textContent = stateLabels[state]
  parseButton.disabled = state === 'analyzing' || state === 'delivering' || urlInput.value.trim().length === 0
}

function setStatus(title: string, detail: string): void {
  statusTitle.textContent = title
  statusDetail.textContent = detail
  liveStatus.textContent = `${title}。${detail}`
}

function setProgress(value: number): void {
  const safeValue = Math.max(0, Math.min(100, value))
  progressFill.style.width = `${safeValue}%`
  progressBar.setAttribute('aria-valuenow', String(safeValue))
}

function resetPipeline(): void {
  document.querySelectorAll<HTMLElement>('[data-node]').forEach((node) => {
    node.dataset.status = 'waiting'
    const label = node.querySelector<HTMLElement>('.node-state')
    if (label) label.textContent = 'WAIT'
  })
  document.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
    step.dataset.status = 'waiting'
  })
  pipelineMode.textContent = 'IDLE'
  setProgress(0)
}

function activatePipeline(nodeName: PipelineNode, mode: 'active' | 'done' = 'active'): void {
  const orderedNodes: PipelineNode[] = ['client', 'extractor', 'manifest', 'cache', 'worker', 'package', 'delivery']
  const activeIndex = orderedNodes.indexOf(nodeName)

  orderedNodes.forEach((name, index) => {
    const node = requireElement<HTMLElement>(`[data-node="${name}"]`)
    const label = requireElement<HTMLElement>(`[data-node="${name}"] .node-state`)
    if (index < activeIndex || (index === activeIndex && mode === 'done')) {
      node.dataset.status = 'done'
      label.textContent = 'DONE'
    } else if (index === activeIndex) {
      node.dataset.status = 'active'
      label.textContent = 'LIVE'
    } else {
      node.dataset.status = 'waiting'
      label.textContent = 'WAIT'
    }
  })

  const activeStep = stepByNode[nodeName]
  const orderedSteps = ['recognize', 'manifest', 'cache', 'worker', 'delivery']
  const stepIndex = orderedSteps.indexOf(activeStep)
  orderedSteps.forEach((stepName, index) => {
    const step = requireElement<HTMLElement>(`[data-step="${stepName}"]`)
    if (index < stepIndex || (index === stepIndex && mode === 'done')) {
      step.dataset.status = 'done'
    } else if (index === stepIndex) {
      step.dataset.status = 'active'
    } else {
      step.dataset.status = 'waiting'
    }
  })

  pipelineMode.textContent = nodeName.toUpperCase()
  setProgress(progressByNode[nodeName])
}

function addLog(message: string, tone: 'normal' | 'success' | 'warning' = 'normal'): void {
  const item = document.createElement('p')
  item.dataset.tone = tone
  const time = document.createElement('time')
  time.textContent = `T+${(runtime.logIndex * 0.4).toFixed(1)}s`
  const text = document.createElement('span')
  text.textContent = message
  item.append(time, text)
  eventLog.append(item)
  runtime.logIndex += 1
  eventLog.scrollTop = eventLog.scrollHeight
}

function clearLog(): void {
  eventLog.replaceChildren()
  runtime.logIndex = 0
  addLog('已创建新的本地模拟会话')
}

function setError(kind: 'invalid' | 'unsupported', message: string): void {
  runtime.generation += 1
  runtime.preset = null
  runtime.selectedFormat = null
  runtime.resolvedBranch = null
  setDemoState(kind)
  urlInput.setAttribute('aria-invalid', 'true')
  errorElement.textContent = message
  errorElement.hidden = false
  emptyResult.hidden = false
  resolvedResult.hidden = true
  deliverButton.disabled = true
  resetPipeline()
  setStatus(kind === 'invalid' ? '链接格式无效' : '暂不支持这个平台', message)
  clearLog()
  addLog(message, 'warning')
  urlInput.focus()
}

function clearError(): void {
  urlInput.removeAttribute('aria-invalid')
  errorElement.textContent = ''
  errorElement.hidden = true
}

function findPreset(rawUrl: string): { preset: PlatformPreset | null; validUrl: boolean } {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return { preset: null, validUrl: false }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { preset: null, validUrl: false }
  }

  const hostname = parsed.hostname.toLowerCase()
  const preset = PLATFORM_PRESETS.find((candidate) =>
    candidate.hostnames.some((supportedHost) => hostname === supportedHost || hostname.endsWith(`.${supportedHost}`)),
  )
  return { preset: preset ?? null, validUrl: true }
}

function resolveBranch(preset: PlatformPreset): Exclude<BranchMode, 'auto'> {
  if (runtime.branchMode === 'auto') {
    return preset.cachedByDefault ? 'cached' : 'queue'
  }
  return runtime.branchMode
}

function getKindLabel(format: FormatOption): string {
  if (format.kind === 'muxed') return '音画完整'
  if (format.kind === 'video') return '仅视频'
  return '仅音频'
}

function renderFormats(preset: PlatformPreset): void {
  formatList.replaceChildren()
  preset.formats.forEach((format, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'format-option'
    button.dataset.kind = format.kind
    button.setAttribute('aria-pressed', String(index === 0))
    button.innerHTML = `
      <span class="format-topline"><strong>${format.label}</strong><b>${getKindLabel(format)}</b></span>
      <span class="format-resolution">${format.resolution}</span>
      <span class="format-meta">${format.ext} · ${format.codec}</span>
      <span class="format-bottom"><span>${format.size}</span><small>${format.note}</small></span>
    `
    button.addEventListener('click', () => selectFormat(format, button))
    formatList.append(button)
  })

  const firstFormat = preset.formats[0] ?? null
  if (firstFormat) {
    runtime.selectedFormat = firstFormat
    deliverButton.disabled = false
    updateDeliverButton()
  }
}

function selectFormat(format: FormatOption, button: HTMLButtonElement): void {
  runtime.selectedFormat = format
  document.querySelectorAll<HTMLButtonElement>('.format-option').forEach((option) => {
    option.setAttribute('aria-pressed', String(option === button))
  })
  updateDeliverButton()
  addLog(`已选择 ${format.resolution} ${format.ext}（${getKindLabel(format)}）`)
}

function updateDeliverButton(): void {
  if (!runtime.selectedFormat) {
    deliverButton.textContent = '选择格式后模拟交付'
    deliverButton.disabled = true
    return
  }

  const branchLabel = runtime.resolvedBranch === 'cached' ? '缓存直取' : '队列处理'
  deliverButton.textContent = `模拟获取 ${runtime.selectedFormat.ext} · ${branchLabel}`
  deliverButton.disabled = runtime.demoState === 'delivering'
}

function renderMetadata(preset: PlatformPreset): void {
  requireElement<HTMLElement>('#media-title').textContent = preset.title
  requireElement<HTMLElement>('#media-author').textContent = preset.author
  requireElement<HTMLElement>('#media-duration').textContent = preset.duration
  requireElement<HTMLElement>('#media-source').textContent = preset.label
  requireElement<HTMLElement>('#media-poster span').textContent = preset.shortLabel
  requireElement<HTMLElement>('#media-poster').dataset.platform = preset.id
  const routeStatus = requireElement<HTMLElement>('#route-status')
  routeStatus.textContent = runtime.resolvedBranch === 'cached' ? '缓存命中 · 直接交付' : '缓存未命中 · 创建队列任务'
  routeStatus.dataset.route = runtime.resolvedBranch ?? 'unknown'
  emptyResult.hidden = true
  resolvedResult.hidden = false
  renderFormats(preset)
}

async function runParse(): Promise<void> {
  const rawUrl = urlInput.value.trim()
  if (!rawUrl) {
    setError('invalid', '请输入一个完整的 http 或 https 视频页面链接。')
    return
  }

  const match = findPreset(rawUrl)
  if (!match.validUrl) {
    setError('invalid', '链接格式无效。示例：https://www.youtube.com/watch?v=demo')
    return
  }
  if (!match.preset) {
    setError('unsupported', '本实验只模拟 YouTube、Bilibili、X、TikTok、抖音和 Instagram。')
    return
  }

  const generation = runtime.generation + 1
  runtime.generation = generation
  runtime.preset = match.preset
  runtime.selectedFormat = null
  runtime.resolvedBranch = null
  clearError()
  clearLog()
  emptyResult.hidden = false
  resolvedResult.hidden = true
  deliverButton.disabled = true
  resetPipeline()
  setDemoState('analyzing')
  activatePipeline('client')
  setStatus('正在验证链接结构', '只检查 URL 结构和域名，不访问目标地址。')
  addLog(`识别输入域名：${new URL(rawUrl).hostname}`)
  await delay(420)
  if (!isCurrent(generation)) return

  activatePipeline('extractor')
  setStatus(`已识别 ${match.preset.label}`, '正在读取内置的模拟标题、时长与作者数据。')
  addLog(`平台适配器已匹配：${match.preset.label}`)
  await delay(520)
  if (!isCurrent(generation)) return

  activatePipeline('manifest')
  setStatus('正在构建格式清单', '按照音画完整、仅视频和仅音频分类媒体轨道。')
  addLog(`已生成 ${match.preset.formats.length} 个确定性格式选项`)
  await delay(560)
  if (!isCurrent(generation)) return

  activatePipeline('cache')
  runtime.resolvedBranch = resolveBranch(match.preset)
  const isCached = runtime.resolvedBranch === 'cached'
  setStatus(
    isCached ? '缓存索引命中' : '缓存索引未命中',
    isCached ? '选定格式可跳过重复抓取，等待用户确认交付。' : '确认格式后将创建模拟队列任务。',
  )
  addLog(isCached ? '发现相同 URL 与格式缓存键' : '未发现可复用文件，将走冷启动路径', isCached ? 'success' : 'warning')
  await delay(420)
  if (!isCurrent(generation)) return

  renderMetadata(match.preset)
  setDemoState('ready')
  pipelineMode.textContent = isCached ? 'CACHE HIT' : 'QUEUE READY'
  setStatus('格式已经就绪', '选择一个格式，继续演示文件交付路径。')
  addLog('解析阶段完成，等待格式确认', 'success')
}

async function runDelivery(): Promise<void> {
  if (!runtime.preset || !runtime.selectedFormat || !runtime.resolvedBranch) return

  const generation = runtime.generation + 1
  runtime.generation = generation
  setDemoState('delivering')
  updateDeliverButton()

  if (runtime.resolvedBranch === 'cached') {
    activatePipeline('cache', 'done')
    setStatus('读取服务器缓存', '真实产品会返回已有文件；本实验只推进状态。')
    addLog(`缓存直取：${runtime.selectedFormat.resolution} ${runtime.selectedFormat.ext}`)
    await delay(620)
    if (!isCurrent(generation)) return
  } else {
    activatePipeline('worker')
    setStatus('任务进入下载队列', 'Worker 获得槽位后会拉取选定的源媒体流。')
    addLog('创建异步任务并加入并发受限队列')
    await delay(620)
    if (!isCurrent(generation)) return

    setStatus('正在获取媒体流', '用分段进度模拟网络拉取；没有真实请求发生。')
    addLog(`Worker 处理 ${runtime.selectedFormat.size} 的模拟资源`)
    setProgress(78)
    await delay(760)
    if (!isCurrent(generation)) return

    activatePipeline('package')
    setStatus('正在处理容器与轨道', runtime.selectedFormat.kind === 'video' ? '这是无声视频轨；真实工作流需另选音频或后续合并。' : '检查容器、编码与文件元数据。')
    addLog(runtime.selectedFormat.kind === 'video' ? '检测到仅视频格式：结果不会自带声音' : '格式已具备所需轨道')
    await delay(720)
    if (!isCurrent(generation)) return
  }

  activatePipeline('delivery', 'done')
  setProgress(100)
  setDemoState('success')
  setStatus('本地演示完成', '真实产品此时通常提供文件入口；本实验不会获取或生成媒体文件。')
  addLog('交付状态完成；未创建任何真实文件', 'success')
  deliverButton.textContent = '再次演示当前交付路径'
  deliverButton.disabled = false
}

function resetDemo(options: { keepUrl?: boolean; focus?: boolean } = {}): void {
  runtime.generation += 1
  runtime.preset = null
  runtime.selectedFormat = null
  runtime.resolvedBranch = null
  clearError()
  if (!options.keepUrl) {
    urlInput.value = ''
    document.querySelectorAll<HTMLButtonElement>('.preset-button').forEach((button) => {
      button.setAttribute('aria-pressed', 'false')
    })
  }
  emptyResult.hidden = false
  resolvedResult.hidden = true
  formatList.replaceChildren()
  deliverButton.disabled = true
  deliverButton.textContent = '选择格式后模拟交付'
  resetPipeline()
  clearLog()
  setDemoState('idle')
  setStatus('选择示例，然后开始解析', '这是一条确定性的本地状态机，不依赖网络。')
  if (options.focus !== false) urlInput.focus()
}

function loadPreset(preset: PlatformPreset, button: HTMLButtonElement): void {
  resetDemo({ keepUrl: true, focus: false })
  urlInput.value = preset.url
  parseButton.disabled = false
  document.querySelectorAll<HTMLButtonElement>('.preset-button').forEach((presetButton) => {
    presetButton.setAttribute('aria-pressed', String(presetButton === button))
  })
  setStatus(`已载入 ${preset.label} 示例`, '点击“模拟解析”开始本地状态演示。')
  addLog(`载入 ${preset.label} 的演示 URL`)
  urlInput.focus()
}

function renderRoadmap(track: RoadmapTrack | 'all'): void {
  const items = track === 'all' ? ROADMAP : ROADMAP.filter((item) => item.track === track)
  roadmapList.innerHTML = items
    .map(
      (item) => `
        <article class="roadmap-item" data-track="${item.track}">
          <span class="priority-chip">${item.priority}</span>
          <div>
            <span class="track-label">${item.track === 'product' ? '产品体验' : item.track === 'engineering' ? '工程底座' : '治理与信任'}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
          <dl>
            <div><dt>影响</dt><dd>${item.impact}</dd></div>
            <div><dt>投入</dt><dd>${item.effort}</dd></div>
          </dl>
        </article>
      `,
    )
    .join('')
}

function updateOnlineStatus(): void {
  offlineBanner.hidden = navigator.onLine
}

parseButton.addEventListener('click', () => {
  void runParse()
})

urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !parseButton.disabled) {
    event.preventDefault()
    void runParse()
  }
})

urlInput.addEventListener('input', () => {
  if (runtime.demoState === 'invalid' || runtime.demoState === 'unsupported') {
    clearError()
    emptyResult.hidden = false
    resolvedResult.hidden = true
    resetPipeline()
    setDemoState('idle')
    setStatus('链接已更新', '继续输入或运行新的本地模拟。')
  } else {
    parseButton.disabled = urlInput.value.trim().length === 0 || runtime.demoState === 'analyzing' || runtime.demoState === 'delivering'
  }
})

resetButton.addEventListener('click', () => resetDemo())

deliverButton.addEventListener('click', () => {
  void runDelivery()
})

document.querySelectorAll<HTMLButtonElement>('.preset-button').forEach((button) => {
  const id = button.dataset.preset
  const preset = PLATFORM_PRESETS.find((candidate) => candidate.id === id)
  if (preset) button.addEventListener('click', () => loadPreset(preset, button))
})

document.querySelectorAll<HTMLInputElement>('input[name="branch"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return
    runtime.branchMode = radio.value as BranchMode
    if (runtime.preset && (runtime.demoState === 'ready' || runtime.demoState === 'success')) {
      runtime.resolvedBranch = resolveBranch(runtime.preset)
      const routeStatus = requireElement<HTMLElement>('#route-status')
      routeStatus.textContent = runtime.resolvedBranch === 'cached' ? '缓存命中 · 直接交付' : '缓存未命中 · 创建队列任务'
      routeStatus.dataset.route = runtime.resolvedBranch
      updateDeliverButton()
      addLog(`交付路径切换为：${runtime.resolvedBranch === 'cached' ? '缓存命中' : '冷启动队列'}`)
    }
  })
})

document.querySelectorAll<HTMLButtonElement>('.roadmap-controls button').forEach((button) => {
  button.addEventListener('click', () => {
    const track = (button.dataset.track ?? 'all') as RoadmapTrack | 'all'
    document.querySelectorAll<HTMLButtonElement>('.roadmap-controls button').forEach((control) => {
      control.setAttribute('aria-pressed', String(control === button))
    })
    renderRoadmap(track)
  })
})

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

renderRoadmap('all')
updateOnlineStatus()
setDemoState('idle')
