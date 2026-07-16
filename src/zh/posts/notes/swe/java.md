---
lang: zh-CH
title: Java 学习笔记
description: 从语法到JVM到设计模式，我的Java开发手册
date: 2023-11-22
category:
  - 后端开发
tag:
  - 编程语言
---

MES开源系统

https://zhuanlan\.zhihu\.com/p/1899896072123429708


## Java基础

### 算法库

`java.lang.*` 自动导入,里面包含了Math

`abs()` `max()` `min()` `round()` `sqrt()` `pow()` `random()` `toDegrees()` `toRadians()`

`Integer`方法: 

- `toBinaryString()` 转换为字符二进制串

- `bitCount(int i)` 二进制1的个数

- `numberOfLeadingZeros(int i)` 首个1前的0个数

- `numberOfTrailingZeros(int i)` 最低1位后的0个数

- `highestOneBit(int i)` 二进制仅含有1个1, 该位为数的最高1那位

- `lowestOneBit(int i)` 二进制仅含有1个1, 该位为数的最低1那位

- `reverse(int i)` 二进制32位整体反转

- `rotateLeft` 位循环左移

- 注意优先级 `a + (b >> 1)` 和 `a & (b == 0)` 和cpp不同

- `>>` 算数右移保留符号位, `>>>` 逻辑右移高位全部补0

#### Math库 

`.ceil()`

`BigInteger` 使用int\[\]模拟大整数
方法:

- `new BigIntger(String s)`

- `add()` `subtract()` `multiply()`  `mod()` `pow()` `abs()` `max()` `min()` `negate()`

- `divide(b, scale, roundingMode)` `divideAndRemainder()` `remainder()` `divideToIntegralValue()`

- `longValue()` `longValueExact()`\(ArithmeticException\) 

`BigDecimal` 任意大小且精度完全准确的浮点数
方法：（运算只接受BD类）

- `new BigDecimal(String s)`

- `scale()` 小数位数（0也算） `precision()`

- `setScale(4, RoundingMode.xxx)` 返回负数\(CEILING, FLOOR, DOWN, UP, HALF\_DOWN, HALF\_UP, UNNECESSARY, HALF\_EVEN\)

- `stripTrailingZeros()` 去掉末尾0（整数0也会被去掉，scale会减到负数）

### 数据类型

`Integer`

类型擦除
常量: `MAX_VALUE` `MIN_VALUE` `SIZE` `BYTES` `TYPE`
相关方法: `parseInt()` `valueOf()` `toString()` `equals()` `compare()`
强制转换 `(int)`

AtomicInteger

#### Array数组

每个数组包含属性`q.length` 

`Arrays.sort(q)` `.toString(q)` `.fill(q, inf)` `.asList(1,2,3)`

与集合相互转换 `list.toArray(new Integer[list.size()])`

流API：

Arrays\.stream\(values\(\)\)

\.filter\(\)

\.map\(\)

\.sorted\(\)

\.collect\(Collectors\.toList\(\)\);

#### String字符串

- `charAt()` 将字符串视为char数组

- `length()` 

- `indexOf()`  返回某个字符或子字符串第一次出现的位置（索引）

- `equals()` 

- `a.compareTo(b)` a大返回正数交换b排前，b大返回负数a排前,相等返回0

- `startsWith()` `toLowerCase()` `replace()` `substring(x, y)` `toCharArray()` `split()`

StringBuilder `append()` `delete()` `insert()` `reverse()`

StringBuffer 线程安全

`reverse()`
引用类型参数何时复制，何时引用？
修改字符串数组，仍然是在原地址上更改

##### 各种格式转换

String去除空格回车：str\.replaceAll\("\\s\+", ""\)

String转换为int：Integer\.parseInt\(\)

几个int/数组转换为String：x\.toString\(\)

int数组转换为String数组： `strs[i] = String.valueOf(nums[i]);`

String转换为char数组：char\[\] arr = str\.toCharArray\(\);

char\[\]转换为String：String res = new String\(arr\);

### 集合类

集合类 = Collection（List、Set、Queue） \+ Map

#### 集合工厂方法

Java9引入的`List.of()`, `Map.of()`, `Set.of()`用于创建不可变的、高效的、经过优化的集合实例。他们并非使用Array等创建，通过单例等进行内存优化，是不可变对象，不能使用常规集合方法。

Map\.of 一次最多创建10个KV，



#### Collections 工具类

- `Collections.sort(list)` 排序，默认升序，`Collections.sort(list, Comparator.reverseOrder())` 降序

- `Collections.shuffle(list)` 随机排序

- `Collections.max(list)` 最大值

- `Collections.min(list)` 最小值

- `Collections.reverse(list)` 反转

- `Collections.replaceAll(list, old, new)` 替换

- `Collections.frequency(list, v)` 出现次数

- `Collections.synchronized`

#### List\<E\> 支持可变数组 

- ArrayList\(\) 访问速度O\(1\) 非线程安全，底层为数组，初始10，每次扩充1\.5倍，不会销毁

- LinkedList\(\) 枚举类型，访问速度O\(n\)，

- Vector\(\) 线程安全

方法: `add(v)` `get(i)` `set(i, v)` `remove(i)` `indexOf(i)` `contains(v)` `size()` `isEmpty()` 

特别：`toArray(T[] a)`

- 把集合元素放进你给的数组中；

- 如果数组空间不够，就创建一个新数组；

- 返回填充好的数组。

- example: `String[] q = list.toArray(new String[0])` `list.toArray(new int[list.size()][])`

特别: \(Java8支持\)`sort(Comparator.reverseOrder())`

List方法:`List.of()`建立不可变对象

区别于Array数组，`q.length` `Arrays.sort(q)` `.toString(q)` `.fill(q, inf)` `.asList(1,2,3)`

相互转换 `list.toArray(new Integer[list.size()])`

流API：

Arrays\.stream\(values\(\)\)

\.filter\(\)

\.map\(\)

\.sorted\(\)

\.collect\(Collectors\.toList\(\)\);

#### Set 集合

方法：contains\(\) add\(\) remove\(\) size\(\)

- HashSet

- TreeSet headSet\(\)查找

##### 原理

HashSet底层是基于 `HashMap` 实现的，其中元素作为 `HashMap` 的键，值是一个固定的占位符对象（`PRESENT`）。

##### 遍历方式

**1\. for\-each 循环（最常用）**

```Java
Set<String> set = new HashSet<>(Arrays.asList("a", "b", "c"));
for (String s : set) {
    System.out.println(s);
}
```

**2\. Iterator 迭代器（可安全删除元素）**

```Java
Iterator<String> it = set.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
    // it.remove(); // 遍历中删除不会触发 ConcurrentModificationException
}
```

**3\. Stream / forEach（Java 8\+）**

```Java
set.forEach(System.out::println);
// 带过滤
set.stream().filter(s -> s.startsWith("a")).forEach(System.out::println);
```

> ⚠️ HashSet 不保证遍历顺序；如需有序遍历，改用 LinkedHashSet（插入顺序）或 TreeSet（自然排序）。
> 
> 

#### Queue 栈与队列

方法：`size()` `add()`/`offer()` `E remove()`/`poll()` `E element()`/`peek()` 

当有长度限制时，前者后者抛出异常，后者返回null或者false

- LinkedList 即实现了List接口，也实现了Queue接口

- PriorityQueue 堆排序，默认最小堆，可以指定比较器 

- Deque 扩展自 `Queue` 接口，双向队列

自创集合类（结构体）

```Java
class X implements Comparable<X> {
   int w;
   public int compareTo(Edgs o){
      return Integer.compare(this.w,o.w);
   }
   public boolean equals(Object o) {
      if (o instanceof Edgs) {
          Edgs e = (Edgs) o;
          return this.a == e.a && this.b == e.b && this.w == e.w;
      }
      return false;
   }
}
```



#### Map\<T, T\> 哈希表

方法: `containsKey()`, `putIfAbsent()`, `getOrDefault()`, `remove`, `replace()`,`size`, `clear()`

##### 使用Map

枚举Map的元素

```Go
// 枚举键值对
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}
// 遍历key
for (String key : map.keySet()) {
     System.out.println("key = " + key);
}
// 遍历value
for (Integer val : map.values()) {
    System.out.println("value = " + val);
}
// java8
map.forEach((key, value) -> {
    System.out.println(key + " = " + value);    
});
```

更新Map的元素

```Java
if (map.containsKey(curr_sum - k)) {                 
    count += map.get(curr_sum - k);             
}

map.put(curr_sum, map.getOrDefault(curr_sum, 0) + 1);
```

###### 为什么要同时覆写`equals`和`hashCode`方法，如果使用自己定义的类型？

**数据丢失/行为异常：** 当你把对象存入 `HashMap` 或 `HashSet` 时，它们会先根据 `hashCode()` 计算哈希值来确定存储位置。然后，在哈希桶中，它们会使用 `equals()` 方法来比较对象是否真正相等。

- 如果 `equals()` 返回 `true` 的两个对象，它们的 `hashCode()` 却不相同，那么它们会被存到不同的哈希桶中。当你试图用其中一个对象去查找另一个对象时（例如 `map.get(key)`），它会先计算 `key` 的哈希值，然后到对应的桶中寻找。如果找不到（因为存储在不同的桶中），就会认为对象不存在，导致查找失败，即**数据丢失或无法正确检索**。

**内存泄漏（隐式）：** 如果一个对象作为 `HashMap` 的键，你修改了它的属性导致其 `hashCode()` 变了，但是你没有把它从 `HashMap` 中移除并重新添加，那么 `HashMap` 将无法正确地找到它。即使你尝试 `map.remove(object)`，由于哈希值不同，它也找不到原来的位置，导致旧的对象一直留在 `HashMap` 中，**造成隐式的内存泄漏**（尽管对象本身没有泄露，但它占用的 Map 空间无法被释放）。

HashMap

// 指定容量,避免扩容重新分配哈希值影响性能

Map\<Student, Integer\> map = new HashMap\<\>\(100\);

