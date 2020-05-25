### nodeJs文件流讲解

简介：讲解如何创建读取文件流和创建写入文件流
在读取数据的时候，如果数据量比较大，利用fs读取数据的时候，等到把数据完全读取完毕，我们才能看这个数据，如果我们想先预览一部分数据，比如，看视频，不是一下子把整段视频加载完成，而是一段一段传递<br>

##### [1. 流的类型](http://nodejs.cn/api/stream.html#stream_types_of_streams)

- Writable 可写入数据流（常用）
- Readable 可读取数据流 （常用）
- Duplex 可读又可写数据流
- Transform 在读过程中可以修改或转换的数据流

##### [2. fs.createReadStream(path[, options])](http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options) 创建读取文件流

```js
const fs = require('fs')

let rs = fs.createReadStream('./index.js')
// 读取数据时的回调函数
rs.on('data', chunk => {
    console.log(chunk)
    // <Buffer 63 6f 6e 73 74 20 66 73 20 3d 20 72 65 71 75 69 72 65 28 27 66 73 27 29 0d 0a 0d 0a 6c 65 74 20 72 73 20 3d 20 66 73 2e 63 72 
    // 65 61 74 65 52 65 61 64 ... 209 more bytes>
})
// 读取数据完毕后的回调函数
rs.on('end', () => {
    console.log('读取完成')
})
```
`chunk`返回的是buffer对象，它代表读取的是二进制数据，这里，我们把返回的buffer对象，解码成字符来看看是什么
```js
rs.on('data', chunk => {
    console.log(chunk.toString())
    // 返回js代码
})
```
在`options`里设置`highWaterMark`来分段读取数据
```js
const fs = require('fs')

let rs = fs.createReadStream('./index.js', {
    highWaterMark: 100, // 每次读取100kb的数据流
})
// 读取数据时的回调函数
let count = 1;
rs.on('data', chunk => {
    console.log(chunk.toString())
    console.log(count++)
})
// 读取数据完毕后的回调函数
rs.on('end', () => {
    console.log('读取完成')
})
```

##### [3. fs.createWriteStream(path[, options])](http://nodejs.cn/api/fs.html#fs_fs_createwritestream_path_options) 创建写入文件流

```js
let ws = fs.createWriteStream('./a.txt')

let num = 1;
let timer = setInterval(() => {
    if (num < 10) {
        ws.write(num + '')
        num++
    } else {
        ws.end()
        clearInterval(timer)
    }
}, 200)

ws.on('finish', () => {
    console.log('写入完成')
})
```

##### [4. pipe](http://nodejs.cn/api/stream.html#stream_event_pipe) 管道流

通俗来讲，就是从a文件读取的文件流写入b文件，就可以利用管道流来实现
```js
let rs = fs.createReadStream('./index.js');
let ws = fs.createWriteStream('./a.txt');

rs.pipe(ws)
```
这样就把`index.js`里的代码写入到了`a.txt`里面