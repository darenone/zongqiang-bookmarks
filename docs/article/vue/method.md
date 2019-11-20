在vue项目中经常使用或者比较少见的写法，都陆续整理到这篇文章中，做一个记录，方便在做以后的vue项目中可以使用到：<br>
### 引入图片
```html
<img :src="require('@/assets/opt_'+$base.opt[item.opt]+'.png')"/>
<img class="arrow" src="@/assets/arrow-dropdown.png" alt="">
<img src="./../../../static/message.png" alt="" class="message">
<style>
.wrapper-top {
    position: absolute;
    @include fill-contain(100%, 65px);
    top: 0;
    background: url('./../../../static/navbar.png') repeat 100% 100%;
}
</style>
```
```js
export default {
    data() {
        return {
            imgList: [
                {id: 1, imgSrc: require("../assets/1.jpg")}
            ]
        }
    }
}
```
### 引入样式文件
```css
<style>
@import "./../../../../src/styles/table-define.css";
</style>
```
### 引入js文件
`utils/index.js`
```js
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
```
组件里面调用：
```js
import { parseTime, formatTime } from '@/utils'
```
`utils/table.js`
```js
export default {
    watch: {
		'$route': {
			handler(to, form) {
				console.log(to)
			},
			deep: true
		}
    },
    created() {
		if (this.$route.path === this.nowRouter) {
			this.$store.dispatch('hiddenView', true).then(res => {
				console.log('重置')
			})
		}
    },
    computed: {
		// 视图切换
		routerView() {
			return this.$store.state.user.routerView
		},
		// 判断选中的数组长度
		selectLegth() {
			return this.multipleSelection.length
		},
		// 详情数据
		detailsData() {
			if (this.selectLegth === 1) {
				return this.multipleSelection[0]
			}
		}
	}
}
```
组件里面调用：
```js
import tableFn from '@/utils/mixin/table.js'
export default {
    mixins: [ tableFn ]
}
```
### 路由设置
```js
export const asyncRoutes = [
  {
    path: '/taskSet',
    component: Layout,
    redirect: '/taskSet/list',
    name: 'taskSet',
    meta: {
      title: '任务管理设置',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        // component: () => import('@/views/taskSet/create.vue'),
        component: resolve => require(['@/views/taskSet/create.vue'], resolve),
        name: 'createTask',
        meta: { title: '创建任务', icon: 'edit' }
      },
    ]
  }
]

```
```js
// arr.filter(item => !(/^test|^System/i.test(item.ServiceID)))
this.ip_list = this.ip_list.filter(item => {
    return !(eval('/^'+ip+'/i').test(item.ipAddress));
});
```
### 链接
- [弹性盒布局兼容写法](https://www.cnblogs.com/yangjie-space/p/4856109.html, '弹性盒布局兼容写法')
- vue递归获取菜单
- router.beforeEach的设置，光猫项目直接写在router/index.js里面，vue-element-admin专门写在permission.js然后再在main.js里面引入，login是直接写在main.js里面
- [iview导航栏展开收缩的写法](https://blog.csdn.net/qq_41636140/article/details/90757338 "iview导航栏展开收缩的写法")<br>
- router constantRoutes asyncRoutes
- router模块写法z
- 打包部署需要注意`config/index.js`这是设置打包以后生成的静态文件文件名
```js
    // Template for index.html
    index: path.resolve(__dirname, '../netQuality/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../netQuality'),
```
- 递归实现面包屑
```js
getBreadcrumb() {
  var list = this.$route.fullPath.split('/')//list[0]:是空格
  this.breadListLast = []
  function fn(obj, arr, index,self) {
    if (obj.hasOwnProperty('children')&&obj['children'].length>0) {
      for (let one of obj.children) {
        if (one.name != 'index' && one.name == arr[index]) {
          self.breadListLast.push({'title': one.meta.title, 'path': list.slice(0,index+1).join('/')})
          return one.hasOwnProperty('children')&&one['children'].length>0?fn(one,arr,index+1,self):false
        }
      }
    }
  }
  for(let one of this.$router.options.routes){
    if(one.hasOwnProperty('name')&&one.name == list[1]){
      this.breadListLast.push({'title': one.meta.title, 'path': one.path})
      fn(one,list,2,this)
    }
  }
  // console.log(this.breadListLast)
}
```
- [vue中正确封装echarts](https://forum.vuejs.org/t/vue-echarts/23214 "vue中正确封装echarts")