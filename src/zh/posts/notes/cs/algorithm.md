---
lang: zh-CH
title: 算法学习笔记
description: 算法笔记、模版、思考
date: 2023-2-20
category:
  - 数学
tag:
  - 算法
---

[toc]

## 一、算法总揽与思维导图

### 1. 根据题型分类算法

五大题型：
- 数据结构
- 数学
- 贪心
- 动态规划

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDc3MjNmNzM2ZGU1MDIzODM0NzQ0NzVkYTUzOTg0YmZfYjg3NGEwMTVjNzkyZjFmMmU5YmMwYTQ4NDRmMTBjNzhfSUQ6NzU1MzI4Mzg1MzE4MDc4MDU0OF8xNzgzMjM4MDM5OjE3ODMzMjQ0MzlfVjM)

### 2. 根据时间复杂度判断算法

根据题目要求的操作、应用选择算法：

#### 一、元素级操作——单个元素的查与改：

1. 随机访问/索引查找（Look\-up by Index）——数组O\(1\)

2. 值查找/成员查找（Look\-up by Value）——哈希表、布隆过滤器

3. 动态插入/删除（Insert\-Delete）——链表

4. 权衡型——跳表、红黑树

#### 二、最值与顺序——不关心全量数据，关注极端或相对位置

1. 动态最值查询——堆/优先队列（查询O\(1\)、更新调整堆O\(n\)）

2. 保持有序性/自动排序——红黑树TreeSet

3. LIFO排队 or FIFO撤销/匹配——队列与栈

4. 滑动/局部最值——单调栈/单调队列

#### 三、范围与区间——从点升级到面

1. 区间静态查询（和或最值RMQ）——前缀和、稀疏表/ST表

2. 单点修改\+区间查询（改第i个数，查询区间和）——树状数组O\(logn\)

3. 区间修改\+区间查询（改区间内所有数）——线段树O\(logn\) 懒标记延迟更新

4. 静态区间频次（查区间内数字x出现了几次）——哈希表（存下标数组）\+二分查找

#### 四、关系与集合——图论与拓扑解决“连接”、“分类”或“依赖”关系

1. 动态连通性/分类——并查集Union\-FInd路径压缩

2. 邻居遍历/拓扑关系——邻接表、邻接图

3. 层次遍历与最短路径——BFS、Dijkstra算法

#### 五、字符串与序列

1. 前缀匹配/词频统计——字典树O\(L\)

2. 子串匹配——KMP、字符串哈希

### 3. 不同算法的实际应用

排序

查找

字符串

线性结构

树结构

堆结构

散列结构

图结构

递归

## 二、基础语法与STL备忘录

### 1. 错题本思考

#### 变量名与模拟的方向

很重要，可以减少多变量对应的关系，尽量使用同一组的r、rows来区分。

#### 思路的方向

for循环可以做的事：

- 两个以上指针的遍历

- 构建数组、哈希表

时间与空间

#### 边界情况

考虑边界情况：第一步思考排除边界情况、最后一步重新审查边界情况。

是否错误覆盖

原地算法

### 2. 草稿本

1\.29 什么时候可以不用Comparable

### 3. C++ 常用STL



```C++
vector, 变长数组，倍增的思想
    size()  返回元素个数
    empty()  返回是否为空
    clear()  清空
    front()/back()
    push_back()/pop_back()
    begin()/end()
    []
    支持比较运算，按字典序

pair<int, int>
    first, 第一个元素
    second, 第二个元素
    支持比较运算，以first为第一关键字，以second为第二关键字（字典序）

string，字符串
    size()/length()  返回字符串长度
    empty()
    clear()
    substr(起始下标，(子串长度))  返回子串
    c_str()  返回字符串所在字符数组的起始地址

queue, 队列
    size()
    empty()
    push()  向队尾插入一个元素
    front()  返回队头元素
    back()  返回队尾元素
    pop()  弹出队头元素

priority_queue, 优先队列，默认是大根堆
    size()
    empty()
    push()  插入一个元素
    top()  返回堆顶元素
    pop()  弹出堆顶元素
    定义成小根堆的方式：priority_queue<int, vector<int>, greater<int>> q;

stack, 栈
    size()
    empty()
    push()  向栈顶插入一个元素
    top()  返回栈顶元素
    pop()  弹出栈顶元素

deque, 双端队列
    size()
    empty()
    clear()
    front()/back()
    push_back()/pop_back()
    push_front()/pop_front()
    begin()/end()
    []

set, map, multiset, multimap, 基于平衡二叉树（红黑树），动态维护有序序列
    size()
    empty()
    clear()
    begin()/end()
    ++, -- 返回前驱和后继，时间复杂度 O(logn)

    set/multiset
        insert()  插入一个数
        find()  查找一个数
        count()  返回某一个数的个数
        erase()
            (1) 输入是一个数x，删除所有x   O(k + logn)
            (2) 输入一个迭代器，删除这个迭代器
        lower_bound()/upper_bound()
            lower_bound(x)  返回大于等于x的最小的数的迭代器
            upper_bound(x)  返回大于x的最小的数的迭代器
    map/multimap
        insert()  插入的数是一个pair
        erase()  输入的参数是pair或者迭代器
        find()
        []  注意multimap不支持此操作。 时间复杂度是 O(logn)
        lower_bound()/upper_bound()

unordered_set, unordered_map, unordered_multiset, unordered_multimap, 哈希表
    和上面类似，增删改查的时间复杂度是 O(1)
    不支持 lower_bound()/upper_bound()， 迭代器的++，--

bitset, 圧位
    bitset<10000> s;
    ~, &, |, ^
    >>, <<
    ==, !=
    []

    count()  返回有多少个1

    any()  判断是否至少有一个1
    none()  判断是否全为0

    set()  把所有位置成1
    set(k, v)  将第k位变成v
    reset()  把所有位变成0
    flip()  等价于~
    flip(k) 把第k位取反
```

## 三、数据结构与核心算法模版

### 按照实际问题分类

#### 二分问题



> 对答案取值范围在1\-1^9的问题二分
> 
>

#### 前缀和\&\&差分

#### DFS搜索

整数拆分

#### BFS搜索

#### 区间问题

区间覆盖

```Plain Text
# 贪心有序性很重要
# 遇到不符合规定的数多数了
# e.g. 11, 47  S=21 33, 45
# s = furthest 不对，至少要同一个点衔接
# 每次必须尝试循环，提前break错误情况，而不是最后处理，因为出现target：1 1 ，2 2情况
# 还有一种错误可能是1 5： -1 2 2 4 错误但是完成了循环

s, t = map(int, input().split())
n = int(input())
q = []
for _ in range(n):
    a, b = map(int, input().split())
    q.append((a, b))

q.sort(key=lambda X:X[0])

# for i in range(n):
#     print(f"{q[i][0]}, {q[i][1]}")

res = 0
tmp = ()
flag = False
i = 0
while(i < n):
    j = i
    furthest = -2e9
    while j < n and q[j][0] <= s:
        # if q[j][1] > furthest: tmp = q[j]
        furthest = max(furthest, q[j][1])
        j+=1
    i=j
    # print(f"[{tmp[0]},{tmp[1]}]")
    if furthest < s:
        res = -1
        break
    res += 1
    # 更新成功时res才更新，如果已经结束提前break
    s = furthest

    if furthest >= t: 
        flag = True
        break

if flag:
    print(res)
else: 
    print(-1)
```

连续区间和

```Plain Text
#include <iostream>
#include <algorithm>
#include <stdlib.h>

using namespace std;

const int N = 1e5 + 10;

int m, n, tr[N], a[N];

int lowbit(int x)
{
    return x & -x;
}

void add(int pos, int x)
{
    for(int i = pos; i <= n; i += lowbit(i))
        tr[i] += x;
}

int query(int p1, int p2)
{
    int res1 = 0, res2 = 0;
    for (int i = p1; i > 0; i -= lowbit(i))
        res1 += tr[i];
    for (int i = p2; i > 0; i -= lowbit(i))
        res2 += tr[i];
    return res2 - res1;
}

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++)
    {
        scanf("%d", &a[i]);
        add(i, a[i]);
    }

    while(m --)
    {
        int choice, a, b;
        scanf("%d %d %d" , &choice, &a, &b);
        if(choice == 0) printf("%d\n", query(a - 1, b));

        if(choice == 1) 
            add(a, b);
    }
    return 0;
}
```



数列区间最大值

```Plain Text
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>
#include <climits>

using namespace std;

const int N = 100010;

int n, m;
int w[N];
struct Node
{
    int l, r;
    int maxv;
}tr[N * 4];

void build(int u, int l, int r)
{
    if (l == r) tr[u] = {l, r, w[r]};
    else
    {
        tr[u] = {l, r};
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        tr[u].maxv = max(tr[u << 1].maxv, tr[u << 1 | 1].maxv);
    }
}

int query(int u, int l, int r)
{
    if (tr[u].l >= l && tr[u].r <= r) return tr[u].maxv;
    int mid = tr[u].l + tr[u].r >> 1;
    int maxv = INT_MIN;
    if (l <= mid) maxv = query(u << 1, l, r);
    if (r > mid) maxv = max(maxv, query(u << 1 | 1, l, r));
    return maxv;
}

int main()
{
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i ++ ) scanf("%d", &w[i]);

    build(1, 1, n);

    int l, r;
    while (m -- )
    {
        scanf("%d%d", &l, &r);
        printf("%d\n", query(1, l, r));
    }

    return 0;
}
```

