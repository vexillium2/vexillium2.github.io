# 人工智能学习笔记

> LLM与Agent的区别: Agent=LLM\+Tools
> 
> 

https://scnajei2ds6y\.feishu\.cn/wiki/XdeBwWZi7iSxMJkXh6qcCmPWnqZ

## 数学知识

### 高数

#### 求导

判别凸函数，定义上指f\(\(x1\+x2\)/2\) \<= \(f\(x1\)\+f\(x2\)\)/2，求二阶导大于0可以判断为严格凸函数。

**链式法则**是微积分中用于计算复合函数导数的方法，在反向传播中往往有很多复合函数，可以用于求导。

#### 梯度

在深度学习中，由于源数据都比较大，所以通常需要用到批处理。如利用批量来计算梯度的随机梯度法（SGD）就是一个典型应用。深度学习的计算一般比较复杂，并且数据量一般比较大，如果一次处理整个数据，较大概率会出现资源瓶颈。为了更有效地计算，一般将整个数据集分批次处理。过小也无法利用发挥平行处理的优势。因此实际中往往使用mini\-batch批量处理。

梯度是多元函数对各个变量的**偏导数**组成的向量。它指向函数值**增长最快**的方向。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OWIwYzgyY2NkMGZiYTg4ZDgzMTcyNTdjYjcwZDkyYmZfYWNhMTg4YjhlMmExNDU1ZDVmM2E0OTBmNGMyZTc1OGZfSUQ6NzU4MTA0MDAxNTc2NjI5MzcyMl8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

小批量随机梯度下降SGD，是从数据集中随机抽取的一个小批量，然后根据参数计算损失的梯度，再朝着减少损失的方向更新我们的参数。



### 概率论

均匀分布

#### 正态分布

若随机变量具有均值mu和方差（标准差sigma），其正态分布概率密度函数如下：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTcyOWE4ZGMzMDQ4NzRkNTk2MmE3NmM1YjlhOTY4NmJfMTE5MWIyMjNlYjAyNTIwYjg0NDQ1NzQyNDYxY2FmMGJfSUQ6NzU4MTAwNzE5NDE2NzA1MzUyNV8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

z表格也叫标准正态分布表

如果说概率是已知参数计算数据出现的可能性，似然 \(Likelihood\) 就是已知数据估计模型参数的一个函数。最大似然估计（Maximum Likelihood Estimation, MLE），就是找到那个能使已观测数据出现概率最大化的参数 theta。

期望

方差与标准差

标准误差SE等于样本标准差除以样本大小n的开方

协方差

#### 贝叶斯公式与全概率公式

#### 大数定理



#### 中心极限定理

https://www\.zhihu\.com/question/22913867/answer/250046834

样本平均值约等于总体平均值

#### 置信度与置信区间

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDA3NzY5YzEwN2I1ZGI5MGYwYmM3N2I3YTQxYWRlZjNfZjlkY2FkNjk2MjY1NjI4OTk2YzRiODdhYTJjOWI1NjZfSUQ6NzU3NzMyNTU1MjY2ODc0MDgyOV8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

#### 累积分布函数和概率密度函数

对于离散变量，概率分布是所有可能取值与对应概率。概率分布函数，又叫累积分布函数（CDF），定义为：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MWJiMjY4Y2I1NzQ2ZGE3MmMwODY2MWVhNmNmOTIyMDNfNWUyZTIxZjIzZDgyNmEyNDEzNTg2MGZlNzY1YmM1MjlfSUQ6NzU4MjIwNDEzNTExNjMxMTQ4Ml8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

对于连续型变量，概率密度函数（PDF）值即为概率在该点的变化率，而非该点的概率。概率密度函数与分布函数的关系为：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZjdiMjk5ZGJmZDRjZmI2MGM1NjVkNTM5NDg0MzhiNDBfN2ZhMDI2YTQ4MDBiOTNiOWUyMTYxMjBlNzE5MjdmYTdfSUQ6NzU4MjIwNDcyOTAyODEwMzM2OF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

#### 联合分布函数，边缘分布

#### 卷积

卷积是两个函数的运算方式。从形式上讲，就是先对g函数进行翻转，相当于在数轴上把g函数从右边翻转到左边去，然后再把g函数平移到n，在这个位置上对两个函数的对应点相乘，然后相加。这就是“卷”的过程。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTJhOWNjNWQwMDkxMTYwZTVhNDEzOTQzNmY0YjRiY2FfOTM1Y2YwZmM0YWVmZGJkMWYzNjJmMzFkNzkwZGNhNTFfSUQ6NzU4MjE0MjQ1MzgwNjIwNTg4NF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

实际推导时主要是在推导两个随机变量的和的时候推导出来的。假设X和Y是取整数值的离散型随机变量，具有联合频率函数 p\(X,Y\)，令Z=X\+Y。为了计算Z的频率函数，注意到Y=Z\-X。那么有式子一。如果 X 和 Y 独立, 使得 p\(c,y\) = px\(c\)py\(y\)，则有式子二：



