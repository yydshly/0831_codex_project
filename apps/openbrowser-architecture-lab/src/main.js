const architectureLayers = [
  {
    id: 'product',
    index: '05',
    eyebrow: 'PRODUCT SURFACE',
    title: '产品与操作层',
    summary: 'Electron 界面把环境、代理、扩展、窗口同步和任务管理组织成桌面产品。',
    interface: 'Renderer → trusted IPC → Electron Main',
    responsibilities: ['环境列表与配置编辑', '浏览器启停与窗口管理', '自动化计划、任务和日志入口'],
    value: '让浏览器能力成为普通用户可操作的产品，而不只是开发脚本。',
    boundary: 'UI 不是安全边界；真正的权限必须继续在主进程和服务层校验。',
  },
  {
    id: 'control',
    index: '04',
    eyebrow: 'CONTROL PLANE',
    title: 'Local API 与 MCP 控制面',
    summary: 'Local API 统一承接 Profile、代理、RPA 和同步；MCP 再把这些接口映射为 Agent 可发现的工具。',
    interface: 'MCP stdio JSON-RPC → HTTP 127.0.0.1:50325',
    responsibilities: ['50 个 MCP 工具', '工具级 read/run/manage/admin 过滤', '本地 API Key、CORS 与请求体限制'],
    value: 'UI、脚本和 AI Agent 可以复用同一业务入口。',
    boundary: 'MCP 工具过滤不等于服务端 RBAC；拿到 Local API Key 仍可能绕过 MCP 权限。',
  },
  {
    id: 'automation',
    index: '03',
    eyebrow: 'AUTOMATION',
    title: 'RPA 与任务状态层',
    summary: '步骤 DSL 将导航、点击、输入、等待、提取、条件和文件动作解释为 CDP 或本地操作。',
    interface: 'Plan → Task(profile) → sequential steps → result/log',
    responsibilities: ['变量插值与控制流', '按 Profile 展开并行任务', '任务日志、结果与本地 JSON 持久化'],
    value: '把一次性浏览器脚本提升为可保存、复用和追踪的任务。',
    boundary: '当前状态流较轻量，取消、重试、租约和崩溃恢复还不是生产级工作流语义。',
  },
  {
    id: 'browser',
    index: '02',
    eyebrow: 'BROWSER RUNTIME',
    title: 'Chromium 与 CDP 执行层',
    summary: '真正加载网页、执行 JavaScript 和保存浏览器状态的是 Chromium；CDP 是外部控制通道。',
    interface: 'Browser/Page Target ↔ flattened CDP Sessions',
    responsibilities: ['随机回环调试端口', 'Target 自动附加与文档前注入', 'Page / Runtime / Input / Network / Storage'],
    value: '无需重写浏览器内核，就能获得标签页、iframe、Worker 和输入控制。',
    boundary: 'CDP 权限接近浏览器级远程控制，只应暴露在受信本机边界内。',
  },
  {
    id: 'system',
    index: '01',
    eyebrow: 'SYSTEM RESOURCES',
    title: 'Profile、进程与网络资源层',
    summary: '每个环境拥有独立数据目录、缓存、崩溃目录、进程锁、代理链路和 Chromium 进程。',
    interface: 'profileRoot + lock + browser PID + proxy bridge',
    responsibilities: ['Cookie、LocalStorage、IndexedDB 等持久状态', '原子 Profile 锁与生命周期屏障', '代理、出口检测和独立进程清理'],
    value: '这一层让“多个浏览器环境”不只是多个窗口，而是可持久、可回收的资源单元。',
    boundary: '目录隔离能分开本地状态，但不能自动消除 IP、行为、账号关系和服务端历史关联。',
  },
]

