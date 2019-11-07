```js
const createRouter = function() {
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
}

const router = createRouter();
export default router;

// 重定向
{ path: '*', redirect: '/notFound', hidden: true }

// layout.vue
{
    path: '/',
    component: Layout,
},
{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
        {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
        }
    ]
},
```

#### 资源
- router.beforeEach的设置，光猫项目直接写在router/index.js里面，vue-element-admin专门写在permission.js然后再在main.js里面引入，login是直接写在main.js里面
- [iview导航栏展开收缩的写法](https://blog.csdn.net/qq_41636140/article/details/90757338 "iview导航栏展开收缩的写法")<br>
- router constantRoutes asyncRoutes
- router模块写法