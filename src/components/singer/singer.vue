<template>
  <div class="singer">
    <mHeader>热门歌手</mHeader>
    <div class="singer-content">
      <ul>
        <li
          @click="selectSinger(singer)"
          class="item"
          :class="{'hot':index<12}"
          v-for="(singer,index) in singerList"
          :key="singer.id"
        >
          <div class="pic" v-if="index<12">
            <img :src="singer.pic" alt>
          </div>
          <div class="name" v-if="index<12">{{singer.name}}</div>
          <div class="other name" v-else>{{singer.name}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { mapMutations } from "vuex";
import mHeader from "base/mHeader/mHeader"
export default {
  data() {
    return {
      singerList: []
    };
  },
  components:{
    mHeader
  },
  methods: {
    _getSingerList() {
      getSingerList().then(data => {
        // console.log(data.singerlist)
        let singerList = []; //官方返回的数据中 l为小写
        data.singerlist.forEach(item => {
          singerList.push({
            country: item.country,
            id: item.singer_id,
            mid: item.singer_mid,
            name: item.singer_name,
            pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
              item.singer_mid
            }.jpg?max_age=2592000`
          });
        });
        this.singerList = singerList;
      });
    },
    selectSinger(singer) {
      this.$router.push({
        name: "singerDetail",
        params: {
          id:
            singer.mid +
            "_" +
            singer.name +
            "_" +
            encodeURIComponent(singer.country)
        }
      });
      this.setSinger(singer);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  created() {
    this._getSingerList();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.singer {
  position: absolute;
  padding-top: 80px;
  width: 100%;
  color: #000;
  min-width: 1200px;
  padding-bottom: 100px;
}
.singer-content {
  width: 1220px;
  height: 700px;
  box-sizing: border-box;
  padding-left: 20px;
  margin: 0 auto;
  .hot {
    width: 180px;
    height: 220px;
    margin-right: 20px;
    margin-bottom: 10px;
    .pic {
      width: 180px;
      height: 180px;
      overflow: hidden;
      border-radius: 6px;
      img {
        user-select: none;
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
      height: 40px;
      width: 100%;
      text-align: center;
      line-height: 40px;
    }
  }
  .other {
    width: 130px;
    height: 30px;
    margin-right: 20px;
    .no-wrap;
    text-align: center;
    margin-top: 20px;
    font-size: @font-size-medium;
    color: #999;
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
