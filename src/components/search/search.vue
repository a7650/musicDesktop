<template>
  <div class="page-search">
    <div class="search">
      <div class="bg"></div>
      <div class="input-content">
        <input type="text" v-model="i_searchText">
        <button @click="_search">搜索</button>
      </div>
    </div>
    <div class="content">
      <div class="song-content">
        <h4 v-show="total">共搜索到{{total}}首歌曲</h4>
        <div class="zhida" v-show="zhida" @click="selectZhida">{{zhida}}</div>
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
      loadingText: "在输入框中输入信息进行查找",
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
    selectZhida(){
      this.$router.push({
         name: "singerDetail",
        params: {
          id:
            this.zhida.singermid +
            "_" +
            this.zhida.singername 
        }
      })
    },
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
    initData(){
      this.songList = {1:[]}
      this.currentPage = 1
      this.zhida = null
      this.baseIndex = 1
      this.total = 0
    },
    _search() {
      if(!this.i_searchText)return;
      this.loadingText = "正在搜索";
      this.initData()
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
    init(val){
      if (val) {
      this.i_searchText = val;
      this.SET_SEARCHTEXT("");
      this._search();
    }
    },
    ...mapActions(["selectSong"]),
    ...mapMutations(["SET_SEARCHTEXT", "SAVE_SEARCHHISTORY"])
  },
  created() {
    this.init(this.searchText)
  },
  watch: {
    currentPage(n, o) {
      if (!this.songList[n].length) {
        this._getMore(n);
      }
      this.baseIndex = (n - 1) * prePage + 1;
    },
    searchText(n,o){
      this.init(n)
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
  width: 100%;
  height: 300px;
  position: relative;
  .bg{
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 100%;
    background: url('./bg.jpg') no-repeat;
    background-size: cover;
    filter: blur(50px)
  }
  .input-content{
    position: absolute;
    top: 50%;
    margin-top: -20px;
    width: 100%;
    height: 40px;
    text-align: center;
    input{
      width: 500px;
      height: 40px;
      border-radius: 3px;
      background-color: #fff;
      box-sizing: border-box;
      padding-left: 10px;
    }
    button{
      width: 70px;
      height: 40px;
      background-color: #fff;
      border-radius: 3px;
      margin-left: 20px;
      border: none;
    }
    button:hover{
      background-color: @color-theme;
      color: #fff;
      cursor: pointer;
    }
  }
}
.content {
  width: 900px;
  margin: 0 auto;
  padding-bottom: 100px;
}
.song-content{
    width: 100%;
    position: relative;
    min-height: 700px;
    h4{
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
    }
}
</style>
