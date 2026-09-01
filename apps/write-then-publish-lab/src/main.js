import './styles.css'

const SAMPLE_MARKDOWN = `# 把写作和发布之间的路，缩短一点

我们常把时间花在写作上，却在发布前被重复排版打断：同一段内容，要为不同平台重新分段、调图、复制和检查。

## 一份内容，两种表达

**内容本身应该是唯一事实源。** 卡片需要节奏和分页，长文需要连续阅读，但它们不该变成两份失去同步的稿件。

> 把内容与版式分开，修改一次，就能让所有输出一起更新。

- 卡片负责抓住注意力
- 长文负责完整表达
- 素材在发布前统一确认

## 最后一步，仍由人决定

自动排版减少机械劳动，却不替代判断。标题是否准确、图片是否合适、平台语境是否匹配，仍然需要创作者在导出前确认。`

const pipelineSteps = [
  {
    short: '摄取',
    title: '接收唯一内容源',
    label: '上游事实',
    tone: 'fact',
    summary: '从 Markdown、普通文本或 Obsidian 引用开始，正文不是按平台复制出来的多份副本。',
    detail: '输入层负责接收文字与素材引用。上游 README 还列出了上传、粘贴、拖放和批量导入图片的入口。',
    code: 'input: markdown + media references',
    output: '原始正文与素材线索',
  },
  {
    short: '规范化',
    title: '统一文档状态',
    label: '源码审查推断',
    tone: 'inference',
    summary: '把编辑内容、图片元数据与排版设置收敛为同一个可更新状态。',
    detail: '这是理解该类工具的关键：模式切换改变的是输出配置，而不是重写正文。具体内部结构会随实现演进。',
    code: 'state = { content, media, layout }',
    output: '可复用的内容状态',
  },
  {
    short: '解析',
    title: '识别内容结构',
    label: '上游事实',
    tone: 'fact',
    summary: '识别标题、段落、无序列表、引用、强调等结构，为后续渲染保留语义。',
    detail: '公众号长文会保留 Markdown 结构；卡片渲染则用同一结构计算不同的视觉节奏。',
    code: 'markdown → semantic blocks',
    output: '标题 / 正文 / 无序列表 / 引用',
  },
  {
    short: '素材',
    title: '解析并准备媒体',
    label: '上游事实',
    tone: 'fact',
    summary: '解析图片引用，建立裁剪、位置、比例等排版信息；视频还会进入 Live Photo 处理路径。',
    detail: '真实上游包含 Canvas 2D、WebCodecs 与媒体打包能力。本 Demo 不载入、上传或编码任何媒体。',
    code: 'reference → crop / frame / asset',
    output: '可排版素材',
  },
  {
    short: '双渲染',
    title: '进入两套布局策略',
    label: '教学模拟',
    tone: 'simulation',
    summary: '卡片按容量切页，长文按连续文档流排版；两者都读取同一份语义块。',
    detail: '上方实验台正演示这一原则。页数和视觉结果是本 Demo 的近似模拟，不代表上游算法输出。',
    code: 'blocks → cards[] | article',
    output: '3:4 卡片组 / 连续长文',
  },
  {
    short: '交付',
    title: '导出并交给平台',
    label: '上游事实',
    tone: 'fact',
    summary: '根据输出类型生成 PNG、ZIP、富文本或 Live Photo 包，再由用户检查并完成发布。',
    detail: '上游可以复制公众号富文本；特定 macOS 本地配置可同步草稿箱，但不会直接群发。小红书仍是素材导出与人工发布。',
    code: 'layout → PNG / ZIP / rich text / .pvt',
    output: '发布前成品',
  },
]

const capabilityRows = [
  ['单一正文复用', '卡片自动分页；长文保留 Markdown 结构', '不是 AI 写作器，也不会替你判断内容质量'],
  ['图片即传即排', '上传、粘贴、拖放、裁剪、缩放、位置与对齐', '本 Demo 只展示文字布局，不处理真实图片'],
  ['多格式导出', '卡片 PNG / ZIP、长图、公众号富文本', '小红书仍需人工上传；草稿箱同步不等于群发'],
  ['Live Photo', '片段、比例、裁剪、声音、本地生成与打包', '依赖浏览器/系统能力；平台能否保留效果取决于上传入口'],
  ['Obsidian 工作流', '读取 Wiki 图片引用；有权限时写回，否则 ZIP 降级', '浏览器目录权限与平台支持决定可用路径'],
  ['数据与账号', '游客临时使用；登录后可通过 Supabase 同步', '本地优先不等于完全离线，也不等于永久备份'],
]

const scenarios = [
  {
    marker: '高匹配',
    title: '个人内容创作者',
    tone: 'good',
    description: '用 Markdown / Obsidian 写中文内容，需要稳定地产出小红书卡片与公众号长文。',
    examples: ['知识拆解与教程', '摄影、旅行、美食图文', 'AI 初稿后的人工排版'],
  },
  {
    marker: '条件匹配',
    title: '小型内容工作室',
    tone: 'conditional',
    description: '可以作为排版环节，但多人协作、审批、排期、权限与数据分析需要另外建设。',
    examples: ['固定品牌模板', '批量内容生产', '本地素材交付'],
  },
  {
    marker: '低匹配',
    title: '全自动商业发布平台',
    tone: 'poor',
    description: '当前能力边界与许可都不支持把它直接当成无需改造的商业 SaaS 或全平台群发系统。',
    examples: ['企业审批中台', '无人值守跨平台发布', '客户代运营 SaaS'],
  },
]

