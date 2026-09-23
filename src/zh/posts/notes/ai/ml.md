---
lang: zh-CH
title: 机器学习笔记：从假设空间到神经网络
description: 以「模型在优化什么、凭什么泛化、代价在哪」为主线，整理机器学习课程从学习问题、线性模型、优化与正则，到 SVM、无监督学习与神经网络的完整链条
date: 2026-09-19
category:
  - 人工智能
tag:
  - 机器学习
---

这份笔记的主线是一句话：**每个模型在优化什么、凭什么泛化、代价在哪**。课程按周推进，但章节按"读者问题"重组，不逐页抄课件。

数学推导不在这里重复。法方程、伪逆、正交投影、极大似然、凸性、特征分解与 SVD 都在数学讲义里；这里讲的是**模型视角**——假设空间怎么选、损失为什么这么定、算法为什么收敛、边界在哪。

工程侧（怎么调用、怎么部署、怎么搭系统）属于另一份笔记。这里只回答"模型本身是什么"。

每个知识块使用固定的块标签——**定义 / 性质 / 推导 / 例 / 注意 / 小结**——标签按需出现，不为了凑齐而硬写。

## 一、学习问题与泛化的边界

> 对应课程 W1、W3、W4。**待写。**

- **读者问题**：什么叫"学习"？凭什么相信训练集上的结论能推广到没见过的数据？
- **承接**：全书起点，为后面每一章提供"泛化"这个母题。
- **必讲**：监督学习五组件（目标函数 $g$、训练集、假设空间 $H$、模型 $f_\theta$、算法 $A$）；经验风险 ERM 与结构风险 SRM；i.i.d. 假设为什么是"学习可行"的前提；用 Hoeffding 不等式推出 PAC；VC 维与泛化界。
- **可选/删除**：VC 维的完整证明给结论与直觉；"没有免费午餐"只留一段。

## 二、线性模型：感知机、线性回归与逻辑回归

> 对应课程 W2、W4。**待写。**

- **读者问题**：最基础的三个模型各自在优化什么？分类与回归的分界在哪？
- **承接**：吃第一章的"假设空间"；法方程、伪逆、投影与似然推导都在数学讲义里，这里只引用结论。
- **必讲**：感知机更新规则与线性可分；线性回归的目标与闭式解（结论引用）；逻辑回归从线性得分到概率、再到交叉熵损失；三者的统一视角。
- **可选/删除**：感知机的硬件历史一句带过。

## 三、优化：梯度下降、动量与自适应方法

> 对应课程 W5。**待写。**

- **读者问题**：参数具体是怎么被"找"出来的？为什么还要动量和自适应？
- **承接**：吃第二章的损失函数；依赖数学讲义的梯度、Hessian 与凸性。
- **必讲**：GD 与步长、收敛的条件；SGD 与小批量的方差-效率权衡；动量；AdaGrad / RMSProp / Adam 各自在修什么问题；学习率调度。
- **可选/删除**：收敛性证明给结论。

## 四、过拟合与正则化

> 对应课程 W6。**待写。**

- **读者问题**：模型太强会怎样？怎么控制它？
- **承接**：吃第一章的泛化母题。
- **必讲**：偏差-方差分解；过拟合的成因与识别；$L_1$ / $L_2$ 正则（几何解释在数学讲义的范数一节）；Dropout、早停、数据增强；交叉验证与模型选择。
- **可选/删除**：正则化技巧的清单式罗列。

## 五、间隔与核方法：SVM

> 对应课程 W7。**待写。**

- **读者问题**：为什么"间隔最大"比"分对就行"更好？核是怎么把非线性变成线性的？
- **承接**：依赖数学讲义的超平面与距离、拉格朗日与 KKT。
- **必讲**：最大间隔的动机；支持向量与软间隔；对偶问题与 KKT；核技巧与常见核函数。
- **可选/删除**：SMO 求解算法。

## 六、无监督学习：PCA 与 k-means

> 对应课程 W8。**待写。**

- **读者问题**：没有标签的时候，"学"的是什么？
- **承接**：依赖数学讲义的特征分解与 SVD。
- **必讲**：PCA 的两种推导（方差最大化 / 重构误差最小）与 SVD 的关系；主成分个数怎么定；k-means 的目标函数、EM 视角、k-means++ 与它的局限。
- **可选/删除**：谱聚类等延伸。

## 七、神经网络与注意力机制

> 对应课程 W9、W10、W11。**待写。**
>
> 这一章内容最重，也是最自然的拆分点：超过大约 400 行时，把 W9–W11 单独拆成一份深度学习笔记。

- **读者问题**：多层堆叠为什么能表达非线性？梯度怎么穿过很多层？序列建模为什么被注意力取代？
- **承接**：吃第三章的优化、第二章的线性模型。
- **必讲**：MLP 与激活函数（为什么必须非线性）；计算图与反向传播；初始化、归一化、梯度消失与爆炸；CNN 与 RNN 的归纳偏置；注意力（QKV、缩放点积、多头）；位置编码；Transformer block；预训练目标。
- **可选/删除**：**KV cache、上下文成本、解码采样、微调、RAG 等工程内容全部在 LLM 应用工程笔记里。**