#### 滑动窗口

滑动窗口

```Plain Text
import java.util.*;
import java.io.*;

public class Main {
    static int n, m, N = 1000010;
    static int[] a = new int[N];
    static Deque<Integer> q = new LinkedList<>();
    public static void main(String[] args) throws Exception{
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        StringBuilder sb = new StringBuilder();
        String[] s = br.readLine().split(" ");
        n = Integer.parseInt(s[0]);
        m = Integer.parseInt(s[1]);
        String[] str = br.readLine().split(" ");
        for (int i = 0; i < n; i ++) a[i] = Integer.parseInt(str[i]);

        // 求最小值
        for (int i = 0; i < n; i ++) {
            while(q.size() != 0 && q.peekLast() > a[i]) q.pollLast();
            q.offerLast(a[i]);
            // 离开窗口则出队
            if (i >= m && q.peekFirst() == a[i - m]) q.pollFirst();
            // 到了一个窗口大小则输出
            if (i >= m - 1) sb.append(q.peekFirst()).append(' ');
        }
        q.clear();
        sb.append('\n');

        for (int i = 0; i < n; i ++) {
            while(q.size() != 0 && q.peekLast() < a[i]) q.pollLast();
            q.offerLast(a[i]);
            // 离开窗口则出队
            if (i >= m && q.peekFirst() == a[i - m]) q.pollFirst();
            // 到了一个窗口大小则输出
            if (i >= m - 1) sb.append(q.peekFirst()).append(' ');
        }
        bw.write(sb.toString());
        bw.flush();
        bw.close();

    }
}
```

#### 并查集



集合==根节点的操作：集合标志，集合size，查询是否在集合。

食物链

```Plain Text
import java.util.*;
import java.io.*;

public class Main {
    static int n, m, N = 1000010;
    static int[] a = new int[N];
    static Deque<Integer> q = new LinkedList<>();
    public static void main(String[] args) throws Exception{
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        StringBuilder sb = new StringBuilder();
        String[] s = br.readLine().split(" ");
        n = Integer.parseInt(s[0]);
        m = Integer.parseInt(s[1]);
        String[] str = br.readLine().split(" ");
        for (int i = 0; i < n; i ++) a[i] = Integer.parseInt(str[i]);

        // 求最小值
        for (int i = 0; i < n; i ++) {
            while(q.size() != 0 && q.peekLast() > a[i]) q.pollLast();
            q.offerLast(a[i]);
            // 离开窗口则出队
            if (i >= m && q.peekFirst() == a[i - m]) q.pollFirst();
            // 到了一个窗口大小则输出
            if (i >= m - 1) sb.append(q.peekFirst()).append(' ');
        }
        q.clear();
        sb.append('\n');

        for (int i = 0; i < n; i ++) {
            while(q.size() != 0 && q.peekLast() < a[i]) q.pollLast();
            q.offerLast(a[i]);
            // 离开窗口则出队
            if (i >= m && q.peekFirst() == a[i - m]) q.pollFirst();
            // 到了一个窗口大小则输出
            if (i >= m - 1) sb.append(q.peekFirst()).append(' ');
        }
        bw.write(sb.toString());
        bw.flush();
        bw.close();

    }
}
```

#### DP动态规划

##### 1. 线性dp

1. 数字三角形
2. 最长上升子序列\+优化 max
3. 最长公共子序列 max
4. 修改
5.
6. 乌龟棋 max

状态表示：形如树，\[1\]\[2\]\[3\]\[4\]四种方案组合数最后落点与顺序无关，中间态怎么选会产生最大值

初始值，最后写，看看有没有被算过。

##### 2. 背包问题

1. 01背包
2. 完全背包

### 数据结构

#### 链表

1. 相交链表：哈希=>数学
2. 反转链表：遍历
3. 回文链表：递归从右往左打印

#### 树状数组



单点修改和区间查询都是\(logn\), 相比前缀和更适合多次修改



```C
int tr[N];

int lowbit(int x)
{
    return x & -x;
}


void add(int x, int a)
{
    for(int i = x; i < N; i += lowbit(x))
        tr[i] += a;
}


int query(int x)
{
    int res = 0;
    for(int i = x; i; i -= lowbit(x))
        res += tr[i];
    return res;
}
```

#### 线段树



```C
struct Node
{
    int l, r;
    int maxv; //int sum;
}tr[4 * N];


void pushup(int u)//利用它的两个儿子来算一下它的当前节点信息
{
    tr[u].maxv = max(tr[u << 1].maxv, tr[u << 1 | 1].maxv);//左儿子 u<<1 ,右儿子 u<<1|1
}

void build(int u, int l, int r)
{
    if(l == r) tr[u] = {l, r, a[l]};    //赋值叶结点
    else 
    {
        tr[u] = {l, r};
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

int query(int u, int l, int r)
{
    if(tr[u].l >= l && tr[u].r <= r) return tr[u].sum;
    int mid = tr[u].l + tr[u].r >> 1;
    int sum = 0;
    if(mid >= l) sum += query(u << 1, l, r);
    if(r >= mid + 1) sum += query(u << 1 | 1, l, r);
    return tr[u].sum;
}

void modify(int u, int x, int v)
{
    if(tr[u].l == tr[u].r) tr[u].sum += v;
    else
    {
    int mid = tr[u].l + tr[u].r >> 1;
    if(x <= mid) modify(u << 1, x, v);
    else modify(u << 1 | 1, x, v);
    pushup(u);
    }
}
```



基础算法：

排序算法

统一以升序为列



冒泡排序

思路： 相邻数如果左边的比右边的大，交换两个相邻数



void effervescence\_sort\(int q\[\] , int n\)\{

for\(int i = 0; i \< n; i\+\+\) \{

for\(int j = n \- 1; j \>= i; j\-\-\) \{

if\(q\[j\] \< q\[j \- 1\]\) swap\(q\[j\], q\[j \- 1\]\);

\}

\}

\}

选择排序

思路： 每次（第i次）访问找到当前最小值，放在第i个位置，执行n次



void select\(int q\[\], int n\)\{

for\(int i = 0; i \< n; i\+\+\) \{

int mi = q\[i\];

int idx = i;

for\(int j = i; j \< n; j\+\+\) \{

if\(mi \> q\[j\]\) \{

mi = q\[j\];

idx = j;

\}

\}

swap\(q\[i\], q\[idx\]\);

\}

\}

快速排序

思路： 先选定一个区间内的随机值（本做法选最左端），用其作为标准，然后遍历区间一个指针在最左端，一个在最右端，往中间靠拢，大于标准的放在右边，小于标准的放在左边，然后重复递归左右区间



void quick\_sort\(int q\[\], int l, int r\)\{

if\(l \>= r\) return ;

int x = q\[l\], i = l \- 1, j = r \+ 1;

while\(i \< j\) \{

do i\+\+; while\(q\[i\] \< x\);

do j\-\-; while\(q\[j\] \> x\);

if\(i \< j\) swap\(q\[i\], q\[j\]\);

\}

quick\_sort\(q, l, j\);

quick\_sort\(q, j \+ 1, r\);

\}

归并排序

思路：把数组从中间拆开，继续递归左右两个数组，每次排序当前数组之前，拆分的左右区间都已经排好序，通过双指针排当前数组，直到完成排序



int q\[N\], tmp\[N\]; // q原数组， tmp辅助数组



void merge\_sort\(int q\[\], int l, int r\)\{

if\(l \>= r\) return ;

int mid = l \+ r \>\> 1;

merge\_sort\(q, l, mid\), merge\_sort\(q, mid \+ 1, r\);



int k = 0, i = l, j = mid \+ 1;

while\(i \<= mid \&\& j \<= r\) \{

if\(q\[i\] \<= q\[j\]\) tmp\[k\+\+\] = q\[i\+\+\];

else tmp\[k\+\+\] = q\[j\+\+\];

\}

while\(i \<= mid\) tmp\[k\+\+\] = q\[i\+\+\];

while\(j \<= r\) tmp\[k\+\+\] = q\[j\+\+\];

for\(i = l, j = 0; i \<= r; i\+\+, j\+\+\) q\[i\] = tmp\[j\];



\}

传送门

785. 快速排序 \- AcWing题库

    

二分，三分

二分

思路： 对升序的数组而言，直接找中间值就可以进行折中判断，最多次数为log\(n\)次



整形二分

又分为左查找和右查找，以应付数组中有多个该值



int find\_left\(int x\) \{ // 左查找

int l = 0, r = n \- 1;

while\(l \< r\) \{

int mid = l \+ r \>\> 1;

if\(a\[mid\] \>= x\) r = mid;

else l = mid \+ 1;

\}

if\(a\[l\] == x\) return l;

return \-1;

\}



int find\_right\(int x\) \{ // 右查找

int l = 0, r = n \- 1;

while\(l \< r\) \{

int mid = l \+ r \+ 1 \>\> 1;

if\(a\[mid\] \<= x\) l = mid;

else r = mid \- 1;

\}

if\(a\[l\] == x\) return l;

return \-1;

\}

浮点二分

浮点直接查找即可



// 求它的三次方根

