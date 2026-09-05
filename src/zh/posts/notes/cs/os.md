---
lang: zh-CH
title: 操作系统学习笔记：从硬件中断到用户态协程
description: 从硬件中断到用户态协程，系统梳理执行单元、调度、内存管理、并发同步、IO 模型与事件驱动架构
date: 2026-09-03
category:
  - 后端开发
tag:
  - 操作系统
---
# 操作系统深度笔记

> 目标：从硬件中断到用户态协程，建立完整的执行模型认知。
> 原则：每个主题 = 是什么 → 为什么存在 → 怎么工作 → 代价与权衡 → 实际案例

---

## 第一部分：计算的物理基础

### 第 1 章 计算机系统的分层抽象
- 1.1 硬件 → 固件 → 内核 → 系统库 → 应用
- 1.2 特权级（Ring 0 ~ Ring 3）与保护机制
- 1.3 什么是操作系统：资源管理器 + 虚拟机 + 抽象层
- 1.4 系统调用：用户态与内核态的边界
  - 陷入（trap）/ 中断（interrupt）/ 异常（exception）
  - 系统调用的完整生命周期（以 `read()` 为例）
  - 系统调用的代价：上下文切换、TLB、cache
  - `vDSO` 与系统调用优化

### 第 2 章 中断与异常
- 2.1 硬件中断
  - 中断控制器（APIC / IOAPIC）
  - 中断号（IRQ）与中断向量表
  - 中断处理的上半部与下半部（top half / bottom half）
  - 软中断（softirq）、tasklet、工作队列（workqueue）
- 2.2 软件中断 / 异常
  - 缺页中断（page fault）
  - 系统调用中断（`int 0x80` / `syscall` / `sysenter`）
  - 时钟中断（timer interrupt）—— 调度的心跳
- 2.3 中断与性能
  - 中断风暴与中断合并（interrupt coalescing）
  - NAPI（网络轮询替代中断）
  - `irqbalance` 与中断亲和性

---

## 第二部分：执行单元

### 第 3 章 进程
- 3.1 进程的本质：地址空间 + 执行上下文 + 资源集合
- 3.2 进程控制块（`task_struct`）
- 3.3 进程生命周期与状态机
  - 创建（`fork` / `vfork` / `clone`）
  - 执行（`exec` 系列）
  - 终止（`exit` / `_exit` / 信号杀死）
  - 僵尸进程与孤儿进程
- 3.4 写时复制（Copy-On-Write）
- 3.5 进程地址空间
  - 虚拟内存布局（代码段/数据段/堆/栈/mmap 区）
  - `brk` / `sbrk` / `mmap`
- 3.6 守护进程、会话、进程组

### 第 4 章 线程
- 4.1 线程的本质：共享地址空间的独立执行流
- 4.2 内核线程 vs 用户线程
  - 1:1 模型（Linux、Windows）
  - N:1 模型（早期 Green Threads）
  - M:N 模型（Go、Erlang）
- 4.3 POSIX 线程（pthread）
  - 创建、_join、detach
  - 线程局部存储（TLS / `thread_local`）
- 4.4 Linux 的线程实现：`clone()` 系统调用
- 4.5 线程的代价：栈内存、上下文切换、同步开销

### 第 5 章 协程与虚拟线程
- 5.1 协程的本质：用户态的协作式调度
- 5.2 有栈协程 vs 无栈协程
  - 有栈：Go goroutine、Lua coroutine
  - 无栈：C++20 coroutine、Rust async/await、Python asyncio
- 5.3 协程的实现机制
  - 栈切换（`ucontext` / `makecontext` / 汇编 `swapcontext`）
  - 状态机变换（编译器把协程变成状态机）
- 5.4 虚拟线程（Java 21 Virtual Threads / Project Loom）
  - 与 OS 线程的 M:N 映射
  - 挂载（mount）/ 卸载（unmount）
  - 与 Go goroutine 的对比
- 5.5 用户态调度器
  - Go runtime 的 GMP 模型（Goroutine / M / P）
  - Tokio（Rust）的 work-stealing 调度
  - libuv（Node.js）的事件循环
  - Python asyncio 的单线程事件循环
- 5.6 协程不是银弹
  - 函数染色问题（async 传染）
  - 阻塞调用的陷阱
  - 调试困难

### 第 6 章 执行单元对比总览
- 6.1 进程 / 线程 / 协程 / 虚拟线程 全维度对比表
  - 创建成本、切换成本、内存占用、隔离性、通信方式、适用场景
- 6.2 选型决策树
- 6.3 混合模型：多进程 + 多线程 + 协程（如 Nginx、Gunicorn）

---

## 第三部分：调度

### 第 7 章 CPU 调度
- 7.1 调度的本质：在有限 CPU 上制造并发的幻觉
- 7.2 调度策略演进
  - 先来先服务（FCFS）
  - 最短作业优先（SJF）
  - 轮转（Round Robin）与时间片
  - 多级反馈队列（MLFQ）
  - 完全公平调度器（CFS）—— Linux 默认
  - 实时调度（SCHED_FIFO / SCHED_RR / RT_PREEMPT）