const lifecycleSteps = [
  {
    id: 'configure',
    number: '01',
    title: '定义环境',
    verb: 'CONFIGURE',
    detail: '保存 Profile ID、代理、语言、分辨率、启动页、扩展以及静态/动态环境配置。',
    invariant: '同一 Profile 的确定性种子与持久状态保持稳定。',
    output: 'Sanitized Profile',
  },
  {
    id: 'lock',
    number: '02',
    title: '验证并加锁',
    verb: 'ACQUIRE',
    detail: '检查数据根、Profile ID、符号链接与系统浏览器目录，再用 `wx` 原子创建实例锁。',
    invariant: '同一 Profile 同一时刻只能由一个浏览器实例持有。',
    output: 'Ownership token',
  },
  {
    id: 'launch',
    number: '03',
    title: '启动 Chromium',
    verb: 'LAUNCH',
    detail: '传入独立 user-data-dir、缓存、代理、扩展和 `--remote-debugging-port=0`，创建真实 Chromium 进程。',
    invariant: '不回退到用户正在使用的系统浏览器 Profile。',
    output: 'Browser PID',
  },
  {
    id: 'discover',
    number: '04',
    title: '发现 CDP',
    verb: 'DISCOVER',
    detail: '读取 DevToolsActivePort，并通过 `/json/version`、`/json/list` 获取 Browser 与 Page WebSocket。',
    invariant: '端口随机、仅回环可达，并与当前 Profile 运行记录绑定。',
    output: 'CDP endpoint',
  },
  {
    id: 'prepare',
    number: '05',
    title: '注入并放行',
    verb: 'PREPARE',
    detail: '自动附加 Page、iframe 和 Worker，在新文档运行前应用 UA、时区、地理位置和初始化脚本。',
    invariant: '环境配置先于页面业务脚本观察浏览器属性。',
    output: 'Ready sessions',
  },
  {
    id: 'operate',
    number: '06',
    title: '人工或自动化操作',
    verb: 'OPERATE',
    detail: '人工浏览、窗口同步和 RPA 最终都作用于同一 Chromium 进程；停止时清理进程树、代理与锁。',
    invariant: '控制面共用执行面，停止完成后才能再次启动同一 Profile。',
    output: 'Result + cleanup',
  },
]

