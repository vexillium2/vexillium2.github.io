---
lang: zh-CH
title: Linux 使用与排障笔记
description: 以"现象 → 定位 → 验证"为主线，整理 Linux 常用命令组合、重定向与管道、权限、进程/端口/磁盘排查、远程工作、软件包与 systemd
date: 2023-04-09
category:
  - 后端开发
tag:
  - 命令
  - Linux
  - 排障
---

> 全文主线只有一句：**遇到现象时，能用最短的命令路径定位到原因，并验证它确实被解决**。
> 因此这里收的是可复用的命令组合、必要的最小机制（重定向、权限位、fd、inode）和实际踩过的坑，而不是每个命令的完整参数表——完整的 `--help` 属于 man page，不属于这篇笔记。
> 每一节的写法尽量对齐"现象 → 判断依据 → 命令 → 验证"，可复用的形态优先。

---

## 一、文件与文本处理

### 定位文件：`ls` 与 `find` 的常用组合

`ls -l` 的每一列都有用途，看懂一次就不用再查：

```Bash
$ ls -l a.txt b.c
-rw-rw-r-- 1 USER2022102157 USER2022102157  4096 Mar 16 16:52 a.txt
drwxrwxr-x 3 USER2022102157 USER2022102157  4096 Mar 16 16:52 test-dir
```

字段依次是：**文件类型 + 权限位**、链接数、所有者、所属组、大小、修改时间、名称。目录的链接数等于 `2 + 子目录数`（`.` 和 `..` 各占一个），这也是"为什么新建子目录会让父目录链接数变化"的原因。

```Bash
ls -a            # 显示隐藏文件（. 开头）
ls -lh           # 人类可读大小
ls -lt           # 按修改时间倒序，找最新改动的文件
ls -lS           # 按大小倒序，找谁占了空间
ls -l --time-style=full-iso   # 拿到完整时间，排查"时间戳对不上"
```

`find` 的坑集中在两处：**先限定范围，再写条件**；**删除前先打印**。

```Bash
# 限定范围：不要一上来就 find /，全盘扫描又慢又容易误伤
find . -maxdepth 2 -name '*.log'

# 按大小、时间、类型、空文件筛选
find . -type f -size +100M            # 默认单位是 512B 块，+100M 才是 100MiB 以上
find . -type f -mtime -1              # 最近 1 天内修改过
find . -type d -empty                 # 空目录
find . -empty -not -name '.*'         # 空文件/空目录，排除隐藏项

# 找到后要"看"就 -exec 直接执行，要"交给别的命令"才用 xargs
find . -type f -name '*.log' -exec ls -lh {} +
find . -type f -name '*.log' -print0 | xargs -0 rm -f

# 排序取 Top N：先给 find 的输出带上大小，再排
find . -type f -exec ls -s {} + | sort -nr | head -5
```

两个必须记住的边界：

- `-exec ... \;` 会为每个文件启动一次进程，`-exec ... +` 会把结果批量拼成一条命令，文件多时差距很大。
- 文件名里可能有空格或换行，管道交给 `xargs` 时必须用 `-print0 | xargs -0`，否则会被按空白拆开而误删误改。

判断一个命令究竟来自哪里、是不是别名：

```Bash
$ which python3
/usr/bin/python3
$ type -a ls         # 同时列出别名、函数、可执行文件
$ readlink -f $(which python3)   # 顺着软链接找到真实文件
```

`/usr/bin` 通常属于包管理器，`/usr/local/bin` 通常是源码编译或手工安装，`~/.local/bin`、`~/miniconda3/bin` 属于用户级安装。这条判断在"卸载软件"和"PATH 为什么指向了旧版本"两个场景里都会用到。

### 查看文件：`cat`、`less` 与 `tail`

```Bash
cat -n file                 # 带行号输出，配合 grep 定位行
cat a.txt b.txt > c.txt     # 拼接，注意会覆盖 c.txt

less +F app.log             # 以跟踪模式打开，等价 tail -f；Ctrl+C 回到浏览模式
less file                  # g/G 首尾，/ 搜索，n 下一个

tail -n 100 app.log         # 最后 100 行
tail -f app.log             # 跟踪新增内容
tail -F app.log             # 跟踪文件名而非 fd，日志轮转（logrotate）后仍能跟上
```

`tail -f` 与 `tail -F` 的区别是排障高频考点：`-f` 跟踪的是已经打开的 fd，日志被轮转（重命名+新建）后会继续盯着旧文件，看起来"日志不动了"；`-F` 会在文件被替换后重新打开。

大文件不要用 `cat` 直接刷屏——几 GB 的文件会拖垮终端。用 `less`、`head`、`tail`，或按行数统计：

```Bash
wc -l app.log               # 行数
wc -c app.log               # 字节数
```

### 检索与加工：`grep`、`sed`、`awk` 的最小可用集

**grep 只接受文件或流，不接受"一行文本"**，所以要匹配一个字符串要么给它文件，要么用管道喂进去：

```Bash
grep -rn 'Connection refused' ./logs        # 递归 + 行号
grep -i 'timeout' app.log                   # 忽略大小写
grep -C 3 -A 2 'Exception' app.log          # 前后各 N 行上下文
grep -w 'root' /etc/passwd                  # 整词匹配，避免 rootfs 之类误命中
grep -v 'health' access.log                 # 反向过滤
grep -q 'ready' status.txt && echo up       # 静默模式，只用退出码
echo 'hello' | grep -o 'ell'                # -o 只输出匹配部分
```

```Bash
# 扫代码目录时排除体积大又无关的目录，否则会卡很久并混入噪声
grep -rn --include='*.java' --exclude-dir={.git,node_modules,target} 'TODO' .
```

**sed 用于按行替换和删除**，日常只会用到几种形态：

```Bash
sed 's/old/new/g' file            # 输出到终端，不改文件
sed -i 's/old/new/g' file         # 就地修改（GNU）；macOS 需要写成 sed -i '' ...
sed -i.bak 's/old/new/g' file     # 改之前留个 .bak，手滑时的保险
sed -n '10,20p' file              # 只看第 10~20 行
sed '/^#/d' conf                  # 删除注释行
sed -i '/^$/d' conf               # 删除空行
sed -E 's/([0-9]+)ms/\1 milliseconds/' file    # -E 才支持无转义分组
sed 's#/usr/local#/opt#g' file    # 内容里有 / 时换分隔符，比反斜杠转义干净
```

**awk 的价值是"按列处理"**，它的模型是：按记录分隔符（默认行）读入，按字段分隔符（默认空白）切列，`$1`、`$2`…`$NF` 取列。

```Bash
awk '{print $1, $NF}' access.log              # 第一列和最后一列
awk -F: '{print $1}' /etc/passwd              # 指定冒号分隔
awk -F, '$3 > 100 {print $1}' data.csv        # 条件过滤
awk '{sum += $3} END {print sum}' data.txt    # 求和
awk -F: '{printf "%-20s %s\n", $1, $3}' /etc/passwd   # 指定分隔符并对齐输出
```

