---
lang: zh-CH
title: RAG 检索增强生成
description: RAG 架构演进、Query 理解、检索与 Rerank、向量化、数据处理管道与 GraphRAG 等主题
date: 2026-09-07
category:
  - 后端开发
tag:
  - 人工智能
---

03.1x 核心知识
03.11 RAG 架构总览：朴素 RAG → Advanced RAG → Modular RAG
03.12 RAG vs 长上下文 vs 微调：选型决策树
03.13 Query 理解与改写：Query Rewrite、HyDE、多查询扩展
03.14 检索策略：稠密/稀疏/混合检索（BM25+向量）、RRF 融合
03.15 Rerank：交叉编码器原理、选型、Top-K 压缩实践
03.16 引用溯源与幻觉抑制
03.2x 向量化
03.21 Embedding 原理：对比学习、句向量是怎么训出来的
03.22 Embedding 模型选型（BGE/GTE/OpenAI/Cohere…）与评测（MTEB/C-MTEB）
03.23 向量数据库对比：Milvus/Qdrant/pgvector/ES…（HNSW、IVF 索引原理）
03.24 多向量与 Late Interaction（ColBERT 类）
03.3x 数据处理管道
03.31 文档解析：MinerU、Unstructured、OCR、PDF/表格/公式处理实战
03.32 Chunking 策略：固定/递归/语义/结构感知切分，overlap 设计
03.33 元数据管理与增量更新：文档版本、失效索引重建
03.34 数据质量工程：清洗、去重、噪声过滤
03.4x 高级主题
03.41 GraphRAG / KAG：知识图谱增强检索
03.42 Agentic RAG：让 Agent 自主决定检索策略
03.43 RAG 评估：RAGAS、检索命中率、忠实度指标（详细放 07 章，此处留链接）