- 7.3 Linux CFS 详解
  - 虚拟运行时间（vruntime）
  - 红黑树
  - `sched_latency` / `sched_min_granularity`
- 7.4 多核调度
  - 负载均衡与运行队列迁移
  - NUMA 感知调度
  - CPU 亲和性（`sched_setaffinity` / `taskset`）
  - 大小核调度（heterogeneous scheduling）
- 7.5 上下文切换的完整代价
  - 寄存器保存/恢复
  - 内核栈切换
  - TLB 刷新（进程切换时）
  - CPU cache 污染
  - 实测：一次上下文切换到底多少纳秒？

### 第 8 章 IO 调度
- 8.1 块设备 IO 调度器（Linux）
  - NOOP / Deadline / CFQ / BFQ / mq-deadline / none
- 8.2 IO 调度与 CPU 调度的区别
- 8.3 预读（readahead）与延迟写（writeback）

---

## 第四部分：内存管理

### 第 9 章 虚拟内存
- 9.1 为什么需要虚拟内存：隔离、抽象、超售
- 9.2 页表与多级页表
  - 4 级页表（x86-64）
  - 大页（Huge Pages / 2MB / 1GB）
- 9.3 TLB（Translation Lookaside Buffer）
  - TLB miss 的代价
  - 进程切换与 TLB flush
- 9.4 缺页中断（Page Fault）
  - 硬缺页（磁盘读取）
  - 软缺页（已在内存，更新页表）
  - 零页（zero page）
- 9.5 页面置换算法
  - LRU / Clock / Working Set
  - Linux 的 OOM Killer
- 9.6 `mmap` 与内存映射文件
  - 匿名映射 vs 文件映射
  - 共享映射（`MAP_SHARED`）—— IPC 的基础
  - `mmap` vs `read/write` 的性能对比

### 第 10 章 内存分配
- 10.1 内核内存分配：伙伴系统（buddy system）+ slab 分配器
- 10.2 用户态内存分配：`malloc` / `glibc ptmalloc` / `jemalloc` / `tcmalloc`
- 10.3 内存碎片：外部碎片与内部碎片
- 10.4 内存屏障与 cache 一致性（MESI 协议）—— 为并发章节铺垫

---

## 第五部分：进程间 / 线程间通信与同步

### 第 11 章 进程间通信（IPC）
- 11.1 管道（pipe）与命名管道（FIFO）
- 11.2 消息队列（System V / POSIX）
- 11.3 共享内存（`shmget` / `mmap MAP_SHARED`）—— 最快的 IPC
- 11.4 信号（signal）
  - 信号列表与语义
  - `signal()` vs `sigaction()`
  - 信号与异步安全
  - 信号用于进程控制（`SIGTERM` / `SIGKILL` / `SIGCHLD`）
- 11.5 Unix 域套接字（Unix Domain Socket）
- 11.6 `eventfd` / `signalfd` / `timerfd` —— Linux 特有的事件通知
- 11.7 IPC 方式对比表（延迟、吞吐、方向性、持久性）

### 第 12 章 线程同步原语
- 12.1 互斥锁（mutex）
  - pthread_mutex / std::mutex
  - 可重入锁 / 递归锁
  - 优先级反转与优先级继承
- 12.2 自旋锁（spinlock）
  - 何时用：临界区极短、不能睡眠（内核）
  - 何时不用：用户态长时间等待
- 12.3 读写锁（rwlock）
- 12.4 条件变量（condition variable）
  - 虚假唤醒（spurious wakeup）
  - 与互斥锁的配合
- 12.5 信号量（semaphore）
  - 计数信号量 / 二值信号量
- 12.6 屏障（barrier）/ 闩（latch）
- 12.7 futex（Fast Userspace Mutex）
  - Linux 同步原语的底层基石
  - 用户态无竞争 → 不进内核；有竞争 → `futex(WAIT)`
- 12.8 原子操作与 CAS（Compare-And-Swap）

### 第 13 章 无锁编程与内存模型
- 13.1 为什么需要无锁：锁的代价（竞争、死锁、优先级反转）
- 13.2 CAS 与 ABA 问题
- 13.3 内存序（Memory Ordering）
  - 编译器重排 / CPU 重排 / store buffer / invalidation queue
  - C/C++ `memory_order`（relaxed / acquire / release / seq_cst）
  - Java `volatile` / `happens-before`
  - Rust `Ordering`
- 13.4 内存屏障（memory barrier / fence）
  - `mfence` / `lfence` / `sfence`（x86）
  - 为什么 x86 是"强序"而 ARM 是"弱序"
- 13.5 无锁数据结构
  - 无锁队列（Michael-Scott queue）
  - 无锁哈希表
  - RCU（Read-Copy-Update）—— Linux 内核的核心并发机制