![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MGNjYmM3MGY5M2FhYmY3Y2UzM2EyOTE2OGQxYzkyNzRfZWQ0YjM2MzNlN2Q5YmJjOGE4Y2Y4ZWZkNzUwNTA2NDhfSUQ6NzU4MjE0MzkwMzYzODgzNDE0MV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Yjc2YTgzZTY5NzMwMjcxOTNhNmViODI0MzRiMDEyNThfY2E4MTA0NzVkZTM1ZTNmMDcxZTNjYjAwMmVjZmQxZmRfSUQ6NzU4MjE0NDIzMjgyOTQ3MTk2Ml8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

对于连续性变量

### 线性代数

#### 矩阵与行变换

矩阵是一个由数字（或函数、符号等）排列成的矩形阵列，他可以表示数据也可以表示线性变换。

行变换取自初等行变换，对于矩阵乘法A×B=C，C的维度等于A的行、B的列，所以左乘是行变换、

右乘是列变换。

在数学和物理领域，一般都用左乘，也就是行变换，因为B很多时候是个列向量。但是在机器学习中一般把向量以行向量书写，即X×W，因为一般将样本数（Batch Size）放在最外面，同时代码表示的时候写成X的dot函数，结果也是N×d\_out比较合适。

#### 线性变换

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Y2E5YWVkZjYyZDQwYzc5M2YxNjM0YTA0OWFhYThhNmZfZDljNmJlZWQ3MDk5YmUxMjVmOWQyZDliYWY4YjY0OTlfSUQ6NzU4MjI1MDIyMjc1Mjg3NzUyMV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)



