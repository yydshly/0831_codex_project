import './styles.css'

const STORAGE_KEY = 'xpade-face-liquify-lab:v1'
const HEADSHOT_STORAGE_KEY = 'xpade-enterprise-headshot-demo:v1'
const PHOTO_CASE_STORAGE_KEY = 'xpade-photo-case-gallery:v1'
const photoCaseAsset = (fileName) => `${import.meta.env.BASE_URL}assets/photo-cases/${fileName}`

const DEFAULT_STATE = Object.freeze({
  eyeSize: 0,
  eyeDistance: 0,
  noseWidth: 0,
  mouthCorner: 0,
  faceWidth: 0,
  jaw: 0,
  mesh: true,
  step: 0,
})

const HEADSHOT_DEFAULT_STATE = Object.freeze({
  stage: 'ready',
  template: 'navy',
  retouch: 0,
  light: 0,
  geometry: true,
})

const HEADSHOT_STAGES = ['ready', 'result', 'confirmed', 'approved']

const headshotTemplates = {
  navy: {
    label: '企业蓝',
    from: '#0b2746',
    to: '#2f6283',
    halo: '#78b7d4',
    suit: '#10283d',
    accent: '#66b5d2',
  },
  gray: {
    label: '中性灰',
    from: '#303637',
    to: '#777c79',
    halo: '#c4cbc5',
    suit: '#232a2c',
    accent: '#aab5b0',
  },
  ivory: {
    label: '暖白',
    from: '#d9d1c2',
    to: '#f2eee5',
    halo: '#ffffff',
    suit: '#36424a',
    accent: '#c9985f',
  },
}

const photoCases = {
  enterprise: {
    short: '企业头像',
    code: 'HR / BRAND',
    title: '员工随拍 → 企业职业头像',
    audience: '企业 HR、品牌部门、连锁门店',
    before: photoCaseAsset('enterprise-before.webp'),
    after: photoCaseAsset('enterprise-after.webp'),
    beforeIssue: '背景、光线和着装缺少统一标准，不适合直接进入企业通讯录与官网。',
    result: '统一裁切、品牌背景、补光与职业着装，保留人物身份和自然皮肤质感。',
    value: '减少集中拍摄与逐张人工修图，让新员工更快获得一致的品牌形象资产。',
    boundary: 'XPADE 只负责可选的局部几何微调；质检、皮肤、背景、着装和审批都需要独立能力。',
    layers: [
      ['产品层', '质量检测'], ['产品层', '自然修饰'], ['产品层', '背景与着装'], ['XPADE', '轻度塑形（可选）'],
    ],
  },
  resume: {
    short: '简历求职',
    code: 'CAREER / CV',
    title: '居家自拍 → 自然简历照',
    audience: '求职者、招聘平台、职业服务机构',
    before: photoCaseAsset('resume-before.webp'),
    after: photoCaseAsset('resume-after.webp'),
    beforeIssue: '自拍透视明显、面部阴影重，尺寸、背景和着装不符合常见投递场景。',
    result: '校正构图与曝光，保留本人特征，形成中性、克制、可直接使用的求职头像。',
    value: '不预约影楼，也能快速获得低成本、多规格的专业照片。',
    boundary: '不能用于招聘评分或身份判断；严重模糊、遮挡与极端角度仍需提示用户重拍。',
    layers: [
      ['产品层', '智能裁切'], ['产品层', '曝光校正'], ['产品层', '背景规范'], ['XPADE', '比例微调（可选）'],
    ],
  },
  video: {
    short: '视频形象',
    code: 'LIVE / MEETING',
    title: '低光画面 → 稳定会议形象',
    audience: '会议软件、直播平台、在线教育',
    before: photoCaseAsset('video-before.webp'),
    after: photoCaseAsset('video-after.webp'),
    beforeIssue: '低光、白平衡偏差、噪点和复杂背景会削弱画面的专业感。',
    result: '单帧示意补光、清晰增强、自然美颜与背景虚化后的目标观感。',
    value: '把稳定的人像增强能力嵌入会议或直播 SDK，提升持续观看体验。',
    boundary: '这组静态对照只能说明单帧视觉意向，不能证明帧间稳定、防抖、延迟或设备性能。',
    layers: [
      ['产品层', '人脸跟踪'], ['产品层', '光照稳定'], ['产品层', '背景分割'], ['视频层', '时序防抖'],
    ],
  },
  ecommerce: {
    short: '电商人像',
    code: 'COMMERCE / QC',
    title: '现场模特照 → 电商标准图',
    audience: '电商平台、服饰品牌、摄影棚、MCN',
    before: photoCaseAsset('ecommerce-before.webp'),
    after: photoCaseAsset('ecommerce-after.webp'),
    beforeIssue: '不同批次图片的背景、色温和构图不一致，逐张精修会拖慢商品上架。',
    result: '批量统一背景、光色与构图，同时尽量保护服饰纹理、版型和真实颜色。',
    value: '缩短上架周期、降低单图成本，并建立可复用的商品视觉规范。',
    boundary: '不得改变商品颜色、材质或版型；生成式修复必须配合差异检测和人工抽检。',
    layers: [
      ['产品层', '人像分割'], ['产品层', '商品保护'], ['产品层', '批量质检'], ['产品层', '色彩一致'],
    ],
  },
  makeup: {
    short: '虚拟试妆',
    code: 'BEAUTY / AR',
    title: '素颜参考 → 克制妆容预览',
    audience: '美妆品牌、电商平台、线下门店',
    before: photoCaseAsset('makeup-before.webp'),
    after: photoCaseAsset('makeup-after.webp'),
    beforeIssue: '色卡无法直观说明口红、眼妆和腮红在本人肤色与当前光线下的效果。',
    result: '在人脸语义区域内叠加自然妆效，保留五官、皮肤纹理和真实表情。',
    value: '降低试用门槛和样品成本，帮助用户在购买前快速比较妆容方案。',
    boundary: '视觉预览不等于真实上妆保证；色号、材质与相机色彩必须经过专门校准。',
    layers: [
      ['产品层', '五官分割'], ['产品层', '妆效渲染'], ['产品层', '肤色适配'], ['产品层', '实时试色'],
    ],
  },
  creator: {
    short: '创作者',
    code: 'CREATOR / SOCIAL',
    title: '公共场景随拍 → 品牌形象照',
    audience: '内容创作者、MCN、社交媒体工具',
    before: photoCaseAsset('creator-before.webp'),
    after: photoCaseAsset('creator-after.webp'),
    beforeIssue: '随拍素材的清晰度、背景和频道风格不稳定，多平台裁切也耗费时间。',
    result: '保持人物身份，完成换景、补光、清晰增强与统一调色，并可继续导出多尺寸。',
    value: '提高内容资产生产效率，形成持续一致的个人品牌。',
    boundary: '换景与风格化需要额外生成模型，并必须处理肖像授权、身份偏移和内容合规。',
    layers: [
      ['产品层', '身份保持'], ['产品层', '背景生成'], ['产品层', '清晰增强'], ['产品层', '多尺寸导出'],
    ],
  },
}

const PHOTO_CASE_DEFAULT_STATE = Object.freeze({ id: 'enterprise', reveal: 50 })

const controls = [
  {
    key: 'eyeSize',
    label: '眼睛大小',
    min: -28,
    max: 28,
    hint: '缩放眼眶与虹膜，不改变视线方向',
  },
  {
    key: 'eyeDistance',
    label: '眼距',
    min: -24,
    max: 24,
    hint: '左右眼以鼻梁为中心对称移动',
  },
  {
    key: 'noseWidth',
    label: '鼻宽',
    min: -24,
    max: 24,
    hint: '调整鼻翼锚点的水平距离',
  },
  {
    key: 'mouthCorner',
    label: '嘴角',
    min: -24,
    max: 24,
    hint: '模拟嘴角锚点上提或下压',
  },
  {
    key: 'faceWidth',
    label: '脸宽',
    min: -24,
    max: 24,
    hint: '改变颧骨到脸颊的轮廓宽度',
  },
  {
    key: 'jaw',
    label: '下颌',
    min: -24,
    max: 24,
    hint: '负值收窄，正值放宽下颌线',
  },
]

