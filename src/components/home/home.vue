<template>
  <div class="home">
    <!-- <div ref="a" id="a"></div> -->
    <mHeader>歌单推荐{{c}}</mHeader>
    <ul class="items">
      <li
        class="item"
        :class="{active:index===discIndex}"
        @click="selectDisc(index)"
        v-for="(item,index) in _allList"
        :key="item.item_id"
      >{{item.item_name}}</li>
      <li :class="{active:discIndex===10}" class="item recommend" @click="selectRecommend">推荐歌曲</li>
    </ul>
    <!-- <div v-for="item in recommendItem"></div> -->
    <div class="discDetail">
      <discList
        v-for="(item,index) in discList"
        :key="index"
        @selectDiscItem="selectDiscItem"
        v-show="discIndex==index"
        :discList="item"
      ></discList>
      <keep-alive>
        <recommend-list v-if="discIndex===10"></recommend-list>
      </keep-alive>
    </div>
    <router-view>
      <!-- home的子路由 -->
    </router-view>
  </div>
</template>

<script>
import { getDiscList } from "api/recommend";
import discList from "base/discList/discList";
import { mapMutations } from "vuex";
import mHeader from "base/mHeader/mHeader";
import { shuffle } from "common/js/tools";
import allList from "./allList.js";
import recommendList from "components/recommendList/recommendList";
import Carousel from "carousel-z";

export default {
  data() {
    return {
      discList: {
        "0": [],
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": []
      },
    };
  },
  components: {
    discList,
    mHeader,
    recommendList
  },
  methods: {
    selectRecommend() {
      this.discIndex = 10;
    },
    selectDiscItem(item) {
      this.$router.push({
        name: "discDetail",
        params: {
          id: item.tid
        }
      });
      this.SET_SINGER(item);
    },
    selectDisc(index) {
      this.discIndex = index;
      if (!discList[index]) {
        getDiscList(this._allList[index]["item_id"]).then(data => {
          this.discList[index] = data;
        });
      }
    },
    ...mapMutations(["SET_SINGER"])
  },
  created() {
    this._allList = shuffle(allList.splice(0, 10));
    this.selectDisc(0);
  },
  mounted() {
    // var myCarousel = new Carousel({
    //   width: "200px",
    //   height: "300px",
    //   parentNode: this.$refs.a,
    //   duration: "2000ms",
    //   transitionTime: ".5s",
    //   hidden: false,
    //   transitionName: "banner",
    //   img: [
    //     {
    //       href: "123123",
    //       src: require("./img/正面.jpg"),
    //       tipMes: "这是第一张图的介绍123213213213"
    //     },
    //     {
    //       href: "123123",
    //       src: require("./img/反面.jpg"),
    //       tipMes: "这是第2张图的介绍123213213213"
    //     },
    //     {
    //       href: "123123",
    //       src: require("./img/1.jpg"),
    //       tipMes: "这是第3张图的介绍123213213213这是第3张图的介绍"
    //     },
    //     {
    //       href: "123123",
    //       src: require("./img/2.jpg"),
    //       tipMes:
    //         "这是第4张图的介绍123213213213这是第4张图的介绍123这是第4<br>张图的介绍123"
    //     }
    //   ],
    //   hover: {
    //     pause: true
    //   },
    //   dots: {
    //     show: true,
    //     ordinaryColor: "rgba(255,0,0,.3)",
    //     activeColor: "#ff0000",
    //     dotSize: "20px",
    //     bottomDistance: "20px",
    //     transition: ".3s",
    //     turn: true
    //   },
    //   tip: {
    //     show: true,
    //     backgroundColor: "blue",
    //     fontColor: "#fff"
    //   }
    // });
    // myCarousel.picPlay();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.home {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  box-sizing: border-box;
  padding-top: 70px;
  color: #000;
  .items {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 1200px;
    .item {
      // width: 100px;
      text-align: center;
      height: 100%;
      line-height: 30px;
      padding: 2px 15px;
      margin-right: 20px;
      border-radius: 16px;
      user-select: none;
      font-size: 14px;
    }
    .active {
      background-color: @color-theme2;
      color: #fff;
    }
    .item:not(.active):hover {
      color: @color-theme;
      cursor: pointer;
    }
  }
  .discDetail {
    height: 700px;
    width: 1120px;
    box-sizing: border-box;
    padding-left: 20px;
    margin: 0 auto;
  }
}
.recommend {
  margin: 0;
}
#a {
  width: 200px;
  height: 300px;
  margin: 0 auto;
}
.banner-enter {
  opacity: 0;
  transform: translateX(100%);
}

.banner-leave {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
