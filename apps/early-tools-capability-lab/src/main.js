import './styles.css'

const roles = [
  {
    id: 'research',
    short: '我们做研究',
    label: '产品研究者',
    title: '把它当作“早期信号雷达”',
    summary:
      '它最大的价值不是告诉我们成熟产品有什么，而是更早暴露正在形成的新赛道、新交互和新商业模式。',
    gains: ['建立新产品候选池', '观察 Waitlist → Beta → Public 的变化', '从相似产品与创始人关系发现趋势'],
    action: '建议用法：每周按主题扫描，重要产品进入我们自己的验证清单。',
    signal: '情报输入',
  },
  {
    id: 'builder',
    short: '我们做产品',
    label: '创业者 / 独立开发者',
    title: '把它当作“冷启动分发节点”',
    summary:
      '产品完成最小可用版本后，可以通过提交、Deal 和 Newsletter 获得第一批高意向访问者，但它不能替代完整营销。',
    gains: ['得到可长期索引的产品页', '接触愿意尝鲜的早期用户', '使用验证实验和发布目录规划上线'],
    action: '建议用法：先免费提交并设计可衡量的 Deal，再根据真实转化决定是否付费。',
    signal: '发布渠道',
  },
  {
    id: 'team',
    short: '我们做团队',
    label: '产品 / 创新团队',
    title: '把它当作“外部创新样本库”',
    summary:
      '团队可以围绕某个主题建立 Watchlist，用产品阶段、平台和创始人信息补充竞品研究与技术侦察。',
    gains: ['建立赛道地图与竞品清单', '识别 AI、Web、开发者工具的新范式', '为内部立项提供外部样本'],
    action: '建议用法：只把它当作线索源，采购、安全和商业判断必须继续尽调。',
    signal: '创新样本',
  },
  {
    id: 'investment',
    short: '我们看机会',
    label: '投资观察 / 商业分析',
    title: '把它当作“项目 Sourcing 入口”',
    summary:
      'Backlog、Founder 与生命周期记录可以帮助我们更早发现团队，但浏览量、Featured 或阶段标签不等于增长和收入。',
    gains: ['寻找尚未广泛传播的团队', '观察创始人的连续发布历史', '识别快速拥挤的新赛道'],
    action: '建议用法：用于发现，不用于下结论；后续核验融资、客户、留存与合规。',
    signal: '项目线索',
  },
]

