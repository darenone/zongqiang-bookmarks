# echart在vue中的应用-封装bar

首先在vue项目中执行 npn install echart --save

在`components`文件夹内新建`bar`文件夹，在其文件夹内新建`index.vue`和`renderBar.js`文件

`index.vue`
```vue
<template>
    <section style="width: 100%;height: 100%;">
        <div :id="id" ref="bar" v-show="!nodata" :style="styles"></div>
        <div v-show="nodata"  class="no-data" :style="styles">
            <img src="@/assets/img/nodata/bar_nodata.png" alt="">
        </div>
    </section>
</template>
<script>
import echarts from 'echarts';
import RenderBar from './renderBar'
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
    render(name) {
      const _this = this;
        if (this.myChart) {
          this.myChart.clear();
          this.myChart.setOption(new RenderBar({
            map: name
          }));
          window.addEventListener("resize", this.resize);
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
`renderBar.js`
```js
import echarts from 'echarts';
function RenderBar (option) {
  this._init(option);
}
RenderBar.prototype = {
  _init: function (option) {
    this.xAxis = {
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    }
    this.yAxis = {
      type: 'category',
      data: ['重庆联通', '四川电信', '云南联通', '河南移动', '西藏电信'],
      axisLabel: {
        show: true,
        color: '#A6DFFE'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    }
    this.series = this.set_series(option);
  },
  set_series: function (option) {
    console.log(option.echart)
    return [
      {
        type: 'bar',
        data: [120, 130, 140, 140, 120],
        roundCap: true,
        barWidth: '10px',
        showBackground: true,
        backgroundStyle: {
          color: '#05244e'
        },
        itemStyle: {
          normal: {
            barBorderRadius: [10, 10, 10, 10],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgb(57,89,255,1)'
            }, {
                offset: 1,
                color: 'rgb(46,200,207,1)'
            }]),
          }
        },
        label: {
          show: true,
          textStyle: {
              color: 'white',
              fontSize: '8',
              right: 0
          },
          position: 'right',
          formatter: function(obj) {
              // if (obj.value >= 100) {
              //     return (obj.value / 10000).toLocaleString() + 'ms';
              // } else {
              //     return obj.value.toLocaleString();
              // }
            return obj.value + 'ms';
          },
      },
      }
    ]
  }
}
export default RenderBar;
```
效果图

![bar](./../../.vuepress/public/img/vue/9.png)