const steps = [
  {
    eyebrow: 'STEP 01 · INPUT',
    title: '输入与尺度归一化',
    body: '浏览器读取一张照片，保留原始分辨率，同时创建适合检测的缩放副本。方向与色彩空间需要先被统一。',
    signal: '输入：HTMLImageElement / RGBA',
    formula: 'I₀(W × H) → Iᵈ(w × h)',
    note: '原网页已验证会在浏览器中读取图片；本 Demo 没有真实上传入口。',
  },
  {
    eyebrow: 'STEP 02 · LANDMARKS',
    title: '定位 468 个面部关键点',
    body: 'Face Mesh 模型预测轮廓、眼、鼻、唇等拓扑一致的坐标。稳定的点编号让“左嘴角”成为可编程语义。',
    signal: '输出：468 × {x, y, z}',
    formula: 'L = FaceMesh(Iᵈ)',
    note: '页面中的绿色点只是教学抽样，不是假装执行了模型推理。',
  },
  {
    eyebrow: 'STEP 03 · SEMANTICS',
    title: '把滑杆翻译为语义位移',
    body: '每个控件选择一组锚点，并按中心、对称轴和局部方向生成目标坐标。例如调眼距时，两眼朝相反方向移动。',
    signal: '控制：参数 → 锚点位移',
    formula: 'Tᵢ = Lᵢ + Δᵢ(parameter)',
    note: '这一步决定了工具“像整形控件”，而不是自由拖拽画笔。',
  },
  {
    eyebrow: 'STEP 04 · WARP',
    title: 'RBF 插值与面部蒙版',
    body: '径向基函数把稀疏锚点位移扩散为连续形变场；面部蒙版限制影响范围，避免背景和头发被无意拉扯。',
    signal: '输出：连续位移场 + 权重蒙版',
    formula: 'f(p) = p + m(p)Σwᵢφ(‖p − cᵢ‖)',
    note: '本 Demo 直接改 SVG 几何；公式描述的是可用于真实图像的工程路径。',
  },
  {
    eyebrow: 'STEP 05 · RENDER',
    title: '三角网格重采样与导出',
    body: '把原始纹理绑定到稳定拓扑的三角网格，移动顶点后由 GPU 重采样像素，最后按原图尺寸合成并导出。',
    signal: '输出：warped texture → PNG',
    formula: 'UV + T → WebGL raster → PNG(W × H)',
    note: '高质量导出还要处理边缘、纹理拉伸、颜色与 EXIF。',
  },
]

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="回到页面顶部">
      <span class="brand-mark" aria-hidden="true">FL</span>
      <span><strong>FACE LIQUIFY</strong><small>CAPABILITY LAB</small></span>
    </a>
    <nav aria-label="页面导航">
      <a href="#real-cases">写实案例</a>
      <a href="#headshot">职业头像</a>
      <a href="#lab">几何能力</a>
      <a href="#principle">技术原理</a>
    </nav>
    <span class="build-tag">STATIC / LOCAL</span>
  </header>

  <main id="main-content">
    <section class="hero section-shell" id="top" aria-labelledby="page-title">
      <div class="hero-copy">
        <div class="concept-flag"><span aria-hidden="true">◆</span> 写实合成样片 + 可驱动几何演示</div>
        <p class="kicker">XPADE FACE LIQUIFY / CAPABILITY STUDY</p>
        <h1 id="page-title">先看真实照片级效果，<br><em>再拆解能力边界。</em></h1>
        <p class="hero-lede">用六组虚拟人物写实对照看清它能进入哪些产品，再用职业头像流程与语义几何实验台，理解 XPADE 能贡献什么、还缺什么。</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#real-cases">查看六组写实效果 <span aria-hidden="true">↘</span></a>
          <a class="text-link" href="#headshot">体验职业头像流程 <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <aside class="hero-proof" aria-label="研究结论摘要">
        <div class="proof-index">00<span>/07</span></div>
        <p class="proof-label">一句话判断</p>
        <p class="proof-quote">它是“关键点驱动的浏览器人脸液化器”，不是生成式换脸，也不是完整的商业修图台。</p>
        <dl>
          <div><dt>已验证核心</dt><dd>468 点 + 语义滑杆 + 网格形变</dd></div>
          <div><dt>本页呈现</dt><dd>六组预生成写实样片 + 原创 SVG 实验</dd></div>
          <div><dt>数据边界</dt><dd>虚拟人物 · 无上传 · 无后端推理</dd></div>
        </dl>
      </aside>
    </section>

    <section class="photo-cases-section section-shell" id="real-cases" aria-labelledby="photo-cases-title">
      <div class="section-heading photo-cases-heading">
        <div><p class="section-index">01 / PHOTOREALISTIC CASES</p><h2 id="photo-cases-title">六个真实业务场景，直接看前后效果</h2></div>
        <p>选择场景，再拖动分界线。每一组都使用同一位虚拟人物、相近姿态与构图，让差异更容易被判断。</p>
      </div>

      <div class="photo-case-truth-bar" role="note">
        <span>AI 生成虚拟人物</span><span>预生成目标效果</span><span>非运行时 AI</span><span>无真人照片上传</span>
        <strong>这些是产品目标效果的写实场景参考，不是当前网页或 XPADE 库实时处理真人照片的实测结果。</strong>
      </div>

      <div class="photo-case-selector" aria-label="选择写实业务场景">
        ${Object.entries(photoCases).map(([id, item], index) => `
          <button type="button" data-photo-case="${id}" aria-pressed="${index === 0 ? 'true' : 'false'}">
            <span>${String(index + 1).padStart(2, '0')}</span><strong>${item.short}</strong><small>${item.code}</small>
          </button>
        `).join('')}
      </div>

      <div class="photo-case-studio" id="photo-compare" aria-busy="true">
        <figure class="photo-case-figure" aria-labelledby="photo-case-title" aria-describedby="photo-case-description">
          <div class="panel-toolbar">
            <div><span class="status-dot" aria-hidden="true"></span><strong>PRE-GENERATED PHOTO PAIR</strong></div>
            <span class="mode-pill" id="photo-case-mode">处理后 50%</span>
          </div>
          <div class="photo-case-frame" id="photo-case-frame" style="--reveal: 50%;">
            <div class="photo-case-fallback" id="photo-case-fallback" role="img" aria-label="图片暂时无法显示">
              <span aria-hidden="true">IMAGE / OFFLINE</span>
              <strong>写实样片暂时无法载入</strong>
              <small>场景说明与产品边界仍可继续阅读。</small>
            </div>
            <img class="photo-case-image photo-case-before" id="photo-before" alt="" width="760" height="1014" loading="lazy" decoding="async" />
            <div class="photo-case-after-layer">
              <img class="photo-case-image photo-case-after" id="photo-after" alt="" width="760" height="1014" loading="lazy" decoding="async" />
            </div>
            <span class="photo-case-label photo-case-label-after">优化后</span>
            <span class="photo-case-label photo-case-label-before">处理前</span>
            <span class="photo-case-divider" aria-hidden="true"><i></i></span>
            <div class="photo-case-loading" aria-hidden="true"><span></span>正在载入写实样片</div>
          </div>
          <figcaption class="photo-case-controls">
            <button class="photo-case-jump" type="button" data-photo-reveal="0">仅处理前</button>
            <label for="photo-compare-range">
              <span>拖动比较</span>
              <input id="photo-compare-range" type="range" min="0" max="100" value="50" step="1" aria-describedby="photo-case-description" />
            </label>
            <output id="photo-compare-output" for="photo-compare-range">处理后 50% · 处理前 50%</output>
            <button class="photo-case-jump" type="button" data-photo-reveal="100">完整结果</button>
          </figcaption>
        </figure>

        <aside class="photo-case-detail">
          <p class="micro-label" id="photo-case-code">HR / BRAND</p>
          <h3 id="photo-case-title">员工随拍 → 企业职业头像</h3>
          <p class="photo-case-audience"><span>业务对象</span><strong id="photo-case-audience"></strong></p>
          <dl class="photo-case-facts">
            <div><dt>处理前问题</dt><dd id="photo-case-before-copy"></dd></div>
            <div><dt>目标效果</dt><dd id="photo-case-result-copy"></dd></div>
            <div class="is-value"><dt>产品价值</dt><dd id="photo-case-value-copy"></dd></div>
          </dl>
          <div class="photo-case-capabilities">
            <p>能力组合</p>
            <div id="photo-case-tags"></div>
          </div>
          <div class="photo-case-boundary">
            <span>TECH BOUNDARY</span>
            <p id="photo-case-boundary-copy"></p>
          </div>
          <p class="sr-only" id="photo-case-description"></p>
          <p class="photo-case-status" id="photo-case-status" role="status" aria-live="polite">正在载入写实样片</p>
        </aside>
      </div>
      <p class="sr-only" id="photo-case-announcer" aria-live="polite" aria-atomic="true"></p>
    </section>

    <section class="lab-section section-shell" id="lab" aria-labelledby="lab-title">
      <div class="section-heading">
        <div><p class="section-index">02 / CAPABILITY DEMO</p><h2 id="lab-title">语义液化实验台</h2></div>
        <p>这里展示“控件意图 → 几何结果”的关系。矢量肖像与关键点均为原创合成，不代表真实检测精度。</p>
      </div>

      <div class="lab-workspace">
        <div class="portrait-panel">
          <div class="panel-toolbar">
            <div><span class="status-dot" aria-hidden="true"></span><strong>VECTOR OUTPUT</strong></div>
            <span class="mode-pill" id="render-mode">调整后</span>
          </div>
          <div class="portrait-frame" id="portrait" aria-live="off"></div>
          <div class="telemetry" aria-label="当前演示状态">
            <div><span>已调整参数</span><strong id="changed-count">0 / 6</strong></div>
            <div><span>语义网格</span><strong id="mesh-status">显示</strong></div>
            <div><span>状态存储</span><strong id="storage-status">本地</strong></div>
          </div>
        </div>

        <form class="control-panel" id="control-form" aria-labelledby="controls-title">
          <div class="control-head">
            <div><p class="micro-label">SEMANTIC CONTROLS</p><h3 id="controls-title">面部参数</h3></div>
            <span class="parameter-count">06 PARAMETERS</span>
          </div>
          <p class="control-intro">轻微调整更接近真实修图。数值越极端，越容易产生纹理拉伸或背景变形。</p>
          <div class="control-list">
            ${controls.map((control, index) => `
              <div class="range-control">
                <div class="range-label-row">
                  <label for="${control.key}"><span>${String(index + 1).padStart(2, '0')}</span>${control.label}</label>
                  <output id="${control.key}-value" for="${control.key}">0</output>
                </div>
                <input
                  id="${control.key}"
                  name="${control.key}"
                  type="range"
                  min="${control.min}"
                  max="${control.max}"
                  value="0"
                  step="1"
                  aria-describedby="${control.key}-hint"
                />
                <p id="${control.key}-hint">${control.hint}</p>
              </div>
            `).join('')}
          </div>

          <div class="toggle-row">
            <label class="switch-label" for="mesh-toggle">
              <span><strong>显示语义网格</strong><small>观察局部锚点和形变向量</small></span>
              <input id="mesh-toggle" type="checkbox" checked />
              <span class="switch" aria-hidden="true"></span>
            </label>
          </div>

          <div class="control-actions">
            <button class="button compare-button" id="compare-button" type="button" aria-pressed="false">
              <span aria-hidden="true">◉</span> 按住查看原始
            </button>
            <div class="history-actions">
              <button class="icon-button" id="undo-button" type="button" disabled aria-label="撤销上一步" title="撤销">↶</button>
              <button class="icon-button" id="redo-button" type="button" disabled aria-label="重做上一步" title="重做">↷</button>
              <button class="button reset-button" id="reset-button" type="button">重置</button>
            </div>
          </div>
          <p class="save-note"><span aria-hidden="true">✓</span> 参数会保存在当前浏览器；刷新页面后可恢复。</p>
        </form>
      </div>
      <p class="sr-only" id="status-announcer" aria-live="polite" aria-atomic="true"></p>
    </section>

    <section class="headshot-section section-shell" id="headshot" aria-labelledby="headshot-title">
      <div class="section-heading headshot-heading">
        <div><p class="section-index">03 / BUSINESS DEMO</p><h2 id="headshot-title">企业职业头像工作台</h2></div>
        <p>员工使用合成“随手拍”进入流程；页面把背景、构图、光线、轻磨皮与着装组合成职业化结果，并让 XPADE 几何层可以被单独关闭验证。</p>
      </div>

      <div class="headshot-truth-bar" role="note">
        <span>合成示例</span><span>纯前端状态</span><span>无照片上传</span>
        <strong>质检、皮肤、背景、着装和审批均为产品层模拟；几何变化由本页 XPADE 规则真实驱动 SVG。</strong>
      </div>

      <ol class="headshot-steps" aria-label="职业头像流程">
        <li data-headshot-step="0" aria-current="step"><span>01</span><div><strong>随拍质检</strong><small>合成样片通过规则检查</small></div></li>
        <li data-headshot-step="1"><span>02</span><div><strong>企业优化</strong><small>组合视觉规范与几何层</small></div></li>
        <li data-headshot-step="2"><span>03</span><div><strong>员工确认</strong><small>锁定本地结果</small></div></li>
        <li data-headshot-step="3"><span>04</span><div><strong>HR 审核</strong><small>本地模拟批准</small></div></li>
      </ol>

      <div class="headshot-workspace" id="headshot-workspace" aria-busy="false">
        <div class="headshot-preview-panel">
          <div class="panel-toolbar">
            <div><span class="status-dot" aria-hidden="true"></span><strong>BUSINESS OUTPUT / SYNTHETIC</strong></div>
            <span class="mode-pill" id="headshot-view-mode">随拍参考</span>
          </div>
          <div class="headshot-preview" id="headshot-preview" aria-live="off"></div>
          <div class="headshot-preview-footer">
            <button class="button headshot-compare" id="headshot-compare" type="button" aria-pressed="false" disabled>
              <span aria-hidden="true">◉</span> 按住查看随拍
            </button>
            <div class="headshot-output-meta" aria-label="当前输出信息">
              <span>员工编号 <strong>CS-0248</strong></span>
              <span>规范版本 <strong>BRAND v1</strong></span>
            </div>
          </div>
          <div class="headshot-diff-strip" aria-label="职业化效果层">
            <div><span>产品层</span><strong>背景 · 光线 · 皮肤 · 着装</strong></div>
            <div><span>当前库</span><strong id="headshot-geometry-readout">几何层待应用</strong></div>
          </div>
        </div>

        <div class="headshot-console">
          <header class="headshot-console-head">
            <div><p class="micro-label">CHENGCHUAN TECH / PROFILE STANDARD</p><h3 id="headshot-stage-title" tabindex="-1">合成随拍已就绪</h3></div>
            <span class="headshot-stage-badge" id="headshot-stage-badge">READY</span>
          </header>
          <p class="headshot-stage-message" id="headshot-stage-message" role="status" aria-live="polite">静态规则演示显示：单人、近正面、清晰度与无遮挡条件均通过。这里没有运行真实识别模型。</p>

          <div class="quality-card" aria-label="随拍质量检查结果">
            <div class="quality-card-head"><strong>合成样片质检</strong><span>规则模拟 / PASS</span></div>
            <ul>
              <li><span aria-hidden="true">✓</span><div><strong>单人近正面</strong><small>构图可进入头像规范</small></div></li>
              <li><span aria-hidden="true">✓</span><div><strong>基础清晰度</strong><small>教学样片分辨率充足</small></div></li>
              <li><span aria-hidden="true">✓</span><div><strong>面部无遮挡</strong><small>五官区域可用于几何控制</small></div></li>
            </ul>
          </div>

          <button class="button button-primary headshot-generate" id="headshot-generate" type="button">
            一键生成职业头像 <span aria-hidden="true">→</span>
          </button>
          <div class="headshot-processing-track" id="headshot-processing-track" hidden aria-hidden="true">
            <span>构图归一</span><span>企业视觉规范</span><span>XPADE 几何层</span>
          </div>

          <fieldset class="headshot-preset-fieldset" id="headshot-preset-fieldset" disabled>
            <legend>企业背景模板 <small>产品层模拟</small></legend>
            <div class="headshot-presets">
              <label><input type="radio" name="headshot-template" value="navy" checked><span><i class="preset-swatch navy"></i>企业蓝</span></label>
              <label><input type="radio" name="headshot-template" value="gray"><span><i class="preset-swatch gray"></i>中性灰</span></label>
              <label><input type="radio" name="headshot-template" value="ivory"><span><i class="preset-swatch ivory"></i>暖白</span></label>
            </div>
          </fieldset>

          <div class="headshot-adjustments" id="headshot-adjustments" aria-label="职业头像效果控制">
            <div class="range-control compact-range">
              <div class="range-label-row"><label for="headshot-retouch"><span>01</span>轻磨皮 / 瑕疵弱化</label><output id="headshot-retouch-value" for="headshot-retouch">0%</output></div>
              <input id="headshot-retouch" type="range" min="0" max="70" value="0" step="1" disabled aria-describedby="headshot-retouch-hint" />
              <p id="headshot-retouch-hint">只改变合成皮肤纹理层透明度，不代表真实磨皮模型。</p>
            </div>
            <div class="range-control compact-range">
              <div class="range-label-row"><label for="headshot-light"><span>02</span>面部补光</label><output id="headshot-light-value" for="headshot-light">0</output></div>
              <input id="headshot-light" type="range" min="-20" max="50" value="0" step="1" disabled aria-describedby="headshot-light-hint" />
              <p id="headshot-light-hint">控制合成主光和面部阴影，不改变背景模板。</p>
            </div>
            <label class="switch-label headshot-geometry-switch" for="headshot-geometry">
              <span><strong>XPADE 几何微调</strong><small>脸宽 −4 · 下颌 −3 · 嘴角 +3；关闭即可隔离本库贡献</small></span>
              <input id="headshot-geometry" type="checkbox" checked disabled />
              <span class="switch" aria-hidden="true"></span>
            </label>
          </div>

          <div class="headshot-approval-card" id="headshot-approval-card">
            <div><span class="approval-index">03—04</span><p><strong>确认与审核</strong><small id="headshot-approval-note">生成结果后，员工可先确认，再进入 HR 本地审核模拟。</small></p></div>
            <div class="headshot-approval-actions">
              <button class="button" id="headshot-confirm" type="button" disabled>员工确认</button>
              <button class="button button-primary" id="headshot-approve" type="button" disabled>HR 批准</button>
            </div>
          </div>

          <button class="text-button headshot-reset" id="headshot-reset" type="button">重新演示并清除本地流程状态</button>
          <p class="headshot-privacy-note"><span aria-hidden="true">ⓘ</span> 确认与审批只改变当前浏览器中的演示状态，不会发送给 HR、员工系统或服务器。</p>
        </div>
      </div>

      <div class="headshot-ownership" aria-label="职业头像能力归属">
        <article><span class="ownership-tag simulated">产品层模拟</span><strong>照片检查</strong><p>生产版需要质量模型、失败原因与重拍指导；此处只用固定合成样片演示流程。</p></article>
        <article><span class="ownership-tag simulated">产品层模拟</span><strong>背景、光线与皮肤</strong><p>用 SVG 图层真实展示效果变化，但没有接入分割、修复或生成式模型。</p></article>
        <article><span class="ownership-tag current">当前库映射</span><strong>XPADE 几何微调</strong><p>语义参数改变脸宽、下颌与嘴角；可单独关闭，验证它只占最终产品的一层。</p></article>
        <article><span class="ownership-tag simulated">业务层模拟</span><strong>确认与审核</strong><p>演示员工和 HR 的状态闭环；生产版还需身份、权限、审计、存储和通知。</p></article>
      </div>
      <p class="sr-only" id="headshot-announcer" aria-live="polite" aria-atomic="true"></p>
    </section>

    <section class="evidence-section section-shell" id="evidence" aria-labelledby="evidence-title">
      <div class="section-heading evidence-heading">
        <div><p class="section-index">04 / WHAT IT PROVES</p><h2 id="evidence-title">能力、效果与边界</h2></div>
        <div class="legend" aria-label="证据类型">
          <span><i class="dot verified"></i>已验证</span>
          <span><i class="dot simulated"></i>概念模拟</span>
          <span><i class="dot inferred"></i>扩展判断</span>
        </div>
      </div>

      <div class="conclusion-strip">
        <p>产品价值</p>
        <strong>把自由拖拽的修图动作，压缩成低学习成本、可重复的面部语义参数。</strong>
        <span>适合“最后 5%”的人像几何微调</span>
      </div>

      <div class="capability-table" role="table" aria-label="能力对照表">
        <div class="capability-row table-head" role="row">
          <span role="columnheader">能力</span><span role="columnheader">原网页呈现</span><span role="columnheader">本实验台如何说明</span><span role="columnheader">证据</span>
        </div>
        <div class="capability-row" role="row">
          <strong role="cell">单脸结构定位</strong><span role="cell">Face Mesh 识别一张清晰正脸</span><span role="cell">用固定拓扑的教学点集表达结构</span><span role="cell"><i class="dot verified"></i>已验证</span>
        </div>
        <div class="capability-row" role="row">
          <strong role="cell">语义比例调整</strong><span role="cell">眼、鼻、嘴、脸型等参数滑杆</span><span role="cell">六组滑杆实时改变 SVG 几何</span><span role="cell"><i class="dot simulated"></i>概念模拟</span>
        </div>
        <div class="capability-row" role="row">
          <strong role="cell">局部液化反馈</strong><span role="cell">画笔推拉、弱化与网格观察</span><span role="cell">锚点位移与局部影响范围可视化</span><span role="cell"><i class="dot simulated"></i>概念模拟</span>
        </div>
        <div class="capability-row" role="row">
          <strong role="cell">结果对比与导出</strong><span role="cell">原图对比、撤销/重做、PNG 导出</span><span role="cell">按住对比与历史恢复；不伪造图片导出</span><span role="cell"><i class="dot verified"></i>已验证</span>
        </div>
      </div>
    </section>

    <section class="principle-section section-shell" id="principle" aria-labelledby="principle-title">
      <div class="section-heading">
        <div><p class="section-index">05 / TECHNICAL PRINCIPLE</p><h2 id="principle-title">从像素到可导出的网格</h2></div>
        <p>五步不是对上游源码的复刻，而是一条与可见能力相符、可工程落地的技术解释。</p>
      </div>

      <div class="principle-layout">
        <ol class="step-list" aria-label="技术原理步骤">
          ${steps.map((step, index) => `
            <li>
              <button type="button" class="step-button" data-step="${index}" aria-current="${index === 0 ? 'step' : 'false'}">
                <span>${String(index + 1).padStart(2, '0')}</span><strong>${step.title}</strong><i aria-hidden="true">→</i>
              </button>
            </li>
          `).join('')}
        </ol>

        <article class="step-detail" aria-live="polite" aria-atomic="true">
          <div class="pipeline-visual" id="pipeline-visual" aria-hidden="true"></div>
          <div class="step-copy">
            <p class="micro-label" id="step-eyebrow"></p>
            <h3 id="step-title"></h3>
            <p id="step-body"></p>
            <div class="signal-box"><span id="step-signal"></span><code id="step-formula"></code></div>
            <p class="step-note" id="step-note"></p>
          </div>
          <div class="step-nav">
            <span id="step-progress">01 / 05</span>
            <div>
              <button type="button" class="icon-button" id="prev-step" aria-label="上一步">←</button>
              <button type="button" class="button button-primary" id="next-step">下一步 <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="scenario-section section-shell" id="scenarios" aria-labelledby="scenario-title">
      <div class="section-heading">
        <div><p class="section-index">06 / USE CASES</p><h2 id="scenario-title">什么时候有意义？</h2></div>
        <p>判断标准不是“能不能把脸变形”，而是任务是否需要快速、局部、可撤回的几何调整。</p>
      </div>
      <div class="scenario-grid">
        <article class="scenario-column fit">
          <header><span aria-hidden="true">✓</span><div><p>GOOD FIT</p><h3>适合使用</h3></div></header>
          <ul>
            <li><strong>AI 人像收尾</strong><span>修正生成结果中的轻微眼距、下颌或表情问题。</span></li>
            <li><strong>头像与社交图片</strong><span>无需启动重型软件即可做自然比例微调。</span></li>
            <li><strong>产品原型验证</strong><span>快速验证语义修图控件是否易懂、反馈是否及时。</span></li>
            <li><strong>本地隐私工作流</strong><span>模型和形变都在浏览器执行时，可减少原图上传。</span></li>
          </ul>
        </article>
        <article class="scenario-column avoid">
          <header><span aria-hidden="true">×</span><div><p>NOT A FIT</p><h3>不适合使用</h3></div></header>
          <ul>
            <li><strong>商业级精修交付</strong><span>缺少皮肤、光影、色彩、蒙版和无损工程文件。</span></li>
            <li><strong>多人或大角度照片</strong><span>单脸、正面假设会让检测与形变稳定性下降。</span></li>
            <li><strong>身份或医学判断</strong><span>几何美化结果不能用于身份核验、诊断或测量。</span></li>
            <li><strong>大幅结构改造</strong><span>强形变会暴露纹理拉伸、背景弯曲与遮挡错误。</span></li>
          </ul>
        </article>
      </div>
    </section>

    <section class="roadmap-section section-shell" id="roadmap" aria-labelledby="roadmap-title">
      <div class="section-heading roadmap-heading">
        <div><p class="section-index">07 / EXTENSION MAP</p><h2 id="roadmap-title">从工具到产品的扩展路线</h2></div>
        <p>先补齐影响结果可信度的能力，再扩工作流，最后才做生成式与平台化能力。</p>
      </div>
      <div class="roadmap">
        <article>
          <div class="roadmap-phase"><span>NOW</span><strong>01</strong></div>
          <h3>让形变更可信</h3>
          <ul><li>面部与头发分割蒙版</li><li>遮挡感知与背景保护</li><li>极值限制和质量告警</li><li>移动端控件与性能预算</li></ul>
          <p>优先级：结果质量</p>
        </article>
        <article>
          <div class="roadmap-phase"><span>NEXT</span><strong>02</strong></div>
          <h3>补全真实工作流</h3>
          <ul><li>多人脸选择与逐脸编辑</li><li>局部保护笔刷和强度蒙版</li><li>预设、历史快照与批量处理</li><li>高质量导出与元数据策略</li></ul>
          <p>优先级：可用效率</p>
        </article>
        <article>
          <div class="roadmap-phase"><span>LATER</span><strong>03</strong></div>
          <h3>建立差异化能力</h3>
          <ul><li>五官比例智能建议</li><li>视频时序稳定与实时预览</li><li>生成式细节修复</li><li>SDK / API 与创作工具集成</li></ul>
          <p>优先级：产品壁垒</p>
        </article>
      </div>
      <div class="priority-note">
        <span class="priority-icon" aria-hidden="true">!</span>
        <p><strong>最值得先做的不是更多滑杆，而是“保护不该被拉动的区域”。</strong> 蒙版、遮挡和质量告警，会直接决定这个能力能否从玩具走向可靠工具。</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div><strong>FACE LIQUIFY / CAPABILITY LAB</strong><p>原创概念演示 · 无图片上传 · 核心内容离线可用</p></div>
    <a href="#top">回到顶部 <span aria-hidden="true">↑</span></a>
  </footer>
