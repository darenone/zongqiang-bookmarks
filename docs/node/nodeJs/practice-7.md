# 7-基础模块path常用api

## 1. [path.basename(path[, ext])](http://nodejs.cn/api/path.html#path_path_basename_path_ext)

返回path的最后一部分
```js
const path = require('path')
console.log(path.basename('/nodejs/2-6/index.js'))
// index.js
```
第二个参数的用法
```js
console.log(path.basename('/nodejs/2-6/index.js', '.js'))
// index // 返回最后一部分并且去掉指定后缀
```

## 2. [path.dirname(path)](http://nodejs.cn/api/path.html#path_path_dirname_path)

返回path的目录名
```js
const path = require('path')
console.log(path.dirname('/nodejs/2-6/index.js'))
// /nodejs/2-6
```

## 3. [path.extname(path)](http://nodejs.cn/api/path.html#path_path_extname_path)

返回path的后缀名
```js
const path = require('path')
console.log(path.extname('index.js'))
// .js
```
也可以采用es6的写法，更简单一些
```js
const { basename, dirname, extname } = require('path')
console.log(extname('index.js'))
// .js
```

## 4. [path.join([...paths])](http://nodejs.cn/api/path.html#path_path_join_paths)

路径拼接
```js
const { basename, dirname, extname, join } = require('path')
console.log(join('nodejs', 'index.js'))

// nodejs\index.js
```
```js
console.log(join('/nodejs/////', '/index.js'))
// \nodejs\index.js
```

## 5. [path.normalize(path)](http://nodejs.cn/api/path.html#path_path_normalize_path)

规范化路径
```js
const { basename, dirname, extname, join } = require('path')
console.log(normalize('/nodejs///////index.js'))
// \nodejs\index.js
```
```js
console.log(normalize('/nodejs/test/../index.js')) // ../返回上一级
// \nodejs\index.js
```

## 6. [path.resolve([...paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths)

将路径解析为绝对路径

相比`__filename`，`resolve`在使用时，绝对路径会发生变化
```js
const { basename, dirname, extname, join, resolve } = require('path')
console.log(resolve('./index.js'))
// E:\project\vue\NodeJs\2-5\index.js
```

## 7. [path.parse(path)](http://nodejs.cn/api/path.html#path_path_parse_path)

返回一个对象，包含path的属性
```js
const { basename, dirname, extname, join, normalize, resolve, parse } = require('path')
let obj = parse('NodeJs/2-5/index.js')
console.log(obj)
```
obj内容：
```json
{
  root: '',
  dir: 'NodeJs/2-5',
  base: 'index.js',
  ext: '.js',
  name: 'index'
}
```

## 8. [path.format(pathObject)](http://nodejs.cn/api/path.html#path_path_format_pathobject)

从对象中返回路径字符串
```js
const { basename, dirname, extname, join, normalize, resolve, format, parse } = require('path')
let obj = parse('/NodeJs/2-5/index.js')
console.log(obj)
console.log(format(obj))
// /NodeJs/2-5\index.js
```

## 9. [path.sep](http://nodejs.cn/api/path.html#path_path_sep)

返回系统特定的路径片段分隔符
## 10. [path.win32](http://nodejs.cn/api/path.html#path_path_win32)

可以实现访问windows的path方法
```js
const { basename, dirname, extname, join, normalize, resolve, format, parse, sep, win32 } = require('path')
console.log(sep)
// \
console.log(win32.sep)
// \
```

## 11. _filename

表示当前正在执行的脚本的文件名

## 12. _dirname

表示当前执行脚本所在的目录

这两个是全局对象global下的属性
```js
console.log(__filename)
// E:\project\vue\NodeJs\2-5\index.js
console.log(__dirname)
// E:\project\vue\NodeJs\2-5
```