## 附：待整旧稿

> 以下内容从 `ai.md` 原样迁移，尚未按上面的结构整理，随各章推进逐个迁移或删除。原有图片来自飞书，链接已失效，整理时一并清理。

### 编程知识

为保证不过多分配内存，可以尽量使用原地操作，如



创建Tensor：arrange、ones、zeros、randn



修改Tensor形状：size等价于shape，reshape超出size时返回新的，view返回原有的

索引操作

广播机制

1）让所有输入数组都向其中shape最长的数组看齐，不足的部分则通过在前面加1补齐

2）输出数组的shape是输入数组shape的各个轴上的最大值；

3）当输入数组的某个轴的长度为1时，沿着此轴运算时都用（或复制）此轴上的第一组值。



transformer库是Hugging Face库为定义的标准，方便自动下载模型的结构、权重和相应的分词器 \(Tokenizer\)。



d2l库

### 机器学习

机器学习的本质就是用统计和概率模型来**描述数据背后的规律**，并基于此进行预测；本质的另外一种表达是**最小化信息差异**（最小化交叉熵），这与其目标函数常常为MLE有关。

机器学习的核心原则：最大似然估计MLE、经验风险最小化ERM、结构风险最小化SRM。

推荐教材：
1. Abu-Mostafa, Y. S., Magdon-Ismail, M., & Lin, H. T. (2012). Learning from Data. AMLBook.
2. Bishop, C. M., & Bishop, H. (2024). Deep Learning: Foundations and Concepts. Springer.
These books are recommended references rather than required textbooks.

#### 有监督学习

有监督学习从**带标注的样本** \((x_i, y_i)\) 中学习一个**从输入 X 到输出 Y 的映射 f**。标签 y 就是*监督信号*：它告诉模型每个样本应有的答案，因此训练过程本质上就是“用预测值 y_hat = f(x) 与真实值 y 作比较，再反过来修正模型”。样本被假设为从某个未知的联合分布 P(X, Y) 中独立同分布采样，真正的目标是让模型在该分布上的**期望损失** E[L(f(X), Y)] 最小。但 P(X, Y) 是未知的，实际只能最小化有限训练集上的**经验风险**（empirical risk），这也是有监督学习容易过拟合、并且通常要在纯 ERM 之外引入**正则化**（结构风险最小化 SRM）的原因。

训练是一个闭环：前向传播 → 计算损失 → 反向传播梯度 → 用优化器更新参数，如此重复多个 epoch。损失函数需与任务匹配；在给定噪声/模型假设后，它恰好等价于最大似然估计（MLE）导出的**负对数似然**。

有监督任务通常按标签类型划分：

- **回归（Regression）**：Y 为连续值。模型输出一个实数，使用 MSE、MAE 等连续损失训练。代表算法有线性回归、决策树 / GBDT、神经网络回归器；典型应用是房价、气温、销量预测。

- **分类（Classification）**：Y 为离散类别，涵盖二分类、多分类与多标签；输出层用 sigmoid（标签相互独立）或 softmax（类别互斥）把原始分数 logits 转成概率，并以交叉熵训练。代表算法有逻辑回归、SVM、k-NN、树集成和神经网络；典型应用是垃圾邮件检测、图像识别、情感分析。

标签也不必是标量：序列标注、机器翻译、目标检测这类**结构化输出**任务同样属于有监督范式。

代表算法既包括传统方法（线性/逻辑回归、SVM、k 近邻、决策树及其集成如随机森林与 GBDT），也包括深度网络（MLP、CNN、RNN、基于 Transformer 的模型）。统一它们的是训练范式而非模型结构：同一个网络既可以被有监督地训练，也可以被无监督地训练。

常见的误区：

- **“有监督”描述的是训练数据/训练范式，而不是模型。** 现代深度学习中通常是先在无标注文本或图像上做*自监督*预训练，再用标签做*有监督*微调，模型结构始终不变。

- **标签质量决定了性能上限。** 监督信号是唯一携带目标信息的来源，噪声或错误标注会直接压低精度，且无法靠更大的模型完全补偿。

- **i.i.d. 假设会悄悄失效。** 有监督学习假设线上数据与训练数据同分布；一旦发生分布偏移（distribution shift）或概念漂移（concept drift），验证集精度便不再能预测线上表现。

#### 无监督学习

无监督学习处理的是**没有标签、只有输入 X** 的数据。它不预测某个目标，而是去发现数据中的结构：分组、低维表示，或者底层分布 P(X) 的形态。从信息论视角看，有监督学习估计的是条件分布 P(Y|X)，而无监督学习压缩、概括 P(X) 本身——模型完全得不到“对或错”的反馈。

常见的问题族及代表算法：

