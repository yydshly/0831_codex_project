# 上游真实能力演示

本记录描述 2026-09-01 在固定提交 `7a708312247e69155ca586c49c65c5306fd88e9e` 上完成的真实浏览器演示。演示直接运行 `sources/write-then-publish` 的上游源码，没有修改其 HTML、CSS、JavaScript 或 Python 服务；研究样稿保存在 [`fixtures/real-demo.md`](../fixtures/real-demo.md)。

## 运行方式

```bash
cd sources/write-then-publish
python server.py
```

浏览器访问 `http://127.0.0.1:5173/?mode=local`，跳过上游引导后新建图文，将研究样稿粘贴进原生编辑器。

## 实际操作

1. 将署名改为 `WTP真实演示`，英文昵称改为 `@REAL_RENDER`。
2. 输入 499 个字符的 Markdown，内容包含一级标题、二级标题、段落、无序列表、引用和粗体。
3. 保持“图文卡片”模式，等待上游解析、测量、分页和 Canvas 渲染。
4. 使用同一个项目切换到“长文”，选择“优雅”主题、“衬线”字体与“活力橘”主题色。
5. 使用上游自己的单张卡片下载与长图下载按钮生成 PNG。

## 真实结果

| 能力 | 实测结果 | 产物 |
| --- | --- | --- |
| Markdown 解析与卡片分页 | 同一篇样稿生成 3 张卡片，标题、列表、引用与粗体进入排版结果 | [真实卡片工作区截图](../assets/upstream-real-cards.png) |
| Canvas 单张导出 | 第一张卡片导出为 `1728 × 2304` PNG，395,985 bytes | [真实卡片 PNG](../assets/layout-page-01.png) |
| 同项目切换长文 | 正文没有重新输入，长文模式保留标题、列表、引用与强调结构 | [真实长文工作区截图](../assets/upstream-real-article.png) |
| 长文主题调整与导出 | “优雅 + 衬线 + 活力橘”导出为 `482 × 1479` PNG，103,879 bytes | [真实长文 PNG](../assets/write-then-publish-article.png) |

卡片 PNG SHA-256：`43A6BF03630A7F7DA65EAF72FD412BCBD54E98ABE053821E259EF61BFB079115`。

长文 PNG SHA-256：`5494A4E15747523004ED9585E54438ADEDB3F925251465E43E2E9ADF529CD724`。

## 这次演示证明了什么

- **[已验证]** 它确实能把真实 Markdown 输入自动分页成多张高清 Canvas 卡片。
- **[已验证]** 同一项目可以切换为连续长文，不需要维护第二份正文。
- **[已验证]** 卡片和长文都能通过上游自身的导出逻辑生成 PNG 文件，而不只是屏幕预览。
- **[已验证]** 长文主题、字体和主题色会进入最终导出产物。

## 没有证明什么

- 没有使用真实图片、视频或用户素材，因此不证明裁剪与大素材性能上限。
- 没有生成或向 iPhone 交接 Live Photo。
- 没有连接 Supabase、Obsidian Vault、微信公众号或小红书账号。
- 没有执行真实平台发布；导出 PNG 成功不等于平台上传、审核或发布成功。

在自动化浏览器中，系统文件选择器不能代替用户操作。本轮让页面进入上游已经实现的普通浏览器下载兜底路径；实际 PNG 仍由上游的 Canvas、`html2canvas`、`canvas.toBlob()` 与 `saveBlob()` 链路生成。
