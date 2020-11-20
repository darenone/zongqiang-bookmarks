# 16-轻松解决接口跨域问题

接上一篇文章，我们启动一个vue项目，然后对`http://localhost:3000/api/addUser`这个接口发起请求，vue项目启动地址为`http://localhost:8082/#/`
可以看到，协议，ip地址一样，但是端口号不一样，由于同源策略的限制，从`localhost:8082`向`localhost:3000`发起请求的时候，会被浏览器拦截，必然会出现跨域问题，接下来，我们来展示一下：<br>
在vue项目里新建`src/$http.js`文件，我们把api配置一下：
```js
// $http.js
import axios from "axios"
import qs from "qs"

const SERVER_URL = "http://localhost:3000/api/"

const GLOBAL_ERROR_MAP = {
    "0": {
        msg: '数据加载异常，请刷新重试'
    },
    401: {
        process() {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = window.location.pathname + "#/login"
        }
    }
}
// 请求成功的处理函数
const successFn = (resp, resolve, reject) => {
    if (parseInt(resp.data.status) == 1) {
        resolve(resp.data)
    } else {
        let errorProcess = GLOBAL_ERROR_MAP[resp.data.status]
        if (errorProcess) {
            reject(resp.data.msg)
        }
        errorProcess.process()
    }
}
// 请求失败的处理函数
const failFn = (err) => {
    if (err.response) {
        let errorProcess = GLOBAL_ERROR_MAP[err.response.status]
        errorProcess && errorProcess.process()
    }
}

export const $http = {
    post: function(url, params) {
        if (params === undefined) {
            params = {}
        }
        return new Promise ((resolve, reject) => {
            console.log(params)
            axios.post(SERVER_URL + url, qs.stringify(params)).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    }
}

const install = (Vue) => {
    Vue.prototype.$http = $http
}

export default install
```
然后在`main.js`里面引入`$http.js`文件
```js
// main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $http from './http/$http';

Vue.config.productionTip = false;
Vue.use($http);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```
接下来在`api/index.js`配置api请求
```js
// index.js
import Vue from 'vue'
let vm = new Vue()

export const addUser = (params) => {
    return vm.$http.post(`addUser`, params)
}
```
然后在具体的组件里调用这个接口
```vue
<script>
import { addUser } from '@/api/index'
export default {
    mounted () {
        addUser({
            name: 'zongqiang',
            age: 27,
            city: '成都'
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
```
刷新浏览器，页面提示的问题如下：
> Access to XMLHttpRequest at 'http://localhost:3000/api/addUser' from origin 'http://localhost:8082' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

也就是说出现了跨域问题，我们向服务器发送的请求，被浏览器给拦截了，这个时候，需要在服务器端设置一下，即可成功访问：
```js
const http = require("http")
const qs = require("qs")
const handleRequest = require('./router/index')

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        // if (req.method !== "OPTIONS") {
        //     resolve({})
        //     return;
        // }
        let PostData = ""
        req.on('data', chunk => {
            PostData += chunk
        })
        req.on('end', () => {
            resolve(qs.parse(PostData))
        })
    })
}

const server = http.createServer((req, res) => {
    // res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin","http://localhost:8000");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    res.writeHead(200, { 'Content-Type': 'multipart/form-data;charset=utf-8' })
    getPostData(req).then(data => {
        req.body = data
        let result = handleRequest(req, res)
        if (result) {
            result.then(resultData => {
                res.end(JSON.stringify(resultData)) // 响应给客户端的数据
            })
        } else {
            // res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 not found')
        }
    })
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
在开发的时候，如果不在服务端设置，vue项目里也可以配置跨域请求，如果是基于`vue cli 3.0`创建的项目就可以在根目录下新建`vue.config.js`文件：
```js
// vue.config.js
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'
const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: false, // 关闭eslint检查
    chainWebpack: config => {
        config.resolve.alias
        .set('@', resolve('src')) // 用@代替src，在项目里你需要引入文件的时候，只需要@/api,@/config,@/mock...即可
        .set('_c', resolve('src/components')) // 用_c代替src/components,我们需要引入组件时，只需要_c/HelloWorld.vue即可
        config.entry('main').add('babel-polyfill') // main是入口js文件
    },
    productionSourceMap: false, // 打包时不生成map文件，这样减少打包的体积，加快打包速度
    outputDir: 'terminalmonitorweb', // 打包后项目目录名称
    // 跨域配置
    devServer: {
        open: true, // 浏览器自动打开
        hot: true, // 热更新，保存自动更新
        host: '0.0.0.0', // 局域网内可以访问
        port: 8082,
        // proxy: {
        //     '/idcMonitorServer': {
        //         target: 'http://10.0.0.186:18090',
        //         changeOrigin: true,
        //         // pathRewrite: {
        //         //     '^/idcMonitorServer': ''
        //         // }
        //     }
        // }
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/idcMonitorServer': ''
                // }
            }
        }
    }
}
```
`$http.js`修改如下：
```js
// var SERVER_URL='/idcMonitorServer/';
var SERVER_URL = '/api/';
// var SERVER_URL = 'http://localhost:3000/api/'
```
`api/index.js`不变还是这样写：
```js
// index.js
import Vue from 'vue'
let vm = new Vue()

export const addUser = (params) => {
    return vm.$http.post(`addUser`, params)
}
```
以上就可以实现对服务器进行跨域请求<br>
具体后端如何实现的呢？
新建后端项目`my-server`，在此文件夹下执行`npm init -y`生成`package.json`文件<br>
然后执行以下命令，安装`mysql`、`qs`
```
npm install mysql --save
npm install qs --save
```
新建`my-server/index.js`文件：
```js
const http = require("http")
const qs = require("qs")
const handleRequest = require('./router/index')

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        // if (req.method !== "OPTIONS") {
        //     resolve({})
        //     return;
        // }
        let PostData = ""
        req.on('data', chunk => {
            PostData += chunk
        })
        req.on('end', () => {
            resolve(qs.parse(PostData))
        })
    })
}

const server = http.createServer((req, res) => {
    // res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin","http://localhost:8000");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    res.writeHead(200, { 'Content-Type': 'multipart/form-data;charset=utf-8' })
    getPostData(req).then(data => {
        req.body = data
        let result = handleRequest(req, res)
        if (result) {
            result.then(resultData => {
                res.end(JSON.stringify(resultData)) // 响应给客户端的数据
            })
        } else {
            // res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 not found')
        }
    })
})

server.listen(3000, () => {
    console.log('监听3000端口')
})
```
新建`my-server/router/index.js`文件：
```js
const url = require('url')
const { addUser } = require('../controller/user')

const handleRequest = (req, res) => {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST') {
        return addUser(req.body) // 调用addUser函数
    }
}

module.exports = handleRequest
```
新建`my-server/controller/user.js`文件：
```js
const query = require("../conn")

module.exports = {
    async addUser (userObj) {
        let { name, city, sex } = userObj
        let sql = 'insert into use_list (name, city, sex) value (?, ?, ?)'
        try {
            let resultData = await query(sql, [name, city, sex])
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
新建`my-server/conn.js`文件：
```js
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10, // 最大连接数
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'test'
})

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
                return;
            }
            console.log(params)
            conn.query(sql, params, (err, res) => {
                conn.release()
                if (err) {
                    reject(err)
                    return;
                }
                resolve(res)
            })
        })
    })
}

module.exports = query
```
启动我们的后端服务器，同时启动前端项目，向后端发送请求，就可以操作数据，写入`MySQL`中