const libraries = [
  {
    id: 'catalog',
    index: '01',
    name: '公开产品库',
    count: '448',
    unit: '个产品',
    access: '公开',
    color: 'cyan',
    oneLine: '把分散在各处的早期产品整理成可搜索、可筛选的目录。',
    collects: ['产品定位与官网', 'Waitlist / Alpha / Beta / Early / Public 阶段', '主题、平台、创始人与 Deal'],
    meaning: '降低发现成本，是用户进入整个系统的第一入口。',
    examples: ['anyfeeds', 'telemetry.dev', 'Trylle', 'Reely', 'Ragyn', 'Snippetbar'],
    boundary: '收录和策展不等于产品质量、稳定性或安全性认证。',
  },
  {
    id: 'backlog',
    index: '02',
    name: 'Early Backlog',
    count: '846',
    unit: '条记录',
    access: '会员',
    color: 'violet',
    oneLine: '更完整的产品管线，包含尚未进入公共首页的早期信号与历史项目。',
    collects: ['待策展与已策展项目', '不同阶段的产品记录', '收录时间与状态变化'],
    meaning: '让会员比公共访问者更早看到供给侧变化。',
    examples: ['待发布产品', '近期加入项目', '已公开或毕业项目历史'],
    boundary: '更早不代表更可靠，Backlog 适合观察，不适合作为尽调结论。',
  },
  {
    id: 'founders',
    index: '03',
    name: '创始人库',
    count: '489',
    unit: '位创始人',
    access: '会员',
    color: 'orange',
    oneLine: '从“看产品”延伸到“看是谁在持续创造这些产品”。',
    collects: ['X、LinkedIn、邮箱与网站', '关联产品和发布历史', '最近发布与互动信息'],
    meaning: '支持 Founder 研究、合作、招聘和早期项目 Sourcing。',
    examples: ['按阶段筛选', '按可联系渠道筛选', 'CSV 导出'],
    boundary: '联系信息必须用于相关、克制且可退出的沟通，不能变成批量骚扰名单。',
  },
  {
    id: 'resources',
    index: '04',
    name: '创业资源库',
    count: '1,159',
    unit: '条资源',
    access: '会员',
    color: 'green',
    oneLine: '把工具、文章、模板和指南按创业阶段组织起来。',
    collects: ['Idea / Concept / MVP', 'Business / Scale', '工具、文章、模板与视频'],
    meaning: '让创始人发布一次之后仍然有继续使用平台的理由。',
    examples: ['定价与增长指南', '设计和开发工具', '创业案例与模板'],
    boundary: '资源聚合能提供方向，但不能替代针对自己业务的判断和执行。',
  },
  {
    id: 'experiments',
    index: '05',
    name: '验证实验库',
    count: '54',
    unit: '种实验',
    access: '会员',
    color: 'pink',
    oneLine: '用结构化方法回答“这个问题、方案或商业模式值得做吗”。',
    collects: ['定性 / 定量方法', 'Desirability / Viability / Feasibility', '速度、可靠性与成本范围'],
    meaning: '把抽象创业建议变成可以选择和执行的验证方法。',
    examples: ['The Mom Test', 'Landing Page', 'No-code MVP', 'Pre-order', 'Smoke Test'],
    boundary: '方法库不自动提供用户样本，也不保证实验设计和结论正确。',
  },
  {
    id: 'directories',
    index: '06',
    name: '发布渠道库',
    count: '151',
    unit: '个渠道',
    access: '会员',
    color: 'blue',
    oneLine: '把产品可以提交到哪里、价格如何、难度多大整理成执行清单。',
    collects: ['Directory / Media / Newsletter', 'Free / Freemium / Paid', 'Easy / Moderate / Hard'],
    meaning: '把“去哪里发布”从零散经验变成可追踪的工作流。',
    examples: ['AlternativeTo', 'AppSumo', 'BetaList', '媒体与评测站点'],
    boundary: '自动化提交必须遵守各平台规则，避免重复、低质量和垃圾内容。',
  },
  {
    id: 'content',
    index: '07',
    name: '内容与订阅库',
    count: '持续',
    unit: '更新',
    access: '公开',
    color: 'yellow',
    oneLine: '通过 Blog、Glossary、Newsletter 和 RSS 把目录数据变成持续内容。',
    collects: ['每周产品更新', '创业术语与解释', '趋势文章与 RSS'],
    meaning: '提高搜索流量和复访，把一次性目录变成长期媒体关系。',
    examples: ['Weekly Newsletter', 'Startup Glossary', 'Founder-oriented Blog'],
    boundary: '内容选题和 Sponsored 曝光可能影响可见性，需要清楚区分编辑与商业内容。',
  },
]

const categories = [
  ['AI & Agents', 125],
  ['Productivity', 68],
  ['Design & Creative', 43],
  ['Developer Tools', 43],
  ['Marketing & Growth', 32],
  ['Social & Community', 29],
  ['Writing & Content', 28],
  ['Audio & Video', 23],
  ['Finance & Ops', 20],
  ['Data & Analytics', 14],
  ['Health & Life', 14],
  ['Security & Privacy', 9],
]

