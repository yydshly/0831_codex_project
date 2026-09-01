# 复现实验

这两个脚本直接加载固定提交的 OpenBrowser Node 模块，不启动 Electron 或真实 Chromium，不访问网站，也不需要账号、代理或密钥。它们验证的是源码级行为契约。

## 前置条件

将上游 `Browserapp` 放在默认研究路径：

```text
sources/lyu0805-openbrowser/Browserapp
```

或设置 `OPENBROWSER_BROWSERAPP` 指向该目录。`sources/` 只作为本地证据，不提交上游完整源码。

## 运行

在仓库根目录执行：

```powershell
node research/lyu0805-openbrowser/experiments/duplicate-profile-audit.js
node research/lyu0805-openbrowser/experiments/rpa-cancellation-audit.js
```

## 预期结果

- `duplicate-profile-audit.js`：退出码 `0`，报告 Cookie、认证代理、平台账号凭据和部分出口信息仍被复制；指纹标记、电池/媒体快照和检测时间被重置。
- `rpa-cancellation-audit.js`：退出码 `0`，报告在最后一个等待步骤中请求取消，但返回值和持久化状态仍为 `success`。

实验的退出码 `0` 表示“成功复现固定提交的已知行为”，不表示该行为正确。若上游修复导致行为变化，脚本会退出 `1`，提示重新审计并更新研究结论。

所有 fixture 密钥都是不可用的测试字符串；duplicate 实验只打印字段名称，不输出 fixture 密钥内容。临时数据仅写入系统临时目录，并在结束时校验目录归属后删除。
