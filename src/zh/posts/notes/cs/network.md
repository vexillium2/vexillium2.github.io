---
lang: zh-CH
title: 计算机网络学习笔记
description: Web开发、网络工程、安全
date: 2024-11-10
category:
  - 后端开发
tag:
  - 网络工程
---
## 网络与Web开发

#### OSI七层协议

物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

#### TCP/IP协议

网络接口层、网络层、传输层、应用层

Browser/Server架构好处（对比C/S）：1\.只需更新服务器端代码即可完成系统升级，方便服务器开发、维护；2\.降低客户端开发成本，只用适应浏览器而非系统；3\.跨平台、响应式设计交互表现好、方便客户端

### TCP

TCP连接：传输层（面向字节流传输报文段）



### HTTP

HTTP连接：应用层（本身无连接无状态）

HTTP请求/响应：HTTP头（Header：value格式）Body

编写HTTP Server：

#### HTTP对象的主要属性

- 状态码status

```Plain Text
200 OK：表示成功；
201 Created：服务器成功创建了资源；
301 Moved Permanently：表示该URL已经永久重定向；
302 Found：表示该URL需要临时重定向；
304 Not Modified：表示该资源没有修改，客户端可以使用本地缓存的版本；
400 Bad Request：表示客户端发送了一个错误的请求，例如参数无效；
401 Unauthorized：表示客户端因为身份未验证而不允许访问该URL；
403 Forbidden：表示服务器因为权限问题拒绝了客户端的请求；
404 Not Found：表示客户端请求了一个不存在的资源；
500 Internal Server Error：表示服务器处理时内部出错，例如因为无法连接数据库；
503 Service Unavailable：表示服务器此刻暂时无法处理请求。
```



- 响应头对象headers

'content\-type': 'application/json',

'content\-length': '123',

'cache\-control': 'no\-cache',

'set\-cookie': 'session=abc123',

'x\-frame\-options': 'DENY',



- 数据data：即请求体body

#### 主流 Java HTTP 通信库



##### Java 原生 HttpClient、HttpServer 客户 / 服务端



优点：支持异步/HTTP2

缺点：Client 功能不如 OkHttp 丰富；Server 性能差，不支持并发，不适合生产环境

```Java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:8080"))
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```



##### OkHttp 客户端



优点：简洁、轻量、使用简单

缺点：支持异步、连接池、超时控制丰富

```Java
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url("http://localhost:8080")
    .build();

Response response = client.newCall(request).execute();
```



##### Apache HttpClient 客户端



优点：功能全面、成熟稳定，支持复杂请求配置（代理、认证等）

##### Netty 服务器端

优点：超高性能，异步非阻塞，底层控制粒度高

缺点：编码复杂（Handler 层层嵌套）、开发效率低，需大量样板代码

##### SpringBoot WebMVC 服务器端

优点：依赖注入丰富，集成方便

缺点：同步阻塞，适合传统 Web 应用，对于高并发效率一般

##### Vert\.x 服务器端



优点：高性能异步非阻塞

缺点：学习曲线稍陡（回调/响应式）

```Plain Text
router.route().handler(ctx -> {
    HttpServerRequest request = ctx.request();
    String uri = request.uri();                   // 请求 URI
    String method = request.method().name();     // 请求方法：GET/POST/...
    MultiMap params = request.params();          // 查询参数
    request.bodyHandler(buffer -> {              // 读取请求体（异步）
        System.out.println(buffer.toString());
    });
});
```



Web服务器：专门处理HTTP请求和响应；实现Servlet API接口来自定义Servlet

Servlet：服务器端用于处理Web请求的Java程序，编写自己的Servlet继承自HttpServlet\(maven导入war\)，然后覆写doGet\(\)或doPost\(\)方法，这两个方法传入的是HttpServletRequest和HttpServletResponse两个对象



```Plain Text
public class HelloServlet extends HttpServlet{
protected void doGet(HttpServletRequest req, HttpServletResponse resp)

}
```



#### SSL / TLS 协议



SSL（安全套接字层）



### API 文档

https://zhuanlan\.zhihu\.com/p/25506654

1. 正确使用 [HTTP Method](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=HTTP+Method&zhida_source=entity) 和路由

2. 正确的使用 [HTTP 状态码](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=HTTP+%E7%8A%B6%E6%80%81%E7%A0%81&zhida_source=entity)

3. 使用 [HTTP Header](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=HTTP+Header&zhida_source=entity) 来发送元数据

4. 为 REST API 挑选合适的框架

5. 要对 API 进行黑盒测试