- **聚类（Clustering）**：把样本划分成组，使组内相似、组间相异。算法有 K-means（基于原型，偏好球形簇）、层次聚类、DBSCAN（基于密度，可处理任意形状与噪声）、高斯混合模型 GMM（软划分/概率化归属）。应用包括客户分群、图像压缩、相关文档归组。

- **降维与表征学习（Dimensionality reduction & representation learning）**：在尽量保留信息的前提下把数据映射到低维空间。线性方法有 PCA / SVD（保留方差最大的方向）；面向可视化的有 t-SNE、UMAP；神经网络方法有自编码器（最小化重构误差）。用途包括特征压缩、去噪、可视化，以及为相似度检索生成嵌入向量。

- **密度估计与异常检测（Density estimation & anomaly detection）**：显式建模 P(X)（如 GMM、核密度估计），落在极低概率区域的点即被判为异常点/离群点。

- **自监督学习——深度学习时代被模糊的边界。** 今天口语中所说的“无监督预训练”通常是*自监督*：数据本身通过一个预训练任务（pretext task）生成伪标签（如 BERT 的掩码语言模型 MLM、对比学习），再用标准的监督手段训练。它在没有人工标注的情况下学到了表征，但并不属于经典的“发现 P(X) 结构”这一设定——这个区别很容易混淆，也是面试常问的点。

难点与常见误区：

- **没有真值就没有通用指标。** 没有标签意味着“误差”无从定义，模型无法用准确率打分；只能靠内部启发式指标（簇内 SSE、轮廓系数 silhouette、重构误差）、下游任务表现或人工观察来评判——因此无监督结果之间很难客观比较。

- **聚类结果不是数据的“真实分组”。** 划分结果取决于所选的距离度量、特征表示以及聚类数 K 等超参数；同一个数据集按不同目的可以得到多个不同但同样有用的分组——聚类的输出是*有用*，而非*正确*。

- **无监督学习不能凭空创造信息。** 它只能揭示数据与所选特征中已经隐含的结构。数据过少或缺乏代表性时，照样会欠拟合或过拟合（例如 K-means 取很大的 K 可以拟合纯噪声）。而且没有标签就无法直接回答预测性问题：要预测某个未见目标，仍需引入标签，这也是无监督方法通常要与后续的有监督或自监督阶段结合的原因。



#### 自然语言处理

> 使用《Speech and Language Processing》学习
> 
> 

##### 文本规范化

如何描述文本模式？最基础的是正则表达式regex，之后是文本规范化，包括tokenization、lemmatization（lemma的意思是词素）、POS tagging词性标注

##### 分词 subword \& tokenizer

此处只介绍新subword方法，即BERT时代之后开始运用的相关分词技术，包含BPE与WordPiece算法，新算法相比老算法能够平衡词与字符之间的颗粒度问题，更好理解部分词的变形规律，有效解决OOV问题、

###### BPE算法

1. 使用非常大的语料库

2. 

###### WordPiece算法

https://huggingface\.co/learn/llm\-course/zh\-CN/chapter6/6

spaCy 英文分词器

HanLP 中文分词器

##### 序列标注

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDVkOWQ3NTgwNTM5MTMzNTE1YTk0MmE2ZGFhNzAyY2JfNmYzN2UyNjg3NWE5MjhjYWJlNDIwNzI2YmZkY2I0YWFfSUQ6NzU3NzMyMTA4MzE5MDE4NDg5MF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

实体识别三种常见的序列标注方法如下：

1. BIO：标识实体的开始，中间部分和非实体部分

2. BMES：增加S单个实体情况的标注

3. BIOSE：增加E实体的结束标识

##### 词性标注

part\-of\-speech

向量化



##### 实体链接

实体链接Entity Linking要解决实体命名的多变性和歧义性。多变性是指同义词必须指向同一个id、同一个实体节点；而多义性指同一个词在不同语境指代不同事物、不同id。

使用词典

##### 实体消岐

人名是常见需要解决实体消岐问题的。有手动匹配、注册平台（ORCID）、自动化方法

##### **LSTM\-CRF**（长短期记忆网络与条件随机场）



##### Transformer

*单向的Transformer一般被称为Transformer decoder，其每一个token（符号）只会attend到目前往左的token，也称为单向/因果注意力。而双向的Transformer则被称为Transformer encoder，其每一个token会attend到所有的token，信息是全局、双向的。*



Attention矩阵A=softmax\(QKt/根号dk\)，由于Q和K的纬度dk通常远小于序列长度n，这导致A是个低秩矩阵，表达能力收到了dk的严重限制；而经过Casual Mask处理后的Attention矩阵是下三角矩阵，只要对角线不为零就是满秩的。因此，Decoder\-only的单向注意力在理论上有更强的表达能力。

##### BERT

BERT全称是基于Transformer的双向编码器，是一个预训练的语言表征模型。模型不采用传统单项语言模型、两个单向语言模型的浅层拼接来进行预训练，而是采用MLM对双向的Transformer进行预训练，以生成深层的双向语言表征。预训练BERT对每一个词元返回抽取了上下文信息的特征向量。之后只需要添加一个额外的输出层进行fine\-tune，就可以在各种各样的下游任务中取得state\-of\-the\-art的表现。

