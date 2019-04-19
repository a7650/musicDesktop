<template>
  <div class="rank-detail">
    <div class="_content">
      <mHeader>{{title}}</mHeader>
      <chart :title="title" :xAxisData="xAxisData" :seriesData="seriesData" :yAxisName="yAxisName"></chart>
      <songList
        :songList="songList"
        headLine="1"
        @selectSong="_selectSong"
        v-if="songList.length>0"
      ></songList>
    </div>
  </div>
</template>

<script>
import mHeader from "base/mHeader/mHeader";
import { createSong, getSongVkey } from "common/js/song";
import { formateHot } from "common/js/tools";
import { getSongList, getComment } from "api/rank";
import { mapGetters, mapActions } from "vuex";
import songList from "base/songList/songList";
import chart from "components/chart/chart";
export default {
  data() {
    return {
      songList: [],
      title: "",
      xAxisData: [],
      seriesData: [],
      yAxisName: "",
      err_message:""
    };
  },
  computed: {
    ...mapGetters(["singer"])
  },
  components: {
    mHeader,
    songList,
    chart
  },
  methods: {
    _selectSong(index) {
      this.selectSong({
        list: [...this.songList],
        index
      });
    },
    _getSongList(id = this.singer.id || this.$route.params.id) {
      getSongList(id).then(data => {
        // this.pic = data.topinfo.pic_v12;
        // this.hot = formateHot(data.comment_num);
        // this.date = this.formateDate(data.date);
        // this.day_of_year = data.day_of_year;
        if (data.songlist.length === 0) {
          this.err_message = "这个榜单暂时没有歌曲，去看看别的吧";
          return;
        }
        // console.log(data.songlist);
        this.songList = this._encaseSongList(data.songlist);
        this.title = data.topinfo.ListName;
        // console.log(this.songList)
      });
    },
    _encaseSongList(list) {
      let result = [],
          len = list.length,
          _seriesData = [],
          _xAxisData = [];
      for (var i = 0; i < len; i++) {
        let item = list[i];
        if (item.data.songid && item.data.songmid) {
          if (this.singer.id === 4) {
            var _r = (parseFloat(item.in_count) * 100).toFixed(0),
                r = _r + "%";
            this.yAxisName = "流行指数/%";
            _seriesData.push(_r);
            _xAxisData.push(item.data.songname);
          } else {
            var _r = parseInt(item.cur_count) - parseInt(item.old_count),
                r = _r === 0 ? "-" : _r < 0 ? "↑ " + -_r : "↓ " + _r;
            this.yAxisName = "上升指数/位";
            _r < 0 &&
              _seriesData.push(-_r) &&
              _xAxisData.push(item.data.songname);
          }
          result.push(createSong(item.data, "", r));
        }
      }
      this.seriesData = _seriesData;
      this.xAxisData = _xAxisData;
      for (var j = 0; j < len; j++) {
        let item = result[j];
        getSongVkey(item.mid).then(res => {
          let vkey = res.data.items[0].vkey;
          item.src = vkey
            ? `http://dl.stream.qqmusic.qq.com/C400${
                item.mid
              }.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
            : "";
          item.name = vkey ? item.name : `<del>${item.name}(暂无音源)</del>`;
        });
      }
      return result;
    },
    // _encaseSongList(list) {
    //   let result = [];
    //   let len = list.length;
    //   let _seriesData=[]
    //   let _xAxisData=[]
    //   for (var i = 0; i < len; i++) {
    //     let item = list[i];
    //     if (item.data.songid && item.data.songmid) {
    //       if (this.singer.id === 4) {
    //         var _r = (parseFloat(item.in_count) * 100).toFixed(0);
    //         var r = _r + "%";
    //         this.yAxisName = "流行指数/%"
    //         _seriesData.push(_r)
    //         _xAxisData.push(item.data.songname)
    //       } else {
    //         var _r = parseInt(item.cur_count) - parseInt(item.old_count);
    //         r = _r === 0 ? "-" : _r < 0 ? "↑ " + -_r : "↓ " + _r;
    //         this.yAxisName = "上升指数/位"
    //         _r<0&&_seriesData.push(-_r)&&_xAxisData.push(item.data.songname)
    //       }
    //       result.push(createSong(item.data, "", r));
    //     }
    //   }
    //   this.seriesData=_seriesData
    //   this.xAxisData=_xAxisData
    //   console.log(_seriesData)
    //   console.log(_xAxisData)
    //   for (var j = 0; j < len; j++) {
    //     let item = result[j];
    //     getSongVkey(item.mid).then(res => {
    //       let vkey = res.data.items[0].vkey;
    //       item.src = vkey
    //         ? `http://dl.stream.qqmusic.qq.com/C400${
    //             item.mid
    //           }.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    //         : "";
    //       item.name = vkey ? item.name : `<del>${item.name}(暂无音源)</del>`;
    //     });
    //   }
    //   return result;
    // },
    ...mapActions(["selectSong"])
  },
  created() {
    this._getSongList();
  },
  // activated() {
  //   console.log(2)
  //   this._getSongList();
  // },
  watch: {
    $route(to, from) {
      this._getSongList();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.rank-detail {
  width: 100%;
  min-width: 1200px;
  background: @color-background-d;
}
._content {
  width: 900px;
  margin: 0 auto;
}
</style>