public Student \{

String name;

int score;

public Student\(String name, int score\) \{

this\.name = name;

this\.score = score;

\}

@Override

public boolean equals\(Object o\) \{

if \(o instanceof Student\) \{

Student s = \(Student\) o;

return this\.name\.equals\(s\.name\) \&\& this\.score == s\.score;

\}

return false;

\}

@Override

public int hashCode\(\) \{

return Objects\.hashCode\(name, score\);

\}

\}

###### 为未实现排序的集合元素编写比较器

TreeMap 实现`SortedMap`接口 添加未实现排序的类要继承`Comparable`覆写`compareTo`,否则在Map参数中传入`Comparator`

class Pair implements Comparable\<Pair\> \{

int a, b;

public Pair\(int a, int b\) \{

this\.a = a;

this\.b = b;

\}

@Override

public int compareTo\(Pair o\)\{

if \(this\.a \!= o\.a\) return Integer\.compare\(this\.a, o\.a\);

else return Integer\.compare\(this\.b, o\.b\);

\}   

\}

Map\<Student, Integer\> map = new TreeMap\<\>\(new Comparator\<Student\>\(\) \{

public int compare\(Student p1, Student p2\) \{

return p1\.score \> p2\.score ? \-1 : 1;

\}

\}\);

##### HashMap原理

`HashMap` 在 Java 8 及以后版本中，底层的数据结构是**数组 \+ 链表 \+ 红黑树**。

1. **数组（****`Node<K,V>[] table`****）**： `HashMap` 内部有一个 `Node` 数组，这是哈希表的主体。每个数组元素被称为一个**桶（bucket）**。当一个键值对被添加到 `HashMap` 中时，会根据键的哈希值计算出它在数组中的索引位置。

2. **链表（****`LinkedList`****）**： 当多个键的哈希值计算出相同的数组索引时，就发生了**哈希冲突**。为了解决冲突，这些键值对会以链表的形式存储在同一个数组桶中。每个 `Node` 对象代表一个键值对，并包含一个指向下一个 `Node` 的引用。

3. **红黑树（****`TreeNode`****）**： 为了进一步优化在哈希冲突严重时链表查询效率低下的问题（链表查询是 O\(n\)），Java 8 引入了红黑树。当某个桶中的链表长度达到一定阈值时，链表会自动转换为红黑树。红黑树是一种自平衡二叉查找树，其查询、插入、删除操作的平均和最坏时间复杂度都是 O\(log n\)。

**`HashMap`**** 的基本工作流程：**

1. **计算哈希值（****`hashCode()`****）**：当你调用 `put(key, value)` 或 `get(key)` 时，首先会调用 `key` 对象的 `hashCode()` 方法来获取其哈希值。

2. 扰动函数（`hash()`）：获取到 `hashCode` 后，`HashMap` 会对其进行一次扰动处理（通过自身的 `hash()` 方法）。这个扰动函数旨在减少哈希冲突，使高位和低位的哈希值都能参与到最终的索引计算中，从而让哈希码更均匀地分布。

3. static final int hash\(Object key\) \{
   int h;
   return \(key == null\) ? 0 : \(h = key\.hashCode\(\)\) ^ \(h \>\>\> 16\);
\}

4. 这里 `h >>> 16` 是将哈希值的高 16 位与低 16 位进行异或操作，目的是让哈希值的高位也能影响到索引计算，从而减少碰撞。

5. 计算索引（`indexFor()`）

6. ：通过扰动处理后的哈希值，与数组的长度减一进行按位与操作（`&`），来确定该键值对在数组中的最终索引位置。

7. \(n \- 1\) \& hash // n 是数组的长度，且 n 总是 2 的幂

8. 因为数组长度 `n` 总是 2^k（2 的幂），所以 `(n - 1)` 的二进制表示是全 1 的，例如  `16 - 1 = 15` ，二进制是 `0000...1111`。这种按位与操作等同于取模，但效率更高，可以确保结果落在数组的有效索引范围内。

9. 存储/查找：

    - **`put()`**** 操作**：根据索引找到对应的桶。如果桶为空，直接创建 `Node` 放入。如果桶不为空，则遍历链表（或红黑树），如果找到 `key` 相同（`equals()` 返回 true）的 `Node`，则更新其 `value`。如果没有找到相同的 `key`，则将新的 `Node` 添加到链表的尾部（Java 7 之前是头部，Java 8 以后是尾部，因为这样可以避免头插法在并发扩容时导致的死循环问题），或者添加到红黑树中。

    - **`get()`**** 操作**：根据索引找到对应的桶。然后遍历链表（或红黑树），使用 `equals()` 方法比较 `key`，找到匹配的 `Node` 并返回其 `value`。

**扩容（Resizing）：**

当 `HashMap` 中的元素数量达到容量（`capacity`）乘以加载因子（`load factor`，默认 0\.75）的阈值（`threshold`）时，`HashMap` 会进行扩容。 扩容过程：

1. 创建一个新的更大的数组（通常是原数组的两倍）。

2. 遍历原数组中的所有桶，将每个 `Node`（或 `TreeNode`）重新计算索引位置，并移动到新数组中。这个过程是比较耗时的。

###### 如何避免频繁扩容？

推荐的初始容量计算公式是： `initialCapacity = (expectedNumOfElements / loadFactor) + 1`

`HashMap<String, String> myMap = new HashMap<>(16, 0.9f);`

###### 什么时候链表变成红黑树，什么时候退回成链表？

`HashMap` 中链表与红黑树之间的转换有明确的阈值：

1. **链表转红黑树（****`TREEIFY_THRESHOLD`****）**： 当一个桶中的链表长度达到 `TREEIFY_THRESHOLD`（**默认是 8**）时，并且此时 `HashMap` 的容量大于或等于 `MIN_TREEIFY_CAPACITY`（**默认是 64**），该链表就会转换为红黑树。

    - **为什么需要 ****`MIN_TREEIFY_CAPACITY`**** 约束？** 如果 `HashMap` 的容量很小（例如，只有 16 个桶），即使某个桶中的链表长度达到了 8，也可能仅仅是因为哈希函数不够分散，而不是因为哈希冲突特别严重。在这种情况下，`HashMap` 会优先选择扩容而不是直接转换为红黑树，因为扩容可以减少整体的哈希冲突，提高效率。只有当容量足够大（达到 64）时，才认为哈希冲突是"真的"严重，才有必要转换为红黑树。

2. **红黑树退回链表（****`UNTREEIFY_THRESHOLD`****）**： 当红黑树中的元素数量因为 `remove` 操作或者 `resize`（扩容）操作而减少到 `UNTREEIFY_THRESHOLD`（**默认是 6**）时，红黑树会退化成链表。

    - **为什么是 6 而不是 8？** 这是一个经验值，旨在避免频繁的树化和反树化操作，从而减少系统开销。如果在 7 的时候就退化，那么在 8 的时候又树化，可能会导致频繁的转换。选择 6 作为阈值，可以保留一定的"缓冲"空间。

###### HashMap 的 Key 和 Value 可以为空值吗？

**是的，****`HashMap`**** 的 ****`key`**** 和 ****`value`**** 都可以为空值。**

- **`key`**** 为 ****`null`****：** `HashMap` 允许一个且仅一个 `key` 为 `null`。当 `key` 为 `null` 时，它的哈希值被特殊处理为 0，并且总是存储在数组的 `table[0]` 位置。这是 `HashMap` 和 `Hashtable` 的一个主要区别，`Hashtable` 不允许 `null` 键或 `null` 值。

    - 示例：`map.put(null, "Null Key Value");`

- **`value`**** 为 ****`null`****：** `HashMap` 允许 `value` 为 `null`。你可以存储任意数量的 `null` 值。

    - 示例：`map.put("Key1", null);`

##### HashTable

已经被淘汰的线程安全类，所有公共方法都被 `synchronized` 关键字修饰，这种粗粒度的同步机制导致了性能瓶颈。在并发场景下，每次只有一个线程能够访问 `Hashtable` 的实例，效率非常低。

##### ConcurrentHashMap

底层结构与 `HashMap` 类似，分段存储，并发量提升

###### 线程安全原理

**分段锁（Java 7 之前的实现）**： 在 Java 7 及以前，`ConcurrentHashMap` 使用**分段锁（Segment Locking）**机制。它将整个 Map 分成了若干个 `Segment`（默认 16 个），每个 `Segment` 都是一个独立的 `HashEntry` 数组（类似于一个小的 `HashMap`），并拥有自己的锁。当一个线程修改某个 `Segment` 中的数据时，只需要锁定该 `Segment`，而不会影响其他 `Segment` 的并发操作。

- **优点**：大幅提高了并发度，多个线程可以同时修改不同的 `Segment`。

- **缺点**：`Segment` 结构相对复杂，内存开销稍大，且 `Segment` 的数量在初始化后无法改变。

**CAS \(Compare\-And\-Swap\) \+ ****`synchronized`**** \(Java 8 及以后实现\)**： Java 8 对 `ConcurrentHashMap` 的实现进行了重大改进，取消了 `Segment` 概念，转而采用**`CAS`**** 操作和 ****`synchronized`**** 关键字相结合**的方式来保证线程安全。这种设计在大多数情况下提供了更好的性能和更简化的代码。

- **CAS 操作（非阻塞乐观锁）**： 对于**读取操作（****`get()`****）**，`ConcurrentHashMap` 通常不需要加锁，因为它是**无锁的（lock\-free）**。它利用了 `volatile` 关键字保证内存可见性，并结合 `CAS` 操作来读取最新的数据。这使得并发读取的性能非常高。 对于**部分写入操作**（例如，`putIfAbsent` 或一些数组扩容相关的操作），`ConcurrentHashMap` 会尝试使用 `CAS` 操作。CAS 是一种乐观锁机制，它会检查变量的当前值是否与预期值相等，如果相等则更新为新值，否则操作失败（表示其他线程已经修改了该变量），然后可以重试。这避免了加锁的开销。

