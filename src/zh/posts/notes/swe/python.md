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

```Plain Text
pip install

pip freeze
```

使用\*号

1. 一个\*将数组解包，\*\*将字典解包，这种用法用在传递函数参数，增删改查

2. 函数形参一个\*代表参数元组，两个\*代表有关键字的参数字典

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

#### 并发和并行

#### 多线程异步

async和await

#### 协程（Coroutine）

由于线程切换是在内核态进行，需要中断用户态切换到内核态，期间需要保留线程块、计数器等开销，效率远没有在一个线程中切换子程序高。还有一点就是同一个线程不需要考虑读写冲突，因此没有加锁的开销。

#### 回调函数（Callback）

**回调**是一种编程模式，其核心思想是：**“现在把一个函数给你，但不要立即执行它，等到特定的事件发生或特定的任务完成时，由你（调用方）来调用（Call Back）它。”**

简单来说，回调是**延迟执行的函数**。



异步编程、事件驱动编程和函数式编程



### 类

#### 属性

@property

#### 抽象方法\&类方法

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

