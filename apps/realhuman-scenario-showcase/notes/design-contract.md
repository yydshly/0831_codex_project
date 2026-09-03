# RealHuman 场景产品演示中心 · 设计契约

## Contract

- Entry mode：revision-led / greenfield sibling project。
- Request revision：P4 / immersive single-page workbench。
- Target user and context：希望从业务用途理解人像能力的产品负责人、演示者和试用用户。
- Desired first impression：进入场景页后立即看到推荐场景与可操作能力区；主要操作集中在一个视口内，并可将能力区真正全屏。
- Visual ambition：Functional。
- Experience architecture：Spatial Stage。桌面端以完整视口承载左侧场景控制与右侧持久能力画布；后期路线折叠进左侧信息区，不再形成长页面。移动端转为紧凑场景选择器 + 正常文档流能力区。
- Scene base：同源 iframe 加载 R34 冻结构建；新项目不导入或修改旧项目源码。
- Foreground control model：照片 / 视频独立页面、场景卡、状态标签、输出与边界说明、路线图折叠面板、能力区全屏切换与独立工作台入口。
- State-to-scene mapping：available / foundation 场景加载冻结引擎；planned 场景只进入独立路线图，不再作为主场景按钮，也不伪装为已实现。
- Mobile transformation：单列阅读；场景卡在内部横向选择，能力舞台进入正常文档流；全屏按钮仍可使用，路线图为折叠面板。
- Fallback：iframe 不可用时仍显示场景目标、已有能力、缺口和全屏入口。
- Visual constraints：延续深色、薄边框与薄荷色状态语义，但不复制旧实验室的信息密度。
- Information constraints：照片与视频不得混成一个功能列表；老照片修复、风格化、多人婚纱和批量电商必须标明当前完成度。
- Operation constraints：只复用 R34 冻结构建；不新增后端、上传、登录、外部模型或虚拟摄像头。
- State constraints：场景选中、实际入口、完成度、输出和边界保持一致；刷新后从页面类型恢复默认场景。
- Environment constraints：新目录 `apps/realhuman-scenario-showcase/`；规范地址 4210；旧项目 4190 保持不变。
- Primary journey：首页选择照片或视频 → 进入沉浸式单页工作台 → 默认推荐场景立即加载真实冻结工作台 → 同页切换其它场景 / 查看折叠路线图 → 将能力区全屏或进入独立工具。
- User-defined phases：① 当前代码归档；② 新建独立目录与网页；③ 照片 / 视频分流；④ 场景化演示；⑤ 浏览器与构建验收。
- Required artifacts：源码与构建归档、SHA-256、独立三页面项目、内嵌冻结引擎、三视口证据、README 与验收记录。
- Autonomy authorization：用户明确要求当前代码存档并在独立目录 / 网页继续处理。
- User-decision boundary：老照片与风格模型、多人处理、虚拟摄像头、云服务和商业发布均需后续单独决策；本切片不接入。
- Observable completion criteria：旧源码与构建归档可校验；旧项目文件不被新项目修改；首页、照片页、视频页均可访问；桌面场景页首屏无整页纵向滚动并持续显示能力画布；所有场景与路线说明集中在同一工作区；能力区可进入 / 退出浏览器全屏并保留场景状态；照片和视频场景不混淆；三个视频场景可触发冻结引擎；规划能力不冒充实现；1920 / 768 / 390 无横向溢出；键盘可达；无页面错误；生产构建通过。

## Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | R34 源码与构建归档 | workspace / archive | ZIP、SHA-256、manifest | 0–1 | pass | 两个归档与 manifest 已生成 |
| ② | 独立项目目录 | home / source | 文件、构建、独立端口 | 1–3 | pass | 4210 独立运行；源码没有旧项目 import |
| ③ | 照片 / 视频分流 | home / photo / video | 页面结构、导航、URL | 3–5 | pass | 分流与默认推荐场景不受本轮影响 |
| ④ | 沉浸式单页工作台 | scene rail / live stage / roadmap / fullscreen | 浏览器交互、尺寸、全屏状态 | 2–6 | pass | 桌面限制为一个视口；路线图收进侧栏；能力区支持全屏进入、按钮退出与状态保留 |
| ⑤ | 跨表面与工程验收 | 1920 / 390 / keyboard / fullscreen | 截图、DOM、build、errors | 7–9 | pass | P4 Playwright 5 / 5；桌面无整页滚动、手机无横向溢出、全屏退出焦点返回、build 通过 |

## 设计方向