`

const elements = {
  portrait: document.querySelector('#portrait'),
  renderMode: document.querySelector('#render-mode'),
  changedCount: document.querySelector('#changed-count'),
  meshStatus: document.querySelector('#mesh-status'),
  storageStatus: document.querySelector('#storage-status'),
  meshToggle: document.querySelector('#mesh-toggle'),
  compareButton: document.querySelector('#compare-button'),
  undoButton: document.querySelector('#undo-button'),
  redoButton: document.querySelector('#redo-button'),
  resetButton: document.querySelector('#reset-button'),
  announcer: document.querySelector('#status-announcer'),
  stepEyebrow: document.querySelector('#step-eyebrow'),
  stepTitle: document.querySelector('#step-title'),
  stepBody: document.querySelector('#step-body'),
  stepSignal: document.querySelector('#step-signal'),
  stepFormula: document.querySelector('#step-formula'),
  stepNote: document.querySelector('#step-note'),
  stepProgress: document.querySelector('#step-progress'),
  pipelineVisual: document.querySelector('#pipeline-visual'),
  prevStep: document.querySelector('#prev-step'),
  nextStep: document.querySelector('#next-step'),
  photoCompare: document.querySelector('#photo-compare'),
  photoFrame: document.querySelector('#photo-case-frame'),
  photoBefore: document.querySelector('#photo-before'),
  photoAfter: document.querySelector('#photo-after'),
  photoFallback: document.querySelector('#photo-case-fallback'),
  photoMode: document.querySelector('#photo-case-mode'),
  photoRange: document.querySelector('#photo-compare-range'),
  photoOutput: document.querySelector('#photo-compare-output'),
  photoCode: document.querySelector('#photo-case-code'),
  photoTitle: document.querySelector('#photo-case-title'),
  photoAudience: document.querySelector('#photo-case-audience'),
  photoBeforeCopy: document.querySelector('#photo-case-before-copy'),
  photoResultCopy: document.querySelector('#photo-case-result-copy'),
  photoValueCopy: document.querySelector('#photo-case-value-copy'),
  photoTags: document.querySelector('#photo-case-tags'),
  photoBoundaryCopy: document.querySelector('#photo-case-boundary-copy'),
  photoDescription: document.querySelector('#photo-case-description'),
  photoStatus: document.querySelector('#photo-case-status'),
  photoAnnouncer: document.querySelector('#photo-case-announcer'),
  headshotWorkspace: document.querySelector('#headshot-workspace'),
  headshotPreview: document.querySelector('#headshot-preview'),
  headshotViewMode: document.querySelector('#headshot-view-mode'),
  headshotStageTitle: document.querySelector('#headshot-stage-title'),
  headshotStageBadge: document.querySelector('#headshot-stage-badge'),
  headshotStageMessage: document.querySelector('#headshot-stage-message'),
  headshotGenerate: document.querySelector('#headshot-generate'),
  headshotProcessingTrack: document.querySelector('#headshot-processing-track'),
  headshotPresetFieldset: document.querySelector('#headshot-preset-fieldset'),
  headshotRetouch: document.querySelector('#headshot-retouch'),
  headshotRetouchValue: document.querySelector('#headshot-retouch-value'),
  headshotLight: document.querySelector('#headshot-light'),
  headshotLightValue: document.querySelector('#headshot-light-value'),
  headshotGeometry: document.querySelector('#headshot-geometry'),
  headshotGeometryReadout: document.querySelector('#headshot-geometry-readout'),
  headshotCompare: document.querySelector('#headshot-compare'),
  headshotConfirm: document.querySelector('#headshot-confirm'),
  headshotApprove: document.querySelector('#headshot-approve'),
  headshotApprovalCard: document.querySelector('#headshot-approval-card'),
  headshotApprovalNote: document.querySelector('#headshot-approval-note'),
  headshotReset: document.querySelector('#headshot-reset'),
  headshotAnnouncer: document.querySelector('#headshot-announcer'),
}

let storageAvailable = true
let restoredFromStorage = false
let state = loadState()
let comparing = false
const undoStack = []
const redoStack = []
let headshotStorageAvailable = true
let headshotRestored = false
let headshotState = loadHeadshotState()
let headshotComparing = false
let headshotProcessing = false
let headshotProcessToken = 0
let headshotProcessTimer = null
let photoCaseStorageAvailable = true
let photoCaseRestored = false
let photoCaseState = loadPhotoCaseState()
let photoCaseLoadToken = 0
let photoCasePending = new Set()
let photoCaseLoadFailed = false

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

function sanitizeState(candidate = {}) {
  const safe = { ...DEFAULT_STATE }
  controls.forEach(({ key, min, max }) => {
    safe[key] = clamp(candidate[key], min, max)
  })
  safe.mesh = typeof candidate.mesh === 'boolean' ? candidate.mesh : DEFAULT_STATE.mesh
  safe.step = Math.round(clamp(candidate.step, 0, steps.length - 1))
  return safe
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...DEFAULT_STATE }
    restoredFromStorage = true
    return sanitizeState(JSON.parse(saved))
  } catch {
    storageAvailable = false
    return { ...DEFAULT_STATE }
  }
}

function persistState() {
  if (!storageAvailable) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    storageAvailable = false
    elements.storageStatus.textContent = '仅本次'
  }
}

function sanitizeHeadshotState(candidate = {}) {
  const safe = { ...HEADSHOT_DEFAULT_STATE }
  safe.stage = HEADSHOT_STAGES.includes(candidate.stage) ? candidate.stage : HEADSHOT_DEFAULT_STATE.stage
  safe.template = Object.hasOwn(headshotTemplates, candidate.template) ? candidate.template : HEADSHOT_DEFAULT_STATE.template
  safe.retouch = Math.round(clamp(candidate.retouch, 0, 70))
  safe.light = Math.round(clamp(candidate.light, -20, 50))
  safe.geometry = typeof candidate.geometry === 'boolean' ? candidate.geometry : HEADSHOT_DEFAULT_STATE.geometry
  return safe
}

function loadHeadshotState() {
  try {
    const saved = localStorage.getItem(HEADSHOT_STORAGE_KEY)
    if (!saved) return { ...HEADSHOT_DEFAULT_STATE }
    headshotRestored = true
    return sanitizeHeadshotState(JSON.parse(saved))
  } catch {
    headshotStorageAvailable = false
    return { ...HEADSHOT_DEFAULT_STATE }
  }
}

function persistHeadshotState() {
  if (!headshotStorageAvailable || headshotProcessing || headshotComparing) return
  try {
    localStorage.setItem(HEADSHOT_STORAGE_KEY, JSON.stringify(headshotState))
  } catch {
    headshotStorageAvailable = false
  }
}

function sanitizePhotoCaseState(candidate = {}) {
  const reveal = Number.isFinite(Number(candidate.reveal)) ? candidate.reveal : PHOTO_CASE_DEFAULT_STATE.reveal
  return {
    id: Object.hasOwn(photoCases, candidate.id) ? candidate.id : PHOTO_CASE_DEFAULT_STATE.id,
    reveal: Math.round(clamp(reveal, 0, 100)),
  }
}

function loadPhotoCaseState() {
  try {
    const saved = localStorage.getItem(PHOTO_CASE_STORAGE_KEY)
    if (!saved) return { ...PHOTO_CASE_DEFAULT_STATE }
    photoCaseRestored = true
    return sanitizePhotoCaseState(JSON.parse(saved))
  } catch {
    photoCaseStorageAvailable = false
    return { ...PHOTO_CASE_DEFAULT_STATE }
  }
}

function persistPhotoCaseState() {
  if (!photoCaseStorageAvailable) return
  try {
    localStorage.setItem(PHOTO_CASE_STORAGE_KEY, JSON.stringify(photoCaseState))
  } catch {
    photoCaseStorageAvailable = false
  }
}

function announcePhotoCase(message) {
  elements.photoAnnouncer.textContent = ''
  window.requestAnimationFrame(() => {
    elements.photoAnnouncer.textContent = message
  })
}

function announceHeadshot(message) {
  elements.headshotAnnouncer.textContent = ''
  window.requestAnimationFrame(() => {
    elements.headshotAnnouncer.textContent = message
  })
}

function snapshot() {
  return JSON.parse(JSON.stringify(state))
}

function sameState(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function commit(previousState) {
  if (sameState(previousState, state)) return
  undoStack.push(previousState)
  if (undoStack.length > 40) undoStack.shift()
  redoStack.length = 0
  updateHistoryButtons()
}

function restore(nextState, message) {
  state = sanitizeState(nextState)
  syncControls()
  renderAll()
  persistState()
  announce(message)
}

function announce(message) {
  elements.announcer.textContent = ''
  window.requestAnimationFrame(() => {
    elements.announcer.textContent = message
  })
}

function signed(value) {
  const number = Number(value)
  return number > 0 ? `+${number}` : String(number)
}

function changedParameters(renderState = state) {
  return controls.filter(({ key }) => renderState[key] !== DEFAULT_STATE[key]).length
}

function syncControls() {
  controls.forEach(({ key }) => {
    const input = document.querySelector(`#${key}`)
    input.value = state[key]
    input.dataset.committed = state[key]
    document.querySelector(`#${key}-value`).value = signed(state[key])
    updateRangeFill(input)
  })
  elements.meshToggle.checked = state.mesh
}

