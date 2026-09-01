# 技术研究网页交接

## 交付物

主应用位于：

```text
apps/everyone-can-use-english-capability-lab/
```

它是一个无后端、无外部运行时请求的 Vite + TypeScript 静态网页。页面数据集中在 `src/data.ts`，页面交互在 `src/main.ts`，视觉与响应式规则在 `src/styles.css`。

## 本地启动

```powershell
cd E:\0831_codex_project\apps\everyone-can-use-english-capability-lab
npm install
npm run dev
```

构建验证：

```powershell
npm run build
```

## 在线发布

- 页面地址：`https://yydshly.github.io/0831_codex_project/demos/everyone-can-use-english-capability-lab/`
- 发布工作流：`.github/workflows/pages.yml`
- Artifact 子路径：`pages-dist/demos/everyone-can-use-english-capability-lab/`
- 触发条件：`main` 分支中应用目录、站点目录或 Pages 工作流发生变化

应用使用 Vite `base: "./"` 和锚点导航，适配 GitHub Pages 嵌套子路径，不需要 history fallback、CNAME 或服务端配置。

## 页面内容结构

1. 主要摘要：把任意内容加工成英语训练材料的工作台，而不是完整的英语教学体系；
2. 五阶段全景：内容获取、智能处理、学习中间层、学习驱动、信息存储；
3. 三种职责：用户决策、程序编排、AI 智能节点；
4. 12 项能力地图：内容接入、语音、训练、AI、平台；
5. 六步原理：接入、归一化、转写、对齐、训练、反馈；
6. 四类边界：本地、混合、云端、未开源；
7. 六类使用场景、九项扩展路线、参考价值与源码证据索引。

## 后续维护方式

- 上游仓库变更时，先新增研究基线，不要静默替换页面中的固定 commit；
- 新能力应在 `src/data.ts` 增加输入、处理、输出、限制和固定证据链接；
- 如果获得当前 Web、扩展或后端源码，应作为新的研究分线，不把推测覆盖到旧 Electron 结论；
- 发布路径或 Pages 聚合方式变化时，同步更新应用 README、研究 README、根索引、`apps/README.md` 和 `site/index.html`。

## 已知边界

- 页面没有模拟 STT、TTS、发音评分或真实 AI 请求；
- 页面不会证明上游项目能在当前 Windows 环境完整运行；
- 公开仓库的根许可证与旧 Electron 子包元数据存在歧义，代码复用前仍需确认；
- 当前 Web、Chrome 扩展、enjoy.bot 后端与多设备同步内部实现不在本次可验证源码范围。
