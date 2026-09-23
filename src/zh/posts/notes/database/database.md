---
lang: zh-CH
title: 数据库学习笔记
description: 数据库概论、MySQL、数据库开发
date: 2024-03-20
category:
  - 后端开发
tag:
  - 数据库
---
## 数据库概论


### 一、绪论

#### 1\.1数据库系统概论

##### 文件系统与数据库系统

文件系统数据面向某一应用，文件的共享性差、冗余度大、独立性差；数据库系统中的数据共享性高、冗余度小、具有高度的物理独立性和一定的逻辑独立性，由数据库管理系统提供数据安全性、完整性、并发控制和恢复能力。

数据库系统=数据库 \+ 数据库管理系统DBMS \+ DBA

数据库系统核心：DBMS


数据库系统特点：数据结构化、共享性高、冗余度低、数据独立性高

#### 1\.2数据模型

**数据模型**：两类，概念模型，逻辑模型和物理模型

组成结构：数据结构、数据操作和完整性约束


**概念模型**——用于信息世界的建模

实体、属性

码： 唯一标识实体的属性集，主码\-（学号\+课程号）联合属性

实体型、实体集、联系


**逻辑模型**

- 格式化模型 
  - 层次模型（网状的特例）
  - 网状模型
- 关系模型
- 其他 
  - 面向对象数据模型、对象关系数据模型、半结构化数据模型（XML）


**物理模型**


对数据最底层的抽象



**关系模型**——最重要的一种数据模型



术语：



关系（表）、元组（行）、属性（列明）、码（唯一确定元组的属性组）、域（属性的取值范围）、分量、关系模式



数据操纵：

增（插入）删改（更新）查



优缺点：

1. 建立在严格数学概念的基础上
2. 概念单一，实体和实体之间的联系用关系表示、对数据的检索和更新结果也是关系
3. 存取路径对用户透明
 

#### 1\.3数据库系统的结构

模式/概念模式/逻辑模式：数据库中全体数据的逻辑结构和特征的描述

模式是相对稳定的，而实例是相对变动的

将数据库模式分为三种：

**三级模式结构**



外模式/子模式/用户模式，：多个，模式的子集，数据库用户的数据视图



模式/概念模式/逻辑模式：1个，数据库数据在逻辑级上的视图，



内模式/存储模式/物理模式，：1个，记录、索引按照什么方式存储、组织



优点：实现数据的独立性、增强数据的\*安全性\*和提高数据管理的灵活性。







**二级映像功能**——保证逻辑和物理独立性



外模式/模式映像：



外模式可根据模式改变选择变或不变，应用程序根据外模式来，保证数据程序逻辑独立



模式/内模式映像：



保证数据与程序的物理独立







#### 1\.4数据库系统的组成



DBA职责：维护、监督服务器，不开发设计需求程序







### 二、关系数据库



#### 2\.1关系数据结构和形式化定义



2\.1\.1关系



域（相同数据类型值的集合）、笛卡尔积（元组、基数）、关系



关系模式（关系的描述）



2\.1\.3关系模式



#### 2\.2关系操作

查询、插入、删除、修改

查询：【选择、投影、并、差、笛卡尔积】、连接、除、交



#### 2\.3关系完整性

- 实体完整规则：主属性不取空值

R的外码F：不是R的码，但是是被参照关系（可以是自己这个关系）的主码

- 参照完整规则：外码取空或者等于S某个元组主码

- 用户自定义完整性



#### 2\.4关系代数



##### 传统的集合运算：



关系R和S具有相同的属性A、B、C



交、并、差



笛卡尔积：关系目数\(m\+n\) 元组数量k1\*k2【同时从行和列进行运算】



##### 专门的关系运算：



属性分量t\[Ai\]、属性列/属性组A、元组的连接\(n\+m\)、象集



某个属性值x在关系R\(X,Z\)中的象集： $Z_x=\{Z_1,Z_2\}$  剩余属性组的对应属性



**选择**（行角度）



选择满足条件元组【从行进行运算】



**投影**（列角度）



挑出特定属性列【从列进行运算】



**连接**（行角度）



从两个关系笛卡尔积上挑元组



等值连接：R\.B=S\.B



自然连接（行\+列角度）：特殊的等值连接，会去除相同属性组【同时从行和列进行运算】



外连接：保留悬浮元组（不等值的元组）

左外连接（只保留R）和右外连接







**除**（行加列角度）



R中去除与S相同域集的属性组



R中剔除S的属性组B、C，保留R中和S相同B、C的t\[A\]



多张保险 对应 保单 对应 1个/多个联系人 联系具有属性







### 三、关系数据库标准语言——结构化查询语言SQL



#### 3\.1非过程化SQL



SQL特点：集数据定义、查询、控制、操纵



#### 3\.3数据定义



3\.3\.1模式定义



3\.3\.2基本表定义、删改



3\.3\.3索引



3\.3\.4数据字典



```SQL
CREATE SCHEMA test1 AUTHORIZATION
DROP SCHEMA

CREATE TABLE
DROP TABLE


INSERT INTO TABLE_NAME


//建立索引
create unique index part_name
On part(p_name)

create unique index part_mfgr_brand
On part(p_mfgr, p_brand) 

create index part_mfgr on part(p_mfgr);
CLUSTER part using part_mfgr; 

alter index part_name rename to pname
```



#### 3\.4数据查询



3\.4\.1单表查询



3\.4\.2连接查询



自身连接（查询先修课的先修课）



3\.4\.3嵌套查询

```SQL
//选择某几列
SELECT * FROM TABLE_NAME WHERE NAME='%XIAO%'

SELECT DISTINCT

SELECT * FROM TABLE_NAME WHERE country='USA'
ORDER BY alexa DESC


SELECT CNO, AVG(GRADE) 
FROM SC
GROUP BY CNO HAVING AVG(GRADE)>80


//自然连接
SELECT sno,cno,... 
FROM Student,SC
WHERE Student.sno=SC.sno

//
SELECT sno,sname,grade,cname
FROM Student,SC
WHERE cname='数据库' AND Student.sno=SC.sno
```



子查询

```SQL
-- 查询非计算机科学系中比计算机科学系所有学生年龄都小的学生姓名及年龄
SELECT Sname,Sage
FROM Student
WHERE Sage<ANY (SELECT Sage FROM Student WHERE Sdept='CS')
AND Sdept<>'CS'; 

--查询与"刘晨”在同一个系学习的学生。
--1 先分步来完成此查询，然后再构造嵌套查询。
 SELECT Sno,Sname,Sdept 
FROM Student
 WHERE Sdept IN
 (SELECT Sdept
 FROM Student
 WHERE Sname='刘晨');

--2 自身连接
SELECT Sl.Sno,Sl.Sname,Sl.Sdept 
FROM Student S1,Student S2
 WHERE Sl.Sdept=S2.Sdept AND S2.Sname='刘晨');

--3 子查询
SELECT Sno,Sname,Sdept 
FROM Student
 WHERE Sdept =
 (SELECT Sdept
 FROM Student
 WHERE Sname='刘晨');

--相关子查询
--找出每个学生超过他自己选修课程平均成绩的课程号
SELECT Sno,Cno
 FROM SC x
 WHERE Grade ＞=(SELECT AVG(Grade) 
 FROM SC y
 WHERE y.Sno=x.Sno);

--查询选修了课程名为"信息系统”的学生学号和姓名。
--有些嵌套不能被连接替代，能够用连接运算表达的查询尽可能采用连接运算。
SELECT Student.Sno,Sname
 FROM Student,SC,Course
 WHERE Student,Sno=SC.Sno AND
 SC.Cno=Couιse.Cno AND
 Course.Cname='信息系统';

--EXISTS 子查询可能不能被等价替换，但IN、比较运算符、ANY/ALL都能被替代
--一般和外查询distinct结合
--查询至少选修了学生201215122选修的全部课程的学生号码。


--查询所在州没有出版社的那些作者及其所在州名。 
--注意这里是相关子查询
SELECT au_lname, au_fname, authors.state
from authors
where NOT EXISTS (
  SELECT *
  FROM publishers
  where publishers.state=authors.state
  );

--列出所有作者为Oakland城市的图书；
--根据数据比较复杂的分析出：一本书可能有多个作者、有的书没有作者



-
```

3\.4\.4集合查询

3\.4\.5基于派生表（From子查询）

