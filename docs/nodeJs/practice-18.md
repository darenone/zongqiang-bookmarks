### 结合数据库改造用户列表接口
##### 1. 通过接口向mysql写入数据
我们首先对上节创建的连接池代码进行修改，创建`conn.js`文件
```js
// conn.js文件
const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
    connectionLimit: 10, // 最大连接数
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'test'
})



function query (sql, params) {
    return new Promise((resolve, reject) => {
        // 获取连接
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
                return
            }
            conn.query(sql, params, (err, res) => {
                conn.release() // 释放连接
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    })
}

module.exports = query
```
创建`controller/user.js`文件，用来处理与MySQL之间的逻辑操作
```js
const query = require('../conn')

module.exports = {
    getUserList () {
        return []
    },
    async addUser (userObj) { // async方法返回一个promise
        let { name, city, sex } = userObj
        let sql = 'insert into use_list (name, city, sex) value (?, ?, ?)'
        try {
            let resultData = await query(sql, [name, city, sex]) // await方法接收promise的返回值
            return {
                msg: '新增成功',
                status: 1
            }
        } catch (err) {
            return {
                msg: '新增失败',
                status: 0
            }
        }
    }
}
```
这里提一下async/await:<br>
- async async/await其实是Generator的语法糖，async来声明后面的函数是异步函数，而且这个异步函数返回一个promise，用法如下：
```js
async function funcA() {
    return 'hello'
}
funcA().then(res => {
    console.log(res) // hello
})
```
async函数返回一个promise对象，因此async函数通过return返回的值，会成为then方法中回调函数的参数
- await 它代表一个异步等待，等待的是一个promise，因此await后面应该跟一个promise对象，程序里一旦遇到await就会先执行异步操作，完事儿再执行接下来的代码
```js
async function funcA() {
    let a = await 100
    // a就是promise对象里，then方法里回调函数的参数
    new Promise((resolve, reject) => {
        resolve(100)
    }).then(res => {
        let a = res
    })
}
```
但是，await后面的promise对象不总是返回resolved状态，也有可能是rejected状态，只要有一个await后面的promise状态变为rejected，整个await函数都会中断执行，为了保存错误的位置和错误信息，我们需要用 try...catch 语句来封装await过程
```js
async function funcA() {
    try {
        let a = await 100
    } catch (err) {
        console.log(err)
    }
}
```
言归正传，新建`router/index.js`文件，用来配置路由：
```js
const url = require('url')
const { addUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        // addUser(req.body) // 它返回的是一个promise
        return addUser(req.body) // 调用addUser函数
    }
}

module.exports = handleRequest
```
新建`index.js`文件，启动服务器，用来处理与客户端之间的逻辑操作
```js
const http = require('http')
const routerModal = require('./router/index')

const getPostData = (req) => { // 新建一个promise异步操作先处理post请求，然后再处理get请求
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return;
        }
        let postData = ''
        // 接收请求传递过来的参数
        req.on('data', chunk => {
            postData += chunk
        })
        // 后台打印传递过来的参数
        req.on('end', () => {
            resolve(JSON.parse(postData))
        })
    })
}

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
    getPostData(req).then((data) => {
        req.body = data // post请求传递过来的参数放到req里面
        let result = routerModal(req, res)
        if (result) {
            result.then(resultData => {
                res.end(JSON.stringify(resultData)) // 响应给客户端的数据
            })
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 not found')
        }
    })
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
接下来，启动我们的服务器`npm run start`,然后用`postman`调用接口：`http://localhost:3000/api/addUser` 传递参数：
```json
{
	"name": "HK",
	"area": "纽约",
	"sex": 2
}
```
如果操作成功，返回结果：
```json
{
    "msg": "新增成功",
    "status": 1
}
```
同时数据库多mysql了一条数据，如果操作失败，返回结果：
```json
{
    "msg": "新增失败",
    "status": 0
}
```