![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=M2JkNDMyYTBjMDE4NjUxZTVlMWY1YzYyZDdiM2ZmZjJfYmQyYTEzZDFhNGZlZTlkNWVkYzMzZDc5YjhkN2ZmZDJfSUQ6NzU4MjI0OTkwNzMxOTM2MDczNl8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

#### 向量化

文本嵌入模型\(基于Transformer\)通过Token Embedding \-\> 多层上下文编码（自注意力）复杂计算，将任意长度（在模型限制内）的文本块中的语义信息蒸馏、压缩、聚合成一个固定维度的稠密向量。不再是简单的词向量，而是包含了丰富上下文信息的“句向量”或“文本块向量”

稠密向量：语义

稀疏向量：关键字

这类模型称为嵌入模型/向量模型，是神经网络模型。

BGE\-M3（BAAI General Embedding）使用类似BERT的tokenizer（基于WordPiece），理论最大长度512 tokens。BGE\-M3采用联合优化策略，同时支持三种向量表示方式：

- 稠密向量：适用于语义相似度、向量检索任务

- 稀疏向量：适用于关键词匹配、可解释性强的检索任务（类似SPLADE）

- 多向量：支持细粒度token级交互，提升长文本匹配效果

计算相似度，可以使用欧氏距离/余弦相似度来评估。

存储向量与对应文本块到向量数据库中。

Top\-K 策略

#### 范数与正则化

一范数即曼哈顿距离

二范数即欧几里得

无限范数



### 评估指标

**混淆矩阵**：真假表示预测正确还是错误，并非实际为真假。真负例是正确预测的负例，假负例是错误预测为负例实际为正例。

**准确率Accuracy**是指所有正确分类（无论是正类还是负类）所占的比例，使用\(真正率TP\+真负率TN\)/总样本all，但对于样本类别严重不平衡的情况，如样本中负样本占了99%就可以无脑预测负了，所以针对类别不平衡要使用F1等指标。

**精确率Precision**指所有正类别分类中实际为正类别的比例，使用真正例TP/\(无论真假\)预测为正的例TP\+TN；如果实际正例的数量非常少（例如总共只有 1\-2 个），那么精确率作为一种指标的意义和实用性就会降低。

**召回率Recall**，又叫真正例率，表示正的中有多少预测准的，使用真正率TP/\(无论正负，真正\+假阴\)实际为正的例TP\+FN；适合宁可错不希望漏。相对的，还有假正例率。

假正例越少，精确率越高；假负例越少，召回率越高。因此，精确率和召回率通常呈反比关系，即提高其中一个指标会降低另一个指标。

**F1分数**，它们的调和平均数，权重各为1；如果倾向于召回率可以改成F1\.5、F2分数

### 最大似然估计

最大似然估计（Maximum Likelihood Estimation, MLE）是机器学习中最核心的指导原则之一。

似然函数是机器学习和统计学中用来评估模型性能的核心公式，其中theta表示模型中所有可以学习和调整的参数，包括权重w和偏置b；D代表完整数据集，似然函数就等于在给定参数下观察到数据的概率；

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDE2MGQwMjkwMzBkZGQ3OGE3N2Y3NzVjYzYwM2RmMWRfNzVlNjRkNGU0Zjc3Y2I1YmUzNWExMmZiYWNjYjBmZjhfSUQ6NzU2OTkwNjI0MjQwMzEyMzIwM18xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

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

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZWFlNDQ2ZmNjN2U0MDY4M2VmMDE2NWQ4YTJjODE5OWVfN2Q4NzRmNWU2OWM3NmY3MGNiMTY1OTg0NDdhZDM5MWNfSUQ6NzU2OTkwNTk3Mjc4MzQxNTMyNF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

A\. 对于单标签分类任务，对单个样本而言，假设真实分布为Y，网络输出的分布为Y尖，总类别数为n，交叉熵损失函数就是：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YWM4OGY2YmZlY2E5YzliMDcxOGE5NjVhNWUwMTZjOTVfMmE5YThjNmQ4NDU0YmY1ODIyZGY2NjE1NWIyZmQ3MmRfSUQ6NzU2OTkwNTk3MTE5MjY3NjM1NF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

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

### 优化器

#### SGD随机梯度下降

#### Adam

#### RMSprop

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



### 数值稳定与初始化

#### 梯度消失和爆炸



### 任务与数据集

回归表示预测一组连续值；分类是预测离散值；聚类是

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

## 编程知识

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

## 机器学习

机器学习的本质就是用统计和概率模型来**描述数据背后的规律**，并基于此进行预测；本质的另外一种表达是**最小化信息差异**（最小化交叉熵），这与其目标函数常常为MLE有关。

机器学习的核心原则：最大似然估计MLE、经验风险最小化ERM、结构风险最小化SRM

### 有监督学习

根据大量的有标注X、Y数据推算出f函数

### 无监督学习

过拟合

数据量过少

欠拟合



### 自然语言处理

> 使用《Speech and Language Processing》学习
> 
> 

#### 文本规范化

如何描述文本模式？最基础的是正则表达式regex，之后是文本规范化，包括tokenization、lemmatization（lemma的意思是词素）、POS tagging词性标注

#### 分词 subword \& tokenizer

此处只介绍新subword方法，即BERT时代之后开始运用的相关分词技术，包含BPE与WordPiece算法，新算法相比老算法能够平衡词与字符之间的颗粒度问题，更好理解部分词的变形规律，有效解决OOV问题、

##### BPE算法

1. 使用非常大的语料库

2. 

##### WordPiece算法

https://huggingface\.co/learn/llm\-course/zh\-CN/chapter6/6

spaCy 英文分词器

HanLP 中文分词器

#### 序列标注

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDVkOWQ3NTgwNTM5MTMzNTE1YTk0MmE2ZGFhNzAyY2JfNmYzN2UyNjg3NWE5MjhjYWJlNDIwNzI2YmZkY2I0YWFfSUQ6NzU3NzMyMTA4MzE5MDE4NDg5MF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

实体识别三种常见的序列标注方法如下：

1. BIO：标识实体的开始，中间部分和非实体部分

2. BMES：增加S单个实体情况的标注

3. BIOSE：增加E实体的结束标识

#### 词性标注

part\-of\-speech

向量化



#### 实体链接

实体链接Entity Linking要解决实体命名的多变性和歧义性。多变性是指同义词必须指向同一个id、同一个实体节点；而多义性指同一个词在不同语境指代不同事物、不同id。

使用词典

#### 实体消岐

人名是常见需要解决实体消岐问题的。有手动匹配、注册平台（ORCID）、自动化方法

#### **LSTM\-CRF**（长短期记忆网络与条件随机场）



#### Transformer

*单向的Transformer一般被称为Transformer decoder，其每一个token（符号）只会attend到目前往左的token，也称为单向/因果注意力。而双向的Transformer则被称为Transformer encoder，其每一个token会attend到所有的token，信息是全局、双向的。*



Attention矩阵A=softmax\(QKt/根号dk\)，由于Q和K的纬度dk通常远小于序列长度n，这导致A是个低秩矩阵，表达能力收到了dk的严重限制；而经过Casual Mask处理后的Attention矩阵是下三角矩阵，只要对角线不为零就是满秩的。因此，Decoder\-only的单向注意力在理论上有更强的表达能力。

#### BERT

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

## 深度学习

利用深度

### 神经网络NN

多类别分类使用one\-hot，输出层只有一个神经元

多标签分类输出层有N个神经元，对应N个标签，每个神经元输出一个原始分数logit

反向传播算法

链式法则

全连接层、损失层、激活层、卷积层、循环层

#### 层

对于文本数据，通常是对应词表的one\-hot编码，因此高维而稀疏。图像/语音连续且存在大量相关信息，需要压缩和提炼。

核心层有卷积层、循环层、全连接层。卷积层

功能性层包括激活层和损失层。

|**层次/功能**|**典型层/激活函数**|**数据形态变化（输入 → 输出）**|**任务或目的**|
|---|---|---|---|
|**基础特征提取**|**卷积层 \(Convolutional Layer\)**|高度冗余/结构化（如像素矩阵） \-\> **高维特征图/张量**（局部特征）|提取图像、视频、音频等数据中的**局部空间模式**和**层级特征**。|
|**序列特征提取**|**循环层 \(Recurrent Layer\)** \(RNN, LSTM, GRU\)|序列数据（如文本、时间序列） $\\to$ **高维隐状态向量/序列**|捕捉序列数据中的**时间依赖性**和**上下文信息**。|
|**特征映射与组合**|**全连接层 \(Fully Connected Layer\)**|任何向量 $\\to$ 任何向量|实现特征的**非线性组合**和**维度转换**，是实现分类、回归等最终决策的关键。|
|**非线性能力**|**激活层 \(Activation Layer\)** \(ReLU, Sigmoid, Tanh\)|向量 $\\to$ 向量 \(元素级操作\)|引入**非线性**，使网络能够学习和拟合更复杂的函数关系。|
|**输出与概率**|**输出层** \(Softmax, Sigmoid\)|Logits $\\to$ **低维概率向量** \($\\sum p\_i=1$\)|将原始分数转化为**概率分布**，用于多分类决策。|
|**目标学习**|损失层 \(Loss Function\)|预测概率 $\to$ 单一数值（损失值）|**衡量预测与真实标签的差异**，为模型训练提供优化的方向和目标。|

nn\.Sequential

#### 重要概念

Epoch

### CNN卷积神经网络

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

### RNN

序列数据，如语音数据、翻译的语句等文档，其中每句话的长度是不一样的，且一句话的前后是有关系的，更适合用RNN处理。





词嵌入技术（如 [GloVe](https://www.aclweb.org/anthology/D14-1162.pdf) 和 [Word2vec](https://arxiv.org/pdf/1301.3781.pdf)）在没有情境的情况下运行，生成序列中各个词语的表示。例如，无论是指运动装备还是夜行动物,“bat”一词都会以同样的方式表示。[ELMo](https://arxiv.org/abs/1802.05365) 通过双向长短期记忆模型 \(LSTM\)，对句中的每个词语引入了基于句中其他词语的深度情景化表示。但 ELMo 与 BERT 不同，它单独考虑从左到右和从右到左的路径，而不是将其视为整个情境的单一统一视图。



## PLM

### 注意力机制

在描述注意力与视觉的双组件框架中，受试者基于非自主性提示和自主性提示有选择地引导注意力的焦点。非自主性提示是基于环境中物体的突出性和易见性，而受到认知和意识的控制被归为自主性提示。

注意力机制试图用一个“问题”去“搜索”和“提取”最相关的“信息”。假设原始输入特征为 X，通过三个独立的特征矩阵W\_Q、K、V投影到三个不同空间，即查询（Query）、K（键）和 V（值）。给定任何查询，注意力机制通过注意力汇聚引导至感官输入（中间特征）。

具体来说，计算Q和K之间的相似度（使用点积）得到注意力分数矩阵E，再归一化转为注意力权重A，最后和V进行加权求和，得到注意力输出Z。KV矩阵存在的意义在于将检索机制和内容提取机制解耦，从而赋予注意力机制强大的动态选择和表达能力。





## LLM\-AI应用

> 应用可看https://zhuanlan\.zhihu\.com/p/14897233513
> 
> 

大模型的本质是空间映射（Mapping Between Spaces）与空间优化（Optimization in Latent Space）。大模型的代码，本质是把输入空间映射到输出空间的函数近似器（function approximator）；而大模型不是直接编程实现规则，而是通过大规模训练过程，在参数空间（weights）中搜索最优解，使得映射函数拟合输入输出的真实分布。



参数量：构成神经网络模型的所有可学习权重和偏置的总和



缺点：幻觉、信息滞后、不透明、token有限









### 接入AI选择



||本地部署Ollama等|Spring AI|Llama|Langchain|
|---|---|---|---|---|
||||||



### Prompt Engineering

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YmFiMmFmNGU4ZDM2Yjc0NTczNWM5NmU3YTAzOWFkMjNfZTc4NGNmYTFiYjZhZDkwNjVhZTFkOTc5NTc3NzdhODJfSUQ6NzU1Mjg4MTMyMzkzODUxMjg5OF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)



#### **思维链CoT**

显示使用“请逐步思考”; 给example

**自我一致性**

https://arxiv\.org/pdf/2203\.11171

1. 构造CoT示例数据

2. 利用大模型生成多条不同的推理路径

3. 完成这一过程后，使用多数投票的方法选出最一致的答案

使用场景：

1. 生成多个推理路径或答案，选择最一致或最频繁出现的结果，减少随机性

2. 适用于高可靠性要求任务：如科学计算、法律判断、医疗诊断。

3. 可以与思维链结合：生成多条CoT路径，选择最优解

4. 缺点：响应时间增加，计算成本更高。

使用方法

1. 提示词声明执行5次

2. 自己去整理

#### **思维树**

ToT是一种扩展版CoT方法，旨在解决复杂、多路径的决策问题，尤其是那些需要探索多种可能性、权衡不同选项、需要进行全局优化的任务。

思维树的每一步都会采样多个分支，通过判断每个分支的任务完成度，通过搜索算法，找到正确路径。判断叶子节点的任务完成的正确性，最终得到综合选择最优解。

使用场景：

1. 把问题思路设计为树结构，探索多种推理路径，最终综合选择最优解。

2. 适用于高度复杂的决策问题，数学证明、编程调试、多路径决策

3. 缺点：实现复杂，计算开销极大，对模型能力要求高。

#### ReAct

思考、

#### Plan and Execute



#### Self\-Ask

创意写作

#### Thinking and Self\-Reflection

批判：系统评估当前决策和行为产出，与目标比较，识别其中的问题或不足之处。

修正：基于批判识别的问题，调整决策或行为策略，以期提高输出质量。

与ReAct的不同点在于：1\.反思的出发点可以在决策也可以在行动之后，

#### Reflexion 动态记忆与反思

#### CoH 后见之明炼



### LangChain

#### langchain core

#### 模型包装器

**model**分为嵌入和聊天模型，任何符合OpenAI规范的服务商提供模型可以用ChatOpenAI加入baseurl与apikey参数获得model。大部分的提供商在langchain community都有注册对应模型的接口，可以查阅使用。调用可以用stream、batch、invoke，参数有input、config、history。get\_prompts查看结构图

**prompt**构建方式可以从PromptTemplate\.from\_template或构造方法指定参数template、input变量。ChatPromptTemplate\.from\_messages内列表可以有System、Human、AI三种Template嵌套，FewShotPromptTemplate用于少样本。注入参数可以使用实例\.format\(var=xxx\)或者partial\(\)，最后在invoke阶段再传入对应的input也可以。MessagesPlaceHolder

**输出解析器**有CommaSeparatedListOutputParser、DatetimeOutputParser、JsonOutputParser

**LCEL**的构建根本依赖Runnable组件，重写了\_\_or\_\_方法让组件连接。组件包含RunnableLambda、Parallel、PassThrough（默认保留，链式assign用于在同一个字典中额外附加）、Sequence。函数也可以使用@chain声明

**记忆**使用ChatMessageHistory\(\)实例存储ai和user的信息，还有RedisChatMessageHistory使用sesion\_id，通过invoke\(history\)自动维护history。RunnableWithMessageHistory\(chain, get\_session\_history\(\)\)**、**、

**数据连接**包括⼏个关键模块：⽂档加载器、⽂档切分、⽂本嵌⼊、向量存储、检索器等等。

- **加载器**实例方法load可以加载简单的⽂本⽂件、Word⽂档（Docx2txtLoader）、Excel表格、Pdf⽂件。

- **切分器**的实例调用方法进行切分，CharacterTextSplitter基于字符\(默认为"\\n\\n"\)进⾏切割，并通过字符数量来测量⽂本块的⼤⼩，使⽤chunk\_size可设置⽂本块的⼤⼩，chunk\_overlap设置⽂本块最⼤重叠。RecursiveCharacterTextSplitter可以根据自然语言或代码进行切分。

- 文本嵌入使用嵌入模型，记得模型也传入数据库。

**FastAPI**定义app，通过装饰器确定路由，pydantic的BaseModel定义请求体，再使用uvicorn的run运行。FastAPI有Response，请求的返回可以是html。

**调试**使用langchain\.debug=True，可以使用chain\.get\_graph\(\)\.print\_ascii\(\)查看链。LangSmith付费。

**工具**使用，使用Tool\(name, func, desc\)或@Tool声明函数，新模型model\.bind\_tools\(\[回调函数们\]\)的返回中有tool\_calls字段会涉及工具调用。

### Workflow与Agent



workflow是编排任务流程；Agent是根据目标感知环境自主决策选择实现路径，边执行边规划下一步

将任务切分方便测试，兜底关键路径

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZWFhNDg2MjJlYTMzN2VhZjc0Nzg4NGI0OWVhNGM5NjdfZmU5MzYyNjIwNTcyNjZiYjM1NDIzN2UzNzUwYzkwOWRfSUQ6NzU3ODg4MjEwNjIzNjIxMDExNl8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

记忆来自预训练和微调、上下文、外部记忆库。

#### Tool与FunctionCall

Tool的核心是“模型的输出不再只是给人看的自然语言，而是可以触发真实动作的结构化指令”；可以做到如搜索、查数据库、执行代码、发 HTTP 请求。

#### Skill

Skill就是把完成某类任务所需的提示词、工具调用、上下文、执行逻辑打包在一起，形成一个可复用的单元。Skill 和 Tool 的区别在于粒度和封装层次：Tool 是一个具体函数（搜索、计算），Skill 是完成一类任务的完整能力模块，内部可能组合了多个 Tool 和特定的推理策略。

#### MCP\(Model Context Protocol\)

MCP 是 Anthropic 在 2024 年底提出的开放协议，它的出现是为了解决 Tool/Plugin 生态碎片化的根本问题。

它定义了一套标准的 **Client\-Server **通信协议：MCP Server 是提供能力的一方（可以是任何工具、数据库、服务），MCP Client 是使用能力的一方（通常是 AI 应用或 IDE）。两者之间的通信格式、能力声明方式、调用约定全部标准化，所有支持MCP的模型与应用都可以使用，并且Server也可以主动推送状态给Client。

#### MAS多智能体系统

引自https://cognition\.ai/blog/dont\-build\-multi\-agents\#principles\-of\-context\-engineering

多智能体之间要分享，

#### CrewAI

#### AutoGen

AgentChat

### RAG

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NjZjZDNlNjZhZWRiM2Y5OWYzZDU3NDc0MmE3YzM1YWRfZTI3MzUwOGNlMTRlYzZkN2I4Y2FlMTlhZDExNDk3MjRfSUQ6NzU3NzI5NDk5MjMxNDU4Mzk5NF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTZiYTViZTU4MmVmYmFmYWM3ZDhlMDVlMWZjOWVlZTFfOGRlNDBlMzVmYjZhNjM5ZDg3YzUzOGFlOTg0MDBhNTNfSUQ6NzU3NzI5NTAzNzczNDc4NDE5MV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

In RAG frameworks, retrievers search for additional knowledge, skills, and tools based on user\-defined queries or task instructions\. The retrieved content is then refined by an organizer and seamlessly integrated with the original query or instruction, which is further fed into the generator to produce the final answer\. 

RAG是工具技术，出现的原因是需要利用LLM的强大语言理解、泛化能力，但作用背景在小知识领域。它的优点在于1\.可以使用知识库快速跟进；2\.隐私、敏感、私域数据；3\.成本小。RAG的缺点在于难以衡量效果与小模型、微调的差别，因为后者搭建需要成本，大模型生成具有不可控性，需要增加监控、预警、测试。

RAG与微调的区别在于，RAG只需要构建外挂的向量知识库小，能够动态追踪最新的知识，核心在于“检索”。RAG用到prompting，而微调需要自监督学习。

Advanced RAG区别于Naive RAG是多了预检索和后检索。具体而言，它在索引阶段用了滑动窗口方法、细粒度切分和整合元数据的方法。采用Fusion Retrieval、Query Routing，Reranking和

#### 向量数据库



**向量数据库**是专门用于存储、管理和查询向量嵌入的DB，这些向量是高维空间中的数值列表，用于表示文本、图像、音频等非结构化数据。每个数据点都是一个高维浮点数向量（768维/1536维），根据语义相似性（表现为距离或相似性，如余弦相似度）来查找数据，而不是传统的精确匹配。常用于构建



采用近似最相邻ANN算法和索引结构，如HNSW或LSH。这些索引用于优化高维向量空间中的相似性搜索。

向量化模型转化为向量数据，使用语义模型如bge\-m3、text\-embedding\-ada\-002或Sentence\-BERT等）将文档和问题转为高维向量表示，



#### 索引\-Indexing

> Indexing, transforming ram data, segmenting chunks, encoding to vectors\.
> 
> 

这个阶段的目的是搭建数据库为检索做准备，包括预处理、分块、嵌入。

##### 预处理

数据清洗、文档嵌入。将非结构数据转成结构化数据：

- QA对

- 指令\-响应对（few\-shot）

- 结构化文档

- 三元组（实体与关系）

可以使用marker\-pdf将pdf转markdown：

```Bash
marker-single xx.pdf --output_dir ./
```

业界最好用的是docling，它集成了

##### 分块

分块可以用于semantic search、RAG、Agentic workflow。方法有固定切片、滑动窗口切片（重叠）、结构化切片、语义切片。分块需要考虑数据类型（表格）与结构（Json）、embedding模型上限、对user query长度与复杂度的要求、如何使用检索到的块。

**分块粒度**

- 按照字符数切分，通常取决于embedding模型（\(such as 1024 for llama\-text\-embed\-v2, or 8196 for text\-embedding\-3\-small\)）这可能是最好的方法，所以在使用其他方法前先验证本方法是否足够。

- 按固定字符数、结合overlapping 滑动窗口

- 按照句子来切分

    - 按句号、空格、换行符

    - NLTK Python 库

    - spaCy 库

    - Langchain递归切分RecursiveCharacterTextSplitter

- Content\-aware内容感知

- 基于文本结构切分

    - PDF切分出标题、文本、表格等

    - HTML

    - Markdown

    - LaTex

**分块结论**

使用递归\+滑动窗口进行分块。

- chunk\_size: 300\~500 tokens（或字符）

- chunk\_overlap: 50\~100 tokens

- separators: \["\\n\\n", "\\n", "\.", ""\]

- length\_functions: tokens

- 摘要索引

- 父子索引

- 假设性问题索引

- 元数据索引

##### 嵌入



#### 检索\-Retrieval

粗排，通常使用双编码器（Bi\-Encoder），一个用于编码用户查询，另一个用于编码所有文档块。通过计算\*\*向量 A\*\* 和所有\*\*向量 B\*\* 之间的\*\*距离\*\*（通常是余弦相似度）来判断相关性。缺点是为了处理海量文档，要求计算速度极快。因此，它无法捕捉到查询和文档之间的\*\*细粒度交互\*\*，例如，它们之间的\*\*词序\*\*、\*\*语法结构\*\*和\*\*交叉引用\*\*。它只关注整体的语义，也就是“大致上讲的是一个事”。

召回。进一步rerank，检索相似的top\-k个文本片段。模型有baai/bge\-reranker\-base【召回准不准、全不全、有可解释性】

重排

- 关键词检索

- 

1. 摘要检索：存入向量知识库的是经过LLM精炼的文本摘要，每个文本摘要会和原文档有一个映射。

2. 子问题检索：不是摘要而是问题

3. 完善问题

4. 句子窗口检索

5. 多路召回

6. 问题分解

#### 缺点

检索的内容并非越多越好，过多导致检索退化，少样本可能有用

检索问题

- 内容查询不到，不在知识库中

- 错过排名靠前的文件

- 不在上下文中，整合增强策略限制

- 未提取，出现在检索结果但没有进入上下文

    - 使用提示压缩技术，减少提示词噪声

- 格式错误，缺少需要的表格等

- 特异性不正确

- 不完整，即使给了上下文

    - 将问题拆分为多个子问题

- 答案太具体或太笼统

    - 提示词改善或提升大模型基座能力

### 微调





Lora和QLoRA（Low\-Rank Adaptation of LLM）训练LoRA层参数，同样高成本



DyPRAG直接根据用户输入得到LoRA的参数，动态整合参数化知识



问题1：微调的几种方式、怎么选择

问题2：高效参数微调、对于一个模型来讲，参数是什么、由什么组成、在Transformer架构中主体参数的分布在哪里

问题3：明白什么是训练、什么是微调、什么是推理。三者之间有什么联系和区别。

问题4：高效参数微调方法鼻祖\-\-\-Adapter Tuning架构分析

问题5：高效参数微调方法Prefix\-Tuning架构分析

问题6：高效参数微调方法先锋\-\-\-LoRA架构分析

问题7:Adapter Tuning与LoRA的比较

问题8:LLama\_Factroy的安装与使用

问题9：微调过程中，我需要调整的超参数，以及各个超参数的含义



#### 类型

##### 全量微调 

优点：

##### PEFT 高效微调

在保证预训练模型大部分参数不变的情况下，通过仅调整少量额外参数来适应新任务。

添加型方法：

适配器

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ODg1NDFlNTAwNWI5ZjM4ZTc0NzY4ZWI5YjUzZjkxNGRfN2VkYzVmNWI4ZGZlNzkxMjZiMDQ0YjFlODU5MGUwNzhfSUQ6NzYxMjYxNzA2ODAwNTIxNTE3Ml8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

## 知识图谱

知识图谱作用包括：推理图、检索器、

一般业务落地的场景包括：数据融合（语义搜索）、可解释性推荐（推荐系统）、风控与挖掘（链网推理）、增强大模型（RAG、Think/Plan on Graph）。

[实体识别与链接](https://zhida.zhihu.com/search?content_id=654994769&content_type=Answer&match_order=1&q=%E5%AE%9E%E4%BD%93%E8%AF%86%E5%88%AB%E4%B8%8E%E9%93%BE%E6%8E%A5&zhida_source=entity)、关系抽取、语义搜索、智能问答系统、[信息检索与推荐](https://zhida.zhihu.com/search?content_id=654994769&content_type=Answer&match_order=1&q=%E4%BF%A1%E6%81%AF%E6%A3%80%E7%B4%A2%E4%B8%8E%E6%8E%A8%E8%8D%90&zhida_source=entity)、[文本理解与生成](https://zhida.zhihu.com/search?content_id=654994769&content_type=Answer&match_order=1&q=%E6%96%87%E6%9C%AC%E7%90%86%E8%A7%A3%E4%B8%8E%E7%94%9F%E6%88%90&zhida_source=entity)，以及[跨语言和跨模态处理](https://zhida.zhihu.com/search?content_id=654994769&content_type=Answer&match_order=1&q=%E8%B7%A8%E8%AF%AD%E8%A8%80%E5%92%8C%E8%B7%A8%E6%A8%A1%E6%80%81%E5%A4%84%E7%90%86&zhida_source=entity)等多个方面。



### 基础知识

KG是由语义层\+数据层共同组合成的，Semantic Layer也被称为Schema

#### 有向标记图

RDF（资源描述框架）本身是W3C制定的面向Web的语义数据标准，核心目标是让机器能够理解数据之间的关系**，**使用三元组表示。RDF 将所有信息都拆解为最简单的“三元组”结构，无论多么复杂的知识，都可以表达为：主 — 谓— 宾**。**RDF使用URI来为每个事物命名，保证唯一性与可链接性。作为一种数据模型，它可以用Turtle、JSON、RDF/XML、N\-Triples来表示，而SPARQL是专门用于查询RDF的语言。~~Schema也包括类、属性、子类等。~~

RDFS（RDF Schema）引入了类和属性的概念，提供了一套基础词汇来抽象地描述RDF，如类：`rdfs: Resource`；属性；定义域、值域。~~属性图是由顶点（节点）、边（关系）、标签、关系和属性组成的有向图。~~



#### OWL与本体论

RDFS 只能做简单的归纳推理。如果你需要描述“两个类必须互斥”或者“某个属性只能有一个值”，那么就需要升级到 **OWL** \(Web Ontology Language\) 了。OWL不仅能定义层次，还能定义逻辑约束。OWL定义属性是传递性的或对称性的，且有基数限制，包含等价、互斥关系和枚举。

**本体**是指对概念、数据和实体之间的类别、属性和关系的表示、命名和定义，简单来说，就是对特定领域之中某套**概念**及其相互之间**关系**的形式化**表达。（representation）**。本体语言定义了一对多、对称关系、自反关系等复杂的语义关系。

### 细分方向

成熟

#### 本体论构建

流程：确定领域和范围\-\>复用现有本体\-\>列出术语清单\-\>定义类与层次结构\-\>定义属性/关系\-\>定义约束与特征

1. 本体需求规格说明

    即从自然语言文本或者能力查询（CQ）生成本体需求

    1. CQ逆向

    2. CQ生成SPARQL，如NeON框架

2. 本体实现

    1. 概念定义

    2. 分类发现

    3. 关系抽取

    4. 编码（将概念模型转化为正式的本体表示语言）

    5. 自然语言转化为OWL公理

    6. 本体匹配

    7. 本体评估

#### 实体提取

序列式标注vs生成式标注

预标注\+置信度投票\+迭代抽取

#### 关系提取

难点：跨句子与隐式关系

CoT——局部推理、自动化
元学习生成最优prompt？？？

#### 实体链接对齐

传统方法靠向量相似度（Embedding Similarity），容易受表面形式误导。现在的方法是构建一个“对齐代理”，它不仅能比较向量，还能读取实体的上下文描述，甚至联网搜索外部知识库（如维基百科、专业数据库）来辅助判断。

#### 

#### 语义搜索

不成熟

#### 增强检索

#### 嵌入

### 科研历程与未来

KG在2014经典可视化大屏、知识中台火热，又在LLM亮相后因构造成本高、沉默成本高、性价比低、专做结构化问答demo而遇冷，LLM/其他模型在阅读理解、处理QA上的强大能力呈现可能替代KG的趋势。2025年KG利用LLM可解释性差、RAG火热等又重现舞台。

知识图谱的意义是为了规范某个领域的知识，通过Schema来统筹结构化知识，然而就如前面所述，落地一个KG有着众多许多工程以外的现实性问题，KG本质处在一个非常被动的状态。为了获得话语权，KG不得不贴合一些前沿技术以求生存，这背后需要KG有更好的结构化抽取能力。

一方面关联起GraphRAG，可以是多模态KG、KG规划、决策的agent；另一方面，是发挥其合成推理数据的作用，主要是决策型面向多跳的领域类型的KG，需要大量训练数据的场合，使用KG从非结构化文本构建图谱或从已有图谱采样筛选构建；最后就是从自身构建角度出发，在原先人工定义本体论\-\>清洗数据\-\>实体抽取\-\>关系抽取\-\>消歧融合的繁琐范式上做轻量化、自动化，这也是我主要研究的方向。

如何提升构建KG的能力？首先，在本体论定义上，LLM的生成能力可以高效替代传统的术语挖掘、打分过滤的传统构建方式，走schema\-induction路线，还可以进一步往动态schema的KG形式走。其次，在各种实体、关系的抽取方面，数据标注成本往往居高不下，这体现在特定领域下数据带有专业壁垒、可利用信息量较少，部分语言概念模糊，可供归一化的参考难找。在这方面，一些较大参数的LLM能够在指令指导下，在不使用微调的情况下借助fewshot等协助完成；此外，也存在一些专门面向信息抽取的微调模型，如oneke，knowlm等。

但是，就抽取、schema这个事情而言，还需要明白的是，知识图谱本身就是一个很大的系统，抽取这个事情，**就一个单一模型而言，其只负责从一个句子或者一个段落中抽取**，但是在实际情况中，还涉及到**跨句子、跨段落、跨篇章、跨语言、跨模态**【表格、公式、图像、视频】等更大的信息抽取范畴，也经常**暴露出抽不全、抽不准这些问题，也就说，知识图谱构建从来都是以整体方案存在的，不是一个模型的事情【这点依旧有很多人忽视这一点】。**

其中，**针对抽不全的方式**，会出现很多策略，比如多抽几次，滑动窗口抽取，先分小再聚合的方式【这个社区中讲过许多】，**对于抽不准的问题，也出来许多校验、标准化、过滤等机制**。因此，可以看到，这个知识图谱在抽取侧的技术方向应该是**不拘泥于大模型的原子化的最小抽取能力**，**而是要提供一个面向文档级的复杂的高效的抽取框架层演进，** 如此这样，知识图谱才能更好的贴近到现有的一些业务，比如**情报分析、合同比对**等等。





针对时效性问题，研究KG在自动更新上的问题。



## 显卡与模型

炼丹侠

A100 80G显存 支持7b、14b模型

Llama 4 Scout 超长上下文模型

最小的微调模型，至少需要一张\>=24GB的显卡（3090/4090）

模型

- GPT\-3\.5

- Llama

- PaLm

## 面试题

[LLM\-RAG\-Agent面试题](https://ccn9l92bv1tg.feishu.cn/wiki/Y5H2whVaaijQfpk2XokcDH4OnMh)

[RAG 技术深度面试题：架构、优化与实践应用](https://ccn9l92bv1tg.feishu.cn/wiki/NH6uwNVvri9S7JknLmBcwrUAnsb?fromScene=spaceOverview)

## 论文







## 产品经理

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MjVhMDg3ZWNmM2MwZjYxZjEzNDNkNWZlYWYyOTlmNjlfMmIwYzhhMGQ0NmE4NWEyNThiMGNiYTk3MDMxODkxODlfSUQ6NzU3NTk1MDY3NDk0OTYwNjYxOV8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YjVmZmM3M2E2MGNiZDA5Y2U3Zjk3YTljMjFmZjIxZGZfZTc1ZGJiMDgxMTUxNTQ1ZDM5ZTk3MTZhZWEyZDBmYjhfSUQ6NzU3NTk1MDY3MzYzMjY0NDMyNF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NjA2ZjRkZGI5MmIyM2MwZGQxNjc3YTEwNzEzOTM4ODJfZWVhMGM5OWJkOGZiOGYwZmZmNGE4M2FhZTQ5MjgwYjlfSUQ6NzU3NTk1MDY3NDI3ODU5OTYzMl8xNzgzMzIzMjIxOjE3ODM0MDk2MjFfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDM4YmMyNDhjODQ2MjA4MzBmNDBkNTU3MDI3ZWZjODJfMDVhZDY3MzkwZjU0MTQ1M2M1NjAwZmIxZWQzNzI1YTlfSUQ6NzU3NTk1MDY3NDkzNzAyMzcwN18xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MWMyZjYxZmM0NTU4YTc0YzIwN2Q5YmRjNWYyODYxNGNfMGQ4NmU0MDc4MjY0ODUyNTBiNDk2YWM3YmM0ZTljNDhfSUQ6NzU3NTk1MDY3MzYzMjY2MDcwOF8xNzgzMzIzMjIwOjE3ODM0MDk2MjBfVjM)

发展趋势

1. 技术突破：更大、更高效、更智能

- 模型规模的进一步扩大

- 模型效率的提升

- 多模态能力的增强

- 可解释性和透明性的提升

2. 应用落地：垂直化与普惠化模型规模的进一步扩大

- 定制化和专用化，行业大模型爆发

- 边缘端部署

- UGC\+AIGC生态融合



面临挑战

1. 安全问题

- 伦理和安全问题

- 数据和模型的治理

- 人机协作和交互的优化

2. 均衡问题

- 资源消耗和环境影响

- 技术普及的不均衡



