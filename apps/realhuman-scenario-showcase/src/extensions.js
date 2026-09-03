import './extensions.css'

const app = document.querySelector('#extension-app')
const appUrl = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const capabilities = [
  {
    id: 'restoration', status: 'live', index: '01', title: '老照片基础修复', summary: '褪色、偏色、对比、轻噪声与清晰度的本地处理。',
    description: '对同一张输入图做确定性像素修复，适合先校正可恢复的信息，不生成原图不存在的内容。',
    primaryAction: '一键基础修复',
  },
  {
    id: 'style', status: 'live', index: '02', title: '图片风格处理', summary: '黑白、暖印、冷调与高对比风格，可调强度。',
    description: '用可回退的确定性调色建立风格候选，不改变身份，也不生成新服装、发型或背景。',
    primaryAction: '生成推荐风格',
  },
  {
    id: 'headshot', status: 'foundation', index: '03', title: 'AI 职业头像', summary: '人像底座已具备；换装、换景与发型需生成模型。',
    description: '目标是把普通随拍转为保持本人身份、符合企业规范的职业头像。',
    reuse: ['单人人脸检测与 468 点', '皮肤、补光和几何增强', '构图、比较、撤销和导出'],
    missing: ['身份保持图像编辑模型', '职业服装与背景模板', '候选生成、审核与溯源'],
    next: '先接一条身份保持的图片编辑模型链，输出 2–4 个候选，再复用当前质检与导出底座。',
    engineType: 'photo', engineRoute: 'photo-workbench', foundationLabel: '启动职业头像基础工作台',
    primaryAction: '生成职业头像基础版本', template: 'enterprise', exportSpec: 'avatar',
    overrides: { exposure: 5, contrast: 3, temperature: 1, saturation: 1, clarity: 7, skinRetouch: 6, blemish: 3, wrinkle: 2, faceWidth: -2, jaw: 2, chin: 1 },
    productSteps: ['读取单人照片', '检测人脸与皮肤', '应用企业头像策略', '生成 1024×1024 基础结果'],
  },
  {
    id: 'wedding', status: 'foundation', index: '04', title: '婚纱与家庭影像', summary: '单人精修可复用；多人独立参数和批量一致性待接入。',
    description: '面向情侣、家庭和影楼批量交付，每个人都要独立识别、保护并保持多张照片风格一致。',
    reuse: ['人物感知与区域保护', '局部肤质和脸型处理', '差异查看、撤销与导出'],
    missing: ['多人选择与逐人参数', '婚纱、首饰和手部保护', '整组照片色彩一致性与批量队列'],
    next: '先做双人选择器和逐人参数，再进入整组照片的一致性处理。',
    engineType: 'photo', engineRoute: 'photo-workbench', foundationLabel: '启动单人人像精修底座',
    primaryAction: '精修婚纱单人基础版本', template: 'natural', exportSpec: 'original',
    overrides: { exposure: 3, contrast: 1, temperature: 2, saturation: 2, clarity: 4, skinRetouch: 7, blemish: 4, wrinkle: 3, faceWidth: 0, jaw: 0, chin: 0, smile: 1 },
    productSteps: ['读取当前人物照片', '检测人物与肤质', '应用自然精修策略', '输出单人基础结果'],
  },
  {
    id: 'commerce', status: 'foundation', index: '05', title: '电商人像处理', summary: '人物区域底座可用；商品保护和批量交付待完成。',
    description: '面向服饰、美妆与内容电商，需要人物自然、商品真实、色彩合规和批量可审核。',
    reuse: ['人物分割与人脸增强', '背景与构图处理底座', '参数记录和结果导出'],
    missing: ['服饰与商品区域精确保护', 'SKU 色彩标准和批量工作流', '审核队列与失败回退'],
    next: '从单张服饰人像开始，先验证商品颜色和纹理不被人物增强污染。',
    engineType: 'photo', engineRoute: 'photo-workbench', foundationLabel: '启动单张人像处理底座',
    primaryAction: '生成电商人像基础版本', template: 'creator', exportSpec: 'original',
    overrides: { exposure: 4, contrast: 4, temperature: 0, saturation: 1, clarity: 10, skinRetouch: 4, blemish: 2, wrinkle: 1, faceWidth: 0, jaw: 0, chin: 0, smile: 0 },
    productSteps: ['读取单张商品人像', '检测人物区域', '应用商品友好型参数', '输出单张审核结果'],
  },
  {
    id: 'tryon', status: 'model', index: '06', title: '全身塑形与虚拟试穿', summary: '需要人体姿态、服饰分割与试穿生成模型。',
    description: '这是全身级产品，不是把脸部网格形变扩大到身体；需要保持人体结构和服装材质。',
    reuse: ['输入质量与结果审核', '前后对比和参数记录'],
    missing: ['人体姿态与身体解析', '全身几何约束', '服饰试穿生成与遮挡重建'],
    next: '单独建立全身输入规范和模型评测集，不直接复用当前脸部几何。',
    primaryAction: '生成试穿效果', productSteps: ['解析人体姿态', '分割服装区域', '生成试穿结果', '检查遮挡与身份'],
  },
  {
    id: 'video-product', status: 'foundation', index: '07', title: '正式视频产品输出', summary: '实时预览可运行；会议软件输出与录制尚未产品化。',
    description: '当前浏览器已能实时预览美颜、妆容、受限捏脸和背景，下一步是把结果真正交给会议与直播软件。',
    reuse: ['实时跟踪与动态参数', '背景替换和基础美颜', '本机自适应与失败回退'],
    missing: ['虚拟摄像头或 WebRTC 输出', '音视频同步和录制', '设备选择、权限和产品设置'],
    next: '先接浏览器内 WebRTC 预览与录制，再评估桌面虚拟摄像头。',
    engineType: 'video', engineRoute: 'realtime-workbench', foundationLabel: '启动实时摄像头底座',
    primaryAction: '应用会议演示效果', scenario: 'meeting',
    productSteps: ['启动本地演示流', '检测并连续跟踪', '应用会议补光与背景', '输出实时预览'],
  },
]

const statusLabels = {
  live: ['可运行 MVP', 'live'],
  foundation: ['底座可复用', 'foundation'],
  model: ['需要专用模型', 'model'],
}

