### 利用express的Router方法构建模块化路由
上文我们讲了用`app.get()`和`app.post`构建路由，但是如果一个项目里路由非常多的话，就不方便进行管理
```js
const express= require('express')

// 创建服务器
const app = express()

// 创建路由对象
const user = express.Router()

// 将路由对象和请求地址进行匹配
app.use('/user', user)

// 创建二级路由
user.get('/list', (req, res) => {
    res.send('访问用户列表')
})
user.get('/index', (req, res) => {
    res.send('访问用户首页')
})
// 监听端口
app.listen(3000)
console.log('服务器已经启动')
```
执行`node index.js`启动服务器，浏览器输入`http://localhost:3000/user/index`,页面返回：`访问用户首页`<br>
以上，就是我们使用router方法构建模块路由，接下来讲一下如何拆分路由模块，便于管理不同页面的路由：<br>
新建`route/user.js`和`route/blog.js`
```js
// blog.js
const express= require('express')

// 创建路由对象
const blog = express.Router()

// 创建二级路由
blog.get('/index', (req, res) => {
    res.send('访问博客首页')
})

module.exports = blog
```
```js
// user.js
const express= require('express')

// 创建路由对象
const user = express.Router()

// 创建二级路由
user.get('/list', (req, res) => {
    res.send('访问用户列表')
})
user.get('/index', (req, res) => {
    res.send('访问用户首页')
})

module.exports = user
```
```js
// index.js
const express= require('express')

// 创建服务器
const app = express()

const user = require('./route/user')
const blog = require('./route/blog')

// 将路由对象和请求地址进行匹配
app.use('/user', user)
app.use('/blog', blog)

// 监听端口
app.listen(3000)
console.log('服务器已经启动')
```
执行`node index.js`启动服务器，浏览器输入`http://localhost:3000/user/index`,页面返回：`访问用户首页`<br>
执行`node index.js`启动服务器，浏览器输入`http://localhost:3000/blog/index`,页面返回：`访问博客首页`<br>
接下来讲解一下利用express框架访问静态资源<br>
使用express.static方法可以管理静态文件，例如img、css、js文件等
当前目录，新建`index.js`
```js
// index.js
const express= require('express')
const path = require('path')

// 创建服务器
const app = express()

console.log(path.join(__dirname, 'public')) // E:\project\vue\NodeJs\2-13\public
// path.join(__dirname, 'public') 返回一个绝对路径
app.use(express.static(path.join(__dirname, 'public')))

// 监听端口
app.listen(3000)
console.log('服务器已经启动')
```
新建`public`文件夹<br>
新建`public/index.html`<br>
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="contain"></div>
</body>
<script src="./js/index.js"></script>
</html>
```
新建`public/img`<br>
新建`public/css/index.css`<br>
新建`public/js/index.js`<br>
```js
// public/js/index.js
document.getElementById('contain').innerText = 'My First JavaScript'
```
执行`node index.js`启动服务器，浏览器输入：`http://localhost:3000/index.html`就可成功访问我们的静态资源文件<br>
接下来再讲一下express中template模板引擎，首先先安装`express-art-template`
```
npm install art-template express-art-template --save
```
```js
// index.js
const express = require('express')
const path = require('path')

// 创建服务器
const app = express()

// 使用express-art-template渲染后缀为art的模板
app.engine('art', require('express-art-template'))
// 设置模板的存放目录
app.set('views', path.join(__dirname, 'views'))
// 渲染模板时默认拼接art后缀
app.set('view engine', 'art')

app.get('/index', (req, res) => {
    res.render('index', {
        msg: '访问首页'
    })
})

// 监听端口
app.listen(3000)
console.log('服务器已经启动')
```
新建`views/index.art`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板引擎</title>
</head>
<body>
    <div id="contain">{{msg}}</div>
</body>
</html>
```
执行`node index.js`启动服务器，浏览器输入：`http://localhost:3000/index`就可成功访问我们的模板文件<br>



