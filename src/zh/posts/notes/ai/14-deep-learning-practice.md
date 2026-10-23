---
lang: zh-CH
title: 深度学习实践：从工程骨架到视觉落地
description: 以「把模型从目标做到可用」为主线，整理项目流程、PyTorch 工程骨架、GPU 与训练加速、迁移学习、视觉任务与部署验收
date: 2026-10-12
category:
  - 人工智能
tag:
  - 深度学习
  - 工程实践
---

这份笔记的主线是一句话：**把一个模型从目标做到可用——数据怎么进、算力怎么用、预训练怎么接、任务怎么落、上线前怎么验收。**

它回答的是另一类问题：不是"反向传播怎么推"，而是"一个能复现、能评估、能上线的训练工程长什么样"。前四章搭骨架（流程、代码结构、算力、预训练），后两章落到具体任务与交付（检测/分割、部署与鲁棒性）。

边界：

- **网络结构、训练机制、规模与推理约束**在深度学习笔记；这里不重复推导，只讲怎么用。
- **大模型应用工程**（RAG、Agent、服务化）在 LLM 应用工程笔记；这里只讲视觉与通用训练工程。
- **数据采集、清洗、特征工程**属于数据挖掘笔记；这里只保留"数据在项目流程里的位置"。
- **参数高效微调**（LoRA、Adapter）在 LLM 微调笔记；这里讲全量微调与特征提取。

每个知识块使用固定的块标签——**定义 / 性质 / 推导 / 例 / 注意 / 小结**——按需出现。代码使用 PyTorch 2.x 与当前主流的库，注释里标出形状与关键假设。

[[toc]]

## 一、从目标到评估：机器学习的一般流程

一个项目失败，通常不是模型不够新，而是目标没定义清楚、评估方案有漏洞、或者数据在第 3 步就漏了。这一章给出流程骨架，后面每一章都是其中一段的展开。

### 明确目标：任务形态决定后面所有选择

**定义**

任务形态由**输出结构**决定，而不是由输入决定：

| 输出结构 | 典型任务 | 最后一层 | 损失 | 主指标 |
|---|---|---|---|---|
| 连续值 | 回归、销量预测 | 恒等 | MSE / MAE | MAE、RMSE |
| 互斥类别 | 多分类 | softmax | 交叉熵 | 准确率、F1 |
| 独立标签 | 多标签 | 每个标签 sigmoid | 二元交叉熵 | 每类 F1、mAP |
| 排序 | 检索、推荐 | 打分函数 | pairwise / listwise | NDCG、Recall@K |
| 序列 | 翻译、摘要 | 逐 token softmax | 交叉熵 | BLEU、ROUGE |
| 空间结构 | 检测、分割 | 框/掩码头 | 分类 + 回归 | mAP、mIoU |

**注意**

- **可行性**：目标变量在数据里有没有信号？如果人类专家看同样的特征也判断不了，模型大概率学不到。
- **错误的代价**：漏检与误检、假阳性与假阴性，代价通常不对称。这个不对称要写进指标、阈值与损失，而不是上线后再说。
- **目标的边界**：模型输出是"建议"还是"决策"？前者可以给人复核，后者要有拒答与兜底。

**小结**

目标不是一句话的需求，而是"输出结构 + 错误代价 + 使用方式"三件事。它们共同决定最后一层、损失与指标。

### 数据需求：先问有没有，再问够不够

**性质**

- **可用性**：数据在哪个系统、以什么格式、能不能拿到、更新频率如何。
- **覆盖度**：训练分布是否覆盖部署分布。只在晴天拍的数据，雨天一定掉点。
- **标注成本**：标注一份要多久、一致性怎么保证、由谁仲裁。
- **合法性**：许可、隐私、脱敏。人脸、医疗、儿童数据尤其敏感。

**注意**

- 数据量不是唯一变量。一千张覆盖完整的图，可能胜过一次十万张的随机爬取。
- 标注质量的上限就是模型的上限。标注指南模糊时，先修指南，再谈模型。
- 数据泄漏要在收集阶段就防：同一用户、同一场景、同一事件的样本不能跨训练/测试。

**小结**

数据阶段的核心不是"多"，而是"覆盖部署分布、标注一致、切分干净"。

### 探索与预处理：先看分布，再动模型

**性质**

- **探索**：样本量、缺失率、异常值、类别分布、特征分布、时间趋势。
- **预处理**：缺失填补、异常截断、标准化、编码、去重。
- **切分**：随机切分适用于独立同分布；时间序列按时间切；分组数据按组切。

**注意**

- 标准化统计量只能从训练集计算，再应用到验证/测试。用全量数据算均值和方差，是把测试集信息漏进训练。
- 类别不平衡先看业务：重采样、加权、调整阈值是三件不同的事，不要一起上。
- 可视化不是装饰。类别重叠、双峰分布、时间断点，往往在图上一眼就能看出来。

**小结**

