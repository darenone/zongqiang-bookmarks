# 3. transform封装

像这种函数的封装，直接在这了贴完整代码，虽然这时候我明白咋个意思，但是过后估计思路都会忘得一干二净，所以，这里我还是把封装好的函数拆分一下，一步步讲解这个`transformCss()`函数是如何封装的

首先咱们整一个div出来：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        #box {
            width: 50px;
            height: 50px;
            background: deepskyblue;
        }
    </style>
</head>
<body>
    <div id="box"></div>
</body>
</html>
```

接下来呢，咱们给div加一个动画（沿着X轴移动200px，同时缩放0.5），只需要添加一行css代码就行：

```css
#box {
    width: 50px;
    height: 50px;
    background: deepskyblue;
    transform:translateX(200px) scale(0.5);
}
```

如果不用css，用js实现同样的效果，该如何实现呢？首先创建一个`transformCss`函数

```js
function transformCss() {

}
```

讲一下思路：如果要用js来给元素添加动画，1. 首先需要获取这个元素 2. 设置动画名与动画值，所以这个函数需要传入三个参数：

```js
function transformCss(node, name, value) {

}
```

我们想让div平移200px，那么就需要给你这个函数传递如下三个值：

```js
var box = document.getElementById('box');
transformCss(box, 'translateX', 200);
function transformCss() {

}
```

好，到这里函数里面应该怎么写呢？

咱们给node元素对象增加一个属性， 用来存放动画name和动画值value，记录给元素添加了哪些动画，这里这个属性叫`transform`，你也可以叫其它名字

由于name不同，相对应的value的单位也不一样，所以要用switch函数进行判断，然后拼接成字符串

```js
function transformCss(node, name, value) {
    if (!node.transform) {
        node.transform = {};
    }
    node.transform[name] = value; // 记录每次给元素添加的动画和动画值
    var result = '';
    for (var item in node.transform) {
        switch (item) {
            case 'rotate':
            case 'skew':
            case 'skewX':
            case 'skewY':
                result += ' ' + item + '('+ node.transform[item] +'deg)';
                break;
            case 'scale':
            case 'scaleX':
            case 'scaleY':
                result += ' ' + item + '('+ node.transform[item] +')';
                break;
            case 'translate':
            case 'translateX':
            case 'translateY':
                result += ' ' + item + '('+ node.transform[item] +'px)';
                break;
        }
    }
    node.style.transform = result;
}
```

这样，在调用的时候，传递多个动画，都可以通过此函数`transformCss`设置成功：

```js
var box = document.getElementById('box');
transformCss(box, 'scale', 1);
transformCss(box, 'translateX', 200);
```

上述我们已完成了基本的功能，另外再加一个需求，`transformCss(node, name)`不传入value的时候，返回name的值，来改造一个下这个函数：

通过`arguments.length`传入参数的长度来判断是否传入了第三个值value

```js
function transformCss(node, name, value) {
    if (!node.transform) {
        node.transform = {};
    }
    if (arguments.length > 2) {
        node.transform[name] = value;
        var result = '';
        for (var item in node.transform) {
            switch (item) {
                case 'rotate':
                case 'skew':
                case 'skewX':
                case 'skewY':
                    result += ' ' + item + '('+ node.transform[item] +'deg)';
                    break;
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                    result += ' ' + item + '('+ node.transform[item] +')';
                    break;
                case 'translate':
                case 'translateX':
                case 'translateY':
                    result += ' ' + item + '('+ node.transform[item] +'px)';
                    break;
            }
        }
        node.style.transform = result;
    } else {
        if (typeof node.transform[name] == 'undefined') {
            // 这三个值比较特殊，因为它们的默认值是1
            if (name == 'scale' || name == 'scaleX' || name == 'scaleY') {
                value = 1
            } else {
                value = 0
            }
        } else {
            value = node.transform[name]
        }
        return value
    }
}
```

以上，不传入第三个参数value时，我们调用这个函数来看一下：

```js
var value1 = transformCss(box, 'translate');
console.log(value1); // 0
var value2 = transformCss(box, 'scale');
console.log(value2); // 1
```

第一次传递value，第二次调用不传递：

```js
transformCss(box, 'translate', 200); // 第一次传递value
var value = transformCss(box, 'translate'); // 第二次不传递
console.log(value) // 返回第一次传递的value
```

好了，以上，一个`transformCss`函数就创建完毕了，接下来，我们对其进行封装，目的：避免污染全局，便于以后修改和维护，咱们把它单独放到一个js文件里面

在我的项目里，我把它放到`util.js`里面

```js
(function (w) {
    /*
    * 读取或设置元素动画值
    * @params node 元素
    * @params name 动画名
    * @params value 动画值
    * @return 元素动画值
    */
    w.transformCss = function (node, name, value) {
        if (!node.transform) {
            node.transform = {};
        }
        if (arguments.length > 2) {
            node.transform[name] = value;
            var result = '';
            for (var item in node.transform) {
                switch (item) {
                    case 'rotate':
                    case 'skew':
                    case 'skewX':
                    case 'skewY':
                        result += ' ' + item + '('+ node.transform[item] +'deg)';
                        break;
                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                        result += ' ' + item + '('+ node.transform[item] +')';
                        break;
                    case 'translate':
                    case 'translateX':
                    case 'translateY':
                        result += ' ' + item + '('+ node.transform[item] +'px)';
                        break;
                }
            }
            node.style.transform = result;
        } else {
            if (typeof node.transform[name] == 'undefined') {
                // 这三个值比较特殊，因为它们的默认值是1
                if (name == 'scale' || name == 'scaleX' || name == 'scaleY') {
                    value = 1
                } else {
                    value = 0
                }
            } else {
                value = node.transform[name]
            }
            return value
        }
    }
})(window)
```

然后我们在html页面里去引入这个js

```html
<script type="text/javascript" src="../js/lib/util.js"></script>
<script type="text/javascript">
    var box = document.getElementById('box');
    transformCss(box, 'translate', 200);
</script>
```

**备注**：`transformCss()`函数我写在`utils.js`里面，关于具体实现可以参考[web-app](https://github.com/darenone/web-app)

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>
