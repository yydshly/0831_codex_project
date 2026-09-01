# 技术研究网页验证记录

## 验证对象

- 应用：`apps/everyone-can-use-english-capability-lab`
- 研究基线：`3d799132046993eade5a364ddd1e557906854eda`
- 浏览器运行地址：`http://127.0.0.1:4178/`
- 验证方式：Vite 开发服务器 + agent-browser 0.27.0
- 验证日期：2026-09-01

## 工程检查

```text
npm run check  → PASS
npm run build  → PASS
Vite production build:
  dist/index.html                  1.16 kB
  dist/assets/index-BJoU0B6s.css  30.87 kB
  dist/assets/index-Cio50tUu.js   42.51 kB
```

浏览器加载结果：

- 页面标题为 `英语训练材料工作台 · Enjoy 技术能力图谱`；
- `document.body.innerText` 非空；
- 没有 Vite / Next / Webpack 错误浮层；
- `agent-browser errors` 无输出；
- Console 只有 Vite 开发连接 debug 日志。

## 交互验证

| 路径 | 预期 | 结果 |
| --- | --- | --- |
| 能力筛选：语音智能 | 只显示语音类能力 | PASS，显示 3 项 |
| 打开“多引擎语音转写” | 详情包含统一输入输出、实现和限制 | PASS，包含 `OpenAI whisper-1` 证据文本 |
| 原理步骤：对齐 | 切换到 DTW forced alignment | PASS |
| 扩展筛选：中期 | 只显示中期扩展 | PASS，显示 3 项 |
| 深色主题按钮 | Enter 可在 light/dark 间双向切换 | PASS |
| 首个键盘焦点 | 跳到主要内容 | PASS，首个 Tab 为 skip link |
| 激活 skip link | 主内容获得焦点 | PASS，activeElement 为 `main-content` |
| Reduced motion | 不隐藏信息，关闭非必要过渡 | PASS，媒体查询命中且页面完整 |
| 能力全景图 | 五阶段、三种职责和四类运行边界完整呈现 | PASS，桌面显示 5 个并列阶段，手机改为纵向流 |

## 响应式验证

| 视口 | 页面 scrollWidth | 横向页面溢出 | 布局结果 |
| --- | ---: | --- | --- |
| 1440 × 1000 | 1425 | 无 | 三列能力卡、三层定位、四列边界 |
| 768 × 900 | 753 | 无 | 单列研究流，横向目录和筛选可滚动 |
| 390 × 844 | 375 | 无 | 单列卡片，按钮全宽，关键标题无裁切 |

窄屏中的目录、筛选条和六步 Pipeline 使用组件内部横向滚动；这是有意设计，不会扩大页面根节点宽度。

## GitHub Pages artifact 本地复现

按 `.github/workflows/pages.yml` 的目录结构，将四个已发布应用的 `dist/` 汇总到专用 `pages-dist` 模拟目录后，用静态 HTTP 服务器验证：

- 聚合首页显示 4 个 Demo，并包含本项目入口；
- `/demos/everyone-can-use-english-capability-lab/#positioning` 可直接打开；
- 页面主摘要、5 个全景阶段和 12 项能力全部存在；
- 构建后的 JavaScript 与 CSS 均返回 HTTP 200；
- 1440 与 390 视口没有页面级横向溢出；
- 手机 reduced-motion 与深色主题均通过；
- 浏览器无运行错误。

## GitHub Pages 线上验收

- 发布提交：[`e4cb4d866bef045c82ba615c20e03bc068491e05`](https://github.com/yydshly/0831_codex_project/commit/e4cb4d866bef045c82ba615c20e03bc068491e05)
- Actions：[`Deploy GitHub Pages · Run 33459561107`](https://github.com/yydshly/0831_codex_project/actions/runs/33459561107)
- 运行结果：`completed / success`；build job 与 deploy job 均通过
- 在线页面：[`/demos/everyone-can-use-english-capability-lab/`](https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/)

| 线上对象 | HTTP | 响应长度 | 结果 |
| --- | ---: | ---: | --- |
| Demo HTML | 200 | 1,157 bytes | 标题与主要摘要正确 |
| 构建 JavaScript | 200 | 42,511 bytes | 应用脚本可加载 |
| 构建 CSS | 200 | 30,869 bytes | 页面样式可加载 |
| Pages 聚合首页 | 200 | 5,178 bytes | 包含本项目入口与摘要 |

真实线上浏览器复验结果：

- 1440 × 1000：主要摘要正确，5 个全景阶段、12 项能力全部存在，`scrollWidth = clientWidth = 1440`；
- 主题按钮可从浅色切换为深色，按钮可访问名称同步变为“切换到浅色主题”；
- 390 × 844：深色布局完整，页面根宽度为 375 px 且无横向溢出；
- 键盘聚焦“语音智能”并按 Enter 后只显示“音频归一化、多引擎语音转写、DTW 精确对齐”3 项；
- 键盘选择“04 对齐”后，详情切换为“对齐：回答何时说到每个词”；
- `prefers-reduced-motion: reduce` 命中后正文仍完整，浏览器错误日志为空；
- Pages 聚合首页包含正确的 Demo 链接，并能检索到主要摘要。

## 视觉证据

- `evidence/web/desktop-light-full.png`：1440 浅色完整长页
- `evidence/web/desktop-dark.png`：1440 深色首屏
- `evidence/web/desktop-dark-capabilities.png`：1440 深色能力区与可见焦点
- `evidence/web/tablet-light.png`：768 平板首屏
- `evidence/web/tablet-capabilities.png`：768 平板能力区
- `evidence/web/mobile-light.png`：390 手机首屏
- `evidence/web/mobile-capabilities.png`：390 手机能力区
- `evidence/web/capability-panorama.png`：1440 完整能力全景图
- `evidence/web/capability-panorama-dark.png`：1440 深色能力全景图
- `evidence/web/capability-panorama-mobile.png`：390 纵向能力全景图
- `evidence/web/pages-artifact-local.png`：本地 Pages artifact 桌面验证
- `evidence/web/pages-artifact-mobile.png`：本地 Pages artifact 手机验证
- `evidence/web/pages-online.png`：GitHub Pages 线上桌面完整长页
- `evidence/web/pages-online-mobile.png`：GitHub Pages 线上手机完整长页
- `evidence/web/pages-online-mobile-viewport.png`：GitHub Pages 线上手机首屏

## 验证结论

本地网页交付面、Pages artifact 模拟和远端 GitHub Pages 全部通过。当前没有阻断性构建、资源加载、布局、交互、主题、键盘或 reduced-motion 问题；在线地址和仓库聚合索引均已验证。

本结论只覆盖研究网页本身，不等于上游 Electron 客户端已经完成动态运行验证。真实音频导入、Whisper 模型、Azure 评测和云端 API 仍应按 `validation-plan.md` 单独验证。
