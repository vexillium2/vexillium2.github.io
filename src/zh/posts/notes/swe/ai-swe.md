---
lang: zh-CH
title: AI应用开发笔记
description: LLM基础、RAG到Harness Engineering
date: 2025-7-19
category:
  - 后端开发
tag:
  - 人工智能
---

## 大模型基本框架


Transformer 是目前主流 LLM 的核心基础，于 2017 年在《Attention Is All You Need》中提出，完全基于注意力机制，不依赖 RNN 或 CNN。

#### 整体结构

现代 LLM（GPT、Claude、Llama 等）主要采用 **Decoder\-only** 架构：

- 输入经 Token Embedding \+ Positional Encoding

- 多层 Transformer Block（Masked Self\-Attention \+ FFN）

- 输出层对词表做 Softmax，预测下一个 Token 的概率分布

原始 Transformer 的 Encoder\-Decoder 结构主要用于翻译/摘要（T5、BART）。

#### 注意力机制

核心公式：`A = softmax(QK^T / √d_k) · V`

假设原始输入特征为 X，通过三个独立的线性变换矩阵 W\_Q、W\_K、W\_V 投影到三个不同空间，得到 Q（查询）、K（键）、V（值）。具体流程：计算 Q 和 K 的点积相似度得注意力分数矩阵，经 Softmax 归一化后与 V 加权求和，得到注意力输出 Z。

**KV 矩阵解耦的意义**：K 负责"检索"，V 负责"内容提取"，两者解耦赋予注意力机制强大的动态选择和表达能力，而不是简单地用同一组参数同时决定"选什么"和"取什么"。

**缩放因子 √d\_k**：防止 d\_k 较大时点积结果过大，导致 Softmax 进入梯度消失区域。

**低秩问题与 Decoder 优势**：由于 Q 和 K 的维度 d\_k 通常远小于序列长度 n，注意力矩阵 A 本质上是低秩矩阵，表达能力受 d\_k 严重限制。而 Decoder 中经因果掩码处理后的注意力矩阵是下三角矩阵，只要对角线不为零即为满秩，因此 **Decoder\-only 的单向注意力在理论上具有更强的表达能力**，这也是其成为主流 LLM 架构的原因之一。

**因果掩码（Causal Mask）**：Decoder 屏蔽当前位置右侧的 token，保证自回归生成的单向性。

#### 多头注意力（MHA）

将 Q/K/V 拆成 h 个头，每个头独立计算注意力后拼接再投影。每个头聚焦不同语义子空间，提升表达能力。

#### 位置编码

Transformer 无序列感知，需显式注入位置信息：

|方法|代表模型|特点|
|---|---|---|
|Sinusoidal|原版 Transformer|固定，无需学习|
|Learned PE|BERT、GPT\-2|可学习，但外推性差|
|RoPE|LLaMA、Qwen|旋转编码，外推性强，成为主流|
|ALiBi|BLOOM|注意力分数加线性偏置，免修改 Embedding|

#### FFN（前馈网络）

每个 Block 的第二部分，两层线性变换 \+ 激活函数（SwiGLU / GeLU），参数量约占模型总量的 2/3。

#### KV Cache

推理时缓存历史 K/V，避免重复计算，大幅加速自回归生成。随序列增长显存压力大，是长上下文的主要瓶颈。

### BERT 与预训练语言模型（PLM）

BERT（Bidirectional Encoder Representations from Transformers）是基于 Transformer **Encoder** 的双向预训练语言模型。它不采用传统单向语言模型，而是通过 **MLM（遮蔽语言模型）** 对双向 Transformer 进行预训练，生成包含上下文信息的深层双向语言表征。预训练后只需添加少量输出层进行微调，即可在各类下游任务中取得 SOTA 效果。

与 ELMo（用双向 LSTM 分别编码两个方向后浅层拼接）不同，BERT 将左右上下文作为统一整体处理，表征能力更强。

#### 输入格式

根据任务类型，输入可以是单文本（如 NER、情感分析）或文本对（如问答、自然语言推断）：

