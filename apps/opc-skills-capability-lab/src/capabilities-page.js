const capabilities = [
  {
    index: "01",
    name: "requesthunt",
    stage: "research",
    stageLabel: "需求研究",
    status: "credential",
    statusLabel: "外部服务",
    role: "跨 Reddit、X、GitHub、YouTube、LinkedIn、Amazon 聚合用户需求。",
    implementation: "Agent 工作流 + 外部 RequestHunt CLI",
    input: "产品方向、目标人群、平台与采集深度",
    output: "痛点排名、功能请求、平台信号、竞争机会报告",
    command: 'requesthunt search "AI meeting assistant" --expand --platforms reddit,x,youtube --limit 50',
    evidence: "仓库提供排期工具研究报告，包含十大痛点、竞品比较和功能优先级。",
    limit: "仓库本身没有采集实现；需要安装 CLI、登录并消耗服务额度。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/requesthunt",
  },
  {
    index: "02",
    name: "reddit",
    stage: "research",
    stageLabel: "需求研究",
    status: "limited",
    statusLabel: "环境受限",
    role: "读取板块热帖、搜索结果、帖子评论和用户资料。",
    implementation: "7 个 Python 文件 + Reddit 公共 JSON",
    input: "关键词、Subreddit、排序、时间范围",
    output: "帖子、评论、分数、讨论热度和分页游标",
    command: 'python .\\skills\\reddit\\scripts\\search_posts.py "AI meeting assistant" --subreddit SaaS --limit 20',
    evidence: "脚本可以启动；本机真实请求返回 HTTP 403。",
    limit: "无需 API Key 不等于接口稳定可用，仍受网络、限流和反爬策略影响。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/reddit",
  },
  {
    index: "03",
    name: "twitter",
    stage: "research",
    stageLabel: "需求研究",
    status: "credential",
    statusLabel: "需要凭据",
    role: "研究 X 上的推文、线程、账号、关系、社区、Space 和趋势。",
    implementation: "28 个 Python 脚本 + TwitterAPI.io",
    input: "查询语法、用户、推文 ID、列表或社区 ID",
    output: "推文、回复、引用、转推者、账号与趋势数据",
    command: 'python .\\skills\\twitter\\scripts\\search_tweets.py "AI min_faves:100 -filter:retweets" --limit 20',
    evidence: "脚本入口已验证，能够正确报告缺少 TWITTERAPI_API_KEY。",
    limit: "使用第三方 twitterapi.io，而不是 X 官方 API；存在额度与成本。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/twitter",
  },
  {
    index: "04",
    name: "producthunt",
    stage: "research",
    stageLabel: "产品研究",
    status: "credential",
    statusLabel: "需要凭据",
    role: "查看产品发布、评论、Topic、用户及精选合集。",
    implementation: "11 个 Python 脚本 + 官方 GraphQL API",
    input: "产品 Slug、Topic、日期、用户或合集",
    output: "产品信息、评论、主题、发布者和合集",
    command: "python .\\skills\\producthunt\\scripts\\get_posts.py --topic ai --limit 10",
    evidence: "脚本入口已验证，能够正确报告缺少 PRODUCTHUNT_ACCESS_TOKEN。",
    limit: "需要 Product Hunt Developer Token，不能无凭据直接使用。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/producthunt",
  },
  {
    index: "05",
    name: "domain-hunter",
    stage: "entry",
    stageLabel: "品牌入口",
    status: "workflow",
    statusLabel: "流程型能力",
    role: "生成域名、核验可用性、比较首年与续费价格并寻找优惠。",
    implementation: "Agent SOP + WHOIS/Web 搜索 + Reddit/Twitter",
    input: "产品定位、关键词、偏好后缀和预算",
    output: "候选域名、品牌解释、可用性、注册商价格与建议",
    command: '用户指令：为“自动视频剪辑”项目寻找简短域名，并比较三年总成本',
    evidence: "仓库案例产出 cutflow.io、autocuts.io、videotrim.ai 等候选及价格表。",
    limit: "没有本地执行脚本；可用性、价格和优惠码必须在购买前重新核验。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/domain-hunter",
  },
  {
    index: "06",
    name: "nanobanana",
    stage: "brand",
    stageLabel: "视觉品牌",
    status: "credential",
    statusLabel: "需要凭据",
    role: "通过 Gemini 生成、编辑和批量生产 2K/4K 图片。",
    implementation: "2 个 Python 脚本 + Gemini 图像 API",
    input: "提示词、参考图、比例、分辨率和批量数量",
    output: "单张或批量 PNG 图片",
    command: 'python .\\skills\\nanobanana\\scripts\\generate.py "minimal SaaS hero" --ratio 21:9 --size 2K -o hero.png',
    evidence: "代码包含文生图、图像编辑、比例与批量并发路径。",
    limit: "需要 google-genai 与 GEMINI_API_KEY；--search grounding 当前未真正接入配置。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/nanobanana",
  },
  {
    index: "07",
    name: "logo-creator",
    stage: "brand",
    stageLabel: "视觉品牌",
    status: "verified",
    statusLabel: "局部已验证",
    role: "组织 Logo 需求、批量发散、人工选择、裁切、去背景和矢量化。",
    implementation: "Agent 工作流 + nanobanana + Pillow/API",
    input: "品牌定位、风格、颜色、比例与参考图",
    output: "候选预览、裁切 PNG、透明 PNG 和 SVG",
    command: "python .\\skills\\logo-creator\\scripts\\crop_logo.py input.png output.png",
    evidence: "本机把 1024×1024 样例裁为 838×838；仓库保存完整 OPC Logo 迭代案例。",
    limit: "完整生成需要 Gemini；去背景与 SVG 分别依赖 remove.bg 和 Recraft。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/logo-creator",
  },
  {
    index: "08",
    name: "banner-creator",
    stage: "brand",
    stageLabel: "视觉品牌",
    status: "verified",
    statusLabel: "局部已验证",
    role: "生成并整理 GitHub、X 和网站 Hero 横幅。",
    implementation: "Agent 工作流 + nanobanana + Pillow",
    input: "平台、品牌素材、文字、风格和目标比例",
    output: "候选预览与平台规格 PNG",
    command: "python .\\skills\\banner-creator\\scripts\\crop_banner.py input.png output.png --ratio 2:1 --width 1280",
    evidence: "本机成功输出 1280×640；仓库包含多轮横幅候选与最终产物。",
    limit: "完整创作需要 Gemini；裁切是居中算法，不识别人脸、文字或安全区。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/banner-creator",
  },
  {
    index: "09",
    name: "seo-geo",
    stage: "growth",
    stageLabel: "搜索增长",
    status: "verified",
    statusLabel: "基础已验证",
    role: "审计传统 SEO 与 AI 搜索可见性，并扩展关键词、SERP 和反链研究。",
    implementation: "10 个 Python 脚本 + 可选 DataForSEO",
    input: "网站 URL、关键词、域名和竞争对手",
    output: "Meta/H1/Schema/robots/sitemap 审计及高级搜索数据",
    command: "python .\\skills\\seo-geo\\scripts\\seo_audit.py https://example.com",
    evidence: "本机发现 example.com 缺少 Description、OG、JSON-LD、robots.txt 和 sitemap。",
    limit: "基础审计解析静态 HTML；请求耗时不等于 Core Web Vitals，高级数据需要付费凭据。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/seo-geo",
  },
  {
    index: "10",
    name: "archive",
    stage: "memory",
    stageLabel: "经验沉淀",
    status: "workflow",
    statusLabel: "流程型能力",
    role: "把重要决策、修复和经验保存为可检索的项目记忆。",
    implementation: "Markdown 约定 + SessionStart Hook",
    input: "完成的任务、故障原因、关键变更和经验",
    output: ".archive 日期文件与 MEMORY.md 索引",
    command: "归档：把本次 Reddit HTTP 403 调查写入 debugging 类别，并更新 MEMORY.md",
    evidence: "仓库提供 Frontmatter 模板、分类、关联规则和记忆加载脚本。",
    limit: "Hook 偏向 Claude/Factory 与 POSIX 环境；Codex + PowerShell 自动加载尚未验证。",
    link: "https://github.com/ReScienceLab/opc-skills/tree/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/archive",
  },
];

const statusClass = {
  verified: "is-verified",
  credential: "is-credential",
  limited: "is-limited",
  workflow: "is-workflow",
};

const capabilityCards = capabilities
  .map(
    (item) => `
      <article class="capability-card" data-stage="${item.stage}" data-status="${item.status}" data-search="${item.name} ${item.stageLabel} ${item.role} ${item.implementation} ${item.input} ${item.output}">
        <div class="card-topline">
          <span class="card-index">${item.index}</span>
          <span class="stage-tag">${item.stageLabel}</span>
          <span class="status-tag ${statusClass[item.status]}"><span aria-hidden="true"></span>${item.statusLabel}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="card-role">${item.role}</p>
        <dl class="card-facts">
          <div><dt>实现</dt><dd>${item.implementation}</dd></div>
          <div><dt>输入</dt><dd>${item.input}</dd></div>
          <div><dt>输出</dt><dd>${item.output}</dd></div>
        </dl>
        <details>
          <summary>查看实际示例与能力边界</summary>
          <div class="detail-body">
            <p class="detail-label">示例命令 / 指令</p>
            <pre><code>${item.command}</code></pre>
            <div class="evidence-line"><strong>证据</strong><span>${item.evidence}</span></div>
            <div class="limit-line"><strong>边界</strong><span>${item.limit}</span></div>
            <a class="source-link" href="${item.link}">查看 Skill 原始说明 <span aria-hidden="true">→</span></a>
          </div>
        </details>
      </article>`,
  )
  .join("");

