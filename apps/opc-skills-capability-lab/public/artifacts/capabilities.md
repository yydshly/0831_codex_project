# OPC Skills 能力说明与实际示例

> 分析对象：ReScienceLab/opc-skills
> 分析基线：`6ff218dfc5316c231309e0c1a74eda6d78161697`
> 整理日期：2026-09-01

## 1. 一句话定位

OPC Skills 是面向一人公司（One Person Company）的 Agent Skill 工具箱。它把需求研究、域名选择、品牌素材、SEO/GEO 和项目经验沉淀等工作，封装为 Agent 可以读取的业务流程、Python 脚本和外部 API/CLI 调用说明。

它不是一个能够自主经营公司的完整 Agent，也不是一个统一运行的应用程序。更准确的结构是：

```text
SKILL.md（业务流程和决策规则）
    +
scripts/（可执行 Python 工具，部分 Skill 才有）
    +
references/、examples/（参考资料与现成案例）
    +
外部 API / CLI（TwitterAPI.io、Product Hunt、Gemini、DataForSEO 等）
```

## 2. 能力全景

| 阶段 | Skill | 能解决的问题 | 主要输出 | 能力实现方式 |
|---|---|---|---|---|
| 市场研究 | `requesthunt` | 用户在公开平台抱怨什么、想要什么功能 | 痛点排名、功能请求、平台信号、机会报告 | 外部 RequestHunt CLI + Agent 整理 |
| 市场研究 | `reddit` | Reddit 中有哪些讨论、热帖和评论 | 帖子、评论、板块、用户数据 | 仓库内 Python 脚本 + Reddit 公共 JSON |
| 市场研究 | `twitter` | X 上有哪些实时话题、用户、推文和关系 | 推文、线程、回复、账号、趋势等 | 28 个 Python 脚本 + TwitterAPI.io |
| 产品研究 | `producthunt` | 最近发布了什么产品、哪些产品受关注 | 产品、评论、主题、用户、合集 | 11 个 Python 脚本 + Product Hunt GraphQL |
| 品牌入口 | `domain-hunter` | 什么域名可用、在哪里买更便宜 | 候选域名、可用性、首年/续费价格、优惠信息 | Agent 工作流 + WHOIS/Web 搜索/其他 Skills |
| 图片生成 | `nanobanana` | 生成或编辑图片 | PNG、批量图片、2K/4K 图片 | Python 脚本 + Gemini 图像 API |
| 品牌设计 | `logo-creator` | 从需求到 Logo 方案和最终文件 | 多方案预览、裁切图、透明 PNG、SVG | Agent 工作流 + nanobanana + 图像处理/API |
| 品牌设计 | `banner-creator` | 为 GitHub、X、网站 Hero 制作横幅 | 多方案预览、指定比例 PNG | Agent 工作流 + nanobanana + Pillow |
| 增长 | `seo-geo` | 网站如何获得搜索引擎与 AI 搜索曝光 | 技术审计、关键词、SERP、反链、结构化数据建议 | 本地审计脚本 + 可选 DataForSEO |
| 知识沉淀 | `archive` | 如何保存可供后续 Agent 使用的项目经验 | `.archive` Markdown 知识库和索引 | Agent 写入 Markdown + SessionStart Hook |

按 OPC 工作路径组合后，大致是：

```text
发现需求 ──> 验证市场 ──> 选择域名 ──> 制作品牌 ──> SEO/GEO 增长
   │             │             │             │             │
requesthunt    reddit       domain        logo/banner    seo-geo
twitter       producthunt    hunter       nanobanana
   └──────────────────── archive 沉淀过程经验 ───────────────────┘
```

## 3. 十个 Skill 的实际示例

下面的示例分成三种状态：

- **已本机验证**：本次分析确实运行过。
- **仓库现成案例**：仓库提供了输入、过程或最终产物。
- **需要凭据后运行**：命令真实存在，但本机缺少 API Key 或外部 CLI，不能声称已经跑通。

### 3.1 RequestHunt：从多个平台发现需求

适合问题：准备开发 AI 会议助手，想知道用户真正抱怨什么。

```powershell
requesthunt search "AI meeting assistant transcription" --expand --platforms reddit,x,youtube --limit 50
```

Agent 会把采集结果整理成：

```text
1. 高频痛点：说话人识别不准
2. 高频痛点：行动项需要人工重新整理
3. 高频痛点：Zoom/Teams/Meet 集成不一致
4. 付费信号：愿意为准确摘要和 CRM 同步付费
5. 产品机会：面向销售团队的垂直会议助手
```