const roadmap = [
  {
    phase: 'NOW · 先打地基',
    title: '把单体能力拆成稳定内核',
    description: '先建立文档 AST、渲染器接口、素材仓库与自动化测试，再谈更多平台。',
    items: ['统一内容模型与迁移策略', '拆分卡片 / 长文 / 媒体模块', '视觉回归与导出一致性测试'],
    value: '降低新增功能时的耦合与回归风险',
  },
  {
    phase: 'NEXT · 放大复用',
    title: '平台适配器与品牌模板',
    description: '把“校验 → 排版 → 导出 → 交付”抽象为适配器，允许主题和品牌规则独立演进。',
    items: ['知乎、微博、飞书、语雀适配器', '可导入设计 Token 与封面模板', 'CLI / 批处理 / Codex Skill'],
    value: '从一个页面工具成长为内容编译流水线',
  },
  {
    phase: 'LATER · 谨慎扩张',
    title: 'AI 辅助与团队工作流',
    description: '在原始正文仍是唯一事实源的前提下，增加平台化改写、校验、版本与审批。',
    items: ['标题 / 摘要 / 平台文案建议', '共享空间、评论、审批和版本', 'PWA / Tauri 与跨平台媒体交接'],
    value: '扩大协作价值，但也显著增加产品与合规复杂度',
  },
]

const researchQuestions = [
  {
    number: '01',
    label: '作用与意义',
    title: '它解决什么问题？',
    answer: '把写完的 Markdown 变成可交付的卡片与长文，减少跨平台重复排版。',
    href: '#overview',
    link: '先看产品定位',
  },
  {
    number: '02',
    label: '能力与边界',
    title: '它具体能做什么？',
    answer: '双形态排版、图片处理、多格式导出、Live Photo 与 Obsidian 工作流。',
    href: '#capabilities',
    link: '查看能力矩阵',
  },
  {
    number: '03',
    label: '工作原理',
    title: '一份内容如何分流？',
    answer: '先形成统一内容状态，再经过语义解析、素材准备与两套渲染策略。',
    href: '#principle',
    link: '拆解六步流程',
  },
  {
    number: '04',
    label: '使用场景',
    title: '谁最适合使用？',
    answer: '高频发布中文图文、以 Markdown 或 Obsidian 为内容源的个人和小团队。',
    href: '#scenarios',
    link: '判断是否匹配',
  },
  {
    number: '05',
    label: '扩展方向',
    title: '下一步应该怎么演进？',
    answer: '先拆内容内核，再增加平台适配器、品牌模板、AI 辅助与团队流程。',
    href: '#roadmap',
    link: '查看扩展路线',
  },
]

const evidenceLedger = [
  {
    status: '已核对',
    tone: 'fact',
    title: '固定版本与上游文档',
    description: '研究固定在提交 7a70831，结论来自 README、LICENSE 与仓库源码，避免把后续变化混入当前判断。',
    meta: 'SOURCE · DOCS + CODE',
  },
  {
    status: '已验证',
    tone: 'fact',
    title: '研究页与上游实测',
    description: '除研究页交互外，还直接运行固定提交：499 字样稿生成 3 张原生卡片，并切换长文、导出两类 PNG。',
    meta: 'EVIDENCE · UPSTREAM + EXPORT',
  },
  {
    status: '教学模型',
    tone: 'simulation',
    title: '原理图与当前演示',
    description: '六步流程是基于源码结构整理的解释模型；页面中的卡片分页是近似演算，不冒充上游真实导出算法。',
    meta: 'MODEL · EXPLAINED, NOT OFFICIAL',
  },
  {
    status: '尚未实测',
    tone: 'suggestion',
    title: '真实平台与生产环境',
    description: '没有执行真实公众号发送、iPhone Live Photo 发布、Supabase 生产同步或小红书直接发布；相关结论仅陈述能力边界。',
    meta: 'BOUNDARY · NO LIVE PLATFORM RUN',
  },
]

const state = {
  focus: 'split',
  theme: getInitialTheme(),
  step: 0,
  content: SAMPLE_MARKDOWN,
}