| 决策 | 方向 | 可观察标准 |
| --- | --- | --- |
| 信息层级 | 首页照片 / 视频二选一；场景页首屏只显示推荐与可运行能力 | 首次扫描不需要理解算法名，进入即看到真实效果 |
| 场景卡 | 推荐场景有明确首发标记；目标、完成度、当前输出同时出现 | 不从“规划”卡进入空白或假效果 |
| 能力舞台 | 冻结引擎作为唯一真实运行面 | 新项目没有旧源码 import |
| 产品边界 | 已实现、底座可用在主流程；规划能力进入独立路线图 | 主流程与后期产品方向不竞争注意力 |

---

## P5 · 扩展能力中心

- Entry mode：greenfield sibling surface；不改变照片页、视频页或 R34 冻结引擎。
- Target user and context：需要判断“哪些扩展已能运行、哪些必须接入专用模型”的产品负责人和试用者。
- Desired first impression：先选业务能力，再立即看到真实输入、真实像素处理、结果对比与能力边界。
- Experience architecture：Hybrid Workspace / Spatial Stage。左侧为七类扩展产品入口，中部为当前模块参数，右侧为持久预览与前后对比。
- Runnable slice：老照片基础修复、确定性图片风格处理；二者全部在浏览器本地处理同一张输入图并支持导出。
- Model-required slice：AI 职业头像、多人婚纱与家庭照、电商人像、全身塑形与试穿、正式视频输出。页面交付产品入口、复用底座、缺失模型和下一接入动作，但不生成伪结果。
- Truth boundary：基础修复只覆盖褪色、偏色、对比、轻度噪声与清晰度；不声称修补划痕、补全缺失内容、超分或上色。风格处理是确定性调色，不声称生成发型、服装、背景或新内容。
- Input and privacy：JPG / PNG / WEBP 在当前浏览器内解码和处理；不上传、不持久化；内置样例明确标注为合成老化技术样例。
- Primary journey：打开扩展能力 → 默认进入老照片基础修复 → 载入样例或本地图片 → 自动修复 / 调参 → 拖动前后对比 → 导出 PNG；切换图片风格后复用同一输入并生成可回退风格结果。
- Mobile transformation：能力入口横向滚动，参数与预览依次堆叠；无横向页面溢出。
- Observable completion criteria：`extensions.html` 可直接访问；两项本地能力真实改变结果像素；可重置、对比、导出；五项模型能力不出现假运行按钮；桌面与手机可用；键盘可达；无外部请求与页面错误；生产构建通过。

### P5 Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | 独立扩展入口 | `extensions.html` / navigation | URL、导航、构建输入 | 1–3 | pass | 独立页面与三页导航已接入 |
| ② | 老照片基础修复 MVP | local canvas / before-after | 像素指纹、控制项、导出 | 3–6 | pass | 五项基础参数、前后拖动与 PNG 导出已运行 |
| ③ | 图片风格处理 MVP | local canvas / presets | 像素指纹、预设、强度 | 3–6 | pass | 五种确定性风格、强度与重置已运行 |
| ④ | 五类后期产品入口 | capability registry / model-required | 边界、依赖、下一动作 | 2–5 | pass | 每项均明确复用底座、能力缺口和接入顺序，无假运行按钮 |
| ⑤ | 跨表面与工程验收 | 1920 / 390 / keyboard / build | Playwright、DOM、errors、build | 7–9 | pass | P5 6 / 6；P4 回归 5 / 5；build 通过 |

---

## P6 · 共享底座接入扩展产品入口

- Entry mode：revision-led continuation；保留 P5 两项本地像素能力和全部真实性边界。
- Authorization：用户明确要求“继续接入补全”，允许在独立扩展页继续实现可逆的本地接入。
- Primary journey：选择职业头像、婚纱家庭、电商或正式视频输出 → 先看到该产品缺口 → 点击“启动已有底座” → 同页载入 R34 真实照片或摄像头工作台 → 可继续实际操作，并始终看到“底座验证不等于完整产品”的状态。
- Scene persistence：能力入口与参数 / 边界保持可见；真实底座运行在右侧持久舞台。用户可返回架构说明或独立打开底座。
- Runtime source：只复用 `public/engine/r34/index.html` 冻结构建；不修改冻结引擎，不复制新算法，不调用外部服务。
- State mapping：foundation-plan → foundation-loading → foundation-live / foundation-error；model-only 仍停留在架构说明，不显示运行按钮。
- Mobile transformation：底座 iframe 在控制说明后进入正常移动流，保持最小可操作高度，无横向溢出。
- Observable completion criteria：4 个 foundation 入口均可启动正确的照片 / 视频真实底座；全身试穿保持模型边界；返回说明可用；iframe 失败有可读回退和独立入口；旧 P5 像素能力与原照片 / 视频页面回归通过。

