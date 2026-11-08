# 任务面板 · 手机版（Android PWA）

独立于 DSH 工作台的手机构建。**数据只存在这台手机，不上传、不同步。**

- 线上：https://vexillium2.github.io/tasks/
- 安装：Android Chrome 打开 → 菜单「安装应用 / 添加到主屏幕」；首次加载后离线可用。
- 数据：IndexedDB（localStorage 兜底），键 `tasktable.mobile.v3`；清除浏览器数据会丢，换机/清数据前必须导出。

## 首次使用 / 导入旧数据

1. 把旧电脑上的 `tasktable-data.json` 发到手机（微信文件、网盘、USB 均可）。
2. 打开 App → 首次引导「导入旧数据」→ 选择 JSON。
3. 自动迁移：碎片→思绪、旧标签→自评分、暂停/中断→专注度扣减、父任务→容器。
4. 导入后到「设置 → 导出 JSON」立刻备份一份。

## 备份 / 换机

- 设置 → 导出 JSON：Android 会调起分享面板（保存到文件/网盘/微信）；没有同步，导出就是唯一备份。
- 恢复：设置 → 导入 JSON；会覆盖当前数据。

## 与桌面版差异

- 无 DSH API、无飞书桥接、无 AI 拆解、无云同步。
- 时间轴在手机上横向滚动，首次进入自动滚到「现在」。
- 底部四栏：今日 / 全部 / 指标 / 设置；模态改为底部抽屉。
- 飞书日历只读静态 `feishu-calendar.json`（当前为空），不拉取真实日程。

## 部署

- 源文件：`TaskTable/mobile/`
- 目标：`my-docs/src/.vuepress/public/tasks/`（VuePress 会把 `public` 复制到 `dist`）
- `git push` 到 `my-docs` 的 `main` → GitHub Actions 构建 → `gh-pages` → `https://vexillium2.github.io/tasks/`
- 更新前端后把 `sw.js` 的 `CACHE` 版本 +1，避免旧缓存。

## 本地调试

```bash
cd TaskTable/mobile
python3 -m http.server 8911
# 手机视口可用 Chrome DevTools 设备模拟（390×844）
# ?welcome=0 跳过首次引导；?tab=today|all|metrics|settings
```

## 文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 移动壳；设置 `window.__TP_MOBILE__=true`；注册 SW |
| `task-panel.js` | 桌面逻辑的手机副本；`MOBILE` 分支：IndexedDB、静态日历、无桥接 |
| `task-panel.css` | 桌面皮肤（复用） |
| `mobile.css` | 底部导航、卡片/时间轴/模态的手机覆盖 |
| `dshell.css` | 本地化的 DSH 设计 token |
| `manifest.webmanifest` | PWA 安装信息；scope/start_url 为 `./` |
| `sw.js` | 外壳离线缓存；数据不经过 SW |
| `icons/` | 192/512 图标（金环 + 紫点） |
| `feishu-calendar.json` | 空日历占位，不含个人日程 |

## 维护提示

`mobile/task-panel.js` 是从 `TaskTable/task-panel.js` 复制后打补丁的。桌面逻辑更新后：
1. 重新复制桌面 `task-panel.js` 到 `mobile/task-panel.js`；
2. 保留 `MOBILE` 相关分支（顶部路径、IndexedDB、load/save、settings 飞书分支、导入、首次引导、时间轴自动滚动）；
3. `node --check` + `.build/test-mobile.mjs` 回归；
4. 更新 `sw.js` 缓存版本。
