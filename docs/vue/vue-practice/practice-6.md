# 6. vuex进阶（2）

## 1. 插件

对于跨组件的传值，使用vuex很方便，但是当刷新浏览器的时候，写在state里的值又都会恢复到初始化状态，所以需要浏览器长期储存的值，我们可能会用`localStorage`或者`sessionStorage`来存储，如果是这样的话，项目里，除了用vuex还用localStorage等，采用多种方式管理项目里需要跨组件传递的值，显得有些混乱，

这里来讲一下利用vuex里的插件概念实现持久化存储

新建src/store/plugin/saveLocal.js文件：
```js
const saveLocal = store => {
    // 当浏览器刷新的时候执行，也就是store初始化的时候执行
    // 当刷新浏览器时，第一次做的操作就写在这里
    console.log('store初始化')
    //store.subscribe方法，只要项目里有提交mutation的动作都会触发一次这个方法
    store.subscribe((mutation, state) => {
        console.log('提交了mutation')
    })
}

export default saveLocal
```
在src/store/index.js里面引入这个插件
```js
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getter'
import mutations from './mutations'
import actions from './actions'
import user from './module/user'
import saveLocal from './plugin/saveLocal'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    user
  },
  plugins: [saveLocal]
})
```
以下方法就可以将store里的值，全部保存到localStorage，每次刷新的时候只需要从localStorage取值就行了
```js
const saveLocal = store => {
    // 当浏览器刷新的时候执行，也就是store初始化的时候执行
    // 当刷新浏览器时，第一次做的操作就写在这里
    console.log('store初始化')
    if (localStorage.store) {
        store.replaceState(JSON.parse(localStorage.state))
    }
    // store.subscribe方法，只要项目里有提交mutation的动作都会触发一次这个方法
    store.subscribe((mutation, state) => {
        console.log('提交了mutation')
        localStorage.state = JSON.stringify(state)
    })
}

export default saveLocal
```
如果只是让某一个值不刷新改变，可以这样做：

加入让src/store/state.js里面定义的`menuType`永久保存，就可以在saveLocal.js里实现：
```js
const saveLocal = store => {
    if (localStorage.menuType) {
        store.state.menuType = localStorage.menuType
    }
    store.subscribe((mutation, state) => {
        localStorage.menuType = state.menuType
    })
}

export default saveLocal
```
值也可以存到`sessionStorage`里面：
```js
const saveLocal = store => {
    if (sessionStorage.menuType) {
        store.state.menuType = sessionStorage.menuType
    }
    store.subscribe((mutation, state) => {
        sessionStorage.menuType = state.menuType
    })
}

export default saveLocal
```
::: tip
`localStorage`和`sessionStorage`里面只能存字符串，所以如果需要存对象或者数组，需要通过JSON.stringify转换为字符串，获取的时候再通过JSON.parse转换回来
:::
<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>