3\.4\.6Select一般格式



#### 3\.5 数据更新



3\.5\.1插入数据

3\.5\.2修改数据

```SQL
SELECT <列名>
INTO <表名>
FROM <表名>

INSERT INTO <表名> VALUES()
INSERT INTO <表名> (cid, 选课人数, 平均成绩)
SELECT cid, count(cid), avg(score)
from <表名>

UPDATE <表名>
SET <列名>=<表达式>
WHERE condition

DELETE
FROM <表名>
WHERE condition
```



#### 3\.7视图



视图是从一个或几个基本表导出的表，是一个虚表

3\.7\.1\-3 定义、查询、更新视图

行列子集视图（可查询转换、可更新）、分组视图

视图消解

```SQL
CREATE VIEW IS_Student
AS
SELECT Sno,Sname,Sage
FROM Student
WHERE Sdept='IS'
WITH CHECK OPTION; 


DROP VIEW __ CASACADE;


CREATE VIEW S_G(Sno,Gavg)
AS
SELECT Sno,AVG(Grade)
FROM SC
GROUP BY Sno; 

//查询涉及视图消解，非行列
```



3\.7\.4视图的作用

- 简化用户的操作

- 使用户能以多种角度看待同一数据

- 对重构数据库提供了一定程度的逻辑独立性

    （重构，一般是将基本表垂直划分，用户应用程序不受影响）

- 够对机密数据提供安全保护

    对不同用户定义不同视图

- 适当利用视图可以更清晰地表达查询

    多建表，简化查询

    

### 四、数据库安全性



#### 4\.1概述



安全标准：



TCSEC



C1级：自主存取控制DAC



B1级：实施强制存取控制MAC以及审计等安全机制，被认为是真正意义上的安全产品



CC



#### 4\.2数据库安全性控制



4\.2\.1用户身份鉴别



4\.2\.2存取控制



存取控制机制包括 定义用户权限 和 合法权限检查， 一起组成数据库管理系统的存取控制子系统。



C2级DBMS支持自主存取控制DAC



B1级DBMS支持强制存取控制MAC







4\.2\.3\-4 自主存取控制方法，授权



在关系数据库，控制对象包括数据和数据库模式（数据库、基本表、视图、索引创建）



```SQL
//授权
GRANT SELECT() 
ON TABLE Student
TO U1;

GRANT select insert update(Sno) 
ON TABLE S, SC
TO U2, U3;

GRANT all privileges //insert属性要有主码权利
ON table Student
TO U1,U2,PUBLIC
WITH GRANT OPTION;//允许循环授权

REVOKE insert 
ON TABLE SC
FROM U5 CASCADE

//只有DBA才能创建
//三种权限，CONNECT、RESOURCE（创建基本表和视图）、DBA
CREATE USER
```



4\.2\.5 数据库角色



角色是权限的集合



```SQL
CREATE role R1

GRANT select, update insert
on table student
to r1;

grant r1
to u1,u2;

revoke r1
from u1;

grant delete
on table student
to r1

revoke select
on table student
from r1
```



4\.2\.6 强充值存取控制方法



主体：包括用户、用户各进程



客体：敏感度标记：主题\-\-许可证级别 客体\-\-密级



主体许可证级别大于等于客体密级



主体许可证级别大于等于客体密级



#### 4\.3视图机制



为不同用户定义不同视图



#### 4\.4审计



把用户对数据库的所有操作自动记录放入审计日志



### 五、数据库完整性



即数据的正确性和相容性



#### 5\.1实体完整性



主键取值非空且唯一



不满足则DBMS拒绝插入或更新



`PRIMARY KEY()`



#### 5\.2参照完整性



关系R的外码要么取空值要么取某个关系S的主码



参照完整性联系两个表的相应元组，增删改破坏参照完整性时的处理：



参照表插、改：拒绝



被参照表删、改：拒绝/级联/空值



#### 5\.3用户定义的完整性



属性值限定：`NOT NULL`、`UNIQUE`、`CHECK`



#### 计算机系统三类安全性



数据



#### 5\.4约束语句



＜完整性约束条件＞包括 NOT NULL、UNIQUE PRIMARY KEY、FOREIGN KEY、

CHECK短语等



```SQL
CONSTRAINT Cl CHECK (Sal + Deduct >= 3000)

ALTER TABLE Student
DROP CONSTRAINT C4;
```



#### 5\.6断言



```SQL

```



#### 5\.7触发器



```Plain Text
trigger
```



### 六、关系数据理论



关系数据库设计理论包括数据依赖、范式、模式设计方法



数据完整性约束：静态和动态



#### 6\.1关系数据理论的问题（逻辑设计）



数据依赖是关系内部属性与属性之间的一种约束关系



关系模式存在的问题：



数据冗余、更新异常、插入异常、删除异常



#### 6\.2规范化



6\.2\.1函数依赖



属性A 函数依赖于 属性B == 两元组的A相等则B也相等



非平凡： Y不属于X                                                                平凡函数依赖一定成立



完全函数依赖F：X的任何一个真子集 X‘ 不函数确定Y



部分函数依赖P：（注意：X是一般视作码有多个属性而不是单个属性）







6\.2\.2码



码/全码：整个属性组



超码：可以唯一标识一个元组的属性组合，可能包含冗余



（X：属性A、B、C）部分函数依赖 （属性集U也函数依赖于属性A、B）



候选码：不含有多余属性的超码，不唯一



主码：选择一候选码作为唯一标识







6\.2\.3范式



规范化：低一级范式的关系模式通过模式分解转换为高一级关系模式的集合



1NF：每一个分量必须是不可分的数据项【码单独属性组成、不相交】



2NF：1NF，且每一个非主属性完全函数依赖任何一个候选码【非主属性部份依赖】



不属于2NF：插入异常、删除异常、修改复杂



3NF：1NF，且每一个非主属性既不传递依赖于码也不部份依赖于码【不存在xx和xx】



BCNF（修正3NF）：1NF，且每一个决定因素都包含码【没有决定因素/主属性对码依赖】



4NF：关系模式的属性之间不允许有非平凡且非函数依赖的多值依赖







#### 6\.3数据依赖的公理系统



Armstrong



自反律、增广率、传递率



求属性集X关于函数依赖集F的闭包



求最小依赖级（不唯一）：将F进行缩小到最小







#### 6\.4模式的分解



无损连接性



保持函数依赖性







模式分解算法



3NF\+函数依赖



BCNF\+无损连接性







### 七、数据库设计概论



结构（数据）设计和行为（处理）设计



#### 7\.2需求分析



用户要求：



1. 信息要求

    

2. 处理要求

    

3. 安全性与完整性要求

    

数据字典：数据项、数据结构、数据流、数据存储、处理过程







#### 7\.3概念结构设计



E\-R模型 两个实体型之间的联系：一对一、一对多、多对多







#### 7\.4逻辑结构设计



ER图向关系模型转换



数据模型的优化



设计用户子模式







#### 7\.5物理结构设计



数据库的物理结构：在物理设备上的存储结构与存取方法



两步：1\.确定数据库的物理结构；2\.对物理结构做评价







### 八、数据库编程



#### 8\.1嵌入式



游标：说明、打开、推进、关闭



```SQL
//定义，不执行
EXEC SQL DECLARE <游标名>CURSOR FOR <SELECT>;
//打开，实际是执行select，查询结果放缓冲，游标指向查询第一条记录
EXEC SQL OPEN <>;
//游标向前推进一条记录，同时将缓冲区当前记录送主变量供主语言处理，和for循环结合
EXEC SQL FETCH <>
    INTO <主变量><指示变量>
```



例子



```SQL
EXEC SQL BEGIN DECLARE SECTION
    char deptname[20];
    char hsno[9];
    char hsname[20];
    char hssex[2];
    int HSage;
    int NEWSAGE;
EXEC SQL END DECLARE SECTION
long SQLCODE;
EXEC SQL INCLUDE SQLCODE
int main(void)
{
    int count = 0;
    char yn;
    printf("Please choose");
    scanf("%s",&deptname);
    // <dbname>@<hostname>:<port>
    EXEC SQL CONNECT TO TEST@localhost:54321 USER "SYSTEM"/"MANAGER"
    EXEC SQL DECLARE SX CURSOR FOR
        SELECT Sno, Sname, Ssex, Sage
        FROM Student
        WHERE SDept=:deptname;
    EXEC SQL OPEN SX
    for(;;) {
        EXEC SQL FETCH SX INTO :HSno, :HSname, :HSsex; :HSage
    }
}
```