const restoreDefaults = { fade: 46, neutral: 42, color: 28, clean: 18, detail: 24 }
const styleDefaults = { preset: 'natural', intensity: 70 }
const state = {
  active: 'restoration', sourceReady: false, sourceLabel: '', sourceKind: '', sourceFile: null, compare: 56,
  sourceBytes: 0, sourceOrigin: '', inputStatus: 'idle', inputMessage: '选择、拖入或粘贴一张图片。',
  restore: { ...restoreDefaults }, style: { ...styleDefaults }, fingerprint: '—', width: 0, height: 0,
}
const productResults = new Map()

let sourceCanvas
let originalCanvas
let resultCanvas
let renderToken = 0

const header = `
  <header class="extension-header">
    <a class="extension-brand" href="${appUrl('index.html')}" aria-label="返回 RealHuman 场景产品中心">
      <span>RH</span><div><strong>REALHUMAN</strong><small>EXTENSION CAPABILITY CENTER</small></div>
    </a>
    <nav aria-label="产品能力导航">
      <a href="${appUrl('photo.html')}">照片能力</a><a href="${appUrl('video.html')}">视频能力</a><a href="${appUrl('extensions.html')}" aria-current="page">扩展能力</a>
    </nav>
    <span class="local-badge">LOCAL PIXEL PIPELINE · NO UPLOAD</span>
  </header>`

app.innerHTML = `${header}
  <main id="extension-main" class="extension-main">
    <aside class="capability-rail">
      <header class="rail-heading"><span class="eyebrow">PRODUCT MODULES / 07</span><h1>按产品场景扩展能力</h1><p>两项本地像素工具、四项可运行底座流程；试穿等待专用模型。每个场景都有独立主动作和交付边界。</p></header>
      <div class="capability-list" id="capability-list"></div>
      <footer class="rail-footer">本页是独立扩展工作台。现有照片、视频和 R34 冻结版本不被覆盖；所有上传只在当前浏览器内处理。</footer>
    </aside>
    <section class="control-panel" id="control-panel" aria-label="当前能力参数"></section>
    <section class="visual-stage" aria-live="polite">
      <header class="stage-header"><div><span class="stage-eyebrow" id="stage-eyebrow">REAL PIXEL PROCESSING</span><h2 id="stage-title">老照片基础修复</h2></div><div class="stage-meta"><span id="source-meta">等待输入</span><span class="live" id="pipeline-meta">LOCAL</span></div></header>
      <div class="canvas-zone" id="canvas-zone"></div>
      <footer class="stage-footer"><span id="stage-note">载入样例或本地照片开始处理。</span><strong id="fingerprint">PIXEL —</strong></footer>
    </section>
  </main>`

const capabilityList = document.querySelector('#capability-list')
const controlPanel = document.querySelector('#control-panel')
const canvasZone = document.querySelector('#canvas-zone')

function renderCapabilityList() {
  capabilityList.innerHTML = capabilities.map((item) => {
    const [label, cls] = statusLabels[item.status]
    return `<button class="capability-button" type="button" data-capability="${item.id}" aria-pressed="${state.active === item.id}">
      <span><i>${item.index}</i><em class="status-chip ${cls}">${label}</em></span><b>${item.title}</b><small>${item.summary}</small>
    </button>`
  }).join('')
}

function slider(name, label, description, value) {
  return `<div class="control-row"><label class="control-label" for="${name}"><span>${label}</span><output id="${name}-output">${value}</output></label><p>${description}</p><input id="${name}" data-param="${name}" type="range" min="0" max="100" value="${value}" /></div>`
}

function commonInputControls(sampleText) {
  return `<div class="input-actions">
      <button class="action-button" id="load-sample" type="button">${sampleText}</button>
      <label class="upload-dropzone" id="upload-dropzone" data-state="${state.inputStatus}" role="button" tabindex="0" aria-controls="image-upload">
        <input class="native-file-input" id="image-upload" type="file" tabindex="-1" accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp" />
        <strong>选择或拖入图片</strong><small>也可在页面按 Ctrl+V 粘贴</small>
      </label>
    </div>
    <div class="input-feedback" id="input-feedback" data-state="${state.inputStatus}" aria-live="polite"><i></i><span>${state.inputMessage}</span></div>
    <p class="input-note">JPG / JPEG / PNG / WEBP · 单张不超过 20 MB · 浏览器本地解码 · 不上传、不保存路径</p>`
}

function productBoundary(item) {
  if (item.engineType === 'video') return '这是当前实时预览帧 PNG；不包含音频、录像、WebRTC 或虚拟摄像头输出。'
  if (item.id === 'headshot') return '这是职业头像基础版本；尚未执行身份保持换装、换景和复杂发型生成。'
  if (item.id === 'wedding') return '这是单人自然精修基础版本；尚未执行双人逐人参数、婚纱首饰保护和整组一致性。'
  if (item.id === 'commerce') return '这是单张人像基础版本；尚未执行商品区域保护、SKU 色准和批量审核。'
  return '结果来自当前浏览器内的真实底座处理。'
}

function productResultMarkup(item) {
  const result = productResults.get(item.id)
  if (!result) return ''
  return `<article class="product-result-card" data-product-result="${item.id}">
    <div class="product-result-preview"><img src="${result.url}" alt="${item.title}最新基础结果预览" /></div>
    <header><span>DELIVERABLE READY</span><h4>${item.title}最新结果</h4><p>${result.width} × ${result.height} PNG · ${result.source}</p></header>
    <div class="product-result-actions"><button class="action-button" id="download-product-result" type="button">下载结果 PNG</button><button class="secondary-button" id="continue-product-tune" type="button">继续微调</button></div>
    <p class="product-result-boundary">${productBoundary(item)}</p>
  </article>`
}

function bindProductResultActions(item) {
  const result = productResults.get(item.id)
  document.querySelector('#download-product-result')?.addEventListener('click', () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result.url; link.download = result.filename; link.click()
  })
  document.querySelector('#continue-product-tune')?.addEventListener('click', () => {
    const iframe = document.querySelector('#foundation-engine')
    if (!iframe && item.engineRoute) {
      launchFoundation(item)
      return
    }
    document.querySelector('#canvas-zone')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    iframe?.focus()
  })
}