double find\(double x\) \{

double l = 0, r = 1e18;

while\(r \- l \> 1e\-18\) \{

double mid = \(l \+ r\) / 2;

if\(mid \* mid \* mid \> x\) r = mid;

else l = mid;

\}

return l;

\}

浮点二分可以说是整形二分的简化版



传送门

整形：789\. 数的范围 \- AcWing题库



浮点：790\. 数的三次方根 \- AcWing题库



三分

while\(r \- l \> eps\) \{

double k = \(r \- l\) / 3\.0;

double mid1 = l \+ k, mid2 = r \- k;

if\(f\(mid1\) \> f\(mid2\)\) r = mid2;

else l = mid1;

\}

前缀和，差分

他们两的关系太好了所以放一起



前缀和

可以快速查询区间和



思路：把数组依次累加，a为原数组，s为前缀和数组



构造



一维前缀和

构造：



for\(int i = 1; i \<= n; i\+\+\) s\[i\] = s\[i \- 1\] \+ a\[i\];

查询：



cout \<\< s\[i\] \- s\[j\];

二维前缀和

构造：



for\(int i = 1; i \<= n; i \+\+ \)

for\(int j = 1; j \<= m; j \+\+ \)

s\[i\]\[j\] = s\[i \- 1\]\[j\] \+ s\[i\]\[j \- 1\] \-s\[i \- 1\]\[j \- 1\] \+ a\[i\]\[j\];

查询：



cout \<\< s\[x2\]\[y2\] \- s\[x1 \- 1\]\[y2\] \- s\[x2\]\[y1 \- 1\] \+s\[x1 \- 1\]\[y1 \- 1\] \<\< endl;

双指针

思路： 遍历数组时，一个指针移动，另外一个指针保持不动，直到满足要求停止前一个指针移动



找a,b中相同的元素



int sum = 0, j = 0;

for\(int i = 0; i \< n; i\+\+\) \{

while\(j \< m \&\& b\[j\] \< a\[i\]\) j\+\+;

if\(b\[j\] == a\[i\]\) sum\+\+;

\}

找数组元素的目标和



for\(int i = 0, j = m \- 1; i \< n; i \+\+ \)\{

while\(j \>= 0 \&\& a\[i\] \+ b\[j\] \> x\) j \-\-;

if\(a\[i\] \+ b\[j\] == x\) cout \<\< i \<\< " " \<\< j \<\< endl;

\}

传送门

799. 最长连续不重复子序列 \- AcWing题库

    

799. 最长连续不重复子序列 \- AcWing题库

    

离散化

思路： 一个数组的值过大，但是我们只需要用到其中间的大小关系的时候，我们就需要用到离散化，将其大小关系保留，映射到1\~n



void work\(int a\[\]\) \{

for\(int i = 0; i \< n; i \+\+ \) p\[i\] = i;

sort\(p, p \+ n, \[\&\]\(int x, int y\) \{

return a\[x\] \< a\[y\];

\}\);

for\(int i = 0; i \< n; i \+\+ \) a\[p\[i\]\] = i; 

\}

传送门

505. 火柴排队 \- AcWing题库

    

位运算

将一个数以二进制表示，就能够通过0，1来解决很多事情



思路： 通过\&，^，\|等二进制常用符号实现位运算



求一个数变为2进制后1的个数



int lowbit\(int x\) \{

return x \& \-x;

\}



int main\(\) \{

int res = 0;

int x; cin \>\> x;

while\(x\) x \-= lowbit\(x\) , res \+\+;

\}

传送门

801. 二进制中1的个数 \- AcWing题库

    

高精度

高精度加法

思路：通过动态数组，将个位数放在数组的第一个位置，往后处理，每位要同时加上进位t / = 10



vector\<int\> add\(vector\<int\> \&A, vector\<int\> \&B\) \{

vector\<int\> C;

int t = 0;

for\(int i = 0; i \< A\.size\(\) \|\| i \< B\.size\(\); i\+\+\) \{

if\(i \< A\.size\(\)\) t \+= A\[i\];

if\(i \< B\.size\(\)\) t \+= B\[i\];

C\.push\_back\(t % 10\);

t /= 10;

\}



if\(t\) C\.push\_back\(1\);

return C;



\}

高精度减法

思路：判断两个数的大小，减数小则为正，否则为负，同时判断是否需要借位和有无被借位，处理完后判断有无前导零



bool cmp\(vector\<int\> \&a, vector\<int\> \&b\)\{

if\(a\.size\(\) \!= b\.size\(\)\) return a\.size\(\) \> b\.size\(\);

for\(int i = a\.size\(\) \- 1; i \>= 0; i \-\- \)\{

if\(a\[i\] \!= b\[i\]\) return a\[i\] \> b\[i\];

\}

return true;

\}



vector\<int\> sub\(vector\<int\> \&a, vector\<int\> \&b\)\{

vector\<int\> c;

int t = 0;

for\(int i = 0; i \< a\.size\(\); i \+\+ \)\{

t = a\[i\] \- t;

if\(i \< b\.size\(\)\) t \-= b\[i\];

c\.push\_back\(\(t \+ 10\) % 10\);

if\(t \< 0\) t = 1;

else t = 0;

\}

while\(c\.size\(\) \> 1 \&\& c\.back\(\) == 0\) c\.pop\_back\(\);



return c;



\}

高精度乘法

思路： 优先考虑乘法的效果，个位乘十位，答案会在十位上，百位成百位，答案会在万位上，那么处理每一位，最后在处理进位即可



vector\<int\> mul\(vector\<int\> \&A, vector\<int\> \&B\) \{

vector\<int\> C\(A\.size\(\) \+ B\.size\(\) \+ 5, 0\);

for \(int i = 0; i \< A\.size\(\); i\+\+\)

for \(int j = 0; j \< B\.size\(\); j\+\+\)

C\[i \+ j\] \+= A\[i\] \* B\[j\];

int t = 0;

for \(int i = 0; i \< C\.size\(\); i\+\+\) \{

t \+= C\[i\];

C\[i\] = t % 10;

t /= 10;

\}

while \(C\.size\(\) \> 1 \&\& C\.back\(\) == 0\) C\.pop\_back\(\);

return C;

\}

高精度除法

思路： 优先考虑乘法的效果，个位乘十位，答案会在十位上，百位成百位，答案会在万位上，那么处理每一位，最后在处理进位即可



bool cmp\(vector\<int\> \&A, vector\<int\> \&B\)\{

if\(A\.size\(\) \!= B\.size\(\)\) return A\.size\(\) \> B\.size\(\);

for\(int i = A\.size\(\) \- 1; i \>= 0; i\-\-\)\{

if\(A\[i\] \!= B\[i\]\) return A\[i\] \> B\[i\];

\}

return true;

\}



vector\<int\> sub\(vector\<int\> \&A, vector\<int\> \&B\)\{

vector\<int\> C;

int t = 0;

for\(int i = 0;i \< A\.size\(\) \|\| t; i\+\+\)\{

t = A\[i\] \- t;

if\(i \< B\.size\(\)\) t \-= B\[i\];

C\.push\_back\(\(t \+ 10\) % 10\);

if\(t \< 0\) t = 1;

else t = 0;

\}

while\(C\.size\(\) \> 1 \&\& C\.back\(\)==0\) C\.pop\_back\(\);

return C;

\}



vector\<int\> div\(vector\<int\> \&A, vector\<int\> \&B, vector\<int\> \&r\)\{

vector\<int\> C;

if\(\!cmp\(A, B\)\)\{

C\.push\_back\(0\);

r = A;

return C;

\}

int j = B\.size\(\);

r\.assign\(A\.end\(\) \- j, A\.end\(\)\);

while\(j \<= A\.size\(\)\)\{

int k = 0;

while\(cmp\(r, B\)\)\{

vector\<int\> s = sub\(r, B\);

r\.clear\(\);

r\.assign\(s\.begin\(\), s\.end\(\)\);

k\+\+;

\}

C\.push\_back\(k\);

if\(j \< A\.size\(\)\) r\.insert\(r\.begin\(\), A\[A\.size\(\) \- j \- 1\]\);

if\(r\.size\(\) \> 1 \&\& r\.back\(\) == 0\) r\.pop\_back\(\);

j\+\+;

\}

reverse\(C\.begin\(\),C\.end\(\)\);

while\(C\.size\(\) \> 1 \&\& C\.back\(\) == 0\) C\.pop\_back\(\);

return C;

\}

注（出处）：AcWing 794\. 高精度除法 （A/B） C\+\+实现 \- AcWing



传送门

791. 高精度加法 \- AcWing题库

    

792. 高精度减法 \- AcWing题库

    

793. 高精度乘法 \- AcWing题库

    

794. 高精度除法 \- AcWing题库

    

STL：

List

定义：

list\<int\> node;

常用函数：

node\.push\_back\(\);  // 插入



list\<int\>::iterator it = node\.begin\(\);

for\(it; it \!= node\.end\(\); it\+\+\) // 遍历

cout \<\< \*it \<\< " "; // 输出



node\.erase\(it\); // 删除该位置

Queue

定义方式：

queue \<Type, Container\> 名称;

创建队列 ：



queue \<int\> q;

queue \<char\> q;

queue\<string\> q;

常用函数

q\.push\(\) // 队尾插入元素

