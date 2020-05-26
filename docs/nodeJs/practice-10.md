### http解析-http发展历史

##### 1. 什么是http? http://www.xx.com
- http协议（HyperText Transfer Protocol，超文本传输协议）是一种应用广泛的网络传输协议
- http是一个基于TCP/IP通讯协议来传递数据（HTML文件，图片文件，查询结果等）

##### 2. http工作原理?
- http协议工作在客户端-服务端之间
- 主流的三个web服务器：Apache、Nginx、IIS
- http默认端口是80
- http协议通信流程 web Browser <--> HTTP Server <--> CGI program <--> Database (客户端发送一个http请求给服务端，服务端通过服务程序跟数据库进行交互，进而再通过http协议将数据从服务端返回给客户端 )

##### 3. 输入url发生了什么？（面试时经常问到这个问题）
- DNS解析 将域名解析成ip地址
- TCP连接 3次握手 （询问是否可以连接，确认可以连接，正式连接）
- 发送http请求
- 服务器处理请求
- 浏览器解析渲染页面
- 连接结束

##### 4. http请求方法
- GET 请求指定的页面信息，并返回实体主体
- HEAD 类似于get请求，只不过返回的响应中没有具体内容，用于获取报头
- POST 向指定资源提交数据进行处理请求，数据被包含在请求体中
- PUT 从客户端向服务器传送的数据取代指定的文档的内容
- DELETE 请求服务器删除指定的页面
- CONNECT HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器
- OPTIONS 允许客户端查看服务器的性能
- TRACE 回显服务器收到的请求，主要用于测试或诊断

##### 5. HTTP响应头信息
应答头
- Allow 服务器支持哪些请求方法（如get、post等）
- Content-Encoding 文档的编码方法，只有在解码之后才可以得到Content-Type头指定的内容类型，利用gzip压缩能减少HTML文档的下载时间
- Content-Length 内容表示长度，只有当浏览器使用持久http连接时才需要这个数据
- Content-Type 表示文档属于什么MIME类型