- 13.6 无锁不是免费的：复杂度爆炸

---

## 第六部分：并发、死锁与正确性

### 第 14 章 并发基础
- 14.1 并发 ≠ 并行
- 14.2 竞态条件（race condition）
- 14.3 临界区与互斥
- 14.4 并发 bug 分类
  - 数据竞争（data race）
  - 竞态条件（race condition）
  - 原子性违反（atomicity violation）
  - 顺序违反（order violation）

### 第 15 章 死锁
- 15.1 死锁的四个必要条件
  - 互斥、持有并等待、不可抢占、循环等待
- 15.2 死锁检测
  - 资源分配图（RAG）
  - 银行家算法（Banker's Algorithm）
- 15.3 死锁避免与预防
  - 锁排序（lock ordering）
  - 超时获取（`try_lock` + timeout）
  - 破坏循环等待
- 15.4 活锁与饥饿
- 15.5 实际案例：数据库死锁、分布式死锁

### 第 16 章 结构化并发与现代并发范式
- 16.1 结构化并发（Structured Concurrency）
  - 核心思想：并发任务的生命周期绑定到词法作用域
  - Java `StructuredTaskScope` / Kotlin `CoroutineScope` / Python `TaskGroup`
- 16.2 Actor 模型
  - 消息传递、无共享状态、let it crash
  - Erlang / Akka / Elixir
- 16.3 CSP（Communicating Sequential Processes）
  - Go channel / Clojure core.async
- 16.4 软件事务内存（STM）
- 16.5 数据并行（MapReduce / fork-join）

---

## 第七部分：IO 体系

### 第 17 章 IO 模型全景
- 17.1 五种 IO 模型（UNP 经典分类）
  - 阻塞 IO（blocking IO）
  - 非阻塞 IO（non-blocking IO）
  - IO 多路复用（IO multiplexing）
  - 信号驱动 IO（signal-driven IO）
  - 异步 IO（asynchronous IO）
- 17.2 同步 / 异步 × 阻塞 / 非阻塞 四象限图
- 17.3 一次 `read()` 的完整旅程
  - 用户态 → 系统调用 → 内核 → VFS → 文件系统/网络栈 → 设备驱动 → DMA → 返回

### 第 18 章 IO 多路复用

select → poll → epoll 解决同一个问题，成本结构却不同：**select/poll 的开销与监听总数 n 成正比，epoll 的开销与活跃连接数 k 成正比**——这是理解三者差异的主线。

#### 18.1 `select`：位图接口，成本与监听总数成正比

调用方用定长位图 `fd_set` 声明关心哪些 fd（`fds[]` 为待监视集合，新连接要加入并更新编号上限）：

```c
fd_set rfds;
for (;;) {
    FD_ZERO(&rfds);
    for (int i = 0; i < nfds; i++)
        FD_SET(fds[i], &rfds);              // 每次调用前都要重建位图

    // 阻塞期间，内核把 0..maxfd 的每个 fd 都轮询一遍"就绪了吗"
    select(maxfd + 1, &rfds, NULL, NULL, NULL);

    for (int i = 0; i < nfds; i++)          // 返回后还得自己扫一遍才知道谁就绪
        if (FD_ISSET(fds[i], &rfds))
            handle(fds[i]);
}
```

机制与代价都来自这张位图：

1. **上限 1024**：`fd_set` 大小由 `FD_SETSIZE` 在编译期决定（通常 1024），超限需改头文件重编。位图表达力也弱，只能覆盖"读/写/异常"三类集合。
2. **每次调用全量拷贝，且集合被就地破坏**：fd_set 每次从用户态拷入内核；**内核返回前会就地把"就绪 fd"对应的位置 1**，于是这张图已不可复用，下一次调用必须 `FD_ZERO` + `FD_SET` 重建。集合无法驻留内核，是 select 反复搬运的根源。
3. **内核 O(n) 轮询 + 用户 O(n) 扫描**：select 返回时只告知"至少有一个就绪"，不告知"谁就绪"。即使 1 万个连接只有 1 个有数据，也要扫完 1 万位。

结论：**select 的一切成本与连接总数成正比、与就绪数量无关**，只在监听量很小时才划算。

#### 18.2 `poll`：摆脱上限与重建，未摆脱 O(n)

poll 用 `pollfd` 数组替代定长位图；与 select 一样，**轮询发生在调用内部**——数组被整体拷入内核后，内核逐个检查每个 fd：

```c
struct pollfd fds[MAX_CONN];
for (;;) {
    int n = poll(fds, nfds, -1);           // 数组拷入内核并逐个轮询；返回就绪个数
    if (n > 0)
        for (int i = 0; i < nfds; i++)     // 谁就绪？返回后还得自己 O(n) 扫一遍
            if (fds[i].revents & POLLIN)
                handle(fds[i].fd);         // events 未被改写，下次可直接复用
}
```

接口层面解决了 select 两个痛点：