function renderProductResult(item) {
  const slot = document.querySelector('#product-result-slot')
  if (!slot) return
  slot.innerHTML = productResultMarkup(item)
  bindProductResultActions(item)
}

async function storeProductResult(item, blob, source) {
  const previous = productResults.get(item.id)
  if (previous?.url) URL.revokeObjectURL(previous.url)
  let width = 0, height = 0
  try {
    const bitmap = await createImageBitmap(blob)
    width = bitmap.width; height = bitmap.height; bitmap.close()
  } catch { /* Preview remains usable even if dimensions cannot be decoded. */ }
  const result = {
    blob, source, width, height, url: URL.createObjectURL(blob),
    filename: `realhuman-${item.id}-${Date.now()}.png`,
  }
  productResults.set(item.id, result)
  renderProductResult(item)
  return result
}

function renderLiveControls(item) {
  if (item.id === 'restoration') {
    controlPanel.innerHTML = `<header class="control-heading"><span class="eyebrow">${item.index} / RUNNABLE MVP</span><h2>${item.title}</h2><p>${item.description}</p></header>
      ${commonInputControls('载入合成老化样例')}
      <div class="control-group">
        ${slider('fade', '褪色恢复', '拉回被压扁的明暗层次；不会凭空重建丢失纹理。', state.restore.fade)}
        ${slider('neutral', '偏色校正', '降低常见黄褐偏色，向中性色平衡。', state.restore.neutral)}
        ${slider('color', '色彩恢复', '恢复已有颜色的饱和度；不会给黑白照片自动上色。', state.restore.color)}
        ${slider('clean', '基础清洁', '弱化轻颗粒和扫描噪声；划痕、折痕和破损仍需专用修复模型。', state.restore.clean)}
        ${slider('detail', '细节清晰', '回混原图高频细节，避免清洁后过度发糊。', state.restore.detail)}
      </div>
      <div class="tool-actions"><button class="action-button" id="auto-restore" type="button">${item.primaryAction}</button><button class="secondary-button" id="reset-effect" type="button">重置参数</button><button class="secondary-button" id="export-result" type="button" ${state.sourceReady ? '' : 'disabled'}>导出 PNG</button><button class="secondary-button" id="show-original" type="button">按住看原图</button></div>
      <aside class="boundary-card"><strong>当前能力边界</strong>可运行的是基础校色、清洁和清晰度恢复；划痕修补、缺失内容补全、超分与上色尚未接入，页面不会把普通滤镜称作 AI 修复。</aside>`
  } else {
    const presets = [
      ['natural', '自然增强'], ['mono', '黑白胶片'], ['warm', '暖色印刷'], ['cool', '冷调编辑'], ['contrast', '高反差纪实'],
    ]
    controlPanel.innerHTML = `<header class="control-heading"><span class="eyebrow">${item.index} / RUNNABLE MVP</span><h2>${item.title}</h2><p>${item.description}</p></header>
      ${commonInputControls('载入风格测试样例')}
      <div class="control-group"><div class="preset-grid">${presets.map(([id, label]) => `<button class="preset-button" type="button" data-preset="${id}" aria-pressed="${state.style.preset === id}">${label}</button>`).join('')}</div></div>
      <div class="control-group">${slider('intensity', '风格强度', '在原图与风格结果之间连续混合，随时可以回到原图。', state.style.intensity)}</div>
      <div class="tool-actions"><button class="action-button" id="generate-style" type="button">${item.primaryAction}</button><button class="secondary-button" id="reset-effect" type="button">恢复自然</button><button class="secondary-button" id="export-result" type="button" ${state.sourceReady ? '' : 'disabled'}>导出 PNG</button><button class="secondary-button" id="show-original" type="button">按住看原图</button></div>
      <aside class="boundary-card"><strong>当前能力边界</strong>这是本地确定性调色，可真实导出；身份保持换装、换发型、换背景和艺术内容生成仍需新的图像编辑模型。</aside>`
  }
  bindLiveControls()
}

function renderFutureControls(item) {
  const isPhotoProduct = item.engineType === 'photo'
  const existingResult = productResults.get(item.id)
  const productState = item.status === 'model' ? 'blocked-by-model' : existingResult ? 'deliverable-ready' : 'ready'
  const productStateCopy = item.status === 'model'
    ? '需要人体姿态、服饰分割和身份保持试穿模型，当前不生成假结果。'
    : existingResult
      ? `${existingResult.width} × ${existingResult.height} PNG 已保留在当前页面内存，可继续下载或重新生成。`
    : isPhotoProduct
      ? '上传当前照片后直接生成；未上传时使用底座内置技术样例。'
      : '点击后运行本地演示流与会议场景，不会自动请求物理摄像头权限。'
  const productInput = isPhotoProduct ? commonInputControls('载入产品测试样例') : ''
  const fullPage = item.engineRoute ? `/${item.engineType === 'video' ? 'video' : 'photo'}.html` : ''
  controlPanel.innerHTML = `<header class="control-heading"><span class="eyebrow">${item.index} / PRODUCT ENTRY</span><h2>${item.title}</h2><p>${item.description}</p></header>
    ${productInput}
    <section class="product-action-card" data-product-state="${productState}">
      <header><span>ONE CLICK PRODUCT FLOW</span><h3>${item.primaryAction}</h3><p>${productStateCopy}</p></header>
      <ol class="product-steps">${item.productSteps.map((step, index) => `<li data-product-step="${index}" data-state="${item.status === 'model' ? 'blocked' : existingResult ? 'complete' : 'pending'}"><i>${String(index + 1).padStart(2, '0')}</i><span>${step}</span></li>`).join('')}</ol>
      <button class="action-button product-primary-action" id="run-product-action" type="button" ${item.status === 'model' ? 'disabled' : ''}>${item.primaryAction}</button>
      <div class="product-run-status" id="product-run-status" data-state="${productState}" aria-live="polite"><i></i><span><strong>${item.status === 'model' ? '等待专用模型' : existingResult ? '最新结果仍可下载' : '准备就绪'}</strong><small>${productStateCopy}</small></span></div>
    </section>
    <div id="product-result-slot">${productResultMarkup(item)}</div>
    <details class="product-details">
      <summary>查看底座复用、能力缺口与实现说明</summary>
      <div class="future-control">
        <article><span>REUSABLE FOUNDATION</span><h3>现有底座可以复用</h3><ul>${item.reuse.map((x) => `<li>${x}</li>`).join('')}</ul></article>
        <article><span>CAPABILITY GAP</span><h3>还缺少的专用能力</h3><ul>${item.missing.map((x) => `<li>${x}</li>`).join('')}</ul></article>
        <article><span>NEXT IMPLEMENTATION</span><h3>推荐的下一接入动作</h3><p>${item.next}</p></article>
      </div>
      ${item.engineRoute ? `<div class="foundation-actions"><button class="secondary-button" id="launch-foundation" type="button">只查看共享底座</button><a class="secondary-button" href="${fullPage}">进入完整${item.engineType === 'video' ? '视频' : '照片'}场景页 ↗</a></div>` : ''}
    </details>
    <aside class="boundary-card"><strong>交付边界</strong>${item.status === 'model' ? '该产品必须先接入专用模型，当前入口保持停用，不用滤镜或预生成图伪装成已实现。' : `主按钮会真实运行现有底座并形成${isPhotoProduct ? '单张基础结果' : '本地实时预览'}；${item.missing.join('、')}仍会明确标为未执行。`}</aside>`
  if (isPhotoProduct) bindLiveControls()
  document.querySelector('#run-product-action')?.addEventListener('click', () => runProductAction(item))
  document.querySelector('#launch-foundation')?.addEventListener('click', () => launchFoundation(item))
  bindProductResultActions(item)
}