function updateRangeFill(input) {
  const min = Number(input.min)
  const max = Number(input.max)
  const value = Number(input.value)
  const percent = ((value - min) / (max - min)) * 100
  input.style.setProperty('--range-progress', `${percent}%`)
}

function updateHistoryButtons() {
  elements.undoButton.disabled = undoStack.length === 0
  elements.redoButton.disabled = redoStack.length === 0
}

function renderPhotoReveal() {
  const reveal = Math.round(clamp(photoCaseState.reveal, 0, 100))
  const beforeShare = 100 - reveal
  photoCaseState.reveal = reveal
  elements.photoFrame.style.setProperty('--reveal', `${reveal}%`)
  elements.photoRange.value = String(reveal)
  elements.photoRange.setAttribute('aria-valuetext', `处理后 ${reveal}%，处理前 ${beforeShare}%`)
  elements.photoOutput.value = `处理后 ${reveal}% · 处理前 ${beforeShare}%`
  elements.photoMode.textContent = reveal === 0 ? '仅处理前' : reveal === 100 ? '完整结果' : `处理后 ${reveal}%`
  updateRangeFill(elements.photoRange)
  document.querySelectorAll('[data-photo-reveal]').forEach((button) => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.photoReveal) === reveal))
  })
}

function setPhotoCaseLoading(isLoading) {
  elements.photoCompare.setAttribute('aria-busy', String(isLoading))
  elements.photoFrame.classList.toggle('is-loading', isLoading)
}