q\.pop\(\) // 删除队头元素

q\.size\(\) // 返回元素个数

q\.empty\(\) // 空队列返回true

q\.front\(\) // 返回队列第一个元素

q\.back\(\) // 发挥队列最后一个元素

Stack

定义方式：

stack\<Type\> st; 

常用函数：

st\.push\(item\); // 插入

st\.top\(\); // 访问栈顶

st\.pop\(\); // 弹出栈顶

s\.size\(\); // 栈大小

s\.empty\(\); // 是否为空

Map：

定义方式：

map\<Type1, Type2\> 名称;

创建map：



map\<int, int\> mp;

map\<string, int\> mp;

map\<pair\<int,int\>, int\> mp;

常用函数：

mp\.insert\(\); // 向map内插入一个元素

mp\.find\(\); // 查找一个元素， 返回值是key

mp\.clear\(\); // 清空map

mp\.erase\(\); // 删除一个元素

mp\.size\(\); // 返回map的个数

Set:

定义方式：

set \<Type\> 名称;

创建set:



set \<int\> se;

set \<string\> se;

常用函数：

se\.begin\(\); // 返回set的第一个元素

se\.end\(\); // 返回set的最后一个元素

se\.clear\(\); // 清空set

se\.empty\(\); // 若set不含元素，返回true

se\.max\_size\(\); // 返回set可能包含的元素的最大个数

se\.size\(\); // 返回当前set的元素个数

Vector：

定义方式：

vector\<Type\> 名称; // 一维

vector\<vector\<Type\>\> 名称 // 二维

二维初始化



a\.resize\(n \+ 1, vector\<char\>\(m \+ 1\)\);

st\.resize\(n \+ 1, vector\<bool\>\(m \+ 1, false\)\);

常用函数：

可以当成数组直接使用，有些函数故此不描述



a\.size\(\); // 大小

a\.clear\(\); // 清空

sort\(a\.begin\(\), a\.end\(\)\); // 排序

Priority\_queue

定义方式：

priority\_queue\<Type, Container, Functional\> 名称;

换而言之，先申明类型，选择存储容器类型，最后是一个表示升降的函数



创建优先队列 ：\(大根堆\)



priority\_queue \<int\> q;  // 不写默认大根堆

priority\_queue \<int, vector\<int\>, less\<int\>\> q;

创建优先队列 ：\(小根堆\)



priority\_queue\<int, vector\<int\>, greater\<int\>\> q;

创建优先队列时，如果int写的是pair\<int, int\>，先比较第一个，第一个相等的情况下比较第二个



常用函数 ：

q\.top\(\); // 访问队头元素

q\.empty\(\); // 队列是否为空

q\.size\(\); // 返回队列内元素个数

q\.push\(\); // 插入元素

q\.push\(\{a,b\}\); // pair插入

q\.emplace\(\); // 构造一个元素并插入队列

q\.pop\(\); // 弹出队头元素

q\.swap\(\); // 交换内容

字符串：

KMP

详解：KMP算法讲解\-CSDN博客



\#include\<iostream\>

using namespace std;



const int N = 1e5 \+ 10, M = 1e6 \+ 10;



int n, m;

char p\[N\], s\[M\];

int ne\[N\];



int main\(\)\{

cin \>\> n \>\> p \+ 1 \>\> m \>\> s \+ 1;

for\(int i = 2, j = 0; i \<= n; i \+\+ \)\{

while\(j \&\& p\[i\] \!= p\[j \+ 1\]\) j = ne\[j\];        if\(p\[i\] == p\[j \+ 1\]\) j \+\+;

ne\[i\] = j;

\}



for\(int i = 1, j = 0; i \<= m; i \+\+ \)\{

while\(j \&\& s\[i\] \!= p\[j \+ 1\]\) j = ne\[j\];

if\(s\[i\] == p\[j \+ 1\]\) j \+\+ ;

if\(j == n\)\{

cout \<\< i \- n \<\< ' ';

j = ne\[j\];

\}

\}

return 0;



\}

传送门

831. KMP字符串 \- AcWing题库

    

字符哈希

给定一个长度为 n 的字符串，再给定 m 个询问，每个询问包含四个整数 l1,r1,l2,r2，请你判断 \[l1,r1\]和 \[l2,r2\]这两个区间所包含的字符串子串是否完全相同。



思路： P进制来存储前缀和，然后访问区间通过乘除



\#include \<iostream\>

\#include \<algorithm\>



using namespace std;



typedef unsigned long long ULL;



const int N = 100010, P = 131;



int n, m;

char str\[N\];

ULL h\[N\], p\[N\];



ULL get\(int l, int r\) \{

return h\[r\] \- h\[l \- 1\] \* p\[r \- l \+ 1\];

\}



int main\(\)

\{

scanf\("%d%d", \&n, \&m\);

scanf\("%s", str \+ 1\);



p\[0\] = 1;

for \(int i = 1; i \<= n; i \+\+ \)

\{

h\[i\] = h\[i \- 1\] \* P \+ str\[i\];

p\[i\] = p\[i \- 1\] \* P;

\}

while \(m \-\- \)

\{

int l1, r1, l2, r2;

scanf\("%d%d%d%d", \&l1, \&r1, \&l2, \&r2\);

if \(get\(l1, r1\) == get\(l2, r2\)\) puts\("Yes"\);

else puts\("No"\);

\}

return 0;



\}

传送门

841. 字符串哈希 \- AcWing题库

    

字典树

应用：



字符串检索

词频统计

字典序排序

前缀匹配

构造：



struct TrieNode \{

\<Type\> data;

bool isEndOfWord;

TrieNode \*children\[SIZE\];

\}

\#include \<bits/stdc\+\+\.h\>

using namespace std;



const int N = 800000;



struct node \{

bool repeat;

int son\[26\];

int num;

bool isend;

\} t\[N\];



int cnt = 1;

void Insert\(char \*s\) \{

int now = 0;

for\(int i = 0; s\[i\]; i\+\+\) \{

int ch = s\[i\] \- 'a';

if\(t\[now\]\.son\[ch\] == 0\)

t\[now\]\.son\[ch\] = cnt\+\+;

now = t\[now\]\.son\[ch\];

t\[now\]\.num\+\+;

if\(i == strlen\(s\) \- 1\) t\[now\]\.isend = true;

\}

\}



int Find\(char \*s\) \{

int now = 0;

for\(int i = 0; s\[i\]; i\+\+\) \{

int ch = s\[i\] \- 'a';

if\(t\[now\]\.son\[ch\] == 0\) return 3;

now = t\[now\]\.son\[ch\];

\}

if\(t\[now\]\.isend == false\) return 3;

if\(t\[now\]\.num == 0\) return 3;

if\(t\[now\]\.repeat == false\) \{

t\[now\]\.repeat = true;

return 1;

\}

return 2;

\}



int main\(\) \{

char s\[51\];

int n;

cin \>\> n;

while\(n\-\-\) \{

cin \>\> s;

Insert\(s\);

\}

int m;

cin \>\> m;

while\(m\-\-\) \{

cin \>\> s;

int r = Find\(s\);

if\(r == 1\) cout \<\< "OK\\n";

else if\(r == 2\) cout \<\< "REPEAT\\n";

else if\(r == 3\) cout \<\< "WRONG\\n";

\}

return 0;

\}

传送门

洛谷 P2580



搜索

DFS

深度优先搜索，换而言之就是递归遍历



思路： 递归遍历，同时进行\[HTML\_REMOVED\]标记已经用过的点\[HTML\_REMOVED\]，递归下一次，同时如果遍历结束要\[HTML\_REMOVED\]恢复现场\[HTML\_REMOVED\]



全排列



void dfs\(int u\)\{

if\(u == n\)\{

for\(int i = 0; i \< n; i \+\+ \) cout \<\< path\[i\] \<\< " ";

cout \<\< endl;

return;

\}



for\(int i = 1; i \<= n; i \+\+ \)\{

if\(st\[i\] == false\) \{

path\[u\] = i;

st\[i\] = true;

dfs\(u \+ 1\);

st\[i\] = false;

\}

\}



\}

传送门

842. 排列数字 \- AcWing题库

    

BFS

宽度优先搜素，换而言之就是遍历完当前情况在遍历下一重情况



思路： 重重遍历，把当前状态的所有情况考虑完，在考虑下一种情况，不需要恢复现场，常用于最短路径搜索



走迷宫



\#include \<bits/stdc\+\+\.h\>

using namespace std;



typedef pair\<int, int\> PII;



const int N = 110;



int n, m;

int g\[N\]\[N\], d\[N\]\[N\];



int bfs\(\) \{

queue\<PII\> q;



memset\(d, \-1, sizeof d\);

d\[0\]\[0\] = 0;

q\.push\(\{0, 0\}\);

int dx\[4\] = \{\-1, 0, 1, 0\}, dy\[4\] = \{0, 1, 0, \-1\};

while\(q\.size\(\)\) \{

PII t = q\.front\(\);

q\.pop\(\);

for\(int i = 0; i \< 4; i\+\+\) \{

int x = t\.first \+ dx\[i\], y = t\.second \+ dy\[i\];

if\(x \< 0 \|\| y \< 0 \|\| x \>= n \|\| y \>= m\) continue;

if\(d\[x\]\[y\] == \-1 \&\& g\[x\]\[y\] == 0\) \{

d\[x\]\[y\] = d\[t\.first\]\[t\.second\] \+ 1;

q\.push\(\{x, y\}\);

\}

\}

\}

return d\[n \- 1\]\[m \- 1\];



\}



