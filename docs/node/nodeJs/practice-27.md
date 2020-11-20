# 27-深度讲解cluster模块
## 1. cluster是集群的意思，单个nodeJs实例运行在单个线程中，为了充分利用多核系统，有时需要启用一组NodeJs进程去处理负载任务
```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length; // 获取电脑cpu的个数

if (cluster.isMaster) { // 判断是否是主进程
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(3000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```
## 2. 讲解进程间通信方式
- 子进程通过send方法将结果发送给主进程，主进程通过message监听到信息后处理并退出
```js
// index.js
const http = require('http')

const { spawn, exec, execFile, fork } = require('child_process')

const server = http.createServer((req, res) => {
    if (req.url == '/compute') {
        const work = fork('work.js') // 相当于node work.js
        work.send('发送给子进程的信息')
        work.on('message', data => {
            console.log('父进程接收子进程的消息' + data)
        })
    } else {
        res.end('ok')
    }
})

server.listen(3000, () => {
    console.log('启动服务器')
})
```
子进程`work.js`内容：
```js
// work.js
process.title = '宗强'
console.log(process.pid)

let sum = 0;
for (let i = 0; i < 1e10; i++) {
    sum += i
}

console.log(sum)

process.on('message', (data) => {
    console.log('接收父进程的消息' + data)
})

process.send(sum)
```
然后执行`npm run dev`启动服务器，浏览器打开：`http://localhost:3000/compute`可以看到执行结果：
```
17972
49999999990067860000
父进程接收子进程的消息49999999990067860000
接收父进程的消息发送给子进程的信息
```
