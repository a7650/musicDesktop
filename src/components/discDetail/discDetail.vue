<template>
  <div class="disc-detail" v-if="show">
    <header>
      <div class="pic">
        <img :src="pic" alt="专辑封面">
      </div>
      <div class="text-content">
        <h3 v-html="nickname"></h3>
        <h4>{{dissname}}</h4>
        <div class="tags">
          标签：
          <span v-for="(tag,index) in tags" :key="index">{{tag.name}}</span>
        </div>
        <div class="hot">播放量：{{hot}}</div>
        <div class="button">
          <button class="play" @click="randomPlay">
            <i class="icon-play2"></i> 随机播放
          </button>
          <button class="collect" @click="collectAlbum">
            <i :class="{'icon-unfavorite':!isCollect,'icon-favorite':isCollect}"></i> {{isCollect?"已收藏":"收藏"}}
          </button>
        </div>
      </div>
    </header>
    <div class="song-content">
      <div class="left">
        <songList @selectSong="_selectSong" :songList="songList" v-if="songList.length>0"></songList>
      </div>
      <div class="right">
        <h3>简介</h3>
        <p v-html="desc"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getDiscSongList } from "api/recommend";
import { mapGetters, mapActions,mapMutations } from "vuex";
import { _encaseSongList } from "common/js/song";
import { formateHot, shuffle } from "common/js/tools";
import songList from "base/songList/songList";
import {
  setCollectAlbum,
  deleteCollectAlbum,
  isCollect
} from "common/js/cache";
export default {
  name: "discDetail",
  data() {
    return {
      songList: [],
      hot: "",
      nickname: "",
      dissname: "",
      desc: "",
      tags: [],
      songnum: null,
      pic: "",
      show: false,
      isCollect:false
    };
  },
  components: {
    songList
  },
  computed: {
    ...mapGetters(["singer"])
  },
  methods: {
    collectAlbum(){
      if(this.isCollect){
        this._deleteAlbum()
      }else{
        this._collectAlbum()
      }
    },
    _collectAlbum() {
      let m = setCollectAlbum({
        pic: this.singer.pic,
        nickname:this.nickname,
        dissname: this.dissname,
        disstid: this.disstid,
        collectAlbum: true
      });
      if (m.type === 1) {
        this.isCollect = true;
        this.REFRESH_COLLECTALBUM();
      }
    },
    _deleteAlbum() {
      let m = deleteCollectAlbum(this.disstid);
      if (m.type === 1) {
        this.isCollect = false;
        this.REFRESH_COLLECTALBUM();
      }
    },
    randomPlay() {
      let randomList = shuffle(this.songList);
      this.selectSong({
        list: randomList,
        index: 0
      });
    },
    _selectSong(index, filterList) {
      this.selectSong({
        list: [...this.songList],
        index
      });
    },
    _getDiscSongList() {
      getDiscSongList(this.$route.params.id).then(data => {
        this.songList = _encaseSongList(data.songlist);
        this.hot = formateHot(data.visitnum);
        this.nickname = data.nickname;
        this.dissname = data.dissname;
        this.desc = data.desc;
        this.tags = data.tags;
        this.songnum = data.songnum;
        this.pic = data.logo;
        this.show = true;
        this.disstid = data.disstid;
        this.isCollect = isCollect(this.disstid) ? true : false;
        // console.log(this.songList);
        // console.log(data)
      });
    },
    ...mapMutations(["REFRESH_COLLECTALBUM"]),
    ...mapActions(["selectSong"])
  },
  created() {
    this._getDiscSongList();
    // console.log(this.singer)
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.disc-detail {
  padding-top: 110px;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  header {
    width: 1200px;
    height: 250px;
    display: flex;
    .pic {
      width: 250px;
      img {
        width: 250px;
        height: 250px;
      }
    }
    .text-content {
      height: 100%;
      box-sizing: border-box;
      padding: 30px 0;
      margin-left: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    h3 {
      font-size: 40px;
      height: 50px;
    }
    h4 {
      height: 30px;
      color: @color-text-dd;
      line-height: 30px;
    }
    .tags {
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
      span {
        margin-right: 10px;
      }
    }
    .hot {
      flex: 1;
      margin-top: 5px;
      font-size: @font-size-medium;
    }
    .button {
      height: 40px;
      button {
        color: #fff;
        height: 100%;
        width: 120px;
        margin-right: 20px;
        border: none;
        border-radius: 3px;
      }
      .play {
        background-color: @color-theme;
      }
      .play:hover {
        cursor: pointer;
        background-color: darken(@color-theme, 5%);
      }
      .collect {
        color: #000;
        border: 1px solid @color-text-d;
        background-color: transparent;
        background-color: #fff;
      }
      .collect:hover {
        cursor: pointer;
        background-color: darken(#fff, 7%);
      }
      .icon-favorite{
        color: #ff0000;
      }
    }
  }
  .song-content {
    width: 1200px;
    margin: 30px 0 50px;
    .left,
    .right {
      float: left;
    }
    .left {
      width: 850px;
      margin-right: 50px;
    }
    .right {
      box-sizing: border-box;
      padding-top: 50px;
      width: 300px;
      max-height: 400px;
      overflow-y: scroll;
      overflow-x: hidden;
      h3 {
        font-size: 20px;
        margin-bottom: 30px;
      }
      p {
        color: @color-text-dd;
        line-height: 25px;
        br {
          line-height: 60px;
        }
      }
    }
  }
}
</style>
