# 13. 利用View UI实现可收缩多级菜单

在第10讲，我演示了如何手写一个导航菜单，这里咱们利用iView提供给我们的组件来完成一个导航菜单

第一步，在`components`下新建`iview-menu`文件夹

并且在此文件夹下新建：

1. `a-menu.vue`
2. `re-submenu.vue`
3. `re-dropdown.vue`
4. `index.js`

`a-menu.vue`
```vue
<template>
    <section class="i-menu-wrapper">
        <slot></slot>
        <Menu width="auto" v-if="!collapsed">
            <template v-for="(item, index) in list">
                <MenuItem v-if="!item.children" :name="`menu_${item.title}_${index}`" :key="`menu_item_${index}`">{{ item.title }}</MenuItem>
                <i-resubmenu v-else :parent="item" :key="`menu_item_${index}`" :index="index"></i-resubmenu>
            </template>
        </Menu>
        <div v-else class="drop-wrapper">
            <template v-for="(item, index) in list">
                <Tooltip v-if="!item.children" :content="item.title" placement="right" :key="`menu_item_${index}`">
                    <span class="drop-menu-span" @click="handleClick(item.title)">
                        <Icon type="logo-apple" color="#fff" :size="20"/>
                    </span>
                </Tooltip>
                <i-redropdown v-else :parent="item" :key="`menu_item_${index}`" icon-color="#fff" :show-title="false"></i-redropdown>
            </template>
        </div>
    </section>
</template>
<script>
import iResubmenu from './re-submenu.vue';
import iRedropdown from './re-dropdown.vue';
export default {
    name: 'iAmenu',
    components: {iResubmenu, iRedropdown},
    props: {
        collapsed: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        handleClick (name) {
            console.log(name);
        }
    }
}
</script>
<style lang="less">
.i-menu-wrapper {
    width: 100%;
    .ivu-tooltip, .drop-menu-span {
        display: block;
        width: 100%;
        text-align: center;
        padding: 5px 0;
        cursor: pointer;
    }
    .ivu-dropdown .drop-menu-span {
        padding: 10px 0;
    }
    .drop-wrapper>.ivu-dropdown {
        display: inline;
        margin: 0 auto;
        padding-top: 5px;
    }
}
</style>
```

`re-submenu.vue`
```vue
<template>
    <Submenu :name="`menu_${parent.title}_${index}`">
        <template slot="title">
            {{parent.title}}
        </template>
        <template v-for="(item, i) in parent.children">
            <MenuItem v-if="!item.children" :name="`menu_${item.title}_${index}`" :key="`menu_item_${index}_${i}`">{{ item.title }}</MenuItem>
            <i-resubmenu v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></i-resubmenu>
        </template>
    </Submenu>
</template>
<script>
export default {
    name: 'iResubmenu',
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

`re-dropdown.vue`
```vue
<template>
    <Dropdown placement="right-start" @on-click="handleClick">
        <span class="drop-menu-span" :style="titleStyle">
            <Icon type="logo-apple" :color="iconColor" :size="20"/>
            <span v-if="showTitle">{{parent.title}}</span>
        </span>
        <DropdownMenu slot="list">
            <template v-for="(item, i) in parent.children">
                <DropdownItem v-if="!item.children" :name="`menu_${item.title}_${index}`" :key="`menu_item_${index}_${i}`">
                    <Icon type="logo-apple" color="#5e5a6e" :size="20"/>
                    <span>{{item.title}}</span>
                </DropdownItem>
                <i-redropdown v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></i-redropdown>
            </template>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
export default {
    name: 'iRedropdown',
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
        },
        iconColor: {
            type: String,
            default: '#5e5a6e'
        },
        showTitle: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        titleStyle () {
            return {
                textAlign: this.showTitle ? 'left' : 'center',
                padding: this.showTitle ? '5px 16px' : ''
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        handleClick (name) {
            // 防止click事件触发多次
            console.log(this.showTitle)
           if (!this.showTitle) {
               console.log(name);
           }
        },
    },
    mounted () {
        console.log('hello')
    }
}
</script>
```

`index.js`
```js
import AMenu from './a-menu.vue'

export default AMenu
```

然后在Layout组件里引入：

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible 
        v-model="collapsed" 
        hide-trigger 
        breakpoint="lg" 
        :collapsed-width="60"
        :reverse-arrow="true">
            <i-amenu :collapsed="collapsed" :list="navList">
                <h1 v-show="!collapsed">logo</h1>
            </i-amenu>
        </Sider>
        <Layout>
            <Header class="header-wrapper">
                <Icon type="md-menu" :size="32" @click.native="handleCollapsed" :class="triggerClasses"/>
            </Header>
            <Content class="content-con">
                <Card class="page-card">
                    <router-view/>
                </Card>
            </Content>
            <Footer class="footer-wrapper">
                <p>power by zong 2021</p>
            </Footer>
        </Layout>
    </Layout>
</template>
<script>
import iAmenu from '_c/iview-menu';
export default {
    components: {iAmenu},
    data () {
        return {
            collapsed: false,
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
                                },
                                {
                                    title: '3-3-3',
                                    children: [
                                        {
                                            title: '3-3-3-1'
                                        },
                                        {
                                            title: '3-3-3-2'
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '4'
                },
                {
                    title: '5'
                },
            ]
        }
    },
    computed: {
        triggerClasses () {
            return [
                'trigger-icon',
                this.collapsed ? 'rotate' : ''
            ]
        }
    },
    methods: {
        handleCollapsed () {
            this.collapsed = !this.collapsed;
        }
    }
}
</script>
```









写递归组件的要领，哪一块儿代码是一直循环的，就把哪一块儿的代码单独拆出来写成递归组件


<style>
  .page p, div, ol {
    font-size: 14px;
  }
</style>