#### 过程化SQL



定义部分



变量、常量、游标



```SQL
变量名 数据类型 [NOT NULL] := 初值表达式
常量名 数据类型 CONSTANT := 常量表达式
DECLARE
```



执行部分



```SQL
BEGIN
    EXCEPTION
    IF CONDITION THEN
    ELSE
    END IF;

    LOOP
        ;
    END LOOP;

    WHILE condition LOOP
        ;
    END LOOP;

    FOR count IN [REVERSE] 下界 上界 LOOP
        ;
    END LOOP;
END
```



#### 存储过程



```SQL
CREATE OR REPLACE PROCEDURE 过程名(a INT, b INT, c FLOAT)
AS DECLARE//定义过程快
    x Float;
    y INT;
BEGIN
    Select ;
    if x is null then
        rollback;
        return;
    end if;
    update ;
END


CALL/PERFORM PROCEDURE 过程名

ALTER PROCEDURE p1 RENAME TO p2;

DROP PROCEDURE p1();
```



##### 函数







### 九、关系查询处理和查询优化



#### 9\.1查询处理



查询分析、检查、优化、执行



实现查询操作的算法：



选择操作：全表扫描、索引扫描



连接操作：嵌套循环、排序合并（检查直到不同停止）、索引连接、哈希连接



#### 9\.234查询优化 代数、物理优化



总代价=I/O代价 \+ CPU代价 \+ 内存代价 \+ 通信代价（分布式系统）







查询优化一般准则：



1. 选择运算应尽可能先做

    

2. 投影运算和选择运算同时进行

    

3. 把投影同其前或其后的双目运算结合起来执行

    

4. 把某些选择同在他前面要执行的笛卡尔积结合起来成为一个连接运算

    

5. 找出公共子表达式

    

6. 选取合适的连接算法

    

    

    

查询优化一般步骤：



1. 把查询转换成某种内部表示，通常用的内部表示是语法树

    

2. 用优化算法把语法树转换成标准形式

    

3. 选择低层的存取路径

    

4. 生成查询计划

    

    

    

### 十、事务



事务：数据库操作序列，可以是一条/一组SQL、整个程序



事务是并发控制的基本单位



程序包含多个事务



```SQL
BEGIN TRANSACTION;
COMMIT; 提交、提交事务的所有操作
ROLLBACK; 对所有已完成的的操作全部撤销，回滚到开始
```



4个ACID特性：



- 原子性

    

- 一致性：操作要么全做要么不做

    

- 隔离性：并发执行事务不受干扰

    

- 持续性/永久性：一旦提交接下来操作和故障不受影响

    

#### 10\.1并发控制



并发带来不一致性：



- 丢失修改

    

- 不可重复读

    

- 读“脏”数据

    

    

    

#### 10\.2故障种类



事务内部的故障



系统故障



介质故障







#### 10\.3故障的种类



事务内部的故障



没有达到预期的终点（COMMIT或ROLLBACK），需要强行回滚（撤销UNDO）







系统故障（软故障）



系统重启时让所有非正常终止的事务回滚，强行撤销所有未完成的事务，还需要重做（REDO）所有已提交的事务







介质故障（硬故障）



可能性小、破坏性大







计算机病毒











#### 10\.4恢复的实现技术



如何建立冗余数据、利用冗余数据实施数据库恢复



技术：



**数据转储**：静态（无运行事务时）动态，海量和增量



**登记日志文件**



- 事务标识

    

- 操作类型

    

- 操作对象

    

- 更新前数据旧值/更新后新值

    

    

    

#### 10\.5恢复策略



事务故障



反向扫描日志、逆操作直到开始







系统故障



正向扫描找出已提交事务入重做队列（重新执行日志登记）



未完成事务入撤销队列（反向扫描日志对每个撤销事务更新操作执行逆操作）







介质故障



重装数据库，重做



### 十一、并发控制



#### 11\.2封锁



排他锁：读写锁    X锁



与任意锁不相容



共享锁：读锁    S锁



与S锁相容



#### 11\.3封锁协议



一级：修改数据前必须加X锁    解决丢失修改



二级：读取事务必须加S锁，读完释放        解决读“脏”数据



三级：必须加S锁，事务结束释放        不可重复读



#### 11\.4活锁死锁



避免活锁：先来先服务



**死锁**



预防：



- 一次封锁法

    

- 顺序封锁法

    

解除：



- 超时法

    

- 等待图法

    

    

    

#### 11\.5并发调度的可串行性



多个事务并发执行是正确的 充分必要条件是 其结果与某一次序串行执行这些事务的结果相同



并发事务正确调度 == 调度可串行化



该调度策略：**可串行化调度**



**可串行性**是并发事务正确调度的准则







判断是否可串行化调度



冲突操作：不同事务对同一个数据的读写和写写







#### 11\.6两段锁协议



保证并发调度正确性、保证调度可串行化，仍可能发生死锁！！！



协议：



扩展阶段——读写前要申请并获得对数据的封锁



收缩阶段——释放一个封锁后事务不再申请获得其他封锁







遵守2PL是可串行化调度的**充分条件**



一次封锁法遵循2PL







#### 11\.7封锁对象的大小——封锁的粒度



封锁粒度越大，并发度越小，系统开销越小



IS锁：之后要对后裔节点加S锁



IX锁：之后要对后裔节点加X锁



如先对元组所在关系和数据库加锁



SIX锁：先加S，再加IX







意向锁



提高效率







### 课程设计



---



车辆管理系统



校园网管理系统



需求分析：



事务性需求（OLTP联机事务处理）



考核每秒实行的SQL数量，以电商、银行业务数据库为主，瓶颈在CPU和磁盘子系统上，使用cache和B\+tree



分析性需求（OLAP联机分析处理）



考核磁盘子系统的吞吐量（带宽），常使用分区技术、并行技术



高QPS查询



正反KV查询



模糊查询



优势/挑战/难题：



高可用：容灾



高并发



低延迟



使用灵活



低成本：压缩比



多表join、场景下的优化



#### AI 答题应用



###### 应用需求



这是一个xxx的项目。



从学校心理测试、职业分析题、到现代非常受欢迎的人格测试MBTI答题、包括一些大厂比如四大面试题，我们见过或做过很多这样的测试题，那么可能会有人想也去做一个这样的答题测试，比如朋友圈里可能见到过的测一测是不是真心朋友，校园游戏想做一个，企业想做一个面试答题



我们就考虑了做这样一个平台，满足用户或者组织希望自定义答题测试的需求，用户可以基于 AI 快速制作并发布多种答题应用，支持检索和分享应用、在线答题并基于评分算法或 AI 得到回答总结；管理员可以审核应用、集中管理整站内容，并进行统计分析。



数据库系统的需求分析:



- 用户模块

    

- 应用模块

    

- 题目模块

    

- 评分模块

    

结构化分析SA



###### 业务流程



用户注册登录==管理员



###### 设计模式



策略模式



### 关于不同数据库学习方向思考



###### 关系型数据库



**MySQL**简单



**PostgreSQL**使用结构化PL/pgSQL语言的开源关系型DBMS，高可扩展性



### 面试题



**Part I** 工厂在定义一个新产品的流程如下：



1. 确定产品信息如名字，代号等；  

2. 设计部门设计出产品的结构；  

3. 在确定结构后就可以得出每个产品所需要的基本零件及其所需的数据。进而可以进行相关财务处理与采购处理。  

    

    其相关逻辑如下： 

    

    \.  对于每一种基本零件都有其相关的型号等资料设定； 

    

    \.  对于每个供应商也有其相关资料的设定； 

    

    \.  一个基本零件可以由不同的供应商供应，其价格等资料会有些差异； 

    

    \.  一个供应商也可以供应多种不同的基本零件； 

    

    \.  对于一种产品，可以由多个大部件构成，不同的产品有可能由相同的大部件组成；例如，某发动机可以是汽车A的一个大部件，也可以是汽车B的一个大部件。 

    

    \.  在部件结构中，某些部件是由别外一个或多个部件组成的，而所有的部件最终都是由基本零件构成的；   

    

    \.  产品大部件只是存放与产品直接相关的最上层部件。

    

问：



1. 根据理解画出E\-R\(或UML\)联系图；   

