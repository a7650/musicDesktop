<template>
  <div id="main" style="width: 900px;height:400px;"></div>
</template>

<script>
// import echarts from "echarts"
const formatter1 = "{b}:{c}%<br>点击即可播放该歌曲";
const formatter2 = "{b}:本周上升{c}位<br>点击即可播放该歌曲";
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
  props: ["title", "xAxisData", "seriesData", "yAxisName"],
  data() {
    return {};
  },
  mounted() {
    let self = this;
    this.Chart = echarts.init(document.getElementById("main"));
    this.Chart.on("click", function(params) {
      self.$emit("selectSong", params.name);
    });
  },
  watch: {
    title() {
      option.title.text = this.title;
      option.xAxis.data = this.xAxisData;
      option.yAxis.name = this.yAxisName;
      option.series[0].data = this.seriesData;
      if (this.$route.params.id == 4) {
        option.tooltip.formatter = formatter1;
      } else {
        option.tooltip.formatter = formatter2;
      }
      this.Chart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
</style>
