<template>
  <div id="main" style="width: 900px;height:400px;"></div>
</template>

<script>
import echarts from "echarts";
const option = {
  title: {
    text: ""
  },

  tooltip: {},

  legend: {
    // data:['销量']
  },

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
      dataView: { readOnly: false },
      magicType: { type: ["line", "bar"] },
      restore: {},
      saveAsImage: {}
    }
  }
};

export default {
  props: ["title", "xAxisData", "seriesData", "yAxisName"],
  data() {
    return {};
  },
  mounted() {
    this.Chart = echarts.init(document.getElementById("main"));
  },
  watch: {
    title() {
      option.title.text = this.title;
      option.xAxis.data = this.xAxisData;
      option.yAxis.name = this.yAxisName;
      option.series[0].data = this.seriesData;
      this.Chart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
</style>