const valueScenarios = [
  {
    id: 'agent',
    label: 'AI 浏览器执行器',
    code: 'AGENT RUNTIME',
    title: '把模型的计划落到受控浏览器执行面',
    trigger: '我们需要 AI 在本机持久登录、操作内部系统，并让调用能力可以发现、限制和审计。',
    reuse: ['Profile 生命周期', 'CDP Action 抽象', 'Local API / MCP 适配', '任务结果与 artifact'],
    first: '先做只读域名白名单、短期 token 和异步任务接口，再增加写操作审批。',
    avoid: '不要把全权限 Local API Key 或任意页面 JavaScript 直接长期交给模型。',
    decision: '高参考价值',
  },
  {
    id: 'qa',
    label: '企业多环境 QA',
    code: 'QA MATRIX',
    title: '稳定保存多组测试账号与地区化环境',
    trigger: '同一产品需要同时验证多个租户、权限角色、语言、时区、分辨率或代理出口。',
    reuse: ['Profile 数据隔离', '确定性测试 persona', '随机 CDP 端口', '隔离审计与清理'],
    first: '建立授权测试账号、测试矩阵、可回收 Profile 和固定 Chromium 版本。',
    avoid: '不要把“不同测试环境”包装成真实设备或真实用户身份。',
    decision: '高参考价值',
  },
  {
    id: 'rpa',
    label: '浏览器 RPA 平台',
    code: 'DURABLE RPA',
    title: '从一次性脚本升级为可追踪的任务产品',
    trigger: '内部后台流程需要计划、变量、日志、结果、批量 Profile 和稳定的取消/重试语义。',
    reuse: ['动作 DSL', 'Plan/Task 分离', 'CDP 持久连接', '日志与存储预算'],
    first: '先补严格状态机、AbortSignal、幂等键、SQLite 和异步提交/查询接口。',
    avoid: '不要直接沿用当前的字符串状态和协作式取消作为生产工作流保证。',
    decision: '架构可借鉴，实现需重构',
  },
  {
    id: 'browser',
    label: '定制 Chromium 产品',
    code: 'BROWSER PRODUCT',
    title: '在现成内核上构建企业浏览器工作台',
    trigger: '我们需要扩展分配、固定启动策略、本地服务、备份恢复或专用桌面工作流。',
    reuse: ['Electron 安全外壳', '内核发现与启动', '扩展分配', '控制面/执行面分层'],
    first: '先明确内核供应链、更新签名、第三方许可证与企业策略，再设计 UI。',
    avoid: '不要把这条路线误认为从零实现 Blink、V8、网络栈或沙箱。',
    decision: '需求出现后再深入',
  },
]

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="OpenBrowser Architecture Lab 首页">
      <span class="brand-glyph" aria-hidden="true"><i></i><i></i><i></i></span>
      <span><strong>OB / ARCH LAB</strong><small>独立技术研究</small></span>
    </a>
    <nav class="top-nav" aria-label="主要导航">
      <a href="#principle">工作原理</a>
      <a href="#isolation">隔离边界</a>
      <a href="#value">后期价值</a>
      <a href="#decision">研究决策</a>
    </nav>
    <button class="theme-toggle" type="button" aria-label="切换深色主题" aria-pressed="false">
      <span class="theme-symbol" aria-hidden="true">◐</span>
      <span class="theme-label">深色</span>
    </button>
  </header>

  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="signal-dot" aria-hidden="true"></span> SOURCE-BASED STUDY · 4052015</p>
        <h1 id="hero-title">它不在造浏览器内核。<em>它在把 Chromium 变成运行平台。</em></h1>
        <p class="hero-lede">
          OpenBrowser 的核心是指纹浏览器与多环境管理，但工程本质更普适：
          在<strong>真实 Chromium</strong>之上组织 Profile 隔离、环境配置、CDP、RPA、Local API 和 MCP。
        </p>
        <div class="hero-actions">
          <a class="button button-primary" href="#principle">拆开看工作原理 <span aria-hidden="true">↓</span></a>
          <a class="button button-secondary" href="https://github.com/lyu0805/OpenBrowser" target="_blank" rel="noreferrer">访问上游仓库 <span aria-hidden="true">↗</span></a>
        </div>
        <p class="hero-scope">非官方页面 · 不运行 OpenBrowser · 不演示登录或规避检测</p>
      </div>

      <div class="runtime-visual" role="img" aria-label="OpenBrowser 架构位于真实 Chromium 之上">
        <div class="visual-head">
          <span>RUNTIME COMPOSITION</span>
          <span class="runtime-status"><i></i> MODEL</span>
        </div>
        <div class="stack-shell">
          <div class="stack-line" aria-hidden="true"><i></i></div>
          <div class="stack-item stack-product"><span>05</span><strong>Electron Product</strong><small>环境管理 · 窗口同步</small></div>
          <div class="stack-item stack-control"><span>04</span><strong>Local API / MCP</strong><small>控制面 · 权限过滤</small></div>
          <div class="stack-item stack-rpa"><span>03</span><strong>RPA / Task Flow</strong><small>计划 · 状态 · 结果</small></div>
          <div class="stack-item stack-cdp"><span>02</span><strong>CDP Sessions</strong><small>Page · Target · Input</small></div>
          <div class="stack-item stack-chromium"><span>01</span><strong>REAL CHROMIUM</strong><small>Blink · V8 · Storage · Network</small></div>
        </div>
        <div class="visual-foot"><span>不是 DOM / JS / 渲染引擎重写</span><strong>是运行时编排</strong></div>
      </div>
    </section>

    <section class="thesis-strip" aria-label="核心判断">
      <article><span>不是</span><strong>浏览器内核实现</strong><small>不重写 Blink、V8、网络栈</small></article>
      <article><span>是</span><strong>Chromium 运行平台</strong><small>隔离、配置、控制、任务化</small></article>
      <article><span>最值得学</span><strong>工程组织方式</strong><small>Profile · CDP · FSM · MCP</small></article>
      <article><span>不能保证</span><strong>匿名与不可关联</strong><small>网站仍有跨层与服务端信号</small></article>
    </section>

    <section class="section principle-section" id="principle" aria-labelledby="principle-title">
      <div class="section-heading section-heading-split">
        <div>
          <p class="eyebrow">01 · WORKING PRINCIPLE</p>
          <h2 id="principle-title">五层能力，<br />落到同一个执行面</h2>
        </div>
        <p>从上往下看产品，从下往上看能力来源。点击任意层，区分 Chromium 原生能力与 OpenBrowser 增加的编排。</p>
      </div>

      <div class="architecture-workspace">
        <div class="layer-tabs" role="tablist" aria-label="架构层选择" aria-orientation="vertical">
          ${architectureLayers
            .map(
              (layer, index) => `
                <button
                  type="button"
                  role="tab"
                  id="layer-tab-${layer.id}"
                  aria-controls="layer-panel"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? '0' : '-1'}"
                  data-layer-id="${layer.id}"
                >
                  <span>${layer.index}</span>
                  <strong>${layer.title}</strong>
                  <small>${layer.eyebrow}</small>
                </button>
              `,
            )
            .join('')}
        </div>

        <div class="architecture-stage" aria-label="五层运行时架构">
          <div class="stage-rail" aria-hidden="true"><i></i></div>
          ${architectureLayers
            .map(
              (layer, index) => `
                <div class="stage-node" data-layer-node="${layer.id}" data-active="${index === 0}">
                  <span>${layer.index}</span><strong>${layer.title}</strong><small>${layer.interface}</small>
                </div>
              `,
            )
            .join('')}
          <div class="kernel-seal"><span>EXECUTION SOURCE</span><strong>CHROMIUM</strong></div>
        </div>

        <article class="layer-panel" id="layer-panel" role="tabpanel" aria-labelledby="layer-tab-product" tabindex="0"></article>
      </div>

      <div class="protocol-route" aria-label="MCP 到 Chromium 的控制路径">
        <div class="route-label"><span>CONTROL ROUTE</span><strong>Agent 不直接操作 Chromium</strong></div>
        <ol>
          <li><span>01</span><strong>MCP Host</strong><small>规划与工具调用</small></li>
          <li><span>02</span><strong>MCP Adapter</strong><small>stdio JSON-RPC</small></li>
          <li><span>03</span><strong>Local API</strong><small>HTTP + API Key</small></li>
          <li><span>04</span><strong>RPA / Engine</strong><small>业务与任务语义</small></li>
          <li><span>05</span><strong>CDP / Chromium</strong><small>真实页面执行</small></li>
        </ol>
      </div>
    </section>

    <section class="section lifecycle-section" aria-labelledby="lifecycle-title">
      <div class="section-heading">
        <p class="eyebrow">02 · PROFILE LIFECYCLE</p>
        <h2 id="lifecycle-title">一个环境不是“开个窗口”，<br />而是一套资源所有权协议</h2>
        <p>真正可复用的 Profile 隔离由路径、锁、PID、端口、配置屏障和清理共同构成。</p>
      </div>

      <div class="lifecycle-workspace">
        <div class="lifecycle-tabs" role="tablist" aria-label="Profile 启动步骤">
          ${lifecycleSteps
            .map(
              (step, index) => `
                <button
                  type="button"
                  role="tab"
                  id="lifecycle-tab-${step.id}"
                  aria-controls="lifecycle-panel"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? '0' : '-1'}"
                  data-step-id="${step.id}"
                >
                  <span>${step.number}</span><strong>${step.title}</strong>
                </button>
              `,
            )
            .join('')}
        </div>
        <div class="lifecycle-track" aria-hidden="true"><i></i></div>
        <article class="lifecycle-panel" id="lifecycle-panel" role="tabpanel" aria-labelledby="lifecycle-tab-configure" tabindex="0"></article>
      </div>
    </section>

    <section class="section isolation-section" id="isolation" aria-labelledby="isolation-title">
      <div class="section-heading section-heading-split">
        <div>
          <p class="eyebrow">03 · ISOLATION BOUNDARY</p>
          <h2 id="isolation-title">隔离的是状态和资源，<br />不是“绝对身份”</h2>
        </div>
        <p>理解这条边界，才能把合理的测试环境隔离与高风险的“反检测保证”分开。</p>
      </div>

      <div class="boundary-grid">
        <article class="boundary-card boundary-solid">
          <header><span>01</span><mark>较可靠</mark></header>
          <h3>Profile 本地状态隔离</h3>
          <p>独立 user-data-dir 可以分开 Cookie、LocalStorage、IndexedDB、缓存、历史和扩展数据。</p>
          <ul><li>目录与 Profile ID 一一对应</li><li>原子锁防止双开</li><li>启动/停止屏障避免竞态</li></ul>
        </article>
        <article class="boundary-card boundary-configurable">
          <header><span>02</span><mark>可配置</mark></header>
          <h3>网络与网页可见环境</h3>
          <p>代理、时区、语言、UA、屏幕以及部分 Canvas/WebGL/Audio 属性可以由启动参数、CDP 和脚本共同配置。</p>
          <ul><li>配置需要跨层保持一致</li><li>部分字段需要重启</li><li>覆盖面依赖 Chromium 版本</li></ul>
        </article>
        <article class="boundary-card boundary-uncertain">
          <header><span>03</span><mark>不能保证</mark></header>
          <h3>不可关联与绕过风控</h3>
          <p>网站还可能结合 TLS、字体栅格、GPU、IP 信誉、输入行为、账号关系和服务端历史判断关联。</p>
          <ul><li>JS 覆盖不等于内核级一致</li><li>代理不等于匿名</li><li>登录成功不等于长期安全</li></ul>
        </article>
      </div>

      <div class="formula-card">
        <div><span>可靠结论</span><strong>Profile isolation</strong><small>浏览器状态与进程资源分离</small></div>
        <b aria-hidden="true">≠</b>
        <div><span>不能推导</span><strong>Identity isolation</strong><small>网站一定认为是不同真实设备</small></div>
      </div>
    </section>

    <section class="section value-section" id="value" aria-labelledby="value-title">
      <div class="section-heading">
        <p class="eyebrow">04 · FUTURE VALUE</p>
        <h2 id="value-title">现在不必继续深挖。<br />需求出现时，知道从哪里重新进入。</h2>
        <p>选择一种未来产品需求，查看真正值得复用的模块、第一步和不应照搬的部分。</p>
      </div>

      <div class="value-workspace">
        <div class="value-tabs" role="tablist" aria-label="未来需求场景">
          ${valueScenarios
            .map(
              (scenario, index) => `
                <button
                  type="button"
                  role="tab"
                  id="value-tab-${scenario.id}"
                  aria-controls="value-panel"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? '0' : '-1'}"
                  data-scenario-id="${scenario.id}"
                >
                  <span>${String(index + 1).padStart(2, '0')}</span><strong>${scenario.label}</strong><small>${scenario.code}</small>
                </button>
              `,
            )
            .join('')}
        </div>
        <article class="value-panel" id="value-panel" role="tabpanel" aria-labelledby="value-tab-agent" tabindex="0"></article>
      </div>
    </section>

    <section class="section decision-section" id="decision" aria-labelledby="decision-title">
      <div class="decision-lead">
        <p class="eyebrow">05 · RESEARCH DECISION</p>
        <h2 id="decision-title">当前最合理的动作：<br /><em>保留架构认知，停止产品级追踪。</em></h2>
        <p>研究已经回答了“它是什么、怎么工作、哪里值得学”。继续跟踪具体指纹字段和网站兼容性，只有在出现真实需求时才有投入回报。</p>
      </div>

      <div class="decision-board">
        <article>
          <span>NOW · 已经足够</span>
          <h3>保留技术地图</h3>
          <ul><li>Profile 是资源所有权协议</li><li>CDP 是真实 Chromium 控制通道</li><li>RPA 是 DSL + 轻量任务流</li><li>MCP 是控制面适配器</li></ul>
        </article>
        <article class="decision-trigger">
          <span>LATER · 重新启动条件</span>
          <h3>出现明确产品需求</h3>
          <ul><li>需要持久浏览器会话的 AI Agent</li><li>需要多账号/多地区 QA 矩阵</li><li>需要可恢复的浏览器 RPA</li><li>需要企业定制 Chromium 工作台</li></ul>
        </article>
        <article>
          <span>SKIP · 不提前投入</span>
          <h3>反检测细节竞赛</h3>
          <ul><li>目标网站策略变化很快</li><li>效果无法靠源码静态证明</li><li>许可和合规风险更高</li><li>与当前通用能力建设无关</li></ul>
        </article>
      </div>
    </section>

    <section class="section audit-section" aria-labelledby="audit-title">
      <div class="section-heading section-heading-split">
        <div><p class="eyebrow">06 · AUDIT NOTES</p><h2 id="audit-title">值得借鉴，<br />也值得保持距离</h2></div>
        <p>固定提交的源码审查与实验还暴露了三个不能忽略的实现边界。</p>
      </div>
      <div class="audit-grid">
        <article><span>PROFILE COPY</span><h3>复制环境仍可能带走敏感状态</h3><p>实验复现 Cookie、认证代理、账号密码、TOTP 和部分出口信息仍被复制，与工具描述不完全一致。</p></article>
        <article><span>TASK CANCEL</span><h3>取消不是强制中止</h3><p>在最后一个长步骤中请求取消，任务仍可能进入 success；生产系统需要 AbortSignal 和原子终态。</p></article>
        <article><span>MCP POLICY</span><h3>工具过滤不是后端 RBAC</h3><p>Local API Key 仍是全权限，MCP read/run/manage/admin 没有下沉为资源级服务端授权。</p></article>
      </div>
      <a class="text-link" href="https://github.com/yydshly/0831_codex_project/tree/main/research/lyu0805-openbrowser" target="_blank" rel="noreferrer">阅读完整审计、源码地图与复现实验 <span aria-hidden="true">↗</span></a>
    </section>

    <section class="sources-section" aria-labelledby="sources-title">
      <div>
        <p class="eyebrow">PRIMARY SOURCES</p>
        <h2 id="sources-title">结论来自固定提交，<br />不是产品宣传复述</h2>
      </div>
      <div class="source-links">
        <a href="https://github.com/lyu0805/OpenBrowser/tree/405201583b39a90ae785193d82653f62a0ed9f91" target="_blank" rel="noreferrer"><span>01 · SOURCE</span><strong>固定提交 4052015</strong><small>上游源码基线 ↗</small></a>
        <a href="https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/engine.js" target="_blank" rel="noreferrer"><span>02 · ENGINE</span><strong>BrowserEngine</strong><small>Profile 与生命周期 ↗</small></a>
        <a href="https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/cdp.js" target="_blank" rel="noreferrer"><span>03 · PROTOCOL</span><strong>CDP Client</strong><small>连接、事件与 Session ↗</small></a>
        <a href="https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/Browserapp/automation/mcp-server.js" target="_blank" rel="noreferrer"><span>04 · CONTROL</span><strong>MCP Server</strong><small>工具与权限过滤 ↗</small></a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div><strong>OPENBROWSER ARCHITECTURE LAB</strong><span>Independent study · 2026-09-01</span></div>
    <p>页面只整理公开源码的技术原理与后期价值，不代表上游项目或其维护者。</p>
    <div class="footer-links">
      <a href="https://github.com/lyu0805/OpenBrowser" target="_blank" rel="noreferrer">上游仓库 ↗</a>
      <a href="https://github.com/yydshly/0831_codex_project/tree/main/research/lyu0805-openbrowser" target="_blank" rel="noreferrer">研究记录 ↗</a>
      <a href="#top">返回顶部 ↑</a>
    </div>
  </footer>