预处理的目标是让"训练分布"与"部署分布"尽量一致，同时不把测试信息带进训练。

### 基线：先跑通一个简单模型

**性质**

基线的作用不是拿高分，而是回答三个问题：

1. 数据管道通不通；
2. 任务的难度大概在哪；
3. 后面的复杂模型有没有真的带来增益。

**注意**

- 基线要简单到能解释：逻辑回归、树模型、最近邻都可以。
- 基线要用与最终模型**相同的切分与指标**，否则比较没有意义。
- 没有基线的深度模型，无法判断提升来自模型还是来自数据。

**小结**

先有一个能跑通、能复现、能解释的基线，再谈复杂模型。基线是后面所有改进的参照系。

### 模型与损失：从任务反推配置

**性质**

选择模型时先看数据形态，再看算力：

- 表格数据：树模型与线性模型通常优于深度网络。
- 图像：卷积或 ViT，数据少时用预训练。
- 文本：预训练编码器或生成模型。
- 序列：循环、卷积或注意力，取决于长度与并行需求。

**注意**

- **没有免费的午餐**：不存在对所有问题都最好的算法。选几个候选，用同一套评估比较。
- 最后一层与损失必须匹配：多分类用 softmax + 交叉熵，多标签用 sigmoid + 二元交叉熵，回归用恒等 + MSE/MAE。
- 损失可以加权。类别不平衡、代价不对称时，加权比换模型更直接。

**小结**

模型选择是"数据形态 × 算力 × 先验"的取舍；损失是目标的数学化，不是默认配置。

### 评估方案：测试集只用一次

**定义**

- **留出法**：训练/验证/测试三分。验证集选超参数，测试集只做最终评估。
- **K 折交叉验证**：数据少时提高估计稳定性；时间序列与分组数据不能随机折。
- **时间切分**：用过去预测未来，最接近线上。
- **分组切分**：同一用户/病人/设备的样本只出现在一侧。

**注意**

- 在测试集上反复调参，测试集就变成了验证集，指标从估计变成拟合目标。
- 指标要与业务对齐：类别不平衡看 F1/PR-AUC，排序看 NDCG，检测看 mAP。
- 报告指标时要写清楚：切分方式、阈值、随机种子、置信区间。

**小结**

评估的可信度来自"测试集不参与任何决策"。一旦参与，再漂亮的数字也不代表泛化。

### 错误分析：下一步做什么，由错误决定

**性质**

错误分析按切片进行：

- 按类别：哪一类错得最多；
- 按难度：小目标、长尾、模糊样本；
- 按来源：训练集缺失、标注错误、分布偏移；
- 按置信度：高置信错误最危险。

**注意**

- 先看 100 个错误样本，通常比再调一轮超参数更有用。
- 错误可能来自数据而不是模型：重复样本、错标、泄漏。
- 把错误类型记成表，下一轮迭代按表分配精力。

**小结**

错误分析把"模型不够好"拆成"哪一类错、为什么错、该改数据还是改模型"。

### 代码：一条可解释的基线

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=0)

# 标准化必须放进 Pipeline：交叉验证时只在训练折上 fit
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring="f1")
print(scores.mean())          # 交叉验证用于选择，不用于最终报告

