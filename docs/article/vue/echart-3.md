# echart在vue中的应用-封装map

首先在vue项目中执行 npn install echart --save

在`components`文件夹内新建`map`文件夹，在其文件夹内新建`index.vue`和`renderMap.js`文件

echart map加载地图有三种方式
1. 通过script标签直接引入js文件，引入后会自动注册地图名字和数据
2. 另外一种是json文件，需要通过ajax异步加载后手动注册
3. 结合百度地图api直接加载百度地图

第一种：

`index.vue`
```js
<script src="echarts.js"></script>
<script src="map/js/china.js"></script>
<script>
var chart = echarts.init(document.getElementById('main'));
chart.setOption({
    series: [{
        type: 'map',
        map: 'china'
    }]
});
</script>
```
就可以直接使用了，效果图如下：

![map](./../../.vuepress/public/img/vue/10.png)

第二种：根据json文件渲染地图，这里需要异步加载json文件（我自己加载出来的地图没有南海那一块）

`index.vue`
```vue
<template>
    <section style="width: 100%;height: 100%;">
        <div :id="id" ref="map" v-show="!nodata" :style="styles"></div>
        <div v-show="nodata"  class="no-data" :style="styles">
            <img src="@/assets/img/nodata/map_nodata.png" alt="">
        </div>
    </section>
</template>
<script>
import axios from 'axios';
import echarts from 'echarts';
import mainCity from './../../../../public/json/china-main-city-map';
import RenderMap from './renderMap'
export default {
  props: {
    id: {
        type: String,
        default: "map"
    },
    name: {
        type: String,
        default: "中国"
    },
    styles: {
        type: Object,
        default () {
            return {}
        }
    },
    data: {
        type: Array,
        default () {
            return []
        }
    },
  },
  data() {
    return {
      nodata: false,
    }
  },
  computed: {
    myChart() {
      return echarts.init(document.getElementById(this.id));
    }
  },
  methods: {
    async render(name) {
      try {
        await  this.getJson(name);
        if (this.myChart) {
          this.myChart.clear();
          this.myChart.setOption(new RenderMap({
            map: name
          }));
          window.addEventListener("resize", this.resize);
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getJson (name) {
      /**
      * 更多json数据可以在项目里public/china-main-city这个文件夹里获得
      * 也可以访问http://datav.aliyun.com/tools/atlas/#&lat=30.332329214580188&lng=106.72278672066881&zoom=3.5下载想要的json数据
      */
      try {
        const res = await axios.get(`./json/${mainCity[name]}.json`);
        echarts.registerMap(`${name}`, res.data);
      } catch (err) {
        console.log(err)
      }
    },
    resize () {
      /* 把这个单独拎出来是因为如果写在window.addEventListener("resize", () => { this.myChart.resize()})里面
      当你需要移除这个监听事件的时候，这样写window.removeEventListener("resize")是不起作用的，而应该这样写
      window.addEventListener("resize", this.resieze)和window.removeEventListener('resize', this.resize)才可以正确移除*/
      this.myChart.resize();
    }
  },
  mounted () {
    if (this.data.length) {
      this.$nextTick(() => {
        this.render(this.name);
      })
    } else {
      this.nodata = true;
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
}
</script>
```
`renderMap.js`
```js
function RenderMap (option) {
  this._init(option);
}
RenderMap.prototype = {
  _init: function (option) {
    this.series = this.set_series(option);
    this.tooltip = {
      show: true,
    }
    this.visualMap = {
      type: 'piecewise',
      pieces: [
        {min: 120, color: '#e74d53', label: 'x > 120'},
        {min: 80, max: 120, color: '#e39652', label: '80 < x ≤ 120'},
        {min: 50, max: 80, color: '#1c157e', label: '50 < x ≤ 80'},
        {min: 20, max: 50, color: '#053594', label: '20 < x ≤ 50'},
        {max: 20, color: '#19be6b', label: 'x ≤ 20'}
      ],
      itemWidth: 20,
      itemHeight: 10,
      itemSymbol: 'roundRect',
      backgroundColor: '#03276e',
      textStyle: {
        color: '#A6DFFE',
        fontFamily: 'Microsoft YaHei',
        fontSize: 12,
      },
      left: '30%'
    }
  },
  set_series: function(option) {
    return {
      name: '网络时延',
      type: 'map',
      roam: true,
      zoom: 1,
      map: option.map || '中国',
      label: {
        show: true,
        color: '#A6DFFE',
        fontSize: 10,
      },
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 1.5,
          colorStops: [{
              offset: 0, color: '#053594' // 0% 处的颜色
          }, {
              offset: 1, color: '#0f6ec9' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        // 区域边框颜色
        borderColor: '#03276e',
      },
      emphasis: {
        itemStyle: {
          areaColor: '#2AB8FF',
          borderWidth: 0,
        },
      },
      data: [
        {name: '河南省', value: 150},
        {name: '四川省', value: 100},
        {name: '广东省', value: 60},
        {name: '西藏自治区', value: 40},
        {name: '吉林省', value: 10}
      ]
    }
  }
}
export default RenderMap;
```
这里很重要的一点！！！
```js
echarts.registerMap(`${name}`, res.data);
option = {
    series: [{
        type: 'map',
        map: `${name}`
    }]
}
```
这两个`name`必须相同，且name不能为`china`，才能渲染出你自己定义的json地图

