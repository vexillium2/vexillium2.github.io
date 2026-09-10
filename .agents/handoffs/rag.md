# Q4-2 Embedding训练与Reranker精排

**本章学习目标：**
* 看清楚模型底层「架构」到「训练工程」之间到底差些什么——架构只占 30%，剩下 70% 是数据/损失/训练范式。
* 掌握 embedding 训练的三阶段范式：领域持续预训练 -> 监督对比精调 -> 偏好对齐。
* 理解为什么召回层之外还要配 Reranker——这是双边 bi-encoder 的物理上限决定的，不是工程偏好。
* 掌握 Embedding + Reranker 协同策略：解决召回为 Top1 / Reranker 认为 Top50 的不一致问题。
* 掌握一份在 Globex 跨境场景下可直接落地的「数据 -> 损失 -> 三阶段 -> 协同 -> 评测 -> 部署」清单。

**学习建议：**
这是一篇《Q-OLLM 双向向量召回与语义检索.md》的“训练特刊”。——核心只讲训练怎么做，本篇讲怎么把训练、调优、评测先记三条主线：
1. embedding 准确性 = 数据 + loss + Hard Negative 迭代，模型架构只占小头。
2. Reranker 不是“重跑一遍轮子”，是 bi-encoder 数学结构注定的必补丁——必须关注看 query -> item 的交叉信号。cross-encoder 才能。
3. Embedding 和 Reranker 必须协同训练，否则召回和精排各自自优、整体不优。

## 1、本章导读

### 1.1 4-0 没讲清楚的事
* [4-0] Q4-0 LLM双向向量召回与语义检索.md 把双塔（Query / Item）的架构和「向量语义 + BM25 全文」双通道融合讲了，但有几件事没展开：
* 双塔模型用什么数据训？正负样本怎么选？跨境场景的「假负样本」怎么过滤？
* 用什么 loss？为什么 Infonce 是事实标准，还需要哪些改进？
* 为什么刚“训练得不错”？哪里指标掉卡线？跨语言语义怎么评？
* 为什么生产链路召回层之外还需要加一层 Reranker？两者怎么协同训练？
* 这一篇把这件事补齐。

### 1.2 本章做什么，不做什么
**做的：**
1. embedding 训练的**数据配方**（含负样本过采）+ **InfoNCE 四连改** + **三阶段训练范式**（含偏好对齐）。
2. Hard Negative Mining 的迭代范式——负样本决定模型上限，采样策略是上限。
3. Reranker 的必要性、选型、主用损失函数、LoRA 微调参数、评估指标对齐、工程化部署。
4. Embedding + Reranker 协同策略：同为 MarginMSE 蒸馏 + 渐进式 HNSW 搜索加速。
5. 训练 + 部署全链路图，把 [4-0] Q4-0 LLM双向向量召回与语义检索.md。

**不做的：**
* 不重复讲全栈架构（已在 [4-0] Q4-0 LLM双向向量召回与语义检索.md）。
* 不重复讲选型（已在 [4-1] Q4-1 向量相似度检索与 OpenSearch 搜索方案.md）。
* 不重复讲框架的工程代码（留给生产部署章节）。

## 2、Embedding 准确性是个工程问题

### 2.1 通用模型在业务线上为什么不够
**直接看 BGE-M3 和 mE5 这类通用模型在 Globex 跨境电商场景做 cosine 相似度实测：**

| Query 对 | 期望（语义等价） | 实测 cosine | 是否达标 |
| :--- | :--- | :--- | :--- |
| 「帆布旅行背包」 vs 「canvas travel backpack」 | > 0.85 | 0.62 | ❌ |
| 「徒步登山鞋防打滑三件套」 vs 「hiking shoes anti-slip set」 | > 0.80 | 0.59 | ❌ |
| 「不锈钢保温水杯带吸管」 vs 「stainless steel insulated cup with straw」 | > 0.75 | 0.41 | ❌ |

**结论：** 通用 embedding 模型的语义空间不是为垂直领域 + 跨语言搜索结果排的。三类典型失败都掉到「不及格」线下。**Globex 必须在通用底座上做领域继续预训练 + 业务对比精调 + 偏好对齐三阶段。**

### 2.2 准确性的三个维度

| 维度 | 业务体现 | 主指标 |
| :--- | :--- | :--- |
| 同义性 | 「收纳包」=「整理包」 | Recall@10 |
| 跨语言一致性 | 「帆布背包」≈「canvas backpack」 | 跨语言 Recall Gap、cosine 通过平 |
| 业务相关性 | 「任意低价物品」≠ 高对应面价 | NDCG@10 + 人工评测 |

**跨境电商比中文电商最难就在第二维：同一商品在不同平台展现不同，必须让 embedding 在跨语言下仍然相似。**

## 3、训练数据怎么造

### 3.1 正样本：四类来源加权采样
**业界共识：正样本不是越多越好，而是质量加权采样。**

