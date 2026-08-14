
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
