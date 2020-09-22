# 5. vuex看完这篇你就会了（1）

vuex和vue-router一样都是vue的核心插件，它是vue的状态管理，对于跨组件之间的传值，可以将这些值放到状态state里进行管理

## 1. state用法

在第2讲里，我已经对src/store这个文件夹进行了改造，这里先在src/store/state.js里新增一个值，然后来讲解vuex的用法
```js
const state = {
    menuType: 1
}

export default state
```
这样就将`menuType`放入到了vuex里，让vuex来管理这个值，接下来示范一下在组件中调用这个值：
```vue
<template>
    <section>
        {{menuType}}
    </section>
</template>
<script>
export default {
    computed: {
        menuType () {
            return this.$store.state.menuType
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
}
</script>
```
那要是放在模块里的值，应该怎样去获取呢？

再来看一下，我在第2讲中新建的src/store/module/user.js文件，这是一个模块，如果在user.js里新增一个值，在组件里应该怎么获取呢？
```js
const state = {
    userName: '张三'
}
const getters = {}
const mutations = {}
const actions = {}

export default {
    state,
    getters,
    mutations,
    actions
}
```
在组件里调用这个值
```vue
<template>
    <section>
        {{menuType}}
        {{userName}}
    </section>
</template>
<script>
export default {
    computed: {
        menuType () {
            return this.$store.state.menuType
        },
        userName () {
            return this.$store.state.user.userName // 调用模块里的值
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
}
</script>
```
除了上面提到的组件里获取值的方式，还可以利用vuex提供的辅助函数`mapSate`来获取值：
```vue
<template>
    <section>
        {{menuType}}
        {{userName}}
    </section>
</template>
<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState({
            menuType: state => state.menuType,
            userName: state => state.user.userName
        })
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
}
</script>
```
也可以采用简写的方式：
```js
    computed: {
        ...mapState({
            menuType: state => state.menuType,
            userName: state => state.user.userName
        })
    },
    // 简写成
    computed: {
        ...mapState({
            userName: state => state.user.userName
        }),
        ...mapState([
            'menuType',
        ]),
    },
```
## 2. getter用法

相当于vue里的computed属性，比如menuType = 1，在我自己的项目里，它代表着菜单类型，1代表ping拨测菜单，2代表网页拨测菜单，在组件里获取这个值的时候，多次重复判断没有意义，咱们就可以放到getter里面进行判断

找到src/store/getter.js：
```js
const getters = {
    menuType: state => {
        if (state.menuType == 1) {
            return 'ping拨测'
        } else {
            return '网页拨测'
        }
    }
}

export default getters
```
然后在组件里去获取这个值：
```vue
<template>
    <section>
        {{menuTypeName}}
    </section>
</template>
<script>
export default {
    computed: {
        menuTypeName () {
            return this.$store.getters.menuType
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
}
</script>
```
同样也可以利用vuex提供的辅助函数`mapGetters`来获取值：
```js
computed: {
        ...mapGetters([
            'menuType'
        ])
    },
```
写在模块里的getters如何获取呢？

咱们在src/store/module/user.js新增如下代码：
```js
const state = {
    userName: '张三'
}
const getters = {
    userName: state => {
        return state.userName + '是管理员'
    }
}
const mutations = {}
const actions = {}

export default {
    state,
    getters,
    mutations,
    actions
}
```
利用vuex辅助函数`mapGetters`来获取写在模块里的getters：

```vue
<template>
    <section>
        {{userName}}
    </section>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
export default {
    computed: {
        // menuTypeName () {
        //     return this.$store.getters.menuType
        // },
        ...mapGetters([
            'userName'
        ])
    },
    data () {
        return {
            
        }
    },
    methods: {
        
    },
}
</script>
```
## 3. mutation用法

前面两小节主要讲的是如何获取vuex里的值，如果想修改vuex里的值，就需要通过commit提交一个mutation来修改

找到src/store/mutations.js文件，新增如下代码：
```js
const mutations = {
    SET_MENU_TYPE (state, params) {
        state.menuType = params
    }
}

export default mutations
```
然后在组件里调用这个mutation：
```vue
<template>
    <section>
        <p>{{menuType}}</p>
        <button @click="handleChangeMenuType('2')">修改menuType的值</button>
    </section>
</template>
<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState([
            'menuType',
        ]),
    },
    data () {
        return {
        }
    },
    methods: {
        handleChangeMenuType (params) {
            this.$store.commit('SET_MENU_TYPE', params)
        }
    },
}
</script>
```
同样，vuex也提供了辅助函数`mapMutations`来快速设置值：
```vue
<template>
    <section>
        <p>{{menuType}}</p>
        <button @click="handleChangeMenuType('2')">修改menuType的值</button>
    </section>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed: {
        ...mapState([
            'menuType',
        ]),
    },
    data () {
        return {
        }
    },
    methods: {
        ...mapMutations([
            'SET_MENU_TYPE'
        ]),
        handleChangeMenuType () {
            this.SET_MENU_TYPE('2')
        }
    },
}
</script>
```
还是同样的问题，放在模块里的值，应该怎样去提交mutation呢？我举个例子：