int main\(\)

\{

cin \>\> n \>\> m;

for \(int i = 0; i \< n; i \+\+ \)

for \(int j = 0; j \< m; j \+\+ \)

cin \>\> g\[i\]\[j\];



cout \<\< bfs\(\) \<\< endl;

return 0;



\}

BFS通常和优先队列一起使用



传送门

842. 排列数字 \- AcWing题库

    

844. 走迷宫 \- AcWing题库

    

搜素的题目很多，因为可以和很多算法结合在一起考虑



双向广搜

思路： 双向广搜（BFS）可以让搜索的情况变少，（一个圆的半径是6，搜索到边界的探寻面积就是3\.14\*36，但是两个圆的半径是3，两个圆的探寻面积才3\.14 \* 9 \* 2）



void two\_BFS\(int s, int f\) \{ // s起点 f终点

queue\<int\> a, b;

a\.push\(s\);

b\.push\(f\);

while\(a\.size\(\) \&\& b\.size\(\)\) \{

if\(a\.size\(\) \< b\.size\(\)\) \{

extend\(a\.front\(\)\);

a\.pop\(\);

// 探索a

\}

else \{

extend\(b\.front\(\)\);

b\.pop\(\);

// 探索b

\}

\}

\}

剪枝

把它拿出来单独讲，是因为它同时出现在BFS，DFS中，这里不提具体的代码，但给出几份剪枝样例



剪枝大意： 把已经不满足的情况直接淘汰，不继续遍历



要求遍历从1\~10中所有加起来等于15的情况个数（每个数最多使用一次可不用）（例1\+9\+5，10\+5等等），那么如果说遍历到了1\+9\+6，已经大于15了，我们就没必要继续遍历后面的数了

BFS搜索最短路时，如果当前的路径比之前已经探寻的最短路径长，那么也没有探寻该路径的必要了，剪掉（假设所有路径都是正数）

DFS的剪枝技术：可行性剪枝，搜索顺序剪枝，最优性剪枝，排除等效冗余，记忆化搜索等



BFS的剪枝技术：判重，使用优先队列有时候会产生奇效

### 图论知识



#### 求最短路径

Dijkstra求最短路1

给定一个 n 个点 m 条边的有向图，图中可能存在重边和自环，所有边权均为正值。



请你求出 1 号点到 n号点的最短距离，如果无法从 1 号点走到 n 号点，则输出 −1。



思路： 先找到距离原点1最近的一个点，然后使用该点去更新其他的点，同时对该点进行标记，被标记的点则无需在经过处理（因为本身就是距离原点最近的点了），重复操作直到所有的点都被确定下来，时间复杂度o\(n^2\)\.



```C++
#include<iostream>
#include<cstring>
#include<algorithm>

using namespace std;

const int N = 510;

int g[N][N]; // 图
int dist[N]; // 原点到每一个点的距离
bool st[N]; // 是否已经确定最短距离

int n, m;

int dijkstra()
{
 memset(dist, 0x3f, sizeof dist); // 所有的点的距离全部赋值为最大值
 dist[1] = 0; // 原点本身距离原点为0

for(int i = 0; i < n; i ++ ) {
    int t = -1; 
    for(int j = 1; j <= n; j ++ ) {
        if(!st[j] && (t == -1 || dist[j] < dist[t])) t = j; // 找到未被使用的最小距离（距离原点）
    }
    st[t] = true; // 确定该点的距离不再改变

    for(int j = 1; j <= n; j ++ ) { 
        dist[j] = min(dist[j], dist[t] + g[t][j]); // 用该点更新其他所有点的状态
    }
}

if(dist[n] == 0x3f3f3f3f) return -1;
return dist[n];

}

int main()
{
 cin >> n >> m;
 memset(g, 0x3f, sizeof g); // 初始化图

for(int i = 0; i < m; i ++ )
{
    int a, b, c;
    cin >> a >> b >> c;
    g[a][b] = min(g[a][b], c); // 重边处理
}

cout << dijkstra() << endl;

return 0;

}
```



Dijkstra求最短路2

给定一个 n 个点 m 条边的有向图，图中可能存在重边和自环，所有边权均为非负值。



请你求出 1 号点到 n 号点的最短距离，如果无法从 1 号点走到 n 号点，则输出 −1。



思路： 通过优先队列实现小根堆的操作，每次找到的是一个距离原点最近的值，通过优先队列（操作过程类似于bfs），去遍历整个稀疏图，直到所有的点都已经被遍历到，时间复杂度为o\(mlogn\)，m为边，n为点。



```C++
#include<iostream>
#include<cstring>
#include<algorithm>
#include<queue>

using namespace std;

typedef pair<int, int> PII;

const int N = 1e6 + 10;

int h[N], e[N], ne[N], idx; // 图的存储
int w[N]; // 权重
int dist[N]; // 距离
bool st[N]; // 是否已经确定的最短距离

int n, m;

void add(int a, int b, int c) {
 e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++ ;
}

int dijkstra() {
 memset(dist, 0x3f, sizeof(dist)); // 初始化
 dist[1] = 0;

priority_queue<PII, vector<PII>, greater<PII>> heap; // 优先队列，小根堆，以第一个数大小排序
heap.push({0, 1}); // 将1这个点的距离赋值为0 同时将这个类似于点的东西加入优先队列

while(heap.size()) // 队列不空
{
    PII t = heap.top();
    heap.pop();
    int ver = t.second, distance = t.first; // ver是点， distance 是原点到点的距离

    if(st[ver]) continue; // 会有很多不必要的点加入队列，如果前面出现后面就不需要判断
    st[ver] = true;

    for(int i = h[ver]; i != -1; i = ne[i])
    {
        int j = e[i];
        if(dist[j] > distance + w[i]) // 入队列的条件
        {
            dist[j] = distance + w[i];
            heap.push({dist[j], j}); // 可能会反复入队，但是没有关系
        }
    }
}
if(dist[n] == 0x3f3f3f3f) return -1;
return dist[n];

}

int main()
{
 memset(h, -1, sizeof h);
 cin >> n >> m;

while(m -- ) {
    int a, b, c;
    cin >> a >> b >> c;
    add(a, b, c);
}

cout << dijkstra() << endl;

return 0;

}
```

#### Spfa

给定一个 𝑛 个点 𝑚 条边的有向图，图中可能存在重边和自环， 边权可能为负数。

请你判断图中是否存在负权回路，有则输出Yes，否则No



输入

第一行包含整数 𝑛 和 𝑚。

接下来 𝑚 行每行包含三个整数 𝑥,𝑦,𝑧，表示存在一条从点 𝑥 到点 𝑦 的有向边，边长为 𝑧。



思路：

```C++
#include<iostream>
#include<cstring>
#include<algorithm>
#include<queue>

using namespace std;

const int N = 2010, M = 10010;

int n, m;
int h[N], w[M], e[M], ne[M], idx;
int dist[N], cnt[N];
bool st[N];

void add(int a, int b, int c)
{
 e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++ ;
}

bool spfa()
{
 queue<int> q;

for(int i = 1; i <= n; i ++ ) {
    st[i] = true;
    q.push(i);
}

while(q.size())
{
    int t = q.front();
    q.pop();

    st[t] = false;

    for(int i = h[t]; i != -1; i = ne[i])
    {
        int j = e[i];
        if(dist[j] > dist[t] + w[i])
        {
            dist[j] = dist[t] + w[i];
            cnt[j] = cnt[t] + 1;

            if(cnt[j] >= n) return true;
            if(!st[j]) 
            {
                q.push(j);
                st[j] = true;
            }
        }
    }
}
return false;

}

int main()
{
 cin >> n >> m;
 memset(h, -1, sizeof h);

while(m --) {
    int a, b, c;
    cin >> a >> b >> c;
    add(a, b, c);
}

if(spfa()) puts("Yes");
else puts("No");

return 0;

}
```



传送门



852. spfa判断负环 \- AcWing题库

#### 二分图

1. 二分图：G\(V,E\)，其中可以将V分成两个点集，S和T，边只存在于S与T之间。
2. 匹配：选择S\.u\-\>T\.v这条边，那么这条边就被称为一个匹配边。最大匹配指匹配的边数的最大值。
3. 独立集：一个点集，其中的任意两点都不存在边。最大独立集指独立集的最大点数。
4. 点覆盖：一个点集，二分图的每一条边都至少有一个端点在该点集中。最小点覆盖：最小的点覆盖。
5. 最小路径覆盖：
- 最小不相交路径覆盖：用最少的路径数量包含所有点。其中每个点只能出现在一条路径中。
- 最小相交路径覆盖：用最少的路径数量包含所有点。其中每个点可以多次出现在路径中。
6. 最大团：一个最大的完全子图。
7. 找增广路径的方式： 找增广路的方式


##### 相关证明



1. 最小点覆盖 = 最大匹配

    

    证明：我们可以选择最大匹配的边对应的点，如果此时某条边不是匹配边，那么这条边至少有一个点是匹配边上的点。

    