BERT的数据处理过程可以展示为下图：

序列长度max\_length或者sequence\_length指的是

根据任务类型，会将原始文本设为单个文本（如NER、情感分析）和文本对（如NSP、QA）。处理序列时在开头插入\<cls\>（特定的分类token），特殊分隔词元\<sep\>（分割token）插在每个句子后。

```Python
def get_tokens_and_segments(tokens_a, tokens_b=None):
    tokens = ['<cls>'] + tokens_a + ['<sep>']
    # 0和1分别标记片段A和B
    segments = [0] * (len(tokens_a) + 2)
    if tokens_b is not None:
        tokens += tokens_b + ['<sep>']
        segments += [1] * (len(tokens_b) + 1)
    return tokens, segments
```

**模型输入**为每一个token对应的表征（输入表征=Token 嵌入\+Segment 嵌入\+Position 嵌入），是一个固定长度的浮点数向量。每个样本是个句子对，加入额外的片段嵌入，位置编码可学习。输出与输入数量对应，如果有token级别的任务（序列标注和QA）会有额外的输出层表示。

BERT的预训练任务没有如CV那样的ImageNet，但利用了大规模文本数据的自监督性质，分别是Masked Language Model和Next Sentence Prediction，也就是BERT本身是个用于预测mask和下一句。

**MLM掩蔽语言模型**是为了解决out\-of\-vocabulary问题，以15%的概率用mask token （\[MASK\]）随机地对每一个训练序列中的token进行替换，然后预测出\[MASK\]位置原有的单词。

NSP则是解决句子之间顺序的问题，将任意句子组合，打上标签是下一句和不是下一句，两者一起进行训练，损失函数为两者之和，lambda系数一般设为1:1\.

计算Bert模型的

对于单一文本分类（如情感分析），只使用cls的特征，加一个全连接层Softmax分类。

对于文本对分类（如自然语言推断）、

对于问答、

对于文本标记（如命名实体识别），如NER、词性标注，将非特殊词元放进全连接层分类。以BioBERT举例，

### 深度学习

利用深度

#### 神经网络NN

多类别分类使用one\-hot，输出层只有一个神经元

多标签分类输出层有N个神经元，对应N个标签，每个神经元输出一个原始分数logit

反向传播算法

链式法则

全连接层、损失层、激活层、卷积层、循环层

##### 层

对于文本数据，通常是对应词表的one\-hot编码，因此高维而稀疏。图像/语音连续且存在大量相关信息，需要压缩和提炼。

核心层有卷积层、循环层、全连接层。卷积层

功能性层包括激活层和损失层。

|**层次/功能**|**典型层/激活函数**|**数据形态变化（输入 → 输出）**|**任务或目的**|
|---|---|---|---|
|**基础特征提取**|**卷积层 \(Convolutional Layer\)**|高度冗余/结构化（如像素矩阵） \-\> **高维特征图/张量**（局部特征）|提取图像、视频、音频等数据中的**局部空间模式**和**层级特征**。|
|**序列特征提取**|**循环层 \(Recurrent Layer\)** \(RNN, LSTM, GRU\)|序列数据（如文本、时间序列） $\to$ **高维隐状态向量/序列**|捕捉序列数据中的**时间依赖性**和**上下文信息**。|
|**特征映射与组合**|**全连接层 \(Fully Connected Layer\)**|任何向量 $\to$ 任何向量|实现特征的**非线性组合**和**维度转换**，是实现分类、回归等最终决策的关键。|
|**非线性能力**|**激活层 \(Activation Layer\)** \(ReLU, Sigmoid, Tanh\)|向量 $\to$ 向量 \(元素级操作\)|引入**非线性**，使网络能够学习和拟合更复杂的函数关系。|
|**输出与概率**|**输出层** \(Softmax, Sigmoid\)|Logits $\to$ **低维概率向量** \($\sum p_i=1$\)|将原始分数转化为**概率分布**，用于多分类决策。|
|**目标学习**|损失层 \(Loss Function\)|预测概率 $\to$ 单一数值（损失值）|**衡量预测与真实标签的差异**，为模型训练提供优化的方向和目标。|

nn\.Sequential

##### 重要概念

Epoch

#### CNN卷积神经网络

模型识别图像中特定特征的能力不依赖于该特征在图像中的精确位置，这就是CNN的核心设计理念之一：**空间不变性 \(Spatial Invariance\)**，也称为平移不变性 \(Translation Invariance\) 。除此以外，还有**局部性**，就是指前几层网络的特征的影响范围应该局限于局部而非整体。

卷积神经网络通过两种机制系统化地实现了这种不变性：共享参数的卷积层和汇聚层。

A\. 共享参数的卷积层 \(Parameter Sharing\)

- **原理：** 卷积层（或称**检测器/核**）在整个输入图像上**滑动**。无论这个核位于哪个位置，它都使用**同一组权重参数**。

