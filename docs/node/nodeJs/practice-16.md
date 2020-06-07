### 轻松解决接口跨域问题

接上一篇文章，我们来看利用一个vue项目对`http://localhost:3000/api/addUser`这个接口发起请求，我的这个vue项目启动地址为`http://localhost:8082/#/`
可以看到，协议，ip地址一样，但是端口号不一样，由于同源策略的限制，从`localhost:8082`向`localhost:3000`发起请求的时候，必然会出现跨域问题，接下来，我们来展示一下：<br>
我在vue项目里`vue.config.js`不进行跨域配置
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
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         // changeOrigin: false,
        //         // pathRewrite: {
        //         //     '^/idcMonitorServer': ''
        //         // }
        //     }
        // }
    }
}
```
在对axios进行封装的`$http.js`文件里，我们把api配置一下：
```js
// $http.js
import qs from "qs";
import axios from "axios";
import {Message} from "view-design";
import router from "./router";

// var SERVER_URL = '/idcMonitorServer/';
var SERVER_URL = 'http://localhost:3000/api/' // 配置请求的url
//全局错误处理Map
var GLOBAL_ERROR_MAP = {
    "-1": {
        msg: "程序异常。",
        process: function () {
            window.location.href = window.location.origin + window.location.pathname + "#/login";
        }
    },
    "-2": {
        //  msg:"没有该地址。",
        process: function () {
            window.location.href = window.location.origin + window.location.pathname + "#/notFound";
        }
    },
    401: {
        // msg:"你还没有登录，请登录后再操作。",
        process: function () {
            router.push({
                name: 'error401'
            })
        }
    },
    // 404:{
    // //  msg:"页面丢失。",
    //   process:function(){
    //     window.location.href="/#/notFound";
    //   }
    // },
    // 500:{
    //  // msg:"服务器错误。",
    //   process:function(){
    //     window.location.href="/#/abnormal";
    //   }
    // },
    // 504:{
    //  // msg:"服务器停止。",
    //   process:function(){
    //     //sessionStorage.setItem("accessToken", "");
    //    // window.location.href= "/#/login";
    //   }
    // }

};
export const $http = {
    post: function (url, params) {
        return new Promise(function (resolve, reject) {
            let data = qs.stringify(params);
            if (params && params.arrayFormat === 'brackets') {
                delete params.arrayFormat;
                data = qs.stringify(params, {arrayFormat: 'brackets'});
            }
            axios.post(SERVER_URL + url, params)
            // axios.post(url,qs.stringify(params))
                .then(function (resp) {
                    oSuccess(resp, resolve, reject);
                }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }

                reject(error);
                //if(error.response.status == '401')window.location.href="/#/notLogin";
            });
        });
    },
    oldpost: function (url, params) {
        return new Promise(function (resolve, reject) {
            axios.post(SERVER_URL + url, qs.stringify(params))
            // axios.post(url,qs.stringify(params))
                .then(function (resp) {
                    if (resp.data.status == 401) {
                        let code = resp.data.status;
                        let errorProcess = GLOBAL_ERROR_MAP[code];
                        errorProcess && errorProcess.process();
                        return;
                    }

                    resolve(resp.data);
                    // oSuccess(resp,resolve,reject);
                }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }

                reject(error);
                //if(error.response.status == '401')window.location.href="/#/notLogin";
            });
        });
    },
    postForm: function (url, params, config) {
        return new Promise(function (resolve, reject) {
            axios.post(SERVER_URL + url, params, config)
                .then(function (resp) {
                    oSuccess(resp, resolve, reject);
                }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }

                reject(error);
            });
        });
    },
    pop: function (url, params) {
        return new Promise(function (resolve, reject) {
            axios.post(url, qs.stringify(params))
                .then(function (resp) {
                    oSuccess(resp, resolve, reject);
                }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }
                reject(error);
                //if(error.response.status == '401')window.location.href="/#/notLogin";
            });
        });
    },
    get: function (url, params) {
        return new Promise(function (resolve, reject) {
            // axios.get(SERVER_URL+url,qs.stringify(params))
            axios.get(url, qs.stringify(params))
                .then(function (resp) {
                    oSuccess(resp, resolve, reject);
                }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }
                reject(error);
                //if(error.response.status == '401')window.location.href="/#/notLogin";
            });
        });
    },
    postJson: function (url, params) {
        if (params === undefined) {
            params = {};
        }
        let header = {
            'Content-Type': 'multipart/form-data'
        };
        return new Promise(function (resolve, reject) {
            axios.post(SERVER_URL + url, params, {headers: header}).then(function (resp) {
                oSuccess(resp, resolve, reject);
            }).catch(function (error) {
                if (error.response) {
                    let code = error.response.status;
                    let errorProcess = GLOBAL_ERROR_MAP[code];
                    errorProcess && errorProcess.process();
                }
                reject(error);
            });
        });
    },
};
//请求成功
function oSuccess(resp, resolve, reject) {
    //非正常响应
    // if(resp.status != 200) {
    //   let errorProcess = GLOBAL_ERROR_MAP[resp.status];
    //   Message.error(errorProcess.msg);
    //   reject(false,errorProcess.msg);
    // }
    //   console.log(resp.data.status==401,"resp.data.statusresp.data.statusresp.data.status");
    //未登录
    if (resp.data.status == 401) {
        let code = resp.data.status;
        let errorProcess = GLOBAL_ERROR_MAP[code];
        errorProcess && errorProcess.process();
        return false
    }

    //后台定义接口 || 地图数据
    if (resp.data.status === 1 || resp.data !== '' || resp.data.type === "FeatureCollection") {
        resolve(resp.data);
    }
    else {
        if (resp.data.msg) {
            Message.error(resp.data.msg);
        }
        else {
            let errorProcess = GLOBAL_ERROR_MAP[resp.data.status];
            if (errorProcess) {
                Message.error(errorProcess.msg);
                errorProcess.process();
            }
        }

        reject(resp);
    }
}
//请求失败
function oFail(error) {

}
function install(Vue, options) {
    Vue.prototype.$http = $http;
}
export default install;