`FS`（输入分隔符）、`OFS`（输出分隔符）、`NR`（行号）、`NF`（字段数）是最常用的四个内置变量。

### 排序、去重与统计：`sort` 与 `uniq`

```Bash
sort file                                        # 字典序
sort -u file                                     # 排序并去重
sort -nk 2 -t: file                              # 按第 2 列数字排序，分隔符是冒号
sort -nrk 3 -t: file                             # 第 3 列数字倒序
sort -h                                          # 带单位的大小排序（2K < 1G）
sort file | uniq -c | sort -nr | head -10        # Top 10
```

`uniq` **只对相邻的重复行生效**，所以它前面几乎总是跟着 `sort`——不排序直接用 `uniq` 是典型误用。

一条真正会反复用到的组合：统计日志里访问量最高的 IP。

```Bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -20
```

`tr` 只做字符级替换/删除，够用的就两三种：

```Bash
echo 'hello 123 world 456' | tr -d '0-9'   # 删除数字
cat text | tr '\t' ' '                     # 制表符转空格
tr a-z A-Z < file                          # 转大写
```

### 链接与打包：`ln` 与 `tar`

硬链接与软链接的本质区别在于**指向的是 inode 还是路径**：

| | 硬链接 | 软链接（符号链接） |
|---|---|---|
| 本质 | 新增一个目录项指向同一 inode | 一个文件，内容是目标路径 |
| 跨文件系统 | 不可以 | 可以 |
| 指向目录 | 不允许 | 允许 |
| 目标不存在 | 不可能（本身就是同一文件） | 可以悬空，访问才报错 |
| 删除原文件 | 数据仍在，其他名字照常访问 | 链接失效 |

```Bash
ln abc.txt hard.txt          # 硬链接：ln 默认就是硬链接
ln -s /opt/app/current/conf.yml conf.yml   # 软链接，生产里常见的"切换版本"手法
ls -li                       # -i 显示 inode，才能看出两个名字是不是同一份数据
```

`tar` 的四个字母里，`-f` 永远是最后一个接文件名，其余是模式：

```Bash
tar -czvf pkg.tar.gz dir/                 # 打包并 gzip 压缩
tar -xzvf pkg.tar.gz -C /opt              # 解包到指定目录
tar -tzvf pkg.tar.gz                      # 只列内容，不解包（确认再解开）
tar -czvf pkg.tar.gz --exclude='.git' --exclude='node_modules' dir/
tar -xjf pkg.tar.bz2                      # bz2 用 -j
```

三个容易踩的点：

- `--exclude` 要写在文件列表之前，写在后面不生效。
- 归档里带绝对路径时，GNU tar 解包会去掉开头的 `/`，不要指望它还原到原位。
- 用 `-C` 指定目录时，`-C` 之后的相对路径都以新目录为基准，顺序不同结果不同。

`zip`/`unzip` 场景不同，`-v` 只列目录内容不解压：

```Bash
unzip -l pkg.zip              # 先看内容
unzip pkg.zip -d /tmp/target  # 解压到指定目录
zip -r pkg.zip dir/           # 压缩目录
```

### 磁盘布局：FHS 与 `/etc` 下真正会改的文件

```Plain Text
/
├── bin -> usr/bin        # 用户命令（现代发行版多为指向 /usr 的软链接）
├── boot/                 # 内核与引导程序
├── dev/                  # 设备文件，/dev/null、/dev/sda1
├── etc/                  # 配置
├── home/                 # 普通用户主目录
├── lib -> usr/lib        # 共享库
├── mnt/  media/          # 手动挂载点 / 可移动设备挂载点
├── opt/                  # 第三方大型软件
├── proc/  sys/           # 内核暴露的虚拟文件系统
├── root/                 # root 的主目录
├── sbin -> usr/sbin      # 管理类命令
├── tmp/                  # 临时文件，重启清空
├── usr/                  # 系统级程序与库，local/ 下是手工安装的
└── var/                  # 会增长的数据：日志、队列、缓存
```

`/etc` 下真正需要记住的文件不多：

| 文件 | 作用 |
|---|---|
| `/etc/passwd` | 用户账号：用户名、UID、GID、主目录、登录 shell |
| `/etc/shadow` | 口令散列，只有 root 可读 |
| `/etc/group` | 组与组成员 |
| `/etc/sudoers` | sudo 授权规则，只能通过 `visudo` 改 |
| `/etc/fstab` | 开机自动挂载的文件系统 |
| `/etc/hosts` | 本地域名映射，排查 DNS 前先看它 |
| `/etc/resolv.conf` | DNS 服务器 |
| `/etc/ssh/sshd_config` | SSH 服务端配置 |

`/proc` 是排查用的只读视图：`/proc/cpuinfo`、`/proc/meminfo`、`/proc/<pid>/`（进程的 fd、环境变量、内存映射都在这里）。

```Bash
hostnamectl                  # 发行版与内核版本
cat /proc/version            # 内核版本
nproc                        # CPU 核数，判断 load 是否偏高时要一起看
```

---

## 二、输入输出、管道与退出码

这一章是后面所有"命令组合"的前提。不先理解 fd 与重定向，第一章的命令就只能一条条敲，排障时也无法把日志留下。

### 文件描述符与标准输入输出

Linux 的原则是"一切皆文件"，进程访问文件、管道、设备都通过**文件描述符**这个非负整数。每个进程有自己的 fd 表，三个编号由约定固定：

| fd | 名称 | 默认指向 |
|---|---|---|
| 0 | 标准输入 stdin | 终端键盘 |
| 1 | 标准输出 stdout | 终端 |
| 2 | 标准错误 stderr | 终端 |

关键点是 **stdout 和 stderr 是两个独立的流**。命令正常产生的数据走 1，报错和警告走 2，所以"为什么报错没进日志文件"几乎总是只重定向了 1 而没有带上 2。

fd 的上限不是固定的 0~255，而是由 `ulimit -n`（单进程限制）和 `fs.nr_open`（内核上限）决定：

```Bash
ulimit -n                    # 当前会话的单进程 fd 上限
cat /proc/sys/fs/nr_open     # 系统级上限
ls -l /proc/$$/fd            # 看当前 shell 打开了哪些 fd
```

程序还可以判断"我的输出有没有被重定向"，这也是很多工具在管道里自动关闭彩色输出的原理——`isatty()` 返回 0 就说明 stdout 已经不是一个终端：

```C
#include <unistd.h>

if (!isatty(fileno(stdout))) {
    fprintf(stderr, "stdout is redirected\n");
}
```

### 重定向：`2>&1` 的顺序陷阱

```Bash
cmd > out.txt          # stdout 覆盖写入，stderr 仍打印在终端
cmd >> out.txt         # stdout 追加
cmd 2> err.txt         # 只把 stderr 写文件
cmd 2>> err.txt        # 追加 stderr
cmd &> all.txt         # stdout 和 stderr 都写同一文件（bash 简写）
cmd > all.txt 2>&1     # 等价写法，也是唯一能在 sh 里通用的形式
cmd 2>&1 > all.txt     # 陷阱：stderr 去了终端，stdout 才进文件
```