function showPhotoCaseFailure() {
  photoCaseLoadFailed = true
  setPhotoCaseLoading(false)
  elements.photoFrame.classList.add('is-error')
  elements.photoFallback.classList.add('is-visible')
  elements.photoStatus.textContent = '写实样片未能载入；文字说明仍可使用，切换场景可重试。'
}

function handlePhotoAssetSettled(image, failed) {
  if (Number(image.dataset.loadToken) !== photoCaseLoadToken) return
  photoCasePending.delete(image.id)
  if (failed || !image.naturalWidth) showPhotoCaseFailure()
  if (photoCasePending.size || photoCaseLoadFailed) return
  setPhotoCaseLoading(false)
  elements.photoFrame.classList.remove('is-error')
  elements.photoFallback.classList.remove('is-visible')
  elements.photoStatus.textContent = '写实样片已加载 · 本地 WebP · 同一虚拟人物前后对照'
}

function loadPhotoCasePair(item) {
  const token = ++photoCaseLoadToken
  photoCasePending = new Set([elements.photoBefore.id, elements.photoAfter.id])
  photoCaseLoadFailed = false
  elements.photoFrame.dataset.caseId = photoCaseState.id
  elements.photoFrame.classList.remove('is-error')
  elements.photoFallback.classList.remove('is-visible')
  elements.photoStatus.textContent = '正在载入写实样片'
  setPhotoCaseLoading(true)

  ;[
    [elements.photoBefore, item.before],
    [elements.photoAfter, item.after],
  ].forEach(([image, source]) => {
    image.dataset.loadToken = String(token)
    image.src = source
    if (image.complete) {
      window.queueMicrotask(() => handlePhotoAssetSettled(image, !image.naturalWidth))
    }
  })
}

function renderPhotoCase() {
  const item = photoCases[photoCaseState.id]
  document.querySelectorAll('[data-photo-case]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.photoCase === photoCaseState.id))
  })
  elements.photoCode.textContent = item.code
  elements.photoTitle.textContent = item.title
  elements.photoAudience.textContent = item.audience
  elements.photoBeforeCopy.textContent = item.beforeIssue
  elements.photoResultCopy.textContent = item.result
  elements.photoValueCopy.textContent = item.value
  elements.photoBoundaryCopy.textContent = item.boundary
  elements.photoTags.innerHTML = item.layers.map(([owner, label]) => `
    <span class="${owner === 'XPADE' ? 'is-xpade' : ''}"><small>${owner}</small>${label}</span>
  `).join('')
  elements.photoDescription.textContent = `${item.title}。处理前：${item.beforeIssue} 目标效果：${item.result} 图片为预生成的虚拟人物写实参考，不是浏览器实时模型输出。`
  elements.photoBefore.alt = `${item.title}的处理前写实合成参考图`
  elements.photoAfter.alt = `${item.title}的优化后写实合成参考图`
  renderPhotoReveal()
  if (elements.photoFrame.dataset.caseId !== photoCaseState.id) loadPhotoCasePair(item)
}

function renderAll() {
  renderPortrait()
  renderTelemetry()
  renderStep()
  renderPhotoCase()
  renderHeadshot()
}

function renderTelemetry() {
  const count = changedParameters()
  elements.changedCount.textContent = `${count} / ${controls.length}`
  elements.meshStatus.textContent = state.mesh ? '显示' : '隐藏'
  elements.storageStatus.textContent = storageAvailable ? (restoredFromStorage ? '已恢复' : '本地') : '仅本次'
  elements.renderMode.textContent = comparing ? '原始参考' : count ? '调整后' : '默认状态'
  elements.renderMode.classList.toggle('is-original', comparing)
}

function faceGeometry(renderState) {
  const faceWidth = 208 + renderState.faceWidth * 1.65
  const jawWidth = 126 + renderState.faceWidth * 0.45 + renderState.jaw * 1.5
  const chinY = 609 + Math.abs(renderState.jaw) * 0.28
  const eyeScale = 1 + renderState.eyeSize / 75
  const eyeDx = 83 + renderState.eyeDistance * 1.35
  const noseHalf = 25 + renderState.noseWidth * 0.82
  const mouthCornerY = 489 - renderState.mouthCorner * 0.72
  const facePath = `M300 118 C ${300 - faceWidth * 0.77} 120, ${300 - faceWidth} 250, ${300 - faceWidth} 354 C ${300 - faceWidth} 454, ${300 - jawWidth} 555, 300 ${chinY} C ${300 + jawWidth} 555, ${300 + faceWidth} 454, ${300 + faceWidth} 354 C ${300 + faceWidth} 250, ${300 + faceWidth * 0.77} 120, 300 118 Z`
  return { faceWidth, jawWidth, chinY, eyeScale, eyeDx, noseHalf, mouthCornerY, facePath }
}

function semanticPoints(g) {
  const leftEyeX = 300 - g.eyeDx
  const rightEyeX = 300 + g.eyeDx
  const eyeRx = 34 * g.eyeScale
  const eyeRy = 17 * g.eyeScale
  return [
    [300, 120], [300 - g.faceWidth * 0.72, 155], [300 + g.faceWidth * 0.72, 155],
    [300 - g.faceWidth, 300], [300 + g.faceWidth, 300], [300 - g.faceWidth, 400], [300 + g.faceWidth, 400],
    [300 - g.jawWidth, 540], [300 + g.jawWidth, 540], [300, g.chinY],
    [leftEyeX - eyeRx, 314], [leftEyeX, 314 - eyeRy], [leftEyeX + eyeRx, 314], [leftEyeX, 314 + eyeRy],
    [rightEyeX - eyeRx, 314], [rightEyeX, 314 - eyeRy], [rightEyeX + eyeRx, 314], [rightEyeX, 314 + eyeRy],
    [300 - g.noseHalf, 422], [300, 405], [300 + g.noseHalf, 422], [230, g.mouthCornerY], [300, 501], [370, g.mouthCornerY],
  ]
}

function meshMarkup(g) {
  const points = semanticPoints(g)
  const horizontalRows = [
    [190, 0.72], [252, 0.91], [314, 1], [378, 0.97], [442, 0.88], [502, 0.71], [554, 0.48],
  ]
  const horizontal = horizontalRows.map(([y, scale]) => {
    const half = g.faceWidth * scale
    const bend = (g.mouthCornerY - 489) * (y > 440 ? 0.4 : 0)
    return `<path d="M ${300 - half} ${y} Q 300 ${y + bend} ${300 + half} ${y}" />`
  }).join('')
  const vertical = [-0.78, -0.42, 0, 0.42, 0.78].map((ratio) => {
    const topX = 300 + g.faceWidth * ratio * 0.58
    const midX = 300 + g.faceWidth * ratio
    const lowX = 300 + g.jawWidth * ratio
    const chinX = 300 + g.jawWidth * ratio * 0.18
    return `<path d="M ${topX} 142 C ${midX} 250, ${midX} 415, ${lowX} 522 Q ${chinX} 590 300 ${g.chinY}" />`
  }).join('')
  const pointMarkup = points.map(([x, y], index) => `<circle class="mesh-point ${index > 9 ? 'semantic' : ''}" cx="${x}" cy="${y}" r="${index > 9 ? 3.5 : 2.4}" />`).join('')
  return `<g class="mesh-lines" clip-path="url(#face-clip)">${horizontal}${vertical}</g><g class="mesh-points">${pointMarkup}</g>`
}

function vectorMarkup(g, renderState) {
  const base = faceGeometry(DEFAULT_STATE)
  const vectors = []
  const addVector = (x1, y1, x2, y2) => {
    if (Math.abs(x2 - x1) + Math.abs(y2 - y1) < 3) return
    vectors.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#arrow)" />`)
  }
  addVector(300 - base.eyeDx, 314, 300 - g.eyeDx, 314)
  addVector(300 + base.eyeDx, 314, 300 + g.eyeDx, 314)
  addVector(300 - base.noseHalf, 422, 300 - g.noseHalf, 422)
  addVector(300 + base.noseHalf, 422, 300 + g.noseHalf, 422)
  addVector(230, base.mouthCornerY, 230, g.mouthCornerY)
  addVector(370, base.mouthCornerY, 370, g.mouthCornerY)
  addVector(300 - base.faceWidth, 390, 300 - g.faceWidth, 390)
  addVector(300 + base.faceWidth, 390, 300 + g.faceWidth, 390)
  addVector(300 - base.jawWidth, 540, 300 - g.jawWidth, 540)
  addVector(300 + base.jawWidth, 540, 300 + g.jawWidth, 540)
  if (renderState.eyeSize !== 0) {
    const direction = renderState.eyeSize > 0 ? 1 : -1
    addVector(300 - g.eyeDx, 314 - 17, 300 - g.eyeDx, 314 - 17 * g.eyeScale - direction * 2)
    addVector(300 + g.eyeDx, 314 - 17, 300 + g.eyeDx, 314 - 17 * g.eyeScale - direction * 2)
  }
  return vectors.length ? `<g class="deformation-vectors">${vectors.join('')}</g>` : ''
}

