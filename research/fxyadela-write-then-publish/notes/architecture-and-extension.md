# Write Then Publish 架构与扩展研究

本文基于上游固定提交 [`7a708312247e69155ca586c49c65c5306fd88e9e`](https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e)，回答三个问题：当前系统如何组织、为什么扩展成本会增长、怎样在不破坏现有能力的前提下演进。产品能力和使用场景见[研究入口](../README.md)，底层处理细节见[技术原理](technical-principles.md)。

## 结论标记

- **[已验证]**：本研究实际运行或自动化检查支持。
- **[源码审查]**：由固定提交中的结构与实现支持，尚未等同于生产/真机验收。
- **[研究判断]**：综合源码事实形成的适用性、成熟度或成本判断，不是上游自述。
- **[建议]**：目标架构、路线与验收标准，不代表上游已有能力。

## 1. 当前架构

### 1.1 系统上下文

**[源码审查]** 项目表面是静态单页应用，完整能力实际跨越浏览器、本机和云端：

```text
┌──────────────────────────── 浏览器 ────────────────────────────┐
│ index.html + styles.css + app.js                               │
│                                                               │
│ 编辑/状态 ─► Markdown 子集 ─► 卡片 Canvas / 长文 DOM ─► 导出   │
│      │                 │                       │                │
│      ├─ local/sessionStorage + IndexedDB        ├─ Clipboard    │
│      ├─ File System Access / Obsidian           ├─ PNG / ZIP    │
│      └─ Supabase Auth / Database / Storage      └─ WebCodecs    │
└───────────────┬──────────────────────┬──────────────────────────┘
                │                      │
       macOS 本机 Python              Supabase Edge Function
       FFmpeg / makelive              signed upload / job state
       Finder / AirDrop               │
       公众号外部桥接                  ▼
                               GitHub Actions macOS worker
```

静态站本身部署简单，但 Live Photo 云端降级和公众号草稿同步把它变成一个多运行时系统。

### 1.2 当前模块职责

