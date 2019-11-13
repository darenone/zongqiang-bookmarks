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
```js
  // {
  //   path: '/home',
  //   name: '首页',
  //   meta:{
  //     requiresAuth:true
  //   },
  //   component: resolve => require(['@/views/frame.vue'], resolve),
  //   children: [
  //     {
  //       path:'/home',
  //       name:'首页',
  //       component: resolve => require(['@/views/home.vue'], resolve),
  //     },
  //     {
  //       path: '/system/org',
  //       name:'组织机构',
  //       meta:{
  //         requiresAuth:true
  //       },
  //       component: resolve => require(['@/views/system/org/organization.vue'], resolve),
  //     },
  //     {
  //       path: '/system/personal',
  //       name:'人员管理',
  //       meta:{
  //         requiresAuth:true
  //       },
  //       component: resolve => require(['@/views/system/personal/personal.vue'], resolve),
  //     },
  //     {
  //       path: '/system/fun',
  //       name:'功能管理',
  //       meta:{
  //         requiresAuth:true
  //       },
  //       component: resolve => require(['@/views/system/fun/fun.vue'], resolve),
  //     },
  //     {
  //       path: '/system/type',
  //       name:'类型管理',
  //       meta:{
  //         requiresAuth:true
  //       },
  //       component: resolve => require(['@/views/system/type/type.vue'], resolve),
  //     },
  //     {
  //       path: '/system/log',
  //       name:'日志管理',
  //       meta:{
  //         requiresAuth:true
  //       },
  //       component: resolve => require(['@/views/system/logmannagement/logmanagement.vue'], resolve),
  //     },
  //   ]
  // },
```