- **`events`（调用者关心）与 `revents`（内核回填）分离**，输入输出不共用内存，poll 返回后数组可直接复用，无需重建；
- **数量不再受 1024 编译期限制**，可监听远超 1024 的 fd。

但复杂度结构没有变：

- 每次调用，整个 `pollfd` 数组仍要从用户态完整拷入内核、返回时再带出；
- 内核依旧线性轮询每个 fd 的就绪状态；
- 返回后调用者仍需遍历数组找出 `revents != 0` 的项。

**select 与 poll 本质同代**：成本都绑在"监听总数"上，连接 10 万、活跃 10 时，每次调用都要为 10 万连接付账。它们到今天仍被使用，是因为监听量小（几十到几百）时接口简单、语义直观、没有注册表管理开销——杀鸡不必用牛刀。

#### 18.3 `epoll`（Linux）：状态驻留内核，事件驱动

epoll 与前两者的分水岭：**注册表保留在内核里，事件到达时由内核回调登记**，调用不再全量搬运与轮询。

三个 API 各管一段生命周期：

```c
struct epoll_event ev, ready[64];
ev.events = EPOLLIN;                                // 关心可读
ev.data.fd = listen_fd;
epoll_ctl(epfd, EPOLL_CTL_ADD, listen_fd, &ev);     // 注册：写进内核注册表

for (;;) {
    int n = epoll_wait(epfd, ready, 64, -1);        // 阻塞，直到就绪链表非空
    for (int i = 0; i < n; i++)
        handle(ready[i].data.fd);                   // 只处理就绪的，不遍历全部
}
```

- `epoll_create` 建实例：内核为它维护一棵**红黑树**（所有注册 fd 的索引）和一条**就绪链表**。
- `epoll_ctl` 增/删/改注册项，红黑树定位 O(log n)，且**只在增删时发生**，后续 `epoll_wait` 不再搬运这张表。
- `epoll_wait` 阻塞等待。某个 fd 就绪（如数据包到达、唤醒 socket 的等待队列）时，**内核通过回调把它追加进就绪链表**；返回时应用拿到的是紧凑的就绪数组，长度等于活跃数。

**"回调入队"替代"全量轮询"，是 epoll 与 select/poll 的分水岭**：内核不再是"每次都检查所有 fd"，而是"谁有事件谁进队列"，复杂度从 O(n) 降到 O(活跃数)。这也正是 epoll 适合"连接多、空闲多、活跃少"的长连接场景的原因。

**水平触发（LT）与边缘触发（ET）。** select/poll 只有水平一种语义；epoll 提供两种，ET 是最容易写错的地方：

- **LT（默认）**：只要 fd 仍处就绪状态（缓冲区里还有数据），每次 `epoll_wait` 都会上报。漏读不丢通知，语义宽容，代码难写错。
- **ET**：只在状态**从无到有**的跳变瞬间上报一次。若一次没读完，剩余数据不再触发通知，直到下一次新数据到来——**读不干净，数据就会"饿"在缓冲区里**。

ET 因此强制要求：收到通知后必须循环读到 `EAGAIN`；而"读干净"需要反复 `read`，fd 必须设成**非阻塞**，否则最后一次 read 会永久阻塞线程：

```c
set_nonblocking(fd);                        // ET 的前提
for (;;) {
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n > 0)                    handle(buf, n);
    else if (n == 0) {            close(fd); break; }   // 对端关闭
    else if (errno == EAGAIN)     break;                // 本次数据读完
    else                          break;                // 真实错误
}
```

工程上**求稳选 LT，追求减少无效唤醒再上 ET**，且必须"非阻塞 + 读到 EAGAIN"配套。ET 漏读的典型症状是连接"假死"：有数据、无通知、请求悬空，极难排查。Nginx 默认 ET，Redis 用 LT。

**回调的触发链路与就绪链表的并发。** 注册 fd 时，内核把回调函数挂到该 fd 底层对象（socket、timerfd 等）的**等待队列**上；对象就绪时（如数据包进入接收队列）协议栈唤醒这条等待队列，回调被调用并携带**就绪掩码**。回调先比对掩码与注册事件：匹配且该 fd 尚不在就绪链表中，就把它追加进链表，再唤醒阻塞在 `epoll_wait` 的线程——**先入队、后唤醒，也不攒批**：`epoll_wait` 发现链表非空即返回，一次最多拷出 `maxevents` 个事件，多余的留在链表里等下次。

就绪链表存在"两个写者"：回调是生产者（网络路径常在软中断/进程上下文），`epoll_wait` 是消费者（要把链表项摘走并拷给用户）。内核用**自旋锁**串行化两端——回调可能在不可睡眠的中断上下文，因此不能用互斥锁。同时链表维持"**同一个 fd 至多入队一次**"的不变量，同一 fd 的连续多次就绪会被合并成一次入队，通知本身是幂等的。所以"回调一边入队、`epoll_wait` 一边摘除"的并发是安全的，不会丢事件、也不会重复上报。