export function renderCapabilitiesPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN" data-static-demo-url="./data/latest-run.json">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OPC Skills 能力地图｜一人公司的 Agent 工具箱</title>
  <meta name="description" content="用真实案例、运行证据和能力边界，理解 OPC Skills 如何覆盖需求研究、域名、品牌、SEO/GEO 与经验沉淀。">
  <meta name="theme-color" content="#f3efe4">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/">
  <link rel="icon" href="https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/website/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    :root {
      --ink: #10100f;
      --paper: #f3efe4;
      --surface: #fffdf8;
      --muted: #625f57;
      --line: #151512;
      --soft-line: #c9c2b3;
      --amber: #f5b82e;
      --amber-soft: #fff0bd;
      --green: #176b3a;
      --green-soft: #dcf2e2;
      --red: #8e2f21;
      --red-soft: #f7ded8;
      --blue: #295c8a;
      --blue-soft: #dfeaf5;
      --font: "JetBrains Mono", "PingFang SC", "Microsoft YaHei", monospace;
      --pixel: "Press Start 2P", "JetBrains Mono", monospace;
    }
    body {
      margin: 0;
      color: var(--ink);
      background-color: var(--paper);
      font-family: var(--font);
      line-height: 1.65;
      overflow-x: hidden;
    }
    button, input, select { font: inherit; }
    a { color: inherit; }
    img { display: block; max-width: 100%; }
    :focus-visible { outline: 3px solid var(--amber); outline-offset: 3px; }
    .skip-link { position: fixed; top: 10px; left: 10px; z-index: 1000; transform: translateY(-160%); background: var(--ink); color: white; padding: 10px 14px; }
    .skip-link:focus { transform: translateY(0); }
    .site-header { position: sticky; top: 0; z-index: 100; border-bottom: 2px solid var(--line); background: rgba(243,239,228,.94); backdrop-filter: blur(10px); }
    .header-inner { width: min(1180px, calc(100% - 40px)); height: 66px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; font-family: var(--pixel); font-size: 10px; }
    .brand img { width: 34px; height: 34px; object-fit: contain; image-rendering: pixelated; }
    .header-nav { display: flex; align-items: center; gap: 18px; font-size: 12px; }
    .header-nav a { text-decoration: none; border-bottom: 1px solid transparent; }
    .header-nav a:hover { border-color: currentColor; }
    .header-nav .back { padding: 8px 12px; border: 1px solid var(--line); background: var(--surface); box-shadow: 3px 3px 0 var(--ink); }
    .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
    .hero { padding: 72px 0 58px; border-bottom: 2px solid var(--line); }
    .hero-grid { display: grid; grid-template-columns: minmax(0, 1.18fr) minmax(340px, .82fr); gap: 52px; align-items: center; }
    .eyebrow { display: inline-flex; align-items: center; gap: 10px; margin: 0 0 22px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .eyebrow::before { content: ""; width: 34px; height: 8px; background: var(--amber); border: 1px solid var(--line); box-shadow: 2px 2px 0 var(--ink); }
    h1 { max-width: 760px; margin: 0; font-size: clamp(38px, 6vw, 76px); line-height: 1.03; letter-spacing: -.065em; }
    h1 span { display: block; margin-top: 16px; font-family: var(--pixel); font-size: clamp(12px, 1.8vw, 19px); line-height: 1.7; letter-spacing: 0; color: var(--muted); }
    .hero-copy { max-width: 720px; margin: 26px 0 0; font-size: 16px; color: var(--muted); }
    .hero-copy strong { color: var(--ink); }
    .thesis { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; border: 2px solid var(--line); background: var(--surface); box-shadow: 7px 7px 0 var(--ink); }
    .thesis div { padding: 18px; }
    .thesis div + div { border-left: 2px solid var(--line); }
    .thesis small { display: block; margin-bottom: 8px; font-size: 10px; font-weight: 700; letter-spacing: .08em; color: var(--muted); }
    .thesis p { margin: 0; font-size: 13px; font-weight: 600; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-top: 24px; }
    .hero-demo-link { display: inline-flex; align-items: center; min-height: 48px; padding: 12px 16px; border: 2px solid var(--line); background: var(--amber); color: var(--ink); box-shadow: 5px 5px 0 var(--ink); text-decoration: none; font-size: 11px; font-weight: 800; }
    .hero-demo-link:hover { transform: translate(-1px, -1px); box-shadow: 6px 6px 0 var(--ink); }
    .hero-secondary-link { display: inline-flex; align-items: center; min-height: 48px; padding: 12px 16px; border: 2px solid var(--line); background: var(--surface); color: var(--ink); text-decoration: none; font-size: 10px; font-weight: 700; }
    .hero-secondary-link:hover { background: var(--amber-soft); }
    .hero-demo-note { max-width: 390px; margin: 0; color: var(--muted); font-size: 10px; line-height: 1.6; }
    .hero-demo-note strong { color: var(--ink); }
    .hero-visual { position: relative; border: 2px solid var(--line); background: var(--surface); box-shadow: 10px 10px 0 var(--ink); }
    .visual-label { display: flex; justify-content: space-between; gap: 16px; padding: 12px 14px; border-bottom: 2px solid var(--line); font-size: 10px; font-weight: 700; }
    .visual-label span:last-child { color: var(--muted); }
    .hero-visual img { width: 100%; aspect-ratio: 2 / 1; object-fit: cover; }
    .visual-note { padding: 16px; border-top: 2px solid var(--line); font-size: 11px; color: var(--muted); }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 54px; border: 2px solid var(--line); background: var(--surface); }
    .metric { min-height: 116px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; }
    .metric + .metric { border-left: 2px solid var(--line); }
    .metric strong { font-size: 34px; line-height: 1; }
    .metric span { font-size: 10px; color: var(--muted); }
    .section { padding: 68px 0; border-bottom: 2px solid var(--line); }
    .section-heading { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 30px; margin-bottom: 34px; }
    .section-no { font-family: var(--pixel); font-size: 10px; padding-top: 9px; color: var(--muted); }
    .section-heading h2 { margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1.1; letter-spacing: -.04em; }
    .section-heading p { max-width: 720px; margin: 12px 0 0; color: var(--muted); font-size: 14px; }
    #guiding-principle { scroll-margin-top: 76px; }
    .method-principle { display: grid; grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr); border: 2px solid var(--line); background: var(--surface); box-shadow: 8px 8px 0 var(--ink); }
    .method-statement { padding: clamp(26px, 4vw, 46px); background: var(--ink); color: white; }
    .method-statement small { display: block; margin-bottom: 20px; color: var(--amber); font-size: 9px; font-weight: 700; letter-spacing: .1em; }
    .method-statement blockquote { margin: 0; font-size: clamp(23px, 3vw, 38px); line-height: 1.25; letter-spacing: -.045em; font-weight: 700; }
    .method-statement p { margin: 22px 0 0; color: #d2cbbc; font-size: 11px; }
    .method-equation { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .method-factor { position: relative; min-height: 190px; padding: 24px; border-left: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .method-factor:nth-child(even) { border-right: 0; }
    .method-factor:nth-child(n+3) { border-bottom: 0; }
    .method-factor .factor-no { display: block; margin-bottom: 30px; font-family: var(--pixel); font-size: 8px; color: var(--muted); }
    .method-factor strong { display: block; margin-bottom: 8px; font-size: 16px; }
    .method-factor p { margin: 0; color: var(--muted); font-size: 10px; }
    .method-factor.external { background: var(--blue-soft); }
    .method-factor.agent { background: var(--amber-soft); }
    .method-factor.self { background: var(--green-soft); }
    .method-factor.review { background: var(--surface); }
    .method-loop-title { display: flex; justify-content: space-between; gap: 18px; align-items: end; margin: 48px 0 18px; }
    .method-loop-title h3 { margin: 0; font-size: 22px; letter-spacing: -.03em; }
    .method-loop-title p { max-width: 520px; margin: 0; color: var(--muted); font-size: 10px; }
    .exploration-loop { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); border: 2px solid var(--line); background: var(--surface); }
    .exploration-step { position: relative; min-height: 158px; padding: 20px 18px; }
    .exploration-step + .exploration-step { border-left: 1px solid var(--line); }
    .exploration-step:not(:last-child)::after { content: "→"; position: absolute; right: -11px; top: 18px; z-index: 2; width: 20px; height: 20px; display: grid; place-items: center; border: 1px solid var(--line); background: var(--amber); font-size: 10px; font-weight: 800; }
    .exploration-step small { display: block; margin-bottom: 25px; font-family: var(--pixel); font-size: 7px; color: var(--muted); }
    .exploration-step strong { display: block; margin-bottom: 7px; font-size: 13px; }
    .exploration-step p { margin: 0; color: var(--muted); font-size: 9px; }
    .project-lab { margin-top: 24px; border: 2px solid var(--line); background: var(--paper); box-shadow: 6px 6px 0 var(--amber); }
    .project-lab-head { display: flex; justify-content: space-between; gap: 18px; align-items: center; padding: 16px 18px; border-bottom: 2px solid var(--line); background: var(--amber-soft); }
    .project-lab-head h3 { margin: 0; font-size: 17px; }
    .project-lab-head span { font-size: 9px; color: var(--muted); }
    .candidate-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .candidate-card { min-width: 0; padding: 22px; background: var(--surface); }
    .candidate-card + .candidate-card { border-left: 1px solid var(--line); }
    .candidate-card small { display: block; margin-bottom: 9px; color: var(--muted); font-size: 8px; font-weight: 700; letter-spacing: .08em; }
    .candidate-card h4 { margin: 0 0 15px; font-size: 16px; }
    .candidate-card ul { margin: 0; padding: 0; list-style: none; }
    .candidate-card li { padding: 8px 0; border-top: 1px solid var(--soft-line); color: var(--muted); font-size: 9px; }
    .comparison-gate { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; padding: 20px 22px; border-top: 2px solid var(--line); background: var(--ink); color: white; }
    .comparison-gate p { margin: 0; color: #d2cbbc; font-size: 10px; }
    .comparison-gate strong { display: block; margin-bottom: 4px; color: white; font-size: 14px; }
    .decision-options { display: flex; gap: 6px; }
    .decision-options span { padding: 7px 9px; border: 1px solid white; color: white; font-size: 8px; font-weight: 700; }
    .decision-options span:first-child { background: var(--amber); color: var(--ink); border-color: var(--amber); }
    .ownership-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 24px; border: 2px solid var(--line); background: var(--surface); }
    .ownership-step { padding: 17px; }
    .ownership-step + .ownership-step { border-left: 1px solid var(--line); }
    .ownership-step small { display: block; margin-bottom: 7px; color: var(--muted); font-size: 8px; }
    .ownership-step strong { display: block; font-size: 10px; }
    .pipeline { display: grid; grid-template-columns: repeat(5, 1fr); border: 2px solid var(--line); background: var(--surface); box-shadow: 7px 7px 0 var(--ink); }
    .pipeline-step { position: relative; min-height: 180px; padding: 20px; border: 0; background: transparent; color: var(--ink); text-align: left; cursor: pointer; }
    .pipeline-step + .pipeline-step { border-left: 2px solid var(--line); }
    .pipeline-step:hover { background: var(--amber-soft); }
    .pipeline-step::after { content: "→"; position: absolute; right: -14px; top: 20px; z-index: 2; width: 26px; height: 26px; display: grid; place-items: center; border: 2px solid var(--line); background: var(--amber); font-weight: 700; }
    .pipeline-step:last-child::after { display: none; }
    .pipeline-step .step-no { display: block; margin-bottom: 28px; font-family: var(--pixel); font-size: 9px; color: var(--muted); }
    .pipeline-step strong { display: block; margin-bottom: 9px; font-size: 16px; }
    .pipeline-step small { display: block; color: var(--muted); line-height: 1.5; }
    .filter-panel { position: sticky; top: 82px; z-index: 20; margin-bottom: 28px; padding: 16px; border: 2px solid var(--line); background: var(--paper); box-shadow: 5px 5px 0 var(--ink); }
    .filter-row { display: grid; grid-template-columns: minmax(240px, 1fr) auto auto; gap: 14px; align-items: center; }
    .search-wrap { position: relative; }
    .search-wrap label { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 11px; font-weight: 700; }
    .search-wrap input { width: 100%; height: 44px; padding: 0 14px 0 84px; border: 1px solid var(--line); border-radius: 0; background: var(--surface); color: var(--ink); }
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
    .filter-button { min-height: 40px; padding: 8px 11px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; font-size: 10px; font-weight: 700; }
    .filter-button:hover, .filter-button[aria-pressed="true"] { background: var(--ink); color: white; }
    .status-select { height: 44px; padding: 0 32px 0 12px; border: 1px solid var(--line); border-radius: 0; background: var(--surface); color: var(--ink); font-size: 11px; }
    .result-line { display: flex; justify-content: space-between; gap: 16px; margin-top: 12px; font-size: 10px; color: var(--muted); }
    .result-line strong { color: var(--ink); }
    .capability-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .capability-card { min-width: 0; border: 2px solid var(--line); background: var(--surface); box-shadow: 5px 5px 0 var(--ink); transition: transform .16s ease, box-shadow .16s ease, opacity .16s ease; }
    .capability-card:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink); }
    .capability-card[hidden] { display: none; }
    .card-topline { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--soft-line); }
    .card-index { margin-right: auto; font-family: var(--pixel); font-size: 9px; color: var(--muted); }
    .stage-tag, .status-tag { padding: 4px 7px; border: 1px solid var(--line); font-size: 9px; font-weight: 700; white-space: nowrap; }
    .stage-tag { background: var(--amber-soft); }
    .status-tag { display: inline-flex; align-items: center; gap: 5px; }
    .status-tag span { width: 7px; height: 7px; border: 1px solid currentColor; border-radius: 50%; background: currentColor; }
    .is-verified { color: var(--green); background: var(--green-soft); }
    .is-credential { color: var(--blue); background: var(--blue-soft); }
    .is-limited { color: var(--red); background: var(--red-soft); }
    .is-workflow { color: #665012; background: var(--amber-soft); }
    .capability-card h3 { margin: 22px 18px 10px; font-size: 23px; letter-spacing: -.04em; }
    .card-role { min-height: 52px; margin: 0 18px 18px; color: var(--muted); font-size: 12px; }
    .card-facts { margin: 0; border-top: 1px solid var(--soft-line); }
    .card-facts div { display: grid; grid-template-columns: 58px 1fr; gap: 10px; padding: 10px 18px; border-bottom: 1px solid var(--soft-line); }
    .card-facts dt { font-size: 9px; font-weight: 700; color: var(--muted); }
    .card-facts dd { margin: 0; font-size: 10px; }
    details summary { padding: 14px 18px; cursor: pointer; font-size: 10px; font-weight: 700; list-style-position: inside; }
    details[open] summary { border-bottom: 1px solid var(--line); background: var(--ink); color: white; }
    .detail-body { padding: 18px; }
    .detail-label { margin: 0 0 7px; color: var(--muted); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    pre { max-width: 100%; margin: 0 0 14px; padding: 12px; overflow: auto; border: 1px solid var(--line); background: #1d1d1b; color: #f7f2e5; font-size: 10px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
    .evidence-line, .limit-line { display: grid; grid-template-columns: 54px 1fr; gap: 9px; padding: 10px 0; border-top: 1px solid var(--soft-line); font-size: 10px; }
    .evidence-line strong { color: var(--green); }
    .limit-line strong { color: var(--red); }
    .source-link { display: inline-block; margin-top: 12px; font-size: 10px; font-weight: 700; }
    .empty-state { padding: 46px 20px; border: 2px dashed var(--line); background: var(--surface); text-align: center; }
    .empty-state h3 { margin: 0 0 8px; font-size: 18px; }
    .empty-state p { margin: 0 0 18px; color: var(--muted); font-size: 12px; }
    .reset-button { padding: 10px 14px; border: 1px solid var(--line); background: var(--amber); color: var(--ink); cursor: pointer; box-shadow: 3px 3px 0 var(--ink); font-size: 10px; font-weight: 700; }
    .evidence-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 22px; }
    .terminal { border: 2px solid var(--line); background: #1d1d1b; color: #f8f4e9; box-shadow: 7px 7px 0 var(--amber); }
    .terminal-bar { display: flex; align-items: center; gap: 7px; padding: 11px 14px; border-bottom: 1px solid #4b4b46; font-size: 9px; color: #c9c3b7; }
    .terminal-dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #000; }
    .terminal-dot:nth-child(1) { background: #e76655; }
    .terminal-dot:nth-child(2) { background: var(--amber); }
    .terminal-dot:nth-child(3) { background: #4fb66a; }
    .terminal pre { margin: 0; border: 0; min-height: 420px; background: transparent; color: inherit; font-size: 11px; white-space: pre; }
    .image-evidence { display: grid; gap: 22px; }
    .evidence-card { border: 2px solid var(--line); background: var(--surface); box-shadow: 6px 6px 0 var(--ink); }
    .evidence-card img { width: 100%; aspect-ratio: 2 / 1; object-fit: cover; border-bottom: 2px solid var(--line); }
    .evidence-card.logo-evidence { display: grid; grid-template-columns: 42% 58%; }
    .evidence-card.logo-evidence img { height: 100%; aspect-ratio: auto; border-right: 2px solid var(--line); border-bottom: 0; object-fit: cover; object-position: 50% 25%; }
    .evidence-card div { padding: 16px; }
    .evidence-card h3 { margin: 0 0 7px; font-size: 14px; }
    .evidence-card p { margin: 0; color: var(--muted); font-size: 10px; }
    .boundary-grid { display: grid; grid-template-columns: 1fr 1fr; border: 2px solid var(--line); background: var(--surface); box-shadow: 8px 8px 0 var(--ink); }
    .boundary-column { padding: 28px; }
    .boundary-column + .boundary-column { border-left: 2px solid var(--line); }
    .boundary-column h3 { display: flex; align-items: center; gap: 10px; margin: 0 0 22px; font-size: 18px; }
    .boundary-column h3 span { width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid var(--line); font-size: 12px; }
    .boundary-column.can h3 span { background: var(--green-soft); color: var(--green); }
    .boundary-column.cannot h3 span { background: var(--red-soft); color: var(--red); }
    .boundary-column ul { margin: 0; padding: 0; list-style: none; }
    .boundary-column li { position: relative; padding: 12px 0 12px 22px; border-top: 1px solid var(--soft-line); font-size: 12px; }
    .boundary-column li::before { content: "■"; position: absolute; left: 0; top: 14px; font-size: 8px; color: var(--amber); }
    .demo { border: 2px solid var(--line); background: var(--surface); box-shadow: 8px 8px 0 var(--ink); }
    #scenario-title-heading { scroll-margin-top: 96px; }
    .demo-header { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center; padding: 20px 22px; border-bottom: 2px solid var(--line); background: var(--amber); }
    .demo-header p { margin: 0 0 5px; font-size: 9px; font-weight: 700; letter-spacing: .08em; }
    .demo-header h3 { margin: 0; font-size: 22px; }
    .demo-mode { padding: 7px 10px; border: 1px solid var(--line); background: var(--surface); font-size: 9px; font-weight: 700; box-shadow: 3px 3px 0 var(--ink); }
    .demo-disclaimer { margin: 0; padding: 12px 22px; border-bottom: 1px solid var(--line); background: var(--blue-soft); color: #193f61; font-size: 10px; }
    .demo-brief { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 0; border-bottom: 2px solid var(--line); }
    .demo-brief-item { padding: 18px 20px; }
    .demo-brief-item + .demo-brief-item { border-left: 1px solid var(--line); }
    .demo-brief-item small { display: block; margin-bottom: 7px; color: var(--muted); font-size: 8px; font-weight: 700; letter-spacing: .08em; }
    .demo-brief-item strong { display: block; font-size: 12px; }
    .demo-start { min-width: 170px; border: 0; border-left: 2px solid var(--line); background: var(--ink); color: white; cursor: pointer; font-size: 11px; font-weight: 700; }
    .demo-start:hover { background: var(--green); }
    .demo-runner { display: grid; grid-template-columns: 255px minmax(0, 1fr); }
    .demo-runner[hidden], .demo-panel[hidden], .demo-complete[hidden], .demo-action[hidden] { display: none; }
    .demo-rail { padding: 20px; border-right: 2px solid var(--line); background: var(--paper); }
    .demo-progress-label { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 8px; font-size: 9px; color: var(--muted); }
    .demo-progress { height: 10px; margin-bottom: 22px; border: 1px solid var(--line); background: var(--surface); overflow: hidden; }
    .demo-progress-bar { width: 0; height: 100%; background: var(--amber); transition: width .22s ease; }
    .demo-steps { display: grid; gap: 8px; }
    .demo-step { width: 100%; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 9px; align-items: center; padding: 10px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); text-align: left; cursor: pointer; }
    .demo-step:disabled { cursor: not-allowed; opacity: .42; }
    .demo-step:not(:disabled):hover { background: var(--amber-soft); }
    .demo-step[aria-current="step"] { background: var(--ink); color: white; box-shadow: 3px 3px 0 var(--amber); }
    .demo-step[data-state="done"] .demo-step-no { background: var(--green-soft); color: var(--green); }
    .demo-step[aria-current="step"] .demo-step-no { background: var(--amber); color: var(--ink); }
    .demo-step-no { width: 26px; height: 26px; display: grid; place-items: center; border: 1px solid currentColor; font-family: var(--pixel); font-size: 7px; }
    .demo-step-copy strong { display: block; font-size: 10px; }
    .demo-step-copy small { display: block; margin-top: 2px; color: inherit; opacity: .68; font-size: 8px; }
    .demo-workspace { min-width: 0; display: flex; flex-direction: column; }
    .demo-workspace-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--line); background: #1d1d1b; color: white; }
    .demo-workspace-head span { font-size: 9px; color: #cfc8bb; }
    .demo-workspace-head strong { font-size: 10px; color: var(--amber); }
    .demo-panel, .demo-complete { padding: 24px; flex: 1; }
    .demo-output-kind { display: inline-block; margin-bottom: 10px; padding: 4px 7px; border: 1px solid var(--line); background: var(--amber-soft); font-size: 8px; font-weight: 700; letter-spacing: .08em; }
    .demo-panel h4, .demo-complete h4 { margin: 0 0 8px; font-size: 21px; line-height: 1.25; }
    .demo-panel > p, .demo-complete > p { max-width: 760px; margin: 0 0 20px; color: var(--muted); font-size: 11px; }
    .demo-skill-line { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
    .demo-skill-line span { padding: 4px 7px; border: 1px solid var(--line); background: var(--surface); font-size: 8px; font-weight: 700; }
    .demo-skill-line .demo-data-state { margin-left: auto; background: var(--green-soft); color: var(--green); }
    .demo-artifacts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
    .demo-artifact { min-width: 0; padding: 15px; border: 1px solid var(--line); background: var(--paper); }
    .demo-artifact.wide { grid-column: 1 / -1; }
    .demo-artifact h5 { margin: 0 0 10px; font-size: 10px; }
    .demo-artifact p { margin: 0; color: var(--muted); font-size: 9px; }
    .demo-artifact strong { color: var(--ink); }
    .demo-list { margin: 0; padding: 0; list-style: none; }
    .demo-list li { display: grid; grid-template-columns: 34px 1fr; gap: 8px; padding: 7px 0; border-top: 1px solid var(--soft-line); font-size: 9px; }
    .demo-list li:first-child { border-top: 0; }
    .demo-list b { color: var(--red); }
    .demo-table { width: 100%; border-collapse: collapse; font-size: 8px; }
    .demo-table th, .demo-table td { padding: 7px 6px; border: 1px solid var(--soft-line); text-align: left; vertical-align: top; }
    .demo-table th { background: var(--ink); color: white; }
    .demo-code { margin: 0; font-size: 9px; }
    .demo-command-label { display: block; margin: 2px 0 7px; color: var(--muted); font-size: 8px; font-weight: 700; letter-spacing: .08em; }
    .demo-result-log { min-height: 160px; max-height: 330px; white-space: pre-wrap; }
    .demo-error-log { margin-top: 10px; border-color: var(--red); color: #ffd8d1; }
    .demo-artifact-link { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 10px 12px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); text-decoration: none; font-size: 9px; }
    .demo-artifact-link:hover { background: var(--amber-soft); }
    .demo-artifact-link small { color: var(--muted); }
    .demo-artifact-image { width: 100%; max-height: 360px; object-fit: contain; border: 1px solid var(--line); background: white; }
    .demo-runtime { display: inline-flex; align-items: center; gap: 7px; }
    .demo-runtime::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 0 1px var(--ink); }
    .demo-runtime[data-state="ready"]::before { background: var(--green); }
    .demo-runtime[data-state="error"]::before { background: var(--red); }
    .demo-workspace[data-state="loading"] .demo-panel { opacity: .58; }
    .demo-workspace[data-state="loading"] .demo-workspace-head strong { color: var(--blue); }
    .demo-brand-preview { min-height: 145px; display: grid; grid-template-columns: 120px 1fr; gap: 18px; align-items: center; }
    .demo-brand-mark { width: 112px; height: 112px; display: grid; place-items: center; border: 3px solid var(--line); background: var(--amber); box-shadow: 6px 6px 0 var(--ink); font-family: var(--pixel); font-size: 20px; }
    .demo-brand-preview blockquote { margin: 0 0 12px; font-size: 16px; font-weight: 700; }
    .demo-brand-preview small { color: var(--muted); font-size: 8px; }
    .demo-meta-preview { border-left: 4px solid var(--amber); padding-left: 12px; }
    .demo-meta-preview strong { display: block; margin-bottom: 5px; font-size: 11px; }
    .demo-meta-preview p { font-size: 9px; }
    .demo-archive { margin: 0; white-space: pre-wrap; }
    .demo-mvp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--line); }
    .demo-mvp div { padding: 12px; }
    .demo-mvp div:nth-child(even) { border-left: 1px solid var(--line); }
    .demo-mvp div:nth-child(n+3) { border-top: 1px solid var(--line); }
    .demo-mvp small { display: block; margin-bottom: 5px; color: var(--muted); font-size: 8px; }
    .demo-mvp strong { display: block; font-size: 10px; }
    .demo-complete { background: var(--green-soft); }
    .demo-complete-grid { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 20px; border: 1px solid var(--line); background: var(--surface); }
    .demo-complete-grid div { padding: 14px; }
    .demo-complete-grid div + div { border-left: 1px solid var(--line); }
    .demo-complete-grid strong { display: block; margin-bottom: 5px; font-size: 20px; }
    .demo-complete-grid span { color: var(--muted); font-size: 8px; }
    .demo-controls { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--line); background: var(--paper); }
    .demo-action { min-height: 40px; padding: 9px 13px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; font-size: 9px; font-weight: 700; }
    .demo-action:hover:not(:disabled) { background: var(--amber-soft); }
    .demo-action:disabled { opacity: .4; cursor: not-allowed; }
    .demo-action.primary { margin-left: auto; min-width: 132px; background: var(--ink); color: white; }
    .demo-action.primary:hover { background: var(--green); }
    .demo-status { min-height: 18px; margin: 0; padding: 0 18px 14px; background: var(--paper); color: var(--muted); font-size: 9px; }
    .conclusion { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 34px; align-items: center; padding: 34px; border: 2px solid var(--line); background: var(--ink); color: white; box-shadow: 9px 9px 0 var(--amber); }
    .conclusion h2 { margin: 0 0 12px; max-width: 780px; font-size: clamp(25px, 3vw, 40px); line-height: 1.2; letter-spacing: -.035em; }
    .conclusion p { max-width: 760px; margin: 0; color: #cdc7ba; font-size: 12px; }
    .conclusion a { align-self: stretch; min-width: 170px; display: grid; place-items: center; padding: 18px; border: 1px solid white; background: var(--amber); color: var(--ink); text-decoration: none; font-size: 11px; font-weight: 700; }
    footer { padding: 28px 0; }
    .footer-inner { display: flex; justify-content: space-between; gap: 24px; font-size: 10px; color: var(--muted); }
    .footer-inner p { margin: 0; }
    .footer-inner a { color: var(--ink); }
    .reveal { animation: reveal .5s ease both; }
    @keyframes reveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 980px) {
      .hero-grid, .evidence-grid { grid-template-columns: 1fr; }
      .hero-visual { max-width: 720px; }
      .method-principle { grid-template-columns: 1fr; }
      .method-factor:nth-child(odd) { border-left: 0; }
      .exploration-loop { grid-template-columns: repeat(3, 1fr); }
      .exploration-step:nth-child(4) { border-left: 0; border-top: 1px solid var(--line); }
      .exploration-step:nth-child(5) { border-top: 1px solid var(--line); }
      .exploration-step:nth-child(3)::after { display: none; }
      .ownership-strip { grid-template-columns: repeat(3, 1fr); }
      .ownership-step:nth-child(4) { border-left: 0; border-top: 1px solid var(--line); }
      .ownership-step:nth-child(5) { border-top: 1px solid var(--line); }
      .pipeline { grid-template-columns: repeat(3, 1fr); }
      .pipeline-step:nth-child(4) { border-left: 0; border-top: 2px solid var(--line); }
      .pipeline-step:nth-child(5) { border-top: 2px solid var(--line); }
      .pipeline-step:nth-child(3)::after { display: none; }
      .filter-panel { position: static; }
      .filter-row { grid-template-columns: 1fr; }
      .status-select { width: 100%; }
      .demo-runner { grid-template-columns: 220px minmax(0, 1fr); }
      .demo-brief { grid-template-columns: 1fr 1fr; }
      .demo-start { grid-column: 1 / -1; min-height: 50px; border-left: 0; border-top: 2px solid var(--line); }
    }
    @media (max-width: 760px) {
      .shell, .header-inner { width: min(100% - 28px, 1180px); }
      .header-nav a:not(.back) { display: none; }
      .hero { padding: 46px 0 42px; }
      .hero-grid { gap: 32px; }
      .thesis, .boundary-grid { grid-template-columns: 1fr; }
      .thesis div + div, .boundary-column + .boundary-column { border-left: 0; border-top: 2px solid var(--line); }
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .metric:nth-child(3) { border-left: 0; border-top: 2px solid var(--line); }
      .metric:nth-child(4) { border-top: 2px solid var(--line); }
      .section { padding: 50px 0; }
      .section-heading { grid-template-columns: 1fr; gap: 8px; }
      .method-loop-title { display: block; }
      .method-loop-title p { margin-top: 8px; }
      .exploration-loop { grid-template-columns: 1fr; }
      .exploration-step + .exploration-step, .exploration-step:nth-child(4), .exploration-step:nth-child(5) { border-left: 0; border-top: 1px solid var(--line); }
      .exploration-step:not(:last-child)::after { right: 18px; top: auto; bottom: -11px; transform: rotate(90deg); }
      .exploration-step:nth-child(3)::after { display: grid; }
      .candidate-grid { grid-template-columns: 1fr; }
      .candidate-card + .candidate-card { border-left: 0; border-top: 1px solid var(--line); }
      .comparison-gate { grid-template-columns: 1fr; }
      .decision-options { flex-wrap: wrap; }
      .ownership-strip { grid-template-columns: 1fr; }
      .ownership-step + .ownership-step, .ownership-step:nth-child(4), .ownership-step:nth-child(5) { border-left: 0; border-top: 1px solid var(--line); }
      .pipeline { grid-template-columns: 1fr; }
      .pipeline-step { min-height: 124px; }
      .pipeline-step + .pipeline-step, .pipeline-step:nth-child(4), .pipeline-step:nth-child(5) { border-left: 0; border-top: 2px solid var(--line); }
      .pipeline-step::after { right: 18px; top: auto; bottom: -15px; transform: rotate(90deg); }
      .pipeline-step:nth-child(3)::after { display: grid; }
      .capability-grid { grid-template-columns: 1fr; }
      .card-role { min-height: auto; }
      .evidence-card.logo-evidence { grid-template-columns: 1fr; }
      .evidence-card.logo-evidence img { max-height: 300px; width: 100%; border-right: 0; border-bottom: 2px solid var(--line); }
      .demo-header { grid-template-columns: 1fr; }
      .demo-mode { justify-self: start; }
      .demo-brief { grid-template-columns: 1fr; }
      .demo-brief-item + .demo-brief-item { border-left: 0; border-top: 1px solid var(--line); }
      .demo-runner { grid-template-columns: 1fr; }
      .demo-rail { border-right: 0; border-bottom: 2px solid var(--line); }
      .demo-steps { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .demo-step { display: block; padding: 8px 4px; text-align: center; }
      .demo-step-no { margin: 0 auto; }
      .demo-step-copy { display: none; }
      .demo-artifacts { grid-template-columns: 1fr; }
      .demo-artifact.wide { grid-column: auto; }
      .demo-brand-preview { grid-template-columns: 1fr; }
      .demo-mvp { grid-template-columns: 1fr; }
      .demo-mvp div:nth-child(even) { border-left: 0; }
      .demo-mvp div + div { border-top: 1px solid var(--line); }
      .demo-complete-grid { grid-template-columns: 1fr; }
      .demo-complete-grid div + div { border-left: 0; border-top: 1px solid var(--line); }
      .conclusion { grid-template-columns: 1fr; padding: 24px; }
      .footer-inner { flex-direction: column; }
    }
    @media (max-width: 440px) {
      .brand { font-size: 8px; }
      .header-nav .back { padding: 7px 9px; font-size: 9px; }
      h1 { font-size: 42px; }
      .hero-copy { font-size: 14px; }
      .hero-actions { align-items: stretch; }
      .hero-demo-link, .hero-secondary-link { width: 100%; justify-content: center; }
      .metrics { grid-template-columns: 1fr 1fr; }
      .metric { min-height: 96px; padding: 14px; }
      .metric strong { font-size: 27px; }
      .filter-buttons { display: grid; grid-template-columns: repeat(3, 1fr); }
      .filter-button { padding: 7px 4px; }
      .card-topline { align-items: flex-start; flex-wrap: wrap; }
      .card-index { width: 100%; }
      .terminal pre { font-size: 9px; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="https://yydshly.github.io/0831_codex_project/">
        <img src="https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/website/opc-logo.svg" alt="" width="34" height="34">
        <span>OPC SKILLS</span>
      </a>
      <nav class="header-nav" aria-label="主要导航">
        <a href="#guiding-principle">指导思想</a>
        <a href="#capability-index">能力索引</a>
        <a href="?run=latest#interactive-demo">真实记录</a>
        <a class="back" href="https://yydshly.github.io/0831_codex_project/">返回项目主页</a>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <section class="hero">
      <div class="shell">
        <div class="hero-grid">
          <div class="reveal">
            <p class="eyebrow">Capability map / 2026.09</p>
            <h1>一个人，也需要一套能被实践改写的方法系统。<span>OPC SKILLS · 一人公司的探索脚手架</span></h1>
            <p class="hero-copy">它不替你决定做哪个项目，而是把<strong>探索、取证、比较、行动和复盘</strong>变成可重复的方法。真正属于你的系统，来自多次实践后对这些 Skills 的持续改写。</p>
            <div class="thesis" aria-label="能力定位">
              <div><small>仓库提供</small><p>同一套问题、动作、工具与证据格式，让不同候选项目能够被比较。</p></div>
              <div><small>你必须补上</small><p>自己的经验、资源、兴趣、用户关系，以及继续或停止的最终判断。</p></div>
            </div>
            <div class="hero-actions">
              <a class="hero-demo-link" href="#guiding-principle">先看如何变成自己的 →</a>
              <a class="hero-secondary-link" href="?run=latest#interactive-demo">打开一次真实探索记录</a>
              <p class="hero-demo-note"><strong>阅读顺序：</strong>先理解方法，再查看十个 Skills；底部的真实运行只是一份候选项目档案，不是自动生成的市场答案。</p>
            </div>
          </div>
          <aside class="hero-visual reveal" aria-label="OPC Skills 品牌样例">
            <div class="visual-label"><span>真实仓库产物</span><span>banner-creator</span></div>
            <img src="https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/banner-creator/examples/images/opc-banner-final.png" alt="OPC Skills 像素风横幅：戴王冠的人物与 opc.dev Agent Skills 字样" width="1280" height="640">
            <p class="visual-note">从 AI 生成、多轮选择到 2:1 裁切，这是仓库保存的完整品牌案例，而不是概念占位图。</p>
          </aside>
        </div>
        <div class="metrics reveal" aria-label="项目规模">
          <div class="metric"><strong>10</strong><span>可组合 Skills</span></div>
          <div class="metric"><strong>3–5</strong><span>建议同轮探索候选</span></div>
          <div class="metric"><strong>4</strong><span>判断输入：证据、整理、认知、反馈</span></div>
          <div class="metric"><strong>1</strong><span>必须保留的人工决策门</span></div>
        </div>
      </div>
    </section>

    <section class="section" id="guiding-principle" aria-labelledby="guiding-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">01 / METHOD</span>
          <div><h2 id="guiding-title">仓库给方法；多次真实探索，才把它变成你的系统。</h2><p>OPC Skills 的最佳用法不是寻找一个“标准答案”，而是用同一套框架探索几个真实候选项目，回头比较证据，再把个人经验和行动反馈写回方法。</p></div>
        </div>

        <div class="method-principle">
          <div class="method-statement">
            <small>GUIDING PRINCIPLE / 共同理解</small>
            <blockquote>外部世界告诉你发生了什么；你的认知决定这些事实对你意味着什么。</blockquote>
            <p>Agent 可以搜索、去重、聚类和整理，却不能代替你判断用户关系、资源优势、长期兴趣与生活约束。</p>
          </div>
          <div class="method-equation" aria-label="个人方法系统的四个输入">
            <article class="method-factor external"><span class="factor-no">INPUT 01</span><strong>外部证据</strong><p>平台讨论、原始链接、竞品、替代方案、失败响应和时间戳。</p></article>
            <article class="method-factor agent"><span class="factor-no">INPUT 02</span><strong>Agent 整理</strong><p>搜索扩展、去重、痛点聚类、对立证据与可验证的机会假设。</p></article>
            <article class="method-factor self"><span class="factor-no">INPUT 03</span><strong>个人认知</strong><p>你理解谁、能触达谁、拥有什么资源，以及愿意长期投入什么。</p></article>
            <article class="method-factor review"><span class="factor-no">INPUT 04</span><strong>行动反馈</strong><p>访谈、落地页、交付与失败结果，反过来修改下一轮的 Skill。</p></article>
          </div>
        </div>

        <div class="method-loop-title">
          <h3>不要只研究一个点子；用同一把尺探索一组候选。</h3>
          <p>同一轮建议选择 3–5 个候选。统一问题和证据标准，比各自写一份漂亮报告更有比较价值。</p>
        </div>
        <div class="exploration-loop" aria-label="多项目探索循环">
          <article class="exploration-step"><small>01 / HYPOTHESES</small><strong>选择真实候选</strong><p>写清目标用户、关键任务、已有替代和最担心的反例。</p></article>
          <article class="exploration-step"><small>02 / FIELDWORK</small><strong>执行同套探索</strong><p>按品类选择平台，保存原始来源，也记录无结果和凭据边界。</p></article>
          <article class="exploration-step"><small>03 / COMPARE</small><strong>横向比较证据</strong><p>比较频率、严重度、付费成本、竞争缺口与用户可触达性。</p></article>
          <article class="exploration-step"><small>04 / DECIDE</small><strong>加入个人判断</strong><p>结合经验、资源、兴趣和约束，选择继续、补充或停止。</p></article>
          <article class="exploration-step"><small>05 / REWRITE</small><strong>复盘并改写 Skill</strong><p>把有效问题、错误权重和停止条件写回自己的方法库。</p></article>
        </div>

        <div class="project-lab">
          <div class="project-lab-head"><h3>一轮探索，不是一次搜索</h3><span>STRUCTURE SAMPLE · 不是市场结论</span></div>
          <div class="candidate-grid">
            <article class="candidate-card"><small>CANDIDATE 01</small><h4>我已经熟悉的问题</h4><ul><li>哪些用户与场景是亲身理解的？</li><li>外部证据支持还是反驳原认知？</li><li>能否在一周内接触真实用户？</li></ul></article>
            <article class="candidate-card"><small>CANDIDATE 02</small><h4>证据看起来更强的问题</h4><ul><li>讨论热度是否等于购买行为？</li><li>现有替代方案为什么仍被使用？</li><li>我是否具有可持续的进入优势？</li></ul></article>
            <article class="candidate-card"><small>CANDIDATE 03</small><h4>反常识但可测试的问题</h4><ul><li>最小验证动作能否快速证伪？</li><li>没有声音的用户为什么沉默？</li><li>什么结果出现时应该立即停止？</li></ul></article>
          </div>
          <div class="comparison-gate">
            <p><strong>人工决策门</strong>Agent 负责整理事实与矛盾；人负责结合自己的处境做选择。没有候选达到证据门槛时，“都不做”也是有效结论。</p>
            <div class="decision-options" aria-label="决策选项"><span>继续验证</span><span>补充探索</span><span>停止归档</span></div>
          </div>
        </div>

        <div class="ownership-strip" aria-label="把方法变成自己的五种积累">
          <div class="ownership-step"><small>保留</small><strong>原始证据与反例</strong></div>
          <div class="ownership-step"><small>记录</small><strong>当时的决策理由</strong></div>
          <div class="ownership-step"><small>执行</small><strong>最小现实动作</strong></div>
          <div class="ownership-step"><small>复盘</small><strong>预测与结果偏差</strong></div>
          <div class="ownership-step"><small>改写</small><strong>权重、提问与停止条件</strong></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="workflow-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">02 / WORKFLOW</span>
          <div><h2 id="workflow-title">选定候选以后，Skills 才进入具体行动。</h2><p>五个阶段是一组可组合动作，不是无人值守的线性流水线。点击阶段，可以直接筛选对应的 Skills；每个关键阶段都允许返回探索或停止。</p></div>
        </div>
        <div class="pipeline" aria-label="OPC 能力流程">
          <button class="pipeline-step" type="button" data-stage-target="research"><span class="step-no">STEP 01</span><strong>发现与验证</strong><small>RequestHunt · Reddit · Twitter · Product Hunt</small></button>
          <button class="pipeline-step" type="button" data-stage-target="entry"><span class="step-no">STEP 02</span><strong>品牌入口</strong><small>域名候选 · 可用性 · 注册价格</small></button>
          <button class="pipeline-step" type="button" data-stage-target="brand"><span class="step-no">STEP 03</span><strong>视觉品牌</strong><small>图片 · Logo · Banner</small></button>
          <button class="pipeline-step" type="button" data-stage-target="growth"><span class="step-no">STEP 04</span><strong>搜索增长</strong><small>SEO · GEO · 关键词 · SERP</small></button>
          <button class="pipeline-step" type="button" data-stage-target="memory"><span class="step-no">STEP 05</span><strong>经验沉淀</strong><small>本地知识库 · 会话记忆</small></button>
        </div>
      </div>
    </section>

    <section class="section" id="capability-index" aria-labelledby="capabilities-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">03 / INDEX</span>
          <div><h2 id="capabilities-title">十个 Skill，按真实可用性查看。</h2><p>“有说明”不等于“本机已跑通”。这里把基础已验证、需要凭据、环境受限和流程型能力明确分开。</p></div>
        </div>
        <div class="filter-panel" aria-label="能力筛选器">
          <div class="filter-row">
            <div class="search-wrap"><label for="capability-search">搜索</label><input id="capability-search" type="search" placeholder="Skill、输入、输出或用途…" autocomplete="off"></div>
            <div class="filter-buttons" role="group" aria-label="按阶段筛选">
              <button class="filter-button" type="button" data-filter="all" aria-pressed="true">全部</button>
              <button class="filter-button" type="button" data-filter="research" aria-pressed="false">研究</button>
              <button class="filter-button" type="button" data-filter="entry" aria-pressed="false">入口</button>
              <button class="filter-button" type="button" data-filter="brand" aria-pressed="false">品牌</button>
              <button class="filter-button" type="button" data-filter="growth" aria-pressed="false">增长</button>
              <button class="filter-button" type="button" data-filter="memory" aria-pressed="false">沉淀</button>
            </div>
            <select class="status-select" id="status-filter" aria-label="按验证状态筛选">
              <option value="all">全部状态</option>
              <option value="verified">已验证 / 局部验证</option>
              <option value="credential">需要凭据 / 外部服务</option>
              <option value="limited">当前环境受限</option>
              <option value="workflow">流程型能力</option>
            </select>
          </div>
          <div class="result-line" aria-live="polite"><span>显示 <strong id="result-count">10</strong> / 10 个 Skills</span><span id="active-summary">全部阶段 · 全部状态</span></div>
        </div>
        <div class="capability-grid" id="capability-grid">${capabilityCards}</div>
        <div class="empty-state" id="empty-state" hidden>
          <h3>没有匹配的能力</h3><p>尝试更短的关键词，或清除阶段与状态筛选。</p><button class="reset-button" id="reset-filters" type="button">重置所有筛选</button>
        </div>
      </div>
    </section>

    <section class="section" id="evidence" aria-labelledby="evidence-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">04 / EVIDENCE</span>
          <div><h2 id="evidence-title">代码会说话，运行结果更重要。</h2><p>下面是本次在 Windows + PowerShell 环境中的真实结果，未把缺少密钥的路径包装成“已验证”。</p></div>
        </div>
        <div class="evidence-grid">
          <div class="terminal" aria-label="SEO 审计真实终端输出">
            <div class="terminal-bar"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span><span>seo_audit.py · exit 0</span></div>
            <pre><code>$ python seo_audit.py https://example.com

## Meta Tags
title: Example Domain
description: MISSING
og_tags: no
h1: Example Domain

## Schema Markup
json_ld_blocks: 0

## Performance
load_time: 1.21s
status: good

## robots.txt
exists: no

## Sitemap
sitemap_xml: no</code></pre>
          </div>
          <div class="image-evidence">
            <article class="evidence-card logo-evidence">
              <img src="https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/logo-creator/examples/images/opc-logo-selected.png" alt="OPC Skills 像素风戴王冠人物 Logo" width="1024" height="1024" loading="lazy">
              <div><h3>Logo 去白边</h3><p>真实执行：1024×1024 原图 → 识别 539×833 内容 → 输出 838×838。</p></div>
            </article>
            <article class="evidence-card">
              <img src="https://raw.githubusercontent.com/ReScienceLab/opc-skills/6ff218dfc5316c231309e0c1a74eda6d78161697/skills/banner-creator/examples/images/opc-banner-final.png" alt="OPC Skills 最终横幅" width="1280" height="640" loading="lazy">
              <div><h3>Banner 比例裁切</h3><p>真实执行：输入 1280×640，按 GitHub 2:1 规格输出 1280×640。</p></div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="boundary-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">05 / BOUNDARY</span>
          <div><h2 id="boundary-title">工具箱的价值，也来自清楚的边界。</h2><p>它已经覆盖创业前中期的一组高频任务，但没有统一编排、状态管理和完整业务闭环。</p></div>
        </div>
        <div class="boundary-grid">
          <div class="boundary-column can"><h3><span>✓</span>适合现在使用</h3><ul><li>复用需求研究的提问框架和报告模板</li><li>执行基础 SEO 审计、Logo 去白边与 Banner 裁切</li><li>配置凭据后接入 Product Hunt、X、Gemini 和 DataForSEO</li><li>把域名、品牌和增长步骤标准化为 Agent SOP</li><li>Fork 后建设自己的 OPC Skill 能力库</li></ul></div>
          <div class="boundary-column cannot"><h3><span>×</span>不能直接替代</h3><ul><li>无人值守的完整创业 Agent 与统一编排器</li><li>产品研发、发布、支付、客服和财务系统</li><li>不经确认的域名购买、付款或 DNS 修改</li><li>生产级依赖锁定、测试、重试和成本治理</li><li>已经验证的 Codex + Windows 原生全链路体验</li></ul></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="scenario-title-heading">
      <div class="shell">
        <div class="section-heading">
          <span class="section-no">06 / REAL RESEARCH JOURNEY</span>
          <div><h2 id="scenario-title-heading">真实记录：一个想法如何经过探索，最后沉淀成方法。</h2><p>这里回放的是我们对 OPC Skills 的真实理解过程：从“它是不是个人创业系统”的想法出发，逐项读库、访问外部平台、保留失败、纠正原先不合理的工具链演示，最后把共识写成可复用资产。</p></div>
        </div>
        <div class="demo" id="interactive-demo">
          <div class="demo-header">
            <div><p>ONE REAL IDEA-TO-MEMORY TRACE</p><h3>想法 → 探索 → 真实取证 → 认知纠偏 → 沉淀</h3></div>
            <span class="demo-mode demo-runtime" id="demo-runtime" data-state="checking">正在检查本地运行时</span>
          </div>
          <p class="demo-disclaimer" id="demo-disclaimer" role="note"><strong>研究边界：</strong>主线展示“理解如何变化”，命令与网络响应只是支撑证据。一次取证、一个落地页或一次 SEO 审计都不是市场验证；真正的下一轮仍要探索其他候选并加入个人认知和现实行动反馈。</p>
          <div class="demo-brief">
            <div class="demo-brief-item"><small>这次真正发生的过程</small><strong>从一个判断假设出发，检查十个 Skills 和平台，执行真实网络请求，在讨论中纠偏，再把结果写成研究资产。</strong></div>
            <div class="demo-brief-item"><small>证据与缺口</small><strong>保留 GitHub 原始链接、Reddit 403、RDAP、试探页、技术审计与 Archive；尚未包含付费访谈和其他候选的同标准比较。</strong></div>
            <button class="demo-start" id="demo-start" type="button" disabled>打开真实研究轨迹 →</button>
          </div>

          <div class="demo-runner" id="demo-runner" hidden>
            <aside class="demo-rail" aria-label="真实研究阶段">
              <div class="demo-progress-label"><span>研究轨迹</span><strong id="demo-progress-text">1 / 5</strong></div>
              <div class="demo-progress" role="progressbar" aria-label="真实研究轨迹" aria-valuemin="0" aria-valuemax="5" aria-valuenow="1"><div class="demo-progress-bar" id="demo-progress-bar"></div></div>
              <div class="demo-steps">
                <button class="demo-step" type="button" data-demo-step="0" disabled><span class="demo-step-no">01</span><span class="demo-step-copy"><strong>想法起点</strong><small>question · hypothesis</small></span></button>
                <button class="demo-step" type="button" data-demo-step="1" disabled><span class="demo-step-no">02</span><span class="demo-step-copy"><strong>能力探索</strong><small>10 Skills · boundaries</small></span></button>
                <button class="demo-step" type="button" data-demo-step="2" disabled><span class="demo-step-no">03</span><span class="demo-step-copy"><strong>真实取证</strong><small>web · scripts · failures</small></span></button>
                <button class="demo-step" type="button" data-demo-step="3" disabled><span class="demo-step-no">04</span><span class="demo-step-copy"><strong>认知纠偏</strong><small>compare · human gate</small></span></button>
                <button class="demo-step" type="button" data-demo-step="4" disabled><span class="demo-step-no">05</span><span class="demo-step-copy"><strong>资产沉淀</strong><small>method · archive · evidence</small></span></button>
              </div>
            </aside>

            <div class="demo-workspace" id="demo-workspace" data-state="idle">
              <div class="demo-workspace-head"><span id="demo-stage-label">WAITING / REAL PROCESS</span><strong id="demo-stage-state">IDLE</strong></div>

              <section class="demo-panel" id="demo-result" aria-labelledby="demo-result-title">
                <span class="demo-output-kind" id="demo-output-kind">TRACE EVIDENCE</span>
                <h4 id="demo-result-title" tabindex="-1">准备打开真实研究记录</h4>
                <p id="demo-result-summary">每一阶段都连接事实、动作、纠偏或沉淀产物，不用技术命令冒充创业结论。</p>
                <div class="demo-skill-line"><span id="demo-skill">research trace</span><span class="demo-data-state" id="demo-exit-code">等待打开</span></div>
                <div class="demo-complete-grid" id="demo-metrics" aria-label="本阶段指标"></div>
                <div class="demo-artifacts" id="demo-artifacts" aria-label="本阶段证据与沉淀产物"></div>
                <span class="demo-command-label">STAGE ACTION</span>
                <pre class="demo-code"><code id="demo-command">等待打开…</code></pre>
                <span class="demo-command-label">OBSERVATION &amp; LEARNING</span>
                <pre class="demo-code demo-result-log"><code id="demo-stdout">这里将显示本阶段的真实观察、边界和理解变化。</code></pre>
                <pre class="demo-code demo-error-log" id="demo-stderr-wrap" hidden><code id="demo-stderr"></code></pre>
              </section>

              <section class="demo-complete" id="demo-complete" aria-labelledby="demo-complete-title" hidden>
                <span class="demo-output-kind">RESEARCH JOURNEY ARCHIVED</span>
                <h4 id="demo-complete-title" tabindex="-1">本次理解已经沉淀；它仍要被下一批真实项目继续改写。</h4>
                <p>这条轨迹证明“想法—探索—纠偏—沉淀”可以被保存和复用。下一步不是把工具链当成答案，而是让候选 02、03 经历同一过程，再结合用户关系、资源、兴趣和行动反馈进入人工决策门。</p>
                <div class="demo-complete-grid"><div><strong>5</strong><span>真实研究阶段</span></div><div><strong>10</strong><span>公开研究资产</span></div><div><strong>0</strong><span>自动市场结论</span></div></div>
              </section>

              <div class="demo-controls">
                <button class="demo-action" id="demo-prev" type="button">← 上一步</button>
                <button class="demo-action" type="button" data-demo-reset>重置</button>
                <button class="demo-action primary" id="demo-next" type="button">查看下一阶段 →</button>
              </div>
              <p class="demo-status" id="demo-status" role="status" aria-live="polite">正在准备真实研究记录。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="conclusion">
          <div><h2>最准确的定位：一套可以被实践、复盘和改写的 OPC 探索脚手架。</h2><p>十个 Skills 提供动作起点，真实项目提供反馈，你的认知提供方向。用一次它是工具；用同一套方法探索多个项目并持续改写，它才逐渐成为你的个人创业操作系统。</p></div>
          <a href="https://github.com/ReScienceLab/opc-skills" target="_blank" rel="noopener noreferrer">查看 GitHub →</a>
        </div>
      </div>
    </section>
  </main>

  <footer><div class="shell footer-inner"><p>OPC Skills 能力整理 · 上游研究基线 6ff218d</p><p><a href="https://yydshly.github.io/0831_codex_project/">研究项目主页</a> · <a href="https://github.com/ReScienceLab/opc-skills/blob/6ff218dfc5316c231309e0c1a74eda6d78161697/skills.json">Skills 清单</a></p></div></footer>

  <script>
    (function () {
      var searchInput = document.getElementById('capability-search');
      var statusFilter = document.getElementById('status-filter');
      var stageButtons = Array.from(document.querySelectorAll('[data-filter]'));
      var pipelineButtons = Array.from(document.querySelectorAll('[data-stage-target]'));
      var cards = Array.from(document.querySelectorAll('.capability-card'));
      var resultCount = document.getElementById('result-count');
      var activeSummary = document.getElementById('active-summary');
      var emptyState = document.getElementById('empty-state');
      var resetButton = document.getElementById('reset-filters');
      var activeStage = 'all';
      var stageNames = { all: '全部阶段', research: '需求研究', entry: '品牌入口', brand: '视觉品牌', growth: '搜索增长', memory: '经验沉淀' };
      var statusNames = { all: '全部状态', verified: '已验证 / 局部验证', credential: '需要凭据 / 外部服务', limited: '当前环境受限', workflow: '流程型能力' };

      function normalize(value) {
        return value.toLocaleLowerCase('zh-CN').trim();
      }

      function applyFilters() {
        var query = normalize(searchInput.value);
        var activeStatus = statusFilter.value;
        var visible = 0;

        cards.forEach(function (card) {
          var matchesStage = activeStage === 'all' || card.dataset.stage === activeStage;
          var matchesStatus = activeStatus === 'all' || card.dataset.status === activeStatus;
          var matchesQuery = !query || normalize(card.dataset.search).includes(query);
          var show = matchesStage && matchesStatus && matchesQuery;
          card.hidden = !show;
          if (show) visible += 1;
        });

        resultCount.textContent = String(visible);
        activeSummary.textContent = stageNames[activeStage] + ' · ' + statusNames[activeStatus];
        emptyState.hidden = visible !== 0;
      }

      function selectStage(stage) {
        activeStage = stage;
        stageButtons.forEach(function (button) {
          button.setAttribute('aria-pressed', String(button.dataset.filter === stage));
        });
        applyFilters();
      }

      stageButtons.forEach(function (button) {
        button.addEventListener('click', function () { selectStage(button.dataset.filter); });
      });
      pipelineButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          selectStage(button.dataset.stageTarget);
          document.getElementById('capability-index').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          searchInput.focus({ preventScroll: true });
        });
      });
      searchInput.addEventListener('input', applyFilters);
      statusFilter.addEventListener('change', applyFilters);
      resetButton.addEventListener('click', function () {
        searchInput.value = '';
        statusFilter.value = 'all';
        selectStage('all');
        searchInput.focus();
      });
      applyFilters();

      var demoStart = document.getElementById('demo-start');
      var demoRunner = document.getElementById('demo-runner');
      var demoWorkspace = document.getElementById('demo-workspace');
      var demoResult = document.getElementById('demo-result');
      var demoResultTitle = document.getElementById('demo-result-title');
      var demoResultSummary = document.getElementById('demo-result-summary');
      var demoSkill = document.getElementById('demo-skill');
      var demoExitCode = document.getElementById('demo-exit-code');
      var demoMetrics = document.getElementById('demo-metrics');
      var demoArtifacts = document.getElementById('demo-artifacts');
      var demoCommand = document.getElementById('demo-command');
      var demoStdout = document.getElementById('demo-stdout');
      var demoStderr = document.getElementById('demo-stderr');
      var demoStderrWrap = document.getElementById('demo-stderr-wrap');
      var demoRuntime = document.getElementById('demo-runtime');
      var demoDisclaimer = document.getElementById('demo-disclaimer');
      var demoSteps = Array.from(document.querySelectorAll('[data-demo-step]'));
      var demoProgress = document.querySelector('.demo-progress');
      var demoProgressBar = document.getElementById('demo-progress-bar');
      var demoProgressText = document.getElementById('demo-progress-text');
      var demoStageLabel = document.getElementById('demo-stage-label');
      var demoStageState = document.getElementById('demo-stage-state');
      var demoComplete = document.getElementById('demo-complete');
      var demoPrev = document.getElementById('demo-prev');
      var demoNext = document.getElementById('demo-next');
      var demoStatus = document.getElementById('demo-status');
      var demoResetButtons = Array.from(document.querySelectorAll('[data-demo-reset]'));
      var demoCurrent = -1;
      var demoReached = -1;
      var demoIsComplete = false;
      var demoIsLoading = false;
      var demoHasError = false;
      var demoReplayMode = false;
      var demoVerifiedAt = '';
      var demoStaticUrl = document.documentElement.dataset.staticDemoUrl || '';
      var demoResults = [];
      var demoLabels = [
        'STAGE 01 / IDEA',
        'STAGE 02 / CAPABILITY EXPLORATION',
        'STAGE 03 / LIVE EVIDENCE',
        'STAGE 04 / REFRAMING',
        'STAGE 05 / ACCUMULATION'
      ];
      var demoLoadingLabels = [
        '正在运行仓库 Reddit 探针，并从 GitHub 公共 Issues 获取真实需求信号…',
        '正在向 RDAP 实时查询三个域名候选，不把 404 冒充为购买保证…',
        '正在读取前两步 JSON，生成带原始证据链接的 MVP 页面与机会简报…',
        '正在运行 seo_audit.py，真实请求刚生成的 MVP 页面…',
        '正在运行 Archive Hook，并为六份核心证据计算 SHA-256…'
      ];

      function clearChildren(element) {
        while (element.firstChild) element.removeChild(element.firstChild);
      }

      function formatBytes(bytes) {
        if (!Number.isFinite(bytes)) return '';
        return bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';
      }

      function renderMetrics(items) {
        clearChildren(demoMetrics);
        items.forEach(function (item) {
          var cell = document.createElement('div');
          var value = document.createElement('strong');
          var label = document.createElement('span');
          value.textContent = item.value;
          label.textContent = item.label;
          cell.append(value, label);
          demoMetrics.appendChild(cell);
        });
      }

      function renderArtifacts(items) {
        clearChildren(demoArtifacts);
        items.forEach(function (item) {
          var article = document.createElement('article');
          var link = document.createElement('a');
          var label = document.createElement('strong');
          var meta = document.createElement('small');
          article.className = 'demo-artifact wide';
          link.className = 'demo-artifact-link';
          link.href = item.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          label.textContent = item.label;
          meta.textContent = formatBytes(item.bytes) + (item.sha256 ? ' · SHA-256 ' + item.sha256.slice(0, 12) + '…' : '');
          link.append(label, meta);
          article.appendChild(link);
          if (item.type === 'image') {
            var image = document.createElement('img');
            image.className = 'demo-artifact-image';
            image.src = item.url;
            image.alt = item.label + '，本阶段的真实证据产物';
            article.appendChild(image);
          }
          demoArtifacts.appendChild(article);
        });
      }

      function showResult(result, moveFocus) {
        demoResultTitle.textContent = result.title;
        demoResultSummary.textContent = result.summary;
        demoSkill.textContent = result.skill;
        demoExitCode.textContent = result.outcome || ('EXIT ' + result.exitCode);
        demoCommand.textContent = result.action || result.command;
        demoStdout.textContent = result.stdout || '命令成功完成，没有标准输出。';
        demoStderr.textContent = result.stderr || '';
        demoStderrWrap.hidden = !result.stderr;
        renderMetrics(result.metrics || []);
        renderArtifacts(result.artifacts || []);
        if (moveFocus) demoResultTitle.focus({ preventScroll: true });
      }

      function showLoading(step) {
        demoResultTitle.textContent = '正在真实执行第 ' + (step + 1) + ' 步';
        demoResultSummary.textContent = demoLoadingLabels[step];
        demoSkill.textContent = 'project-local process';
        demoExitCode.textContent = 'RUNNING';
        demoCommand.textContent = '等待服务器返回实际命令…';
        demoStdout.textContent = '真实进程运行中；完成后这里会显示 stdout。';
        demoStderrWrap.hidden = true;
        clearChildren(demoMetrics);
        clearChildren(demoArtifacts);
      }

      function showError(error) {
        demoResultTitle.textContent = '本步真实执行失败';
        demoResultSummary.textContent = '服务器没有返回成功结果。修复运行环境后可以重试本步。';
        demoSkill.textContent = 'runtime error';
        demoExitCode.textContent = 'ERROR';
        demoCommand.textContent = 'POST /api/demo/step/' + demoCurrent;
        demoStdout.textContent = error.message;
        demoStderr.textContent = error.setup || '';
        demoStderrWrap.hidden = !error.setup;
        clearChildren(demoMetrics);
        clearChildren(demoArtifacts);
      }

      function renderDemo(moveFocus) {
        var hasStarted = demoCurrent >= 0;
        demoRunner.hidden = !hasStarted;
        demoStart.hidden = hasStarted;
        if (!hasStarted) return;
        var progressValue = demoIsComplete ? 5 : Math.max(0, demoReached + 1);
        demoProgress.setAttribute('aria-valuenow', String(progressValue));
        demoProgressText.textContent = demoIsComplete ? '完成' : progressValue + ' / 5';
        demoProgressBar.style.width = String(progressValue * 20) + '%';
        demoStageLabel.textContent = demoIsComplete ? 'COMPLETE / VERIFIED OUTPUTS' : demoLabels[demoCurrent];
        demoStageState.textContent = demoIsComplete ? 'COMPLETE' : demoIsLoading ? 'PROCESS RUNNING' : demoHasError ? 'FAILED' : 'OUTPUT READY';
        demoWorkspace.dataset.state = demoIsLoading ? 'loading' : demoHasError ? 'error' : 'ready';
        demoResult.hidden = demoIsComplete;
        demoComplete.hidden = !demoIsComplete;
        demoSteps.forEach(function (button, index) {
          button.disabled = demoIsLoading || index > demoReached;
          button.dataset.state = index < demoReached || demoIsComplete ? 'done' : index === demoCurrent ? 'current' : 'ready';
          if (!demoIsComplete && index === demoCurrent) button.setAttribute('aria-current', 'step');
          else button.removeAttribute('aria-current');
        });
        demoPrev.disabled = demoIsLoading || (!demoIsComplete && demoCurrent === 0);
        demoNext.hidden = demoIsComplete;
        demoNext.disabled = demoIsLoading || (!demoResults[demoCurrent] && !demoHasError);
        demoNext.textContent = demoHasError
          ? '重试本阶段 →'
          : demoCurrent === 4
            ? '沉淀本次研究 →'
            : demoReplayMode
              ? '查看下一阶段 →'
              : '执行下一步 →';
        if (moveFocus) {
          var focusTarget = demoIsComplete ? document.getElementById('demo-complete-title') : demoResultTitle;
          focusTarget.focus({ preventScroll: true });
        }
      }

      async function requestJson(url, options) {
        var response = await fetch(url, options);
        var body = await response.json();
        if (!response.ok) {
          var error = new Error(body.error || 'Request failed with status ' + response.status);
          error.setup = body.setup;
          throw error;
        }
        return body;
      }

      async function executeDemoStep(step) {
        demoCurrent = step;
        demoIsComplete = false;
        demoIsLoading = true;
        demoHasError = false;
        showLoading(step);
        demoStatus.textContent = demoLoadingLabels[step];
        renderDemo(false);
        try {
          var result = await requestJson('/api/demo/step/' + step, { method: 'POST' });
          demoResults[step] = result;
          demoReached = Math.max(demoReached, step);
          demoIsLoading = false;
          showResult(result, true);
          demoStatus.textContent = result.title + '完成；退出码 ' + result.exitCode + '，已生成 ' + result.artifacts.length + ' 个可打开产物。';
        } catch (error) {
          demoIsLoading = false;
          demoHasError = true;
          showError(error);
          demoStatus.textContent = '真实执行失败：' + error.message;
        }
        renderDemo(false);
      }

      async function startDemo() {
        demoStart.disabled = true;
        if (demoReplayMode) {
          try {
            await loadLatestDemo(true);
          } catch (error) {
            demoStart.disabled = false;
            demoStatus.textContent = '已验证记录加载失败：' + error.message;
          }
          return;
        }
        try {
          await requestJson('/api/demo/reset', { method: 'POST' });
          demoResults = [];
          demoReached = -1;
          await executeDemoStep(0);
        } catch (error) {
          demoStart.disabled = false;
          demoRuntime.dataset.state = 'error';
          demoRuntime.textContent = '本地运行时不可用';
          demoStatus.textContent = '启动失败：' + error.message;
        }
      }

      async function resetDemo() {
        if (demoReplayMode) {
          demoCurrent = -1;
          demoReached = -1;
          demoIsComplete = false;
          demoIsLoading = false;
          demoHasError = false;
          demoResults = [];
          demoStart.hidden = false;
          demoStart.disabled = false;
          demoRunner.hidden = true;
          demoStatus.textContent = '已返回真实研究轨迹入口；点击按钮可从想法阶段重新查看。';
          demoStart.focus();
          return;
        }
        demoIsLoading = true;
        renderDemo(false);
        try {
          await requestJson('/api/demo/reset', { method: 'POST' });
          demoCurrent = -1;
          demoReached = -1;
          demoIsComplete = false;
          demoIsLoading = false;
          demoHasError = false;
          demoResults = [];
          demoStart.hidden = false;
          demoStart.disabled = false;
          demoRunner.hidden = true;
          demoStatus.textContent = '真实产物已清空，可以重新执行。';
          demoStart.focus();
        } catch (error) {
          demoIsLoading = false;
          demoHasError = true;
          demoStatus.textContent = '重置失败：' + error.message;
          renderDemo(false);
        }
      }

      demoStart.addEventListener('click', startDemo);
      demoNext.addEventListener('click', function () {
        if (demoHasError) {
          executeDemoStep(demoCurrent);
        } else if (demoCurrent < 4) {
          var nextStep = demoCurrent + 1;
          if (demoResults[nextStep]) {
            demoCurrent = nextStep;
            showResult(demoResults[nextStep], true);
            renderDemo(false);
          } else {
            executeDemoStep(nextStep);
          }
        } else {
          demoIsComplete = true;
          demoStatus.textContent = '本次研究轨迹已沉淀：五个阶段和原始证据均可重新打开；市场判断仍需其他候选、访谈和你的个人认知。';
          renderDemo(true);
        }
      });
      demoPrev.addEventListener('click', function () {
        if (demoIsComplete) {
          demoIsComplete = false;
          demoCurrent = 4;
        } else if (demoCurrent > 0) {
          demoCurrent -= 1;
        }
        demoHasError = false;
        showResult(demoResults[demoCurrent], true);
        renderDemo(false);
      });
      demoSteps.forEach(function (button) {
        button.addEventListener('click', function () {
          var step = Number(button.dataset.demoStep);
          if (!demoResults[step]) return;
          demoCurrent = step;
          demoIsComplete = false;
          demoHasError = false;
          showResult(demoResults[step], true);
          renderDemo(false);
        });
      });
      demoResetButtons.forEach(function (button) { button.addEventListener('click', resetDemo); });

      function focusDemoSection() {
        var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        document.getElementById('scenario-title-heading').scrollIntoView({ behavior: behavior, block: 'start' });
      }

      async function loadLatestDemo(startAtBeginning) {
        var latest = await requestJson(demoStaticUrl || '/api/demo/latest');
        if (!latest.results || !latest.results.length) {
          demoStatus.textContent = '尚无可回放的研究轨迹。';
          focusDemoSection();
          return;
        }
        demoResults = latest.results;
        demoReplayMode = latest.mode === 'verified-replay' || demoReplayMode;
        demoVerifiedAt = latest.verifiedAt || demoVerifiedAt;
        demoReached = latest.reached;
        demoCurrent = startAtBeginning ? 0 : latest.reached;
        demoIsComplete = false;
        demoIsLoading = false;
        demoHasError = false;
        showResult(demoResults[demoCurrent], false);
        renderDemo(false);
        demoStatus.textContent = demoReplayMode
          ? '已加载 GitHub 发布的真实研究轨迹' + (demoVerifiedAt ? '（' + demoVerifiedAt + '）' : '') + '：当前显示第 ' + (demoCurrent + 1) + ' 阶段；网络请求、脚本结果与沉淀产物均可追溯。'
          : '已加载最近一次真实运行：当前显示第 ' + (demoCurrent + 1) + ' 步；左侧可查看前面每一步的命令和产物。';
        focusDemoSection();
      }

      var demoStatusRequest = demoStaticUrl
        ? Promise.resolve({ replayReady: true, verifiedAt: '' })
        : requestJson('/api/demo/status');
      demoStatusRequest.then(function (status) {
        if (status.runtimeReady && status.runtime.projectLocalPython) {
          demoRuntime.dataset.state = 'ready';
          demoRuntime.textContent = '项目内运行时就绪';
          demoStart.disabled = false;
          demoStatus.textContent = '运行时检查通过；点击按钮将启动真实进程。';
        } else if (status.replayReady) {
          demoReplayMode = true;
          demoVerifiedAt = status.verifiedAt || '';
          demoRuntime.dataset.state = 'ready';
          demoRuntime.textContent = 'GitHub 已验证记录';
          demoStart.disabled = false;
          demoStart.textContent = '打开真实研究轨迹 →';
          demoStatus.textContent = '公开网站回放“想法—探索—纠偏—沉淀”的真实记录；命令和网络响应作为证据保留。';
          demoDisclaimer.textContent = demoStaticUrl
            ? 'GitHub Pages 回放边界：主线记录理解如何从想法走到探索与沉淀；项目内命令、失败响应、时间戳与 SHA-256 是支撑证据。静态页面不会启动 Python，也不会把工具执行冒充成市场结论。'
            : '公开回放边界：这里展示的是从项目内真实运行导出并提交到 GitHub 的证据，保留命令、退出码、时间戳与 SHA-256；托管页面不会启动本地 Python。它仍只是一个候选档案，不是自动市场结论。';
        } else {
          throw new Error(status.runtimeError || 'Project-local Python is unavailable.');
        }
        if (new URLSearchParams(window.location.search).get('run') === 'latest') {
          loadLatestDemo().catch(function (error) {
            demoStatus.textContent = '最近结果加载失败：' + error.message + (demoReplayMode ? '。' : '；仍可点击按钮重新执行。');
            focusDemoSection();
          });
        }
      }).catch(function (error) {
        demoRuntime.dataset.state = 'error';
        demoRuntime.textContent = '项目内运行时不可用';
        demoStatus.textContent = '运行时检查失败：' + error.message;
      });
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