2. 写脚本来建立所需要的数据库对象，如表、序列、约束等；    

3. 为上图所示的产品P\_1准备初始化数据（prod\_part\_supp\_detail 除外）；    

4. 编写procedure 或function生成指定产品的产品零件明细清单；  

5. Write a SQL to show the supplier and component detail of product\. For amount field, use below logic :

    

```SQL
if  the “Amount”  <   1000  show “Low”                
    if  “Amount”  >= 1000 < 10000  show “Middle”                
    else  show “High”
```



**Part II**

There are some tables need copy from one oracle user User1  to another user User2\.      



1. The DB structure of source user is compatiable to the target db user \(All field in source db user are exists in target db user, but maybe some fields in target db user not in source db user\); 

    

2. No DB Link or privilege granted between those two users;       

    

3. No primary key or unique key conflict between those two users' data;       

    

4. The records number is not very much \(at most 10000 for one table\)\.        

    

**Part III**

There are some tables need copy from one oracle user User1  to another user User2\.      



5. The DB structure of source user is compatiable to the target db user \(All field in source db user are exists in target db user, but maybe some fields in target db user not in source db user\); 

    

6. Can create DB Link or grant priv between those two users;      

    

7. No primary key or unique key conflict between those two users' data;      

    

8. The records number is not very much \(at most 10000 for one table\)\.

    

    

    

Q：2000万的数据导入到excel并返回给用户怎么做？

A：excel一个文件最多只有100w行的数据，所以2000w数据要分成20个excel数据，最后再做压缩

## MySQL

### 术语解释与关键字

DDL 数据库操作 DML 数据操作语言 DQL 数据查询语言 DCL 数据控制语言



注意：

- 字符串用单引号表示

- 插入使用DEFAULT表示默认值



### DDL操作

> **\(Data Definition Language\)：** **数据定义语言** 
> 
> 

#### 创建数据库

```Bash
create database db_01;
```

#### 创建表



```SQL
#-- 字符集utf8mb4 / utf8mb3
CREATE TABLE tbl_xx (
        字段名 数据类型 为null/主键 自增,
) engine=innodb tablespace xxx;
```



##### 变量类型



选择字符串



- char 如果存储的内容小于n个字符，将会使用空格进行填充，查询时自动截断尾部空格。（最大255）

    

- varchar 最大存储65535字节，允许null需加多1B记录，变长长度用2B存储长度，n表示字符（字符集utf\-8==3B，utf\-16==2B）

    

- TEXT 

    

选择日期——DATETIME可读性好、可用时间长，是最优选。



- int

    

- timestamp 存储 `1970-01-01 00:00:00` 到现在的毫秒数，占用4字节，只能到2038年，若支持毫秒时要7字节。

    - 6字节下的时间：`2018-09-14 18:28:33.898593` 

    - 优点在于可记录时区：`SET time_zone = 'America/Los_Angeles‘ / '-08:00';`

    - 海量并发下的性能抖动：https://www\.cnblogs\.com/wk\-missQ1/p/17235605\.html

        

- Datetime\(N\) `YYYY-MM-DD HH：MM：SS` 固定占用8字节，N表示毫秒的精度

    

```Plain Text
register_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
last_modify_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
```



##### 建表规范



参照阿里巴巴规范。https://xiaoxue\-images\.oss\-cn\-shenzhen\.aliyuncs\.com/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83%EF%BC%88%E5%B5%A9%E5%B1%B1%E7%89%88%EF%BC%89\.pdf



多对多关系需要关系表、一张表不一定对应一个实体



###### 比较主键自增id、uuid和雪花算法3种思路。



|特性 / 方案|**自增 ID**|**UUID（通用唯一标识符）**|**雪花算法 ID**|
|---|---|---|---|
|**唯一性**|单机唯一|全球唯一|分布式唯一|
|**分布式支持**|差 \(需中心化\)|**优 \(去中心化\)**|**优 \(去中心化，需配置\)**|
|**可预测性**|强 \(连续\)|**弱 \(随机\-\-\>可改为趋势递增\)**|**弱 \(趋势递增\)**|
|**存储空间**|**小 \(8 字节 **`BIGINT`**\)**|大 \(16 字节 `BINARY` / 36 字节 `CHAR`\)|**小 \(8 字节 **`BIGINT`**\)**|
|**插入性能**|**极优 \(顺序插入\)**|差 \(随机插入，页分裂\)|优 \(趋势插入\)|
|**查询性能**|优 \(高缓存命中率\)|差 \(低缓存命中率\)|**优 \(高缓存命中率\)**|
|**可读性**|优|差|一般 \(长数字\)|
|**额外依赖**|无|无|**依赖时钟和机器ID分配**|



对于单机to B可以用自增主键



对于中等规模分布式可以使用自增主键\+步长



UUID格式写成32个16进制，写成5段，表现为8x\-4x\-Mxxx\-Nxxx\-12x（M表示7个版本、N表示变体），具体来说有以下几种版本：

- v1：时间戳低位到高位60位\+MAC地址，MAC地址可以用软件修改，所以可能有重复和安全问题，MySQL默认

- v3：基于名称的MD5，命名空间标识应用环境、名称标识用户账号、用户名

- v4：纯随机，最常用、最简单、无任何可预测信息

- v6：\[时间戳高位\]\-\[时间戳中位\]－6\[时间戳低位\]－\[变体\+时钟序列\]\-\[节点MAC地址\] v1的调整

- v7：\[Unix毫秒时间戳（前48位）\]\-7\[随机数A\]\-\[变体\+随机数B\]\-\[随机数C\] 兼具时间排序性和高并发唯一性，是现代数据库主键的首选

对于大规模分布式场景，使用雪花算法，但要注意分布式机器时钟差异问题和时钟回拨攻击



#### 更改 表 / 索引



```SQL
ALTER TABLE tbl_xx / ALTER INDEX idx_xx
ADD COLUMN | ADD CONSTRAINTS        # 添加列
MODIFY COLUMN column_name new_datatype;                # 修改列的数据类型
MODIFY COLUMN `group_id` BIGINT NULL DEFAULT NULL COMMENT '关联的项目小组ID';
CHANGE COLUMN old_column_name new_column_name VARCHAR(255);                # 修改列名
DROP COLUMN birth_date;                # 删除列
ADD PRIMARY KEY (employee_id);                # 添加主键
RENAME TO staff;        # 修改表名

ALTER INDEX
```



#### 删除表







### DML操作



> **\(Data Manipulation Language\)：** **数据操纵语言**
> 
> 



#### 插入



```SQL
-- 显示省略
INSERT INTO Accounts (AccountId, password, AccountRole)
VALUES (2022102157, '1234', 'admin');
-- 显式指定
INSERT INTO Accounts
VALUES (2022102158, '1234', 'admin', DEFAULT);
```



#### 更新



```Plain Text
UPDATE tbl_xx
SET col1=value1, col2=value2, ...
WHERE ..;
```







#### 查看属性



```SQL
DESC | DESCRIBE tbl_xx;

show create table tbl_xx;

show variables like 'local_infile';
select @@local_infile;
```



### DQL操作（查询）



- `select lock in share mode` 共享锁S

- `select ... for update` 上IX锁

    

#### 多表查询



- 内连接 显式`INNER JOIN TABLE2 ON XX=XX` 隐式`WHERE XX.XX = XX.XX`

- 外连接 用于查询连接条件含 NULL 的情况 

    - 左外连接 `LEFT (OUTER) JOIN` 会包含左表所有数据

        

- 起了别名后不可使用原名

    

#### 排序Order by



默认升序排序，使用asc，desc规定顺序



倒序排要反向扫描索引



```SQL
select name,phone from users order by age;

# 依次按照字段排，先后顺序决定使不使用索引
select name,phone from users order by name desc, phone desc;
```



- 索引排序 order by的字段命中索引顺序一致，直接用索引排好的

- 文件排序

    - 内存排序

        - 单路排序 max\_length\_for\_sort\_data 数据量小于4096在sort buffer即可排序

        - 双路排序

    - 磁盘排序\-归并排序

        

#### 分页LIMIT



`limit a, n` 表示范围，n表示查询数据行数量（a从0开始）



`group by(xx)` 根据xx字段进行分组，此时select后面的非聚合函数字段，必须是group里面的



#### 清除



TRUNCATE TABLE



### 函数



#### 常用