这同时澄清了 ET 的边界：**内核侧的并发保护是完备的，丢数据风险在应用侧。** ET 事件上报即摘除，下一次上报必须等新的"从无到有"边沿；若应用没读到 `EAGAIN` 就停止，残留数据不会产生新边沿——这正是不读干净就"假死"的机制根源。

**多线程下的细节。** 多线程同时 `epoll_wait` 同一个实例，一个事件会唤醒所有等待线程、但只有一个能处理成功，其余空转，即**惊群**；Linux 4.5+ 可对注册项加 `EPOLLEXCLUSIVE`，让内核只唤醒其中一个。若连接建立后要交给线程池处理，可用 `EPOLLONESHOT`：事件只上报一次并自动摘除，处理完再 `EPOLL_CTL_MOD` 挂回，避免同一 fd 被多线程并发处理。

**适用边界。** epoll 的收益有前提：连接数大而活跃比例低。fd 少且几乎总在活跃时，红黑树与回调管理是纯开销，poll 甚至每连接一线程反而更简单。epoll 是 Linux 专属接口，macOS/BSD 用 `kqueue`、Windows 用 `IOCP`；它监视的也不止 socket——`eventfd` / `signalfd` / `timerfd` 都能挂进同一张表，这正是 Linux 事件驱动架构的地基。

**select / poll / epoll 对比**

| 维度 | select | poll | epoll |
| --- | --- | --- | --- |
| 数据结构 | 定长位图 `fd_set` | `pollfd` 数组 | 红黑树注册表 + 就绪链表 |
| 连接上限 | 1024（编译期） | 无硬编码上限 | 无上限 |
| 状态是否驻留内核 | 否，每次重建 | 否，整体拷贝 | 是，注册一次 |
| 内核就绪检测 | O(n) 轮询 | O(n) 轮询 | 回调入队，O(活跃数) |
| 就绪项查找 | 用户 O(n) 遍历 | 用户 O(n) 遍历 | 就绪数组直接给出 |
| 触发模式 | 水平 | 水平 | 水平 / 边缘 |
| 平台 | POSIX | POSIX | Linux |

epoll 把重心从"每次全量检查"挪到了"事件驱动登记"，但语义仍是**就绪通知（Reactor）**——通知后应用还要自己发起 `read/write`。把"等待 + 读写"整体交给内核、完成后再通知（Proactor），是 `io_uring` 的命题；而"单线程 `epoll_wait` + 分派"正是事件循环的骨架，Redis、Nginx worker 都是这个形态。

#### 18.4 `kqueue`：一个队列容纳一切事件（macOS / BSD）

BSD 生态（macOS 沿用）中与 epoll 对等的就绪型原语是 `kqueue`。它把"注册表驻留内核 + 事件驱动"的思路推得更远：**不只监视 IO 就绪，文件变更、信号、定时器等一切可等待对象都能进同一个队列**，由不同类型的事件过滤器（filter）处理：

- `EVFILT_READ` / `EVFILT_WRITE`：fd 可读/可写，与 epoll 对应；
- `EVFILT_VNODE`：文件被删除、改名、写入、属性变化——这是 epoll 做不到的文件系统监视；
- `EVFILT_PROC` / `EVFILT_SIGNAL` / `EVFILT_TIMER` / `EVFILT_USER`：进程退出、信号、定时器、进程内事件，统一复用同一套等待机制。

注册与等待都走 `kevent()`，事件以 (ident, filter) 唯一标识：

```c
struct kevent chg;
EV_SET(&chg, fd, EVFILT_READ, EV_ADD, 0, 0, NULL);
kevent(kq, &chg, 1, NULL, 0, NULL);            // 提交注册变更

struct kevent evlist[64];
int n = kevent(kq, NULL, 0, evlist, 64, NULL); // 等待就绪事件
for (int i = 0; i < n; i++)
    handle(&evlist[i]);                        // ident=fd；filter 区分事件类型
```

几个与 epoll 的差别：

- **事件带细节数据**：`EVFILT_READ` 的 `data` 直接给出当前可读字节数，`EVFILT_VNODE` 的 `fflags` 指明是哪类文件变更。epoll 只返回"可读/可写"布尔信号，有多少数据还得自己 `read` 才知道；
- **触发语义默认是水平**：条件成立就持续上报，配合"读到 EAGAIN"才能消停；`EV_CLEAR` 可让事件上报后重置状态（近似边沿用法），`EV_ONESHOT` 只上报一次并自动注销；
- 内核同样是事件驱动、O(活跃数)，因此和 epoll 一样能撑起海量空闲连接——libuv 在 macOS 上就是拿它当事件循环后端。

**适用边界**与 epoll 类似：是 BSD/macOS 平台的答案，不能跨到 Linux。跨平台应用不要让业务代码直接依赖某一种，交给 libuv、Netty 这类运行时去选后端。

