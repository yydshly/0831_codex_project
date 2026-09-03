import './styles.css'

const app = document.querySelector('#app')
const surface = document.body.dataset.surface || 'home'
const appUrl = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const statusLabels = {
  available: ['已实现', '可直接运行'],
  foundation: ['底座可用', '场景能力未完整'],
  planned: ['后期扩展', '尚未接入模型'],
}

const photoScenarios = [
  {
    id: 'headshot',
    recommended: true,
    title: '企业职业头像',
    audience: '员工、求职者、专业服务人员',
    value: '普通单人照片进入人脸检测、皮肤增强、补光、克制几何、裁切、对比与导出。',
    output: '可审核的标准人像 PNG',
    reason: '输入和输出最清楚，现有单人人像能力已经形成完整闭环，是照片产品最适合先落地的场景。',
    status: 'available',
    route: 'photo-workbench',
    capabilities: ['单人检测与 468 点', '皮肤区域增强', '脸型与构图', '前后对比、撤销、导出'],
  },
  {
    id: 'wedding',
    title: '婚纱与家庭影像',
    audience: '影楼、情侣、家庭相册',
    value: '当前可演示单人人像精修底座；多人选择、逐人参数、婚纱与首饰保护仍需扩展。',
    output: '当前只演示单人底座',
    status: 'foundation',
    route: 'photo-workbench',
    capabilities: ['单人精修可运行', '差异检查与撤销', '多人参数尚未实现', '批量一致性尚未实现'],
  },
  {
    id: 'commerce',
    title: '电商人像处理',
    audience: '服饰、美妆与内容电商',
    value: '当前可演示人物区域处理；商品保护、色彩标准、批处理和审核队列属于产品扩展。',
    output: '当前只演示人像处理底座',
    status: 'foundation',
    route: 'photo-workbench',
    capabilities: ['人物感知与保护', '局部增强与导出', '商品区域保护待接入', '批量工作流待接入'],
  },
  {
    id: 'restoration',
    title: '老照片修复',
    audience: '家庭档案、纪念馆、影像服务',
    value: '需要新增划痕与破损检测、去噪超分、偏色恢复、上色和缺失内容补全模型。',
    output: '规划：恢复结果与推测内容标记',
    status: 'planned',
    modules: ['损伤检测与局部修补', '去噪、去模糊与超分', '褪色校正与可选上色', '生成内容标记与人工确认'],
  },
  {
    id: 'style',
    title: '图片风格处理',
    audience: '写真、营销内容、创作者',
    value: '需要身份保持的图像编辑模型和风格模板，不属于当前轻量磨皮与几何算法。',
    output: '规划：可回退的风格候选图',
    status: 'planned',
    modules: ['身份保持编辑模型', '风格模板与强度控制', '人物/服饰/背景分区', '候选对比与内容溯源'],
  },
]

const videoScenarios = [
  {
    id: 'meeting',
    recommended: true,
    title: '视频会议',
    audience: '日常会议、客户沟通、远程办公',
    value: '暖调会议背景、低强度补光、基础妆容和克制脸型调整组合运行。',
    output: '本地实时预览 + 手动 PNG',
    reason: '当前实时跟踪、补光、基础美颜和背景能力能直接组合，是视频产品最成熟的使用入口。',
    status: 'available',
    route: 'realtime-workbench',
    capabilities: ['人脸检测与连续跟随', '轻度皮肤与补光', '背景替换与稳定合成', '基础妆容与受限捏脸'],
  },
  {
    id: 'interview',
    title: '在线面试',
    audience: '候选人、招聘与职业咨询',
    value: '冷色专业空间、自然妆效、清晰补光与身份保持组合运行。',
    output: '本地实时预览 + 手动 PNG',
    status: 'available',
    route: 'realtime-workbench',
    capabilities: ['清晰补光', '冷光妆效补偿', '专业背景', '轻度几何与安全回退'],
  },
  {
    id: 'teaching',
    title: '远程授课',
    audience: '教师、培训师、知识创作者',
    value: '居家书房、暖色补光与自然妆效组合运行，并关闭脸型调整。',
    output: '本地实时预览 + 手动 PNG',
    status: 'available',
    route: 'realtime-workbench',
    capabilities: ['暖色补光', '自然肤色', '居家书房背景', '几何关闭以保持表达自然'],
  },
]