- **效果：**

    - **实现了不变性：** 如果一个 3 \* 3 的核学会了识别“垂直边缘”，那么无论这个垂直边缘出现在图像的哪里，这个核都能用相同的权重识别它。

    - **减少参数：** 相比于每个图像区域都用一组独立的权重，参数共享极大地减少了需要学习的参数数量。

B\. 汇聚层 \(Pooling Layer\)

- **原理：** 汇聚层通过降采样（如最大池化）来**总结**一个局部区域内的特征。

- **效果：**

    - 它使得网络对特征的**微小平移**不那么敏感。即使特征在图像中移动了一两个像素，只要它仍在汇聚窗口内，汇聚层的输出可能保持不变或变化很小。

#### RNN

序列数据，如语音数据、翻译的语句等文档，其中每句话的长度是不一样的，且一句话的前后是有关系的，更适合用RNN处理。





词嵌入技术（如 [GloVe](https://www.aclweb.org/anthology/D14-1162.pdf) 和 [Word2vec](https://arxiv.org/pdf/1301.3781.pdf)）在没有情境的情况下运行，生成序列中各个词语的表示。例如，无论是指运动装备还是夜行动物,“bat”一词都会以同样的方式表示。[ELMo](https://arxiv.org/abs/1802.05365) 通过双向长短期记忆模型 \(LSTM\)，对句中的每个词语引入了基于句中其他词语的深度情景化表示。但 ELMo 与 BERT 不同，它单独考虑从左到右和从右到左的路径，而不是将其视为整个情境的单一统一视图。



### PLM

#### 注意力机制

在描述注意力与视觉的双组件框架中，受试者基于非自主性提示和自主性提示有选择地引导注意力的焦点。非自主性提示是基于环境中物体的突出性和易见性，而受到认知和意识的控制被归为自主性提示。

注意力机制试图用一个“问题”去“搜索”和“提取”最相关的“信息”。假设原始输入特征为 X，通过三个独立的特征矩阵W\_Q、K、V投影到三个不同空间，即查询（Query）、K（键）和 V（值）。给定任何查询，注意力机制通过注意力汇聚引导至感官输入（中间特征）。

具体来说，计算Q和K之间的相似度（使用点积）得到注意力分数矩阵E，再归一化转为注意力权重A，最后和V进行加权求和，得到注意力输出Z。KV矩阵存在的意义在于将检索机制和内容提取机制解耦，从而赋予注意力机制强大的动态选择和表达能力。





### 显卡与模型

炼丹侠

A100 80G显存 支持7b、14b模型

Llama 4 Scout 超长上下文模型

最小的微调模型，至少需要一张\>=24GB的显卡（3090/4090）

模型

- GPT\-3\.5

- Llama

- PaLm

### 优化：小批量与 SGD（从数学讲义旧稿迁出）

在深度学习中，由于源数据都比较大，所以通常需要用到批处理。如利用批量来计算梯度的随机梯度法（SGD）就是一个典型应用。深度学习的计算一般比较复杂，并且数据量一般比较大，如果一次处理整个数据，较大概率会出现资源瓶颈。为了更有效地计算，一般将整个数据集分批次处理。过小也无法利用发挥平行处理的优势。因此实际中往往使用mini\-batch批量处理。

小批量随机梯度下降SGD，是从数据集中随机抽取的一个小批量，然后根据参数计算损失的梯度，再朝着减少损失的方向更新我们的参数。

### 评估指标

**混淆矩阵**：真假表示预测正确还是错误，并非实际为真假。真负例是正确预测的负例，假负例是错误预测为负例实际为正例。

**准确率Accuracy**是指所有正确分类（无论是正类还是负类）所占的比例，使用\(真正率TP\+真负率TN\)/总样本all，但对于样本类别严重不平衡的情况，如样本中负样本占了99%就可以无脑预测负了，所以针对类别不平衡要使用F1等指标。

**精确率Precision**指所有正类别分类中实际为正类别的比例，使用真正例TP/\(无论真假\)预测为正的例TP\+TN；如果实际正例的数量非常少（例如总共只有 1\-2 个），那么精确率作为一种指标的意义和实用性就会降低。

**召回率Recall**，又叫真正例率，表示正的中有多少预测准的，使用真正率TP/\(无论正负，真正\+假阴\)实际为正的例TP\+FN；适合宁可错不希望漏。相对的，还有假正例率。

假正例越少，精确率越高；假负例越少，召回率越高。因此，精确率和召回率通常呈反比关系，即提高其中一个指标会降低另一个指标。

**F1分数**，它们的调和平均数，权重各为1；如果倾向于召回率可以改成F1\.5、F2分数


### 损失函数（Error Function）



#### MSE均方差

均方误差/平方损失（square loss），常用在线性回归模型中来对模型w和b进行求解。均方误差的几何意义对应欧氏距离，基于均方误差最小化求解就是最小二乘法。通常用在连续值预测上，因为在回归问题中，通常假设误差服从正态分布，而 MSE 正是从最大似然估计推导出的最优损失函数。

#### Cross Entropy交叉熵

交叉熵取自信息论。当我们要搞清楚一件非常非常不确定的事，或是我们一无所知的事情（日食），就需要了解大量的信息。相反，如果我们对某件事已经有了较多的了解，我们不需要太多的信息就能把它搞清楚（如太阳照常升起）。由此引入信息量I，它与概率之间的公式：

I = \-log P

为描述一个信息源可能产生的所有信息的平均不确定性。（这个公式之所以使用负对数是因为在计算数据集的似然函数时涉及乘积，而上万的概率相乘会导致计算机数值下溢，负对数保留负相关性的同时将乘积化为加法解决了数值稳定问题。一般选取自然对数以方便求导）

接着便可引入信息论中的熵——香农熵或信息熵，其本质就是在随机事件中信息量的期望：（此处前面乘以P\(x\)是因为期望的计算是概率×事件）

H\(X\) = \-Σ P\(x\) log P\(x\)

抛硬币正反两面概率为0\.5，因此得到信息熵为1。若是8个等概率事件，信息熵就是3；而不同概率如\{1/2, 1/4, 1/8, 1/16, 1/64, 1/64, 1/64, 1/64\}的信息熵为2。可以证明，那些接近确定性的分布（输出几乎可以确定）具有较低的熵，那些接近均匀分布的概率分布具有较高的熵。

**交叉熵**，是用来衡量两个概率分布P和Q之间的差异。假设有随机变量X，它的真实概率分布为P，而我们在处理实际问题时，使用了一个近似的分布Q来进行拟合。

H\(P, Q\) = \-Σ P\(x\) log Q\(x\)

由于使用的是近似分布，所以传递信息需要更多的信息量，因此存在结论：交叉熵一定大于或等于熵。

交叉熵与熵的差称为**KL散度**，也叫相对熵。在训练网络的场景下，我们可以将近似分布Q看作是网络的实时输出，而我们的目的是通过训练使得Q尽量逼近真实分布，等价于最小化KL散度。网络在使用交叉熵损失函数时需要先用sigmoid函数或者Softmax函数将输出转换为概率值。

![Image](/assets/images/cs/ai/cross_entrophy1.png)

A\. 对于单标签分类任务，对单个样本而言，假设真实分布为Y，网络输出的分布为Y尖，总类别数为n，交叉熵损失函数就是：

![Image](/assets/images/cs/ai/cross_entrophy2.png)

在手写数字识别任务中（数字为0\~9），若样本是数字5，则对应的真实分布应为\[0,0,0,0,0,1,0,0,0,0\]，若网络输出分布为\[0\.1,0\.1,0,0,0,0\.7,0,0\.1,0,0\]，计算得到的Loss为0\.3567（因为独热编码特点，实际计算0\.7的负对数即可）；计算\[0\.2,0\.3,0\.1,0,0,0\.3,0\.1,0,0,0\] 则Loss为1\.2040。对比两种情况，前者损失小于后者，说明前者更接近真实分布。在一个batch下计算单标签分类任务的交叉熵损失函数（使用平均损失算法避免过大的batchsize导致梯度过大，参数更新步子迈的过大，所以归一化）：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MGQ2NDViMWJhZjkyYjRlOTE2ZjY5NWM0YTExMWM0ODhfMGNlMTJlODdkNWQxYmE5ZmQ1NzI5OTkyMDRlMDEzYmZfSUQ6NzU2OTkwNTk3MjE5NjI3ODI3NV8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

B\. 对于多标签分类任务，如一张图片中同时含有“猫”和“狗”，这张图片就同时拥有“猫”和“狗”两个标签。在这种情况下，我们将sigmoid函数作为网络最后一层的输出，把最后一层的每个神经元都看作样本中含有某一标签的概率。对多标签分类中的某一类单独分析，真实分布P是一个二项分布，可能的取值为0或者1，而网络预测的分布Q可以理解为标签是1的概率。所以某一类别的交叉熵损失函数为：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NzllMmQwYWY2MmYyMjk5ZmZjYWQzN2Q2MDQyYTM3MzBfOWJkODE0YWVhNmUyNzJkNDMwNDU1NmZjMjYwNmE4MjJfSUQ6NzU2OTkwNTk3MzAzMDE5MTEzMl8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

由于多标签分类任务中，每一类是相互独立的，所以最后一层的神经元输出的概率值之和并不等于1，总的交叉熵为每一类的交叉熵之和。假设真实分布（二项分布）为\[1,1,0\]，而经过网络输出的概率分布为\[0\.8,0\.9,0\.1\]，那么可以计算总的交叉熵损失：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YzU2YzYyOTFmMTQ0ZWNmNzRiNTUyNDJhNmM0ZmQ2OGVfY2QyYmQ1MmIyODg3ZTE3ZDI4MzQ4MjgwYTE1ZjFlYjJfSUQ6NzU2OTkwNTk3MTU1OTYxMjQxOF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

对一个batch，计算方法为：


![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MmFkYzVmMDFiOTYyNTZkYjljMmE2MmYwNWY5YzZkZmFfMjBjMzhjNmQxNWNmOWQxZDUxMzYyMjIyZTlkNjhiZTJfSUQ6NzU2OTkwNTk3MTU1OTY0NTE4Nl8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)


### 激活函数

#### Softmax（软最大值）

Softmax也常被称为**归一化指数函数，作用是将一个包含任意实数值的向量，转换成一个概率分布向量。**soft含义是希望分值大的那一项被经常取到，而分值较小的那一项也有一定的概率偶尔被取到。设计的初衷，是希望特征对概率的影响是**乘性的**。用在多分类这种**所有类别**之间**互斥且穷尽**（即样本只可能属于其中一个类别）的场景。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MjU3MDBhZjJmYjBiYTA1NWEwZThjNjgxNTYzM2JlODBfMTM2OTcxMGJhZTdiMWVmNTdlODAzMjZiOWE2MTUwZGVfSUQ6NzU2OTkwNTk3MTc5MzAwMjUwMF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

由函数可知，所有概率分布是互斥而非独立的，总和为1，因此有归一化的作用，作用于只选择一个或前几个的情况。

Softmax由于使用指数函数，如果其中某一个特征的值很大，就会导致指数爆炸，分母上溢变为inf，导致 最后得到的是0、`inf`或`nan`。这时可以把所有特征都减去这个最大值，即分子分母都除以它，等于exp\(Z\-argmax\(Z\)\)。但有的减去后数值过小，导致下溢为0，指数变为\-inf。因此计算y\_hat时直接带上外面的log求进行化简。

#### Sigmoid（S形的函数）

Logistic function是最经典的Sigmoid函数，其微分形式的方程是生态学上，描述在资源有限的条件下种群增长规律的一个最佳数学模型。其函数值在\[\-1, 1\]之间，常规写法和微分方程如下。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YmFhNDg1MTI2MzJkM2M1MzMwMmQwNzdmZTYxNWU2MDZfODY1NTBjOGEwZjUwZGFmNGVhMTAzOTAzMDEyNTJmZTlfSUQ6NzU2OTkwNTk2OTIxNzA3NzI1Ml8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YWE2OWQ3NjhlOTc0MzU5YTYxOTA0ZDYyZTgyMzBlNDRfZDI5NzEyMzA4Y2QyN2VkN2Y2ZTU3ODI3ZmFjMDgwYTNfSUQ6NzU2OTkwNTk3MDcwMjI1NDA5OV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

当输入接近0时，sigmoid函数接近线性变换。相比Softmax，其概率是独立分布的，表示该标签成立的信心度，适用于二分类或者有多个标签的分类。

#### ReLU

*修正线性单元*（Rectified linear unit，*ReLU*），它实现简单，同时在各种预测任务中表现良好。f\(x\) = max\(0, x\)。ReLU函数的左侧导数为0，右侧导数恒为1。可以避免梯度消失问题。

#### tanh

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=M2FiMTEzNTI5OWI1YzY5YjBjMTZmMTBkZTNhMDE5MzhfMjA5MDc1ZGM3ZjI2NjUyODZkYjVkMGYzNjhiZjUyZWZfSUQ6NzU4MTcyMDA1NTk1NjcwNDQ0NV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)