pipe.fit(X_train, y_train)
print(classification_report(y_test, pipe.predict(X_test)))
```

这段代码里有三个容易被忽略的细节：stratify 保持类别比例，Pipeline 防止标准化泄漏，交叉验证只在训练集上做。三者缺一个，报告的数字就会偏乐观。

## 二、PyTorch 工程骨架：数据、模型与训练循环

能复现的训练脚本有固定的骨架：数据管道、模型定义、训练循环、评估、保存。这一章把这五块拆开，最后拼成一个能跑的 CIFAR-10 例子。

### Dataset 与 DataLoader：把数据变成批次

**定义**

- **Dataset**：实现 __len__ 与 __getitem__，一次返回一个样本。
- **DataLoader**：负责批量化、打乱、并行加载、补齐。
- **collate_fn**：决定一个 batch 怎么拼，变长序列与检测框都要自定义。

**性质（DataLoader 的四个参数）**

- batch_size：影响梯度噪声与显存。
- shuffle：训练集打乱，验证集不打乱。
- num_workers：子进程数，受 CPU 与 IO 限制。
- pin_memory：把 batch 放到锁页内存，配合 GPU 的异步拷贝。

**注意**

- num_workers 不是越大越好。每个 worker 都会复制一份数据集对象，内存与启动开销随之上来。
- 训练集与验证集必须用不同的 transform：增强只用于训练。
- 变长序列要么在 collate 里补齐并返回长度，要么用自定义 batch sampler。

**小结**

数据管道的目标只有一个：**让 GPU 不缺数据**。瓶颈通常在 CPU 的预处理与磁盘 IO，不在模型。

### transforms：增强只发生在训练

**性质**

- 训练变换：随机裁剪、翻转、颜色抖动、混合。
- 验证变换：缩放、中心裁剪、归一化，必须是确定的。
- 归一化的均值方差要与预训练权重一致，否则预训练特征会失真。

**注意**

- 增强的强度是超参数。太弱没有正则效果，太强会让标签不再成立（把数字 6 转成 9）。
- 在验证集上做随机增强，会让每次评估结果不同，无法比较。
- ToTensor 把像素从 0–255 缩到 0–1，归一化再减均值除方差；顺序不能反。

**小结**

训练变换制造多样性，验证变换保证可复现。两者混用是评估不稳定的常见原因。

### nn.Module：模型的组织方式

**定义**

nn.Module 把参数、子模块与前向计算封装在一起：

- __init__ 里注册层与参数；
- forward 定义计算；
- parameters() 递归返回所有需要梯度的参数；
- train() / eval() 切换 BN 与 Dropout 的行为。

**注意**

- 不要在 forward 里创建带参数的层。每次调用都会新建一组参数，优化器看不到它们。
- 自定义层要继承 nn.Module 并调用 super().__init__()，否则参数不会被注册。
- 保存模型用 state_dict()，不要 pickle 整个模型对象。

**小结**

Module 的价值是"参数可以被找到"。优化器、保存、迁移学习、分布式，全都依赖这一点。

### 训练循环：五步的顺序不能换

**推导（一次迭代）**

1. optimizer.zero_grad()：清空上一轮的梯度；
2. logits = model(x)：前向；
3. loss = criterion(logits, y)：损失；
4. loss.backward()：反向，梯度写进参数；
5. optimizer.step()：更新参数。

顺序错了会出现两类 bug：不清零导致梯度累加，先 step 后 backward 导致更新到旧值。

**注意**

- 验证时用 model.eval() 与 torch.no_grad()，前者切 BN/Dropout，后者省显存。
- 指标累计要在 no_grad 里做，且用 .item() 取出标量，避免把计算图带出循环。
- 学习率调度器通常在 optimizer.step() 之后调用。

**小结**

训练循环是骨架，不是一个可以随手改顺序的脚本。五步的顺序对应"清空、前向、损失、反向、更新"。

### 保存、恢复与可复现

**性质**

- 保存：model.state_dict()、optimizer.state_dict()、epoch、最佳指标。
- 恢复：先建同结构模型，再 load_state_dict，再恢复优化器与 epoch。
- 复现：固定 Python、NumPy、PyTorch 的种子；cudnn.deterministic=True 会变慢。

**注意**

- 只保存权重，不保存结构。结构变化后旧权重加载会报错，这是好事。
- 断点续训要保存优化器状态，否则动量与自适应学习率会重置。
- 完全确定性通常做不到（并行归约顺序），能复现到"同量级"就已经够用。

**小结**

保存的是"训练状态"，不只是"模型权重"。可复现是工程底线，不是可选项。

### 代码：CIFAR-10 的完整骨架

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

torch.manual_seed(0)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

mean, std = (0.4914, 0.4822, 0.4465), (0.2470, 0.2435, 0.2616)
train_tf = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize(mean, std),
])
test_tf = transforms.Compose([transforms.ToTensor(), transforms.Normalize(mean, std)])

train_ds = datasets.CIFAR10("data", train=True, download=True, transform=train_tf)
test_ds = datasets.CIFAR10("data", train=False, download=True, transform=test_tf)
train_loader = DataLoader(train_ds, batch_size=128, shuffle=True, num_workers=2)
test_loader = DataLoader(test_ds, batch_size=256, shuffle=False, num_workers=2)

class SmallCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.head = nn.Sequential(nn.Flatten(), nn.Linear(64 * 8 * 8, num_classes))

    def forward(self, x):
        return self.head(self.features(x))

model = SmallCNN().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)

for epoch in range(10):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        loss = F.cross_entropy(model(x), y)
        loss.backward()
        optimizer.step()

    model.eval()
    correct = total = 0
    with torch.no_grad():
        for x, y in test_loader:
            x, y = x.to(device), y.to(device)
            correct += (model(x).argmax(dim=1) == y).sum().item()
            total += y.numel()
    print(epoch, correct / total)

torch.save(model.state_dict(), "cnn.pt")
```

形状链是固定的：(128, 3, 32, 32) 经过两次池化变成 (128, 64, 8, 8)，展平后是 4096 维，接 10 类输出。改动输入尺寸时，这个 4096 要跟着变；用自适应池化可以避免手算。

### 边界：骨架之外的工程问题

**注意**

- 多卡、混合精度、梯度累积不在这个骨架里，它们在下一章。
- 数据加载慢时，先测 IO 与 CPU，再考虑加 worker 或缓存预处理结果。
- 训练日志至少记录：损失、验证指标、学习率、显存、吞吐。没有日志的调参是盲调。

**小结**

