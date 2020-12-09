# 12. 在项目中使用View UI

## 1. 全局引入

具体方法可以参考[view UI](http://v1.iviewui.com/docs/guide/start)官方文档

## 2. 按需引入

具体方法可以参考[view UI](http://v1.iviewui.com/docs/guide/start)官方文档，提示一下，即使是按需引入，样式文件还是需要在`main.js`里面全局使用：

```js
import 'view-design/dist/styles/iview.css'
```

之后在`main.js`里面引入你需要使用的组件

```js
import { Button, Table } from 'view-design';
Vue.component('Button', Button);
Vue.component('Table', Table);
```

官方文档里说，在非 template/render 模式下（例如使用 CDN 引用时），组件名要分隔，例如`DatePicker`必须要写成`date-picker`。

以下组件，在非`template/render`模式下，需要加前缀`i-`：

```
Button: i-button
Col: i-col
Table: i-table
Input: i-input
Form: i-form
Menu: i-menu
Select: i-select
Option: i-option
Progress: i-progress
Time: i-time
```

这里说的template模式，就比如下面这种写法：

```vue
<template>

</template>
<script>
export default {
    name: 'ASubmenu',
    data () {
        return {}
    },
    methods: {}
}
</script>
```

在这里面，就可以直接写成`DatePicker`，如果在所有模式下都不想加前缀使用，可以在项目中使用`iview-loader`这个插件，此插件安装可以参考官方文档[View UI Loader](http://v1.iviewui.com/docs/guide/iview-loader)

安装好以后，在`vue.config.js`里面配置如下：

```js
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('iview')
            .loader('iview-loader')
            .options({prefix: false})
    }
}
```

## 2. 使用layout布局

新建`views/Layout.vue`组件，并在`router/index.js`里面引入，然后把`home`替换成`Layout`

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider hide-trigger>Sider</Sider>
        <Layout>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {

    }
}
</script>
<style lang="less" scoped>
.layout-outer {
    height: 100%;
}
</style>
```

`router/index.js`
```js
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    meta: {
      title: '首页',
      requiresAuth: ['admin', 'user']
    }
  }
]
```

之后把`App.vue`修改一下：

`App.vue`
```vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import menuComponents from "_c/menu"
import ReSubmenu from '_c/menu/re-submenu.vue'
const { AMenu, AMenuItem} = menuComponents
export default {
  name: 'App',
  components: {
    AMenu,
    AMenuItem,
    ReSubmenu
  },
  data () {
    return {
      navList: []
    }
  },
  methods: {
    go_page (taskId) {
      this.$router.push({
        name: 'task-detail',
        params: {
          taskId: taskId
        }
      })
    },
    loopFun(list, index, path) {
      let arr = []
      index++
      list.forEach(e => {
        let pathUrl = path && e.path ? path + '/' + e.path : e.path;
        if (e.name) {
          if (e.children) {
            let children = this.loopFun(e.children, index, pathUrl)
            arr.push({
              path: pathUrl,
              title: e.name,
              children: children,
              level: index
            })
          } else {
            arr.push({
              path: pathUrl,
              title: e.name,
              level: index
            })
          }
        }
      })
      return arr;
    },
  },
  mounted () {
    let routerList = this.$router.options.routes;
    this.navList = this.loopFun(routerList, 0, '');
  }
}
</script>
<style lang="less">
html, body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.router-enter {
  opacity: 0;
}
.router-enter-active {
  transition: opacity 0.5s ease;
}
.router-enter-to {
  opacity: 1;
}
.router-leave {
  opacity: 1;
}
.router-leave-active {
  transition: opacity 0.5s ease;
}
.router-leave-to {
  opacity: 0;
}
</style>
```

接着，给`Header`增加一些样式

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider>Sider</Sider>
        <Layout>
            <Header class="header-wrapper">Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {

    }
}
</script>
<style lang="less" scoped>
.layout-outer {
    height: 100%;
    .header-wrapper {
        background: #fff;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .1);
    }
}
</style>
```

再来看下`Sider`组件，在[官方文档-layout](http://v1.iviewui.com/components/layout)里，它有一些属性，这里简单介绍一下：

1. `collapsible`属性

控制左侧区域是否可收起，默认值为false，具体用法如下

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible v-model="collapsed">Sider</Sider>
        <Layout>
            <Header class="header-wrapper">Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {
        return {
            collapsed: false
        }
    }
}
</script>
```

你就可以看到在Sider的最下面有一个小箭头，点击可以实现展开和收缩的功能，但是一般不放在这里控制，可以加一个`hide-trigger`属性，隐藏这个小箭头

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible v-model="collapsed" hide-trigger>Sider</Sider>
        <Layout>
            <Header class="header-wrapper">Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
```

