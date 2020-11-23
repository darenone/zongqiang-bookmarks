# 3. transform封装

这个内容涉及到上一节我们创建的一个导航条，这个导航条可以左右滑动，在不借助第三方插件的情况下，如果想实现这样的功能，咱们得使用css3的transform这个属性，这里就讲解一下如何封装一个transform函数

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
            touch-action: none;
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
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        input {
            outline: none;
        }
        ul li {
                list-style: none;
            }
    </style>
    <link rel="stylesheet" href="./../css/index.css">
</head>
<body>
    <div id="wrap">
        <header id="header">
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
                <!-- input输入框 -->
                <form id="search">
                    <input type="text" placeholder="请输入搜索内容...">
                    <input type="submit" value="搜索">
                </form>
                <!-- 遮罩 -->
                <ul id="mask">
                    <li>
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
                </ul>
            </div>
        </header>
        <div id="content">
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
        </div>
    </div>
</body>
<script type="text/javascript" src="../js/lib/util.js"></script>
<script type="text/javascript">
    // 取消浏览器默认行为
    document.addEventListener('touchstart', function(event) {
        event.preventDefault();
    })
    // rem适配
    var width = document.documentElement.clientWidth / 16;
    var styleN = document.createElement('style');
    styleN.innerHTML = "html{font-size:"+width+"px!important}";
    document.head.appendChild(styleN)
    // input 获得和失去焦点
    var inputNode = document.querySelector("#search [type='text']")
    inputNode.addEventListener('touchstart', function(event) {
        inputNode.focus(); // 获取焦点
        event.stopPropagation(); // 取消冒泡
    })
    document.addEventListener('touchstart', function() {
        inputNode.blur(); // 失去焦点
    })
    // 遮罩点击事件
    changeMenu();
    function changeMenu () {
        var menuBtn = document.getElementById('menuBtn');
        var mask = document.getElementById('mask');
        menuBtn.addEventListener('touchstart', function(event) {
            if (menuBtn.className == 'menuBtn_close') {
                menuBtn.className = 'menuBtn_open';
                mask.style.display = 'block';
            } else if (menuBtn.className == 'menuBtn_open') {
                menuBtn.className = 'menuBtn_close';
                mask.style.display = 'none';
            }
            // 阻止冒泡
            event.stopPropagation();
        })
        document.addEventListener('touchstart', function() {
            if (menuBtn.className == 'menuBtn_open') {
                menuBtn.className = 'menuBtn_close';
                mask.style.display = 'none';
            }
        })
        mask.addEventListener('touchstart', function(event) {
            // 阻止冒泡
            event.stopPropagation();
        })
    }
    // 导航拖拽
    drag();
    function drag() {
        var navs = document.getElementById('navs');
        var navsList = document.getElementById('navsList');
        var startX = 0; // 手指的初始位置
        var eleX = 0; // 元素初始位置
        navs.addEventListener('touchstart', function(event) {
            var touch = event.changedTouches[0]; // 获取触摸点列表（一个手指操作就是一个触摸点，两个手指操作就是两个）
            startX = touch.clientX; // 手指初始位置
            eleX = transformCss(navsList, 'translateX') // 元素初始位置
        })
        navs.addEventListener('touchmove', function (event) {
            var touch = event.changedTouches[0]
            var nowX = touch.clientX;
            var disX = nowX - startX; // 手指滑动的距离
            var translateX = eleX + disX
            // 往右滑动时
            if (translateX > 0) {
                translateX = 0
                // 往左滑动时
            } else if (translateX < document.documentElement.clientWidth - navsList.offsetWidth) { // 屏幕的宽度-navsList的宽度
                translateX = document.documentElement.clientWidth - navsList.offsetWidth
            }
            transformCss(navsList, 'translateX', translateX)
        })
    }
</script>
</html>
```
`transformCss()`函数我写在`utils.js`里面，关于具体实现可以参考[web-app](https://github.com/darenone/web-app)