const shellHeader = (active = '') => `
  <header class="site-header">
    <a class="brand" href="${appUrl('index.html')}" aria-label="RealHuman 场景产品演示中心首页">
      <span>RH</span><div><strong>REALHUMAN</strong><small>SCENARIO PRODUCT CENTER</small></div>
    </a>
    <nav aria-label="产品能力导航">
      <a href="${appUrl('photo.html')}" ${active === 'photo' ? 'aria-current="page"' : ''}>照片能力</a>
      <a href="${appUrl('video.html')}" ${active === 'video' ? 'aria-current="page"' : ''}>视频能力</a>
      <a href="${appUrl('extensions.html')}">扩展能力</a>
    </nav>
    <span class="isolation-badge">INDEPENDENT · R34 ENGINE</span>
  </header>`

function renderHome() {
  app.innerHTML = `
    ${shellHeader()}
    <main id="main-content" class="landing">
      <section class="hero">
        <p class="eyebrow">PRODUCT SCENARIOS / PHOTO + VIDEO</p>
        <h1>不要先问算法。<br><span>先选择你要完成的场景。</span></h1>
        <p>当前产品被明确拆成照片与视频两条链。它们共用人物感知与身份保护底座，但输入、处理时延和最终交付完全不同。</p>
        <div class="archive-note"><i></i><span>旧 R34 已归档且保持不变；本网页位于新的独立项目目录。</span></div>
      </section>
      <section class="lane-grid" aria-label="选择照片或视频能力">
        <a class="lane-card photo-lane" href="${appUrl('photo.html')}">
          <header><span>01 / PHOTO</span><b>离线高质量</b></header>
          <div><p>已有照片</p><h2>照片人像处理</h2><strong>首发推荐：企业职业头像</strong></div>
          <ul><li>当前已实现单人照片增强工作台</li><li>允许更高质量、较长处理时间与人工确认</li><li>老照片和风格化明确进入后期模型线</li></ul>
          <footer><span class="lane-action">从职业头像开始</span><span>→</span></footer>
        </a>
        <a class="lane-card video-lane" href="${appUrl('video.html')}">
          <header><span>02 / VIDEO</span><b>实时低延迟</b></header>
          <div><p>摄像头连续画面</p><h2>实时视频人像</h2><strong>首发推荐：视频会议</strong></div>
          <ul><li>当前已实现本机实时增强工作台</li><li>关键点跟踪、基础妆容、受限捏脸与背景</li><li>不使用生成式模型逐帧重画人物</li></ul>
          <footer><span class="lane-action">从视频会议开始</span><span>→</span></footer>
        </a>
      </section>
      <section class="shared-foundation">
        <p class="eyebrow">SHARED FOUNDATION</p>
        <h2>共享底座，不混淆产品。</h2>
        <div><article><span>01</span><strong>人物感知</strong><p>人脸检测、468 点、人物分割与区域保护。</p></article><article><span>02</span><strong>可控处理</strong><p>参数、回退、差异、撤销和明确的能力状态。</p></article><article><span>03</span><strong>交付边界</strong><p>照片以文件交付；视频以实时画面为目标，会议输出尚未接入。</p></article></div>
      </section>
      <section class="system-map" id="system-map" aria-labelledby="system-map-title">
        <header>
          <div><p class="eyebrow">FULL PRODUCT MAP / LOCAL + GENERATIVE</p><h2 id="system-map-title">一张图理解完整产品。</h2></div>
          <p>本地库负责实时、稳定和确定性处理；生成式大模型负责创造原图没有的内容；产品控制层决定何时调用、改哪里，以及结果是否可以交付。</p>
        </header>
        <div class="system-inputs" aria-label="三类输入">
          <article><span>INPUT 01</span><strong>单张照片</strong><p>允许高质量离线处理与人工确认。</p></article>
          <article><span>INPUT 02</span><strong>摄像头</strong><p>要求低延迟、连续跟踪与动态稳定。</p></article>
          <article><span>INPUT 03</span><strong>已有视频</strong><p>实时底座处理；复杂生成采用离线关键帧链路。</p></article>
        </div>
        <div class="system-arrow" aria-hidden="true"><span>人物、质量与任务分析</span><i>↓</i></div>
        <div class="system-router">
          <span>ROUTER / 我们的产品控制层</span>
          <strong>原像素能完成或要求实时 → 本地引擎；必须创造新内容 → 生成式引擎</strong>
        </div>
        <div class="system-engines">
          <article class="local-engine">
            <header><span>当前核心 · 已实现底座</span><strong>本地人像引擎</strong></header>
            <div><b>识别与跟踪</b><p>人脸、468 点、人物与皮肤分割、摄像头连续跟随。</p></div>
            <div><b>原像素处理</b><p>补光、肤色、磨皮、降噪、局部妆容、裁切与背景。</p></div>
            <div><b>几何处理</b><p>XPADE 类脸宽、下颌、下巴和嘴角调整，不重新生成整张脸。</p></div>
            <footer>优势：低延迟 · 可控 · 可重复 · 可本地运行</footer>
          </article>
          <div class="engine-join" aria-label="两类引擎由产品按需组合"><span>按需组合</span><i>+</i></div>
          <article class="generative-engine">
            <header><span>下一阶段 · 尚未接入</span><strong>生成式大模型</strong></header>
            <div><b>局部内容重建</b><p>闭眼修复、视线修复以及严重破损区域补全。</p></div>
            <div><b>业务内容生成</b><p>换装、复杂发型、专业背景、布光和老照片内容恢复。</p></div>
            <div><b>主要风险</b><p>可能改变人物身份、表情或无关区域，多次结果也可能不同。</p></div>
            <footer>优势：能创造新内容 · 效果上限高 · 适合离线生成</footer>
          </article>
        </div>
        <div class="system-arrow" aria-hidden="true"><span>统一进入产品质量控制</span><i>↓</i></div>
        <div class="system-guard">
          <header><span>CONTROL + QUALITY</span><strong>模型不是直接交付，结果必须经过我们的控制层</strong></header>
          <ol>
            <li><span>01</span><b>场景模板</b><small>固定参数与提示词</small></li>
            <li><span>02</span><b>蒙版限制</b><small>只允许目标区域进入结果</small></li>
            <li><span>03</span><b>身份检查</b><small>五官与人物相似度</small></li>
            <li><span>04</span><b>规格检查</b><small>尺寸、构图和业务规则</small></li>
            <li><span>05</span><b>失败回退</b><small>重试、本地处理或人工确认</small></li>
          </ol>
          <p><code>最终像素 = 原图 ×（1 − 蒙版）+ 处理结果 × 蒙版</code><span>模型越界修改的区域由本地合成强制恢复为原图。</span></p>
        </div>
        <div class="system-arrow" aria-hidden="true"><span>按真实业务交付</span><i>↓</i></div>
        <div class="system-products" aria-label="产品场景">
          <article><span>照片</span><strong>企业职业头像</strong></article>
          <article><span>照片</span><strong>证件照候选</strong></article>
          <article><span>照片</span><strong>婚纱与电商人像</strong></article>
          <article><span>修复</span><strong>老照片恢复</strong></article>
          <article><span>实时</span><strong>视频会议与直播</strong></article>
        </div>
        <footer class="system-conclusion"><strong>项目价值</strong><p>不是整理一组提示词，而是把本地确定性能力与生成式能力组合成可实时、可控、可验证、可批量交付的人像产品。</p></footer>
      </section>
    </main>`
}