最后一行值得单独解释，因为重定向是**从左到右依次生效**的：`2>&1` 先把 stderr 复制到"当前 stdout"，而此刻的 stdout 还是终端；随后 `> all.txt` 只把 stdout 换成文件。结果 stderr 留在终端。所以顺序必须是"先重定向 stdout，再让 stderr 跟随"。

丢弃不需要的输出：

```Bash
cmd 2> /dev/null                 # 只丢掉报错
cmd > /dev/null 2>&1             # 什么都不输出，只看退出码
cmd > /dev/null 2>&1 &           # 静默后台运行
```

**`2> &1` 是错的**，`&1` 中间不能有空格，bash 会直接报 `syntax error near unexpected token '&'`。

从文件读入、把多行内容写进命令：

```Bash
mysql -u root -p < init.sql        # 输入重定向
ssh host <<'EOF'                   # here-doc，引号包住 EOF 可阻止变量展开
cd /opt/app && git pull
EOF
grep 'error' <<< "$LOG"            # here-string
```

### 管道、`tee` 与退出码

管道把上一条命令的 stdout 接到下一条命令的 stdin：

```Bash
ps -ef | grep java | grep -v grep
cat app.log | grep -c 'ERROR'      # 也可以直接 grep -c 'ERROR' app.log，少一次 fork
```

想在保存日志的同时继续看，用 `tee`：

```Bash
./run.sh 2>&1 | tee run.log        # 屏幕和文件同时有
./run.sh 2>&1 | tee -a run.log     # 追加
```

管道的退出码有个反直觉之处：**`$?` 只反映最后一个命令的状态**，前面命令失败会被吞掉。

```Bash
$ grep 'x' not-exist.txt | wc -l
0
$ echo $?          # 0，因为 wc 成功了
```

两种处理方式：

```Bash
set -o pipefail                    # 管道中任一命令失败，整体就失败
echo "${PIPESTATUS[@]}"            # 拿到管道中每个命令各自的退出码
```

退出码本身是脚本与命令行判断的依据：`0` 表示成功，非 0 表示失败。常见误用是把 `$$` 当成退出码——**`$$` 是当前 shell 的进程号，`$?` 才是上一条命令的退出码**。

```Bash
$ echo $$
32145
$ ls /no/such/file 2>/dev/null
$ echo $?
2
```

### 命令组合与安全写法

```Bash
cmd1 && cmd2           # cmd1 成功才执行 cmd2
cmd1 || cmd2           # cmd1 失败才执行 cmd2（常用的兜底）
cmd1 ; cmd2            # 无论成败都执行
grep -q 'ready' f && echo up || echo down    # 把检查结果变成一句话
```

`$()` 做命令替换，比反引号可读、可嵌套：

```Bash
today=$(date +%F)
root=$(echo "scale=2; (-$b + sqrt($delta)) / (2 * $a)" | bc)
```

引用变量的两条纪律：

- **`"$var"` 一定要加引号**，否则含空格或通配符的值会被再次拆分。
- 不要用 `ls` 的输出去驱动逻辑（`for f in $(ls)`），文件名里的空格会把它拆坏。需要遍历文件时用 shell 的通配符 `for f in ./*.log` 或 `find ... -print0`。

`xargs` 把上一条命令的输出变成参数，比 `for` 循环更适合批量操作：

```Bash
grep -rl 'oldName' src/ | xargs sed -i 's/oldName/newName/g'
find . -name '*.tmp' -print0 | xargs -0 rm -f
```

---

## 三、权限、用户与 sudo

### 权限模型：rwx 对目录和文件的含义不同

权限位分三组，分别对应**所有者 u / 同组 g / 其他 o**，每组三个位 r、w、x。首字符表示类型：`-` 普通文件、`d` 目录、`l` 软链接、`c` 字符设备、`b` 块设备、`s` 套接字、`p` 管道。

`rwx` 在文件与目录上**含义不同**，这是 `Permission denied` 最常被误判的地方：

| 权限位 | 对文件 | 对目录 |
|---|---|---|
| `r` | 读取内容 | 列出目录下有哪些名字（`ls`） |
| `w` | 修改内容 | 在目录内创建、删除、重命名条目（需要同时有 `x`） |
| `x` | 作为程序执行 | 进入目录、访问其中条目（`cd`、读写已知路径的文件） |

由此得出两条反直觉但正确的结论：

- 一个目录只有 `r` 没有 `x`，`ls` 能看到文件名，但 `cd` 进去或 `cat` 里面的文件都会失败。
- 能不能删除一个文件，取决于**它所在目录的 `w`**，而不是文件自己的权限位。

```Bash
chmod 644 file      # 所有者可读写，其他人只读——普通文件默认
chmod 755 dir       # 所有者可读写执行，其他人可读可执行——目录和可执行文件默认
chmod 600 key.pem   # 只有所有者可读写——私钥、凭据文件
chmod 700 script.sh
chmod +x script.sh  # 符号模式：给 u/g/o 都加执行位
chmod u+x,g-w file  # 精确指定
chmod -R 755 dir    # 递归
chown user:group file
chown -R app:app /opt/app
umask               # 新建文件/目录要抹掉的权限位，常见 022
```

`umask 022` 意味着新建文件是 `666 & ~022 = 644`，新建目录是 `777 & ~022 = 755`，这解释了"为什么新文件默认没有执行权限"。

**反例**：`chmod -R 777` 能"解决"权限问题，但解决的是症状，同时把写权限开放给了系统上所有用户。它还会让原本靠权限位工作的程序静默失效（比如 ssh 会拒绝使用权限过宽的私钥），最终把问题从"配错权限"变成"不知道谁改过文件"。

### `Permission denied` 的排查顺序

按下面的顺序走，绝大多数情况在第二步就能定位：

```Bash
# 1. 我是谁，属于哪些组
id
whoami

# 2. 路径上每一级目录的权限都要检查 —— 缺一个 x 就足够失败
namei -l /opt/app/conf/app.yml
```

`namei -l` 会逐级列出路径上每个组件的权限，这是最省事的一步：很多人只看了目标文件的权限，却忽略了 `/opt` 或 `/opt/app` 少一个 `x`。

```Bash
# 3. 排除文件属性与挂载因素
lsattr file                       # 看到 i 说明被 chattr +i 锁住，root 也改不了
mount | grep ' /data '            # 看是否挂成了 ro（只读）
findmnt -no OPTIONS /data         # 是否带 noexec（不可执行）、nosuid

# 4. 排除安全模块
getenforce                        # SELinux：Enforcing 时要查 audit.log
dmesg | grep -i 'denied'          # SELinux/AppArmor 的拒绝记录
```

常见误判：