骨架解决"能跑、能复现、能看指标"。性能、扩展与部署是后面几章的事。

## 三、GPU 与训练加速：硬件、单卡、多卡

GPU 快不是因为它"更聪明"，而是因为它把矩阵运算拆成几千个并行的小任务。理解这一点，才能理解显存为什么不够、多卡为什么不线性加速。

### GPU 为什么快：算力与带宽是两笔账

**性质**

- GPU 由多个流式多处理器（SM）组成，每个 SM 有一批流处理器与寄存器、共享内存。
- 矩阵乘是"乘加"的密集重复，天然适合并行；CPU 的强项是分支与串行逻辑。
- 显存（HBM）容量大但延迟高；共享内存与寄存器快但小。优化的核心是**提高数据复用、减少搬运**。

**注意**

- 算力（FLOPS）与带宽（GB/s）要分开看。大矩阵乘受算力限制，逐元素操作与归一化受带宽限制。
- 小 batch 时 GPU 利用率低，因为每次计算的数据量撑不满并行单元。
- 显存带宽是推理解码的主要瓶颈；训练则同时受算力与显存容量限制。

**小结**

GPU 的收益来自并行与数据复用。判断一个操作快不快，先问它受算力还是带宽限制。

### 单卡：设备管理与异步拷贝

**性质**

- 用 torch.device 统一管理设备，模型与数据必须在同一设备上。
- pin_memory=True 把 batch 放进锁页内存，配合 non_blocking=True 让拷贝与计算重叠。
- 显存分配由缓存分配器管理，nvidia-smi 看到的占用不等于实际使用量。

**注意**

- 张量与模型不在同一设备会直接报错，错误信息通常很清楚：expected all tensors to be on the same device。
- 不要在训练循环里频繁创建大张量；缓存分配器会碎片化。
- 用 torch.cuda.memory_allocated 与 max_memory_allocated 看真实占用。

**小结**

单卡优化的第一步不是换模型，而是让数据搬运与计算重叠、把显存账算清楚。

### 显存的四项账：参数、梯度、优化器状态、激活

**推导**

训练时显存大致由四部分组成：

- 参数：参数量 × 每个参数的字节数；
- 梯度：与参数同尺寸；
- 优化器状态：AdamW 存一阶矩与二阶矩，各一份 fp32；
- 激活：前向保存的中间结果，随 batch 与序列长度增长。

以 70 亿参数、fp16 参数与梯度、AdamW 为例：

$$\text{参数} + \text{梯度} = 2 \times 7\text{B} \times 2\text{B} \approx 26\text{ GiB}$$

$$\text{优化器状态} = 2 \times 7\text{B} \times 4\text{B} \approx 52\text{ GiB}$$

合计约 78 GiB，还没算激活。这就是为什么 7B 模型至少需要多张 80GB 卡，或者用 ZeRO/FSDP 切分状态。

**注意**

- 混合精度不减少优化器状态的字节数（通常仍是 fp32）。
- 激活可以用梯度检查点换显存，代价是重算，训练变慢。
- batch 翻倍，激活大致翻倍；参数与优化器状态不变。

**小结**

先算清四项账，再决定是减 batch、换精度、上检查点，还是切分到多卡。

### 多卡：DataParallel 为什么被淘汰

**性质**

- DataParallel 是单进程多线程：每个 batch 切到各卡，前向并行，梯度汇总回主卡。它受 Python GIL 限制，主卡负载与显存都不均衡。
- DistributedDataParallel（DDP）是每卡一个进程：各自前向反向，反向时用 all-reduce 同步梯度。没有 GIL 问题，扩展性更好。
- 启动方式：torchrun --nproc_per_node=N train.py，每个进程从环境变量取 LOCAL_RANK。

**注意**

- DDP 需要 DistributedSampler，保证每张卡看到不同的数据；否则每张卡都在同一批数据上训练。
- 只有参与前向的参数才会同步；未使用参数会报错，需要设置 find_unused_parameters 或修模型。
- 多卡不会线性加速：通信、数据加载、同步点都会摊薄收益。卡越多，单卡效率越低。

**小结**

多卡的正确姿势是 DDP + torchrun + DistributedSampler。DataParallel 只适合"快速试一下"，不适合生产。

### 混合精度：fp16 与 bf16 的取舍

**定义**

- fp16：16 位浮点，尾数多、指数少，精度高但范围小，梯度容易下溢。
- bf16：16 位浮点，指数与 fp32 相同，范围大、精度低，通常不需要 loss scaling。

**性质**

- autocast 自动把矩阵乘、卷积等算子转成低精度，其余算子保持 fp32。
- fp16 配 GradScaler：放大 loss 防止梯度下溢，更新前再缩回。
- bf16 通常不需要 scaler，但需要硬件支持（Ampere 及以后）。

**注意**

- 混合精度主要省显存与带宽，算力收益取决于硬件是否有 Tensor Core。
- 数值不稳定时先换 bf16，再考虑关掉 autocast 的某些算子。
- 量化（推理）与混合精度（训练）是两件事，不要混为一谈。

