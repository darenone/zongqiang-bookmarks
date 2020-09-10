### 改造由vue-cli 3.x创建的模板项目
这个简单的模板文件此时还不能满足实际的开发需求，接下来就是对其进行实际的改造以便于我们开发vue项目，首先说明，下文中所有的修改基本上是在src这个主文件夹里进行
1. 在src里新增api文件夹，项目里ajax请求都写在这里面，以便于管理
2. 在src/assets文件夹，新增img文件夹，新增font文件夹
3. 在src里新增directive文件夹，用来放vue的自定义指令
4. 在src里新增lib文件夹，并且新增src/lib/util.js（存放一些与业务结合的工具方法），新增src/lib/tool.js（存放一些与业务无关的工具方法）

举个简单的例子
```js
// util.js

```
```js
// tool.js
/*
 * 将空数据显示为--
 * @params val {all} 需要处理的值
 * @params unit {String} 单位
 * @return {String} 处理后的值
 * @author 宗强 2020/09/09
 */
export function handleEmpty (val, unit) {
    if (val !== 0) {
        if (typeof val === 'undefined' || val === null || val === '' || val === 'null' || val === '--') {
            return '--'
        }
    }
    if (unit) {
        return val + unit
    } else {
        return val
    }
}
```
在某一个页面使用这个函数
```js
import { handleEmpty } from '@/lib/tool'
```
5. 在src里新增config文件夹，项目里的配置都可以写在这里

举个例子，比如项目里有很多地方，需要对电信，移动，联通，这三个运营商进行颜色区别，那我就可以在config文件夹里新增color.js文件
```js
// color.js
export default {
    '电信': 'red',
    '移动': 'yellow',
    '联通': 'green'
}
```
在某一个页面使用这个配置，只需要引入即可
```js
import colorConfig from '@/config/color'
```
6. 在src里新增errorpage文件夹，当出现路由出错，服务器出错，浏览器兼容等问题的时候，能够跳转到相应的页面提示用户

具体实现方法如下：在src/errorpage文件夹下新增4个文件
```
1. browser_check.vue // 浏览器兼容
2. extra_401_option.vue // 未登录或登录超时
3. extra_404_option.vue // 访问的页面未找到
4. extra_500_option.vue // 访问接口出错
```
具体这几个页面里的内容，代码已上传至git，可以直接找到src/errorpage这个文件夹查看[vue-base-frame](https://github.com/darenone/vue-base-frame)

现在4个页面有了，接下来就是配置这几个页面的路由了

找到项目里，src/router这个文件夹新增error-router.js文件，配置路由如下：
```js
// router/error-router.js
export default [
    {
        path: '/compatible',
        name: 'compatible',
        meta: { title: '兼容'},
        component: resolve => require(['@/errorpage/browser_check.vue'], resolve),
    },
    {
        path: '/notLogin',
        name: 'notLogin',
        meta: { title: '未登录或超时'},
        component: resolve => require(['@/errorpage/extra_401_option.vue'], resolve),
    },
    {
        path: '/notFound',
        name: '404',
        meta: { title: '页面不存在'},
        component: resolve => require(['@/errorpage/extra_404_option.vue'], resolve),
    },
    {
        path: '/abnormal',
        name: 'abnormal',
        meta: { title: '服务器异常'},
        component: resolve => require(['@/errorpage/extra_500_option.vue'], resolve),
    },
]
```
修改router/index.js文件
```js
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import errorRoutes from './error-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  ...errorRoutes
]

const router = new VueRouter({
  routes
})

const whitelist = ['login', 'error401', 'error500', 'notFound', 'compatible', 'notLogin', '404', 'abnormal']

let app;
router.beforeEach((to, from, next) => {
    // const isLogin = !!sessionStorage.getItem('accessToken');
    const isLogin = true

    if (isLogin) {
        if (to.name === 'login') {
            next({
                name: 'home'
            });
        } else {
            next()
        }
    } else {
        if (whitelist.indexOf(to.name) !== -1) {
            next()
        } else {
            next({
                name: 'login'
            })
        }
    }
});


router.afterEach((to, from, next) => {
    app = document.querySelector('.app-content-inner')
    app && app.scrollTo(0, 0)
})

export default router
```
然后npm run serve启动项目，浏览器输入启动地址，比如：http://localhost:4000/#/abnormal，就可以看到新增的几个页面了

7. 在src/store文件夹下新增几个文件（关于vue的状态管理，我会单独写一篇文章放在vue理论里面讲，搞清楚vuex到低是什么以及怎么用）
```
state.js
mutations.js
actions.js
```
然后在index.js里面引入这几个文件
```js
// index.js
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
  }
})
```
如果你的项目比较负载有可能需要对state进行模块化管理，这个时候就需要在src/store下新增module文件

举个例子

在src/store/module下新增user.js文件，内容如下：
```js
// user.js
const state = {}
const mutations = {}
const actions = {}

export default {
    state,
    mutations,
    actions
}
```
然后在index.js里面引入这个文件
```js
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import user from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    user
  }
})
```
8. 在src下新增mock，在我们开发的时候可以用来模拟数据用，并新增src/mock/index.js文件，在里面添加两行代码：
```js
import Mock from 'mockjs'


export default Mock
```

这里需要在项目里安装`mockjs`依赖，cmd执行如下命令：
```
cnpm/npm install mockjs -D // 此依赖只作为开发环境使用，所以后缀不是--save 而是-D，而且打包的时候这个依赖不会打包进去
```
OK，完成上述步骤，一个真正满足开发需求的vue项目框架已经搭建完成，接下里的文章，我都会在这个框架之上修修补补，来搭建起一个功能更加丰富的项目
<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>
