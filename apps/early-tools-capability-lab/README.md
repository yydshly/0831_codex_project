# early.tools 中文能力地图

这是一个独立、静态的 Vite + Vanilla JavaScript 研究 Demo，用中文解释 [early.tools](https://www.early.tools/) 的现有能力、工作原理、使用场景、对我们的意义和可扩展方向。

> 本项目不是 early.tools 官方产品，也不是其页面复刻。它不复制上游 UI、源码、截图或会员内容；页面只使用 2026-09-01 公开网页快照与原创视觉表达。

在线地址：[GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/early-tools-capability-lab/)

## 关联研究

- [early.tools 研究条目](../../research/early-tools/README.md)
- [技术与产品原理](../../research/early-tools/notes/architecture.md)
- [使用场景](../../research/early-tools/notes/use-cases.md)
- [扩展路线](../../research/early-tools/notes/roadmap.md)
- [事实与推断边界](../../research/early-tools/notes/evidence.md)
- [Web Demo 设计契约](../../research/early-tools/notes/web-demo-contract.md)

## 运行

需要 Node.js `^20.19.0 || >=22.12.0` 与 npm。

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

真实浏览器验证（先在另一个终端运行 `npm run dev`）：

```bash
npm run validate:browser
```

验证脚本默认访问 `http://127.0.0.1:5173/` 并使用 Windows Chrome；可通过 `EARLY_TOOLS_LAB_URL` 与 `CHROME_PATH` 覆盖。它会检查主要交互、三种视口、明暗主题、横向溢出、远程依赖、控制台错误、reduced-motion 与 Axe，并更新研究证据截图。

`vite.config.js` 使用 `base: './'`，因此构建产物可部署到静态子路径。页面没有远程字体、图片、脚本或 CDN 依赖；只有用户主动点击的官方来源外链。

## 页面能力

- 用一句话和结构图解释 early.tools 的定位。
- 把创始人提交、人工发现、公开资料、平台观测和用户行为五类信息来源放在主阅读路径中，并区分已确认与部分确认。
- 展示“输入 → 审核 → 规范化 → 跟踪 → 分发”的处理链，以及来源、时间、置信度三项可复用原则。
- 按“产品研究、产品发布、团队创新、投资观察”四个角色切换“对我们的意义”。
- 交互查看公开产品库、Backlog、Founder、资源、实验、发布渠道和内容订阅七个能力库。
- 阅读公开产品的阶段、主题、平台分布和近期代表项目。
- 理解“收集 → 策展 → 分发 → 跟踪 → 变现”的运行原理。
- 查看适用场景、尽调边界和 P0–P3 扩展路线。
- 支持 light/dark 主题、键盘操作、可见焦点与 reduced-motion。

## 数据与边界

- 数量固定到 2026-09-01 公开网页快照，不模拟实时同步。
- 公开产品 448 个；Backlog 页面数据记录约 846 条；Founder 489 位；创业资源 1,159 条；验证实验 54 种；发布渠道 151 个。
- 产品描述和目录内容是发现线索，不代表独立质量、安全、融资、收入或合规验证。
- Demo 不执行 early.tools 的产品访问、提交、登录、付费、会员解锁、CSV 导出或 Sponsor 流程。

## 验证

`npm run build` 与真实 Chrome 验证均已通过。完整环境、来源章节断言、Axe 结果、已知边界和浏览器截图见[验证记录](../../research/early-tools/notes/web-demo-validation.md)。
