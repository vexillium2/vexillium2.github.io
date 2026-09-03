---
lang: zh-CH
title: Python 学习笔记
description: Python 规范、语法糖与常用库
date: 2025-08-22
category:
  - 后端开发
tag:
  - 编程语言
---

## Python规范

参考https://peps\.python\.org/pep\-0008/

### 项目管理

#### 使用conda和venv

```Python
python -m venv .venv
```

#### 包管理pip

```Python
pip install

pip freeze
```

使用\*号

1. 一个\*将数组解包，\*\*将字典解包，这种用法用在传递函数参数，增删改查

2. 函数形参一个\*代表参数元组，两个\*代表有关键字的参数字典

#### uv

[uv](https://docs.astral.sh/uv/) 是 Astral 用 Rust 写的 Python 包/项目管理工具，定位是把 venv、pip、pip-tools 等分散的环节合并为 Cargo 式的统一工作流：依赖声明在 `pyproject.toml`，`uv.lock` 锁定可复现的精确版本。速度优势来自并行下载与全局内容寻址缓存（不同项目共享同一份已下载的 wheel）。

```Bash
uv add requests        # 添加依赖并写入 uv.lock
uv sync                # 按 uv.lock 创建/更新 .venv 并安装
uv run python main.py  # 在项目 .venv 中执行命令
```

pip 用户也可以逐条替换旧命令：`uv venv` 建环境，`uv pip install xxx` 语法与 `pip install xxx` 一致，但需要先激活 `.venv`，或用 `--python`/`--system` 显式指定目标。

需要注意的边界：

- `uv add`/`uv sync`（项目模式，同步 pyproject.toml）与 `uv pip install`（直接写入当前环境）是两套工作流，不要混用，否则依赖会漂移到 lock 管理之外。
- `uv python install` 会把解释器装进 uv 自己的托管目录，并不等于使用系统 Python；依赖系统解释器的场景应先用 `uv python find` 确认。

### 基础知识

#### 输入输出

添加f表示格式化字符串，通过\{expression\}表达式将值添加进字符串，格式说明符后传递整数。还有一些修饰符可以在格式化前转换值。 `'!a'` 应用 [`ascii()`](https://docs.python.org/zh-cn/3.13/library/functions.html#ascii) ，`'!s'` 应用 [`str()`](https://docs.python.org/zh-cn/3.13/library/stdtypes.html#str)，`'!r'` 应用 [`repr()`](https://docs.python.org/zh-cn/3.13/library/functions.html#repr)。`=` 说明符可被用于将一个表达式扩展为表达式文本、等号再加表达式求值结果的形式。

```Python
**print("f{**math.pi**:**.03f**}")    # 不加f，就不会识别math.pi**
```

旧版也使用str\.format\(\)来处理，format识别替换字符大括号，格式为\{field\_name : format\_spec\}，field\_name可以写数字、字母或默认顺序标记，format\_spec用来控制数字、对齐、填充。【如果存在逗号 \(`,`\)，Python 将忽略零填充 \(`0`\) 的宽度要求，而优先处理逗号和对齐】

```Python
"xxx{}XXX{}Xxx".format(str1, str2)
"{:=^20,.3f}".format(number1)
"{:<10}".format("Left")    # 靠左对齐
"{:*^10}".format("Hi")    # 居中并使用*填充10各字符
```

#### 生成器和迭代器

它们都在collection\.abc下定义。

生成器（Generator）是指可以使用next\(“生成器实例”\)来获得下一个元素的函数对象，通过在循环时再计算来实现。一可以使用圆括号的列表推导式来生成，可以使用for与in来生成，二可以使用有yield的函数，调用next时执行、遇到yield返回。

迭代器（Iterator）是collections\.abc的抽象基类，指实现了 `iter` 和 `next` 方法的对象，是遍历过程中的状态。它可以作用于for循环的对象，可以看作一个有限或无限的数据流。可以通过isinstance\(obj, \.Iterator\)来判断是否是迭代器，生成器、iter\(list\)、dist\.keys\(\)属于迭代器，但list, dict不属于。

可迭代对象（Iterable）是实现了 `iter` 方法的对象，可以通过 `for` 循环遍历，包括集合和生成器。迭代器、列表都是可迭代对象

#### 装饰器

**装饰器函数**是一个接受一个函数作为输入，并返回一个新函数的函数。

```Python
def provider(fn):
    def exec():
        log.info("---开始执行---")
        fn()
        log.info("---执行完成---")
    return exec
    
@provider
def mysql_provider():
    pass
```

#### 字符串操作

字符串替换、大小写

group函数

确认类

### 并发与异步编程

Python 处理并发/并行的三套工具：**线程（threading）**、**进程（multiprocessing）**、**协程（asyncio）**，选择取决于任务类型。CPython 的 **GIL（全局解释器锁）**使同一进程内的 Python 线程无法并行执行字节码，所以线程对 CPU 密集型任务几乎无加速，此类任务一般用多进程；I/O 密集型任务（网络请求、读写等待）主要时间花在等待上，适合用线程或协程把等待时间重叠起来。

#### 协程与 async/await

线程切换是在内核态进行的，需要中断用户态切换到内核态，期间需要保留线程栈、计数器等，开销远没有在一个线程内切换子程序高；同一线程内也不需要考虑读写冲突，因此没有加锁开销。**协程（Coroutine）是"可以被挂起再恢复"的函数**：挂起时保存当前执行状态并让出 CPU，条件满足后再继续。

```Python
async def fetch(url):
    data = await http_get(url)   # 挂起点：等待结果时让出控制权
    return data
```

- `async def` 定义**协程函数**；调用它只生成 coroutine 对象，**函数体不会立即执行**，必须交给事件循环运行（`await`、`asyncio.run()`、`asyncio.create_task()` 三选一）。
- **`await` 只能写在 `async def` 内**，等待一个 *awaitable*。常见 awaitable 有三类：协程本身、Task、Future。
- `await` 的语义：当前协程挂起直到结果就绪；调用链上任意一层挂起，整条链的控制权都交还给事件循环，其它协程才有机会运行。

#### 回调与事件驱动

**回调**是一种编程模式，其核心思想是：**"现在把一个函数给你，但不要立即执行它，等到特定的事件发生或特定的任务完成时，由你（调用方）来调用（Call Back）它。"**

简单来说，回调是**延迟执行的函数**。它天然适配异步与事件驱动场景：I/O 完成时由运行时调用回调。缺点是多层嵌套依赖会形成难读的**回调地狱（callback hell）**；async/await 用同步书写顺序表达异步控制流，本质是回调的语法替代。

#### 事件循环与 asyncio.run

**asyncio 的核心是事件循环（event loop）：在单线程内不断调度就绪的协程与回调，协程在 await 处挂起时切换执行其它任务。** 新代码统一入口：

```Python
import asyncio

async def main():
    print("hello")

asyncio.run(main())   # 创建事件循环 → 运行 main → 结束后关闭循环
```

- `asyncio.run()`（3.7+）负责创建、运行、关闭事件循环，程序顶层只调用一次；不要在已有运行中循环的上下文里再调用它。
- 旧式 `loop = asyncio.get_event_loop()` + `loop.run_until_complete()` 只用于维护老代码。

#### Task 与并发执行

Task 是"**已经交给事件循环调度的协程**"。`asyncio.create_task(coro)` 注册协程并立即返回 Task，此后它与当前代码并发执行（真正切换发生在某个 await 挂起点）。

```Python
async def main():
    t1 = asyncio.create_task(fetch("a"))
    t2 = asyncio.create_task(fetch("b"))
    results = await asyncio.gather(t1, t2)   # 并发等待全部完成
```

- `asyncio.gather(*aws, return_exceptions=False)`：等待全部完成并返回结果列表；默认第一个异常立即上抛（其余任务仍会跑完但结果被丢弃），设 `return_exceptions=True` 可把异常当作结果收集。
- `asyncio.wait(aws, timeout=..., return_when=...)`：返回 `(done, pending)` 两个集合，适合带超时或"最先完成"（`FIRST_COMPLETED`）策略。
- `asyncio.as_completed(aws)`：按完成先后逐个产出结果，适合先完成先处理。
- Task 常用操作：`task.cancel()` 取消、`task.done()` / `task.result()` 查询；`await asyncio.sleep(0)` 是显式让出控制权的挂起点，排查"某个任务饿死"先看它前面有没有挂起点。
- 3.11+ 还有 **`asyncio.TaskGroup`**：`async with` 管理一组任务，任一成员抛异常会取消组内其余任务。

#### 超时与取消

- `asyncio.wait_for(coro, timeout)` 超时抛 `TimeoutError`；更优雅的是上下文管理器 `async with asyncio.timeout(delay):`（3.11+）。
- `task.cancel()` 会向目标协程注入 **`asyncio.CancelledError`**。它继承自 `BaseException`，`except Exception` 抓不到；协程应在 `finally` 中释放资源。`asyncio.shield(aw)` 可屏蔽取消：外层取消不波及内部任务。

#### 同步代码与线程桥接

- 协程里直接调用阻塞式同步函数会卡死整个事件循环，应改用 `await asyncio.to_thread(func, *args)`（3.9+）丢到默认线程池；底层等价物是 `loop.run_in_executor(None, func, ...)`。
- 反过来，在其它线程里向运行中的循环投递协程用 `asyncio.run_coroutine_threadsafe(coro, loop)`，返回 `concurrent.futures.Future`。
- 选型结论：**CPU 密集型要真并行用进程（`ProcessPoolExecutor`），asyncio 只适合 I/O 密集型。**

#### 协程间的原语与异步迭代

- `asyncio.Lock / Event / Semaphore / Condition` 与 `threading` 同名原语概念一致，但获取必须 `await`：`async with lock:`。线程锁不能在协程里直接使用（会阻塞循环），asyncio 原语也不能当线程锁用。
- `asyncio.Queue` 用于协程间解耦：`await q.put(x)` / `await q.get()`，配合 `task_done()` / `join()` 实现生产者-消费者。
- 异步协议扩展：`async with`（异步上下文管理器 `__aenter__` / `__aexit__`）、`async for`（异步迭代 `__aiter__` / `__anext__`，或 `async def` + `yield` 的异步生成器）。

#### 常见坑

- **忘 `await`**：协程从未被调度，解释器警告 `coroutine ... was never awaited`。
- **协程里用同步阻塞调用**（`time.sleep`、同步 `requests`）：整个事件循环被卡住，其它任务全部暂停；换成 `await asyncio.sleep()` 或 `asyncio.to_thread`。
- **伪并发**：`[await fetch(i) for i in ...]` 是串行等待；要并发必须先 `create_task` 再一次性 `gather`。
- **忽略 CancelledError**：它继承 `BaseException`，`except Exception` 不生效；超时/取消路径下的资源清理要写在 `finally`。

### 类

#### 属性

@property

#### 抽象方法\&类方法

#### 静态方法（@staticmethod）

**@staticmethod 把一个普通函数放进类的命名空间，调用时不隐式传入实例（self）或类（cls），函数本身不感知调用者是类还是实例。** 因此 `Validator.check(...)` 和 `Validator().check(...)` 行为一致，实例在这里只承担"查找方法"的作用。

```Python
class Validator:
    @staticmethod
    def check(s: str) -> bool:
        return "@" in s

Validator.check("a@b")     # True
Validator().check("a@b")   # True：实例只用于查找
```

对比理解更有效：实例方法隐式绑定 self，classmethod 隐式绑定 cls（可读类级状态、子类覆写时保持多态），**staticmethod 是唯一不绑定任何东西的，原样返回函数本身**。因此"方法需要访问类级数据或支持子类多态"应该用 classmethod；"把与类主题强相关的纯函数收进类里、便于从 `ClassName.method()` 调用"才用 staticmethod。

常见误区：

- staticmethod 内部拿不到类状态，引用类级常量只能写类名，一旦被子类继承、常量被覆写，写死的父类名不会跟着变——这类需求应改用 classmethod。
- 不需要 Java 式的"static 工具类"：与类概念无关的纯函数放模块顶层即可，staticmethod 的价值只是语义上的归属与调用入口。

### 内存管理方式



## Python常用库

### sys系统库

#### sys\.prefix

```Plain Text
python -c "import sys; print(sys.prefix)"
```

#### sys\.path设置项目运行目录

Python 代码使用import语句时，会按照当前目录\-\>`PYTHONPATH`环境变量\-\>Python标准库\-\>`site-packages` 目录。通常来说，一个项目只有一个入口，如果你单独运行内部某一个模块，往往会报错，因为运行的脚本被认为是顶级模块（\_\_name\_\_='\_\_main\_\_'），出现相对引用会找不到父包（因为已经是根目录了）。

对于文件之间的import导入/引用，推荐采用相对路径引用。

```Python
from . import module_a
from ..module import fn_a
from ... import module_b
```

如果不用相对引入，默认按照根目录找，即`sys.path`，一般最好提前设置，动态设置不太规范

1. 提前设置

    ```Python
    # Powershell
    $env:PYTHONPATH="E:\Project\AGI\14_L2RAG"
    # Linux
    echo PYTHONPATH="/home/vex/python" >> ~/.bashrc
    source ~/.bashrc
    ```

2. 动态设置（不推荐但好用）

    ```Python
    import os
    import sys
    your_program_path = os.path.join(__file__, '..', '..')
    sys.path.append(your_program_path)
    
    import sys
    sys.path.insert(0, sys.path[0]+"/../")
    ```

### time/datetime时间

Datetime

```Python
*from* datetime *import* datetime
current_datetime = datetime.now()
   formatted_time = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
```

### re正则表达式

对于search有一些常用Flag比如忽略大小写、匹配换行符、多行、允许注释和空白等。

```Python
# 返回match字符串对象或None
match = re.search(pat, txt)    # 搜索第一个匹配的
re.match()    # 只匹配开头
re.fullmatch()    # 整体匹配

match.group(0)    *# 整个匹配: '2024-07-15'*
match.group(1)    *# 第一个分组: '2024'*
match.group(2)    *# 第二个分组: '07'*
match.groups()    *# 所有分组: ('2024', '07', '15')*
match.start()     *# 匹配开始位置*
match.end()       *# 匹配结束位置*
match.span()     *# (start, end) 元组    *

# 返回所有匹配字符串的list
re.findall()
re.finditer()# 返回迭代器
re.split()
# 替换所有匹配的字符串，repl可以是函数或字符串
re.sub(pat, repl, txt, max_count)
# 编译，重复执行时提高效率
pattern = re.compile(r"。|？")

```

r""字符串表示raw原生字符串。具体规则如https://docs\.python\.org/zh\-cn/3/library/re\.html。知识点包括：转义字符、\[\]单个、\(\)分组、\{\}量词、

```Python
*# ========== 基础字符匹配 ==========*
re.search(r'hello', 'hello world')                    *# 匹配字面量 "hello"*
re.search(r'\.', 'a.b')                                *# 转义特殊字符，匹配点号 "."*
re.search(r'\\', 'path\\to\\file')                     *# 匹配反斜杠 "\"*

*# ========== 字符类 ==========*
re.search(r'[abc]', 'apple')                           *# 匹配 a、b 或 c 中的任意一个*
re.search(r'[a-z]', 'hello')                          *# 匹配小写字母 a 到 z*
re.search(r'[A-Z]', 'Hello')                          *# 匹配大写字母 A 到 Z*
re.search(r'[0-9]', 'abc123')                          *# 匹配数字 0 到 9*
re.search(r'[a-zA-Z0-9]', 'Hello123')                 *# 匹配字母和数字*
re.search(r'[^abc]', 'def')                            *# 否定字符类，匹配除 a、b、c 之外的字符*
re.search(r'[^0-9]', 'abc123')                         *# 匹配非数字字符*

*# ========== 预定义字符类 ==========*
re.search(r'\d', 'abc123')                           *# 匹配数字，等价于 [0-9]*
re.search(r'\D', 'abc123')                           *# 匹配非数字，等价于 [^0-9]*
re.search(r'\w', 'hello_123')                        *# 匹配单词字符（字母、数字、下划线），等价于 [a-zA-Z0-9_]*
re.search(r'\W', 'hello world')                      *# 匹配非单词字符*
re.search(r'\s', 'hello world')                      *# 匹配空白字符（空格、制表符、换行等）*
re.search(r'\S', 'hello world')                      *# 匹配非空白字符*
re.search(r'.', 'a\nb')                              *# 匹配除换行符外的任意字符*
re.search(r'.', 'a\nb', re.DOTALL)                   *# 使用 DOTALL 标志，. 可以匹配换行符*

*# ========== 量词（重复次数） ==========*
re.search(r'a?', 'abc')                               *# ? 匹配 0 次或 1 次（可选）*
re.search(r'a+', 'aaaabc')                            *# + 匹配 1 次或多次（至少一次）*
re.search(r'a*', 'bc')                                *# * 匹配 0 次或多次（任意次数）*
re.search(r'a{3}', 'aaaabc')                          *# {n} 匹配恰好 n 次*
re.search(r'a{2,4}', 'aaaabc')                        *# {m,n} 匹配 m 到 n 次*
re.search(r'a{2,}', 'aaaabc')                         *# {n,} 匹配至少 n 次*
re.search(r'a{,3}', 'aaaabc')                         *# {,n} 匹配最多 n 次*

*# ========== 贪婪与非贪婪匹配 ==========*
re.search(r'<.*>', '<div>content</div>')              *# 贪婪匹配，匹配尽可能多的字符*
re.search(r'<.*?>', '<div>content</div>')             *# 非贪婪匹配，匹配尽可能少的字符*
re.search(r'a+?', 'aaaabc')                           *# 非贪婪匹配，匹配最少的 a*

*# ========== 位置锚点 ==========*
re.search(r'^hello', 'hello world')                   *# ^ 匹配字符串开头*
re.search(r'world$', 'hello world')                   *# $ 匹配字符串结尾*
re.search(r'^hello world$', 'hello world')            *# 同时使用 ^ 和 $ 完全匹配*
re.search(r'\bword\b', 'word boundary')              *# \b 单词边界*
re.search(r'\Bword\B', 'swordfish')                  *# \B 非单词边界*

*# ========== 分组和捕获 ==========*
re.search(r'(hello)', 'hello world')                  *# () 捕获分组*
re.search(r'(hello) (world)', 'hello world')          *# 多个分组*
re.search(r'(hello|world)', 'hello')                   *# | 或运算符，匹配 hello 或 world*
re.search(r'(?:hello)', 'hello world')                *# (?:) 非捕获分组，不保存匹配结果*
re.search(r'(?P<name>hello)', 'hello world')         *# (?P<name>) 命名分组*
re.search(r'(hello)\1', 'hellohello')                 *# \1 引用第一个分组的内容*

*# ========== 前后查找（零宽断言） ==========*
re.search(r'(?=hello)', 'hello world')                *# (?=) 正向前瞻，匹配后面跟着 hello 的位置*
re.search(r'(?!hello)', 'world hello')                *# (?!) 负向前瞻，匹配后面不跟着 hello 的位置*
re.search(r'(?<=hello) ', 'hello world')              *# (?<=) 正向后顾，匹配前面是 hello 的位置*
re.search(r'(?<!hello) ', 'world hello')              *# (?<!) 负向后顾，匹配前面不是 hello 的位置*

*# ========== 常用模式示例 ==========*
re.search(r'\d+', 'abc123def')                        *# 匹配一个或多个数字*
re.search(r'\d{4}-\d{2}-\d{2}', '2024-07-15')        *# 匹配日期格式 YYYY-MM-DD*
re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', 'user@example.com')  *# 匹配邮箱*
re.search(r'https?://\S+', 'Visit https://example.com')  *# 匹配 HTTP/HTTPS URL*
re.search(r'ORD\d{10}', '订单ORD2024071501')         *# 匹配订单号格式*
re.search(r'[\u4e00-\u9fa5]+', '你好世界')            *# 匹配中文字符*
re.search(r'\d{3}-\d{4}-\d{4}', '138-1234-5678')     *# 匹配手机号格式*
re.search(r'^[A-Z][a-z]+$', 'Hello')                 *# 匹配首字母大写的单词*
re.search(r'\b\w+@\w+\.\w+\b', 'Contact: user@example.com')  *# 匹配单词边界内的邮箱*

*# ========== 标志（Flags）使用 ==========*
re.search(r'hello', 'HELLO', re.IGNORECASE)         *# re.I 忽略大小写*
re.search(r'hello.world', 'hello\nworld', re.DOTALL)  *# re.S 让 . 匹配换行符*
re.search(r'^start', 'line1\nstart', re.MULTILINE)   *# re.M 多行模式，^ 和 $ 匹配每行*
re.search(r'hello # 注释', 'hello', re.VERBOSE)      *# re.X 详细模式，允许注释和空白*
re.search(r'hello', 'HELLO', re.I | re.M)            *# 组合多个标志*

*# ========== 实际应用示例 ==========*
re.sub(r'\d+', 'NUM', 'abc123def456')                 *# 替换所有数字为 "NUM"*
re.split(r'[,\s]+', 'a, b,  c')                      *# 按逗号和空格分割*
re.findall(r'\d+', 'abc123def456')                    *# 查找所有数字*
re.findall(r'(\d{4})-(\d{2})-(\d{2})', '日期: 2024-07-15')  *# 查找所有日期并捕获分组*
re.match(r'^\d+$', '12345')                          *# 验证字符串是否全是数字*
re.fullmatch(r'ORD\d{10}', 'ORD2024071501')          *# 完全匹配订单号格式*

*# ========== 复杂模式示例 ==========*
re.search(r'<(\w+)>.*?</\1>', '<div>content</div>')  *# 匹配 HTML 标签，使用反向引用*
re.search(r'(\d{1,3}\.){3}\d{1,3}', '192.168.1.1')   *# 匹配 IP 地址（简化版）*
re.search(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$', 'user@example.com')  *# 完整邮箱验证*
re.search(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})', '2024-07-15')  *# 命名分组提取日期*
re.search(r'(?<=订单号：)\w+', '订单号：ORD2024071501')  *# 使用后顾提取订单号*
```

### 爬虫库 requests

官方使用urllib，但是推荐第三方库requests



### logging



```Bash
# 配置 **Root Logger（根日志记录器）**
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(name)s -   %(message)s",
    datefmt="%m/%d/%Y %H:%M:%S",
    level=logging.INFO,
)

logger = logging.getLogger(__name__)
```

### typing

Dict, List, Optional, Tuple

### dataclasses简化数据类

提供了一个装饰器 `@dataclass`，用于自动为类生成一些“样板代码”，包括`__init__`、`__repr__`、`__eq__`、`__hash__`

field\(\)是 **`dataclasses`**** 模块自带的**一个工厂函数，可以提供默认值、默认工厂和元数据

```Bash
inventory: list[str] = field(default_factory=list)
```

### poetry包管理

### pydantic数据验证

### numpy、pandas、sci\-kit



### Pytorch

留意版本

```LaTeX
# CPU版本
pip install torch==2.8.0 torchvision==0.13.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cpu
pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cpu
# CUDA版本（根据你的CUDA版本选择）
pip install torch==2.8.0 torchvision==0.13.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu118
```

