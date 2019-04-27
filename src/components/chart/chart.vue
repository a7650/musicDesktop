<template>
  <div ref="chart" :style="{'width':width,'height':height}"></div>
</template>

<script>
// import echarts from "echarts"

const option = {
  title: {
    text: ""
  },

  tooltip: {},

  legend: {
    // data:['销量']
  },

  color: ["rgb(255, 34, 83)"],

  xAxis: {
    //   data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    data: [],
    name: "歌曲"
  },

  series: [
    {
      // name: "播放量/万",
      type: "bar",
      // data: [5, 20, 36, 10, 10, 20]
      data: []
    }
  ],

  yAxis: {
    name: ""
  },

  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none"
      },
      dataView: { show: false },
      magicType: { type: ["line", "bar"] },
      restore: {},
      saveAsImage: {
        // emphasis:{
        //   iconStyle:{
        //     color:'rgb(255, 34, 83)'
        //   }
        // }
      }
    },
    orient: "vertical",
    right: 40,
    emphasis: {
      iconStyle: {
        // color: "rgb(255, 34, 83)",
        borderColor: "rgb(255, 34, 83)"
      }
    }
  }
};

export default {
  props: ["title", "xAxisData", "seriesData", "yAxisName","formatter","width","height"],
  data() {
    return {};
  },
  mounted() {
    let self = this;
    this.Chart = echarts.init(this.$refs.chart);
    this.Chart.on("click", function(params) {
      self.$emit("select", params.name);
    });
  },
  watch: {
    title(n,o) {
      if(!n){return};
      option.title.text = this.title;
      option.xAxis.data = this.xAxisData;
      option.yAxis.name = this.yAxisName;
      option.series[0].data = this.seriesData;
      option.tooltip.formatter = this.formatter;
      this.Chart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
</style>
