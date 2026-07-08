---
lang: zh-CH
title: 测试与部署运维
description: 部署、测试、bug记录
date: 2025-8-10
category:
  - 后端开发
tag:
  - 测试
---
https://www\.nowcoder\.com/discuss/353159520220291072

https://github\.com/heibaiying/BigData\-Notes

## Reminder

安装路径注意要干净、不能有中文，部分软件如nginx非常敏感

检查端口占用 `lsof -i :8080`

杀死进程 `kill -9 pid`

Windows的路径用的是 `\` 而不是 `/`，需要注意。

## 部署

首先

### 云原生部署

Linux 脚本

### Docker

#### 概念

**容器Container**，首先是一种对进程进行隔离（process isolation）的运行环境，它将应用程序及其所有依赖项（包括库、配置文件、系统工具等）封装在一个标准化的包中，使得其轻量、可移植。这种隔离在操作系统层面隔离，和宿主共享OS内核。

**镜像Image**，是容器的静态模板，包含了应用程序运行所需的所有依赖和文件。镜像是不可变的。

在Linux系统就是用Namespace（视图隔离）和Cgroup（资源限制和分配）两大功能实现的。一个被隔离的进程，操作系统也会正常分配进程ID，比如12345，但是隔离进程自己看到的ID总是1。

[https://blog\.nginx\.org/blog/what\-are\-namespaces\-cgroups\-how\-do\-they\-work](https://blog.nginx.org/blog/what-are-namespaces-cgroups-how-do-they-work)

Docker is an open source container service provider

#### 本体使用

在Linux中使用`sudo systemctl start docker`启动Docker。

虚拟化：

1. 端口映射

2. 目录映射

#### 使用容器（已有镜像）

使用命令docker images列出本地主机上的镜像，Docker可以使用run命令为一个镜像创建容器。创建后这个容器的生命周期为：

- created（已创建）

- restarting（重启中）

- running 或 Up（运行中）

- removing（迁移中）

- paused（暂停）

- exited（停止）

- dead（死亡）

创建指令run的参数如下：

- \-d: 附着，以进程形式在后台运行并输出容器ID

- \-gpus all: 传递所有gpu资源

- **\-i:** 交互，允许你对容器内的标准输入 \(STDIN\) 进行交互。

- **\-t:** tty，在新容器内指定一个伪终端或终端。

- \-\-network network: 容器联网

- \-p: 端口映射，

- \-rm: 退出时自动移除容器与匿名卷（volume）

- \-v: 挂载，将主机目录映射上

在命令部分使用/bin/bash进入容器，使用exit推出容器，此时容器变为停止，重新启动使用start指令。

```Bash
docker run [OPTION] container [command] [args]
docker run -it ubuntu:15.10 /bin/bash

docker run --network bridge -it 4afebf4740f3 /bin/bash
docker run -d -p 2222:22 --name fate2 --privileged=true 2298e1e58064 /usr/sbin/init
docker run -itd -p 10008:10008 -v 
```

后台容器使用\-d参数，使用stop停止。可以使用attach命令进入。

```Bash
docker run -itd --name ubuntu-test ubuntu /bin/bash

docker attach 1e560fca3906 
```

检查正在运行的容器docker ps，docker ps \-a可以列出包括已停止的容器。

查看容器内标准输出docker logs CONTAINER\_ID。

删除容器使用docker rm，docker container prune清除所有停止容器

#### 下载使用镜像

本地镜像不存在则从镜像仓库Docker Hub下载公共镜像，我们可以从 Docker Hub 网站来搜索镜像，Docker Hub 网址为： [**https://hub\.docker\.com/**](https://hub.docker.com/)

```Bash
docker pull ubuntu:13.10

```

删除镜像使用



指令

传输文件

COPY

#### 创建镜像

##### 从已经创建的容器中更新镜像



##### 使用Dockerfile创建

1. 制作Dockerfile（参考代码托管平台同类项目配置文件）

2. COPY、RUN）

```Bash
#-- SpringBoot项目
# 依赖的镜像
FROM maven:3.5-jdk-8-alpine as builder

# 将需要运行文件放在镜像
WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn package -DskipTests

