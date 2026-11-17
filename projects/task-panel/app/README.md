# 任务面板 · 手机版（Android PWA）

源码在 `projects/task-panel/app/`；线上 https://vexillium2.github.io/tasks/。
数据只在本机 IndexedDB；无同步；导出 JSON 就是备份。

## 开发

```bash
cd projects/task-panel/app
npm run dev    # http://localhost:8911
npm run check  # node --check + fixture 回归
```

## 部署

- 博客根目录执行 `npm run docs:dev` / `npm run docs:build` 时，`predocs:*` 钩子会先跑 `scripts/sync-mobile.sh`，把本目录复制到 `src/.vuepress/public/tasks/` 并给 `sw.js` 打缓存戳。
- push 到 main 后 GitHub Actions 跑 `docs:build`（同样触发 predocs:build），再部署 gh-pages。
- **不要手改 `src/.vuepress/public/tasks/`**，它是生成物。

## 数据

- 导入旧数据：手机打开 → 首次引导「导入旧数据」→ 选 `tasktable-data.json`。
- 导入后到「设置 → 导出 JSON」立刻备份。
- 真实数据不要提交仓库；`tests/fixture.json` 只是脱敏样例。

## 说明

- 桌面版已暂停，代码归档在 `../archive/desktop/`。
- 产品 PRD 在本地/私有，不在本仓库。
