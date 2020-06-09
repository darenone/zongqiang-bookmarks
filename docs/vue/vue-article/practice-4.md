### vue项目中不同环境配置不同的接口地址
我先来启动一个由vue-cli 2.0创建的项目，执行`npm run dev`启动项目，执行`npm run build`打包项目<br>
在项目根目录找到`config/index.js`，配置跨域请求：<br>
这里请求的接口是我本地启动的node服务器：`http://localhost:3000/api/addUser`，关于如何利用nodeJS来启动一个服务器，同时操作MySQL，可以参考这篇文章[轻松解决接口跨域问题](./../../node/nodeJs/practice-16.html)
```js
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/api': {
          target: 'http://localhost:3000',
        },
    },
  },
}
```
其它不动，运行一下`npm run build`打包部署到服务器上，这里提一下，如何利用express框架启动一个服务器，并把我们打包后的文件放到服务器上面，可以参考这篇文章[利用express的Router方法构建模块化路由](./../../node/nodeJs/practice-29.html)<br>
服务器启动地址为：`localhost:4000`，打包完成放到这个服务器上，浏览器输入：`http://localhost:4000`来访问，可以看到有一个接口请求：`http://localhost:4000/api/addUser`报404<br>
服务器启动地址改为：`localhost:5000`，打包完成放到这个服务器上，浏览器输入：`http://localhost:5000`来访问，可以看到有一个接口请求：`http://localhost:5000/api/addUser`报404<br>
我们本来要访问的接口是`http://localhost:3000/api/addUser`才对，由于项目中没有配置生产环境和开发环境的请求地址，项目打包以后，实际的接口就会变成`/api/addUser`这个，当你用浏览器打开`http://localhost:4000`访问项目，并请求这个接口的时候，会自动加上前面的域名，即接口请求就会变成`http://localhost:4000/api/addUser`由于公司运维在部署项目的时候，前后端项目都是部署在同一个服务器下，所以即使我再打包的时候不进行配置也可以正常访问接口，但是如果前后端项目部署在不同的服务器上，就会报404错误，所以，接下来我们来学习一下如何在不同环境下配置不同的请求地址：<br>
先找到`src/dev.env.js`文件，内容如下：
```js
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})
```
接下来配置一下开发环境中使用的接口地址，新增一个属性`BASE_URL`，它是我自己定义的，关于叫什么你可以自己设置比如，比如叫`url_api`或`API_ROOT`都OK
```js
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:3000"'
})
```
接着看一下`src/prod.env.js`文件，内容如下：
```js
'use strict'
module.exports = {
  NODE_ENV: '"production"',
}
```
在这个文件中同样添加属性`BASE_URL`，并为其配置线上接口地址：
```js
'use strict'
module.exports = {
  NODE_ENV: '"production"',
  BASE_URL: '"http://localhost:3000"'
}
```
然后找到`$http.js`文件，修改如下：
```js
// const SERVER_URL = "/api/"
const SERVER_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL + '/api/' : '/api/' 
```
由于配置了跨域请求，开发环境在这里接口就不能写死，而是直接写`/api/`就行，接下来打包放到`localhost:5000`服务器上，可以看到，请求的接口就是我们刚刚配置的接口：`http://localhost:3000/api/addUser`以上就完成了对生成环境和开发环境的接口配置
接下来我来讲一下另外一个可能在项目会遇到的需求，就是当你开发项目的时候，有多个模块，分别有多个后端开发人员来开发，而且给你的接口地址还不一样，这个时候，如何处理这些来至不同服务器的接口地址呢？接下来，我们来实操一下：<br>
分别启动三个不同端口的node服务器，提一下如何启动node服务器，可以参考[轻松解决接口跨域问题](./../../node/nodeJs/practice-16.html)这篇文章
服务器启动以后，分别提供给前端调用的接口为：
1. 接口`http://localhost:3000/api/addUser`，请求方式post
2. 接口`http://localhost:3001/api/addUser`，请求方式post
3. 接口`http://localhost:3002/api/addUser`，请求方式post
拿到这三个接口，那么就需要修改前端代码了：<br>
和`$http.js`同级的目录下新建`baseURL.js`文件，用来保存不同接口的地址：
```js
export default {
    BASE_M1_URL: 'http://localhost:3000',
    BASE_M2_URL: 'http://localhost:3001',
    BASE_M3_URL: 'http://localhost:3002',
}
```
在`$http.js`里面引入，并且修改`$http.js`里面的代码：
```js
import axios from "axios"
import qs from "qs"
import domain from './baseURL'

// const SERVER_URL = "/api/"

const GLOBAL_ERROR_MAP = {
    "0": {
        msg: '数据加载异常，请刷新重试'
    },
    "-1": {
        msg: "程序异常",
        process() {

        }
    },
    "-2": {
        msg: "没该地址",
        process() {
            window.location.href = window.location.pathname + "#/login"
        }
    },
    401: {
        msg: "你还没有登录，请登录后操作",
        process() {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = window.location.pathname + "#/login"
        }
    },
    404: {
        msg: "数据接口或页面未找到",
        process() {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = window.location.pathname + "#/login"
        }
    },
    500: {
        msg: "服务器出错啦，请联系管理员",
        process() {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = window.location.pathname + "#/login"
        }
    },
    504: {
        msg: "服务器出错啦，请联系管理员",
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
            if (showMessage()) {
                if (resp.data.msg) {
                    console.log(resp.data.msg)
                } else {
                    console.log('无数据返回')
                }
            }
            reject(resp.data.msg)
        }
        errorProcess.process()
    }
}
// 清秀失败的处理函数
const failFn = (err) => {
    if (err.response) {
        let errorProcess = GLOBAL_ERROR_MAP[err.response.status]
        errorProcess && errorProcess.process()
    }
}
// 信息提示去重
let lastTime = ''
const showMessage = () => {
    let show = false
    if (!lastTime || new Date() - lastTime > 2000) {
        lastTime = new Date()
        show = true
    }
    return show;
}

function requireData (url, type) {
    switch (type) {
        case 'M1':
            return url = domain.BASE_M1_URL + '/api/' + url
        case 'M2':
            return url = domain.BASE_M2_URL + '/api/' + url
        case 'M3':
            return url = domain.BASE_M3_URL + '/api/' + url
        default:
            return url = domain.BASE_M3_URL + '/api/' + url
    }
}

export const $http = {
    // post请求 form-data格式传递参数
    post: function(url, params, type) {
        if (params === undefined) {
            params = {}
        }
        return new Promise ((resolve, reject) => {
            console.log(requireData(url, type))
            axios.post(requireData(url, type), qs.stringify(params)).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    },
    // post请求 json格式传递参数
    postJson (url, params, type) {
        if (params === undefined) {
            params = {}
        }
        let header = { 'Content-Type':"application/json" }
        return new Promise((resolve, reject) => {
            axios.post(requireData(url, type), params, { headers: header }).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    },
    // post请求 form表单传递参数
    postForm (url, params, config, type) {
        if (params === undefined) {
            params = {}
        }
        return new Promise((resolve, reject) => {
            axios.post(requireData(url, type), params, config).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    },
    // get请求
    get (url, params, type) {
        return new Promise((resolve, reject) => {
            axios.get(requireData(url, type), qs.stringify(params)).then((resp) => {
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
同时也要修改一下`src/api/api1.js`里面的代码：
```js
import Vue from 'vue'
let vm = new Vue()

export const addUser1 = (params) => {
    return vm.$http.post(`addUser`, params, 'M1')
}

export const addUser2 = (params) => {
    return vm.$http.post(`addUser`, params, 'M2')
}

export const addUser3 = (params) => {
    return vm.$http.post(`addUser`, params, 'M3')
}
```
然后在具体的页面调用：
```vue
<script>
import { addUser1, addUser2, addUser3 } from "@/api/home.js"
export default {
  name: "Home",
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {
    addUser1({
      name: '宗强1',
      city: '成都',
      sex: 2
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    addUser2({
      name: '宗强2',
      city: '成都',
      sex: 2
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    addUser3({
      name: '宗强3',
      city: '成都',
      sex: 2
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
};
</script>
```