2. 最大独立集 = 总点数 \- 最大匹配。

    

    证明：可以利用最小点覆盖。在点集中删掉所有匹配边的端点，那么假设此时还存在一条边在剩下的点集中，那么这条边一定可以作为匹配边，即最大匹配应该算上这条边，那么最大匹配就不成立了，所以此时剩下的点集不存在边的关。

    

3. 最小不相交路径覆盖 = 总点数 \- 最大匹配

证明：这里，每个孤立点也算作一条路径。这里把每个点拆成两个点，一个入点，一个出点，初始，每个点都从自己的入点指向出点，那么此时路径数量=点数。这里u \-\> v,可以理解成把u \-\> u and v \-\> v合并成u \-\> v，也就是减少了一条路径数量，所以最多合并了最大匹配数量的这些点，那么剩下的点就只能作为孤立点来处理。



4. 最小相交路径覆盖：先对原图进行传递闭包，原因是，每个点可以出现在多条路径中，建议大家画一画，这里给出一个图供参考，1\-\>2, 2\-\>3, 4\-\>2, 2\-\>5。然后再按照最小不相交路径的方法处理。

    

5. 最大团：最大团 = 补图的最大独立集。这个就很显然了。补图的最大独立集内不存在边的关系，补图的补图，也就是原图，那么补图的最大独立集加上边之后，那么就满足最大团的定义了。

    

##### 匈牙利算法 二分图最大权



```C++
int n1, n2, m;
int h[N], e[M], ne[M], idx;
int match[N];
bool st[N];

void add(int a, int b)
{
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++ ;
}

bool find(int x)
{
    for (int i = h[x]; i != -1; i = ne[i])
    {
        int j = e[i];
        if (!st[j])
        {
            st[j] = true;
            if (match[j] == 0 || find(match[j]))
            {
                match[j] = x;
                return true;
            }
        }
    }

    return false;
}

int main()
{
    scanf("%d%d%d", &n1, &n2, &m);

    memset(h, -1, sizeof h);

    while (m -- )
    {
        int a, b;
        scanf("%d%d", &a, &b);
        add(a, b);
    }

    int res = 0;
    for (int i = 1; i <= n1; i ++ )
    {
        memset(st, false, sizeof st);
        if (find(i)) res ++ ;
    }

    printf("%d\n", res);

    return 0;
}
```

### 数学知识

#### 模运算

优先级

针对大数

加减乘除性质

除法逆运算——逆元

#### 最大公约数与公倍数

两个数的公约数gcd\(a, b\)，通过

#### 质数



判定质数

思路： 从比它小的数中判断其是否为它的约数



技巧： i \<= x / i 可以将o（n\) 的时间复杂度降到o\(sqrt\(n\)\)，同时，不写成i \* i \<= x可以防止i \* i溢出,不写成i \<= sqrt\(n\)可以少每次的sqrt函数调用，减少用时



```C++
bool is_prime(int x){
    if(x < 2) return false;
    for(int i = 2; i <= x / i; i ++ ){
        if(x % i == 0) return false;
    }
    return true;
}
```



分解质因数

思路： 合数一定可以分解为质数相乘，那么将一个数除尽每一个质数即可分解该数



```C++
void divide(int n){
    for(int i = 2; i <= n / i; i++){
        if(n % i == 0){
            int s = 0;
            while(n % i == 0){
                n /= i;
                s ++;
            }
            cout << i << " " << s << endl;
        }
    }
    if(n > 1) cout << n << " 1" << endl;
    cout << endl;
}
筛质数
埃式筛法
思路：一个数如果不是质数，一定会被其前面小于它的质数给筛掉，（合数可以分解为质数相乘），时间复杂度o(nlogn)

```cpp
//primes数组用来存放质数
//st[i], i为质数则为false否则为true
int primes[N], cnt;
bool st[N];

void get_prime(int n){
    for(int i = 2; i <= n; i++){
        if(!st[i]){
            primes[cnt ++ ] = i;
            for(int j = i; j <= n; j += i) st[j] = true;
        }
    }
}
```



线性筛

思路：比埃式筛法快的原因是因为埃式筛法可能会把一个数多次筛掉，而线性筛只筛依次，时间复杂度o\(n\)



```C++
bool st[N];
int primes[N], cnt;

void get_prime(int n){
    for(int i = 2; i <= n; i++){
        if(!st[i]) primes[cnt ++ ] = i;
        for(int j = 0; primes[j] <= n / i; j ++ ){
            st[primes[j] * i] = true;
            if(i % primes[j] == 0) break;
        }
    }
}
```



#### 约数

试除法

思路： 将它所有的约数直接统计并输出



```C++
vector<int> get_divisors(int n){
    vector<int> ans;
    for(int i = 1; i <= n / i; i ++ ) {
        if(n % i == 0) {
            ans.push_back(i);
            if(i != n / i) ans.push_back(n / i);
        }
    }
    sort(ans.begin(), ans.end());
    return ans;
}
```



最大公约数

思路： 辗转相除法（辗转相减法时间复杂度较高）



```C++
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a; // 辗转相除法
}
```



#### 快速幂

纯快速幂

思路： 将b分解为二进制形式，然后遍历二进制，如果该位为1，则乘上a（a是变化的，每一次操作将a扩大成a的平方倍）



```C++
ll qmi(ll a, ll k, ll p)
{
    ll res = 1;
    while(k) 
    {
        if(k & 1) res = res * a % p; 
        k >>= 1; 
        a = a * a % p; // 将a扩大平方倍
    }
    return res;
}
```



#### 快速幂求逆元

逆元：除以一个数求余等于乘上这个逆元再求余



【由于求余法则中没有除法的规定，我们只能通过逆元来求余】



乘法逆元的定义

若整数 b，m 互质，并且对于任意的整数 a，如果满足 b\|a，则存在一个整数 x，使得 a/b≡a×x\(mod m\)，则称 x 为 b 的模 m 乘法逆元，记为 b−1\(mod m\)。



b 存在乘法逆元的充要条件是 b 与模数 m 互质。当模数 m 为质数时，b^m−2即为 b 的乘法逆元。



由此可知，求逆元的方式同快速幂，只需要将指数改为p\-2即可



```C++
#include<iostream>
#include<algorithm>

using namespace std;

typedef long long ll;

ll qmi(ll a, ll b, ll p)
{
    ll res = 1;
    while(b)
    {
        if(b & 1) res = res * a % p;
        a = a * a % p;
        b >>= 1;
    }
    return res;
}

int main()
{
    int n;
    cin >> n;
    while(n -- )
    {
        ll a, p;
        cin >> a >> p;
        if(a % p == 0) cout << "impossible" << endl;
        else cout << qmi(a, p - 2, p) << endl;
    }
    return 0;
}
```







#### 欧拉函数

欧拉函数：1\~N中与N互质的数的个数被称为欧拉函数，记为 ϕ\(N\)。



欧拉函数

公式： phi = 质数分之质数\-1之积



思路： 通过试除法找到质数，然后套用公式



```C++
int phi(int x) {
    int res = x;
    for(int i = 2; i <= x / i; i++) {
        if(x % i == 0) {
            res = res / i * (i - 1);
            while(x % i == 0) x /= i;
        }
    }
    if(x > 1) res = res / x * (x - 1);
    return res;
}
```



筛法求欧拉函数

详解：AcWing 874\. 筛法求欧拉函数 \- AcWing



互质 ：两个数的最大公约数是1



欧拉函数是积性函数



结论：若a与n互质，则a^ϕ\(n\) mod n == 1



```C++
#include<iostream>

using namespace std;

typedef long long ll;

const int N = 1e6 + 10;

int primes[N], cnt;
int phi[N];
bool st[N];

void get_eulers(int n)
{
    phi[1] = 1;
    for(int i = 2; i <= n; i++)
    {
        if(!st[i])
        {
            primes[cnt ++ ] = i;
            phi[i] = i - 1; 
        }
        for(int j = 0; primes[j] <= n / i; j++)
        {
            int t = primes[j] * i;
            st[t] = true;
            if(i % primes[j] == 0)
            {
                phi[t] = phi[i] * primes[j]; 
                break;
            }
            phi[t] = phi[i] * (primes[j] - 1); 
        }
    }
}

int main()
{
    int n;
    cin >> n;
    get_eulers(n);

    ll res = 0;
    for(int i = 1; i <= n; i++) res += phi[i];
    
    cout << res << endl;
    
    return 0;

}
```







#### 扩展欧几里得

扩展欧几里得算法

求出一组x,y，使得a \* x \+ b \* y == gcd\(a, b\)



```C++
void exgcd(int a, int b, int &x, int &y) {
    if(!b) {
        x = 1, y = 0;
        return ;
    }
    exgcd(b, a % b, y, x);
    y = y - a / b * x;
}
```



线性同余方程

求一个x，满足a \* x == b\(mod m\)



思路： 通过扩展欧几里得算法的思想，将题目意思转换为a \* x\+m \* y==gcd\(a, m\)求x，同时如果gcd无法被b整除，则说明无解。



```C++
#include<iostream>
#include<algorithm>

using namespace std;

typedef long long ll;

ll exgcd(ll a, ll b, ll &x, ll &y)
{
    if(!b)
    {
        x = 1, y = 0; // 边界，（或理解为递归的重点）
        return a;
    }
    int d = exgcd(b, a % b, y, x);// y与b对应，x与a对应
    y -= a / b * x;// 公式推导
    return d;
}