| 来源 | 信号强度 | 规模 | 噪声 | 推荐采样权重 |
| :--- | :--- | :--- | :--- | :--- |
| 人工标注 query-item 对 | 最高 | ~5万 | 极低 | 40% |
| 全局购买日志（query → 购买 item） | 高 | ~500万 | 低 | 35% |
| 跨语言同款对齐对（同 SKU 不同平台多语言描述） | 中-高 | ~200万 | 低 | 15% |
| LLM 翻译增强对（GPT/Qwen 翻译翻译） | 中 | ~100万 | 中 | 10% |

**关键点：** 高质量数据可以重复使用（一个 epoch 3-5 次），低质量数据每条只走一次。

### 3.2 负样本：四档配方（决定模型上限）

| 负样本类型 | 怎么构造 | 比例 | 训练价值 |
| :--- | :--- | :--- | :--- |
| In-batch negatives | 同 batch 其他 query 的正例当负例 | 基础 | 免费，规模大 |
| 跨类目 BM25 Hard | BM25 Top-20 中分非同类目商品 | 40% | 拉开粗排差距 |
| 跨语言混淆 Hard | 外观相似但规格/功能不符的多语言商品 | 30% | 跨境场景核心 |
| 语义近似 Hard | 上一版 embedding 距离 TopK 但非相关项 | 30% | 自我蒸馏 |

**为什么 hard negative 关键：**
1. easy negative：模型早就分得开，再训一万轮也无增量
2. hard negative：模型当前正在犯错的样本，每一条都是重点

**Hard Negative Mining 节奏：** 每训练 1 个 epoch 用当前 checkpoint 重新挖一次，否则负样本会「过时」，训练信号失效。

### 3.3 假负样本过滤（跨境场景必做）
**跨境电商的“个性货大坑”：「假负样本」——同款商品的不同 SKU，不同语言版本被误当负例：**

```python
# 正确：「帆布旅行背包」 - SKU-A001（英文标题：canvas travel backpack）
# “负例”：SKU-A025（中文标题：帆布旅行双肩包）—— 其实是同一商品！
# 实际A: 颜色/款式相近，被BM25或向量误判为负例
```

双重过滤策略：

```python
if 负样本 = 候选负集:
    # 先验 ID 相同的（跨平台同 SKU 数据库 join 剔除）
    - 图片感知哈希相似的（pHash 距离 < 5 视为同款）
```

如果不做这一步，跨语言召回 loss 会被 10-20% 的假负带跑偏。
3.4 Hard Negative Mining 的迭代范式
```python

for epoch in range(EPOCHS):
    # v0 模型（通用底座 BGE-M3 / mE5）
    # 1. 用 v0 召回 Top-100
    # 2. 取「用户真实点选 + 商品 ID + 图片/价格不同」的 Top-100 = hard negat
    # 3. 用 v1 重新挖 hard negative
    # 4. 训 v2
    # ... 通常迭代 3-5 轮收敛
```
收益曲线 (Recall@100)：
表格
轮次	起点	提升
通用底座 v0	0.62	—
Stage 2 初训 (v1)	0.78	+0.16
HN Min 1 轮 (v2)	0.85	+0.07
HN Min 2 轮 (v3)	0.88	+0.03
HN Min 3 轮 (v4)	0.89	+0.01 (边际收益)
4、Loss 函数：InfoNCE 的四个改进点
4.1 主损失：InfoNCE
```python
L = -log( exp(sim(q, d+) / τ) / Σ_{i∈D} exp(sim(q, di) / τ) )
```
q：query 向量
d+：正例 item 向量
d-：batch 内所有其他（含 1 个正例 + N-1 个负例）
τ：温度系数（关键超参）
4.2 改进 1：动态温度
跨境场景的关键调参——不同语言对用不同温度：
表格
对类型	τ 值	原因
跨语言对	0.02	跨语言天然距离更远，需要更“锋利”的 loss
同语言对	0.05	标准值
经验： 温度系数是最大敌人——默认 0.05 在中文效果问题，但跨境场景用同语意训练出来 Recall@100 低 5-8%。
4.3 改进 2：Hard 负样本加权
不能所有负样本同等重要：
```python
L_weighted = -log( exp(sim(q,d+)/τ) / 
                   [exp(sim(q,d+)/τ) + Σ w_i * exp(sim(q,di)/τ)] )
```
其中 w_i = 2.0 if di 是 hard negative
      w_i = 1.0 otherwise
防止模型对 hard negative 过于自信，把它误判成正例。
4.4 改进 3：跨语言对齐辅助损失
```python
L_align = InfoNCE( encode(中文_query), encode(英文_query) )
```
正例对来源：
LLM 自动翻译：用 GPT-4/Qwen 把同一商品标题翻译成多语言（中/英/泰语/印尼语）。
平台官方数据：商品在多平台的官方多语言描述。
4.5 改进 4：假负样本过滤（已在 3.3 详述）
体现在 Loss 上就是：构造负样本索引集 D 时，严格剔除商品 ID + 图片/价格的同款。
4.6 双塔 + 精排对齐的综合 Loss
目前 [4-0] Q4-0 LLM双向向量召回与语义检索.md 的双塔结构，目前只优化相关性，所以 Loss 只有相关性。
```python
L_total = α * L_semantic + γ * L_align
L_semantic = InfoNCE_dynamic_τ(query 编码, Item 编码上)
L_align = InfoNCE_dynamic_τ(query 编码, 英文查询编码)
```
经验值： α=0.8, γ=0.2。L_align 不要设太大否则跨语言过度收敛。

