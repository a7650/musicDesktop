<template>
  <div class="rank">
    <mHeader class="header"><font style="color:#fff">排行榜</font></mHeader>
    <div class="content">
      <div class="move left">
        <i class="icon-left" @click="left"></i>
        <div></div>
      </div>
      <div class="rank-content">
        <ul class="items" ref="items">
          <li
            v-for="item in topList"
            :key="item.id"
            :class="{'active':active==item.id}"
            class="item"
            @click="selectList(item.id)"
          >
            <div class="bg">
              <img :src="item.picUrl" alt>
            </div>
            <div class="filter"></div>
            <div class="_bg">
              <h3 class="name">{{item.topTitle|filterTitle}}</h3>
              <div class="icon">
                <i class="line"></i>
              </div>
              <ul class="_items">
                <li class="_item" v-for="(song,index) in item.songList" :key="index">
                  <div class="_name">{{song.songname}}</div>
                  <div class="singer">{{song.singername}}</div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <!-- <div class="dots">
          <span class="dot" v-for="i in pageNum" :key="i" :class="{'active':i==page}"></span>
        </div> -->
      </div>
      <div class="move right">
        <div></div>
        <i class="icon-right" @click="right"></i>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { getRankList } from "api/rank";
import loading from "base/loading/loading";
import { mapMutations } from "vuex";
import mHeader from "base/mHeader/mHeader";