- **`synchronized`**** 关键字（桶级锁/节点级锁）**： 对于**写入操作（****`put()`****, ****`remove()`**** 等）**，`ConcurrentHashMap` 采用对**桶头节点（或红黑树的根节点）进行锁定**的策略。 当一个线程需要修改某个桶中的数据时（无论是链表还是红黑树），它会尝试获取该桶头节点的**监视器锁（monitor lock）**。由于 `synchronized` 关键字的作用，在同一时间只有一个线程能够持有这个桶的锁，从而保证了对该桶内数据的修改是原子性的。

    - 优点：

        - 锁的粒度进一步细化到了**桶级别**，而不是整个 `Segment`。这意味着不同桶之间的并发修改不会相互阻塞，即使它们在同一个 `Segment` 里面（如果还保留 `Segment` 概念的话）。

        - 在哈希冲突较少的情况下，`put` 操作通常只涉及对一个桶的锁定，从而实现很高的并发度。

        - 当链表转换为红黑树时，`synchronized` 锁仍然作用在红黑树的根节点上。

    - **为什么用 ****`synchronized`**** 而不是 ****`ReentrantLock`****？** 在 Java 8 中，`synchronized` 关键字在 JVM 层面进行了优化，性能已经非常好，并且相比 `ReentrantLock` 更加轻量和方便。

- **`volatile`**** 关键字**： `ConcurrentHashMap` 内部的 `Node` 数组（`table`）以及 `Node` 链表中的 `next` 指针都用 `volatile` 关键字修饰。这确保了在多线程环境下，对这些共享变量的修改能够立即被其他线程看到（可见性），从而避免了数据不一致问题。

- **`putIfAbsent`**** 和 ****`compute`**** 等原子操作**： `ConcurrentHashMap` 提供了一系列原子操作，如 `putIfAbsent()`, `remove(key, value)`, `replace(key, oldValue, newValue)`, `compute()` 等。这些方法能够原子性地完成"检查\-然后\-执行"的逻辑，避免了在普通 `HashMap` 中需要额外加锁才能实现的复合操作的竞态条件。

- **迭代器（Iterator）的弱一致性**： `ConcurrentHashMap` 的迭代器是**弱一致的（weakly consistent）**，而不是**快速失败的（fail\-fast）**。这意味着在迭代过程中，如果其他线程修改了 `ConcurrentHashMap`，迭代器不会抛出 `ConcurrentModificationException`。它可能不会反映在迭代开始后发生的所有修改，但会保证在迭代过程中不会崩溃。

### OOP

> 三大特性：封装、继承、多态
> 
> 

**重载Overload**\(参数列表不同\)

**重写Override**\(与父类方法签名和返回值相同的方法\)

**继承extends**

父类和子类，复用代码，可以在里面Override。

禁忌——多继承（钻石问题），无法确定使用的是哪条路径的继承。

**多态**=继承（覆/重写）\+重载（开闭原则，面对抽象编程，不用修改父类，方便开发子类扩展功能）

#### **抽象abstract** 

用于一个父类仅作为告知子类方法签名不实现具体逻辑，无法被实例化，作用是定义接口规范（抽象类 x = new 具体子类\(\);）方便使用多态特性，只提供方法签名让子类覆写，子类可以继续定义新方法，可能出现子类的方法反而抽象类 x调用不了

```Java
abstract class Person {
    private int size;
    public abstract void xx();
 }
```

#### **接口interface**

不包含`private`字段的抽象类，只包含常量 \+ 抽象方法 \+ `default`，省略`public abstract`。

接口的出现是为了更好地满足多态：1\.最基础来看，接口定义的是必须要实现的规范；2\.只需要知道对象实现了某个接口，而不需要关心它的具体实现类，实现解耦，方便模块化替换，如JDBC驱动；3\.Java不允许一个类继承多个父类造成二义性，但一个类可以实现多个接口，拓宽了多态特性。

接口如果只有一个函数，被称为函数式接口。

实现类必须要包含接口的所有（抽象）方法，Java 8后的默认方法`default`可以不用。支持实现多个接口如`class xx implements x, y, z`，允许实现的两个接口含有相同的方法名、不同的方法签名，但是不允许返回值不同。实现的方法建议都要加`@override`，核心库早期写的可能没有，这样编译器会帮助检查。实现类还可以提供接口没有的方法。

下面是ArrayList接口：

```Java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    ...
}
```

#### **枚举类enum**

每个枚举值都是class实例且唯一，构造方法为`private`无法被new

//可以设置枚举类字段（写出default构造函数）

@Getter

public enum HouseType \{

MANSION\(3, "April", "Black Street", 9000000000000L\);



private final int floors;

private final String owner;

private final String address;

private final long price;



HouseType\(int floors, String owner, String address, long price\) \{

this\.floors = floors;

this\.owner = owner;

this\.address = address;

this\.price = price;

\}



// Getter方法

// \.\.\.

\}

// 实例方法

// 返回常量名，不可继承

name\(\)

// 返回定义的常量顺序

ordinal\(\)

// 静态方法，返回所有枚举类

values\(\)

//添加工具方法如根据值获得枚举类

getValues\(\)

getEnumByKey\(\)

getEnumByValue\(\)



**成员内部类**依附于外部类实例

**数据类型Type** = 基本类型 \+ 引用类型\(class\)

类中的**字段field**修饰符尽量用`private`，这样不能`class.object`，更安全，使用getsetter替代可以检查错误；默认default支持同包访问

类中的**方法**`public`用作暴露的接口方法，`private`用于内部逻辑函数；

**default方法**用作接口新增一个方法但不想修改全部子类

**构造方法**没有`void`没有`return`，与类名同名

**实例方法**含有隐含参数`this`

**static方法**不适合在能new对象的类中写，因为只能调用public变量

**静态代码块\(static block\)** 在类加载时执行，用于初始化静态变量 `static{//TODO}`

子类想用父类的字段就要改`private`为`protected`，父类没有默认构造方法时子类构造方法内必须加一句父类构造super\(int xxx\);，子类用父类方法super\.xxx\(\)

**final**修饰类是不可继承不可覆写，修饰字段是不可修改（常量），用于写死相对路径、数字等

**native** 修饰方法，表示该方法不是Java实现的，而是由C/C\+\+实现

**volatile**多线程可见性控制，常用于标志位

**transient**序列化时忽略字段，如缓存、敏感信息

### JVM

> **JDK = JRE\(JVM\) \+ 开发工具集**\(javac编译器\\javadoc文档生成器\\Java调试器jdb等\)
> 
> 

#### Java版本

Java8 = Java SE8 = JDK 1\.8\(安装 Java 8 就是安装 JDK 1\.8\)

Java8 新特性：Lambda 表达式、函数式接口、Stream API、默认方法、java\.time

**动态加载**：第一次读取到一种class就加载进内存，创建一个唯一Class类型实例\(class Class\)指向一个数据类型，保存class完整信息，如name, package, field, method

获取Class实例：数据类型\.class // 实例\.getClass\(\) // Class\.forName\("完整类名"\)

Class方法：获取字段、

#### class与CLass

**class**是一种数据结构（Type），Integer、Runnable、Object都是class。

每个类在被加载到JVM时，JVM都会为其创建一个唯一的 **`java.lang.Class`** 对象，CLass也仅能被JVM创建。

这个Class对象包含了该类的所有元数据信息，包括：

- Class 类信息

    - 类的全限定名（包\+类）

    - 父类的名称

    - 它所实现的接口

- Field / Field\[\] 字段（变量）

    - name名称

    - type类型

    - access modifiers访问修饰符

- Method / Method\[\] 方法与构造函数

    - 方法名和返回类型

    - 接收的参数

    - 可能抛出的异常

    - 访问修饰符

    - **方法的字节码**

- Annotation and Other Attributes 注解和其他属性

    - 源文件名：记录了`.class`文件是由哪个`.java`源文件编译而来的，在调试和堆栈跟踪非常有用。

    - 泛型类型的签名类型：标记特殊属性，方便使用类型擦除的反射。

    - 运行时可见的注解：即`@Retention(RetentionPolicy.RUNTIME)` 声明的注解，保证在JVM运行时可被反射机制读到。

- Constant Pool 常量池 

    - 字符串字面量

    - `final`变量值

    - 对该类所需的其他类、方法和字段的符号引用



##### 运行Java的过程

源码文件`.java`被编译为字节码文件`.class`，按照相对路径和resources里的文件一起放在target的classed下

`Class` 包含类的方法属性注解修饰符以及每行代码对应的字节码指令

原本JVM加载字节码文件，并创建Class实例，通过反射调用方法

##### classpath

JVM 运行时加载class的路径，默认为当前目录，可通过`-classpath`或者`-cp`指定对应目录或者jar包

\# Windows

C:\\work\\project1\\bin;C:\\shared;"D:\\My Documents\\project1\\bin"

\# Linux

\.:\~/lib/java:\.:/usr/java/lib:/usr/lib/java

#### 内存结构

> Once the JVM has allocated its available memory, it partitions it into differernt regions\.
> 
> 

##### 线程隔离区

- 程序计数器（PC Registers）：保存下一行代码的字节码指令的地址

- 本地方法栈（Native Method Stacks）：执行Native本地方法，通常由C、C\+\+写的方法。

- 虚拟机栈（JVM Stacks）：描述Java方法执行的内存模型，线程中执行的每个方法都会对应一个栈桢

    - 栈桢：

        - 局部变量表：方法上的参数和局部变量的值；运行时，基本类型从运行时常量池存出来，字符串从堆传来地址存过来

        - 操作数栈：写入临时数据，作为草稿本处理数据，写出到局部变量表（bipush、istore\_1、iload\_1）

        - 动态链接：类的引用，定位栈帧之前的位置

        - 方法出口：重定向到调用程序的代码位置，若存在返回值有的话加一条将返回值存到局部变量的字节码

        - 异常表：异常块（try\.\.\.catch没有的话整个方法抛出）起始Start PC、结束End PC、跳转指令地址Handler PC、Catch Type

##### 线程共享区

- 堆（Heap）：储存数组、实例的对象、J7后字符串常量值（方便GC、防止过多字符串导致内存泄漏），由**GC垃圾回收**管理。