function renderPortrait() {
  const renderState = comparing ? { ...DEFAULT_STATE, mesh: state.mesh } : state
  const g = faceGeometry(renderState)
  const leftEyeX = 300 - g.eyeDx
  const rightEyeX = 300 + g.eyeDx
  const eyeRx = 34 * g.eyeScale
  const eyeRy = 17 * g.eyeScale
  const browRise = renderState.eyeSize * 0.15
  const mouthCenterY = 503 + Math.max(0, -renderState.mouthCorner * 0.1)
  const mouthPath = `M230 ${g.mouthCornerY} Q300 ${mouthCenterY} 370 ${g.mouthCornerY}`
  const upperLip = `M230 ${g.mouthCornerY} Q300 ${mouthCenterY - 21} 370 ${g.mouthCornerY} Q300 ${mouthCenterY + 10} 230 ${g.mouthCornerY}`
  const nosePath = `M300 342 C292 374, ${300 - g.noseHalf * 0.46} 402, ${300 - g.noseHalf} 421 Q300 441 ${300 + g.noseHalf} 421 C${300 + g.noseHalf * 0.46} 402, 308 374, 300 342`

  elements.portrait.innerHTML = `
    <svg viewBox="0 0 600 720" role="img" aria-labelledby="portrait-title portrait-desc">
      <title id="portrait-title">合成人脸语义形变概念演示</title>
      <desc id="portrait-desc">一张原创矢量人脸，根据六个滑杆实时改变眼睛、眼距、鼻宽、嘴角、脸宽和下颌。${renderState.mesh ? '当前显示教学网格。' : '当前隐藏教学网格。'}</desc>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d8ad8a" />
          <stop offset="0.55" stop-color="#bf896b" />
          <stop offset="1" stop-color="#94604c" />
        </linearGradient>
        <linearGradient id="neck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a46d55" />
          <stop offset="1" stop-color="#6e4035" />
        </linearGradient>
        <radialGradient id="stage-glow">
          <stop offset="0" stop-color="#29342e" stop-opacity="0.9" />
          <stop offset="1" stop-color="#121615" stop-opacity="0" />
        </radialGradient>
        <clipPath id="face-clip"><path d="${g.facePath}" /></clipPath>
        <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#f0b65a" /></marker>
        <filter id="portrait-shadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000" flood-opacity="0.38" /></filter>
      </defs>

      <rect width="600" height="720" fill="#111413" />
      <circle cx="300" cy="338" r="290" fill="url(#stage-glow)" />
      <g class="stage-axis" aria-hidden="true"><line x1="300" y1="56" x2="300" y2="662"/><line x1="66" y1="355" x2="534" y2="355"/></g>
      <g class="corner-marks" aria-hidden="true"><path d="M28 70v-28h28 M544 42h28v28 M28 650v28h28 M544 678h28v-28" /></g>
      <text x="36" y="102" class="svg-data">SYNTHETIC SUBJECT / 01</text>
      <text x="564" y="102" text-anchor="end" class="svg-data">LOCAL VECTOR</text>

      <g filter="url(#portrait-shadow)">
        <path d="M66 720 C78 625, 165 584, 239 572 L361 572 C435 584, 522 625, 534 720 Z" fill="#242a27" />
        <path d="M227 522 C233 580, 231 608, 209 632 C248 669, 352 669, 391 632 C369 608, 367 580, 373 522 Z" fill="url(#neck)" />
        <ellipse cx="${300 - g.faceWidth - 8}" cy="375" rx="30" ry="58" fill="#a97058" />
        <ellipse cx="${300 + g.faceWidth + 8}" cy="375" rx="30" ry="58" fill="#a97058" />
        <path d="${g.facePath}" fill="url(#skin)" />
        <ellipse cx="220" cy="409" rx="56" ry="30" fill="#c67d69" opacity=".15" clip-path="url(#face-clip)" />
        <ellipse cx="380" cy="409" rx="56" ry="30" fill="#c67d69" opacity=".15" clip-path="url(#face-clip)" />
        <path d="M112 266 C116 115, 202 62, 300 72 C415 59, 489 144, 489 285 C458 234, 428 184, 377 151 C326 190, 256 182, 191 151 C168 183, 140 224, 112 266 Z" fill="#20211f" />
        <path d="M149 214 C143 309, 135 388, 154 451 C116 413, 99 330, 112 254 Z M451 214 C457 309, 465 388, 446 451 C484 413, 501 330, 488 254 Z" fill="#20211f" />

        <path d="M${leftEyeX - 47} ${282 - browRise} Q${leftEyeX} ${260 - browRise} ${leftEyeX + 48} ${280 - browRise}" class="brow" />
        <path d="M${rightEyeX - 48} ${280 - browRise} Q${rightEyeX} ${260 - browRise} ${rightEyeX + 47} ${282 - browRise}" class="brow" />
        <g class="eyes">
          <ellipse cx="${leftEyeX}" cy="314" rx="${eyeRx}" ry="${eyeRy}" fill="#eee5d8" />
          <ellipse cx="${rightEyeX}" cy="314" rx="${eyeRx}" ry="${eyeRy}" fill="#eee5d8" />
          <circle cx="${leftEyeX}" cy="314" r="${9 * g.eyeScale}" fill="#314a42" /><circle cx="${rightEyeX}" cy="314" r="${9 * g.eyeScale}" fill="#314a42" />
          <circle cx="${leftEyeX}" cy="314" r="${4.4 * g.eyeScale}" fill="#111" /><circle cx="${rightEyeX}" cy="314" r="${4.4 * g.eyeScale}" fill="#111" />
          <circle cx="${leftEyeX - 2}" cy="311" r="2.2" fill="#fff" opacity=".8" /><circle cx="${rightEyeX - 2}" cy="311" r="2.2" fill="#fff" opacity=".8" />
          <path d="M${leftEyeX - eyeRx} 314 Q${leftEyeX} ${314 - eyeRy - 5} ${leftEyeX + eyeRx} 314" class="eye-line" />
          <path d="M${rightEyeX - eyeRx} 314 Q${rightEyeX} ${314 - eyeRy - 5} ${rightEyeX + eyeRx} 314" class="eye-line" />
        </g>
        <path d="${nosePath}" class="nose-line" />
        <ellipse cx="${300 - g.noseHalf * 0.55}" cy="423" rx="5" ry="3" fill="#55352d" opacity=".65" />
        <ellipse cx="${300 + g.noseHalf * 0.55}" cy="423" rx="5" ry="3" fill="#55352d" opacity=".65" />
        <path d="${upperLip}" fill="#7e3f42" opacity=".9" />
        <path d="${mouthPath}" class="mouth-line" />
        <path d="M278 548 Q300 558 322 548" fill="none" stroke="#825344" stroke-width="3" opacity=".38" />
      </g>

      ${renderState.mesh ? meshMarkup(g) : ''}
      ${renderState.mesh ? vectorMarkup(g, renderState) : ''}
      <g class="concept-watermark" aria-hidden="true"><rect x="177" y="654" width="246" height="34" rx="17"/><text x="300" y="676" text-anchor="middle">概念演示 / SYNTHETIC SVG</text></g>
    </svg>
  `
}

function headshotStageIndex() {
  if (headshotProcessing) return 1
  return Math.max(0, HEADSHOT_STAGES.indexOf(headshotState.stage))
}