#### 18.5 `IOCP`：Windows 的完成通知模型

IOCP（I/O Completion Port）与前面所有"就绪通知"是**不同的模型**：它不等"可读了再自己读"，而是**先把读/写交给内核，内核完成后把结果投递回来**——即完成通知（Proactor）。Windows 上它是标准做法（Linux 直到 io_uring 出现才有同类的原生能力）。

流程分三步：

1. `CreateIoCompletionPort` 把连接绑定到完成端口；
2. 发起异步操作：调用带 `OVERLAPPED` 的读写（文件用 `ReadFile`，网络用 `WSARecv`），操作未立即完成时返回 `ERROR_IO_PENDING`；
3. 内核真正执行 IO，完成后向端口队列投递完成包；工作线程用 `GetQueuedCompletionStatus` 取出并直接处理。

```c
HANDLE port = CreateIoCompletionPort(conn, g_port, (ULONG_PTR)&ctx, 0);
// 发起异步读：立即返回；数据就绪与否不用关心，内核会读完再通知
ReadFile(conn, ctx->buf, ctx->len, NULL, &ctx->ov);  // 挂起则返回 ERROR_IO_PENDING

// 工作线程：阻塞到"某个操作真正完成"
GetQueuedCompletionStatus(port, &ctx->bytes, &ctx->key,
                          (OVERLAPPED **)&ctx, INFINITE);
handle(ctx);   // ctx->bytes 是实际读到的字节数，无需再补一次 read
```

关键特性与代价：

- **等待与收数合为一步**：工作线程只等一次，拿到的就是"数据已就位 + 实际字节数"，不像就绪模型那样被唤醒后再补一次 `read`；
- **线程数与完成数挂钩**：完成端口可设并发上限，内核保证同时运行的 worker 不超过该值，其余挂起等下一个完成——线程池规模跟着"正在完成的 IO"走，而不是跟着连接数走；
- **内存义务前移**：每笔 IO 的缓冲区与 `OVERLAPPED` 上下文要预先分配、并活到完成回调，何时安全释放由应用管理；
- 每连接可以有多个并发未完成的读写（对应一个连接多个 in-flight）。

#### 18.6 `io_uring`：共享内存环形队列（Linux 5.1+）

epoll 之后 Linux 仍有两块成本：一次就绪周期要多次系统调用（`epoll_wait` 一次 + 每个事件一次 `read/write`），且每次调用的参数都要跨越用户/内核边界。`io_uring` 的思路是把"等就绪 + 自己读"整体替换成**批量提交操作、回收完成结果**：

- **SQ（提交队列）**：应用把一组请求填成 SQE（Submission Queue Entry）推进生产者指针；
- **CQ（完成队列）**：内核执行完写入 CQE（Completion Queue Entry，含 `user_data` 和结果 `res`），推进自己的指针，应用读 CQ 回收。

两条队列放在用户与内核**共享的一块 mmap 内存**里，指针推进只靠内存屏障同步，所以"提交一个读"和"回收一个完成"可以不触发系统调用；需要内核动手时才调一次 `io_uring_enter`。直接操作 ring 要自己处理内存序，工程上通常用 `liburing`：

```c
struct io_uring ring;
io_uring_queue_init(64, &ring, 0);              // 建立共享内存环形队列

struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
io_uring_prep_recv(sqe, conn_fd, buf, sizeof(buf), 0); // 提交"把数据读进 buf"
io_uring_sqe_set_data(sqe, &ctx);
io_uring_submit(&ring);                          // 这批请求交给内核

struct io_uring_cqe *cqe;
io_uring_wait_cqe(&ring, &cqe);                  // 等的是"完成"，不是"可读"
if (cqe->res > 0) handle(ctx, cqe->res);         // res = 实际读到的字节数
io_uring_cqe_seen(&ring, cqe);                   // 归还 CQE，队列才能复用
```

与 epoll 的本质差别有三条：

- **批量**：一次 `submit` 提交成百上千个操作、一次 `wait` 回收一批完成，系统调用开销被均摊到接近零；
- **同一 fd 可挂多个未完成操作**：能给同一连接同时提交多个读写，靠 `user_data` 区分，完成可乱序返回；就绪模型里同 fd 的并发 IO 没有这种原生表达；
- **Proactor**：提交的是"读完写进这块 buffer"，而不是"可读了叫我"。CQE 回来数据已就位，是完成通知而非就绪通知。

**对"零拷贝"的两个澄清**（大纲里的表述容易误导）：

1. ring 通道的零拷贝指**请求与结果元数据**不再经系统调用参数搬运；数据本身默认仍要拷贝——SQE 引用的是用户 buffer，内核照常拷贝；
2. 数据面的免拷贝要靠 `io_uring_register` 注册固定缓冲（fixed buffer）+ `O_DIRECT` 等配合，和 `sendfile`/`splice` 的管道搬运是两码事。