仓库提供了一份完整的排期工具需求报告，包含十大痛点、竞品比较和功能优先级：[scheduling-tools-research-report.md](https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/requesthunt/examples/scheduling-tools-research-report.md)。

状态：**需要凭据后运行**。仓库没有 RequestHunt 的采集实现，实际能力来自独立 CLI 和 RequestHunt 服务。

### 3.2 Reddit：读取社区讨论

适合问题：在 `r/SaaS` 中查找用户对 AI 会议工具的反馈。

```powershell
python .\skills\reddit\scripts\search_posts.py "AI meeting assistant" --subreddit SaaS --sort top --time year --limit 20
```

支持的对象包括：板块帖子、搜索结果、帖子及顶层评论、板块信息、用户资料和近期帖子。

本机验证：

```text
命令：python .\skills\reddit\scripts\get_posts.py python --limit 1
结果：error: HTTP 403
```

状态：**代码存在，但当前网络环境未跑通**。该 Skill 使用 Reddit 公共 JSON，无需 API Key；公共接口仍可能受地区、限流或反爬策略影响。

### 3.3 Twitter/X：研究实时讨论和账号

适合问题：寻找关于会议摘要准确率的高互动推文。

```powershell
$env:TWITTERAPI_API_KEY = "你的密钥"
python .\skills\twitter\scripts\search_tweets.py `
  '"meeting notes" AI min_faves:100 -filter:retweets' `
  --type Latest --limit 20
```

除搜索推文外，该 Skill 还覆盖用户资料、用户推文、回复、引用、转推者、线程、文章、粉丝/关注、关系、列表、Community、Space 和趋势。

本机验证：

```text
命令：python .\skills\twitter\scripts\search_tweets.py "AI agent" --limit 3
结果：error: TWITTERAPI_API_KEY not set
```

状态：**需要凭据后运行**。它使用第三方 `twitterapi.io`，不是 X 官方 API。

### 3.4 Product Hunt：分析产品发布与竞品

适合问题：查找 AI 领域近期发布的产品。

```powershell
$env:PRODUCTHUNT_ACCESS_TOKEN = "你的 Token"
python .\skills\producthunt\scripts\get_posts.py --topic ai --limit 10
```

进一步可以获取某个产品及评论：

```powershell
python .\skills\producthunt\scripts\get_post.py chatgpt
python .\skills\producthunt\scripts\get_post_comments.py POST_ID --limit 20
```

本机验证：

```text
命令：python .\skills\producthunt\scripts\get_posts.py --limit 3
结果：error: PRODUCTHUNT_ACCESS_TOKEN not set
```

状态：**需要凭据后运行**。优点是使用 Product Hunt 官方 GraphQL API。

### 3.5 Domain Hunter：选择域名与注册商

适合问题：为“自动视频剪辑”项目找一个短域名。

该 Skill 的实际工作流是：

1. 根据产品定位生成候选名。
2. 使用 WHOIS 或注册商接口确认是否可注册。
3. 比较首年价格和续费价格。
4. 调用 Twitter、Reddit 或 Web 搜索优惠码。
5. 输出推荐表，等待用户确认。

仓库案例输出形式：

| 候选域名 | 品牌解释 | 可用性 |
|---|---|---|
| `cutflow.io` | 剪辑工作流，短且易记 | 案例当时判断可用 |
| `autocuts.io` | 直接表达自动剪辑 | 案例当时判断可用 |
| `videotrim.ai` | AI 视频裁剪 | 案例当时判断可用 |

完整案例见 [auto-video-editing-domain.md](https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/domain-hunter/examples/auto-video-editing-domain.md)。

状态：**仓库现成案例**。这个 Skill 没有自己的 Python 脚本，属于 Agent 操作规程。域名可用性、价格和优惠码都有时效性，案例不能当成当前购买结论；注册和付款也应始终由用户确认。

### 3.6 Nano Banana：生成和编辑图片

生成一张宽屏产品图：

```powershell
$env:GEMINI_API_KEY = "你的 Gemini Key"
python .\skills\nanobanana\scripts\generate.py `
  "minimal SaaS dashboard on a dark background, product hero image" `
  --ratio 21:9 --size 2K -o product-hero.png
```

编辑已有图片：

```powershell
python .\skills\nanobanana\scripts\generate.py `
  "replace the background with deep blue" `
  -i input.png -o edited.png
```

批量生成 20 个 Logo 方向：

```powershell
python .\skills\nanobanana\scripts\batch_generate.py `
  "pixel art logo for an AI meeting assistant" `
  -n 20 -d .\logos -p logo
```

