# echart在vue中的应用-封装line

首先在vue项目中执行 npn install echart --save

在`components`文件夹内新建`line`文件夹，在其文件夹内新建`index.vue`和`renderLine.js`文件

`index.vue`
```vue
<template>
    <section style="width: 100%;height: 100%;">
        <div :id="id" ref="line" v-show="!nodata" :style="styles"></div>
        <div v-show="nodata"  class="no-data" :style="styles">
            <img src="@/assets/img/nodata/line_nodata.png" alt="">
        </div>
    </section>
</template>
<script>
import echarts from 'echarts';
import RenderLine from './renderLine'
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
        if (this.myChart) {
          this.myChart.clear();
          this.myChart.setOption(new RenderLine({
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
`renderLine.js`
```js
function renderLine (option) {
  this._init(option);
}
renderLine.prototype = {
  _init: function (option) {
    this.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
            color: '#999'
        }
      }
    }
    this.legend = {
      textStyle: {
        color: '#A6DFFE'
      },
      itemWidth: 30,
      itemHeight: 8,
      icon: 'roundRect'
    }
    this.xAxis = [
      {
        type: 'category',
        data: ['4-12 1:00', '4-12 2:00', '4-12 3:00', '4-12 4:00', '4-12 5:00', '4-12 6:00', '4-12 7:00', '4-12 8:00', '4-12 9:00', '4-12 10:00'],
        axisPointer: {
            type: 'shadow'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#A6DFFE'
          }
        }
      }
    ];
    this.yAxis = [
      {
        type: 'value',
        name: '网络时延',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ms',
          color: '#A6DFFE'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#082752'
          }
        },
        nameTextStyle: {
          color: '#A6DFFE'
        }
      },
      {
        type: 'value',
        name: '丢包率',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} %',
          color: '#A6DFFE'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: '#A6DFFE'
        }
      }
    ];
    this.series = this.set_series(option);
    this.color = ['#02FFF0', '#F68929']
  },
  set_series: function (option) {
    return [
      {
          name: '网络时延',
          type: 'line',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8],
          showSymbol: false,
          smooth: true,
          areaStyle: {
            color: '#02FF0',
            opacity: 0.1
          }
      },
      {
          name: '丢包率',
          type: 'line',
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5],
          showSymbol: false,
          smooth: true,
          areaStyle: {
            color: '#F68929',
            opacity: 0.1
          }
      }
    ]
  }
}
export default renderLine;
```
效果图：

![line](./../../.vuepress/public/img/vue/8.png)