**SQPOLL 模式**：注册一个常驻内核的轮询线程主动消费 SQ，多数情况下应用连 `io_uring_enter` 都不用调；代价是这个内核线程在忙轮询/高频唤醒，占用 CPU——高 IOPS 场景划算，轻负载别开。

**边界**：内核 5.1+ 才能用、常用特性要求更新版本；网络侧没有现成的"连接管理"，谁在等读、谁可写仍要应用自己维护状态机。它适合系统调用开销敏感的吞吐型服务；普通的"epoll + 线程池/协程"仍是更简单的主流。

#### 18.7 六种机制对比总表

| 维度 | select | poll | epoll | kqueue | IOCP | io_uring |
| --- | --- | --- | --- | --- | --- | --- |
| 平台 | POSIX | POSIX | Linux | macOS/BSD | Windows | Linux 5.1+ |
| 通知模型 | 就绪 | 就绪 | 就绪 | 就绪 | 完成 | 完成（也支持就绪） |
| 注册状态 | 无，每次重建 | 无，整体拷贝 | 内核驻留 | 内核驻留 | 内核驻留 | 内核驻留（共享内存） |
| 同 fd 并发未完成操作 | 否 | 否 | 否 | 否 | 是 | 是 |
| 事件范围 | 读/写/异常就绪 | 读/写就绪 | pollable fd | IO + 文件变更/信号/定时器 | 文件/网络等操作完成 | 文件/网络/fsync 等操作 |
| 返回携带信息 | 就绪信号 | 就绪信号 | 就绪信号 | 就绪信号 + 细节（可读字节数等） | 完成结果（实际字节数） | 完成结果（字节数/错误码） |
| 典型用途 | 少量 fd | 少量 fd | Linux 高并发就绪型 | macOS/BSD 事件循环 | Windows 高性能服务 | Linux 高 IOPS/低 syscall |

六个接口不是平级替换关系，而是沿两条轴演进：一条是**就绪 → 完成**（真正的 IO 由谁发起），一条是**注册状态能否驻留内核、一次调用能管多少事件**。选型的现实约束首先是平台：Linux 上日常高并发仍是 epoll 的地盘，想把系统调用开销压到极致再上 io_uring；macOS/BSD 用 kqueue；Windows 用 IOCP。需要跨平台时，让 libuv、Netty 这类运行时替你选后端，比自己维护四套模型稳妥得多。

### 第 19 章 零拷贝
- 19.1 传统 `read + write` 的 4 次拷贝 + 4 次上下文切换
- 19.2 `mmap` + `write`：减少一次拷贝
- 19.3 `sendfile`：零拷贝传输（Nginx / Kafka 的基础）
- 19.4 `splice` / `tee`：管道间零拷贝
- 19.5 DMA 聚集（scatter-gather DMA）
- 19.6 `io_uring` 的零拷贝路径

### 第 20 章 文件系统与 Page Cache
- 20.1 VFS（虚拟文件系统）：一切皆文件的统一抽象
- 20.2 Page Cache
  - 读缓存 / 写回（writeback）
  - `O_DIRECT` / `O_SYNC` / `fsync`
- 20.3 `inotify` / `fanotify`：文件系统事件通知
- 20.4 文件系统与 IO 调度的交互

---

## 第八部分：事件驱动架构

### 第 21 章 事件循环
- 21.1 事件循环的本质：`while(1) { events = wait(); handle(events); }`
- 21.2 单线程事件循环（Redis / Node.js / nginx worker）
- 21.3 多线程事件循环（Netty / Tokio）
- 21.4 事件循环中的定时器实现
  - 时间轮（timing wheel）
  - 最小堆
- 21.5 事件循环的缺陷与适用边界

### 第 22 章 Reactor 与 Proactor
- 22.1 Reactor 模式
  - 单 Reactor 单线程
  - 单 Reactor 多线程
  - 主从 Reactor（Boss/Worker）
  - 典型实现：Nginx、Netty、Redis
- 22.2 Proactor 模式
  - 与 Reactor 的核心区别：就绪通知 vs 完成通知
  - 典型实现：Windows IOCP、Linux io_uring、Boost.Asio
- 22.3 Reactor vs Proactor 对比
- 22.4 从 Reactor 到 Proactor 的演进趋势

### 第 23 章 C10K / C10M 问题
- 23.1 C10K 问题的历史（1999, Dan Kegel）
- 23.2 为什么线程模型在 10K 连接时崩溃
- 23.3 解决方案演进
  - 每连接一线程 → 线程池 → select/poll → epoll → 协程
- 23.4 C10M：内核旁路（kernel bypass）、DPDK、用户态网络栈
- 23.5 现代方案：io_uring + 协程 + 零拷贝

---

## 第九部分：硬件与体系结构视角

### 第 24 章 多核与 Cache
- 24.1 CPU 缓存层次（L1 / L2 / L3）
- 24.2 缓存一致性协议（MESI / MOESI）
- 24.3 伪共享（false sharing）与缓存行对齐
- 24.4 NUMA 架构
  - 本地内存访问 vs 远端内存访问
  - `numactl` / NUMA 感知分配
