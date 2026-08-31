# 证据与推断边界

## 快照摘要

研究日期：2026-09-01。

首页公开数据快照：

| 维度 | 数量 | 占首页 448 个产品的比例 |
| --- | ---: | ---: |
| Early | 305 | 68.1% |
| Public | 143 | 31.9% |
| Beta 子标签 | 101 | 22.5% |
| Waitlist 子标签 | 87 | 19.4% |
| Alpha 子标签 | 23 | 5.1% |
| AI & Agents | 125 | 27.9% |
| Productivity | 68 | 15.2% |
| Design & Creative | 43 | 9.6% |
| Developer Tools | 43 | 9.6% |
| Web | 300 | 67.0% |
| macOS | 57 | 12.7% |
| API & CLI | 44 | 9.8% |
| iOS | 44 | 9.8% |
| Hardware | 38 | 8.5% |

平台可以同时标记多个平台，因此平台比例不能相加得到 100%。

会员页面公开显示的规模：

| 区域 | 页面显示数量 |
| --- | ---: |
| Early Backlog 页面数据记录 | 846 products |
| Founder Directory | 489 founders |
| Startup Resources | 1,159 resources |
| Validation Experiments | 54 experiments |
| Directories | 151 directories |

这些数量会随网站更新而变化。

## 数据来源证据

| 数据来源结论 | 分类 | 一手依据 | 未确认部分 |
| --- | --- | --- | --- |
| 用户会提交用于公开的文字、图片或视频 | 已确认 | Privacy 的 User-Generated Content；Terms 的 User-Generated Content | 哪些产品由 Founder 本人提交 |
| 提交内容关联账号或邮箱并经过 review / vetting | 已确认 | Privacy | 审核规则、通过率和处理时长 |
| 平台每日进行人工策展 | 已确认 | 首页公开文案 | 人工团队规模和外部发现渠道 |
| 详情页引用产品官网、X、LinkedIn 和个人网站 | 已确认 | anyfeeds 等公开详情页 | 字段来自提交、手工补充或自动抓取 |
| Lifeline 记录上线、跟踪、Alive 和阶段信息 | 已确认 | 产品详情页 | 检测频率、自动化方式和阶段判断规则 |
| 平台采集访问日志、页面活动、账号、交易和分析数据 | 已确认 | Privacy | 公开 Engagement 数字的逐事件计算口径 |
| 平台从可信第三方接收一般信息或研究数据 | 原则已确认 | Privacy | 具体第三方、数据集及其与产品目录的关系 |

公开资料没有提供逐字段 source URL、来源占比、抓取清单、审核记录或自动检测方法。因此“数据来源”可以按类型确认，但不能为每条记录重建完整 lineage。

## 技术证据

2026-09-01 首页 HTTP 响应包含：

```text
Server: Vercel
X-Powered-By: Next.js
X-Nextjs-Prerender: 1
X-Vercel-Cache: HIT
Cache-Control: public, max-age=0, must-revalidate
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
```

页面源码还显示：

- Next.js 静态 chunk 与 React Server Components 序列化数据；
- `analytics.neuklick.com/script.js`；
- 大量 `public.blob.vercel-storage.com/logos/...` 资源；
- 产品字段包括 `id`、`slug`、`name`、`description`、`topic`、`platforms`、`stage`、`subLabel`、`staffPick`、`featured`、`deal`、`scheduledListAt`、`listedAt`、`graduatedAt`、`onlineSince` 和 `stageEvents`。

## 已确认与推断

| 结论 | 分类 | 依据 |
| --- | --- | --- |
| early.tools 是人工策展的早期产品目录 | 已确认 | 首页与近期 Newsletter 官方文案 |
| 支持 Early/Public 与 Waitlist/Alpha/Beta 等阶段 | 已确认 | 首页、阶段页与序列化字段 |
| 产品详情包含 Founder、Deal、Lifeline 和互动信息 | 已确认 | 公开详情页 |
| Founder、Resources、Experiments、Directories 为会员能力 | 已确认 | 公开页面的 Paywall 与官方会员说明 |
| 使用 Next.js、Vercel、Vercel Blob | 已确认 | 响应头、静态资源与页面源码 |
| Submit 使用邮箱 Magic Link | 已确认 | `/submit` 的登录页面 |
| 数据由提交、人工策展、公开资料、平台观测与用户行为混合形成 | 已确认到来源类型 | Submit、Privacy、首页和详情页；逐条来源未公开 |
| 存在编辑审核后台 | 高置信推断 | 人工策展需要审核和字段规范化，但后台未公开 |
| 存在生命周期检测或更新任务 | 中高置信推断 | Lifeline、Alive 和阶段事件需要持续更新，具体自动化程度未知 |
| 使用关系型数据库 | 中等推断 | 实体关系适合关系模型，但具体数据库未公开 |
| 使用独立全文搜索引擎 | 未确认 | 搜索可以由数据库、内存过滤或搜索服务实现 |
| 使用 Stripe、Supabase、PostHog 等作为本站基础设施 | 未确认 | 首页出现这些词主要来自被收录产品，不能据此归因给本站 |
| Sponsor 指标经过第三方审计 | 未确认 | 页面仅提供平台自报口径 |

## 官方一手来源

- [首页](https://www.early.tools/)
- [Early 聚合页](https://www.early.tools/early)
- [Waitlist 页](https://www.early.tools/waitlist)
- [Alpha 页](https://www.early.tools/alpha)
- [Beta 页](https://www.early.tools/beta)
- [Launched 页](https://www.early.tools/launched)
- [产品详情页样例](https://www.early.tools/anyfeeds)
- [提交入口](https://www.early.tools/submit)
- [Early Backlog](https://www.early.tools/backlog)
- [Founder Directory](https://www.early.tools/founders)
- [Startup Resources](https://www.early.tools/resources)
- [Validation Experiments](https://www.early.tools/experiments)
- [Directories](https://www.early.tools/submit-to)
- [Newsletter 069](https://www.early.tools/newsletter/69)
- [Sponsor](https://www.early.tools/sponsor)
- [Privacy Policy](https://www.early.tools/privacy)
- [Terms of Service](https://www.early.tools/terms)

## 研究限制

- 未登录会员账号，没有读取付费内容详情或执行 CSV 导出。
- 没有提交表单、支付、发送邮件或触发外部状态变更。
- 没有访问服务端源码、管理后台、数据库或内部分析系统。
- 首页数据来自预渲染页面快照，后续会变化。
- 公开 Terms 明确说明材料并非全面，并不保证准确、预期结果或可靠性；本研究因此把目录条目视为发现线索，而不是事实尽调结论。