function scenarioCard(scenario) {
  const [label, detail] = statusLabels[scenario.status]
  return `<button class="scenario-card" type="button" data-scenario="${scenario.id}" data-status="${scenario.status}" aria-pressed="false">
    <span class="scenario-card-top"><span class="scenario-status"><i></i>${label}</span>${scenario.recommended ? '<b class="recommended-badge">首发推荐</b>' : ''}</span>
    <strong>${scenario.title}</strong>
    <small>${scenario.audience}</small>
    <p>${scenario.value}</p>
    <b>${detail}</b>
  </button>`
}

function roadmapCard(scenario, index) {
  return `<article class="roadmap-card">
    <header><span>0${index + 1}</span><b>${statusLabels[scenario.status][0]}</b></header>
    <h3>${scenario.title}</h3>
    <p>${scenario.value}</p>
    <ul>${scenario.modules.map((item) => `<li>${item}</li>`).join('')}</ul>
    <footer>${scenario.output}</footer>
  </article>`
}

function roadmapPanel(scenarios) {
  if (!scenarios.length) return ''
  return `<details class="roadmap-panel">
    <summary><span><i>03</i><strong>后期产品方向</strong></span><b>${scenarios.length} 项路线</b></summary>
    <div class="roadmap-panel-copy">复用当前人物底座，但需要新增专用模型与交付流程；以下内容不是当前已实现按钮。</div>
    <div class="roadmap-panel-list">${scenarios.map(roadmapCard).join('')}</div>
  </details>`
}