### P6 Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | 复用引擎入口 | 4 foundation modules / plan | CTA、真实状态与边界 | 0–4 | pass | 职业头像、婚纱、电商、正式视频均已声明正确底座路由 |
| ② | 同页真实工作台 | foundation-loading / live / error | iframe、目标区对齐、回退 | 4–6 | pass | 照片 / 摄像头底座同页载入、目标区对齐、返回说明与独立入口均可用 |
| ③ | 模型能力不伪造 | try-on / model-only | 无运行按钮、缺口说明 | 5–6 | pass | 全身试穿保持模型专用状态，未出现 iframe 或假运行按钮 |
| ④ | 多表面验收 | desktop / mobile / keyboard / build | Playwright、截图、errors | 7–9 | pass | 扩展中心 12 / 12；P4 回归 5 / 5；生产 build 通过 |

---

## P7 · 真实图片输入修复与补全

- Entry mode：repair-led continuation；用户报告扩展中心“好像无法导入图片”。
- Preserved behavior：P5 的本地像素处理、P6 的共享底座接入、现有照片 / 视频页和冻结引擎均保持不变。
- Primary defect：图片输入依赖“按钮触发隐藏 file input”单一路径；缺少可见文件控件、拖放、剪贴板、输入状态与格式 / 解码错误反馈，实际浏览器体验不可确认。
- Minimal coherent intervention：把输入区升级为可见、可点击、可拖入、可粘贴的本地投放区；所有路径进入同一个验证与解码函数；显示文件名、分辨率、大小和成功 / 错误状态。
- Supported input：JPG / JPEG / PNG / WEBP，单文件，最大 20 MB；只在浏览器内解码，不上传、不持久化文件路径。
- State mapping：idle → choosing / drag-active → decoding → ready；invalid-type / too-large / decode-error 均给出明确恢复动作，原有有效图像不因失败输入被清空。
- Keyboard：投放区可 Tab 聚焦，Enter / Space 打开文件选择；粘贴在页面聚焦时可用。
- Mobile：保留明确“选择图片”按钮，拖放说明降级为“也可粘贴”；不依赖 hover。
- Observable completion criteria：真实本地 WEBP / PNG / JPEG 均可通过文件选择进入处理；拖放与剪贴板图片可进入同一流程；无效文本文件和超大文件有错误提示；成功输入真实改变 source meta 和处理结果；桌面 / 手机 / 键盘 / build / P5-P6 回归通过。

### P7 Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | 复现当前导入链 | file chooser / current input | filechooser 与实际文件解码 | 1 | pass | 基线确认隐藏控件能解码 WEBP，但输入反馈与替代路径不足 |
| ② | 多入口本地导入 | chooser / drop / paste | ready 状态、文件信息、像素结果 | 4–6 | pass | 原生选择、拖放、剪贴板 JPEG 均进入统一解码与处理链 |
| ③ | 错误与恢复 | invalid / too-large / decode-error | 可读错误、原结果保留 | 6 | pass | 格式错误与超过 20 MB 均明确提示并保留上一张有效结果 |
| ④ | 多表面与回归 | desktop / mobile / keyboard / build | Playwright、DOM、errors | 7–9 | pass | 扩展中心 17 / 17；P4 回归 5 / 5；视觉核对与 build 通过 |

---

## P8 · 场景产品一键操作

- Entry mode：revision-led productization；用户要求共享底座留在后台，每个应用模块都提供场景专属的一键主操作。
- Preserved behavior：P5 本地修复 / 风格处理、P6 底座接入、P7 多入口图片导入及冻结引擎不可修改边界保持不变。
- Product hierarchy：场景名称 → 输入要求 → 一个主按钮 → 处理步骤 → 结果 / 边界；底层参数与架构说明退为次级信息。
- Primary actions：老照片“一键基础修复”；风格“生成推荐风格”；职业头像“生成职业头像基础版本”；婚纱“精修婚纱单人基础版本”；电商“生成电商人像基础版本”；视频“应用会议演示效果”；试穿“生成试穿效果（待接模型）”。
- Orchestration：照片类场景把当前父页面输入传入同源 R34 `#photo-input`，等待真实检测 / 渲染完成后应用场景专属参数和导出规格；视频演示使用 R34 本地演示流并应用会议场景，不自动申请物理摄像头权限。
- Truth boundary：基础版本完成只表示共享底座步骤真实执行；换装 / 换景、多人逐人参数、商品保护、批处理、虚拟摄像头和试穿生成仍显示为未执行步骤。不可运行的试穿主按钮保持禁用并解释所需模型。
- State mapping：ready → running（逐步更新）→ base-complete / blocked-by-model / error；动作期间按钮禁用，失败可以重新执行且不清空输入。
- Mobile：主按钮和进度必须先于架构说明出现；可在移动流中看到输入、运行状态和结果边界。
- Observable completion criteria：7 个模块均出现唯一场景主操作；2 个本地模块真实改变像素；3 个照片模块可把真实本地输入送入冻结底座并应用不同策略；视频模块可启动本地演示流并选择会议效果；试穿不会伪运行；桌面 / 移动 / 键盘 / 错误 / build / P4-P7 回归通过。

