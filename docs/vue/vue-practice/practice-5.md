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
这样我就将`menuType`放入到了vuex里，让vuex来管理这个值，接下来我在组件中调用这个值：
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

再来看一下，我在第2讲中新建的src/store/module/user.js文件，这是一个模块，在user.js里新增一个值，在组件里应该怎么获取呢？
```js
const state = {
    userName: '张三'
}
const mutations = {}
const actions = {}

export default {
    state,
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

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>