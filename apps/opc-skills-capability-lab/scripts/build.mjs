import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderCapabilitiesPage } from "../src/capabilities-page.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.dirname(scriptDir);
const distDir = path.join(appDir, "dist");
const dataDir = path.join(distDir, "data");
const artifactDir = path.join(distDir, "artifacts");
const publicDir = path.join(appDir, "public");

await mkdir(dataDir, { recursive: true });
await mkdir(artifactDir, { recursive: true });

const response = renderCapabilitiesPage();
const html = await response.text();
await writeFile(path.join(distDir, "index.html"), html, "utf8");

const artifactNames = [
  "archive-hook.json",
  "capabilities.md",
  "delivery-contract.md",
  "demand-signals.json",
  "domain-check.json",
  "manifest.json",
  "method.md",
  "mvp-seo-audit.txt",
  "opportunity-brief.md",
  "opportunity-landing.html",
];
for (const name of artifactNames) {
  await copyFile(path.join(publicDir, "artifacts", name), path.join(artifactDir, name));
}

async function evidence(name, label, type = "file") {
  const body = await readFile(path.join(publicDir, "artifacts", name));
  return {
    label,
    type,
    url: `./artifacts/${encodeURIComponent(name)}`,
    bytes: body.byteLength,
    sha256: createHash("sha256").update(body).digest("hex"),
  };
}

