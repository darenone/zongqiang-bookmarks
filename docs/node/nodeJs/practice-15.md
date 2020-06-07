### 实战-利用模拟数据对用户列表增删改查

##### 1. 获取用户列表（查）
新建`index.js`
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
        req.body = data
        let resultData = routerModal(req, res)
        if (resultData) {
            res.end(JSON.stringify(resultData))
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
新建路由配置`router/index.js`
```js
const url = require('url')
const { getUserList } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData' && req.method === 'GET') {
        return {
            msg: '获取用户成功',
            status: 1,
            data: getUserList()
        }
    }
}

module.exports = handleRequest
```
新建`controller/user.js`进行逻辑处理
```js
module.exports = {
    getUserList () {
        return [
            {
                id: 1,
                name: '张三',
                city: '北京'
            },
            {
                id: 2,
                name: '张四',
                city: '北京'
            },
            {
                id: 3,
                name: '张五',
                city: '北京'
            }
        ]
    }
}
```
然后我们发送一个get请求`http://localhost:3000/api/getData?name=zongqiang&age=27`
得到的返回结果如下：
```json
{
    "msg": "获取用户成功",
    "status": 1,
    "data": [
        {
            "id": 1,
            "name": "张三",
            "city": "北京"
        },
        {
            "id": 2,
            "name": "张四",
            "city": "北京"
        },
        {
            "id": 3,
            "name": "张五",
            "city": "北京"
        }
    ]
}
```
##### 2. 新增用户 （增）
在`router/index.js`新配置一条路由
```js
const url = require('url')
const { getUserList, addUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData' && req.method === 'GET') {
        return {
            msg: '获取用户成功',
            status: 1,
            data: getUserList()
        }
    }
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        return {
            msg: '新增用户成功',
            status: 1,
            data: addUser(req.body) // 把post请求传递的数据传进来
        }
    }
}

module.exports = handleRequest
```
在`controller/user.js`进行逻辑处理
```js
module.exports = {
    getUserList () {
        return [
            {
                id: 1,
                name: '张三',
                city: '北京'
            },
            {
                id: 2,
                name: '张四',
                city: '北京'
            },
            {
                id: 3,
                name: '张五',
                city: '北京'
            }
        ]
    },
    addUser (userObj) {
        return userObj
    }
}
```
然后我们发送一个post请求`http://localhost:3000/api/addUser`并且传递参数：
```json
{
	"name": "zongqiang",
	"age": 27
}
```
得到的返回结果如下：
```json
{
    "msg": "新增用户成功",
    "status": 1,
    "data": {
        "name": "zongqiang",
        "age": 27
    }
}
```
##### 3. 删除用户 （删）
在`router/index.js`新配置一条路由
```js
const url = require('url')
const { getUserList, addUser, deleteUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData' && req.method === 'GET') {
        return {
            msg: '获取用户成功',
            status: 1,
            data: getUserList()
        }
    }
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        return {
            msg: '新增用户成功',
            status: 1,
            data: addUser(req.body) // 把post请求传递的数据传进来
        }
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST') {
        return {
            msg: '删除用户成功',
            status: 1,
            data: deleteUser(urlObj.query.id) // 把post请求传递的数据传进来
        }
    }
}

module.exports = handleRequest
```
在`controller/user.js`进行逻辑处理
```js
module.exports = {
    getUserList () {
        return [
            {
                id: 1,
                name: '张三',
                city: '北京'
            },
            {
                id: 2,
                name: '张四',
                city: '北京'
            },
            {
                id: 3,
                name: '张五',
                city: '北京'
            }
        ]
    },
    addUser (userObj) {
        return userObj
    },
    deleteUser (userId) {
        return {
            userId
        }
    }
}
```
然后我们发送一个post请求`http://localhost:3000/api/deleteUser?userId=1`参数是跟在url后面
返回结果如下：
```json
{
    "msg": "删除用户成功",
    "status": 1,
    "data": {}
}
```
##### 4. 更新用户信息 （改）
在`router/index.js`新配置一条路由
```js
const url = require('url')
const { getUserList, addUser, deleteUser, updateUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData' && req.method === 'GET') {
        return {
            msg: '获取用户成功',
            status: 1,
            data: getUserList()
        }
    }
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        return {
            msg: '新增用户成功',
            status: 1,
            data: addUser(req.body) // 把post请求传递的数据传进来
        }
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST') {
        return {
            msg: '删除用户成功',
            status: 1,
            data: deleteUser(urlObj.query.id) // 把post请求传递的数据传进来
        }
    }
    if (urlObj.pathname === '/api/updateUser' && req.method === 'POST') {
        return {
            msg: '更新用户成功',
            status: 1,
            data: updateUser(urlObj.query.id, req.body) // 把userId传过来，同时将需要修改的信息也传过来
        }
    }
}

module.exports = handleRequest
```
在`controller/user.js`进行逻辑处理
```js
module.exports = {
    getUserList () {
        return [
            {
                id: 1,
                name: '张三',
                city: '北京'
            },
            {
                id: 2,
                name: '张四',
                city: '北京'
            },
            {
                id: 3,
                name: '张五',
                city: '北京'
            }
        ]
    },
    addUser (userObj) {
        return userObj
    },
    deleteUser (userId) {
        return {
            userId
        }
    },
    updateUser (userId, obj) {
        return {
            id: userId,
            obj: obj
        }
    }
}
```
然后我们发送一个post请求`http://localhost:3000/api/updateUser?userId=1`参数userId跟在url后面,同时也要传递修改信息：
```json
{
	"name": "zongqiang",
	"age": 27
}
```
返回的结果如下：
```json
{
    "msg": "更新用户成功",
    "status": 1,
    "data": {
        "obj": {
            "name": "zongqiang",
            "age": 27
        }
    }
}
```