还是在src/store/module/user.js增加如下代码：
```js
const state = {
    userName: '张三'
}
const getters = {
    userName: state => {
        return state.userName + '是管理员'
    }
}
const mutations = {
    SET_USER_NAME (state, params) {
        state.userName = params
    }
}
const actions = {}

export default {
    state,
    getters,
    mutations,
    actions
}
```
然后在组件里调用这个写在模块里的mutation：
```vue
<template>
    <section>
        {{taskId}}
        <ul>
            <li>今天你吃药了嘛？</li>
        </ul>
        <p>{{userName}}</p>
        <button @click="handleChangeMenuType">修改menuType的值</button>
    </section>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'userName'
        ])
    },
    data () {
        return {
        }
    },
    methods: {
        ...mapMutations([
            'SET_USER_NAME'
        ]),
        handleChangeMenuType () {
            this.SET_USER_NAME('李四')
        }
    },
}
</script>
```
## 4. action用法
上面讲的调用mutation来修改vuex里的值，这个过程进行的是同步操作，如果某个值需要异步操作才能修改成功，此时就需要调用action，它是专门处理异步请求，然后改变vuex里的值的

比如，项目里的导航菜单，需要后端动态返回，像请求数据这些操作，肯定是异步操作，此时，我就在这里模拟一个请求，来修改`menuList`这个值
```js
const state = {
    menuType: 1,
    menuList: []
}

export default state
```
首先在src/store/mutations.js里新建一个mutation：
```js
const mutations = {
    SET_MENU_TYPE (state, params) {
        state.menuType = params
    },
    SET_MENU_LIST (state, params) {
        state.menuList = params
    }
}

export default mutations
```
其次新建src/api/app.js文件，在里面模拟一个异步请求的接口：
```js
export const getMenuList = () => {
    return new Promise((resolve, reject) => {
        const err = null
        setTimeout(() => {
            if (!err) {
                resolve({
                    code: 200,
                    data: {
                        menuList: [
                            {name: '创建任务'},
                            {name: '任务列表'}
                        ]
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}
```
找到src/store/actions.js文件，新增如下代码：
```js
import {getMenuList} from '@/api/app'

const actions = {
    updateMenuList ({commit}) {
        getMenuList().then(res => {
            const {code, data: {menuList}} = res
            commit('SET_MENU_LIST', menuList)
        }).catch(err => {
            console.log(err)
        })
    }
}

export default actions
```
题外话：在调用一个异步函数，并且接收其返回的值，可以采用es7的async/await函数，写法如下：
```js
import {getMenuList} from '@/api/app'

const actions = {
    async updateMenuList({commit}) {
        try {
            const {code, data: {menuList}} = await getMenuList()
            commit('SET_MENU_LIST', menuList)
        } catch (err) {
            console.log(err)
        }
    }
}

export default actions
```
然后在组件里调用这个action：
```vue
<template>
    <section>
        <button @click="handleChangeMenuList">异步获取菜单list</button>
        <ul>
            <li v-for="(item, index) in menuList" :key="index">{{item.name}}</li>
        </ul>
    </section>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
export default {
    computed: {
        ...mapState([
            'menuList',
        ]),
    },
    data () {
        return {
        }
    },
    methods: {
        handleChangeMenuList () {
            this.$store.dispatch('updateMenuList')
        }
    },
}
</script>
```
同样，vuex也提供了辅助函数`mapActions`来调用action：
```vue
<template>
    <section>
        <button @click="handleChangeMenuList">异步获取菜单list</button>
        <ul>
            <li v-for="(item, index) in menuList" :key="index">{{item.name}}</li>
        </ul>
    </section>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
    computed: {
        ...mapState([
            'menuList',
        ]),
    },
    data () {
        return {
        }
    },
    methods: {
        ...mapActions([
            'updateMenuList'
        ]),
        handleChangeMenuList () {
            this.updateMenuList()
        }
    },
}
</script>
```
还是同样的问题，写在模块里的action如何调用？

找到src/api/app.js文件，新增一个异步接口：
```js
export const getUserName = () => {
    return new Promise((resolve, reject) => {
        const err = null
        setTimeout(() => {
            if (!err) {
                resolve({
                    code: 200,
                    data: {
                        name: '李四'
                    }
                })
            } else {
                reject(err)
            }
        })
    })
}
```
然后在src/store/module/user.js文件里的actions里新增一个方法：
```js
import {getUserName} from '@/api/app'

const state = {
    userName: '张三'
}
const getters = {
    userName: state => {
        return state.userName + '是管理员'
    }
}
const mutations = {
    SET_USER_NAME (state, params) {
        state.userName = params
    }
}
const actions = {
    async getUserName ({commit}) {
        try {
            const {code, data: {name}} = await getUserName()
            commit('SET_USER_NAME', name)
        } catch (error) {
            console.log(err)
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
```
最后在组件里调用：
```vue
<template>
    <section>
        <button @click="handleChangeMenuList">异步获取菜单list</button>
        <ul>
            <li v-for="(item, index) in menuList" :key="index">{{item.name}}</li>
        </ul>
        <button @click="handleChangeUserName">异步获取userName</button>
        <p>{{userName}}</p>
    </section>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
    computed: {
        ...mapState([
            'menuList',
        ]),
        ...mapGetters([
            'userName'
        ])
    },
    data () {
        return {
        }
    },
    methods: {
        ...mapMutations([
            'SET_USER_NAME'
        ]),
        ...mapActions([
            'updateMenuList',
            'getUserName'
        ]),
        handleChangeMenuList () {
            this.updateMenuList()
        },
        handleChangeUserName () {
            this.getUserName()
        }
    },
}
</script>
```
以上就是vuex的基本用法，通过这篇文章，我相信在项目中使用vuex是没有任何问题的，关于vuex更高级的用法，可以在下一篇文章中学到

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>