- 序列开头插入 `[CLS]`（分类 token），每个句子末尾插入 `[SEP]`（分隔 token）

- **输入表征 = Token Embedding \+ Segment Embedding \+ Position Embedding**

- Segment Embedding 区分 A/B 两段文本（0 标记片段 A，1 标记片段 B）

- 位置编码为可学习参数（与原始 Transformer 的固定 Sinusoidal 编码不同）

#### 预训练任务

**MLM（Masked Language Model）**：以 15% 的概率随机遮蔽输入 token，用 `[MASK]` 替换，训练模型预测被遮蔽的原始 token。这使每个 token 同时获得左右双向上下文信息，解决了传统单向语言模型的局限。

**NSP（Next Sentence Prediction）**：从语料中构造"是下一句"和"不是下一句"的句子对，让模型学习句间关系。两个任务联合训练，损失函数为两者之和（系数通常 1:1）。

#### 下游任务适配

|任务类型|使用方式|
|---|---|
|单文本分类（情感分析）|取 `[CLS]` 输出向量接全连接层 \+ Softmax|
|文本对分类（自然语言推断）|同上，输入改为文本对|
|序列标注（NER、词性标注）|取所有非特殊 token 的输出接分类层|
|问答（SQuAD）|在段落 token 输出上预测答案起止位置|

> BERT 属于 Encoder\-only 架构，擅长"理解"任务；GPT/Claude 等 Decoder\-only 模型更适合"生成"任务。两种范式的本质差异在于预训练目标不同：BERT 预测被遮蔽的 token（双向），GPT 预测下一个 token（单向）。
> 
> 

### LLM 核心概念

|概念|说明|
|---|---|
|Token|分词最小单元，一个中文字约 1\~2 token|
|上下文窗口|模型一次能处理的最大 token 数|
|Temperature|控制输出随机性，0 为贪婪解码，值越高越随机|
|Top\-p（核采样）|只从累积概率达到 p 的 token 集合中采样|
|System Prompt|预置指令，引导模型行为与角色|
|Logit|Softmax 前的原始分数|

### 三类架构对比

|架构|代表模型|适用场景|
|---|---|---|
|Decoder\-only|GPT、Claude、Llama|文本生成、对话、推理|
|Encoder\-only|BERT、RoBERTa|分类、NER、语义匹配|
|Encoder\-Decoder|T5、BART|翻译、摘要、问答|

> Decoder\-only 成为主流原因：自回归训练可利用任意文本，无需标注；大规模下涌现出强大推理能力。
> 
> 

---

## RAG（检索增强生成）

RAG 的核心思路：LLM 存在知识滞后、幻觉问题，推理时外挂知识库动态检索相关内容注入上下文。

### 标准流程

```
用户问题 → 向量化 → 向量检索 → Top-K 文档片段 → 拼入 Prompt → LLM 生成答案
```

三阶段：**Indexing（离线构建）→ Retrieval（在线检索）→ Generation（在线生成）**

### 向量数据库

专门存储高维向量，支持近似最近邻（ANN）搜索：

- **索引算法**：HNSW（查询快，内存高）/ IVF\+PQ（大规模场景）

- **相似度度量**：余弦相似度（语义）/ 内积 / 欧氏距离

- **常用工具**：Milvus、Qdrant、Chroma、FAISS、pgvector

### Indexing（索引构建）

#### 分块策略

|策略|适用场景|
|---|---|
|固定字符数|通用首选，简单可靠|
|滑动窗口（带 overlap）|长文档，保留上下文连续性|
|结构化切分（按标题/段落）|Markdown / 技术文档|
|语义切分|通用文本，切分更自然|

推荐参数：chunk\_size 300~~500 tokens，chunk\_overlap 50~~100 tokens

#### 嵌入模型

- BGE\-M3（中英双语，支持稠密\+稀疏\+多向量）

- text\-embedding\-3\-small（OpenAI，轻量）

- Sentence\-BERT（通用语义）

### Retrieval（检索）