**小结**

fp16 精度高但范围小，bf16 范围大但精度低。选择取决于硬件与数值稳定性，不是"越低越好"。

### 梯度累积与梯度检查点：用时间换显存

**性质**

- **梯度累积**：多个小 batch 的梯度累加后再 step，等效于大 batch，但显存只按小 batch 算。
- **梯度检查点**：前向只保存部分激活，反向时重算，显存换时间。

**注意**

- 梯度累积时，损失要除以累积步数，否则等效学习率被放大。
- 累积期间不要 zero_grad，step 之后再清。
- 检查点会让训练慢 20%–30%，只在显存不够时用。

**小结**

显存不够时，先减 batch 或换 bf16，再考虑累积与检查点；后两者都有代价。

### 代码：DDP、AMP 与显存估算

```python
import os
import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, DistributedSampler

dist.init_process_group(backend="nccl")
local_rank = int(os.environ["LOCAL_RANK"])
torch.cuda.set_device(local_rank)

model = SmallCNN().to(local_rank)          # 沿用上一章的模型
model = DDP(model, device_ids=[local_rank])

sampler = DistributedSampler(train_ds, shuffle=True)
train_loader = DataLoader(train_ds, batch_size=64, sampler=sampler, num_workers=4)

# 之后照常 zero_grad / backward / step；DDP 在 backward 里做梯度 all-reduce
# 启动：torchrun --nproc_per_node=4 train.py
```

```python
scaler = torch.amp.GradScaler("cuda")      # fp16 需要；bf16 可以去掉

for x, y in train_loader:
    x, y = x.to(local_rank), y.to(local_rank)
    optimizer.zero_grad()
    with torch.autocast(device_type="cuda", dtype=torch.float16):
        loss = F.cross_entropy(model(x), y)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

```python
def train_memory_gib(n_params, bytes_per=2, optimizer="adamw"):
    param = n_params * bytes_per
    grad = n_params * bytes_per
    state = 2 * n_params * 4 if optimizer == "adamw" else 0
    return (param + grad + state) / 1024 ** 3

print(train_memory_gib(7e9))   # 约 78 GiB，不含激活
```

DDP 的收益在反向的 all-reduce；如果模型小、通信占比高，多卡可能不如单卡。先测单卡吞吐，再决定要不要分布式。

### 边界：书里那条"偶数 GPU"的说法

**注意**

- 没有"GPU 数量必须为偶数"的要求。真正影响效率的是显存、带宽、通信拓扑与 batch 划分。
- 卡数不能整除 batch 时，DDP 会报错或需要 drop_last；这比"奇数"更常见。
- 多机多卡的通信开销更大，先确认网络（IB/RoCE）再谈扩展。

**小结**

多卡是工程问题，不是玄学。约束写在显存、带宽与通信里，不在"偶数"里。

## 四、迁移学习：特征提取、微调与数据增强

从零训练一个视觉模型需要百万级标注与几十张卡。迁移学习把"预训练模型"当作起点，让小数据也能得到可用的结果。这一章讲清楚两种接法、冻结策略与常见坑。

### 特征提取与微调：两种接法

**定义**

- **特征提取**：冻结预训练 backbone，只训练新加的分类头。把 backbone 当作固定的特征变换。
- **微调**：用预训练权重初始化，解冻部分或全部层，用小学习率继续训练。

**性质（取舍）**

- 特征提取快、稳、不容易过拟合，适合目标数据少、与预训练域接近的任务。
- 微调上限更高，但需要更多数据与调参；学习率太大会破坏预训练特征。
- 常见折中：冻结底层，解冻最后一个 stage，分类头用大学习率、backbone 用小学习率。

**注意**

- 预训练模型的预处理必须匹配：输入尺寸、归一化均值方差、通道顺序。用错会让特征整体偏移。
- 替换分类头后要重建优化器，否则新参数不在优化器里。
- 微调初期用 warmup 或小学习率，避免一次性冲掉预训练权重。

**小结**

特征提取是"借特征"，微调是"借初始化"。数据越少越偏向特征提取，数据越多越可以放开微调。

### 冻结、解冻与分层学习率

**性质**

- requires_grad=False 冻结参数，反向不计算梯度，也不占梯度显存。
- 解冻部分层时，通常从最后一层往前放，观察验证指标再决定是否继续。
- 分层学习率用参数组实现：头部大、backbone 小。

**注意**

- 冻结的 BN 层仍会在 train 模式更新 running stats；要么保持 eval，要么一起冻结统计量。
- 解冻后如果验证指标变差，先降学习率，再考虑减少解冻层数。
- 灾难性遗忘：在小数据上全量微调久了，模型会忘掉预训练能力。早停与低学习率是主要对策。

**小结**

冻结是容量控制，分层学习率是稳定控制。两者一起用，才能在少数据上既学到新任务又不毁掉旧特征。

### 数据增强：在小数据上制造多样性

**性质**

- 几何：随机裁剪、翻转、旋转、缩放。
- 颜色：亮度、对比度、饱和度、色相。
- 混合：MixUp、CutMix，把两张图与标签按比例混合。
- 测试时增强（TTA）：对同一张图做多种变换，预测取平均。

**注意**

- 增强必须保持标签语义。水平翻转对猫狗有效，对数字与文字可能无效。
- 增强强度与数据量成反比：数据越少，增强可以越强，但要验证。
- 混合类增强会改变标签分布，配交叉熵时要按混合比例加权。

**小结**

增强是在数据层面做正则。它的边界是"变换后标签仍成立"，超过这个边界就是制造噪声。

### 什么时候不值得微调

**注意**

- 目标域与预训练域差距过大（医学影像、遥感、显微镜），预训练特征可能不适用。
- 模型许可不允许商用（例如部分权重仅限研究）。
- 推理成本受限，大 backbone 跑不动；此时蒸馏或换小模型更实际。
- 数据量足够大时，从零训练可能更干净，避免预训练域的偏见。

**小结**

迁移学习不是默认选项。域差距、许可、成本三者任一不满足，收益可能为负。

### 代码：加载权重、换头与分层学习率

```python
import torch.nn as nn
from torchvision import models