| 现象 | 真实原因 |
|---|---|
| `ls` 能看到文件但 `cat` 报错 | 目录缺 `x` |
| 删除自己目录里的文件被拒 | 文件所在目录缺 `w` |
| root 也改不了文件 | `chattr +i` 或挂载为只读 |
| 脚本有执行权限却 `Permission denied` | 挂载点带 `noexec`，或开头 shebang 指向的解释器不存在 |
| 私钥明明存在却提示 `bad permissions` | 文件权限过宽，ssh 主动拒绝 |

### 用户、组与密码文件

```Bash
useradd -m -s /bin/bash deploy            # 建用户并建房目录
useradd -r -s /sbin/nologin svcapp        # 系统用户，不允许登录
usermod -aG docker deploy                 # 追加到附加组（-a 不能省）
usermod -s /sbin/nologin deploy           # 改成不可登录
groupadd -g 1500 devops
id deploy                                 # 查 UID/GID/所有组
grep '^docker:' /etc/group                # 先确认组存在
```

`usermod -aG` 有三个高频陷阱：

- 漏掉 `-a` 会**覆盖**用户原有的附加组，只剩新加的那个。
- 加组后**必须重新登录**（或开新会话）才生效，因为组成员关系在会话建立时已经确定并缓存。急着验证可以用 `newgrp docker` 临时切换。
- 不要手工编辑 `/etc/group` 来加人，容易写坏格式。

`/etc/passwd` 七个字段，含义固定：

```Plain Text
用户名:口令占位符:UID:GID:用户说明:主目录:登录 shell
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
```

口令早已不在这个文件里（`x` 是占位符），真正的散列在 `/etc/shadow`。把 shell 设为 `/usr/sbin/nologin` 是"建一个不能登录的服务账号"的标准做法。

```Bash
whoami      # 当前用户名
who         # 当前有哪些登录会话
w           # 会话 + 来源 IP + 负载，排查"谁在机器上"用这个
last        # 最近的登录历史
```

### `sudo` 与 `sudoers` 的最小配置

```Bash
sudo -l                       # 我能以什么身份执行哪些命令（排障第一步）
sudo cmd                      # 以 root 执行
sudo -u appuser cmd           # 以指定用户执行
sudo -i                       # 切换到 root 的登录 shell，加载 root 的环境
sudo -s                       # 切换 shell，但保留当前环境变量
sudo bash                     # 只拿到一个 root shell，不加载配置
```

`sudo -i` 与 `sudo -s` 的区别在"环境变量有没有跟着变"，很多"sudo 之后命令找不到"的问题就来自这里。

授权规则写在一个固定格式里：`用户 主机=(可切换的身份) 是否需要密码: 可执行的命令`。用 `visudo` 编辑（会做语法检查，直接改文件一旦写错会锁死 sudo）。

```Bash
# /etc/sudoers.d/deploy
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp
%devops ALL=(ALL) ALL
user01 localhost=(root) NOPASSWD: /usr/bin/passwd, !/usr/bin/passwd root
```

- 用**完整绝对路径**授权，`/usr/bin/systemctl restart myapp` 这种粒度才是安全的。
- 命令前的 `!` 表示禁止，用于精确排除。
- `NOPASSWD` 一旦放开给 `ALL`，等价于给了完整的 root 权限，只适合容器或一次性环境。
- 用 `Cmd_Alias`、`User_Alias` 做分组，适合规则变多以后，规则少时不必引入。

---

## 四、进程、端口与磁盘排查

这一章覆盖线上最常被叫去处理的四类现象：**谁在吃 CPU/内存、端口被谁占了、进程杀不掉、磁盘满了**。

### 进程视图：`ps` 与 `top` 该看哪几列

```Bash
ps -ef                      # 全部进程，UNIX 风格：UID PID PPID C STIME TTY TIME CMD
ps aux                      # BSD 风格，多出 %CPU %MEM RSS VSZ
ps -ef --forest             # 树状展示父子关系
ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%mem | head    # 按内存排序取前几名
```

几个列比其余重要得多：

| 列 | 含义与用法 |
|---|---|
| `PPID` | 父进程。判断"是谁拉起的"，也能发现被守护进程反复重启 |
| `STAT` | 状态码：`R` 运行、`S` 可中断睡眠、`D` 不可中断睡眠、`Z` 僵尸、`T` 停止 |
| `RSS` | 实际占用的物理内存，判断内存占用的看这个，不是 `VSZ` |
| `TIME` | 累计占用 CPU 的时间，不是运行时长；运行时长看 `etime` |

`STAT` 里最常见的排障信号是 `D`（不可中断睡眠，通常在等 IO）和 `Z`（僵尸）。`D` 状态的进程**连 `kill -9` 都杀不掉**，因为它不响应信号，只能等 IO 完成或重启系统，所以先查它在等什么 IO 才有意义。

```Bash
pgrep -af java                  # 按名字找进程，-a 显示完整命令行
pgrep -f 'app.jar'              # -f 匹配完整命令行，能精确定位 java 应用
pkill -f 'app.jar'              # 按命令行杀
pstree -p <pid>                 # 看进程树
```

`pkill -f` 的匹配范围很宽，可能在杀掉目标的同时命中自己的 shell 或同名的其他进程，**先 `pgrep -af` 确认匹配集，再执行 `pkill`**。

`top` 里优先看三处：第一行 `load average`、`%Cpu(s)` 里的 `wa`、按 `M`/`P` 排序后的 `RES`。

- `load average` 要和 `nproc` 一起看：4 核机器上 load 5 已经超载，32 核机器上 load 5 很闲。
- `wa` 高说明 CPU 在等 IO，瓶颈大概率在磁盘或网络，不在 CPU。
- `RES` 才是进程真实占用的物理内存。

### 信号与终止进程：为什么先 `TERM` 后 `KILL`