**粗排**：双编码器（Bi\-Encoder），Query 和文档分别编码，计算余弦相似度，快速召回 Top\-K。

**精排（Rerank）**：交叉编码器（Cross\-Encoder），Query \+ 文档拼接后输入，精细打分。慢但准，常用 `bge-reranker-base`。

**混合检索**：稠密检索（语义）\+ 稀疏检索（BM25 关键词），用 RRF 融合排序，覆盖更全面。

### Advanced RAG

|技术|作用|
|---|---|
|HyDE（假设文档嵌入）|LLM 先生成假设答案，用假设答案检索，提升语义对齐|
|Query 改写 / 扩展|改写问题，提升召回覆盖|
|摘要索引|存摘要向量，检索命中后返回原文|
|父子索引|细粒度切分检索，粗粒度块送入 LLM|
|多路召回|多个检索器并行，结果融合|

### RAG vs 微调

|维度|RAG|微调|
|---|---|---|
|知识更新|更新向量库即可，实时|需重新训练|
|成本|低|高（GPU 资源）|
|可解释性|可追溯检索来源|黑盒|
|适用|私域知识、实时知识|风格迁移、特定能力|

### 常见检索问题

检索内容并非越多越好，过多反而导致检索退化（Lost in the Middle 问题）。常见故障类型及对策：

|问题|描述|对策|
|---|---|---|
|内容不在知识库中|查询内容超出索引范围|完善知识库覆盖，或接入联网检索|
|错过排名靠前的文档|相关文档召回了但排名靠后被截断|调整 Top\-K，改进嵌入模型或使用混合检索|
|整合策略限制|内容召回了但未进入最终上下文|优化 Rerank 策略，扩大上下文窗口|
|未被 LLM 引用|出现在检索结果但未被模型采用|使用提示压缩技术减少噪声，突出关键片段|
|格式错误|缺少表格、公式等结构化内容|改进文档解析（如 docling），保留结构元数据|
|答案不完整|上下文给够了但 LLM 回答残缺|将复杂问题拆分为子问题逐一检索回答|
|特异性不匹配|答案过于笼统或过于具体|优化提示词，或提升基座模型能力|

---

## 开发框架

### LangChain

LangChain 提供连接 LLM 与各类工具的标准化抽象层。任何符合 OpenAI 规范的服务商都可通过 `ChatOpenAI` 加入 `base_url` 与 `api_key` 参数接入；大部分主流服务商在 `langchain_community` 中已注册对应接口。

**model（模型）**：分嵌入模型和聊天模型，调用方式支持 `invoke`、`stream`、`batch`，参数包含 `input`、`config`、`history`。`get_graph()` 可查看链结构图。

**prompt（提示词）**：

- `PromptTemplate.from_template()` 或构造方法指定 `template`、`input_variables`

- `ChatPromptTemplate.from_messages()` 支持 System、Human、AI 三种角色模板嵌套

- `FewShotPromptTemplate` 用于少样本提示

- 参数注入：`.format(var=xxx)` / `.partial()` / 在 `invoke` 阶段传入均可

- `MessagesPlaceholder`：在聊天模板中预留历史消息插槽

**输出解析器**：`CommaSeparatedListOutputParser`、`DatetimeOutputParser`、`JsonOutputParser` 等，将模型原始输出转为结构化数据。

**LCEL（LangChain Expression Language）**：基于 Runnable 组件，重写 `__or__` 方法实现管道连接（`|`）。核心组件：

- `RunnableLambda`：将普通函数包装为 Runnable

- `RunnableParallel`：并行执行多个子链

- `RunnablePassthrough`：透传输入；`.assign()` 在同一字典中追加额外字段

- `@chain` 装饰器：将函数直接声明为可组合的链

**记忆（Memory）**：`ChatMessageHistory()` 存储对话历史；`RedisChatMessageHistory` 通过 `session_id` 持久化；`RunnableWithMessageHistory(chain, get_session_history)` 自动维护多轮历史。

**数据连接**：包含文档加载器、切分器、嵌入模型、向量数据库、检索器等模块：

