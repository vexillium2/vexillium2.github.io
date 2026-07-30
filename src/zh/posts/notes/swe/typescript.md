---
lang: zh-CH
title: 软件测试笔记
description: 部署、测试、bug记录
date: 2026-07-08
category:
  - 后端开发
tag:
  - 测试
---

- [Javascript社区速查文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [Typescript官方文档](https://typescript.bootcss.com/index.html)

JS: 代码由浏览器引擎（如 Chrome 的 V8）或 Node.js 执行。V8 也会把 JS 编译成机器码，但它的优化方向是极快地启动和处理 I/O，而不是极致的 CPU 计算。

JS: 单线程（Single-threaded）。同一时刻只能执行一段代码。
为什么单线程还能高并发？ 因为 JS 依赖 Event Loop（事件循环） + 非阻塞 I/O。
Java 类比: 想象一个只有 1 个服务员的餐厅（JS 主线程）。但他手里有个对讲机，点完菜直接把单子扔给后厨（C++ 层面的 libuv/线程池），然后立刻去接待下一桌。等菜做好了，后厨通过对讲机喊一声，服务员再把菜端给客人。
注意: 在 JS 里，千万不要在主线程做耗时的 CPU 计算（比如大数组排序、复杂加密），这会直接卡死整个事件循环，导致后续所有请求都超时。

JS: 也是自动 GC，但你几乎无法干预。V8 使用分代回收（Scavenge 算法处理新生代，Mark-Sweep/Mark-Compact 处理老生代）。
坑点: JS 里有很多隐式内存泄漏（比如忘记解绑的事件监听器、闭包引用）。在 Java 里你可能习惯了对象用完就扔，在 JS 里要时刻警惕闭包（Closure）带来的内存驻留。

JS 的 Class 只是语法糖: JS 底层依然是基于原型（Prototype）的继承。当你写 class Dog extends Animal，V8 底层是在操作 Dog.prototype = Object.create(Animal.prototype)。
没有真正的访问修饰符: Java 有 private/protected/public。JS 里以前全靠约定（_privateVar），现在虽然有了 #privateVar，但很多老代码还是全公开的。
TS 的 Interface 是纯编译期产物: Java 的 Interface 编译后还是 .class 文件，运行时有反射。TS 的 interface 编译后直接消失，变成纯 JS 对象。所以你不能在 JS 里用 instanceof 去判断一个对象是否实现了某个 TS 接口。

JS 独有的新特性（Java 没有或晚有的）
一等公民函数: 在 Java 8 之前，函数不能脱离类存在。在 JS 里，函数就是对象，可以随意传递、赋值、作为返回值。
javascript

编辑



// Java 需要写个接口或 Lambda，JS 直接传
const doSomething = (callback) => callback();
解构赋值 (Destructuring): Java 14+ 才有 Record，且解构能力弱。JS 里极其常用：
typescript

编辑



const { name, age } = user; // 直接从对象提取
const [first, ...rest] = array; // 数组切片
可选链与空值合并 (?. 和 ??): 解决 Java 里烦人的 NullPointerException。
typescript

编辑

// Java: if (user != null && user.getAddress() != null) ...
// TS:
const city = user?.address?.city ?? 'Unknown';

JS: 回调地狱 -> Promise -> async/await。JS 的 async/await 本质上还是事件循环，它不会创建新线程，只是让异步代码“看起来”像同步。
动态类型与鸭子类型: 虽然你学的是 TS，但运行时 JS 是动态的。“如果它走起来像鸭子，叫起来像鸭子，它就是鸭子”。TS 的结构化类型系统（Structural Typing）就是基于此：只要对象有 name 和 age 属性，哪怕它没声明 implements User，TS 也认为它是 User。

忘掉“万物皆对象”的绝对性: JS 里基本类型（string, number）和对象在底层处理完全不同，基本类型传值，对象传引用。
重点攻克 this 关键字: Java 的 this 永远指向当前实例。JS 的 this 是个“渣男”，谁调用它，它就指向谁，或者在箭头函数中指向定义时的上下文。这是 Java 转 JS 最容易踩坑的地方。
理解 TS 的类型体操: 既然你懂 Java 泛型，TS 的泛型对你来说不难。但 TS 有 infer、Mapped Types、Conditional Types，这些是 Java 没有的“编译期图灵完备”特性，用来做极度复杂的类型推导。
拥抱函数式编程: JS 里大量使用 map, filter, reduce。少写 for 循环，多用高阶函数。

### 特有运算符
-? 将原本可选的属性？方法变为必需
in
keyof
A extends B 类型约束，类型A是类型B的合法键
??=