状态：**需要凭据和依赖后运行**。需要 `GEMINI_API_KEY` 与 `google-genai`。当前代码将模型名固定为 `gemini-3-pro-image-preview`；文档声明的 `--search` grounding 参数没有真正加入 API 配置，不应计为已实现能力。

### 3.7 Logo Creator：从创意发散到交付

仓库内真实案例是为 `opc.dev` 设计“一个人也是自己公司的王”的像素 Logo：

![OPC Logo 最终选择](https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/logo-creator/examples/images/opc-logo-selected.png)

案例过程包括：

1. 确认品牌、风格、颜色和比例。
2. 先生成多个概念，再围绕“戴王冠的人”继续迭代。
3. 用户选定方案。
4. 裁掉留白、去背景、转 SVG。

完整对话与候选图见 [opc-logo-creation.md](https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/logo-creator/examples/opc-logo-creation.md)。

本次已实际运行本地裁切脚本：

```powershell
python .\skills\logo-creator\scripts\crop_logo.py `
  .\skills\logo-creator\examples\images\opc-logo-selected.png `
  "$env:TEMP\opc-skills-logo-cropped.png"
```

实际结果：

```text
Original: 1024x1024
Content:  539x833
Output:   838x838
Saved to: ...\opc-skills-logo-cropped.png
```

状态：**裁切能力已本机验证；完整生成链路需要 Gemini，去背景需要 remove.bg，矢量化需要 Recraft**。

### 3.8 Banner Creator：生成平台横幅

仓库内真实产物：

![OPC GitHub Banner](https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/banner-creator/examples/images/opc-banner-final.png)

该案例先生成多个 16:9 方向，再针对 GitHub README 选择 2:1 版本，完整过程见 [opc-banner-creation.md](https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/banner-creator/examples/opc-banner-creation.md)。

本次已实际执行裁切：

```powershell
python .\skills\banner-creator\scripts\crop_banner.py `
  .\skills\banner-creator\examples\images\opc-banner-final.png `
  "$env:TEMP\opc-skills-banner-1280x640.png" `
  --ratio 2:1 --width 1280
```

实际结果：

```text
Input: 1280x640
Cropped: 1280x640
Resized: 1280x640
Saved: ...\opc-skills-banner-1280x640.png
```

状态：**裁切能力已本机验证；完整创作链路需要 Gemini**。裁切算法是居中裁切，不会智能识别人脸、文字或平台安全区。

### 3.9 SEO/GEO：检查网站并给出增长建议

本次已经实际执行：

```powershell
python .\skills\seo-geo\scripts\seo_audit.py https://example.com
```

实际输出：

```text
=== SEO Audit: https://example.com ===

## Meta Tags
title: Example Domain
title_length: 14 chars
description: MISSING
description_length: 0 chars
og_tags: no
h1: Example Domain

## Schema Markup
json_ld_blocks: 0

## Performance
load_time: 1.21s
status: good

## robots.txt
exists: no
ai_bots_mentioned: none

## Sitemap
sitemap_xml: no
```

这说明基础脚本可以直接发现缺少 Description、Open Graph、JSON-LD、robots.txt 和 sitemap 等问题。

配置 DataForSEO 后还能运行：

```powershell
$env:DATAFORSEO_LOGIN = "你的账号"
$env:DATAFORSEO_PASSWORD = "你的密码"
python .\skills\seo-geo\scripts\keyword_research.py "AI meeting notes" --limit 20
python .\skills\seo-geo\scripts\serp_analysis.py "best AI meeting assistant" --depth 20
python .\skills\seo-geo\scripts\backlinks.py "example.com" --limit 20
python .\skills\seo-geo\scripts\competitor_gap.py "example.com" "competitor.com"
```

状态：**基础审计已本机验证，高级数据需要 DataForSEO**。基础审计使用静态 HTML 与正则分析；输出中的加载时间只是一次 HTTP 请求耗时，不等于真实 Core Web Vitals。

### 3.10 Archive：建立项目长期记忆

完成一次重要修复后，可以让 Agent 创建：

```text
.archive/
├── MEMORY.md
└── 2026-09-01/
    └── reddit-http-403-investigation.md
```

归档文件示例：

```markdown
---
tags: [reddit, http-403, api]
category: debugging
related: []
---

# Reddit HTTP 403 Investigation - 2026-09-01

## Summary
公共 JSON 请求在当前网络环境返回 HTTP 403。

