# OpenBrowser Architecture Lab 浏览器验证

## 验证对象

| 字段 | 内容 |
| --- | --- |
| 项目 | `apps/openbrowser-architecture-lab` |
| canonical development runtime | `npm run dev` → `http://127.0.0.1:5187/` |
| 生产构建 | `npm run build` |
| 浏览器 | Windows Google Chrome，通过 `playwright-core` 和 `agent-browser` 验证 |
| 页面类型 | Vite + Vanilla JavaScript 静态单页 |
| 验证日期 | `2026-09-01`（Asia/Shanghai） |
| 生产地址 | <https://yydshly.github.io/0831_codex_project/demos/openbrowser-architecture-lab/> |

`5187` 被固定为该子项目的开发端口。首次尝试常用端口 `5173` 时，真实浏览器发现该端口已被另一个 Demo 占用；这说明 Vite 进程输出不能替代对 canonical URL 的浏览器核验。

## 自动验证结果

运行：

```powershell
npm run build
npm run dev
npm run validate:browser
```

结果：构建通过，浏览器验证返回 `ok: true`。

| Surface | 结果 | 证据 |
| --- | --- | --- |
| Desktop light，1440×1000 | 通过 | 首屏、五层架构、三个交互工作区、主题往返、无横向溢出 |
| Desktop dark，1440×1000 | 通过 | 暗色首屏、语义色与表面层级；Axe 0 violations |
| Tablet light，768×900 | 通过 | 布局重排、无根级横向溢出；Axe 0 violations |
| Mobile light，390×844 | 通过 | 单列首屏、按钮、架构图和导航适配；Axe 0 violations |
| 架构层交互 | 通过 | 点击 `control` 后面板显示 Local API；方向键移动焦点和选中态 |
| Profile 生命周期 | 通过 | 选择“发现 CDP”后显示 `DevToolsActivePort` 与阶段约束 |
| 后期价值场景 | 通过 | 选择 RPA 后显示严格状态机、AbortSignal 与重构建议 |
| Theme | 通过 | light → dark → light，`data-theme`、`aria-pressed` 与标签同步 |
| Keyboard | 通过 | 三组原生 tablist 可达；架构 tab 支持方向键/Home/End；焦点可见 |
| Accessibility | 通过 | 四种主视口 Axe WCAG A/AA 检查均为 0 violations |
| Runtime dependencies | 通过 | Performance Resource 记录中没有跨源字体、图片、脚本或 CDN |
| Console | 通过 | 四种主视口均无 console error 或 pageerror |
| Reduced motion | 通过 | `prefers-reduced-motion: reduce` 命中，主要过渡为 `0.00001s` |
| No JavaScript | 通过 | 390px 下核心定位、后期触发条件和来源链接可读，无横向溢出 |

## 视觉校准记录

### 1. 小字号语义色对比度

- Current stage：Stage 2 / Stage 7
- Observed evidence：首轮 Axe 在浅色主题检出 13 个小字号标签对比度不足，集中于青色技术标签、浅紫 CDP 卡片和危险提示。
- Root cause：视觉强调色直接用于 9–11px 文字，没有单独的可读文本 token。
- Minimal intervention：增加 `--signal`、`--violet-text`，加深浅色危险 token，并只替换受影响的小字号文字颜色。
- Adjacent checks：light/dark、CDP 卡片、审计提示、tab panel header。
- Observed result：四种主视口 Axe 0 violations。
- Decision：`pass`。

### 2. 手机主题按钮占用错误网格列

- Current stage：Stage 7
- Observed evidence：390px 截图中导航隐藏后，主题按钮进入中间 `1fr` 列，形成宽空框。
- Root cause：`display:none` 的导航不参与 Grid 自动放置，第三个 DOM 子项被自动放入第二列。
- Minimal intervention：把 `.theme-toggle` 显式放在 `grid-column: 3` 并右对齐。
- Adjacent checks：1440/768/390、按钮焦点与主题切换。
- Observed result：手机按钮恢复紧凑尺寸，全部浏览器断言继续通过。
- Decision：`pass`。

## 最终证据

- [1440px 浅色首屏](../evidence/web-demo-1440-light.png)
- [1440px 深色首屏](../evidence/web-demo-1440-dark.png)
- [390px 手机首屏](../evidence/web-demo-390-light.png)

截图是最终验证证据，不包含迭代过程截图或外部受版权保护素材。

## 内容与来源核对

- 首屏明确写出“真实 Chromium + 运行时编排”，没有描述为自研 Blink/V8。
- 页面固定关联上游仓库及提交 `405201583b39a90ae785193d82653f62a0ed9f91`。
- Profile、CDP、RPA、MCP 和三项审计发现均能回到研究条目与固定源码入口。
- 页面明确说明 Profile 状态隔离不等于身份不可关联、匿名或保证绕过风控。
- 页面不执行 OpenBrowser、登录、代理、CDP、MCP 或 RPA，也不保存用户输入。

## 生产验证

首个交付提交：[`46db9a3`](https://github.com/yydshly/0831_codex_project/commit/46db9a32b8052a87aab481b30b08cb825f7b47f7)。

GitHub Pages 工作流 [run 33456485371](https://github.com/yydshly/0831_codex_project/actions/runs/33456485371) 已完成：

- `npm ci` 与 OpenBrowser Architecture Lab build 通过；
- Pages artifact 成功汇总到 `/demos/openbrowser-architecture-lab/`；
- build 与 deploy 两个 job 均为 `success`；
- 在线 URL 返回 HTTP `200`，HTML 为 `1926` bytes；
- 真实浏览器加载后标题为“OpenBrowser 原理与后期价值地图”；
- H1 包含“它不在造浏览器内核 / 它在把 Chromium 变成运行平台”；
- 无 Vite error overlay，`window.__OPENBROWSER_LAB_READY__ === true`；
- 线上 DOM 包含 5 个架构层、6 个生命周期步骤和 4 个未来场景；
- 上游仓库、固定提交与本仓库研究记录链接正常呈现。