如果你看过业内的三塔方案，会发现它们还有一项L_personalize(把 User塔和 Query塔融合后去拟合转化）。Globex没有这一项——个性化不在召回层做，原因见[4-0§3.1/§4.4](04-0LLM双塔向量召回与语义检索.md)。少了这一项的直接好处是训练目标单一，不需要在相关性和转化之间调跷跷板。

5、三阶段训练范式
完整的 Post-Training 流程是三阶段，阶段目标、数据、超参都不同：
```text
1. 通用底座 (BGE-M3 / mE5 / MTE)
   ↓
2. Stage 1: 领域持续预训练 (CPT) —— 让模型理解电商语言风格分布
   ↓
3. Stage 2: 监督对比精调 (SFT) —— Query-Item 相关性比对学习
   ↓
4. Stage 3: 偏好对齐 (DPO) —— 对齐人类感知判断 / 跨文化偏好
   ↓
5. 生产模型 v_N
```
5.1 Stage 1：领域持续预训练 (CPT)
目标： 学会电商语料与电商商品描述的分布偏差，不改变原语义对齐能力。
任务一：多重 MLM
表格
数据	全量商品资料 + 属性 + 描述（无标注）
标准 mask	普通随机 15% 单字 mask
特殊处理 1	品牌名 / SKU / 型号等实体 mask 概率（5%）——避免遗忘专有名词
特殊处理 2	数字规格（32GB / 256G）整体 mask——强迫模型理解数值语义
特殊处理 3	跨语言对齐段落输入（zh 段落 + en 成对拼接）
任务二：多语言句对预测
表格
正对	同款商品的不同语言描述
负对	同类目不同商品的标题
目标	在无标签情况下建立跨语言锚点
关键超参：
表格
超参	值	原因
学习率	1e-5	远小于下游训练，防止灾难遗忘
步数	5-10 万步	足够适配电商语料，不必到收敛
数据	覆盖所有目标语言 + 温度采样平衡（小语种数据少量上采样）	—
5.2 Stage 2：监督对比精调 (SFT)
目标： 让 v0 模型适应电商域 + 跨境场景的相关性判断。
Curriculum Learning（课程学习）：
表格
阶段	数据难度	目标	lr 设置
Week 1	随机 + In-batch 负样本	学习基本语义区分	5e-6
Week 2	加入同类目 BM25 Hard	学习细粒度区分	warmup 500 步
Week 3	全量 4 种 Hard 负样本	对齐真实召回分布	warmup 500 步
Week 4	+ Reranker 蒸馏信号	对齐 Reranker 信号（见 §11）	warmup 500 步
关键超参：
表格
超参	值	原因
学习率	5e-6	比 SFT 小一个量级，防灾难遗忘
Epoch	3-5	看 dev 集 Recall@100 收敛
Batch	大批 (>1024)	In-batch 负样本数量保证够
5.3 Stage 3：偏好对齐 (Embedding-DPO)
为什么要这一阶段？
SFT 前的局限：只学了“购买”信号，分不清冲动购买 vs 精准购买
错标（GT）无法表达“差不多好”的程度序列
跨文化差异需要手动纠偏
偏好数据构建：
表格
来源	怎么构建
人工标注转换	A> B 对，B> A 对（最好对 (A,B)，只取分差 > 2
A/B 实验结果	同一 query 展示不同商品，购买 A 未购 B → A>B
跨语言场景偏好	同一 query 在不同市场的两类差异（如日本用户更偏好精致规格）
Embedding-DPO 公式（标准 DPO 不能直接用，需改造）：

```python
L_DPO = -log σ ( β * [sim(q,d_w) - sim(q,d_l)] 
               - β * [sim_ref(q,d_w) - sim_ref(q,d_l)] )

    sim_ref: Stage 2 训练的 SFT 模型（作为参考）
    β: 控制偏离参考模型的程度（推荐 0.1~0.5）
```

关键超参：
表格
超参	值	原因
学习率	1e-6	比 SFT 再小一个量级
负样本	不用 In-batch——会干扰每个	
β   0.1-0.5     越大越偏离SFT模型

5.4三阶段对照
表格
阶段    数据    lr  epoch   主要解决    Recall@100收益
Stage 1 CPT 全量商品语料    1e-5    5-10w 步    适配电商域语料分布  0 → 0.65
Stage 2 SFT query-item对+ 4 档hard neg 5e-6 3-5 对齐相关性判断 0.65 → 0.85
Stage 3 DPO 偏好对（人工+ A/B+市场) 1e-6    1-2 细粒度偏好+跨文化   0.85 → 0.88+

5.5冷启动期：怎么把训练数据造出来
业务点击/购买日志为零时的核心命题不是「能不能训」（CPT总是能跑），而是「怎么把训练数据造出来，且不让合成数据把模型带偏」。本节专门讲数据侧。