const sampleProducts = [
  ['anyfeeds', 'Beta', '效率'],
  ['telemetry.dev', 'Early', '开发者工具'],
  ['Trylle', 'Beta', '开发者工具'],
  ['Reely', 'Beta', '设计创意'],
  ['NexHiro', 'Beta', '营销增长'],
  ['Ragyn', 'Alpha', 'AI & Agents'],
  ['Snippetbar', 'Alpha', '效率'],
  ['LinkedInToCV', 'Alpha', '内容写作'],
  ['Quadshot', 'Waitlist', 'AI & Agents'],
  ['local.ai', 'Waitlist', '开发者工具'],
]

const dataSources = [
  {
    index: '01',
    title: '创始人主动提交',
    confidence: '已确认',
    tone: 'confirmed',
    detail: '创业者通过 Submit 提供文字、图片、官网、阶段、创始人资料和 Deal，内容在审核后公开。',
    fields: '产品定位 · Logo · Founder · Deal',
    evidence: 'Submit / Privacy',
    href: 'https://www.early.tools/submit',
  },
  {
    index: '02',
    title: '运营者主动发现',
    confidence: '部分确认',
    tone: 'partial',
    detail: '官网确认“每日人工策展”；但从哪些社区、Newsletter 或社交网络发现项目，并未公开。',
    fields: '候选项目 · 编辑选择 · 收录优先级',
    evidence: 'Homepage',
    href: 'https://www.early.tools/',
  },
  {
    index: '03',
    title: '公开网站与社交资料',
    confidence: '部分确认',
    tone: 'partial',
    detail: '详情页引用产品官网、X、LinkedIn 和个人网站；字段是人工补充、提交还是抓取，未披露。',
    fields: '官网 · X · LinkedIn · Company',
    evidence: 'Product detail',
    href: 'https://www.early.tools/anyfeeds',
  },
  {
    index: '04',
    title: '平台持续观测',
    confidence: '结果已确认',
    tone: 'partial',
    detail: 'Lifeline 展示上线、开始跟踪、阶段变化和 Alive 状态；检测频率及自动化程度未知。',
    fields: 'Went Online · Tracking Since · Alive',
    evidence: 'Lifeline',
    href: 'https://www.early.tools/anyfeeds',
  },
  {
    index: '05',
    title: '用户与交易行为',
    confidence: '已确认',
    tone: 'confirmed',
    detail: '访问日志、页面停留、账号、订阅、交易和分析数据由平台产生，主要用于互动指标和运营。',
    fields: '浏览 · 外链访问 · 账号 · 交易',
    evidence: 'Privacy',
    href: 'https://www.early.tools/privacy',
  },
]

const sourcePipeline = [
  ['输入', '提交与公开线索'],
  ['审核', '筛选、去重与判断'],
  ['规范化', '阶段、主题与平台'],
  ['跟踪', '状态、时间与互动'],
  ['分发', '目录、推荐与周报'],
]