document.documentElement.dataset.theme = state.theme
document.documentElement.style.colorScheme = state.theme

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Write Then Publish 独立研究档案首页">
      <span class="brand-mark" aria-hidden="true">W→P</span>
      <span class="brand-copy"><strong>独立研究档案</strong><small>Research archive + live demo</small></span>
    </a>
    <nav class="site-nav" aria-label="页面导航">
      <a href="#research-map">索引</a>
      <a href="#real-demo">实测</a>
      <a href="#lab">实验台</a>
      <a href="#capabilities">能力</a>
      <a href="#principle">原理</a>
      <a href="#scenarios">场景</a>
      <a href="#roadmap">路线</a>
    </nav>
    <button class="icon-button theme-toggle" type="button" aria-label="深色主题" aria-pressed="false">
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.1A8.2 8.2 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z"></path></svg>
    </button>
  </header>

  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span>RESEARCH ARCHIVE 01</span><span>固定版本 · 7a70831</span></p>
        <h1 id="hero-title">Write Then Publish<br /><em>研究档案</em></h1>
        <p class="hero-intro">一句话结论：它不是 AI 写作器，也不是全自动发布中台；它是一个“写完之后”的内容编译器，把同一份正文整理成适合不同平台的发布成品。</p>
      </div>
      <aside class="hero-note" aria-label="研究结论摘要">
        <span class="evidence-tag tag-fact">研究结论</span>
        <p>对高频发布 Markdown 图文的人，它的价值不是“多写一篇”，而是少做一遍分版、排版与素材搬运。</p>
        <dl class="hero-metrics">
          <div><dt>01</dt><dd>统一内容源</dd></div>
          <div><dt>02</dt><dd>核心输出形态</dd></div>
          <div><dt>05</dt><dd>研究问题</dd></div>
        </dl>
        <a class="hero-demo-link" href="#real-demo">
          <span><strong>查看上游真实导出</strong><small>固定提交 · 原生 PNG 证据</small></span>
          <span aria-hidden="true">↓</span>
        </a>
      </aside>
    </section>

    <section class="research-map-section" id="research-map" aria-labelledby="research-map-title">
      <div class="section-heading research-map-heading">
        <div>
          <p class="section-index">00 / RESEARCH DIRECTORY</p>
          <h2 id="research-map-title">五个问题，读懂这个项目</h2>
        </div>
        <p>先按问题定位结论，再进入交互实验核对“同一内容、多种输出”到底意味着什么。</p>
      </div>
      <div class="research-question-grid">
        ${researchQuestions.map((item) => `
          <a class="research-question-card" href="${item.href}">
            <span class="question-number">${item.number}</span>
            <span class="question-copy">
              <span class="question-label">${item.label}</span>
              <strong>${item.title}</strong>
              <span class="question-answer">${item.answer}</span>
              <span class="question-link">${item.link} <span aria-hidden="true">↓</span></span>
            </span>
          </a>
        `).join('')}
      </div>
      <aside class="reading-path" aria-label="推荐阅读路径">
        <strong>按时间阅读</strong>
        <ol>
          <li><span>3 分钟</span>看定位、能力边界与结论</li>
          <li><span>10 分钟</span>动手修改正文，观察双输出</li>
          <li><span>20 分钟</span>拆解原理、场景与扩展路线</li>
        </ol>
      </aside>
    </section>

    <section class="real-demo-section" id="real-demo" aria-labelledby="real-demo-title">
      <div class="section-heading real-demo-heading">
        <div>
          <p class="section-index">PROOF / UPSTREAM REAL RUN</p>
          <h2 id="real-demo-title">不是概念图：同一份正文，真的生成了两类 PNG</h2>
        </div>
        <p>以下结果直接运行上游固定提交产生。上游源码未修改；我们只把输入、过程截图和原生导出文件作为研究证据关联进来。</p>
      </div>

      <div class="understanding-panel" role="group" aria-labelledby="understanding-title">
        <div class="understanding-lead">
          <span class="evidence-tag tag-fact">我们的最终理解</span>
          <h3 id="understanding-title">一次输入、统一处理、<br />按平台编译、分别交付。</h3>
          <div class="understanding-flow" role="group" aria-label="内容处理流程">
            <span>Markdown / 素材</span><i aria-hidden="true">→</i><strong>统一内容状态</strong><i aria-hidden="true">→</i><span>卡片 / 长文</span><i aria-hidden="true">→</i><span>PNG / 草稿</span>
          </div>
        </div>
        <div class="understanding-grid">
          <article><span>01 / 本质</span><h4>输入入口 + 输出适配器</h4><p>它优化的是写完之后反复分版、排版、搬素材的劳动，而不是替你决定写什么。</p></article>
          <article><span>02 / AI 角色</span><h4>上游增强，不是当前内核</h4><p>AI 适合做摘要、结构与平台文案建议；稳定排版和导出仍由确定性的解析、渲染规则完成。</p></article>
          <article><span>03 / 对我们的意义</span><h4>值得参考的产品闭环</h4><p>当我们要做多平台内容自动化时，可复用“单一事实源 → 多渲染器 → 人工终审”的产品思路。</p></article>
          <article><span>04 / 不可照搬</span><h4>先看工程与许可边界</h4><p>当前主逻辑较集中、平台耦合明显，且采用个人非商业许可；学习范式不等于可直接商用源码。</p></article>
        </div>
      </div>

      <div class="real-run-summary" role="group" aria-label="真实演示结果摘要">
        <article><span class="real-run-number">499</span><p>字符 Markdown<br /><small>同一份研究样稿</small></p></article>
        <i aria-hidden="true">→</i>
        <article><span class="real-run-number">3</span><p>张原生卡片<br /><small>Canvas 自动分页</small></p></article>
        <i aria-hidden="true">+</i>
        <article><span class="real-run-number">1</span><p>张公众号长图<br /><small>同项目直接切换</small></p></article>
        <span class="evidence-tag tag-fact">上游实测</span>
      </div>

      <div class="real-workspace-grid">
        <figure class="real-workspace-figure">
          <a href="./real-demo/upstream-real-cards.png" target="_blank">
            <img src="./real-demo/upstream-real-cards.png" width="1440" height="1000" loading="lazy" alt="上游原生卡片工作区，输入研究样稿后生成三张卡片" />
          </a>
          <figcaption><strong>原生卡片工作区</strong><span>499 字输入 → 3 张卡片 → 高清尺寸 1728 × 2304</span></figcaption>
        </figure>
        <figure class="real-workspace-figure">
          <a href="./real-demo/upstream-real-article.png" target="_blank">
            <img src="./real-demo/upstream-real-article.png" width="1440" height="1000" loading="lazy" alt="上游原生长文工作区，保留同一正文并应用主题样式" />
          </a>
          <figcaption><strong>原生长文工作区</strong><span>同一项目切换 → 优雅 / 衬线 / 活力橘 → 长图导出</span></figcaption>
        </figure>
      </div>

      <div class="real-output-grid">
        <article class="real-output-card">
          <a class="real-output-preview card-ratio" href="./real-demo/layout-page-01.png" target="_blank" aria-label="打开上游真实卡片 PNG 原图">
            <img src="./real-demo/layout-page-01.png" width="1728" height="2304" loading="lazy" alt="上游原生渲染并导出的第一张竖版内容卡片" />
          </a>
          <div><span class="evidence-tag tag-fact">原生导出</span><h3>卡片 PNG</h3><p><code>1728 × 2304</code> · 395,985 bytes</p><a href="./real-demo/layout-page-01.png" download>下载原文件 ↓</a></div>
        </article>
        <article class="real-output-card">
          <a class="real-output-preview article-ratio" href="./real-demo/write-then-publish-article.png" target="_blank" aria-label="打开上游真实长文 PNG 原图">
            <img src="./real-demo/write-then-publish-article.png" width="482" height="1479" loading="lazy" alt="上游原生渲染并导出的公众号竖向长文图片" />
          </a>
          <div><span class="evidence-tag tag-fact">原生导出</span><h3>长文 PNG</h3><p><code>482 × 1479</code> · 103,879 bytes</p><a href="./real-demo/write-then-publish-article.png" download>下载原文件 ↓</a></div>
        </article>
      </div>

      <aside class="real-demo-notes">
        <div><strong>它证明了什么</strong><p>同一正文可由上游真实解析、分页、主题化，并通过其 Canvas / html2canvas 导出链生成文件。</p></div>
        <div><strong>它没有证明什么</strong><p>没有连接小红书、公众号账号、Supabase、Obsidian 或 Live Photo；PNG 导出成功不等于平台发布成功。</p></div>
        <div class="real-demo-links">
          <a href="./real-demo/real-demo.md" target="_blank">查看原始输入 ↗</a>
          <a href="https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e" target="_blank" rel="noreferrer">核对固定提交 ↗</a>
        </div>
      </aside>
    </section>

    <section class="lab-section" id="lab" aria-labelledby="lab-title">
      <div class="section-heading compact-heading">
        <div>
          <p class="section-index">01 / CAPABILITY LAB</p>
          <h2 id="lab-title">先看同一份内容，怎样分流</h2>
        </div>
        <p>改动左侧正文，右侧两种排版会同时更新。</p>
      </div>

      <div class="lab-frame">
        <div class="lab-toolbar">
          <div class="toolbar-legend">
            <span class="status-dot" aria-hidden="true"></span>
            <span>本地浏览器内教学演算</span>
            <span class="evidence-tag tag-simulation">教学模拟</span>
          </div>
          <div class="view-switcher" role="group" aria-label="预览聚焦方式">
            <button type="button" data-focus="split" aria-pressed="true">并排</button>
            <button type="button" data-focus="cards" aria-pressed="false">聚焦卡片</button>
            <button type="button" data-focus="article" aria-pressed="false">聚焦长文</button>
          </div>
        </div>

        <div class="workspace">
          <article class="editor-panel panel-shell" aria-labelledby="editor-title">
            <header class="panel-heading">
              <div>
                <span class="panel-number">01</span>
                <h3 id="editor-title">唯一内容源</h3>
              </div>
              <span class="file-pill">draft.md</span>
            </header>
            <label class="sr-only" for="markdown-input">Markdown 正文</label>
            <textarea id="markdown-input" spellcheck="false" aria-describedby="editor-hint"></textarea>
            <footer class="editor-footer">
              <p id="editor-hint"><span id="char-count">0</span> 字 · 支持标题、段落、引用、无序列表与粗体</p>
              <button class="text-button" id="restore-sample" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 2 7M4 10V4m0 6h6"></path></svg>
                恢复示例
              </button>
            </footer>
          </article>

          <div class="preview-stage" id="preview-stage" data-focus="split">
            <article class="preview-panel card-output panel-shell" id="card-preview" aria-labelledby="card-preview-title">
              <header class="panel-heading">
                <div>
                  <span class="panel-number">02A</span>
                  <h3 id="card-preview-title">小红书卡片</h3>
                </div>
                <span class="output-meta"><strong id="page-count">0</strong> 页 · 3:4</span>
              </header>
              <div class="card-deck" id="card-deck" role="region" tabindex="0" aria-label="卡片分页预览，可滚动浏览"></div>
              <p class="preview-caption"><span class="evidence-tag tag-simulation">教学模拟</span> 按内容权重近似分页，不生成真实 PNG。</p>
            </article>

            <article class="preview-panel article-output panel-shell" id="article-preview" aria-labelledby="article-preview-title">
              <header class="panel-heading">
                <div>
                  <span class="panel-number">02B</span>
                  <h3 id="article-preview-title">公众号长文</h3>
                </div>
                <span class="output-meta">连续文档流</span>
              </header>
              <div class="phone-frame">
                <div class="phone-bar" aria-hidden="true"><span>公众号预览</span><i></i><i></i><i></i></div>
                <article class="wechat-article" id="wechat-article" tabindex="0" aria-label="公众号长文预览，可滚动浏览"></article>
              </div>
              <p class="preview-caption"><span class="evidence-tag tag-simulation">教学模拟</span> 保留结构，不复制真实公众号样式。</p>
            </article>
          </div>
        </div>
        <p class="lab-status" id="lab-status" role="status" aria-live="polite">示例已载入，两种输出来自同一份正文。</p>
      </div>
    </section>

    <section class="thesis-section" id="overview" aria-labelledby="thesis-title">
      <div class="section-heading">
        <div>
          <p class="section-index">02 / WHAT IT DOES</p>
          <h2 id="thesis-title">它真正解决的，是发布前最后一公里</h2>
        </div>
        <p>不是替你写，而是把分版、排版、素材处理与交付收进一个工作区。</p>
      </div>
      <div class="thesis-grid">
        <article class="thesis-card thesis-primary">
          <span class="evidence-tag tag-fact">上游事实</span>
          <p class="thesis-kicker">PRODUCT POSITION</p>
          <h3>内容已经写完，<br />却还没真正“可发布”。</h3>
          <p>Write Then Publish 把同一内容模型送进不同输出布局，让创作者把时间留给判断，而不是重复搬运。</p>
          <div class="flow-line" role="group" aria-label="产品工作流">
            <span>Markdown</span><i aria-hidden="true">→</i><span>统一内容</span><i aria-hidden="true">→</i><span>平台成品</span>
          </div>
        </article>
        <article class="thesis-card">
          <span class="card-symbol" aria-hidden="true">Aa</span>
          <h3>结构复用</h3>
          <p>标题、段落、引用和素材只维护一次；输出规则负责改变节奏与版式。</p>
        </article>
        <article class="thesis-card">
          <span class="card-symbol symbol-media" aria-hidden="true">◫</span>
          <h3>素材就位</h3>
          <p>图片、视频与 Live Photo 不再是导出后的补丁，而是排版阶段的一部分。</p>
        </article>
        <article class="thesis-card">
          <span class="card-symbol symbol-check" aria-hidden="true">✓</span>
          <h3>人保留终审</h3>
          <p>工具生成发布素材或草稿，平台语境、内容质量与最终发布仍由人确认。</p>
        </article>
      </div>
    </section>

    <section class="principle-section" id="principle" aria-labelledby="principle-title">
      <div class="section-heading inverse-heading">
        <div>
          <p class="section-index">03 / HOW IT WORKS</p>
          <h2 id="principle-title">六步拆开：从正文到可交付成品</h2>
        </div>
        <p>这是基于上游文档与源码结构整理的教学模型，不是官方架构图。</p>
      </div>

      <div class="pipeline-shell">
        <div class="pipeline-tabs" role="tablist" aria-label="处理原理六步">
          ${pipelineSteps.map((step, index) => `
            <button class="pipeline-tab" id="step-tab-${index}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="step-panel" tabindex="${index === 0 ? 0 : -1}" data-step="${index}">
              <span>${String(index + 1).padStart(2, '0')}</span><strong>${step.short}</strong>
            </button>
          `).join('')}
        </div>
        <p class="sr-only" id="pipeline-status" role="status" aria-live="polite"></p>

        <div class="pipeline-content">
          <div class="pipeline-visual" aria-hidden="true">
            <div class="data-token token-source"><span>#</span><i></i><i></i><i></i></div>
            <div class="data-route"><span></span><span></span><span></span><span></span><span></span></div>
            <div class="data-token token-output"><span>02</span><i></i><i></i></div>
            <p id="visual-step-label">STEP 01 · INPUT</p>
          </div>
          <div class="step-panel" id="step-panel" role="tabpanel" tabindex="0" aria-labelledby="step-tab-0">
            <div class="step-panel-head">
              <div><span class="step-overline" id="step-overline">STEP 01 / 摄取</span><h3 id="step-title"></h3></div>
              <span class="evidence-tag" id="step-evidence"></span>
            </div>
            <p class="step-summary" id="step-summary"></p>
            <p class="step-detail" id="step-detail"></p>
            <dl class="step-io">
              <div><dt>处理表达</dt><dd><code id="step-code"></code></dd></div>
              <div><dt>本步产出</dt><dd id="step-output"></dd></div>
            </dl>
            <div class="step-nav">
              <button id="prev-step" type="button" aria-label="查看上一步">← 上一步</button>
              <span><strong id="step-current">1</strong> / 6</span>
              <button id="next-step" type="button">下一步 →</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="capability-section" id="capabilities" aria-labelledby="capability-title">
      <div class="section-heading">
        <div>
          <p class="section-index">04 / CAPABILITY & BOUNDARY</p>
          <h2 id="capability-title">能力很完整，边界也必须一起看</h2>
        </div>
        <p>“能排版”“能导出”“能同步草稿”是三种不同层级，不应混为“自动发布”。</p>
      </div>
      <div class="table-wrap" role="region" tabindex="0" aria-label="能力与边界表，可横向滚动">
        <table>
          <thead><tr><th scope="col">能力域</th><th scope="col">已验证的上游能力</th><th scope="col">关键边界</th></tr></thead>
          <tbody>
            ${capabilityRows.map((row) => `<tr><th scope="row">${row[0]} <span class="evidence-tag tag-fact">事实</span></th><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <aside class="license-callout">
        <div class="license-icon" aria-hidden="true">§</div>
        <div>
          <p class="section-index">LICENSE CHECK</p>
          <h3>公开源码，不等于可直接商业使用</h3>
          <p>上游使用个人非商业许可证。个人学习、研究与非商业展示之外的公司、客户、收费服务或 SaaS 用途，应先核对最新版 LICENSE 并取得书面许可。</p>
        </div>
        <a href="https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/LICENSE" target="_blank" rel="noreferrer">查看上游 LICENSE <span aria-hidden="true">↗</span></a>
      </aside>
    </section>

    <section class="scenarios-section" id="scenarios" aria-labelledby="scenarios-title">
      <div class="section-heading">
        <div>
          <p class="section-index">05 / WHERE IT FITS</p>
          <h2 id="scenarios-title">谁会立刻受益，谁需要再想一步</h2>
        </div>
        <span class="evidence-tag tag-suggestion">研究判断</span>
      </div>
      <div class="scenario-grid">
        ${scenarios.map((scenario, index) => `
          <article class="scenario-card scenario-${scenario.tone}">
            <div class="scenario-top"><span>0${index + 1}</span><span class="fit-marker">${scenario.marker}</span></div>
            <h3>${scenario.title}</h3>
            <p>${scenario.description}</p>
            <ul>${scenario.examples.map((item) => `<li>${item}</li>`).join('')}</ul>
          </article>
        `).join('')}
      </div>
      <div class="decision-strip">
        <p><strong>快速判断：</strong>你的正文是否主要来自 Markdown？是否反复做卡片与长文？是否接受在发布前人工确认？</p>
        <span>三个“是”，它大概率有直接价值。</span>
      </div>
    </section>

    <section class="roadmap-section" id="roadmap" aria-labelledby="roadmap-title">
      <div class="section-heading">
        <div>
          <p class="section-index">06 / EXTENSION MAP</p>
          <h2 id="roadmap-title">扩展不是堆功能，而是先建立可演进的边界</h2>
        </div>
        <span class="evidence-tag tag-suggestion">扩展建议</span>
      </div>
      <div class="roadmap-list">
        ${roadmap.map((item, index) => `
          <article class="roadmap-item">
            <div class="roadmap-rail"><span>0${index + 1}</span><i></i></div>
            <div class="roadmap-body">
              <p class="roadmap-phase">${item.phase}</p>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
            </div>
            <ul>${item.items.map((entry) => `<li>${entry}</li>`).join('')}</ul>
            <p class="roadmap-value"><span>价值</span>${item.value}</p>
          </article>
        `).join('')}
      </div>
      <aside class="architecture-note">
        <div>
          <p class="section-index">RECOMMENDED SHAPE</p>
          <h3>建议的扩展骨架</h3>
        </div>
        <div class="architecture-flow" role="group" aria-label="建议架构：输入适配器到统一内容模型，再到平台渲染器与交付适配器">
          <span>输入适配器</span><i>→</i><strong>统一内容模型</strong><i>→</i><span>平台渲染器</span><i>→</i><span>交付适配器</span>
        </div>
        <p>把 AI、CLI、桌面端和新平台放在边界层，避免继续把所有状态与逻辑堆进同一个前端入口。</p>
      </aside>
    </section>

    <section class="evidence-section" id="evidence" aria-labelledby="evidence-title">
      <div class="section-heading">
        <div>
          <p class="section-index">07 / EVIDENCE LEDGER</p>
          <h2 id="evidence-title">结论从哪里来，哪里仍然未知</h2>
        </div>
        <p>这里把上游事实、浏览器验证、教学模拟和未实测边界分开，方便复核，也避免把推断写成事实。</p>
      </div>
      <div class="evidence-grid">
        ${evidenceLedger.map((item, index) => `
          <article class="evidence-card">
            <div class="evidence-card-top">
              <span class="evidence-card-number">0${index + 1}</span>
              <span class="evidence-tag tag-${item.tone}">${item.status}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <span class="evidence-meta">${item.meta}</span>
          </article>
        `).join('')}
      </div>
      <div class="evidence-actions">
        <div>
          <strong>复核入口</strong>
          <p>固定提交让文档、源码与许可证处于同一个时间切片。</p>
        </div>
        <a href="https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e" target="_blank" rel="noreferrer">打开固定版本 <span aria-hidden="true">↗</span></a>
        <a href="https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/LICENSE" target="_blank" rel="noreferrer">核对许可证 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section class="verdict-section" id="verdict" aria-labelledby="verdict-title">
      <p class="section-index">08 / VERDICT</p>
      <div class="verdict-grid">
        <h2 id="verdict-title">值得用，也值得研究；<br /><em>但不宜不加判断地拿来商业化。</em></h2>
        <div>
          <p>对 Markdown / Obsidian 创作者，它是直接可感知的效率工具；对产品与开发者，它展示了“单一内容源、多输出渲染器、本地优先媒体处理”的清晰范式。</p>
          <a class="primary-link" href="https://github.com/fxyadela/write-then-publish" target="_blank" rel="noreferrer">查看上游仓库 <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div><strong>W→P 独立研究档案</strong><p>研究整理 + 交互 Demo · 非上游官方项目</p></div>
    <p>事实基线：固定提交 7a70831 · 2026-08-31<br />研究页更新：2026-09-01</p>
    <a href="#top">回到顶部 ↑</a>
  </footer>
`

const markdownInput = document.querySelector('#markdown-input')
const cardDeck = document.querySelector('#card-deck')
const articlePreview = document.querySelector('#wechat-article')
const labStatus = document.querySelector('#lab-status')
const pageCount = document.querySelector('#page-count')
const charCount = document.querySelector('#char-count')
const previewStage = document.querySelector('#preview-stage')
const themeToggle = document.querySelector('.theme-toggle')
let liveUpdateTimer
let inputRenderTimer
let resizeTimer

markdownInput.value = state.content
renderOutputs(false)
renderStep(0, false)
syncThemeControl()

markdownInput.addEventListener('input', () => {
  state.content = markdownInput.value
  window.clearTimeout(inputRenderTimer)
  inputRenderTimer = window.setTimeout(() => renderOutputs(true), 90)
})

document.querySelector('#restore-sample').addEventListener('click', () => {
  state.content = SAMPLE_MARKDOWN
  markdownInput.value = state.content
  renderOutputs(false)
  labStatus.textContent = '示例已恢复，卡片与长文已同步更新。'
  markdownInput.focus()
})

document.querySelectorAll('.view-switcher [data-focus]').forEach((button) => {
  button.addEventListener('click', () => {
    state.focus = button.dataset.focus
    previewStage.dataset.focus = state.focus
    document.querySelectorAll('.view-switcher [data-focus]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button))
    })
    if (state.focus !== 'article') renderOutputs(false)
    const labels = { split: '并排预览', cards: '卡片聚焦', article: '长文聚焦' }
    labStatus.textContent = `已切换为${labels[state.focus]}。`
  })
})

window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    if (state.focus !== 'article') renderOutputs(false)
  }, 160)
})

themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = state.theme
  document.documentElement.style.colorScheme = state.theme
  syncThemeControl()
  try {
    localStorage.setItem('wtp-lab-theme', state.theme)
  } catch {
    // Theme remains usable when storage is unavailable.
  }
  labStatus.textContent = `已切换为${state.theme === 'dark' ? '深色' : '浅色'}主题。`
})

document.querySelectorAll('.pipeline-tab').forEach((button) => {
  button.addEventListener('click', () => renderStep(Number(button.dataset.step)))
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const last = pipelineSteps.length - 1
    const current = Number(button.dataset.step)
    let next = current
    if (event.key === 'ArrowRight') next = current === last ? 0 : current + 1
    if (event.key === 'ArrowLeft') next = current === 0 ? last : current - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    renderStep(next)
    document.querySelector(`[data-step="${next}"]`).focus()
  })
})

document.querySelector('#prev-step').addEventListener('click', () => {
  renderStep(state.step === 0 ? pipelineSteps.length - 1 : state.step - 1)
})

document.querySelector('#next-step').addEventListener('click', () => {
  renderStep(state.step === pipelineSteps.length - 1 ? 0 : state.step + 1)
})

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('wtp-lab-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Fall back to the operating system preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function syncThemeControl() {
  const isDark = state.theme === 'dark'
  themeToggle.setAttribute('aria-pressed', String(isDark))
  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute('content', isDark ? '#111513' : '#f3f0e9')
}

