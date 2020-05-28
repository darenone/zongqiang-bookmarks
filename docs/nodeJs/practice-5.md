### nodeJs文件系统fs模块常用api

#### 引入文件系统模块
```js
const fs = require('fs')
```

#### 文件系统类下的属性和方法

##### [1. fs.readFile(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback)读取文件

```js
const fs = require('fs')
fs.readFile('./hello.txt', (err, data) => {
    if (err) throw err;
    console.log(data)
    // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
})
```
通过文件系统fs读取的文件返回的数据是二进制格式，我们可以通过buf实例的`toString`方法，将buf解码成字符串
```js
const fs = require('fs')
fs.readFile('./hello.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString())
    // hello world
})
```
如果不这样写，也可以通过`[, options]`它接受一个字符串或则对象作为参数
```
path <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符。
options <Object> | <string>

encoding <string> | <null> 默认值: null。
flag <string> 参见文件系统 flag 的支持。默认值: 'r'。
callback <Function>

err <Error>
data <string> | <Buffer>
```
```js
fs.readFile('./hello.txt', { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    console.log(data)
    // hello world
})
```
```js
const fs = require('fs')
fs.readFile('./hello.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data)
    // hello world
})
```

##### [2. fs.writeFile(file, data[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback)写入文件，如果文件不存在就新建这个文件

```js
fs.writeFile('./hello.txt', 'this is a test',  err => {
    if (err) throw err;
    console.log('写入成功')
})
```
经过上述操作，我们就可以成功将`this is a test`这句话写入`hello.txt`文件里

##### [3. fs.writeFileSync(file, data[, options])](http://nodejs.cn/api/fs.html#fs_fs_writefilesync_file_data_options)异步操作写入文件

```js
fs.writeFileSync('./hello.txt', 'this is a test!')
```

##### [4. fs.appendFile(path, data[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_appendfile_path_data_options_callback) 追加数据到文件

```js
const buf = Buffer.alloc(10, 'hello world')
fs.appendFile('./hello.txt', buf, err => {
    if (err) throw err;
    console.log('追加成功')
})
```

##### [5. fs.stat(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_stat_path_options_callback) 获取文件信息，判断是文件还是文件夹

```js
fs.stat('./hello.txt', (err, stats) => {
    if (err) throw err;
    console.log(stats)
})
```
根据返回的`stats`这个对象，它有很多属性和方法，我们可以利用这些方法做一些操作
```js
fs.stat('./hello.txt', (err, stats) => {
    if (err) {
        console.log('文件不存在')
        return;
    };
    console.log(stats)
    console.log(stats.isFile()) // true 是否是文件
    console.log(stats.isDirectory()) // false 是否是文件夹
})
```

##### [6. fs.rename(oldPath, newPath, callback)](http://nodejs.cn/api/fs.html#fs_fs_rename_oldpath_newpath_callback) 重命名文件

```js
fs.rename('./hello.txt', './test.txt', err => {
    if (err) throw err;
    console.log('重命名成功')
})
```

##### [7. fs.unlink(path, callback)](http://nodejs.cn/api/fs.html#fs_fs_unlink_path_callback) 删除文件

```js
fs.unlink('./test.txt', err => {
    if (err) throw err;
    console.log('删除成功')
})
```

##### [8. fs.mkdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_mkdir_path_options_callback) 创建文件夹

```js
fs.mkdir('./test', err => {
    if (err) throw err;
    console.log('创建文件夹成功')
})
```
这样我们就可以创建`test`文件夹，同时我们也可以递归创建文件夹
```js
fs.mkdir('./test/test1/test1-1', {
    recursive: true
}, err => {
    if (err) throw err;
    console.log('创建文件夹成功')
})
```

##### [9. fs.readdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_readdir_path_options_callback) 读取文件夹

```js
fs.readdir('./test', (err, files) => {
    if (err) throw err;
    console.log(files)
})
```
我们可以在`options`里设置`withFileTypes`来返回文件的类型
```js
fs.readdir('./test', {
    withFileTypes: true
}, (err, files) => {
    if (err) throw err;
    console.log(files)
})
```

##### [10. fs.rmdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_rmdir_path_options_callback) 删除文件夹

```js
fs.rmdir('./test/test1/test1-1', err => {
    if (err) throw err;
    console.log('删除文件夹成功') // 会把test1-1文件夹删除
})
```
同时也可以在`options`里设置`recursive`来递归删除文件夹
```js
fs.rmdir('./test', {
    recursive: true
}, err => {
    if (err) throw err;
    console.log('删除文件夹成功')
})
```

##### [11. fs.watch(filename[, options][, listener])](http://nodejs.cn/api/fs.html#fs_fs_watch_filename_options_listener) 监听文件的变化

```js
fs.watch('./', (eventType, filename) => {
    console.log(eventType, filename)
})
```
同时也可以在`options`里设置`recursive`来监视子目录的变化
```js
fs.watch('./', {
    recursive: true
}, (eventType, filename) => {
    console.log(eventType, filename)
})
```
利用fs文件系统提供的watch这个方法，输出的时候，改动一下，会同时打印多次，效果不是特别理想，所以我们可以利用`chokidar`这个插件来监听文件的变化<br>
[chokidar](https://www.npmjs.com/package/chokidar)
```
npm/cnpm install chokidar --save-dev
```
使用代码如下：
```js
const chokidar = require('chokidar')
chokidar.watch('./').on('all', (event, files) => {
    console.log(event, files);
})
```
`chokidar`还有一些配置，介绍如下：
```js
const chokidar = require('chokidar')
chokidar.watch('./', {
    ignored: './node_modules', // 不监听node_modules
}).on('all', (event, files) => {
    console.log(event, files);
})
```