function renderHeadshotPortrait() {
  const professional = !headshotComparing && !headshotProcessing && headshotState.stage !== 'ready'
  const template = headshotTemplates[headshotState.template]
  const geometryActive = professional && headshotState.geometry
  const faceWidth = 174 - (geometryActive ? 12 : 0)
  const jawWidth = 112 - (geometryActive ? 8 : 0)
  const chinY = 568 - (geometryActive ? 2 : 0)
  const mouthCornerY = 463 - (geometryActive ? 5 : 0)
  const facePath = `M300 126 C ${300 - faceWidth * 0.75} 125, ${300 - faceWidth} 234, ${300 - faceWidth} 344 C ${300 - faceWidth} 447, ${300 - jawWidth} 526, 300 ${chinY} C ${300 + jawWidth} 526, ${300 + faceWidth} 447, ${300 + faceWidth} 344 C ${300 + faceWidth} 234, ${300 + faceWidth * 0.75} 125, 300 126 Z`
  const subjectTransform = professional ? 'translate(0 2) scale(1)' : 'translate(43 42) scale(.88)'
  const retouchRatio = professional ? headshotState.retouch / 70 : 0
  const blemishOpacity = (0.62 * (1 - retouchRatio * 0.9)).toFixed(3)
  const underEyeOpacity = (0.28 * (1 - retouchRatio * 0.62)).toFixed(3)
  const positiveLight = professional ? Math.max(0, headshotState.light) / 50 : 0
  const negativeLight = professional ? Math.max(0, -headshotState.light) / 20 : 0
  const backgroundFrom = professional ? template.from : '#543d33'
  const backgroundTo = professional ? template.to : '#21191a'
  const dataColor = professional && headshotState.template === 'ivory' ? '#3f4747' : '#dce8e7'
  const description = professional
    ? `企业职业头像合成结果，已应用${template.label}背景、轻磨皮 ${headshotState.retouch}%、补光 ${headshotState.light}，${headshotState.geometry ? '以及 XPADE 轻度几何微调' : 'XPADE 几何微调已关闭'}。`
    : '一张原创合成随拍：人物构图略偏、背景为暖色室内抽象图形、面部光线不均、穿着普通圆领上衣。'

  elements.headshotPreview.innerHTML = `
    <svg viewBox="0 0 600 750" role="img" aria-labelledby="headshot-svg-title headshot-svg-desc">
      <title id="headshot-svg-title">${professional ? '合成企业职业头像结果' : '合成员工随拍参考'}</title>
      <desc id="headshot-svg-desc">${description}</desc>
      <defs>
        <linearGradient id="headshot-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${backgroundFrom}"/><stop offset="1" stop-color="${backgroundTo}"/></linearGradient>
        <radialGradient id="headshot-halo"><stop offset="0" stop-color="${professional ? template.halo : '#c88766'}" stop-opacity="${professional ? '.55' : '.24'}"/><stop offset="1" stop-color="${professional ? template.halo : '#c88766'}" stop-opacity="0"/></radialGradient>
        <linearGradient id="headshot-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${professional ? '#e2b698' : '#d19b7d'}"/><stop offset=".56" stop-color="#c4876c"/><stop offset="1" stop-color="#8e5747"/></linearGradient>
        <linearGradient id="headshot-neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a86e58"/><stop offset="1" stop-color="#714235"/></linearGradient>
        <radialGradient id="headshot-key-light" cx="35%" cy="30%"><stop offset="0" stop-color="#fff7df" stop-opacity=".95"/><stop offset="1" stop-color="#fff7df" stop-opacity="0"/></radialGradient>
        <clipPath id="headshot-face-clip"><path d="${facePath}"/></clipPath>
        <filter id="headshot-shadow" x="-30%" y="-20%" width="160%" height="170%"><feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity="${professional ? '.28' : '.42'}"/></filter>
      </defs>

      <rect width="600" height="750" fill="url(#headshot-background)"/>
      ${professional ? `
        <circle cx="300" cy="315" r="310" fill="url(#headshot-halo)"/>
        <g class="professional-background-lines" opacity=".22"><path d="M0 118H600M0 632H600"/><path d="M84 0V750M516 0V750"/></g>
      ` : `
        <rect x="24" y="70" width="205" height="248" rx="4" fill="#b47a5e" opacity=".2"/>
        <rect x="45" y="91" width="164" height="207" fill="#18201d" opacity=".38"/>
        <path d="M475 750V390 M437 750C439 618 471 544 530 486 M469 620C425 569 408 516 412 464 M485 566C535 527 553 483 556 433" fill="none" stroke="#9e8862" stroke-width="18" opacity=".2"/>
        <circle cx="126" cy="142" r="210" fill="url(#headshot-halo)"/>
      `}
      <text x="28" y="38" fill="${dataColor}" class="headshot-svg-data">${professional ? `${template.label.toUpperCase()} / BRAND PROFILE` : 'CASUAL SAMPLE / SYNTHETIC'}</text>
      <text x="572" y="38" text-anchor="end" fill="${dataColor}" class="headshot-svg-data">${headshotComparing ? 'HOLDING ORIGINAL' : headshotProcessing ? 'LOCAL COMPOSING' : professional ? 'RESULT PREVIEW' : 'SOURCE REFERENCE'}</text>

      <g transform="${subjectTransform}" filter="url(#headshot-shadow)">
        ${professional ? `
          <path d="M54 750 C67 625 155 579 231 563 L369 563 C445 579 533 625 546 750 Z" fill="${template.suit}"/>
          <path d="M217 571 L300 668 L383 571 L359 750 H241 Z" fill="#edf1ee"/>
          <path d="M54 750 C85 632 170 592 230 576 L280 750 Z M546 750 C515 632 430 592 370 576 L320 750 Z" fill="${template.suit}"/>
          <path d="M230 576 L300 668 L260 689 L190 605 Z M370 576 L300 668 L340 689 L410 605 Z" fill="none" stroke="${template.accent}" stroke-width="4" opacity=".62"/>
        ` : `
          <path d="M58 750 C73 638 164 588 239 575 L361 575 C436 588 527 638 542 750 Z" fill="#62443f"/>
          <path d="M221 580 Q300 646 379 580" fill="none" stroke="#9b7167" stroke-width="22" opacity=".7"/>
        `}
        <path d="M228 506 C234 565 233 598 211 623 C248 654 352 654 389 623 C367 598 366 565 372 506 Z" fill="url(#headshot-neck)"/>
        <ellipse cx="${300 - faceWidth - 5}" cy="365" rx="27" ry="53" fill="#ad735d"/>
        <ellipse cx="${300 + faceWidth + 5}" cy="365" rx="27" ry="53" fill="#ad735d"/>
        <path d="${facePath}" fill="url(#headshot-skin)"/>

        <g clip-path="url(#headshot-face-clip)">
          <ellipse cx="220" cy="392" rx="67" ry="38" fill="#7a3d37" opacity=".12"/>
          <ellipse cx="380" cy="392" rx="67" ry="38" fill="#7a3d37" opacity=".12"/>
          <path d="M126 170 C144 129 213 97 286 113 C201 226 189 392 207 516 C130 465 111 285 126 170 Z" fill="#4b2925" opacity="${(0.2 + negativeLight * 0.25).toFixed(3)}"/>
          <ellipse cx="232" cy="336" rx="54" ry="22" fill="#5d372e" opacity="${underEyeOpacity}"/>
          <ellipse cx="368" cy="336" rx="54" ry="22" fill="#5d372e" opacity="${underEyeOpacity}"/>
          <g class="headshot-skin-texture" fill="#824d42" opacity="${blemishOpacity}">
            <circle cx="214" cy="388" r="4.2"/><circle cx="230" cy="402" r="2.8"/><circle cx="246" cy="393" r="3.4"/>
            <circle cx="388" cy="397" r="3.6"/><circle cx="370" cy="409" r="2.6"/><circle cx="352" cy="392" r="2.8"/>
            <circle cx="318" cy="446" r="2.4"/><circle cx="283" cy="431" r="2.2"/>
          </g>
          <ellipse cx="250" cy="278" rx="205" ry="245" fill="url(#headshot-key-light)" opacity="${(positiveLight * 0.52).toFixed(3)}"/>
          ${negativeLight > 0 ? `<rect x="100" y="100" width="400" height="500" fill="#241d2a" opacity="${(negativeLight * 0.24).toFixed(3)}"/>` : ''}
        </g>

        <path d="M128 254 C131 111 218 59 302 78 C413 57 478 145 477 279 C443 223 414 175 369 147 C319 184 252 179 191 149 C168 177 145 215 128 254 Z" fill="#25211f"/>
        <path d="M156 205 C143 311 141 391 160 444 C124 405 112 326 128 247 Z M444 205 C457 311 459 391 440 444 C476 405 488 326 472 247 Z" fill="#25211f"/>

        <path d="M194 278 Q232 257 270 277 M330 277 Q368 257 406 278" class="headshot-brow"/>
        <ellipse cx="232" cy="311" rx="32" ry="16" fill="#f0e6d9"/><ellipse cx="368" cy="311" rx="32" ry="16" fill="#f0e6d9"/>
        <circle cx="232" cy="311" r="9" fill="#3c4c43"/><circle cx="368" cy="311" r="9" fill="#3c4c43"/>
        <circle cx="232" cy="311" r="4" fill="#121312"/><circle cx="368" cy="311" r="4" fill="#121312"/>
        <circle cx="229" cy="308" r="2" fill="#fff" opacity=".8"/><circle cx="365" cy="308" r="2" fill="#fff" opacity=".8"/>
        <path d="M200 311 Q232 286 264 311 M336 311 Q368 286 400 311" class="headshot-eye-line"/>
        <path d="M300 333 C292 373 279 404 272 416 Q300 437 328 416 C321 404 308 373 300 333" class="headshot-nose-line"/>
        <path d="M231 ${mouthCornerY} Q300 484 369 ${mouthCornerY} Q300 512 231 ${mouthCornerY}" fill="#834346" opacity=".92"/>
        <path d="M231 ${mouthCornerY} Q300 ${professional && geometryActive ? 472 : 480} 369 ${mouthCornerY}" class="headshot-mouth-line"/>
      </g>

      ${headshotProcessing ? `<g class="headshot-scan" aria-hidden="true"><rect x="24" y="86" width="552" height="4" rx="2"/><rect x="24" y="92" width="552" height="42" fill="url(#headshot-halo)" opacity=".18"/></g>` : ''}
      ${headshotState.stage === 'approved' && !headshotComparing ? `<g class="headshot-approved-stamp" aria-hidden="true"><circle cx="520" cy="660" r="43"/><path d="M500 660l13 13 28-32"/><text x="520" y="722" text-anchor="middle">LOCAL APPROVAL</text></g>` : ''}
      <g class="concept-watermark" aria-hidden="true"><rect x="170" y="694" width="260" height="34" rx="17"/><text x="300" y="716" text-anchor="middle">合成示例 / PRODUCT FLOW DEMO</text></g>
    </svg>
  `
}

function renderHeadshot() {
  const stage = headshotState.stage
  const stageIndex = headshotStageIndex()
  const editable = stage === 'result' && !headshotProcessing
  const hasResult = stage !== 'ready' && !headshotProcessing
  const stageCopy = {
    ready: {
      title: '合成随拍已就绪',
      badge: 'READY',
      message: '静态规则演示显示：单人、近正面、清晰度与无遮挡条件均通过。这里没有运行真实识别模型。',
    },
    result: {
      title: '职业头像已生成，可继续微调',
      badge: 'EDITABLE',
      message: '背景、构图、光线、轻磨皮与着装属于产品层模拟；XPADE 几何层已对脸宽、下颌和嘴角施加克制调整。',
    },
    confirmed: {
      title: '员工已确认，等待本地审核模拟',
      badge: 'EMPLOYEE OK',
      message: '编辑控制已锁定。这个确认只保存在当前浏览器，没有向员工系统、HR 或服务器发送数据。',
    },
    approved: {
      title: '本地审核模拟已批准',
      badge: 'DEMO APPROVED',
      message: '流程闭环已经完成。生产版仍需要身份、权限、版本、审计、存储、通知和真实导出服务。',
    },
  }
  const currentCopy = headshotProcessing ? {
    title: '正在组合本地演示参数',
    badge: 'LOCAL PROCESS',
    message: '页面正在按确定性规则组合构图、企业背景、光线、皮肤纹理、着装和 XPADE 几何参数；不是远程 AI 推理。',
  } : stageCopy[stage]

  elements.headshotWorkspace.setAttribute('aria-busy', String(headshotProcessing))
  elements.headshotStageTitle.textContent = currentCopy.title
  elements.headshotStageBadge.textContent = currentCopy.badge
  elements.headshotStageMessage.textContent = currentCopy.message
  elements.headshotProcessingTrack.hidden = !headshotProcessing
  elements.headshotGenerate.disabled = headshotProcessing || stage === 'confirmed' || stage === 'approved'
  elements.headshotGenerate.innerHTML = headshotProcessing
    ? '正在组合本地效果…'
    : stage === 'result'
      ? '重新应用企业规范 <span aria-hidden="true">↺</span>'
      : '一键生成职业头像 <span aria-hidden="true">→</span>'

  elements.headshotPresetFieldset.disabled = !editable
  elements.headshotRetouch.disabled = !editable
  elements.headshotLight.disabled = !editable
  elements.headshotGeometry.disabled = !editable
  elements.headshotCompare.disabled = !hasResult
  elements.headshotConfirm.disabled = stage !== 'result' || headshotProcessing
  elements.headshotApprove.disabled = stage !== 'confirmed' || headshotProcessing

  elements.headshotRetouch.value = headshotState.retouch
  elements.headshotRetouchValue.value = `${headshotState.retouch}%`
  elements.headshotLight.value = headshotState.light
  elements.headshotLightValue.value = signed(headshotState.light)
  elements.headshotGeometry.checked = headshotState.geometry
  updateRangeFill(elements.headshotRetouch)
  updateRangeFill(elements.headshotLight)
  document.querySelectorAll('input[name="headshot-template"]').forEach((radio) => {
    radio.checked = radio.value === headshotState.template
  })

  elements.headshotViewMode.textContent = headshotComparing
    ? '随拍参考'
    : headshotProcessing
      ? '本地组合中'
      : hasResult
        ? `${headshotTemplates[headshotState.template].label}结果`
        : '随拍参考'
  elements.headshotViewMode.classList.toggle('is-original', headshotComparing || !hasResult)
  elements.headshotCompare.classList.toggle('is-active', headshotComparing)
  elements.headshotCompare.setAttribute('aria-pressed', String(headshotComparing))
  elements.headshotGeometryReadout.textContent = hasResult
    ? headshotState.geometry
      ? '已应用：脸宽 −4 · 下颌 −3 · 嘴角 +3'
      : '已关闭：其他职业化效果保持'
    : '几何层待应用'

  elements.headshotApprovalCard.classList.toggle('is-confirmed', stage === 'confirmed')
  elements.headshotApprovalCard.classList.toggle('is-approved', stage === 'approved')
  elements.headshotApprovalNote.textContent = stage === 'approved'
    ? '审核模拟已批准；未向 HR 或服务器发送任何数据。'
    : stage === 'confirmed'
      ? '员工确认已锁定；现在可执行 HR 本地审核模拟。'
      : '生成结果后，员工可先确认，再进入 HR 本地审核模拟。'

  document.querySelectorAll('[data-headshot-step]').forEach((item, index) => {
    item.toggleAttribute('aria-current', index === stageIndex)
    if (index === stageIndex) item.setAttribute('aria-current', 'step')
    item.classList.toggle('is-complete', index < stageIndex)
  })
  renderHeadshotPortrait()
}

function pipelineGraphic(activeStep) {
  const labels = ['输入', '468 点', '语义', 'RBF', '网格']
  const xPositions = [58, 172, 286, 400, 514]
  return `
    <svg viewBox="0 0 572 190" role="presentation">
      <defs><marker id="pipeline-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#5b635f"/></marker></defs>
      <g class="pipeline-grid"><path d="M20 35H552M20 95H552M20 155H552"/><path d="M58 20V170M172 20V170M286 20V170M400 20V170M514 20V170"/></g>
      ${xPositions.slice(0, -1).map((x, i) => `<path class="pipeline-link ${i < activeStep ? 'is-past' : ''}" d="M${x + 31} 95H${xPositions[i + 1] - 31}" marker-end="url(#pipeline-arrow)"/>`).join('')}
      ${xPositions.map((x, index) => `
        <g class="pipeline-node ${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-past' : ''}">
          <circle cx="${x}" cy="95" r="28" />
          <text x="${x}" y="101" text-anchor="middle">${String(index + 1).padStart(2, '0')}</text>
          <text class="pipeline-label" x="${x}" y="145" text-anchor="middle">${labels[index]}</text>
        </g>
      `).join('')}
      <text class="pipeline-caption" x="20" y="18">BROWSER-SIDE GEOMETRY PIPELINE</text>
      <text class="pipeline-caption" x="552" y="178" text-anchor="end">NO SERVER REQUIRED</text>
    </svg>
  `
}

