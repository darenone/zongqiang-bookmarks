# 23-MongoDB常用数据库操作之删除文档
- 删除单个文档
```
// 找到一个文档并删除，如果查询多个文档，则删除第一个未匹配文档 返回值为该文档
Model.findOneAndDelete(条件)
// 删除指定条件文档，如果查询多个文档，则删除第一个匹配文档 返回值是一个成功对象
Model.deleteOne(条件)
```
```js
Model.findOneAndDelete({ name: '小郭' }).then(res => {
    console.log(res)
})
Model.deleteOne({ name: '麓湖' }).then(res => {
    console.log(res)
})
```
-删除多个文档
```
Model.deleteMany(条件) // 如果条件为空，则会删除全部文档
```