效果图：

![map](./../../.vuepress/public/img/vue/11.png)

第三种： 利用geo（地理坐标系组件）绘制地图，这样可以在地图上绘制散点图和线集等

`index.vue`不变，`renderMap.js`内容如下：
```js
function RenderMap (option) {
  this._init(option);
}
RenderMap.prototype = {
  _init: function (option) {
    this.series = this.set_series(option);
    this.geo = {
      show: true,
      map: `${option.map}`,
      zoom: 1,
      roam: false,
      // aspectScale: 1,
      // layoutCenter: ["50%", "50%"], //地图位置
      // layoutSize: '100%',
      itemStyle: {
        normal: {
          shadowColor: '#182f68',
          areaColor: '#182f68',
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          opacity: 1,
        },
        emphasis: {
          areaColor: '#276fce',
        }
      },
    };
    this.tooltip = {
      show: true,
    }
    this.visualMap = {
      type: 'piecewise',
      pieces: [
        {min: 120, color: '#e74d53', label: 'x > 120'},
        {min: 80, max: 120, color: '#e39652', label: '80 < x ≤ 120'},
        {min: 50, max: 80, color: '#1c157e', label: '50 < x ≤ 80'},
        {min: 20, max: 50, color: '#053594', label: '20 < x ≤ 50'},
        {max: 20, color: '#19be6b', label: 'x ≤ 20'}
      ],
      itemWidth: 20,
      itemHeight: 10,
      itemSymbol: 'roundRect',
      backgroundColor: '#03276e',
      textStyle: {
        color: '#A6DFFE',
        fontFamily: 'Microsoft YaHei',
        fontSize: 12,
      },
      left: '30%'
    }
  },
  set_series: function(option) {
    return {
      name: '网络时延',
      type: 'map',
      roam: true,
      zoom: 1,
      label: {
        show: true,
        color: '#A6DFFE',
        fontSize: 10,
      },
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 1.5,
          colorStops: [{
              offset: 0, color: '#053594' // 0% 处的颜色
          }, {
              offset: 1, color: '#0f6ec9' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        // 区域边框颜色
        borderColor: '#03276e',
      },
      emphasis: {
        itemStyle: {
          areaColor: '#2AB8FF',
          borderWidth: 0,
        },
      },
      data: [
        {name: '河南省', value: 150},
        {name: '四川省', value: 100},
        {name: '广东省', value: 60},
        {name: '西藏自治区', value: 40},
        {name: '吉林省', value: 10}
      ]
    }
  }
}
export default RenderMap;
```
也是需要注意：
```js
echarts.registerMap(`${name}`, res.data);
geo = {
    map: `${name}`
}
```
这两个地方`name`值必须一样，并且下面这个地方的map不用写
```js
series = [
    {
        type: 'map',
        // map: `${name}` 这个地方map不用写
    }
]}
```
展示的实际效果如下：

