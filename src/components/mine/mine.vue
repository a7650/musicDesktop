<template>
  <div class="mine">
    <button class="report" @click="reportDetail=true">查看我的听歌报告</button>
   <transition name="report-detail">
      <div class="report-detail" v-show="reportDetail">
      <h3>听歌报告</h3>
      <div class="report-content"></div>
    </div>
   </transition>
    <div class="content">
      <div class="my-album">
        <mHeader>收藏的歌曲</mHeader>
        <div class="tip" v-if="!songList.length">你没有收藏歌曲，去听听歌吧🎵</div>
        <songList @selectSong="_selectSong" class="list" :songList="songList" v-else></songList>
      </div>
      <div class="line"></div>
      <div class="my-collection">
        <mHeader>收藏的歌单</mHeader>
        <div class="tip" v-if="!collectAlbum.length">你没有收藏歌单，去收藏一个吧💽</div>
        <discList
          @selectDiscItem="selectDiscItem"
          class="list disc-list"
          :discList="collectAlbum"
          :noLoading="1"
          v-else
        ></discList>
      </div>
    </div>
  </div>
</template>

<script>
import { getCreateAlbum } from "common/js/cache";
import { getSongVkey } from "api/song";
import { song } from "common/js/song";
import songList from "base/songList/songList";
import mHeader from "base/mHeader/mHeader";
import discList from "base/discList/discList";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      songList: [],
      reportDetail:false
    };
  },
  components: {
    songList,
    mHeader,
    discList
  },
  computed: {
    ...mapGetters(["collectAlbum","userStatus"])
  },
  methods: {
    selectDiscItem(item) {
      this.$router.push({
        name: "discDetail_mine",
        params: {
          id: item.disstid
        }
      });
    },
    _selectSong(index, filterList) {
      this.selectSong({
        list: [...this.songList],
        index
      });
    },
    ...mapActions(["selectSong"])
  },
  activated() {
    let list = getCreateAlbum("我的收藏").songList;
    let result = [];
    list.forEach((item,i) => {
      result.push(new song(item));
      let item2 = result[i]
      getSongVkey(item.mid).then(res => {
        let vkey = res.data.items[0].vkey;
        item2.src = vkey
          ? `http://dl.stream.qqmusic.qq.com/C400${
              item.mid
            }.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
          : "";
        item2.name = vkey ? item.name : `<del>${item.name}(暂无音源)</del>`;
      });
    });
    this.songList = result;
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.mine {
  position: absolute;
  padding-top: 70px;
  width: 100%;
  color: #000;
  height: 100%;
  box-sizing: border-box;
  // min-width: 1200px;
  padding-bottom: 70px;
  overflow: hidden;
}
.content {
  display: flex;
  height: 100%;
  width: 100%;
  min-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 50px;
}
.tip {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  color: @color-text-dd;
}
.my-album {
  flex: 1;
  width: 1px;
  margin-right: 20px;
}
.my-collection {
  width: 700px;
  margin-left: 20px;
}
.list {
  height: 80%;
  margin-top: 0;
  overflow-y: scroll;
}
.disc-list {
  box-sizing: border-box;
  // padding-left: 30px;
  width: 700px;
}
.line {
  box-sizing: border-box;
  height: 70%;
  width: 1px;
  background-color: @color-line;
  margin: 130px 0;
}
.report{
  padding: 5px 10px;
  background-color: @color-theme;
  color: #fff;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  transition: .2s;
  position: absolute;
  margin-top: 5px;
}
.report:hover{
  box-shadow: 0 0 10px @color-theme;
  cursor: pointer;
}
.report-detail{
  position: absolute;
  width: 800px;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0,0,0,.2);
  z-index: 99;
  top: 70px;
  bottom: 50px;
  transition: .4s;
  h3{
    width: 100%;
    text-align: center;
    height: 20px;
    padding: 5px 0;
    position: absolute;
    font-size: 20px;
    font-weight: bold;
  }
  .report-content{
    width: 100%;
    height: 100%;
    padding-top: 30px;
  }
}
.report-detail-enter,.report-detail-leave-to{
  transform: translateX(-100%);
}
</style>
