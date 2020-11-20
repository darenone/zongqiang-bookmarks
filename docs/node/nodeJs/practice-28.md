# 28-express框架知识讲解
## 1. express框架介绍
[express](https://www.expressjs.com.cn/)是基于Node.js平台，快速、开放、极简的web开发框架，express框架特性：
- 可以设置中间件来响应http请求
- 提供方便的路由定义方式
- 可以通过模板引擎动态渲染HTML页面
- 简化获取http请求参数的方式

除了express这个nodejs开发框架外，还有一个开发框架叫[koa](https://koa.bootcss.com/#)，通过[npm](https://www.npmjs.com/)搜索这两个nodejs开发框架，会发现express周搜索量达到上千万，koa周搜索量十几万左右，证明主流的还是express框架
- express安装
```
npm install express --save
```
- 启动服务器
```js
const express= require('express')

// 创建服务器
const app = express()

// 访问根目录这个路由，就是localhost:3000
app.get('/', (req, res) => {
    res.send('hello world')
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
执行`node index.js`启动服务器，浏览器输入：`http://localhost:3000/`,可正常访问
## 2. express如何处理get/post请求
- 处理get请求
```js
const express= require('express')

// 创建服务器
const app = express()

// 访问根目录这个路由，就是localhost:3000
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/addUser', (req, res) => {
    res.send(req.query)
})
// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
执行`node index.js`启动服务器，浏览器输入：`http://localhost:3000/user?name=zognqiang`,可看到输出结果：
```json
{"name":"zognqiang"}
```
- 处理post请求

首先安装`body-parser`
```
npm install body-parser --save
```
然后引入，并增加一句代码
```js
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
```
```js
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

// 拦截所有请求
// 解析post请求传递的参数
// extended - false 表示用querystring解析字符串参数
// extended - true 表示用qs解析字符串参数
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 访问根目录这个路由，就是localhost:3000
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/user', (req, res) => {
    res.send(req.query)
})

app.post('/addUser', (req, res) => {
    res.send(req.body)
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
执行`node index.js`启动服务器，打开`postman`输入：`http://localhost:3000/addUser`,参数选择`x-www-from-urlencoded`，传入参数：
```json
{
    "id": "1",
    "name": "zongqiang"
}
```
返回参数：
```json
{
    "id": "1",
    "name": "zongqiang"
}
```
上面讲的是采用表单进行想后端提交数据，如果采用json格式的话呢，增加一行代码：
```js
app.use(bodyParser.json())
```
## 3. express中间件
中间件其实就是一个方法，这个方法可以访问请求对象req，响应对象res，和web应用处于请求响应循环流程中的中间件，一般被命名为`next`变量
```js
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

// 拦截所有请求
// 解析post请求传递的参数
// extended - false 表示用querystring解析字符串参数
// extended - true 表示用qs解析字符串参数
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 访问根目录这个路由，就是localhost:3000
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/user', (req, res, next) => {
    req.name = 'zongqiang'
    next() // 如果没有这个中间件，第一次匹配到/user这个路由，就不会再匹配另外一个相同的/user路由
})

app.get('/user', (req, res) => {
    res.send(req.name)
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
由此可以看到，next中间件可以对请求进行拦截，做一些处理，然后再由下一个中间件做一些处理，在我们写的代码里app.use、app.get、app.post都是中间件
## 4. app.use用法
app.use加载用于处理http请求的中间件，当一个请求来的时候，会依次被这些中间件处理
```js
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

// 拦截所有请求
app.use((req, res, next) => {
    console.log('这是第一个中间件')
    next() // 这个中间执行完毕，交由第二个中间件执行
})

// 不管是get还是post请求，匹配到这个路由就执行这行代码
app.use('/user', (req, res, next) => {
    console.log('这是第二个中间件')
    next() // 这个中间件执行完毕，交由下一个中间件处理
})

// 访问根目录这个路由，就是localhost:3000
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/user', (req, res, next) => {
    req.name = 'zongqiang'
    next() // 如果没有这个中间件，第一次匹配到/user这个路由，就不会再匹配另外一个相同的/user路由
})

app.get('/user', (req, res) => {
    res.send(req.name)
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
## 5. 讲解中间件常用的应用场景
- 路由保护 客户端访问需要登录的请求时，可以使用中间件进行拦截，判断用户的登录状态，进而响应用户是否允许访问
- 网站维护 在所有中间件上定义一个接收所有请求的中间件，不使用next，直接给客户端响应表示网站维护中
- 自定义404页面
```js
// 路由保护
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

app.use((req, res, next) => {
    let isLogin = false
    if (isLogin) {
        next()
    } else {
        res.send('你需要重新登录才可访问')
    }
})


app.get('/user', (req, res, next) => {
    req.name = 'zongqiang'
    next() // 如果没有这个中间件，第一次匹配到/user这个路由，就不会再匹配另外一个相同的/user路由
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
```js
// 网站维护
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

app.use((req, res, next) => {
    res.send('网站维护中...')
})


app.get('/user', (req, res, next) => {
    req.name = 'zongqiang'
    next() // 如果没有这个中间件，第一次匹配到/user这个路由，就不会再匹配另外一个相同的/user路由
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
```js
// 404处理
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()


app.get('/user', (req, res, next) => {
    req.name = 'zongqiang'
    next() // 如果没有这个中间件，第一次匹配到/user这个路由，就不会再匹配另外一个相同的/user路由
})

// 在路由最下面加
app.use((req, res, next) => {
    res.status(404).send('404 NOT FOUND')
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
## 6. 处理错误的中间件
[app.use](https://www.expressjs.com.cn/4x/api.html#app.use)
```js
const express= require('express')
const bodyParser = require('body-parser')

// 创建服务器
const app = express()

app.get('/user', (req, res, next) => {
    throw new Error('服务器发生未知错误')
    res.send('登录了')
})

// 处理错误
app.use((err, req, res, next) => {
    res.status(500).send(err.message)
})

// 在路由最下面加
app.use((req, res, next) => {
    res.status(404).send('404 NOT FOUND')
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
上面代码是同步执行错误的方法，下面来讲一下处理异步错误的方法：
```js
const express= require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

// 创建服务器
const app = express()


app.get('/user', (req, res, next) => {
    // 读取一个不存在的a.js文件，因为是一个异步操作，下面的处理错误中间件不会捕捉到此错误
    fs.readFile('./a.js', 'utf8', (err, result) => {
        if (err) throw err
    })
})

// 处理错误中间件（只能捕捉同步里的方法）
app.use((err, req, res, next) => {
    res.status(500).send(err.message)
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```
所以需要对异步操作进行改造：
```js
const express= require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

// 创建服务器
const app = express()


app.get('/user', (req, res, next) => {
    fs.readFile('./a.js', 'utf8', (err, result) => {
        if (err) {
            next(err) // 调用中间件将错误结果返回
            return;
        } else {
            res.send(result)
        }
    })
})

// 处理错误中间件
app.use((err, req, res, next) => {
    res.status(500).send(err.message)
})

// 监听端口
app.listen(3000)
console.log('服务器已启动')
```