- 24.5 CPU 亲和性与绑核
- 24.6 分支预测、流水线、乱序执行对并发的影响

### 第 25 章 DMA 与设备交互
- 25.1 程序控制 IO（PIO）vs DMA
- 25.2 DMA 传输流程
- 25.3 中断驱动的 DMA 完成通知
- 25.4 设备驱动模型（简要）

---

## 第十部分：现代运行时与容器

### 第 26 章 用户态运行时深度剖析
- 26.1 Go Runtime
  - GMP 模型
  - 网络 poller（netpoller）与 epoll 的集成
  - 抢占式调度（基于信号的异步抢占）
- 26.2 Java 虚拟线程（Project Loom）
  - 与 OS 线程的映射
  - 调度器（ForkJoinPool）
  - 与 Go goroutine 的差异
- 26.3 Tokio（Rust）
  - work-stealing 调度
  - `epoll` / `kqueue` / `IOCP` 后端
- 26.4 libuv（Node.js）
  - 线程池 + 事件循环的混合模型
- 26.5 Python asyncio
  - 单线程 + 事件循环 + 非阻塞 IO
  - GIL 的影响

### 第 27 章 容器与资源隔离
- 27.1 namespace（进程/网络/文件系统/用户隔离）
- 27.2 cgroup（CPU/内存/IO 资源限制）
- 27.3 容器内的"进程"视角变化
- 27.4 容器调度与 OS 调度的交互

---

## 第十一部分：性能观测与调优

### 第 28 章 性能分析方法论
- 28.1 USE 方法（Utilization / Saturation / Errors）
- 28.2 RED 方法（Rate / Errors / Duration）
- 28.3 火焰图（Flame Graph）
- 28.4 性能分析工具链
  - `top` / `htop` / `vmstat` / `iostat` / `sar`
  - `strace` / `ltrace`（系统调用追踪）
  - `perf`（CPU 性能计数器）
  - `bpftrace` / `bcc`（eBPF 动态追踪）
  - `/proc` 与 `/sys` 文件系统
- 28.5 上下文切换观测：`pidstat -w` / `perf sched`
- 28.6 IO 观测：`iostat` / `blktrace` / `biolatency`
- 28.7 网络观测：`ss` / `tcpdump` / `bpftrace`

---

## 第十二部分：综合与串联

### 第 29 章 一个请求的完整旅程
- 29.1 从键盘按下到屏幕显示
- 29.2 从浏览器输入 URL 到页面渲染（网络 + 进程 + 调度 + IO 全串联）
- 29.3 一次数据库查询的 OS 视角（进程 → 系统调用 → 文件系统 → 磁盘 → DMA → 中断 → 返回）
- 29.4 一次 HTTP 请求在 Nginx 中的完整路径（epoll → Reactor → 零拷贝 → sendfile）

### 第 30 章 知识地图与交叉索引
- 30.1 全书概念依赖图
- 30.2 按语言分类的并发/IO 模型对照表
- 30.3 按场景分类的技术选型指南
- 30.4 开放问题与前沿
  - 用户态网络栈（DPDK / io_uring 网络）
  - CXL 内存池化
  - RISC-V 对调度/中断的影响
  - AI 推理对调度的新需求

---

## 附录

### 附录 A 关键系统调用速查表

| 类别 | 系统调用 |
|------|---------|
| 进程 | `fork`, `exec`, `wait`, `exit`, `clone` |
| 线程 | `pthread_create`, `pthread_join`, `futex` |
| 内存 | `mmap`, `munmap`, `brk`, `mprotect` |
| 文件 IO | `open`, `read`, `write`, `close`, `fsync` |
| 多路复用 | `select`, `poll`, `epoll_create/ctl/wait` |
| 异步 | `io_uring_setup`, `io_uring_enter` |
| IPC | `pipe`, `socket`, `shmget`, `msgget`, `semget` |
| 信号 | `kill`, `sigaction`, `sigprocmask` |
| 调度 | `sched_yield`, `sched_setaffinity`, `nice` |

### 附录 B 实验清单
- [ ] 用 `strace` 跟踪一个程序的完整系统调用序列
- [ ] 用 `perf sched` 观测上下文切换
- [ ] 手写一个基于 `epoll` 的简单 HTTP 服务器
- [ ] 用 `liburing` 重写，对比性能
- [ ] 用 `bpftrace` 追踪一次 `read()` 的内核路径
- [ ] 写一个死锁 demo，用 `gdb` 分析
- [ ] 用 `perf` 生成火焰图，分析热点
- [ ] 对比 `fork` / `pthread_create` / Go goroutine 的创建成本
- [ ] 用 `numactl` 测试 NUMA 对性能的影响

### 附录 C 术语表（中英对照）

### 附录 D 参考资料与延伸阅读