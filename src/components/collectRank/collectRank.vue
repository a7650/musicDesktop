<template>
  <div class="collect-rank">
    <div class="song-rank">
      <header>歌曲收藏榜</header>
      <songList @selectSong="_selectSong" :songList="songRank" v-if="songRank.length>0"></songList>
    </div>
    <div class="album-rank">
      <header>歌单收藏榜</header>
    </div>
  </div>
</template>

<script>
import songList from "base/songList/songList";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getSongRank, getAlbumRank } from "api/collectRank";
import {getLyric} from "common/js/song"
import { getSongVkey } from 'api/song'
export default {
  data() {
    return {
      songRank: [],
      albumRank: []
    };
  },
  components: {
    songList
  },
  methods: {
    _selectSong(index) {
      this.selectSong({
        list: [...this.songRank],
        index
      });
    },
    _getSongRank() {
      getSongRank().then(data => {
        if(data.songList.length){
            this.songRank = this._encaseSongList(data.songList);
            console.log(this.songRank)
        }
      });
    },
    _encaseSongList(list){
        let result = [];
        list.forEach(song => {
            song.getLyric = getLyric;
            getSongVkey(song.mid).then((res) => {
                let vkey = res.data.items[0].vkey;
                song.src = vkey ? `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}` : "";
                song.name = vkey ? song.name : `<del>${song.name}(暂无音源)</del>`
                result.push(song)
            })
        });
        return result
    },
    _getAlbumRank() {
      getAlbumRank().then(data => {
        this.albumRank = data.albumList;
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
  color: #000;
  width: 1200px;
  margin: 0 auto;
}
.song-rank {
  width: 600px;
  float: left;
}
.album-rank {
  width: 600px;
  float: left;
}
header {
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  text-align: center;
  padding: 10px 0;
}
</style>
