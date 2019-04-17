<template>
  <div class="page-search">
    <div class="search">
      <input type="text" v-model="i_searchText">
    </div>
    <div class="content">
      <div class="song-content">
        <songList
          @selectSong="_selectSong"
          :baseIndex="baseIndex"
          :songList="songList[currentPage]"
          v-if="songList[currentPage].length>0"
        ></songList>
        <loading :loadingText="loadingText" v-else></loading>
      </div>

      <pageControl
        v-if="songList[1].length>0&&pageNum>1"
        :currentPage="currentPage"
        :pageNum="pageNum"
        @selectPage="selectPage"
      ></pageControl>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { _encaseSongList } from "common/js/song";
import { search } from "api/search";
import songList from "base/songList/songList";
import loading from "base/loading/loading";
import pageControl from "base/pageControl/pageControl";
import { constants } from "fs";

const prePage = 30;
export default {
    name:"search",
  data() {
    return {
      songList: {
        1: []
      },
      currentPage: 1,
      i_searchText: "",
      loadingText: "正在加载",
      zhida: null,
      total: 0,
      pageNum: 1,
      nowNum: 0,
      baseIndex: 1
    };
  },
  computed: {
    ...mapGetters(["searchText"])
  },
  components: {
    songList,
    loading,
    pageControl
  },
  methods: {
      _getMore(n){
          search(this.i_searchText, n, prePage).then(data => {
              this.songList[n] = _encaseSongList(data.data.song.list)
          })
      },
    selectPage(n) {
      this.currentPage = n;
    },
    _selectSong(index, filterList) {
      this.selectSong({
        list: [...this.songList[this.currentPage]],
        index
      });
    },
    _search() {
      this.loadingText = "正在搜索";
      search(this.i_searchText, 1, prePage, 1).then(data => {
        let song = data.data.song;
        if (data.code !== 0 || !song.list.length) {
          this.loadingText = `搜索不到《${this.i_searchText}》,换个试试吧`;
          return;
        }
        this.total = parseInt(song.totalnum);
        this.nowNum = Math.min(this.total, prePage);
        this.pageNum = Math.ceil(this.total / prePage);
        for (var i = 2; i < this.pageNum + 1; i++) {
          this.$set(this.songList, i, []);
        }
        this.songList[1] = _encaseSongList(song.list);
        if (data.data.zhida.type === 2) {
          this.zhida = data.data.zhida;
        }
        this.SAVE_SEARCHHISTORY(this._searchText);
      });
    },
    ...mapActions(["selectSong"]),
    ...mapMutations(["SET_SEARCHTEXT", "SAVE_SEARCHHISTORY"])
  },
  created() {
    if (this.searchText) {
      this.i_searchText = this.searchText;
      this.SET_SEARCHTEXT("");
      this._search();
    }
  },
  watch: {
    currentPage(n, o) {
      if (!this.songList[n].length) {
        this._getMore(n);
      }
      this.baseIndex = (n - 1) * prePage + 1;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.page-search {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  box-sizing: border-box;
  padding-top: 80px;
  color: #000;
}
.search {
}
.content {
  width: 900px;
  margin: 0 auto;
  padding-bottom: 100px;
}
.song-content{
    width: 100%;
    position: relative;
    min-height: 300px;
}
</style>
