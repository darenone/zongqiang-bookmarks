# 10. 手写一个导航菜单-1

这里我不利用任何外部UI组件来实现一个导航菜单，帮助学习vue的开发，只要可以手写一个菜单，其它的菜单照着这个思路，也是没有问题的

开发还是在我的项目[vue-base-frame](https://github.com/darenone/vue-base-frame)里进行

首先在项目里新建一个页面`views/menu-page.vue`

```vue
<template>
    <div class="menu-box"></div>
</template>
<script>
export default {
    name: 'menu_page',
    data () {
        return {

        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

在`router/index.js`里，给这个页面配置路由：

```js
  {
    path: '/menu_page',
    name: 'menu_page',
    component: () => import('../views/menu-page.vue'),
  },
```

在`components`下新建`menu`文件夹，同时在这个文件夹下新建以下四个文件：

1. `components/menu/a-menu.vue`

```vue
<template>
    <div class="a-menu">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'AMenu'
}
</script>
<style lang="less">
.a-menu {
    background: #515a6e;
    & * {
        list-style: none;
    }
    ul {
        padding: 0;
        margin: 0;
    }
}
</style>
```
2. `components/menu/a-menu-item.vue`

```vue
<template>
    <li class="a-menu-item">
        <slot></slot>
    </li>
</template>
<script>
export default {
    name: 'AMenuItem'
}
</script>
<style lang="less">
.a-menu-item {
    color: hsla(0,0%,100%,.7);
    height: 45px;
    line-height: 45px;
    text-align: left;
    cursor: pointer;
}
</style>
```
3. `components/menu/a-submenu.vue`

```vue
<template>
    <ul class="a-submenu">
        <!-- 显示标题的地方 -->
        <div class="a-submenu-title">
            <slot name="title"></slot>
        </div>
        <slot></slot>
    </ul>
</template>
<script>
export default {
    name: 'ASubmenu'
}
</script>
<style lang="less">
.a-submenu {
    cursor: pointer;
    &-title {
        color: hsla(0,0%,100%,.7);
        height: 45px;
        line-height: 45px;
        text-align: left;
    }
}
</style>
```
4. `components/menu/index.js`

```js
import AMenu from './a-menu.vue'
import AMenuItem from './a-menu-item.vue'
import ASubMenu from './a-submenu.vue'

export default {
    AMenu,
    AMenuItem,
    ASubMenu
}
```

然后在`menu-page.vue`页面使用es6解构赋值引入以上3个组件

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <a-menu-item>111</a-menu-item>
            <a-menu-item>222</a-menu-item>
        </a-menu>
    </div>
</template>
<script>
import menuComponents from "_c/menu"
const { AMenu, AMenuItem, ASubMenu } = menuComponents
export default {
    name: 'menu_page',
    components: {
        AMenu,
        AMenuItem,
        ASubMenu
    },
    data () {
        return {
        
        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

在浏览器打开这个项目，访问路由：`http://localhost:4000/menu_page`，在浏览器中可以看到没有任何样式的菜单，项目里不可能都是一级菜单，也有二级菜单，三级菜单等，接下来实现二级菜单

改造`menu-page.vue`：

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <a-menu-item>1</a-menu-item>
            <a-menu-item>2</a-menu-item>
            <a-sub-menu>
                <div slot="title">3</div>
                <a-menu-item>3-1</a-menu-item>
                <a-menu-item>3-2</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>
