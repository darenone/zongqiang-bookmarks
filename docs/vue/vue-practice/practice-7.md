# 7. 组件间传值

vue框架中，组件的概念贯穿始终，项目里所有的页面都是一个组件，它有相对独立的作用域，它们之间如果需要进行数据传递，就要符合一定的规则，比如父子组件传值，兄弟组件传值，隔代组件传值（它们之间隔了好几个组件）接下来我就讲解一下这些组件之间如何传值：

## 1. 父组件给子组件传值（props）

新建src/views/father.vue文件，做为父组件

`father.vue`
```vue
<template>
  <div class="father">
  </div>
</template>
<script>
export default {
    data () {
        return {
        }
    }
}
</script>
```
新建src/components/children.vue文件作为子组件

`children.vue`
```vue
<template>
  <div class="children">
      <ul>
          <li v-for="(item, index) in userList" :key="index">{{item}}</li>
      </ul>
  </div>
</template>
<script>
export default {
    props: {
        userList: {
            type: Array,
            required: true
        }
    },
    data () {
        return {

        }
    }
}
</script>
```
注意到子组件里有一个props属性，这里来接收父组件传递过来的值

父组件里引用子组件并且传值给子组件，代码如下：

`father.vue`
```vue
<template>
  <div class="father">
      <children-item :userList="userList"></children-item>
  </div>
</template>
<script>
import childrenItem from '_c/children' // 引入子组件
export default {
    components: {childrenItem}, // 调用子组件
    data () {
        return {
            userList: ['张三', '李四', '王二'] // 传值给子组件
        }
    }
}
</script>
```
## 2. 子组件给父组件传值（$emit）

在子组件children.vue里面增加一个方法`sendData`

`children.vue`
```vue
<template>
  <div class="children">
      <ul>
          <li v-for="(item, index) in userList" :key="index">{{item}}</li>
      </ul>
      <button @click="sendData">向父组件传值：3</button>
  </div>
</template>
<script>
export default {
    props: {
        userList: {
            type: Array,
            required: true
        }
    },
    data () {
        return {

        }
    },
    methods: {
        sendData () {
            this.$emit('sendData', 3)
        }
    }
}
</script>
```
父组件father.vue里面通过事件接收子组件传递过来的值

`father.vue`
```vue
<template>
  <div class="father">
      <children-item :userList="userList" @sendData="getData"></children-item>
      <p>{{value}}</p>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    data () {
        return {
            userList: ['张三', '李四', '王二'],
            value: 0
        }
    },
    methods: {
        getData (val) {
            // 接收子组件传递过来的值
            this.value = val
        }
    }
}
</script>
```
## 3. 兄弟组件或隔代组件传值（$emit/$on）

这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。但是我们的项目比较大时，可以选择更好的状态管理vuex。

新建src/bus/index.js文件：
```js
import Vue from 'vue'

const Bus = new Vue()

export default Bus
```
在main.js里面引入：
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from './bus/index' // 引入总线

Vue.config.productionTip = false
Vue.prototype.$bus = Bus // 使用总线

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
新建src/components/brother1.vue和brother2.vue文件做为兄弟组件，让brother1给brother2传值

`brother1.vue`
```vue
<template>
  <div class="brother1">
      <h3>兄弟组件1</h3>
      <button @click="sendData">兄弟组件1</button>
  </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        sendData () {
            this.$bus.$emit('sendData', 1) // 发送
        }
    }
}
</script>
```
`brother2.vue`
```vue
<template>
  <div class="brother2">
      <h3>兄弟组件2</h3>
      <p>{{value}}</p>
  </div>
</template>
<script>
export default {
    data () {
        return {
            value: null
        }
    },
    methods: {
    },
    mounted () {
        this.$bus.$on('sendData', val => { // 接收
            console.log(val)
            this.value = val
        })
    }
}
</script>
```
## 4. $attrs/$listeners

这种方式我在项目里没有用过，它是Vue2.4版本中新增的内容，以后可以在项目里用一用，接下来的例子我就照着网上给的教程敲一遍，演示一下如何使用：

这里需要新建一个子组件，src\components\children2.vue

