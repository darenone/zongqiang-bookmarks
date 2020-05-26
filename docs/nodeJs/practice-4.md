### nodeJs核心模块-buffer缓冲器2

<h3 style="color: #FB7477">Buffer缓冲器类常用api</h3>

- [buf.indexOf(value[, byteOffset][, encoding])](http://nodejs.cn/api/buffer.html#buffer_buf_indexof_value_byteoffset_encoding) 返回: buffer中首次出现 value 的索引，如果 buf 没包含 value 则返回 -1<br>
eg: 看官方文档例子<br>

- [buf.lastIndexOf(value[, byteOffset][, encoding])](http://nodejs.cn/api/buffer.html#buffer_buf_lastindexof_value_byteoffset_encoding)
eg: 看官方文档例子<br>

- [buf.slice([start[, end]])](http://nodejs.cn/api/buffer.html#buffer_buf_slice_start_end)
eg: 看官方文档例子<br>

- [buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])](http://nodejs.cn/api/buffer.html#buffer_buf_copy_target_targetstart_sourcestart_sourceend)
eg: 
```js
const buf2 = Buffer.from([0x74, 0xc3, 0xa9, 0x73, 0x74])
console.log(buf2)
// <Buffer 74 c3 a9 73 74>
const buf3 = Buffer.from('guojinge')
console.log(buf3)
// <Buffer 67 75 6f 6a 69 6e 67 65>
console.log(buf2.copy(buf3)) // 将buf2拷贝给buf3
// 5
console.log(buf3)
// <Buffer 74 c3 a9 73 74 6e 67 65>
```