| 信号 | 编号 | 用途 |
|---|---|---|
| `SIGHUP` | 1 | 终端断开；很多守护进程用它表示"重载配置" |
| `SIGINT` | 2 | `Ctrl+C`，中断 |
| `SIGQUIT` | 3 | `Ctrl+\`，退出并产生 core |
| `SIGKILL` | 9 | 强制杀死，**不可被捕获、不可被忽略** |
| `SIGUSR1/2` | 10/12 | 用户自定义，`SIGUSR1` 常用于"重新打开日志文件" |
| `SIGTERM` | 15 | 请求终止，可以被捕获 |
| `SIGSTOP`/`SIGCONT` | 19/18 | 暂停/继续 |
| `SIGCHLD` | 17 | 子进程状态变化，父进程据此回收 |

```Bash
kill -l                  # 列出全部信号名与编号
kill <pid>               # 默认发 SIGTERM
kill -15 <pid>           # 明确写出来，便于 review
kill -HUP <pid>          # 让服务重载配置
kill -9 <pid>            # 最后手段
kill -0 <pid>            # 不发送信号，只检查进程是否存在（看退出码）
killall -u appuser       # 按用户名杀
```

**先 `TERM` 后 `KILL` 的理由**：`TERM` 能让程序走完关闭流程——刷缓冲、写完日志、关闭连接、释放锁；`KILL` 直接由内核回收，进程没有任何机会清理，可能留下半写文件、未释放的锁和损坏的本地状态。只有在 `TERM` 被忽略或进程卡死时才升级到 `KILL`。

进程"杀不掉"的三种真实原因：

1. **`D` 状态**：在等不可中断的 IO，信号要等系统调用返回才处理。查它等什么：`cat /proc/<pid>/stack`（需 root）、`iostat -x 1`、`dmesg`。
2. **僵尸进程**：进程其实已经死了，只剩一条表项，`kill` 自然无效。真正要做的是处理它的父进程（回收子进程），而不是杀僵尸本身。
3. **被守护进程反复拉起**：杀完立刻出现新 PID，说明有 systemd/supervisor 在重启它。正确做法是停掉服务：`systemctl stop xxx`，或先看 `ps -o ppid= -p <pid>` 找到拉起者。

### 前后台与长任务：`nohup`、`disown` 与 `setsid`

```Bash
./run.sh &               # 放到后台
jobs                     # 列出当前 shell 的作业
fg %1                    # 把 1 号作业调回前台
bg %1                    # 让暂停的作业继续在后台跑
Ctrl+Z  ->  bg           # 忘了加 & 时的补救流程
```

`Ctrl+C` 发 `SIGINT` 终止前台进程，`Ctrl+Z` 发 `SIGTSTP` 只是暂停。但**用 `&` 放到后台的进程仍属于当前会话**，退出终端时会收到 `SIGHUP` 而被终止，所以长任务必须再加一层：

```Bash
nohup ./run.sh > run.log 2>&1 &     # 忽略 SIGHUP，并把输出落盘
disown %1                           # 已经从 & 启动的作业，用 disown 摘出作业表
setsid ./run.sh > run.log 2>&1 &    # 新会话，彻底脱离终端
```

`nohup` 场景下**重定向不能省**：不写 `> run.log 2>&1`，输出会进 `nohup.out` 或直接丢弃，事后无从排查。要长期稳定的服务，应该交给 systemd 而不是 `nohup`（见第六章）。

### 端口占用：`ss` 与 `lsof` 的排查顺序

现象是"服务起不来，提示 `Address already in use`"或"端口通了但响应不对"。

```Bash
ss -lntp                       # 监听中的 TCP，带进程信息
ss -lnup                       # 监听中的 UDP
ss -tanp                       # 所有 TCP 连接
ss -lntp 'sport = :8080'       # 只看指定端口
```

`-p` 显示进程信息需要权限，非本用户的进程要用 sudo。`netstat` 已基本被 `ss` 取代（更快，且 `netstat` 在多数新发行版里需要额外安装），旧文档里的 `netstat -tunlp` 语义上对应 `ss -lntup`。

```Bash
lsof -i :8080                  # 谁占用了 8080
lsof -p <pid>                  # 这个进程打开了哪些文件
lsof -i -a -u appuser          # 某用户的网络连接
```

完整排查路径：`ss -lntp` 找到 PID → `ps -fp <pid>` 确认是不是预期进程 → 是旧实例就 `kill` 或 `systemctl stop`，是别的服务就改端口或先解决冲突。

验证服务是否真的可用，不要只看端口在听：

```Bash
curl -I http://127.0.0.1:8080/          # 看状态码和头
curl -v http://127.0.0.1:8080/ 2>&1     # 看完整握手与请求过程
curl -f -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/health
```

网络层的其他工具按需使用：`dig`/`host` 查 DNS 解析、`ping`/`traceroute`/`mtr` 查连通性与路径、`curl -I` 区分"网络不通"和"服务返回错误"。

### 磁盘与 inode：空间去哪了

```Bash
df -h                          # 各挂载点使用率
df -i                          # inode 使用率
df -h /data                    # 只看某个挂载点
```

`df -h` 显示还有空间却报 `No space left on device`，八成是 **inode 用尽**：inode 数量在格式化时就确定了，大量小文件（会话文件、缓存碎片、maildir）会先耗尽 inode 而不是字节数。`df -i` 的 `IUse%` 到 100% 就是这个原因。

定位"是谁占了空间"，自顶向下逐层缩：

```Bash
du -sh /data/* | sort -rh | head -20          # 第一层谁最大
du -xh --max-depth=1 / | sort -rh             # 从根开始逐层看，-x 不跨文件系统
du -sh ./*/ | sort -rh                        # 只看子目录
```

`du -sh *` **不包含隐藏文件**，怀疑有 `.cache` 之类时用 `du -sh .[!.]* *` 或 `ls -la` 先确认。

如果 `du` 统计出来的总和对不上 `df` 的使用量，最常见的原因是**文件已被删除但进程仍持有它**：

```Bash
lsof +L1                       # 链接数为 0 但仍被打开的文件
lsof | grep -i deleted         # 等价的另一条路径
```

对于这类文件，`rm` 只是去掉了目录项，磁盘块要等句柄关闭才释放。处理方式是**重启持有它的进程**，或在不重启的前提下清空内容：

```Bash
: > /proc/<pid>/fd/<n>         # 谨慎使用，适用于日志类文件
```

定位单个大文件：

```Bash
find / -xdev -type f -size +1G -exec ls -lh {} + 2>/dev/null
```

挂载相关：

```Bash
lsblk                          # 块设备与挂载点树状图
findmnt                        # 当前挂载情况
mount /dev/sdb1 /data
umount /data                   # 提示 target is busy 时，先用 lsof/fuser 找占用者
fuser -mv /data                # 谁在用这个挂载点
```

`umount` 报 `busy` 时不要用 `-l`（lazy）硬绕，先查清是谁还在里面，否则数据可能丢失。开机自动挂载写在 `/etc/fstab`，改错会导致系统起不来，编辑前先备份，并用 `mount -a` 验证。**改动过的机器上如果 `/` 突然变只读，先看 `mount | grep ' ro '` 和 `dmesg`（常见原因是文件系统错误触发了 remount-ro）。**

### 内存与负载：`free`、`uptime` 与 OOM

```Bash
free -h
uptime                         # load average: 1 分钟 / 5 分钟 / 15 分钟
vmstat 1 5                     # 每秒采样，看 r（运行队列）、si/so（换页）、wa
```

`free -h` 里三列容易看错：

| 列 | 含义 |
|---|---|
| `free` | 完全空闲的内存，通常很小，**不代表内存不足** |
| `buff/cache` | 内核用于缓存磁盘数据的内存，可被随时回收 |
| `available` | 新程序真正可以拿到的内存估算，**判断内存是否紧张看这一列** |

内存耗尽的现场在 dmesg 里：

```Bash
dmesg -T | grep -iE 'oom|killed process'     # -T 显示可读时间
```

OOM killer 会选择评分最高的进程杀掉，日志里会明确写出 `Killed process <pid> (<name>)`。排查方向通常是：容器/进程的内存 limit 设置过小、堆外内存与缓存未计入、或是内存泄漏（配合 `ps -eo pid,rss,etime --sort=-rss` 观察 RSS 随时间单调上涨的进程）。

---

## 五、环境变量、远程连接与终端复用

### shell 启动文件：变量为什么没生效

"我明明写进配置文件了，为什么还是找不到命令"——绝大多数是这个加载顺序问题。bash 分两类启动方式：

| 启动方式 | 读取的文件（按顺序） |
|---|---|
| 登录 shell（`ssh` 登录、`su -`、`bash -l`） | `/etc/profile` → `~/.bash_profile` → `~/.bash_login` → `~/.profile`（三者取第一个存在的） |
| 交互式非登录 shell（打开新终端标签、`bash`） | `/etc/bash.bashrc` → `~/.bashrc` |
| 非交互式（脚本、cron） | 不读上述文件，只读 `$BASH_ENV` 指定的文件 |

关键点：

- `~/.bash_profile` 与 `~/.bashrc` 是**两个不同的入口**，登录时只读前者。Debian/Ubuntu 的 `~/.profile` 里通常有一句 source `~/.bashrc`，而 RHEL 系默认没有，所以在 RHEL 上把 PATH 写进 `~/.bashrc` 会发现登录后不生效。
- 环境变量要用 `export` 才会传给子进程；`var=value` 只是当前 shell 的普通变量，子进程看不到。
- `source file` 是在**当前 shell** 里执行，能影响当前环境；`bash file` / `./file` 是开子进程执行，里面的 `export`、`cd` 都不会留下。

```Bash
export PATH="$PATH:/opt/myapp/bin"        # 追加而不是覆盖，覆盖会救不回来
export JAVA_HOME=/usr/lib/jvm/java-17
source ~/.bashrc                          # 让当前会话立即生效
```

排查顺序：

```Bash
echo $SHELL                     # 现在用的是不是 bash
echo $0; shopt -q login_shell && echo login || echo non-login
bash -l -c 'echo $PATH'         # 用登录 shell 复现一次，判断配置文件到底有没有被读
env | sort                      # 实际生效的环境变量
```

`set` 用来改变 shell 自身行为，脚本里最实用的三个：

```Bash
set -euo pipefail
# -e 任一命令失败即退出；-u 使用未定义变量报错；-o pipefail 管道任一环节失败即失败
```

`set VAR=value` 不会设置环境变量，也不要指望它导出；要导出就用 `export`（`declare -x` 等价，但 `export` 可读性更好）。

### ssh 密钥登录与连不上排查

```Bash
ssh-keygen -t ed25519 -C 'dujiakang@szvt.com'          # 首选的现代算法
ssh-keygen -t rsa -b 4096 -f ~/.ssh/zdlt_test          # 需要兼容老服务端时用 rsa
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