# 运行镜像时执行
CMD ["java", “-jar”, "/app/target/xx.jar", "--xx"]

#-- 前端项目
FROM nginx

WORKDIR
USER
COPY nginx.conf etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

3. 根据Dockfile制作镜像

根据 Dockefile 构建存储在本地镜像仓库
docker build \-t "name:tag" \-f "dockerfile" 
\# 将以构建的镜像导出为tar包用于传输
docker save \-o myapp\.tar myapp:latest



4. 可使用多阶段构建来优化

#### 如何进行运维



### Docker\-Composed容器编排

1、为了完成一个完整项目势必用到N多个容器（一个容器只运行一个进程）配合完成项目中业务开发，一旦引入N多个容器，容器之间就会形成某种依赖，也就意味某个容器或某些容器的运行需要其他容器优先启动之后才能正常运行。容器的编排显得至关重要，容器的运行一定要有先后顺序。

2、现在这种方式使用容器，没有办法站在项目的角度将一个项目用到的一组容器划分到一起，日后难点在于项目的多服务器部署。比如项目在当前服务器上运行成功，需要将项目再部署到另一台服务器上，但我们不清楚哪组容器是项目引用的，哪组容器是别的引用的。

构建并启动服务

docker\-compose up \-\-build



后台运行

docker\-compose up \-d \-\-build



查看服务状态

docker\-compose ps



查看日志

docker\-compose logs \-f backend

docker\-compose logs \-f frontend

docker\-compose\.yml

version: "3" \# v2之后这行不需要了

services:

web:

build:

ports:

\- "80:5000"

db:

image: "mysql"

environment:

MYSQL\_DATABASE: myleaf\-db

MYSQL\_ROOT\_PASSWORD: secret

volumes:

\- my\-leaf\-data:/var/lib/mysql



数据卷

volumes:

my\-finance\-data:

## NGINX



`~` ：表示使用正则表达式进行匹配，且区分大小写。

`^~` ：表示如果请求的 URI 与该前缀匹配，则立即使用此配置块，而不再检查其他正则表达式匹配。

`http` 全局，影响所有服务器和位置

`server` 特定服务器

`location` 特定URL路径

### 跨域问题

跨域问题是**浏览器**为保护用户的政策，根本原因是**同源策略**，所谓同源是指域名，协议，端口相同，但浏览器只认同一域名同一端口，如果后端在8080端口而前端在8081端口，则提示拒绝访问；如果协议不同，如http和https，也不允许；域名和对应IP，还是不允许。

由于跨域问题是由浏览器拒绝访问引起，因此可以使用开发者模式来查看，通常`Referrer Policy` 一栏会显示 `strict-origin-when-cross-origin`

### 解决方法跨域问题

首先定位问题：是什么导致跨域问题：协议？

1. 通过CORS，浏览器默认支持，只需实现对应接口即可，如实现`WebMvcConfigurer`。此时后端应当会在响应中出现携带CORS的响应头，如：
Access\-Control\-Allow\-Origin
Access\-Control\-Allow\-Credentials



2. 通过nginx的反向代理



注意：若使用https连接必须使用nginx的话，可以使用以下配置搭配CORS

set $cors '';

if \($http\_origin \~ '^https?://\(localhost\|www\\\.yourdomain\\\.com\|www\\\.yourotherdomain\\\.com\)'\) \{
        set $cors 'true';

\}



if \($cors = 'true'\) \{
        add\_header 'Access\-Control\-Allow\-Origin' "$http\_origin" always;

add\_header 'Access\-Control\-Allow\-Credentials' 'true' always;

add\_header 'Access\-Control\-Allow\-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;

add\_header 'Access\-Control\-Allow\-Headers' 'Accept,Authorization,Cache\-Control,Content\-Type,DNT,If\-Modified\-Since,Keep\-Alive,Origin,User\-Agent,X\-Requested\-With' always;

\# required to be able to read Authorization header in frontend

\#add\_header 'Access\-Control\-Expose\-Headers' 'Authorization' always;

\}



if \($request\_method = 'OPTIONS'\) \{

\# Tell client that this pre\-flight info is valid for 20 days

add\_header 'Access\-Control\-Max\-Age' 1728000;

add\_header 'Content\-Type' 'text/plain charset=UTF\-8';

add\_header 'Content\-Length' 0;

return 204;

\}

