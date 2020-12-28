# 18-结合数据库改造用户列表接口

## 1. 通过接口向mysql写入数据（增）
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
            // sql sql语句
            // params sql语句动态参数
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
    async addUser (userObj) { // async方法返回一个promise
        let { name, city, sex } = userObj
        let sql = 'insert into use_list (name, city, sex) value (?, ?, ?)'
        try {
            let resultData = await query(sql, [name, city, sex]) // await方法接收promise的返回的resolve值
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
const handleRequest = require('./router/index')

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
        let result = handleRequest(req, res)
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
## 2. 通过接口删除mysql数据（删）
修改`controller/user.js`
```js
// controller/user.js
const query = require('../conn')

module.exports = {
    // 增
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
    },
    // 删
    async deleteUser (userObj) {
        let { id } = userObj
        let sql = 'delete from use_list where id = ?'
        try {
            let resultData = await query(sql, [id])
            return {
                msg: '删除成功',
                status: 1
            }
        } catch (err) {
            return {
                msg: '删除失败',
                status: 0
            }
        }
    }
}
```
修改`router/index.js`
```js
// router/index.js
const url = require('url')
const { addUser, deleteUser, updateUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return addUser(req.body)
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return deleteUser(req.body)
    }
}

module.exports = handleRequest
```
然后访问接口：`http://localhost:3000/api/deleteUser`请求方式post<br>
传递参数：
```json
{
	"id": 2,
}
```
返回成功：
```json
{
    "msg": "删除成功",
    "status": 1
}
```
返回失败：
```json
{
    "msg": "删除失败",
    "status": 1
}
```
## 3. 通过接口修改mysql数据（改）
修改`controller/user.js`
```js
// controller/user.js
const query = require('../conn')

module.exports = {
    // 增
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
    },
    // 删
    async deleteUser (userObj) {
        let { id } = userObj
        let sql = 'delete from use_list where id = ?'
        try {
            let resultData = await query(sql, [id])
            return {
                msg: '删除成功',
                status: 1
            }
        } catch (err) {
            return {
                msg: '删除失败',
                status: 0
            }
        }
    }
    // 改
    async updateUser (userObj) {
        let { id, name, city, sex } = userObj
        let sql = 'update use_list set name = ?, city = ?, sex = ? where id = ?'
        try {
            let resultData = await query(sql, [name, city, sex, id])
            if (resultData.affectedRows) { // 返回为1
                return {
                    msg: '更新成功',
                    status: 1
                }
            } else {
                // 返回为0
                return {
                    msg: '不存在此用户',
                    status: 0
                }
            }
        } catch (err) {
            return {
                msg: '更新失败',
                status: 0
            }
        }
    }
}
```
修改`router/index.js`
```js
// router/index.js
const url = require('url')
const { addUser, updateUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        return addUser(req.body)
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return deleteUser(req.body)
    }
    if (urlObj.pathname === '/api/updateUser' && req.method === 'POST') {
        return updateUser(req.body)
    }
}

module.exports = handleRequest
```
然后访问接口：`http://localhost:3000/api/updateUser`请求方式post<br>
传递参数：
```json
{
	"id": 2,
	"name": "HK",
	"city": "纽约",
	"sex": 2
}
```
返回成功：
```json
{
    "msg": "更新成功",
    "status": 1
}
```
返回失败：
```json
{
    "msg": "更新失败",
    "status": 1
}
```
## 4. 通过接口操作mysql查询数据（查）
修改`controller/user.js`
```js
// controller/user.js
const query = require('../conn')

module.exports = {
    // 增
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
    },
    // 删
    async deleteUser (userObj) {
        let { id } = userObj
        let sql = 'delete from use_list where id = ?'
        try {
            let resultData = await query(sql, [id])
            console.log(resultData)
            return {
                msg: '删除成功',
                status: 1
            }
        } catch (err) {
            return {
                msg: '删除失败',
                status: 0
            }
        }
    },
    // 改
    async updateUser (userObj) {
        let { id, name, city, sex } = userObj
        let sql = 'update use_list set name = ?, city = ?, sex = ? where id = ?'
        try {
            let resultData = await query(sql, [name, city, sex, id])
            if (resultData.affectedRows) { // 返回为1
                return {
                    msg: '更新成功',
                    status: 1
                }
            } else {
                // 返回为0
                return {
                    msg: '不存在此用户',
                    status: 0
                }
            }
        } catch (err) {
            return {
                msg: '更新失败',
                status: 0
            }
        }
    },
    // 查
    async getUser (userObj) {
        let { name, city } = userObj
        let sql = 'select * from use_list where 1=1' // 无论是否输入查询数据，都会在mysql里查询一遍
        if (name) {
            sql += ' and name = ?'
        }
        if (city) {
            sql += ' and city = ?'
        }
        try {
            let resultData = await query(sql, [name, city])
            return {
                msg: '查询成功',
                status: 1,
                data: resultData
            }
        } catch (err) {
            return {
                msg: '查询失败',
                status: 0
            }
        }
    }
}
```
修改`router/index.js`
```js
// router/index.js
const url = require('url')
const { addUser, deleteUser, updateUser, getUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return addUser(req.body)
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return deleteUser(req.body)
    }
    if (urlObj.pathname === '/api/updateUser' && req.method === 'POST') {
        // console.log(addUser(req.body)) // promise
        return updateUser(req.body)
    }
    if (urlObj.pathname === '/api/getUser' && req.method === 'GET') {
        return getUser(urlObj.query)
    }
}

module.exports = handleRequest
```
然后访问接口：`http://localhost:3000/api/getUser?name=冰冰&city=重庆`请求方式get<br>
返回成功：
```json
{
    "msg": "查询成功",
    "status": 1,
    "data": [
        {
            "id": 17,
            "name": "冰冰",
            "city": "重庆",
            "sex": 1
        }
    ]
}
```

## 备注

完整的利用nodeJs连接数据库并且与前端进行数据交互的完整代码可以阅读我另外一个项目[vue-base-server](https://github.com/darenone/vue-base-server)