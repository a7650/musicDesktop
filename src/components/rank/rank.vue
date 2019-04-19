<template>
  <div class="rank">
    <mHeader class="header">排行榜</mHeader>
    <div class="content">
      <div class="move left">
        <i class="icon-left" @click="left"></i>
        <div></div>
      </div>
      <div class="rank-content">
        <ul class="items" ref="items">
          <li
            v-for="item in filterList"
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
        <div class="dots">
          <span class="dot" v-for="i in pageNum" :key="i" :class="{'active':i==page}"></span>
        </div>
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
  computed:{
    filterList(){
      return this.topList.filter(item=>{
        return item.id!==201
      })
    }
  },
  methods: {
    left() {
      if (this.page == 1) {
        return;
      } else {
        this.page--;
        this.$refs.items.style.transform = `translateX(${-(this.page - 1) *
          1080}px)`;
      }
    },
    right(){
      if(this.page==this.pageNum){
        return
      }else{
        this.page++;
        this.$refs.items.style.transform=`translateX(${-(this.page-1)*1080}px)`
      }
    },
    _getRankList() {
      getRankList().then(
        data => {
          this.topList = data.topList;
          // console.log(this.topList);
          this.pageNum = Math.ceil(this.topList.length / 5);
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
  padding-top: 70px;
  width: 100%;
  color: #000;
  // min-width: 1200px;
  padding-bottom: 100px;
}
.header{
  min-width: 1200px;
}
.content{
  width: 100%;
  height: 520px;
  position: relative;
  min-width: 1200px;
  display: flex;
}
.rank-content {
  width: 1090px;
  height: 100%;
  box-sizing: border-box;
  padding-left: 15px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.bg {
  width: 120%;
  height: 120%;
  position: absolute;
  top: -10%;
  left: -10%;
  filter: blur(20px);
  img {
    min-height: 100%;
  }
}
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background-color: #000;
      opacity: .2;
    }
._bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.items {
  width: 5000px;
  height: 100%;
  box-sizing: border-box;
  padding-top: 35px;
  transition: .8s;
  user-select: none;
  .item {
    color: #fff;
    width: 196px;
    height: 450px;
    background-color: #fff;
    margin-right: 20px;
    overflow: hidden;
    float: left;
    position: relative;
    // box-shadow: 0 0 7px rgba(0, 0, 0, 1);
    transition: .2s;
    transform-origin: center;
    border-radius: 2px;
    .name {
      width: 100%;
      height: 45px;
      font-size: 30px;
      text-align: center;
      margin-top: 30px;
      transition: .2s;
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
  .active{
    transform: scale(1.05);
  }
  .item:hover{
    cursor: pointer;
    transform: scale(1.05);
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
.move{
  height: 100%;
  width: 50px;
  line-height: 520px;
  text-align: center;
  z-index: 99;
  flex: 1;
  i{
    color: #000;
    opacity: .2;
    font-size: 50px;
    font-weight: bold;
    transition: .3s;
  }
  i:hover{
    opacity: 1;
    cursor: pointer;
  }
}

.dots{
  width: 100%;
  height: 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 20px;
  .dot{
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color:#00000029;
    transition: .3s;
    display: inline-block;
    margin-right: 10px;
  }
  .dot:last-child{
    margin: 0;
  }
  .active{
    width: 16px;
    background-color: #000000b5;
  }
}

</style>
