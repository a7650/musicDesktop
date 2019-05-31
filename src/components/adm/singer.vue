<template>
  <div class="page-singer">
    <mHeader>选择你要关闭显示的歌手</mHeader>
    <div class="singer-content">
      <ul>
        <li
          class="item hot"
          v-for="singer in singerList"
          :key="singer.id"
          @click="changeState(singer)"
        >
          <div class="pic">
            <img :src="singer.pic" alt>
            <div class="name">{{singer.name}}</div>
            <div class="closed" v-if="singer.closed">
              <i class="icon-false"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mHeader from "base/mHeader/mHeader";
import { getSingerList } from "api/singer";
import { releaseSinger, closeSinger, getClosedSinger } from "api/adm";
export default {
  data() {
    return {
      singerList: []
    };
  },
  components: {
    mHeader
  },
  methods: {
    changeState(singer) {
      if (singer.closed) {
        releaseSinger(singer.id);
        singer.closed = false;
      } else {
        closeSinger(singer.id);
        singer.closed = true;
      }
    },
    async _getSingerList() {
      let singerList = await getSingerList().then(data => {
        let list = [];
        data.singerlist.forEach(item => {
          list.push({
            country: item.country,
            id: item.singer_id,
            mid: item.singer_mid,
            name: item.singer_name,
            pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
              item.singer_mid
            }.jpg?max_age=2592000`
          });
        });
        return list;
      });
      return singerList;
    },
    async getData() {
      let _getSingerList = new Promise(async (res, rej) => {
        let l = await this._getSingerList();
        res(l);
      });
      let _getClosedSinger = new Promise((res, rej) => {
        getClosedSinger().then(data => {
          res(data);
        });
      });

      Promise.all([_getSingerList, _getClosedSinger]).then(res => {
        let [singerList, closedSinger] = res;
        let map = {};
        closedSinger.forEach(item => {
          map[item] = true;
        });
        singerList.forEach(item => {
          item.closed = !!map[item.id];
        });
        this.singerList = singerList;
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.page-singer {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 999;
  min-width: 1200px;
  padding-bottom: 100px;
  background-color: #fff;
}
.singer-content {
  width: 1220px;
  height: 700px;
  box-sizing: border-box;
  padding-left: 20px;
  margin: 0 auto;
  .hot {
    width: 180px;
    height: 180px;
    margin-right: 20px;
    margin-bottom: 30px;
    .pic {
      width: 180px;
      height: 180px;
      overflow: hidden;
      border-radius: 6px;
      position: relative;
      img {
        user-select: none;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        transition: 0.3s;
        transform-origin: center;
      }
    }
    .pic:hover > img {
      transform: scale(1.3);
    }
    .name {
      position: absolute;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 180px;
      background-color: rgba(0, 0, 0, 0.3);
      .no-wrap;
      font-size: 22px;
      color: #fff;
      font-weight: bold;
    }
    .closed {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 180px;
      font-size: 100px;
      color: #ff0000;
      font-weight: bold;
    }
  }

  .item {
    float: left;
  }
  .item:hover {
    cursor: pointer;
  }
  .name:hover {
    color: @color-theme;
  }
}
</style>
