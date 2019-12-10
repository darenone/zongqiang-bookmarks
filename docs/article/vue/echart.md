### line图表封装示例
```js
<template>
    <section style="width: 100%;height: 100%;">
        <div :id="id" ref="chartTree" v-show="!nodata" :style="styles"></div>
        <div v-show="nodata"  class="no-data" :style="styles">
            <img src="@/assets/bar_nodata.png" alt="">
        </div>
    </section>
</template>
<script>
import echarts from 'echarts';
export default {
    props: {
        id: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        legend: {
            type: Array,
            default() {
                return []
            }
        },
        series: {
            type: Array,
            default() {
                return []
            }
        },
        xData: {
            type: Array,
            default() {
                return []
            }
        },
        styles: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            nodata: false,
            seriesData: [],
            xAxisData: [],
            legendData: []
        }
    },
    computed: {
        myChart() {
            return echarts.init(document.getElementById(this.id));
        }
    },
    mounted() {
        this.renderLine(); // 渲染图表
        this.resizeChart(); // 添加监听事件，监听窗口变化
        this.setSize(); // 初始化图形大小
    },
    destroyed() {
        window.onresize = null; // 组件被销毁后解除监听事件
    },
    methods: {
        setSize() {
            this.myChart.resize();
        },
        resizeChart() {
            // 监听窗口宽度变化
            window.onresize = () => {
                this.setSize(); // 设置图表宽高
            }
        },
        renderLine(data) {
            let option = {
                title: {
                    text: '折线图堆叠',
                    textStyle: {
                        fontSize: 14
                    },
                    left: 'center',
                    show: false
                },
                grid: {
                    left: '1rem',
                    right: '4%',
                    bottom: '20%',
                    top: '14%',
                    containLabel: true,
                    borderWidth: '0'
                },
                legend: {
                    // data: ['今日投诉曲线', '平均线'],
                    data: this.legendData,
                    x: 'right',
                    icon: 'rect',
                    align: 'left',
                    itemWidth: 14,
                    itemHeight: 10,
                    itemGap: 13
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '14%'];
                    },
                    confine: true
                },
                xAxis: [{
                    type: 'category',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    boundaryGap: true,
                    data: this.xAxisData,
                    // data: ['0.1', '1', '1.9', '2.8', '3.7', '4.6', '5.5', '6.4', '7.3', '8.2', '9.1', '10', '10.9', '11.8', '12.7', '13.6']
                }],
                yAxis: {
                    type: 'value',
                    // name: '值',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#4D4D4D'
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: '#4D4D4D'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#707070'
                        }
                    },
                    splitLine: {
                    lineStyle: {
                        width: 1,
                        type: 'dashed'
                    }
                    },
                    axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#CCCCCC'
                    }
                    },
                    axisTick: {
                    show: false
                    },
                    min: 0,
                    splitNumber: 5
                },
                series: this.seriesData,
                // series: [
                //     {
                //         name: "今日投诉曲线",
                //         type: "line",
                //         smooth: true,
                //         symbol: 'circle',
                //         symbolSize: 10,
                //         data: [0, 0.5, 0.8, 1, 1.2, 1.5, 1.6, 1.8, 2.5, 3, 4, 4.8, 6, 7.4, 8.4, 9.2],
                //         itemStyle: {
                //             normal: {
                //                 color: '#5fbdff',
                //                 lineStyle: {
                //                     width: 3
                //                 }
                //             }
                //         }
                //     },
                //     {
                //         name: "平均线",
                //         type: "line",
                //         smooth: true,
                //         symbol: 'circle',
                //         symbolSize: 10,
                //         data: [0, 0.9, 1.1, 1.5, 2, 1.5, 1.6, 1.8, 1.9, 2, 2.4, 2.8, 3, 3.5, 4, 5],
                //         itemStyle: {
                //             normal: {
                //                 color: '#ff975f',
                //                 lineStyle: {
                //                     width: 3,
                //                     type: 'dotted',
                //                 }
                //             }
                //         }
                //     }
                // ],
                dataZoom: [{
                    type: "slider", /*类型*/
                    xAxisIndex: 0, /*对应的轴*/
                    bottom: "10", /*位置，定位*/
                    start: 20, /*开始*/
                    end: 100, /*结束*/
                    handleIcon: "M0,0 v9.7h5 v-9.7h-5 Z",
                    handleStyle: { /*手柄的样式*/
                        color: "#40bcf9",
                        borderColor: "#1fb2fb"
                    },
                    backgroundColor: "#e2f3ff", /*背景 */
                    dataBackground: { /*数据背景*/
                        lineStyle: {
                            color: "#000000"
                        },
                        areaStyle: {
                            color: "#d4d9dd"
                        }
                    },
                    fillerColor: "rgba(31,178,251,0.2)", /*被start和end遮住的背景*/
                    labelFormatter: function (value, params) { /*拖动时两端的文字提示*/
                        var str = "";
                        if (params.length > 4) {
                            str = params.substring(0, 4) + "…";
                        } else {
                            str = params;
                        }
                        return str;
                    }
                }]
            };
            this.myChart.setOption(option);
        }
    },
    watch: {
        series: {
            handler(newVal, val) {
                if (newVal.length) {
                    this.nodata = false;
                    this.seriesData = [];
                    this.seriesData = newVal;
                    console.log(newVal)
                    // this.myChart.dispose();
                    this.renderLine();
                } else {
                    this.nodata = true;
                }
            },
            deep: true
        },
        xData: {
            handler(newVal, val) {
                if (newVal.length) {
                    // this.myChart.dispose();
                    this.xAxisData = [];
                    this.xAxisData = newVal;
                    console.log(newVal)
                    this.renderLine();
                } else {
                    this.nodata = true;
                }
            },
            deep: true
        },
    }
}
</script>
```