密钥登录失败的三个最常见原因，按概率排：

1. **权限过宽**。`~/.ssh` 必须 700，`authorized_keys` 必须 600，且家目录不能对组或其他用户可写。sshd 的 `StrictModes` 会直接忽略这样的密钥，日志里只说"没有可用密钥"，很容易误判成密钥内容错。
2. **公钥放错位置**。服务端要放到目标用户的 `~/.ssh/authorized_keys`，不是自己的机器。
3. **`known_hosts` 记录过期**。重装或换 IP 后会报 `REMOTE HOST IDENTIFICATION HAS CHANGED`：

```Bash
ssh-keygen -R server          # 删掉旧记录再连
```

连不上的排查主力是 `-v`，它会打印每一步协商结果：

```Bash
ssh -v user@server            # 第一层
ssh -vvv user@server          # 还没定位到就用三层
```

看到 `Offering public key` 之后立刻 `Authentication failed`，就回到权限检查；卡在 `Connecting to` 则是网络或端口问题，此时用 `ssh -p 2222 -o ConnectTimeout=5` 缩小范围。

`~/.ssh/config` 能把长命令变成别名，日常效率提升最明显：

```Plain Text
Host prod
    HostName 10.0.0.12
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_prod
    ServerAliveInterval 60        # 防 NAT/防火墙掐断空闲连接
    StrictHostKeyChecking accept-new
```

之后 `ssh prod`、`scp prod:/var/log/app.log .` 都能直接用这个别名。

SSH 隧道在排查"服务只在机器内网可见"时非常有用：

```Bash
ssh -L 8080:127.0.0.1:8080 prod          # 本地 8080 → 远端 8080
ssh -L 3306:db.internal:3306 prod        # 通过跳板机访问内网数据库
ssh -R 9000:127.0.0.1:3000 prod          # 反向：远端 9000 → 本地 3000
```

### 传输文件：`scp` 与 `rsync` 的选择

```Bash
scp file user@server:/path/                # 上传文件
scp -r dir user@server:/path/              # 上传目录
scp user@server:/path/file .               # 下载到当前目录
scp -r user@server:/var/www/remote_dir/ /tmp/
scp -P 2222 file user@server:/path/        # 注意端口是大写 -P
```

`scp` 简单但不支持增量。反复同步目录、传大量小文件或需要断点续传时用 `rsync`：

```Bash
rsync -avz --progress src/ user@server:/data/src/       # 增量同步
rsync -avz --delete src/ user@server:/data/src/         # 让目标与源完全一致（危险）
rsync -avz --exclude='.git' --exclude='node_modules' src/ user@server:/data/src/
rsync -avz --partial --append-verify big.iso user@server:/data/
```

**结尾斜杠的语义必须记牢**：

```Bash
rsync -a src/ /dst/     # 把 src 的"内容"同步到 /dst
rsync -a src  /dst/     # 在 /dst 下创建 src 目录
```

`--delete` 会删除目标端多余的文件，方向写反就是生产事故，执行前先加 `-n`（dry-run）看一遍。

### 下载与接口探活：`wget` 与 `curl`

```Bash
wget https://example.com/pkg.tar.gz
wget -c https://example.com/big.iso        # 断点续传
wget -O newname.tar.gz https://example.com/download?id=123   # 指定文件名
wget -r -np -k https://example.com/docs/   # 递归下载站点
```

`curl` 更偏向"调试 HTTP"：

```Bash
curl -I https://example.com                      # 只看响应头
curl -L -o pkg.tar.gz https://example.com/pkg    # 跟随重定向并保存
curl -s -S https://api.example.com/health        # -s 静默 -S 保留错误
curl -v https://example.com                      # 完整请求/响应过程
curl -X POST -H 'Content-Type: application/json' -d '{"a":1}' https://api/x
curl -b cookies.txt -c cookies.txt https://example.com/login
curl --resolve api.example.com:443:10.0.0.12 https://api.example.com/   # 不改 hosts 做验证
curl -k https://self-signed.local                 # 跳过证书校验，仅临时使用
```

两个必须记住的边界：

- **不要 `curl ... | bash`**。执行前至少 `curl -o /tmp/x.sh` 然后读一遍，线上环境更是如此。
- 遇到证书错误，先查**本机时间**和 CA 证书包（`date`、`ls /etc/ssl/certs`）而不是直接上 `-k`。系统时间跳变导致证书校验失败是很常见的一类"灵异问题"。

### tmux：SSH 断线后任务不中断