| 模块 | 当前职责 | 主要依赖/边界 | 证据 |
| --- | --- | --- | --- |
| `index.html` | 全部工作区、模态框和控件；脚本装配；本地模式开关 | DOM ID 与 `app.js` 强绑定；部分依赖走 CDN | [脚本装配](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/index.html#L1183-L1202) |
| `src/app.js` | 状态、账号、编辑、解析、分页、Canvas、长文、图片、Obsidian、导出、Live Photo 路由 | 共享可变状态和大量直接 DOM 访问 | [主入口](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L1-L90) |
| `src/styles.css` | 工作区、响应式、主题、文章和全部模态框样式 | 一个全局样式表，组件边界主要靠命名约定 | [样式文件](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/styles.css) |
| `src/live-photo-browser.js` | MP4 解复用、WebCodecs 合成/编码、Apple 元数据、ZIP、Web Share | MP4Box、MP4Muxer、JSZip、浏览器编解码能力 | [公开对象](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L607-L610) |
| `src/supabase.js` | Auth、资料/项目 CRUD、素材 Storage、云端实况任务客户端 | CDN Supabase SDK 与运行时配置 | [客户端接口](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/supabase.js#L432-L463) |
| `server.py` | 静态服务、本机 Live Photo、Finder/AirDrop、公众号草稿桥接 | macOS、FFmpeg、ffprobe、uvx/makelive、作者侧外部脚本 | [状态与依赖](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L114-L132) |
| Supabase SQL/Function | 用户隔离、项目/素材持久化、Live Photo job 生命周期和签名 URL | Supabase Auth/DB/Storage/Edge Function | [job 创建](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L194-L244) |
| GitHub workflow/worker | 启动 macOS runner，准备 FFmpeg/makelive，处理云端任务并回写结果 | GitHub Actions、私有 secrets、Supabase | [workflow](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/.github/workflows/cloud-live-photo.yml#L18-L35) |

## 2. 当前设计中值得保留的部分

### 单一正文事实源

**[源码审查]** `content` 同时驱动卡片和长文；模式切换不会维护第二份正文（[默认项目状态](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L574-L608)）。**[建议]** 任何重构都应保留这条单一事实源原则。

### 素材与排版元数据分离

**[源码审查]** 正文只保存 `[[image:id]]`，`images[id]` 保存源、裁剪和布局；大二进制再外置到 IndexedDB（[素材外置](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4756-L4831)）。**[研究判断]** 相比把图片直接嵌入不可编辑 HTML，这种分层更适合重复排版。

### 渐进增强与诚实降级

**[源码审查]** Obsidian 有目录写权限则直写，否则明确下载 ZIP；浏览器能生成 Live Photo 就本地处理，不行再检查本机或云端；文件保存 API 不存在就退回浏览器下载。这些降级都返回可解释结果，而不是伪装成功。

### 输出尺寸与坐标契约

**[源码审查]** 卡片逻辑尺寸、2 倍 PNG 尺寸和 Live Photo 成片尺寸有明确常量；裁剪使用源坐标，卡片命中使用页面坐标（[尺寸常量](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L1-L17)）。**[建议]** 把这些保留为公开契约，并用视觉回归降低重构漂移。

### 已有安全意识

**[源码审查]** RLS、用户目录、签名 URL、job TTL、输入限制、Origin/IP 检查、错误脱敏和输入清理都已经出现（[RLS](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/schema.sql#L25-L71)、[云端 token](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L166-L176)）。**[研究判断]** 这些机制说明系统已有信任边界意识，但不等于完成了安全审计。

## 3. 扩展成本的主要来源

### 3.1 主前端单体

**[源码审查]** `src/app.js` 约 11,800 行，一个文件同时持有 DOM 引用、项目状态、账号会话、编辑器、两套解析、两套渲染、图片交互、文件权限、导出与 Live Photo 编排。函数虽有主题分区，但没有模块依赖边界。

影响包括：

- 修改图片模型可能同时影响本地保存、云同步、Obsidian、卡片、长文和 Live Photo；
- 很难对解析/分页等纯逻辑做无 DOM 单元测试；
- 全局状态使异步竞态和账号切换问题更难隔离；
- 新平台容易继续向主文件追加条件分支。

### 3.2 重复的文档语义

**[源码审查]** 卡片的 `parseBlocks()` 与长文的 `markdownToArticleHtml()` 分别解析正文（[卡片解析](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6190-L6380)、[长文解析](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7370-L7504)）。它们已经出现有序列表、代码块等覆盖差异。继续增加语法会把每项工作变成“实现两次并证明一致”。

### 3.3 平台逻辑嵌在渲染与 UI 中

**[源码审查]** “小红书 5 秒 / 公众号 3 秒”、公众号富文本属性白名单、Finder/AirDrop 按钮、云/本机路由都直接写在主逻辑中。**[研究判断]** 当前只有两个主要平台时，尚可维护；增加知乎、微博、X、飞书等会快速形成条件组合。

### 3.4 素材生命周期分散

**[源码审查]** 同一素材可能同时出现为 Data URL、IndexedDB 条目、Object URL、Supabase Storage path、临时上传、云端 job 输入或本机输出。创建、hydrate、删除、账号切换和过期清理分散在多个文件中，没有统一 `AssetRepository` 或引用计数。

### 3.5 三条 Live Photo 路径存在漂移

**[源码审查]** 浏览器、macOS 本机和云端使用不同编码器、上限和交付方式。固定提交中，云端 manifest 清洗丢弃 `sound`，意味着云端可能忽略“关闭声音”；UI 接受 WebM，而浏览器路径使用 MP4Box。详见[技术原理：三条路径差异](technical-principles.md#103-三条路径并非行为完全等价)。

### 3.6 外部集成不完全自包含

**[源码审查]** 公众号草稿桥接引用仓库之外的 `enqueue_wechat_draft.py`；首个 macOS 启动脚本还写死作者电脑目录（[server.py 路径](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L28-L39)、[启动脚本](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/%E5%90%AF%E5%8A%A8%E5%86%99%E4%BA%86%E5%B0%B1%E5%8F%91.command#L1-L10)）。这使“克隆后可复现”与作者环境中的完整产品能力不完全等价。

### 3.7 依赖与测试缺口

**[源码审查]** `package.json` 没有依赖声明、锁文件、build、test、lint 或 typecheck；部分库 vendored，部分走 CDN（[package.json](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/package.json#L1-L10)、[外部脚本](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/index.html#L1183-L1202)）。

结果是：版本来源、许可证清单、供应链更新、离线构建和回归保证都依赖人工维护。固定提交中也没有可见测试目录或测试配置。

## 4. 目标架构

以下全部为 **[建议]**。

### 4.1 分层目标

```text
┌──────────────────────────── UI Shell ───────────────────────────┐
│ Editor | Card Preview | Article Preview | Asset Panel | Status │
└──────────────────────────────┬──────────────────────────────────┘
                               │ commands / view models
┌──────────────────── Application Services ──────────────────────┐
│ ProjectService | RenderCoordinator | ExportService | SyncService│
└──────────────────────────────┬──────────────────────────────────┘
                               │ stable domain contracts
┌──────────────────────────── Domain Core ────────────────────────┐
│ Project vN | Document AST | AssetRef | LayoutSpec | ExportPlan  │
│ Parse | Validate | Paginate | Migrate | Capability resolution  │
└──────────────┬───────────────────────┬───────────────────────────┘
               │                       │
┌──────────── Renderers ───────────┐  ┌──────── Ports ────────────┐
│ CardRenderer | ArticleRenderer   │  │ AssetStore | ProjectStore │
│ CoverRenderer | PreviewRenderer  │  │ MediaEngine | Publisher   │
└──────────────────────────────────┘  └──────────┬────────────────┘
                                                │ adapters
                                    ┌───────────┴─────────────────┐
                                    │ Browser / IndexedDB         │
                                    │ Local Python / Tauri        │
                                    │ Supabase / GitHub Worker    │
                                    │ WeChat / Obsidian / Export  │
                                    └─────────────────────────────┘
```

核心原则：

1. 领域层不直接读 DOM、`window`、Supabase 或文件系统。
2. 正文只解析一次为版本化 AST，卡片和长文消费同一语义。
3. 二进制素材只通过 `AssetStore` 访问，项目状态保存稳定引用。
4. 平台差异由 adapter/renderer/export profile 表达，不散落在 UI 条件中。
5. 浏览器、本机和云端实现同一 `MediaEngine` 契约，并跑相同合同测试。

### 4.2 建议的核心契约

```ts
type Project = {
  schemaVersion: number;
  id: string;
  source: string;
  documentCache?: {
    sourceHash: string;
    parserVersion: string;
    ast: DocumentAst;
  };
  assets: Record<string, AssetRef>;
  profiles: Record<string, OutputProfile>;
  revision: string;
};

interface Renderer<T> {
  validate(input: RenderInput): Diagnostic[];
  render(input: RenderInput): Promise<T>;
}

interface AssetStore {
  put(blob: Blob, meta: AssetMeta): Promise<AssetRef>;
  get(ref: AssetRef): Promise<Blob>;
  delete(ref: AssetRef): Promise<void>;
}

interface PlatformAdapter {
  capabilities(): PlatformCapabilities;
  validate(plan: PublishPlan): Diagnostic[];
  transform(plan: PublishPlan): Promise<PlatformDocument>;
  preview(document: PlatformDocument): Promise<PreviewArtifact>;
  package(document: PlatformDocument): Promise<DeliveryBundle>;
  deliver(bundle: DeliveryBundle): Promise<DeliveryReceipt>;
  verify(receipt: DeliveryReceipt): Promise<VerificationResult>;
}
```

这些是研究建议的接口形状，不是从上游复制的代码。`source` 是唯一持久事实源；`documentCache` 只是在 `sourceHash + parserVersion` 匹配时可复用的派生缓存，不能与原文各自独立修改。`PlatformAdapter` 与第 7 节使用同一组 `capability → validate → transform → preview → package → deliver → verify` 语义。

### 4.3 AST 应保留的信息

**[建议]** 统一文档模型至少需要：

- 块类型、行内 marks、源文本范围和稳定 node ID；
- 图片/视频引用与 alt/caption；
- 原始 Markdown 中暂不支持语法的保真节点；
- 列表类型、编号、嵌套层级；
- 表格对齐与可分页提示；
- 渲染诊断，例如“该表格无法装入单页”；
- parser version，保证旧项目可迁移。

保留 source range 后，预览拖动、选区样式和正文回写仍可实现；不要为了 AST 丢掉当前有价值的编辑映射。

## 5. 分阶段改造路线

### P0：先冻结行为，再拆代码

**[建议]** 不应先进行大规模重写。先为固定提交建立黄金基线：

- 20–30 份 Markdown fixture，覆盖标题、列表、引用、表格、内联样式、图片和空行；
- 卡片 page model JSON 快照和关键 Canvas 视觉快照；
- 长文 HTML 语义快照与富文本白名单测试；
- PNG 尺寸、ZIP 文件名/顺序、Obsidian 包目录合同；
- 三条 Live Photo 路径的 manifest 与结果合同；
- 本地/云端素材生命周期和账号切换回归。

同时立即修复：

1. 云端 `sound` 字段被清洗掉；
2. WebM 在浏览器路径的能力宣称/回退不一致；
3. 硬编码启动目录与不可用的公众号外部脚本提示；
4. 大块分页越界和长图尺寸预检；
5. 依赖版本与第三方许可证清单。

### P1：提取纯逻辑与基础设施端口

**[建议]** 按低风险顺序拆分：

1. `core/constants`：输出尺寸、平台时长、存储版本；
2. `core/document`：解析、source range、迁移；
3. `render/card-layout`：测量抽象、分页、page model；
4. `render/card-canvas` 与 `render/article-dom`；
5. `assets/repository`：内存、IndexedDB、Supabase adapter；
6. `exports/registry`：PNG、ZIP、富文本、Obsidian、Live Photo；
7. `app/stores`：显式 action/reducer 或小型状态机；
8. `ui/controllers`：只处理 DOM 事件和 view model。

每提取一个模块，旧入口仍调用新模块并跑黄金测试；不要一次替换全部 UI。

### P1：统一解析

**[建议]** 选择成熟 Markdown AST（如 micromark/remark 体系）或自定义小型 parser，但必须满足：

- 输出 source position；
- 自定义颜色/背景/下划线扩展可注册；
- Obsidian 图片语法可在预处理或扩展中解析；
- 未支持语法可以保留，不静默丢失；
- 卡片与长文只消费 AST，不再各自扫原始行。

### P2：平台和模板系统

**[建议]** 定义 `OutputProfile`：

```text
profile:
  id / platform
  canvas size / safe area / max pages
  typography tokens
  image rules
  live duration / accepted codecs
  exporters[]
  delivery instructions
```

模板优先采用数据和设计 Token，不允许任意模板脚本直接访问账号、文件系统或网络。这样既能扩展品牌预设，也能降低第三方模板的供应链风险。

### P2：桌面与自动化

**[建议]** 当浏览器权限和 macOS 桥接成为主要阻力时，可评估 Tauri/桌面壳：

- 原生文件系统与 Obsidian 路径；
- 自带或可检查的 FFmpeg 运行时；
- 统一 Windows/macOS 更新与日志；
- Finder/Explorer、分享和钥匙串 adapter；
- 可离线加载全部前端依赖。

CLI/Codex Skill 可建立在同一 domain core 上：输入 Markdown + asset folder + output profile，输出可追踪的 delivery bundle。CLI 不应绕开交互版的校验规则。

### P3：协作

**[建议]** 团队功能需要新的领域模型，而不是给现有 `projects.data` 再加字段：

- revision/branch、评论锚点与审核状态；
- 资产去重、引用计数和保留策略；
- 乐观锁或 CRDT，而非无条件 upsert；
- 发布凭据托管、角色权限和审计日志；
- 内容日历、渠道状态与失败重试。

这会从“个人出版工具”升级为内容运营系统，产品范围、成本和许可证都发生根本变化。

## 6. 产品扩展方向

以下均为 **[建议]**。

| 优先级 | 方向 | 用户价值 | 前置条件 | 最小验收 |
| --- | --- | --- | --- | --- |
| P0 | 品牌/主题预设 | 同一账号输出保持一致 | Token 化样式与 profile schema | 预设可导入/导出，旧项目视觉不变 |
| P0 | Markdown 兼容补齐 | Obsidian/技术文章少返工 | 统一 AST | 链接、有序/嵌套列表、任务列表在两输出语义一致 |
| P0 | 兼容诊断 | 导出前就知道当前浏览器/格式能否成功 | capability resolver + 媒体矩阵 | WebM/HEVC/非 AAC 给出准确路线或回退 |
| P1 | 多尺寸卡片 | 覆盖不同社交平台与品牌模板 | 尺寸无关布局、safe area | 同一 AST 可渲染至少三种尺寸，无内容丢失 |
| P1 | 封面与摘要 | 减少发布前额外工具 | cover renderer | 封面模板不改正文，导出可追踪 |
| P1 | 更多内容出口 | 知乎、微博、X、飞书、语雀等复用 | platform adapter | 每个平台有校验、预览、bundle 与限制说明 |
| P1 | 完全离线包 | 提升隐私与弱网可用性 | 自托管依赖、Service Worker/桌面壳 | 断网重载后可完成基础编辑和 PNG/ZIP 导出 |
| P2 | CLI/批处理 | 重复栏目和存量 Markdown 自动生产 | headless renderer、字体包、确定性测试 | 同输入/profile 重复输出可复现 |
| P2 | 可选 AI 辅助 | 标题、摘要、平台改写与卡片拆分 | 可追踪 prompt/模型、人工确认 | AI 结果永不覆盖源正文，变更可审阅/撤销 |
| P2 | Android Motion Photo | 扩大动态照片交付 | 独立媒体 adapter 与真机测试 | Google Photos/目标 Android 设备真机识别 |
| P3 | 团队审批/排期/分析 | 支持内容运营组织 | 商业许可、权限、审计、渠道 API | 端到端权限和失败恢复，不是 UI 原型 |

## 7. 平台适配器的边界

**[建议]** 平台扩展不应等同于“再加一个导出按钮”。每个 adapter 应完成：

```text
capability   当前账号/环境允许什么
validate     字数、图片数、尺寸、格式、动态媒体规则
transform    从 AST 生成平台语义
preview      显示最终结构与降级
package      生成文件、富文本或 API payload
deliver      下载、复制、草稿或发布
verify       返回可确认的草稿/发布结果
```

`deliver` 必须区分：

- **素材生成**：只产生 PNG/ZIP/HTML；
- **草稿创建**：远端有记录但未发布；
- **正式发布**：内容已对外可见；
- **交接指导**：用户仍需在手机或平台完成最后步骤。

当前上游主要覆盖前三者中的前两类和交接指导，不应把“导出成功”表述成“平台发布成功”。

## 8. AI 扩展的正确位置

**[建议]** AI 最适合位于 AST 前后、但不进入确定性渲染核心：

```text
原始正文（永远保留）
   ├─ AI 建议：标题/摘要/拆卡/平台改写
   │       └─ diff + 人工接受
   ▼
版本化正文 / AST
   ▼
确定性校验、分页和导出
```

应记录模型、时间、输入版本和接受的 diff；AI 失败不应阻止手工排版。对图片/视频上传到模型服务必须另行征得用户同意，不能借用“浏览器本地生成 Live Photo”的隐私描述。

## 9. 测试与验证体系

以下均为 **[建议]**。

### 单元与合同测试

- parser：输入 Markdown → AST 快照与 source range；
- migration：每个旧 `schemaVersion` → 当前项目模型；
- pagination：给定字体测量 fixture → page model；
- adapter：同一 manifest 在 browser/local/cloud 的字段和含义一致；
- asset store：put/get/delete、配额、失败恢复与孤儿清理；
- security：路径清理、HTML 转义、Origin/token/大小限制。

### 视觉测试

- 卡片在固定字体包下做像素或结构快照；
- 长文主题在 390、768、1440 px 检查；
- 微信复制后在隔离 DOM 中核对 inline style 白名单；
- 深色/浅色、系统字体 fallback、emoji 和中英混排。

### 媒体测试

- 用 ffprobe 检查编码、时长、帧率、音轨和旋转；
- 解析 JPEG MakerNote 与 MOV metadata，确认相同 asset ID；
- 真机矩阵覆盖目标 iOS/macOS/Android 版本；
- 用公开、无隐私的固定短视频 fixture 跑三条路径；
- 记录时间、内存、文件体积和取消恢复，不只记录“成功”。

### 端到端测试

- 游客 → 编辑 → 多页卡片 → PNG/ZIP；
- 长文 → 富文本 → 真实微信草稿；
- Obsidian 只读/可写/拒绝；
- 账号 A/B 切换、token 刷新、离线修改和冲突；
- 浏览器不支持 WebCodecs → 本机/云端选择 → 结果下载；
- job 超时、取消、runner 失败、签名 URL 过期和清理。

## 10. 性能与可观测性

**[建议]** 先定义参考设备和 fixture，再设阈值；至少记录：

- `parse_ms`、`layout_ms`、`draw_ms`、页数、字数、图片数；
- 长图宽高、Canvas 分配失败、PNG 编码时间；
- Live Photo `demux/decode/compose/encode/package` 各阶段时间；
- 峰值 JS heap、源 Blob/ArrayBuffer 大小、输出大小；
- 云端排队、runner 冷启动、处理、上传、签名下载与清理时间；
- 同步队列长度、失败重试、素材缺失和冲突次数。

日志不得记录正文、原视频 URL、access token、App Secret 或完整本地路径。生产错误应使用匿名 job/revision ID 串联。

## 11. 安全、隐私与运维

### 必须显式化的数据生命周期

**[建议]** 每个动作旁显示：处理位置、上传内容、保存周期、删除方式和降级结果。例如：

- “浏览器生成：原视频不上传；视频保存在当前浏览器 IndexedDB，清站点数据会删除”；
- “账号同步：项目与符合大小限制的素材上传到 Supabase”；
- “多账号记忆：最多 6 组 access/refresh token 快照保存在当前 origin 的 localStorage；同源脚本与 XSS 属于凭据风险”；
- “云端生成：视频、卡片、遮罩上传，job 预计一小时过期”；
- “反馈：文字与截图发送到第三方 FormSubmit”；
- “公众号草稿：正文和图片通过本机桥接进入微信侧”。

### 依赖供应链

**[建议]** 建立锁文件、SBOM、第三方许可证报告与更新策略；停止在生产 HTML 中依赖无完整性校验的浮动 CDN 主版本。离线版应自托管依赖并验证构建哈希。

### 本机服务

**[建议]** 默认绑定 `127.0.0.1`；若需要局域网领取，使用独立最小服务/端口、一次性 token、短 TTL 和显式开关。对 Finder/AirDrop/公众号等高权限动作加入来源、用户确认和审计信息。

## 12. 许可证对扩展的约束

**[源码审查]** 上游个人非商业许可证允许个人学习、研究和非商业修改/分享，但明确禁止公司、团队、客户项目、商业内容生产、SaaS/API、付费生成、咨询培训等，除非取得事先书面许可（[允许范围](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/LICENSE#L11-L19)、[禁止范围](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/LICENSE#L21-L37)）。

因此：

- **[建议]** 个人研究、教学 Demo、非商业实验可在保留许可与署名的前提下开展；
- **[建议]** 若要把上游代码/衍生版本用于商业插件、团队工具、客户交付或内容生产，先谈书面商业许可；
- **[建议]** 若走独立实现，需求、设计和代码都应独立形成，不复制上游源码、素材或独特表达，并单独核查相关专利、商标、平台条款和第三方依赖；
- **[建议]** 许可证判断不是技术问题，重要商业决策应由合格法律专业人士审核。

## 13. 面向不同目标的决策

| 你的目标 | 建议 | 原因 |
| --- | --- | --- |
| 个人 Markdown/Obsidian 内容排版 | 先试在线版和普通导出 | 现有闭环已经覆盖主要个人流程 |
| 学习浏览器媒体与出版工作流 | 重点读卡片布局、IndexedDB、WebCodecs 和降级设计 | 一套代码连接多个典型 Web 能力 |
| 在现有仓库上增加一个小模板 | 先确认非商业许可，再加黄金视觉 fixture | 模板会触及共享渲染路径，需防回归 |
| 做个人定制 Fork | 先拆纯 parser/layout，再改 UI | 降低继续堆叠主文件的成本 |
| 做公司内部内容工具 | 不应直接使用；先取得书面商业许可并完成安全/冲突/审计改造 | 许可证明确禁止，工程也未达到组织级要求 |
| 做商业 SaaS 或客户项目 | 优先谈许可；否则独立需求重建 | 许可证与当前耦合都是硬约束 |
| 只借鉴产品思想 | 采用“一份正文、多输出、诚实降级”的原则 | 原则可迁移，但不要复制受保护实现与素材 |

## 14. 推荐的第一轮实施清单

以下全部为 **[建议]**，按风险收益排序：

1. 固定字体、Markdown、图片和短视频测试资产，建立当前输出基线。
2. 修复云端 `sound`、WebM 路由、启动脚本和超长块分页。
3. 引入包管理、锁文件、lint、format、unit test 和浏览器 E2E。
4. 提取 `document-parser`、`card-layout`、`article-renderer` 三个纯/半纯模块。
5. 定义 `AssetRef` 与 `AssetStore`，统一 IndexedDB/Supabase 生命周期。
6. 定义 `LivePhotoManifest` schema，在浏览器、本机、云端做合同测试。
7. 建立 `OutputProfile` 与 template tokens，再扩展新尺寸/新平台。
8. 在功能扩张前解决跨设备冲突、隐私清单和许可证授权。

完成前四项后，项目才从“能继续追加功能”进入“能可控扩展”的阶段。

## 来源

- [研究入口](../README.md)
- [技术原理](technical-principles.md)
- [固定提交树](https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e)
- [产品原则](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/PRODUCT.md#L26-L32)
- [上游能力与边界](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/README.md#L167-L222)
- [个人非商业许可证](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/LICENSE)
