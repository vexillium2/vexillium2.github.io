---
lang: zh-CH
title: Java 学习笔记
description: 从语法到JVM到设计模式，我的Java开发手册
---
# Linux学习笔记

## 一、从基础命令到实战命令

参考github仓库 [the-art-of-command-line](https://github.com/jlevy/the-art-of-command-line)

### 路径查看 dir ls find which pwd tree



```Bash
ls -l a.txt b.c #列出a, b的详细信息  
drwxrwxr-x 3 USER2022102157 USER2022102157  4096 Mar 16 16:52 test-dir
目录可读可写可执行（所有者，同组用户，其他用户） 链接数（其中一个是目录本身）所有者 所属组 日期 
ls //列出当前目录下的所有文件
ls -R #递归列出整个目录里的
```



[Linux中find命令用法全汇总，看完就没有不会用的！\-腾讯云开发者社区\-腾讯云 \(](https://cloud.tencent.com/developer/article/1348438)[tencent\.com](https://cloud.tencent.com/developer/article/1348438)[\)](https://cloud.tencent.com/developer/article/1348438)



```Bash
一定要加-name -empty -size
find -iname "MyCProgram.c"
# 使用了 -iname 选项，该选项表示不区分大小写查找，因此可以找到
sudo  find / -name passwd
# 使用 sudo 提升权限，在整个文件系统中查找名为 passwd 的文件
sudo find  / -maxdepth 2 -name passwd
# 限制了搜索深度为 2，只在根目录下的直接子目录中查找名为 passwd 的文件
sudo find  / -maxdepth 3 -name passwd
sudo find  /  -mindepth 3 -maxdepth 5 -name passwd
# 搜索深度为 3到 5
find  -empty
# 查找当前目录及其子目录中的空文件和空目录
find . -maxdepth 1 -empty -not -name ".*"
# 查找当前目录下的空文件和空目录，但排除了以 . 开头的隐藏文件和目录
find . -type f -exec ls -s {} \; | sort -n -r | head -2
# 查找当前目录及其子目录中的所有文件，并按文件大小排序，列出最大的两个文件
find . -type f -exec ls -s {} \; | sort -n  | head -2
# 没有使用 -r 选项，因此列出的是最小的两个文件
find . -type d
# 查找当前目录及其子目录中的所有目录

which用于找command的绝对路径
```



### 操作文件 cd rm cp dd mkdir rmdir



```Bash
cd ./
cd ../
cd cd ~

注意：cp mv会识别文件还是文件夹来看是路径名还是重命名
cp *.* ./test-dir //当前目录所有文件复制到./test-dir
cp -v

复制文件并对原文件的内容进行转换和格式化处理
dd

mv file3 file4 //重命名
mv dir10 dir11 
mv /home/file3 /tmp/file5 //移动
mv dir10 /tmp 

rm -f    强制删除文件或目录
rm *fi
rm -r    递归处理，将指定目录下的所有文件与子目录一并处理；

mkdir -p
```



#### 如何删除下载的软件？



下载的软件一般分为包管理器下载和源码下载两种方法，我们可以通过`Which`来判断，如果输出的是 `/usr/local/...` 说明是源码编译安装，如果是 `/usr/bin/                        ...` 、 `/usr/lib64/...` 可能是通过包管理器安装的。



##### 卸载源码安装的软件



先找到安装路径，使用管理员权限递归强制删除，并检查 `/usr/lib/` 是否有软链接



```Bash
# 示例
sudo rm -rf /usr/lib/xxx
sudo rm -rf /usr/local/xxx
sudo rm -rf /usr/bin/xxx
sudo rm -rf /usr/lib64/xxx*
sudo rm -rf /etc/xxx
sudo rm -rf /var/lib/xxx
```



记得在环境变量 `~/.bashrc` 和 `~/.bash_profile` 中查找是否有相关路径，删除后刷新一下`source ~/.bashrc`



最后使用 `which` 来确认是否删除，也可以用软件指令来检查



##### 包管理器卸载



非常简单，使用 `sudo yum remove xxx` 即可







### 查看文本 cat less more wc tail head



cat \(catenate\)创建、打开、连接文件



#### cat常用命令

less 允许用户逐页浏览文件内容，而不是一次性加载整个文件到内存中。适合用于查看大型文件。



```Bash
cat hello.c //输出hello.c的内容到终端
less document
cat hello.txt | less
```



`wc`统计文件的字节数、字数、行数



```Bash
wc [options] 
-c 显示字节数
-m 显示字符数
-l 显示行数
-w 显示字数
-L 打印最长行的长度
```



```Bash
tail -n 5 .profile # 输出profile 文件的最后5行内容
```



### 传输文本 echo



```Bash
echo $$                 # 返回正在执行进程的返回状态
echo $?                 # 打印上一个命令的退出状态码，如果命令执行成功则返回0，否则返回其他值。
echo $LOGNAME        # 当前登录用户

echo  “hello , test file “  >  test.txt //打印到test。

b=1
```



### 编辑文本 vi vim nano



```Bash

```



### \. 进制 xxd od



```Bash
xxd 十六进制
od  二进制
```



### 设置变量 env export declare set source



有时希望将部分变量设置为shell会话的环境变量，好在多个程序或会话中共享使用。



全局环境变量通常在 `/etc/profile` 、 `/etc/environment` 或 `/etc/profile.d/` 下的脚本中定义。



局部环境变量包括shell进程的和用户个人的 `~./bashrc` 和 `~/.bash_profile` \.



---



`env` 用于查看所有环境变量，包括全局和当前可见的。



使用： `env | grep goo`  ，打印某个变量可以用`printenv PATH` 或者 `echo $PATH`



`export` 可为shell变量或函数设置导出属性，即设置为环境变量。



使用： 

```Bash
# 创建/修改并导出
export a b=3
# 删除导出属性
export -n a b
# 函数
function func_1(){ echo '123'; }
export -f func_1
export -fn func_1
```



`declare` 声明变量，默认导出为当前shell进程且不影响子进程，`local` 用法一样但是在函数内部用，等于b=3

```Bash
# 创建整型变量
declare -i b=5
# 显示属性，返回 declare -i b="5"。
declare -p b
# + 表示删除
decalre +i b
# -a 表示数组，但不能使用+a删除
declare -ar season=('Spring','Summer','Fall','Winter')
# 设置导出变量
declare -x b
# -l -u 强制转换值的英文大小写
# -r 表示只读属性 
```



`set`显示系统中已经存在的shell变量，以及设置shell变量的新变量值。

使用set更改shell特性时，符号"\+"和"\-"的作用分别是打开和关闭指定的模式。

set命令不能够定义新的shell变量。如果要定义新的变量，可以使用declare命令以`变量名=值`的格式进行定义即可。

```Bash
-a：标示已修改的变量，以供输出至环境变量。
set -a mylove                 #设置为环境变量
```



```Bash
#export初始化定义
export variable=“Hello World”


variable=“Hello” #后续可修改

#set用于查询所有变量
set #显示所有shell变量和函数
set - #清空所有
set VAR=value #设置一个名为 VAR 的环境变量，其值为 value
set | grep foo # 显示当前 shell 包含“foo”的所有变量和参
```



#### 如何配置环境变量？

临时设置，使用export语句

```Python
export PYTHONPATH="/home/jacob/Project/AGI/14_L2RAG"
```

如果是永久设置，在每次打开终端时都生效，比如安装程序语言等需要将 `bin` 设置到环境变量中，也就是系统的 PATH 路径中，需要将export命令添加到shell的启动文件`~/.bashrc`或`~/.bash_profile`。可以vim打开编辑，也可以使用重定向输出追加模式。

```Bash
echo 'export PATH=/usr/lib/lib/erlang/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```







`source`



```Bash
source ~/.bashrc
```



### 查看Linux信息 hostnamectl

`hostnamectl`可以用来查看Linux的发行版本信息

`cat /proc/version`

### 下载文件与网络通信 wget curl

> 关于下载软件或库，必须先参阅官方文档确定正确适配的版本方可下载
> 
> 



`wget`是一个非交互式的网络下载工具，用于下载单个文件，支持 HTTP、HTTPS 和 FTP 协议。

```Bash
wget https://dev.mysql.com/downloads/file/?id=542360
# -O <filename>：指定保存的文件名。如果你不指定，wget 会以 URL 中的文件名保存。
# -c：断点续传。当下载中断时，下次可以从上次中断的地方继续下载，非常实用。
# -r：递归下载。用于下载整个网站或目录。
# -b：后台下载。将下载任务放到后台运行，然后退出终端。
# -t <number>：设置重试次数。-t 0 表示无限重试。
# --no-check-certificate：不检查 HTTPS 证书。如果遇到 SSL/TLS 证书错误，可以使用这个选项。
```

`curl`侧重于通信，用于在服务器和客户端之间进行数据传输。它支持多种协议，包括 HTTP、HTTPS、FTP、FTPS、SCP、SFTP、LDAP、IMAP、POP3、SMTP、SMTPS 等。

1. 下载文件

```Bash
curl 
-A 代理头
-b
-I 发出head请求，打印服务器HTTP标头
-L 跟随服务器重定向
-o <filename> 或 --output <filename>
-s 不输出错误和进度信息    
-v 显示传输的详细信息，包括请求头、响应头、连接状态等。这对于调试网络问题非常有帮助。
```

2. 模拟http请求，进行网络调试，保存cookies

3. 

### 传输文件 ssh scp



ssh 



要从本地连接远程服务器，先在本机使用 `ssh-keygen` 生成专门的公钥私钥对，再将公钥复制到服务器。



```Bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/自定义密钥名称
# windows例子
ssh-keygen -t rsa -b 4096 -C "dujiakang@szvt.com" -f .ssh/zdlt_test

# 使用ssh将公钥复制到linux
ssh-copy-id username@your-linux-server-ip
ssh-copy-id -i .ssh\id_rsa.pub username@your-server-ip
```



scp向ssh服务器发送文件



```Bash
# 从服务器下载
scp username@servername:/path/filename /var/www/local_dir
# 从服务器下载整个目录
scp -r username@servername:/var/www/remote_dir/ /var/www/local_dir
# 上传本地文件到服务器
scp /path/filename username@servername:/path 
# 上传本地目录        
scp  -r local_dir username@servername:remote_dir
```



### 包管理器 rpm tar make

`rpm` 包：红帽子包管理器\(Redhat Package Manager\)是一个底层的软件包管理工具。它负责安装、卸载、查询和验证单个 RPM 文件。RPM把 Linux 组织成不到两千个包，类似windows的\.exe。

`srpm` 包：未编译过的 rpm 包，需要以 rpm 管理的方式编译，然后以 rpm 的安装方式安装。

`GPG-KEY` \(GNU Privacy Guard\)：一种公钥加密技术，用于验证软件包的完整性和来源。软件包的维护者会使用他们的私钥对软件包进行签名。在安装时，`yum` 会使用维护者发布的公钥来验证这个签名。如果验证成功，说明软件包在下载过程中没有被篡改，且确实来自可信的源。

```Bash
# -q 对已安装的包进行简单查询
rpm -q packagename（包的名称）
rpm -qi packagename 对已安装的包进行详细信息查询
rpm -ql packagename 查询已安装包中包含的文件
rpm -qa 显示已经安装的所有 rpm 包
rpm -qa | grep linux 显示已经安装的所有包含 linux 字段的

# -f：文件选项，用于查询指定文件所属的 RPM 软件包。
rpm包的安装
rpm -i packagename 安装包（在包所在的目录下）

# -v 显示安装过程的详细处理过程

# -h 显示安装包进度
rpm -e packagename 卸载已安装的 rpm

# 导入对应软件包的GPG公钥
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql
```

- tar 包

    压缩包，常见的有\.tar\.gz 和\.tar\.bz2，其中 gz 为使用 gzip 压缩的 tar 包，tar\.bz2 是以 bzip 压缩的 tar 包。

    ```Bash
    # .tar.gz .tgz 文件执行
    tar -xvzf softname.tar.gz
    tar -xvzf softname.tgz
    # -x 解压缩文件
    # -v 显示详细过程
    # -z 支持 gzip 压缩文件
    # -f 指定压缩文件
    
    tar -xvjf softname.tar.bz2
    # -j 支持 bzip2 压缩文件
    unzip -v softname.tar.zip
    # -v 解压文件
    # -d 指定解压缩目录
    ```

make

```Bash
# 执行配置、编译和安装命令
./configure 执行配置
make 编译
make install 安装
make clean 清理临时文件
make uninstall 包的卸载
```



### 程序下载 yum dnf apt 

`yum` 是 Red Hat 系列 Linux 发行版（如 CentOS, Fedora, RHEL）中使用的一个强大的**软件包管理器**。它的主要作用是**自动化软件包的安装、升级、移除以及依赖管理**。

`yum` 会缓存下载的 RPM 包和元数据。清理缓存可以释放磁盘空间，有时也能解决一些因缓存问题导致的操作失败。

`yum` 是在 `rpm` 软件包管理工具基础上提供了：自动依赖解析、网络仓库管理、远程软件包管理、软件包组管理、历史记录和回滚。

```Bash
# 模糊查询
yum search <keyword>
# 显示软件包的详细信息
yum info <package_name>、
# 列出所有已安装的软件包
yum list installed
# 列出所有可用的软件包
yum list available

# 安装软件包
yum install <package_name>
# 无视GPG KEY
sudo yum install mysql-server --nogpgcheck
# 升级软件包，不加名字默认升级所有已安装的
yum update <package_name>
# 移除软件包
yum remove <package_name>

# 清楚缓存
yum clean all
# 查看历史记录，可以重做和回滚（慎用）
yum history list
yum history info <id>
yum history undo <id>
yum history redo <id>
```

在较新的 Fedora 和 RHEL/CentOS 8\+ 版本中，`yum` 已经被 **`dnf`** \(Dandified YUM\) 取代。`dnf` 是 `yum` 的下一代版本，它在性能、依赖解析能力和用户体验方面都有所改进，并且保持了与 `yum` 相似的命令语法。



### 用户 sudo whoami who w 

#### 添加用户

1. 使用 `useradd` 指令添加，实行该指令需要有创建用户的权限（通常为root）。

2. 读取 `/etc/default/useradd` 和 `/etc/login.defs` 等配置文件，以获取默认的用户创建设置，如默认的组ID范围、家目录位置、Shell类型等。

3. 系统为用户创建一个同名的新组，为其各分配一个唯一的UID与GID，`/etc/group`会更新。

4. 将新用户的基本信息写入 `/etc/passwd`，并更新`/etc/shadow`，初始密码通常为空。

5. 在 `/home` 目录下为新用户创建家目录，将 `/etc/skel` 目录下的默认配置文件（如 `.bashrc`, `.profile`）复制到新用户的家目录中，为其提供一个基本的登录环境。

```Plain Text
# 小g是主要组所属组，每个用户必须在仅一个所属组，存在passwd，大G是
useradd -g -G
# -r是系统用户 -s指定登录使用的shell
useradd -r -s /sbin/nologin mq
```

一般使用 `/etc/passwd` 文件限制用户权限

```Plain Text
用户名|密码占位符|UID|GID|用户信息|主目录|默认shell
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
```

`/usr/sbin/nologin` 是一个程序，作用是拒绝登录，当尝试登陆时会显示题是并立即终止登录会话。

#### 关于sudo

```Bash
sudo 的uid，gid，groups都是0
sudo bash #sudo打开bash
exit #退出bash

sudo -l查看当前可以使用的命令
sudo -u <用户名> <命令>
将允许当前用户，提权到<用户名>的身份，再执行后面的<命令>
# useradd添加的用户，并不具备sudo权限。需要将用户加入admin组或者wheel组或者sudo组。
# usermod -a -G wheel <用户名>
```

在 `/etc/sudoers` 当中可设置用户能够执行什么命令，和能否切换要不要密码的配置信息



root用户键入`visudo`进入sudo配置，主动添加（不会自动添加）



```Bash
[用户名] [主机名] [以主机什么用户权限执行命令] [是否需要密码] [能够执行的命令]
zhang ALL=(ALL) NOPASSWD： NETWORKING
zhang用户可以在任意主机上不输入密码的情况下以任意用户执行NETWORKING命令 

user01 localhost=(root) NOPASSWD:/usr/bin/passwd,!/usr/bin/passwd root
用户可以执行passwd程序，但是不能修改root密码,在命令前面加上叹号表示不能执行该程序。

Host_Alias （主机别名）

Cmnd_Alias （命令别名）
Cmnd_Alias PROCESSES = /bin/nice, /bin/kill, /usr/bin/kill, /usr/bin/killall
Cmnd_Alias SOFTWARE = /bin/rpm, /usr/bin/up2date, /usr/bin/yum


User_Alias （用户别名，可以是用户，用户组）
定义
User_Alias group1 = user1, user2

Runas_Alias （目的用户别名）
```

[Linux sudo和sudoers详解！ \- 掘金 \(juejin\.cn\)](https://juejin.cn/post/6992609027234463758)

#### 查看用户的信息

```Bash

whoami # 查询当前用户名字
USER2022102157
who    # 显示当前所有登陆用户的信息
w      # 显示目前登入系统的用户信息
 20:39:37 up 136 days,  3:58,  1 user,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM              login@   IDLE   JCPU   PCPU WHAT
root     pts/0    222.94.97.122    20:39    1.00s  0.00s  0.00s w
```



### 用户组 id

#### 添加用户到对应组



1. 可以先查看对应组是否存在

```Bash
grep '^mysql:' /etc/group
```

2. 使用 `usermod` 指令

```Bash
# 添加用户到sudo组 a表示附加 G后面接对应的组
usermod -aG sudo vex
# 添加用户到docker组
sudo usermod -aG docker pbl
```



一般来说，根据创建用户的属性，可能会分配给不同的组，建议使用脚本来完成这一切。

`/etc/group` 

！注意更新用户组后要重新登陆

使用 `groupadd`和 `id` 添加和查看组信息

```Plain Text
sudo groupadd docker
```

#### 查看用户组信息

```Bash
id root
```

#### 

### 磁盘 df du mount



`df`显示磁盘的相关信息



如果没有文件名参数，则显示所有当前已挂载文件系统的磁盘空间使用情况



```Bash
默认是KB为单位
-h或--human-readable：以可读性较高的方式来显示信息 MB GB
-i或--inodes：显示inode的信息；df -h /home

文件系统              容量    已用   可用  已用% 挂载点
/dev/sda2             140G   27G  106G  21% /
/dev/sda1             996M   61M  884M   7% /boot
tmpfs                1009M     0 1009M   0% /dev/shm
/dev/sdb1             2.7T  209G  2.4T   8% /data1 
```



`du`显示每个文件和目录的磁盘使用空间



```Bash
du -sh * |sort -rh
2.9M    command
1.9M    assets
148K    template
72K     package-lock.json
52K     dist
28K     build
16K     README.md
4.0K    renovate.json
4.0K    package.json
4.0K    LICENSE 
只显示当前目录下子目录的大小。
du -sh ./*/
查看指定目录下文件所占的空间：
du ./*
显示总和的大小且易读:
du -sh .
-s仅显示总计，只列出最后加总的值。
```



`mount` 命令挂载磁盘分区文件系统，`umount` 卸载命令



```Bash
# 将 ext3 文件系统的第二块 scsi 的第一个分区挂载到/media/test 目录下
mount -t ext3 /dev/sdb1 /media/test 
mount /dev/sdb2 /media/dir 将第二块 scsi 的第二个分区挂载到/media/dir 目录下
# -t 参数指定文件系统类型
# -a 手动挂载所有在 /etc/fstab 中定义的文件系统

umount /media/test 将挂载在/media/test 目录下的文件系统卸载
```







### 文本处理 grep awk sed tr tac sort uniq wc



`grep`匹配文本中字符并输出



```Bash
grep [options] PATTERN [FILE...]
注意：是文件流不可以是一行文本
options：命令参数。常用的参数有：
-o 只输出匹配到的部分
-i 忽略字符大小写----------------
-v 过滤掉匹配到的内容
-E 支持使用扩展正则表达式 
-R -r 查找所有子文件----------------
-c 输出各个匹配文件出现的次数
-w 完全匹配
-C n 在匹配行前后各显示n行。----------
-B n 在匹配行前显示n行，覆盖。
-A n 在匹配行后显示n行，覆盖。
PATTERN：可使用普通字符串以及正则表达式(标准&扩展)

grep -q "hello" filename
# -q静默运行只返回0找到，1没找到
grep -C 4 -B 2 -A 3 "line1" ./tstdir/test-data1.txt
-B会覆盖-C
```



`sed`用于对文本进行流式编辑，常用于文本替换和文本过滤。



[sed 命令，Linux sed 命令详解：功能强大的流式文本编辑器 \- Linux 命令](https://wangchujiang.com/linux-command/c/sed.html)



```Bash
sed [options] 'sed command ' filename
s\    表示查找并替换
a\    在当前行下面插入文本
i\    在当前行上面插入文本
-i    表示直接修改源文件
-E    支持扩展表达式
-e  表示可以指定表达式
替换标记：
g # 表示行内全面替换。  
p # 表示打印行。  
w # 表示把行写入一个文件。  
x # 表示互换模板块中的文本和缓冲区中的文本。
//调用脚本 
sed [options] -f 'sed command'

//替换文本中的指定字符串,G
sed 's/pattern/replacement/g' filename

sed  's/unix/linux/2' sedtest.txt 
# 将 sedtest.txt 文件中的第二个 unix 替换为 linux，并在终端输出结果

# 删除文件中匹配指定模式的行
sed '/pattern/d' filename

# 只显示文件中匹配指定模式的行
sed -n '/pattern/p' filename

# 编辑指定行范围内的文本
sed '3,5d' filename
```



`awk`是一种强大的文本处理工具，通常用于对结构化文本数据进行处理和分析。它以行为单位逐行处理输入文件，并且能够按照用户定义的规则进行匹配、处理和输出。还可以进行数学计算



```Bash
awk 'pattern {action}' input_file
# pattern用于匹配文本行，action定义了匹配成功时执行的操作,如果pattern为空，则默认匹配所有行
awk内置变量
FS：字段分隔符
OFS：输出数据的字段分隔符
RS：记录分隔符
ORS：输出字段的行分隔符
NF：字段数 几个小节，比如： 权限 链接数 所有者-----------
NR：记录数/行号 1234567 ----------------------

-F ’,‘ 指定分隔符

ls -al|awk '{printf"%-20.20s%s\n",$9,$8}'
# $8 和 $9 分别代表文件的权限和所有者
# %-20.20s 表示左对齐，宽度为20，如果宽度超过20，则截断
ls -al | awk '{print NR,NF}'
```



**tr命令** 可以对来自标准输入的字符进行替换、压缩和删除。



```Bash
tr(选项)(参数)
-c或——complerment：取代所有不属于第一字符集的字符；
-d或——delete：删除所有属于第一字符集的字符；
-s或--squeeze-repeats：把连续重复的字符以单独一个字符表示；
-t或--truncate-set1：先删除第一字符集较第二字符集多出的字符。 

tr a-z A-Z

使用tr删除字符：
echo "hello 123 world 456" | tr -d '0-9'
hello  world 

将制表符转换为空格：
cat text | tr '\t' ' '

用tr压缩字符，可以压缩输入中重复的字符：
echo "thissss is      a text linnnnnnne." | tr -s ' sn'
this is a text line.
```



tac 反向显示文件内容



处理多个文件时，依次将每个文件反向显示，而不是将所有文件连在一起再反向显示



`sort`



```Bash
sort
-r, --reverse            将结果倒序排列。
-n, --numeric-sort,-g    n根据基本数字排序。 g是浮点数计算型排序
-R, --random-sort        随机排序，但分组相同的行。
-h, --human-numeric-sort 根据存储容量排序(注意使用大写字母，例如：2K 1G)。
-d, --dictionary-order   仅考虑空白、字母、数字。
-f, --ignore-case        将小写字母作为大写字母考虑。
-k, --key=KEYDEF         通过一个key排序；KEYDEF给出位置和类型。

cat sort.txt
aaa:10:1.1
ccc:30:3.3
ddd:40:4.4
bbb:20:2.2
eee:50:5.5
eee:50:5.5

sort sort.txt
aaa:10:1.1
bbb:20:2.2
ccc:30:3.3
ddd:40:4.4
eee:50:5.5
eee:50:5.5


sort -u sort.txt
aaa:10:1.1
bbb:20:2.2
ccc:30:3.3
ddd:40:4.4
eee:50:5.5

# 将BB列按照数字从小到大顺序排列：
sort -nk 2 -t: sort.txt
AAA:BB:CC
bbb:10:2.5
ddd:20:4.2
aaa:30:1.6
eee:40:5.4
ccc:50:3.3
eee:60:5.1

# 将CC列数字从大到小顺序排列：
# -n是按照数字大小排序，-r是以相反顺序，-k是指定需要排序的栏位，-t指定栏位分隔符为冒号
sort -nrk 3 -t: sort.txt
eee:40:5.4
eee:60:5.1
ddd:20:4.2
ccc:50:3.3
bbb:10:2.5
aaa:30:1.6
AAA:BB:CC
```







### 系统login logout exit shutdown



```Bash
login 登入系统
logout 登出系统
exit 注销当前用户
clear 清屏命令

shutdown 关机命令
shutdown now 立即进入维护模式
halt 直接关机
shutdown -h now 立即关机
shutdown -r now 立即重新启动计算机
shutdown -h 20:00& 20:00 关闭计算机
shutdown -r 20:00& 20:00 重新启动计算机
shutdown -k 3 warning:system will shutdown! 只是发送消息给所以用户 3 分钟后进入维护模式
shutdown +3 "system will shutdown after 3 minutes!" 发送消息给所以用户 3 分钟后进入系统维护模式
```



### 进程执行 nice



调整程序执行的优先权等级



\-n：指定nice值（整数，\-20（最高）\~19（最低））。



```Bash
nice --20 command 最高优先
nice -19  command 最低优先
nice -n -20 command 最高
nice -n 19 command 最低
```

### 进程监控 ps pstree top htop otop iotop



`ps`用于报告当前系统的进程状态。



可以搭配kill指令随时中断、删除不必要的程序。



ps命令是最基本同时也是非常强大的进程查看命令，使用该命令可以确定有哪些进程正在运行和运行的状态、进程是否结束、进程有没有僵死、哪些进程占用了过多的资源等等



```Bash
-a：显示所有终端机下执行的程序，除了阶段作业领导者之外。
a：显示现行终端机下的所有程序，包括其他用户的程序。
-A：显示所有程序。


ps -ef 
ps -aux
# 检查mysqld的进程
ps aux | grep mysqld

pstree //显示init开始的整个进程树
pstree $$ -p //从当前bash开始，显示进程
```



### 网络监测



nmop



netstat



iptables



dig



ss



scp



### 性能监控 uptime pmap iperf free vmstat ifstat



#### uptime 查看系统负载信息



现在时间、系统已经运行了多长时间、目前有多少登陆用户、系统在过去的1分钟、5分钟和15分钟内的平均负载。



#### pmap 报告进程的内存映射关系







```Bash
pmap -x 5371
5371:   nginx: worker process                
Address           Kbytes     RSS   Dirty Mode   Mapping
0000000000400000     564     344       0 r-x--  nginx
```



#### ifstat 统计网络接口流量状态



默认ifstat不监控回环接口，显示的流量单位是KB。



#### iperf 网络性能测试工具



可以测试TCP和UDP带宽质量，报告带宽，延迟抖动和数据包丢失。



#### free 显示内存使用情况



显示当前系统未使用的和已使用的内存数目，还可以显示被内核使用的内存缓冲区



#### vmstat 显示虚拟内存状态



### 表达式计算 expr bc



expr支持四则运算： `+` 、`-` 、 `\*` 、`/`、 `%`



bc支持任意精度的交互执行的计算器语言，包括浮点运算。



### 文件树

tree命令行参数：

- \-a 显示所有文件和目录。

- \-A 使用ASNI绘图字符显示树状图而非以ASCII字符组合。

- \-C 在文件和目录清单加上色彩，便于区分各种类型。

- \-d 显示目录名称而非内容。

- \-D 列出文件或目录的更改时间。

- \-f 在每个文件或目录之前，显示完整的相对路径名称。

- \-F 在执行文件，目录，Socket，符号连接，管道名称名称，各自加上"\*","/","=","@","\|“号。

- \-g 列出文件或目录的所属群组名称，没有对应的名称时，则显示群组识别码。

- \-i 不以阶梯状列出文件或目录名称。

- \-I 不显示符合范本样式的文件或目录名称。

- \-l 如遇到性质为符号连接的目录，直接列出该连接所指向的原始目录。

- \-n 不在文件和目录清单加上色彩。

- \-N 直接列出文件和目录名称，包括控制字符。

- \-p 列出权限标示。

- \-P 只显示符合范本样式的文件或目录名称。

- \-q 用”?"号取代控制字符，列出文件和目录名称。

- \-s 列出文件或目录大小。

- \-t 用文件和目录的更改时间排序。

- \-u 列出文件或目录的拥有者名称，没有对应的名称时，则显示用户识别码。

- \-x 将范围局限在现行的文件系统中，若指定目录下的某些子目录，其存放于另一个文件系统上，则将该子目录予以排除在寻找范围外。

## 二、输入输出



### 1\.标准输入/输出



> Linux宗旨：一切皆文件   
> 
> 
> 
> 一般文件、进程、I/0都用文件描述符来表示
> 
> 



- 标准输入：0 

    

- 标准输出：1

    

- 标准错误：2

    

> 区分`stdout`和`STDOUT_FILENO`
> 
> 



- stdout 是C语言文件流 FILE\* 定义在 stdio\.h\.

    

- STDOUT\_FILENO 是整数值1的宏 定义在 unistd\.h\. 

    

> 重要函数
> 
> 



\<stdio\.h\>



```C
int sprintf(char *str, const char *format, ...);
//复制文件描述符，目标dp2已打开则关闭并返回新的，未打开则打开新的
int dup(int oldfd);
fd2 = dup(fd1)
```



\<unistd\.h\>



- read\(\) \&\& write\(\)

    

```C
ssize_t write(int fd, const void *buf, size_t count);
ssize_t read(int fd, void *buf, size_t count);
```



\<sys/ioctl\.h\>  Linux系统中一个系统调用（system call）



```C
ioctl()
```



\<fcntl\.h\>



```C
int open(const char *pathname, int flags, mode_t mode);
fd1 = open()
```



### 2\.重定向



> 不重定向输出：（既会打出‘标准输出’，也会打出‘标准错误’）
> 
> 



```Plain Text
$ls exist.txt non-extist.txt
```



> 重定向输出：可自定义输出到文件而非终端 \&1：文件描述符
> 
> 
> 
> 重定向符
> 
> '\>' \('1\>'\)    标准输出覆盖
> 
> '2\>'            标准错误
> 
> '\>\>'        标准输出追加
> 
> '2\>\>'            标准错误追加
> 
> '2\>\&1' \|\| '\&\>'    错误输出（stderr）重定向到标准输出（stdout）
> 
> 
> 
> \&\>             正常输出和错误输出都重定向到同一个文件
> 
> 



---



> 将命令执行成功/失败的结果输出
> 
> 



```C
$ls exist.txt non-exist.txt 1> suc.txt 2> fail.txt
$ls exist.txt non-extist.txt > result.txt 
```



> 关闭标准输入输出
> 
> 



```C
ls exists.txt no-exists.txt 2> /dev/null //关闭输出
ls exists.txt no-exists.txt 2> &1 1> /dev/null 
```



> Detect if stdout is 重定向 ？
> 
> 



```C
include <unistd.h>
int isatty(int fd);
```



如果打开的文件描述符 fa 连接到一个终端，则系统调用isatty返回1，否则返回0。



在这个程序中，你使用的是文件流，但isatty只能对文件描述符进行操作。为了提供必要的转换，你需要把 isatty调用 与 fileno函数结合使用。



```C
//检查是否存在输出重定向
#include <unistd.h>

if(!isatty(fileno(stdout))){
        fprintf(stderr, "you are not a terminal\n" ); //说明被重定向了！
        exit(1);
    }
```



### 3\.用户终端输入



---



### 4\.shell命令行解释器



用户无法直接访问内核，借助shell来调度内核



shell 脚本就是由Shell命令组成的执行文件，不用编译即可运行，它通过解释器解释运行



### 5\.杂项



- 转义字符

\[https://gist\.github\.com/fnky/458719343aabd01cfb17a3a4f7296797\]



- 浮点数

31 = 1（符号）\+ 8（指数）\+ 23（小数）



## 三、终端



#### TTY

*其实是始于 19 世纪 30 年代的Teletypewriter的缩写，最早的输入/输出设备电传打字机编程虚拟设备。在 Linux 或 UNIX 中，TTY 变为了一个抽象设备。有时它指的是一个物理输入设备，例如串口，有时它指的是一个允许用户和系统交互的虚拟 TTY（*[*参考此处*](https://link.zhihu.com/?target=https%3A//unix.stackexchange.com/questions/4126/what-is-the-exact-difference-between-a-terminal-a-shell-a-tty-and-a-con)*）。*

#### \.profile



`.profile` 是一个 shell 脚本，通常位于用户的家目录下。它是一个初始化文件，用于在用户登录时执行一些命令或设置环境变量。



## 四、 进程运行



```Bash
source .profile
```



### 1\.Init进程



### 2\. 编译程序



##### 可执行文件（ELF）



c编译过程 \.c \-\-\- 预编译\.i \-\-\- 编译\.s \-\-\- 汇编\.o \-\-\-连接elf



##### linux汇编（ATT语法，相对于x8086的intel）



在`ATT`语法中，寄存器前冠以`％`，而立即数前冠以`$`，十六进制立即数前冠以“0x”



objdump帮助我们从可执行文件中反汇编出汇编代码，从而逆向分析工程。



### 3\. linux进程地址空间划分



1. \.进程地址空间的布局

    

    linux 64位系统，可用空间地址为2^\{64\}Byte，操作系统仅用低47位（256TB）,一半给kernel，一半给user space。

    

    user space包含环境变量、命令行参数、栈、内存映射段、堆、bss段、ds段、text段

    

    附 ：

    

    - 位数指CPU的数据总线宽度，意味着寄存器的位数，表示了CPU一次能处理的数据位数

        

    - 一般数据总线和地址总线是相同的（x8086不是，所以做了地址扩展）

        

    - 地址总线的宽度意味着主存的大小，因为这里存储单元是一字节，所以20位地址线相当于2^\{20\}字节

        

2. 代码段cs

- 存放cpu指令

3. 数据段ds

- 存放程序中\*\*已初始化且初值不为0\*\*的\*\*全局变量\*\*和\*\*静态局部变量\*\*。数据段属于静态内存分配\(静态存储区\)，可读可写。

4. bss段

- 未初始化的全局变量和静态局部变量

- 初始值为0的全局变量和静态局部变量\(依赖于编译器实现\)

- 未定义且初值不为0的符号\(该初值即common block的大小\)

5. 堆

- 堆用于存放进程运行时动态分配的内存段，可\*\*动态扩张或缩减\*\*。

    

- 堆中内容是匿名的，不能按名字直接访问，只能通过指针间接访问。当进程调用malloc\(C\)/new\(C\+\+\)等函数分配内存时，新分配的内存动态添加到堆上\(扩张\)；当调用free\(C\)/delete\(C\+\+\)等函数释放内存时，被释放的内存从堆中剔除\(缩减\) 。

    

- 堆的末端由break指针标识，当堆管理器需要更多内存时，可通过系统调用brk\(\)和sbrk\(\)来移动break指针以扩张堆，一般由系统自动调用。

    

- 可见，堆容易造成内存碎片；由于没有专门的系统支持，效率很低；由于可能引发用户态和内核态切换，内存申请的代价更为昂贵

    

- 操作系统为堆维护一个记录空闲内存地址的链表。当系统收到程序的内存分配申请时，会遍历该链表寻找第一个空间大于所申请空间的堆结点，然后将该结点从空闲结点链表中删除，并将该结点空间分配给程序。若无足够大小的空间\(\*\*可能由于内存碎片太多\*\*\)，有可能调用系统功能去增加程序数据段的内存空间，以便有机会分到足够大小的内存，然后进行返回

6. 内存映射段（mmap）

- **mmap通过将磁盘文件映射到用户空间**，进程可以像访问普通内存一样对文件进行访问，不必再调用read\(\)/write\(\)等操作。用户也可创建匿名内存映射，该映射没有对应的文件, 可用于存放程序数据。 

    

- 

    

- malloc申请内存的大小超过128K就会\*\*使用mmap分配内存，在堆和栈之间找一块空闲内存分配\(对应独立内存，而且初始化为0\)

7. 栈

- 由编译器自动分配释放

- 为函数内部声明的非静态局部变量\(C语言中称“自动变量”\)提供存储空间

- 记录函数调用过程相关的维护性信息，称为栈帧\(Stack Frame\)或过程活动记录\(Procedure Activation Record\)

- 栈的大小在运行时由内核动态调整。

- Linux中ulimit \-s命令可查看和设置堆栈最大值，当程序使用的堆栈超过该值时, 发生栈溢出\(Stack Overflow\)，程序收到一个段错误\(Segmentation Fault\)。

8. 举例

    

```C
//main.cpp  
int a = 0; 全局初始化区  
char *p1; 全局未初始化区  
main()  
{  
      int a = 4; 栈,4也是存在栈上  
      char s[] = "abc"; 栈  "abc"也是存在栈上
      char *p2; 栈  
      char *p3 = "123456"; 123456\0在常量区（是在Data段上），p3在栈上。  
      static int c =0； 全局（静态）初始化为0,就是放在BSS段   
      p1 = (char *)malloc(10);  
      p2 = (char *)malloc(20);  
      malloc分配得来得10和20字节的区域就在堆区。因为属于动态申请分配内存空间  
      strcpy(p1, "123456"); 123456\0放在常量区，编译器可能会将它与p3所指向的"123456"优化成一个地方。  
}
```



### 4\. 子进程与父进程



```C
fork();
wait(0);
```



附：库



\<unistd\.h\>



\<sys/wait\.h\>



\<sys/types\.h\>



### 5\. exec 程序与进程



Q:程序如何变成进程？



A:通过替代命令行变量和环境变量（将原进程的代码段、数据段、堆栈等内容替代）



\<unistd\.h\>



```C
//要执行的新程序的路径,传递给新程序的命令行参数,传递给新程序的环境变量的空指针结尾的字符串数组
int execve(const char *filename, char *const argv[], char *const envp[]);
```



调用`execve()`之后，原程序的执行流程会终止，而被指定的新程序开始执行。



值得注意的是，如果`execve()`调用成功，它将不会返回；如果发生错误，它会返回\-1，并设置`errno`以指示错误类型。



### 6\.后台进程、前台进程、作业



`CTRL+C`: 杀死进程



`CTRL+Z`: 阻塞进程



```Bash
# 列出所有后台运行的作业
jobs    
# 后台执行
./progress & 
# 将作业编号为 1 的作业放到前台运行 默认最近一个
fg %1
# 将作业编号为 1 的作业放到后台运行
bg %1
```



### 7\.守护进程



##### 定义



    daemon 是独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件，如日志进程syslogd、 web服务器httpd、邮件服务器sendmail和数据库服务器mysqld等\.



    一个守护进程的父进程是init进程，因为它真正的父进程在fork出子进程后就先于子进程exit退出了，所以它是一个由init继承的孤儿进程。



    守护进程的名称通常以d结尾，比如sshd、xinetd、crond等



##### 创建



进程组——一组进程的集合



- 进程组中的所有进程都共享相同的 PGID

    

- 每个进程也属于一个进程组

    

- 一个进程只能为它自己或子进程设置进程组ID号

    

- 进程组可以作为一个单元接收信号

    

会话期——一组相关的进程组的集合



```C
//建立一个session
setsid()
```



### 附：作业命令



```Bash
crond进程每分钟会定期检查是否有要执行的任务，如果有要执行的任务，则自动执行该任务。

atq：列出所有待执行的 at 作业。
cron：管理 cron 作业，用于定期重复执行任务。
```



`at`：用于提交 at 作业，即指定在特定时间运行的任务。 



能够接受在当天的hh:mm（小时:分钟）式的时间指定。假如该时间已过去，那么就放在第二天执行。当然也能够使用midnight（深夜），noon（中午），teatime（饮茶时间，一般是下午4点）等比较模糊的 词语来指定时间。用户还能够采用12小时计时制，即在时间后面加上AM（上午）或PM（下午）来说明是上午还是下午。 也能够指定命令执行的具体日期，指定格式为month day（月 日）或mm/dd/yy（月/日/年）或dd\.mm\.yy（日\.月\.年）。指定的日期必须跟在指定时间的后面。



上面介绍的都是绝对计时法，其实还能够使用相对计时法，这对于安排不久就要执行的命令是很有好处的。指定格式为：`now + count time-units`，now就是当前时间，time\-units是时间单位，这里能够是minutes（分钟）、hours（小时）、days（天）、weeks（星期）。count是时间的数量，究竟是几天，还是几小时，等等。 更有一种计时方法就是直接使用today（今天）、tomorrow（明天）来指定完成命令的时间。



---



`batch`用于在指定时间，当系统不繁忙时/负载较低时    执行任务，用法与at相似。



```Bash
命令将被提交给 cron 守护进程，并在系统负载较低时执行，同时指定了一个较低的优先级
batch -p 10 /path/to/your/long-running-command
-p 指定作业的优先级，数字越小，优先级越高。
```



---



`crontab`提交和管理用户的需要周期性执行的任务



`/etc/crontab`文件包括下面几行：



```Shell
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=""HOME=/

# run-parts
51 * * * * root run-parts /etc/cron.hourly
24 7 * * * root run-parts /etc/cron.daily
22 4 * * 0 root run-parts /etc/cron.weekly
42 4 1 * * root run-parts /etc/cron.monthly
```



**用户任务调度：** 用户定期要执行的工作，比如用户数据备份、定时邮件提醒等。用户可以使用 crontab 工具来定制自己的计划任务。所有用户定义的crontab文件都被保存在`/var/spool/cron`目录中。



crontab文件的含义：用户所建立的crontab文件中，每一行都代表一项任务，每行的每个字段代表一项设置，它的格式共分为六个字段，前五段是时间设定段，第六段是要执行的命令段，格式如下：



```Shell
minute   hour   day   month   week   command     顺序：分 时 日 月 周

每1分钟执行一次command
* * * * * command

每晚的21:30重启smb 
30 21 * * * /etc/init.d/smb restart

每周六、周日的1:10重启smb
10 1 * * 6,0 /etc/init.d/smb restart
```



在以上各个字段中，还可以使用以下特殊字符：



- 星号（\*）：代表所有可能的值，例如month字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。

- 逗号（,）：可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”

- 中杠（\-）：可以用整数之间的中杠表示一个整数范围，例如“2\-6”表示“2,3,4,5,6”

- 正斜线（/）：可以用正斜线指定时间的间隔频率，例如“0\-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如\*/10，如果用在minute字段，表示每十分钟执行一次。

    

## 五、信号机制



> 信号\(signal\)是一种软中断，信号机制是进程间通信的一种方式，采用异步通信方式
> 
> 
> 
> 共有64个，1\-32不可靠信号，1\-31非实时信号，
> 
> 



### 1\.信号表



```Bash
kill -l
 1) SIGHUP挂起  2) SIGINT ctrl+c 3) SIGQUIT ctrl+\4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1 用户自定义
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
```



### 2\.  信号产生



硬件方式：用户输入/硬件异常



软件方式：系统调用，发送signal信号，如kill\(\), abort\(\), alarm\(\)



```Bash
kill -SIGUSR (pid)
```



### 3\. 注册和注销



在进程task\_struct结构体中有一个未决信号的成员变量 `struct sigpending pending`。每个信号在进程中注册都会把信号值加入到进程的未决信号集。



- 非实时信号发送给进程时，如果该信息已经在进程中注册过，\*\*不会再次注册\*\*，故信号会丢失；

    

- 实时信号发送给进程时，不管该信号是否在进程中注册过，都会再次注册。故信号不会丢失；

    

- 非实时信号：不可重复注册，最多只有一个sigqueue结构；当该结构被释放后，把该信号从进程未决信号集中删除，则信号注销完毕；

    

- 实时信号：可重复注册，可能存在多个sigqueue结构；当该信号的所有sigqueue处理完毕后，把该信号从进程未决信号集中删除，则信号注销完毕；

    

### 4\. C程序中信号



可用于忽略和恢复linux中的信号



void func（int），或者是下面的特殊值：



    SIG\_IGN:忽略信号  



    SIG\_DFL:恢复信号的默认行为



```C
#include <signal.h>
void (*signal(int sig, void (*func)(int)))(int);

main:
(void) signal(SIGINT, func1);    //改变终端中断信号SIGINT的默认行为

func1(int sig):
printf("\n I got signal %d \n", sig);   //  显示捕获的信号
(void) signal(SIGINT, SIG_DFL);  // 恢复终端中断信号SIGINT的默认行为
```



---



pause



```C
pause(); //等待直到接收到信号唤醒
```



## 六、进程通信



#### 1\.管道



管道是单向的、先进先出的、无结构的、固定大小的字节流。



管道通过文件把一个进程的标准输出和另一个进程的标准输入连接在一起。



**管道的特点：**



-   管道是半双工的，只要确定了管道的数据流向，就不再允许更改。要双向通信时，要建立两处管道。

    

-    只能用于有亲缘关系的进程间通信（如父子进程、兄弟进程等）。

    

```C
#include <unistd.h>
int filedes[2];
//读端[0] 写端[1], 返回值-1失败
原型：#include <unistd.h>
int pipe(int filedes[2]);
        功能：创建一个管道文件。
        返回值：若成功则返回0，否则返回-1
参数:filedes返回两个文件描述符：filedes[0]为读而打开，filedes[1]为写而打开。filedes的输出是filedes[1]的输出是filedes[0]的输入。

原型：size_t write(int filedes,const void * buf,size_t nbytes);    //写
功能：把buf开始nbytes字节的内容插入到filedes所指出的文件的当前位置。
返回值：若成功则返回已写的字节数，若出错则返回-1

原型：size_t read(int filedes,const void* buf,size_t nbytes);   //读
功能：从filedes所指出的文件的当前位置，读取nbytes个字节数据，并存放在
buf所指出的缓冲区中。
返回值：若成功则返回读到的字节数，若已到文件结尾则返回0,若出错则返回-1。

原型：int close(int filedes);
功能：关闭由filedes所指出的文件。
返回值：若成功则返回0，若出错则返回-1。

//对文件加锁/解锁 cmd控制命令F_LOCK(1), F_ULOCK(0), len字节数
int lockf(int fd, int cmd, off_t len); 
注：lockf()函数允许将文件区域用作信号量（监视锁）或用于控制对锁定进程的访问（强制模式记录锁定）。
试图访问已锁定资源的其他进程将返回错误或进入休眠状态，直到资源解除锁定为止。当关闭文件时，将释放进程的所有锁定，即使进程仍然有打开的文件。当进程终止时，将释放进程保留的所有锁定。
cmd 是指定要采取的操作的控制值，允许的值在中定义。 
　　如下所示： 
　　# define F_ULOCK 0 //解锁 
　　# define F_LOCK 1 //互斥锁定区域 
　　# define F_TLOCK 2 //测试互斥锁定区域  
   # define F_TEST 3 //测试区域
```



#### 2\. 消息队列



    Linux中的消息队列可以被描述成在内核地址空间的一个内部链表，每一个消息队列由一个IPC的标识号唯一的标识。Linux 为系统中所有的消息队列维护一个 msgque 链表，该链表中的每个指针指向一个 msgid\_ds 结构，该结构完整描述一个消息队列。



    过程：创建消息缓冲区msgbuf放消息，ftok创建IPC通讯，mssget创建消息队列。向msgid代表的消息队列发送一个消息，即将发送的消息存储在msgbuf结构中，消息的大小由msgze指定,返回队列中的第一个消息；从msgid所指定的消息队列中读取一个消息，并把消息存储在msgbuf结构中



```C
(1)    消息缓冲区(msgbuf)
//一个存放消息数据的模板
struct msgbuf {
long mtype;         /* 消息的类型，必须为正数 */
char mtext[1];      /* 消息正文 */ 
/*不仅能保存字符数组，而且能保存任何形式的任何数据。*/
};
struct my_msgbuf {
long    mtype;          /* 消息类型 */
long    request_id;     /* 请求识别号 */
struct  client info;    /* 客户消息结构 */
};
消息总的长度不能超过8192字节，包括mtype域，它是4字节长。

(2)    消息结构(msg)
//内核把每一条消息存储在以msg结构为框架的队列中
struct msg {
    struct msg *msg_next;       /* 队列上的下一条消息 */
    long  msg_type;              /*消息类型*/
    char *msg_spot;                /* 消息正文的地址 */
    short msg_ts;               /* 消息正文的大小 */
};
注意：msg_next是指向下一条消息的指针，它们在内核地址空间形成一个单链表。

(3)    消息队列结构(msgid_ds)
//当在系统中创建每一个消息队列时，内核创建、存储及维护这个结构的一个实例
/* 在系统中的每一个消息队列对应一个msqid_ds 结构 */
struct msqid_ds {
struct ipc_perm msg_perm;
struct msg *msg_first;       /* 队列上第一条消息，即链表头*/
struct msg *msg_last;        /* 队列中的最后一条消息，即链表尾 */
time_t msg_stime;            /* 发送给队列的最后一条消息的时间 */
time_t msg_rtime;           /* 从消息队列接收到的最后一条消息的时间 */
time_t msg_ctime;           /* 最后修改队列的时间*/
ushort msg_cbytes;          /*队列上所有消息总的字节数 */
ushort msg_qnum;             /*在当前队列上消息的个数 */
ushort msg_qbytes;            /* 队列最大的字节数 */
ushort msg_lspid;           /* 发送最后一条消息的进程的pid */
ushort msg_lrpid;           /* 接收最后一条消息的进程的pid */
};
```



System V消息队列是随内核持续的，只有在内核重启或显式地删除一个消息队列时，该项消息队列才会真正删除。因此系统中记录消息队列的数据结构（struct ipc\_ids msg\_ids）位于内核中，系统中的所有消息报队列都可以在结构msg\_ids中找到访问入口中。



```C
(4)System V消息队列API
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>
1>    获取建立IPC通讯的ID值：
key_t ftok( char * fname, int id );
功能：系统建立IPC通讯（如消息队列、共享内存时）必须指定一个ID值。通常情况下，该id值通过ftok函数得到。
     ftok函数用于生成一个唯一的键值（key），这个键值可以用于标识一个消息队列、共享内存段或信号量集。
参数：fname就是你指定的文件名,必须是一个现存文件。
     id是子序号。
返回值：若成功则返回键，若出错则返回-1。

2>    获得一个已存在的消息队列或创建一个特定的队列
int msgget(key_t key,int msgflg);
功能:取得一个与键值key相应的消息队列描述字,或若还没存在的队列，则创立之并返回这个消息队列描述字。
返回值：若调用成功，返回消息队列描述字，否则返回-1。
参数：
key：是一个由ftok获得的键值（也可自行指定）
msgflg:可以是以下值，以及它们的或值结果：
IPC_CREAT：如果这个队列在内核中不存在，则创建它。
IPC_EXCL：当与IPC_CREAT一起使用时，如果这个队列已存在，则创建失败。

3>    读取消息
int msgrcv(int msqid,struct msgbuf* msgp,int msgsz,long msgtyp,int msgflg);
功能：从msgid所指定的消息队列中读取一个消息，并把消息存储在msgp指向的msgbuf结构中。
返回值：若成功调用，返回读出消息报的实际字节数，否则返回-1.
参数：
    msgid:消息队列描述字。
    msgp：消息返回后所存储的缓冲区的地址。
    msgsz:指定msgbuf的mtext成员的长度(即消息内容的长度)。
    msgtyp:为请求读取的消息类型。
        msgtyp==0    返回队列中的第一个消息
        msgtyp >0    返回队列中消息类型为msgtyp的第一个消息
        msgtyp <0    返回队列中消息类型小于或等于msgtyp绝对值的消息，如果有                        若干个，则取类型值最小的消息
    msgflg：读消息标志,可以是以下几个常值的或:
    IPC_NOWAIT:若没有满足条件的消息，调用立即返回，且置全局变量errno=ENOMSG。
    IPC_EXCEPT:与msgtyp>0配合使用，返回队列中第一个类型非msgtyp的消息。
    IPC_NOERROR:若队列中满足条件的消息内容大于所请求的msgsz字节，则把该消息截断，截断部分将丢失。

4>    发送消息
int msgsnd(int msgid,struct msgbuf* buf,int msgsz,int msgflg);
功能：向msgid代表的消息队列发送一个消息，即将发送的消息存储在msgp指向的msgbuf结构中，消息的大小由msgze指定。
参数：
    msgid:消息队列描述字。
    buf:具体的消息
    msgsz:指定msgbuf的mtext成员的长度(即消息内容的长度)。
    msgflg:消息标志,同上面msgrcv函数，但有意义的是IPC_NOWAIT，指明在消息队列中没有足够空间容纳要发送的消息时，msgsnd()是否等待。

5>    对消息队列执行特定操作（是对消息队列还是对消息队列中的消息）
int msgctl(int msgid,int cmd,struct msgid_ds* buf)；
功能：对由msgid标识的消息队列执行cmd所指定的操作：
返回值：调用成功，则返回0，否则返回-1。
参数：
    msgid:消息队列描述字。
    buf:参见cmd解释.
    cmd:可以是以下值：
    IPC_STAT:取此队列的msqid_ds结构，并将它存放在buf指向的结构中。
    IPC_SET:按由buf指向结构中的值，设置与些队列相关结构中的下列四个字段：
    msg_perm.uid、msg_perm.gid、msg_perm.mode、msg_perm.qbytes:
    IPC_RMID:从系统中删除该消息队列以及仍在该队列中的所有数据。
说明：
此命令只能由下列两种进程执行：一种是其有效用户ID等于msg_perm.cuid或msg_perm .uid；
                         另一种是具有超级用户特权的进程。
只能超级用户才能增加msg_qbytes的值。    

mqd_t mq;
char buffer[MSG_SIZE];
struct 
msqid
msgnd
//receive
msgrcv
```



#### 3\.共享内存



1. 数据结构

内核为每一个共享内存段\(存在于它的地址空间\)维护着一个特殊的数据结构shmid\_ds



```C
struct shmid_ds {
 struct ipc_perm shm_perm; /* 操作权限 */
 int shm_segsz; /* 段的大小(以字节为单位) */
 time_t shm_atime; /* 最后一个进程附加到该段的时间 */
 time_t shm_dtime; /* 最后一个进程离开该段的时间 */
 time_t shm_ctime; /* 最后一次修改这个结构的时间 */
 unsigned short shm_cpid; /*创建该段进程的 pid */
 unsigned short shm_lpid; /* 在该段上操作的最后一个进程的pid */
 short shm_nattch; /*当前附加到该段的进程的个数 */
 /* 下面是私有的 */
 unsigned short shm_npages; /*段的大小(以页为单位) */
 unsigned long *shm_pages; /* 指向frames -> SHMMAX的指针数组 */ 
struct vm_area_struct *attaches; /* 对共享段的描述 */
 };
```



2. 共享内存的处理过程            

    

某个进程第一次访问共享虚拟内存时将产生缺页异常。这时，Linux 找出描述该内存的 vm\_area\_struct 结构，该结构中包含用来处理这种共享虚拟内存段的处理函数地址。共享内存缺页异常处理代码对shmid\_ds 的页表项表进行搜索，以便查看是否存在该共享虚拟内存的页表项。如果没有，系统将分配一个物理页并建立页表项，该页表项加入 shmid\_ds 结构的同时也添加到进程的页表中。这就意味着当下一个进程试图访问这页内存时出现缺页异常，共享内存的缺页异常处理代码则把新创建的物理页给这个进程。因此说，第一个进程对共享内存的存取引起创建新的物理页面，而其它进程对共享内存的存取引起把那个页加添加到它们的地址空间。



当某个进程不再共享其虚拟内存时，利用系统调用将共享段从自己的虚拟地址区域中移去，并更新进程页表。当最后一个进程释放了共享段之后，系统将释放给共享段所分配的物理页。



当共享的虚拟内存没有被锁定到物理内存时，共享内存也可能会被交换到交换区中。



3\.    相应API



共享内存段的识别号key, 



```C
1. 系统调用：shmget()
  原型：int shmget ( key_t key, int size, int shmflg );                                             
  返回：成功，则返回共享内存段的识别号, 失败返回-1                                                             
  类似于信号量和消息队列的系统调用，在此不进一步赘述。

2. 系统调用：shmat()
   原型： int shmat ( int shmid, char *shmaddr, int shmflg);
   返回：成功，则返回附加到进程的那个段的地址，失败返回-1。
其中shmid是由shmget()调用返回的共享内存段识别号，shmaddr是你希望共享段附加的地址，shmflag允许你规定希望所附加的段为只读(利用SHM_RDONLY)以代替读写。通常，并不需要规定你自己的shmaddr，可以用传递参数值零使得系统为你取得一个地址。
这个调用可能是最简单的，下面看一个例子，把一个有效的识别号传递给一个段，然后返回这个段被附加到内存的内存地址。
char *attach_segment( int shmid ){
        return(shmat(shmid, 0, 0));
}
一旦一个段适当地被附加，并且一个进程有指向那个段起始地址的一个指针，那么，对那个段的读写就变得相当容易。

3. 系统调用： shmctl()
  原型： int shmctl ( int shmqid, int cmd, struct shmid_ds *buf );
  返回：成功为 0 ，失败 为-1
功能：这个特殊的调用和msgctl()调用几乎相同，因此，这里不进行详细的讨论。
cmd有效命令的值是：
IPC_STAT ：检索一个共享段的shmid_ds结构，把它存到buf参数的地址中。
IPC_SET ：对一个共享段来说，从buf 参数中取值设置shmid_ds结构的
            ipc_perm域的值。
IPC_RMID ：把一个段标记为删除 
IPC_RMID 命令实际上不从内核删除一个段，而是仅仅把这个段标记为删除，实际的删除发生在最后一个进程离开这个共享段时。
当一个进程不再需要共享内存段时，它将调用shmdt()系统调用取消这个段，但是，这并不是从内核真正地删除这个段，而是把相关shmid_ds结构的 shm_nattch域的值减1，当这个值为0时，内核才从物理上删除这个共享段。

4.系统调用:shmdt()
原型：int shmdt(void* addr);
    返回值：若成功则返回0,否则返回-1
    参数：addr是以前调用shmat时返回的值。
    功能：当对共享存储段的操作已结束时，则调用此数脱接该段。
注意的是，调用此函数并不从系统中删除其标识符以及其数据结构。该标识符仍然存在，直至某个进程（一般是服务器进程）调用shmctl(带命令IPC_RMID).
```



#### 4\. 信号量



```C
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
# System V Semaphore GET
int semget(key_t key, int nsems, int semflg)
创建或者打开一个信号量集合,成功返回semid，失败返回-1
# Control
int semctl(int semid, int semnum, int cmd, union semun arg)
设置信号量的值、获取信号量集的信息或删除信号量集
semnum:对某一个信号量集合中单个信号量的序号，置0表示忽视该参数
cmd:指定了相关控制操作，常见参数如下：
    IPC_RMID：立即删除信号量集以及相关关联数据结构，所有因为调用semop而等待这个信号量集的进程都会被立即唤醒，semop会报EIDRM错误，该参数忽略arg参数和semnum参数
union semun {
               int              val;    /* Value for SETVAL */
               struct semid_ds *buf;    /* Buffer for IPC_STAT, IPC_SET */
               unsigned short  *array;  /* Array for GETALL, SETALL */
               struct seminfo  *__buf;  /* Buffer for IPC_INFO*/
           };
# Operation
int semop(int semid, struct sembuf *sops, unsigned nsops);
进行一个或者多个原子操作， P 操作(等待或减一)和 V 操作(发送或加一)
struct sembuf
{
     unsigned short sem_num;  /* semaphore number(信号集中单个信号量的序号) */
     short          sem_op;   /*
1.    sem_op 大于0：调用进程具备在信号量上面的写权限。将sem_op 值加到信号量上面，等待减少该信号量值得进程会被唤醒
2.    sem_op 等于0：调用进程具备在信号量上面的读权限。调用进程检查信号量值是否为0，如果等于0，操作立即结束，否则阻塞到等于0为止
3.    sem_op 小于0：调用进程具备在信号量上面的写权限。当前信号量的值减去sem_op 大于等于0，操作结束，否则阻塞进程知道操作之后不会把信号量变为负值为止*/
     short          sem_flg;  /* operation flags */
//指定IPC_NOWAIT ，本来semop() 会阻塞，但是指定了这个标志之后，会返回EAGAIN错误
sem_op 调用阻塞被唤醒的一般情况：
1.    等待的信号量发生了变化
2.    一个信号中断了sem_op() ，返回EINTR错误
3.    信号量被删除，返回EIDRM错误

}
```



## 七、vi和vim



##### 命令模式



```Bash
设置行号
:set nu
:set nonu

撤销操作
u 撤销，可以撤销到最近的一次保存的状态
：e! 恢复到文档的初始状态

删除字符
x 键或 del 键
7x 删掉光标后面的 7 个字符
dw 删除一个词（剪切）
dd 删除行（剪切）
4dd 删除 4 行（剪切）

复制操作
yw 复制一个词
yy 复制光标所在的行
4yy 复制光标所在行的下面 4 行

粘贴操作
p 粘贴在光标所在的下一行（如果粘贴词的话，粘贴在光标字符的后面）

光标快速定位
G 光标到达行末
7G 快速找到第 7 行
/adm 简单搜索，快速定位光标到光标后的第一个 adm 单词的位置，当到行末没有的话，返回从头开始查找

：7，12 s/:/? 把第 7-12 行中每一行的第一个：改成？ 
：7，12 s/:/?/g 把第 7-12 行中的：全部改成？

进入和退出输入模式
i 在光标之前输入文字
ESC 退出
a 在光标之后输入文字
A 在行尾插入文字
o 光标下面插入 1 行空行
O 在光标上面插入 1 行空行
```



## 八、文件



文本文件是存储在文件系统的纯文本数据，在Linux系统中，文本文件和二进制文件无任何实际的区别:使用换行符而非回车



文本文件有多种编码，包括ASCII和UTF\-8，



### Linux中的文件



Linux的文件目录下只存储 `文件名` 与 一个指向 `inode` 的指针。 



`inode` （Index Node）是linux一个数据结构，代替了传统系统的FCB。所有`inode` 统统存放在磁盘中名为 `inode` 表的地方，有一个唯一的编号作为其在表中的索引。



`inode` 存储了文件的所有元数据，包括文件大小、类型（例如普通文件、目录、字符设备等）、权限、所有者、时间戳、链接数（多少文件名指向该inode）以及文件数据地址。每个 `inode` 包含12个指向文件实际数据块的指针，一个一级间接指针、一个二级间接指针、一个三级间接指针，使小文件能快速被访问而大文件可以通过多级索引来管理。



每个`inode` 节点一般为128B或256B，在格式化时就给定，一般1或2KB设置一个inode，创建文件时再分配。当`inode` 的链接数为0且没有任何程序正在使用，该`inode` 被重新标记为可用，且回收其占用的所有数据块。



文件描述符（File Descriptor）是一个0\~255的整数，是操作系统内核为每个\*\*进程\*\*维护的一个表中的索引，当打开一个文件或设备时，讷河返回一个文件描述符，程序通过它来访问文件而非直接使用文件名。



### 文件类型



- 目录

- 普通文件

- 字符设备文件：用于处理字符流数据，如tty、console、打印机等。

- 块设备文件：以固定大小的数据块为单位进行读写操作，这类设备包括磁盘分区、光盘驱动，支持随机访问且有缓存。

- 符号链接

- 管道

- 套接字

    

### 文件流



**open系统调用（linux）**



**需要包含头文件：** 

\#include\<sys/types\.h\> 

\#include\<sys/stat\.h\> 

\#include\<fcntl\.h\>



**函数原型：** 

int open\( const char \* pathname, int oflags\); 

int open\( const char \* pathname,int oflags, mode\_t mode\);



**mode**仅当创建新文件时才使用，用于指定文件的访问权限。 

**pathname** 是待打开/创建文件的路径名； 

**oflags**用于指定文件的打开/创建模式，这个参数可由以下常量（定义于 fcntl\.h）通过逻辑或构成。 

O\_RDONLY 只读模式 

O\_WRONLY 只写模式 

O\_RDWR 读写模式 

以上三者是互斥的，即不可以同时使用。  

打开/创建文件时，至少得使用上述三个常量中的一个。以下常量是选用的：  

O\_APPEND 每次写操作都写入文件的末尾  

O\_CREAT 如果指定文件不存在，则创建这个文件  

O\_EXCL 如果要创建的文件已存在，则返回 \-1，并且修改 errno 的值  

O\_TRUNC 如果文件存在，并且以只写/读写方式打开，则清空文件全部内容  

O\_NOCTTY 如果路径名指向终端设备，不要把这个设备用作控制终端。  

O\_NONBLOCK 如果路径名指向 FIFO/块文件/字符文件，则把文件的打开和后继 I/O设置为非阻塞模式（nonblocking mode）。  

//以下用于同步输入输出  

O\_DSYNC 等待物理 I/O 结束后再 write。在不影响读取新写入的数据的前提下，不等待文件属性更新。  

O\_RSYNC read 等待所有写入同一区域的写操作完成后再进行  

O\_SYNC 等待物理 I/O 结束后再 write，包括更新文件属性的 I/O



当你使用带有O\_CREAT标志的open调用来创建文件时，你必须使用有3个参数格式的open调用。第三个参数mode是几个标志按位或后得到的，  

这些标志在头文件sys/stat\.h中定义，如下所示：  

S\_IRUSR: 读权限，文件属主  

S\_IWUSR: 写权限，文件属主  

S\_IXUSR: 执行权限，文件属主  

S\_IRGRP: 读权限，文件所属组  

S\_IWGRP: 写权限，文件所属组  

S\_IXGRP: 执行权限，文件所属组  

S\_IROTH: 读权限，其它用户  

S\_IWOTH: 写权限，其它用户  

S\_IXOTH: 执行权限，其它用户



**返回值**：成功则返回文件描述符（整型变量0\~255），否则返回 \-1。 由open 返回的文件描述符一定是该进程尚未使用的最小描述符。



**错误代码**：（均已E开头，将其去掉就是有关于错误的方面的单词或单词的缩写） 



```Plain Text
EEXIST 参数pathname 所指的文件已存在，却使用了O_CREAT和O_EXCL旗标。  
EACCESS 参数pathname所指的文件不符合所要求测试的权限。  
EROFS 欲测试写入权限的文件存在于只读文件系统内。  
EFAULT 参数pathname指针超出可存取内存空间。  
EINVAL 参数mode 不正确。  
ENAMETOOLONG 参数pathname太长。  
ENOTDIR 参数pathname不是目录。  
ENOMEM 核心内存不足。  
ELOOP 参数pathname有过多符号连接问题。  
EIO I/O 存取错误。  
ssize_t write(int fd, const void *buf, size_t count); 
```



**参数**：  

fd：要进行写操作的文件描述词。  

buf：需要输出的缓冲区  

count：最大输出字节计数  

**返回值**：成功返回写入的字节数，出错返回\-1并设置errno  

ssize\_t read\(int fd, void \*buf, size\_t count\);  

**参数**：  

buf：需要读取的缓冲区  

count：最大读取字节计数  

返回值：成功返回读取的字节数，出错返回\-1并设置errno，如果在调read之前已到达文件末尾，则这次read返回0 。



**2、fopen库函数**



**头文件**：\<stdio\.h\>  

**函数原型**：FILE \* fopen\(const char \* path, const char \* mode\);  

path字符串包含欲打开的文件路径及文件名，参数mode字符串则代表着流形态。  

mode有下列几种形态字符串:  

“r"或"rb” 以只读方式打开文件，该文件必须存在。  

“w"或"wb” 以写方式打开文件，并把文件长度截短为零。  

“a"或"ab” 以写方式打开文件，新内容追加在文件尾。  

"r\+"或"rb\+“或"r\+b” 以更新方式打开（读和写）  

"w\+"或"wb\+“或"w\+b” 以更新方式打开,并把文件长度截短为零。  

"a\+"或"ab\+“或"a\+b” 以更新方式打开，新内容追加在文件尾。  

字母b表示文件时一个二进制文件而不是文本文件。（linux下不区分二进制文件和文本文件）  

**返回值**：文件顺利打开后，指向该流的文件指针就会被返回。如果文件打开失败则返回NULL，并把错误代码存在errno 中。



fread是一个函数。从一个文件流中读数据，最多读取count个元素，每个元素size字节，如果调用成功返回实际读取到的元素个数，如果不成功或读到文件末尾返回 0。  

**函数原型**：size\_t fread \( void \*buffer, size\_t size, size\_t count, FILE \*stream\) ;  

**参 数**：  

buffer：用于接收数据的内存地址  

size：要读写的字节数，单位是字节  

count：要进行读写多少个size字节的数据项,每个元素是size字节\.  

stream：输入流  

**返回值**：实际读取的元素个数\.如果返回值与count不相同,则可能文件结尾或发生错误，从ferror和feof获取错误信息或检测是否到达文件结尾\.



fwrite：向文件写入一个数据块  

**函数原型**：size\_t fwrite\(const void\* buffer, size\_t size, size\_t count, FILE\* stream\);  

**参数**：  

buffer：是一个指针，对fwrite来说，是要获取数据的地址；  

size：要写入内容的单字节数；  

count:要进行写入size字节的数据项的个数；  

stream:目标文件指针；  

**返回值**：返回实际写入的数据块数目



fflush：把文件流里的所有为写出数据立刻写出。  

**函数原型**：int fflush\(FILE \*stream\);



fseek：是lseek系统调用对应的文件流函数。它在文件流里为下一次读写操作指定位置。  

函数原型：int fseek\(FILE \*stream, long offset, int fromwhere\);  

参数stream为文件指针  

参数offset为偏移量，正数表示正向偏移，负数表示负向偏移  

参数fromwhere设定从文件的哪里开始偏移,可能取值为：SEEK\_CUR、 SEEK\_END 或 SEEK\_SET  

SEEK\_SET： 文件开头  

SEEK\_CUR： 当前位置  

SEEK\_END： 文件结尾  

其中SEEK\_SET,SEEK\_CUR和SEEK\_END依次为0，1和2\.  

**返回值**：如果执行成功，stream将指向以fromwhere为基准，偏移offset（指针偏移量）个字节的位置，函数返回0。如果执行失败\(比如offset超过文件自身大小\)，则不改变stream指向的位置，函数返回一个非0值。



### 硬链接和软链接



Linux具有为一个文件起多个名字的功能，称为链接。



被链接的文件可以存放在相同的目录下，但是必须有不同的文件名，而不用在硬盘上为同样的数据重复备份。另外，被链接的文件也可以有相同的文件名，但是存放在不同的目录下，这样只要对一个目录下的该文件进行修改，就可以完成对所有目录下同名链接文件的修改。



对于某个文件的各链接文件，我们可以给它们指定不同的存取权限，以控制对信息的共享和增强安全性。



文件链接有两种形式，即硬链接和符号链接。



#### 软链接



1. 软链接，又叫符号链接，就是文件的内容是以文件B路径的形式存在。类似于Windows操作系统中的快捷方式

2. 软链接可以 跨文件系统 ，硬链接不可以

3. 软链接可以对一个不存在的文件名进行链接

4. 软链接可以对目录进行链接

    

#### 硬链接



硬链接是Unix系统，允许多个文件名指向同一个 `inode` 。



1. 硬链接，以文件副本的形式存在。但不占用实际空间。

2. 对文件内容修改会影响到所有文件名，但删除 `rm` 文件不影响另一个文件名的访问

3. 硬链接只有在同一个文件系统中才能创建

4. 不允许给目录创建硬链接，因为文件系统会为目录项创建 `./` `../` 两个硬链接，所以任何目录的链接数等于 2 \+ 子目录总数

    

```Bash
ln 为文件创建链接,默认的链接类型是硬链接。如果要创建符号链接必须使用"-s"选项。
# 创建一个与 abc.txt 共享相同的 i 节点的硬链接文件
ln abc.txt hardlink.txt 
# 创建指向 abc.txt 文件软链接文件
ln -s abc.txt softlink.txt  
```



### 文件信息



文件分为inode里 属性 i节点中12个指针指向数据块



\<sys/stat\.h\>库函数



```C
//成功返回0，失败返回-1 errno， statbuf传出参数
int stat(const char *pathname, struct stat *statbuf);

//专门用于获取符号链接（symlink）文件的信息
int lstat(const char *pathname, struct stat *statbuf);


struct stat {
    dev_t st_dev;         // 文件所在设备的设备号
    ino_t st_ino;         // 文件的i-node号
    mode_t st_mode;       // 文件权限和文件类型
    nlink_t st_nlink;     // 链接数
    uid_t st_uid;         // 文件所有者的用户ID
    gid_t st_gid;         // 文件所属组的组ID
    off_t st_size;        // 文件大小（字节数）
    blksize_t st_blksize; // 文件系统I/O操作的块大小
    blkcnt_t st_blocks;   // 文件占用的块数
    time_t st_atime;      // 最后访问时间
    time_t st_mtime;      // 最后修改时间
    time_t st_ctime;      // 最后状态改变时间
};
```



### 文件权限



表示为三组权限位：用户权限、组权限和其他权限。每个权限位可以设置为读取（r）、写入（w）和执行（x）的组合。



按位与（bitwise AND）通常用于检查某个用户是否具有特定权限。 



权限位是一个包含用户、组和其他权限的三位二进制数字。



例子：



```C++
if (权限位 & 4) {    // 用户具有读取权限}
}
```



\!\[微信截图\_20240417162320\.png\]\(D:\\study\\linux\\5\\微信截图\_20240417162320\.png\)



指令



```Bash
chmod [选项] 模式 文件    # change mode
# 模式 
数字模式：rwxrwxrwx对应二进制111000111，每三个转换成十进制：755
符号模式：使用符号来表示权限的增加或减少
        +（增加权限）、-（减少权限）和 =（设置权限）
        u+x 表示给所有者添加执行权限
```



### linux中的文件目录



```Plain Text
/
├── bin/          # Binaries (二进制文件)：存放最常用的用户命令，如 ls, cp, mv, cat 等, 一般无需修改。
├── boot/         # 启动文件：存放启动 Linux 时使用的核心文件，包括 GRUB 引导加载程序、内核镜像文件 (vmlinuz) 等。
├── dev/          # Device (设备)：存放 Linux 的外部设备文件，访问设备如同访问文件 /dev/null (空设备)。
│   ├── sda1      # 硬盘分区
│   ├── tty1      # 字符设备“c”，
│   └── null      # 空设备，用于
├── etc/          # Etcetera / Config：包括网络设置、用户账户、启动脚本和服务配置。
│   ├── passwd    # 用户账户信息文件，包含用户名、UID、GID、主目录、shell 等（不含密码）。
│   ├── shadow    # 用户密码文件，存放加密后的用户密码，只有 root 用户可读。
│   ├── group     # 用户组信息文件。
│   ├── sudoers   # sudo 命令的配置文件，指定哪些用户或组可以以 root 权限执行命令。
│   ├── fstab     # 文件系统表，定义系统启动时自动挂载的文件系统。
│   ├── hosts     # 主机名与 IP 地址的映射文件。
│   ├── resolv.conf # DNS 域名解析配置文件。
│   └── apt/      # (Debian/Ubuntu) APT 包管理器的配置文件目录。
│       └── sources.list # 软件源列表文件。
├── home/         # 用户主目录：普通用户的主目录，通常以用户账号命名，如 /home/alice。
│   └── alice/    # 示例用户主目录
│       ├── .bashrc   # 用户 Bash shell 配置文件。
│       ├── .profile  # 用户环境变量配置文件。
│       └── .ssh/     # 用户 SSH 客户端配置文件和密钥存储目录。
├── lib/          # Library (库)：存放系统最基本的动态连接共享库，类似于 Windows 的 DLL 文件，普通用户不要动。
├── lost+found/   # 丢失+找回：当系统非法关机或发生文件系统错误后，存放一些恢复的文件，通常为空。
├── media/        # 媒体挂载点：Linux 系统自动识别并挂载 U 盘、光驱等可移动设备，不需要管理权限，是用户访问的便捷入口。
├── mnt/          # 临时挂载点：系统管理员手动连接，临时挂载其他文件系统（如网络远程文件系统、备份磁盘）的目录。
├── opt/          # optional (可选)：给主机额外安装第三方大型软件（如 ORACLE 数据库、Web 服务器）的目录。
├── proc/         # Processes (进程)：虚拟文件系统，映射当前内核正在运行的进程的接口，是系统内存的映射，方便监控调试。
├── run/          # 可写的，供正在运行的进程使用，用于通信、状态跟踪或存储短期文件如进程ID、套接字。
├── root/         # 系统管理员主目录：超级权限用户（root）的主目录。
├── sbin/         # System Binaries：存放系统管理员使用的命令与程序，如 mount, fsck, ifconfig, shutdown。
├── selinux/      # Selinux 相关文件：Redhat/CentOS 特有，存放 SELinux 安全机制相关文件。
├── srv/          # Service 服务数据：存储系统提供服务的数据，如 FTP 服务、网络服务器的数据，可以换成使用var。
├── sys/          # sysfs 文件系统：Linux 2.6 内核引入，反映内核设备树，集成进程、设备、伪终端信息，可写入调整内核。
├── tmp/          # temporary (临时)：存放一些临时文件，系统重启时通常会被清空。
└── usr/          # Unix System Resources：用户应用程序和文件存放地，类似于 Windows 的 Program Files，建议只读。
    ├── bin/      # 系统用户使用的应用程序，包括大多数编译器的可执行文件（如 gcc, g++）。
    ├── sbin/     # 超级用户使用的比较高级的管理程序和系统守护程序。
    ├── local/    # 本地安装的软件：存放用户或管理员本地编译安装的软件，不随系统升级而改变。
    │   ├── bin/  # 本地安装软件的二进制可执行文件。
    │   ├── lib/  # 本地安装软件的库文件。
    │   └── src/  # 本地安装软件的源代码。
    ├── share/    # 共享数据：存放所有用户共享的只读数据，如文档、man 手册、图标等。
    ├── lib/      # 库文件：存放系统和应用程序的库文件。
    └── include/  # 头文件：存放 C/C++ 语言的头文件，用于编译程序。
└── var/          # variable (变量)：存放经常被修改的目录，包括各种日志文件、队列、缓存等。
    ├── lib/      # 有时候存在/usr/local的程序会在这里
    ├── log/      # 日志文件：存放系统和应用程序的各种日志文件，如 /var/log/messages, /var/log/syslog。
    ├── www/      # Web 服务器根目录：存放 Web 服务器（如 Apache, Nginx）的网站文件。
    ├── mail/     # 用户邮箱：存放用户接收的邮件。
    └── spool/    # 缓冲池：存放等待处理的数据，如打印队列、cron 任务等。
```



### 文件系统类型



> 通过 `man 5 fs` 可以查看多种文件系统的区别
> 
> 



- Ext3（Extended File System）提供日志功能（日记、顺序、）

    

- XFS 适用于大型文件和大容量存储

    

- JFS 日志文件系统，具有快速恢复能力和高性能。

    

## 九、脚本文件



[Shell 基本运算符 \| 菜鸟教程 \(runoob\.com\)](https://www.runoob.com/linux/linux-shell-basic-operators.html)2022102157



### 变量



```Bash
//大写字母常量
//等号两侧不打空格
_var="123"
_var="abc" 重新定义
readonly _var 只读，之后不能再修改
unset _var 删除变量

//使用变量前加$
//加花括号是为了帮助解释器识别变量的边界,属于变量替换
echo ${name}

字符串：
string="Hello,World!"/'Hello'
“$string”

整数：declare -i inte=42

数组(可以装不同类型)：
array=(1 2 3 4 5)
declare -A associative_array
associative_array["age"]=30

特殊变量：
脚本名称$0  脚本参数$1 $n 脚本参数内容字符串$* 参数内容多个字符串$@
参数数量$# 
上一指令返回值$? 当前进程pid$$ 最后运行进程pid $!

其他$:
命令替换：返回括号中命令的结果 $() 和 ``

变量替换：精准界定 ${}
取路径、文件名、后缀:
    \#是去掉左边(在键盘上 # 在 $ 之左边)

    %是去掉右边(在键盘上 % 在 $ 之右边)

    单一符号是最小匹配;两个符号是最大匹配

    *是用来匹配不要的字符，也就是想要去掉的那部分
${file#*/}

间接扩展：使用一个变量的值作为另一个变量的名称
${!variable}
```



### 控制语句



[Bash for循环 \- Bash Shell教程 \(yiibai\.com\)](https://www.yiibai.com/bash/bash-for-loop.html)



```Bash
if [ $var -gt $var2 ]; then
if (( > )); then
else if
else
fi

for x in list; do
for ((i;i<n;i++)) 
do
    echo $i
    continue
    break
done
//in列表种类
字符串:$string    空白作为分隔符
      "$STRING"  换行作为分隔符
整数范围：{1..10} {1..10..2}
数组：“${arr[@]}”

while read line; then
do
done>

for line in read
```



### 算术运算



```Bash
//执行计算公式，两个()！等价[] 运算式内变量不加$
delta=$((运算式))
delta=$[ condition ]
//echo将文本传给bc处理计算
root1=$(echo "scale=0; (-$b + sqrt($delta)) / (2 *$a)" | bc)
```



## 十、硬件管理



磁盘由一组盘组组成，包括多张\*\*盘片\*\*，分正反两面。



每个盘面配有一个读写磁头，磁头被固定在移动壁上同时跨磁道移动（钕磁铁电机，可达每秒20次），而移动磁头只能以串行方式读写（即读的方向是磁盘旋转的反方向）。写入是通过改变微小磁性区域（100nm2）的磁化方向为上或下，相邻磁极改变为1、不变为0（类似曼彻斯特编码）。



一个盘面可划分若干\*\*磁道\*\*，由外向里顺序从0开始编号，各个盘面同一垂直线上的磁道组成了一个\*\*柱面\*\*，此时盘道号即为柱面号。值得一提的是，外盘线速度大，被称为高速读写区，一般分给C盘系统盘使用。



每条磁道又分为若干\*\*扇区\*\*，各扇区之间留有空隙，沿与磁盘旋转相反的方向给扇区编号。每个扇区头为扇区头标、地址、数据（通常4KB）、纠错码。



格式化



硬盘和软盘区别在于



固态硬盘SSD内部无活动部件，使用浮栅晶体管存储电子，价格贵，恢复差。



### 硬盘磁盘



在 linux 下，计算机所有设备是以文件的形式存在的。



```Bash
1、lspci 列出所有的 PCI 设备
2、fdisk -l 查看存储设备信息
3、查看/proc 目录下相应的文件来查看一些设备信息
cat /proc/cpuinfo 查看 CPU 
```



#### 磁盘文件系统



##### IDE磁盘



文件名为：/dev/hdxx



编号规则：以 hd 加编号组成，1 个 IDE 通道可以连接 2 块硬盘，第一个硬盘叫master，第二个叫slave，/dev/hdbx



linux 的编号如下：

第一通道上的第一块为 hda

第一通道上的第二块为 hdb

第二通道上的第一块为 hdc

第二通道上的第二块为 hdd

其他的依次类推



##### SCSI/SATA/USB磁盘



文件名为：/dev/sdxx



编号规则：以 sd 加编号组成，1 个 scsi 通道可以连接 15 块硬盘（其中 1 个连接SCSI 卡）



第一通道上的第一块为 sda

第一通道上的第二块为 sab



##### 分区编号

在硬盘编号后面加上数字编号来表示第几块硬盘上的第几个分区

1—4 为主分区（扩展分区的编号）

5 以后为逻辑磁盘的编号



```Plain Text
/dev/hda      #表示第一个IDE硬盘
/dev/hda1     #表示第一块IDE硬盘的第一个主分区
/dev/hda2     #表示第一块IDE硬盘的扩展分区（或第二个主分区）
/dev/hda5     #表示第一块IDE硬盘的第一个逻辑分区
/dev/hda8     #表示第一块IDE硬盘的第四个逻辑分区
/dev/hdb      #表示第二个IDE硬盘
/dev/sda      #表示第一个SCSI硬盘
/dev/sda1     #表示第一个SCSI硬盘的第一个主分区
/dev/sdd3     #表示第四个SCSI硬盘的第三个主分区
```







```Bash
fdisk 磁盘管理命令
fdisk -l 显示磁盘分区信息的信息
fdisk /dev/sdb 对第二块 scsi 硬盘进行分区操作


mkfs 命令对磁盘进行文件系统的格式化
```



### 备份



`cpio`用来建立、还原备份档的工具程序



## 其他知识



#### 1\.声音文件\.wav



由windows开发，是无压缩的原始音频文件，遵照RIFF\(Resource Interchange File Format\)文件规范，便于学习。



通常使用三个参数来表示声音



- **量化位数**

    

    8位，16位，24位三种

    

- **取样频率**

    

    44kHz

    

- **采样点振幅**。

    

    单声道振幅数据为$n\*1$矩阵点，立体声为$n\*2$矩阵点

    

WAV格式文件所占容量（B\) = （取样频率 X 量化位数 X 声道） X 时间 / 8 \(字节= 8bit\)



WAV的文件头



1. **RIFF 标识**：4 个字节的 ASCII 字符串，用于标识文件类型。通常为 "RIFF"。

    

2. **文件大小**：4 个字节，表示文件总大小（包括文件头和音频数据）。

    

3. **WAVE 标识**：4 个字节的 ASCII 字符串，用于标识文件格式。通常为 "WAVE"。

    

4. **格式块标识**：4 个字节的 ASCII 字符串，用于标识格式块的开始。通常为 "fmt "。

    

5. **格式块大小**：4 个字节，表示格式块的大小（不包括格式块标识和大小字段本身）。

    

6. **音频格式**：2 个字节，表示音频数据的编码格式，例如 PCM。

    

7. **声道数**：2 个字节，表示音频数据的声道数，例如单声道或立体声。

    

8. **采样率**：4 个字节，表示音频数据的采样率，即每秒采样的样本数。

    

9. **数据传输速率**：4 个字节，表示数据传输速率（每秒字节数）。

    

10. **块对齐**：2 个字节，表示每个采样点的字节数（包括所有声道）。

    

11. **样本大小**：2 个字节，表示每个采样点的位深度。

    

12. **数据块标识**：4 个字节的 ASCII 字符串，用于标识数据块的开始。通常为 "data"。

    

13. **数据大小**：4 个字节，表示音频数据的大小（不包括数据块标识和大小字段本身）。

    

#### 2\. 网页



###### 1\.开发者模式



Device Mode 切换到移动设备优先的完全自适应式网站 可以选择设备



Media 



Elements



\.\.\.



###### 2\.HTTP协议



> Internet 全球性的计算机网络体系结构，包括万维网（WWW）、电子邮件、文件传输协议（FTP）、即时通讯
> 
> 
> 
> [Http协议详解\(深入理解\)\_http通信协议详解\-CSDN博客](https://blog.csdn.net/weixin_38087538/article/details/82838762)
> 
> 



    HTTP协议，即超文本传输协议\(Hypertext transfer protocol\)。用于从WWW服务器传输超文本到本地浏览器的传送协议。



    HTTP是一个应用层协议，由请求和响应构成，是一个标准的客户端服务器模型。



    在Internet中所有的传输都是通过TCP/IP进行的。HTTP协议作为TCP（传输层）/IP（网络层）模型中应用层的协议也不例外。HTTP协议通常承载于TCP协议之上，有时也承载于TLS或SSL协议层之上，这个时候，就成了我们常说的HTTPS。



    HTTP默认的端口号为80，HTTPS的端口号为443。



1. HTTP客户端发起一个请求，建立一个到服务器指定端口（默认是80端口）的TCP连接。

    

2. 每个Web站点都运行一个服务器进程,它不断地监听TCP的端口80,以便发现是否有向它发来连接请求；

    

3. 一旦收到请求并建立了TCP连接之后,浏览器就向服务器发出某个页面的请求,服务器接着就返回请求的页面作响应；

    

4. 最后连接被释放。这之间一系列信息的传输都遵循HTTP。

    

HTTP 有两类报文：



    请求报文——从客户向服务器发送请求报文。



    响应报文——从服务器到客户的回答。



HTTP构成



1. 请求方法

    

HTTP是一个客户端和服务器端请求和应答的标准（TCP）。



客户端（浏览器、爬虫）称为user agent，有资源的应答服务器称为origin server。在用户代理和源服务器中间可能存在多个中间层，比如代理，网关，或者隧道（tunnels）。



TCP socket是在网络通信中用于建立 TCP 连接的端点, 应用程序可以创建一个 TCP Socket来尝试连接到远程主机，或者等待远程主机的连接请求, 一旦连接建立，双方的 Socket 之间就会形成一个全双工的通信通道，可以通过这个通道进行数据的发送和接收。



3. **统一资源定位符URL\(Uniform Resource Locator\)**

    

###### 3\.TCP回声服务器



**什么是TCP？**



  TCP 的全称为传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、基于[字节流](https://so.csdn.net/so/search?q=%E5%AD%97%E8%8A%82%E6%B5%81&spm=1001.2101.3001.7020)的传输层通信协议。



**什么是回声服务器？**



  \*\*回声服务器\*\*是指一种收到客户端发送的消息后，将消息回传至客户端服务器，这种服务器代码简单，但功能健全，非常适合帮助初学者理解网络编程中TCP协议。



\!\[linux\_tcp\.png\]\(C:\\Users\\Jacob Du\\Desktop\.md\\linux\_tcp\.png\)



#### 3\.git



git是一个分布式版本控制系统，用于跟踪文件的更改和协助多人合作开发，广泛使用在各种项目源代码管理，支持快速、创建合并分支，可以在不影响主代码库下创建和测试新的功能，分布式表示大多数操作在本地进行，比集中式更快速；git是开源社区，支持任何人贡献代码和提意见。



SVN与Git的最主要的区别？

SVN是集中式版本控制系统，版本库是集中放在中央服务器的，而干活的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后干活，干完后，需要把自己做完的活推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，如果网速慢的话，就纳闷了。

Git是分布式版本控制系统，那么它就没有中央服务器的，每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，因为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件A，其他人也在电脑上改了文件A，这时，你们两之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。



github

基于web的版本控制和代码管理平台，主要提供git的版本控制功能，还有项目管理等功能，是个强大开发者的生态系统社区



流程：

1. 配置本地git用户名和邮箱

```Plain Text
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
--global表示你这台机器上所有的Git仓库都会使用这个配置
git config -l 可以查看已有的配置
```



2. 创建SSH Key, 在github上保存刚生成好的公钥。

```Bash
$ cd ~
$ ssh-keygen -t rsa -C "ntc_ip_rbm@163.com"
输入 .ssh/id_rsa 文件的路径，默认即可（需要保存多个公钥时可以更换路径）
然后输入自定义私钥密码（下次pull或者push操作时用来确认你的身份）
```

"SSH and GPG Keys"页面： 然后，点"New SSH Key"，填上任意Title，在Key文本框里粘贴 id\_rsa\.pub 文件的内容



3. 创建本地版本库

    

```Bash
mkdir testgit
通过 git init 命令把这个目录变成Git可以管理的仓库
# 创建empty Git repository
# .git目录是Git来跟踪管理版本库的
```



工作区就是创建仓库的文件夹如（testgit文件夹就是一个工作区）



版本库就是工作区的隐藏目录\.git



版本库中有暂存区（stage/index）和分支（master）



git add 实际是把文件添加到暂存区 git commit 把暂存区的内容提交到当前分支



4. 在本地版本库testgit里放入一些代码或文件

    

```Bash
mkdir src
echo “readme” > ./src/readme.txt

$ git status 
可以查看工作区有改动
$ git add .
更新本地版本库(.指当前所有目录及文件)

仅仅是提交一个文件,可以这样写git add readme.txt
更新一个目录这样写：git add src/

！此时还没有真正提交到版本库,只是从工作区放到暂存区。
```



5. 执行更新操作

    

```Bash
$ git commit -m "相关说明"    #提交到了本地版本库的master分支（默认）。
$ git log    #查看提交记录
一般情况，如果是个人开发，主要就是 git add 命令和 git commit 命令：
提交更改至暂存区，然后提交到分支。
如果是团队协作，需要统一在远程版本库交换更改，就要用到 git pull 和 git push 命令了。
```



注意：git本身并不依赖远程版本库，这点和svn不一样。远程版本库的作用是方便交换更改，如github。



#### 4\.软件架构



**资源分类**



静态资源：使用静态网页开发技术（\*\*HTML、CSS、JavaScript\*\*）发布的资源



- 特点：所有用户访问，得到的结果一样

- **如果用户请求的是静态资源，那么服务器会直接将静态资源发送给浏览器，浏览器中内置了静态资源的解析引擎，可以解析静态资源（浏览器只能解析静态资源！）**。因为每个浏览器的解析引擎可能不一样，所以相同的网页可能在不同浏览器展示有所区别。

- HTML：搭建基础网页，展示页面的内容

- CSS：布局美化页面

- JavaScript：控制页面元素，让页面有动态效果

    

动态资源：使用动态网页开发技术（\*\*jsp/servlet,php,asp\.\.\.\*\*）发布的资源



- 特点：所有用户访问，得到的结果可能不一样

- \*\*如果用户请求的是动态资源，那么服务器会执行动态资源，转换为静态资源，再发送给浏览器（浏览器无法解析动态资源！）

    

#### 5\. Docker



[前端程序员如何学习 Docker （一） \(zsxq\.com\)](https://articles.zsxq.com/id_mcuo90bszsfx.html)



Docker是开源的应用容器引擎，允许开发者将应用程序和依赖环境打包到一个可移植的容器，类似一个沙箱，能够在支持docker的地方运行。



Dockerhub是Docker官方服务器，是最大的容器镜像库，可以在上面存储分享和管理容器镜像。



#### 6\. tmux



Session会话



Window窗口



启动新会话：



```Plain Text
tmux [new -s 会话名 -n 窗口名]
```



恢复会话：



```Plain Text
tmux at [-t 会话名]
```



列出所有会话：



```Plain Text
tmux ls
```



关闭会话：



```Plain Text
tmux kill-session -t 会话名
```



关闭所有会话：



```Plain Text
tmux ls | grep : | cut -d. -f1 | awk '{print substr($1, 0, length($1)-1)}' | xargs kill
```



窗格（分割窗口）



```Plain Text
%  垂直分割
"  水平分割
o  交换窗格
x  关闭窗格
⍽  左边这个符号代表空格键 - 切换布局
q 显示每个窗格是第几个，当数字出现的时候按数字几就选中第几个窗格
{ 与上一个窗格交换位置
} 与下一个窗格交换位置
z 切换窗格最大化/最小化
```



窗格快捷键



```Bash
Ctrl+b %：划分左右两个窗格。
Ctrl+b "：划分上下两个窗格。
Ctrl+b <arrow key>：光标切换到其他窗格。<arrow key>是指向要切换到的窗格的方向键，比如切换到下方窗格，就按方向键↓。
Ctrl+b ;：光标切换到上一个窗格。
Ctrl+b o：光标切换到下一个窗格。
Ctrl+b {：当前窗格与上一个窗格交换位置。
Ctrl+b }：当前窗格与下一个窗格交换位置。
Ctrl+b Ctrl+o：所有窗格向前移动一个位置，第一个窗格变成最后一个窗格。
Ctrl+b Alt+o：所有窗格向后移动一个位置，最后一个窗格变成第一个窗格。
Ctrl+b x：关闭当前窗格。
Ctrl+b !：将当前窗格拆分为一个独立窗口。
Ctrl+b z：当前窗格全屏显示，再使用一次会变回原来大小。
Ctrl+b Ctrl+<arrow key>：按箭头方向调整窗格大小。
Ctrl+b q：显示窗格编号。 
```



窗口快捷键



```Bash
窗口快捷键
Ctrl+b c：创建一个新窗口，状态栏会显示多个窗口的信息。
Ctrl+b p：切换到上一个窗口（按照状态栏上的顺序）。
Ctrl+b n：切换到下一个窗口。
Ctrl+b <number>：切换到指定编号的窗口，其中的<number>是状态栏上的窗口编号。
Ctrl+b w：从列表中选择窗口。
Ctrl+b ,：窗口重命名。
end
```



## 总结

