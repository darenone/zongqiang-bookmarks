### 创建一个nodeJs引用及调试
nodeJs和JavaScript有什么区别？<br>
上文说了nodeJs是一个基于Chrome v8引擎的js运行平台，在nodeJs上可以运行用JavaScript编写的程序，如果没有nodeJS，用JavaScript编写的程序只能在浏览器环境中运行，有了nodeJs，JavaScript程序就就可以脱离浏览器，在node环境里运行<br>
新建以下代码：
```js
let name= 'zongq'

function sayHi () {
    console.log('Hi ' + name)
}

sayHi()
```
在编辑器内打开终端，执行`node index.js`此命令的含义就是在node里运行js，以上就完成了一个简单的在nodeJs里引用js并且调试js

<h3 style="color: #FB7477">理解commonjs模块规范</h3>

为什么要说commonjs模块规范，因为在nodeJs里面，每一个js文件都相当于一个模块，每个模块都有自己的作用域，它里面的变量，函数以及类都是私有的，对外不可见<br>
这样说有些生硬，上具体的例子来看一下吧，假如有一个`calculate.js`文件，定义了一个function
```js
function add (a, b) {
    console.log(a + b)
}
```
在另外一个`index.js`里来调用它，按照常规思维，如果是在浏览器环境里，我们需要在html文件里，同时引入这两个js文件，这样才能在`index.js`里面调用此function；但是在node环境里，这样的方式是不可行的，这个时候怎么办呢？更具commonjs规范，node将每一个js文件都定义成一个模块，利用require引入和module导出模块，这就是commonjs的核心，具体怎么用呢？上代码：<br>
在`calculate.js`文件里，写法如下：
```js
function add (a, b) {
    console.log(a + b)
}

module.exports = add // module导出模块
```
在`index.js`文件里，写法如下：
```js
let add = require('./calculate') // require引入模块

add(5, 5)
```
之后在node环境里运行`index.js`得到正确的结果，如果需要引入多个function，写法如下：
```js
function add (a, b) {
    console.log(a + b)
}

function reduce(a, b) {
    console.log(a - b)
}

module.exports = {
    add,
    reduce
}
```
`index.js`调用function如下：
```js
let cal = require('./calculate')

cal.add(5, 5)
cal.reduce(10, 5)
```
<b>es6引入模块的写法更简单一些，写法如下：</b>

```js
let { add, reduce } = require('./calculate')

add(5, 5)
reduce(10, 5)
```
<h4>引入外部模块</h4>

在本node项目里的`1-5`文件夹下执行
```
npm init -y
```
会在`1-5`文件下生成`package.json`，接下来就可以安装依赖了，我们尝试来安装[Lodash](https://www.lodashjs.com/),执行如下命令：
```
cnpm install loadsh --save
```
然后在`index.js`里引入`loadsh`
```js
let cal = require('./calculate')
let _ = require('loadsh')

cal.add(5, 5)

let arr1 = [1, 2]
let arr2 = _.concat(arr1, 3, 4, [5])
console.log(arr2) // [ 1, 2, 3, 4, 5 ]
```
接着执行`node index.js`就可以输出结果（如果你使用的编辑器是vscode，那么按住键盘`↑`按键）就可快速查找原来执行过的命令

<h5>global对象</h5>

在浏览器环境里定义全局变量如下：
```js
var a = 1
console.log(window.a)
```
但是在node里面，每一个js文件都是一个模块，模块有自己的作用域，想访问模块里的变量，就要采用require和module来引入导出模块，如果想定义全局变量，可以采用node提供的global对象，演示如下：
修改`calculate.js`文件
```js
function add (a, b) {
    console.log(a + b)
}

function reduce(a, b) {
    console.log(a - b)
}

var a = 1
global.a = 2

module.exports = {
    add,
    reduce
}
```
在`index.js`里打印结果
```js
let { add, reduce } = require('./calculate')
console.log(a) // 2
console.log(global.a) // 2
```
