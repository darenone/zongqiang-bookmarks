# 21-MongoDB常用数据库操作之查询文档
MongoDB查询文档有多种方法
- 查询文档
```
Model.find(条件) // 返回数组，不传条件，返回所有
Model.findOne(条件) // 返回对象，不传，返回第一条
```
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
    city: String,
    sex: Number
})

// 3. 创建集合
const Model = mongoose.model('user', schema)

Model.find({name: '3'}).then(res => {
    console.log(res)
})
/**
 * 返回值
 * [ { _id: 5ed73c99b20fc2133b593315, name: '3', city: '广州', sex: 2 } ]
**/
Model.findOne().then(res => {
    console.log(res)
})
/**
 * 返回值
 * { _id: 5ed71780f819ae387ceb7038, name: 'zongqiang', sex: 2, __v: 0 }
**/
```
- 区间查询
```
{key: {$gt: value, $lt: value}} gt大于 lt小于 gte大于等于 lte小于等于
```
```js
Model.find({ age: { $gt: 15, $lt: 40 } }).then(res => {
    console.log(res)
})
// 大于等于和小于等于
Model.find({ age: { $gte: 15, $lte: 40 } }).then(res => {
    console.log(res)
})
```
- 模糊查询
```
{key: 正则表达式}
```
```js
Model.find({ city: /上/ }).then(res => {
    console.log(res)
})
```
- 选择要查询的字段
```
Model.find().select(arg) arg为要操作的字段 字段前加上-表示不查询该字段
```
```js
// 返回name city字段
Model.find().select('name city').then(res => {
    console.log(res)
})
// 返回name city字段 不显示_id字段
Model.find().select('name city -_id').then(res => {
    console.log(res)
})
```
- 排序
```
Model.find().sort(arg) arg为要操作的字段 字段前加上-表示不查询该字段
```
```js
Model.find().sort('age').then(res => {
    console.log(res)
})
// 倒序
Model.find().sort('-age').then(res => {
    console.log(res)
})
```
- 跳过多少条数据、限制查询数量（用来做分页的功能）
```
Model.find().skip(num).limit(num) skip跳过多少条数据，limit限制查询数量
```
```js
Model.find().skip(2).limit(3).then(res => {
    console.log(res)
})
```