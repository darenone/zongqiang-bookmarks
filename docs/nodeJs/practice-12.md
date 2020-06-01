### 利用nodejs做一个简易的爬虫
从一个网站上面爬取一些信息爬到本地，比如图片，html文档<br>

##### 1. 创建一个简易的爬虫demo
比如我们爬虫`https://www.baidu.com/`这个网站，并且将爬到的html文档放入到`html.txt`中
```js
const http = require('http')
const https = require('https') // 引入https模块
const fs = require('fs')

https.get('https://www.baidu.com/', (res) => {
    res.setEncoding('utf8');
    let html = ''
    res.on('data', chunk => {
        html += chunk
    })
    res.on('end', () => {
        fs.writeFile('./html.txt', html, err => {
            if (err) throw err
            console.log('写入成功')
        })
    })
})
```
##### 2. cheerio实现dom操作

在上个demo中，我们爬下来所有的HTMl结构，如果我们想只爬出特定的内容，就可以利用这个插件进行操作

> cheerio是jquery核心功能的一个快速灵活而又简洁的实现，主要是为了用在服务器端需要对DOM进行操作的地方

- 安装cheerio
先在你的文件夹下cmd执行`npm init -y`生成package.json文件，然后再执行下面的代码
```
npm install cheerio --save-dev
```
```js
const http = require('http')
const https = require('https') // 引入https模块
const fs = require('fs')
const cheerio = require('cheerio')

https.get('https://www.baidu.com/', (res) => {
    res.setEncoding('utf8');
    let html = ''
    res.on('data', chunk => {
        html += chunk
    })
    res.on('end', () => {
        const $ = cheerio.load(html) // 这样就可以进行dom操作了，完成了在服务端操作dom
        let text = $('title').text()
        fs.writeFile('./html.txt', text, err => {
            if (err) throw err
            console.log('写入成功')
        })
    })
})
```
以上，我们就只爬到了`title`这个标签里的内容,根据这个就可以拓展你的功能，对网页特定内容进行爬虫