我们在`header`里增加一个小图标，点击这个`icon`来控制`Sider`的展开和收缩

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible v-model="collapsed" hide-trigger>Sider</Sider>
        <Layout>
            <Header class="header-wrapper">
                <Icon type="md-menu" :size="32"/>
            </Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {
        return {
            collapsed: false
        }
    }
}
</script>
<style lang="less" scoped>
.layout-outer {
    height: 100%;
    .header-wrapper {
        background: #fff;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .1);
        padding: 0 23px;
    }
}
</style>
```

接着给`icon`绑定一个click事件，由于`icon`组件没有click事件，需要把click事件绑定要`icon`最外层的html上，所以需要给这个html绑定一个原生的click事件

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible v-model="collapsed" hide-trigger>Sider</Sider>
        <Layout>
            <Header class="header-wrapper">
                <Icon type="md-menu" :size="32" @click.native="handleCollapsed"/>
            </Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {
        return {
            collapsed: false
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

这里还需要给`Icon`添加一个动态class，配合`Sider`收起的时候，其旋转90°，可以通过计算属性`computed`实现

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider collapsible v-model="collapsed" hide-trigger>Sider</Sider>
        <Layout>
            <Header class="header-wrapper">
                <Icon type="md-menu" :size="32" @click.native="handleCollapsed" :class="triggerClasses"/>
            </Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data () {
        return {
            collapsed: false
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
<style lang="less" scoped>
.layout-outer {
    height: 100%;
    .header-wrapper {
        background: #fff;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .1);
        padding: 0 23px;
        .trigger-icon {
            cursor: pointer;
            &.rotate {
                transform: rotateZ(-90deg);
                transition: transform .3s ease;
            }
        }
    }
}
</style>
```

2. `breakpoint`属性

触发响应式的断点，浏览器到达某个宽度的时候，让`Sider`自动收缩起来

3. ` width`属性

`Sider`展开的宽度

4. `collapsed-width`属性

`Sider`收缩时的宽度

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider 
        collapsible 
        v-model="collapsed" 
        hide-trigger 
        breakpoint="lg" 
        :collapsed-width="60">Sider</Sider>
        <Layout>
            <Header class="header-wrapper">
                <Icon type="md-menu" :size="32" @click.native="handleCollapsed" :class="triggerClasses"/>
            </Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
</template>
```

5. `default-collapsed`属性

默认是否收起

6. `reverse-arrow`属性

默认小箭头（触发器）的方向，一般`Sider`在右边的时候用到，设置这个属性的时候`hide-trigger`属性需要设置成false才能看到默认触发器

接着咱再引入`Card`组件来填充`Content`组件，并且给`Card`组件设置一个`height`，来完善整个Layout框架

`views/Layout.vue`
```vue
<template>
    <Layout class="layout-outer">
        <Sider 
        collapsible 
        v-model="collapsed" 
        hide-trigger 
        breakpoint="lg" 
        :collapsed-width="60"
        :reverse-arrow="true">Sider</Sider>
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
export default {
    data () {
        return {
            collapsed: false
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
<style lang="less" scoped>
.layout-outer {
    height: 100%;
    .header-wrapper {
        background: #fff;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .1);
        padding: 0 23px;
        .trigger-icon {
            cursor: pointer;
            &.rotate {
                transform: rotateZ(-90deg);
                transition: transform .3s ease;
            }
        }
    }
    .content-con {
        padding: 10px;
        .page-card {
            height: ~'calc(100vh - 64px - 20px - 48px - 21px)';
            overflow: hidden;
            overflow-y: auto;
        }
    }
    .footer-wrapper {
        background: #fff;
        box-shadow: 0 -1px 1px 1px rgba(0, 0, 0, .1);
    }
}
</style>
```

接下来修改路由，将原来`home.vue`里的内容显示在`Layout.vue`里面，这样当路由改变，整个`Layout`不会重新加载，只是`Content`组件里的内容重新加载

`router/index.js`
```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    meta: {
      title: '首页',
      requiresAuth: ['admin', 'user']
    },
    children: [
      {
        path: 'home',
        component: Home
      }
    ]
  }
]
```

浏览器访问路由`http://localhost:4000/home`就可以看到，原来home里的内容已经成功加载到`Content`组件里面了

<style>
  .page p, div, ol {
    font-size: 14px;
  }
</style>