# 9. 封装axios

axios并不是vue提供的api，而是一个独立的http库，可以发送get，post请求，进行请求拦截等，它就是对原生ajax的二次封装，这里我演示一下，在vue中如何使用axios

我的项目里没有预装axios，这里首先执行如下命令，安装一下
```
npm/cnpm install axios --save
```
axios是独立于vue的一个插件，除了vue中也可以用之外，在其它框架中也可以使用

## 备注
1. 代码示例已上传至GitHub代码库[vue-base-frame](https://github.com/darenone/vue-base-frame)，你可以下载下来启动项目，帮助你阅读本篇文章
2. 文章已上传至我的GitHub主页，如果想阅读系列文章，请访问[我的博客主页](https://darenone.github.io/zongqiang-bookmarks/)
3. 完整的利用nodeJs连接数据库并且与前端进行数据交互的完整代码可以阅读我另外一个项目[vue-base-server](https://github.com/darenone/vue-base-server)