int main()
{
    int n;
    cin >> n;
    while(n -- )
    {
        ll a, b, m;
        cin >> a >> b >> m;
        ll x, y;
        ll t = exgcd(a, m, x, y);
        if(b % t) puts("impossible");
        else cout << x * (b / t) % m << endl;
    }
    return 0;
}
```







#### 博弈论

详解：博弈论详解（Nim游戏，台阶\-Nim游戏，集合\-Nim游戏，拆分\-Nim游戏\-CSDN博客



思路： 所有结果在开始的时候就已经注定好了，所以只需要找到这种平衡关系，构造平衡：后手随先手动能够让先手永远处于必输状态



Nim游戏：



n堆石子，两位玩家轮流操作，每次操作可以从任意一堆石子中拿走任意数量的石子（可以拿完，但不能不拿），最后无法进行操作的人视为失败。



```C++
int main()
{
    int n;
    cin >> n;
    int res = 0;
    for(int i = 0; i < n; i ++ )
    {
        int t;
        cin >> t;
        res ^= t;
    }
    if(res) cout << "Yes" << endl;
    else cout << "No" << endl;
    return 0;
}
```



台阶\-Nim游戏：



现在，有一个 n 级台阶的楼梯，每级台阶上都有若干个石子，其中第 i 级台阶上有 ai 个石子\(i≥1\)。两位玩家轮流操作，每次操作可以从任意一级台阶上拿若干个石子放到下一级台阶中（不能不拿）。已经拿到地面上的石子不能再拿，最后无法进行操作的人视为失败。



```C++
int main()
{
    int n;
    cin >> n;
    int res = 0;
    for(int i = 1; i <= n; i ++ )
    {
        int t;
        cin >> t;
        if(i % 2 != 0) res ^= t; 
    }
    if(res) cout << "Yes" << endl;
    else cout << "No" << endl;
    return 0;
}
```

集合\-Nim游戏：



给定 n 堆石子以及一个由 k 个不同正整数构成的数字集合 S。



现在有两位玩家轮流操作，每次操作可以从任意一堆石子中拿取石子，每次拿取的石子数量必须包含于集合 S，最后无法进行操作的人视为失败。



```C++
#include<iostream>
#include<algorithm>
#include<cstring>
#include<unordered_set>
using namespace std;

const int N = 110, M = 10010;

int n, m;
int s[N], f[M];

int sg(int x)
{
    if(f[x] != -1) return f[x]; // 如果已经存在则不需要二次遍历

    unordered_set<int> S; // 定义一个集合存储情况
    for(int i = 0; i < m; i ++ )
    {
        int sum = s[i]; // 每一种取出方式
        if(x >= sum) S.insert(sg(x - sum)); // 如果数量大于这种取出方式，则递归取出了这个方式的情况，同时把这种取出方式的sg值放入集合
    }
    
    for(int i = 0; ; i ++ )
    {
        if(!S.count(i)) return f[x] = i;//s.count(i)，判断集合中是否存在该元素
    }

}

int main()
{
    cin >> m;
    for(int i = 0; i < m; i ++ ) cin >> s[i];
    cin >> n;

    memset(f, -1, sizeof f); // 初始化
    
    int  res = 0;
    for(int i = 0; i < n; i ++ )
    {
        int x;
        cin >> x;
        res ^= sg(x);
    }
    if(res) puts("Yes"); // 如果不为0，说明先手可以变为0从而成为后手，让原来的后手输
    else puts("No");
    
    return 0;

}
```



拆分\-Nim游戏：



给定 n 堆石子，两位玩家轮流操作，每次操作可以取走其中的一堆石子，然后放入两堆规模更小的石子（新堆规模可以为 0，且两个新堆的石子总数可以大于取走的那堆石子数），最后无法进行操作的人视为失败。



辅助理解题意：可以是任意两堆大小的新堆（只要满足堆的石子数量小于取走的即可，两堆放入的总和可以大于取走的）



```C++
#include<iostream>
#include<algorithm>
#include<cstring>
#include<unordered_set>

using namespace std;

const int N = 110;

int n;
int f[N];

int sg(int x)
{
    if(f[x] != -1) return f[x];

    unordered_set<int> S;
    for(int i = 0; i < x; i ++ ) // 两重循环，遍历所有可能的sg情况
    {
        for(int j = 0; j <= i; j ++ ) 
        {
            S.insert(sg(i) ^ sg(j));
        }
    }
    
    for(int i = 0; ; i ++ ) 
    {
        if(!S.count(i)) return f[x] = i;
    }

}

int main()
{
    cin >> n;
    memset(f, -1, sizeof f);

    int res = 0;
    while(n -- )
    {
        int x;
        cin >> x;
        res ^= sg(x);
    }
    
    if(res) puts("Yes");
    else puts("No");
    
    return 0;

}
```

NIM\-拆分

```Plain Text
m = int(input())

li = list(map(int, input().split()))
n = 0
for i in li:
    n = max(i, n)

f=[-1 for _ in range(n + 1)]

def sg(x):
    if f[x] != -1:
        return f[x]
    S = set()
    for i in range(x):
        for j in range(i + 1):
            S.add(sg(i) ^ sg(j))
    # mex
    for i in range(1010):
        if i not in S:
            f[x] = i
            return f[x]


res = 0
for i in range(m):
    res ^= sg(li[i])

