# 4. 详解如何在项目里配置路由（2）

> 本文章涉及到的代码已上传至github[vue-base-frame](https://github.com/darenone/vue-base-frame)

上篇文章，我讲了路由里面的，动态路由匹配，编程式导航，嵌套路由匹配，命名路由，命名视图，重定向这几个知识点，但是官网[vue-router](https://router.vuejs.org/zh/)上，不仅仅是这些内容，我提到的这些知识点是针对于真实的项目开发中用到的进行讲解，如果想了解更多vue-router的知识可以查阅官网内容

回忆一下上节的内容，在讲动态路由匹配和编程式导航的时候，组件中是如何获取由路由传递过来的值呢？

动态路由匹配：
```vue
<template>
    <section>
        {{$route.params.taskId}}
    </section>
</template>
```
编程式导航：
```vue
<template>
    <section>
        {{$route.query.taskId}}
    </section>
</template>
```
有没有发现，在具体组件里，我们使用的是`$route.params`和`$route.query`来获取路由传递过来的参数，假如这个组件用到其它路由下面呢，当路由不不携带参数时，组件里有这么个玩意儿`$route.query.taskId`就会报错，所以，采用上述两种方式，当需要组件复用时，由于路由和组件之间有着高度的耦合，不能最大程度复用组件，那么就需要采用其它方式了，那就是路由组件传参

## 1. 路由组件传参

路由组件传参也有3种方式实现：

第1种：布尔模式

修改`src/router/index.js`里面的路由：
```js
  {
    path: '/task-detail/:taskId',
    name: 'task-detail',
    component: () => import('../views/task-detail.vue'),
    props: true
  },
```
组件里面获取路由传递过来的值：
```vue
<template>
    <section>
        {{taskId}}
    </section>
</template>
<script>
export default {
    props: {
        taskId: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            
        }
    }
}
</script>
```
这样，当需要这个组件复用时，要想给组件传递taskId这个值，只需要调用这个组件即可
```vue
<task-detail :taskId="10000218"></task-detail>
```
通过路由给组件传值的时候要这样写:
```vue
<router-link to="/task-detail/10000217">任务详情10000217</router-link>
```
第2种：对象模式

只需要修改`src/router/index.js`里面的路由，组件里面和布尔模式一样：
```js
  {
    path: '/task-detail',
    name: 'task-detail',
    component: () => import('../views/task-detail.vue'),
    props: {
      taskId: '10000218'
    }
  },
```
通过路由给组件传值的时候要这样写:
```vue
<router-link to="/task-detail">任务详情10000217</router-link>
```
第3种：函数模式

只需要修改`src/router/index.js`里面的路由，组件里面获取值和上面两种一样：
```js
  {
    path: '/task-detail/:taskId',
    name: 'task-detail',
    component: () => import('../views/task-detail.vue'),
    props: route => {
      if (route.params && route.params.taskId) {
        return {
          taskId: route.params.taskId
        }
      }
    }
  },
```
通过路由给组件传值的时候要这样写:
```vue
<router-link to="/task-detail/10000217">任务详情10000217</router-link>
```
## 2. HTML5 History模式

讲这个之前，我先来介绍一个html中锚点的概念，就拿我写的这个博客来说，一篇文章很长，超过你电脑一屏就会出现滚动条，例如下面的文章内容：
```
标题

1. 小标题1

2. 小标题2

3. 小标题3

...
```
我想快速访问某个小标题的内容，可以这样来写
```html
<a href="#title1">访问小标题1</a>
<a href="#title2">访问小标题1</a>
<a href="#title3">访问小标题1</a>

...

<a name="title1">1. 小标题1</a>
<a name="title2">2. 小标题2</a>
<a name="title3">3. 小标题3</a>
<!--或者-->
<div id="title1">1. 小标题1</a>
<div id="title2">2. 小标题2</a>
<div id="title3">3. 小标题3</a>
```
这就是锚点的用法，这又和本节内容有什么关系呢？vue-router官方说，vue-router默认hash模式，hash是什么呢？我来介绍一下：

hash属性是一个可读可写的字符串，该字符串是URL的锚部分（从#号开始的部分），#代表网页中的一个位置，其右面的字符就是该位置的标识符（说的就是锚点），例如：
```
http://www.blog.com/index.html#title1
```
就代表网页index.html的title1位置，浏览器读取这个URL后会自动将title1位置滚动至可视区域

#是用来指导浏览器动作的，对服务器端完全无用，所以，HTTP请求中不包括#，比如访问下面的网址：
```
http://www.blog.com/index.html#title1
```
浏览器实际发出的请求是这样的：
```
GET /index.html HTTP/1.1
Host: www.example.com
```
可以看到只请求了index.html，根本没有#title1这部分

所以，在URL中，第一个#后面出现的任何字符，都会被浏览器解读为位置标识符（锚点），这些字符都不会被发送到服务器端，而且改变URL中#后面的部分，只相当于改变了锚点，浏览器只会滚动到相应位置，不会重新加载网页，比如：
```
http://www.blog.com/index.html#title1
到
http://www.blog.com/index.html#title2
```
这种锚点的改变，完全由浏览器控制，而不会重新向服务器请求index.html这个页面

现在我们再回到vue-router官方文档这里，它提到了，vue-router默认hash模式（#后面跟字符串）使用hash来模拟一个完整的URL，于是当URL改变时，页面不会重新加载，如果不想要这种方式展示，还可以用路由的history模式
```js
const router = new VueRouter({
  mode: 'history',
  routes
})
```
这样，路由就变化了:
```
http://localhost:4000/#/task-detail/10000216
变成了
http://localhost:4000/task-detail/10000217
```
但是这种模式也需要后端的支持，因为我们的应用是个单页客户端应用，只有一个index.html页面，当路由变化时，如果采用hash模式，从路由：
```
http://localhost:4000/#/task-detail/10000217
变到
http://localhost:4000/#/about
```
时，不会重新请求页面，至始至终只有一个index.html页面，路由的变化，也可以看成是锚点的改变，相当于浏览器从#/task-detail这个锚点到/about这个锚点，但是如果采用history模式，从路由：
```
http://localhost:4000/task-detail/10000217
变成了
http://localhost:4000/about
```
这个时候浏览器就会认为是需要向服务器请求task-detail.html和about.html这两个html的，但是服务器上根本没有这两个html，就会报404文件未找到错误，所以这个时候就需要后端哥们的支持，未匹配到html页面的时候，就返回index.html这个页面，具体后端怎么配置，可以参考官方文档

## 3. 导航守卫

这部分是vue-router部分，在实际项目开发中也很有用处，用来判断用户是否登录，或者是否有权限访问某一个页面，它帮助我们在路由发生跳转到导航结束这个过程中做一些逻辑处理，我分几个部分来讲

第一种：全局前置守卫

来看下src/router/index.js里的`router`，这是vue-router的实例，它上面有一个`beforeEach`方法，功能就是进行全局前置守卫

咱们来看下如何使用：
```js
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
  {
    path: '/task-detail/:taskId',
    name: 'task-detail',
    component: () => import('../views/task-detail.vue'),
    props: route => {
      if (route.params && route.params.taskId) {
        return {
          taskId: route.params.taskId
        }
      }
    }
  },
  {
    path: '/product',
    name: 'product',
    component: () => import('../views/product/index.vue'),
    children: [
      {
        path: 'ele-product', // 子路由需要前面加'/'，只有副路由才有
        name: 'ele-product',
        component: () => import('../views/product/ele-product.vue'),
        children: [
          {
            path: 'phone', // 子路由需要前面加'/'，只有副路由才有
            name: 'phone',
            components: {
              default: () => import('../views/product/phone.vue'),
              apple: () => import('../views/product/apple.vue'),
              mi: () => import('../views/product/mi.vue'),
              vivo: () => import('../views/product/vivo.vue'),
            },
          },
          {
            path: 'computer', // 子路由需要前面加'/'，只有副路由才有
            name: 'computer',
            component: () => import('../views/product/computer.vue'),
          }
        ]
      }
    ]
  },
  ...errorRoutes,
  {
    path: '*',
    redirect: '/notFound'
  }
]

const router = new VueRouter({
  mode: 'history',
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
// next()方法一定要加，不然不能跳转

router.afterEach((to, from) => {
    app = document.querySelector('.app-content-inner')
    app && app.scrollTo(0, 0)
})

export default router
```
上面的代码很好读懂，我就不做一一介绍，大概逻辑就是从本地session拿token看是否已经登录，登录了直接跳转到首页，没有登录，看看当前路由是否在白名单那里，不在直接跳转到登录页登录

第二种：全局后置钩子

router实例下的`afterEach`方法就是全局后置钩子，和前置守卫不同的是，这些钩子不会接受next函数，也不会改变导航本身

第三种：路由独享的守卫

```js
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: (to, from, next) => {
      if (from.name === 'Home') {
        console.log('从home页跳转过来')
      } else {
        console.log('不是从home页跳转来的')
      }
      next()
    }
  },
```
第四种： 组件内守卫

`beforeRouteEnter`

提到这个的时候，想起来前几天做项目遇到一个问题，我有一个创建任务的页面（http://localhost:8082/#/web-task/task-create），分别可以从两个页面：监测任务列表（http://localhost:8082/#/web-task/web-list）和监测任务管理（http://localhost:8082/#/web-task/task-list）跳转过来，需求是，从哪个页面跳转过来的，当任务创建完毕还回到哪个页面

常规思路就是在创建任务的页面监听路由的变化，拿到from.path里的值，也就是上个页面的路由，但是怎么都监听不到路由的变化，这个时候我就想到了`beforeRouteEnter`使用组件内守卫，可以拿到to和from
```js
beforeRouteEnter (to, from, next) {
    console.log(to.name)
    console.log(from.name)
    console.log(this) // undefined
    next()
}
```
但是我发现在里面拿不到this这个vue实例，解释原因是因为：走这一步的时候，当前组件还没有渲染完成，vue实例还未创建完成，但是我非要使用肿么办？

解决方法就是给next函数传一个回调函数，完美解决这个问题
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    if (from.name === 'web_list') {
        vm.from_router = '/web-task/web-list'
    } else if (from.name === 'task_list') {
        vm.from_router = '/web-task/task-list'
    }
  })
}
```
`beforeRouteLeave`

关于这个的用法，比如用户在当前页面进行编辑操作，还没有保存就要跳转到其它页面，那么你就可以在这个钩子函数里面提醒用户，编辑还未完成，是否取消编辑，这里提示一下：在这个方法里可以直接用this
```vue
<script>
export default {
    props: {
        taskId: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
    beforeRouteLeave (to, from, next) {
        const leave = confirm('确定离开吗？')
        if (leave) {
            next()
        } else {
            next(false)
        }
        // next(vm => {
        //     console.log(vm) // vue实例
        // })
    },
    beforeRouteUpdate (to, from, next) {
        console.log('组件被复用')
        next()
    }
}
</script>
```
`beforeRouteUpdate`
```js
// 在当前路由改变，但是该组件被复用时调用
// 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
// 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
// 可以访问组件实例 `this`
beforeRouteUpdate (to, from, next) {
  console.log('组件被复用')
  next()
}
```
## 4. 路由元信息
```js
{
  path: '/',
  name: 'Home',
  component: Home,
  meta: {
    title: '首页',
    requiresAuth: ['admin', 'user']
  }
},
```
这里的meta就是元信息，可以在这里给每个路由对象配一个title或者打一个标志，用来区别哪些用户可以访问这个路由

接下来，我讲一个具体的用法，利用前置守卫和路由元信息，修改`window.document.title`的值

首先找到咱们在第二节新建的src/lib/util.js，当时说了这个文件用来存放和业务相关的方法，接下来咱们就新建一个和业务有关联的方法
```js
// util.js
export const setTitle = (title) => {
  window.document.title = title ? title + '-拨测管理平台' : '拨测管理平台'
}
```
然后在src/router/index.js里面引入，并且在前置守卫里增加一行代码
```js
// router/index.js
import {setTitle} from '@/lib/util'

router.beforeEach((to, from, next) => {
  to.meta && setTitle(to.meta.title)
})
```
## 5. 过渡效果

路由切换的时候，在`<router-view>`里面加载页面，我们可以利用`<transition>`组件给它添加一些过渡效果
```vue
<transition>
  <router-view></router-view>
</transition>
```
如果是多个视图，需要用`<transition-group>`包裹
```vue
<transition-group>
  <router-view></router-view>
  <router-view name="phone"></router-view>
</transition-group>
```
我来写一个过渡效果的例子：
```vue
<transition name="router">
  <router-view/>
</transition>

<style lang="less">
// 进入效果
.router-enter {
  opacity: 0;
}
.router-enter-active {
  transition: opacity 1s ease;
}
.router-enter-to {
  opacity: 1;
}
// 离开效果
.router-leave {
  opacity: 1;
}
.router-leave-active {
  transition: opacity 1s ease;
}
.router-leave-to {
  opacity: 0;
}
</style>
```
具体你想要什么效果，都可以按照我这个模式来写就行了