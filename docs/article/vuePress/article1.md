## 如何利用vuePress搭建自己的博客

我现在自己的博客就是根据vuePress搭建起来的,vuePress它是什么呢？通俗说就是静态网页生成器，它可以将我们写的markdown文件转化成HTML页面，既然名字叫vuePress就证明它是以vue驱动的，而且生成的静态网页就是我们做vue项目打包后的静态网页，都是由vue，vueRouter，webpack驱动的单页应用，本文将一步步带你从无到有创建你的个人博客，并且发布到GitHub Pages上面。

----

（以下所有的操作都是基于windows平台下cmd命令行操作的，如果你的是mac电脑，请搜索对应的操作即可）
### 全局安装vuePress

在合适位置新建`vuePress`项目文件,我的项目位置是：`E:\project\vue\vuePress`，cmd进入`vuePress`文件，运行如下命令：
```cmd
npm install -g vuepress // 全局安装vuepress
npm init -y // 初始化项目
vuePress> mkdir docs // 在vuePress项目里新建docs文件夹，它将是项目的根目录，来放置markdown文件夹和.vuepress文件夹，这也是vuepress去解析的文件夹
```
除了生成的docs文件夹，项目里还多了一个package.json，我们需要做相应的设置：
```json
{
  "name": "vuePress",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "docs:dev": "vuepress dev docs", // 运行本地命令，启动localhost即可访问网站
    "docs:build": "vuepress build docs" // 运行发布命令，生成静态文件，并将生成的静态文件放到docs/.vuepress/dist目录中
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
备注<sup>Tip</sup>：关于生成的静态文件存放目录，可以通过docs/.vuepress/config.js中的dest字段来修改默认存放目录，但是一般不做修改，不然我们后面打包发布到GitHub Pages时会有麻烦，这里我们不动就行了

```cmd
vuePress> cd docs
vuePress\docs> mkdir .vuepress // 在docs目录下创建.vuepress目录，主要用来存放一些静态资源，主题配置，自定义组件等
vuePress\docs> cd .vuepress
vuePress\docs\.vuepress> cd > config.js // 在.vuepress目录里创建config.js文件，它是vuepress的配置文件，它导出一个JavaScript对象
vuePress\docs\.vuepress> mkdir public // 在 .vuepress目录下创建public目录，它主要用来存放静态资源文件，例如favicon和pwa的图标
vuePress\docs> cd > README.md // 在docs目录下，新建README.md 可理解为首页页面
```