- 元空间（方法区 Method Area / PermGen）：存在本地内存，所有线程共享。字节码指令在元空间

    - 类信息（class文件）方法的字节码

    - 运行时常量池（基本类型的字变量、类和方法的全限定名）

    - 静态变量（static）

    - 编译器编译的代码（AOP动态代理类）



##### 小测验

1\.下面各句话存在哪个区域？

```Java
public class Bean1 {
    public static void main(String[] args) {
        Bean bean1 = new Bean1();
        int[] array = {1, 2, 3};
        String str = "abc";
    }
    public int Method1() {
        int m = 10, n = 200;
        return m + n;
    }
    public void Method2() {
        int i = Method1();
        int k = 10;
        try {
            int j = 99;
        } catch (Exception e) {
            k = 11;
            e.printStackTree();
        }
    }
}
```

2\.JAVA的类加载期负责整个生命周期内的class的初始化和加载工作，就虚拟机的规范来说，以下代码会输出什么结果？

```Java
public class Test {

   public static void main(String[] args) {
       System.out.println(Test2.a);
   }

}
class Test2{
   public static final String a="JD";

   static {
       System.out.print("OK");
   }
```

对于静态常量且是字符串或基本类型时，Java编译器会在编译时做常量传播优化，避免不必要的类加载。

#### 垃圾回收GC

针对堆内存，新生代、旧生代、

### 反射

反射: 在运行期，对某个实例对象一无所知的情况下，调用其方法

使用库： `java.lang.reflect`

#### Class

获取Class实例方法：

1. XXX\.class

2. 实例\.getClass\(\) 隐式写法:\(this\.\)getClass\(\)

3. clazz = **Class\.forName\("完整类名"\)** 属于 `java.lang.Class` , 使用类的全限定名；当一个类被这样加载时，他的静态代码块会立即被执行

这个Class对象包含了该类的所有元数据信息，包括：

##### 类信息

- 类的全限定名（包\+类）

- 父类的名称

- 它所实现的接口

获取Class信息方法：

1. getName\(\) 获取完整类名

2. getSimpleName\(\) 获取类名

3. getPackage\(\) 获取包名

4. getSuperclass\(\) 获取父类

5. getInterfaces\(\) 获取接口

6. getResourceAsStream\("fileName"\) 获取resources目录下的任意文件

##### Field / Field\[\] 字段（变量）

Field信息包括**name名称**、**type类型**和**access modifiers访问修饰符**，还可以用`getModifiers()`获取int型修饰符，`get(Obj)` 获取指定字符的值\(会报IllegalAccessException\)

1\. getField\("name"\) 获取某个public字段（包括父类）

2\. getFields\(\) 获取所有public字段（包括父类）

3\. getDeclaredField\("name"\) 获取某个字段（不含父类）

4\. getDeclaredFields\(\) 获取所有字段（不含父类）

##### Method / Method\[\] 方法

`[private/public] [int/type] [Student/className].[getGrade(int)]`

1\. getMethod\("name", Type1\.class, Type2\.class\)

2\. getMethods\(\) 获取所有public方法

3\. getDeclaredMethod\(\)

4\. getDeclaredMethods\(\) 获取所有方法

method\.invoke\(instance, args1, \.\.\.\) 调用方法 

- 参数为实例对象和参数列表

- 如果是静态方法,不用传入实例,第一个参数为null

- 非public方法,通过`Method.setAccessible(true)`允许其调用

- 多态原则: 总是调用实际类型的覆写方法

##### 构造函数

1. class\.newInstance\(\) 调用默认构造方法（无参）

使用Class实例的`Constructor`对象，其包含一个构造方法的全部信息

如：

1. class\.getConstructor\(int\.class\) 获取默认构造方法

2. class\.getDeclaredConstructor\(\)\.newInstance\(\) 调用指定构造方法

3. class\.getDeclaredConstructor\(int\.class, String\.class\)\.newInstance\(1, "xx"\) 调用指定参数构造方法

##### 常量池

xx

#### 注解

一种特殊的元数据（metadata），它被用于为程序代码（类、方法、字段、参数等）添加额外的信息。这些信息不会直接影响程序的运行逻辑，但可以被其他工具或程序在编译、部署或运行时读取和使用。

##### 经典例子

Java的内置注解

- 编译器指令注解：`@override`、`@Deprecated`、`@FunctionalInterface`

- 元注解：`@Retention`、`@Inherited`、`@Target`、`@Documented`、`@Repeatable`

下面是“通用目的注解”：

- Lombok自动生成getter与setter，它是通过在编译过程中扫描，再在抽象语法树中插入新生成的代码，最终编译出包含新方法的 `.class` 文件。`@Data`

- Spring Framework告诉Spring是Bean，实现自动依赖注入、将Web请求路径映射到特定方法。`@Autowired` `@Component`

- JUnit标记测试方法，由JUnit框架识别并执行。`@Test`

- ORM框架标记实体、数据表、主键、列名

- Jackson序列化

##### 如何写注解

根据注解的**保留策略（Retention Policy）**，可以分为三类，它定义了注解的生命周期：

- `@Retention(RetentionPolicy.SOURCE)`：只在源代码中有效，编译时被丢弃。

- `@Retention(RetentionPolicy.CLASS)`：在编译时被保留，但JVM加载`.class`文件时被丢弃。

- `@Retention(RetentionPolicy.RUNTIME)`：在运行时保留，可以通过反射读取。这是最常用的一类。

```Java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

// @Retention: 定义注解的保留策略
@Retention(RetentionPolicy.RUNTIME) 
// @Target: 定义注解可以应用于哪些程序元素（如类、方法、字段）
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface MyAnnotation {
    // 注解的属性，看起来像方法，但没有方法体
    // 属性名() default 默认值;
    String value() default "Hello Annotation";
    int count() default 1;
}
```

- `@Target`：另一个元注解，定义了你的注解可以作用在哪些地方。`ElementType.METHOD` 表示可以修饰方法，`ElementType.TYPE` 表示可以修饰类、接口等。

- `String value() default "..."`：这定义了注解的属性。`value`是一个特殊的属性名，如果注解只有一个属性，并且属性名为 `value`，在使用时可以省略 `value=`。



#### 动态代理 Dynamic Proxy

不编写实现类，在运行期间创建某个interface的实例，通过`Proxy.newProxyInstance(ClassLoader, interface, handler)`创建接口对象

代理对象 `proxyInstance` 会实现你传进去的接口，然后所有方法调用，都会被转发给 `handler.invoke(...)` 方法处理

具体的实现写在invoke中, 此时可以在里面写序列化发送请求、接受请求，就得到RPC了

// 获得 Hello 接口的 morning 实例

// 

import java\.lang\.reflect\.Proxy;



public class DynamicProxy \{

public static void main\(String\[\] args\) \{

Hello hello = new HelloImpl\(\);

Hello helloProxy = \(Hello\) Proxy\.newProxyInstance\(

hello\.getClass\(\)\.getClassLoader\(\), // 加载动态代理类的类加载器

hello\.getClass\(\)\.getInterfaces\(\), // 代理需要实现的接口，可多个

new InvocationHandler\(\) \{ // 代理类的调用处理程序

@Override

public Object invoke\(Object proxy, Method method, Object\[\] args\) throws Throwable \{

System\.out\.println\("before method " \+ method\.getName\(\)\);

Object result = method\.invoke\(hello, args\);

System\.out\.println\("after method " \+ method\.getName\(\)\);

return null;

\}

\}

\);

\}

\}

注意其中的`invoke()`,当你通过代理对象proxy调用方法method时，调用会被自动转发到 invoke 方法中。

public Object invoke\(Object proxy, Method method, Object\[\] args\) throws Throwable \{

method\.invoke\(obj, args\);

return null;

\}

`helloProxy.getClass()`将返回Proxy

#### SPI\(Service Provider Interface\) 服务提供接口

SPI机制允许服务提供者通过特定的配置文件将自己的实现注册到系统中，然后系统通过反射机制动态加载

这些实现，而不需要修改原始框架的代码，从而实现了系统的解耦、提高了可扩展性。

`ServiceLoader` 是 Java 自带的一个 服务发现机制工具，用于加载某个接口（或抽象类）的多个实现类

系统 SPI 机制会加载`resources`资源目录`META-INF/services/`\(标准元信息目录\)目录下的配置文件，文件名就是接口的全限定名，文件内容是接口实现类的全限定名，每行一个

ServiceLoader\<Serializer\> loader = ServiceLoader\.load\(Serializer\.class\);

for \(Serializer s : loader\) \{

// 手动挑一个

\}

自定义 SPI （不使用ServiceLoader，自定义SpiLoader）

String type = config\.get\("serializer\.type"\); // 比如 "json"

Serializer s = mySpiFactory\.get\(type\); // 自动加载 JsonSerializer

### 泛型

> 泛型就是定义一种模板，由编译器javac针对类型作检查并安全强制转换（擦拭法），虚拟机一无所知，所有类型其实是Object
> 
> 

#### 泛型定义

一个类中部分泛型方法不用定义泛型类，有泛型字段必须要用泛型类，只有声明了才能使用泛型

`T` 匹配任意一种数据结构，当需要多个泛型类型时可用`<K, V>`, `<K, V, T>` 

#### 泛型原理

`class ClassName<T> { ... }` 把一个类T变成模板，内部所有T被替换为传入的数据结构，填写后泛型接口变为强类型，不填时把\<T\>作为Object使用

因此，\<T\>实际类型为Object，不能为基本类型，且无法取得带泛型的Class，就是说无论`T`的类型是什么`getClass()`只会返回唯一的`className.class`

另外，`Class<T>`的`T`不能实例化（此时new T\(\) 等于 new Object\(\)）必须传入`class<T> clazz`通过反射来实例化

#### 区分

向上转型：把一个子类对象赋值给一个父类类型的引用变量

静态方法: 不存在泛型类型，取而代之的是：

`public static <K> K getProxy(Class<K> serviceClass)`
声明一个泛型方法，返回值是类型 K，接受一个"类对象"

