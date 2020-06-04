### MongoDB字段验证
讲解集合中字段的验证
- required 验证字段是否为必须输入，值为boolean
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
    name: {
        type: String,
        required: [true, 'name字段为必选字段'],
        minlength: 2,
        maxlength: 6
    },
    ciyt: String,
    sex: Number
})

// 3. 创建集合
const Model = mongoose.model('user', schema)

// 4. 创建文档（集合中的值）
Model.create().then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
/**
 * name: ValidatorError: name为必选字段
*/
```
```js
// 4. 创建文档（集合中的值）
Model.create({ name: '刘寿浩' }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```
- minlength，maxlength 验证字符的值的最小长度和最大长度
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '刘' }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
/**
 * name: ValidatorError: 该输入值长度小于最小长度
*/
```
- trim 去掉字符串首尾空格，值为boolean
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
        trim: true
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '    刘小飞     ' }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```
- min，max 验证最小最大数值
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
        trim: true,
    },
    age: {
        type: Number,
        min: [0, '输入的数字不能小于0'],
        max: [100, '输入的数字不能大于100']
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '刘海洋', age: 120 }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
/**
 * age: ValidatorError: 输入的数字不能大于100
*/
```
- default 默认值<br>
createTime没有指定，在创建文档的时候会自动加上
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
        trim: true,
    },
    age: {
        type: Number,
        min: [0, '输入的数字不能小于0'],
        max: [100, '输入的数字不能大于100']
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '特朗普', age: 90 }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
/**
 * 连接数据库成功
{
  _id: 5ed854099c909437c8d55031,
  name: '特朗普',
  age: 90,
  createTime: 2020-06-04T01:53:13.754Z,
  __v: 0
}
*/
```
- enum 规定输入的值<br>
hobbies的值规定了'唱', '跳', 'Rap'，这三个，当输入其它值时，会提示创建文档不成功
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
        trim: true,
    },
    age: {
        type: Number,
        min: [0, '输入的数字不能小于0'],
        max: [100, '输入的数字不能大于100']
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    hobbies: {
        type: String,
        enum: {
            values: ['唱', '跳', 'rap'],
            message: '改值不在设定的值当中'
        }
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '拜登', age: 90, hobbies: '唱' }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
// message: '改值不在设定的值当中'
```
- validate 根据自定义条件验证，通过validate函数处理输入值，message为自定义错误信息
```js
// 2. 创建集合结构 （类似创建mysql表中的key）
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name为必选字段'],
        minlength: [2, '该输入值长度小于最小长度'],
        maxlength: [6, '该输入值长度大于最大长度'],
        trim: true,
    },
    age: {
        type: Number,
        min: [0, '输入的数字不能小于0'],
        max: [100, '输入的数字不能大于100']
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    hobbies: {
        type: String,
        enum: {
            values: ['唱', '跳', 'rap'],
            message: '该值不在设定的值当中'
        }
    },
    score: {
        type: Number,
        validate: {
            validator: v => {
                // 返回布尔值
                return v && v > 0 && v < 100
            },
            message: '不是有效的分数'
        },
    },
    ciyt: String,
    sex: Number
})

// 4. 创建文档（集合中的值）
Model.create({ name: '拜登', age: 90, score: '120' }).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
// score: ValidatorError: 不是有效的分数
```
- 通过catch获取errors对象，遍历对象从中获取所有的报错信息
```js
// 4. 创建文档（集合中的值）
Model.create({ name: '佩洛西', age: 90, hobbies: '选举',  score: '120' }).then(res => {
    console.log(res)
}).catch(error => {
    const errs = error.errors
    for (let i in errs) {
        console.log(errs[i].message)
    }
})
/*
* 改值不在设定的值当中
* 不是有效的分数
*/
```