const rawToolRun = JSON.parse(await readFile(path.join(publicDir, "data", "raw-tool-run.json"), "utf8"));
const demand = JSON.parse(await readFile(path.join(publicDir, "artifacts", "demand-signals.json"), "utf8"));
const domains = JSON.parse(await readFile(path.join(publicDir, "artifacts", "domain-check.json"), "utf8"));
const journey = {
  mode: "verified-replay",
  kind: "research-journey",
  complete: true,
  reached: 4,
  verifiedAt: rawToolRun.verifiedAt,
  source: "A real research journey: idea → capability exploration → live evidence → reframing → reusable memory.",
  boundary: "The tool run is supporting evidence. The journey does not claim market validation or replace personal judgment.",
  results: [
    {
      step: 0,
      title: "想法起点：OPC Skills 是不是一套个人创业系统？",
      summary: "研究从一个真实问题开始，而不是从预设答案开始：这个仓库究竟提供创业结论，还是提供可复用的探索方法？",
      skill: "IDEA / RESEARCH QUESTION",
      outcome: "QUESTION LOGGED",
      action: "用户问题 → 锁定研究对象、判断问题与证据标准",
      stdout: "最初假设：它可能是一组针对 OPC 场景的 Skills。待验证问题：覆盖哪些阶段、哪些能力真的可执行、外部依赖是什么，以及它如何变成个人系统。",
      stderr: "",
      metrics: [
        { value: "1", label: "真实起点问题" },
        { value: "4", label: "待验证判断输入" },
        { value: "0", label: "预设市场结论" },
      ],
      artifacts: [await evidence("method.md", "研究问题与最终方法指南")],
    },
    {
      step: 1,
      title: "能力探索：逐项拆解十个 Skills，而不是只读仓库介绍",
      summary: "检查每个 Skill 的说明、脚本、示例、外部服务和限制，把功能清单还原成需求研究、品牌入口、视觉、增长和归档五个阶段。",
      skill: "EXPLORE / REPOSITORY EVIDENCE",
      outcome: "10 SKILLS MAPPED",
      action: "读取 10 个 skills/*/SKILL.md，并核对 scripts、examples、凭据与平台边界",
      stdout: "结果：仓库确实覆盖 OPC 前中期高频动作，但没有统一编排、产品研发、支付、客服或无人值守经营闭环。它是一套工具箱与方法脚手架，不是自动公司。",
      stderr: "",
      metrics: [
        { value: "10", label: "已整理 Skills" },
        { value: "5", label: "能力阶段" },
        { value: "1", label: "必须保留的人类决策门" },
      ],
      artifacts: [await evidence("capabilities.md", "十个 Skills 能力、实例与边界报告")],
    },
    {
      step: 2,
      title: "真实取证：去平台和网络拿证据，也保留失败",
      summary: "执行真实 Reddit 请求、GitHub Issues API 与 RDAP 查询。RequestHunt 缺少凭据就明确不执行，Reddit 返回 403 也作为能力边界保存。",
      skill: "EXPLORE / LIVE WEB EVIDENCE",
      outcome: "REAL REQUESTS RECORDED",
      action: "Reddit 仓库脚本 + GitHub Issues API + RDAP.org 实时请求",
      stdout: `GitHub Issues 返回 ${demand.githubFallback.items.length} 条带原始链接的信号；Reddit 实探退出码 ${demand.redditProbe.exitCode}、HTTP 403；RequestHunt 状态为 ${demand.requesthunt.status}；RDAP 检查 ${domains.checks.length} 个候选，其中 ${domains.checks.filter((item) => item.status === "no-rdap-record").length} 个无记录，但没有把它表述为可购买保证。`,
      stderr: demand.redditProbe.stderr,
      metrics: [
        { value: String(demand.githubFallback.items.length), label: "GitHub 原始信号" },
        { value: "403", label: "如实保留的 Reddit 响应" },
        { value: String(domains.checks.length), label: "RDAP 实时查询" },
      ],
      artifacts: [
        await evidence("demand-signals.json", "真实需求信号与失败响应"),
        await evidence("domain-check.json", "RDAP 域名探索记录"),
      ],
    },
    {
      step: 3,
      title: "认知纠偏：一次工具运行不是创业结论",
      summary: "讨论让方法发生了关键变化：不能把单个候选或一串技术步骤当成市场验证，而应使用同一把尺探索多个项目，再加入个人经验和现实行动反馈。",
      skill: "REFRAME / HUMAN JUDGMENT",
      outcome: "METHOD REFRAMED",
      action: "单项目演示 → 3–5 个候选横向比较 → 人工继续 / 补充研究 / 停止",
      stdout: "形成四类判断输入：外部证据、Agent 整理、个人认知、行动反馈。真正需要沉淀的是自己的信息源、证据门槛、权重、访谈问题、最小动作和停止条件。",
      stderr: "",
      metrics: [
        { value: "3–5", label: "建议同轮候选" },
        { value: "4", label: "判断输入" },
        { value: "3", label: "人工决策结果" },
      ],
      artifacts: [await evidence("method.md", "多项目探索与个人化方法")],
    },
    {
      step: 4,
      title: "沉淀：把探索过程保存成下一次可复用的资产",
      summary: "最终产物不是一个自动答案，而是可以追溯、比较和继续改写的研究条目、方法指南、能力报告、试探产物与证据清单。",
      skill: "ACCUMULATE / ARCHIVE",
      outcome: "EVIDENCE ARCHIVED",
      action: "生成试探页与简报 → 技术审计 → Archive Hook → SHA-256 清单 → 研究网页",
      stdout: "本轮沉淀保留原始信号、域名探索、机会简报、试探页、SEO 技术检查、Archive 输出和完整哈希。SEO 只证明页面可被技术审计，不等于需求或付费已经验证。",
      stderr: "",
      metrics: [
        { value: "10", label: "公开研究资产" },
        { value: "6", label: "核心文件哈希" },
        { value: "0", label: "自动市场结论" },
      ],
      artifacts: [
        await evidence("opportunity-brief.md", "证据驱动的机会简报"),
        await evidence("opportunity-landing.html", "最小试探页面"),
        await evidence("mvp-seo-audit.txt", "页面技术审计（非需求验证）"),
        await evidence("archive-hook.json", "Archive Hook 真实输出"),
        await evidence("manifest.json", "六份核心证据 SHA-256 清单"),
        await evidence("delivery-contract.md", "页面交付契约与浏览器验收"),
      ],
    },
  ],
};

await writeFile(path.join(dataDir, "latest-run.json"), `${JSON.stringify(journey, null, 2)}\n`, "utf8");
await copyFile(path.join(publicDir, "data", "raw-tool-run.json"), path.join(dataDir, "raw-tool-run.json"));

process.stdout.write(`Built OPC Skills Capability Lab with ${artifactNames.length} evidence artifacts.\n`);