function emptyStage(copy = '载入样例或本地图片后，这里会显示同一张图的真实前后像素对比。') {
  canvasZone.innerHTML = `<div class="empty-stage"><i>INPUT</i><h3>等待一张图片</h3><p>${copy}</p></div>`
}

function renderFutureStage(item) {
  const status = statusLabels[item.status][0]
  const stageState = item.status === 'model' ? 'NOT A FAKE DEMO' : 'BASE FLOW READY · PRODUCT GAP VISIBLE'
  canvasZone.innerHTML = `<div class="future-stage">
    <section class="future-hero"><span>${status.toUpperCase()} · ${stageState}</span><h3>${item.title}</h3><p>${item.description}</p></section>
    <div class="future-grid"><article><small>01 / FOUNDATION</small><strong>复用已有底座</strong><p>${item.reuse.join('、')}。</p></article><article><small>02 / NEW CAPABILITY</small><strong>接入专用模型</strong><p>${item.missing.join('、')}。</p></article><article><small>03 / PRODUCT LOOP</small><strong>形成业务交付</strong><p>${item.next}</p></article></div>
  </div>`
  document.querySelector('#stage-note').textContent = item.status === 'model' ? '当前展示产品架构和接入边界；未运行或伪造模型结果。' : '点击左侧产品主按钮，网页会运行真实共享底座并显示完成步骤与专属能力缺口。'
  document.querySelector('#fingerprint').textContent = item.status === 'model' ? 'STATUS · MODEL REQUIRED' : 'STATUS · BASE READY'
}

let foundationLoadRevision = 0

function setProductStepState(index, value) {
  document.querySelector(`[data-product-step="${index}"]`)?.setAttribute('data-state', value)
}

function updateProductRun(runState, title, detail, activeStep = null) {
  const card = document.querySelector('.product-action-card')
  const status = document.querySelector('#product-run-status')
  const action = document.querySelector('#run-product-action')
  if (card) card.dataset.productState = runState
  if (status) {
    status.dataset.state = runState
    status.querySelector('strong').textContent = title
    status.querySelector('small').textContent = detail
  }
  if (action) action.disabled = runState === 'running' || runState === 'blocked-by-model'
  if (activeStep !== null) {
    document.querySelectorAll('[data-product-step]').forEach((step) => {
      const index = Number(step.dataset.productStep)
      step.dataset.state = index < activeStep ? 'complete' : index === activeStep ? 'running' : 'pending'
    })
  }
}

function waitForEngine(check, timeout = 24000, interval = 160) {
  return new Promise((resolve, reject) => {
    const startedAt = performance.now()
    const poll = () => {
      try {
        const result = check()
        if (result) return resolve(result)
      } catch (error) {
        return reject(error)
      }
      if (performance.now() - startedAt > timeout) return reject(new Error('底座处理等待超时'))
      window.setTimeout(poll, interval)
    }
    poll()
  })
}

function runProductAction(item) {
  if (!item.engineRoute || item.status === 'model') return
  updateProductRun('running', '正在启动产品流程', `即将运行${item.title}的真实底座步骤。`, 0)
  launchFoundation(item, { autoRun: true })
}

async function capturePhotoDelivery(item, doc, win) {
  const exportButton = await waitForEngine(() => {
    const button = doc.querySelector('#export-photo')
    const canvas = doc.querySelector('#after-canvas')
    return button && !button.disabled && canvas?.width > 0 && canvas?.height > 0 ? button : false
  }, 24000)
  const anchorPrototype = win.HTMLAnchorElement.prototype
  const originalClick = anchorPrototype.click
  let capturedHref = ''
  anchorPrototype.click = function captureProductExport() { capturedHref = this.href }
  try {
    exportButton.click()
  } finally {
    anchorPrototype.click = originalClick
  }
  if (!capturedHref) throw new Error('照片底座没有返回可交付 PNG')
  const response = await fetch(capturedHref)
  if (!response.ok) throw new Error('照片结果转换失败')
  return storeProductResult(item, await response.blob(), `冻结底座 · ${item.exportSpec === 'avatar' ? '头像规格' : '原始规格'}`)
}

async function captureVideoDelivery(item, doc, win) {
  const captureButton = doc.querySelector('#capture-realtime-frame')
  if (!captureButton || captureButton.disabled) throw new Error('实时底座当前帧尚未就绪')
  const anchorPrototype = win.HTMLAnchorElement.prototype
  const originalClick = anchorPrototype.click
  const originalCreateObjectURL = win.URL.createObjectURL
  let capturedBlob = null
  anchorPrototype.click = function captureFrameDownload() {}
  win.URL.createObjectURL = function captureFrameBlob(value) {
    if (value instanceof win.Blob && value.type === 'image/png') capturedBlob = value
    return originalCreateObjectURL.call(win.URL, value)
  }
  try {
    captureButton.click()
    await waitForEngine(() => capturedBlob, 8000, 40)
  } finally {
    anchorPrototype.click = originalClick
    win.URL.createObjectURL = originalCreateObjectURL
  }
  if (!capturedBlob) throw new Error('实时底座没有返回当前帧 PNG')
  return storeProductResult(item, capturedBlob, '本地实时预览 · 当前帧')
}