```
接下来在`api/index.js`配置api请求
```js
// index.js
import Vue from 'vue'
let vm = new Vue()

export function addUser(params) {
    return vm.$http.post(`addUser`, params);
}
```
然后在具体的组件里面调用这个接口
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
结果自然会出现跨域问题，页面提示的问题如下：
> Access to XMLHttpRequest at 'http://localhost:3000/api/addUser' from origin 'http://localhost:8082' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

这个时候，需要在服务器端设置一下，即可成功访问：
```js
const url = require('url')
const http = require('http')
const routerModal = require('./router/index')

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return;
        }
        let postData = ''
        // 接收请求传递过来的参数
        req.on('data', chunk => {
            console.log(chunk)
            postData += chunk
        })
        // 后台打印传递过来的参数
        req.on('end', () => {
            resolve(JSON.parse(postData))
        })
    })
}

const server = http.createServer((req, res) => {
    // 允许跨域设置
    res.setHeader("Access-Control-Allow-Origin","*");
    // res.setHeader("Access-Control-Allow-Origin","http://192.168.1.65:8080");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
    getPostData(req).then((data) => {
        console.log(data)
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
在开发的时候，如果不在服务端设置，vue项目里也可以配置跨域请求，代码如下：
```js
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
var SERVER_URL = '/api/';
// var SERVER_URL = 'http://localhost:3000/api/'
```
`api/index.js`不变还是这样写：
```js
// index.js
import Vue from 'vue'
let vm = new Vue()

export function addUser(params) {
    return vm.$http.post(`addUser`, params);
}
```
以上也可以实现对服务器进行跨域请求<br>
在进行上面操作的时候，我们向服务器发送的请求会出现两次，第一次是option请求第二次是才是我们的post请求，由于node服务器路由配置这里没有判断option这个请求，服务器会报错，所以还是需要加上对option的判断,修改`router/index.js`
```js
const url = require('url')
const { getUserList, addUser, deleteUser, updateUser } = require('../controller/user')

function handleRequest(req, res) {
    let urlObj = url.parse(req.url, true) // 获取请求的地址
    if (urlObj.pathname === '/api/getData' && req.method === 'GET') {
        return {
            msg: '获取getData成功',
            status: 1,
            data: getUserList()
        }
    }
    if (urlObj.pathname === '/api/updateData' && req.method === 'POST' || req.method === 'OPTIONS') {
        return {
            msg: '获取getData1数据成功'
        }
    }
    if (urlObj.pathname === '/api/addUser' && req.method === 'POST' || req.method === 'OPTIONS') {
        return {
            msg: '新增用户成功',
            status: 1,
            data: addUser(req.body) // 把post请求传递的数据传进来
        }
    }
    if (urlObj.pathname === '/api/deleteUser' && req.method === 'POST' || req.method === 'OPTIONS') {
        return {
            msg: '删除用户成功',
            status: 1,
            data: deleteUser(urlObj.query.id) // 把post请求传递的数据传进来
        }
    }
    if (urlObj.pathname === '/api/updateUser' && req.method === 'POST' || req.method === 'OPTIONS') {
        return {
            msg: '更新用户成功',
            status: 1,
            data: updateUser(urlObj.query.id, req.body) // 把post请求传递的数据传进来
        }
    }
}

module.exports = handleRequest
```