`count(xx)`  n为常数或\*表示所有；n为列名则遍历非null的行数并加一；加Distinct就是唯一且非 NULL 值







#### 字符串



`CONCAT()` 



`LOWER()` `UPPER()` `SUBSTRING(str, start, end)` 



`LENGTH()` 



`TRIM(str)` `REPLACE()` `INSTR()` `REVERSE()` `LPAD(str, n, pad)`



#### 数学



`CEIL()` `FLOOR()` `MOD()` `RAND()` `ROUND()` `TRUNCATE()` `ABS()` `SQRT()` `POW()` `SIGN()`



#### 日期



`CURDATE` `CURTIME` `NOW()` `YEAR(date)` `MONTH(date)` `DAY(date)` `HOUR()` `MINUTE()` `SECOND()` `DATEDIFF(date1, date2)` `DATE_ADD(date, INTERVAL expr UNIT)` `DATE_SUB()`



#### 流程



`IF` `IFNULL` `CASE` 



### 约束



- 非空约束`NOT NULL`

- 唯一约束 `UNIQUE`

- 主键约束 `PRIMARY KEY` （MYSQL的自增AUTO\_INCREMENT）（ORACLE数据库对象sequence实现）

- 外键约束`FOREIGN KEY`

- 检查约束 `CHECK`

- 默认约束`DEFAULT`

    

#### 外键



作用与场景：子表引用父表的某一字段，具有单向性；如果父表没有该字段子表会报错或者设置为null；逻辑需保证在存在性上一致，父表更改子表要保持一致，这就是外键的目的：保证数据的完整性和一致性。



创建方式



```Plain Text
CREATE TABLE XX(
        [CONSTRAINTS] [外键名称] FOREIGN KEY(外键字段名) REFFERENCES 主表(主表列名);
);

ALTER TABLE tbl_XX ADD CONSTRAINTS [外键名称] FOREIGN KEY(外键字段名) REFFERENCES 主表(主表列名);
```



一般来说，外键名称叫fk\\\_本表名\\\_字段名



删除外键



```Plain Text
ALTER TABLE tbl_xx DROP FOREIGN KEY fk_xx;
```



约束形式



删除/更新行为



|行为|说明|
|---|---|
|NO ACTION|当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。|
|RESTRICT|当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。|
|CASCADE|当在父表中册子表中的记录，如果有，则也删除/更新外键在子表中的记录。|
|SET NULL|当在父表中删除对应记录时，首先检查该记录是否有对应外键，如果有则设置子表中该外键值为null（这就要求该外键允许取null）|
|SET DEFAULT|父表有变更时，子表将外键列设置成一个默认的值（lnnodb不支持）|



```SQL
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGNKEY（外键字段）REFERENCES 主表名（主表字段名）ON UPDATE CASCADE ON DELETE CASCADE;
```



- 

    

### 事务

使用 `set @@autocommit = 1` 开启事务，使用 `commit` 提交事务，使用 `rollback` 回滚事务

或者使用 `start transaction` 开启事务，使用 `commit` 提交事务，使用 `rollback` 回滚事务

#### 事务的特性ACID

- 原子性（事务是一组操作的集合，要么全部执行成功、要么全部执行失败）

- 一致性（事务完成时必须使所有数据保持一致状态）

- 隔离性（数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行）

- 持久性（一旦提交、回滚，将持久存储在磁盘）

    

并发事务问题 读脏数据【读到未提交事务的数据】、不可重复读【事务过程中读一致】、幻读【读不到但不可插入】



#### 事务隔离级别/封锁协议

查看 `select @@transaction_isolation` 

设置 `set session transaction isolation level xxx`



脏读（\*\*读取未提交数据\*\*）

不可重复读\*\*（前后多次读取，数据内容不一致）\*\*

幻读\*\*（前后多次读取，数据总量不一致）\*\*主要针对\*\*数据的修改\*\*，而不是**数据的增删**

- read uncommitted 不加任何锁，会脏读、不可重复读、幻读

- read committed 读已提交，读不加锁写加锁，会不可重复读，幻读

- repeatable read 【默认】，读写都加锁，幻读

- serializable 串行化，整个事务都保持锁，强制事务串行执行来避免并发

### 引擎

MYSQL体系结构：连接层、Server服务层、存储引擎层、存储层



组件：客户端连接器（JDBC）、连接池、SQL接口、解析器、查询优化器、缓存、可插拔存储引擎



`show engines` `CREATE TABLE table1()engine=innodbb`



#### 引擎分类与数据结构



包括InnoDB（默认，B\+树）、Memory（内存，hash）、MyISAM（旧版、不支持事务、外键、行锁）



旧的数据结构缺点



- 二叉树：顺序插入时，退化成链表，查询O\(n\)

- n阶B\-树\(多路平衡查找树\)：每个节点最多存储n\-1个数据，n个指针

- 红黑树：一个节点1份数据

    

B\+树索引 只有叶子存储完整数据，其他节点只存Key和指针；



每个节点用一个磁盘块/页存储，一页（16K）可存储更多Key与指针；层级少因此搜索效率稳定，双向链表方便范围搜索



所有数都出现在叶子节点，叶子节点构成链表



### InnoDB存储引擎



三大特性：事务、行级锁、外键



#### 逻辑存储结构



在InnoDB存储引擎中，表数据根据【聚簇索引】顺序组织存放，这种存储方式的表称为索引组织表IOT。



- TableSpace 表空间（使用xxx\.ibd文件存储一张表的信息（可选），包括表结构sdi、数据和索引）

- Segment 段 （数据端、索引段、回滚段）

- Extent 区 1M=64个页

- Page 页 16K （磁盘操作的最小单元，每次申请4\-5个区）

- Row 行（事务id、回滚指针、列存储值）

    

#### 架构



> 分为内存结构和磁盘结构，业务操作缓冲区，数据没有就去加载到缓冲区，缓冲区数据以一定频率通过线程存到磁盘。
> 
> 
> 
> 日志需要回收和释放磁盘空间。
> 
> 



##### 内存结构



在内存部分，分为Buffer Pool、Change Buffer、Log Buffer、Adaptive Hash Index



- 缓冲池：主内存区域，以页为单位，采用链表管理，根据状态，将Page分为三种类型：

    - 空闲页： 缓冲区中尚未被分配或使用的内存空间。

    - 干净页： 缓冲区中的数据页与磁盘上的对应数据页内容完全一致。

    - 脏页： 缓冲区中的数据页已经被修改，但尚未被写回磁盘。

- 更改缓冲区：

    - 针对非唯一二级索引页，执行DML语句时，插入时随机顺序、删除更新时可能影响索引树中不相邻的二级索引页，造成大量I/O。

    - 如果这些数据Page没有在Buffer Pool中，则将数据变更存在更改缓冲区Change Buffer中。

    - 在未来数据被读取时，将数据合并恢复到Buffer Pool中，再将合并后的数据刷新到磁盘中。

- 自适应哈希索引：进一步优化Buffer Pool数据的查询。

    - InnoDB引擎会监控统计对表上各索引页的查询，如果合适（等值查询）就会建立，减少B\+树Search Path代价。

    - 默认开启的，可设置分片数。

- 日志缓冲区：保存要写入磁盘的log日志数据（redo log、undo log），默认大小16MB

    - 日志缓冲区的日志会定期刷新到磁盘中。如果需要更新、插入或删除许多行的事务，增加日志缓冲区的大小可以节省磁盘I/O。

    - 参数：缓冲区大小、日志刷新到磁盘的时间（事务提交时、每秒、事务提交后写入日志\+每秒刷新到磁盘）。

        

##### 磁盘结构



在磁盘区域，分为System、File\-Per\-Table、General、Temporary、Undo五种Tablespaces和Doublewrite Buffer Files与Redo Log。



- 系统表空间：change buffer

    - ibdata1

- 文件单表空间：每张表对应一个表空间文件，参数默认开启。

    - tbl\_xx\.ibd

- 通用表空间：独立创建，创建表时可指定表空间

    - `CREATE TABLESPACE XXX ADD DATAFILE 'file_name' ENGINE = engine_name;`

- 撤销表空间：MYSQL实例在初始化时会自动创建两个默认的undo表空间（初始大小16M），用于存储undolog日志。

    - undo\_001、undo\_002 系统

    - undo\_003\.ibu 用户

