<template>
  <div class="singer-detail">
    <header>
      <div class="pic">
        <img
          :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`"
          alt
        >
      </div>
      <div class="text-content">
        <h3 class="name">{{name}}</h3>
        <h4 class="country">{{country}}</h4>
        <h5 class="num">
          单曲
          <span>{{total}}</span>
          <font v-if="albumNum>0">专辑</font>
          <span>{{albumNum}}</span>
        </h5>
        <div class="button">
          <button class="play" @click="randomPlay">
            <i class="icon-play2"></i> 随机播放
          </button>
          <!-- <button class="collect" @click="collectAlbum">
            <i :class="{'icon-unfavorite':!isCollect,'icon-favorite':isCollect}"></i> {{isCollect?"已收藏":"收藏"}}
          </button>-->
        </div>
      </div>
    </header>
    <div class="song-content">
      <songList
        @selectSong="_selectSong"
        :baseIndex="baseIndex"
        :songList="songList[currentPage]"
        v-if="songList[currentPage].length>0"
      ></songList>
      <loading  v-else></loading>
    </div>

    <pageControl
      v-if="songList[1].length>0&&pageNum>1"
      :currentPage="currentPage"
      :pageNum="pageNum"
      @selectPage="selectPage"
    ></pageControl>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { shuffle } from "common/js/tools";
import { getSongList } from "api/singer";
import { _encaseSongList } from "common/js/song";
import { search } from "api/search";
import songList from "base/songList/songList";
import loading from "base/loading/loading";
import pageControl from "base/pageControl/pageControl";
const unitSongs = 30;
export default {
  name: "singerDetail",
  data() {
    return {
      songList: {
        1: []
      },
      total: 0,
      currentPage: 1,
      pageNum: 1,
      nowNum: 0,
      albumNum: "",
      mid: "",
      name: "",
      country: "",
      baseIndex: 1
    };
  },
  components: {
    songList,
    loading,
    pageControl
  },
  computed: {
    hasMore() {
      return this.nowNum < this.total;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    selectPage(n){
        this.currentPage = n;
    },
    _selectSong(index, filterList) {
      this.selectSong({
        list: [...this.songList[this.currentPage]],
        index
      });
    },
    randomPlay() {
      let randomList = shuffle(this.songList[this.currentPage]);
      this.selectSong({
        list: randomList,
        index: 0
      });
    },
    _getSongList() {
      getSongList(this.mid, 0, unitSongs).then(data => {
        this.total = data.total;
        this.pageNum = Math.ceil(data.total / unitSongs);
        this.nowNum = Math.min(this.total, unitSongs);
        for (var i = 2; i < this.pageNum + 1; i++) {
          this.$set(this.songList, i, []);
        }
        this.songList[1] = _encaseSongList(data.list, "musicData");
      });
    },
    _getAlbumNum() {
      search(this.name, 1, 1, 1).then(data => {
        this.albumNum = data.data.zhida.albumnum;
      });
    },
    _getMore(n) {
      getSongList(this.mid, (n - 1) * unitSongs, unitSongs).then(data => {
        let newList = _encaseSongList(data.list, "musicData");
        this.songList[n] = newList;
        // console.log(this.songList)
      });
    },
    ...mapActions(["selectSong"])
  },
  watch: {
    currentPage(n, o) {
      // console.log(n,o)
      if (!this.songList[n].length) {
        this._getMore(n);
      }
      this.baseIndex = (this.currentPage - 1) * unitSongs + 1;
    }
  },
  created() {
    let params = this.$route.params.id.split("_");
    this.mid = params[0];
    this.name = params[1];
    this.country = decodeURIComponent(params[2]);
    this._getSongList();
    this._getAlbumNum();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.singer-detail {
  padding-top: 110px;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
}
header {
  width: 900px;
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
    h3 {
      font-size: 40px;
      height: 50px;
    }
    h4,
    h5 {
      //   height: 30px;
      line-height: 30px;
      font-size: @font-size-large;
      flex: 1;
    }
    h5 span {
      font-size: @font-size-large-xx;
      margin-right: 30px;
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
    }
  }
}

.song-content {
  width: 900px;
  max-height: 1600px;
  min-height: 300px;
  margin-top: 30px;
  position: relative;
}
</style>
