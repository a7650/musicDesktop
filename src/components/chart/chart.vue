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

  legend: {},

  color: ["rgb(255, 34, 83)"],

  xAxis: {
    data: [],
    name: "歌曲"
  },

  series: [
    {
      type: "bar",
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
      saveAsImage: {}
    },
    orient: "vertical",
    right: 40,
    emphasis: {
      iconStyle: {
        borderColor: "rgb(255, 34, 83)"
      }
    }
  }
};

export default {
  props: [
    "title",
    "xAxisData",
    "seriesData",
    "yAxisName",
    "formatter",
    "width",
    "height",
    "chartLoading"
  ],
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
    title(n, o) {
      if (!n) {
        return;
      }
      option.title.text = this.title;
      option.xAxis.data = this.xAxisData;
      option.yAxis.name = this.yAxisName;
      option.series[0].data = this.seriesData;
      option.tooltip.formatter = this.formatter;
      this.Chart.setOption(option);
    },
    chartLoading(n, o) {
      if (n) {
        this.Chart.showLoading({
          text:"",
          color: "rgb(255, 34, 83)",
          maskColor: "rgba(255, 255, 255, 0.8)",
        });
      } else {
        this.Chart.hideLoading();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
</style>
