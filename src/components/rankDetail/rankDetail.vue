<template>
  <div class="rank-detail">
    <div class="_content">
      <mHeader>{{title}}</mHeader>
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
export default {
  data() {
    return {
      songList: [],
      title: ""
    };
  },
  computed: {
    ...mapGetters(["singer"])
  },
  components: {
    mHeader,
    songList
  },
  methods: {
    // formateDate(date) {
    //   if (!date) return;
    //   let n = date.indexOf("_");
    //   if (n > -1) {
    //     return "第" + date.slice(n + 1) + "周";
    //   }
    //   return date;
    // },
    _selectSong(index) {
      this.selectSong({
        list: [...this.songList],
        index
      });
    },
    _getSongList(id = this.singer.id || this.$route.params.id) {
      getSongList(id).then(data => {
        this.title = data.topinfo.ListName;
        // this.pic = data.topinfo.pic_v12;
        // this.hot = formateHot(data.comment_num);
        // this.date = this.formateDate(data.date);
        // this.day_of_year = data.day_of_year;
        if (data.songlist.length === 0) {
          this.err_message = "这个榜单暂时没有歌曲，去看看别的吧";
          return;
        }
        this.songList = this._encaseSongList(data.songlist);
        // console.log(this.songList)
      });
    },
    _encaseSongList(list) {
      let result = [];
      let len = list.length;
      for (var i = 0; i < len; i++) {
        let item = list[i];
        if (item.data.songid && item.data.songmid) {
          if (this.singer.id === 4) {
            var r = (parseFloat(item.in_count) * 100).toFixed(0) + "%";
          } else {
            var r = parseInt(item.cur_count) - parseInt(item.old_count);
            r = r === 0 ? "-" : r < 0 ? "↑ " + -r : "↓ " + r;
          }
          result.push(createSong(item.data, "", r));
        }
      }
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
  padding-bottom: 100px;
}
._content {
  width: 900px;
  margin: 0 auto;
}
</style>