function renderWorkbench(type) {
  const isPhoto = type === 'photo'
  const scenarios = isPhoto ? photoScenarios : videoScenarios
  const liveScenarios = scenarios.filter(({ status }) => status !== 'planned')
  const roadmapScenarios = scenarios.filter(({ status }) => status === 'planned')
  const copy = isPhoto ? {
    eyebrow: 'PHOTO PRODUCT / OFFLINE QUALITY',
    title: '从企业职业头像开始',
    description: '先用一张单人照片跑通检测、增强、构图、对比和导出；婚纱、电商与生成式修复沿同一底座逐步扩展。',
    recommendation: '照片首发产品',
  } : {
    eyebrow: 'VIDEO PRODUCT / REALTIME EXPERIENCE',
    title: '从视频会议开始',
    description: '摄像头画面持续处理，优先低延迟、动态稳定和安全回退；会议能力成熟后再复用到面试与授课。',
    recommendation: '视频首发产品',
  }
  app.innerHTML = `
    ${shellHeader(type)}
    <main id="main-content" class="workspace" data-workspace="${type}">
      <section class="workspace-intro">
        <div><p class="eyebrow">${copy.eyebrow}</p><h1>${copy.title}</h1></div>
        <div class="intro-guidance"><span>${copy.recommendation}</span><p>${copy.description}</p></div>
      </section>
      <div class="workspace-grid">
        <aside class="scenario-panel" aria-label="${isPhoto ? '照片' : '视频'}业务场景">
          <header><span>01 / RECOMMENDED SCENARIOS</span><strong>按真实用途体验</strong><p>首项是当前最适合落地的产品入口，其他项目展示同一底座如何复用。</p></header>
          <div class="scenario-list">${liveScenarios.map(scenarioCard).join('')}</div>
          ${roadmapPanel(roadmapScenarios)}
          <footer><a href="${appUrl('index.html')}">← 返回能力总览</a><p>薄荷色为完整可运行；琥珀色表示只有共享底座，不能冒充完整场景产品。</p></footer>
        </aside>
        <section class="capability-stage" id="capability-stage" aria-live="polite">
          <header>
            <div><span id="stage-kicker">02 / LIVE CAPABILITY</span><h2 id="stage-title">正在载入推荐场景</h2></div>
            <div class="stage-actions"><span id="stage-state">WAITING</span><button id="fullscreen-stage" data-fullscreen-stage type="button" aria-pressed="false">全屏演示 ⛶</button><a id="open-engine" href="${appUrl('engine/r34/index.html')}" target="_blank" rel="noreferrer">独立打开 ↗</a></div>
          </header>
          <section class="stage-summary" id="stage-summary"></section>
          <div class="engine-shell" id="engine-shell" hidden>
            <div class="engine-loading" id="engine-loading"><i></i><span>正在载入 R34 冻结能力引擎</span></div>
            <iframe id="capability-engine" title="R34 冻结能力工作台" allow="camera" loading="eager"></iframe>
          </div>
          <footer class="stage-boundary" id="stage-boundary"></footer>
        </section>
      </div>
    </main>`

  const cards = [...document.querySelectorAll('[data-scenario]')]
  cards.forEach((card) => card.addEventListener('click', () => selectScenario(type, scenarios.find(({ id }) => id === card.dataset.scenario))))
  setupStageFullscreen()
  selectScenario(type, liveScenarios[0])
}

function setupStageFullscreen() {
  const stage = document.querySelector('#capability-stage')
  const button = document.querySelector('#fullscreen-stage')
  if (!stage || !button) return

  const sync = () => {
    const active = document.fullscreenElement === stage || stage.classList.contains('stage-expanded')
    button.setAttribute('aria-pressed', String(active))
    button.textContent = active ? '退出全屏 ×' : '全屏演示 ⛶'
    document.body.classList.toggle('stage-expanded-open', stage.classList.contains('stage-expanded'))
  }

  const leaveFallback = () => {
    if (!stage.classList.contains('stage-expanded')) return
    stage.classList.remove('stage-expanded')
    sync()
    button.focus()
  }

  button.addEventListener('click', async () => {
    if (document.fullscreenElement === stage) {
      await document.exitFullscreen()
      return
    }
    if (stage.classList.contains('stage-expanded')) {
      leaveFallback()
      return
    }
    try {
      if (!stage.requestFullscreen) throw new Error('Fullscreen API unavailable')
      await stage.requestFullscreen()
    } catch {
      stage.classList.add('stage-expanded')
      sync()
    }
  })
  let nativeWasActive = false
  document.addEventListener('fullscreenchange', () => {
    const nativeActive = document.fullscreenElement === stage
    const returning = nativeWasActive && !nativeActive
    nativeWasActive = nativeActive
    sync()
    if (returning) button.focus()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') leaveFallback()
  })
  sync()
}

