<template>
  <div class="player">
    <div class="controls">
      <div class="btns">
        <button class="prev" @click="prevSong">
          <i class="icon-prev"></i>
        </button>
        <button class="play" @click="togglePlaying">
          <i :class="{'icon-pause':playing,'icon-play':!playing}"></i>
        </button>
        <button class="next" @click="nextSong">
          <i class="icon-next"></i>
        </button>
      </div>
      <div class="pic">
        <img v-if="!currentSong.image" :src="require('common/image/loading.jpg')">
        <img v-else :src="currentSong.image" alt>
      </div>
      <div class="detail">
        <div class="song-d">
          <span v-if="playList.length" class="name" v-html="currentSong.name"></span>
          <span v-else class="name">当前未选择歌曲</span>
          <span class="singer">{{currentSong.singer}}</span>
        </div>
        <div class="process-bar">
          <process-bar
            @turnProcess="turnProcess"
            :currentTime="currentTime"
            :duration="currentSong.duration"
          ></process-bar>
        </div>
      </div>
      <div class="other" @click="listShow=!listShow">
        <div class="icon play-mode" @click="toggleMode">
          <i :class="modeIcon"></i>
        </div>
        <div :class="{'active':miniList}" class="icon list" @click="miniList=!miniList">
          <div>
            <i class="icon-list"></i>
          </div>
          <div class="num">{{playList.length}}</div>
        </div>
      </div>
      <div class="download">
        <button @click="downLoad">下载</button>
        <div class="warn" v-if="warnShow">
          <div class="mes">
            你将进行下载，文件来自QQ音乐。
            <br>音频文件仅供内部交流用途，请勿外传，请勿用作商业用途。
            <br>支持正版，从你我做起。
            <br>
            <font>千万正版音乐海量无损曲库尽在QQ音乐。</font>
            <br>
            <a href="https://y.qq.com/" target="_blank">点击这里</a>
            前往QQ音乐听更多高品质音乐。
          </div>
          <div class="button">
            <div @click="warnShow=false">取消</div>
            <a
              :href="currentSong.src"
              @click="warnShow=false"
              :download="currentSong.name+'(来自QQ音乐).m4a'"
              target="_blank"
            >确定</a>
          </div>
        </div>
      </div>
    </div>
    <transition name="mini-list">
      <div class="mini-list" v-show="miniList">
        <header>
          <div class="icon">
            <i :class="modeIcon"></i>
          </div>
          <div class="title">播放列表({{playList.length}})</div>
        </header>
        <miniList @selectSong="selectSong" @deleteSong="_deleteSong"></miniList>
      </div>
    </transition>
    <audio
      id="audio"
      ref="audio"
      @ended="toggleSong"
      @timeupdate="timeupdate"
      @play="audioReadyPlay"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import processBar from "base/process-bar/process-bar";
