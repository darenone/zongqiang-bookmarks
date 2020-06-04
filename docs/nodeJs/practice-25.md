### nodejs进程和线程讲解
- 进程概念
> 进程是正在运行程序的实例，我们启动一个服务，运行一个实例，就是开了一个服务进程，进程是线程的容器，进程包括文本区域（text region）数据区域（data region）和堆栈（stack region）
- 线程概念
> 线程是操作系统能够进行运算调度的最小单位，它被包含在进程之中，是进程中的实际运作单位，一个进程可以由一个或多个线程组成，每条线程并行执行不同的任务
- process进程模块的使用<br>
process模块是node集成的模块，不需要npm下载安装，直接使用即可[process](http://nodejs.cn/api/process.html)
##### [1. process.env](http://nodejs.cn/api/process.html#process_process_env) 返回包含用户环境的对象，可设置环境变量，例如process.env.NODE_ENV
新建一个文件夹，新建`index.js`，并在此文件夹下执行`npm init -y`，生成`package.json`文件，然后修改这个文件：
```json
{
  "name": "2-12",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev-mac": "export NODE_ENV=development && node index.js",
    "dev-win": "set NODE_ENV=development && node index.js",
    "pro-mac": "export NODE_ENV=production && node index.js",
    "pro-win": "set NODE_ENV=production && node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
`index.js`内容如下：
```js
// 设置一个环境变量，和js用let或var声明变量不同，node里声明变量需要加前缀process.env
// process.env.NODE_ENV = 'dev'

console.log(process.env.NODE_ENV)
```
我们在此文件夹下执行
```
npm run dev-win
```
会看到输出：development 代表开发环境
```
npm run pro-win
```
会看到输出：production 代表生产环境<br>
这样，我们可以在`index.js`这个文件里做一些逻辑处理，分别处理开发和生产环境的一些配置<br>
如果在mac和windows下执行相同的命令，需要安装一个插件`cross-env`
```
npm install cross-env --save-dev
```
然后修改`package.json`文件
```json
{
    "scripts": {
        "dev": "cross-env NODE_ENV=development node index.js",
        "pro": "cross-env NODE_ENV=production node index.js"
    },
}
```
然后直接执行即可
```
npm run dev
```
##### [2. process.pid](http://nodejs.cn/api/process.html#process_process_pid) 返回进程的pid
为了看下一我们创建的进程的pid，来先启动一个服务器
```js
const http = require('http')
const server = http.createServer()
server.listen(3000, () => {
    console.log('启动服务器')
})
console.log(process.pid)
// 12736
```
执行执行命令，启动服务器
```
npm run dev
```
就看到进程的pid为12736<br>
##### [3. process.platform](http://nodejs.cn/api/process.html#process_process_platform) 返回当前进程的操作系统平台
```js
const http = require('http')
const server = http.createServer()
server.listen(3000, () => {
    console.log('启动服务器')
})
console.log(process.pid) // 1200
console.log(process.platform) // win32
```
##### [4. process.title](http://nodejs.cn/api/process.html#process_process_title) 获取或指定进程名称
```js
const http = require('http')
const server = http.createServer()
server.listen(3000, () => {
    console.log('启动服务器')
})
console.log(process.pid)
console.log(process.platform)
process.title = 'node学习'
console.log(process.title)
```
##### [5. process.on('uncaughtException', cb)](http://nodejs.cn/api/process.html#process_event_uncaughtexception) 捕获异常信息
我们打印一个未声明的变量a
```js
console.log(a)
process.on('uncaughtException', (err) => {
    console.log('捕获异常' + err)
})
```
然后执行
```
npm run dev
```
会看到`console.log(a)`后面的代码并未执行，因为node和js一样，是单线程的，从上往下依次执行，执行到`console.log(a)`时，已经报错，就不会再往下执行，所以需要把捕获异常的监听函数写在程序的最上面
```js
process.on('uncaughtException', (err) => {
    console.log('捕获异常' + err)
})
console.log(a)
```
顺便提一下，如果在代码中使用try/catch来处理异常，那么上面的捕获异常的监听函数就不会再执行
##### [6. process.on('exit', cb)](http://nodejs.cn/api/process.html#process_event_exit) 监听进程退出
```js
process.on('uncaughtException', (err) => {
    console.log('捕获异常' + err)
})

let a = 0
console.log(a)

// 代码执行完毕会打印出退出码
process.on('exit', (code) => {
    console.log('退出码：' + code)
})
// 退出码：0
```
##### [7. process.cwd()](http://nodejs.cn/api/process.html#process_process_cwd) 返回当前进程的工作目录
```js
process.on('uncaughtException', (err) => {
    console.log('捕获异常' + err)
})

let a = 0
console.log(a)

console.log(process.cwd()) // E:\project\vue\NodeJs\2-12

process.on('exit', (code) => {
    console.log('退出码：' + code)
})
```
##### [8. process.uptime()](http://nodejs.cn/api/process.html#process_process_uptime) 返回当前进程的运行时长
```js
process.on('uncaughtException', (err) => {
    console.log('捕获异常' + err)
})

let a = 0
console.log(a)

console.log(process.cwd()) // E:\project\vue\NodeJs\2-12
console.log(process.uptime()) // 0.0745769s

process.on('exit', (code) => {
    console.log('退出码：' + code)
})
```