function renderOutputs(announce = false) {
  const blocks = parseMarkdown(state.content)
  const pages = fitCardPages(paginateBlocks(blocks))
  articlePreview.replaceChildren(...blocks.map(createBlockElement))

  if (blocks.length === 0) {
    cardDeck.append(createEmptyState('开始输入后，卡片会在这里自动分页。'))
    articlePreview.append(createEmptyState('开始输入后，长文会在这里连续排版。'))
  }

  const visiblePages = Math.max(pages.length, blocks.length ? 1 : 0)
  pageCount.textContent = String(visiblePages).padStart(2, '0')
  charCount.textContent = String(state.content.replace(/\s/g, '').length)

  if (announce) {
    window.clearTimeout(liveUpdateTimer)
    liveUpdateTimer = window.setTimeout(() => {
      const scrollFallback = cardDeck.querySelector('[data-scroll-fallback]')
      labStatus.textContent = scrollFallback
        ? `正文已同步；当前卡片 ${visiblePages} 页，极长内容页已启用页内滚动。`
        : `正文已同步，两种输出已更新；当前卡片 ${visiblePages} 页。`
    }, 320)
  }
}

function fitCardPages(initialPages) {
  const pages = initialPages.map((page) => [...page])
  const renderCards = () => {
    cardDeck.replaceChildren(...pages.map((page, index) => createCard(page, index, pages.length)))
  }

  renderCards()
  if (!pages.length || state.focus === 'article') return pages

  for (let pass = 0; pass < 120; pass += 1) {
    const bodies = [...cardDeck.querySelectorAll('.content-card-body')]
    const overflowIndex = bodies.findIndex((body) => body.clientHeight > 0 && body.scrollHeight > body.clientHeight + 1)
    if (overflowIndex === -1) break

    const page = pages[overflowIndex]
    if (page.length > 1) {
      const movedBlock = page.pop()
      if (pages[overflowIndex + 1]) pages[overflowIndex + 1].unshift(movedBlock)
      else pages.push([movedBlock])
    } else {
      const split = splitCardBlock(page[0])
      if (!split) break
      pages.splice(overflowIndex, 1, [split[0]], [split[1]])
    }
    renderCards()
  }

  ;[...cardDeck.querySelectorAll('.content-card-body')]
    .filter((body) => body.clientHeight > 0 && body.scrollHeight > body.clientHeight + 1)
    .forEach((body, index) => {
      body.dataset.scrollFallback = 'true'
      body.tabIndex = 0
      body.setAttribute('aria-label', `极长内容页 ${index + 1}，可滚动浏览`)
    })

  return pages
}