export default {
  data() {
    return {
      topList: [],
      pageNum: 1,
      page: 1,
      active: -1,
      rotate:0
    };
  },
  components: {
    loading,
    mHeader
  },
  filters: {
    filterTitle(val) {
      return val.replace("巅峰榜·", "");
    }
  },
  methods: {
    left() {
      // if (this.page == 1) {
      //   return;
      // } else {
      //   this.page--;
      //   this.$refs.items.style.transform = `translateX(${-(this.page - 1) *
      //     1080}px)`;
      // }
       this.rotate += 24;
      this.$refs.items.style.transform = "rotateY(" + this.rotate + "deg)";
    },
    // right(){
    //   if(this.page==this.pageNum){
    //     return
    //   }else{
    //     this.page++;
    //     this.$refs.items.style.transform=`translateX(${-(this.page-1)*1080}px)`
    //   }
    // },
    right() {
      this.rotate -= 24;
      this.$refs.items.style.transform = "rotateY(" + this.rotate + "deg)";
    },
    _getRankList() {
      getRankList().then(
        data => {
          this.topList = data.topList.splice(0, 15);
          // console.log(this.topList);
          // this.pageNum = Math.ceil(this.topList.length / 5);
        },
        err => {
          console.log(err);
        }
      );
    },
    selectList(id) {
      this.active = id;
      this.$router.replace({
        name: "rankDetail",
        params: {
          id
        }
      });
      this.SET_SINGER({ id });
      // console.log(item)
    },
    ...mapMutations(["SET_SINGER"])
  },
  created() {
    this._getRankList();
    let id = this.$route.params.id;
    this.active = id ? id : -1;
  },
  activated() {
    if (this.active > -1) {
      this.selectList(this.active);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.rank {
  position: absolute;
  padding-top: 80px;
  width: 100%;
  color: #000;
  // min-width: 1200px;
  background: #000;
}
.header {
  min-width: 1200px;
}
.content {
  width: 1200px;
  margin: 0 auto;
  height: 520px;
  position: relative;
  display: flex;
  margin-bottom: 50px;
}
.rank-content {
  width: 1100px;
  height: 100%;
  overflow: hidden;
  // flex: 1;
  position: relative;
  // overflow: hidden;
  perspective: 10000px;
  
}
.bg {
  width: 150%;
  height: 150%;
  position: absolute;
  top: -25%;
  left: -25%;
  filter: blur(40px);
  img {
    width: 100%;
    height: 100%;
  }
}
.filter {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #000;
  opacity: 0.4;
}
._bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.items {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 35px;
  transition: 0.3s;
  user-select: none;
  transform-style: preserve-3d;

  .item {
    color: #fff;
    width: 196px;
    height: 450px;
    background-color: #fff;
    // margin-right: 20px;
    overflow: hidden;
    position: absolute;
    top: 35px;
    left: 50%;
    margin-left: -98px;
    // box-shadow: 0 0 7px rgba(0, 0, 0, 1);
    transition: 0.2s;
    transform-origin: center;
    // border-radius: 11px;
    backface-visibility: hidden;
    .name {
      width: 100%;
      height: 45px;
      font-size: 30px;
      text-align: center;
      margin-top: 30px;
      transition: 0.2s;
    }
    .icon {
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      .line {
        display: inline-block;
        width: 40px;
        border-top: 5px solid #fff;
      }
    }
  }

  .item:nth-child(1) {
    transform: rotateY(-48deg) translateZ(@t-z);
  }
  .item:nth-child(2) {
    transform: rotateY(-24deg) translateZ(@t-z);
  }
  .item:nth-child(3) {
    transform: rotateY(0deg) translateZ(@t-z);
  }
  .item:nth-child(4) {
    transform: rotateY(24deg) translateZ(@t-z);
  }
  .item:nth-child(5) {
    transform: rotateY(48deg) translateZ(@t-z);
  }
  .item:nth-child(6) {
    transform: rotateY(72deg) translateZ(@t-z);
  }
  .item:nth-child(7) {
    transform: rotateY(96deg) translateZ(@t-z);
  }
  .item:nth-child(8) {
    transform: rotateY(120deg) translateZ(@t-z);
  }
  .item:nth-child(9) {
    transform: rotateY(144deg) translateZ(@t-z);
  }
  .item:nth-child(10) {
    transform: rotateY(168deg) translateZ(@t-z);
  }
  .item:nth-child(11) {
    transform: rotateY(192deg) translateZ(@t-z);
  }
  .item:nth-child(12) {
    transform: rotateY(216deg) translateZ(@t-z);
  }
  .item:nth-child(13) {
    transform: rotateY(240deg) translateZ(@t-z);
  }
  .item:nth-child(14) {
    transform: rotateY(264deg) translateZ(@t-z);
  }
  .item:nth-child(15) {
    transform: rotateY(288deg) translateZ(@t-z);
  }

  // .item:nth-child(1),.item:nth-child(5){
  //   transform: scale(.6);
  // }
  // .item:nth-child(2),.item:nth-child(4){
  //   transform: scale(.8);
  // }
  // .item:nth-child(3){
  //   transform: scale(1);
  // }
  // .item:nth-child(1){
  //   transform: rotateY(-30deg) scale(.6);
  // }
  // .item:nth-child(2){
  //   transform: rotateY(-15deg) scale(.8);
  // }
  // .item:nth-child(4){
  //   transform: rotateY(15deg) scale(.8);
  // }
  // .item:nth-child(5){
  //   transform: rotateY(30deg) scale(.6);
  // }
  //   .side{
  //   transform: scale(.6);
  // }
  // ._side{
  //   transform: scale(.8);
  // }
  // .center{
  //   transform: scale(1);
  // }
  // .active{
  //   transform: scale(1.05);
  // }
  .item:hover {
    cursor: pointer;
    // transform: scale(1.05);
  }
  // ._bg:hover>.name{
  //   color: @color-theme;
  // }
}
._items {
  margin-top: 40px;
  ._item {
    width: 100%;
    height: 50px;
    text-align: center;
    margin-bottom: 15px;
    ._name,
    .singer {
      height: 25px;
      line-height: 25px;
      text-align: center;
      box-sizing: border-box;
      padding: 0 30px;
      .no-wrap;
    }
    ._name {
    }
    .singer {
      font-size: 14px;
      color: @color-text-dd;
    }
  }
}
.move {
  height: 100%;
  line-height: 520px;
  text-align: center;
  z-index: 99;
  width: 50px;
  position: relative;
  div{
    width: 130px;
    height: 100%;
    display: block;
    position: absolute;
    z-index: -99;
    top: 0;
    
  }
  i {
    color: #fff;
    opacity: 0.3;
    font-size: 50px;
    font-weight: bold;
    transition: 0.3s;
  }
  i:hover {
    opacity: 1;
    cursor: pointer;
  }
}
.left {
  text-align: left;
  div{
  left:  100%;
  background: linear-gradient(to right, #000 , transparent);
}
}
.right{
  text-align: right;
   div{
  right: 100%;
  background: linear-gradient(to left, #000 , transparent);
}
}

.dots {
  width: 100%;
  height: 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 20px;
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #00000029;
    transition: 0.5s;
    display: inline-block;
    margin-right: 10px;
  }
  .dot:last-child {
    margin: 0;
  }
  .active {
    width: 16px;
    background-color: #000000b5;
  }
}
</style>
