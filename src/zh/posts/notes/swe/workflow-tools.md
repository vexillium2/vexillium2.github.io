---
lang: zh-CH
title: 工作流与工具使用
description: 从需求分析到线上运维的全流程SOP、开发范式与工具链沉淀
date: 2026-01-02
updated: 2026-08-10
category:
  - 后端开发
  - 软件工程
tag:
  - SOP
  - Git
  - API 设计
  - Code Review
  - 开发效率
---


## 工作内容

### 写CRUD类API

1. 想清楚api的构造：输入输出数据流、逻辑，命名

2. 校验：输入参数合法校验、输入参数存在校验、JSON格式符合、解析JSON、xxid对应字段细节

3. 开启事务交互数据库

#### 一、遵循RESTful API 规范

> 参考阮一峰的[RESTful API 设计指南](https://www.ruanyifeng.com/blog/2014/05/restful_api.html)
> 
> 

资源名复数、小写、使用 `-` 分隔

设置后端专属URL和版本 `/api/v1` 作为后端接口



**标准操作** 

- `GET /resourses?name=张三&age=25`（查询条件放在url中而不是Request Body，可以被浏览器、代理服务器和 CDN 缓存）

- `/projects/{projectId}/tasks` Id可以直接写，后面接名词表示某个项目下的任务

    

**非标准操作** 



**不符合规范**

- POST /resourses/query 

#### 二、设计参数与校验

- 命名规范：前后端使用驼峰、数据库可以使用下划线不使用（数据库对大小写不敏感）

- 参数是否必须、变量数据格式
- 参数校验取值范围，给出友好错误提示
- HTTP头的规范：



#### 三、注意错误

- IO

- 幂等性：异步导致重复消费

- 事务的原子性：错误

- 返回的具体结果：要注意

- 考虑业务类型：多读少写、纯写、又读又写

    

#### 四、实际书写

有日志logger记录

#### 类型



- 单点登陆注册

    - JWT + Redis缓存Token

- 签到限制多次访问

- 某张表的增删改查

- 业务

    

#### 测试优化



测试接口的QPS、

### 连接配置

- 注意配置写的对不对


### 代码Review

用AI，尽管用，但是你得看懂它写的，你PR的代码还是你要own的。他给我来个几千行的PR我会让AI 看他的diff 然后列出所有可能造成的影响，是否符合convention，是否符合best practice，等。然后丢几十个要改的东西回去给他。一两次以后就乖了，之后的PR都干净和清晰了很多。

### 画图

> 推荐draw.io
> 
> 

#### 用例图 Use Case

用于理清“多种角色（Actor）”和“复杂的业务功能点”之间的关系

#### 数据流图 Data Flow Diagram

#### 时序图 Sequence Diagram

用户、系统间在时间线上的**数据流向和交互顺序**

#### 状态图 State Diagram



#### 流程图

基本图形：椭圆、矩形、菱形、圆柱体

箭头：文字注释“是否”、操作“调用”

颜色：字体黑丝；方块低饱和度的黄、灰、湖蓝、粉红、绿

### AI 画图

```XML
我想直播做计算机软件项目，因为此我需要一个封面，我想使用日本小人（irasutoya）风格的，中文配文：Agent项目检修中...
```

### 写文档

#### AI 写文档

```Plain Text
你是一名资深开发工程师，擅长写出流畅、富有深度的技术文档。
我希望你能仔细设计并扩充一下下面这段文字，要求：
- 重视叙述方式，分段要按照技术的实际情况分类，不要进行简略的举例，这样会让内容空洞，按照严谨的技术博客方向书写，但要避免官方文档那样事无巨细与晦涩省略相关知识。
- 不要介绍技术背后的公司、人物、年份等，可以介绍技术引入的原因、背景，注重实践实用性
- 以markdown格式输出
例子：
user_question:"
你能仔细设计并扩充一下这段文字吗，按照你的角色扮演，严谨博客：
##### 运行Java的过程

源码文件`.java`被编译为字节码文件`.class`，按照相对路径和resources里的文件一起放在target的classed下

`Class` 包含类的方法属性注解修饰符以及每行代码对应的字节码指令

原本JVM加载字节码文件，并创建Class实例，通过反射调用方法
"
ai_response:
"""

### 泛型

> 在复杂的企业级应用开发中，类型安全与代码复用是架构设计的核心诉求。泛型（Generics）的引入正是为了解决这一痛点，它允许开发者在定义类、接口或方法时，将类型本身作为一种参数进行传递。这种机制不仅消除了大量强制类型转换的冗余代码，更重要的是将类型检查从运行时提前到了编译期，从而在代码执行前就能拦截潜在的类型安全隐患。

#### 泛型定义

泛型的核心思想是“类型参数化”，它本质上是一个编译期的类型模板。在声明泛型类或方法时，我们使用占位符（如 T、K、V）来代表未知的数据类型。当存在多个类型参数时，可以通过 <K, V> 或 <K, V, T> 的形式进行声明，以支持更复杂的数据结构映射。

在实际工程实践中，泛型的使用场景需要严格区分：如果一个类中存在泛型字段，那么该类必须被声明为泛型类，因为只有类级别的泛型声明才能让字段共享该类型参数；反之，如果仅仅是某个方法内部需要处理动态类型，且该类型不依赖于类的实例状态，则完全可以直接定义泛型方法，而无需将整个类泛型化。这种细粒度的控制是保持API简洁性的关键。

泛型类：

```java
public class Student<T, K, V, E> {
    private T node;
    private Map<K, V>;
    private List<E> config;

    public Student(K id, V name) {
        super();
        this.id = id;
        this.name = name;
    }

    public static void main(String[] args) {
        Student<Integer, String> student = new Student<Integer, String>(1001, "tom");
        System.out.println(student.id);
        System.out.println(student.name);
        Student<String, String> student2 = new Student<String, String>("s1001", "tom");
        System.out.println(student2.id);
        System.out.println(student2.name);
    }
\`\`\`

泛型接口：

1. 定义泛型接口

```java
import java.util.List;

public interface IBaseDao<K, T> {

    public List<T> getAll();

    public T queryById(K k);

    public int add(T t);

    public int update(T t);

    public int delete(K k);
}
\`\`\`

2. 定义具体接口

```java
public interface EmployeeDao extends IBaseDao<Integer,Employee> {

}

public interface DeptDao extends IBaseDao<Integer, Dept> {
    long getCount() throws SQLException;
}
\`\`\`

3. 定义实现类
\`\`\`java
public class EmployDaoImpl implements EmployeeDao{

    @Override
    public List<Employee> getAll() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Employee queryById(Integer k) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int add(Employee t) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int update(Employee t) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int delete(Integer k) {
        // TODO Auto-generated method stub
        return 0;
    }

}
\`\`\`
#### 泛型原理

Java语言泛型的实现是通过“类型擦除（Type Erasure）”机制在编译期实现的。当我们在代码中定义 `class ClassName<T> { ... }` 时，`<T>` 仅仅是一个类型占位符。在 javac 编译阶段，编译器会进行严格的类型检查，随后将泛型模板中的 `T` 统一擦除并替换为其边界类型（若无边界则默认为 `Object`）。因此，在 JVM 运行时，所有的泛型实例本质上都是原始类型（Raw Type）。

这种擦除机制带来了一个直接的工程限制：泛型参数绝对不能是基本数据类型（如 `int`、`double`），因为 `Object` 无法指向基本类型，必须使用对应的包装类。同时，由于泛型信息在运行时已被抹去，开发者无法通过 `getClass()` 获取带有泛型信息的 `Class` 对象。无论 `T` 的实际类型是什么，`getClass()` 返回的永远是唯一的 `className.class`。

此外，类型擦除导致在泛型类内部无法直接通过 new T() 来实例化类型参数，因为编译器会将其擦除为 `new Object()`。若需在泛型内部进行实例化，必须通过传入 `Class<T> clazz` 参数，借助反射机制来完成对象的创建。

#### 泛型继承与静态上下文的边界

在泛型继承场景中，子类在继承泛型父类时，必须明确指定父类的泛型类型，或者子类自身也声明为泛型类并将类型参数向上传递，以保证父类中依赖泛型类型的字段和方法在子类中依然具备明确的类型契约。
对于静态方法而言，它不属于类的任何实例，因此无法访问类上声明的泛型参数。如果静态方法需要处理泛型逻辑，必须在方法签名上独立声明泛型方法，例如 `public static <K> K getProxy(Class<K> serviceClass)`。这种写法将泛型的生命周期限定在了方法调用期间，返回值类型由传入的 Class 对象动态决定，从而完美绕开了静态上下文的限制。

#### 泛型多态与通配符的读写安全

在普通的面向对象多态中，我们可以将子类对象向上转型为父类引用。但在泛型中，`List<Integer>` 并不是 `List<Number>` 的子类，泛型默认是不支持协变的。如果允许这种转换，向 `List<Number>` 中写入 `Float` 对象后，再从 `List<Integer>` 中读取，就会引发严重的 `ClassCastException`。为了在保持类型安全的前提下实现泛型的灵活性，Java 引入了通配符机制，其核心遵循 PECS（Producer Extends, Consumer Super）原则。

只读与上界通配符 （`<? extends T>`）：当我们需要从一个集合中读取数据，且只关心它是某个基类的子类时，使用上界通配符。例如 `Pair<? extends Number>` 表示该容器可以持有 `Number` 或其任意子类。由于编译器无法确定具体的子类类型，因此禁止向其中写入任何非 null 值，从而保证了读取时的绝对安全。

只写与下界通配符（`<? super T>`）：当我们需要向集合中写入数据，且只关心它能容纳某个基类及其祖先时，使用下界通配符。例如 `Pair<? super Integer>` 表示该容器可以持有 `Integer`、`Number` 或 `Object`。此时可以安全地写入 `Integer` 及其子类对象，但由于读取时只能将其视为 Object，因此通常仅用于消费数据的场景。

无界通配符（`<?>`）：当方法仅需要操作与具体类型无关的逻辑（如获取集合大小、清空容器）时，可以使用无界通配符。它等价于 `<? extends Object>`，既不能安全地写入，也不能以特定类型读取，仅作为最宽泛的类型占位符存在。
"""
改写内容：
```

给出具体例子
```Plain Text
给出实际例子
```