const principles = [
  {
    step: '01',
    title: '收集',
    detail: '创始人提交产品，平台也持续发现外部项目。',
    output: '原始供给',
  },
  {
    step: '02',
    title: '策展',
    detail: '人工审核、去重、改写描述，并规范阶段、主题和平台。',
    output: '可信目录',
  },
  {
    step: '03',
    title: '分发',
    detail: '生成详情页、阶段页、推荐、Blog、Newsletter 与 RSS。',
    output: '发现流量',
  },
  {
    step: '04',
    title: '跟踪',
    detail: '记录上线、阶段变化、存活状态、浏览和外链访问。',
    output: '变化信号',
  },
  {
    step: '05',
    title: '变现',
    detail: '通过 Listing、Membership 与 Sponsor 支撑运营。',
    output: '商业闭环',
  },
]

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="返回页面顶部">
      <span class="brand-mark" aria-hidden="true">E</span>
      <span><strong>EARLY.TOOLS</strong><small>中文能力地图</small></span>
    </a>
    <nav class="top-nav" aria-label="主要导航">
      <a href="#sources">信息来源</a>
      <a href="#meaning">对我们的意义</a>
      <a href="#libraries">有哪些库</a>
      <a href="#principle">如何运作</a>
      <a href="#roadmap">如何扩展</a>
    </nav>
    <button class="theme-toggle" type="button" aria-pressed="false" aria-label="切换深色主题">
      <span class="theme-icon" aria-hidden="true">◐</span>
      <span class="theme-label">深色</span>
    </button>
  </header>

  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span> PUBLIC SNAPSHOT · 2026-09-01</p>
        <h1 id="hero-title">它不生产产品，<br /><em>它生产“更早发现产品”的能力。</em></h1>
        <p class="hero-lede">
          early.tools 是一个面向早期项目的<strong>策展目录、生命周期数据库和创始人工具箱</strong>。
          用户来这里找新产品，创始人来这里找第一批用户。
        </p>
        <div class="hero-actions">
          <a class="button button-primary" href="#sources">先看信息从哪里来 <span aria-hidden="true">↓</span></a>
          <a class="button button-quiet" href="https://www.early.tools/" target="_blank" rel="noreferrer">访问原站 <span aria-hidden="true">↗</span></a>
        </div>
        <p class="scope-note">独立研究 Demo · 非 early.tools 官方产品 · 不复制会员内容</p>
      </div>

      <div class="system-card" role="group" aria-label="early.tools 系统结构概览">
        <div class="system-card-head">
          <span>EARLY SIGNAL SYSTEM</span>
          <span class="status-chip">ONLINE</span>
        </div>
        <div class="system-orbit">
          <div class="orbit-ring orbit-ring-one" aria-hidden="true"></div>
          <div class="orbit-ring orbit-ring-two" aria-hidden="true"></div>
          <div class="orbit-node node-discover"><span>发现</span><small>DISCOVER</small></div>
          <div class="orbit-node node-track"><span>跟踪</span><small>TRACK</small></div>
          <div class="orbit-node node-connect"><span>连接</span><small>CONNECT</small></div>
          <div class="orbit-node node-grow"><span>增长</span><small>GROW</small></div>
          <div class="orbit-core">
            <strong>448</strong>
            <span>公开产品</span>
            <small>305 EARLY · 143 PUBLIC</small>
          </div>
        </div>
        <div class="system-card-foot">
          <span>人工策展</span>
          <span>阶段变化</span>
          <span>会员工具</span>
        </div>
      </div>
    </section>

    <section class="stat-strip" aria-label="公开数据快照">
      <article><span>公开产品</span><strong>448</strong><small>可搜索与筛选</small></article>
      <article><span>完整 Backlog</span><strong>846</strong><small>会员产品管线</small></article>
      <article><span>创业资源</span><strong>1,159</strong><small>按成长阶段组织</small></article>
      <article><span>发布渠道</span><strong>151</strong><small>价格与难度标签</small></article>
    </section>

    <section class="section source-section" id="sources" aria-labelledby="sources-title">
      <div class="section-heading section-heading-row">
        <div>
          <p class="eyebrow">DATA PROVENANCE</p>
          <h2 id="sources-title">先问信息从哪里来，<br />再问目录里有什么</h2>
        </div>
        <p>early.tools 不是单一数据源。它把创业者提交、人工发现、公开资料、平台观测和用户行为加工成同一个产品情报库。</p>
      </div>

      <div class="source-board">
        <div class="source-legend" role="group" aria-label="来源确认程度图例">
          <strong>五类输入</strong>
          <span><i data-tone="confirmed"></i>官网直接确认</span>
          <span><i data-tone="partial"></i>结果可见，采集方式未完全公开</span>
        </div>
        <div class="source-cards">
          ${dataSources
            .map(
              (source) => `
                <article class="source-card" data-tone="${source.tone}">
                  <header>
                    <span>${source.index}</span>
                    <mark>${source.confidence}</mark>
                  </header>
                  <h3>${source.title}</h3>
                  <p>${source.detail}</p>
                  <dl>
                    <div><dt>主要字段</dt><dd>${source.fields}</dd></div>
                    <div><dt>公开依据</dt><dd><a href="${source.href}" target="_blank" rel="noreferrer">${source.evidence} ↗</a></dd></div>
                  </dl>
                </article>
              `,
            )
            .join('')}
        </div>

        <div class="source-chain">
          <div class="chain-title">
            <span>PROCESS</span>
            <strong>来源只是原料，处理链才把它变成可使用的信息</strong>
          </div>
          <ol aria-label="信息处理链">
            ${sourcePipeline
              .map(
                ([title, detail], index) => `
                  <li>
                    <span>0${index + 1}</span>
                    <strong>${title}</strong>
                    <small>${detail}</small>
                  </li>
                `,
              )
              .join('')}
          </ol>
        </div>
      </div>

      <div class="provenance-callout">
        <div>
          <p class="eyebrow">WHAT WE SHOULD REUSE</p>
          <h3>对我们而言，真正关键的是“来源可追溯”</h3>
        </div>
        <ol>
          <li><span>01</span><p><strong>来源</strong>每个重要字段保留原始 URL 或提交者。</p></li>
          <li><span>02</span><p><strong>时间</strong>记录采集时间与最后一次验证时间。</p></li>
          <li><span>03</span><p><strong>置信度</strong>明确区分已确认、合理推断和未知。</p></li>
        </ol>
        <p class="provenance-boundary"><strong>当前缺口</strong> early.tools 没有公开各来源占比、爬取规则、检查频率或逐字段来源记录，因此它适合发现线索，不适合直接替代尽调。</p>
      </div>
    </section>

    <section class="section meaning-section" id="meaning" aria-labelledby="meaning-title">
      <div class="section-heading">
        <p class="eyebrow">WHY IT MATTERS TO US</p>
        <h2 id="meaning-title">它对我们的意义，取决于我们是谁</h2>
        <p>选择一个角色，页面会把同一套能力翻译成具体价值和行动建议。</p>
      </div>

      <div class="role-workspace">
        <div class="role-tabs" role="tablist" aria-label="选择我们的角色">
          ${roles
            .map(
              (role, index) => `
                <button
                  type="button"
                  role="tab"
                  id="role-tab-${role.id}"
                  aria-controls="role-panel"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? '0' : '-1'}"
                  data-role-id="${role.id}"
                >
                  <span>${role.short}</span>
                  <small>${role.label}</small>
                </button>
              `,
            )
            .join('')}
        </div>
        <article class="role-panel" id="role-panel" role="tabpanel" aria-labelledby="role-tab-research" aria-live="polite"></article>
      </div>
    </section>

    <section class="section library-section" id="libraries" aria-labelledby="libraries-title">
      <div class="section-heading section-heading-row">
        <div>
          <p class="eyebrow">LIBRARY MAP</p>
          <h2 id="libraries-title">它不是一个库，而是七个相互连接的能力库</h2>
        </div>
        <p>点击左侧库名，查看它收集什么、为什么有价值，以及使用边界。</p>
      </div>

      <div class="library-workspace">
        <div class="library-nav" role="tablist" aria-label="能力库列表">
          ${libraries
            .map(
              (library, index) => `
                <button
                  type="button"
                  role="tab"
                  id="library-tab-${library.id}"
                  aria-controls="library-panel"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? '0' : '-1'}"
                  data-library-id="${library.id}"
                >
                  <span class="library-index">${library.index}</span>
                  <span class="library-name">${library.name}</span>
                  <span class="library-count">${library.count}</span>
                </button>
              `,
            )
            .join('')}
        </div>
        <article class="library-panel" id="library-panel" role="tabpanel" aria-labelledby="library-tab-catalog" aria-live="polite"></article>
      </div>
    </section>

    <section class="section composition-section" aria-labelledby="composition-title">
      <div class="section-heading">
        <p class="eyebrow">WHAT IS INSIDE</p>
        <h2 id="composition-title">主产品库里，AI 与 Web 是最强信号</h2>
        <p>448 个公开产品的主题与平台分布，说明它更像 AI/Web/独立开发者雷达，而不是通用应用商店。</p>
      </div>

      <div class="composition-grid">
        <article class="chart-card category-chart">
          <div class="card-title-row"><h3>主题构成</h3><span>448 TOTAL</span></div>
          <div class="bar-list">
            ${categories
              .map(
                ([name, value]) => `
                  <div class="bar-row">
                    <span>${name}</span>
                    <div class="bar-track" aria-hidden="true"><i style="--bar-size:${(value / 125) * 100}%"></i></div>
                    <strong>${value}</strong>
                  </div>
                `,
              )
              .join('')}
          </div>
        </article>

        <article class="chart-card stage-card">
          <div class="card-title-row"><h3>公开阶段</h3><span>SNAPSHOT</span></div>
          <div class="stage-visual">
            <div class="stage-ring" role="img" aria-label="Early 305，占 68.1%；Public 143，占 31.9%">
              <div><strong>68.1%</strong><span>EARLY</span></div>
            </div>
            <dl>
              <div><dt><i class="legend-dot early"></i>Early</dt><dd>305</dd></div>
              <div><dt><i class="legend-dot public"></i>Public</dt><dd>143</dd></div>
              <div><dt>其中 Beta</dt><dd>101</dd></div>
              <div><dt>其中 Waitlist</dt><dd>87</dd></div>
              <div><dt>其中 Alpha</dt><dd>23</dd></div>
            </dl>
          </div>
          <div class="platforms">
            <span>WEB <strong>300</strong></span>
            <span>macOS <strong>57</strong></span>
            <span>API / CLI <strong>44</strong></span>
            <span>iOS <strong>44</strong></span>
            <span>Hardware <strong>38</strong></span>
          </div>
        </article>

        <article class="chart-card product-card">
          <div class="card-title-row"><h3>近期代表产品</h3><span>EXAMPLES</span></div>
          <div class="product-table" role="table" aria-label="近期代表产品">
            ${sampleProducts
              .map(
                ([name, stage, topic]) => `
                  <div class="product-row" role="row">
                    <strong role="cell">${name}</strong>
                    <span role="cell">${topic}</span>
                    <i role="cell" data-stage="${stage.toLowerCase()}">${stage}</i>
                  </div>
                `,
              )
              .join('')}
          </div>
          <p class="fine-print">这些产品均为第三方项目；early.tools 负责收录与策展，并不拥有它们。</p>
        </article>
      </div>
    </section>

    <section class="section principle-section" id="principle" aria-labelledby="principle-title">
      <div class="section-heading">
        <p class="eyebrow">HOW IT WORKS</p>
        <h2 id="principle-title">真正的产品不是“列表”，而是持续运转的策展飞轮</h2>
        <p>同一份结构化产品数据，被复用到发现、生命周期、内容、会员和商业化五个环节。</p>
      </div>
      <ol class="principle-flow">
        ${principles
          .map(
            (item) => `
              <li>
                <span class="flow-step">${item.step}</span>
                <h3>${item.title}</h3>
                <p>${item.detail}</p>
                <strong>${item.output}</strong>
              </li>
            `,
          )
          .join('')}
      </ol>
      <div class="flywheel-callout">
        <span class="flywheel-label">飞轮</span>
        <p><strong>更多项目</strong>带来更多早期用户，<strong>更多用户</strong>提高创始人的发布意愿，会员和赞助收入再支持持续策展。</p>
      </div>
    </section>

    <section class="section scenario-section" aria-labelledby="scenario-title">
      <div class="section-heading">
        <p class="eyebrow">USE CASES</p>
        <h2 id="scenario-title">什么时候值得用，什么时候不要依赖它</h2>
      </div>
      <div class="scenario-grid">
        <article>
          <span class="scenario-no">A</span>
          <h3>寻找新工具</h3>
          <p>筛选 AI、Web、Beta 产品，加入 Waitlist 或领取早期 Deal。</p>
          <strong>适合：发现</strong>
        </article>
        <article>
          <span class="scenario-no">B</span>
          <h3>发布新产品</h3>
          <p>提交 MVP，获得详情页、Newsletter 和早期访问者。</p>
          <strong>适合：冷启动</strong>
        </article>
        <article>
          <span class="scenario-no">C</span>
          <h3>观察赛道</h3>
          <p>比较产品阶段、平台与创始人，建立竞品和趋势清单。</p>
          <strong>适合：研究</strong>
        </article>
        <article class="scenario-warning">
          <span class="scenario-no">!</span>
          <h3>不能替代尽调</h3>
          <p>目录没有完整收入、客户、融资、安全、合规和留存数据。</p>
          <strong>边界：只作线索</strong>
        </article>
      </div>
    </section>

    <section class="section roadmap-section" id="roadmap" aria-labelledby="roadmap-title">
      <div class="section-heading section-heading-row">
        <div>
          <p class="eyebrow">EXTENSION ROADMAP</p>
          <h2 id="roadmap-title">如果继续扩展，先提高信号质量，再扩大功能</h2>
        </div>
        <p>每一层都应该强化“更早、更准地发现”，而不是把平台做成另一个复杂 CRM。</p>
      </div>

      <div class="roadmap-list">
        <details open>
          <summary><span>P0</span><strong>可信度与新鲜度</strong><small>先解决数据可靠</small></summary>
          <div><p>增加来源、最后验证时间、失效检测、Founder/Domain/Deal 验证和 Freshness Score。</p><em>意义：让“早期”不再等于“未经核实”。</em></div>
        </details>
        <details>
          <summary><span>P1</span><strong>个性化产品情报</strong><small>从浏览升级为跟踪</small></summary>
          <div><p>增加收藏、Watchlist、阶段变化提醒、主题订阅、自然语言搜索和个人 Digest。</p><em>意义：减少重复搜索，形成我们的持续情报流。</em></div>
        </details>
        <details>
          <summary><span>P2</span><strong>Founder Growth OS</strong><small>连接发布与转化</small></summary>
          <div><p>提供发布日历、目录提交、UTM、Waitlist 转化、Newsletter 效果和团队协作。</p><em>意义：从“被收录”变成“知道哪些渠道真的有效”。</em></div>
        </details>
        <details>
          <summary><span>P3</span><strong>API / MCP 与趋势地图</strong><small>开放数据能力</small></summary>
          <div><p>提供 Catalog API、Webhook、MCP、赛道聚类和阶段变化数据，让团队与 AI Agent 接入。</p><em>意义：把网站升级为可组合的早期产品情报基础设施。</em></div>
        </details>
      </div>
    </section>

    <section class="section conclusion-section" aria-labelledby="conclusion-title">
      <div>
        <p class="eyebrow">ONE SENTENCE</p>
        <h2 id="conclusion-title">用户通过它找新产品，创始人通过它找第一批用户。</h2>
      </div>
      <p>
        对我们而言，它最值得复用的不是页面风格，而是<strong>“来源可追溯 + 结构化目录 + 生命周期变化 + 内容分发”</strong>这一套产品系统。
      </p>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>early.tools 中文能力地图</strong>
      <span>独立研究 Demo · 数据快照 2026-09-01</span>
    </div>
    <div class="footer-links">
      <a href="https://www.early.tools/" target="_blank" rel="noreferrer">原站 ↗</a>
      <a href="https://www.early.tools/terms" target="_blank" rel="noreferrer">条款 ↗</a>
      <a href="https://www.early.tools/privacy" target="_blank" rel="noreferrer">隐私 ↗</a>
    </div>
  </footer>
