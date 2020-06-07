### 搭建自己的第一个http服务器

利用nodejs中http模块搭建服务器

先引入http模块
```js
const http = require('http')
```

##### [1. http.createServer](http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener) 创建http服务器
```js
const http = require('http')

const serve = http.createServer((req, res) => {
    // res 响应
    res.writeHead(200, { 'Content-Type': 'text/html' }) // 向请求发送响应头（向请求发送一个状态码，向请求发送的文档类型为html格式）
    res.end('<h1>hello world</h1>') // 此方法向服务器发出信号，表明已发送所有的响应头和主体，该服务器应该视此消息已完成
})

serve.listen(3000, () => {
    console.log('监听了3000端口')
})
```
此时服务器已经启动，打开浏览器输入：http://localhost:3000/ 就可以看到页面上显示的`hello world`