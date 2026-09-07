---
lang: zh-CH
title: LLM 模型层基础
description: Transformer 与 Attention、Tokenization、采样解码、上下文窗口、幻觉成因与模型选型等模型层高频主题
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

01.01 Transformer 与 Attention 的工程视角（不推公式，讲"为什么影响我的应用"）
01.02 Tokenization：BPE、token 计费、中英文 token 差异、上下文窗口管理
01.03 采样与解码参数：temperature / top_p / top_k / repetition_penalty 的调参实践
01.04 预训练范式：Pretrain → SFT → 偏好对齐（RLHF / DPO / GRPO）→ 开发者视角的影响
01.05 推理模型范式（o1/R1 类）：长思维链、test-time scaling，何时该用推理模型
01.06 上下文窗口与 KV Cache：长上下文的成本与性能真相
01.07 幻觉的成因与工程化缓解手段
01.08 模型选型方法论：能力/成本/延迟/合规四维评估
01.09 主流上游模型 API 对比与网关设计（OpenAI/Anthropic/国产模型、兼容层、failover）
📋 interview.md：模型层高频面试题索引