6. 使用基于 [JWT](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=JWT&zhida_source=entity) 的无状态的认证机制

7. 学会使用条件请求机制

8. 拥抱接口调用频率限制（[Rate\-Limiting](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=Rate-Limiting&zhida_source=entity)）

9. 编写良好的 [API 文档](https://zhida.zhihu.com/search?content_id=2389398&content_type=Article&match_order=1&q=API+%E6%96%87%E6%A1%A3&zhida_source=entity)

10. 对 API 技术演化保持关注



### 编码

base64是一个保存二进制数据的工具，将多种形式的二进制数据或其构成的文件以ASCII的形式保存，因为很多地方不支持直接的二进制文件保存或呈现，比如可以将图片直接转换成base64码嵌入HTML文档中，而避免使用网络http加载图片。另外，将数据编码为 base64 进行传输，然后解码获得数据，可以一定程度上保证数据的完整并且不用在传输过程中修改这些数据，避免在传输过程中可能出现的问题

### BIO 阻塞IO

面向流的

只要客户端不断开连接，服务端线程就一直阻塞

### NIO 非阻塞IO

#### Channel

读写数据的双向通道，相当于InputStream\+OutputStream，但更为底层

- FileChannel：从文件中读写数据

- DatagramChannel：从UDP网络中读写数据

- SocketChannel：从网络中读写数据

- ServerSocketChannel：可以监听新进来的TCP连接，对每一个新进来的连接都会创建一个SocketChannel

#### Buffer

ByteBuffer

- MappedByteBuffer

- DirectByteBuffer

- HeapByteBuffer 

#### Selector

多线程版设计：内存占用高（1个线程1M）、线程上下文切换成本高、只适合连接少

线程池版设计：一个线程需等待io，仅处理一个socket连接，只适合短连接

### 写Web服务器

1. Vert\.x 服务器 

- 写一个doStart\(\)方法，创建一个HttpServer，监听端口处理请求

public class MyServer extends AbstractVerticle \{



\}

### Netty

高性能分布式网络框架



base64是一个保存二进制数据的工具，将多种形式的二进制数据或其构成的文件以ASCII的形式保存，因为很多地方不支持直接的二进制文件保存或呈现，比如可以将图片直接转换成base64码嵌入HTML文档中，而避免使用网络http加载图片。另外，将数据编码为 base64 进行传输，然后解码获得数据，可以一定程度上保证数据的完整并且不用在传输过程中修改这些数据，避免在传输过程中可能出现的问题

## 网络工程

网络按照\*\*地域\*\*来分可以分成个人区域网PAN（USB和蓝牙）、局域网LAN（以太网802\.3和无线局域网802\.11）、城域网MAN、广域网WAN、互联网。

### 计算机网络体系结构

将服务、接口和协议分开讨论

##### 如何实现分包重组呢

### 常用的互联设备

#### 物理层设备

中继器（Repeater）信号放大器，保证远距离的传输

集线器（Hub）本质上是一个多端口的中继器，为LAN的接入层设备；所有主机属于同一个冲突域，共享总线带宽。

#### 数据链路层设备

网桥（Bridge），连接两个局域网

交换机（Switch）可看成一个多端口网桥，按每一个包中的MAC地址相对简单地决策信息转发 ，转 发延迟小，将网络分成小的冲突网域，为每个工作站提供更高的带宽

以上两个都工作在，是根据MAC地址转发数据帧，但无论在结构还是性能上，交换机都优于网桥

#### 网络层设备

**路由器**

路由器的每个端口都是一个独立的冲突域和广播域

**网关**

**三层交换机**

交换机堆叠（并行）、级联（Uplink串联）

### 网络逻辑设计

**链路收敛比**: 指上下行链路在不同网络边界的输入带宽和输出带宽之比。 

**设备收敛比**: 指设备输入带宽和输出带宽之比。

#### 分层

核心层：作为整个网络的通信枢纽（“主干网”），承担40%\~80%的网络流量。

汇聚层：承上启下的数据“分发层”，对各接入用户、网段、子网进行逻辑分割、控制和管理（如分隔工作组、划分VLAN、通过策略和路由控制网络流量、实现QoS等）

接入层：



### 冗余

防范单故障点

VRRP（最常见的冗余网关配置）

实现在链路层

QoS多用于，是计算机网络中\*\*对不同网络流量提供不同优先级和保障能力\*\*的一套机制

分类标记业务、网络流量

拥塞管理和拥塞控制

流量整形

QoS如何设计？

1. 业务流量分析