function splitCardBlock(block) {
  if (block.type === 'list') {
    if (block.items.length > 1) {
      const midpoint = Math.ceil(block.items.length / 2)
      return [
        { ...block, items: block.items.slice(0, midpoint) },
        { ...block, items: block.items.slice(midpoint) },
      ]
    }
    const parts = splitTextNearMiddle(block.items[0] || '')
    return parts ? [{ ...block, items: [parts[0]] }, { ...block, items: [parts[1]] }] : null
  }

  const parts = splitTextNearMiddle(block.text || '')
  if (!parts) return null
  const continuationType = /^h[1-3]$/.test(block.type) ? 'paragraph' : block.type
  return [{ ...block, text: parts[0] }, { ...block, type: continuationType, text: parts[1] }]
}

function splitTextNearMiddle(text) {
  const value = text.trim()
  if (value.length < 2) return null

  const graphemes = segmentGraphemes(value)
  if (graphemes.length < 2) return null

  const midpoint = Math.floor(graphemes.length / 2)
  const lowerBound = Math.floor(graphemes.length * 0.3)
  const upperBound = Math.ceil(graphemes.length * 0.7)
  const boundaries = /[。！？；，、,.!?;\s]/
  let cutIndex = graphemes[midpoint].index

  for (let offset = 0; offset <= upperBound - lowerBound; offset += 1) {
    const after = midpoint + offset
    const before = midpoint - offset
    if (after < upperBound && boundaries.test(graphemes[after].segment)) {
      cutIndex = graphemes[after].index + graphemes[after].segment.length
      break
    }
    if (before > lowerBound && boundaries.test(graphemes[before].segment)) {
      cutIndex = graphemes[before].index + graphemes[before].segment.length
      break
    }
  }

  if (value[cutIndex - 1] === '*' && value[cutIndex] === '*') cutIndex += 1

  let first = value.slice(0, cutIndex).trim()
  let second = value.slice(cutIndex).trim()
  const totalBoldMarkers = (value.match(/\*\*/g) || []).length
  const openBoldMarkers = (value.slice(0, cutIndex).match(/\*\*/g) || []).length
  if (totalBoldMarkers % 2 === 0 && openBoldMarkers % 2 === 1) {
    first += '**'
    second = `**${second}`
  }

  return first && second ? [first, second] : null
}

