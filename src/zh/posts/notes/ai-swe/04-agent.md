---
lang: zh-CH
title: Agent 智能体
description: Agent 架构与规划模式、任务拆解、记忆系统、Multi-Agent、上下文工程与失败模式
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

04.01 Agent 定义与架构：感知→规划→执行→反馈闭环；Agent vs Workflow vs Chain
04.02 规划模式：ReAct / Plan-and-Execute / Reflexion（自我反思）/ LLM Compiler
04.03 任务拆解与子目标管理，死循环检测与步数控制
04.04 记忆系统：短期（上下文）/长期（向量+结构化）/情景记忆/工作记忆；记忆写入与召回策略
04.05 Multi-Agent 范式：
Orchestrator-Worker（主从）、Supervisor、Group Chat、Swarm/Handoff、Pipeline
各模式适用场景与通信开销对比
Subagent 边界划分：什么时候拆、拆多细
04.06 Human-in-the-Loop：审批节点、中断恢复（interrupt/resume）、置信度触发人工介入、反馈回流
04.07 上下文工程（Context Engineering）：Agent 上下文窗口的组装、压缩、裁剪策略
04.08 Agent 失败模式清单：幻觉工具调用、目标漂移、错误级联及对策