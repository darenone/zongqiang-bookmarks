### vue项目跨域配置
关于vue项目在开发阶段出现的跨域问题，我们可以不依托后端来解决，但是如果你的vue打包上线以后出现的跨域问题，还是需要后端来解决，具体后端如何解决跨域问题，可以参考[轻松解决接口跨域问题](./../../node/nodeJs/practice-16.md)这篇文章
#### 1. 如果是vue-cli 2.0创建的项目
假如后端给了你一个这样的接口：`http://113.207.110.212:8091/api/userAccount/accountInfo`,如何配置跨域请求呢？<br>
首先找到你的项目`config/js`文件，修改`proxyTable`：
```js
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/api': {
            target: 'http://113.207.110.212:8091', // 现网
            changeOrigin: true
        },
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },
```
打开`src/http/$http.js`文件，这个文件是我对axios进行的封装，如果你的项目里没有这个文件，可以参考这篇文章[axios封装](./practice-2.md)
```js
const SERVER_URL = "/api/"
```
打开`src/api/api1.js`
```js
import Vue from 'vue'
let vm = new Vue()

export const addUser = (params) => {
    return vm.$http.post(`userAccount/accountInfo`, params)
}
```
然后在具体页面调用接口就可以了<br>
又假如后端给了你一个这样的接口：`http://113.207.110.212:8091/idcMonitorServer/userAccount/accountInfo`<br>
同样找到`config/js`文件，修改`proxyTable`：
```js
proxyTable: {
    '/idcMonitorServer': {
        target: 'http://113.207.110.212:8091',
        changeOrigin: true
    },
},
```
打开`src/http/$http.js`文件，修改如下：
```js
var SERVER_URL='/idcMonitorServer/'
```
其它的不变
#### 2. 如果是vue-cli 3.0创建的项目
在项目根目录下，找到vue.config.js文件，如果没有就新建一个这样的配置文件，当启动项目的时候，这个文件会被自动加载，我们主要来看一下如何配置跨域设置：
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
        proxy: {
            '/api': {
                target: 'http://113.207.110.212:8091',
            }
        }
    }
}
```
然后同理就是修改`$http.js`文件、`api/api1.js`文件<br>
如果路由是：`http://113.207.110.212:8091/idcMonitorServer/userAccount/accountInfo`，`devServer`就做如下修改：
```js
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
        proxy: {
            '/idcMonitorServer': {
                target: 'http://113.207.110.212:8091',
            }
        }
    }
}
```
`$http.js`修改如下：
```js
var SERVER_URL='/idcMonitorServer/'
```
其它的都是一样滴哦，如果不配置跨域，需要在`vue.config.js`注释掉这行代码：
```js
// vue.config.js
module.exports = {
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:3000',
    //         }
    //     }
    // }
}
```
同时也需要修改`$http.js`:
```js
// $http.js
const SERVER_URL = "http://localhost:3000/api/"
```
相当于把接口写死，然后重启vue项目，打开浏览器控制台，会提示以下信息：
> Access to XMLHttpRequest at 'http://localhost:3000/api/addUser' from origin 'http://localhost:8081' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:4000' that is not equal to the supplied origin.

也就是说我们的vue项目部署在`http://localhost:8081`端口为8081的服务器上，当服务器去访问`localhost:3000`端口为3000的服务器时，由于同源策略，访问被浏览器拦截
而我们设置了跨域，然后在控制台`network`那里看到，本来是请求`http://localhost:3000/api/addUser`这个接口，设置了跨域以后，我们请求的接口变成了`http://localhost:8081/api/addUser`
可以看到相当于启用了一个代理服务器为`localhost:8081`，我们先访问代理服务器，然后代理服务器再访问我们的`localhost:3000`这台服务器，拿数据，为啥这样可以呢？<br>
因为同源策略这是浏览器进行的一个安全设置，而服务器与服务器之间通信，是不存在这种限制滴！好啦，关于vue如何设置跨域，我已经讲得很明白了，希望对你开发项目有所帮助
需要提一下，可以对多个不同接口配置跨域请求
```js
devServer: {
        open: true, // 浏览器自动打开
        hot: true, // 热更新，保存自动更新
        host: '0.0.0.0', // 局域网内可以访问
        port: 8082,
        proxy: {
            '/idcMonitorServer': {
                target: 'http://113.207.110.212:8091', // http://113.207.110.212:8091/idcMonitorServer/addUser
            },
            '/api': {
                target: 'http://113.207.110.212:8090', // http://113.207.110.212:8090/api/addUser
            },
        }
    }
```