5.5.1 Day0能用的四类素材
素材    Day 0 是否有    主要用途
商品库本身（标题/描述/类目/属性/图片）  有  LLM改写生成query；图哈希做去重和同款配对
公开多语言电商数据集(mMARCO/xPQA/DuReader电商部分)  有  通用语义底座+跨语言对齐种子
商品库里的多语言标题（同一SKU的英文标题vs 中文标题）    有  跨语言对齐路的金标——非合成、非翻译腔
业务点击/购买日志   没有    等业务上线后采集，不在冷启动范畴

最容易被忽视的是第三档：跨境商品库通常本身就存了同一SKU的多语言官方标题，这是天然的「同款不同语言」对齐对，质量比LLM翻译高一个量级。
5.5.2LLM合成正样本：query的五档生成
不是简单一句「生成5个query」，而是按搜索意图层级结构化生成。否则合成数据全是同一类表达，模型学不到泛化：

表格
query   类型      例子      训练价值
直接搜(核心词)  「帆布旅行背包」    学基础实体匹配
属性扩展搜  「轻便耐用的旅行背包」  学属性同义
场景搜      「出差用的双肩包」      学语义跨度
模糊需求搜    「想要那种装得多还轻的包」    学口语化query
跨语言改写（L1-L4各生成英/越/印4语）    「canvas travel backpack」  跨语言对齐

Prompt模板（关键：逐档要求，不能笼统）：
```text
给定商品：
标题：{item_title}
类目：{category}
核心属性：{attributes}（材质 ／ 规格 ／ 产地等，不含价格)
请按以下五档分别生成 query，每档 1-2 条：
[L1 直接搜]用户记得商品大致名称时怎么搜，包含核心词
[L2 属性搜]用户记得 1-2 个属性但不记得品类时怎么搜
[L3 场景搜] 用户从使用场景出发怎么搜（不出现品类词）
[L4 模糊搜]用户用口语化、不完整描述时怎么搜
[L5 跨语言]把上面四档各翻译成英／越南/印尼语，用平台目标用户的真实表达，不要直译
约束：
- 每条 query 句式必须不同，不要套用「我想要 X 的 Y」这种模板
一 不准照抄商品标题里连续 4 字以上的片段
一用真实用户口吻，不要营销语
```


## 5.5.3 LLM 合成的四个坑 + 治理

合成数据如果不做清洗，训出来的模型大概率比通用底座还差。四个常见坑：

| 坑 | 后果 | 治理 |
| :--- | :--- | :--- |
| 90% 的 query 是同一句式模板 | 模型只学模板，泛化崩 | 温度 ≥ 0.9 + 显式要求每条句式不同 + 跑完 SimHash 去重相似度 > 0.85 的 |
| LLM 倾向直接照抄商品标题 | embedding 退化为「标题字面相似度」模型 | Prompt 显式禁止 + 后处理用最长公共子串过滤连续 4 字命中 |
| 跨语言改写有翻译腔（拼音直译 / 语序颠倒） | 训出来的对齐是「翻译质量」不是「用户表达」 | 优先用平台真实多语言标题对（5.5.1 第三档）替代 LLM 改写 |
| 头部品类生成多、长尾品类生成少 | 长尾召回质量低 | 按品类分桶采样商品，保证每个长尾品类至少 50 条合成对 |

## 5.5.4 负样本：冷启动期能造和不能造

**冷启动期不能用：**

- ❌ **ANN hard negative：** 自己挖自己的负样本，模型陷入自蒸馏漩涡（v0 错的 → v1 当 hard 学进去 → 错得更深）
- ❌ **LLM 合成负样本：** LLM 不知道「什么算无关」，给的"负例"经常是似是而非的弱相关（伪 hard），训出来反向漂移

**冷启动期能用：**

| 来源 | 怎么造 | 难度 | 比例 |
| :--- | :--- | :--- | :--- |
| In-batch negatives | 同 batch 其他 query 的正例当负例 | Easy（必备） | 基础 |
| 跨类目随机负样本 | 给每个商品打类目标签，从远类目随机抽 | Easy | 50% |
| BM25 同类目 hard | BM25 在同类目内召回，取标题字面命中但子类型不同的 | Hard，核心 | 50% |

例：商品「帆布旅行背包」，BM25 同类目 hard 是：

- 「帆布手提包」（同材质同大类目，形态不同）
- 「旅行登山包」（同场景同大类目，功能不同）

这种 hard negative 不靠模型自挖、不靠 LLM 合成，纯靠 BM25 + 类目结构挖出来，没有自蒸馏偏置风险。

## 5.5.5 跨语言混淆负样本（跨境必造）

跨境场景一个独有的负样本类型——「跨语言长得像但完全不同」的商品对：

```text
1. 正例对：「Canvas backpack 30L outdoor hiking」 ↔ 「帆布登山背包 30L 户外」
2. （同 SKU 跨平台官方多语言标题）
3.
4. 负例对：「Canvas backpack 30L outdoor hiking」 ↔ 「帆布双肩包 12L 学生通勤」
5. （都翻译成中文叫"帆布背包"，但用途、容量完全不同）
```

**挖法：**