<script>
import menuComponents from "_c/menu"
import ASubmenu from '../components/menu/a-submenu.vue'
const { AMenu, AMenuItem, ASubMenu } = menuComponents
export default {
    name: 'menu_page',
    components: {
        AMenu,
        AMenuItem,
        ASubMenu
    },
    data () {
        return {
        
        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

菜单基本的结构就是这样的，二级菜单有一个展开和收缩的功能，咱把它实现一下

改造`a-submenu.vue`，先把`a-submenu.vue`后面一个slot用div包裹起来，目的做展开收缩的效果

```vue
<template>
    <ul class="a-submenu">
        <!-- 显示标题的地方 -->
        <div class="a-submenu-title">
            <slot name="title"></slot>
        </div>
        <div v-show="showChild" class="a-submenu-child-box">
            <slot></slot>
        </div>
    </ul>
</template>
<script>
export default {
    name: 'ASubmenu',
    data () {
        return {
            showChild: false
        }
    }
}
</script>
<style lang="less">
.a-submenu {
    cursor: pointer;
    &-title {
        color: hsla(0,0%,100%,.7);
        height: 45px;
        line-height: 45px;
        text-align: left;
    }
    &-child-box {
        overflow: hidden;
    }
}
</style>
```

通过点击`a-submenu-title`让它显示或者展开

```vue
<template>
    <ul class="a-submenu">
        <!-- 显示标题的地方 -->
        <div class="a-submenu-title" @click="handleClick">
            <slot name="title"></slot>
        </div>
        <div v-show="showChild" class="a-submenu-child-box">
            <slot></slot>
        </div>
    </ul>
</template>
<script>
export default {
    name: 'ASubmenu',
    data () {
        return {
            showChild: false
        }
    },
    methods: {
        handleClick () {
            this.showChild = !this.showChild;
        }
    }
}
</script>
<style lang="less">
.a-submenu {
    cursor: pointer;
    &-title {
        color: hsla(0,0%,100%,.7);
        height: 45px;
        line-height: 45px;
        text-align: left;
        user-select: none;
    }
    &-child-box {
        overflow: hidden;
    }
}
</style>
```

功能已实现，再给它加一个图标来表示现在是展开还是收缩的状态，这里我借助View UI里的Icon来实现：

```vue
<template>
    <ul class="a-submenu">
        <!-- 显示标题的地方 -->
        <div class="a-submenu-title" @click="handleClick">
            <slot name="title"></slot>
            <i :class="[showChild ? 'ivu-icon ivu-icon-ios-arrow-down' : 'ivu-icon ivu-icon-ios-arrow-back', 'a-submenu-title-icon']"></i>
        </div>
        <div v-show="showChild" class="a-submenu-child-box">
            <slot></slot>
        </div>
    </ul>
</template>
<script>
export default {
    name: 'ASubmenu',
    data () {
        return {
            showChild: false
        }
    },
    methods: {
        handleClick () {
            this.showChild = !this.showChild;
        }
    }
}
</script>
<style lang="less">
.a-submenu {
    cursor: pointer;
    &-title {
        color: hsla(0,0%,100%,.7);
        height: 45px;
        line-height: 45px;
        text-align: left;
        user-select: none;
        div {
            display: inline-block;
        }
        &-icon {
            color: hsla(0,0%,100%,.7);
            float: right;
            line-height: 45px;
            margin-right: 20px;
        }
    }
    &-child-box {
        overflow: hidden;
    }
}
</style>
```

二级菜单功能已实现，咱们再来实现三级菜单，改造`menu-page.vue`菜单

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <a-menu-item>1</a-menu-item>
            <a-menu-item>2</a-menu-item>
            <a-sub-menu>
                <div slot="title">3</div>
                <a-menu-item>3-1</a-menu-item>
                <a-menu-item>3-2</a-menu-item>
                <a-sub-menu>
                    <div slot="title">3-3</div>
                    <a-menu-item>3-3-1</a-menu-item>
                    <a-menu-item>3-3-2</a-menu-item>
                </a-sub-menu>
            </a-sub-menu>
        </a-menu>
    </div>
</template>
<script>
import menuComponents from "_c/menu"
import ASubmenu from '../components/menu/a-submenu.vue'
const { AMenu, AMenuItem, ASubMenu } = menuComponents
export default {
    name: 'menu_page',
    components: {
        AMenu,
        AMenuItem,
        ASubMenu
    },
    data () {
        return {
        
        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

以上我们就完成了一个基本menu组件，但是导航菜单不可能写死的，这个需要通过一个list获取，这个list结构如下：

```js
navList: [
    {
        title: '1'
    },
    {
        title: '2'
    },
    {
        title: '2',
        children: [
            {
                title: '3-1'
            },
            {
                title: '3-2'
            },
            {
                title: '3-3',
                children: [
                    {
                        title: '3-3-1'
                    },
                    {
                        title: '3-3-2'
                    }
                ]
            }
        ]
    }
]
```
这里的关键就是实现一个递归组件，这个递归组件，咱们就叫`re-submenu.vue`吧

新建`components/menu/re-submenu.vue`组件，内容如下：

```vue
<template>
    <a-sub-menu>
        <div slot="title">{{parent.title}}</div>
        <template v-for="(item, i) in parent.children">
            <a-menu-item v-if="!item.children" :key="`menu_item_${index}_${i}`">{{ item.title }}</a-menu-item>
            <re-submenu v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></re-submenu>
        </template>
    </a-sub-menu>
</template>
<script>
import menuComponents from "_c/menu"
const { ASubMenu, AMenuItem} = menuComponents
export default {
    name: 'ReSubmenu', // 这里一定要有name值，才能引用自身的组件，否则不可以
    components: {
        ASubMenu,
        AMenuItem,
    },
    props: {
        parent: {
            type: Object,
            default () {
                return {}
            }
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {

        }
    }
}
</script>
```

在`menu-page.vue`里引入这个组件，并且改造一下代码：

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <template v-for="(item, index) in navList">
                <a-menu-item v-if="!item.children" :key="`menu_item_${index}`">{{ item.title }}</a-menu-item>
                <re-submenu v-else :parent="item" :key="`menu_item_${index}`" :index="index"></re-submenu>
            </template>
        </a-menu>
    </div>
</template>
<script>
import menuComponents from "_c/menu"
import ReSubmenu from '_c/menu/re-submenu.vue'
const { AMenu, AMenuItem} = menuComponents
export default {
    name: 'menu_page',
    components: {
        AMenu,
        AMenuItem,
        ReSubmenu
    },
    data () {
        return {
            navList: [
                {
                    title: '1'
                },
                {
                    title: '2'
                },
                {
                    title: '3',
                    children: [
                        {
                            title: '3-1'
                        },
                        {
                            title: '3-2'
                        },
                        {
                            title: '3-3',
                            children: [
                                {
                                    title: '3-3-1'
                                },
                                {
                                    title: '3-3-2'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

导航菜单递归实现已完成，接下来再增加一个功能：点击当前菜单，如何使其高亮呢？

解决方案有两种：1. 利用官方提供的`activeClass` 2. 在vuex中设置一个`currentNav`变量实现，这里咱们采用第2种方式实现一下

在`store/state.js`文件里新增一个`currentNav`

```js
const state = {
    currentNav: null
}

export default state
```

在`store/mutations.js`里，通过提交mutation修改这个值：

```js
const mutations = {
    SET_CURRENT_NAV: (state, params) => {
        state.currentNav = params
    }
}

export default mutations
```

接下来在`menu-page.vue`页面里，给`AMenuItem`组件新增一个属性`uId`

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <template v-for="(item, index) in navList">
                <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${index}`" :key="`menu_item_${index}`">{{ item.title }}</a-menu-item>
                <re-submenu v-else :parent="item" :key="`menu_item_${index}`" :index="index"></re-submenu>
            </template>
        </a-menu>
    </div>
</template>
```

别忘了在`re-submenu.vue`组件里也要加一下

```vue
<template>
    <a-sub-menu>
        <div slot="title">{{parent.title}}</div>
        <template v-for="(item, i) in parent.children">
            <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${i}`" :key="`menu_item_${index}_${i}`">{{ item.title }}</a-menu-item>
            <re-submenu v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></re-submenu>
        </template>
    </a-sub-menu>
</template>
```

接着改造下`components/menu/a-menuItem.vue`组件

```vue
<template>
    <li class="a-menu-item" @click="handleClick(uId)" :class="{ 'a-menu-item-active': currentNav == uId }">
        <slot></slot>
    </li>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'AMenuItem',
    props: {
        uId: {
            type: String,
        }
    },
    data () {
        return {

        }
    },
    computed: {
        ...mapState([
            'currentNav'
        ])
    },
    methods: {
        ...mapMutations([
            'SET_CURRENT_NAV'
        ]),
        handleClick (uId) {
            this.SET_CURRENT_NAV(uId)
        }
    }
}
</script>
<style lang="less">
.a-menu-item {
    color: hsla(0,0%,100%,.7);
    height: 45px;
    line-height: 45px;
    text-align: left;
    cursor: pointer;
}
.a-menu-item-active {
    background:#363e4f;
    color: #2d8cf0;
    border-right: 2px solid hsla(0,0%,100%,.7);
}
</style>
```

以上就可以实现高亮啦

好啦，做到这里，我们再来设置下，不同级别菜单的`padding-left`值，好让它看起来更好看些

修改`menu-page.vue`里面的代码，在`navList`里增加一个`level`属性，这个起到关键作用，然后给`AMenuItem`组件添加一个`:style="{'padding-left': `${item.level * 20}px`}"`

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <template v-for="(item, index) in navList">
                <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${index}`" :key="`menu_item_${index}`" :style="{'padding-left': `${item.level * 20}px`}">{{ item.title }}</a-menu-item>
                <re-submenu v-else :parent="item" :key="`menu_item_${index}`" :index="index"></re-submenu>
            </template>
        </a-menu>
    </div>
</template>
<script>
import menuComponents from "_c/menu"
import ReSubmenu from '_c/menu/re-submenu.vue'
const { AMenu, AMenuItem} = menuComponents
export default {
    name: 'menu_page',
    components: {
        AMenu,
        AMenuItem,
        ReSubmenu
    },
    data () {
        return {
            navList: [
                {
                    title: '1',
                    level: 1
                },
                {
                    title: '2',
                    level: 1
                },
                {
                    title: '3',
                    level: 1,
                    children: [
                        {
                            title: '3-1',
                            level: 2
                        },
                        {
                            title: '3-2',
                            level: 2
                        },
                        {
                            title: '3-3',
                            level: 2,
                            children: [
                                {
                                    title: '3-3-1',
                                    level: 3
                                },
                                {
                                    title: '3-3-2',
                                    level: 3
                                },
                                {
                                    title: '3-3-3',
                                    level: 3,
                                    children: [
                                        {
                                            title: '3-3-3-1',
                                            level: 4
                                        },
                                        {
                                            title: '3-3-3-2',
                                            level: 4
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
</script>
<style lang="less">
.menu-box {
    width: 200px;
}
</style>
```

在`re-submenu.vue`里修改一下代码：

```vue
<template>
    <a-sub-menu>
        <div slot="title" :style="{'padding-left': `${parent.level * 20}px`}">{{parent.title}}</div>
        <template v-for="(item, i) in parent.children">
            <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${i}`" :key="`menu_item_${index}_${i}`" :style="{'padding-left': `${item.level * 20}px`}">{{ item.title }}</a-menu-item>
            <re-submenu v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></re-submenu>
        </template>
    </a-sub-menu>
</template>
```

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>

















