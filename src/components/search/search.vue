<template>
  <div class="page-search">
    <div class="search">
      <div class="input-content">
        <input type="text" v-model="i_searchText" @focus="historyShow=true" @blur="historyHide">
        <button @click="_search">搜 索</button>
        <transition name="a">
          <div class="search-history" v-show="searchHistory.length&&historyShow">
          <ul>
            <li>
              <span class="title">搜索历史</span><span class="clear-all" @click="CLEAR_SEARCHHISTORY({flag:true})">清空</span>
            </li>
            <li v-for="(item,index) in searchHistory" :key="item">
              <span class="name" @click="_selectHistory(item)">{{item}}</span>
              <span class="clear" @click="_clearHistory(index)">
                <i class="icon-false"></i>
              </span>
            </li>
          </ul>
        </div>
        </transition>
      </div>
    </div>
    <div class="content">
      <div class="song-content">
        <h4 v-show="total">共搜索到{{total}}首歌曲</h4>
        <div class="zhida" v-if="zhida" @click="selectZhida">
          <div class="bg">
            <img
              :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${zhida.singermid}.jpg?max_age=2592000`"
              alt
            >
          </div>
          <div class="filter"></div>
          <div class="c">
            <img
              :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${zhida.singermid}.jpg?max_age=2592000`"
              alt
            >
            <div class="text">
              <h3 class="a">{{zhida.singername}}</h3>
              <h3 class="b">单曲:{{zhida.songnum}} 专辑:{{zhida.albumnum}}</h3>
            </div>
          </div>
        </div>
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

let timer = null;
const prePage = 15;
export default {
  name: "search",
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
      baseIndex: 1,
      historyShow: false
    };
  },
  computed: {
    ...mapGetters(["searchText", "searchHistory"])
  },
  components: {
    songList,
    loading,
    pageControl
  },
  methods: {
    _clearHistory(index) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      this.CLEAR_SEARCHHISTORY({ flag: false, index });
    },
    _selectHistory(val) {
      this.i_searchText = val;
      this.historyShow = false;
      this._search();
    },
    historyHide() {
      var self = this;
      timer = setTimeout(() => {
        self.historyShow = false;
      }, 100);
    },
    selectZhida() {
      this.$router.push({
        name: "singerDetail",
        params: {
          id: this.zhida.singermid + "_" + this.zhida.singername
        }
      });
    },
    _getMore(n) {
      search(this.i_searchText, n, prePage).then(data => {
        this.songList[n] = _encaseSongList(data.data.song.list);
      });
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
    initData() {
      this.songList = { 1: [] };
      this.currentPage = 1;
      this.zhida = null;
      this.baseIndex = 1;
      this.total = 0;
    },
    _search() {
      if (!this.i_searchText) return;
      this.loadingText = "正在搜索";
      this.initData();
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
        this.SAVE_SEARCHHISTORY(this.i_searchText);
      });
    },
    init(val) {
      if (val) {
        this.i_searchText = val;
        this.SET_SEARCHTEXT("");
        this._search();
      }
    },
    ...mapActions(["selectSong"]),
    ...mapMutations([
      "SET_SEARCHTEXT",
      "SAVE_SEARCHHISTORY",
      "CLEAR_SEARCHHISTORY"
    ])
  },
  created() {
    this.init(this.searchText);
  },
  watch: {
    currentPage(n, o) {
      if (!this.songList[n].length) {
        this._getMore(n);
      }
      this.baseIndex = (n - 1) * prePage + 1;
    },
    searchText(n, o) {
      this.init(n);
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
  padding-top: 70px;
  color: #000;
}
.search {
  width: 100%;
  height: 240px;
  position: relative;
  perspective:1000px;
  z-index: 99;
  background-color: @color-theme2;
  .input-content {
    position: absolute;
    top: 50%;
    margin-top: -20px;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    transform-style: preserve-3d;
    input {
      width: 500px;
      height: 40px;
      background-color: #fff;
      box-sizing: border-box;
      padding-left: 10px;
      border-radius: 20px;
    }
    button {
      width: 70px;
      height: 100%;
      // margin-top: -5px;
      background-color: @color-theme;
      border-radius: 20px;
      color: #fff;
      border: none;
      margin-left: 15px;
      box-shadow: 0 0 10px @color-theme;

    }
    button:hover {
      background-color: @color-theme;
      color: #fff;
      cursor: pointer;
    }
  }
}
.search-history {
  width: 470px;
  background-color: #fff;
  position: absolute;
  top: 39px;
  left: 50%;
  margin-left: -278px;
  border-top: 1px solid @color-line;
  z-index: 99;
  padding:5px 0;
  transform-origin:50% 0;
  transition: .3s;
  li {
    height: 25px;
    width: 100%;
    color: #000;
    span {
      display: block;
      height: 100%;
      line-height: 25px;
      float: left;
    }
    .name {
      text-align: left;
      width: 90%;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: @font-size-medium;
    }
    .clear {
      width: 10%;
      text-align: center;
      color:#fff;
    }
    .clear:hover {
      color: #000;
    }
  }
  li:first-child{
    height: 20px;
    font-size: 14px;
    color:@color-text-dd;
    text-align: center;
    line-height: 20px;
    span{
      line-height: 20px;
    }
    .title{
      width: 90%;
      box-sizing: border-box;
      padding-left: 10px;
      text-align: left;
    }
    .clear-all{
      width: 10%;
      box-sizing: border-box;
      padding-right: 10px;
      text-align: right;
    }
    .clear-all:hover{
      color: @color-theme;
    }
  }
  li:hover {
    background-color: @color-line;
    cursor: pointer;
  }
}

.content {
  width: 900px;
  margin: 0 auto;
  padding-bottom: 100px;
}
.song-content {
  width: 100%;
  position: relative;
  min-height: 400px;
  margin-top: 30px;
  h4 {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
    font-size: @font-size-large;
  }
}
.zhida {
  border-radius: 5px;
  width: 100%;
  height: 120px;
  // background-color: #fff;
  position: relative;
  overflow: hidden;
  .bg {
    width: 120%;
    height: 120%;
    position: absolute;
    top: -10%;
    left: -10%;
    filter: blur(10px);
    img {
      width: 100%;
      // height: 100%;
    }
  }
  .filter {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
  }
  .c {
    position: absolute;
    padding: 10px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    img {
      margin-bottom: 10px;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      // box-shadow: 0 0 20px @color-theme;
    }
    .text {
      height: 50px;
      h3 {
        width: 100%;
        height: 25px;
        text-align: center;
        line-height: 25px;
      }
      .a {
        font-size: @font-size-large-x;
        color: #fff;
      }
      .b {
        color: @color-text-l;
      }
    }
  }
}
.zhida:hover {
  cursor: pointer;
}

.a-enter,.a-leave-to{
  transform: rotateX(90deg);
  opacity: 0.3;
}

</style>
