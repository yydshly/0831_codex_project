# Write Then Publish 技术原理

本文解释 `write-then-publish` 在固定提交 [`7a708312247e69155ca586c49c65c5306fd88e9e`](https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e) 中，如何从一份正文和素材状态得到卡片、长文、图片包与 Live Photo。它是[研究入口](../README.md)的技术补充，不是上游官方文档。

## 证据边界

- **[已验证]**：固定提交在 Windows 研究环境中通过 `node --check`、Python `py_compile`；`python server.py` 启动后，首页与实况状态接口可访问。没有在本研究中连接真实账号或平台。
- **[源码审查]**：下文描述的函数、数据流、尺寸、限制和风险可由固定提交直接确认；不等同于真机或生产验收。
- **[建议]**：模块化、性能、安全或测试方案属于研究建议，不代表上游实现。
- 上游源码注释中出现的“约 0.6 秒”“VMAF 96.7”等数字没有随仓库提供可复现实验记录，本文不把它们标为 **[已验证]**。

## 1. 运行时形态

**[源码审查]** 项目没有前端构建步骤。Vercel 直接把仓库根目录作为静态输出（[vercel.json](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/vercel.json#L1-L6)）；`index.html` 按顺序加载 vendored JSZip、MP4Box、MP4Muxer，再从 CDN 加载 Lucide、html2canvas 和可选 Supabase SDK，最后执行应用脚本（[index.html](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/index.html#L1183-L1202)）。

```text
index.html
  ├─ src/styles.css
  ├─ src/vendor/{jszip,mp4box,mp4muxer}
  ├─ src/live-photo-browser.js
  ├─ CDN: lucide + html2canvas
  ├─ 可选 CDN: Supabase SDK + src/supabase*.js
  └─ src/app.js
```

URL 带 `?mode=local` 时，页面在加载阶段跳过 Supabase SDK 和账号模块；否则加载云端配置。这是一种运行模式开关，不是不同构建产物。

**[已验证]** `package.json` 的 `start` 只是执行 `python3 server.py`；本研究用本机 Python 3.10 启动后，`GET /` 返回 `200`，页面标题存在，`/api/live-photo/status` 也返回 `200`。在 Windows 上状态明确为 `macos: false`、`ready: false`，符合[服务端平台检查](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L114-L132)。

## 2. 一份项目状态，两个主渲染器

### 2.1 项目状态

**[源码审查]** 表单状态同时保存正文、作者、卡片颜色与字号、头像、图片索引、应用模式、长文主题和 Obsidian 路径。`appMode` 只在 `cards` 与 `article` 之间切换，正文 `content` 没有复制成第二份（[默认状态](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L574-L608)）。

可以把项目抽象为：

```text
Project
  id, title, updatedAt
  data:
    content              # 唯一正文字符串
    author/profile       # 头像、名称、昵称
    card settings        # 字号、行距、颜色、字体、页眉模式
    article settings     # 主题、字体、字号档、主题色
    images[id]           # 图片/实况元数据和素材引用
    obsidianNotePath
```

编辑后，`saveState()` 更新当前项目、把它移到历史列表顶部、限制最多 24 个项目，然后写本地状态并调度云同步（[保存流程](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L1154-L1186)）。

### 2.2 渲染分流

```text
readForm()
   │
   ├─ appMode = cards   ─► parseBlocks ─► buildPages ─► Canvas[]
   │
   └─ appMode = article ─► markdownToArticleHtml ─► article DOM
```

**[源码审查]** 两条管线共享正文和部分行内 token 逻辑，但块级解析各写了一套：卡片使用 `parseBlocks()`，长文使用 `markdownToArticleHtml()`。这保证了两种输出可以独立优化，也带来语义漂移风险。例如卡片把有序列表与无序列表都转成 `•`，长文只识别无序列表；两边对不可分割的大块处理也不同。

## 3. 自研 Markdown 子集

### 3.1 块级结构

**[源码审查]** `parseBlocks()` 按行扫描正文，识别：

- `#` 到 `######` 标题，最终折叠为 `h1`、`h2` 或 `h3`；
- `> ` 引用；
- 无序或有序列表标记，卡片中统一为圆点；
- Markdown 表格；
- 内部图片 `[[image:id]]`、双图 `[[image:a|b|ratio]]`；
- Obsidian `![[path]]` 和标准 Markdown 图片；
- 空行/分隔线对应的留白。

对应实现见[块解析](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6190-L6380)和[图片块识别](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6085-L6105)。

### 3.2 行内 token

**[源码审查]** `parseInline()` 递归识别：

- `***粗斜体***`、`**粗体**`、`*斜体*`；
- 内部图片 token；
- 自定义 `{{color:#hex|...}}`、`{{bg:#hex|...}}`；
- `{{underline:solid|...}}` / `dashed`。

每个 token 保留 `sourceStart/sourceEnd`，让预览中的图片命中、移动、删除和正文选区可以映射回原字符串（[行内解析](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6412-L6530)）。

### 3.3 不是完整 Markdown AST

**[源码审查]** 解析结果只是面向当前渲染器的对象数组，没有统一 AST schema、插件钩子或语法扩展注册表。以下能力在固定提交中没有完整实现：

- 链接语义、任务列表、有序列表编号与嵌套列表；
- 脚注、公式、Mermaid、HTML 块；
- 语言标记代码高亮；
- 跨平台可序列化的标准文档模型。

**[建议]** 如果要扩展平台或语法，应先建立统一 AST 和兼容测试，不要继续在两套逐行解析器中分别添加正则。

## 4. 卡片：测量、换行、分页、绘制

### 4.1 逻辑尺寸与输出尺寸

**[源码审查]** 卡片使用 `864 × 1152` 的逻辑坐标，在实际 Canvas 上按 2 倍绘制，因此标准 PNG 为 `1728 × 2304`。Live Photo 页面另有 `1080 × 1440` 成片坐标（[尺寸常量](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L1-L17)）。

两层尺寸的意义是：布局算法只处理一套稳定坐标；导出时通过 Canvas transform 得到高分辨率位图，不必把全部间距、字号和命中框乘二。

### 4.2 换行

**[源码审查]** 文本先用 `Intl.Segmenter("zh", { granularity: "grapheme" })` 切为字素；英文、数字和常见连续符号会合并为 word 单元。每个单元用当前 Canvas 字体的 `measureText()` 加字距测量，再按最大宽度换行。中文前后标点有简化禁则，避免部分闭标点出现在行首、开标点落在行尾（[切分与禁则](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6615-L6717)）。

```text
inline tokens
  → grapheme / word units
  → 设置字体
  → measureText(unit) + letter spacing
  → 达到 contentWidth 时换行
  → 保留 token 样式与源文本范围
```

**[源码审查]** 这是启发式排版，不是完整中文排版引擎：禁则集合有限，字体实际载入时机没有形成显式渲染契约，浏览器/系统字体不同可能改变分页。

### 4.3 分页

**[源码审查]** `buildPages()` 为每页计算内容边界。头像每页显示或只在首页显示会改变顶部可用空间。对每个块：

1. 计算顶部间距与块高度；
2. `ensureSpace()` 判断当前页是否还能容纳；
3. 不够且本页已有内容时结束本页；
4. 文本逐行进入页面，图片和表格作为布局项；
5. 最后得到一组只含绘制指令的 page 对象。

实现见[分页循环](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L6849-L7021)。

**[源码审查]** 文本能逐行跨页，但表格和图像等块不会被拆分。`ensureSpace()` 只在“本页已有内容”时换页；如果一个表格自身高于整页，它仍可能越过底边。因此，超长表格是明确的边界测试项。

### 4.4 Canvas 绘制与交互命中

**[源码审查]** 每个 page 转为高分辨率 Canvas，先画背景和页眉，再按 item 类型画图片、拼图、表格和文字。页面对象同时生成图片命中区域和拖放目标，使右侧预览中的拖动、调整尺寸和删除能改写图片布局或正文位置（[绘制入口](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7024-L7055)）。

### 4.5 PNG 与 ZIP

**[源码审查]** 普通页面通过 `canvas.toBlob(..., "image/png")` 输出；若 File System Access API 可用，用户选择保存位置，否则浏览器下载。批量导出使用 JSZip 的 `STORE`，因为 PNG 已压缩，再做 Deflate 收益很小（[PNG 保存](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L10979-L11029)、[批量打包](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L11246-L11291)）。

跨域网络图片若没有正确 CORS，会使 Canvas 变为 tainted；代码捕获 `SecurityError` 并要求重新上传，这是浏览器安全模型，不是 PNG 编码错误。

## 5. 长文：DOM、富文本和长图

### 5.1 Markdown 到主题 DOM

**[源码审查]** 长文管线再次逐行扫描正文，识别 fenced code、表格、图片、标题、引用和无序列表，组合为 HTML 字符串。文本与属性先转义，自定义颜色只从已校验的 token 进入 style（[长文转换](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7370-L7540)）。

生成的 `<article>` 通过 class 和 CSS 自定义属性选择主题、字体、字号和强调色；实况项在 DOM 构建后用 `<video>` 增强预览，但仍保留封面 `<img>` 作为静态输出基础。

### 5.2 公众号富文本

**[源码审查]** 微信编辑器不能依赖本页面 class 与外部样式表，因此代码克隆 `<article>`，读取每个节点的 computed style，只复制白名单属性为 inline style，再去掉 class、id、data 属性和视频/交互控件。然后写入同时包含 `text/html` 与 `text/plain` 的剪贴板；不支持现代 Clipboard API 时退回 `execCommand("copy")`（[样式内联](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7617-L7724)、[剪贴板](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7726-L7763)）。

```text
article DOM
  → cloneNode(true)
  → getComputedStyle(source)
  → 白名单样式写入 clone.style
  → 去掉运行时 class / data / video controls
  → ClipboardItem(text/html, text/plain)
```

**[源码审查]** 这提高了跨编辑器可携带性，但不能保证微信后续不会清洗属性；必须用真实后台回归测试，而不能只看当前页面预览。

### 5.3 PNG 长图

**[源码审查]** 长图使用 CDN 版 html2canvas 把完整 article DOM 栅格化。代码还把新版浏览器可能返回的 `color(srgb …)` 计算色转为 rgba，以绕开 html2canvas 1.x 的解析限制（[长图导出](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L11032-L11140)）。

长图高度等于 `article.scrollHeight`。超长内容会受到浏览器单 Canvas 最大尺寸、内存和编码耗时限制；源码没有分片长图策略。

## 6. 图片与素材状态

### 6.1 导入与内部引用

**[源码审查]** 普通图片通过 `FileReader.readAsDataURL()` 进入内存，为每张图生成 ID，并在正文插入 `[[image:id]]`。正文控制叙事顺序，`images[id]` 保存素材、裁剪和布局元数据（[图片导入](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4683-L4689)、[ID 与引用](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4920-L4968)）。

### 6.2 非破坏式裁剪

**[源码审查]** 裁剪框用源图像素坐标 `{x,y,width,height}` 保存。拖动和缩放只改变元数据，不会立刻生成一张裁掉的新图片；渲染时 `drawImage()` 读取源矩形并绘到目标矩形。固定比例通过调整选区而不是拉伸画面实现（[裁剪状态](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L5737-L5865)）。

这使同一源图可以反复修改取景，但也意味着原始大图持续占用存储。

### 6.3 localStorage 与 IndexedDB 分层

**[源码审查]** 大 Data URL 会迅速占满 localStorage，因此项目 JSON 只保留元数据和 `srcKey`，大图片本体与视频 Blob 放入 IndexedDB。加载项目时再 hydrate 回内存（[IndexedDB](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4692-L4784)、[外置/回填](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4791-L4856)）。

```text
localStorage / sessionStorage: Project JSON + image.srcKey + videoKey
IndexedDB:
  videos[key] → Blob
  images[key] → Data URL
内存:
  hydrated image.src + object URL + layout state
```

**[源码审查]** 图片外置写入使用 fire-and-forget Promise；项目元数据可能先落盘，素材写入稍后完成。浏览器异常关闭、配额不足或事务失败时，项目仍可能存在但画面缺失。产品已有“重新上传”的降级提示，但没有事务级原子提交。

## 7. Obsidian 读写

### 7.1 引用解析

**[源码审查]** 路径会统一斜杠、移除查询/片段并转小写；目录上传形成的内存 lookup 同时尝试完整相对路径和文件名，遇到多个同名候选会返回 `ambiguous` 而不猜测（[路径与 lookup](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L4970-L5011)）。但 `FileSystemDirectoryHandle` 路径按文件名递归回退时会返回首个匹配，没有做多候选检测；这是同名素材仍需修复的边界（[目录句柄递归查找](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L5381-L5403)）。

连接 Vault 有两条路径：

- 支持且允许 File System Access API：保存 `FileSystemDirectoryHandle` 到 IndexedDB，按需请求 read/readwrite 权限；
- 不支持或处于嵌入式/本地环境：通过 `webkitdirectory` 让用户选择目录，只建立文件查找表，不能直接写回。

### 7.2 写回与降级

**[源码审查]** 导出时，内部 `[[image:id]]` 被还原成 Obsidian Wiki 引用。已有 `vaultPath` 的素材复用原路径；新图片写到 `写了就发/附件/`，正文写到 `写了就发/<标题>.md`。获得写权限时直接创建目录与文件；没有写权限时用 JSZip 生成同样目录结构的导入包（[导出模型](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L5247-L5278)、[写回/ZIP](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L5281-L5347)）。

这是一种“有能力则直写，否则给出明确可携带结果”的渐进增强设计。

## 8. 本地状态与 Supabase 同步

### 8.1 存储作用域

**[源码审查]** 游客作用域使用 `sessionStorage`；`local` 和账号作用域使用 `localStorage`，key 带 `guest` 或 `user_<id>` 后缀（[作用域选择](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L29-L59)）。这让同一浏览器的多个账号与游客草稿逻辑隔离。

### 8.2 云端数据

**[源码审查]** Supabase 保存：

- `profiles`：作者名称、handle、头像 URL 与裁剪；
- `projects`：项目 JSON 与更新时间；
- `avatars`：公开头像 bucket；
- `project-assets`：私有项目素材 bucket。

表定义、bucket 与对象策略分别见[账号与项目表](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/schema.sql#L4-L20)、[两个素材 bucket](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/schema.sql#L73-L100)和[用户目录策略](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/schema.sql#L102-L172)；数据库行与对象路径均以 `auth.uid()` 或用户 ID 目录约束。

修改后约 850 ms 防抖，上传尚无 storage path 的图片/视频，再 upsert 项目。超过 80 MiB 的视频跳过云备份，但项目本身仍同步（[云端准备](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L2792-L2851)、[批量 upsert](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L2854-L2874)）。

**[源码审查]** 当前模型没有版本向量、字段级合并或显式冲突 UI。登录时云端列表成为当前账号工作区，修改后按 ID upsert；跨设备同时编辑属于最后写入覆盖型风险，应在团队化前解决。

## 9. 浏览器 Live Photo 原理

### 9.1 能力门槛

**[源码审查]** 浏览器路径只有在以下对象都存在时启用：`VideoEncoder`、`VideoDecoder`、`OffscreenCanvas`、MP4Box、MP4Muxer、JSZip（[supported()](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L27-L35)）。前端优先选择这条路径，只有不支持时才检查本机或云端服务（[生成路由](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L10007-L10026)）。

这个探测只检查对象和库是否存在，没有先验证源容器/codec 或 H.264 encoder config；一旦对象门槛通过，前端直接进入浏览器渲染，执行失败也不会自动改走本机或云端（[浏览器路径调用](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L10017-L10031)）。因此 UI 接受 WebM 不等于当前 MP4Box 路径必然能处理，能力探测和失败回退都需要更细的合同。

### 9.2 解复用

**[源码审查]** `demuxVideo()` 先把整个 Blob 读为 ArrayBuffer，再交给 MP4Box。它只分批提取样本，并在覆盖所选时间窗后停止，以减少样本复制和解码工作；但“整个文件读入 ArrayBuffer”仍会产生与源文件大小同级的内存占用（[解复用](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L40-L124)）。

**[源码审查]** UI 接受 MP4、MOV、WebM，但浏览器本地解复用固定使用 MP4Box；本研究没有证据证明 WebM 可走该路径。服务端 FFmpeg 路径明确识别 WebM。这是应纳入格式矩阵的兼容缺口，而不是可以忽略的文案差异。

### 9.3 逐帧合成

**[源码审查]** 输出目标固定为 `1080 × 1440`、30 fps、约 6 Mbps H.264。算法为：

```text
MP4Box samples
  → 从片段起点前最近关键帧送入 VideoDecoder
  → 对目标时间窗中的每一帧：
       1. OffscreenCanvas 画静态卡片页
       2. 圆角 clip 到实况图片区域
       3. 按 crop/focus 画当前视频帧
       4. 在封面帧位置导出 JPEG
       5. VideoEncoder 编码 H.264
  → MP4Muxer 生成视频
```

对应实现见[画面合成与编码](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L168-L287)。卡片内容会叠入每一帧，因此视频画面必须重新编码，不能只复制原视频轨。

### 9.4 音频

**[源码审查]** 当用户选择保留声音且原音轨是带 description 的 AAC 时，音频样本按选定时间窗直接复用，不解码、不重编码；非 AAC 或缺少描述时静音，而不是有损转码（[音轨判断与复制](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L183-L201)、[时间戳重基准](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L289-L310)）。

### 9.5 Apple 配对信息

**[源码审查]** 生成一个 UUID，并把它写到两处：

- MOV：`moov/meta` 中的 `com.apple.quicktime.content.identifier`；
- JPEG：EXIF MakerNote 的 Apple 私有 `0x0011` tag。

两个文件使用同一个 ID，再与 `metadata.plist` 放进 `.pvt/` 目录并用 ZIP 交付（[MOV metadata](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L323-L408)、[JPEG MakerNote](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L410-L472)、[打包](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js#L531-L552)）。

**[源码审查]** 代码结构能确认“写入相同标记”的意图；**本研究未在 iPhone/Photos 上验证**该字节结构、文件名、目录或分享方式在当前系统版本下必然被识别。

## 10. 本机与云端 Live Photo 降级

### 10.1 macOS 本机服务

**[源码审查]** Python 服务接收视频、卡片 PNG 与圆角遮罩，校验大小和文件头，用 ffprobe 读取媒体信息、FFmpeg 合成，再调用 `makelive==0.7.0` 生成并验证 JPG/MOV 配对与 `.pvt`（[输入与打包](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L203-L325)、[渲染入口](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L328-L418)）。Finder 显示与 AirDrop 也由这个服务桥接。

服务监听 `0.0.0.0:5173`，用于局域网领取页。普通 GET 页面只检查 loopback client IP；变更型 POST API 同时检查 loopback IP 与 Origin；带随机 token 的领取/下载路由则可从局域网访问（[请求边界](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L1130-L1187)、[监听](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L1261-L1267)）。它应只运行在可信网络和本机用户环境。

### 10.2 云端服务

**[源码审查]** 云端路径由四层组成：

```text
浏览器
  → Supabase Edge Function 创建 job、限流、签发上传 URL
  → Supabase Storage 保存 video/page/mask
  → repository_dispatch 启动 GitHub Actions macOS runner
  → worker 下载输入，复用 server.py 渲染并上传 result.zip
  → Edge Function 返回短期签名下载 URL，并清理输入
```

Edge Function 限制视频 150 MiB、单图 15 MiB、总计 180 MiB，job TTL 为 1 小时；按登录用户或 IP 哈希限流，access token 只保存 SHA-256，输入/输出使用签名 URL（[限制与 token](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L3-L12)、[任务创建](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L194-L244)、[结果下载签名](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L294-L300)、[worker 输入/输出签名](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L328-L347)）。Actions runner 固定 macOS、15 分钟超时，并缓存 FFmpeg 与 makelive 运行时（[workflow](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/.github/workflows/cloud-live-photo.yml#L25-L112)）。

### 10.3 三条路径并非行为完全等价

**[源码审查]** 至少存在以下差异：

| 项目 | 浏览器 | macOS 本机 | 云端 |
| --- | --- | --- | --- |
| 原视频位置 | 留在设备内存/IndexedDB | POST 到本机服务 | 上传到 Supabase Storage |
| 画面编码 | WebCodecs H.264 | FFmpeg | FFmpeg on macOS runner |
| 音频 | AAC 可直通，否则静音 | FFmpeg 根据 `sound` 处理 | 当前 manifest 清洗会丢弃 `sound` 字段 |
| 输出落点 | 浏览器 Blob/下载 | 本机磁盘，可 Finder/AirDrop | 短期签名下载 URL |
| 体积上限 | WebCodecs 对象门槛通过时 UI 允许到 1 GiB；否则先限 350 MiB，且均受浏览器内存约束 | 请求约 350 MiB | 视频 150 MiB、总计 180 MiB |

浏览器选择文件时的 1 GiB / 350 MiB 分支见[`handleLivePhotoVideo()`](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L8483-L8499)。

特别地，前端 manifest 发送 `sound`，但 Edge Function 的 `sanitizeManifest()` 没有保留该字段；worker 把清洗后的 manifest 原样交给本机渲染函数，而本机函数缺省值是保留声音（[前端字段](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L10074-L10094)、[云端清洗](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts#L93-L113)、[worker 透传](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/scripts/cloud_live_photo_worker.py#L115-L145)、[服务端缺省](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L333-L357)）。因此“云端关闭声音”在固定提交上存在实现缺口，应列为 P0 回归项。

## 11. 公众号草稿桥接

**[源码审查]** 前端不会直接调用微信 API。用户确认标题、封面和作者后，把已内联样式的 HTML、封面 Data URL 与项目 slug POST 到本机 `/api/wechat/drafts`。Python 服务把正文中的 Data URL 图片落为临时文件，再调用外部 `enqueue_wechat_draft.py` 等待草稿同步结果（[前端请求](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L7872-L7916)、[服务端同步](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L965-L1045)）。

**[源码审查]** 外部脚本路径和配置路径面向作者本机生态，所引用脚本不在本仓库内（[路径常量](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py#L28-L39)）。所以“公众号草稿同步”不是单独克隆仓库后即可完整复现的自包含能力；在线用户通用能力是复制富文本。

## 12. 信任边界

**[源码审查]** 应把数据位置分成四类，而不是笼统写“本地优先”：

| 数据/动作 | 可能位置 | 触发条件 |
| --- | --- | --- |
| 游客正文与元数据 | 当前标签页 `sessionStorage` | 选择游客模式 |
| 本地图片/视频 | IndexedDB | 导入素材 |
| 最多 6 组账号 access/refresh token 快照 | 当前 origin 的 `localStorage` | 登录并启用多账号记忆 |
| 账号项目与符合限制的素材 | Supabase 数据库/Storage | 登录且发生同步 |
| Live Photo 云端输入 | Supabase 临时 bucket + GitHub runner | 浏览器不支持且云端服务被选中 |
| 反馈文字/截图 | FormSubmit 外部端点 | 用户主动提交反馈 |
| 公众号内容 | 本机桥接与微信侧 | 用户确认同步草稿 |

“浏览器路径不上传原视频”只描述特定 Live Photo 生成路径，不能推导为登录项目素材不上传、反馈不发送或页面完全离线。多账号切换会把 access/refresh token 明文快照写入同源 `localStorage`（[上限与 key](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L37-L38)、[快照与持久化](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js#L1231-L1288)）；这是浏览器持久会话的取舍，也意味着 XSS 或同源第三方脚本会进入凭据威胁模型。

## 13. 性能模型

### 卡片

**[源码审查]** 一次卡片重渲染近似包括解析、字形测量、图片解码/尺寸计算、分页和每页 Canvas 绘制：

```text
T_card ≈ T_parse + N_glyph · T_measure + N_page · T_draw + T_image
M_card ≈ Σ(1728 · 2304 · 4 bytes per page) + decoded assets
```

单张输出 Canvas 的原始 RGBA 缓冲约 15.2 MiB；多页同时保留 `state.canvases` 时会线性增加，再叠加源图解码和导出 Blob。实际浏览器内存会更高。

### 浏览器实况

**[源码审查]** 主要成本是完整视频 ArrayBuffer、解码帧、`1080 × 1440` OffscreenCanvas、编码队列和最终 MP4/ZIP：

```text
T_live ≈ T_demux + duration · fps · (T_decode + T_composite + T_encode) + T_package
M_live_peak 可能同时包含 full source ArrayBuffer + frames/queues + canvas + output
```

即使只取 3/5 秒，当前实现仍先把整个源文件读成完整 ArrayBuffer。源 Blob 仍被引用，但它的后端可能是磁盘或共享存储，不能据此断言同等字节常驻 JS heap；大文件、低内存设备与多页实况批量导出仍必须做专门基准。

## 14. 可复用原则

- **[源码审查]** 将正文引用与素材二进制分开，可以让文本顺序、裁剪和布局保持可编辑，同时避免把大 Blob 塞进 localStorage。
- **[源码审查]** 一份事实源、多个渲染器，能减少渠道复用时的内容漂移；前提是共享解析语义，而不是长期维护两套正则。
- **[源码审查]** 能力探测后选择浏览器、本机或云端，是渐进增强的有效模式；三条路径必须有行为契约和一致性测试。
- **[源码审查]** 公众号富文本通过 computed style 白名单内联，比直接复制依赖 class 的 DOM 更可携带。
- **[建议]** “本地优先”必须逐数据类型说明位置、保存周期、触发条件和降级，不能用一句隐私文案覆盖所有链路。

## 15. 验证清单

### 解析与卡片

- [ ] 标题、段落、引用、空行、粗斜体、自定义颜色在卡片和长文中语义一致。
- [ ] 中文闭标点不出现在行首，开标点不落在行尾；中英混排与 emoji 不拆坏字素。
- [ ] 每页头像/仅首页头像会改变可用高度，但不会丢内容。
- [ ] 超长单词、超高图片、超长表格和 24 个项目边界有明确结果。
- [ ] 不同系统字体和 `devicePixelRatio` 下分页稳定或差异被记录。

### 图片与 Obsidian

- [ ] 裁剪仅改变源矩形，不拉伸；预览与 PNG 一致。
- [ ] 粘贴、拖放、批量导入、同名 Obsidian 图片、缺失图片均有可恢复反馈。
- [ ] File System Access API 可写、只读、拒绝与不支持四条路径都被覆盖。
- [ ] IndexedDB 写入失败或清站点数据后，项目显示明确的素材缺失态。

### 长文与微信

- [ ] 复制后的 HTML 在真实公众号编辑器中保留允许的主题、表格、代码与图片样式。
- [ ] 微信清洗后的结果与预览差异有视觉快照。
- [ ] 超长文章导出前检查 Canvas 尺寸与内存，失败不会丢失正文。
- [ ] 草稿同步只创建/更新草稿，异常与超时不会被误报为成功。

### Live Photo

- [ ] MP4、MOV、WebM × H.264/HEVC/VP9 × AAC/非 AAC 的浏览器、本机、云端矩阵。
- [ ] 3 秒/5 秒、片段靠近末尾、首关键帧很远、旋转元数据、可变帧率。
- [ ] 关闭声音在浏览器、本机、云端都得到一致结果；固定提交的云端 manifest 缺口应先修复。
- [ ] 50 MiB、150 MiB、350 MiB 的时间、峰值内存、取消和回退行为。
- [ ] 输出在目标 macOS/iOS 版本的 Photos 中识别；JPG+MOV 分享和完整 `.pvt` 交接分别验证。
- [ ] 小红书/公众号当前上传入口是否保留 Live Photo，按平台版本记录，不作永久保证。

### 数据与安全

- [ ] 游客、本地、账号三个作用域之间无数据串用。
- [ ] 跨设备并发编辑有冲突策略，不静默覆盖。
- [ ] 云端 job 过期后输入、结果、数据库记录均按承诺清理。
- [ ] 本机服务在非可信网络、伪造 Origin、无效 token、超大请求下安全拒绝。
- [ ] 远程 CDN、FormSubmit、Supabase、GitHub Actions 与微信依赖都有数据清单和失败告知。

## 来源

- [研究入口](../README.md)
- [架构与扩展](architecture-and-extension.md)
- [上游固定提交](https://github.com/fxyadela/write-then-publish/tree/7a708312247e69155ca586c49c65c5306fd88e9e)
- [上游技术与边界说明](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/README.md#L210-L222)
- [主前端](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/app.js)
- [浏览器 Live Photo](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/src/live-photo-browser.js)
- [本机服务](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/server.py)
- [Supabase Edge Function](https://github.com/fxyadela/write-then-publish/blob/7a708312247e69155ca586c49c65c5306fd88e9e/supabase/functions/live-photo-jobs/index.ts)