## Lessons Learned
不要把无 API Key 等同于接口在所有网络环境中都稳定可用。
```

后续会话开始时，Hook 尝试读取 `.archive/MEMORY.md` 并注入 Agent 上下文。

状态：**本地 Markdown 结构和读取 Hook 存在**。但 Hook 使用 Claude/Factory 的环境变量和 `python3` 命令，在 Codex + 原生 PowerShell 中不能视为已经自动集成；可以先按文档手动归档和检索。

## 4. 一个完整 OPC 场景如何组合这些能力

假设要开发“面向销售团队的 AI 会议助手”，可以这样使用：

### 第一步：发现需求

- 用 RequestHunt 横跨 Reddit、X、YouTube 收集投诉和功能请求。
- 用 Reddit 深挖高质量长讨论与评论。
- 用 Twitter 分析实时讨论和有影响力的从业者。
- 用 Product Hunt 找同类产品、发布节奏和用户评论。

输出不是“用户喜欢 AI”这种宽泛判断，而应形成：

```text
目标用户：10～50 人的 B2B 销售团队
核心痛点：行动项遗漏、CRM 同步繁琐、多语言识别不稳定
现有替代：Otter、Fireflies、人工记录
最小切入点：会议结束后自动生成可编辑的 CRM 更新草稿
```

### 第二步：确定品牌入口

- Domain Hunter 生成候选域名。
- 查询真实可用性。
- 同时比较首年与续费价格，而不是只看首年优惠。
- 用户确认后再购买，Skill 不应自行支付。

### 第三步：制作品牌素材

- Nano Banana 生成视觉方向。
- Logo Creator 组织 20 个候选、人工选择、迭代和最终化。
- Banner Creator 生成 GitHub、X 和产品首页不同尺寸的横幅。

### 第四步：准备获客页面

- SEO/GEO 检查标题、描述、H1、OG、Schema、robots.txt 和 sitemap。
- DataForSEO 辅助选择关键词并分析竞品差距。
- 根据 FAQ、引用、统计数据和结构化数据建议调整内容，使传统搜索和 AI 搜索更容易理解页面。

### 第五步：沉淀经验

- Archive 保存有效关键词、失败 API、品牌决策和发布经验。
- 后续 Agent 会话先检索项目记忆，减少重复研究。

这个组合可以辅助 OPC 从“想法”走到“可验证的品牌和获客页面”，但产品开发、支付、发布、客服、财务与运营监控仍需要其他能力。

## 5. 本机验证结论

| 检查项 | 结果 |
|---|---|
| Python 文件语法 | 63 个文件全部通过编译检查 |
| JSON/Manifest | 13 个核心文件可解析 |
| SEO 基础审计 | 已成功运行 |
| Banner 居中裁切 | 已成功运行 |
| Logo 去白边裁切 | 已成功运行 |
| Reddit 公共 JSON | 当前网络返回 HTTP 403 |
| Twitter | 脚本可启动，缺少 `TWITTERAPI_API_KEY` |
| Product Hunt | 脚本可启动，缺少 `PRODUCTHUNT_ACCESS_TOKEN` |
| Nano Banana | 缺少 `google-genai` 与 Gemini Key |
| RequestHunt | 外部 CLI 未安装 |

## 6. 能力边界与采用建议

### 适合直接复用

- 各 Skill 的提问框架、业务步骤和报告模板。
- SEO 基础审计。
- Logo 去白边和 Banner 比例裁切。
- Product Hunt、Twitter、DataForSEO 等 API 脚本的结构。
- Archive 的 Markdown 知识组织方式。

### 需要配置后使用

- Twitter、Product Hunt、Gemini、DataForSEO、remove.bg、Recraft。
- RequestHunt 外部 CLI。
- Reddit 在不同网络环境下的访问策略。

### 生产使用前需要加固

- 补齐依赖锁定、单元测试、API mock 和端到端测试。
- 把 `python3`、`export`、`grep`、`whois`、`open` 等命令改成 Windows/PowerShell 兼容方式。
- 为外部 API 加入超时、重试、限流、缓存和成本控制。
- 对域名注册、付款、DNS 修改等有副作用的操作加入明确审批。
- 修正版本号、Plugin Manifest 和许可证元数据不一致的问题。
- 为 Codex 单独验证 Skill 安装、发现、调用和 Archive Hook。

## 7. 最终评价

该库的主要价值不是提供一个“无人经营公司”的程序，而是把一人公司早期最常见的一批工作变成 Agent 可理解、可复用、可组合的技能模块。

它目前最适合：

- 个人创业者快速建立标准工作流；
- 学习如何编写业务型 Agent Skill；
- 选择性安装一个或几个 Skill 进行 PoC；
- Fork 后改造成自己的 OPC 能力库。

成熟度可概括为：**业务流程原型较完整，本地轻量工具部分可用，外部数据能力依赖凭据，跨平台和生产工程化仍需加强。**