### P8 Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | 七模块主操作 | controls / ready | 唯一 CTA、输入与边界 | 2–4 | pass | 七个场景均已有产品命名的主动作；详细架构折叠为次级信息 |
| ② | 照片产品编排 | headshot / wedding / commerce | 输入注入、检测、场景参数、结果 | 5–6 | pass | 等待人脸感知就绪后分别执行 enterprise / natural / creator 配方与输出规格 |
| ③ | 视频产品编排 | video demo / meeting | 演示流、会议场景、状态 | 5–6 | pass | 本地演示流真实启动并应用会议场景，没有请求物理摄像头 |
| ④ | 模型边界 | try-on / disabled | 禁用 CTA、缺失模型说明 | 6 | pass | 试穿动作保持禁用并说明人体解析与试穿模型缺口，没有 iframe 或假结果 |
| ⑤ | 多表面与回归 | desktop / mobile / keyboard / build | Playwright、截图、errors | 7–9 | pass | P8 产品流程、P5–P7 回归、P4 5 / 5 与生产构建通过 |

---

## P9 · 产品结果可交付闭环

- Entry mode：revision-led continuation；用户再次要求继续，沿用“按最终产品落地场景驱动”的既定目标，不新增无关特效。
- Authorization：用户已授权持续推进；本阶段只修改独立扩展页源码与文档，不修改 R34 冻结引擎、不提交或覆盖远端。
- Baseline problem：P8 主按钮已经能真实执行各场景配方，但完成后主要停留在内嵌底座和状态文字；外层产品入口缺少可辨识的结果卡、直接下载和结果留存，用户仍需理解底座控件才能拿走交付物。
- Primary journey：选择产品 → 输入照片 / 使用技术样例 → 点击一个产品主按钮 → 查看逐步状态 → 外层立即显示结果缩略图、规格和真实性边界 → 直接下载；视频场景完成后可在外层保存当前实时帧。
- Reuse strategy：照片下载必须调用冻结底座现有 `#export-photo` 及其智能裁切，不复制人脸裁切算法；视频当前帧必须调用冻结底座现有 `#capture-realtime-frame`。外层只暂时截获同源下载结果并组织为产品结果卡。
- Result persistence：每个产品在当前页面内存保留一个最新结果；切换模块后返回仍可查看和下载。替换结果时释放旧 Object URL；不上传、不写浏览器持久存储。
- State mapping：ready → running → base-complete → deliverable-ready；下载捕获失败进入 error，但保留底座画面与重新执行入口。
- Truth boundary：照片结果是基础底座交付物，不包含未接入的换装、多人、商品保护等专属生成；视频只交付当前帧 PNG，不声称已实现录像、WebRTC 或虚拟摄像头。
- Mobile and keyboard：结果卡位于主动作之后、详细架构之前；预览、下载和继续微调均可键盘操作，移动端不产生横向溢出。
- Observable completion criteria：三个照片产品一键完成后均出现产品结果卡并可下载冻结底座生成的真实 PNG；规格与场景匹配；视频会议一键运行后可从外层保存当前帧；结果切换后仍在当前页面内存可用；失败状态可读；P8 和旧页面回归、移动布局及生产构建通过。

### P9 Coverage manifest

| 用户阶段 | 要求 / 产物 | 表面 / 状态 | 证据 | 阶段 | 状态 | 下一动作 |
| --- | --- | --- | --- | --- | --- | --- |
| ① | 结果缺口基线 | product base-complete | DOM、交互、下载入口 | 1 | pass | 浏览器基线确认只有底座与状态，外层结果卡和下载均不存在 |
| ② | 照片结果卡 | three photo products / deliverable-ready | 真实 PNG、规格、下载 | 4–6 | pass | 三个照片产品均截获冻结底座真实导出；职业头像证据为 1024 × 1024 PNG |
| ③ | 视频当前帧交付 | meeting / deliverable-ready | 当前帧 PNG、边界 | 5–6 | pass | 会议演示流完成后外层可预览并下载真实当前帧 PNG |
| ④ | 结果内存与恢复 | switch / revisit / replace / error | 状态、URL 释放、重新执行 | 6 | pass | 每模块保留最新结果；切换返回仍显示可下载状态，继续微调可重开底座，页面卸载释放 URL |
| ⑤ | 多表面与工程验收 | desktop / mobile / keyboard / build / regression | Playwright、截图、errors | 7–9 | pass | P9 4 / 4；合并旅程 24 项通过，键盘邻接复验 11 / 11，P4 5 / 5，生产构建通过 |