async function runPhotoProduct(item, iframe, revision) {
  const doc = iframe.contentDocument
  const win = iframe.contentWindow
  if (!doc || !win || revision !== foundationLoadRevision) return

  updateProductRun('running', '正在读取照片', state.sourceFile ? `把 ${state.sourceLabel} 交给照片底座。` : '未选择新照片，使用底座内置技术样例。', 0)
  if (state.sourceKind === 'upload' && state.sourceFile) {
    const input = doc.querySelector('#photo-input')
    if (!input) throw new Error('照片底座缺少输入控件')
    const transferable = new win.File([state.sourceFile], state.sourceFile.name || 'product-input.png', { type: state.sourceFile.type || 'image/png' })
    const transfer = new win.DataTransfer()
    transfer.items.add(transferable)
    input.files = transfer.files
    input.dispatchEvent(new win.Event('change', { bubbles: true }))
  } else {
    const sample = doc.querySelector('#load-sample')
    if (!sample) throw new Error('照片底座缺少技术样例入口')
    sample.click()
  }

  updateProductRun('running', '正在识别人脸与皮肤', '等待真实检测、分割和首帧渲染完成。', 1)
  await waitForEngine(() => {
    if (revision !== foundationLoadRevision) throw new Error('产品流程已切换')
    const canvas = doc.querySelector('#after-canvas')
    const exportButton = doc.querySelector('#export-photo')
    const faceControl = doc.querySelector('#skinRetouch')
    return canvas?.width > 0 && canvas?.height > 0 && exportButton && !exportButton.disabled && faceControl && !faceControl.disabled
  })

  updateProductRun('running', `正在应用${item.title}策略`, '写入该产品自己的模板、参数和输出规格。', 2)
  const template = doc.querySelector(`[data-template="${item.template}"]`)
  if (!template) throw new Error(`照片底座缺少 ${item.template} 模板`)
  template.click()
  Object.entries(item.overrides || {}).forEach(([name, value]) => {
    const input = doc.querySelector(`#${name}`)
    if (!input || input.disabled) return
    input.value = String(value)
    input.dispatchEvent(new win.Event('input', { bubbles: true }))
    input.dispatchEvent(new win.Event('change', { bubbles: true }))
  })
  const exportSpec = doc.querySelector('#export-spec')
  if (exportSpec) {
    exportSpec.value = item.exportSpec
    exportSpec.dispatchEvent(new win.Event('change', { bubbles: true }))
  }
  await new Promise((resolve) => window.setTimeout(resolve, 700))
  if (revision !== foundationLoadRevision) return

  updateProductRun('running', '正在形成基础交付结果', '校验处理后画布和产品输出规格。', 3)
  const canvas = doc.querySelector('#after-canvas')
  if (!canvas?.width || !canvas?.height) throw new Error('照片底座没有生成有效结果画布')
  const fingerprint = fingerprintCanvas(canvas)
  updateProductRun('running', '正在准备可下载结果', '复用冻结底座现有导出与智能裁切，不复制裁切算法。', 3)
  const result = await capturePhotoDelivery(item, doc, win)
  setProductStepState(3, 'complete')
  updateProductRun('deliverable-ready', '结果已生成，可直接下载', `${result.width} × ${result.height} PNG 已保留在当前页面内存；${item.missing.join('、')}尚未执行。`)
  document.querySelector('#stage-note').textContent = `${item.title}基础版本已由真实 R34 底座生成并准备下载；场景专属模型能力仍按产品边界保留。`
  document.querySelector('#fingerprint').textContent = `BASE ${fingerprint}`
}

async function runVideoProduct(item, iframe, revision) {
  const doc = iframe.contentDocument
  if (!doc || revision !== foundationLoadRevision) return
  updateProductRun('running', '正在启动本地演示流', '只运行合成技术流，不请求物理摄像头权限。', 0)
  const demo = doc.querySelector('#start-demo-stream')
  if (!demo) throw new Error('实时底座缺少本地演示流入口')
  demo.click()

  updateProductRun('running', '正在检测并连续跟踪', '等待实时画面、人物检测和动态调度就绪。', 1)
  const scenario = await waitForEngine(() => {
    if (revision !== foundationLoadRevision) throw new Error('产品流程已切换')
    const target = doc.querySelector(`[data-realtime-scenario="${item.scenario}"]`)
    return target && !target.disabled ? target : false
  }, 30000)
  scenario.click()

  updateProductRun('running', '正在应用会议补光与背景', '由实时底座组合补光、追踪和会议场景参数。', 2)
  await waitForEngine(() => {
    const output = doc.querySelector('#realtime-output-canvas')
    return scenario.getAttribute('aria-pressed') === 'true' && output?.width > 0 && output?.height > 0
  }, 20000)
  if (revision !== foundationLoadRevision) return
  updateProductRun('running', '正在形成实时预览', '确认场景已写入当前本地视频流。', 3)
  await new Promise((resolve) => window.setTimeout(resolve, 260))
  const result = await captureVideoDelivery(item, doc, iframe.contentWindow)
  setProductStepState(3, 'complete')
  updateProductRun('deliverable-ready', '会议效果已运行，当前帧可下载', `${result.width} × ${result.height} PNG 已保留在当前页面内存；虚拟摄像头、录制和会议软件输出尚未接入。`)
  document.querySelector('#stage-note').textContent = '会议演示效果正在真实实时底座中运行；当前帧已准备下载，且未请求物理摄像头权限。'
  document.querySelector('#fingerprint').textContent = 'LIVE PRODUCT · MEETING'
}

async function runFoundationProduct(item, iframe, revision) {
  try {
    if (item.engineType === 'video') await runVideoProduct(item, iframe, revision)
    else await runPhotoProduct(item, iframe, revision)
  } catch (error) {
    if (revision !== foundationLoadRevision) return
    updateProductRun('error', '基础版本未生成', `${error.message || '底座运行失败'}；没有伪造结果。`)
    document.querySelector('#stage-note').textContent = `${item.title}运行失败：${error.message || '未知错误'}。`
    document.querySelector('#fingerprint').textContent = 'STATUS · ERROR'
  }
}

