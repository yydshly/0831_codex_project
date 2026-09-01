# OPC Skills Capability Lab

该静态页面把 `ReScienceLab/opc-skills` 的十个 Skills、使用边界、个人化方法和一次“想法到探索再到沉淀”的真实研究轨迹关联起来。

- 关联研究：[research/resciencelab-opc-skills](../../research/resciencelab-opc-skills/README.md)
- 上游仓库：<https://github.com/ReScienceLab/opc-skills>
- 在线地址：<https://yydshly.github.io/0831_codex_project/demos/opc-skills-capability-lab/>

## 本地运行

依赖和构建输出都保留在当前子项目内，不需要全局安装：

```powershell
cd apps\opc-skills-capability-lab
npm install
npm run build
npm run dev
```

打开 `http://127.0.0.1:8791/`。追加 `?run=latest#interactive-demo` 可直接打开最近一次已验证记录。

## 真实演示边界

交互主线不是“调用五个工具就得到创业答案”，而是本次研究真实经历的：`想法提出 → 能力探索 → 网络取证 → 认知纠偏 → 资产沉淀`。项目内实际命令、退出码、时间戳、失败响应和 SHA-256 作为支撑证据保留在第二层。

GitHub Pages 是静态托管，不能启动 Python。构建只负责把真实研究轨迹和证据转换成可浏览的只读回放，不会伪装成刚刚执行。它证明过程可追溯，不证明市场规模、付费意愿或项目应该继续。

公开证据位于 `public/artifacts/`，对应研究归档位于 `research/resciencelab-opc-skills/evidence/real-run/`。