1. 先在商品库做跨语言聚类（用通用 BGE-M3 cosine ≥ 0.75 召回近邻）
2. 对每个近邻对，看「容量 / 用途 / 类目」这些结构化字段是否冲突
3. 字段冲突的 = 跨语言混淆负样本

这一档绝对不能 LLM 合成——LLM 没有平台真实 SKU 的结构化属性数据，造出来全是想象。

## 5.5.6 冷启动数据混合配比

把上面五种数据按比例混进 Stage 2 SFT 训练 batch：

| 数据来源 | 占比 | 进入哪一路 loss |
| :--- | :--- | :--- |
| 公开多语言电商数据集（mMARCO 等） | 40% | L_semantic 主路 |
| 商品库 LLM 合成正样本 | 25% | L_semantic 主路 |
| 平台真实多语言标题对齐对 | 20% | L-align 跨语言对齐路（核心） |
| BM25 同类目 hard 负样本 | 10% | 负样本池 |
| 跨语言混淆负样本 | 5% | 负样本池 |

公开数据占比最高、合成数据占比次之，是因为合成数据噪声最大，宁愿少用、不要训歪。


# 5.5.7 数据质量五条红线

每批数据进入训练前，必须过这五个自动检查：

| 检查项 | 阈值 | 触发后怎么办 |
| :--- | :--- | :--- |
| 重复样本率 (SimHash > 0.85 的 query 占比) | < 1% | LLM 重新生成 + 提温度 |
| 商品标题照抄率 (query 连续 4 字以上) | < 10% | 换 prompt 模板 |
| 跨语言翻译腔比例 (拼音直译 / 语序颠倒) | < 20% | 用平台真实多语言替代 LLM 翻译 |
| 长尾品类覆盖率 | ≥ 80% | 按品类分补 |
| 标注人人工标注一致率 (5% 抽样) | ≥ 75% | 整批作废重新生成 |

任何一条不达标的批次直接作废，不要试图"修一修再用"——合成数据的坏味道会在 Hard Negative Mining 第 1-2 轮被指数级放大。

---

# 6、评测：怎么知道训出来准了

## 6.1 评测集构造的红线

绝对不要用爬来的电商数据当评测集——分布偏移严重，离线指标涨但线上 CTR 不动甚至下降。

正确做法：

1. 从业务真实日志切片：选一段历史时间窗（建议跨平台 + 跨季节 + 至少 3 个月）。
2. 不能用来训练的数据：必须留做 holdout，否则评测形同虚设。
3. 建议规模：1-3 万条 query，每条平均 2-5 个标注正例。
4. 人工抽检：5% 抽样人工 review label 质量，CTR 偏差严重的 query 直接剔除。

## 6.2 三大核心指标 + Globex 阈值

| 指标 | 含义 | 召回层 Globex 阈值 |
| :--- | :--- | :--- |
| Recall@100 | Top-100 召回覆盖率正例的比例 | ≥ 0.85 |
| MRR@10 | 第一个正例的倒排平均排名 | ≥ 0.45 |
| NDCG@10 | 考虑相关度等级的排序质量（多档相关性） | ≥ 0.55 |

## 6.3 跨语言独立评测（跨境必填）

1. 跨语言 Recall Gap = \| Recall@100_zh - Recall@100_eng \|
2. Globex 阈值：≤ 0.05（差距 ≤ 5%）
3. ...
4. 跨语言 cosine 相似度 = (同义跨语言 query 对中 cosine ≥ 0.80 的对数) / (总对数)；Globex 阈值 ≥ 75%
5. ...
6. 人工标注 Cohen's Kappa (跨语言一致性) ≥ 0.75
7. 同一 (query, item) 不同语言版本的标注差异 ≤ 1

## 6.4 离线指标 ↔ 线上效果的关联

离线 Recall@100 涨 5%，线上 CTR 通常涨 1-2%。比例不是 1:1。常见的「离线涨线上不动」原因：

- 评测集分布偏移线上真实分布（不同 query 频次权重）
- Rerank 在兜底，召回层提升被「打平」
- 评测集 label 噪声太大，离线提升大部分是噪声

---

# 7、为什么需要 Reranker

## 7.1 双塔 bi-encoder 的物理天花板

双塔结构的本质限制：Query 和 Item 是分别独立编码的，向量在生成时彼此看不见。

```text
bi-encoder (双塔):
Query — [编码器 A] -> q_vec
Item   — [编码器 B] -> i_vec — [cosine] -> 分数

q_vec 和 i_vec 是各自独立产生的，无法做交叉注意力

cross-encoder (精排):
Query + Item — [拼接] — [编码器] — 直接输出分数
```

## 7.2 职责分层：谁该处理什么信号

出问题 Reranker 之前必须先讲清一件事——搜索链路里有四类信号，分别由四个组件处理，越界就出错。

