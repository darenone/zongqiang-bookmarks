# 3. 详解如何在项目里配置路由（1）

接着上一节讲，基本框架已经搭建完成，接下来最重要的就是项目里路由配置了，它管理着页面间的跳转

我们做前端项目，基本上步骤就是：搭建前端框架--配置项目路由--开发具体页面，按照这一步骤，我们来详细讲解一下vue Router的知识和使用方法，学习这篇文章你可以可以对照着官方文档[Vue Router](https://router.vuejs.org/zh/)来学习

我们来看一下src/APP.vue里面的内容：
```vue
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
```
其中`<router-link></router-link>`和`<router-view/>`都是vue的内置组件，这里简单介绍下这种内置组件的作用
```
<router-link></router-link> 它是一个闭合标签，等同于封装后的a标签，里面有一个很重要的属性to，它的值是一个需要跳转的路径
<router-view/> 它是一个开标签，等同于<router-view></router-view>，它是视图渲染组件，通过<router-link>跳转到某个页面时所加载的组件都会在这里渲染
```
可能有些人有些疑问，什么是闭合标签什么是开标签呢？

简单介绍一下，比如`<router-link to="/">Home</router-link>`它里面有home这个内容，所以只能写成闭合标签，像`<router-view></router-view>`这种标签，里面没有内容，就可以简写成开标签`<router-view/>`

接下来切入正题，我们来说第一个知识点：

## 1. 动态路由匹配

来举一个实际的例子：有一个页面，展示的是所有任务的一个table页，在table页的每一行，都有一个查看按钮，点击查看可以跳转到任务详情的页面，查看任务详细数据
```
http://10.0.0.186:18090/#/task/task-detail/10000218
http://10.0.0.186:18090/#/task/task-detail/10000217
http://10.0.0.186:18090/#/task/task-detail/10000216
```
跳转的时候，需要把taskId传过去，然后详情页面才能根据taskId请求接口，获取任务的详情

好了，知道需求了，利用动态路由匹配我们应该怎么做呢？

在src/index.js里面配置路由：
```js
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
    name: 'taskDetail',
    component: () => import('../views/task-detail.vue')
  },
  ...errorRoutes
]
```
在src/App.vue里配置路由：
```vue
<router-link to="/task-detail/10000218">任务详情10000218</router-link>
<router-link to="/task-detail/10000217">任务详情10000217</router-link>
<router-link to="/task-detail/10000216">任务详情10000216</router-link>
```
新增src/views/task-detail.vue页面，来接收通过路由传递过来的值
```vue
<template>
    <section>
        {{$route.params.taskId}}
    </section>
</template>
```
以上就是动态路由匹配的用法，点击跳转的时候，url是这样的：`http://localhost:4000/#/task-detail/10000218`

## 2. 编程式导航

除了使用`<router-link>`创建a标签来定义导航链接，我们还可以借助router的实例方法，通过编写代码来实现，并且可以传递参数，具体应该怎么做呢？

首先src/App.vue里面咱们把`<router-link>`这种方式改成如下方式：
```vue
<button @click="go_page('10000218')">任务详情10000218</button>
<button @click="go_page('10000217')">任务详情10000217</button>
<button @click="go_page('10000216')">任务详情10000216</button>
```
这里我们定义了一个`go_page`方法，同样也是在App.vue里面写：
```js
export default {
  data () {
    return {

    }
  },
  methods: {
    go_page (taskId) {
      this.$router.push({
        path: '/task-detail',
        query: {
          taskId: taskId
        }
      })
    }
  }
}
</script>
```
而且刚才在src/index.js里面配置的路由也要变一变了：
```js
{
  path: '/task-detail',
  name: 'taskDetail',
  component: () => import('../views/task-detail.vue')
},
```
在src/views/task-detail.vue页面获取传递过来的值，采用的方式也不一样了：
```vue
<template>
    <section>
        {{$route.query.taskId}}
    </section>
</template>
```
以上，就可以拿到由路由传递过来的值了，点击跳转的时候，url是这样的：`http://localhost:4000/#/task-detail?taskId=10000218`，通过这两个url，你发现动态路由匹配和编程式导航的区别了吗？

如果不想在url中暴露参数出来，`go_page`方法也可以这样写：
```js
export default {
  data () {
    return {

    }
  },
  methods: {
    go_page (taskId) {
      this.$router.push({
        name: 'task-detail', // 这里只能采用路由的别名，不能使用path: '/task-detail'
        params: {
          taskId: taskId
        }
      })
    }
  }
}
</script>
```
在src/views/task-detail.vue页面获取传递过来的值
```vue
<template>
    <section>
        {{$route.params.taskId}}
    </section>
</template>
```
但是这种方式也有弊端，当你在`http://localhost:4000/#/task-detail`路由下刷新这个页面的时候，传递的参数就没了

## 3. 嵌套路由匹配

我借用vue-router官网的例子来说明：实际的项目往往都是由多层嵌套的组件组合而成，同样，url中各段动态路径也按某种结构对应嵌套的各层组件：
```
/product/ele_product/phone            /product/ele_product/computer
+------------------+                  +-----------------+
| product          |                  | product         |
| +--------------+ |                  | +-------------+ |
| | ele_product  | |  +------------>  | | ele_product | |
| | +---------+  | |                  | | +---------+ | |
| | |  phone  |  | |                  | | |computer | | |
| | |         |  | |                  | | |         | | |
| | +---------+  | |                  | | +---------+ | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```
比如一个商城的项目，产品-电子产品-手机，产品-电子产品-电脑，像这种三级的嵌套页面，那么应该怎么写嵌套路由呢？接下来咱们一步步实现：

首先咱们，先把这四个页面新建出来：

在src/views文件夹下新建product文件夹，同时新增`index.vue`，`ele-product.vue`，`phone.vue`和`computer.vue`这四个文件

`index.vue`
```vue
<template>
    <section>
        <h3>这是产品页</h3>
        <router-view/>
    </section>
</template>
```
`ele-product.vue`
```vue
<template>
  <section>
      <h3>我是电子产品页</h3>
      <router-view/>
  </section>
</template>
```
`phone.vue`
```vue
<template>
    <section>
        <h3>我是手机页</h3>
    </section>
</template>
```
`computer.vue`
```vue
<template>
    <section>
        <h3>我是电脑页</h3>
    </section>
</template>
```
同时需要在src/index.js里面配置我们的嵌套路由：
```js
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
    path: '/task-detail',
    name: 'taskDetail',
    component: () => import('../views/task-detail.vue')
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
            component: () => import('../views/product/phone.vue'),
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
  ...errorRoutes
]
```
接下来在src/App.vue页面，根据路由访问这几个页面：
```vue
<router-link to="/product">产品</router-link><br>
<router-link to="/product/ele-product">电子产品</router-link><br>
<router-link to="/product/ele-product/phone">手机</router-link>
<router-link to="/product/ele-product/computer">电脑</router-link>
```
这里你会发现，`index.vue`和`ele-product.vue`页面都有`<router-view/>`这个标签，因为和`App.vue`页面一样，它们都是父页面，`App.vue`是根页面，是项目中所有页面的父页面，而`index.vue`是`ele-product.vue`页面的父页面，`ele-product.vue`是`phone.vue`和`computer.vue`的父页面，只要这个页面是父页面就需要添加`<router-view/>`这个标签

## 4. 命名路由

在src/index.js文件里配置路由的时候，每个路由对象上都加了一个name属性，为啥子加呢，相当于给这个路由起了一个名字，所以有了命名路由的叫法，有什么用呢？还真有用处，上面我们在用`<router-link>`做路由跳转时，是怎么写的呢？
```vue
<router-link to="/product/ele-product/computer">电脑</router-link>
```
我们也可以用命名路由来进行路由跳转：
```vue
<router-link :to="{name: 'computer'}">电脑</router-link>
```
这样写也起到了相同的效果，而且不用写那么一大串长的路由，是不是很方便呢？这里提一下哦，给路由命名的时候，不能存在两个name相同的路由，name具有唯一性，在配置路由的时候看一下千万别整成多个路由都叫某一个name哦

## 5. 命名视图

上面我们提到过，只要一个页面它是父页面，那么里面就要添加一个`<router-view/>`标签，但是如果想在这个父页面显示多个视图，而且让不同的视图显示在指定位置，OK，就要用到命名视图了

还拿上面的产品-电子产品-手机这个嵌套页面说事儿，当进入了手机这个页面，我们又分很多手机品牌，比如要在`phone.vue`这个页面分别展示华为专场，苹果专场，小米专场，vivo专场，怎么做呢？

在src/views/product文件夹下新增`apple.vue`，`mi.vue`，`vivo.vue`这三个文件，同时修改`phone.vue`这个页面的内容，让它做为华为专场的页面展示：
`phone.vue`
```vue
<template>
    <section>
        <h3>华为专场</h3>
    </section>
</template>
```
`apple.vue`
```vue
<template>
    <section>
        <h3>苹果专场</h3>
    </section>
</template>
```
`mi.vue`
```vue
<template>
    <section>
        <h3>小米专场</h3>
    </section>
</template>
```
`vivo.vue`
```vue
<template>
    <section>
        <h3>vivo专场</h3>
    </section>
</template>
```
并且找到它的父页面`ele-product.vue`页面，修改如下：
```vue
<template>
  <section>
    <h3>我是电子产品页</h3>
    <router-view/>
    <router-view name="apple"/>
    <router-view name="mi"/>
    <router-view name="vivo"/>
  </section>
</template>
```
修改src/router/index.js里的路由配置：
```js
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
```
完成上述操作，当你要访问`http://localhost:4000/#/product/ele-product/phone`时，就可以看到页面加载了多个专场视图

## 6. 重定向

这个重定向就是帮助我们将当前路由指向另外一个路由，在做管理类项目（左侧导航栏，右侧视图的项目）的时候，我们就需要用到重定向
```js
{
  path: '/web-task',
  component: Layout,
  redirect: '/web-task/task-list',
  name: 'web-task',
  meta: {
    title: '拨测任务管理',
  },
  children: [
    {
      path: 'task-list',
      component: resolve => require(['@/views/web-task/task-list.vue'], resolve),
      name: 'task-list',
      meta: { 
        title: '拨测任务列表', 
      },
    },
  ]
}
```
当点击拨测任务管理时，就直接跳转到拨测任务列表页面，之所以能重定向，就是`redirect`在起作用，它的值可以是字符串，也可以是个对象或者方法
```js
// 字符串
{
  redirect: '/web-task/task-list'
}
// 对象
{
  redirect: {
    name: 'task-list'
  }
}
// 方法
{
  redirect: to => {
    return {
      name: 'task-list'
    }
  }
}
```
<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>
