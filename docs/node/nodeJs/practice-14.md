# 14-初始化路由及接口开发

讲解如何开发一个接口以及路由编写

## 1. 通过pathname判断请求地址
```js
const url = require('url')
const http = require('http')

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
    if (req.method === 'GET') {
        let urlObj = url.parse(req.url, true) // 获取请求的地址
        if (urlObj.pathname === '/api/getData') {
            res.end('获取getData成功')
        } else if (urlObj.pathname === '/api/getData1') {
            res.end('获取getData1数据成功')
        } else {
            res.end('404 not found')
        }
    }
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
以上，我们就可以根据判断不同的接口进行对应的操作，但是也有问题，如果路由很多怎么办？我们可以把路由单独放到一个文件夹里，然后对它进行管理

新建一个`router/index.js`文件
```js
// router/index.js
const url = require('url')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData') {
        return {
            msg: '获取getData成功'
        }
    }
    if (urlObj.pathname === '/api/getData1') {
        return {
            msg: '获取getData1数据成功'
        }
    }
}

module.exports = handleRequest
```
```js
const http = require('http')
const routerModal = require('./router/index')

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
    if (req.method === 'GET') {
        let resultData = routerModal(req, res)
        if (resultData) {
            res.end(JSON.stringify(resultData))
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 not found')
        }
    }
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
