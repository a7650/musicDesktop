<template>
  <div class="page-search" @click="toolsShow=false">
    <div class="storage">
      <header>暂存列表({{storage.length}})</header>
      <ul class="content">
        <li v-for="(song,index) in storage" :key="song.id">
          <span class="name">{{song.name}}</span>
          <span class="singer">{{song.singer}}</span>
          <span class="delete" @click="_delete(index)">
            <i class="icon-false"></i>
          </span>
        </li>
      </ul>
      <div class="control">
        <button class="commit" @click="_addAll">提交全部</button>
      </div>
    </div>
    <div class="right">
      <div class="search">
        <header>管理员</header>
        <h4>进行搜索，并添加歌曲，添加的歌曲将会在客户端首页推荐</h4>
        <div class="input-content">
          <input type="text" v-model="i_searchText">
          <button @click="_search">搜 索</button>
        </div>
      </div>
      <div class="content">
        <div class="song-content">
          <h4 v-show="total">共搜索到{{total}}首歌曲</h4>
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
        <!-- <login></login> -->
      </div>
      <div class="tools" :style="{'left':toolX+'px','top':toolY+'px'}" v-show="toolsShow">
        <div clas="add" @click="_addSingle">添加该歌曲</div>
        <div class="push" @click="push">添加到暂存列表</div>
      </div>
    </div>
    <float ref="float"></float>
  </div>
</template>

<script>
import { _encaseSongList } from "common/js/song";
import { search } from "api/search";
import songList from "base/songList/songList";
import loading from "base/loading/loading";
import pageControl from "base/pageControl/pageControl";
import login from "components/login/login";
import { addSingle, addAll } from "api/adm";

let timer = null;
const prePage = 15;
export default {
  name: "adm",
  data() {
    return {
      songList: {
        1: []
      },
      currentPage: 1,
      i_searchText: "",
      loadingText: "在输入框中输入信息进行查找",
      total: 0,
      pageNum: 1,
      nowNum: 0,
      baseIndex: 1,
      toolsShow: false,
      toolX: 0,
      toolY: 0,
      storage: []
    };
  },
  components: {
    songList,
    loading,
    pageControl,
    login
  },
  methods: {
    _addAll() {
      let m = addAll(this.storage).then(data => {
        if (data.type === 1) {
          this.float(data.mes);
          this.storage = [];
        }
      });
    },
    _delete(index) {
      this.storage.splice(index, 1);
    },
    _addSingle() {
      addSingle(this._song).then(data => {
        if (data.type) {
          this.float(data.mes);
        }
        this._song = null;
      });
    },
    push() {
      let n = this.storage.findIndex(item => item.id === this._song.id);
      if (n > -1) {
        this.float("不能添加重复的歌曲");
        return;
      }
      this.storage.push(this._song);
      this._song = null;
    },
    _getMore(n) {
      search(this.i_searchText, n, prePage).then(data => {
        this.songList[n] = _encaseSongList(data.data.song.list);
      });
    },
    selectPage(n) {
      this.currentPage = n;
    },
    _selectSong(index, e) {
      this._song = Object.assign({}, this.songList[this.currentPage][index], {
        src: ""
      });
      this.toolX = e.pageX + 5;
      this.toolY = e.pageY + 5;
      this.toolsShow = true;
    },
    initData() {
      this.songList = { 1: [] };
      this.currentPage = 1;
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
      });
    },
    init(val) {
      if (val) {
        this.i_searchText = val;
        this.SET_SEARCHTEXT("");
        this._search();
      }
    }
    // ...mapActions(["selectSong"])
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
  },
  created() {
    this._song = null;
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.page-search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  min-width: 1200px;
}
.storage {
  user-select: none;
  width: 300px;
  height: 100%;
  float: left;
  background-color: rgb(235, 235, 235);
  border-right: 1px solid @color-line;
  display: flex;
  flex-direction: column;
  header {
    width: 100%;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 40px;
    //   color: @color-theme;
  }
  .content {
    width: 100%;
    flex: 1;
    overflow-y: scroll;
  }
  .control {
    height: 50px;
    width: 100%;
    border-top: 1px solid @color-line;
    line-height: 50px;
    text-align: center;
    button {
      width: 80px;
      height: 30px;
      color: #fff;
      background-color: @color-theme;
      border: none;
      border-radius: 15px;
    }
    button:hover {
      box-shadow: 0 0 10px @color-theme;
      cursor: pointer;
    }
  }
  li {
    box-sizing: border-box;
    padding: 0 5px 0 10px;
    width: 100%;
    height: 30px;
  }
  li:hover {
    background-color: @color-line;
    cursor: pointer;
  }
  .name,
  .singer,
  .delete {
    display: block;
    float: left;
    line-height: 30px;
    height: 100%;
    .no-wrap;
  }
  .name {
    font-size: 22px;
    width: 60%;
  }
  .singer {
    width: 30%;
    color: @color-text-dd;
    font-size: 18px;
  }
  .delete {
    font-size: 18px;
    width: 10%;
    text-align: center;
  }
  .delete:hover {
    color: #ff0000;
  }
}
.right {
  background-color: @color-background-d;
  overflow-y: scroll;
  height: 100%;
}
.search {
  width: 100%;
  height: 240px;
  position: relative;
  z-index: 99;
  background-color: @color-theme2;
  header {
    width: 100%;
    color: #fff;
    font-size: 40px;
    text-align: center;
    padding-top: 20px;
    color: @color-theme;
  }
  h4 {
    text-align: center;
    color: #fff;
    margin-top: 10px;
  }
  .input-content {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
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
.tools {
  width: 120px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  user-select: none;
  border-radius: 3px;
  animation: tools 0.2s;
  transition-duration: 0.2s;
  transform-origin: left top;
  div {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    .no-wrap;
  }
  div:hover {
    cursor: pointer;
    background-color: @color-theme;
    color: #fff;
  }
  .add {
    border-bottom: 1px solid @color-line;
  }
}
@keyframes tools {
  from {
    transform: scale(0.1);
  }
  to {
    transform: scale(1);
  }
}
</style>
