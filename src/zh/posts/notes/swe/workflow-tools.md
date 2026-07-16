---
lang: zh-CH
title: 工作流与工具使用
description: SOP沉淀、SWE的工作技能
date: 2026-1-2
category:
  - 后端开发
tag:
  - SOP
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

#### 二、设计参数与权限



- 命名规范：前后端使用驼峰、数据库可以使用下划线不使用（数据库对大小写不敏感）

- 参数是否必须、变量格式

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

## Git

> [官方文档](https://git-scm.com/docs)
> 必看书籍-Pro Git 第二版
> [工作经验](https://github.com/k88hudson/git-flight-rules/tree/master)

### 一、Git 结构与基础工作流程

Git 体系主要由三个核心区域构成：工作区、暂存区和版本库，版本库分为本地库和远程库，远程库可以看作代码托管服务器的本地库。



- `git add` 执行过程： 对工作区文件执行 `git add` 时，Git 会计算内容哈希值，将文件内容存储为数据块（Blob Object），并更新暂存区的目录树。

(Repository)

- 描述： 包含所有提交历史、快照和配置。分为本地版本库和远程版本库。

- 文件位置： `.git` 目录

- 主要交互命令： `git commit`, `git log`, `git push`

- 远程版本库交互： `git pull`, `git merge`, `git fetch`

- HEAD： 指向当前分支（提交）的游标。

- Objects： 位于 `.git/objects`，是 Git 的对象库。

#### 文件状态

工作区的文件状态包括：未跟踪、已修改、已暂存、已提交。

![Image](/assets/images/swe/git_file_status.png)

查看当前文件状态

```Bash
# 显示除了已跟踪之外的文件状态，以及本地分支相对于上游分支的状态
$ git status
On branch feature/test-suite
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    src/welcome.html
        new file:   tests/test-runner.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   package.json
        modified:   tests/test-runner.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/welcome.html
```

忽略文件

不希望文件被追踪并出现在追踪列表，使用 `.gitignore` 文件声明。

```Bash
# 可以使用标准的 glob 模式匹配
*.[oa]
v0.1_**.log
build/
doc/**/*.pdf
```

.gitignore 文件只作用在其所在目录。

- `git status --ignored`：可查看是否隐藏了文件。

发现误提交的处理：

```Bash
git rm *.db # 从暂存区和工作区（磁盘）移除，不删除版本库 HEAD 指向的快照
git rm --cached *.db *.db-wal # 仅移除暂存区文件，保留工作区文件
# 工作区有未暂存的修改，或者暂存区有未提交的修改时 rm 会失败
git rm --force *.db # 忽略安全检查，强制删除
```

查看详细修改位置

```Bash
# 查看自己代码与暂存区之间具体的变动
git diff
# 查看已在暂存区准备要提交的改动
git diff --staged
```

查看提交历史

```Bash
git log
# 按补丁格式显示每个提交引入的差异，最近两条
git log -p -2
# 显示每次提交的文件修改统计信息
git log --stat
# 可选 oneline、short、full、fuller 和 format 显示历史提交信息
git log --pretty=oneline
git log --pretty=format:"%h - %an, %ar : %s"
# ASCII 图形显示分支与合并历史
git log --pretty=format:"%h %s" --graph
git log --since=2.weeks
git log --pretty="%h - %s" --author="John Doe" --since="2008-10-01" \
--before="2008-11-01" --no-merges -- t/
# 查看特定文件
git log -- <file>
```

撤销操作

```Bash
# 提交信息重写、遗漏文件未提交
git commit --amend # 撤销并按现在暂存区重新执行上次提交（覆盖替换）
# 取消暂存的文件
git reset HEAD <file>
# 撤销对文件的更改（危险覆盖）
git checkout -- <file>
```

### 二、仓库建立与配置

#### 建立本地仓库

- 首先选择工作目录。

- `git init`：创建隐藏文件 `.git`，初始化本地版本库。

- **克隆远程仓库：**

```Bash
git clone <repo> <directory>
```

- （如果是私有库，操作一致，只是后续连接有所不同）

#### 关联与管理远程仓库

```Plain Text
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519    
```

`origin` 是这个远程仓库在本地的默认名称（别名），你可以换成其他名称`git remote rename <旧名称> <新名称>`

新创建的仓库默认主分支通常是 `main`，如果不是（老版本master）可以

- `git remote add origin <url>`：关联远程仓库，并命名为 `origin`（默认别名）。

    - **示例：** `git remote add origin https://github.com/你的用户名/你的仓库名.git`

- `git remote -v`：查看当前仓库关联的所有远程仓库及其 URL。

- `git remote rename <旧名称> <新名称>`：重命名远程仓库的别名。

- `git remote set-url origin <new_url>`：直接修改 `origin` 别名指向的远程 URL。

    - **示例：** `git remote set-url origin https://github.com/carriehxx/AI_oriented_PBL.git`

- `git remote remove origin`：删除远程仓库关联。

#### 设置用户与配置

用户信息设置

```Bash
# 设置全局用户名和邮箱 (首次使用必须设置)
git config --global user.name "runoob"
git config --global user.email test@runoob.com
```

配置查看与编辑

```Bash
# 查看当前 git 配置信息
git config --list

# 针对当前仓库编辑配置
git config -e     

# 针对所有仓库编辑全局配置
git config -e --global   
```

代理设置

```Bash
# 设置 HTTP/HTTPS 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 取消代理设置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 三、核心工作流程 

#### 修改、暂存与状态查看

- `git add .`：将工作区所有修改和新增文件添加到暂存区。

- 

- `git diff`：默认查看**工作区**与**暂存区**的区别。

- `git restore <file>`：恢复工作区中被修改的文件（取消修改）。

- **不太常用命令：**

    - `git rm <file>`：将文件从暂存区和工作区中删除（不再跟踪）。

    - `git mv <old> <new>`：移动或重命名工作区文件。

#### 提交到本地版本库

- `git commit -m "feat:xxx"`：提交暂存区快照到版本库，生成一个小快照。

##### Commit 执行过程

1. Git 遍历暂存区所有文件。

2. 计算内容的哈希值，将文件内容存储为一个 **Blob Object**。

3. 创建一个 **Tree Object**，记录了当前项目目录结构和 Blob 对象的哈希值和文件名。

4. 创建新的 **Commit Object**，将特定的 Tree Object 和历史信息关联起来。

##### Commit 信息规范

推荐使用以下类型作为前缀：

- `feat`: 新功能（feature）

- `fix`: 修补 bug

- `docs`: 文档（documentation）

- `style`: 格式（不影响代码运行的变动）

- `refactor`: 重构（既不是新增功能，也不是修改 bug）

- `chore`: 构建过程或辅助工具的变动

- `revert`: 撤销，版本回退

- `perf`: 性能优化

- `test`：测试

- `improvement`: 改进

- `build`: 打包

- `ci`: 持续集成

**书写示例：**

```Plain Text
fix: 修复项目参与者批量导入功能

- 修复CSV文件字段映射错误
- 添加数据验证和错误处理
- 优化用户反馈信息
```

#### 回顾提交历史 (`git log`)

- `git log [选项] [分支名/提交哈希]`：回顾提交历史。

- **常用选项：**

    - `--oneline`：以简洁的一行格式显示提交信息。

    - `-n 5`: 查看最近 5 次的提交。

    - `--since=<时间>`：只显示指定时间之后的提交（格式："2024-01-01"）。

    - `--until=<时间>`：只显示指定时间之前的提交。

    - `--reverse`: 倒序显示。

    - `--author=="Author Name"`：按作者过滤。

### 四、撤销、恢复与分支操作

#### 撤销和恢复

- `git reset`：重置 HEAD 指针和暂存区/工作区。用于本地撤销提交或暂存操作。

- `git revert <commit>`：撤销一个提交，通过创建一个**新的相反提交**来抵消其影响，保留历史记录。

- `git restore <file>`：恢复文件到特定状态（工作区或暂存区）。

#### 分支操作

- **命名规范：** `feature/xxx`, `bugfix/xxx`, `hotfix/xxx`, `release/vX.Y.Z`, `refactor/xxx`。

##### 创建与切换

- `git branch <name>`：创建一个新分支。

- `git checkout -b <name>`：创建并切换到当前分支。

- `git checkout main`：切换到 `main` 分支。

    - 当你切换分支时，Git 会用该分支的最后提交的快照替换你的工作目录的内容。

##### 查看与删除

- `git branch`：查看本地分支。

- `git branch -r`：查看远程分支。

- `git branch -a`：查看所有分支（本地 + 远程）。

- `git branch -vv`：查看所有本地分支及其对应的上游分支。

- `git branch -d feat-xx`：安全删除分支（已合并）。

- `git branch -D <branchname>`：强制删除分支。

##### 合并与变基

- `git merge <branch>`：将其他分支合并到当前分支。遇到冲突需要解决。

- `git rebase <branch>`：变基。将当前分支的提交历史“嫁接”到目标分支最新提交之后。

#### 临时储藏

- `git stash`：遇到需要暂时切换分支处理问题，但本地修改尚未可以提交时，用于**储藏**当前工作区的修改。

#### 其他

- `git tag`：创建标签。

- `git blame <file>`：查看文件中每一行代码的修改记录。



## 快捷键

### Jetbrains

#### Windows

- 查找所有引用 Alt + F7

- shift+F6 重构

- `ctrl` + `shift` + `r` 全局替换

- `ctrl` + `p` 查看函数/方法参数

- `Ctrl` + `q` 弹出一个包含 Javadoc 或源代码注释的窗口，提供函数的详细描述、参数、返回值等。

- `Ctrl` + `Shift + I` 不跳转，直接在小窗口中查看类、方法或字段的定义。

- `Ctrl + B` / `Ctrl` + `鼠标左键` 跳转到类、方法或变量的定义位置。

- `ctrl` + `h` 查看该接口实现类

- `ctrl` + `F12` 查看类中所有方法

- `ctrl`+`alt`+`l` 格式化代码块

- `ctrl`+`alt`+`o` 优化导入

- `ctrl`+`alt`+`v` 生成一个变量替换

- `ctrl`+`x`把这一行剪切

- ctrl+shift+"`-"` 收起所有方法

- `alt` + `insert` 创建构造方法

- `alt` + `enter` 测试、实现类

- `alt` + `⬅` 切换标签页

##### Mac

1. Edit 编辑
- command + / 注释
- command + W 快速选择
- command + C Copy, 复制
- command + shift + C 复制路径
- command + V 粘贴
- command + shift + V 从剪贴板中粘贴
- command + Y 删除整行
- shift + Backspace 删除整行
- Alt + Backspace 删除整个单词
- command + X 剪切
- command + Z 撤回修改
- command + shift + Z 重做修改
- command + D Duplicate, 重复内容
- Tab 缩进代码
- shift + Tab 取消缩进
- command + shift + ⬆ / ⬇ 移动代码 / 代码块
- command + . 展开收回代码块
- command + +/- 展开折叠代码
- command + shift + +/- 展开 / 折叠所有代码
- command + shift + 8 启用列选择模式
- command + Alt + J 用 Live Template 包围代码
- ctrl + shift + J Join, 两行代码合并为一行
- Alt + Enter 快速 Import 缺失的包, 单双引号转换, 测试正则表达式
2. Refactor 重构
- command + Alt + L 格式化代码
- command + Alt + T 代码块包围(Try Except 等)
- shift + F6 重命名
- command + shift + Alt + T 变量名重构
- command + Alt + V Extract Variable, 提取变量
- command + Alt + P Extract Parameter, 提取参数 (在Function方法中使用)
- command + Alt + C Extract Constant, 提取常量
- command + Alt + M Extract Method, 提取方法
- command + Alt + F Extract Field 提取字段 (在 class 类中使用)
3. File 文件
ctrl + N 新建文件
F5 复制文件到某处
F6 移动文件到某处
command + Alt + Y Synchronize, 同步 Workspace
command + S Save all, 保存所有
4.Navigation 导航
command + < / > 跳转到行首 / 行尾 command + [] 跳转至代码块首 / 尾 command + PageUp / PageDown 跳转至当前屏幕页首 / 页尾 command + Home / End 跳转至文件首 / 尾 command + 7 文件结构窗口 command + 9 打开 VCS 版本控制 command + Alt + ← / → 跳转至上一次 / 下一次编辑的地方 command + shift + Backspace 跳转至上一次编辑处 command + G Go to Line 跳转到某行 Alt + Home 进入顶部文件导航栏 F2 下一个错误或警告 shift + F2 上一个错误或警告
5.Run / Debug 运行与调试
- ctrl + F5 重新运行
- ctrl + R Run 运行
- ctrl + D Debug 调试
- shift + F9 Debug 调试
- shift + F10 Run 运行
- shift + Alt + F10 选择要运行的文件
- F7 Step into, 进入子函数调试
- F8 Step over, 单步调试不进入子函数
- F9 继续执行程序
- Alt + F9 调试时运行至光标处
- command + F2 Stop 停止运行
- command + F8 添加 / 取消断点
- command + shift + F8 查看所有断点
- command + shift + F4 关闭正在进行的Run运行任务, 搜索等
- command + shift + Alt 启用多光标选择
6.窗口操作
- command + F4 关闭标签
- command + Tab 切换标签
- command + Q Quit, 退出 PyCharm
- shift + F4 开启代码独立窗口
- command + F12 文件结构
- command + 1 展开收回 Project 窗口
- command + , Preference, 偏好设置
- command + R Replace, 替换
- command + E Recent Files
- command + F Find, 查找
- command + shift + F 全局搜索
- command + shift + R 全局替换
- command + shift + F12 收起所有工具窗口(编辑窗口最大化)
- Esc 退出工具窗口进入代码编辑器
- shift + F4 开启代码独立窗口
- Alt + F12 打开 Terminal 终端
- command + ctrl + F 全屏幕
- command + ctrl + +/= Zoom Editor, 编辑器尺寸
7.版本控制VCS
- shift + Alt + ctrl + ⬆ / ⬇ 查看本地与版本控制 VCS 的区别
- command + T 从版本控制 (VCS) 更新代码
- command + K Commit, 提交代码
- shift + Alt + C Recent Changes, 最近的修改(本地)
- shift + Alt + ctrl + ⬆ / ⬇ 查看本地与版本控制 VCS 的区别
- command + Alt + Z Revert Commit 从版本控制中撤回修改
- command + Alt + A Add 添加到 VCS 版本控制中
8.代码信息
- ctrl + J 快速查看文档
- command + Click 进入源码
- command + B 查看定义源码
- command + P 查看参数
- Alt + F7 查看变量等使用情况
- Alt + F1 快速查看文件 / 文件夹结构
- ctrl + shift + Q 显示当前代码上下文信息 (属于哪个函数, 属于哪个 Html 标签等)
- ctrl + H Hierarchy 查看继承关系
9.其他
- ctrl + ~ 切换主题
- main Live Template, 快速键入if name == 'main:'



### VS code



- 查找所有引用

    - `shift` + `F12` 查看某个函数名、变量名或导入的模块名在当前文件的位置

    - `Alt` + `Shift` + `F12` 查看某个函数名、变量名或导入的模块名在项目所有文件的位置

- 转到定义 `F12`

- 查看函数/方法参数 `Ctrl + Shift + Space`

- 快速修复（import） `Ctrl` + `.`

