---
lang: zh-CH
title: Agent 评估
description: Agent 评估难点、评估分层、LLM-as-Judge、主流 benchmark 与自建评估集
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

07.01 为什么 Agent 评估比传统 ML 评估难（非确定性、轨迹长、无标准答案）
07.02 评估分层：单步（工具调用正确性）→ 轨迹（trajectory eval）→ 端到端（任务完成率）
07.03 LLM-as-Judge：评估 Prompt 设计、位置偏差、与人工评估的一致性校准
07.04 基准测试：GAIA、SWE-bench、AgentBench、τ-bench 等主流 benchmark 解读
07.05 RAG 专项评估：RAGAS（faithfulness/answer relevancy/context precision）
07.06 构建自己的评估集：黄金样本、bad case 回流、回归测试
07.07 在线评估：A/B 实验、用户反馈信号、灰度发布策略
07.08 CI 化的 Agent 测试：eval 进流水线的工程实践