if res: print("Yes")
else: print("No")
```





#### 高斯消元

代办

#### 求组合数

求组合数I（小数）

数据范围



1≤n≤10000

1≤b≤a≤2000



公式： Cba\`

𝐶

𝑎

𝑏

= Cb−1a−1

𝐶

𝑎

−

1

𝑏

−

1



Cba−1

𝐶

𝑎

−

1

𝑏



\#include\<iostream\>

\#include\<algorithm\>

using namespace std;



const int N = 2010, mod = 1e9 \+ 7;



int c\[N\]\[N\];



void init\(\) \{

for\(int i = 0; i \< N; i\+\+\) \{

for\(int j = 0; j \<= i; j\+\+\) \{

if\(\!j\) c\[i\]\[j\] = 1;

else c\[i\]\[j\] = \(c\[i \- 1\]\[j\] \+ c\[i \- 1\]\[j \- 1\]\) % mod;

\}

\}

\}



int main\(\)

\{

int n;

init\(\);



cin \>\> n;

while\(n\-\-\) \{

int a, b;

cin \>\> a \>\> b;

cout \<\< c\[a\]\[b\] \<\< endl;

\}

return 0;



\}

求组合数II（大数）

数据范围



1≤n≤10000

1≤b≤a≤10^5^



公式： Cba

𝐶

𝑎

𝑏

= a\!b\!\(a−b\)\!

𝑎

\!

𝑏

\!

\(

𝑎

−

𝑏

\)

\!

= a\! \* b\!^\-1^ \* \(a \- b\) \!^\-1^



思路： 快速幂求逆元



\#include\<iostream\>

\#include\<algorithm\>



using namespace std;



typedef long long ll;



const int N = 1e5 \+ 10, mod = 1e9 \+ 7;



ll fact\[N\], infact\[N\]; // infact表示除数的逆元



ll qmi\(ll a, ll k, ll p\)

\{

ll res = 1;

while\(k\)

\{

if\(k \& 1\) res = res \* a % p;

a = a \* a % p;

k \>\>= 1;

\}

return res;

\}



int main\(\)\{

fact\[0\] = infact\[0\] = 1;

for\(int i = 1; i \< N; i\+\+\)

\{

fact\[i\] = fact\[i \- 1\] \* i % mod;

infact\[i\] = infact\[i \- 1\] \* qmi\(i, mod \- 2, mod\) % mod;

\}



int n;

cin \>\> n;

while\(n\-\-\)

\{

ll a, b;

cin \>\> a \>\> b;

cout \<\< fact\[a\] \* infact\[b\] % mod \* infact\[a \- b\] % mod \<\< endl;

\}

return 0;



\}

求组合数III\(大大数\)

数据范围



1≤n≤20

1≤b≤a≤10^18^

1≤p≤10^5^



公式： lucas



\#include\<iostream\>

\#include\<algorithm\>



using namespace std;



typedef long long ll;



const int N = 1e5 \+ 10;



ll qmi\(ll a, ll k, ll p\)

\{

ll res = 1;

while\(k\)

\{

if\(k \& 1\) res = res \* a % p;

a = a \* a % p;

k \>\>= 1;

\}

return res;

\}



ll C\(ll a, ll b, ll p\)

\{

if\(b \> a\) return 0;



ll res = 1;

for\(int i = 1, j = a; i \<= b; i \+\+ , j \-\- \)

\{

res = res \* j % p;

res = res \* qmi\(i, p \- 2, p\) % p;

\}

return res;



\}



ll lucas\(ll a, ll b, ll p\)

\{

if\(a \< p \&\& b \< p\) return C\(a, b, p\);

return C\(a % p, b % p, p\) \* lucas\(a / p, b / p, p\) % p;

\}



int main\(\)

\{

int n;

cin \>\> n;

while\(n \-\- \)

\{

ll a, b, p;

cin \>\> a \>\> b \>\> p;

cout \<\< lucas\(a, b, p\) \<\< endl;

\}

return 0;

\}

求组合数IV（高精度）

传送门

885. 求组合数 I \- AcWing题库

    

886. 求组合数 II \- AcWing题库

    

887. 求组合数 III \- AcWing题库

    

动态规划



（注：y式dp法）



背包问题

详解： 背包问题合集\-CSDN博客



01背包

思路： 01背包中，每个元素都只能被使用一次，正常情况下，我们使用二维存储，每一次都添加一名新元素，将其转为一维，从后往前遍历就不会多次使用同一个元素



二维



int n, m; // 数量，体积

int v\[N\], w\[N\]; // 容量，价值

int f\[N\];  // f\[i\]容量为i的最大价值



for\(int i = 1; i \<= n; i \+\+ \) \{

for\(int j = 1; j \<= m; j \+\+ \) \{

f\[i\]\[j\] = f\[i \- 1\]\[j\];

if\(j \>= v\[i\]\) f\[i\]\[j\] = max\(f\[i \- 1\]\[j\], f\[i \- 1\]\[j \- v\[i\]\] \+ w\[i\]\);        \}

\}

一维



int n, m; // 数量，体积

int v\[N\], w\[N\]; // 容量，价值

int f\[N\];  // f\[i\]容量为i的最大价值



for\(int i = 1; i \<= n; i \+\+ \) \{

for\(int j = m; j \>= v\[i\]; j \-\- \) \{

f\[j\] = max\(f\[j\], f\[j \- v\[i\]\] \+ w\[i\]\);

\}

\}

完全背包问题

思路： 每个元素可以被多次使用，所以一维状态下从前往后遍历



int n, m;

int v\[N\], w\[N\];

int f\[N\];



for\(int i = 1; i \<= n; i \+\+ \) \{

for\(int j = v\[i\]; j \<= m; j \+\+ \) \{

f\[j\] = max\(f\[j\], f\[j \- v\[i\]\] \+ w\[i\]\);

\}

\}

多重背包问题

思路： 二进制分解（只放最优方式，后面链接有详解），把一个元素的个数分解为2进制形式，然后将其价值变成其倍数，转为01背包形式



\#include\<iostream\>

\#include\<algorithm\>

using namespace std;



const int N = 12010, M = 2010; // N = n \* logn



/\* 思想：通过二进制想法，将一个拥有很多的物品分解为logn个物品

进行处理，这logn个物品可以通过组合达到满足任意个该物品的数量\*/



int n, m;

int v\[N\], w\[N\];

int f\[M\];



int main\(\)

\{

cin \>\> n \>\> m;



int cnt = 0; // 下标

for\(int i = 0; i \< n; i \+\+ \) \{

int a, b, s;

cin \>\> a \>\> b \>\> s;

int k = 1;

while\(k \<= s\)        \{

v\[cnt\] = k \* a;

w\[cnt \+\+ \] = k \*b;

s \-= k;

k \*= 2;

\}

if\(s \> 0\) \{

v\[cnt\] = s \* a;

w\[cnt \+\+ \] = s \*b;

\}

\}

n = cnt;

for\(int i = 0; i \< n; i \+\+ \) \{ // 01背包思路

for\(int j = m; j \>= v\[i\]; j \-\- \) \{

f\[j\] = max\(f\[j\], f\[j \- v\[i\]\] \+ w\[i\]\);

\}

\}

cout \<\< f\[m\] \<\< endl;

return 0;



\}

## 四、企业招聘算法题实战



以下是针对华为软件实习生机考的200道高频备考题目整理，结合华为机考题型特点和历年真题方向，按算法类型分类并标注来源。题目主要来源于LeetCode、牛客网华为题库及真题案例，优先选择中等难度题型（避免硬题），覆盖数据结构、算法、字符串处理等核心考点。



一、动态规划（约30题）

`1. 跳跃游戏II（45. Jump Game II）`

`2. 最长递增子序列（300. Longest Increasing Subsequence）`



3. 不同路径（62\. Unique Paths）

4. 零钱兑换II（518\. Coin Change II）

5. 爬楼梯（70\. Climbing Stairs）

6. 最大子数组和（53\. Maximum Subarray）

7. 三角形最小路径和（120\. Triangle）

`8. 打家劫舍（198. House Robber）`

8. 最长公共子序列（1143\. Longest Common Subsequence）

9. 二叉树中的最大路径和（124\. Binary Tree Maximum Path Sum）

    

---



二、字符串处理（约30题）



1. 无重复字符的最长子串（3\. Longest Substring Without Repeating Characters）

2. 有效的括号（20\. Valid Parentheses）

3. 反转每对括号间的子串（1190\. Reverse Substrings Between Each Pair of Parentheses）

4. 最长回文子串（5\. Longest Palindromic Substring）

5. 字符串解码（394\.Decode String）

6. 最小窗口子串（76\. Minimum Window Substring）

7. 模式匹配（28\. Implement strStr\(\)）

8. 验证回文串（125\. Valid Palindrome）

9. 最长有效括号（32\. Longest Valid Parentheses）

10. 字符串解码（394\.Decode String）

    

---



三、图算法（深搜/广搜）（约25题）



1. 省份数量（547\. Number of Provinces）

2. 岛屿数量（200\. Number of Islands）

3. 二叉树的锯齿形层次遍历（103\. Binary Tree Zigzag Level Order Traversal）

4. 课程表（207\. Course Schedule）

`5. 二叉树的层序遍历（102. Binary Tree Level Order Traversal）`

5. 二叉树的最小深度（111\. Minimum Depth of Binary Tree）

6. 二叉树的最大深度（104\. Maximum Depth of Binary Tree）

7. 二叉树的右视图（199\. Binary Tree Right Side View）

8. 二叉树的最近公共祖先（236\. Lowest Common Ancestor of a Binary Tree）

9. 二叉搜索树迭代器（173\. Binary Search TreeIterator）

    

---



四、数组与链表（约25题）

`1. 合并区间（56. Merge Intervals）`

`2. 合并两个有序数组（88. Merge Sorted Array）`



3. 移除重复元素（26\. Remove Duplicates from Sorted Array）

`4. 反转链表（206. Reverse Linked List）`

4. 删除链表的倒数第N个节点（19\. Remove Nth Node From End of List）

5. 链表中环的检测（141\. Linked List Cycle）

6. 合并K个升序链表（23\. Merge k Sorted Lists）

`8. 两数相加（2. Add Two Numbers）`

7. 三数之和（15\. 3Sum）

8. 盛最多水的容器（11\. Container With Most Water）

    

---



五、哈希表与滑动窗口（约20题）

`1. 两数之和（1. Two Sum）`

`2. 有效的字母异位词（242. Valid Anagram）`



3. 子数组和等于K的个数（560\. Subarray Sum Equals K）

`4. 滑动窗口最大值（239. Sliding Window Maximum）`

4. 最长无重复子串（3\. Longest Substring Without Repeating Characters）

5. 最长连续序列（128\. Longest Consecutive Sequence）

6. 频率最高的元素（347\. Top K Frequent Elements）

7. 子数组和的绝对值最大值（1224\. Maximum Equal Frequency Subarray）

8. 组合总和（39\. Combination Sum）

9. 长est连续递增子序列（674\. Longest Continuous Increasing Subsequence）

    

---



六、其他高频题型（约30题）

`1. 每日温度（739. Daily Temperatures）`

`2. 最大矩形（85. Maximal Rectangle）`



3. 二叉树展开为链表（114\. Flatten Binary Tree to Linked List）

4. 二叉树的锯齿形层次遍历（103\. Binary Tree Zigzag Level Order Traversal）

5. 二叉树的最近公共祖先（236\. Lowest Common Ancestor of a Binary Tree）

6. 二叉树的右视图（199\. Binary Tree Right Side View）

7. 二叉树的最小深度（111\. Minimum Depth of Binary Tree）

`8. 二叉树的层序遍历（102. Binary Tree Level Order Traversal）`

8. 二叉搜索树的最近公共祖先（235\. Lowest Common Ancestor of a Binary Search Tree）

9. 二叉树的锯齿形层次遍历（103\. Binary Tree Zigzag Level Order Traversal）

    

---



七、真题案例（约20题）



1. 栈的压入弹出序列（判断两个序列是否为同一栈的压入/弹出顺序）

2. 快速传球（BFS求最短路径）

3. 转骰子（状态模拟与动态规划）

4. 服务器能耗计算（滑动窗口与贪心算法）

5. 解码ASCII数组（哈希表与字符串匹配）

    

---



练习建议



1. 分阶段刷题：先完成LeetCode华为题库前200题（按难度降序），再补充牛客网华为真题。

2. 专题突破：针对薄弱环节（如动态规划、图算法）集中练习，参考文章4的专题分类。

3. 模拟考试：使用牛客网华为机考模拟环境，限时完成3题，适应考试节奏。完整题库链接：

    

- LeetCode华为题库：[华为公开题库](https://leetcode-cn.com/problemset/all/)

- 牛客网华为题库：[华为专项练习](https://www.nowcoder.com/ta/huawei)如需进一步细化某类题目的解题技巧或代码示例，可随时提出！



## 五、机器学习类算法拓展

### 分类

### 回归

### 聚类

### 降维

### 集成学习

### 基于价值强化学习

### 基于策略强化学习

### 神经网路

### 循环神经网络

### 卷积神经网络
