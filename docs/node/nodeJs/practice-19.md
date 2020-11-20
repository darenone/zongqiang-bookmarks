# 19-MongoDB的介绍及安装

在上几节我们讲了MySQL数据库，它是一种关系型数据库，而MongoDB使用c++编写的非关系型数据库

## 1. mysql和MongoDB区别
<table style="text-align: center;">
    <tr>
        <th></th>
        <th>MongoDB</th>
        <th>MySQL</th>
    </tr>
    <tr>
        <td>数据库模型</td>
        <td>非关系型</td>
        <td>关系型</td>
    </tr>
    <tr>
        <td>表</td>
        <td>collection集合</td>
        <td>table二维表</td>
    </tr>
    <tr>
        <td>表的行数据</td>
        <td>document文档</td>
        <td>row记录</td>
    </tr>
    <tr>
        <td>数据结构</td>
        <td>虚拟内存+持久化</td>
        <td>不同引擎不同存储方式</td>
    </tr>
    <tr>
        <td>查询语句</td>
        <td>MongoDB查询方式（类似于js函数）</td>
        <td>sql语句</td>
    </tr>
    <tr>
        <td>数据处理</td>
        <td>将热数据存储在物理内存中，从而达到快速读写</td>
        <td>不同引擎有自己的特点</td>
    </tr>
    <tr>
        <td>事务性</td>
        <td>不支持</td>
        <td>支持事务</td>
    </tr>
    <tr>
        <td>占用空间</td>
        <td>占用空间大</td>
        <td>占用空间小</td>
    </tr>
    <tr>
        <td>join操作</td>
        <td>没有join</td>
        <td>支持join</td>
    </tr>
</table>

## 2. MongoDB安装

- 数据库软件安装 https://www.mongodb.com/download-center/community
- 可视化软件安装 https://www.mongodb.com/download-center/compass

## 3. 启动MongoDB命令

以下命令，需要以管理员身份运行命令行工具才可以执行
```
启动MongoDB
net start mongodb
关闭MongoDB
net stop mongodb
```
## 4. 启动MongoDB Compass 可视化管理工具

保证MongoDB启动后，直接打开这个管理工具即可

## 5. 使用mongoose连接MongoDB数据库

同样的，如果想在node环境下，操作MongoDB数据库，需要安装一个mongoose包
```
npm/cnpm install mongoose --save-dev
```
连接我们的MongoDB数据库,数据库名字为local
```js
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/local', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('连接数据库成功')
}).catch(err => {
    console.log('连接数据库失败')
})
```
然后执行node语句：`node index.js`,就可以成功安装上MongoDB数据库

因为`mongoose.connect`返回的是一个promise，所以我们可以使用async/await这种写法
## 6. MongoDB常用数据库操作之创建集合、文档

集合类似于MySQL里面的表

- MongoDB不需要显示创建数据库，如果数据库不存在，它会自动创建

- 创建集合
```js
const mongoose = require('mongoose')

// 1. 连接数据库
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('连接数据库成功')
}).catch(err => {
    console.log('连接数据库失败')
})

// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: String,
    ciyt: String,
    sex: Number
})

// 3. 创建集合
const Model = mongoose.model('user', schema)

// 4. 创建文档（集合中的值）
const doc = new Model({
    name: 'zongqiang',
    city: '成都',
    sex: 2
})

// 5. 将文档插入集合中（将值放入集合中）
doc.save()
```
然后执行node语句`node index.js`，之后打开`MongoDB Compass`可以看到数据库test中多了一个集合users

这里还有第二种创建文档的方法，一般在实际开发中也是通过这种方式创建文档：
```js
const mongoose = require('mongoose')

// 1. 连接数据库
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('连接数据库成功')
}).catch(err => {
    console.log('连接数据库失败')
})

// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: String,
    ciyt: String,
    sex: Number
})

// 3. 创建集合
const Model = mongoose.model('user', schema)

// 4. 创建文档（集合中的值）
Model.create({
    name: '小郭',
    city: '成都',
    sex: 1
}, (err, doc) => {
    if (err) throw err
    console.log(doc)
})
```