| 信号类型 | 谁处理 | 例子 |
| :--- | :--- | :--- |
| 数值 / 枚举硬约束 | Agent 直接拆参数 -> 工具 filter | 价格 < 300, 评分 ≥ 4.0, 品牌 = X, 跨境直邮 = true, 平台 = amazon |
| 结构化排序键 | 工具 sort 参数 | 按销量降序、按价格升序、按上架时间 |
| 语义近似召回 | Embedding (双塔 + Faiss) | "收纳袋 ≈ 整理包"、"canvas ≈ 帆布"、"出差三件套 ≈ 旅行套装" |
| 语义细粒度精排 | Reranker (cross-encoder) | "不要塑料 vs PU 皮" (同义识别)、标题/描述一致性、套装真伪识别 |

职责越界 = bug:

- 让 Embedding 学价格：训练数据噪声放大 (同 query 不同价位都是正例)，跨境直邮容易崩。
- 让 Reranker 学价格/评分：召回层 filter 已经把不达标的全过滤掉了，Reranker 看到的全都满足约束 -> 再去"识别" -> 等于它干已经做完的事，还会被这些数值字段的噪声干扰。
- 让 Agent 判断语义近似：Agent 不可能在每次 query 都列举"帆布/canvas/牛津布"所有同义词，这是 Embedding 该干的。

记住一句话：Reranker 只看语义，硬约束让 Agent 通过 toolcall 提前过滤掉。

## 7.3 在 Globex 的具体例子

主 AgentLoop 处理用户 query「便宜耐用的旅行三件套，预算 300 元，不要塑料」：

```python
# Step 1: Agent 直接拆参数 (数值 / 枚举硬约束都在这一步搞定)
product_search(
    query = "耐用旅行三件套",       # 留给召回层的语义部分
    price_max = 300,               # 数值硬约束
    material_not = "plastic",      # 枚举硬约束
    min_rating = 4.0,              # 数值硬约束
    sort_by = "review_count_desc", # 结构化排序
)

# Step 2: 召回层 (双塔 + Faiss) 只对 query 文本做语义召回
# 语义召回 Top-100: 所有候选已满足 price / rating / material 约束
# 候选示例 (cosine > 0.85, 语义分不开):
# A. 帆布旅行三件套套装: 洗漱包 + 鞋包 + 收纳袋
# B. 帆布旅行收纳袋套装: 实际只有 1 件大袋, 标题写"三件套"
# C. 露营三件套: 帐篷 + 地垫 + 防潮垫
```

注意三件事：

- 价格、评分、材质硬约束在 Step 1 已经被 toolcall filter 过滤掉，根本不进入召回候选。
- Embedding 召回处理的是"旅行三件套"、"三件套 ≈ 套装"这种语义近似。
- Reranker 处理的是"标题写三件套但实际只有 1 件"、"露营三件套 ≠ 旅行三件套"这种只有同时看 query 和 item 全文才能识别的细粒度语义不一致——这正是 cross-encoder 的物理优势所在。

Reranker 不是锦上添花，是召回层 -> 推荐结果之间的必经一步。

---

# 8、Reranker 在召回链路里的位置

## 8.1 链路图

```text
用户 query
    |
Query 塔 -> 请求向量
    |
Faiss ANN (HNSW + IP) -> Top-100 候选
    |
Reranker (cross-encoder) -> 精排 Top-10
    |
主 Agent 在 Reflect 阶段二次精排
    |
主 AgentLoop
    |
并行的 BM25 全文检索见 [0-0-5-4-2][0-0-LLM双塔向量召回与语义检索.md]，
两路 RRF 融合后一起进 Reranker，不影响下面的延迟预算
(全文检索与向量通道并发，不串行叠加)。
```

## 8.2 延迟预算

| 阶段 | P99 延迟 | 备注 |
| :--- | :--- | :--- |
| Query 塔编码 | < 30 ms | 双塔预预热后单条编码很快 |
| Faiss ANN (HNSW, 1000w 库) | < 50 ms | 单机 HNSW 上千万级常见水准 |
| Reranker (Top-100 精排) | 50-100 ms | FP16 + 批处理 + GPU 是必要条件 |
| 总召回延迟 | < 200 ms | 留 50ms buffer 给网络反序列化 |

Reranker 的延迟敏感度极高——CPU 跑 Top-100 cross-encoder 通常在 500ms+，必须 GPU 化。这是 Reranker 部署的第一坎。

---

# 9、Reranker 选型对比

| 模型 | 多语言 | 模型大小 | 部署成本 | 适合场景 |
| :--- | :--- | :--- | :--- | :--- |
| BGE-Reranker-v2-m3 | 100+ | 567M | 中 | Globex 推荐 —— 平衡最好 |
| Jina Reranker v2 | 多语言 | 278M | 低 | 中小流量 |
| Cohere Rerank 3 | 100+ | API only | 按调用计费 | 不想自部署，但单价较贵 |
| BGE-Reranker-v2-MiCPM | 多语言 | 2.8B | 高 | 极致质量，需多卡部署 |
| BGE-Reranker-v2-LLM | 多语言 | 7B | 极高 | 实验研究，生产慎用 |

Globex 选 **"BGE-Reranker-v2-m3"** 的核心理由：

1. 跨境多语言场景——v2-m3 在 100+ 种语言上有训练数据。
2. 567M 参数 GPU 单卡能跑 —— A10/T4 都行，FP16 下批处理 128 条延迟 P99 < 80ms。
3. 可 LoRA 微调 + DPO 偏好对齐 —— 业务定制成本低。