function launchFoundation(item, { autoRun = false } = {}) {
  if (!item.engineRoute) return
  const revision = ++foundationLoadRevision
  let autoStarted = false
  const engineUrl = appUrl(`engine/r34/index.html#${item.engineRoute}`)
  canvasZone.innerHTML = `<div class="engine-stage" data-engine-type="${item.engineType}">
    <div class="engine-stage-bar"><span><i></i>真实 ${item.engineType === 'video' ? '摄像头' : '照片'}底座正在载入</span><div><button id="return-foundation-plan" type="button">返回接入说明</button><a href="${engineUrl}" target="_blank" rel="noreferrer">独立打开 ↗</a></div></div>
    <div class="engine-stage-loading" id="engine-stage-loading"><i></i><span>正在载入 R34 冻结能力引擎</span></div>
    <iframe id="foundation-engine" title="${item.title}共享能力底座" allow="camera" src="${engineUrl}"></iframe>
  </div>`
  document.querySelector('#return-foundation-plan').addEventListener('click', () => renderFutureStage(item))
  const iframe = document.querySelector('#foundation-engine')
  const loading = document.querySelector('#engine-stage-loading')
  const align = () => {
    if (revision !== foundationLoadRevision || !iframe?.contentDocument) return false
    try {
      const doc = iframe.contentDocument
      const target = doc.querySelector(item.engineType === 'video' ? '.realtime-workspace' : '.photo-workspace')
      if (!target) return false
      const embeddedSkipLink = doc.querySelector('.skip-link')
      if (embeddedSkipLink) embeddedSkipLink.style.display = 'none'
      const previous = doc.documentElement.style.scrollBehavior
      doc.documentElement.style.scrollBehavior = 'auto'
      iframe.contentWindow.scrollTo(0, target.getBoundingClientRect().top + iframe.contentWindow.scrollY)
      window.setTimeout(() => { doc.documentElement.style.scrollBehavior = previous }, 50)
      return true
    } catch { return false }
  }
  iframe.addEventListener('load', () => {
    if (revision !== foundationLoadRevision) return
    const settle = () => {
      if (align()) {
        loading.hidden = true
        document.querySelector('.engine-stage-bar span').innerHTML = `<i></i>真实 ${item.engineType === 'video' ? '摄像头' : '照片'}底座已运行`
        if (!autoRun || !autoStarted) {
          document.querySelector('#stage-note').textContent = `${item.title}正在复用 R34 ${item.engineType === 'video' ? '实时摄像头' : '单人人像'}底座；场景专属缺口仍按左侧说明保留。`
          document.querySelector('#fingerprint').textContent = `LIVE FOUNDATION · ${item.engineType.toUpperCase()}`
        }
        if (autoRun && !autoStarted) {
          autoStarted = true
          runFoundationProduct(item, iframe, revision)
        }
      }
    }
    settle(); window.setTimeout(settle, 180); window.setTimeout(settle, 700)
  })
}

function renderCanvasStage() {
  if (!state.sourceReady) return emptyStage()
  canvasZone.innerHTML = `<div class="compare-frame" id="compare-frame">
    <canvas id="original-canvas" aria-label="处理前图像"></canvas>
    <div class="result-layer" id="result-layer"><canvas id="result-canvas" aria-label="处理后图像"></canvas></div>
    <div class="compare-divider" id="compare-divider"></div>
    <input class="compare-range" id="compare-range" type="range" min="0" max="100" value="${state.compare}" aria-label="拖动查看处理前后对比" />
  </div>`
  originalCanvas = document.querySelector('#original-canvas')
  resultCanvas = document.querySelector('#result-canvas')
  const frame = document.querySelector('#compare-frame')
  frame.style.aspectRatio = `${state.width} / ${state.height}`
  ;[originalCanvas, resultCanvas].forEach((canvas) => { canvas.width = state.width; canvas.height = state.height })
  originalCanvas.getContext('2d').drawImage(sourceCanvas, 0, 0)
  document.querySelector('#compare-range').addEventListener('input', (event) => {
    state.compare = Number(event.target.value); updateCompare()
  })
  updateCompare()
  scheduleRender()
}

function updateCompare() {
  const layer = document.querySelector('#result-layer')
  const divider = document.querySelector('#compare-divider')
  if (!layer || !divider) return
  layer.style.clipPath = `inset(0 ${100 - state.compare}% 0 0)`
  divider.style.left = `${state.compare}%`
}

