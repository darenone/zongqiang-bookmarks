## Date
### parseTime( )
> parseTime(time, cFormat)
```js
/**
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
*/
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
        value = '0' + value
        }
        return value || 0
    })
    return time_str
}
```
#### 功能
将Date对象或则字符串日期转化为指定格式的字符串日期

#### 参数
<i style="color: #3492ff;font-weight: 700;">time:</i> Date对象或者字符串<br>
<i style="color: #3492ff;font-weight: 700;">cFormat:</i> 需要转化的格式

#### 返回
<i style="color: #3492ff;font-weight: 700;">(String):</i> 转化后的字符串日期

#### 例子
```js
let date = new Date()
let dateFormat1 = parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
// => 2020-04-01 10:06:29

let dateFormat2 = parseTime(date, '{y}/{m}/{d} {h}:{i}:{s}')
// => 2020/04/01 10:06:29

let dateStr = '2020-02-03 10:00'
let dateStrFormat = parseTime(dateStr, '{y}-{m}-{d} {h}:{i}:{s}')
// => 2020-02-03 10:00:00
```
### formatTime( )
> formatTime(time, option)
```js
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
function formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()
  
    const diff = (now - d) / 1000
  
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  }
```
#### 功能
格式化时间，但是当传递不是当年数据的时候，显示的会有问题，所以此函数用到项目中的时候，需要根据业务进行修改

#### 参数
<i style="color: #3492ff;font-weight: 700;">time:</i> 需要处理的时间戳<br>
<i style="color: #3492ff;font-weight: 700;">option:</i> parseTime函数里的cFormat

#### 返回
<i style="color: #3492ff;font-weight: 700;">(String):</i> 转化后的值

#### 例子
```js
let dateFormat3 = formatTime(new Date('2020-01-01 10:00'))
// => 1月1日10时0分

let dateFormat4 = formatTime(new Date('2020-03-31 10:00'))
// => 1天前

let dateFormat5 = formatTime(new Date('2020-04-1 10:00'))
// => 4小时前

let dateFormat6 = formatTime(new Date())
// => 刚刚
```

## Number

### handleEmpty( )
> handleEmpty(val, mark)
```js
/**
 * @param {(string|number)} val
 * @param {string} mark
 * @returns {string|number}
*/
function handleEmpty(val, mark) {
  if ( typeof val === "undefined" || val === null || val === '' && val !== 0 || val === "null" || val === "--") { 
    return '--'; 
  }
  if (mark) { 
    return val + mark;
  } else { 
    return val; 
  }
}
```
#### 功能
处理空数据，将'undefined'/undefine/null/'null'/''/'--'转化为--，如果传入的val存在，直接返回val

#### 参数
<i style="color: #3492ff;font-weight: 700;">val:</i> 需要处理的值<br>
<i style="color: #3492ff;font-weight: 700;">mark:</i> 单位

#### 返回
<i style="color: #3492ff;font-weight: 700;">(Number/String):</i> 转化后的值

#### 例子
```js
let value1 = null
let value1Format = handleEmpty(value1)
// => --

let value12 = ''
let value1Format2 = handleEmpty(value1)
// => --

let value3 = 0
let value1Format3 = handleEmpty(value3)
// => 0

let value4 = 10
let value1Format4 = handleEmpty(value4, '%')
// => 10%

let value5 = undefined
let value1Format5 = handleEmpty(value5, '%')
// => --
```

### toFixed2( )
> toFixed2(value)
```js
/**
 * @param {(string|number)} val
 * @returns {string|number}
*/
function toFixed2 (value) {
	if(!value && value !== 0 || value === 'null') return null;
	if (typeof value == 'number') {
    return handleNumber(value);
	} else if (typeof value == 'string' && isNumber(value)) {
    return handleNumber(value);
  } else {
      return value;
  }
  // 判读是否为字符串数字
  function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
  }
  function handleNumber(value) {
    var f = parseFloat(value);
    f = Math.round(value * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 2) {
      s += '0'
    }
    return s
  }
}
```
#### 功能
保留两位小数

#### 参数
<i style="color: #3492ff;font-weight: 700;">value:</i> 需要处理的值<br>

#### 返回
<i style="color: #3492ff;font-weight: 700;">(Number/String):</i> 转化后的值

#### 例子
```js
let value6 = 20
let valueFormat6 = toFixed2(value6)
// => 20.00

let value7 = 0
let valueFormat7 = toFixed2(value7)
// => 0.00

let value8 = '30.0000'
let valueFormat8 = toFixed2(value8)
// => 30.00

let value9 = '--'
let valueFormat9 = toFixed2(value9)
// => --

let value10 = '我不是number'
let valueFormat10 = toFixed2(value10)
// => 我不是number

// 组合用法
let value11 = '30'
let valueFormat11 = handleEmpty(toFixed2(value11), 'ms')
// => 30.00ms
```
## String

### getQueryObject( )
> getQueryObject(url)
```js
/**
 * @param {string} url
 * @returns {Object}
 */
function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
```
#### 功能
截取url中携带的参数，并转成json格式

#### 参数
<i style="color: #3492ff;font-weight: 700;">url:</i> url<br>

#### 返回
<i style="color: #3492ff;font-weight: 700;">(Object):</i> 转化后的值

#### 例子
```js
let url1 = 'http://localhost:8082/#/taskQuery/mapOverview?task_id=10000036&optType=U,R,O,T'
let param1 = getQueryObject(url1)
// => { task_id: "10000036", optType: "U,R,O,T" }
```
### param2Obj( )
> param2Obj(url)
```js
/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
```
#### 功能
截取url中携带的参数,并转成json格式

#### 参数
<i style="color: #3492ff;font-weight: 700;">url:</i> url<br>

#### 返回
<i style="color: #3492ff;font-weight: 700;">(Object):</i> 转化后的值

#### 例子
```js
let url2 = 'http://localhost:8082/#/taskQuery/mapOverview?task_id=10000036&optType=U,R,O,T'
let param2 = param2Obj(url2)
// => { task_id: "10000036", optType: "U,R,O,T" }
```