- 临时表空间：InnoDB使用会话临时表空间和全局临时表空间。存储用户创建的临时表等数据，

    - xx\.ibt

- 双写缓冲区：innoDB引擎将数据页从BufferPool刷新到磁盘前，先将数据页写入双写缓冲区文件中，便于系统异常时恢复数据。

    - \#ib\_16384\_0\.dblwr、\#ib\_16384\_1\.dblwr

- 重做日志：是用来实现事务的持久性。该日志文件由两部分组成：重做日志缓冲（redo log buffer）以及重做日志文件（redo log），前者是在内存中，后者在磁盘中。当事务提交之后会把所有修改信息都会存到该日志中，用于在刷新脏页到磁盘时，发生错误时，进行数据恢复使用。

    

`ibd2sdi xx.ibd` 查看表空间文件信息 



##### 后台线程



1. Master Thread

核心后台线程，负责调度其他线程，还负责将缓冲池中的数据异步刷新到磁盘中，保持数据的一致性，

还包括脏页的刷新、合并插入缓存、undo页的回收。

2. IO Thread

在lnnoDB存储引擎中大量使用了AIO来处理IO请求，这样可以极大地提高数据库的性能，而IO

Thread主要负责这些lO请求的回调。读写各4个，日志缓冲和插入缓冲区各1个。

3. Purge Thread

主要用于回收事务已经提交了的undolog，在事务提交之后，undolog可能不用了，就用它来回收。

4. Page Cleaner Thread

协助MasterThread刷新脏页到磁盘的线程，它可以减轻MasterThread的工作压力，减少阻塞。



`show engine innodb status;`



#### 事务原理



事务是一组操作的集合，是不可分割的工作单位，事务会把操作作为一个整体一起向系统提交或撤销操作请求，要么成功要么失败。







`redo log` 重做日志，物理日志，记录的是事务提交时数据页的物理修改，



- 解决问题：在脏页刷新到磁盘发生错误时，进行数据恢复从而保证事务的一致性、实现持久性。

- 解决方法：对缓冲区数据进行增删改后，通过WAL（Write\-Ahead Logging）机制。先将事务的修改记录到 `redo log`，再将`redo log` 刷写到磁盘，最后才将脏页异步地刷写到磁盘。

- 原理：`redo log` 是\*\*顺序写入\*\*的，效率高；即使事务提交后系统崩溃，日志已在磁盘上，脏页被线程\*\*异步批量\*\*刷回磁盘。 

    

`undo log` 回滚日志，记录（反向操作）逻辑日志，在插更删DML操作时产生



- 解决问题：提供回滚（事务原子性），支持MVCC

- 生命周期：

    - 插入时，只在回滚需要，提交则删除

    - 更新、删除时，在快照读也需要，不会立即删除

- 存储在rollback回滚段中，内含1024个Undo log Segment

- 原理：反向操作insert对应delete，update对应旧数据。每执行一条DML操作先写undo log，再修改Buffer Pool数据页，保证任意时刻崩溃都有备份。

- 版本链：

    

### MVCC 多版本并发控制



当前读：读取的是最新版本，会对要读记录加锁，如 `select ... lock in share mode`、 `select ... for update`、DML



快照读：读取可见版本，不加锁



- RC：每次select生成一个快照读

- RR：事务开始时第一次select才生成一个快照读

- S：退化为当前读

    

MVCC：维护一个数据的多个版本，使得读写操作没有冲突



#### 隐藏字段



DB\_TRX\_ID（Transaction）：最后一次修改该记录的事务ID



DB\_ROLL\_PTR：回滚指针，指向这条记录的上一个版本，配合undolog



DB\_ROW\_ID：隐式主键，没有主键时生成作为隐藏字段





### 索引



#### 索引类型



按照存储形式



- 聚集索引（Clustered Index）：每张表最多一个，叶子节点存储的就是数据本身；默认主键是聚集索引，没有主键找第一个唯一非空索引作为聚集索引，再没有才会自动生成一个隐藏的 RowID 作为聚集索引

    

- 二级索引：叶子结点存储的是聚集索引的键 

    

按照关键字分类



- 主键索引 默认自动创建，只能有一个【PRIMARY】

- 唯一索引 一种\*\*辅助索引\*\*，它的叶子节点存储的是\*\*索引列的值\*\*和\*\*对应行的主键值\*\*。

- 常规索引 也是\*\*辅助索引\*\*，区别在于一个索引列值可能对应多个主键值，根据索引查到对应主键值列表，逐个去\*\*聚簇索引\*\*中查找对应的完整行数据

- 全文索引 不是基于精确匹配或范围匹配，而是基于文本内容的语义和模糊匹配，使用\*\*倒排索引\*\*，将文档中的每个词进行分词处理，然后创建一个列表，列出每个词出现在了哪些文档中。

    

##### 访问磁盘次数与回表次数



访问磁盘次数取决于索引树的深度、数据是否在内存中、连续存储，3层深的B\+树要3次IO，涉及回表则还要进一步计算



回表指要查A,B，条件where A，通过辅助索引A拿到主键值后还需要回表根据主键id查B的值



对于\*\*聚簇索引\*\*的查询，聚簇索引就是\*\*数据本身\*\*，其目标通常是\*\*一次访问内存/磁盘，0次回表\*\*。



非聚簇索引的唯一索引



包含聚簇索引的覆盖索引



非唯一索引







#### 索引操作



```Plain Text
CREATE index idx_xx on tbl_xx(phone, xx);
```



索引命名参照`idx_表名_字段名1_字段名2`来书写



不能修改索引，只能删除或者通过修改表来增加。



```Plain Text
ALTER TABLE users ADD UNIQUE INDEX idx_users_unique_phone (phone);
DROP index idx_xx on tbl_xx;
```







#### 性能分析



- 查看慢查询日志 `show variables like 'slow_query_log'` 

    - 在/etc/my\.cnf中或命令配置 `set global slow_query_log=on` 

    - 设置日志文件 `set global slow_query_log_file='/var/lib/mysql/localhost-slow.log'` 

    - 设置慢查询时间 `set global long_query_time=1`

        

- 查看执行频次 `show global status like 'Com_______'` 是插、删、查、更哪种

    

- 查看当前会话中所有SQL的耗费时间 `show profiles`

    - 是否支持 `select @@have_profiling` `SET profiling=1`

    - 查看profile表对应编号SQL语句各个阶段花费 `show profile cpu,block io for query 1`

        

- 查看SQL执行计划，表的连接与索引情况 `explain SQL` `explain extended SQL` `explain partitions SQL` 

    - id：SQL执行的顺序的标识，SQL从大到小的执行

    - select\_type：SIMPLE（不使用表连接或者子查询）、PRIMARY（主查询，外层查询）、UNION、SUBQUERY（WHERE之后的子查询）

    - type：连接类型，ALL、index、range、ref（二级）、eq\_ref、const（聚集）、system、NULL（常量），从左到右效率递增

    - possible\_keys：可能用到的索引

    - key：实际用到的索引

    - key\_len：索引长度

    - rows：扫描行数，估计数

    - filtered：返回结果的行数占需读取行数的百分比，值越大越好

    - Extra：额外信息\*\*显示回表次数\*\*，null（回表）、using temporary（使用临时表）、using where（使用where过滤）、using index（使用索引）

        

```Plain Text
+---+-----------+-------+----------+------+--------------+------+---------+------+------+----------+-------+
| id|select_type| table |partitions| type | possible_keys| key  | key_len | ref  | rows | filtered | Extra |
+---+-----------+-------+----------+------+--------------+------+---------+------+------+----------+-------+
| 1 | SIMPLE    | users | NULL     | ALL  | NULL         | NULL | NULL    | NULL |   11 |   100.00 | NULL  |
+---+-----------+-------+----------+------+--------------+------+---------+------+------+----------+-------+
```



#### 索引失效



- 联合索引ABC，按最左前缀法则部分有效（key\_len不同）

- 范围查询 `><`，联合索引ABC，右侧失效，`>= <=`可规避

- 索引列上使用函数、计算、类型转换（隐式转换） `substring(index,1,2)='x'`

- 字符串不加引号

- 头部模糊匹配 `like '%xx'`，尾部可以

- OR条件中存在非索引

- 索引比全表扫描慢 `where xx >= '100'` `is not null`

    

#### 索引使用



- use 建议使用

- force 强制使用

- ignore 忽略

    