let engineLoadRevision = 0

function selectScenario(type, scenario) {
  if (!scenario) return
  document.querySelectorAll('[data-scenario]').forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.scenario === scenario.id)))
  const [statusLabel, statusDetail] = statusLabels[scenario.status]
  document.querySelector('#stage-title').textContent = scenario.title
  document.querySelector('#stage-state').textContent = `${statusLabel} · ${statusDetail}`
  document.querySelector('#stage-state').dataset.status = scenario.status
  document.querySelector('#stage-summary').innerHTML = `<div><span>业务目标</span><strong>${scenario.value}</strong></div><div><span>当前输出</span><strong>${scenario.output}</strong></div><ul>${(scenario.capabilities || scenario.modules).map((item) => `<li>${item}</li>`).join('')}</ul>`
  const engineShell = document.querySelector('#engine-shell')
  const boundary = document.querySelector('#stage-boundary')
  const openEngine = document.querySelector('#open-engine')
  engineShell.hidden = false
  openEngine.hidden = false
  const route = scenario.route
  const engineUrl = appUrl(`engine/r34/index.html#${route}`)
  openEngine.href = engineUrl
  boundary.innerHTML = scenario.status === 'available'
    ? `<b>真实运行</b><p>下方是归档前的 R34 真实能力，不是效果图。${scenario.reason || ''} ${type === 'video' ? '当前仍为本地预览与 PNG，不是会议软件虚拟摄像头。' : '照片由用户本地选择，处理结果不上传。'}</p>`
    : `<b>运行边界</b><p>下方只证明共享的单人人像底座；${scenario.title}所需的场景专属能力尚未完成，不能按完整产品交付。</p>`
  loadEngine(type, scenario, engineUrl)
}

function loadEngine(type, scenario, engineUrl) {
  const iframe = document.querySelector('#capability-engine')
  const loading = document.querySelector('#engine-loading')
  const revision = ++engineLoadRevision
  loading.hidden = false
  loading.querySelector('span').textContent = '正在载入 R34 冻结能力引擎'

  const alignWorkbench = () => {
    if (revision !== engineLoadRevision) return
    try {
      const doc = iframe.contentDocument
      const view = iframe.contentWindow
      const target = doc?.querySelector(type === 'photo' ? '.photo-workspace' : '.realtime-workspace')
      if (!doc || !view || !target) return
      const previousBehavior = doc.documentElement.style.scrollBehavior
      doc.documentElement.style.scrollBehavior = 'auto'
      view.scrollTo(0, target.getBoundingClientRect().top + view.scrollY)
      window.setTimeout(() => {
        doc.documentElement.style.scrollBehavior = previousBehavior
      }, 40)
    } catch {}
  }

  const settleWorkbench = () => {
    alignWorkbench()
    window.setTimeout(alignWorkbench, 180)
    window.setTimeout(alignWorkbench, 700)
  }

  const activate = () => {
    if (revision !== engineLoadRevision) return
    if (type !== 'video') {
      settleWorkbench()
      loading.hidden = true
      return
    }
    let attempts = 0
    const tryActivate = () => {
      if (revision !== engineLoadRevision) return
      attempts += 1
      try {
        const button = iframe.contentDocument?.querySelector(`[data-realtime-scenario="${scenario.id}"]`)
        if (button && !button.disabled) {
          button.click()
          if (button.getAttribute('aria-pressed') === 'true') {
            settleWorkbench()
            loading.hidden = true
            return
          }
        }
      } catch {}
      if (attempts < 30) window.setTimeout(tryActivate, 150)
      else {
        loading.querySelector('span').textContent = '工作台已载入，请在内部选择对应场景'
      }
    }
    tryActivate()
  }

  const currentPath = (() => {
    try { return new URL(iframe.src).pathname } catch { return '' }
  })()
  iframe.onload = activate
  if (currentPath.endsWith('/engine/r34/index.html')) {
    iframe.contentWindow?.location.replace(engineUrl)
    window.setTimeout(activate, 50)
  } else {
    iframe.src = engineUrl
  }
}

if (surface === 'home') renderHome()
else renderWorkbench(surface)
