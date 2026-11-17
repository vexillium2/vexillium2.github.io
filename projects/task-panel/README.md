# 任务面板 · 专注控制室（手机版）

2026-11-09 从本地 TaskTable 迁入博客仓库；手机 PWA 是唯一活跃源。

## 线上

- https://vexillium2.github.io/tasks/
- Android Chrome「安装应用」；离线可用；数据在本机。

## 结构

- `app/` 手机 PWA 源码（唯一源）
- `tests/` 回归测试 + 脱敏 fixture
- `archive/desktop/` 桌面版代码（暂停，不部署，不含数据）
- 产品 PRD 在本地/私有，**不在本仓库**（避免公开个人产品文档）
- `src/.vuepress/public/tasks/` 是构建时生成的部署副本，**不提交**

## 开发与发布

- 独立预览：`cd app && npm run dev`
- 博客联调：`npm run docs:dev`（`predocs:dev` 自动同步 app → public/tasks）
- 构建：`npm run docs:build`（`predocs:build` 自动同步 + 打 SW 缓存戳）
- 发布：`git push` main → GitHub Actions → gh-pages

## 数据

- 手机 IndexedDB；无同步；导出 JSON 备份。
- 真实数据不进仓库；测试只用 `tests/fixture.json` 脱敏样例。

## 桌面

暂停；`archive/desktop/` 只留代码；数据在本地/私有；不部署。
