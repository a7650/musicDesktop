<template>
  <div class="_mini-list">
    <ul>
      <li
        :class="{'c-song':(currentSong && song.id === currentSong.id)}"
        v-for="(song,index) in playList"
        :key="index"
        @click="_selectSong(song,index)"
      >
        <span class="song-name" v-html="filterSrc(song.name,song.src)"></span>
        <span class="singer" v-html="song.singer"></span>
        <span class="icon">
          <i :class="favoriteIcon(song)" @click.stop="setFavorite(song)"></i>
          <i class="icon-false" @click.stop="deleteSong(index)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { isFavorite } from "common/js/favorite";

export default {
  computed: {
    ...mapGetters(["playList", "currentIndex", "currentSong", "favoriteMid"])
  },
  methods: {
    favoriteIcon(song) {
      let mid = this.favoriteMid;
      let m = isFavorite(song.mid);
      return {
        "icon-favorite": m,
        "icon-unfavorite": !m
      };
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
      this.REFRESH_MYALBUM();
    },
    _selectSong(song, index) {
      if (!song.src) {
        return;
      }
      this.$emit("selectSong", song, index);
    },
    deleteSong(index) {
      this.$emit("deleteSong", index);
    },
    ...mapMutations(["ADD_FAVORITE", "DELETE_FAVORITE", "REFRESH_MYALBUM"])
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
}
ul {
  li {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 3%;
    color: @color-text-dd;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  li:hover{
    background-color: #000;
    cursor: pointer;
  }
  li:not(.c-song):hover>.song-name,li:not(.c-song):hover>.singer{
      color: rgb(224, 224, 224);
  }
  .c-song {
      background-color: #000;
      .song-name{
        color: rgb(255, 0, 0);
      }
      .singer{
        color: #fff;
      }
    }
}
</style>
