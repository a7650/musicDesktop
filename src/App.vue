<template>
  <div class="app">
    <tab></tab>
    <player></player>
    <button class="top" @click="top">
      <i class="icon-up"></i>
    </button>
    <keep-alive exclude="discDetail,singerDetail,search">
      <router-view></router-view>
    </keep-alive>
    <float ref="float"></float>
  </div>
</template>

<script>
import tab from "base/tab/tab";
import player from "components/player/player";
import float from "base/float/float";
export default {
  components: {
    tab,
    player,
    float
  },
  methods: {
    top() {
      document.getElementById("tab").scrollIntoView();
    }
  },
  mounted() {
    var self = this;
    this.__proto__.float = function(mes) {
      self.$refs.float.float(mes);
    };
  }
};
</script>

<style lang="less" scoped>
// .app{
//   position: fixed;
//   top: 0;
//   left:0;
//   right: 0;
//   bottom: 0;
//   overflow-y: scroll;
// }
.top {
  width: 30px;
  height: 30px;
  border: 1px solid #999;
  background-color: #fff;
  box-sizing: border-box;
  // padding-top: 1px;
  color: #000;
  line-height: 30px;
  text-align: center;
  position: fixed;
  bottom: 70px;
  right: 3px;
}
.top:hover {
  background-color: #888;
  cursor: pointer;
}
</style>