import { shuffle } from "common/js/tools";
import { playMode } from "common/config";
import miniList from "base/miniList/miniList";
import { constants } from "fs";
// import {setPlayHistory} from "common/js/cache"
export default {
  data() {
    return {
      currentTime: "",
      readyPlay: false,
      ready: true,
      listShow: false,
      miniList: false,
      warnShow: false
    };
  },
  computed: {
    modeIcon() {
      return this.playMode === playMode.sequence
        ? "icon-list-loop"
        : this.playMode === playMode.loop
        ? "icon-song-loop"
        : "icon-list-random";
    },
    ...mapGetters([
      "playList",
      "currentSong",
      "currentIndex",
      "playing",
      "playMode",
      "sequenceList",
      "userStatus"
    ])
  },
  components: {
    processBar,
    miniList
  },
  methods: {
    downLoad() {
      if (!this.userStatus) {
        window.alert("登录之后可以下载，请先登录");
      } else if (!this.currentSong.src) {
        return;
      } else {
        this.warnShow = true;
      }
    },
    _deleteSong(index) {
      this.deleteSong(index);
    },
    selectSong(song, index) {
      this.SET_CURRENTINDEX(index);
    },
    toggleMode() {
      if (!this.playList.length) return;
      let m = (this.playMode + 1) % 3;
      let newList = null;
      if (m == playMode.random) {
        newList = shuffle(this.sequenceList);
      } else {
        newList = this.sequenceList;
      }
      this.resetIndex(newList);
      this.SET_PLAYMODE(m);
      this.SET_PLAYLIST(newList);
    },
    resetIndex(list) {
      let i = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.SET_CURRENTINDEX(i);
    },
    turnProcess(time) {
      this.currentTime = time;
      this.audio.currentTime = time;
    },
    nextSong() {
      if (!this.ready) {
        return;
      }
      if (this.playList.length === 1) {
        this.loopSong();
      } else if (this.currentIndex < this.playList.length - 1) {
        this.SET_CURRENTINDEX(this.currentIndex + 1);
      } else if (this.currentIndex === this.playList.length - 1) {
        this.SET_CURRENTINDEX(0);
      }
    },
    prevSong() {
      if (!(this.readyPlay && this.ready)) {
        return;
      }
      if (this.currentIndex > 0) {
        this.SET_CURRENTINDEX(this.currentIndex - 1);
        return;
      }
      //   if (this.currentIndex||this.playList.length === 1) {
      //     this.loopSong();
      //   }
    },
    togglePlaying() {
      this.SET_PLAYING(!this.playing);
    },
    loopSong() {
      this.currentTime = this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    toggleSong() {
      if (this.playMode === playMode.loop) {
        this.loopSong();
      } else {
        this.nextSong();
      }
    },
    timeupdate() {
      this.currentTime = this.$refs.audio.currentTime;
    },
    audioReadyPlay() {
      this.readyPlay = true;
    },
    initPlayer() {
      this.readyPlay = false;
      this.ready = false;
      this.currentTime = 0;
    },
    ...mapMutations([
      "SET_PLAYING",
      "SET_CURRENTINDEX",
      "SET_PLAYMODE",
      "SET_PLAYLIST"
    ]),
    ...mapActions(["deleteSong"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.playList.length) {
        this.initPlayer();
        this.$refs.audio.src = "";
        this.SET_PLAYING(false);
        return;
      }
      if (newSong.mid === oldSong.mid && newSong.id === oldSong.id) {
        return;
      }
      if (!newSong.mid || !newSong.src) {
        this.nextSong();
        return;
      } //！！！全部不存在src的时候会死循环
      this.initPlayer();
      this.$refs.audio.src = newSong.src;
      this.$refs.audio.play();
      this.SET_PLAYING(true);
      //   setPlayHistory(this.currentSong);
      if (this.timer2) {
        clearTimeout(this.timer2);
      }
      this.timer2 = setTimeout(() => {
        this.ready = true;
        this.timer2 = null;
      }, 1000);
    },
    playing() {
      this.$nextTick(() => {
        if (this.playing) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      });
    }
  },
  mounted() {
    this.audio = this.$refs.audio;
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.player {
  height: 50px;
  right: 0;
  left: 10px;
  position: fixed;
  z-index: 99;
  bottom: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  color: #000;
}
.controls {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  z-index: 99;
  position: absolute;
  .btns {
    min-width: 140px;
    button {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      color: #000;
      margin-right: 5px;
      background-color: transparent;
      border: none;
    }
    button:hover {
      cursor: pointer;
    }
    .prev,
    .next {
      font-size: 20px;
      color: #999;
      &:hover {
        color: #000;
      }
    }
    .play {
      font-size: 25px;
      color: #ff0000;
      &:hover {
        text-shadow: 0 0 2px #ff00008f;
      }
    }
  }
  .pic {
    width: 35px;
    height: 35px;
    // margin-right: 10px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 5px;
    }
  }
  .detail {
    width: 600px;
    height: 35px;
    display: flex;
    flex-direction: column;
    .no-wrap;
    .song-d {
      max-width: 400px;
      width: 100%;
      height: 20px;
      color: #000;
      box-sizing: border-box;
      padding-left: 10px;
      span {
        line-height: 20px;
        height: 20px;
        max-width: 200px;
        display: inline-block;
        .no-wrap;
      }
      .singer {
        flex: 1;
        color: @color-text-dd;
        font-size: @font-size-small-x;
      }
      .name {
        font-size: @font-size-medium;
        margin-right: 20px;
      }
    }
    .process-bar {
      width: 100%;
    }
  }
}
.other {
  user-select: none;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  i {
    font-size: 14px;
  }
  .icon {
    width: 30px;
    height: 30px;
    &:hover {
      cursor: pointer;
    }
    i {
      line-height: 30px;
      font-size: 25px;
    }
  }
  .list {
    width: 70px;
    div {
      font-size: 14px;
      float: left;
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
  }
  .icon.active {
    color: #ff0000;
  }
  .icon:hover {
    color: #ff0000;
  }
}
.mini-list {
  user-select: none;
  color: #fff;
  width: 600px;
  height: 300px;
  background-color: @color-theme2;
  position: absolute;
  bottom: 50px;
  left: 50%;
  margin-left: -300px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: 0.3s;
  header {
    width: 100%;
    height: 30px;
    background-color: @color-theme2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    & > div {
      float: left;
      line-height: 30px;
      text-align: center;
      height: 100%;
    }
    .icon {
      width: 10%;
    }
    .title {
      width: 80%;
      font-size: 15px;
    }
  }
}
.download {
  width: 60px;
  height: 30px;
  position: relative;
  button {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid @color-line;
    color: #000;
  }
  button:hover {
    background-color: @color-line;
    cursor: pointer;
  }
  .warn {
    position: absolute;
    width: 450px;
    height: 150px;
    top: -160px;
    left: -390px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    font {
      font-weight: bold;
    }
  }
  .mes {
    text-align: center;
    width: 100%;
    height: 120px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 10px;
    line-height: 20px;
  }
  .button {
    width: 100%;
    height: 30px;
    text-align: center;
    div,
    a {
      display: inline-block;
      width: 60px;
      height: 25px;
      background-color: @color-theme;
      color: #fff;
      line-height: 25px;
      border-radius: 3px;
      font-size: @font-size-small-x;
    }
    a {
      margin-left: 20px;
    }
    div:hover,
    a:hover {
      cursor: pointer;
      background-color: darken(@color-theme, 10%);
    }
  }
}
.mini-list-enter,
.mini-list-leave-to {
  transform: translateY(100%);
}
</style>