`nohup` 只能保住进程，看不到输出、不能中途交互。`tmux` 解决的是同一个问题但保留完整终端：**会话独立于 SSH 连接存在，断开后重新连上还能回到原样**。

```Bash
tmux new -s work          # 新建命名会话
tmux ls                   # 列出会话
tmux attach -t work       # 重新进入（断线后就是这一步）
tmux kill-session -t work
```

前缀键是 `Ctrl+b`，下面这些够覆盖绝大多数使用：

| 操作 | 快捷键 |
|---|---|
| 脱离会话（保持后台运行） | `Ctrl+b` 然后 `d` |
| 垂直 / 水平分屏 | `Ctrl+b` `%` / `Ctrl+b` `"` |
| 在窗格间切换 | `Ctrl+b` 方向键 |
| 关闭当前窗格 | `Ctrl+b` `x` |
| 当前窗格最大化切换 | `Ctrl+b` `z` |
| 新建 / 切换窗口 | `Ctrl+b` `c` / `Ctrl+b` 数字 |
| 重命名窗口 | `Ctrl+b` `,` |

典型用法是**一条命令长期跑、同时看日志**：一个窗格跑构建或压测命令，另一个窗格 `tail -F app.log`，然后 `Ctrl+b d` 脱离，下班或断线后 `tmux attach -t work` 回到现场。

`~/.tmux.conf` 里几行就让默认配置顺手很多：

```Plain Text
set -g mouse on
set -g history-limit 50000
set -g base-index 1
setw -g pane-base-index 1
```

长任务托管方式的取舍：

| 方式 | 适用 | 代价 |
|---|---|---|
| `nohup ... &` | 一次性、不需要回看输出 | 无交互，输出只能翻日志文件 |
| `tmux` | 人工执行、需要回看现场 | 依赖会话，重启机器不保留 |
| `systemd` | 需要长期运行、开机自启、崩溃自动重启 | 需要写 unit 文件 |

---

## 六、软件包、定时任务与服务管理

### 判断软件从哪来：`which` 与包归属反查

卸载或升级之前，先弄清它是怎么装进来的：

```Bash
which -a nginx                  # 所有同名可执行文件的位置
type -a nginx
rpm -qf $(which nginx)          # RHEL 系：这个文件属于哪个包
dpkg -S $(which nginx)          # Debian 系
readlink -f $(which python3)    # 顺着软链接看真实路径
```

路径与安装方式的对应关系：

| 路径 | 通常来源 |
|---|---|
| `/usr/bin`、`/usr/sbin` | 发行版包管理器 |
| `/usr/local/bin`、`/usr/local/sbin` | 源码编译安装（`--prefix=/usr/local`） |
| `/opt/<name>` | 第三方整包安装 |
| `~/.local/bin` | 用户级 pip/pipx 之类 |
| `~/miniconda3/bin`、`~/.nvm/...` | 版本管理工具 |

### 包管理器：`yum`/`dnf` 与 `apt` 的对应用法

RHEL 系用 `yum`/`dnf`（CentOS 8+、RHEL 8+ 已由 `dnf` 取代 `yum`，命令语法兼容），Debian 系用 `apt`。

| 目的 | `dnf` / `yum` | `apt` |
|---|---|---|
| 刷新索引 | `dnf makecache` | `apt update` |
| 搜索 | `dnf search <kw>` | `apt search <kw>` |
| 查看包信息 | `dnf info <pkg>` | `apt show <pkg>` |
| 已安装列表 | `dnf list installed` | `apt list --installed` |
| 文件属于哪个包 | `dnf provides <file>` | `apt-file search <file>` |
| 安装 | `dnf install <pkg>` | `apt install <pkg>` |
| 升级单个 | `dnf update <pkg>` | `apt install --only-upgrade <pkg>` |
| 升级全部 | `dnf update` | `apt upgrade` |
| 卸载 | `dnf remove <pkg>` | `apt remove <pkg>` |
| 清缓存 | `dnf clean all` | `apt clean` |

几个容易混的点：

- `apt update` 只是**刷新索引**，不升级任何软件；`apt upgrade` 才是升级。把前者当后者用是典型误读。
- `apt remove` 保留配置，`apt purge` 连配置一起删。
- `dnf` 有事务历史，可以回滚，这在"升级把环境搞坏了"时很有用：

```Bash
dnf history list
dnf history info <id>
dnf history undo <id>      # 撤销某次事务（慎用，可能连带影响后续操作）
```

本地下载的包直接安装：

```Bash
dnf install ./pkg.rpm       # 会自动解析依赖，比 rpm -i 好
rpm -ivh pkg.rpm            # 不解析依赖
apt install ./pkg.deb
```

RPM 的查询能力在排查时很有用：

```Bash
rpm -qa | grep <kw>         # 已安装的包
rpm -ql <pkg>               # 这个包装了哪些文件
rpm -qf /usr/bin/xxx        # 这个文件属于哪个包
rpm -qp --scripts pkg.rpm   # 安装前后会执行什么脚本
```

### 源码安装与手工卸载

源码安装的标准三步：

```Bash
./configure --prefix=/usr/local/myapp
make -j"$(nproc)"
sudo make install
```

几点经验：

- **`--prefix` 显式指定**，别用默认值，否则文件散落到 `/usr/local` 各处，卸载时找不到边界。
- `make -j$(nproc)` 并行编译，大项目差距明显。
- 保留源码目录和 `config.status`，之后可以用 `make uninstall` 卸载（作者写了这条规则才行）。
- 安装完要让系统找到它：可执行文件加 `PATH`，库文件要么进 `/usr/local/lib` 后执行 `sudo ldconfig`，要么用 `LD_LIBRARY_PATH`（后者只影响当前会话，不要写进全局配置）。

源码装的软件**没有包管理器记录，包管理器也卸不掉它**，只能手工清理。判断方式：

```Bash
$ which myapp
/usr/local/bin/myapp        # /usr/local 或 /opt → 源码安装
/usr/bin/myapp              # /usr/bin → 包管理器安装
```

手工卸载的顺序是先确认安装清单，再逐项删除，最后验证：

```Bash
# 1. 先看它到底装了哪些文件（安装目录里的 install_manifest.txt 是最好的依据）
cat build/install_manifest.txt

# 2. 按目录逐个确认后再删，不要凭印象一次 rm -rf 一串
sudo rm -rf /usr/local/myapp
rm -f /usr/local/bin/myapp /usr/local/lib/libmyapp.so
sudo rm -f /etc/myapp.conf
sudo rm -rf /var/lib/myapp

# 3. 检查启动文件里有没有残留的 PATH/LD_LIBRARY_PATH
grep -n myapp ~/.bashrc ~/.bash_profile /etc/profile /etc/profile.d/*.sh 2>/dev/null

# 4. 让动态链接器刷新缓存，并验证
sudo ldconfig
which -a myapp
ldd $(which myapp) 2>/dev/null
```

