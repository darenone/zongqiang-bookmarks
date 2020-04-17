### 创建一个nodeJs引用及调试
nodeJs和JavaScript有什么区别？<br>
上节课说了nodeJs是一个平台，在nodeJs上可以运行用JavaScript编写的程序，一个基本常识就是用JavaScript编写的程序只能在浏览器环境中运行，有了nodeJs，JavaScript程序就就可以脱离浏览器，在node环境里运行<br>
新建代码库[NodeJs](https://github.com/darenone/NodeJs)，编辑器使用的是[visual studio code](https://code.visualstudio.com/)新增如下代码：
```js
let name= 'zongq'

function sayHi () {
    console.log('Hi ' + name)
}

sayHi()
```
在编辑器内打开终端,执行`node index.js`此命令的含义就是在node里运行js程序，以上就完成了一个简单的在nodeJs里引用js并且调试js

<h3 style="color: #FB7477">理解commonjs模块规范</h3>

为什么要说commonjs模块规范，因为在nodeJs里面，每一个文件都相当于一个模块，每个模块都有自己的作用域，它里面的变量，函数以及类都是私有的，对外不可见，这样说有些生硬，上具体的例子来看一下吧
假如有一个`calculate.js`文件,定义了一个function
```js
function add (a, b) {
    console.log(a + b)
}
```
在另外一个`index.js`里来调用它，按照常规思维，如果是在浏览器环境里，我们需要在html文件里，同时引入这两个js文件，这样才能在`index.js`里面调用此function，但是在node环境里，这样的方式是不可行的，这个时候怎么办？node采用了require和module引入，导出模块，这也是commonjs的核心,具体怎么用呢？上代码：
在`calculate.js`文件里，写法如下：
```js
function add (a, b) {
    console.log(a + b)
}

module.exports = add
```
在`index.js`文件里，写法如下：
```js
let add = require('./calculate')

add(5, 5)
```
之后在node环境里运行`index.js`得到正确的结果,如果需要引入多个function，写法如下：
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
```


