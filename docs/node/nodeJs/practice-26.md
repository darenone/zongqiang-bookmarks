# 26-多进程之child_process模块
这节课主要讲一下如何使用child_process创建子进程
- 创建子进程的4个方式
## 1. [child_process.spawn()](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options) 启动一个子进程执行命令
新建`work.js`
```js
console.log('pid1', process.pid) // pid1 16592

let sum = 0;
for (let i = 0; i < 1e10; i++) {
    sum += i
}

console.log('sum:', sum) // sum: 49999999990067860000
console.log('pid2:', process.pid) // pid2: 16592
```
```js
// index.js
const http = require('http')

const { spawn, exec, execFile, fork } = require('child_process')

const server = http.createServer((req, res) => {
    if (req.url == '/compute') {
        const work = spawn('node', ['work.js'])
        work.stdout.on('data', data => {
            console.log('stdout:', data.toString())
        })
    } else {
        res.end('ok')
    }
})

server.listen(3000, () => {
    console.log('启动服务器')
})

console.log('time:', process.uptime()) // time: 0.0721776
```
执行`npm run dev`启动服务器，浏览器输入：`http://localhost:3000/compute`查看执行结果

## 2. [child_process.exec()](http://nodejs.cn/api/child_process.html#child_process_child_process_exec_command_options_callback) 启动一个子进程执行命令，与spawn不同地方是有一个回调函数获知子进程状况
```js
const http = require('http')

const { spawn, exec, execFile, fork } = require('child_process')

const server = http.createServer((req, res) => {
    if (req.url == '/compute') {
        exec('node work.js', (err, stdout, stderr) => {
            if (err) throw err
            console.log(stdout)
        })
    } else {
        res.end('ok')
    }
})

server.listen(3000, () => {
    console.log('启动服务器')
})
```
执行`npm run dev`启动服务器，浏览器输入：`http://localhost:3000/compute`查看执行结果

## 3. [child_process.execFile](http://nodejs.cn/api/child_process.html#child_process_child_process_execfile_file_args_options_callback) 启动一个子进程来执行可执行文件
```js
const http = require('http')

const { spawn, exec, execFile, fork } = require('child_process')

const server = http.createServer((req, res) => {
    if (req.url == '/compute') {
        execFile('node', ['work.js'], (err, stdout, stderr) => {
            if (err) throw err
            console.log(stdout)
            console.log(stderr)
        })
    } else {
        res.end('ok')
    }
})

server.listen(3000, () => {
    console.log('启动服务器')
})
```
执行`npm run dev`启动服务器，浏览器输入：`http://localhost:3000/compute`查看执行结果

## 4. [child_process.fork](http://nodejs.cn/api/child_process.html#child_process_child_process_fork_modulepath_args_options) 衍生一个新的Node.js进程，并调用一个指定的模块
```js
const http = require('http')

const { spawn, exec, execFile, fork } = require('child_process')

const server = http.createServer((req, res) => {
    if (req.url == '/compute') {
        fork('work.js')
    } else {
        res.end('ok')
    }
})

server.listen(3000, () => {
    console.log('启动服务器')
})
```
执行`npm run dev`启动服务器，浏览器输入：`http://localhost:3000/compute`查看执行结果