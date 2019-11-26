### 保留两位小数
```js
export function toFixed2 (value) {
	if(!value && value !== 0 || value === 'null') return '--';
	if (typeof value == 'number') {
		handleNumber(value);
	} else if (typeof value == 'string' && isNumber(value)) {
		handleNumber(value);
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
    // 保留2位小数
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
### 处理空数据
```js
/*
    调用示例：
    handleEmpty(10, '%')  返回：10%
    handleEmpty(10) 返回：10
    handleEmpty(null) 返回：--

*/
export function handleEmpty(val, mark) {
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
### 截取url?后携带的参数
```js
/*
    调用示例：
    let url = 'http://localhost:8082/#/taskSet/create?name=%E5%AE%97%E5%BC%BA&sex=%E7%94%B7'
    param2Obj(url)
    返回：{name: "宗强", sex: "男"}
*/
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}
```
### 日期格式化
```js
/*
    调用示例：
    parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
    返回：2019-09-01 10:22:16
    parseTime(new Date(), 'y/m/d');
    返回：2019/09/01
*/
export function parseTime(time, cFormat) {
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