function renderStep() {
  const current = steps[state.step]
  elements.stepEyebrow.textContent = current.eyebrow
  elements.stepTitle.textContent = current.title
  elements.stepBody.textContent = current.body
  elements.stepSignal.textContent = current.signal
  elements.stepFormula.textContent = current.formula
  elements.stepNote.textContent = current.note
  elements.stepProgress.textContent = `${String(state.step + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`
  elements.pipelineVisual.innerHTML = pipelineGraphic(state.step)
  document.querySelectorAll('.step-button').forEach((button, index) => {
    button.setAttribute('aria-current', index === state.step ? 'step' : 'false')
  })
  elements.prevStep.disabled = state.step === 0
  elements.nextStep.innerHTML = state.step === steps.length - 1 ? '回到第一步 <span aria-hidden="true">↺</span>' : '下一步 <span aria-hidden="true">→</span>'
}

controls.forEach(({ key, label }) => {
  const input = document.querySelector(`#${key}`)
  input.addEventListener('input', () => {
    state[key] = Number(input.value)
    document.querySelector(`#${key}-value`).value = signed(state[key])
    updateRangeFill(input)
    renderPortrait()
    renderTelemetry()
    persistState()
  })
  input.addEventListener('change', () => {
    const previousValue = Number(input.dataset.committed)
    const previous = { ...state, [key]: previousValue }
    commit(previous)
    input.dataset.committed = state[key]
    announce(`${label}调整为 ${signed(state[key])}`)
  })
})

elements.meshToggle.addEventListener('change', () => {
  const previous = snapshot()
  state.mesh = elements.meshToggle.checked
  commit(previous)
  renderPortrait()
  renderTelemetry()
  persistState()
  announce(`语义网格已${state.mesh ? '显示' : '隐藏'}`)
})

function setComparing(value) {
  if (comparing === value) return
  comparing = value
  elements.compareButton.setAttribute('aria-pressed', String(value))
  elements.compareButton.classList.toggle('is-active', value)
  renderPortrait()
  renderTelemetry()
  announce(value ? '正在查看原始参考' : '已返回调整后结果')
}

elements.compareButton.addEventListener('pointerdown', (event) => {
  event.preventDefault()
  elements.compareButton.setPointerCapture?.(event.pointerId)
  setComparing(true)
})
elements.compareButton.addEventListener('pointerup', () => setComparing(false))
elements.compareButton.addEventListener('pointercancel', () => setComparing(false))
elements.compareButton.addEventListener('lostpointercapture', () => setComparing(false))
elements.compareButton.addEventListener('keydown', (event) => {
  if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
    event.preventDefault()
    setComparing(true)
  }
})
elements.compareButton.addEventListener('keyup', (event) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    setComparing(false)
  }
})
elements.compareButton.addEventListener('blur', () => setComparing(false))

elements.photoBefore.addEventListener('load', () => handlePhotoAssetSettled(elements.photoBefore, false))
elements.photoAfter.addEventListener('load', () => handlePhotoAssetSettled(elements.photoAfter, false))
elements.photoBefore.addEventListener('error', () => handlePhotoAssetSettled(elements.photoBefore, true))
elements.photoAfter.addEventListener('error', () => handlePhotoAssetSettled(elements.photoAfter, true))

document.querySelectorAll('[data-photo-case]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.photoCase === photoCaseState.id) return
    photoCaseState = { id: button.dataset.photoCase, reveal: 50 }
    renderPhotoCase()
    persistPhotoCaseState()
    announcePhotoCase(`${photoCases[photoCaseState.id].title}已选择，对比分界已回到百分之五十`)
  })
})

elements.photoRange.addEventListener('input', () => {
  photoCaseState.reveal = Number(elements.photoRange.value)
  renderPhotoReveal()
})

elements.photoRange.addEventListener('change', () => {
  persistPhotoCaseState()
  announcePhotoCase(elements.photoRange.getAttribute('aria-valuetext'))
})

document.querySelectorAll('[data-photo-reveal]').forEach((button) => {
  button.addEventListener('click', () => {
    photoCaseState.reveal = Number(button.dataset.photoReveal)
    renderPhotoReveal()
    persistPhotoCaseState()
    announcePhotoCase(elements.photoRange.getAttribute('aria-valuetext'))
  })
})

function cancelHeadshotProcessing() {
  headshotProcessToken += 1
  if (headshotProcessTimer !== null) {
    window.clearTimeout(headshotProcessTimer)
    headshotProcessTimer = null
  }
  headshotProcessing = false
}

function finishHeadshotProcessing(token) {
  if (token !== headshotProcessToken) return
  headshotProcessTimer = null
  headshotProcessing = false
  headshotState = {
    ...headshotState,
    stage: 'result',
    template: 'navy',
    retouch: 34,
    light: 22,
    geometry: true,
  }
  renderHeadshot()
  persistHeadshotState()
  announceHeadshot('职业头像演示结果已生成，可以调整企业背景、轻磨皮、补光或关闭 XPADE 几何层')
  window.requestAnimationFrame(() => elements.headshotStageTitle.focus({ preventScroll: true }))
}

function startHeadshotProcessing() {
  if (headshotProcessing || headshotState.stage === 'confirmed' || headshotState.stage === 'approved') return
  cancelHeadshotProcessing()
  const token = headshotProcessToken
  headshotProcessing = true
  headshotComparing = false
  renderHeadshot()
  announceHeadshot('正在本地组合职业头像演示参数')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  headshotProcessTimer = window.setTimeout(() => finishHeadshotProcessing(token), reducedMotion ? 0 : 720)
}

function setHeadshotComparing(value) {
  if (headshotComparing === value || elements.headshotCompare.disabled) return
  headshotComparing = value
  renderHeadshot()
  announceHeadshot(value ? '正在查看完整随拍参考' : '已返回职业头像结果')
}

elements.headshotGenerate.addEventListener('click', startHeadshotProcessing)

document.querySelectorAll('input[name="headshot-template"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked || headshotState.stage !== 'result') return
    headshotState.template = radio.value
    renderHeadshot()
    persistHeadshotState()
    announceHeadshot(`企业背景已切换为${headshotTemplates[radio.value].label}`)
  })
})

elements.headshotRetouch.addEventListener('input', () => {
  headshotState.retouch = Number(elements.headshotRetouch.value)
  renderHeadshot()
})
elements.headshotRetouch.addEventListener('change', () => {
  persistHeadshotState()
  announceHeadshot(`轻磨皮强度调整为 ${headshotState.retouch}%`)
})

elements.headshotLight.addEventListener('input', () => {
  headshotState.light = Number(elements.headshotLight.value)
  renderHeadshot()
})
elements.headshotLight.addEventListener('change', () => {
  persistHeadshotState()
  announceHeadshot(`面部补光调整为 ${signed(headshotState.light)}`)
})

elements.headshotGeometry.addEventListener('change', () => {
  headshotState.geometry = elements.headshotGeometry.checked
  renderHeadshot()
  persistHeadshotState()
  announceHeadshot(`XPADE 几何微调已${headshotState.geometry ? '开启' : '关闭'}，其他职业化效果保持不变`)
})

elements.headshotCompare.addEventListener('pointerdown', (event) => {
  event.preventDefault()
  elements.headshotCompare.setPointerCapture?.(event.pointerId)
  setHeadshotComparing(true)
})
elements.headshotCompare.addEventListener('pointerup', () => setHeadshotComparing(false))
elements.headshotCompare.addEventListener('pointercancel', () => setHeadshotComparing(false))
elements.headshotCompare.addEventListener('lostpointercapture', () => setHeadshotComparing(false))
elements.headshotCompare.addEventListener('keydown', (event) => {
  if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
    event.preventDefault()
    setHeadshotComparing(true)
  }
})
elements.headshotCompare.addEventListener('keyup', (event) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    setHeadshotComparing(false)
  }
})
elements.headshotCompare.addEventListener('blur', () => setHeadshotComparing(false))

elements.headshotConfirm.addEventListener('click', () => {
  if (headshotState.stage !== 'result') return
  headshotState.stage = 'confirmed'
  renderHeadshot()
  persistHeadshotState()
  announceHeadshot('员工已在本地确认职业头像，编辑已锁定，可以进行 HR 审核模拟')
  window.requestAnimationFrame(() => elements.headshotStageTitle.focus({ preventScroll: true }))
})

elements.headshotApprove.addEventListener('click', () => {
  if (headshotState.stage !== 'confirmed') return
  headshotState.stage = 'approved'
  renderHeadshot()
  persistHeadshotState()
  announceHeadshot('HR 本地审核模拟已批准，没有向服务器发送数据')
  window.requestAnimationFrame(() => elements.headshotStageTitle.focus({ preventScroll: true }))
})

elements.headshotReset.addEventListener('click', () => {
  cancelHeadshotProcessing()
  headshotComparing = false
  headshotState = { ...HEADSHOT_DEFAULT_STATE }
  try {
    localStorage.removeItem(HEADSHOT_STORAGE_KEY)
  } catch {
    headshotStorageAvailable = false
  }
  renderHeadshot()
  announceHeadshot('职业头像流程已清除并返回合成随拍状态')
  window.requestAnimationFrame(() => elements.headshotGenerate.focus({ preventScroll: true }))
})

elements.undoButton.addEventListener('click', () => {
  if (!undoStack.length) return
  redoStack.push(snapshot())
  const previous = undoStack.pop()
  restore(previous, '已撤销上一步')
  updateHistoryButtons()
})

elements.redoButton.addEventListener('click', () => {
  if (!redoStack.length) return
  undoStack.push(snapshot())
  const next = redoStack.pop()
  restore(next, '已重做上一步')
  updateHistoryButtons()
})

elements.resetButton.addEventListener('click', () => {
  const previous = snapshot()
  state = { ...DEFAULT_STATE }
  commit(previous)
  syncControls()
  renderAll()
  persistState()
  announce('所有参数和步骤已重置')
})

document.querySelectorAll('.step-button').forEach((button) => {
  button.addEventListener('click', () => {
    state.step = Number(button.dataset.step)
    renderStep()
    persistState()
  })
})

elements.prevStep.addEventListener('click', () => {
  state.step = Math.max(0, state.step - 1)
  renderStep()
  persistState()
})

elements.nextStep.addEventListener('click', () => {
  state.step = state.step === steps.length - 1 ? 0 : state.step + 1
  renderStep()
  persistState()
})

syncControls()
renderAll()
updateHistoryButtons()

if (restoredFromStorage) {
  announce('已恢复上次保存的实验状态')
}

if (headshotRestored) {
  announceHeadshot('已恢复上次保存的职业头像演示状态')
}

if (photoCaseRestored) {
  announcePhotoCase('已恢复上次选择的写实业务场景与对比位置')
}
