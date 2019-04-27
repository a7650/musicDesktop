<template>
  <transition name="player">
    <div class="fullscreen-player">
      <div class="bg">
        <img class="_bg" :src="currentSong.image" alt>
        <div class="filter"></div>
      </div>
      <header>
        <i class="icon-down" title="收起全屏" @click="closeFull"></i>
      </header>
      <div class="content">
        <img class="cover" :src="currentSong.image" alt>
        <div class="right">
          <h3 class="name" v-html="currentSong.name"></h3>
          <h3 class="singer" v-html="currentSong.singer"></h3>
          <div class="lyric">
            <ul v-show="LyricList" ref="LyricList">
              <li
                v-for="item in LyricList"
                :class="{'active':item.line===curLyric_l}"
                :key="item.line"
              >{{item.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="l">
          <processBar
            class="process-bar"
            @turnProcess="turnProcess"
            :currentTime="currentTime"
            :duration="currentSong.duration"
          ></processBar>
        </div>
        <div class="r btns">
          <button class="prev" @click="prevSong">
            <i class="icon-prev"></i>
          </button>
          <button class="play" @click="togglePlaying">
            <i :class="{'icon-pause2':playing,'icon-play2':!playing}"></i>
          </button>
          <button class="next" @click="nextSong">
            <i class="icon-next"></i>
          </button>
          <button class="play-mode" @click="toggleMode">
            <i :class="modeIcon"></i>
          </button>
          <button class="list" @click="listShow=!listShow">
            <div>
              <i class="icon-list"></i>
            </div>
            <div class="num">{{playList.length}}</div>
          </button>
          <button class="fav" @click="setFavorite(currentSong)">
            <i class="icon-favorite" v-show="favoriteIcon"></i>
            <i class="icon-unfavorite" v-show="!favoriteIcon"></i>
          </button>
        </div>
      </div>
      <transition name="play-list">
        <div class="play-list" v-show="listShow">
          <div class="title">播放列表({{playList.length}})</div>
          <miniList @selectSong="selectSong" @deleteSong="deleteSong"></miniList>
      </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import processBar from "base/process-bar/process-bar";
import { mapGetters, mapMutations } from "vuex";
import { isFavorite } from "common/js/favorite";
import miniList from "base/miniList/miniList"
export default {
  props: ["curLyric_l", "Lyric", "currentTime", "modeIcon"],
  data() {
    return {
      listShow:false
    };
  },
  components:{
    processBar,miniList
  },
  computed: {
    LyricList() {
      return this.Lyric && this.Lyric.textContent;
    },
    favoriteIcon() {
      let mid = this.favoriteMid;
      return isFavorite(this.currentSong.mid)
        // ? "icon-favorite"
        // : "icon-unfavorite";
    },
    ...mapGetters(["currentSong", "playing", "playList", "favoriteMid"])
  },
  methods: {
    deleteSong(){
      this.$emit("deleteSong")
    },
    selectSong(index){
      this.$emit("selectSong",index)
    },
    prevSong() {
      this.$emit("prevSong");
    },
    togglePlaying() {
      this.$emit("togglePlaying");
    },
    nextSong() {
      this.$emit("nextSong");
    },
    toggleMode() {
      this.$emit("toggleMode");
    },
    turnProcess(time) {
      this.$emit("turnProcess", time);
    },
    setFavorite(song) {
      if (!song.src) {
        return;
      }
      let m = isFavorite(song.mid);
      if (m) {
        this.DELETE_FAVORITE(song);
      } else {
        this.ADD_FAVORITE(song);
      }
    },
    closeFull() {
      this.$emit("closeFull");
    },
    ...mapMutations(["ADD_FAVORITE", "DELETE_FAVORITE"])
  },
  created() {
    this.$emit("con");
  },
  watch: {
    curLyric_l(n, o) {
      this.$nextTick(() => {
        let line = n < 6 ? 1 : n - 4,
          y = `translateY(${(1 - line) * 50}px)`;
        this.$refs.LyricList.style.transform = y;
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: #000;
  min-width: 1200px;
  color: #fff;
  //   display: flex;
  //   flex-direction: column;
  overflow: hidden;
  transition: 0.3s;
}
header {
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 20px;
  position: relative;
  i {
    width: 50px;
    height: 50px;
    display: inline-block;
    line-height: 50px;
    color: #fff;
    opacity: 0.4;
    font-size: 30px;
    transition: 0.3s;
  }
  i:hover {
    cursor: pointer;
    opacity: 1;
    transform: translateY(10px);
  }
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  ._bg {
    position: absolute;
    width: 120%;
    height: 120%;
    top: -10%;
    left: -10%;
    filter: blur(40px);
  }
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.content {
  position: absolute;
  width: 100%;
  top: 50px;
  bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .cover {
    width: 400px;
    height: 400px;
  }
  .right {
    width: 400px;
    margin-left: 100px;
    .name {
      height: 50px;
      font-size: @font-size-large-x;
    }
    .singer {
      height: 40px;
      font-size: @font-size-medium-x;
    }
  }
}
.lyric {
  height: 600px;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  ul {
    transition: 0.3s;
  }
  li {
    height: 50px;
    line-height: 50px;
    color: rgba(255, 255, 255, 0.4);
    transition: .2s;
    transform-origin: left center;
    .no-wrap;
  }
  .active {
    color: #fff;
    transform: scale(1.2);
  }
}
.controls {
  box-sizing: border-box;
  padding: 0 50px;
  width: 100%;
  min-width: 1200px;
  position: absolute;
  bottom: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  .l {
    flex: 1;
    height: 20px;
    margin-right: 20px;
  }
  .r {
    height: 100%;
  }
}
.process-bar {
  /deep/ .process {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.btns {
  i {
    color: #fff;
  }
  button {
    width: 40px;
    height: 100%;
    color: #000;
    margin-right: 5px;
    background-color: transparent;
    border: none;
    float: left;
  }
  button:hover {
    cursor: pointer;
  }
  button:not(.fav):hover i {
    color: @color-theme;
  }
  .prev,
  .next {
    font-size: 20px;
  }
  .play {
    font-size: 25px;
  }
  .play-mode {
    i {
      font-size: 25px;
    }
  }
  .list {
    width: 60px;
    div {
      float: left;
      width: 50%;
      font-size: 25px;
      line-height: 50px;
    }
    .num {
      font-size: 20px;
      color: #fff;
    }
  }
  .fav {
    i {
      font-size: 20px;
    }
    i.icon-favorite {
      color: #ff0000;
    }
  }
  .icon-favorite,.icon-unfavorite{
    display: block;
     animation: fav .4s;
  }
  .icon-unfavorite:hover{
    color: #ff0000;
  }
}

.play-list{
  width: 400px;
  // height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 50px;
  z-index: 99;
  background-color: rgba(0, 0, 0, .6);
  transition: .3s;
  .title{
    height: 30px;
    text-align: center;
    color: #fff;
    line-height: 30px;
  }

}

.play-list-enter,.play-list-leave-to{
  transform: translateX(100%);
}

.player-enter,
.player-leave-to {
  transform: translateY(130%);
  opacity: 0;
}
// .fav-enter-to{
//     opacity: 0;
// }
@keyframes fav {
  0% {
    transform: scale(0);
    // opacity: 0;
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>
