module.exports = {
    title: '宗强的博客', // 博客名字
    description: '宗强的前端博客', // meta中的描述文字，seo用
    // 注入到当前页面的HTML <head> 中的标签
    head: [
        // 增加一个favicon图表
        // '/'指向docs/.vuepress/public目录,即docs/.vuepress/public/img/geass-bg.ico
        ['link', {rel: 'icon', href: '/img/geass-bg.ico'}],
    ],
    base: '/zongqiang-bookmarks/', // 部署到GitHub相关配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        sidebarDepth: 4, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上
        lastUpdated: '上次更新' ,// 文档更新时间：每个文件git最后提交的时间,
        // 顶部导航栏
        nav: [
            // 单项 text：显示文字，link：指向链接
            // 这里的'/' 指的是 docs文件夹路径
            // 以 '/' 结尾的默认指向该路径下README.md文件
            {text: '主页', link: '/'}, // 导航条
            {text: '链接1', link: '/FAQ/'},
            {text: '链接2', link: '/Store/'},
            {text: '链接3', link: '/Thought/'},
            // 多项，下拉形式
            {
                text: '联系我',
                items: [
                    // link：指向链接也可以是外网链接
                    { text: 'Segmentfault', link: 'https://segmentfault.com/u/mulander' },
                ]
            },
            {
                text: 'gitHub',
                items: [
                    { text: 'GitHub首页', link: 'https://github.com/Mulander-J' },
                    { text: 'Island', link: 'https://mulander-j.github.io/island/code/html/index.html' },
                    { text: 'TimeWaster', link: 'https://mulander-j.github.io/timeWaster/demo/index.html#/' },
                ]
            }
        ],
        // 侧边栏菜单( 一个模块对应一个菜单形式 )
        sidebar: {
            // 打开FAQ主页链接时生成下面这个菜单
            '/FAQ/': [
                //多级菜单形式
                {
                    // 菜单名
                    title: '消化堆',
                    // 子菜单
                    children: [
                        // ['','']=>[路径,标题]
                        // 或者写成 '路径',标题自动识别为该地址的文件中的h1标题
                        // 不以 '/' 结尾的就是指向.md文件             
                        ['/FAQ/DigestionHeap/Digested','消化过'], // '/FAQ/DigestionHeap/Digested.md'文件
                        ['/FAQ/DigestionHeap/Digesting','消化中'],
                        ['/FAQ/DigestionHeap/DigestWill','待消化']
                    ]
                },
                {
                    title: '输出层',
                    children: [
                        ['/FAQ/Console/A001','#A001_VuePress'],
                        ['/FAQ/Console/A002','#A002_插件清单']
                    ]
                },
                ['/FAQ/','百科首页'],
                ['/FAQ/Pool/SkillStack','技术栈'],
                ['/FAQ/Pool/Review','归去来']
            ],
             // 打开Thought主页链接时生成下面这个菜单
            '/Thought/':[
                ['/Thought/','随笔首页'],
                {
                    title: '游记',
                    children: [
                        ['/Thought/Travels/beiPing','北平游记'],
                    ]
                },
                {
                    title: '年终回顾',
                    children: [
                    ['/Thought/YearReview/2018','2018年'],
                    ['/Thought/YearReview/2019','2019年']
                    ]
                },
            ],
            // 打开Store主页链接时生成下面这个菜单
            '/Store/': [
                ['','仓库首页'],
                {
                    title: '应用',
                    children: [
                        ['/Store/Apps/DownDoors', '下载门户'],
                        ['/Store/Apps/OwnTest', '博主测评']
                    ]
                },
                {
                    title: '电影',
                    children: [
                        ['/Store/Films/','收藏级电影']
                    ]
                },
                {
                    title: '动画',
                    children: [
                        ['/Store/Anime/','收藏级动画']
                    ]
                },
            ]
        }
    }
    
}