weights = models.ResNet18_Weights.IMAGENET1K_V1
model = models.resnet18(weights=weights)
preprocess = weights.transforms()        # 与权重匹配的尺寸与归一化

for p in model.parameters():             # 先全部冻结
    p.requires_grad = False

model.fc = nn.Linear(model.fc.in_features, 10)   # 新头默认可训练

for p in model.layer4.parameters():      # 解冻最后一个 stage
    p.requires_grad = True

optimizer = torch.optim.AdamW([
    {"params": model.fc.parameters(), "lr": 1e-3},
    {"params": model.layer4.parameters(), "lr": 1e-4},
])
```

如果只做特征提取，把 model.fc 换成 nn.Identity()，输出就是 512 维特征，可以直接接线性分类器或最近邻检索。

### 边界：预训练权重的隐含假设

**注意**

- 权重是在某个数据集上训练的，它的"常识"带有那个数据集的偏见与盲区。
- 输入分辨率改变时，位置编码或感受野可能失配；先按权重要求的分辨率评估。
- 微调后的模型仍然继承预训练数据的许可与隐私约束。

**小结**

迁移学习借的不只是参数，还有预训练数据的分布假设。接任务之前，先确认这些假设成立。

## 五、视觉任务：检测、分割与评测

分类回答"这张图是什么"，检测回答"在哪里、有几个"，分割回答"每个像素属于什么"。任务越往后，标注越贵、指标越复杂、工程链路越长。

### 任务与指标：IoU、mAP 与 mIoU

**定义（IoU）**

交并比衡量两个区域的重合程度：

$$\mathrm{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

预测框与真实框的 IoU 超过阈值（常用 0.5）才算命中。

**定义（AP 与 mAP）**

- 按置信度从高到低排序，逐个计算精确率与召回率，得到 PR 曲线；
- AP 是 PR 曲线下的面积；
- mAP 是各类别 AP 的平均；
- mAP@0.5 只看 IoU 阈值 0.5，mAP@0.5:0.95 在 0.5 到 0.95 之间取平均，后者更严格。

**定义（NMS）**

非极大值抑制去掉重复框：按置信度排序，保留最高分框，删掉与它 IoU 超过阈值的其余框，重复直到结束。

**注意**

- NMS 的阈值是超参数。阈值低会误删密集场景中的相邻目标，阈值高会留下大量重复框。
- mAP 高不代表业务可用：小目标、遮挡、罕见类别的表现可能被平均值掩盖。
- 分割用 mIoU（每类 IoU 的平均），边界精度比像素准确率更重要。

**小结**

检测指标的核心是"匹配 + 排序"：先按 IoU 判断是不是同一个目标，再按置信度算 PR 曲线。

### 检测架构：backbone、neck 与 head

**性质**

- **backbone**：提特征，通常是 ResNet、CSPNet 或 ViT。
- **neck**：融合多尺度特征，FPN/PAN 是常见结构。
- **head**：输出类别、框、置信度；anchor-based 预先定义框，anchor-free 直接预测中心与尺寸，DETR 用集合预测与匈牙利匹配。

**注意**

- 小目标依赖高分辨率特征图，neck 的多尺度融合比换 backbone 更直接。
- anchor 的尺寸与比例要与数据分布匹配，否则正样本太少。
- DETR 类方法去掉了 NMS，但训练更慢、对小目标仍不友好。

**小结**

检测的精度上限由 backbone 与数据决定，召回由 neck 与 anchor/匹配策略决定，后处理由 NMS 决定。

### YOLO 家族与 Ultralytics：能跑通的最小闭环

**性质**

- YOLO 把检测做成单阶段回归，速度优先，适合实时场景。
- 版本演进的主线是"更快的结构 + 更好的标签分配 + 更多任务支持"。
- 截至 2026 年，Ultralytics 的最新发布是 YOLO26，YOLO11 是成熟稳定版；代码示例用 YOLO11，升级时先在小数据上验证。

**注意**

- 版本之间不是简单替代关系：新版本的精度/速度权衡、导出支持、许可都可能变化。
- Ultralytics 默认许可是 AGPL-3.0，商用需要确认授权。
- 预训练权重只在 COCO 的 80 类上训练过，自定义类别要微调。

**小结**

YOLO 的价值是"把检测的训练、验证、导出打包成几行调用"。理解指标与数据格式，比记住版本号重要。

### 数据与标注：格式决定一半的工程量

**性质**

- YOLO 格式：每张图一个 txt，每行 "类别 cx cy w h"，坐标归一化到 0–1。
- COCO 格式：一个 json 包含 images、annotations、categories，适合多任务与评测工具。
- 数据集配置用一个 yaml 描述路径、类别名与划分。

**注意**

- 标注框要贴边、不越界；越界框在训练时会被裁剪，导致尺寸失真。
- 类别不平衡先看长尾：合并过细类别、重采样、类别加权都是选项。
- 训练/验证划分要按场景或时间，不能随机抽帧，否则同一段视频的相邻帧会泄漏。

**小结**

数据格式是工程契约。格式错了，训练脚本再对也跑不出正确结果。

### 代码：训练、验证、预测与导出

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")          # n/s/m/l/x 是规模档位

model.train(data="mydata.yaml", epochs=50, imgsz=640, batch=16)
metrics = model.val()
print(metrics.box.map50, metrics.box.map)   # mAP@0.5 与 mAP@0.5:0.95

results = model.predict("test.jpg", conf=0.25, iou=0.45)
for r in results:
    print(r.boxes.xyxy, r.boxes.conf, r.boxes.cls)

model.export(format="onnx", opset=17, dynamic=True)
```

