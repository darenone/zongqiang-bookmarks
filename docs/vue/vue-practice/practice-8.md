# 8. 如何在vue中设置跨域

vue跨域我在node章节，[轻松解决接口跨域问题](./../../node/nodeJs/practice-16.md)中就有简单介绍过，这里我集中讲解一下如何在vue中设置跨域问题

跨域在前端项目开发中最为常见，因为前端程序员在他自己的电脑上开发项目，而后端程序员也是在他自己的电脑上开发项目，当前后端需要对接口进行联调时，由于浏览器同源策略的限制（协议，ip地址，端口号不同时），从a电脑的浏览器发送请求到b电脑的服务器获取数据，服务器把数据返回给了浏览器，但是由于浏览器本身安全机制的限制，它会把服务器返回的数据进行拦截，并且在控制台给你提示一个跨域请求被限制的提示：

```
Access to XMLHttpRequest at 'http://localhost:3000/api/addUser' from origin 'http://localhost:8082' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

这个时候要么后端在他的接口响应头中设置一下，放开对服务器请求的限制，要么就是前端人员自己配置跨域请求，但是你要注意，如果只是前端人员配置了跨域请求，后端没有配置，在开发阶段，你可以通过跨域访问后端的接口，但是如果项目打包上线了，前端人员配置的跨域就会失去作用，如果打包以后前后端的项目又没有部署在一起，线上跨域的问题仍然会出现，而且此时出现的跨域只有后端人员在它的返回头里面设置一下，或者把前后端项目部署在同服务器的同端口下才能解决，也就是说项目打包上线以后，再出现的跨域问题，前端是解决不到的

以上跨域的解决方案对所有前端项目都适用，在这篇文章里主要说明一下，如何在vue项目里解决跨域问题

## 1. 在vue-cli 2.x中配置跨域

vue-cli 2.x建立的项目比vue-cli 3.x建立的项目，多了`build`和`config`两个文件夹，这两个都是webpack的配置文件，方便我们开发和打包用的，而vue-cli 3.x是基于webpack 4.x（零配置特性）构建的脚手架工具，由它创建的项目已经没了`build`和`config`两个文件夹，取而代之的是`vue.config.js`文件

使用跨域设置，相当于开一个代理服务器，因为服务器与服务器直接进行通信是没有跨域限制的，在浏览器和目标服务器之间设置一个代理服务器，它和我们的前端项目同ip同端口，当浏览器给目标服务器通信时，浏览器先给代理服务器通信，代理服务器给目标服务器通信，然后目标服务把需要返回的数据，先发给代理服务器，然后代理服务器再把数据返回给浏览器

1. 假如后端给你的接口如下：

> http://10.0.0.186:18090/idcMonitorServer/task/getTaskDataList

> http://10.0.0.186:18090/idcMonitorServer/performance/overview

此时找到项目里`config/index.js`文件，在`proxyTable`里面配置如下：
```js
    proxyTable: {
        '/idcMonitorServer': {
          target: 'http://10.0.0.186:18090', // 测试
          changeOrigin: true,
        },
    },
```
解释一下：
```js
'/idcMonitorServer': {}
```
就是告诉代理服务器，接口以'/idcMonitorServer'开头的才使用代理，不然的话，可能html，css，js这些静态资源都跑去代理

你的请求就要这样写：
```js
let SERVER_URL = '/idcMonitorServer/'
let url = 'task/getTaskDataList'
// post请求
axios.post(SERVER_URL + url, qs.stringify(params)).then(function(res) {
    console.log(resp)
}).catch(function(error) {
    console.log(error)
});
```
2. 假如后端给你的接口如下：

> http://10.0.0.186:18090/api/task/getTaskDataList

> http://10.0.0.186:18090/api/performance/overview

此时找到项目里`config/index.js`文件，在`proxyTable`里面配置如下：
```js
    proxyTable: {
        '/api': {
          target: 'http://10.0.0.186:18090', // 测试
          changeOrigin: true,
        },
    },
```
你的请求就要这样写：
```js
let SERVER_URL = '/api/'
let url = 'task/getTaskDataList'
// post请求
axios.post(SERVER_URL + url, qs.stringify(params)).then(function(res) {
    console.log(resp)
}).catch(function(error) {
    console.log(error)
});
```
3. 假如后端给你多个服务器下的接口如下：

> http://10.0.0.186:18090/idcMonitorServer/task/getTaskDataList

> http://10.0.0.121:18080/api/performance/overview

此时找到项目里`config/index.js`文件，在`proxyTable`里面配置如下：
```js
    proxyTable: {
        '/idcMonitorServer': {
          target: 'http://10.0.0.186:18090', // 测试1
          changeOrigin: true,
        },
        '/api': {
          target: 'http://10.0.0.121:18080', // 测试2
          changeOrigin: true,
        },
    },
```
你的请求就要这样写：
```js
let SERVER_URL1 = '/idcMonitorServer/'
let SERVER_URL2 = '/api/'
let url1 = 'task/getTaskDataList'
let url2 = 'performance/overview'
// post请求
axios.post(SERVER_URL1 + url1, qs.stringify(params)).then(function(res) {
    console.log(resp)
}).catch(function(error) {
    console.log(error)
});
axios.post(SERVER_URL2 + url2, qs.stringify(params)).then(function(res) {
    console.log(resp)
}).catch(function(error) {
    console.log(error)
});
```
4. 假如后端给你不带/api的接口如下：

> http://10.0.0.186:18090/task/getTaskDataList

> http://10.0.0.186:18090/performance/overview

给的接口里既没有`/api`也没有像我的项目里`/idcMonitorServer`这类标识，这种接口应该如何配置跨域呢？`pathRewrite`就派上了用场：

此时找到项目里`config/index.js`文件，在`proxyTable`里面配置如下：
```js
    proxyTable: {
        '/api': {
          target: 'http://10.0.0.121:18080', // 测试2
          changeOrigin: true,
          pathRewrite： {
            '^/api': '' // 正则匹配'/api'这个字符串
          }
        },
    },
```
你的请求就要这样写：
```js
let SERVER_URL = '/api/'
let url1 = 'task/getTaskDataList'
let url2 = 'performance/overview'
// post请求
axios.post(SERVER_URL + url1, qs.stringify(params)).then(function(res) {
    console.log(resp)
}).catch(function(error) {
    console.log(error)
});
```
由于后端人员给我们的接口里面没有'/api'，为了想要标识哪些接口需要跨域，我们前端人员手动在这些接口上都添加一个'/api'，但是因为这是我们前端人员自己添加的，后端并没有这个'/api'，请求接口的时候会报404错误，此时就需要使用`pathRewrite`，在请求时将路径的/api置空，`'^/api': ''`，这样对跨域的接口添加'/api'这个标识，同时又在请求接口的时候去掉'/api'，以便我们能够正确请求接口，返回数据

## 2. 在vue-cli 3.x中配置跨域

由vue-cli 3.x创建的项目，跨域配置需要到`vue.config.js`里面设置，其设置如下：
```js
  // 跨域配置
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    hot: true, // vue cli3.0 关闭热更新
    // liveReload: false, // webpack liveReload关闭
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://10.0.0.186:18090', // 测试环境
        changeOrigin: true
      }
    }
  },
```
`proxyTable`变成了`proxy`，其它都是一样的，对于后端人员给的接口的几种情况，上面已经给了解决方案，请参考vue-cli 2.x配置即可
