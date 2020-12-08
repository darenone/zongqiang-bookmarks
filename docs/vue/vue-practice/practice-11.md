# 11. 手写一个导航菜单-2

上节内容，基本实现了导航菜单，接下来就是将项目里的路由给整进来

这节的开发内容还是放在我的项目[vue-base-frame](https://github.com/darenone/vue-base-frame)里进行

这里需要调整下项目的布局，改为左侧导航固定，右侧自适应的布局，需要改造`App.vue`里面的代码

```vue
<template>
  <div id="app">
    <div class="content">
      <div class="content-left">
         <div id="nav">
          <ul>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/about">About</router-link>
            </li>
            <li>
              <router-link to="/house">house</router-link>
            </li>
            <li>
              <router-link to="/task-detail">任务详情10000218</router-link>
            </li>
            <li>
              <router-link to="/task-detail/10000217">任务详情10000217</router-link>
            </li>
            <li>
              <router-link to="/task-detail/10000216">任务详情10000216</router-link>
            </li>
            <li>
              <button @click="go_page('10000218')">任务详情10000218</button>
            </li>
            <li>
              <button @click="go_page('10000217')">任务详情10000217</button>
            </li>
            <li>
              <button @click="go_page('10000216')">任务详情10000216</button>
            </li>
            <li>
              <router-link to="/product">产品</router-link><br>
            </li>
            <li>
              <router-link to="/product/ele-product">电子产品</router-link><br>
            </li>
            <li>
              <router-link to="/product/ele-product/phone">手机</router-link>
              <router-link :to="{name: 'computer'}">电脑</router-link>
            </li>
            <li>
              <router-link to="/father">父组件</router-link><br>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-right">
        <transition-group :name="routerTransition">
          <router-view key="default"/>
          <router-view key="email" name="email"/>
          <router-view key="tel" name="tel"/>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

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
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    &-left {
      width: 200px;
      height: 100%;
      background: #42b983;
      overflow: hidden;
      overflow-y: auto;
    }
    &-right {
      flex: 1;
      background: palegoldenrod;
    }
  }
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

然后修改`public/index.html`里面的内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <style>
      html, body {
        height: 100%;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

上节文章里，我用`navList`来存放路由，这里我把`router/index.js`里面的路由通过`this.$router.options.routes`放到这个list里面，并且定义一个函数`loopFun()`来递归循环这个list

修改`menu-page.vue`组件里的代码：

```vue
<template>
    <div class="menu-box">
        <a-menu>
            <template v-for="(item, index) in navList">
                <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${index}`" :key="`menu_item_${index}`" :style="{'padding-left': `${item.level * 20}px`}">
                    <router-link :to="item.path">{{ item.title }}</router-link>
                </a-menu-item>
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
            navList: []
        }
    },
    methods: {
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
.menu-box {
    width: 200px;
}
</style>
```

记得在`re-submenu.vue`这个递归组件里也修改一下：

```vue
<template>
    <a-sub-menu>
        <div slot="title" :style="{'padding-left': `${parent.level * 20}px`}">{{parent.title}}</div>
        <template v-for="(item, i) in parent.children">
            <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${i}`" :key="`menu_item_${index}_${i}`" :style="{'padding-left': `${item.level * 20}px`}">
                <router-link :to="item.path">{{ item.title }}</router-link>
            </a-menu-item>
            <re-submenu v-else :parent="item" :index="i" :key="`menu_item_${index}_${i}`"></re-submenu>
        </template>
    </a-sub-menu>
</template>
```

接下里，咱们把已经完成的菜单放到`App.vue`里面，修改`App.vue`里面的代码如下，也就是把`menu-page.vue`里面的代码复制一份儿

```vue
<template>
  <div id="app">
    <div class="content">
      <div class="content-left">
        <!-- <div id="nav">
          <ul>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/about">About</router-link>
            </li>
            <li>
              <router-link to="/house">house</router-link>
            </li>
            <li>
              <router-link to="/task-detail">任务详情10000218</router-link>
            </li>
            <li>
              <router-link to="/task-detail/10000217">任务详情10000217</router-link>
            </li>
            <li>
              <router-link to="/task-detail/10000216">任务详情10000216</router-link>
            </li>
            <li>
              <button @click="go_page('10000218')">任务详情10000218</button>
            </li>
            <li>
              <button @click="go_page('10000217')">任务详情10000217</button>
            </li>
            <li>
              <button @click="go_page('10000216')">任务详情10000216</button>
            </li>
            <li>
              <router-link to="/product">产品</router-link><br>
            </li>
            <li>
              <router-link to="/product/ele-product">电子产品</router-link><br>
            </li>
            <li>
              <router-link to="/product/ele-product/phone">手机</router-link>
              <router-link :to="{name: 'computer'}">电脑</router-link>
            </li>
            <li>
              <router-link to="/father">父组件</router-link><br>
            </li>
          </ul>
        </div> -->
        <a-menu>
          <template v-for="(item, index) in navList">
            <a-menu-item v-if="!item.children" :uId="`menu_${item.title}_${index}`" :key="`menu_item_${index}`" :style="{'padding-left': `${item.level * 20}px`}">
              <router-link :to="item.path">{{ item.title }}</router-link>
            </a-menu-item>
            <re-submenu v-else :parent="item" :key="`menu_item_${index}`" :index="index"></re-submenu>
          </template>
        </a-menu>
      </div>
      <div class="content-right">
        <transition name="router">
          <router-view key="default"/>
          <router-view key="email" name="email"/>
          <router-view key="tel" name="tel"/>
        </transition>
      </div>
    </div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    &-left {
      width: 200px;
      height: 100%;
      background: #42b983;
      overflow: hidden;
      overflow-y: auto;
    }
    &-right {
      flex: 1;
      background: palegoldenrod;
    }
  }
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
<style>
  .page p, div, ol {
    font-size: 14px;
  }
</style>