```yaml
path: ./dataset
train: images/train
val: images/val
names:
  0: person
  1: car
  2: bicycle
```

训练前先确认三件事：类别名与标注文件里的 id 对得上、验证集与训练集没有重复图、imgsz 与部署分辨率一致。

### 分割：U-Net 与 SAM 的分工

**性质**

- **U-Net**：编码器降采样、解码器上采样、跳跃连接保留细节。需要像素级标注，适合固定类别的语义分割。
- **SAM 2/3**：可提示分割，给点、框或掩码就能分割出对应区域，零样本能力强，但类别语义要另接分类器。
- **实例分割**：在检测框内分割每个实例，YOLO 的 seg 模型与 Mask R-CNN 都属于这一类。

**注意**

- SAM 的"分割一切"不等于"理解一切"：它给掩码，不给类别。
- 零样本模型在专业域（医学、遥感）上会退化，仍需要微调或后处理。
- 分割评测看 mIoU 与边界指标，像素准确率在类别不平衡时会虚高。

**小结**

U-Net 解决"固定类别的像素分类"，SAM 解决"按提示切出区域"。先明确要不要类别，再选工具。

### 开放词表：YOLOE、YOLO-World 与 CLIP

**性质**

- 开放词表检测用文本或图像提示指定类别，不需要为每个新类别重新训练。
- YOLOE、YOLO-World 把文本嵌入接进检测头；CLIP 提供图文对齐的零样本分类能力。

**注意**

- 开放词表的精度对提示词敏感，同义词与描述粒度都会影响结果。
- 新类别的召回通常低于闭集模型，关键业务仍要微调。
- 许可与权重来源要确认，尤其是商用场景。

**小结**

开放词表适合"类别经常变、标注跟不上"的场景；稳定类别仍用闭集模型更划算。

### 边界：视觉任务最容易翻车的地方

**注意**

- 小目标：分辨率不够时，任何检测器都无能为力；先解决数据采集。
- 域偏移：光照、角度、设备变化会让指标断崖式下降；验证集要覆盖部署场景。
- 长尾类别：平均 mAP 会掩盖少数类的失败；按类别报告。
- 后处理：置信度阈值与 NMS 阈值要在验证集上定，不能拍脑袋。

**小结**

检测与分割的失败大多不在模型结构，而在数据覆盖、标注质量与阈值选择。

## 六、部署、鲁棒性与复现

模型在 notebook 里跑通，离"可交付"还有距离：要能导出、能测延迟、能发现输入异常，还要能被别人复现。

### 导出：从 PyTorch 到推理引擎

**性质**

- ONNX 是中间表示，能被 ONNX Runtime、TensorRT 等后端加载。
- 导出时要固定或声明动态维度：batch、序列长度、图像尺寸。
- 导出后必须做数值对齐：同一输入，PyTorch 与 ONNX 的输出误差应在容差内。