- **加载器**：`.load()` 加载文本、Word（`Docx2txtLoader`）、Excel、PDF 等

- **切分器**：`CharacterTextSplitter`（基于字符，默认 `"\n\n"` 分割）；`RecursiveCharacterTextSplitter`（递归按自然语言或代码结构切割，推荐）；`chunk_size`/`chunk_overlap` 控制块大小与重叠

- **嵌入**：索引和检索阶段须使用同一嵌入模型，否则向量空间不匹配

**FastAPI 集成**：`FastAPI()` 定义 app，装饰器确定路由，`pydantic.BaseModel` 定义请求体，`uvicorn.run()` 启动服务；响应可以是 JSON 或 HTML。

**工具（Tools）**：`Tool(name, func, description)` 或 `@tool` 装饰器定义；`model.bind_tools([tools])` 绑定到模型后，返回结果中的 `tool_calls` 字段表示模型触发了工具调用。

**调试**：`langchain.debug = True`；`chain.get_graph().print_ascii()`

### LangGraph

LangGraph 将 Agent 流程建模为**有状态的有向图**，解决复杂 Agent 的流程控制问题（支持循环、条件分支、并行）。

#### 核心概念

- **State**：贯穿全图的共享数据结构，用 TypedDict 定义

- **Node**：处理状态的函数，接收 state → 返回更新后的 state

- **Edge**：节点间连接；**Conditional Edge** 根据状态动态路由，实现分支

- **Checkpointer**：持久化状态，支持断点续跑、Human\-in\-the\-loop

#### 与 LCEL 对比

|特性|LangChain LCEL|LangGraph|
|---|---|---|
|结构|线性链|有向图（支持循环）|
|状态管理|无状态 / 手动传递|全局共享 State|
|控制流|顺序执行|条件路由、循环、并行|
|适用场景|简单 RAG / 问答|多步 Agent、自我修正|

#### 基本代码结构

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list

