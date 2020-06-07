### 项目初始化及前端框架搭建
##### 1. 博客系统核心业务分析
- 登录注册
- 用户信息更新
- 博客列表
- 博客管理（增，删，改，查）
- 博客详情
- 评论
##### 2. 前端项目搭建
- 全局安装vue-cli 3.0
```
npm install -g @vue/cli
```
- 检查vue安装是否成功
```
vue --version
```
- 利用vue-cli 3.0 创建项目`my-blog`，项目名可以自己定
```
vue create my-blog
```
接下来需要对项目进行手动配置：
选择`Manually select features`手动配置项目-->选中`Babel`，`Router`，`vuex`，`css pre-processors`，`linter`-->路由是否采用history模式，选择no-->然后选择sass/scss (with node-sass)-->然后再选择`eslint + prettier`-->然后再选择`lint on save`-->然后再选择`in dedicated config files`生成配置文件config.js-->然后提示是否将以上操作保存，方便下次新建项目使用，我们选择否-->这些操作完成，就等着项目下载下来吧~<br>
进入项目目录，启动项目：
```
npm run serve
```
由于项目需要用到`element-ui`这个前端UI框架，所以需要在项目里安装：
```
npm/cnpm install element-ui --save
```
然后在项目里找到`src/main.js`把`element-ui`引入到项目里，同时引入入elementUI样式：
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
然后`npm run serve`启动项目，此时会看到cmd命令行有一堆错误信息，这个时候需要修改`my-blog/.eslintrc.js`这个文件，去掉`@vue/prettier`，然后重新运行项目，就不会再提示错误信息
接下来改造项目，首先将`src/components/HelloWorld.vue`重命名为：`layout.vue`:
```vue
// layout.vue
<template>
  <div class="container">
    <div>顶部</div>
    <div>中间</div>
    <div>底部</div>
  </div>
</template>
```
`src/App.vue`改造如下：
```vue
// App.vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
```
`src/router/index.js`改造如下：
```js
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/layout.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
```
另外关于项目中的样式，所有的样式统一写到`src/assets/style`文件夹里，然后新建`src/assets/style/index.scss`
```scss
// index.scss
// 作为一个入口，引入需要用到的css文件

// 样式重置
@import './reset.scss';
// 公共样式
@import './common.scss';
// 页面样式
// @import './views/view1.scss';
// 组件样式
// @import './components/com1.scss';
// elementUI样式重置
// @import './elementUI/reset.scss';
```
j然后在`main.js`里面引入：
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/index.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```
改造完毕，启动项目，浏览器输入：`http://localhost:8081/#/`，页面只有三个div，分别为顶部，中间，底部，我们的博客页面就分为三部分：
- 顶部 用来展示用户头像和用户名，以及登入登出等操作
- 中间 用来作为博客的主体部分，展示博客列表或详情
- 底部 用来作为博客的介绍
针对这三部分，我们分别封装3个组件来实现：
##### 1. 顶部组件`components/header.vue`

