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
        sidebarDepth: 2, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上
        lastUpdated: '上次更新' ,// 文档更新时间：每个文件git最后提交的时间,
        sidebar: 'auto',
        // 顶部导航栏
        nav: [
            // 单项 text：显示文字，link：指向链接
            // 这里的'/' 指的是 docs文件夹路径
            // 以 '/' 结尾的默认指向该路径下README.md文件
            {text: '主页', link: '/'}, // 导航条
            {text: '我的文章', link: '/article/'},
            {text: '网址大全', link: '/website/'},
            // {text: '链接2', link: '/Store/'},
            // {text: '链接3', link: '/Thought/'},
            {text: '常用函数', link: '/function/'},
            // 多项，下拉形式
            {
                text: 'vue系列',
                items: [
                    { text: 'vue开发实战', link: '/vue/vue-practice/practice-1'},
                    { text: 'vue系列文章', link: '/vue/vue-article/practice-1'},
                ]
            },
            {
                text: '小程序系列',
                items: [
                    { text: '微信小程序开发实战', link: '/miniprogram/practice-1'},
                ]
            },
            {
                text: 'nodeJs系列',
                items: [
                    { text: 'nodeJs基础实战', link: '/nodeJs/practice-1'},
                ]
            },
            {
                text: '友情链接',
                items: [
                    // link：指向链接也可以是外网链接
                    { text: 'gitHub', link: 'https://github.com/darenone'},
                    { text: 'Segmentfault', link: 'https://segmentfault.com/u/niuzailushang_587d8385a71e9'},
                    { text: '掘金', link: 'https://juejin.im/user/57ca3f4c128fe1006969be2c'},
                    { text: '知乎专栏', link: 'https://zhuanlan.zhihu.com/zongqiang'},
                    { text: '简书', link: 'https://www.jianshu.com/u/944f222b2ad4'},
                    { text: 'markDown语法', link: 'https://github.com/younghz/Markdown'},
                ]
            },
            // {
            //     text: 'gitHub',
            //     items: [
            //         { text: 'GitHub首页', link: 'https://github.com/Mulander-J' },
            //         { text: 'Island', link: 'https://mulander-j.github.io/island/code/html/index.html' },
            //         { text: 'TimeWaster', link: 'https://mulander-j.github.io/timeWaster/demo/index.html#/' },
            //     ]
            // }
        ],
        // 侧边栏菜单( 一个模块对应一个菜单形式 )
        sidebar: {
            // 打开FAQ主页链接时生成下面这个菜单
            // ['','']=>[路径,标题]
            // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
            // 不以 '/' 结尾的就是指向.md文件
            // '/FAQ/DigestionHeap/Digested.md'文件
            '/article/': [
                ['/article/','简介'],
                // ['/FAQ/Pool/SkillStack','技术栈'],
                ['/article/vuePress/article1','利用vuePress搭建博客'],
                {
                    title: 'vue相关', // 菜单名
                    children: [ // 子菜单
                        ['/article/vue/menu','vue+iview配置导航栏'],
                        ['/article/vue/vuex','vuex在项目中的使用'],
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
                {
                    title: 'vue开发实战',
                    children: [
                        ['/vue/vue-practice/practice-1','使用vue-cli3.0创建项目'],
                        ['/vue/vue-practice/practice-2','项目路由配置'],
                    ],
                    collapsable: false
                },
                {
                    title: 'vue开发总结',
                    children: [
                        ['/vue/vue-article/practice-1','介绍一些vue开发中的小技巧'],
                    ],
                    collapsable: false
                }
            ],
            '/miniprogram/': [
                {
                    title: '微信小程序开发实战',
                    children: [
                        ['/miniprogram/practice-1','小程序项目结构'],
                    ],
                    collapsable: false
                }
            ],
            '/nodeJs/': [
                {
                    title: 'nodeJs基础实战',
                    children: [
                        ['/nodeJs/practice-1','nodeJs入门'],
                        ['/nodeJs/practice-2','创建一个nodeJs引用及调试'],
                        ['/nodeJs/practice-3','nodeJs核心模块-buffer缓冲器'],
                        ['/nodeJs/practice-4','nodeJs核心模块-buffer缓冲器2'],
                        ['/nodeJs/practice-5','nodeJs文件系统fs模块常用api'],
                        ['/nodeJs/practice-6','nodeJs文件流讲解'],
                        ['/nodeJs/practice-7','nodeJs基础模块path常用api'],
                        ['/nodeJs/practice-8','nodeJs事件触发器events'],
                        ['/nodeJs/practice-9','node核心模块util常用工具'],
                        ['/nodeJs/practice-10','http解析-http发展历史'],
                        ['/nodeJs/practice-11','搭建自己的第一个http服务器'],
                        ['/nodeJs/practice-12','利用nodejs做一个简易的爬虫'],
                        ['/nodeJs/practice-13','如何处理客户端get/post请求'],
                        ['/nodeJs/practice-14','初始化路由及接口开发'],
                        ['/nodeJs/practice-15','实战-利用模拟数据对用户列表增删改查'],
                        ['/nodeJs/practice-16','轻松解决接口跨域问题'],
                        ['/nodeJs/practice-17','nodeJs连接Mysql'],
                        ['/nodeJs/practice-18','结合数据库改造用户列表接口'],
                        ['/nodeJs/practice-19','MongoDB的介绍及安装'],
                    ],
                    collapsable: false
                }
            ],
             // 打开Thought主页链接时生成下面这个菜单
            // '/Thought/':[
            //     ['/Thought/','随笔首页'],
            //     {
            //         title: '游记',
            //         children: [
            //             ['/Thought/Travels/beiPing','北平游记'],
            //         ]
            //     },
            //     {
            //         title: '年终回顾',
            //         children: [
            //             ['/Thought/YearReview/2018','2018年'],
            //             ['/Thought/YearReview/2019','2019年']
            //         ]
            //     },
            // ],
            // 打开Store主页链接时生成下面这个菜单
            // '/Store/': [
            //     ['','仓库首页'],
            //     {
            //         title: '应用',
            //         children: [
            //             ['/Store/Apps/DownDoors', '下载门户'],
            //             ['/Store/Apps/OwnTest', '博主测评']
            //         ]
            //     },
            //     {
            //         title: '电影',
            //         children: [
            //             ['/Store/Films/','收藏级电影']
            //         ]
            //     },
            //     {
            //         title: '动画',
            //         children: [
            //             ['/Store/Anime/','收藏级动画']
            //         ]
            //     },
            // ]
        }
    }
    
}