---

# 10、Reranker 训练：三阶段损失 + 偏好对齐

## 10.1 输入格式 + 截断优先级

```text
输入模板:
【CLS】{Query} 【SEP】{商品标题} 【SEP】{品牌} 【类目】{核心属性} 【SEP】

商品文本截断优先级:
标题 (100 词) > 品牌 + 类目 (20 词) > 属性 (80 词) > 描述 (截断丢弃)

总长度: Query(32) + Doc(200) ≤ 256 Token
```

{核心属性} 的边界：仅指材质、规格、产地、用途、适用场景这类语义文本属性，不包括价格、库存、销量、运费、评分这些结构化数值字段——按 57.2 的职责分层表，后者会由 Agent -> toolcall filter 处理，不该塞进 Reranker 的输入文本。把价格放进 Reranker 输入会带来两个问题：① 模型把"便宜 = 相关"当成强信号学进去，泛化差；② 候选集本来就已满足价格约束，再让 Reranker 看一遍纯噪声 token 毫无意义。

## 10.2 4 档相关性标注

| 分数 | 含义 |
| :--- | :--- |
| 3 分 | 完全相关 (精准命中 query 意图) |
| 2 分 | 相关 (满足核心需求，非最优) |
| 1 分 | 边缘相关 (部分满足) |
| 0 分 | 不相关 |

