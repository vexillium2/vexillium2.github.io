---
lang: zh-CH
title: 工具调用与 Tool Engineering
description: Function Calling、工具设计最佳实践、MCP、Agent Skills 与 A2A 协议等工具生态主题
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

05.01 Function Calling 机制：原理、并行调用、错误处理
05.02 工具设计最佳实践：粒度、命名、描述编写、返回值设计（给模型看的 API 文档）
05.03 MCP：架构（Host/Client/Server）、传输层（stdio/SSE/HTTP）、Resources/Prompts/Tools 三原语、安全模型
05.04 MCP Server 开发实战 + 企业级 MCP 网关治理
05.05 Agent Skills：Skill vs Tool 的本质区别（"脑"与"手"）、SKILL.md 规范、渐进式加载、Skill 的编写与复用
05.06 A2A 协议：Agent Card、任务委派、跨平台协作；A2A vs MCP 的边界
05.07 AG-UI 等前端交互协议（Agent ↔ UI 的流式标准化）
05.08 协议选型自查清单：什么时候裸 Function Calling、什么时候上 MCP、什么时候需要 A2A