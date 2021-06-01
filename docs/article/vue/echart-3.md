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
我们来给geo地图，加上散点图，线集和visualMap组件，如果想要把三个都显示在geo地图上，可以通过设置`geoindex`和`seriesIndex`来实现：

此版本通过设置`geoindex` && `seriesIndex: [1]` 属性来实现geo和map共存，来达到hover散点和区域显示tooltip的效果
默认情况下，map series 会自己生成内部专用的 geo 组件。但是也可以用这个 geoIndex 指定一个 geo 组件。这样的话，map 和 其他 series（例如散点图）就可以共享一个 geo 组件了。并且，geo 组件的颜色也可以被这个 map series 控制，从而用 visualMap 来更改。

注意：当设定了 geoIndex 后，series-map.map 属性，以及 series-map.itemStyle 等样式配置将不再起作用，而是采用 geo 中的相应属性。
并且加了pin气泡图标以示数值大小

同时设置了`geoindex`和`seriesIndex`，代码如下：
```js
var uploadedDataURL = "/asset/get/s/data-1528971808162-BkOXf61WX.json";

/**
此版本通过设置geoindex && seriesIndex: [1] 属性来实现geo和map共存，来达到hover散点和区域显示tooltip的效果

默认情况下，map series 会自己生成内部专用的 geo 组件。但是也可以用这个 geoIndex 指定一个 geo 组件。这样的话，map 和 其他 series（例如散点图）就可以共享一个 geo 组件了。并且，geo 组件的颜色也可以被这个 map series 控制，从而用 visualMap 来更改。
当设定了 geoIndex 后，series-map.map 属性，以及 series-map.itemStyle 等样式配置不再起作用，而是采用 geo 中的相应属性。

http://echarts.baidu.com/option.html#series-map.geoIndex

并且加了pin气泡图标以示数值大小
*/
var points = [
                  {value: [118.8062, 31.9208],itemStyle:{color:'#4ab2e5'}}
                  , {value: [127.9688, 45.368],itemStyle:{color:'#4fb6d2'}}
                  , {value: [110.3467, 41.4899],itemStyle:{color:'#52b9c7'}}
                  , {value: [125.8154, 44.2584],itemStyle:{color:'#5abead'}}
                  , {value: [116.4551, 40.2539],itemStyle:{color:'#f34e2b'}}
                  , {value: [123.1238, 42.1216],itemStyle:{color:'#f56321'}}
                  , {value: [114.4995, 38.1006],itemStyle:{color:'#f56f1c'}}
                  , {value: [117.4219, 39.4189],itemStyle:{color:'#f58414'}}
                  , {value: [112.3352, 37.9413],itemStyle:{color:'#f58f0e'}}
                  , {value: [109.1162, 34.2004],itemStyle:{color:'#f5a305'}}
                  , {value: [103.5901, 36.3043],itemStyle:{color:'#e7ab0b'}}
                  , {value: [106.3586, 38.1775],itemStyle:{color:'#dfae10'}}
                  , {value: [101.4038, 36.8207],itemStyle:{color:'#d5b314'}}
                  , {value: [103.9526, 30.7617],itemStyle:{color:'#c1bb1f'}}
                  , {value: [108.384366, 30.439702],itemStyle:{color:'#b9be23'}}
                  , {value: [113.0823, 28.2568],itemStyle:{color:'#a6c62c'}}
                  , {value: [102.9199, 25.46639],itemStyle:{color:'#96cc34'}}
                  , {value: [119.4543, 25.9222]}
  ]
// var uploadedDataURL = "/asset/get/s/data-1482909892121-BJ3auk-Se.json";
myChart.showLoading();
      let index = -1;
      
$.getJSON(uploadedDataURL, function(geoJson) {
    
    echarts.registerMap('china', geoJson);
    myChart.hideLoading();
    option = {
        backgroundColor: '#013954',
     title: {
            top: 20,
            text: '“困难人数” - 杭州市',
            subtext: '',
            x: 'center',
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip: {
             trigger: 'item',
             formatter: function(params) {
                     return params.name + ' : ' + params.value[2];
             }
         },
       visualMap: {
          min: 0,
          max: 1000000,
          right: 100,
          seriesIndex: 0,
          type: 'piecewise',
          bottom: 100,
          textStyle: {
            color: '#FFFF'
          },
          splitList: [
            {
              gt: 50000,
              color: '#F5222D',
              label: '困难人数大于5万人'
            }, //大于5万人
            {
              gte: 30000,
              lte: 50000,
              color: '#FA541C ',
              label: '困难人数3-5万人'
            }, //3-5万人
            {
              gte: 10000,
              lte: 30000,
              color: '#FA8C16',
              label: '困难人数1-3万人'
            }, //1-3万人
            {
              lte: 10000,
              color: '#fbe1d6',
              label: '困难人数小于1万人'
            }
          ]
        },
        geo: {
            map: 'china',
          aspectScale: 0.75, //长宽比
          zoom: 1.1,
          roam: true,
          itemStyle: {
            normal: {
              areaColor: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [{
                            offset: 0,
                            color: '#09132c' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#274d68'  // 100% 处的颜色
                        }],
                        globalCoord: true // 缺省为 false
                    },
              shadowColor:'rgb(58,115,192)',
              shadowOffsetX: 10,
              shadowOffsetY: 11
            },
            emphasis: {
              areaColor: '#2AB8FF',
              borderWidth: 0,
              color: 'green',
              label: {
                show: false
              }
            }
          },
          regions: [{
            name: '南海诸岛',
            itemStyle: {
                areaColor: 'rgba(0, 10, 52, 1)',

                borderColor: 'rgba(0, 10, 52, 1)',
                normal: {
                    opacity: 0,
                    label: {
                        show: false,
                        color: "#009cc9",
                    }
                }
            },


        }],
        },
        series: [ {
            type: 'map',
            roam: false,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#1DE9B6'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: 'rgb(183,185,14)'
                    }
                }
            },

            itemStyle: {
              normal: {
               borderColor: 'rgb(147, 235, 248)',
                borderWidth: 1,
                areaColor: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [{
                            offset: 0,
                            color: '#09132c' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#274d68'  // 100% 处的颜色
                        }],
                        globalCoord: true // 缺省为 false
                    },
              },
              emphasis: {
                    areaColor: 'rgb(46,229,206)',
                //    shadowColor: 'rgb(12,25,50)',
                    borderWidth: 0.1
                }
            },
            zoom: 1.1,
       //     roam: false,
            // map: 'china', //使用
            geoIndex: 0,
            data: [
                {name: '广东', value: 5000},
                {name: '河南', value: 20000},
                {name: '陕西', value: 40000}
            ]
          },{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel:1,
                rippleEffect: {
                    period: 15,
                    scale: 4,
                    brushType: 'fill'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        offset: [15, 0],
                        color: '#1DE9B6',
                        show: true
                    },
                },
                itemStyle: {
                    normal: {
                       color:'#1DE9B6'/* function (value){ //随机颜色
 return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
 }*/,
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                symbolSize: 12,
                data: points
            }, //地图线的动画效果
          {
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 7, //图标大小
                },
                lineStyle: {
                    normal: {
                        color:'#1DE9B6'
                        /* function (value){ //随机颜色
                        
                        ['#f21347','#f3243e','#f33736','#f34131','#f34e2b',
                        '#f56321','#f56f1c','#f58414','#f58f0e','#f5a305',
                        '#e7ab0b','#dfae10','#d5b314','#c1bb1f','#b9be23',
                        '#a6c62c','#96cc34','#89d23b','#7ed741','#77d64c',
                        '#71d162','#6bcc75','#65c78b','#5fc2a0','#5abead',
                        '#52b9c7','#4fb6d2','#4ab2e5']
 return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
 }*/,
                        width: 1, //线条宽度
                        opacity: 0.1, //尾迹线条透明度
                        curveness: .3 //尾迹线条曲直度
                    }
                },
                data: [
                    {coords: [[118.8062, 31.9208],[119.4543, 25.9222]],lineStyle:{color:'#4ab2e5'}}
                  , {coords: [[127.9688, 45.368],[119.4543, 25.9222]],lineStyle:{color:'#4fb6d2'}}
                  , {coords: [[110.3467, 41.4899],[119.4543, 25.9222]],lineStyle:{color:'#52b9c7'}}
                  , {coords: [[125.8154, 44.2584],[119.4543, 25.9222]],lineStyle:{color:'#5abead'}}
                  , {coords: [[116.4551, 40.2539],[119.4543, 25.9222]],lineStyle:{color:'#f34e2b'}}
                  , {coords: [[123.1238, 42.1216],[119.4543, 25.9222]],lineStyle:{color:'#f56321'}}
                  , {coords: [[114.4995, 38.1006],[119.4543, 25.9222]],lineStyle:{color:'#f56f1c'}}
                  , {coords: [[117.4219, 39.4189],[119.4543, 25.9222]],lineStyle:{color:'#f58414'}}
                  , {coords: [[112.3352, 37.9413],[119.4543, 25.9222]],lineStyle:{color:'#f58f0e'}}
                  , {coords: [[109.1162, 34.2004],[119.4543, 25.9222]],lineStyle:{color:'#f5a305'}}
                  , {coords: [[103.5901, 36.3043],[119.4543, 25.9222]],lineStyle:{color:'#e7ab0b'}}
                  , {coords: [[106.3586, 38.1775],[119.4543, 25.9222]],lineStyle:{color:'#dfae10'}}
                  , {coords: [[101.4038, 36.8207],[119.4543, 25.9222]],lineStyle:{color:'#d5b314'}}
                  , {coords: [[103.9526, 30.7617],[119.4543, 25.9222]],lineStyle:{color:'#c1bb1f'}}
                  , {coords: [[108.384366, 30.439702],[119.4543, 25.9222]],lineStyle:{color:'#b9be23'}}
                  , {coords: [[113.0823, 28.2568],[119.4543, 25.9222]],lineStyle:{color:'#a6c62c'}}
                  , {coords: [[102.9199, 25.46639],[119.4543, 25.9222]],lineStyle:{color:'#96cc34'}}
                ]
            }

        ]
    };
    myChart.setOption(option,true);
});
```

效果图：

![map](./../../.vuepress/public/img/vue/14.png)

把`geoIndex`去掉，并且把series里`map: 'china'`放开，效果图如下：

![map](./../../.vuepress/public/img/vue/15.png)
