<template>
  <div class="song-list">
    <div class="song-content">
      <ul class="items">
        <li class="header item" :class="{'line':headLine}">
          <span class="song-name">歌曲</span>
          <span class="singer">歌手</span>
          <span class="album">专辑</span>
          <span class="duration">时长</span>
        </li>
        <li
          class="song item"
          v-for="(item,index) in songList"
          :key="item.id"
          @click.stop="selectSong(index,item.src,$event)"
        >
          <div class="index">
            <div class="_index">{{index+baseIndex}}</div>
            <div class="_rank" v-if="item.rank">{{item.rank}}</div>
          </div>
          <span class="song-name" :class="{'c-song':(currentSong && item.id === currentSong.id)}">
            <b v-html="item.name"></b>
          </span>
          <span class="singer" v-html="item.singer"></span>
          <span class="album" v-html="item.album"></span>
          <span class="duration">{{item.duration | formateTime}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formateTime } from "common/js/tools";
import { mapGetters } from "vuex";
export default {
  props: {
    songList: {
      type: Array,
      default: []
    },
    baseIndex: {
      type: Number,
      default: 1
    },
    headLine: {
      type: null,
      default: false
    }
  },
  filters: {
    formateTime
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
    selectSong(index, src,e) {
      if (!src) return;
      this.$emit("selectSong", index,e);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.song-list {
  width: 100%;
}
.song-content {
  width: 100%;
  .item {
    width: 100%;
    height: 50px;
    display: flex;
    box-sizing: border-box;
    padding-right: 20px;
    & > span {
      .no-wrap;
      font-size: @font-size-medium;
      box-sizing: border-box;
      line-height: 50px;
    }
    .singer,
    .album,
    .duration {
      padding: 0 10px;
      flex: 1;
    }
    .singer {
      text-align: left;
    }
    .album {
      text-align: center;
    }
    .duration {
      text-align: right;
    }
  }
  .item:not(.header):hover > span:not(.index) {
    background-color: darken(#fff, 8%);
    cursor: pointer;
  }
  .song-name > b:hover {
    color: #ff0000;
  }
  .header {
    & > span {
      color: @color-text-dd;
    }
    .song-name {
      width: 325px;
      padding-left: 60px;
    }
    .singer {
    }
    .album {
    }
    .duration {
    }
  }
  .line {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .song {
    .index {
      width: 50px;
      color: @color-text-dd;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 30px;
      align-self: center;
      div {
        flex: 1;
        line-height: 100%;
        display: flex;
        align-items: center;
      }
      ._rank {
        font-size: 12px;
        color: @color-text-d;
      }
    }

    .song-name {
      width: 275px;
      padding-left: 10px;
    }
    .singer {
    }
    .album {
    }
    .duration {
    }
  }
}
.c-song {
  color: @color-theme;
}
</style>
