<template>
  <div class="home">
    <mHeader>歌单推荐</mHeader>
    <ul class="items">
      <li class="item" :class="{active:index===discIndex}"  @click="selectDisc(index)" v-for="(item,index) in recommendList" :key="item.item_id">{{item.item_name}}</li>
    </ul>
    <!-- <div v-for="item in recommendItem"></div> -->
    <div class="discDetail">
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===0"  :discList="discList[0]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===1"  :discList="discList[1]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===2"  :discList="discList[2]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===3"  :discList="discList[3]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===4"  :discList="discList[4]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===5"  :discList="discList[5]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===6"  :discList="discList[6]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===7"  :discList="discList[7]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===8"  :discList="discList[8]"></discList></keep-alive>
      <keep-alive><discList @selectDiscItem="selectDiscItem"  v-show="discIndex===9"  :discList="discList[9]"></discList></keep-alive>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getDistItem,getDiscList } from "api/recommend";
import discList from 'base/discList/discList'
import {mapMutations} from 'vuex'
import mHeader from "base/mHeader/mHeader"
export default {
  data() {
    return {
      recommendList: [],
      discList:{
        "0":[],
        "1":[],
        "2":[],
        "3":[],
        "4":[],
        "5":[],
        "6":[],
        "7":[],
        "8":[],
        "9":[]
      },
      discIndex:0
    };
  },
  components:{
    discList,mHeader
  },
  methods: {
    selectDiscItem(item){
      this.$router.push({
       name:'discDetail',
        params: {
          id: item.tid
        }
      });
      this.SET_SINGER(item);
    },
    selectDisc(index){
      this.discIndex = index
      if(!discList[index]){
        getDiscList(this.recommendList[index]["item_id"]).then(data=>{
          this.discList[index]=data
          // console.log(this.discList)
        })
      }
    },
    _getrecommendItem() {
      getDistItem().then(data => {
        this.recommendList = data.splice(0, 10);
        // console.log(this.recommendList)
        this.selectDisc(0)
      });
    },
    ...mapMutations([
      "SET_SINGER"
    ])
  },
  created() {
    this._getrecommendItem();
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
 padding-top: 80px;
  color: #000;
  .items{
      width: 100%;
      height: 30px;
      display:flex;
      justify-content: center;
      align-items:center;
      min-width: 1200px;
      .item{
          width: 100px;
          text-align: center;
          height: 100%;
          line-height:30px; 
      }
      .active{
        color:@color-theme;
      }
      .item:hover{
          color: @color-theme;
          cursor: pointer;
      }
  }
  .discDetail{
     height: 700px;
     width: 1200px;
     margin:  0 auto;
  }
}
</style>
