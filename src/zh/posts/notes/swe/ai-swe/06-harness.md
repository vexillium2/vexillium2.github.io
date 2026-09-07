---
lang: zh-CH
title: Agent Harness 工程
description: 以 Claude Code / Codex / OpenHands 为样本的沙箱执行、权限、会话状态与上下文管理工程
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

06.01 什么是 Agent Harness：以 Claude Code / Codex / OpenHands 为样本拆解 harness 架构
06.02 沙箱执行：容器（Docker/gVisor）、microVM（Firecracker）、WASM；文件系统与网络隔离策略
06.03 权限系统：工具白名单、危险操作分级审批、最小权限原则在 Agent 上的落地
06.04 会话与状态管理：checkpoint、断点续跑、多会话隔离
06.05 上下文管理工程：compaction/summarization、大文件读取策略、todo 列表外置
06.06 资源治理：token 预算、超时、并发限制、成本控制
06.07 Agent 安全：工具注入（Tool Injection）、沙箱逃逸、审计日志
06.08 可观测性：Trace（LangSmith/Langfuse/OTel）、每步决策的 replay 与调试