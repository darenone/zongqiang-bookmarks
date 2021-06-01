# 1-走进canvas的世界
关键词：`getContext` `moveTo` `lineTo` `stroke` `closePath` `strokeStyle` `lineWidth` `fill` `fillStyle`

canvas画布是html5新增的标签，它能够在网页里绘图，主要应用场景，1-可视化数据图表（柱状图，折线图，饼图等），例如百度的echart.js图表库；2-banner广告效果图（html5微场景）

我们来用canvas先画一个折线
```html
<body>
    <canvas id="myCanvas" width="300px" height="300px" style="border: 1px dotted #994400;">
        <span>IE9以上才支持</span><br>
        <span>你的浏览器不支持canvas，请升级你的浏览器</span>
    </canvas>
</body>
<script>
    window.onload = () => {
        let myCanvas = document.getElementById('myCanvas'); // 拿到canvas标签
        let ctx = myCanvas.getContext('2d'); // 拿到canvas上下文(canvas提供的工具集合)
        ctx.moveTo(100, 100); // 画笔移动到这个点
        ctx.lineTo(200, 100); // 用画笔画一条线
        ctx.lineTo(100, 200); // 同上
        ctx.stroke(); // 描边
    }
</script>
```
效果图：

![canvas](./../.vuepress/public/img/canvas/1.png)

如果想让这个折线闭合成一个三角形，代码如下：
```js
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.lineTo(100, 200);
ctx.lineTo(100, 100); // 等价写法 ctx.closePath()
ctx.stroke();
```
设置线宽，描边颜色，填充颜色
```js
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.lineTo(100, 200);
ctx.closePath();
ctx.lineWidth = 10; // 线宽
ctx.strokeStyle = '#998800'; // 描边的颜色
ctx.stroke(); // 描边
ctx.fillStyle = 'red'; // 填充的颜色
ctx.fill(); // 填充
```
实际效果：

![canvas](./../.vuepress/public/img/canvas/2.png)