### 欠拟合和过拟合

*训练误差*（training error）是指， 模型在训练数据集上计算得到的误差。 *泛化误差*（generalization error）是指， 模型应用在同样从原始样本的分布中抽取的无限多数据样本时，模型误差的期望。

如果模型不能降低训练误差，这可能意味着模型过于简单（即表达能力不足）， 无法捕获试图学习的模式。 此外，由于我们的训练和验证误差之间的*泛化误差*很小， 我们有理由相信可以用一个更复杂的模型降低训练误差。 这种现象被称为*欠拟合*（underfitting）。

将模型在训练数据上拟合的比在潜在分布中更接近的现象称为*过拟合*（overfitting）， 即训练误差远小于验证误差。由于不能基于训练误差来估计泛化误差，因此简单地最小化训练误差并不一定意味着泛化误差的减小。

验证集，是在选择一个模型并使用训练集进行训练后，为判断模型是否正确、是否过拟合（估计训练数据的泛化误差）设置的。如果数据稀少，可以使用K折交叉验证。

#### L2正则化

用于对抗过拟合的技术称为*正则化*（regularization），当然收集更多数据也可以缓解，但是当数据已经高质量时，可以把重点放在正则化上。

限制特征的数量是缓解过拟合的一种常用技术。仅仅通过简单的限制特征数量（在多项式回归中体现为限制阶数），可能仍然使模型在过简单和过复杂中徘徊， 我们需要一个更细粒度的工具来调整函数的复杂性，使其达到一个合适的平衡位置。