建好以后，再来改造下src\views\father.vue这个组件，还有src\components\children.vue这个组件

`father.vue`
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <children-item></children-item>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    data () {
        return {
        }
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
    .father {
        height: 300px;
        background: gold;
    }
</style>
```
`children.vue`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-1</h4>
      <children-item2></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
`children2.vue`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
  </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
这样做的目的，使它们之间的关系是这样的：

father（a）组件引入children（b）做为子组件，children（b）组件引入children2（c）组件做为子组件
```
father组件（A）--子--children组件（B）--子--children2组件（C）
```
b是a的子组件，c又是b的子组件，这样形成一个嵌套的关系，现在有一个需求，需要a组件把值直接传递给c组件，有几种解决方法呢？

1. vuex(大材小用)
2. a先通过props把值传递给b，b再通过props将值传递给c（容易出错）
3. 利用上面讲的事件总线$bus（多人合作开发时，代码维护性较低）

所以建议使用$attrs/$listeners

假如在父组件a中，有name1和name2两个值需要传递给子组件b

`a组件`
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <children-item :name1="name1" :name2="name2"></children-item>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    data () {
        return {
            name1: '张三',
            name2: '李四'
        }
    },
    methods: {
    }
}
</script>
```
子组件b拿到值以后通过`$attrs`再传递给c组件

`b组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      {{$attrs}}
      <children-item2 v-bind="$attrs"></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    inheritAttrs: false,
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
c组件里这样获取这两个值：

`c组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
      <span>{{name1}}</span>
      <span>{{name2}}</span>
  </div>
</template>
<script>
export default {
    props: ['name1', 'name2'],
    inheritAttrs: true,
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
假如b组件通过props接收了`name1`这个值，那么c组件就不会接收到`name1`这个值了

`b组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      {{$attrs}}
      <children-item2 v-bind="$attrs"></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    props: ['name1'],
    inheritAttrs: false,
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
`c组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
      <span>{{name2}}</span>
  </div>
</template>
<script>
export default {
    props: ['name2'],
    inheritAttrs: true,
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
上面讲的是如何将a组件的值传递给c组件，这是往下传递的，那么如何将c组件的值传递给a组件，往上传递呢？

`c组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
      <span>{{name2}}</span>
      <button @click="sendData">向a组件传值</button>
  </div>
</template>
<script>
export default {
    props: ['name2'],
    inheritAttrs: true,
    data () {
        return {

        }
    },
    methods: {
        sendData () {
            this.$emit('sendData', 1)
        }
    }
}
</script>
```
`b组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      {{$attrs}}
      <children-item2 v-bind="$attrs" v-on="$listeners"></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    props: ['name1'],
    inheritAttrs: false,
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
`a组件`
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <span>{{value}}</span>
          <children-item :name1="name1" :name2="name2" @sendData="getData"></children-item>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    data () {
        return {
            name1: '张三',
            name2: '李四',
            value: null
        }
    },
    methods: {
        getData (val) {
            this.value = val
        }
    }
}
</script>
```
从以上代码示例，我们可以看出$attrs/$listeners的功能，它就像一个桥梁的作用，负责在a和c直接传递和接收数据

## 5. provide/inject

在第四种方式里：$attrs/$listeners，其实也可以看到使用的局限在于，a,b,c这三个组件，必须是层层嵌套的关系，通过在b组件里使用$attrs/$listeners，让a和c进行隔代通信

这里讲的provide/inject，则更加灵活，它是vue2.2版本新增内容，不论是a,b，c这种嵌套关系，还是a,b,c,d,e...更深层的嵌套关系，a组件通过provide分享数据，b,c,d,e...都可以通过inject拿到a组件分享的数据

来看一下具体的示例代码：

我还是拿上面的组件来演示：
```
src\views\father.vue -- a组件
src\components\children.vue -- b组件
src\components\children2.vue -- c组件
```
`a组件`中使用provide
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <children-item></children-item>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    provide () {
        return {
            name1: this.name1,
            name2: this.name2
        }
    },
    data () {
        return {
            name1: '张三',
            name2: '李四',
        }
    },
    methods: {
    }
}
</script>
```
`b组件`使用inject
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      {{name1}}
      {{name2}}
      <children-item2></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    inject: ['name1', 'name2'],
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
`c组件`使用inject
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
      <span>{{name1}}</span>
      <span>{{name2}}</span>
  </div>
</template>
<script>
export default {
    inject: ['name1', 'name2'],
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>
```
是不是很简单，但是！需要注意：provide 和 inject 绑定并不是可响应的，也就是说，`a组件`里修改一个值，后面的组件并不能拿到修改后的值，如：在`a组件`里修改name1值：
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <span>{{name1}}</span>
          <span>{{name2}}</span>
          <children-item></children-item>
          <button @click="changeName1">改变name1值</button>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    provide () {
        return {
            name1: this.name1,
            name2: this.name2
        }
    },
    data () {
        return {
            name1: '张三',
            name2: '李四',
        }
    },
    methods: {
        changeName1 () {
            this.name1 = '旺财'
        }
    }
}
</script>
```
这name1改变以后，b,c组件里还是修改之前的值

那么有没有办法实现数据响应式呢？有，看如下代码示例：

`a组件`改造以后相当于将整个a组件实例分享出去
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <span>{{name1}}</span>
          <span>{{name2}}</span>
          <children-item></children-item>
          <button @click="changeName1">改变name1值</button>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    provide () {
        return {
            name: this // 将这个组件实例提供给后面的子组件
        }
    },
    data () {
        return {
            name1: '张三',
            name2: '李四',
        }
    },
    methods: {
        changeName1 () {
            this.name1 = '旺财'
        }
    }
}
</script>
```
`b组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      {{name.name1}}
      <children-item2></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    inject: {
        name: {
            default: () => ({})
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
`c组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
      <span>{{name.name1}}</span>
  </div>
</template>
<script>
export default {
    inject: {
        name: {
            default: () => ({})
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
以上就可以实现响应式的往子组件传递数据

题外话，我说一下，方法4和方法5，这些都是不常用的api，其实在做项目的时候，vue提供给我们的api大概能用到50%可能就已经不错了，但是我想说的是，即使不常用的也要知道怎么用，并且做项目的时候用一用比较好

## 5. $parent/$children/$refs

使用这3种方式都会得到组件实例，然后就可以直接调用组件里的方法或者数据

同样还是使用上面的a,b,c三个组件做为例子演示一下：

`a组件`
```vue
<template>
  <div class="father">
      <div style="width: 300px;height: 300px;border: 1px solid red;margin: 0 auto;">
          <h4>父组件</h4>
          <span>{{name1}}</span>
          <span>{{name2}}</span>
          <children-item ref="childrenItem"></children-item>
      </div>
  </div>
</template>
<script>
import childrenItem from '_c/children'
export default {
    components: {childrenItem},
    provide () {
        return {
            name: this
        }
    },
    data () {
        return {
            name1: '张三',
            name2: '李四',
        }
    },
    methods: {
    },
    mounted () {
        console.log(this.$refs.childrenItem.name)
        this.$refs.childrenItem.getName()
        // 效果相同
        console.log(this.$children[0].name)
        this.$children[0].getName()
    }
}
</script>
```
`b组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 100px);">
      <h4>子组件-1</h4>
      <children-item2 ref="childrenItem2"></children-item2>
  </div>
</template>
<script>
const childrenItem2 = () => import('_c/children2')
export default {
    components: {childrenItem2},
    data () {
        return {
            name: '子组件-1'
        }
    },
    methods: {
        getName () {
            console.log(this.name)
        }
    },
    mounted () {
        console.log(this.$parent.name1) // 张三

        console.log(this.$refs.childrenItem2.name) // 子组件-2
        console.log(this.$children[0].name) // 子组件-2
    }
}
</script>
```
`c组件`
```vue
<template>
  <div class="children" style="margin: 30px;border:1px solid black;height: calc(100% - 90px);">
      <h4>子组件-2</h4>
  </div>
</template>
<script>
export default {
    data () {
        return {
            name: '子组件-2'
        }
    },
    methods: {
        getName () {
            console.log(this.name)
        }
    },
    mounted () {
        console.log(this.$parent.name) // 子组件-1
    }
}
</script>
```