使用方法：`from xx use index()`



覆盖索引：索引包含所有需要查询的字段，不需要回表查询



前缀索引：字符串长度较长，只将字符串一部分前缀建索引 `create index x on xx(col(n))`



- 前缀长度选择区分度公式：`select count(distinct left(col, n)) / count(*) from xx` 前缀长度n

- 叶子节点会存完整字符串用于比对

    

联合索引：如果设置单列索引一起查只能使用其一从而导致回表，联合索引用于一起查`WHERE col1 = 'a' AND col2 = 'b'`



- 可能需要使用 `use` 建议使用联合

    

#### 索引设计原则



1. 针对于数据量较大，且\*\*查询比较频繁\*\*的表建立索引。

2. 针对于常作为查询条件（where）、排序（order by）、分组（group by）操作的字段建立索引。

3. 尽量选择区分度高的列作为索引，尽量建立**唯一索引**，区分度越高，使用索引的效率越高。

4. 如果是\*\*字符串类型\*\*的字段，字段的长度较长，可以针对于字段的特点，建立前缀索引。

5. 尽量使用联合索引，减少单列索引，查询时，联合索引很多时候可以\*\*覆盖索引\*\*，节省存储空间，避免回表，提高查询效率。

6. 要控制索引的数量，索引并不是多多益善，索引越多，\*\*维护索引结构的代价\*\*也就越大，会影响增删改的效率。

7. 如果索引列不能存储NULL值，请在创建表时使用NOT NULL约束它。当优化器知道每列是否包含NULL值时，它可以更好地确定哪个索引最有效地用于查询。

    

不适合使用索引的情况：

1. 数据量小

2. 频繁更新

3. 执行大量 `select *`

4. 高度重复的列

5. 低频查询的列

6. 长文本字段

    

#### 索引下推

将原本在 Server 层（服务层）进行的部分过滤操作，下推到存储引擎层（如 InnoDB）执行，从而减少不必要的回表次数，提高查询效率。

假设我们有一个联合索引 (a, b)，执行查询：SELECT * FROM table WHERE a = 1 AND b > 2;

传统流程：

索引查找：存储引擎根据索引的最左前缀 a = 1，找到所有满足条件的索引记录。
全部回表：存储引擎将这些记录的主键 ID 全部返回给 Server 层，Server 层根据 ID 去聚簇索引中查询完整的数据行（回表）。
Server 过滤：Server 层拿到完整数据后，再根据 b > 2 的条件进行过滤，剔除不符合的行。
痛点：如果 a = 1 的记录有 10000 条，但 b > 2 的只有 10 条，那么就会发生 9990 次无效的回表，造成极大的 I/O 浪费。

有索引下推（ICP 优化流程）：
索引查找与下推过滤：Server 层将 b > 2 这个条件“下推”给存储引擎。存储引擎在遍历 (a, b) 联合索引时，不仅检查 a = 1，还会直接在索引中判断 b > 2 是否成立。
按需回表：只有同时满足 a = 1 和 b > 2 的索引记录，存储引擎才会将其主键 ID 返回给 Server 层进行回表。
返回结果：Server 层直接获取到符合条件的完整数据行。
优势：在存储引擎层就过滤掉了大量无效数据，极大减少了回表次数和磁盘 I/O。


### SQL优化



#### insert优化



- 批量插入（500\-1000条）过大拆分

- 手动提交事务：自动事务每执行一条语句开启关闭一次，

- 主键顺序插入

- 大批量插入数据load（快50倍；主键顺序插入）

    

```Plain Text
#客户端连接服务端时，加上参数 --Local-infile
mysql --local-infile -u root -p

#设置全局参数local_infile为1，开启从本地加载文件导入数据的开关
select @@local_infile;
set global local_infile = 1;

#执行load指令将准备好的数据，加载到表结构中
load data local infile '/root/sqll.log' into table `tb_user` fields terminated by '' lines terminated by "\n';
```



#### 主键优化



- 满足业务需求下，尽量降低主键的长度

- 插入时顺序插入主键（选择自增型），不使用uuid或自然主键

- 业务操作时，避免对主键的修改

    

页分裂



一页至少包含2行，一行数据过大会行溢出，聚簇索引顺序插入，两个页之间的有双向列表



当不按照聚簇索引顺序插入时，会进行页分裂插入，找到超出50%位置移动到新页，更改指针



#### Order by 优化



对于age，phone两个字段覆盖索引，索引age asc\+phone asc支持：单age查询、两者都升序或降序的查询；索引age asc\+phone desc支持一升一降排序



当不可避免要使用filesort，可以适当增大缓冲区大小sort\_buffer\_size（默认256k）



#### Group by 优化



不使用索引会使用temporary表，效率较低，应尽可能覆盖索引、最左前缀法则。



#### Limit 优化



当遇到大数据时，`Limit 100000, 10` 在不用索引下需要较长时间，因为需要查询0\-100010并丢弃之前的记录



通过覆盖查询＋子查询优化。



#### Count 优化



遍历累积计数很耗时间，count\(\*\)\~count\(1\)\<count\(主键\)\<count\(字段\)



#### Update 优化



执行update如果where的条件



### 视图、存储过程、触发器



### 锁

#### 全局锁



一般用于数据备份，对整个数据库实例加锁，所有DML和DDL都被阻塞，可以进行DQL操作



```Plain Text
flush tables with read lock; # 加全局读锁
# windows 命令
# mysqldumb -uroot -p1234 itcast > itcast.sql 
unlock tables;
```



缺点: 主库进行备份则无法进行业务操作；从库备份不能执行主库同步过来的二进制日志，导致主从延迟



解决方法：使用 `mysqldumb --single-transaction -h -u -p xx > xx.sql` 使用快照读



#### 表级锁



每次操作锁住整张表，锁定力度大，发生锁冲突的概率最高，并发度最低



- 表锁：`lock tables xx read/write`，读锁会阻塞写，写锁会阻塞读和写

    - 表共享读锁

    - 表独占写锁

- 元数据锁（维护表结构）：`select * from information_schema.innodb_trx` 查看当前事务

- 行锁：`select * from xx for update`，行锁会阻塞其他行锁，不会阻塞表锁

- 不加锁：简单select语句

    

#### 意向锁



> 意向锁是给其他表锁用的，表锁看到意向锁就得知要等待锁的获取，这样不用挨个检查是否有行级锁。IX下行锁不受影响，还是去直接检查行是否有锁
> 
> 



行锁上锁时，同时为整表加上意向锁



- 意向共享锁（IS）：由语句select \.\.\. lock in share mode 添加，与表级共享锁read兼容，与表锁排他锁互斥。

- 意向排他锁（IX）：由insert、update、delete、select \.\.\. for update 添加，与表锁共享锁和排他锁都互斥，意向锁之间不互斥。

    

查看加锁情况：



```SQL
mysql> select object_schema, object_name, index_name, lock_type, lock_mode, lock_data from performance_schema.data_locks;
+---------------+-------------+------------+-----------+-----------+-----------+
| object_schema | object_name | index_name | lock_type | lock_mode | lock_data |
+---------------+-------------+------------+-----------+-----------+-----------+
| ai_pbl        | students    | NULL       | TABLE     | IX        | NULL      |
+---------------+-------------+------------+-----------+-----------+-----------+
```







#### 行级锁



通过对索引上的索引项加锁实现，而非对记录加锁，可分为：



- 行锁（Record Lock）锁定单个行记录的锁，防止其他事务对此行进行update和delete。在RC、RR隔离级别下都支持。

- 间隙锁（Gap Lock）锁定索引记录间隙（不含该记录），确保索引记录间隙不变，防止其他事务在这个间隙进行insert，产生幻读。在RR隔离级别下都支持。

- 临键锁（Next\-Key Lock）：行锁和间隙锁组合，同时锁住数据，并锁住数据前面的间隙Gap。在RR隔离级别下支持。

    

    

    

默认情况下，InnoDB在REPEATABLE READ事务隔离级别运行，InnoDB使用next\-key锁进行搜索和索引扫描，以防止幻读。



1. 索引上的等值查询\(唯一索引\)，给\*\*不存在的记录\*\*加锁时，优化为间隙锁（这期间不能插入，以免这次失败下一次操作又成功了）。

    

2. 索引上的等值查询（普通索引\)，向右遍历时最后一个值不满足查询需求时，next\-keylock退化为间隙锁（25，25，30）。

