### nodeJs核心模块-buffer缓冲器

<h3 style="color: #FB7477">Buffer缓冲器类常用api</h3>

js语言自身只有字符串类型的数据，没有二进制数据类型，但是在处理TCP流和文件流时，必须使用二进制数据，因此在nodeJs里面，定义了一个buffer类，该类是专门存放二进制数据的缓冲器，在nodeJs里面
buffer类是nodeJs的核心库，buffer类为nodeJs带来了一种存储原始数据的方法，可以让nodeJs处理二进制数据，原始数据存储在buffer类的实例中，一个buffer实例类似一个数组（此数组由0-255之间的整数组成的数组，这个数组显示的时候是以16进制显示的），它对应v8堆内存之外的物理内存[buffer缓冲器介绍](http://nodejs.cn/api/buffer.html)如何理解这句话：buffer创建后大小是固定的，我们来看代码
```js
let arr = [1, 3]
arr.length // 2
arr[2] = 4
arr.length // 3
```
以上数组的大小是可以改变的，buffer创建后这个数组长度是不可以改变的
<h4>创建buffer的3种方式</h4>

第一种创建方式：[Buffer.alloc(size[, fill[, encoding]])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_alloc_size_fill_encoding)
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
buf1[10] = 1 // 虽然buffer实例也是数组，但是其大小不能修改
// <Buffer 00 00 00 00 00 00 00 00 00 00>
const buf2 = Buffer.alloc(10, 2)
// <Buffer 02 02 02 02 02 02 02 02 02 02> 十六进制的方式来显示
const buf3 = Buffer.alloc(10, 100) // 100是十进制
// <Buffer 64 64 64 64 64 64 64 64 64 64>
const buf4 = Buffer.alloc(10, 257) // (257 / 256) 对256求余
// <Buffer 01 01 01 01 01 01 01 01 01 01>
const buf5 = Buffer.alloc(10, -1) // (-1 + 256) // 负数 + 256
// <Buffer ff ff ff ff ff ff ff ff ff ff>
const buf6 = Buffer.alloc(10, 'zongq') // 默认utf-8
// <Buffer 7a 6f 6e 67 71 7a 6f 6e 67 71> 
const buf7 = Buffer.alloc(10, 'zongq', 'base64')
// <Buffer ce 89 e0 ce 89 e0 ce 89 e0 ce>
```
[在线进制转换工具](https://tool.oschina.net/hexconvert/) 官方文档说了Buffer类的实例类似于由 0 到 255 之间的整数数组，对于大于255和小于0的值，buffer会强行进行转换<br>
[Buffer 与字符编码](http://nodejs.cn/api/buffer.html#buffer_buffers_and_character_encodings)

第二种创建方式：[Buffer.allocUnsafe(size)](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_allocunsafeslow_size)<br>
```js
Buffer.allocUnsafe(size)
```
eg:
```js
const buf1 = Buffer.alloc(10)
buf1[10] = 1 // 虽然buffer实例也是数组，但是其大小不能修改
// <Buffer 00 00 00 00 00 00 00 00 00 00>
const buf8 = Buffer.allocUnsafe(10)
// <Buffer 65 72 66 65 42 75 66 66 70 05> 来自创建过的buffer实例的旧数据
```
通过buffer.alloc创建的buffer,默认填充值为0，buffer.allocUnsafe这种方式创建的buffer，它的内容是未知的，可能导致创建好的buffer包含敏感数据，文档里是这样说的：
```js
// 创建一个长度为 10、且未初始化的 Buffer
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，这些旧数据来至于其它已经创建的buffer
// 因此需要使用 fill() 或 write() 重写
const buf1 = Buffer.alloc(10, 'hello-zongqiang')
const buf2 = Buffer.allocUnsafe(10).fill('hello-zongqiang')
console.log(buf1)
console.log(buf2)
buf2.write('hello-zongqiang') // 这种方式只能写入字符串
```
第三种创建方式：[Buffer.from(array)](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_from_array)<br>
```js
Buffer.from(array)
```
eg:
```js
const buf9 = Buffer.from([1, 2, 3])
// <Buffer 01 02 03>
const buf10 = Buffer.from('zongq')
// <Buffer 7a 6f 6e 67 71>
const buf11 = Buffer.from('zongq', 'base64')
// <Buffer ce 89 e0>
```

<h4>buffer类上常用的属性和方法</h4>

- [Buffer.byteLength(string[, encoding])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_bytelength_string_encoding) 返回字符串的字节长度<br>
eg:
```js
let byteLength1 = Buffer.byteLength('zongq')
// 5
let byteLength2 = Buffer.byteLength('中文') // 一个中文字符3个字节
// 6
Buffer.byteLength('zongqiang', 'base64')
// 6
Buffer.byteLength('zongqiang', 'utf8')
// 9
```
- [Buffer.isBuffer(obj)](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_isbuffer_obj) 判断是否是buffer实例<br>
eg:
```js
let isBuffer1 = Buffer.isBuffer({})
// false
let isBuffer2 = Buffer.isBuffer(Buffer.from('zongq'))
// true
```
- [Buffer.concat(list[, totalLength])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_concat_list_totallength) 合并buffer<br>
eg:
```js
let buf12 = Buffer.from('hello')
console.log(buf12)
// <Buffer 68 65 6c 6c 6f>
console.log(buf12.length)
// 5
let buf13 = Buffer.from('zongqiang')
console.log(buf13)
// <Buffer 7a 6f 6e 67 71 69 61 6e 67>
console.log(buf13.length)
// 9
let concat1 = Buffer.concat([buf12, buf13])

let concat2 = Buffer.concat([buf12, buf13], buf12.length + buf13.length)

console.log(concat1)
// <Buffer 68 65 6c 6c 6f 7a 6f 6e 67 71 69 61 6e 67>
console.log(concat2)
// <Buffer 68 65 6c 6c 6f 7a 6f 6e 67 71 69 61 6e 67>
console.log(concat2.length)
// 14
```
- [buf.write(string[, offset[, length]][, encoding])](http://nodejs.cn/api/buffer.html#buffer_buf_write_string_offset_length_encoding) 将字符串写入buffer，返回值是写入的字节数<br>
eg:
```js
const buf1 = Buffer.allocUnsafe(20) // 利用这种方式创建的buffer实例，值是不确定的，利用write方法可以修复这种问题


console.log(buf1)
// <Buffer 00 00 00 00 00 00 00 00 00 02 0c 51 61 b2 33 6a 53 08 00 00>

const buf_write1 = buf1.write('zongqiang')

console.log(buf_write1)
// 9 返回值是写入字节的长度
console.log(Buffer.byteLength('zongqiang'))
// 9
console.log(buf1) // buffer重写之后的值
// <Buffer 7a 6f 6e 67 71 69 61 6e 67 02 0c 51 61 b2 33 6a 53 08 00 00>

const buf_write2 = buf1.write('zongqiang', 5, 3)

console.log(buf_write2)
// 3
console.log(buf1)
// <Buffer 7a 6f 6e 67 71 7a 6f 6e 67 00 00 00 00 00 00 00 96 29 0f 0b>
```
经过write重写，buffer的默认值发生了改变,`buf1.write('zongqiang', 5, 3, encoding)`offset(5)指定开始写入的索引，从0开始，length(3)指定要写入的字节数,encoding要写入的字符串的字符编码<br>
没有指定offset和length: <Buffer 7a 6f 6e 67 71 <strong>69 61 6e</strong> 67 02 0c 51 61 b2 33 6a 53 08 00 00><br>
指定offset和length: <Buffer 7a 6f 6e 67 71 <strong>7a 6f 6e</strong> 67 00 00 00 00 00 00 00 96 29 0f 0b><br>

- [buf.fill(value[, offset[, end]][, encoding])](http://nodejs.cn/api/buffer.html#buffer_buf_fill_value_offset_end_encoding) 填充buffer 返回值是填充后的buffer

和write的区别，使用write的时候，我们首先是创建了一个长度为20的buffer，然后用write重写，参照例子，你会发现，zongqiang这个字符串的字节长度为9，重写buffer的时候，只修改了前面9个buffer的内容，后面长度的内容是不变的，而fill则会全部重写buffer里面的内容<br>
eg:
```js
console.log(buf1)
// <Buffer 00 00 00 00 00 00 00 00 00 02 0c 51 61 b2 33 6a 53 08 00 00>
console.log(buf1.fill('zongqiang'))
// <Buffer 7a 6f 6e 67 71 69 61 6e 67 7a 6f 6e 67 71 69 61 6e 67 7a 6f>
console.log(buf1.fill('zongqiang', 5, 10))
// <Buffer 00 00 00 00 00 7a 6f 6e 67 71 00 00 00 00 00 00 00 00 00 00>
console.log(buf1.length)
// 20
```
同样的offset和end，指定buffer哪个长度范围需要填充
- [buf.length](http://nodejs.cn/api/buffer.html#buffer_buf_length)  返回buffer中的字节数，也就是buffer的长度
和Buffer.byteLength是有区别的，它返回字符串的字节长度buf.length返回buffer的长度
- [buf.toString([encoding[, start[, end]]])](http://nodejs.cn/api/buffer.html#buffer_buf_tostring_encoding_start_end) 根据 encoding 指定的字符编码将 buf 解码成字符串

eg:<br>
```js
const buf2 = Buffer.from('zongq')

console.log(buf2)
// <Buffer 7a 6f 6e 67 71>
console.log(buf2.toString())
// zongq
console.log(buf2.toString('base64', 1, 3))
// b24=
```
- [buf.toJSON()](http://nodejs.cn/api/buffer.html#buffer_buf_tojson) 返回 buf 的 JSON 格式

eg:<br>
```js
const buf2 = Buffer.from('zongq')

console.log(buf2.toJSON())
// { type: 'Buffer', data: [ 122, 111, 110, 103, 113 ] }
```
- [buf.equals(otherBuffer)](http://nodejs.cn/api/buffer.html#buffer_buf_equals_otherbuffer) 对比两个buffer是否具有完全相同的字节

eg: 看官方文档