`

const layerPanel = document.querySelector('#layer-panel')
const lifecyclePanel = document.querySelector('#lifecycle-panel')
const valuePanel = document.querySelector('#value-panel')
const themeToggle = document.querySelector('.theme-toggle')
const themeLabel = document.querySelector('.theme-label')
const themeMeta = document.querySelector('meta[name="theme-color"]')

function renderLayer(id) {
  const layer = architectureLayers.find((item) => item.id === id) ?? architectureLayers[0]
  document.querySelectorAll('[data-layer-id]').forEach((button) => {
    const active = button.dataset.layerId === layer.id
    button.setAttribute('aria-selected', String(active))
    button.tabIndex = active ? 0 : -1
  })
  document.querySelectorAll('[data-layer-node]').forEach((node) => {
    node.dataset.active = String(node.dataset.layerNode === layer.id)
  })
  layerPanel.setAttribute('aria-labelledby', `layer-tab-${layer.id}`)
  layerPanel.innerHTML = `
    <header><span>${layer.eyebrow}</span><strong>${layer.index}</strong></header>
    <h3>${layer.title}</h3>
    <p>${layer.summary}</p>
    <code>${layer.interface}</code>
    <ul>${layer.responsibilities.map((item) => `<li>${item}</li>`).join('')}</ul>
    <dl>
      <div><dt>后期价值</dt><dd>${layer.value}</dd></div>
      <div><dt>重要边界</dt><dd>${layer.boundary}</dd></div>
    </dl>
  `
}

function renderLifecycle(id) {
  const step = lifecycleSteps.find((item) => item.id === id) ?? lifecycleSteps[0]
  const stepIndex = lifecycleSteps.findIndex((item) => item.id === step.id)
  document.querySelectorAll('[data-step-id]').forEach((button) => {
    const active = button.dataset.stepId === step.id
    button.setAttribute('aria-selected', String(active))
    button.tabIndex = active ? 0 : -1
  })
  document.querySelector('.lifecycle-workspace').style.setProperty('--active-step', stepIndex)
  lifecyclePanel.setAttribute('aria-labelledby', `lifecycle-tab-${step.id}`)
  lifecyclePanel.innerHTML = `
    <div class="step-counter"><span>${step.verb}</span><strong>${step.number} / 06</strong></div>
    <h3>${step.title}</h3>
    <p>${step.detail}</p>
    <dl>
      <div><dt>必须保持</dt><dd>${step.invariant}</dd></div>
      <div><dt>阶段产物</dt><dd><code>${step.output}</code></dd></div>
    </dl>
  `
}

function renderScenario(id) {
  const scenario = valueScenarios.find((item) => item.id === id) ?? valueScenarios[0]
  document.querySelectorAll('[data-scenario-id]').forEach((button) => {
    const active = button.dataset.scenarioId === scenario.id
    button.setAttribute('aria-selected', String(active))
    button.tabIndex = active ? 0 : -1
  })
  valuePanel.setAttribute('aria-labelledby', `value-tab-${scenario.id}`)
  valuePanel.innerHTML = `
    <header><span>${scenario.code}</span><mark>${scenario.decision}</mark></header>
    <h3>${scenario.title}</h3>
    <div class="scenario-trigger"><span>需求触发</span><p>${scenario.trigger}</p></div>
    <div class="scenario-grid">
      <div><span>值得复用</span><ul>${scenario.reuse.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      <div><span>第一步</span><p>${scenario.first}</p></div>
      <div><span>不要照搬</span><p>${scenario.avoid}</p></div>
    </div>
  `
}

function bindRovingTabs(selector, dataAttribute, render) {
  const buttons = [...document.querySelectorAll(selector)]
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => render(button.dataset[dataAttribute]))
    button.addEventListener('keydown', (event) => {
      let nextIndex = index
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length
      else if (event.key === 'Home') nextIndex = 0
      else if (event.key === 'End') nextIndex = buttons.length - 1
      else return
      event.preventDefault()
      const next = buttons[nextIndex]
      render(next.dataset[dataAttribute])
      next.focus()
    })
  })
}

function applyTheme(theme, persist = true) {
  const safeTheme = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.theme = safeTheme
  themeToggle.setAttribute('aria-pressed', String(safeTheme === 'dark'))
  themeToggle.setAttribute('aria-label', safeTheme === 'dark' ? '切换浅色主题' : '切换深色主题')
  themeLabel.textContent = safeTheme === 'dark' ? '浅色' : '深色'
  themeMeta.setAttribute('content', safeTheme === 'dark' ? '#0b1114' : '#f2f0e8')
  if (persist) localStorage.setItem('openbrowser-lab-theme', safeTheme)
}

const storedTheme = localStorage.getItem('openbrowser-lab-theme')
const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
  ? storedTheme
  : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
})

bindRovingTabs('[data-layer-id]', 'layerId', renderLayer)
bindRovingTabs('[data-step-id]', 'stepId', renderLifecycle)
bindRovingTabs('[data-scenario-id]', 'scenarioId', renderScenario)

applyTheme(initialTheme, false)
renderLayer('product')
renderLifecycle('configure')
renderScenario('agent')

window.__OPENBROWSER_LAB_READY__ = true