3. 索引上的范围查询\(唯一索引\)\-\-会访问到不满足条件的第一个值为止（查询条件id\>20：21， 22，28，31）。

    

    

    

#### 锁实际情况



一般来说事务中锁先







### 管理MySQL

#### MYSQL的系统数据库

- `mysql` 存储 MYSQL 正常运行所需要的各种信息（时区、主从、用户、权限），将近40张表

    - `db`存储性能指标的系统库

    - `slave`主从复制相关信息

    - `slow_log` 慢日志

    - `time_zone`时区操作

    - `user` 用户名、密码、对应权限

- `information_schema` 提供了访问数据库元数据的各种表和视图，包含数据库、表、字段类型及访问权限等。36张表，43个视图。

    - `ENGINES` 存储引擎及信息

    - `INNODB_*` 表空间、索引

    - `*_PRIVILEDGE` 权限

    - `ROUTINE` 存储过程和函数

    - 统计信息、库表、触发器、视图等

- `performance_schema` 保存MySQL服务器运行过程中的一些状态信息，可以用来监控 MySQL 服务的各类性能指标 。包括统计最近执行了哪些语句，在执行过程的每个阶段都花费了多长时间，内存的使用情况等信息。大约110张表。

    - `data_locks `意向锁和行级锁的加锁情况

    - `metadata_locks `元数据锁情况

- `sys` 自带的数据库，通过 视图 的形式把 information\_schema 和 performance\_schema 结合起来，帮助系统管理员和开发人员监控 MySQL 的技术性能

#### Linux中MySQL的文件系统

- `/var/lib/mysql/`存放数据库文件，可使用`show variables like 'datadir'`查询

    ```Plain Text
    auto.cnf       ca-key.pem       #ib_16384_0.dblwr  ibtmp1        mysql            performance_schema  server-key.pem
    binlog.000003  ca.pem           #ib_16384_1.dblwr  #innodb_redo  mysql.ibd        private_key.pem     sys
    binlog.000004  client-cert.pem  ib_buffer_pool     #innodb_temp  mysql.sock       public_key.pem      undo_001
    binlog.index   client-key.pem   ibdata1            miniquizdb    mysql.sock.lock  server-cert.pem     undo_002
    ```

    - binlog 二进制文件，会定期清理

    - 

- `/usr/bin`和`/usr/sbin`存放mysqladmin、mysqlbinlog、mysqldump等命令



```Plain Text
mysql 
mysqlbinlog
```



#### 常用工具

1. Mysql 客户端工具

```Plain Text
# 登录 MySQL 客户端，最好还是缄默密码
mysql -h192.168.200.202 -P3306-uroot -p1234 a_db -e "select * from stu"
```

2. mysqladmin 管理指令：创建、删除、刷新、Debug、进程信息、关闭、主从复制、查看变量版本

```Plain Text
# mysql [option] command command

# 不设定用户名密码默认本机3306
```

3. mysqlbinlog 查看服务器保存的二进制日志文件

```Plain Text
# mysqlbinlog [options]log-files1 log-files2 ..

mysqlbinlog -s binlog.000003
```

4. mysqlshow 客户端对象查找工具，用来很快地查找存在哪些数据库、数据库中的表、表中的列或者索引。

```Plain Text
# mysqlshow[options] [db_name[table_name[col_name]]]
# -count    显示数据库及表的统计信息（数据库，表均可以不指定）
# -i        显示指定数据库或者指定表的状态信息

# 查询所有库的表的数量及表中记录的数量
mysqlshow -uroot-p2143 --count

# 查询某个库的
mysqlshow -uroot-p2143 test_db --count

# 查询表的（加上字段也可以）
mysqlshow -uroot-p2143 test_db test_tbl     --count
```

5. mysqldump

## 监控运维

## 实操问题记录


### 数据库选型

- 数据量，转移

- 宽表适合，深表

- 读多写少

- 

### 库表设计



必须一开始和流程想清楚了再做，或者将设计停留在dev阶段去更改表结构



冗余设计



外键设计



一对多关系，



#### 命名规范



- 名称 `title` `name`

## JDBC



源自`java.sql`模块，可以参考https://www\.geeksforgeeks\.org/java/introduction\-to\-jdbc/



```Java
import java.sql.*;

try {
        // 1.初始化驱动类
    Class.forName("com.mysql.cj.jdbc.Driver");
    // 2.获取connection链接
    Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3307/test?useSSL=false", "root", "123456");
    // 3.SQL语句
    String sql = "select * from users;";
    // 4.预定义Statement，传入SQL语句
    PreparedStatement statement = connection.prepareStatement(sql);
    // 5.通过execute执行
    ResultSet resultSet = statement.executeQuery();
    
} catch (SQLException e) {
    e.printStackTrace();
}
```



### 三种查询



- 常规查询：JDBC驱动会阻塞的一次性读取全部查询的数据到 JVM 内存中，或者分页读取。

    

- 流式查询：每次执行rs\.next时会判断数据是否需要从mysql服务器获取，如果需要触发读取一批数据（可能n行）加载到 JVM 内存进行业务处理

- 游标查询：通过 fetchSize 参数，控制每次从mysql服务器一次读取多少行数据。

    

    

    

### 缺点



以上`DriverManager.getConnection`建立jdbc连接的过程是很昂贵的，需要经历 \*\*TCP握手\+MySQL认证\*\*，如果服务在不断并发处理多个请求的时候每次都重新建立JDBC连接并且在请求结束后关闭JDBC连接，那么将会导致：



- 网络IO多，因为不断的TCP握手和TCP关闭，大量新建后立刻关闭的TIME\_WAIT状态的TCP连接占用系统资源

- 数据库负载高，数据库也要重新为连接建立各种数据结构，并且在短暂的查询结束后又要销毁

- 查询耗时长，多了TCP握手和MySQL认证的耗时。同时，不断产生又回收掉JDBC连接资源会频繁触发GC

    

为了能够 \*\*复用已经辛辛苦苦建立好的JDBC连接\*\*，就有了数据库连接池的概念。



作者：JackpotDC

链接：https://juejin\.cn/post/6914533580966199303

来源：稀土掘金

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## 数据库连接池 DBCP



> 一个容器里放了很多个连接，我们需要连接就去容器里拿，用完了就还回去，容器负责对所有连接的管理，这就是数据库连接池。
> 
> 



### 关于数据库连接池



#### 常用数据库DBCP



Hikaricp、Druid、c3p0、Tomcat



#### 功能



- 在连接应用启动的时候建立连接，并且保存到Java的容器或自定义的容器中维护

- 在应用运行的过程中，间歇性测试连接的可用性（`select 1`），踢出不可用的连接，加入新的连接

- 在应用结束后关闭JDBC连接

    

    

    

### Tomcat







### Hikari







### Spring\-JDBC











#### Mybatis DBCP











## ORM对象关系映射框架



分为以下几类：



- 完整ORM：Spring Data JPA, Jimmer,TSpring Data JDBO

- 残缺ORM

- DSL

- 字符串或模板：

    

### Spring Data JPA



### Jimmer







### Spring Data JDBC







### MyBatis Plus



优秀的持久层ORM框架，支持定制化 SQL、存储过程以及高级映射。通过xml或注解来配置和映射原生信息，将接口和 Java 的 POJOs映射成数据库中的记录



当框架启动时，通过configuration解析config\.xml配置文件和mapper\.xml映射文件，映射文件可以使用xml方式或者注解方式，然后由configuration获得sqlsessionfactory对象，再由sqlsessionfactory获得sqlsession数据库访问会话对象，通过会话对象获得对应DAO层的mapper对象，通过调用mapper对象相应方法，框架就会自动执行SQL语句从而获得结果。



#### 使用方法



```Java
public static void main(String[] args) throws Exception {
    SqlSessionFactory factory = createSqlsessionFactory();
    SqlSession sqlSession = factory.openSession();
    UserMapper mapper sqlSession.getMapper(UserMapper.class);
    User user = mapper.selectId();
}
```



### Hibernate



### MyBatisPlus







#### MyBatis\-X



### QueryDSL



### JdbcTemplate



### 多数据源



#### 使用场景



- 业务复杂

    - 使用业务拆分，相应业务处理对应的数据库，之间通过RPC调用接口

    - 业务没拆，但数据量庞大，需要进行数据库拆分

- 读写分离

    

    

    

