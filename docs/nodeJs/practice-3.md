### nodeJs核心模块

<h3 style="color: #FB7477">Buffer缓冲器类常用api</h3>

buffer用于处理二进制数据（二进制流，比如图片，word文件等），在V8堆外分配物理内存，buffer实例类似0-255之间的整数数组，显示的数据为十六进制，buffer创建后大小是固定的，无法修改，详细的buffer介绍可以参考官方文档
[buffer缓冲器介绍](http://nodejs.cn/api/buffer.html)如何理解这句话：buffer创建后大小是固定的，我们来看代码
```js
let arr = [1, 3]
arr.length // 2
arr[2] = 4
arr.length // 3
```
以上数组的大小是可以改变的，buffer创建后这个数组长度是不可以改变的
<h5>创建buffer</h5>

[Buffer.alloc(size[, fill[, encoding]])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_alloc_size_fill_encoding)
```js
Buffer.alloc(size[, fill[, encoding]]) // 创建buffer类
/**
 * @size <integer> 新Buffer的所需长度
 * @fill <string> | <Buffer> | <UintBArray> | <integer> 用于预填充新Buffer的值，默认值为0
 * @encoding <string> 如果fill是字符串，则这是它的字符编码，默认值'utf8'
 */
```
eg:
```js
const buf1 = Buffer.alloc(10)
buf1[10] = 1 // 不可以这样，大小没法修改

const buf2 = Buffer.alloc(10, 2)

const buf3 = Buffer.alloc(10, 100)

const buf4 = Buffer.alloc(10, 257) // (257 / 256) 对256求余

const buf5 = Buffer.alloc(10, -1) // (-1 + 256) // 负数 + 256

const buf6 = Buffer.alloc(10, 'zongq') // 默认utf-8

const buf7 = Buffer.alloc(10, 'zongq', 'base64')

console.log(buf1)
// <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf2)
// <Buffer 02 02 02 02 02 02 02 02 02 02> 十六进制的方式来显示
console.log(buf3)
// <Buffer 64 64 64 64 64 64 64 64 64 64>
console.log(buf4)
// <Buffer 01 01 01 01 01 01 01 01 01 01>
console.log(buf5)
// <Buffer ff ff ff ff ff ff ff ff ff ff>
console.log(buf6)
// <Buffer 7a 6f 6e 67 71 7a 6f 6e 67 71>
console.log(buf7)
// <Buffer ce 89 e0 ce 89 e0 ce 89 e0 ce>
```
[在线进制转换](https://tool.oschina.net/hexconvert/) 官方文档了说了Buffer类的实例类似于从 0 到 255 之间的整数数组，对于大于255和小于0的值，buffer会强行进行转换<br>
[Buffer 与字符编码](http://nodejs.cn/api/buffer.html#buffer_buffers_and_character_encodings)