### 反向代理

反向代理区别于正向代理，正向代理是Client用户通过代理服务器发送请求，以保护隐藏自身IP地址或者访问本来访问不到网站；而反向代理则是服务器端通过设置代理服务器隐藏真实服务器地址，防止被攻击。代理网关可用于防范DDOS攻击，它只允许正常的有机流量通过，而阻止恶意流量到达服务器

除了安全考虑，代理服务器通过配置可以实现负载均衡，为多个后端服务器分配任务

### 如何配置？

相关文档 [https://github\.com/h5bp/server\-configs\-nginx](https://github.com/h5bp/server-configs-nginx)

监听前端端口，设置root定位到服务器静态资源

Nginx的默认配置文件通常位于 `etc/nginx/nginx.conf` 

user  www www;

# 工作进程数量

worker\_processes auto;

error\_log  /www/wwwlogs/nginx\_error\.log  crit;

pid        /www/server/nginx/logs/nginx\.pid;

worker\_rlimit\_nofile 51200;



stream \{

log\_format tcp\_format '$time\_local\|$remote\_addr\|$protocol\|$status\|$bytes\_sent\|$bytes\_received\|$session\_time\|$upstream\_addr\|$upstream\_bytes\_sent\|$upstream\_bytes\_received\|$upstream\_connect\_time';



access\_log /www/wwwlogs/tcp\-access\.log tcp\_format;

error\_log /www/wwwlogs/tcp\-error\.log;

include /www/server/panel/vhost/nginx/tcp/\*\.conf;

\}

# 事件区块开始

events

\{

use epoll;

\# 单个进程最大连接数

worker\_connections 51200;

multi\_accept on;

\}

# 设定http服务器，利用反向代理提供负载均衡支持

http

\{

\# 导入外部文件

include       mime\.types;

\#include luawaf\.conf;



include proxy\.conf;

lua\_package\_path "/www/server/nginx/lib/lua/?\.lua;;";

\# 默认文件类型

default\_type  application/octet\-stream;



server\_names\_hash\_bucket\_size 512;

client\_header\_buffer\_size 32k;

large\_client\_header\_buffers 4 32k;、

\# 文件上传大小限制

client\_max\_body\_size 50m;



sendfile   on;

tcp\_nopush on;

\# 长连接超时时间

keepalive\_timeout 60;



tcp\_nodelay on;



fastcgi\_connect\_timeout 300;

fastcgi\_send\_timeout 300;

fastcgi\_read\_timeout 300;

fastcgi\_buffer\_size 64k;

fastcgi\_buffers 4 64k;

fastcgi\_busy\_buffers\_size 128k;

fastcgi\_temp\_file\_write\_size 256k;

fastcgi\_intercept\_errors on;



gzip on;

gzip\_min\_length  1k;

gzip\_buffers     4 16k;

gzip\_http\_version 1\.1;

gzip\_comp\_level 2;

gzip\_types     text/plain application/javascript application/x\-javascript text/javascript text/css application/xml application/json image/jpeg image/gif image/png font/ttf font/otf image/svg\+xml application/xml\+rss text/x\-js;

gzip\_vary on;

gzip\_proxied   expired no\-cache no\-store private auth;

gzip\_disable   "MSIE \[1\-6\]\\\.";



limit\_conn\_zone $binary\_remote\_addr zone=perip:10m;
                limit\_conn\_zone $server\_name zone=perserver:10m;



server\_tokens off;

access\_log off;

# 第一个server区块，表示一个独立的虚拟主机站点

server

\{

listen 888;

\# 提供服务的域名主机名

server\_name phpmyadmin;

index index\.html index\.htm index\.php;

root  /www/server/phpmyadmin;

\# 禁用代理缓存

proxy\_cache off;

proxy\_no\_cache 1;

proxy\_cache\_bypass 1;

\#error\_page   404   /404\.html;

include enable\-php\.conf;



location \~ \.\*\\\.\(gif\|jpg\|jpeg\|png\|bmp\|swf\)$

\{

expires      30d;

\}



location \~ \.\*\\\.\(js\|css\)?$

\{

expires      12h;

\}



location \~ /\\\.

\{

deny all;

\}



access\_log  /www/wwwlogs/access\.log;

\}

include /www/server/panel/vhost/nginx/\*\.conf;

\}



网站的 `vhost\nginx\域名.conf`

server

\{

listen 80;

listen 443 ssl http2 ;

listen \[::\]:443 ssl http2 ;

listen \[::\]:80;

server\_name swiftbi\.top 43\.135\.100\.246;

index index\.php index\.html index\.htm default\.php default\.htm default\.html;

root /www/wwwroot/swiftbi\.top;





\#CERT\-APPLY\-CHECK\-\-START

\# 用于SSL证书申请时的文件验证相关配置 \-\- 请勿删除

include /www/server/panel/vhost/nginx/well\-known/swiftbi\.top\.conf;

\#CERT\-APPLY\-CHECK\-\-END



\#SSL\-START SSL相关配置，请勿删除或修改下一行带注释的404规则

\#error\_page 404/404\.html;

\#HTTP\_TO\_HTTPS\_START

set $isRedcert 1;
    if \($server\_port \!= 443\) \{

set $isRedcert 2;
    \}
    if \( $uri \~ /\\\.well\-known/ \) \{

set $isRedcert 1;
    \}
    if \($isRedcert \!= 1\) \{

rewrite ^\(/\.\*\)$ https://$host$1 permanent;
    \}
    \#HTTP\_TO\_HTTPS\_END
    ssl\_certificate    /www/server/panel/vhost/cert/swiftbi\.top/fullchain\.pem;
    ssl\_certificate\_key    /www/server/panel/vhost/cert/swiftbi\.top/privkey\.pem;
    ssl\_protocols TLSv1\.1 TLSv1\.2 TLSv1\.3;
    ssl\_ciphers EECDH\+CHACHA20:EECDH\+CHACHA20\-draft:EECDH\+AES128:RSA\+AES128:EECDH\+AES256:RSA\+AES256:EECDH\+3DES:RSA\+3DES:\!MD5;
    ssl\_prefer\_server\_ciphers on;
    ssl\_session\_tickets on;
    ssl\_session\_cache shared:SSL:10m;
    ssl\_session\_timeout 10m;
    add\_header Strict\-Transport\-Security "max\-age=31536000";
    error\_page 497  https://$host$request\_uri;



\#SSL\-END



\#ERROR\-PAGE\-START  错误页配置，可以注释、删除或修改

error\_page 404 /404\.html;

\#error\_page 502 /502\.html;

\#ERROR\-PAGE\-END



\#PHP\-INFO\-START  PHP引用配置，可以注释或修改

include enable\-php\-00\.conf;

\#PHP\-INFO\-END



\#REWRITE\-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效

include /www/server/panel/vhost/rewrite/swiftbi\.top\.conf;

\#REWRITE\-END





\#API\-PROXY\-START API代理配置

\# 增加文件上传大小限制

client\_max\_body\_size 100M;

client\_body\_buffer\_size 128k;

client\_body\_timeout 120s;



\# API接口代理到后端

location /api/ \{

proxy\_pass http://127\.0\.0\.1:8080;  \# 改为你的后端实际端口

proxy\_set\_header Host $host;
        proxy\_set\_header X\-Real\-IP $remote\_addr;

proxy\_set\_header X\-Forwarded\-For $proxy\_add\_x\_forwarded\_for;
        proxy\_set\_header X\-Forwarded\-Proto $scheme;



\# 文件上传相关设置

proxy\_request\_buffering off;

proxy\_read\_timeout 300s;

proxy\_connect\_timeout 75s;

proxy\_send\_timeout 300s;



\# 支持大文件上传

proxy\_max\_temp\_file\_size 0;

proxy\_buffering off;

\}

\#API\-PROXY\-END





\#禁止访问的文件或目录

location \~ ^/\(\\\.user\.ini\|\\\.htaccess\|\\\.git\|\\\.env\|\\\.svn\|\\\.project\|LICENSE\|README\.md\)

\{

return 404;

\}



\#一键申请SSL证书验证目录相关设置

location \~ \\\.well\-known\{

allow all;

\}



\#禁止在证书验证目录放入敏感文件

if \( $uri \~ "^/\\\.well\-known/\.\*\\\.\(php\|jsp\|py\|js\|css\|lua\|ts\|go\|zip\|tar\\\.gz\|rar\|7z\|sql\|bak\)$" \) \{

return 403;

\}



location \~ \.\*\\\.\(gif\|jpg\|jpeg\|png\|bmp\|swf\)$

\{

expires      30d;

error\_log /dev/null;

access\_log /dev/null;

\}



location \~ \.\*\\\.\(js\|css\)?$

\{

expires      12h;

error\_log /dev/null;

access\_log /dev/null;

\}

access\_log  /www/wwwlogs/swiftbi\.top\.log;

error\_log  /www/wwwlogs/swiftbi\.top\.error\.log;

\}

## CI/CD 持续集成/部署

自动且持续地测试、构建和发布代码更改到部署环境，意味着当开发人员将新代码提交到gitlab库，gitlab将自动执行为项目配置的CICD管道

实例托管器，托管多台服务器

## 加密

**API 密钥对于确保系统访问安全至关重要，但处理不当可能会导致类似 2019 年 Capital One 事件或 Uber 2018 年数据泄露事件等违规行为。**

以下是确保您的 API 密钥安全的 10 个关键做法：

1. **使用强加密**：应用 AES\-256 存储密钥，使用 TLS 1\.3\+ 进行传输。

2. **设置明确的访问限制**：遵循基于角色的访问控制（RBAC）的最小特权原则。

3. **安排定期密钥更新**：根据风险级别每 30\-90 天轮换一次密钥。

4. **安全存储密钥**：使用秘密管理工具，如 AWS Secrets Manager 或 HashiCorp Vault。

5. **跟踪密钥使用情况**：监控请求量、错误率和地理数据等指标。

6. **控制请求限制**：实施分层速率限制，以防止滥用。

7. **将密钥保留在客户端之外**：使用服务器端代理和基于令牌的身份验证。

8. **检查服务器安全性**：使用防火墙、网络分段和监控来保护 API 服务器。

9. **定期检查密钥使用情况**：每月审核访问模式和权限。

10. **快速密钥删除计划**：拥有集中式仪表板和自动化紧急情况脚本。

**快速提示**：加密密钥、监控其使用情况并定期轮换密钥以降低风险。使用 API 网关等工具实现自动化和增强控制。

这些做法结合起来，可以为您的 API 基础设施构建强大的防御。立即开始实施这些做法，以保护您的数据并维护用户信任。

## 风控



## 服务监控



w微服务实例监控

容器实例监控

JVM与数据库监控

中间件监控

操作系统监控

## JMeter性能测试

### 关注指标与计算

- 吞吐量 

    - 目标吞吐量

    - 基于计算吞吐量

- CPU占用率

- 内存占用率

- 响应时间

    - 

- 最大并发用户数

- HTTP每秒错误请求数

- 网络延迟时间



### 测试过程

线程数

Ramp\-Up 表示在n秒内均匀启动线程

A/B测试

### 全链路压力测试

压测场景设计：同一时刻大量请求带给服务器的压力

压测目标设定

数据准备

执行与调整

报告与复盘

## 线上问题处理经验

### 缓存问题

#### 穿透



- 雪崩

- 失效

- 热点缓存重建

- 缓存数据库双写不一致

消息中间件

- 消息丢失

- 消息重复消费

- 消息积压

- 消息乱序

- 消息回溯



中间件问题

- 羊群效应

- 脑裂问题

- 哈希碰撞

- 时钟回拨

- 拒绝连接



系统问题

- 内存泄漏

- 重复提交

- 指令重排

- 系统假死

- 数据倾斜

线上故障管理

- 故障监控发现

- 故障分析与定位

- 故障恢复/管理

- 线上真是故障场景

- 故障预防



## 性能调优



ServiceMesh

## 优化

回归测试、发布前

防劣化\-线上

线上监控

线上监控

性能测试：核心链路自动化

## 云服务

### 名词解释

- AWS

- AMI

- EC2：Elastic Compute Cloud