function bindLiveControls() {
  document.querySelector('#load-sample')?.addEventListener('click', () => loadSample(state.active === 'restoration'))
  const imageUpload = document.querySelector('#image-upload')
  imageUpload?.addEventListener('change', handleUpload)
  imageUpload?.addEventListener('keydown', (event) => {
    if (event.code !== 'Enter' && event.code !== 'Space') return
    event.preventDefault()
    imageUpload.click()
  })
  const dropzone = document.querySelector('#upload-dropzone')
  ;['dragenter', 'dragover'].forEach((type) => dropzone?.addEventListener(type, (event) => {
    event.preventDefault(); event.stopPropagation(); dropzone.dataset.drag = 'true'
  }))
  ;['dragleave', 'dragend'].forEach((type) => dropzone?.addEventListener(type, (event) => {
    event.preventDefault(); event.stopPropagation(); dropzone.dataset.drag = 'false'
  }))
  dropzone?.addEventListener('drop', (event) => {
    event.preventDefault(); event.stopPropagation(); dropzone.dataset.drag = 'false'
    const file = [...(event.dataTransfer?.files || [])].find((item) => isSupportedImage(item))
    if (file) ingestFile(file, '拖放')
    else setInputStatus('error', '没有找到可读取的 JPG、PNG 或 WEBP 图片。')
  })
  dropzone?.addEventListener('keydown', (event) => {
    if (event.code !== 'Enter' && event.code !== 'Space') return
    event.preventDefault()
    imageUpload?.click()
  })
  document.querySelectorAll('[data-param]').forEach((input) => input.addEventListener('input', (event) => {
    const name = event.target.dataset.param
    const value = Number(event.target.value)
    if (state.active === 'restoration') state.restore[name] = value
    else state.style[name] = value
    document.querySelector(`#${name}-output`).textContent = value
    scheduleRender()
  }))
  document.querySelectorAll('[data-preset]').forEach((button) => button.addEventListener('click', () => {
    state.style.preset = button.dataset.preset
    document.querySelectorAll('[data-preset]').forEach((node) => node.setAttribute('aria-pressed', String(node === button)))
    scheduleRender()
  }))
  document.querySelector('#auto-restore')?.addEventListener('click', () => {
    state.restore = { ...restoreDefaults }; renderActiveControls(); scheduleRender()
  })
  document.querySelector('#generate-style')?.addEventListener('click', () => {
    state.style = { preset: 'warm', intensity: 68 }; renderActiveControls(); scheduleRender()
  })
  document.querySelector('#reset-effect')?.addEventListener('click', () => {
    if (state.active === 'restoration') state.restore = { fade: 0, neutral: 0, color: 0, clean: 0, detail: 0 }
    else state.style = { ...styleDefaults, preset: 'natural', intensity: 0 }
    renderActiveControls(); scheduleRender()
  })
  document.querySelector('#export-result')?.addEventListener('click', exportResult)
  const originalButton = document.querySelector('#show-original')
  const showOriginal = () => { state.compare = 0; const range = document.querySelector('#compare-range'); if (range) range.value = 0; updateCompare() }
  const restoreCompare = () => { state.compare = 56; const range = document.querySelector('#compare-range'); if (range) range.value = 56; updateCompare() }
  originalButton?.addEventListener('pointerdown', showOriginal)
  originalButton?.addEventListener('pointerup', restoreCompare)
  originalButton?.addEventListener('pointerleave', restoreCompare)
  originalButton?.addEventListener('keydown', (event) => { if (event.code === 'Space' || event.code === 'Enter') showOriginal() })
  originalButton?.addEventListener('keyup', restoreCompare)
}

function renderActiveControls() {
  const item = capabilities.find(({ id }) => id === state.active)
  document.querySelector('#stage-title').textContent = item.title
  document.querySelector('#stage-eyebrow').textContent = item.status === 'live' ? 'REAL PIXEL PROCESSING' : 'PRODUCT CAPABILITY PLAN'
  document.querySelector('#pipeline-meta').textContent = item.status === 'live' ? 'LOCAL · NO UPLOAD' : statusLabels[item.status][0].toUpperCase()
  document.querySelector('#pipeline-meta').className = item.status === 'live' ? 'live' : ''
  if (item.status === 'live') {
    renderLiveControls(item)
    if (state.sourceReady) renderCanvasStage(); else emptyStage()
    document.querySelector('#stage-note').textContent = state.sourceReady ? `${state.sourceLabel} · 拖动分界线核对处理范围。` : '载入样例或本地照片开始处理。'
  } else {
    renderFutureControls(item); renderFutureStage(item)
  }
  updateSourceMeta()
}

function selectCapability(id) {
  foundationLoadRevision += 1
  state.active = id
  renderCapabilityList()
  renderActiveControls()
}

capabilityList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-capability]')
  if (button) selectCapability(button.dataset.capability)
})

function sizeForImage(image) {
  const max = 1400
  const scale = Math.min(1, max / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height))
  return [Math.round((image.naturalWidth || image.width) * scale), Math.round((image.naturalHeight || image.height) * scale)]
}

function canvasFromImage(image, aged = false) {
  const [width, height] = sizeForImage(image)
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (aged) {
    ctx.filter = 'grayscale(.32) sepia(.64) contrast(.76) brightness(1.08) saturate(.72)'
    ctx.drawImage(image, 0, 0, width, height)
    ctx.filter = 'none'; ctx.fillStyle = 'rgba(178,126,60,.11)'; ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(246,225,176,.22)'; ctx.lineWidth = Math.max(1, width / 900)
    const lines = [[.14,.08,.12,.86],[.63,.02,.66,.55],[.82,.2,.79,.92]]
    lines.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(width*x1,height*y1); ctx.lineTo(width*x2,height*y2); ctx.stroke() })
  } else ctx.drawImage(image, 0, 0, width, height)
  return canvas
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src
  })
}

async function loadSample(aged) {
  setInputStatus('decoding', '正在生成本地技术样例…')
  try {
    const image = await loadImage(appUrl('assets/portrait-sample.webp'))
    sourceCanvas = canvasFromImage(image, aged)
    state.sourceReady = true; state.sourceKind = 'sample'; state.sourceLabel = aged ? '合成老化技术样例' : '本地风格测试样例'
    state.sourceBytes = 0; state.sourceOrigin = '内置样例'; state.sourceFile = null
    state.width = sourceCanvas.width; state.height = sourceCanvas.height
    state.inputStatus = 'ready'; state.inputMessage = `${state.sourceLabel} 已就绪，可调节参数并导出。`
    renderActiveControls()
  } catch {
    setInputStatus('error', '样例载入失败，请选择、拖入或粘贴一张本地图片。')
  }
}

const maximumImageBytes = 20 * 1024 * 1024

function isSupportedImage(file) {
  if (!file) return false
  if (/^image\/(jpeg|png|webp)$/i.test(file.type)) return true
  return /\.(jpe?g|png|webp)$/i.test(file.name || '')
}

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function setInputStatus(status, message) {
  state.inputStatus = status; state.inputMessage = message
  const feedback = document.querySelector('#input-feedback')
  const dropzone = document.querySelector('#upload-dropzone')
  if (feedback) { feedback.dataset.state = status; feedback.querySelector('span').textContent = message }
  if (dropzone) dropzone.dataset.state = status
}

async function ingestFile(file, origin = '文件选择') {
  if (!isSupportedImage(file)) {
    setInputStatus('error', '格式不支持。请选择 JPG、JPEG、PNG 或 WEBP 图片；上一张有效图片仍保留。')
    return false
  }
  if (file.size > maximumImageBytes) {
    setInputStatus('error', `图片为 ${formatBytes(file.size)}，超过 20 MB；请压缩后重试，上一张有效图片仍保留。`)
    return false
  }
  setInputStatus('decoding', `正在读取 ${file.name || '剪贴板图片'}…`)
  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    sourceCanvas = canvasFromImage(image, false)
    state.sourceReady = true; state.sourceKind = 'upload'; state.sourceLabel = file.name || `clipboard-${Date.now()}.png`
    state.sourceBytes = file.size; state.sourceOrigin = origin; state.sourceFile = file
    state.width = sourceCanvas.width; state.height = sourceCanvas.height
    state.inputStatus = 'ready'; state.inputMessage = `${state.sourceLabel} 已通过${origin}读取：${state.width}×${state.height}${file.size ? ` · ${formatBytes(file.size)}` : ''}。`
    renderActiveControls()
    return true
  } catch {
    setInputStatus('error', '图片文件无法解码，可能已损坏；上一张有效图片仍保留。')
    return false
  } finally { URL.revokeObjectURL(url) }
}

