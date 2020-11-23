# 2. header部分制作

## 1. css雪碧图的使用

css雪碧图又叫css精灵图或者图片整合技术，它是前端常用的浏览器优化的一个方法，就是把项目中的小图标都放到一张png图片上，然后前端根据`background-position`这个属性，来控制使用哪些小图标，这样在项目上线以后，浏览器只需要请求一次，而不是一个小图标请求一次服务器，大大减少了服务器资源的消耗

## 2. 使用rem

rem（font size of the root element）相对于根元素字体大小的单位

假如手机宽度是375，我把它16等分，`375/16=23.4375`，每一份就是23.4375，咱们把这一份如果称之为1rem，那么也就可以理解为`1rem=23.4375`

假如手机宽度是1080，我把它16等分，`1080/16=67.5`，每一份就是67.5，咱们把这一份如果称之为1rem，那么也就可以理解为`1rem=67.5`

好了，如果在开发移动端项目时，设计稿给你的尺寸为：`1080px*1920px`，设计稿里面如果有一张图片，设计师给出的尺寸为`135px*135px`，那么前端开发人员在给这张图片写宽高的时候就不能直接写成：

```css
{
    width: 135px;
    height: 135px;
}
```
而应该写成rem，这里我们以设计稿宽度为基准，把它16等分，`1080/16=67.5`，每一份67.5，然后咱们把每一份看成是1rem，`1080/16=67.5px`，然后`135/67.5=2`，所以在写css的时候，应该这样写：

```css
{
    width: 2rem;
    height: 2rem;
}
```

具体是等分为16份还是等分为18分，这可以可以根据你们公司产品经理的要求来做

做rem适配，这个必须在`index.html`里面做：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- 先告诉浏览器这是一个移动端项目 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, userscalable=no">
    <title>移动端音乐台</title>
    <style type="text/css">
        /* 取消浏览器默认样式 */
        * {
            margin: 0;
            padding: 0;
        }
        html, body {
            height: 100%;
            overflow: hidden;
        }
        img {
            display: block;
        }
        a {
            text-decoration: none;
        }
    </style>
    <link rel="stylesheet" href="./../css/index.css">
</head>
<body>
    <div id="wrap">
        <header>
            <div id="headerTop">
                <!-- logo -->
                <h1 id="logo">
                    <a href="javascript:;">
                        <img src="./../images/logo.png" alt="">
                    </a>
                </h1>
                <!-- css雪碧图 --> 
                <a href="javascript:;" id="menuBtn" class="menuBtn_close"></a>
                <!-- 三个按钮 -->
                <div id="nav">
                    <a href="javascript:;" id="searchBtn">搜索</a>
                    <a href="javascript:;">登录</a>
                    <a href="javascript:;">注册</a>
                </div>
                <form id="search">
                    <input type="text">
                    <input type="button" value="搜索">
                </form>
            </div>
        </header>
    </div>
</body>
<script type="text/javascript">
    // 取消浏览器默认行为
    document.addEventListener('touchstart', function(event) {
        event.preventDefault();
    })
    // rem适配 这段代码很重要
    var width = document.documentElement.clientWidth / 16;
    var styleN = document.createElement('style');
    styleN.innerHTML = "html{font-size:"+width+"px!important}";
    document.head.appendChild(styleN)
</script>
</html>
```

**备注**：如果a标签里嵌套img，图片会产生间隙，解决方法，a和img标签都加上`display:block`

## 3. 移动端input改造

原生input样式很丑，所以要根据项目的实际需求进行改造，包括用js来操作input取消和获取焦点

```html
<form id="search">
    <input type="text" placeholder="请输入搜索内容...">
    <input type="submit" value="搜索">
</form>
```

```css
input {
    outline: none;
}

#search {
    height: 105/@rem;
    padding: 16/@rem;
}
#search [type='text'] {
    box-sizing: border-box;
    width: 829/@rem;
    height: 103/@rem;
    background-color: #999;
    padding: 5/@rem 10/@rem;
    border: 1/@rem solid #5a5a5a;
    font-size: 41/@rem;
    border-radius: 12/@rem;
}
#search [type='text']::-webkit-input-placeholder {
    color: #333;
}
#search [type='text']:focus {
    background: #fff;
}
#search [type='submit'] {
    float: right;
    width: 203/@rem;
    height: 103/@rem;
    border: none;
    background: #414040;
    color: #fff;
    border-radius: 12/@rem;
}
```

```js
// input 获得和失去焦点
var inputNode = document.querySelector("#search [type='text']")
inputNode.addEventListener('touchstart', function(event) {
    inputNode.focus(); // 获取焦点
    event.stopPropagation(); // 取消冒泡
})
document.addEventListener('touchstart', function() {
    inputNode.blur(); // 失去焦点
})
```

## 4. 取消a标签点击高亮

```css
a {
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

## 5. opacity和rgba的区别

rgba作用于当前元素，opacity会作用于所有子元素

## 6. 触发BFC机制

BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流，可以通过阅读这篇文章方便及理解[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

## 7. 阻止事件冒泡

如果父元素和子元素身上都有一个clik事件，当点击子元素的时候，同时也会触发父元素身上的事件，这就是冒泡

```js
var wrap = doucument.getElementById('wrap')
var box1 = document.getElementById('box1')

wrap.onclick = function () {
    console.log('我是父元素wrap')
}
box1.onclick = function () {
    console.log('我是子元素元素box1')
}
```
但是我们要阻止这种事情发生，在子元素click事件里加上一行代码就行了：

```js
box1.onclick = function (event) {
    event.stopPropagation()
    console.log('我是子元素元素box1')
}
```

## 8. 解决每个li之间由display: inline-block;导致的空隙

父元素设置font-size: 0;这里设置font-size: 1rem;来解决li之间的空隙问题，这个空隙是由display: inline-block;导致的

```css
#navsList {
    overflow: hidden;
    white-space: nowrap;
    float: left; // 使ul宽度变长，跟随着li的增加而增加
    font-size: 0;
    li {
        line-height: 129/@rem;
        display: inline-block;
        height: 129/@rem;
        padding: 0 38/@rem;
        a {
            color: #020202;
        }
        font-size: 1rem; // 父元素设置font-size: 0;这里设置font-size: 1rem;来解决li之间的空隙问题，这个空隙是由display: inline-block;导致的
    }
    .active {
        background: #690;
        a {
            color: #fff;
        }
    }
}
```

## 9. 其它问题

当点击Input输入框以及其它区域时，console台总是报如下错误：
```
Unable to preventDefault inside passive event listener due to target being treated as passive
```

解决方式：

在取消浏览器默认样式那里加入如下代码：

```css
* {
    touch-action: none;
}
```