**卸载的前提是"知道装了哪些文件"**。所以安装时把 `install_manifest.txt` 或 `make install` 的输出留档，比事后凭记忆找文件可靠得多。包管理器安装的软件则只需一条 `dnf remove <pkg>` / `apt purge <pkg>`，不要手工删 `/usr/bin` 下的文件——那会让包数据库与实际文件不一致，之后安装同一个包会报冲突。

### cron：定时任务不执行怎么查

```Bash
crontab -l                  # 看当前用户的任务
crontab -e                  # 编辑（保存即生效）
crontab -r                  # 删除全部任务，无确认，误敲风险极高
```

时间字段是"分 时 日 月 周"，后面接命令：

```Plain Text
* * * * * command               # 每分钟
30 21 * * * /opt/app/restart.sh # 每天 21:30
10 1 * * 6,0 /opt/app/sync.sh   # 每周六、周日 01:10
*/5 * * * * /opt/app/poll.sh    # 每 5 分钟
0 3 1 * * /opt/app/monthly.sh   # 每月 1 号 03:00
@reboot /opt/app/start.sh       # 开机执行
```

特殊符号：`*` 任意值、`,` 列表、`-` 区间、`/` 步长。`@daily`、`@hourly`、`@reboot` 是便捷写法。

**cron 不执行几乎都是环境问题**，因为它的运行环境比交互 shell 干净得多：

| 现象 | 原因 | 处理 |
|---|---|---|
| 手工能跑，cron 里失败 | `PATH` 只有 `/usr/bin:/bin` | 命令写绝对路径；或在 crontab 顶部设 `PATH=` |
| 提示找不到 java/python | 依赖登录 shell 的环境变量 | 在 crontab 里显式 `export JAVA_HOME`，或写一个加载环境后再执行的包装脚本 |
| `~` 没有展开成家目录 | cron 不经过 shell 展开 | 写绝对路径 |
| 命令里的日期参数异常 | `%` 在 crontab 里表示换行，必须转义 | 写成 `\%` |
| 完全没痕迹 | 输出被丢弃且没有 MTA 投递 | 追加 `>> /var/log/myjob.log 2>&1` |

```Plain Text
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
*/5 * * * * /opt/app/poll.sh >> /var/log/poll.log 2>&1
```

**重定向不能省**，这是排查定时任务的第一手段：没有它，任务失败时你连报错都看不到。

日志位置按发行版不同：Debian/Ubuntu 在 `/var/log/syslog`（`grep CRON /var/log/syslog`），RHEL 系在 `/var/log/cron`，用 systemd 的机器还可以：

```Bash
journalctl -u cron --since '1 hour ago'     # RHEL 系的服务名是 crond
```

同一个任务被 `crontab -e` 和 `/etc/cron.d/` 同时定义了两次，会出现"任务跑两遍"，这是常被忽略的一类重复。

### systemd 与 journalctl：服务在跑吗、为什么挂了

`systemctl` 管服务生命周期，`journalctl` 看它的日志，这两个配合是排查服务问题的标准入口。

```Bash
systemctl status myapp            # 状态 + 最近日志 + 退出码，第一步就看它
systemctl start myapp
systemctl stop myapp
systemctl restart myapp
systemctl reload myapp            # 重载配置，不重启进程
systemctl enable myapp            # 开机自启（不含"现在启动"）
systemctl enable --now myapp      # 自启 + 立即启动
systemctl disable myapp
systemctl list-units --failed     # 当前所有失败的服务
systemctl daemon-reload           # 改了 unit 文件后必须执行
```

一个最小可用的 unit 文件，放在 `/etc/systemd/system/myapp.service`：

```Plain Text
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/app
Environment=PORT=8080
ExecStart=/opt/app/bin/server --config /opt/app/conf/app.yml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

几个决定排障难易度的字段：

- `User=` 决定服务以什么身份运行，权限问题往往出在这里而不是文件权限本身。
- `Environment=` / `EnvironmentFile=` 是服务拿环境变量的正路，比在脚本里 `source ~/.bashrc` 可靠（systemd 不读用户的 shell 配置）。
- `Restart=on-failure` + `RestartSec` 是自动拉起，但**配置错误导致的崩溃重启会形成循环**，表现就是"进程杀完又出现"。

```Bash
journalctl -u myapp                  # 该服务的日志
journalctl -u myapp -f               # 实时跟踪
journalctl -u myapp --since '30 min ago'
journalctl -u myapp -p err           # 只看 error 及以上
journalctl -b                        # 本次开机以来
journalctl -xe                       # 最近的错误与提示，定位启动失败常用
journalctl --disk-usage              # 日志占用
journalctl --vacuum-time=7d          # 只保留 7 天
```

两个高频事故：

1. **改了 unit 文件不执行 `daemon-reload`**，`systemctl restart` 用的还是旧配置，现象是"改了没用"。
2. **`enable` 不等于"现在启动"**，`start` 也不等于"开机自启"。`.service` 必须同时 `enable` 和 `start`（或 `enable --now`）。

---

## 附：排障路径速查

现象 → 第一条命令 → 下一条，把上面的内容压成一张表。左侧是现象，中间是先敲什么，右侧是敲完之后大概率要做什么。

| 现象 | 第一条命令 | 之后 |
|---|---|---|
| 磁盘满 / 写不进去 | `df -h`；`df -i` | `du -xh --max-depth=1 / \| sort -rh`；inode 满则找小文件，字节满是 `lsof +L1` 查已删除但被占用的句柄 |
| 端口被占用 | `ss -lntp` | `ps -fp <pid>` 确认后 `systemctl stop` 或 `kill` |
| 服务起不来 | `systemctl status <svc>`；`journalctl -u <svc> -xe` | 看退出码与 `User=`/`WorkingDirectory=` 是否正确，改完 `daemon-reload` 再重启 |
| Permission denied | `id`；`namei -l <path>` | 补目录 `x` 位或改属主；再排 `chattr +i`、只读挂载、SELinux |
| 命令找不到 | `which -a <cmd>`；`echo $PATH` | 补 `PATH` 并确认写在登录 shell 会读的文件里 |
| 进程杀不掉 | `ps -o pid,ppid,stat,cmd -p <pid>` | `D` 状态查 IO（`iostat`/`dmesg`），`Z` 状态处理父进程，被反复拉起则停 systemd 服务 |
| 内存告急 | `free -h` 看 `available` | `ps -eo pid,rss,etime --sort=-rss \| head`；`dmesg -T \| grep -i oom` |
| 负载高但 CPU 不高 | `uptime`；`nproc`；`vmstat 1` | `wa` 高查磁盘/网络 IO，`r` 高查计算密集进程 |
| 定时任务没跑 | `crontab -l`；`grep CRON /var/log/syslog` | 改绝对路径、显式设置环境变量、给命令加 `>> log 2>&1` |
| ssh 连不上 | `ssh -vvv user@host` | 卡在连接→查网络/端口/防火墙；认证失败→查 `~/.ssh` 权限与 `authorized_keys` |
| 接口不通 | `curl -v http://host:port/health` | 先确认端口在听（`ss -lntp`），再区分 DNS、网络与服务自身返回 |