![map](./../../.vuepress/public/img/vue/12.png)

如果把下面这个地方的`name`也加上
```js
series = [
    {
        type: 'map',
        map: `${name}`
    }
]}
```
实际效果是geo绘制的地图和json绘制的地图叠加在一起，产生了3D的效果：

![map](./../../.vuepress/public/img/vue/13.png)

叠加以后，想要json地图和geo地图同步缩放和移动，可以在`index.vue`里面新增事件
```vue
<template>
    <section style="width: 100%;height: 100%;">
        <div :id="id" ref="map" v-show="!nodata" :style="styles"></div>
        <div v-show="nodata"  class="no-data" :style="styles">
            <img src="@/assets/img/nodata/map_nodata.png" alt="">
        </div>
    </section>
</template>
<script>
import axios from 'axios';
import echarts from 'echarts';
import mainCity from './../../../../public/json/china-main-city-map';
import RenderMap from './renderMap'
export default {
  props: {
    id: {
        type: String,
        default: "map"
    },
    name: {
        type: String,
        default: "中国"
    },
    styles: {
        type: Object,
        default () {
            return {}
        }
    },
    data: {
        type: Array,
        default () {
            return []
        }
    },
    // tooltip: {
    //     type: String,
    //     default: ""
    // },
    // visualMap: {
    //     type: String,
    //     default: ""
    // },
    // config: {
    //     type: String,
    //     default: "config1"
    // },
    // region: {
    //     type: Array,
    //     default () {
    //         return []
    //     }
    // }
  },
  data() {
    return {
      nodata: false,
    }
  },
  computed: {
    myChart() {
      return echarts.init(document.getElementById(this.id));
    }
  },
  methods: {
    async render(name) {
      try {
        await  this.getJson(name);
        if (this.myChart) {
          this.myChart.clear();
          this.myChart.setOption(new RenderMap({
            map: name
          }));
          // 添加缩放和滚动事件
          this.myChart.on('georoam', (params) => {
            let option = this.myChart.getOption();
            if (params.zoom != null && params.zoom != undefined) { //捕捉到缩放时
                option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
                option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
            } else { //捕捉到拖曳时
                option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
            }
            this.myChart.dispatchAction({
              type: 'restore'
            })
            this.myChart.setOption(option);
          })
          window.addEventListener("resize", this.resize);
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getJson (name) {
      /**
      * 更多json数据可以在项目里public/china-main-city这个文件夹里获得
      * 也可以访问http://datav.aliyun.com/tools/atlas/#&lat=30.332329214580188&lng=106.72278672066881&zoom=3.5下载想要的json数据
      */
      try {
        const res = await axios.get(`./json/${mainCity[name]}.json`);
        console.log(res.data)
        echarts.registerMap(`${name}`, res.data);
        // echarts.registerMap('china', res.data);
      } catch (err) {
        console.log(err)
      }
    },
    resize () {
      /* 把这个单独拎出来是因为如果写在window.addEventListener("resize", () => { this.myChart.resize()})里面
      当你需要移除这个监听事件的时候，这样写window.removeEventListener("resize")是不起作用的，而应该这样写
      window.addEventListener("resize", this.resieze)和window.removeEventListener('resize', this.resize)才可以正确移除*/
      this.myChart.resize();
    }
  },
  mounted () {
    if (this.data.length) {
      this.$nextTick(() => {
        this.render(this.name);
      })
    } else {
      this.nodata = true;
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
}
</script>
```
