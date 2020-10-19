# 8. 封装axios

1. 代码示例已上传至GitHub代码库[vue-base-frame](https://github.com/darenone/vue-base-frame)，你可以下载下来启动项目，帮助你阅读本篇文章

2. 文章已上传至我的GitHub主页，如果想阅读系列文章，请访问[我的博客主页](https://darenone.github.io/zongqiang-bookmarks/)

axios并不是vue提供的api，而是一个独立的http库，可以发送get，post请求，进行请求拦截等，它就是对原生ajax的二次封装，这里我来演示一下，在vue中如何使用ajax

我创建vue模板的时候并没有预暗转axios，这里首先执行：
```
npm/cnpm install axios --save
```


<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>