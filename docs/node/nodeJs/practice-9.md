# 9-node核心模块util常用工具

## 1. [util.callbackify(original)](http://nodejs.cn/api/util.html#util_util_callbackify_original)

功能：将async异步函数（或者一个返回值为Promise的函数）转换成遵循异常优先的回调风格的函数
```js
const util = require('util')

// es6异步函数的写法
async function hello() {
    return 'hello world'
}

let helloCb = util.callbackify(hello)

helloCb((err, res) => {
    if (err) throw err;
    console.log(res)
})
```
## 2. [util.promisify(original)](http://nodejs.cn/api/util.html#util_util_promisify_original)

功能：转换成promise版本的函数
```js
const util = require('util')
const fs = require('fs')

let stat = util.promisify(fs.stat)

stat('./index.js').then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
```
另外一种写法：
```js
const util = require('util')
const fs = require('fs')

let stat = util.promisify(fs.stat)

async function statFn () {
    try {
        let stats = await stat('./index.js')
        console.log(stats)
    } catch (e) {
        console.log(e)
    }
}
statFn()
```
关于更多util常用工具的使用可以参考官方文档
