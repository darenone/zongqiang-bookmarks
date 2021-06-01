# 5. 导航拖拽实现2

上节，实现了基本的往左往右的拖拽效果，这节，再来说一下回弹效果，也就是在往右滑动的时候，允许ul最左侧出现一点儿白色间距，然后到达一个临界值，ul就往左回弹回去，往左滑动也一样，允许ul最右侧出现一点儿白色间距，到达了一个临界值，直接往右回弹回去

这节内容重点就是一个问题：上节内容的拖拽，当手指往右滑动，ul也跟着滑动，手指划的快，ul也往右走的快，我们如何让ul往右滑动的越来越慢直到停止呢？

变换到js逻辑上，就是让translateX的值增加的越来越小，我们大概能得出一个公式：

```
c = 1 - a / b
```
b不变，a越来越大，a/b值越来越大，c越来越小

好了，分析完之后，该如何求c这个系数呢？

```
translateX /  document.documentElement.clientWidth
```
translateX会越来越大，但是屏幕宽度不变，以上这个比值也会越来越大

```
c = 1 - translateX /  document.documentElement.clientWidth
```

这个c正是我们想要的系数，下面来写代码

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
        var translateX = disX + eleX;
        if (translateX > 0) {
            var scale = 1 - translateX / document.documentElement.clientWidth;
            translateX = translateX * scale;
        } else if (translateX < document.documentElement.clientWidth - navsList.offsetWidth) {
            translateX = document.documentElement.clientWidth - navsList.offsetWidth
        }
        transformCss(navsList, 'translateX', translateX);
    })
}
```

```js
translateX = translateX * scale;
```

这个值刚开始缓慢增加，达到最大值，然后开始缓慢变小，直到又变为0

接下来考虑往左侧滑动时，也有一个临界值，上篇文章里说过，这个临界值就是：`document.documentElement.clientWidth - navsList.offsetWidth`达到这个临界值，再往左侧走，就会有空白间距，
我们先让ul跟屏幕右侧出现一个空白间距，这个间距为a，那么如何计算这个a的值呢？

可以用

```
(document.documentElement.clientWidth - navsList.offsetWidth) - translateX = a (空白间距)

// 例如：-15 - (-20) = 5

```
还继续套用上面的公式：
```
c = 1 - a / b
```

这里b还是document.documentElement.clientWidth这个值，c这个系数也会越来越小

上具体的代码：

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


