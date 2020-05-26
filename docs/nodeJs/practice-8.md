### 深度讲解nodeJs事件触发器

在node里如何自定义一个事件？
```js
const EventEmitter = require('events')

// 使用es6定义一个类MyEmitter
// 并让这个类继承EventEmitter类
class MyEmitter extends EventEmitter{}


// new一个MyEmitter类实例
let myEmitter = new MyEmitter()

// 然后调用new出来的实例下的一个方法on，来注册一个事件hi
myEmitter.on('hi', () => {
    console.log('触发了事件')
})

// 触发自定义事件hi
myEmitter.emit('hi')
```
如何给自定义事件传参？
```js
myEmitter.on('hi', (a, b) => {
    console.log('触发了事件', a + b)
})

myEmitter.emit('hi', 1, 8)
```
如何在node里注册一个只触发一次的事件？
```js
myEmitter.once('hello', () => {
    console.log('触发了hello事件')
})
myEmitter.emit('hello')
myEmitter.emit('hello') // 这个不会再执行
```
当注册了多个事件，如何移除指定的事件？

```js
function fn1 (a, b) {
    console.log('触发了事件', a + b)
}
function fn2 () {
    console.log('触发了事件,不带参数')
}
myEmitter.on('hi', fn1)
myEmitter.on('hi', fn2)

myEmitter.removeListener('hi', fn1) // 移除事件1
myEmitter.emit('hi', 1, 8)
```
如何同时移除多个事件？
```js
myEmitter.removeAllListeners('hi')
myEmitter.emit('hi', 1, 8) // 已移除事件hi，所以这里不再触发
```