*权重衰减*（weight decay）是最广泛使用的正则化的技术之一， 它通常也被称为*正则化*。 

对于某个过于复杂、过大的权重向量（使用范数衡量），最常用方法是将其范数作为惩罚项加到最小化损失的问题中。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=M2VmODc1NDBkZmRlZTY2ZDVkZGY3OGM4MjZiOGU4ZDlfYTkxOWJkMWExNmNkMzdkNmRkODg3YWU5MTQwZjI4M2JfSUQ6NzU4MTg4NjY2MjU1NzM3MTMzN18xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

#### Dropout正则化




### 线性回归

使用**线性回归**并采用**最小二乘法（Least Squares Method）作为优化目标（即最小化均方误差 MSE），这在数学上等价于**假设**模型误差服从正态分布**下的**最大似然估计**。

具体来说，我们假设所有观测数据\(x\_1, x\_2, \.\.\., x\_n\)中的x\_i，都是由一个共同的、固定的真实值 b 加上一个随机的测量误差 epsilon\_i 产生的。进一步假设这个测量误差 epsilon\_i 是**独立同分布 \(i\.i\.d\.\)** 的，并且服从均值为 0，方差为 sigma^2 的正态分布。由x = b \+ epsilon\_i 得知，x服从均值为 b，方差为 sigma^2 正态分布的。我们的目标是找到参数 b 的最优估计值，即使用最大似然估计MLE：