function segmentGraphemes(value) {
  if (typeof Intl?.Segmenter === 'function') {
    return [...new Intl.Segmenter('zh-CN', { granularity: 'grapheme' }).segment(value)]
  }

  let index = 0
  return Array.from(value, (segment) => {
    const item = { segment, index }
    index += segment.length
    return item
  })
}

function parseMarkdown(source) {
  const lines = source.replace(/\r/g, '').split('\n')
  const blocks = []
  let paragraph = []
  let list = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'list', items: [...list] })
      list = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    const listItem = trimmed.match(/^[-*]\s+(.+)$/)
    const quote = trimmed.match(/^>\s?(.+)$/)

    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: `h${heading[1].length}`, text: heading[2] })
    } else if (listItem) {
      flushParagraph()
      list.push(listItem[1])
    } else if (quote) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'quote', text: quote[1] })
    } else {
      flushList()
      paragraph.push(trimmed)
    }
  })

  flushParagraph()
  flushList()
  return blocks
}

function paginateBlocks(blocks) {
  if (!blocks.length) return []
  const budget = 176
  const cardBlocks = blocks.flatMap((block) => splitBlockForEstimatedBudget(block, budget * 0.72))
  const pages = []
  let page = []
  let used = 0

  cardBlocks.forEach((block) => {
    const weight = blockWeight(block)
    if (page.length && used + weight > budget) {
      pages.push(page)
      page = []
      used = 0
    }
    page.push(block)
    used += weight
  })

  if (page.length) pages.push(page)
  return pages
}

