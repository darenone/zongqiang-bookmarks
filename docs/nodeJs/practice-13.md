### 如何处理客户端get/post请求
讲解如何处理从页面中传来的参数
##### [1. url.parse(urlString[, parseQueryString[, slashesDenoteHost]])](http://nodejs.cn/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost) 解析url
```js
const url = require('url')

// 把url中携带的参数转化为object对象
console.log(url.parse('https://webapi.amap.com/maps?v=1.4.15&key=17813dc4519f0a806e25eca15c05045d&plugin=AMap.ControlBar', true))
/*
query: {
    v: '1.4.15',
    key: '17813dc4519f0a806e25eca15c05045d',
    plugin: 'AMap.ControlBar'
},
*/
```
##### 2. 如何处理get请求
```js
const url = require('url')
const http = require('http')

const server = http.createServer((req, res) => {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    res.end(JSON.stringify(urlObj.query))
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
然后执行`node index.js`本地服务器启动，启动以后再浏览器输入：`http://localhost:3000/?name=zongqiang`就可以看到页面显示了一个`{"name":"zongqiang"}`
##### 3. 如何处理post请求
```js
const http = require('http')

const server = http.createServer((req, res) => {
    let postData = ''
    // 接收请求传递过来的参数
    req.on('data', chunk => {
        postData += chunk
    })
    // 后台打印传递过来的参数
    req.on('end', () => {
        console.log(postData)
    })
    // 请求成功，响应给客户端的数据
    res.end(JSON.stringify({
        data: '请求成功',
        code: 0
    }))
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
然后执行`node index.js`本地服务器启动<br>
再然后打开你的`postman`软件，输入`http://localhost:3000/api/postData`,请求方式选择`post`,body内选择JSON，然后输入一个对象，作为传递给服务器的的参数
```json
{
	"name": "zongqiang",
	"age": 27
}
```
以上操作的目的是来模拟向服务器（http://localhost:3000）发送一个post请求，成功以后我们会看到服务器传递过来的数据
```json
{
    "data": "请求成功",
    "code": 0
}
```
##### 4. 整合get和post请求
```js
const url = require('url')
const http = require('http')

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        let urlObj = url.parse(req.url, true) // 获取请求的地址
        res.end(JSON.stringify(urlObj.query))
    } else if (req.method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk
        })
        req.on('end', () => {
            console.log(postData)
        })
        res.end(JSON.stringify({
            data: '请求成功',
            code: 0
        }))
    }
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
然后我们通过`postman`来分别发送一个get和post请求<br>
```js
// post请求
// http://localhost:3000/api/postData
// 传递参数
/*
{
	"name": "zongqiang",
	"age": 27
}
*/

// get请求
// http://localhost:3000/api/postData?name=zongqiang&age=27
```
##### 5. nodemon自动重启工具安装配置

我们在写代码的时候，每次改动都要重启服务器，这样比较麻烦，有了这个工具就可以自动重启，少了很多麻烦
全局安装
```
npm/cnpm install -g nodemon
```
安装完毕执行`nodemon index.js`即可启动服务器

另外如果想更方便，我们可以这样操作，当前文件夹执行`npm init -y`生成`package.json`文件，修改这个json文件
```json
{
  "name": "2-9",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js", // 把nodemon加入进来
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
}
```
然后我们想要启动服务器，就可以直接执行这样一句代码
```
npm run start
```
服务器就启动成功了！这个和我们在vue项目执行`npm run dev`和`npm run serve`是一样的