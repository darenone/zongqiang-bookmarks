## 小程序原理介绍
小程序启动以后，会创建一个<u>应用程序实例对象（APP Instance）</u>，它相当于一个工作台，所有应用之间的呈现，页面与页面之间的跳转，都必须基于这个工作台，它是基础，在这个基础之上，我们首先会进入首页page1，然后从page1跳转到page2,page2跳转到...

![微信小程序结构](/img/miniprogram/practice-1.1.png "微信小程序结构")

## 结构介绍

- app.json 全局配置[全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
- app.js 全局逻辑，调用App()函数[全局逻辑](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)
---
- page1.json 页面配置[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)
- page1.json 页面逻辑，调用Page()函数[页面逻辑](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)
- page1.wxml wxml(WeiXin Markup Language)[微信标签语言](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/)