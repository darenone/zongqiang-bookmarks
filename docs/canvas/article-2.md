# 2-利用canvas绘制表格

关键词： `(function(){})()` 
```js
var a = function () {
    console.log('hello');
}
a(); // 执行函数a
(a)(); // (a)代表分组的意思，意思返回a函数，并执行这个函数
var b = (1 + 3); // b = 4 这里的()代表分组的意思
var c = (a); // c = a
c(); // 等价于执行a()
```
由上引申出自执行函数：
```js
(function () {
    console.log('hello');
})();
// 等价于
var a = function () {
    console.log('hello');
}
(a)();
```