`

const rolePanel = document.querySelector('#role-panel')
const roleTabs = [...document.querySelectorAll('[data-role-id]')]
const libraryPanel = document.querySelector('#library-panel')
const libraryTabs = [...document.querySelectorAll('[data-library-id]')]

function renderRole(roleId, focus = false) {
  const role = roles.find((item) => item.id === roleId) ?? roles[0]
  roleTabs.forEach((tab) => {
    const selected = tab.dataset.roleId === role.id
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
    if (selected && focus) tab.focus()
  })
  rolePanel.setAttribute('aria-labelledby', `role-tab-${role.id}`)
  rolePanel.innerHTML = `
    <div class="role-panel-top">
      <span class="role-signal">${role.signal}</span>
      <span>${role.label}</span>
    </div>
    <h3>${role.title}</h3>
    <p class="role-summary">${role.summary}</p>
    <ul>${role.gains.map((gain) => `<li>${gain}</li>`).join('')}</ul>
    <p class="role-action"><span>行动</span>${role.action}</p>
  `
}

function renderLibrary(libraryId, focus = false) {
  const library = libraries.find((item) => item.id === libraryId) ?? libraries[0]
  libraryTabs.forEach((tab) => {
    const selected = tab.dataset.libraryId === library.id
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
    if (selected && focus) tab.focus()
  })
  libraryPanel.setAttribute('aria-labelledby', `library-tab-${library.id}`)
  libraryPanel.dataset.color = library.color
  libraryPanel.innerHTML = `
    <div class="library-panel-head">
      <div>
        <span class="access-badge">${library.access}</span>
        <p>LIBRARY ${library.index}</p>
      </div>
      <div class="library-number"><strong>${library.count}</strong><span>${library.unit}</span></div>
    </div>
    <h3>${library.name}</h3>
    <p class="library-one-line">${library.oneLine}</p>
    <div class="library-detail-grid">
      <section>
        <h4>它收集什么</h4>
        <ul>${library.collects.map((item) => `<li>${item}</li>`).join('')}</ul>
      </section>
      <section>
        <h4>为什么有价值</h4>
        <p>${library.meaning}</p>
      </section>
    </div>
    <div class="example-cloud">
      ${library.examples.map((item) => `<span>${item}</span>`).join('')}
    </div>
    <p class="boundary-note"><strong>使用边界</strong>${library.boundary}</p>
  `
}

function wireRovingTabs(tabs, render) {
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => render(tab.dataset.roleId ?? tab.dataset.libraryId))
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      let nextIndex = index
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = tabs.length - 1
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length
      const target = tabs[nextIndex]
      render(target.dataset.roleId ?? target.dataset.libraryId, true)
    })
  })
}

const themeToggle = document.querySelector('.theme-toggle')
const themeLabel = document.querySelector('.theme-label')
const storedTheme = localStorage.getItem('early-tools-lab-theme')
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
let currentTheme = storedTheme ?? (preferredDark ? 'dark' : 'light')

function setTheme(theme) {
  currentTheme = theme
  document.documentElement.dataset.theme = theme
  const dark = theme === 'dark'
  themeToggle.setAttribute('aria-pressed', String(dark))
  themeToggle.setAttribute('aria-label', dark ? '切换浅色主题' : '切换深色主题')
  themeLabel.textContent = dark ? '浅色' : '深色'
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0c1114' : '#f4f2eb')
  localStorage.setItem('early-tools-lab-theme', theme)
}

themeToggle.addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'))

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    history.replaceState(null, '', link.getAttribute('href'))
  })
})

wireRovingTabs(roleTabs, renderRole)
wireRovingTabs(libraryTabs, renderLibrary)
renderRole('research')
renderLibrary('catalog')
setTheme(currentTheme)

window.__EARLY_TOOLS_LAB_READY__ = true
