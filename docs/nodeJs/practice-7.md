### 基础模块path常用api

##### [1. path.basename(path[, ext])](http://nodejs.cn/api/path.html#path_path_basename_path_ext) 返回path的最后一部分
```js
const path = require('path')
console.log(path.basename('/nodejs/2-6/index.js'))
// index.js
```
第二个参数的用法
```js
console.log(path.basename('/nodejs/2-6/index.js', '.js'))
// index // 过滤掉后缀名
```

##### [2. path.dirname(path)](http://nodejs.cn/api/path.html#path_path_dirname_path) 返回path的目录名
```js
const path = require('path')
console.log(path.dirname('/nodejs/2-6/index.js'))
// /nodejs/2-6
```

##### [3. path.extname(path)](http://nodejs.cn/api/path.html#path_path_extname_path) 返回path的拓展名
```js
const path = require('path')
console.log(path.extname('index.js'))
// .js
```

##### [4. path.join([...paths])](http://nodejs.cn/api/path.html#path_path_join_paths) 路径拼接
```js

```

##### [5. path.normalize(path)](http://nodejs.cn/api/path.html#path_path_normalize_path) 规范化路径

##### [6. path.resolve([...paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths) 将路径解析为绝对路径

##### [7. path.format(pathObject)](http://nodejs.cn/api/path.html#path_path_format_pathobject) 从对象中返回路径字符串

##### [8. path.parse(path)](http://nodejs.cn/api/path.html#path_path_parse_path) 返回一个对象，包含path的属性

##### [9. path.sep]http://nodejs.cn/api/path.html#path_path_sep) 返回系统特定的路径片段分隔符

##### [10. path.win32](http://nodejs.cn/api/path.html#path_path_win32) 可以实现访问windows的path方法

##### [11. _filename](http://nodejs.cn/api/path.html#path_path_join_paths) 表示当前正在执行的脚本的文件名

##### [12. _dirname](http://nodejs.cn/api/path.html#path_path_join_paths) 表示当前执行脚本所在的目录
