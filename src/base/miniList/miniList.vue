<template>
  <div class="_mini-list">
    <button @click="clear=!clear" v-text="clear?'恢复':'清空列表'"></button>
    <transition-group tag="ul" name="minilist" :class="false" @before-leave="beforeLeave" @enter="enter" @before-enter="beforeEnter">
      <li
        :class="{'c-song':(currentSong && song.id === currentSong.id)}"
        v-for="(song,index) in _playList"
        :key="song.mid"
        @click="_selectSong(song,index)"
        :data-index="index"
      >
        <span class="song-name" v-html="song.name"></span>
        <span class="singer" v-html="song.singer"></span>
        <span class="icon">
          <i :class="favoriteIcon(song)" @click.stop="setFavorite(song)"></i>
          <i class="icon-false" @click.stop="deleteSong(index)"></i>
        </span>
      </li>
    </transition-group>
    <float ref="float"></float>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { isFavorite } from "common/js/favorite";

export default {
  data() {
    return {
      clear: false
    };
  },
  computed: {
    _playList() {
      return this.clear ? [this.currentSong] : this.playList;
    },
    ...mapGetters([
      "userStatus",
      "playList",
      "currentIndex",
      "currentSong",
      "favoriteMid",
      "miniListFav"
    ])
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      // el.style.height = 0
      // el.style.width = 0
      el.style.transform = "scale(.1)"
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 10
      setTimeout(function () {
        el.style.transition = ".4s";
        el.style.opacity = 1;
         el.style.transform = "scale(1)"
        // el.style.height = "40px";
        // el.style.width = "100%";
        done()
      }, delay)
    },
    beforeLeave: function (el) {
      var delay = el.dataset.index * 10
      setTimeout(function () {
        el.style.transition = ".6s";
        el.style.opacity = 0;
        el.style.top = "20px";
        // el.style.transform = "scale(.4)";
        // el.style.height = "0";
        // el.style.width = "0";
      }, delay)
    },
    favoriteIcon(song) {
      let m = this.miniListFav[song.mid];
      return {
        "icon-favorite": m,
        "icon-unfavorite": !m
      };
    },
    setFavorite(song) {
      if (!song.src) {
        return;
      }
      if (!this.userStatus) {
        this.$emit("notLogged");
        return;
      }
      let m = isFavorite(song.mid);
      if (m) {
        this.DELETE_FAVORITE(song);
      } else {
        this.ADD_FAVORITE(song);
      }
      this.SET_MINILISTFAV([song.mid, !m]);
    },
    _selectSong(song, index) {
      if (!song.src) {
        return;
      }
      this.$emit("selectSong", index);
    },
    deleteSong(index) {
      this.$emit("deleteSong", index);
    },
    ...mapMutations([
      "ADD_FAVORITE",
      "DELETE_FAVORITE",
      "REFRESH_MYALBUM",
      "SET_MINILISTFAV"
    ])
  },
  watch: {
    playList(n, o) {
      let result = {};
      n.forEach(song => {
        let m = isFavorite(song.mid);
        result[song.mid] = m;
      });
      this.SET_MINILISTFAV(result);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
._mini-list {
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: lighten(@color-theme2, 25%);
}
::-webkit-scrollbar-thumb:hover {
  background-color: lighten(@color-theme2, 15%);
}
ul {
  li {
    width: 100%;
    box-sizing: border-box;
    height: 40px;
    padding:0 3%;
    line-height: 40px;
    color: @color-text-d;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin:0 auto;
    transition:.4s;
    span {
      box-sizing: border-box;
    }
    .no-wrap;
    .song-name,
    .singer {
      float: left;
      .no-wrap;
    }
    .song-name {
      width: 50%;
      font-size: 15px;
    }
    .singer {
      padding-left: 10px;
      font-size: @font-size-medium;
      color: @color-text-l;
      width: 30%;
    }
    .icon {
      float: right;
      width: 20%;
      text-align: right;
      i {
        padding: 7px;
        color: @color-text-d;
      }
      .icon-favorite {
        color: red;
      }
    }
  }
  li:hover {
    background-color: darken(@color-theme2, 3%);
    cursor: pointer;
  }
  li:not(.c-song):hover > .song-name,
  li:not(.c-song):hover > .singer {
    color: #fff;
  }
  .c-song {
    background-color: darken(@color-theme2, 6%);
    transition: .4s;
    .song-name {
      color: @color-theme;
    }
    .singer {
      color: #fff;
    }
  }
}

.minilist-move {
  transition: all 0.4s;
}
// 去除节点时，要把节点移除文档流，才能给其他节点让出空间以平滑过度
.minilist-leave-active{
  position: absolute;
}

// .minilist-leave-active {
//   transition: 0.5s;
// }
// .minilist-leave-to,.minilist-enter{
//   transform: scale(0.4);
//   opacity: 0;
// }
</style>