泛型继承：子类需要知道父类的泛型类型

只读通配符：\<?\>用于读取任意类型，不能写

上界通配符：\<T\>中T的子类不能作为T传入，此时使用`Pair<? extends Number>`，可读不可写

下界通配符：`Pair<? super Integer>`，使用Integer父类，可写入T

### IO流 抛出IOException

#### 文件File

```Java
File f = new File("C:\\Users\\Administrator\\Desktop\\test.txt");
// 相对路径
f.getPath();
// 绝对路径
f.getAbsolutePath();
// 规范绝对路径
f.getCanonicalPath();
// 文件是否存在
f.exists();
// 文件存在
f.isFile();
f.isDirectory();
// 权限和大小
```



#### 路径Path

```Java
Path p = Paths.get("C:\\Users\\Administrator\\Desktop\\test.txt");
Path p2 = Paths.get(".", "project", "study");
// 规范路径
Path p3 = p2.normalize();
Path p4 = p2.toAbsolutePath();
// 文件
File f = p.toFile();
// 遍历Path
for (Path p : Paths.get("..").toAbsolutePath()){}
```



#### InputStream/OutputStream

面向字节byte流、为抽象类，提供数据子类

- `FileInputStream(文件路径)`

- `ByteArrayOutputStream(byte[])` 将byte数组转换为`InputStream`

- `ServletInputStream`

- `Socket.getInputStream()`

