# 接力任务：扩写 `02-prompt.md` 与 `03-rag.md`

你是要接手 AI 应用开发笔记系列写作的 agent。系列目录：`src/zh/posts/notes/swe/ai-swe/`。此前已把单一大文件拆成 11 章并为每章补了 frontmatter；`01-llm.md` 已按本说明规范完成扩写，可作为风格范本。

## 0) 必读文件（按顺序）

1. 写作方法论（最重要，严格执行）：`.agents/swe-tech-blog/SKILL.md`
2. 目标文件当前提纲：`src/zh/posts/notes/swe/ai-swe/02-prompt.md`、`src/zh/posts/notes/swe/ai-swe/03-rag.md`
3. 已完成范本（先通读感受结构与口吻）：`src/zh/posts/notes/swe/ai-swe/01-llm.md`
4. 旧版素材（可提炼复用、勿照搬其结构）：`src/zh/posts/notes/swe/ai-swe/ai-swe.md`（内含 RAG、Prompt 方法等旧内容）

## 1) 任务

把 `02-prompt.md`、`03-rag.md` 从"提纲清单"扩写为完整技术文章，覆盖提纲全部知识点。允许按内容内在逻辑合并/重排小节，但不允许删点。

- **02（提示词工程）**：基础结构（角色/任务/约束/示例/输出格式）；zero/few-shot 与示例选择；CoT 原理、变体（Self-Consistency、ToT）与适用边界；ReAct 循环（原理层面，Agent 工程实现留给后续章节）；Plan-and-Execute 与 ReAct 对比选型；结构化输出（JSON Schema、Function Calling、解析容错）；提示词工程化管理（版本控制/模板/A-B 测试/与代码分离）；Prompt Injection 与越狱防御（安全边界重点）。
- **03（RAG）**：朴素→Advanced→Modular RAG 演进；RAG vs 长上下文 vs 微调决策；Query 改写/HyDE/多查询；稠密/稀疏/混合检索与 RRF；Rerank（交叉编码器、Top-K 压缩）；引用溯源与幻觉抑制（幻觉机理 01 已讲，此处聚焦"证据与引用"而非重复原理）；Embedding 原理、选型与评测（MTEB/C-MTEB）；向量库对比与 HNSW/IVF 原理；ColBERT 多向量；文档解析（MinerU/Unstructured/OCR/PDF/表格/公式）；Chunking 与 overlap；元数据与增量更新；清洗去重；GraphRAG/KAG；Agentic RAG；RAG 评估（提纲注明"详细放 07 章"，本章只写定位与要点，不展开成完整评估体系）。

## 2) 用户明确约束

- 用**正常 md 分段**（##/###），不要沿用 "02.01 / 03.1x" 编号做小标题，也不要保留原提纲行。
- 面试热点**融入对应小节**，禁止单列"面试题"章节。
- 禁止跨章节/跨文件引用（如"（见 xx 章）"、"详见工具章节"）。写到 Agent/微调/RAG 相邻话题时保持各章自包含；Tokenization、KV Cache、采样、幻觉机理、模型选型等在 01 已展开的概念，**只简略带过、不重复长讲**。
- 技术表述准确；风格是"真正理解技术的 SWE 在整理笔记"，不堆术语、不做百科式铺陈；关键结论/定义句加粗；表格仅在多对象横向比较时使用。
- frontmatter 保持现状（含 `date: 2026-09-07`），不要改。

## 3) 工具使用技巧（来自上一棒的血泪教训）

1. **别用一次 `Write` 写完整篇长文**——单条消息输出有长度上限，会被静默截断。做法：先 `Write` 首块（原样保留 frontmatter + 开头内容），之后用 `SearchReplace` 逐段**追加**，每段 `new_str` 控制在 ~4000 字符内；`old_str` 用文件末尾唯一一行/几句作锚点。
2. 修改前必须 `Read` 目标文件；`Write` 覆盖前也必须先 `Read`。
3. 同一文件末尾的追加必须**串行**；不同文件的编辑可并行。
4. 完成后自检：`Grep`（`^#{2,3}`、`^date:`）+ `wc -l` 确认无截断、无残留提纲编号、末行完整结束；确认全文无"面试题"独立章节、无跨章引用。
5. 一旦发现"用户描述与现实不符"（例：用户以为文件已有 frontmatter，实际没有）或方向有歧义，先用 `AskUserQuestion` 给出选项确认，再动笔，不要擅自假设。
6. 长任务用 `TodoWrite` 拆步跟踪。
7. 易过时的事实（价格、榜单、具体版本号）写成"该看什么维度 / 如何自测"的方法论，不写死结论。
8. 查内容：精确找文件/符号用 `Grep`/`Glob`/`Read`；开放式的"某主题散落在哪些文档"用 `SearchCodebase`；需要 shell（如 wc 校验）才用 `RunCommand`。git 操作除非被明确要求，不做 commit/push。
9. 不要把交接/规划文档写进 `src/zh/posts/` 下——会被站点构建为正文。

## 4) 交付前自检清单

- [ ] 覆盖提纲全部知识点，无删点
- [ ] `##`/`###` 层级正确，无 "0x.xx" 编号样式残留
- [ ] 无独立"面试题"段落（已融入小节）
- [ ] 无跨文件/跨章引用
- [ ] 文件完整收尾、无截断
- [ ] frontmatter 未改动