def call_model(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state: AgentState):
    if state["messages"][-1].tool_calls:
        return "tools"
    return END

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")
app = graph.compile()
```

#### 常用模式

- **ReAct Agent**：思考 → 工具调用 → 观察，循环执行

- **Human\-in\-the\-loop**：特定节点等待人工审批后继续

- **Subgraph**：将复杂流程拆为子图，模块化复用

- **Multi\-Agent**：多个 LangGraph 图协作

---

## Agent

### 什么是 Agent

Agent = LLM \+ Tools \+ Memory \+ 规划能力。与单次 LLM 调用的区别：

- 自主分解多步任务

- 调用外部工具获取信息或执行动作

- 根据执行结果动态调整计划，边执行边规划

### Workflow vs Agent

||Workflow|Agent|
|---|---|---|
|控制流|预定义，路径固定|动态，自主决策|
|可靠性|高，可预测|较低，存在不确定性|
|适用|流程清晰的任务|开放式、多路径任务|

**实践建议**：关键路径用 Workflow 兜底，灵活决策部分用 Agent；复杂任务切分为小步骤便于测试和回滚。

Agent 的记忆来源有三类：**预训练和微调**（参数中固化的知识）、**上下文窗口**（当前对话历史）、**外部记忆库**（向量数据库或结构化存储）。三者结合才能实现真正的长期记忆与动态知识更新。

### Tool \& FunctionCall

Tool 让模型输出从自然语言扩展为**可触发真实动作的结构化指令**。

**FunctionCall 流程**：

1. 定义工具 schema（name / description / parameters JSON Schema）

2. 模型输出 `tool_calls` 字段（非文本）

3. 代码执行对应函数，得到结果

4. 结果注入上下文，继续生成

### Prompt Engineering for Agents

|技术|核心思路|适用场景|
|---|---|---|
|CoT|显式引导逐步推理|复杂数学/逻辑任务|
|自我一致性|多路径投票取最一致答案|高可靠性要求任务|
|ToT（思维树）|采样多条推理路径，搜索最优|多路径决策、数学证明|
|ReAct|Thought → Action → Observation 循环|通用工具调用型任务|
|Plan \& Execute|先全局规划，再逐步执行|长任务，防中途偏移|
|Self\-Reflection|Agent 对输出批判评估后迭代|需要高质量输出|
|Reflexion|动态记忆 \+ 反思，结合长期记忆|需要跨轮次自我修正|

#### CoT（思维链）

显式使用"请逐步思考"或提供 few\-shot 示例，引导模型展开推理过程。

**自我一致性（Self\-Consistency）**：CoT 的增强版，生成多条不同推理路径后，用多数投票选出最一致的答案，减少单次推理的随机性。使用方式：提示词中声明执行 N 次，再自行整合结果。

适用场景：

- 科学计算、法律判断、医疗诊断等高可靠性任务

- 与 CoT 结合：生成多条推理路径后取最优解

缺点：响应时间增加，计算成本更高。

#### ToT（思维树）

思维树是 CoT 的扩展，将每一步的推理建模为树的分支，通过搜索算法（BFS/DFS）探索多条路径，评估每个叶子节点的任务完成度，最终综合选出最优解。

适用场景：

- 需要探索多种可能性、进行全局优化的复杂任务

- 数学证明、编程调试、多路径决策

缺点：实现复杂，计算开销极大，对模型能力要求高。

#### ReAct

交替执行 **Thought（思考）→ Action（工具调用）→ Observation（观察结果）** 的循环，将推理和行动结合，是目前 Agent 最主流的基础范式。

#### Plan \& Execute

先由 Planner 生成完整的全局计划，再由 Executor 逐步执行，适合任务步骤较多、需要防止中途跑偏的场景。

#### Self\-Reflection / Thinking and Self\-Reflection

Agent 对自身决策或行动产出进行批判性评估，与目标对比，识别问题后修正。与 ReAct 的区别：反思可以在决策前或行动后触发，着重于输出质量的自我迭代而非工具调用。

#### Reflexion（动态记忆与反思）

在 Self\-Reflection 基础上引入长期记忆，将历史反思结论存储到外部记忆，在后续轮次中调用，实现跨 episode 的自我改进。

#### CoH（后见之明炼）

利用历史成功/失败样例作为上下文，让模型从"事后视角"学习更优的决策路径。

### 多智能体系统（MAS）

多个 Agent 协作完成复杂任务：

- **Orchestrator\-Subagent**：主 Agent 分解任务，派发给子 Agent 执行

- **共享上下文**：Agent 间通过共享 State 或消息队列协同

- **关键问题**：上下文隔离 vs 共享、任务边界划分、错误传播控制

---

## MCP（Model Context Protocol）

Anthropic 在 2024 年底提出的开放标准协议，解决 AI 工具生态碎片化问题。

### 核心设计：Client\-Server 模型

- **MCP Server**：提供工具/数据能力（数据库、API、文件系统、飞书等）

- **MCP Client**：调用能力的消费方（AI 应用、IDE、Agent）

- 通信格式、能力声明、调用约定全部标准化，跨模型通用

### Server 能力三要素

|要素|说明|示例|
|---|---|---|
|**Tools**|可执行动作|搜索网页、写文件、调 API|
|**Resources**|可读取的数据|文件内容、数据库记录|
|**Prompts**|预定义提示模板|代码审查模板、翻译模板|

### 传输方式

- **stdio**：本地进程间通信，适合 IDE 插件（Claude Code、Cursor）

- **HTTP \+ SSE**：远程服务，Server 可主动推送状态

- **WebSocket**：双向实时通信


---

## Skills

Skill 是比 Tool 更高层次的封装，将完成某类任务所需的**提示词 \+ 工具调用 \+ 上下文 \+ 执行逻辑**打包成可复用的能力单元。

### Tool vs Skill

||Tool|Skill|
|---|---|---|
|粒度|单一原子函数|完成一类任务的完整模块|
|内部组成|一个函数|多个 Tool \+ 推理策略 \+ 提示词|
|示例|`search_web()`|`research_topic`（搜索 \+ 整理 \+ 摘要）|

### Skill 设计原则

- **单一职责**：一个 Skill 专注一类任务

- **自包含**：提示词、工具调用、执行逻辑内聚

- **可组合**：多个 Skill 可被 Agent 编排调用

- **可测试**：有明确输入输出，易于单独验证

---

## 微调

在预训练基础上，用特定领域数据进一步训练，使模型适应特定任务或风格。

### 微调 vs RAG 选择

|场景|推荐方案|
|---|---|
|改变输出风格 / 格式|微调|
|注入大量静态领域知识|微调|
|知识需要实时更新|RAG|
|私域文档问答，成本敏感|RAG|

### 微调类型

#### 全量微调（Full Fine\-tuning）

更新所有参数，效果上限最高，但需要大量 GPU 显存，成本极高。

#### PEFT（参数高效微调）

在保证预训练模型大部分参数不变的情况下，仅调整少量额外参数来适应新任务，大幅降低资源消耗。

**核心问题梳理**：

1. 微调的几种方式及选择依据

2. 高效参数微调的本质：参数由什么组成、Transformer 中主体参数的分布

3. 训练 / 微调 / 推理三者的区别与联系

4. 鼻祖方法 **Adapter Tuning** 架构分析

5. **Prefix\-Tuning** 架构分析

6. 先锋方法 **LoRA** 架构分析

7. Adapter Tuning vs LoRA 的比较

8. LLaMA\-Factory 的安装与使用

9. 微调中需调整的超参数及其含义

**Adapter Tuning**：在 Transformer 每层的 Feed\-Forward 之后插入小型"适配器"模块（两层线性 \+ 激活），训练时冻结原始权重，只更新 Adapter 参数。优点是模块化、可插拔；缺点是推理时引入额外层，有轻微延迟。

**LoRA（Low\-Rank Adaptation）**：

在原始权重矩阵旁并联两个低秩矩阵 A、B，增量 `ΔW = BA`（其中 r \<\< d）：

```
W' = W + BA    （r 通常取 4~64）
```

原始权重 W 冻结，只训练 A 和 B，参数量极小（约为原模型的 0\.1%\~1%）。推理时可将 BA 合并回 W，无任何额外延迟。

**QLoRA**：对基础模型做 4\-bit 量化（NF4 格式）后再做 LoRA，可在消费级 GPU 上微调 7B 甚至 13B 模型。量化本身不影响 LoRA 的训练方式，只是大幅压缩了基础模型的显存占用。

**DyPRAG**（动态参数化 RAG）：直接根据用户输入动态生成 LoRA 参数，将参数化知识与检索式知识统一，是 RAG 与 LoRA 结合的前沿探索方向。

### 微调数据格式

Alpaca 指令格式：

```json
{
  "instruction": "将下面的句子翻译成英文",
  "input": "今天天气很好",
  "output": "The weather is very nice today."
}
```

数据质量 \>\> 数据数量，千条高质量数据优于万条噪声数据。

### 常用工具

|工具|特点|
|---|---|
|LLaMA\-Factory|一站式框架，支持 LoRA/QLoRA，Web UI 友好|
|Unsloth|加速 LoRA 训练，显存减半|
|Axolotl|配置灵活，支持多种数据格式|

---

## 强化学习

RL 用于 LLM 对齐和能力提升，核心：让模型输出满足人类偏好或可验证的奖励信号。

### RLHF（基于人类反馈的强化学习）

**标准三步流程**：

1. **SFT（监督微调）**：在高质量指令数据上微调，得到基础指令模型

2. **Reward Model 训练**：人工对模型输出进行偏好排序，训练打分模型

3. **PPO 训练**：用 RM 分数作为奖励信号，用 PPO 算法优化策略

**问题**：人工标注成本高、PPO 训练不稳定（需维护 4 个模型）、奖励 Hacking。

### PPO（Proximal Policy Optimization）

经典 RL 算法，核心：每次参数更新不能偏离旧策略太远（Clip 约束）。

`L = E[min(r_t · A_t, clip(r_t, 1-ε, 1+ε) · A_t)]`

LLM 场景需同时维护 Actor / Critic / Reward / Reference 四个模型，资源消耗极大。

### DPO（Direct Preference Optimization）

绕开 RL 框架，直接从偏好数据（chosen vs rejected 对）学习，等价于隐式训练了奖励模型。

- 更稳定、更高效，无需单独 Reward Model

- 数据格式：`{prompt, chosen_response, rejected_response}`

### GRPO（Group Relative Policy Optimization）

DeepSeek 提出，PPO 改进：用**组内相对奖励**替代 Critic 模型，节省显存。

- 对同一 prompt 采样多个输出，组内平均奖励计算优势函数

- 在 DeepSeek\-R1 中用于提升数学推理能力

### 可验证奖励（Verifiable Reward）

任务有明确答案时（数学、代码执行），用规则函数替代奖励模型：

- 答案正确 → \+1 / 答案错误 → 0 或 \-1

- 比人类偏好信号更稳定，是 DeepSeek\-R1 / o1 类推理模型的关键

---

## 主流模型

ChatGPT

Gemini

Grok

Deepseek

https://platform\.deepseek\.com/

GLM

Kimi

## 主流Agent 框架

### Claude Code

Anthropic 官方 AI 编程 CLI，深度集成终端与代码环境。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZjJhZWQ3MjI0NDUxZjU4Y2Q1MzliMmQ5MzNkZjIyMzlfZjY4ZTg1OTM2YTJmMmRjZDUyYzkzN2UxYzJhMjgxY2FfSUQ6NzY0NDgyNzI2ODY0MDgyMDQwOV8xNzgzMzIzMjA3OjE3ODM0MDk2MDdfVjM)

**核心特点**：

1. 发现

    1. 快速了解代码库

    2. 检索文档

    3. 

2. 设计

    1. plan项目

    2. 开发技术spec

    3. 定义架构

3. 建造

    1. 实施编程

    2. 测试

    3. Git操作

4. 部署

    1. 自动化 CI/CD

    2. 配置环境

    3. 管理部署

5. 支持与量化

- 直接读写文件、执行 Shell 命令

- 支持 MCP 协议扩展工具生态

- **Hooks 机制**：工具调用前后触发自定义脚本（PreToolUse / PostToolUse）

- **Skills**：将常用操作封装为可复用能力（即本工具所使用的机制）

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZGYyNWJhMDUxYWRjODJiZTJjY2MyMDlhYjgxMjFlNjVfYzVkODhkODFjZmEyZjFiZjFlOTUyZWFmYmQ4YjM2ZTNfSUQ6NzY0NDg4NDk0MzA4OTAyODA0OV8xNzgzMzIzMjA3OjE3ODM0MDk2MDdfVjM)

- **CLAUDE\.md**：项目级上下文注入，定义规范和约束

**适用场景**：代码生成重构、自动化脚本、项目分析、与飞书 / Jira 等系统集成

### AutoGen（微软）

多智能体框架，核心是 **AgentChat** 模型：

- Agent 之间通过消息传递协作

- 支持 Human\-in\-the\-loop

- ConversableAgent：可配置 LLM、工具调用、代码执行环境

### CrewAI

面向**角色扮演**的多智能体框架：

- 每个 Agent 定义 role / goal / backstory

- Task 分配给 Agent，Agent 组成 Crew 协作

- 支持 Sequential / Hierarchical 两种执行模式

- 上手简单，适合快速原型

### 框架选型参考

|框架|特点|适用场景|
|---|---|---|
|LangGraph|细粒度状态控制，灵活可控|复杂自定义 Agent 流程|
|AutoGen|多 Agent 对话，Human\-in\-loop|协作型、审批型任务|
|CrewAI|角色导向，上手简单|快速原型，团队型任务|
|Claude Code|深度集成终端/代码，MCP 生态|开发辅助、工程自动化|



> (注：内容由 AI 生成，请谨慎参考）