跨语言一致性要求：同一 (query, item) 对不同语言版本打分差异 ≤ 1 分；定期做跨语言一致性校验 (Cohen's Kappa ≥ 0.75)。

## 10.3 三阶段损失 (核心升级)

Reranker 训练分三段进行，每段目标和损失不同：

**Stage A: Pointwise 热启 (1-2 天)**

```text
损失: BCE 二分类
正样本 = 3 分，负样本 = 0 分
目标: 让模型从随机初始化开始学排序，避免冷启动训不动
```

**Stage B: Pairwise 过渡 (1-2 天)**

```text
损失: MarginRanking
要求: score(相关) - score(不相关) > margin
margin 随难度动态调整 (hard 对大 margin, easy 对小 margin)
```

**Stage C: Listwise 精排 (3-5 天, 核心)**

```text
损失: ApproxNDCG
直接优化业务指标 NDCG@10
每个 query 采样: 1 个 3 分 + 1 个 2 分 + 2 个 1 分 + 3 个 0 分
保持相关性分布真实，不过度采样负样本
```

**为什么三阶段?**

1. 直接 Listwise -> 模型从随机初始化学排序，loss 极不稳定
2. 直接 Pointwise -> 模型只会"判断相关/不相关"，不会"排序"
3. 三阶段 -> 先学判断 (A)，再学排序 (B)，最后学精确排序 (C)

## 10.4 ⭐ Reranker 偏好对齐 (DPO + 市场标记)

SFT 阶段后，再上一层 DPO 解决跨文化偏好差异：

```text
输入格式 (带市场标记):
Chosen: 【CLS】【MARKET:JP】Query 【SEP】优质商品文本 【SEP】
Rejected: 【CLS】【MARKET:JP】Query 【SEP】次优商品文本 【SEP】
```

让同一模型学多市场偏好 (日本用户偏好精致包装、欧洲用户偏好环保认证、东南亚用户偏好低价)。

DPO 损失: 与标准 LM-DPO 一致，但 reward 来自 Reranker 打分；参考模型是 Stage C 训完的 SFT Reranker (冻结)。

## 10.5 LoRA 微调骨架

```python
# scripts/train_reranker.py
from datasets import load_dataset
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE_MODEL = "baaai/bge-reranker-v2-m3"

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL, num_labels=4
)

# LoRA: 只训部分参数，业务定制成本低
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["query", "value"],  # 只在 attention 的 Q/V 上插
    lora_dropout=0.1,
    bias="none",
    task_type="SEQ_CLS"
)
model = get_peft_model(model, lora_config)

dataset = load_dataset("json", data_files="data/reranker_train.jsonl")

def preprocess(ex):
    # 注意: query 前面加市场标记
    query_with_market = f"【MARKET:JP】{ex['query']}"
    enc = tokenizer(
        query_with_market, ex["item_text"],
        truncation=True, max_length=256, padding="max_length",
    )
    enc["labels"] = ex["label"]
    return enc

ds = dataset.map(preprocess, batched=False)

args = TrainingArguments(
    output_dir="outputs/reranker-globex-v1",
    num_train_epochs=3,
    per_device_train_batch_size=32,
    learning_rate=1e-4,  # LoRA 用大一点的 lr
    fp16=True,
    logging_steps=50,
    save_strategy="epoch",
    eval_strategy="epoch",
)
Trainer(model=model, args=args, train_dataset=ds["train"]).train()
```

## 10.6 工程化部署 5 个关注点

| 关注点 | 推荐值 | 不做会怎样 |
| :--- | :--- | :--- |
| 量化 | FP16 (必做) / INT8 (可选) | FP32 显存翻倍，延迟翻倍 |
| 批处理 | 每批 64-128 条候选打包 | 单条推理 GPU 利用率 < 20% |
| GPU 部署 | 至少 T4 / A10 | CPU 跑 Top-100 P99 飙到 500ms+ |
| 候选数限制 | Top-100 -> Top-10 | Top-1000 不实用，延迟会爆 |
| 模型 warmup | 服务启动后预热 100 条假请求 | 第一波真实请求会遇冷启动延迟 |

---

# 11、⭐ Embedding ↔ Reranker 协同训练

## 11.1 召回 - 精排不一致问题

```text
Embedding 召回的 Top-100，Reranker 认为 Top-1 可能只排第 50 位
原因：两个模型优化目标不一致——Embedding 只看向量空间距离，
Reranker 学的是"人工标注的细粒度相关性"

各自最优 ≠ 整体最优。必须协同训练。
```

## 11.2 双向 MarginMSE 蒸馏

**方向 1: Reranker -> Embedding (主要方向)**

```text
用 Reranker 对 (query, item) 的打分作为软标签
指导 Embedding 学习更贴近 Reranker 判断的向量空间
损失: L_distill = MarginMSE (sim_emb(q,d), score_reranker(q,d))
权重: 在 Stage 2 SFT 后期加入，约占总 loss 的 0.2
```

**方向 2: Embedding -> Reranker (辅助方向)**

```text
Embedding 检索的 TopK 作为 Reranker 的训练候选集
确保 Reranker 见过的是真实召回分布，而不是人工构造的候选
实现：每轮 Embedding 训练后，重新生成 Reranker 的训练候选集
```

## 11.3 协同迭代节奏

```text
Round 1: Embedding 训练 1 epoch (Stage 2)
    ↓ 用 Embedding 检索更新 Reranker 训练候选集
Round 2: Reranker 训练 1 epoch (Stage A/B/C)
    ↓ 用 Reranker 打分更新 Embedding 软标签
Round 3: Embedding 训练 1 epoch (带蒸馏 loss)
    ...
迭代 3-5 轮收敛 (dev 集 NDCG@10 不再上涨)
```

## 11.4 渐进式 Hard 负样本挖掘升级版

普通 HN 挖掘只用 Embedding 自挖，升级版用 Embedding + Reranker 联合过滤：

| 轮次 | 挖掘方式 | 难度 |
| :--- | :--- | :--- |
| Round 0 | BM25 召回 Top-100 中的非购买项 | 易 |
| Round 1 | Embedding v1 召回 Top-100 中的非购买商品 | 中 |
| Round 2 | Embedding v2 召回 Top-200，Reranker 打分 > 0.3 但用户未买 | 难 |
| Round 3+ | 持续迭代 | 极难 |

Round 2 是关键 —— "Reranker 都觉得相关但用户没买"的商品，是模型当前认知和真实业务之间最大的 gap，每一条都是高价值样本。

停止条件：

- Hard 负样本的 Embedding 相似度趋于稳定 (轮次间变化 < 1%)
- 或达到预设迭代轮数 (通常 3-5 轮)

---

# 12、训练 + 部署全链路

流程图文本描述：

```text
flowchart TD
subgraph Train["离线训练 (4-6 周)"]
    EvaIT -> Eval (Recall@100 / MRR / NDCG / 跨语言 Gap / Cohen's Kappa)
    Rerank -> Eval (Top-10 NDCG)
end

subgraph Online["线上召回链路"]
    [User Query] -> [Query Enc]
    Query Enc -> Faiss [ANN Top-100]
    Faiss -> RerankOnline [精排 Top-10]
    RerankOnline -> Picker [主 Agent 精排]
end

Tower (部署) -> Query Enc
Tower -> 离线缓存 -> Faiss
RerankOnline (部署) -> ...
```

这张图把 [0-0][0-0-LLM双塔向量召回与语义检索.md] 的架构，和 [4-1][0-4-1] 向量基础设施选型与 OpenSource 演进路线.md 的 (向量库 + 训练 + 协同 + Reranker) 三件事串成一条线：

- 离线训练 (左) -> 双塔 + Reranker，双向蒸馏让两者协同最优
- 离线评测 (中) -> 卡片值，不达标不上线
- 在线召回 (右) -> 双塔编码 -> Faiss 召回 -> Reranker 精排 -> 主 Agent 精排

---

# 13、迭代节奏建议 (10 周)

| 周期 | 做什么 | 预期收益 |
| :--- | :--- | :--- |
| 第 1 周 | 用 BGE-M3 直接搭建双塔底座，跑通离线评测 | Recall@100 基线 0.62-0.68 |
| 第 2 周 | Stage 1 CPT 领域持续预训练 (5w 步) | Recall@100 -> 0.65 |
| 第 3-4 周 | Stage 2 SFT + Curriculum Learning + 跨语言对齐 loss | Recall@100 -> 0.78 |
| 第 5-6 周 | HN Mining 第 1-2 轮迭代 | Recall@100 -> 0.85 |
| 第 7 周 | BGE-Reranker-v2-m3 直接部署 (不微调) | NDCG@10 基线 |