使用try\(resource\) \{//TODO\} 处理IO错误正确关闭

#### Filter 模式

提供额外附加功能子类

- `BufferedInputStream`\(嵌套提供数据子类\) 实现缓存

- `DigestInputStream`

- `GZIPInputStream`

#### Reader/Writer

`read(byte[] bytes)`使用阻塞式读入,返回读取的字节数，\-1表示EOF

`close()`   

##### 获取资源

- `getResourceAsStream("test.txt")` 获取classpath下的资源

- `getResource("test.txt")` 获取classpath下的资源，返回`URL`

- `url.openStream()` 

Reader/Writer 字符char流

FileReader

CharArrayReader

StringReader

InputStreamReader 将一个InputStream转换成Reader对象

#### 读取classpath

try \(InputStream input = getClass\(\)\.getResourceAsStream\("test\.txt"\)\) \{

if\(input \!= null\) \{

//TODO

\}

\}

#### 配置的文件格式

##### 1\. `.properties`

- 格式: key=value

- java原生格式

- 不能嵌套、扁平化

Properties p = new Properties\(\);

p\.load\(inputStreamFromClassPath\("test\.properties"\)\);

p\.load\(inputStreamFromFile\("\./test\.properties"\)\);

##### 2\. `.yaml` / `yml`

- YAML = YAML Ain't Markup Language 标记语言，yml是yaml旧版

- 格式: key: value

- 可读性好，支持嵌套

- 大小写、缩进、空格敏感（不允许使用Tab）只要比上面空格多就是新层级

##### 3\. `.xml`

- eXtensible Markup Language 标记语言

- 格式: \<开始标签\>\<结束标签\>

- 支持层级结构、支持注释、属性

- 解析复杂

##### 4\. `.json`

- JavaScript Object Notation JavaScript对象表示法

- 格式: \{"key": "value"\}，支持字符串、数字、数组、布尔值、对象

- 支持嵌套、文件小适合Web传输

- 不支持注释

### 函数式编程

函数式编程（FP）是一种编程范式，它将计算机的运算视为数学函数的计算，并且避免使用程序状态以及易变对象。下面是三个重要概念：

1. 纯函数：输入输出确定，不会修改函数外部的任何状态（比如修改全局变量、修改传入的对象、进行 I/O 操作等）。

2. 不可变性：数据一旦创建就不能被修改，需要修改就新建一个副本，避免共享导致的并发。

3. 函数作为一等公民：函数可以存储在变量中，允许把函数作为函参，还允许返回一个函数。

例子：`String::length`是一个函数的引用，类似lambda表达式。

#### lambda表达式

Java8 以前, 实现只有一个方法（不能有构造方法）的接口,需要定义一个匿名类并覆写接口方法（只能用一次）

如`Runnable`、`Comparator`、`InvocationHandler`:

```Java
Arrays.sort(array, new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return s1.compareTo(s2);
}
Java8 开始, 如Comparator、Runnable、Callable
Arrays.sort(array, (s1, s2) -> {
            return s1.compareTo(s2);
        });
      
// 按第一个元素排序
int[][] intervals
Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
```

Stream代表任意java对象而非io的字节字符，存储的是顺序输出的对象序列，元素可能并未分配至内存，而是实时获得\(可能一直传入\)，进行惰性计算，通常代码写成链式操作

javax

#### 流操作 Stream API

Java 8引入的Stream API用来处理包括集合、数组、I/O通道等数据序列，提供函数式编程风格。

Java Stream API 有三种原始类型 Stream：`IntStream`、`LongStream` 和 `DoubleStream`

Stream不存储数据，他只是管道，用于描述对数据源执行的操作。Stream操作也不会修改数据源，具体可以分为两类操作：中间操作与终结操作。

##### 中间操作

中间操作是惰性的，返回值为Stream\<R\>，不触发执行，只构建管道。

- **`filter(Predicate)`**

- **`map(Function)`** s \-\> s\.length\(\) \> 5

- **`flatMap()`** 将 Stream 中的每个元素映射成**一个 Stream**，然后将这些 Stream \*\*连接（扁平化）成一个单一的 Stream

- s \-\> Arrays\.stream\(s\.split\(" "\)\)

- **`sorted()`**** ****`sorted(Comparator) `**

- **`distinct() `**

- **`limit()`**** **截断，只取前n个元素

- **`skip(long n)`** 跳过前n个元素

- **`peek(s -> System.out.println(s))`**

##### 终结操作

一旦执行，Stream管道就会关闭。

- **`forEach(Consumer)`** 对每个元素执行方程，例如打印到控制台、将数据插入到另一个集合、写入日志等。

- **`collect(Collector)`**将 Stream 元素收集到目标集合

一般配合`Collectors`工具类使用

- `toList() `/ `toSet()`/ `toMap()`

- `joining()` 收集字符串并拼接

- `groupingBy()` 分组，根据传入的函数计算作为key，值为成员

- `counting()` / `summingInt()`

- **`reduce(BinaryOperator)`**** **通过重复应用合并操作，将所有元素组合成一个单一结果

- `count()` `min()` `max()`

- **`anyMatch()`****任一匹配**。检查 Stream 中**是否至少有一个**元素匹配给定条件（返回 `boolean`）。检查列表中是否存在未成年人。

- **`allMatch()`****全部匹配**。检查 Stream 中**是否所有**元素都匹配给定条件（返回 `boolean`）。检查列表中是否所有数字都大于零。

- **`noneMatch()`****无一匹配**。检查 Stream 中**是否没有任何**元素匹配给定条件（返回 `boolean`）。检查列表中是否不存在空值。

- **`findFirst()`****查找第一个**。返回 Stream 中的第一个元素（返回 `Optional<T>`）。查找第一个符合条件的用户。

- **`findAny()`****随机查找**。返回 Stream 中的任意一个元素（返回 `Optional<T>`）。在并行 Stream 中效率更高。快速找到一个可用资源。

### 日期时间

时区表示方式：使用GMT或UTC加时区偏移表示（二者区别在于后者使用更精确原子计时）

日期可以用一个`int`来存储，称为Epoch Time，System\.currentTimeMillis\(\) 时间戳。而展示的本质就是一个转换方法。

#### JUD API

`Date` 存储了一个 `long` 类型的以毫秒表示的时间戳。

`(getYear() + 1900, getMonth() + 1, getDate(), toString(), toGMTString, toLocaleString())`

SimpleDateFormat\("yyyy\-MM\-dd HH:mm:ss"\) 预定义

#### 不安全



Calendar时间运算

LocalDateTime 位于java\.time java8引入



LocalDateTime dt = LocalDateTime\(\); //LocalDateTime\.parse\("2022\-4\-30T10:00:00:012"\);

LocalDate d = dt\.toLocalDate\(\); // d2 = LocalDate\.of\(2022, 4, 30\);

LocalTime t = dt\.toLocalTime\(\);

// 日期计算

LocalDate d2 = d\.plusDays\(2\)\.minusMonths\(2\);

LocalDateTime dt2 = dt\.withDayOfMonth\(23\)\.withSecond\(\)

DateTimeFormatter 将非ISO 8601格式字符串解析成LocalDateTime

### 写简单的Java测试文件

使用 `xx.of()` 静态方法，包括 List、Map、Set、Stream

### 多线程 / 并发编程

#### 线程基础

##### 线程创建

- 实现`Runnable`接口，覆写`run()`方法

- 继承`Thread`类，覆写`run()`方法

- 从线程池获得



##### 线程状态

- NEW：`Thread p = new Thread();`

- RUNNABLE：`t.start();`

- BLOCKED：`synchronized(obj) {}` 另一进程已经拿到锁

- WAITING：`Object.wait()` `Thread.join()` `LockSupport.park()` 无限等待

- TIMED\_WAITING：`Thread.sleep(1000)` `Object.wait(1000)` `Thread.join(1000)` 

- TERMINATED：正常执行完毕或抛出未捕获异常（捕获了异常线程会继续往下执行）



##### Thread类方法

- `sleep(<ms>)` 进入阻塞状态，响应中断（看源码）、不释放锁、释放CPU（看资源管理器）

- `wait(<ms>)`  native方法，响应中断、在临界区释放锁，但唤醒后取回锁（需要用while避免再次被抢）、释放CPU

- `join(<ms>)` 当前线程等待调用线程结束，响应中断、释放锁

- `notify()` 随机唤醒一个在lock锁等待的线程

- `notifyAll()`  唤醒所有等待的线程

- `yield()` 由运行转为就绪，不能被中断（没有反应，不抛异常，不退出），不释放锁，释放CPU

注：响应中断指线程在运行过程中主动检测自己是否被中断，并作出反应（比如退出、抛异常InterruptedException、清理资源等）。

#### 同步方法 synchronized

##### 解释synchronized

Q: 是什么？

A: `synchronized` 是Java中的锁，是阻塞锁也是可重入锁，JDK1\.6之后做了优化包括锁升级、缩小出、锁粗化

Q: 为什么要有？

A: 在多线程**并发环境**下对共享变量进行读写，为实现逻辑正确/线程安全，必须保证一组指令以原子方式执行

Q: 如何解决的？

A: 加锁之后拿到锁的线程才能访问共享资源，拿不到锁的就会阻塞等待，等其他线程释放锁后才能尝试抢锁访问——这就保证了线程的顺序执行、保证了原子性。对象头Markword几个字节的一个标记位。原理：操作系统的mutex原语，加上锁监视器的锁池、对象池去实现了一套线程阻塞唤醒的机制

Q: 缺点？

A: 加锁无法并发执行，带来性能下降

##### 锁升级

一共分为四种锁状态：

- 无锁：

- 偏向锁

- 轻量锁

- 重量锁

##### 使用方法

`synchronized(lock){...}`通过加锁，在临界区完成操作保证原子性

`lock`是Object，是class类，而非实例

`synchronized`可以修饰方法，若在static修饰前则锁的是class实例



##### Java原子操作

基本类型和引用类型赋值（long/double除外），但是多行读写时读和写都要同步

#### 死锁

死锁产生的4个条件：互斥、持有并等待、非抢占（竞争资源）、循环等待（顺序非法）

处理死锁：预防、避免、检测解除

Java的锁是可重入的锁（能被同一个线程反复获取的锁）。

一个线程可以获取一个锁后，再继续获取另一个锁。死锁发生后，没有任何机制能解除死锁，只能强制结束JVM进程。

Java的类默认都是非线程安全的，可以设为this自锁封装逻辑`synchronized(this)`，形成线程安全类，成员变量都是常量的自然也是线程安全类



#### 更高级的并发`java.util.concurrent` 



##### 重入锁`ReentrantLock` 

获得常量对象lock，方法 `lock` `tryLock` `unlock` 

优点：使用等待try，失败会返回不会导致死锁，比`synchronized`轻

缺点：需要考虑异常，先获取锁后使用 `if (// LOCK.trylock())) {try {} finally {// LOCK.unlock()}}`

`newCondition()` 从lock获得condition对象，方法 `await()` `signal()` `signalAll()`



##### 读写锁`ReadWriteLock` 

悲观锁：同时最多一个写，读可同时

实例 `rwlock` 中有 `readLock()` 和 `writeLock()` 两个常量对象，读写的时候分别使用对应的锁

例子：帖子网站浏览大于回复

##### 乐观的不可重入的读写锁`StampedLock` 

优点：并发效率更高

缺点：需要额外的代码来判断读的过程中是否有写入，不可重入锁

方法: 

- `tryOptimisticRead()` 乐观读锁

- `validate(long stamp)` 检查乐观锁是否读后写

- `readLock()` 悲观读锁

- `writeLock()` 写锁

public void move\(double deltaX, double deltaY\) \{

long stamp = stampedLock\.writeLock\(\); // 获取写锁

try \{

x \+= deltaX;

y \+= deltaY;

\} finally \{

stampedLock\.unlockWrite\(stamp\); // 释放写锁

\}

\}

public double distanceFromOrigin\(\) \{

long stamp = stampedLock\.tryOptimisticRead\(\);

double currentX = x;

double currentY = y;

if \(\!stampedLock\.validate\(stamp\)\) \{ // 检查乐观读锁后是否有其他写锁发生

stamp = stampedLock\.readLock\(\); // 获取一个悲观读锁

try \{

currentX = x;

currentY = y;

\} finally \{

stampedLock\.unlockRead\(stamp\); // 释放悲观读锁

\}

\}

\}

##### 信号计数器`Semaphore` 

new传入int值，先调用 `acquire()` 可能会进入等待，然后通过`try ... finally`保证在 `finally` 中释放，用于控制并发量

可以使用tryAcquire\(\)指定等待时间，参数 `n, TimeUnit.SECONDS`



##### 线程安全类

1. List \- CopyOnWriteArrayList 

2. Map \- ConcurrentHashMap

3. Set \- CopyOnWriteArraySet

4. Queue \- ArrayBlockingQueue / LinkedBlockingQueue

5. Deque \- LinkedBlockingDeque



##### 原子操作封装类`Atomic` 

类型：`AtomicInteger`、`AtomicLong`、`AtomicBoolean`

方法：

- `addAndGet(int delta)` 增加值并返回新值

- `get` 获取当前值

- `getAndIncrement()` 原子加1

- `incrementAndGet` 加1后返回新值

- `compareAndSet(int expect, int update)` 比较并设置 

实现方法：通过CAS机制：类似乐观锁，预期值一致才更改，通过无锁（汇编语言cmpxchg锁定总线）实现线程安全

更高竞争场景使用 `LongAdder` 和 `LongAccumulator`

- AtomicReference

- AtomicStampedReference

###### Atomic使用会有什么问题？

ABA问题，因为cas比较的是值类型，所以

CAS操作失败则不断自旋重试，长时间不成功很浪费CPU；自旋时间长或线程竞争大了则升级为重量级锁

#### 线程池 `Executors` 类

接口 `ExecutorService`， 传入继承自 `Runnable` 的 `task`，执行 `submit(task)` 或 `execute(task)`\.

`shutdown()` 等待正在执行task完成关闭实例， `shutdownNow()` 立即关闭实例，`awaitTermination()` 等待指定时间

接口`ExecutorService` 实现类：

- `FixedThreadPool` 参数 `(n,n,0L,MS,new LinkedBlockingQueue<Runnable>())`

- `CachedThreadPool` 参数 `(0,Integer.MAX_VALUE,60L,SECS,new SynchronousQueue<Runnable>())`

- `SingleThreadPool` 参数 `(1,1,0L,MS,new LinkedBlockingQueue<Runnable>())`

接口 `ScheduledExecutorService`实现类:

- `newScheduledThreadPool` 参数 `(corePoolSize, Integer.MAX_VALUE, DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,new DelayedWorkQueue())`

以上4种类型，都是 `ThreadPoolExecutor` 得来，其核心参数有：
`(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler)`

ExecutorService executor = Executors\.newFixedThreadPool\(3\);

executor\.submit\(task1\);



ScheduledExecutorService ses = Executors\.newScheduledThreadPool\(4\);

// 1秒后执行一次性任务:

ses\.schedule\(new Task\("one\-time"\), 1, TimeUnit\.SECONDS\);

// 2秒后开始执行定时任务，每3秒执行:

ses\.scheduleAtFixedRate\(new Task\("fixed\-rate"\), 2, 3, TimeUnit\.SECONDS\);

// 2秒后开始执行定时任务，以3秒为间隔执行:

ses\.scheduleWithFixedDelay\(new Task\("fixed\-delay"\), 2, 3, TimeUnit\.SECONDS\);

Handler:

### 异步编程

异步一般用在不同的线程中。

情况一：主线程有主要逻辑，或者说出现并行业务场景，遇到较为耗时的操作就引入新的进程。这相当于cpu并发执行了两个线程，此处要自己分析两种操作是否为计算\+IO才可。具体IO包括数据库读写、接口调用，如跨服获取数据。

情况二：错误处理和超时处理

##### 区分同步异步与阻塞非阻塞的概念



#### Future

使用 `Callable<>` 接口代替 `Runnable` 获得任务返回值

`executor.submit(task1)` 返回 `Future` 类型

`Future` 方法:

- `get()` 获取任务返回值，阻塞直到任务完成

- `get(long timeout, TimeUnit unit)` 获取任务返回值，阻塞直到任务完成或超时

- `cancel(boolean mayInterruptIfRunning)` 取消任务

- `isDone()` 任务是否已完成、`isCanceled` 判断是否被取消

缺点：等待返回值阻塞主线程

#### CompletableFuture

可以传入回调对象，当异步任务完成或者发生异常时，自动调用回调对象的回调方法。

优点：

缺点：

通过 创建，接受一个实现了 接口的对象，完成时会调用 对象， 异常时会调用 对象

#### ThreadLocal

Context上下文：在一个线程中，横跨若干方法调用，需要传递的对象

ThreadLocal 用于解决线程内需要传递同一个对象，本质上就是个Thread为key、对象为value的键值对存储

`static ThreadLocal<User> threadLocalUser = new ThreadLocal<>();`



### 异常

#### 分类

Exception

\- RuntimeException

\- NullPointer

\- IndexOutOfBounds

\- IllegalArgument

\- IOException

\- ParseException

\- TimeOutException

#### 什么时候写

1. 方法定义时加`throws Exception`，由于Java异常沿调用栈向上传递，一个throw配一个catch，里面可写e\.printStackTrace\(\)）

2. 涉及IO时，使用try\(InputStream input = new xx\) 【Java7】

3. 涉及空指针`null`时，

4. 经典的Exception

catch\(Exception1 e\) \{throws Exception2\(e\)\}传递时不传参数e在异常栈中找不到对应真正Cause

自定义错误

#### Commons Logging



#### Log4J

- Appender 一条日志多个Appender输出到不同目的地（console、file、socket、jdbc）

- Filter 对日志进行过滤 

- Layout 格式化日志

配置文件log4j2\.xml

Commons\.Logging会自动发现并使用Log4j



## Spring

> 支持快速开发JavaEE app的框架，提供了一系列底层容器和基础设施，方便和常用开源框架集成
> 
> 

Spring是一个轻量级的控制反转（IoC）和面向切面（AoP）的容器（框架）

### 组成

- 核心容器：主要组件为BeanFactory，是工厂模式的实现，使用IoC模式将应用程序的配置和依赖性规范同实际应用程序代码分开

- Spring Context：配置文件，提供如电子邮件、国际化、校验和调度上下文信息

- Spring AOP：

- Spring DAO：

- Spring ORM：

- Spring Web模块：

- Spring MVC框架：

### Ioc 控制反转

为什么要控制反转？

1. 实例化类是比较困难的，因为可能存在**实例化依赖**，导入的class需要jvm通过classpath挨个查找或者读取配置，耦合度高；

2. 部分**可共享实例**难以处理谁实例化、谁使用，创建难题；

3. 共享组件被销毁谁回收难题。

"控制"指的是谁来控制对象的创建，在Spring中，对象不是由程序创建而是由Spring容器创建，这就是"反转"。

由IoC容器负责管理组件（JavaBean）生命周期，通过DI将组件的创建、配置同组件的使用相分离。

使用方法：导入spring\-context maven依赖

#### IoC容器接口 `Application Context` 

实现类

- ClassPathXmlApplicationContext\("CONFIG\_PATH"\) 从类的根路径下加载配置文件

- FileSystemXmlApplicationContext  从磁盘路径上加载配置文件

- AnnotationConfigApplicationContext\(config\.class\) 使用注解配置容器对象

### bean对象的生命周期

#### Spring Config配置文件

配置Bean标签标识`bean`

- id                Spring容器中的标识名，唯一

- class                类型，即配置bean的全路径名

- name                类中引用创建的类名，可以取多个，和id一样可以标识

- scope                作用域

- init\-method        方法名"init"

- destroy\-method        方法名"destroy"

\<bean id="hello" class="com\.vex\.dao\.hello"\>

#### 获取Bean

`Service service = (Service) ctx.getBean("bean.id")`

#### 依赖关系

在需要调用对应类的文件中写一个set方法，并配置property标签

`<property name="service" ref="bean.id">`

#### 作用域

- singleton（默认，方便复用）适用表现、业务、数据、工具曾对象

- prototype （相当于new新的实例）适用实体域对象（domain、entity、pojo）

- request

- session

#### Bean的创建/实例化

- 构造方法 Constructor 通过反射调用无参构造方法，因此无视private/public，但必须有无参构造方法（可以是自己写，或者没有构造方法系统自动生成）

- 静态工厂（工厂内的静态方法）

- `<bean id="service" class="工厂类路径" factory-method="工厂类中实际方法"/>`

- 实例工厂（先创建工厂示例再调用实例的创建方法）

- `<bean id="serviceFactory" class="工厂类路径"/>`

- `<bean id="service" factory-method="getService" factory-bean="serviceFactory"/>`

- 优化版：实现FactoryBean\<T\>接口创建一个serviceFactoryBean类，实现`获得实例`、`类型`、`作用域`3个方法

- `<bean id="service"`

#### 生命周期：

初始化：1\. 创建对象，内存分配 2\. 执行构造方法 3\. 执行属性注入 4\.执行bean初始化方法

\-\>使用\-\>销毁end 

通过实现`InitializingBean` 和 `DisposableBean` 
方法`afterProperties()`在创建后执行

### 依赖注入DI 

> Bean对象所依赖的资源由容器来设置和装配
> 
> 

- setter注入

    - 引用类型用ref，基本类型（包括String）使用value，每个都要有setXXX\(\)方法

    - `<property name="databaseName" value="10sql">` value会自动转类型

    - 适用于可选依赖，自己开发使用

- 构造器注入 

    - 变量要在构造方法中，配置在对应实例bean中，ref和value用法同上

    - `<constructor-arg name="形参arg" ref="">`

    - 耦合度较高，可使用type类型和index顺序（0开始）解耦

    - 适用于强制依赖，严谨

- 依赖自动装配

    - 用于引用类型依赖注入，不能对简单类型操作，自动找setter方法

    - `<bean id="service" class="" autowire="byType">`

    - 使用按类型装配必须保障容器相同类型的bean唯一，推荐使用；也可使用"byName"耦合度高

- 集合注入

- `<property name="list">`

### 注解开发

#### 定义Bean与生命周期

使用`@Component`代替bean定义，可以通过括号编写id，工具类可使用，其他用以下写法

- `@Controller`表现层

- `@Service` 业务层

- `@Repository` 仓库层

两者的区别在于，Component通过反射使用无参构造进行实例化，Bean可以用于配置第三方jar包

使用`@Scope`定义作用域

使用`@PostConstruct`和`@PreDestroy`生命周期的创建\&销毁

#### 配置Config

使用`@Configuration`代替bean配置文件xml，扫描组件`@ComponentScan({"PATH1","PATH2"})`
`@PropertySource({"xxx.properties","xx"})` 不能使用通配符\*
注：通过检查注解了解使用方法

#### 自动装配`@Autowired`

`@Autowired`实现按类型装配，使用暴力反射，无需setter，默认使用无参构造方法
遇到同类型会报错，需要取名，在`@Component()`括号中加入，按名称注入
在`@Autowired`下使用`@Qualifier()`指定名字的bean注入

简单类型使用`@Value()`注入properties内容

#### 管理第三方bean

不能把注解写进第三方代码，所以需要在Config类中编程实现一个返回需要值的实体对象
添加`@Bean()`表示返回值是bean，可以使用`@Import(otherConfig.class)`

第三方bean的依赖注入
简单类型：使用类的成员变量`@Value`编辑好
引用类型：向方法填入形参，如果这个形参Spring容器有，就会帮忙注入



#### 补充注解



### XML配置对比注解配置



### 整合MyBatis

暂略

### 整合JUnit



### AOP编程

面向切面（Aspect\-Oriented Programming），所谓"切面"，简单说就是那些与业务无关，却为业务模块所共同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块之间的耦合度，并有利于未

来的可操作性和可维护性。

#### 核心概念

把软件系统分为核心关注点和横切关注点，业务处理的主要流程是核心关注点，与之关系不大的部分是横切关注点。

将共性方法编写为通知类，找到需要执行通知的方法找出来定义为切入点，连接点时所有方法

- 切面：对横切关注点的抽象，描述通知与切入点的对应关系

- 横切关注点：对哪些方法进行拦截，拦截后怎么处理，这些关注点称之为横切关注点

- 连接点（join point）：程序执行过程中的任意位置（Spring中只支持方法的连接点）

- 切入点（point cut）：对连接点进行拦截的定义，或者说匹配连接点的式子

- 通知（advice）：在切入点执行的代码，即共性功能。

- 目标对象：代理的目标对象

- 织入（weave）：将切面应用到目标对象并导致代理对象创建的过程

- 引入（introduction）：不修改代码的前提下，引入可以在运行期为类动态地添加一些方法
或字段

#### 应用场景

- 权限

- 缓存

- 内容传递

- 错误处理

- 懒加载

- 调试

- 记录跟踪、校准

- 性能优化（测定接口的执行效率）

- 持久化

#### 使用AOP 

##### 使用切入点表达式：如何描述要增强的方法？

在AOP类加上 `@Component`和`@Aspect`

定义切入点`@Pointcut("execution(void 方法路径)")` `private void pt(){}`，可以是接口或实现类

标准格式`execution(<修饰符可省public> <返回值> <包名+类名/接口名>.<方法名> (<参数>) <抛异常>)`

可以使用配置加速描述:

- `*` 可独立或匹配前后缀 `com.`*`.Service.get`*

- `..` 多个连续的任意符号,可简化包名和参数的书写 `com..Service.getId (..)`

- `+` 专用于匹配子类类型 `(* *..Service+.*(..))` 子接口/实现类，匹配业务中所有方法

定义完切入点定义通知方法。

Spring Config需要添加`@EnableAspectJAutoProxy`。

##### 工作流程

1. Spring容器启动后读取所有切面配置的切入点

2. 初始化bean，判断bean对应类中的方法是否匹配切入点

    - 匹配成功，创建原始对象（目标对象）的代理对象

    - 匹配失败，正常创建对象，不报错

3. 获取bean的执行方法

    - AOP：获取的bean是代理对象，根据代理对象运行模式运行原始方法\+增强的内容

    - 非AOP：调用方法执行，完成



JDBC和ORM数据访问模块

基于Servlet的MVC开发

基于Reactive的Web开发

##### 通知类

通知分为前置、后置、异常、最终、环绕通知五类。

`@AfterThrowing` 方法异常时执行

`@AfterReturning` 方法正常运行玩进行

`@Around` 必须加入原始操作的调用，返回值要和拦截的方法一致，要抛出异常

@Around\("pt\(\)"\)

public \<primitive type\> aopAdvice\(ProceedingJoinPoint pjp\) throws Exception \{

sout\("Before"\);

// 无法预知原始方法是否有异常

Object ret = pjp\.proceed\(\);

sout\("After"\);

return ret;

\}

如果ProceedingJoinPoint未执行对原始方法的调用就不会执行，因此可以用if语句判断实现权限校验

##### 通知获取切入点数据

获取参数

- `JointPoint`

    - `jp.getArgs()`

- `ProceedingJoinPoint` 环绕通知特殊

    - `pjp.getArgs()`

    - `pjp.proceed(args)` 允许传参，可以改变原方法的参数

获取返回值

- 通知方法传参`Object ret`，注解标记`@AfterReturning(value = "pt()", returning = "ret")`

- 通知方法传参`Throwing t`，注解标记`AfterThrowing(value = "pt()", throwing= "t")`

##### 测量业务层接口万次执行的效率

@Pointcut\(execution"int com\.\.Service\.get\* "\)

### Spring 事务

在方法中开启事务管理`@Transactional`，一般开在业务层的接口中

配置事务管理器`TransactionManager`，Mybatis使用JDBC事务管理器

@Bean

public PlatformTransactionManager transactionManager\(DataSource dataSource\) \{

DataSourceTransactionManager ptm = new DataSourceTransactionManager\(\);

ptm\.setDataSource\(dataSource\);

return ptm;

\}

SpringConfig 打上注解`@EnableTransactionManagement`

#### 事务角色

事务管理员发起，事务协调员T1\-Tn加入变成一整个事务

#### 事务属性

- readOnly\(\) 设为true表示只读事务

- timeout\(\) 超时时间（\-1表示永不超时）

- rollBackFor\(Exception\.class\) 设置哪一类异常回滚，Error和运行时异常默认处理，其他不处理

- rollBackForClassName

- no\.\.\(\) 上面两种的否定形式

- propagation 事务传播：事务协调员对管理员所携带事务的态度

#### 事务传播行为



## Maven 

Maven是一个Java项目管理和构建工具，协助分模块开发

- Maven使用`pom.xml`定义项目内容，并使用预设的目录结构；

- 在Maven中声明一个依赖项可以自动下载并导入classpath；

- Maven使用`groupId`，`artifactId`和`version`唯一定位一个依赖。

使用：通过复制粘贴

`<group>`

### 依赖管理

传递依赖：

可选依赖：`<optional>true</optional>` 标记自身开发的，隐藏当前资源的依赖不被发现，隐藏后各用各的依赖，不具有传递依赖性

排除依赖：`<exclusions><exclusion>` 写在某个依赖`<dependency>`下，标记隐藏当前资源对应某个依赖不使用

聚合：`<packaging>pom</>`

继承

### 配置设置

[https://developer\.aliyun\.com/article/1471651](https://developer.aliyun.com/article/1471651)

配置优先级从高到低：项目pom\.xml \> user settings \> global settings

## SpringMVC

### 什么是SpringMVC？

属于Spring Framework生态里的一个模块，基于Servlet使用MVC模式\(Model\-\>View\-\>Controller\)设计的Web框架，主要目的是简化传统Servlet\+JSP模式下的Web开发，并对Java Web做增强扩展。主要体现在：将传统框架的Controller拆分为前端控制器DispatcherServlet和后端控制器Controller；将Model模型拆分为业务层Service和数据访问层Repository

##### Repository和DAO层的区别？

**DAO层（数据访问对象）**将使用它的域逻辑和任何特定的持久性机制或API分开，概念更低级别，更接近存储系统，负责与数据库交互，做数据映射/访问层工作，隐藏丑陋查询\.

DAO层不一定连数据库，也可能连Redis、Wiki等数据；实现可以是O/R Mapper，也可以是sql语句；接口方法签名独立于类，使用`String id` 而非 `Account account`

DAO的缺点在于没有明确定义职责：如果要查询一组满足特定条件的类？是否允许添加一个只修改邮箱字段的方法？很容易bloated导致测试麻烦；与类对象过于coupled

Repository层源自DDD设计思想，是更高级别的抽象，侧重于领域，将一组相关的对象视为一个集合，并提供对这些对象的增删改查操作

### 工作流程

客户端通过浏览器发送HTTP请求被DispatcherServlet接收, 其根据HandlerMapping查找和请求URL对应的Controller, Controller方法处理业务逻辑返回ModelAndView对象, ViewResolver解析逻辑视图为实际视图, 后渲染视图返回客户端HTML\.

REST\(Representational State Transfer\)通过HTTP方法（如GET、POST等）处理资源\(JSON或XML\)的请求和响应

Restful风格

工作流程：三层架构:Web层\-\>Service层\-\>数据访问层

Mapper层：

Model层：

DTO层：用于封装

Service层：写public方法给Controller调用, 包括增删改查数据库IService、业务逻辑代码\(分页获取VO, 校验数据, 获取查询条件\)

//1\.校验 //2\. 查询 //3\.逻辑代码 //4\.数据库操作 //5\.返回

### 注解

Controller层：接收请求（DTO和HttpServletRequest）调用Service层

@RestController 用于少写REST注解

@GetMapping\("/"\)参数HttpSession session, HttpServletRequest req,HttpServletResponse resp会自动传入

@PostMapping \(@RequestBody JavaBean bean\)能直接把Post参数反序列化为JavaBean后通过方法参数传入

此处bean用DTO类封装，类型和返回值都继承Serializable（要生成序列化ID）

### 开发MVC应用

根据软件工程理论：

1. 问题定义

    - 输出：经过客户确认的问题性质、项目目标和规模报告

2. 可行性分析

    - 输出：可行性论证报告、初步的项目开发计划

3. 需求分析

    - 输出：软件需求规格说明书

4. 总体设计

    - 输出：概要设计说明书、数据库/数据结构说明书、测试计划

5. 详细设计

    - 输出：详细设计规格说明书

6. 编码和单元测试

    - 

7. 综合测试

    - 输出：用户手册、源程序代码

8. 使用和维护

    - 



## SpringBoot

SpringBoot 快速启动依赖的三大核心特性：自动配置、内嵌Web服务器、起步依赖

### 启动流程

1. 从包含`@SpringBootApplication`注解的`main`方法作为入口点，调用`SpringApplication.run()`

2. 应用创建一个`SpringApplication`实例，在这个过程中会做一些重要的推断：

    - 推断应用类型是SERVLET、REACTIVE还是NONE

    - 设置初始化器：查找并加载`META-INF/spring.factories`文件中定义的`ApplicationContextInitializer`

    - 设置启动监听器：同样从`META-INF/spring.factories`中加载`SpringApplicationRunListener`和`ApplicationListener`。这些监听器会在应用生命周期的不同阶段（如启动开始、环境准备、上下文加载等）接收事件通知，让你有机会在特定时机插入自定义逻辑。

    - **确定主应用类**：通过`main`方法所在的类来确定主应用类。

3. 准备环境：这一步会加载各种属性源

4. 创建和刷新应用上下文（Application Context）：

    - 对于Web应用创建的是`AnnotationConfigServletWebServerApplicationContext`

    - 加载Bean定义，通过`@EnableAutoConfiguration`注解，SpringBoot开始扫描并加载**所有自动配置类**（同样位于`META-INF/spring.factories`中）

    - 刷新上下文：所有Bean定义都已加载，容器开始“刷新”：实例化单例Bean、处理依赖注入、调用Bean的初始化方法等。

5. 启动内嵌Web服务器（Web应用），并注册相关的Servlet和Filter。

6. run启动成功，执行实现了`CommandLineRunner` 和 `ApplicationRunner` 接口的初始化逻辑。

7. 发布ready事件，触发`ApplicationReadyEvent`，应用进入运行状态，处理业务请求或任务。

补充：

- `@SpringBootApplication` 是个组合注解，包含以下三个核心注解：

    - `@SpringBootConfiguration`：相当于`@Configuration`，表示该类是Spring 配置类。

    - `@EnableAutoConfiguration`：启用自动配置功能

    - `@ComponentScan`：启用组件扫描，默认扫描当前包及其子包下的Spring 组件（如`@Service`、`@Controller` `@Repository` 等）。

### 配置

#### 配置文件

依次顺序为application\.properties，yaml, yml三种

数据读取方法

- 读取单个数据 `@Value("${server.port}")` 

- 封装全部数据到Environment对象

    - @Autowired 
    private Environment env;
    //env\.getProperty\("p\.sub\[0\]"\)

- 自定义数据封装

    - @Component
    @ComponentProperties\(prefix = "database"\)
    public class Database \{
        private String name;
    \}



#### 多环境配置

主文件application配置

spring:

config:

activate:

on\-profile: dev

其余文件application\-prod

spring:

profiles: prod

### 依赖

spring\-boot\-starter\-parent 起步依赖

## 实际业务/写代码问题

处理字符串: StringUtils\(Apache\)

注释:1\.author 2\./\*\* 3\. region

\<common\>错误Exception怎么写?

继承RuntimeException\(Throwable\), 定义BusinessException, 枚举类ErrorCode

方法类型怎么确定?

一般不返回true，因为可以用自己定义的throwUtils，Controller类型为ResultUtils\(BaseResponse\(Serializable\)\)

可以返回类

对数据库增删改查: 使用IService中实现类

实体类 = Service\.getById  Service\.getOne\(Wrappers\.lambdaQuery\(实体类\.class\)\.eq\(类名::get属性, 某个value\)\)

注解

## 性能优化

响应式编程（focus异步数据流、变化传播）streamapi from java8 声明式编程

RxJava 事件驱动（事件流被观测）、可观测序列（绑定操作时间方法）

Observable/Flowable（反向压力） 被观察者\.subscribe\(Observer\)

事件doOnNext\(\) doOnError\(\) doOnComplete\(\)

前后端实时通讯

1\.轮询 有延迟 2\.SSE\(单向\)文本格式 3\.WebSocket\(全双工\)二进制协议难调试

SSE\(Server\-Sent Events\) 后端推送给前端, HTTP类型text/event\-stream

## 工具、插件使用

### lombok注解：

@Data为类中所有字段生成getset方法

@Builder

@Constructor

generateAllSetter

### Hutool

JsonUtil\.toList\(\) 

StrUtil\.isNotEmpty\(\)）

ResourceUtil 获取URL

### sonarLint

### Jackson序列化、反序列化

### autoFillingJavaArgument

HttpURLConnection

## 设计模式

[参考网站](https://refactoringguru.cn/design-patterns)

### 创建型模式

#### 工厂方法（Factory Method）

面向抽象编程，工厂模式可以不用考虑创建实例的细节，直接从工厂中获得，至于实际是从缓存中获得还是新建可以不关注，达到解耦效果

#### 抽象工厂（Abstract Factory）

抽象工厂定义了需求，相当于公布一个规范进行招标（工厂接口和产品接口），由不同的实现方式进行投标，需求方不关心投标方内部是如何实现需求的，只要符合接口规范就可以对接，只要根据具体情况选择合适的供应商就可以了。

#### 单例模式（Singleton）

> 一个类只有一个实例，并提供一个访问它的全局访问点

- 只有private构造方法，确保外部无法实例化；

- 通过private static变量持有唯一实例，保证全局唯一性；

- 通过public static方法返回此唯一实例，使外部调用方能获取到实例。

不适合延迟加载，可以使用`enum`编写一个只有一个枚举的类,不过通常使用框架实现\(@Component\)

饿汉式（立即初始化）、懒汉式（延迟加载）、双重检查


### 结构型模式

#### 装饰器（Decorator）

运行期动态给对象实例增加功能的方法，实际把核心功能和附加功能分开，比生成子类更加灵活

适配器

代理

观察者

模板方法

责任链

### 行为模式

#### 策略模式Strategy

将不同的算法定义到不同的对象中
