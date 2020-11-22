module.exports = {
    title: '宗强的博客', // 博客名字
    description: '宗强的博客', // meta中的描述文字，seo用
    // 注入到当前页面的HTML <head>中的标签
    head: [
        // 增加一个favicon图表
        // '/'指向docs/.vuepress/public目录,即docs/.vuepress/public/img/geass-bg.ico
        ['link', {rel: 'icon', href: '/img/zongqiang.ico'}],
    ],
    base: '/zongqiang-bookmarks/', // 部署到GitHub相关配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        sidebarDepth: 2, // 将同时提取markdown中h2 和 h3, h4 标题，显示在侧边栏上
        // displayAllHeaders: true,
        lastUpdated: '上次更新' ,// 文档更新时间：每个文件git最后提交的时间,
        // sidebar: 'auto',
        // 顶部导航栏
        nav: [
            // 单项 text：显示文字，link：指向链接
            // 这里的'/' 指的是 docs文件夹路径
            // 以 '/' 结尾的默认指向该路径下README.md文件
            {text: '主页', link: '/'}, // 导航条
            {text: 'vue系列', link: '/vue/'},
            {text: '我的文章', link: '/article/'},
            {text: '网址大全', link: '/website/'},
            {text: '常用函数', link: '/function/'},
            // 多项，下拉形式
            // {
            //     text: 'vue系列',
            //     items: [
            //         { text: '简介', link: '/vue/'},
            //         { text: 'vue开发实战', link: '/vue/vue-practice/practice-1'},
            //         { text: 'vue系列文章', link: '/vue/vue-article/practice-1'},
            //     ]
            // },
            // { text: 'nodeJs系列', link: '/node/nodeJs/practice-1' },
            {
                text: '技术概览',
                items: [
                    { text: 'Vue', link: '/vue/'},
                    { text: 'React', link: '/react/'},
                    { text: '微信小程序', link: '/miniprogram/'},
                    { text: 'NodeJs', link: '/node/'},
                    { text: '脚手架学习', link: '/scaffold/'},
                    { text: '原生移动端开发', link: '/web-app/'},
                ]
            },
            {
                text: '友情链接',
                items: [
                    // link：指向链接也可以是外网链接
                    { text: '我的gitHub', link: 'https://github.com/darenone'},
                    { text: '我的博客', link: 'https://darenone.github.io/zongqiang-bookmarks/'},
                    { text: 'Segmentfault', link: 'https://segmentfault.com/u/niuzailushang_587d8385a71e9'},
                    { text: '掘金', link: 'https://juejin.im/user/2990287320007886'},
                    { text: '我的知乎', link: 'https://www.zhihu.com/people/zongqinag/posts'},
                    { text: '简书', link: 'https://www.jianshu.com/u/944f222b2ad4'},
                    { text: 'markDown语法', link: 'https://github.com/younghz/Markdown'},
                    { text: '微信markdown编辑器', link: 'https://openwrite.cn/weixin.html#'},
                    { text: '微信公众号', link: 'https://mp.weixin.qq.com/'},
                ]
            }
        ],
        // 侧边栏菜单( 一个模块对应一个菜单形式 )
        sidebar: {
            '/article/': [
                ['/article/','简介'],
                // ['/FAQ/Pool/SkillStack','技术栈'],
                ['/article/vuePress/article1','利用vuePress搭建博客'],
                {
                    title: 'vue相关', // 菜单名
                    children: [ // 子菜单
                        ['/article/vue/menu','vue+iview配置导航栏'],
                        ['/article/vue/mock','vue中利用mock模拟后端接口'],
                        ['/article/vue/styles','在vue项目中如何组织样式styles文件'],
                        ['/article/vue/router','vue项目中router设置'],
                        ['/article/vue/method','vue语法介绍'],
                        ['/article/vue/function','常用函数整理'],
                        ['/article/vue/echart','echart在vue中的应用']
                    ]
                },
                {
                    title: 'css相关',
                    children: [
                        ['/article/css/practice-1','css常用布局介绍'],
                        // ['/article/Console/A002','#A002_插件清单']
                    ]
                },
                {
                    title: 'javascript相关',
                    children: [
                        ['/article/javascript/practice-1','JavaScript学习'],
                        // ['/article/Console/A002','#A002_插件清单']
                    ]
                },
                {
                    title: 'typescript相关',
                    children: [
                        ['/article/typescript/practice-1','typescript学习'],
                        // ['/article/Console/A002','#A002_插件清单']
                    ]
                },
                {
                    title: 'web安全',
                    children: [
                        ['/article/web-security/article-1','谈谈web安全'],
                        ['/article/web-security/article-2', '常见六大web安全攻防解析',]
                    ]
                },
            ],
            '/website/': [
                ['/website/','网站大全'],
            ],
            '/function/': [
                ['/function/','常用函数'],
            ],
            '/vue/': [
                ['/vue/','简介'],
                {
                    title: 'vue实战',
                    children: [
                        '/vue/vue-practice/practice-1',
                        '/vue/vue-practice/practice-2',
                        '/vue/vue-practice/practice-3',
                        '/vue/vue-practice/practice-4',
                        '/vue/vue-practice/practice-5',
                        '/vue/vue-practice/practice-6',
                        '/vue/vue-practice/practice-7',
                        '/vue/vue-practice/practice-8',
                        '/vue/vue-practice/practice-9',
                    ],
                    collapsable: true
                },
                {
                    title: 'vue理论',
                    children: [
                        '/vue/vue-article/practice-1',
                        '/vue/vue-article/practice-2',
                        '/vue/vue-article/practice-3',
                        '/vue/vue-article/practice-4',
                    ],
                    collapsable: true
                },
            ],
            '/miniprogram/': [
                ['/miniprogram/', '简介'],
                {
                    title: '教你开发第一个微信小程序',
                    children: [
                        ['/miniprogram/mini-1/practice-1','微信小程序介绍'],
                    ],
                    collapsable: true
                },
            ],
            '/react/': [
                ['/react/', '简介'],
                // {
                //     title: '从零学习react',
                //     children: [
                //         ['/react/react-1/practice-1','react介绍'],
                //     ],
                //     collapsable: true
                // },
            ],
            '/node/': [
                ['/node/', '简介'],
                {
                    title: 'nodeJs基础实战',
                    children: [
                        '/node/nodeJs/practice-1',
                        '/node/nodeJs/practice-2',
                        '/node/nodeJs/practice-3',
                        '/node/nodeJs/practice-4',
                        '/node/nodeJs/practice-5',
                        '/node/nodeJs/practice-6',
                        '/node/nodeJs/practice-7',
                        '/node/nodeJs/practice-8',
                        '/node/nodeJs/practice-9',
                        '/node/nodeJs/practice-10',
                        '/node/nodeJs/practice-11',
                        '/node/nodeJs/practice-12',
                        '/node/nodeJs/practice-13',
                        '/node/nodeJs/practice-14',
                        '/node/nodeJs/practice-15',
                        '/node/nodeJs/practice-16',
                        '/node/nodeJs/practice-17',
                        '/node/nodeJs/practice-18',
                        '/node/nodeJs/practice-19',
                        '/node/nodeJs/practice-20',
                        '/node/nodeJs/practice-21',
                        '/node/nodeJs/practice-22',
                        '/node/nodeJs/practice-23',
                        '/node/nodeJs/practice-24',
                        '/node/nodeJs/practice-25',
                        '/node/nodeJs/practice-26',
                        '/node/nodeJs/practice-27',
                        '/node/nodeJs/practice-28',
                        '/node/nodeJs/practice-29',
                    ],
                    collapsable: true
                },
                {
                    title: '利用node开发简易博客系统',
                    children: [
                        ['/node/myBlog/practice-1','项目初始化及前端框架搭建'],
                    ],
                    collapsable: true
                }
            ],
            '/scaffold/': [
                ['/scaffold/','简介'],
                {
                    title: 'gulp',
                    children: [
                        '/scaffold/gulp/gulp-1',
                    ],
                    collapsable: true
                },
            ],
            '/vue-app/': [
                ['/web-app/','简介'],
                {
                    title: '原生移动端开发教程',
                    children: [
                        '/web-app/article-1',
                    ],
                    collapsable: true
                }
            ],
        }
    }
    
}
