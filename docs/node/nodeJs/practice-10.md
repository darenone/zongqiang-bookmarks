# 10-http解析-http发展历史

## 1. 什么是http

http://www.xx.com
- http协议（HyperText Transfer Protocol，超文本传输协议）是一种应用广泛的网络传输协议
- http是一个基于TCP/IP通讯协议来传递数据（HTML文件，图片文件，查询结果等）

## 2. http工作原理

- http协议工作在客户端-服务端之间
- 主流的三个web服务器：Apache、Nginx、IIS
- http默认端口是80
- http协议通信流程 web Browser <--> HTTP Server <--> CGI program <--> Database (客户端发送一个http请求给服务端，服务端通过服务程序跟数据库进行交互，进而再通过http协议将数据从服务端返回给客户端)

## 3. 输入url发生了什么

（面试时经常问到这个问题）
- DNS解析 将域名解析成ip地址
- TCP连接 3次握手 （询问是否可以连接，确认可以连接，正式连接）
- 发送http请求
- 服务器处理请求
- 浏览器解析渲染页面
- 连接结束

## 4. http请求方法

request method
- GET 请求指定的页面信息，并返回实体主体
- HEAD 类似于get请求，只不过返回的响应中没有具体内容，用于获取报头
- POST 向指定资源提交数据进行处理请求，数据被包含在请求体中
- PUT 从客户端向服务器传送的数据取代指定的文档的内容
- DELETE 请求服务器删除指定的页面
- CONNECT HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器
- OPTIONS 允许客户端查看服务器的性能（有时候请求某一个接口，会发送两次请求，第一个请求就是option请求（浏览器向服务器发送的预请求，向服务器询问是否可以请求，如果不同意就不再发送请求，如果同意就发送真正的请求），第二个就是你需要请求接口的post请求或其它请求）
- TRACE 回显服务器收到的请求，主要用于测试或诊断

<b>我们来讲一下为啥会有options请求</b>
1. 请求已get/head/post以外的方法发起请求，或者使用post，但请求数据时，除了content-type的值为：application/x-www-form-urlencoded, multipart/form-data 或者 text/plain 以外的数据类型。比如说，用 POST 发送数据类型为 application/xml 或者 text/xml 的 XML 数据的请求 或者 使用自定义请求头（比如添加诸如 X-PINGOTHER）都会出现两次请求的情况
2. get请求比较简单，没有预请求，直接发送即可，但是遇到了预请求，后端还是要处理一下options请求，放开options请求，前端才能够请求成功

## 5. HTTP响应头信息 

response header
应答头
- Allow 服务器支持哪些请求方法（如get、post等）
- Content-Encoding 文档的编码方法，只有在解码之后才可以得到Content-Type头指定的内容类型，利用gzip压缩能减少HTML文档的下载时间
- Content-Length 内容表示长度，只有当浏览器使用持久http连接时才需要这个数据
- Content-Type 表示文档属于什么MIME类型
- Date 当前的GMT时间（世界标准时间）
- Expires 资源什么时候过期，不再缓存，重新向服务器请求页面
- Last-Modified 文档最后改动时间
- Location 重定向地址
- Serve 服务器名字 比如 serve：AliyunOSS (阿里云服务器)
- Set-Cookie 设置和页面关联的Cookie
- WWW-Authenticate 定义了使用何种方式去获取对资源的链接

## 6. HTTP状态码 Status Code
常见状态码
- 200 请求成功
- 301 重定向（资源被永久转移到其它URL）
- 404 请求的资源不存在
- 500 内部服务器错误
状态码很多，主要分为5类
- 1** 信息，服务器收到的请求，需要请求者继续执行操作
- 2** 成功，操作被成功接收并处理
- 3** 重定向，需要进一步的操作以完成请求
- 4** 客户端错误，请求包含语法错误或无法完成请求
- 5** 服务器错误，服务器在处理请求的过程中发生了错误

## 7. Content—type 内容类型
常见的媒体格式类型如下
- text/html html格式
- text/plain 纯文本格式
- text/xml XML格式
- image/gif gif图片格式
- image/jpeg jpg图片格式
- image/png png图片格式
- multipart/form-data 需要在表单中进行文件上传时，就需要使用该格式
以application开头的媒体格式类型如下
- application/xhtml+xml XTHML格式
- application/xml XML聚合格式
- application/atom+xml Atom XML聚合格式
- application/json JSON格式
- application/pdf pdf格式
- application/msword word格式
- application/octet-stream 二进制流数据
- application/x-www-form-urlencoded 表单中默认的encType，表单数据被编码为key/value格式发送到服务器