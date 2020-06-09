### axios封装
在你的vue项目中新建`src/http/$http.js`文件：
```js
// src/http/$http.js
import axios from "axios"
import qs from "qs"

const SERVER_URL = "/api/"

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

export const $http = {
    // post请求 form-data格式传递参数
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
    },
    // post请求 json格式传递参数
    postJson (url, params) {
        if (params === undefined) {
            params = {}
        }
        let header = { 'Content-Type':"application/json" }
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + url, params, { headers: header }).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    },
    // post请求 form表单传递参数
    postForm (url, params, config) {
        if (params === undefined) {
            params = {}
        }
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + url, params, config).then((resp) => {
                successFn(resp, resolve, reject)
            }).catch((err) => {
                failFn(err)
            })
        })
    },
    // get请求
    get (url, params) {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + url, qs.stringify(params)).then((resp) => {
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
然后在`main.js`里面引入：
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
之后配置接口路由，新建`src/api/api1.js`
```js
// src/api/api1.js
import Vue from 'vue';
let vm = new Vue();
// 获基本信息接口
export function accountInfo(params) {
    return vm.$http.post(`userAccount/accountInfo`, params); // http://113.207.110.212:8091/api/userAccount/accountInfo
}
export const getUserList = (params) => {
    return vm.$http.get(`userList`, params) // http://113.207.110.212:8091/api/userList
}
export function dataTable(params) {
    return vm.$http.postJson(`performance/dataTable`, params); // http://113.207.110.212:8091/api/performance/dataTable
}
```
之后就是在具体的页面中调用了
```vue
<script>
import { accountInfo, getUserList, dataTable  } from "@/api/home.js"
export default {
  name: "Home",
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {
    accountInfo({
      name: '宗强',
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
