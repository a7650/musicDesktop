<template>
  <div class="collect-rank">
    <div class="song-rank">
      <header>🏆歌曲收藏榜🏆</header>
      <div class="refresh">
        <span>每小时进行更新(前100位)</span>
        <img @click="refresh('song')" src="./refresh.png" title="点击刷新">
      </div>
      <chart
        @select="_CselectSong"
        :title="title1"
        :xAxisData="xAxisData1"
        :seriesData="seriesData1"
        :chartLoading="chartLoading1"
        yAxisName="收藏次数"
        formatter="《{b}》:收藏次数:{c}<br>点击即可播放该歌曲"
        width="600px"
        height="300px"
      ></chart>
      <songList @selectSong="_selectSong" :songList="songRank" v-if="songRank.length>0"></songList>
      <loading v-else></loading>
    </div>
    <div class="album-rank">
      <header>🏆歌单收藏榜🏆</header>
      <div class="refresh">
        <span>每小时进行更新(前100位)</span>
        <img @click="refresh('album')" src="./refresh.png" title="点击刷新">
      </div>
      <chart
        @select="_CselectAlbum"
        :title="title2"
        :xAxisData="xAxisData2"
        :seriesData="seriesData2"
        :chartLoading="chartLoading2"
        yAxisName="收藏次数"
        formatter="《{b}》:收藏次数:{c}<br>点击查看该歌单详情"
        width="600px"
        height="300px"
      ></chart>
      <div v-if="albumRank.length>0">
        <ul class="album-list">
          <li
            class="album"
            v-for="album in albumRank"
            :key="album.disstid"
            :title="'收藏次数:'+album.num"
            @click="selectAlbum(album)"
          >
            <div class="bg">
              <img :src="album.pic" alt>
              <div class="filter"></div>
            </div>
            <div class="nickname">{{album.nickname}}</div>
            <div class="dissname">{{album.dissname}}</div>
          </li>
        </ul>
      </div>
      <loading v-else></loading>
    </div>
    <float ref="float"></float>
  </div>
</template>

<script>
import songList from "base/songList/songList";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getSongRank, getAlbumRank } from "api/collectRank";
import { getSongVkey } from "api/song";
import chart from "components/chart/chart";
import { un_insertionSort2 } from "common/js/tools";
import loading from "base/loading/loading";
import { song } from "common/js/song";
export default {
  data() {
    return {
      songRank: [],
      albumRank: [],
      title1: "",
      xAxisData1: [],
      seriesData1: [],
      title2: "",
      xAxisData2: [],
      seriesData2: [],
      chartLoading1:false,
      chartLoading2:false
    };
  },
  components: {
    songList,
    chart,
    loading
  },
  methods: {
    refresh(s) {
      if (s === "song") {
        this.songRank = [];
        this.title1 = "";
        this._getSongRank();
      } else if (s === "album") {
        this.title2 = "";
        this.albumRank = [];
        this._getAlbumRank();
      }
    },
    _CselectSong(name) {
      let song = this.songRank.filter(item => item.name2 == name);
      if (!song[0].src) {
        this.float("该歌曲没有资源<br>换首别的吧^_^");
        return;
      }
      this.selectSong({
        list: song,
        index: 0
      });
    },
    _selectSong(index) {
      this.selectSong({
        list: [...this.songRank],
        index
      });
    },
    _getSongRank() {
      this.chartLoading1 = true;
      getSongRank().then(data => {
        if (data.songList.length) {
          this.songRank = this._encaseSongList(data.songList);
          this.chartLoading1 = false;
          this.title1 = "歌曲收藏榜";
        }
      })
    },
    _encaseSongList(list) {
      let result = [],
        _seriesData = [],
        _xAxisData = [];
      let Song = function(params) {};
      list.forEach((item, i) => {
        item.rank = item.num;
        _seriesData.push(item.num);
        _xAxisData.push(item.name);
        result.push(new song(item));
        let _song = result[i];
        getSongVkey(_song.mid).then(res => {
          let vkey = res.data.items[0].vkey;
          _song.src = vkey
            ? `http://dl.stream.qqmusic.qq.com/C400${
                _song.mid
              }.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
            : "";
          _song.name2 = _song.name;
          _song.name = vkey ? _song.name : `<del>${_song.name}(暂无音源)</del>`;
        });
      });
      // let [seriesData, xAxisData] = un_insertionSort2(_seriesData, _xAxisData);
      this.seriesData1 = _seriesData;
      this.xAxisData1 = _xAxisData;
      return result;
    },
    _CselectAlbum(name) {
      let n = this.albumRank.findIndex(item => item.nickname === name);
      if (n > -1) {
        this.selectAlbum(this.albumRank[n]);
      }
    },
    selectAlbum(album) {
      this.$router.push({
        name: "discDetail_rank",
        params: {
          id: album.disstid
        }
      });
    },
    _getAlbumRank() {
      this.chartLoading2 = true;
      getAlbumRank().then(data => {
        if (data.albumList.length) {
          this.albumRank = data.albumList;
          let _seriesData = [],
            _xAxisData = [];
          this.albumRank.forEach(album => {
            _seriesData.push(album.num);
            _xAxisData.push(album.nickname);
          });
          this.seriesData2 = _seriesData;
          this.xAxisData2 = _xAxisData;
          this.chartLoading2 = false;
          this.title2 = "歌单收藏榜";
        }
      });
    },
    ...mapActions(["selectSong"])
  },
  created() {
    this._getSongRank();
    this._getAlbumRank();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.collect-rank {
  //   position: absolute;
  padding: 70px 0 100px;
  overflow: hidden;
  color: #000;
  width: 1200px;
  margin: 0 auto;
}
.song-rank,
.album-rank {
  width: 600px;
  float: left;
  position: relative;
  min-height: 900px;
}

header {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  text-align: center;
  padding: 20px 0 0;
}
.refresh {
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: @color-text-dd;
  font-size: @font-size-medium;
  span {
    // float: left;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }
  img {
    // float: left;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    transform-origin: center;
    transition: 1s;
  }
  img:hover {
    cursor: pointer;
    transform: rotate(360deg);
  }
}
.album-list {
  width: 100%;
}
.album {
  color: #fff;
  width: 460px;
  height: 120px;
  border-bottom: 20px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 20px;
  border-radius: 5px;
  transition: 0.2s;
  transform-origin: center;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    img {
      width: 100%;
    }
    .filter {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .nickname,
  .dissname {
    position: relative;
    box-sizing: border-box;
    padding: 0 30px;
    width: 100%;
    text-align: center;
    .no-wrap;
  }
  .nickname {
    font-size: 26px;
    margin-top: 28px;
  }
  .dissname {
    margin-top: 10px;
  }
}
.album:hover {
  cursor: pointer;
  box-shadow: 0 0 10px #000;
  transform: scale(1.1);
}
</style>
