# 4. 导航拖拽实现

和上一章节一样，此处我们也是分步骤来讲如何实现，因为涉及到的js逻辑还是复杂

导航实现的功能：手指按住导航条可以向左滑动，也可以向右滑动，同时，滑动到最左边或者最右边的时候，有一个回弹的功能

阅读这篇文章的时候，你也可以把对应的项目[web-app](https://github.com/darenone/web-app)下载下来，对照着相应的功能来看这篇文章

## 1. html部分

```html
<nav id="navs">
    <ul id="navsList">
        <li class="active">
            <a href="javascript:;">首页</a>
        </li>
        <li>
            <a href="javascript:;">MV</a>
        </li>
        <li>
            <a href="javascript:;">电影</a>
        </li>
        <li>
            <a href="javascript:;">电视剧</a>
        </li>
        <li>
            <a href="javascript:;">悦单</a>
        </li>
        <li>
            <a href="javascript:;">V榜</a>
        </li>
        <li>
            <a href="javascript:;">我的家</a>
        </li>
        <li>
            <a href="javascript:;">APP下载</a>
        </li>
        <li>
            <a href="javascript:;">商城</a>
        </li>
        <li>
            <a href="javascript:;">热门应用</a>
        </li>
    </ul>
</nav>
```

## 2. 样式部分

```less
#navs {
    height: 177/@rem;
    box-sizing: border-box;
    padding: 31/@rem 0 14/@rem 0;
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
}
```

## 3. js部分

首先创建一个函数`drag()`
```js
drag();

function drag () {

}
```

根据html分析一下，应该是手指点击nav标签，然后给ul添加`translateX`这个属性，让ul跟着手指滑动，所以需要将`touchstart`事件绑定到nav上

同时类似于获取鼠标的位置，此时我们需要获取手指的位置，可以通过event来获取手指列表，拿到第一个手指的位置

```js
function drag () {
    var navs = document.getElementById('navs');

    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
    })
}
```

手指点击屏幕之后，接下来就是滑动屏幕，所以需要给nav添加一个滑动事件，同样也要拿到手指列表

```js
function drag () {
    var navs = document.getElementById('navs');

    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
    })
}
```

以上获取到手指列表，接下来就是获取手指位置，我来定义一个`startX`来储存这个值

我们说的手指位置，也就是手指距离屏幕最左侧的距离

```js
function drag () {
    var navs = document.getElementById('navs');
    var startX = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
    })
}
```

然后我手指滑动的时候，让ul跟着走，此时需要在touchmove事件里完成如下逻辑

手指滑动多远，ul就走多远，所以我们需要获取手指走了多远，这个值通过：手指滑动时最新的位置（nowX）-手指点击屏幕时最初的位置（startX）=手指滑动的距离（disX），然后把得到的这个距离值，通过js赋值给ul的`translateX`，让ul走起来

```js
function drag () {
    var navs = document.getElementById('navs');
    var startX = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
    })
}
```

接下来就是把这个值disX，用到ul的身上，代码如下：

这里我直接调用了在第3节咱们封装好的`transformCss()`函数

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        transformCss(navsList, 'translateX', disX)
    })
}
```

好了，实际操作一下，确实可以让ul跟着手指滑动，但是有一个bug，每次滑动停下，当再次滑动，ul又从屏幕最左侧开始向右滑动，这是为什么呢？

因为咱们没有记录下ul第一次跟着手指往右滑动停下来的位置，第二次手指继续往右滑动的时候，ul应该从第一次停下里的位置开始,以此类推....

所以每次滑动开始前，也就是手指按下的那一刻，都要记录一下ul的translateX之前的值，这里又要用到`transformCss()`函数了，代码继续改造如下：

咱们用一个变量eleX，来记录ul的translateX的值

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    var eleX = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        eleX = transformCss(navsList, 'translateX')
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        transformCss(navsList, 'translateX', disX)
    })
}
```

所以，在touchmove事件里，就需要把这个eleX加上

```js
transformCss(navsList, 'translateX', disX + eleX)
```

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    var eleX = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        eleX = transformCss(navsList, 'translateX')
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        transformCss(navsList, 'translateX', disX + eleX)
    })
}
```

我们是假设手指往右滑动，所以disX和eleX的值都是正的，如果往左滑动道理也一样，只不过disX和eleX的值是负的

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>