已知正态分布的概率密度函数f\(x\_i \| b, sigma^2\)，由于观测数据是iid的，**似然函数** L\(b, sigma^2 \| x\)$ 是它们的概率密度乘积。为了简化计算，我们通常最大化似然函数的**对数：**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTE3OThjOTE3YWQzYzA4YjNkMDUwODg5YTIxYzhjYzJfYzMyODAyMzI2NGYwOTYxZGE3ZTUxMTkzMzQ3MzQwMWJfSUQ6NzU4MTAxNDEyNjg5NDQ4NDQyNF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

最后发现等价于最小化平方误差。

使用平方误差的线性回归优化问题使用向量方式写成\(Xw\-y\)t\(Xw\-y\)，需要注意规范性，求解得到解析解设计XtX的逆矩阵，计算的时间复杂度为O\(n^3\)\.

对于线性回归，每个输入都与每个输出相连， 我们将这种变换称为*全连接层*（fully\-connected layer）或称为*稠密层*（dense layer）。


### 多层感知机

MLP，也称作[前馈神经网络](https://zhida.zhihu.com/search?content_id=224470829&content_type=Article&match_order=1&q=%E5%89%8D%E9%A6%88%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C&zhida_source=entity)FNN，通过多层非线性变换对输入数据进行高级别的抽象和分类。

```Python
for epoch in range(num_epochs):
    for x, y_true in zip(x_train, y_train):
        # 前向传播
        hidden_layer = np.maximum(0, np.dot(x, self.weights1) + self.bias1)  # ReLU激活函数
        y_pred = np.dot(hidden_layer, self.weights2) + self.bias2

        # 计算损失和梯度，使用均方误差作为损失函数(Mean Squared Error,MSE)
        # 对于每一个样本，模型预测出来的输出与实际输出之间的差异会被平方，
        # 然后对所有样本的平方差进行求和并除以样本数，即可得到MSE作为模型的损失函数。
        loss = np.square(y_true - y_pred).sum()

        # 下面复杂的方法用来实现反向传播
        # 计算损失函数关于预测输出的导数
        d_loss_pred = -2.0 * (y_true - y_pred)
        # 计算输出层的梯度，
        d_weights2 = np.dot(hidden_layer.reshape(-1, 1), d_loss_pred.reshape(1, -1))
        # 计算输出层偏置的梯度，其值等于输出误差
        d_bias2 = d_loss_pred
        # 计算隐藏层误差，其中 self.weights2.T 代表输出层权重的转置，
        # 计算得到的结果是一个行向量，代表每个隐藏层节点的误差。
        d_hidden = np.dot(d_loss_pred, self.weights2.T)
        # 将隐藏层误差中小于等于 0 的部分置为 0，相当于计算 ReLU 激活函数的导数，
        # 这是因为 ReLU 函数在小于等于 0 的部分导数为 0
        d_hidden[hidden_layer <= 0] = 0  # ReLU激活函数的导数
        # 计算隐藏层权重的梯度，
        # 其中 x.reshape(-1, 1) 代表将输入变为列向量，
        # d_hidden.reshape(1, -1) 代表将隐藏层误差变为行向量，
        # 两者的点积得到的是一个矩阵，
        # 这个矩阵的行表示输入的维度（也就是输入节点的个数），
        # 列表示输出的维度（也就是隐藏层节点的个数），表示每个输入和每个隐藏层节点的权重梯度。
        d_weights1 = np.dot(x.reshape(-1, 1), d_hidden.reshape(1, -1))
        # 计算隐藏层偏置的梯度，其值等于隐藏层误差。
        d_bias1 = d_hidden

        # 更新权重和偏置
        self.weights2 -= learning_rate * d_weights2
        self.bias2 -= learning_rate * d_bias2
        self.weights1 -= learning_rate * d_weights1
        self.bias1 -= learning_rate * d_bias1
```
