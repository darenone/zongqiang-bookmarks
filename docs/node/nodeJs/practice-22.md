# 22-MongoDB常用数据库操作之更新文档
- 更新单个文档
```
// 找到一个文档并更新，如果查询多个文档，则更新第一个匹配文档 返回值为该文档
Model.findOneAndUpdate(条件， 更新的值)
// 更新指定条件文档，如果查询多个文档，则更新第一个匹配文档
Model.updateOne(条件， 更新的值)
```
```js
Model.findOneAndUpdate({ name: '2'}, { name: '麓湖' }).then(res => {
    console.log(res)
})

Model.updateOne({ name: '麓湖'}, { city: '天府公园' }).then(res => {
    console.log(res)
})
```
这里需要配置mongoose
```js
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)
```
- 更新多个文档
```
Model.updateMany(条件， 更新的值)
```
```js
Model.updateMany({ name: 'zongqiang'}, { name: '宗强' }).then(res => {
    console.log(res)
})
```