async function handleUpload(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (file) await ingestFile(file, '文件选择')
}

function updateSourceMeta() {
  const meta = document.querySelector('#source-meta')
  if (!meta) return
  meta.textContent = state.sourceReady ? `${state.width}×${state.height} · ${state.sourceKind === 'upload' ? `${state.sourceOrigin}${state.sourceBytes ? ` · ${formatBytes(state.sourceBytes)}` : ''}` : '技术样例'}` : '等待输入'
}

function drawRestoration() {
  const ctx = resultCanvas.getContext('2d', { willReadFrequently: true })
  const { fade, neutral, color, clean, detail } = state.restore
  ctx.clearRect(0, 0, state.width, state.height)
  ctx.filter = `contrast(${1 + fade * .005}) brightness(${1 - fade * .0006}) saturate(${1 + color * .006})`
  ctx.drawImage(sourceCanvas, 0, 0)
  ctx.filter = 'none'
  if (neutral > 0) {
    const image = ctx.getImageData(0, 0, state.width, state.height)
    const n = neutral / 100
    for (let i = 0; i < image.data.length; i += 4) {
      const r = image.data[i], g = image.data[i + 1], b = image.data[i + 2]
      const warmth = Math.max(0, (r + g) * .5 - b)
      image.data[i] = Math.max(0, r - warmth * .12 * n)
      image.data[i + 1] = Math.max(0, g - warmth * .035 * n)
      image.data[i + 2] = Math.min(255, b + warmth * .22 * n)
    }
    ctx.putImageData(image, 0, 0)
  }
  if (clean > 0) {
    const soft = document.createElement('canvas'); soft.width = state.width; soft.height = state.height
    const softCtx = soft.getContext('2d'); softCtx.filter = `blur(${(.25 + clean * .012).toFixed(2)}px)`; softCtx.drawImage(resultCanvas, 0, 0)
    ctx.save(); ctx.globalAlpha = Math.min(.42, clean * .0042); ctx.drawImage(soft, 0, 0); ctx.restore()
  }
  if (detail > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(.28, detail * .0028); ctx.filter = `contrast(${1 + detail * .004})`; ctx.drawImage(sourceCanvas, 0, 0); ctx.restore(); ctx.filter = 'none'
  }
}

const styleFilters = {
  natural: 'contrast(1.04) saturate(1.05)',
  mono: 'grayscale(1) contrast(1.16) brightness(.98)',
  warm: 'sepia(.28) saturate(1.18) contrast(1.06) brightness(1.02)',
  cool: 'saturate(.84) contrast(1.09) hue-rotate(184deg) hue-rotate(-174deg)',
  contrast: 'grayscale(.18) contrast(1.32) saturate(.86)',
}

function drawStyle() {
  const ctx = resultCanvas.getContext('2d')
  const intensity = state.style.intensity / 100
  ctx.clearRect(0, 0, state.width, state.height); ctx.drawImage(sourceCanvas, 0, 0)
  ctx.save(); ctx.globalAlpha = intensity; ctx.filter = styleFilters[state.style.preset] || styleFilters.natural; ctx.drawImage(sourceCanvas, 0, 0); ctx.restore()
  if (state.style.preset === 'warm' && intensity > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .12 * intensity; ctx.fillStyle = '#e4a45f'; ctx.fillRect(0, 0, state.width, state.height); ctx.restore()
  }
  if (state.style.preset === 'cool' && intensity > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .1 * intensity; ctx.fillStyle = '#6aa8bd'; ctx.fillRect(0, 0, state.width, state.height); ctx.restore()
  }
}

function fingerprintCanvas(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const width = Math.min(64, canvas.width), height = Math.min(64, canvas.height)
  const sample = document.createElement('canvas'); sample.width = width; sample.height = height
  sample.getContext('2d').drawImage(canvas, 0, 0, width, height)
  const data = sample.getContext('2d').getImageData(0, 0, width, height).data
  let hash = 2166136261
  for (let i = 0; i < data.length; i += 8) { hash ^= data[i]; hash = Math.imul(hash, 16777619) }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

function scheduleRender() {
  if (!state.sourceReady || !resultCanvas || !['restoration', 'style'].includes(state.active)) return
  const token = ++renderToken
  requestAnimationFrame(() => {
    if (token !== renderToken || !resultCanvas) return
    if (state.active === 'restoration') drawRestoration(); else drawStyle()
    state.fingerprint = fingerprintCanvas(resultCanvas)
    document.querySelector('#fingerprint').textContent = `PIXEL ${state.fingerprint}`
    document.querySelector('#stage-note').textContent = `${state.sourceLabel} · 结果来自当前浏览器的真实像素处理，可拖动比较并导出。`
    updateSourceMeta()
  })
}

function exportResult() {
  if (!resultCanvas) return
  resultCanvas.toBlob((blob) => {
    if (!blob) return
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob)
    link.download = `realhuman-${state.active}-${Date.now()}.png`; link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }, 'image/png')
}

renderCapabilityList()
renderActiveControls()
loadSample(true)

document.addEventListener('paste', (event) => {
  const activeItem = capabilities.find(({ id }) => id === state.active)
  if (!['restoration', 'style'].includes(state.active) && activeItem?.engineType !== 'photo') return
  const item = [...(event.clipboardData?.items || [])].find((entry) => entry.kind === 'file' && entry.type.startsWith('image/'))
  const file = item?.getAsFile()
  if (!file) return
  event.preventDefault()
  ingestFile(file, '剪贴板')
})

window.addEventListener('beforeunload', () => {
  productResults.forEach((result) => { if (result.url) URL.revokeObjectURL(result.url) })
})
