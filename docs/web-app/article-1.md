# 1. 项目架构搭建

我们来引入gulpfile 4.x来管理我们的项目，具体如何利用gulp这个脚手来搭建我们的项目，我之前专门写了一篇关于gulp的教程[利用gulp 4.0搭建前端项目](./../scaffold/gulp/gulp-1.md)，你可以通过阅读这篇文章快速搭建你的前端项目框架

因为这是一个介绍如何开发移动端的项目，项目名，我这里就叫做`web-app`并且参照[利用gulp 4.0搭建前端项目](./../scaffold/gulp/gulp-1.md)和[JS-Web-Skill](https://github.com/darenone/JS-Web-Skill.git)搭建`web-app`的前端框架

搭建完毕在`src/views/index.html`下新建`index.html`文件，作为项目的主页面

然后就是在这个主页面里，先清除浏览的默认样式和浏览器的默认行为：
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

<style>
    .page p, div, ol {
        font-size: 14px;
    }
</style>

