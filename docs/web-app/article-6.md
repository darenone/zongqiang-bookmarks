# 6. 导航快速滑屏实现

前面两篇文章已经实现了，拖拽及其左右拖拽到低时，各显示一些空白区域，这里我们来实现快速滑屏的效果，也就是手指轻点一下，然后快速滑动的动作

思路，记录手指按下（touchstart）的时候的时间t1和位置w1，记录手指抬起（touchend）的时候的时间t2和位置w2，然后:

```
(w2 - w1) / (t2 - t1) = 得出一个平均速度
```

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    var eleX = 0

    var t1 = 0
    var w1 = 0
    var t2 = 0
    var w2 = 0
    var disT = 0 // 时间差
    var disW = 0 // 距离差
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        eleX = transformCss(navsList, 'translateX')
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        var translateX = disX + eleX;
        if (translateX > 0) {
            var scale = 1 - translateX / document.documentElement.clientWidth;
            translateX = translateX * scale;
        } else if (translateX < document.documentElement.clientWidth - navsList.offsetWidth) {
            var minX = document.documentElement.clientWidth - navsList.offsetWidth; // 负
            var scale = 1 -  (minX - translateX) / document.documentElement.clientWidth
            translateX = minX - (minX - translateX) * scale
        }
        transformCss(navsList, 'translateX', translateX);
    })
}
```

手指从屏幕离开以后，ul才开始滑动，所以在touchend事件里设置ul的translateX值

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    var eleX = 0

    var t1 = 0
    var w1 = 0
    var t2 = 0
    var w2 = 0
    var disT = 0
    var disW = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        eleX = transformCss(navsList, 'translateX')
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        var translateX = disX + eleX;
        if (translateX > 0) {
            var scale = 1 - translateX / document.documentElement.clientWidth;
            translateX = translateX * scale;
        } else if (translateX < document.documentElement.clientWidth - navsList.offsetWidth) {
            var minX = document.documentElement.clientWidth - navsList.offsetWidth; // 负
            var scale = 1 -  (minX - translateX) / document.documentElement.clientWidth
            translateX = minX - (minX - translateX) * scale
        }
        transformCss(navsList, 'translateX', translateX);
    })
    navs.addEventListener('touchend', function(event) {
        var touch = event.changedTouches[0]; 
        var speed = disW / disT;
        var target = transformCss(navsList, 'translateX') + speed * 100;
        transformCss(navsList, 'translateX', target);
    })
}
```

接下来就是去获取下面这四个变量的值：

```js
    var t1 = 0
    var w1 = 0
    var t2 = 0
    var w2 = 0
```

其中`t1`和`w1`这两个值在`touchstart`事件里获取，`t1`和`w2`既可以在`touchmove`的末尾，也可以在`touchend`的开始获取：

```js
function drag () {
    var navs = document.getElementById('navs');
    var navsList = document.getElementById('navsList');
    var startX = 0
    var eleX = 0

    var t1 = 0
    var w1 = 0
    var t2 = 0
    var w2 = 0
    var disT = 0
    var disW = 0
    navs.addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        eleX = transformCss(navsList, 'translateX');
        t1 = new Date().getTime();
        w1 = eleX;
    })
    navs.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var nowX = touch.clientX;
        var disX = nowX - startX;
        var translateX = disX + eleX;
        if (translateX > 0) {
            var scale = 1 - translateX / document.documentElement.clientWidth;
            translateX = translateX * scale;
        } else if (translateX < document.documentElement.clientWidth - navsList.offsetWidth) {
            var minX = document.documentElement.clientWidth - navsList.offsetWidth; // 负
            var scale = 1 -  (minX - translateX) / document.documentElement.clientWidth
            translateX = minX - (minX - translateX) * scale
        }
        transformCss(navsList, 'translateX', translateX);

        t2 = new Date().getTime();
        w2 = translateX;
        disT = t2 - t1;
        disW = w2 - w1;
    })
    navs.addEventListener('touchend', function(event) {
        var touch = event.changedTouches[0]; 
        var speed = disW / disT;
        var target = transformCss(navsList, 'translateX') + speed * 100;
        transformCss(navsList, 'translateX', target);
    })
}
```