function splitBlockForEstimatedBudget(block, targetWeight) {
  const pending = [block]
  const fragments = []

  while (pending.length && fragments.length < 2048) {
    const current = pending.shift()
    if (blockWeight(current) <= targetWeight) {
      fragments.push(current)
      continue
    }

    const split = splitCardBlock(current)
    if (!split) {
      fragments.push(current)
      continue
    }
    pending.unshift(split[0], split[1])
  }

  return [...fragments, ...pending]
}

function blockWeight(block) {
  if (block.type === 'h1') return 52 + block.text.length * 0.45
  if (block.type === 'h2' || block.type === 'h3') return 30 + block.text.length * 0.35
  if (block.type === 'quote') return 30 + block.text.length * 0.82
  if (block.type === 'list') return 26 + block.items.join('').length * 0.82
  return 18 + block.text.length * 0.82
}

function createCard(blocks, index, total) {
  const card = document.createElement('article')
  card.className = 'content-card'
  card.setAttribute('aria-label', `卡片第 ${index + 1} 页，共 ${total} 页`)

  const masthead = document.createElement('div')
  masthead.className = 'content-card-masthead'
  const mark = document.createElement('span')
  mark.textContent = 'W·P'
  const topic = document.createElement('span')
  topic.textContent = index === 0 ? '内容发布札记' : '继续阅读'
  masthead.append(mark, topic)

  const body = document.createElement('div')
  body.className = 'content-card-body'
  body.append(...blocks.map(createBlockElement))

  const footer = document.createElement('div')
  footer.className = 'content-card-footer'
  const line = document.createElement('span')
  const count = document.createElement('span')
  count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  footer.append(line, count)
  card.append(masthead, body, footer)
  return card
}

function createBlockElement(block) {
  if (block.type === 'list') {
    const list = document.createElement('ul')
    block.items.forEach((item) => {
      const li = document.createElement('li')
      li.append(createInlineContent(item))
      list.append(li)
    })
    return list
  }

  const tagMap = { h1: 'h1', h2: 'h2', h3: 'h3', quote: 'blockquote', paragraph: 'p' }
  const element = document.createElement(tagMap[block.type] || 'p')
  element.append(createInlineContent(block.text))
  return element
}

function createInlineContent(text) {
  const fragment = document.createDocumentFragment()
  const pattern = /\*\*(.+?)\*\*/g
  let cursor = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) fragment.append(document.createTextNode(text.slice(cursor, match.index)))
    const strong = document.createElement('strong')
    strong.textContent = match[1]
    fragment.append(strong)
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)))
  return fragment
}

function createEmptyState(message) {
  const empty = document.createElement('p')
  empty.className = 'preview-empty'
  empty.textContent = message
  return empty
}

function renderStep(nextIndex, announce = true) {
  state.step = nextIndex
  const step = pipelineSteps[nextIndex]
  document.querySelectorAll('.pipeline-tab').forEach((button, index) => {
    const active = index === nextIndex
    button.setAttribute('aria-selected', String(active))
    button.tabIndex = active ? 0 : -1
  })

  const panel = document.querySelector('#step-panel')
  panel.setAttribute('aria-labelledby', `step-tab-${nextIndex}`)
  document.querySelector('#step-overline').textContent = `STEP ${String(nextIndex + 1).padStart(2, '0')} / ${step.short}`
  document.querySelector('#step-title').textContent = step.title
  document.querySelector('#step-summary').textContent = step.summary
  document.querySelector('#step-detail').textContent = step.detail
  document.querySelector('#step-code').textContent = step.code
  document.querySelector('#step-output').textContent = step.output
  document.querySelector('#step-current').textContent = String(nextIndex + 1)
  document.querySelector('#visual-step-label').textContent = `STEP ${String(nextIndex + 1).padStart(2, '0')} · ${step.short.toUpperCase()}`
  document.querySelector('.pipeline-visual').style.setProperty('--step-progress', `${(nextIndex / (pipelineSteps.length - 1)) * 100}%`)

  const evidence = document.querySelector('#step-evidence')
  evidence.textContent = step.label
  evidence.className = `evidence-tag tag-${step.tone}`
  if (announce) document.querySelector('#pipeline-status').textContent = `原理步骤 ${nextIndex + 1} / ${pipelineSteps.length}：${step.title}`
}