**注意**

- 自定义算子可能不被 ONNX 支持，需要替换或注册。
- 训练模式与推理模式不同：导出前调用 model.eval()，并去掉 Dropout。
- 动态尺寸会降低某些后端的优化效果，固定尺寸通常更快。

**小结**

导出不是"点一下按钮"，而是一次等价性验证：输出对得上，才算导出成功。

### 量化：精度换延迟

**性质**

- **PTQ（训练后量化）**：用校准集统计激活范围，把权重与激活转成 int8。
- **QAT（量化感知训练）**：训练时模拟量化误差，精度通常更好，成本更高。
- 量化主要减少显存与带宽，算力收益取决于硬件是否支持整数运算。

**注意**

- 校准集要覆盖部署分布，否则异常值会把范围拉大、精度崩掉。
- 量化对分类影响小，对检测的小目标框回归可能很大；要按任务评估。
- 量化后的模型仍要用同一套指标验收，不能只看文件大小。

**小结**

量化是"用精度换延迟"的交易。先明确能接受多少掉点，再决定 PTQ 还是 QAT。

### 延迟与吞吐：测量比猜测可靠

**性质**

- 延迟：单次请求从输入到输出的时间，受预处理、推理、后处理共同影响。
- 吞吐：单位时间处理的请求数，受 batch、并发与显存限制。
- 预热：前几次推理包含初始化与编译，测量时要跳过。

**注意**

- 预处理（解码、缩放、归一化）经常比模型本身更耗时。
- batch 增大提高吞吐，但会增加延迟；实时场景通常 batch=1。
- 用 P50/P95/P99 而不是平均值描述延迟，尾部才是用户体验。

**小结**

部署优化先测量再动手：把时间花在预处理、后处理还是模型上，数据会告诉你。

### 鲁棒性：对抗样本与分布偏移

**定义（FGSM）**

快速梯度符号法沿着损失对输入的梯度方向加一个扰动：

$$x' = x + \varepsilon \cdot \mathrm{sign}\left(\nabla_x \ell(f(x), y)\right)$$

**性质**

- 对抗样本利用的是模型在高维空间的线性与局部敏感性，人眼几乎看不出差别。
- 分布偏移是"数据变了"，对抗攻击是"输入被精心构造"，两者都会让指标失效。

**注意**

- 对抗训练能提升鲁棒性，但会降低干净样本的精度、增加训练成本。
- 部署时更难防的是自然扰动：模糊、压缩、光照、遮挡。
- 监控输入分布（均值、方差、embedding 漂移）比事后补救更有效。

**小结**

鲁棒性不是单一指标，而是"对抗、自然扰动、分布偏移"三类问题的合集。

### 复现：让别人能跑出同样的结果

**性质**

- 固定种子：random、numpy、torch、cuda。
- 固定环境：依赖版本、CUDA/cuDNN 版本、硬件型号。
- 固定配置：超参数、数据切分、增强策略写进配置文件。
- 记录日志：损失曲线、指标、显存、耗时。

**注意**

- 完全确定性很难，尤其是多卡与并行算子；能复现到同一量级即可。
- 数据泄漏是最常见的"复现不出来"：切分不同、去重不同、预处理不同。
- 消融实验一次只改一个变量，否则无法归因。

**小结**

复现不是"再跑一遍"，而是把环境、数据、配置、随机性都写清楚。

### 代码：ONNX 导出、FGSM 与种子

```python
import torch

model.eval().cpu()
dummy = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model, dummy, "model.onnx", opset_version=17,
    input_names=["x"], output_names=["logits"],
    dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}},
)
```

```python
import onnxruntime as ort

sess = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])
out = sess.run(None, {"x": dummy.numpy()})[0]
print(out.shape)          # (1, 10)
```

```python
import torch.nn.functional as F

def fgsm(model, x, y, eps=8 / 255):
    model.eval()
    x = x.clone().detach().requires_grad_(True)
    loss = F.cross_entropy(model(x), y)
    grad, = torch.autograd.grad(loss, x)
    return (x + eps * grad.sign()).clamp(0, 1).detach()
```

```python
import random
import numpy as np
import torch

def seed_all(seed=0):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
```

ONNX 的输出要与 PyTorch 对齐后再上线；FGSM 只用于评估鲁棒性，不要拿它当训练增强；确定性模式会牺牲速度，按需开启。

### 许可与伦理：上线前的最后一道检查

**注意**

- 数据集许可：能否商用、能否再分发、是否要求署名。
- 模型许可：Ultralytics 默认 AGPL-3.0；商用前确认授权。
- 隐私：人脸、车牌、医疗影像属于敏感数据，采集与存储都要有依据。
- 滥用：检测与识别能力可以被用于监控，部署前要想清楚边界。

**小结**

技术和许可要一起验收。一个指标很好但许可不清的模型，不能上线。
