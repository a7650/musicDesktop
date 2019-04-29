<template>
  <div class="recommend-list">
    <header>管理员推荐歌曲</header>
    <songList :songList="songList" v-if="songList.length" @selectSong="_selectSong"></songList>
    <loading class="loading" v-else></loading>
  </div>
</template>

<script>
import songList from "base/songList/songList";
import { getRecommend } from "api/recommend";
import loading from "base/loading/loading";
import { mapActions } from "vuex";
import {getSongVkey} from "api/song";
import { song } from "common/js/song";
export default {
  data() {
    return {
      songList: []
    };
  },
  components: {
    songList,
    loading
  },
  methods: {
    _selectSong(index) {
      this.selectSong({
        list: [...this.songList],
        index
      });
    },
    _getRecommend() {
      getRecommend().then(data => {
        this.songList = this.encaseSongList(data.songList);
      });
    },
    encaseSongList(list) {
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
      return result;
    },
    ...mapActions(["selectSong"])
  },
  created() {
    this._getRecommend();
  }
};
</script>

<style scoped lang="less">
.recommend-list {
  width: 900px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  margin-top: 20px;
  position: relative;
  box-sizing: border-box;
  padding-right: 30px;
}
header {
  text-align: center;
  font-size: 22px;
}
.loading {
  margin-left: -20px;
}
</style>
