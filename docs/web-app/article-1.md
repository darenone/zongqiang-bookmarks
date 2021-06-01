# 1. 项目架构搭建

首先引入gulpfile 4.x来管理新创建的项目，具体如何利用gulp脚手来搭建项目，我之前专门写了一篇gulp的教程[利用gulp 4.0搭建前端项目](./../scaffold/gulp/gulp-1.md)，你可以阅读这篇文章，快速搭建你的前端项目

首先创建一个文件夹，命名为`web-app`，作为项目名，并且参照[利用gulp 4.0搭建前端项目](./../scaffold/gulp/gulp-1.md)和[JS-Web-Skill](https://github.com/darenone/JS-Web-Skill.git)搭建`web-app`的前端框架

搭建完毕在`src/views/`下新建`index.html`文件，作为项目的主页面

接着在主页面里，写下如下代码，来清除浏览器的默认样式和浏览器的默认行为：
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
        #wrap {
            height: 100%;
            background-color: gray;
        }
    </style>
</head>
<body>
    <div id="wrap">

    </div>
</body>
<script type="text/javascript">
    // 取消浏览器默认行为
    document.addEventListener('touchstart', function(event) {
        event.preventDefault();
    })
</script>
</html>
```

