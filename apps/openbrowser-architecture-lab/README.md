# OpenBrowser Architecture Lab

这是一个独立、静态的 Vite + Vanilla JavaScript 研究页面，用中文整理 [OpenBrowser](https://github.com/lyu0805/OpenBrowser) 的核心定位、工作原理、隔离边界、后期价值和继续研究的触发条件。

> 一句话结论：OpenBrowser 不是自研浏览器内核，而是在真实 Chromium 之上组合 Profile 隔离、环境配置、CDP、RPA、Local API 与 MCP 的本地浏览器运行平台。

在线地址：[GitHub Pages](https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/)

## 上游与研究基线

- 上游仓库：[lyu0805/OpenBrowser](https://github.com/lyu0805/OpenBrowser)
- 固定研究提交：[`405201583b39a90ae785193d82653f62a0ed9f91`](https://github.com/lyu0805/OpenBrowser/tree/405201583b39a90ae785193d82653f62a0ed9f91)
- 完整研究：[OpenBrowser 能力与架构研究](../../research/lyu0805-openbrowser/README.md)
- 网页设计契约：[web-demo-contract.md](../../research/lyu0805-openbrowser/notes/web-demo-contract.md)
- 浏览器验证记录：[web-demo-validation.md](../../research/lyu0805-openbrowser/notes/web-demo-validation.md)
- 上游顶层许可证：[MIT](https://github.com/lyu0805/OpenBrowser/blob/405201583b39a90ae785193d82653f62a0ed9f91/LICENSE)

本页面不是 OpenBrowser 官方产品，也不是上游界面复刻。页面没有复制上游截图、Logo、指纹数据、账号或第三方浏览器内核；架构图与文字均为基于固定提交源码审查的原创整理。

## 页面内容

- 用一句话区分“自研浏览器内核”和“基于 Chromium 的运行平台”。
- 交互查看产品层、控制层、自动化层、浏览器层和系统资源层。
- 逐步理解一个 Profile 从配置、锁定、启动、发现 CDP 到执行任务的生命周期。
- 区分可靠的数据隔离、可配置的网络/环境，以及无法保证的身份匿名与风控结果。
- 按 AI 浏览器执行器、企业 QA、RPA 平台和定制浏览器四种未来需求查看可复用模块。
- 说明当前停止深入研究是合理的，以及未来重新启动研究的明确触发条件。
- 展示源码审查发现的 Profile 复制、RPA 取消和 MCP 权限边界。

## 本地运行

需要 Node.js `^20.19.0 || >=22.12.0` 与 npm。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

真实浏览器验证需要先在另一个终端启动开发服务器：

```bash
npm run validate:browser
```

项目将 `http://127.0.0.1:5187/` 作为 canonical development runtime，避免与仓库中其他 Vite Demo 的常用端口冲突；可用 `OPENBROWSER_LAB_URL` 覆盖验证地址。Windows 默认使用 `C:\Program Files\Google\Chrome\Application\chrome.exe`，可用 `CHROME_PATH` 覆盖。

验证覆盖桌面、平板、390px 手机、明暗主题、三个交互工作区、键盘方向键、Axe、无横向溢出、控制台错误、远程运行时依赖、reduced-motion 和无 JavaScript 摘要。

## 静态部署

`vite.config.js` 使用相对资源基路径，GitHub Pages 工作流会将 `dist/` 汇总到：

```text
/0831_codex_project/demos/openbrowser-architecture-lab/
```

页面没有远程字体、图片、脚本或 CDN 依赖。外部链接只在用户主动点击时访问上游仓库和本仓库研究记录。

## 使用边界

- 页面不启动 Chromium，不连接 CDP/MCP，不执行 RPA。
- 页面不演示账号登录、代理、验证码、指纹规避或批量账号操作。
- Profile 隔离可以分离浏览器状态，但不等于网络匿名、设备身份不可关联或绕过平台风控。
- 上游还包含第三方原生输入和独立浏览器内核许可边界，不能只按顶层 MIT 理解全部二进制分发。
