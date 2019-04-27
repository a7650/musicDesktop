<template>
  <div class="tab" id="tab">
    <div class="content">
      <div class="logo" @click="f">LOGO</div>
      <div class="items">
        <div class="bg" :style="{'transform':`translateX(${bgX}px)`}"></div>
        <router-link @click.native="bgX=0" tag="div" to="/home" replace class="item">推荐</router-link>
        <router-link @click.native="bgX=100" tag="div" to="/singer" replace class="item">歌手</router-link>
        <router-link @click.native="bgX=200" tag="div" to="/rank" replace class="item">排行榜</router-link>
        <router-link @click.native="bgX=300" tag="div" to="/collectRank" replace class="item">收藏榜</router-link>
        <router-link @click.native="bgX=400" tag="div" to="/mine" replace class="item">我的</router-link>
      </div>
      <div class="search">
        <input type="text" placeholder="搜索" @focus="boxShow=true" @blur="blur" v-model="searchText">
        <div class="icon">
          <i class="icon-search"></i>
        </div>
        <transition name="box">
          <div class="box" v-show="boxShow">
            <div v-show="searchText" class="s" @click="select(searchText)">
              搜索
              <font>"{{searchText}}"</font>
            </div>
            <h5>实时热搜</h5>
            <ul>
              <li v-for="(key,index) in hotKey" :key="key.k" @click="select(key.k)">
                <span class="index">{{index+1}}</span>
                <span class="name">{{key.k}}</span>
                <span class="hot">{{key.n | formateHot}}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="login">
        <button v-if="userStatus">{{userStatus}}</button>
        <button v-else @click="loginShow=true">登录</button>
      </div>
    </div>
    <transition name="filter">
      <div class="filter" v-show="loginShow" @click="loginShow=false"></div>
    </transition>
    <login v-show="loginShow" @close="loginShow=false"></login>
    <float ref="float"></float>
  </div>
</template>

<script>
import { getHotKey } from "api/search";
import { formateHot } from "common/js/tools";
import { mapMutations, mapGetters } from "vuex";
import login from "components/login/login";
import { sessionLogin } from "api/login";

export default {
  data() {
    return {
      boxShow: false,
      hotKey: [],
      searchText: "",
      loginShow: false,
      bgX: 0
    };
  },
  filters: {
    formateHot
  },
  components: {
    login
  },
  computed: {
    ...mapGetters(["userStatus"])
  },
  methods: {
    _sessionLogin() {
      sessionLogin().then(data => {
        if (data.type) {
          this.SET_USERSTATUS(data.name);
        }
      });
    },
    f() {
      this.float("hello");
    },
    blur() {
      setTimeout(() => {
        this.boxShow = false;
      }, 100);
    },
    _getHotKey() {
      getHotKey().then(data => {
        this.hotKey = data.data.hotkey.splice(0, 10);
      });
    },
    select(str) {
      this.SET_SEARCHTEXT(str);
      this.bgX = 500;
      this.boxShow = false;
      this.searchText = "";
      this.$router.push({
        name: "search"
      });
    },
    ...mapMutations(["SET_SEARCHTEXT", "SET_USERSTATUS"])
  },
  created() {
    this._getHotKey();
    this._sessionLogin();
    let href = window.location.href,
      n =
        href.indexOf("/home") > -1
          ? 0
          : href.indexOf("/singer") > -1
          ? 1
          : href.indexOf("/rank") > -1
          ? 2
          : href.indexOf("/collectRank") > -1
          ? 3
          : href.indexOf("/mine") > -1
          ? 4
          : href.indexOf("/search") > -1
          ? 5
          : 0;
    this.bgX = n * 100;
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.tab {
  user-select: none;
  background-color: #fff;
  position: absolute;
  top: 0;
  height: 70px;
  width: 100%;
  // border-bottom: 1px solid @color-line;
  z-index: 99;
  min-width: 1200px;
  transition: 0.5s;
  .filter {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.2);
    transition: 0.5s;
  }
  .content {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
  .logo {
    width: 150px;
    height: 100%;
    line-height: 70px;
    font-weight: bold;
    text-align: left;
    color: @color-theme;
    font-size: @font-size-large-xx;
  }
  .items {
    width: 500px;
    height: 100%;
    position: relative;
    overflow: hidden;
    &:hover {
      cursor: pointer;
    }
    .item {
      width: 100px;
      height: 100%;
      line-height: 70px;
      text-align: center;
      float: left;
      font-size: @font-size-large;
      color: #000;
      transition: 0.5s;
      // position: absolute;
    }
    .item:hover {
      color: @color-theme;
    }
    .bg {
      width: 100px;
      height: 100%;
      background-color: @color-theme;
      transition: 0.3s;
      position: absolute;
      top: 0;
      z-index: -99;
    }
    .router-link-active {
      // background-color: @color-theme;
      color: #fff;
    }
    .router-link-active:hover {
      color: #fff;
    }
  }
  .search {
    width: 210px;
    height: 100%;
    line-height: 70px;
    margin-left: 5px;
    position: relative;
    input {
      box-sizing: border-box;
      padding-right: 40px;
      width: 100%;
      height: 30px;
      border-radius: 2px;
      padding-left: 8px;
      background: #fff;
      border: 1px solid @color-line;
    }
    .icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-left: -40px;
      i {
        color: #000;
        font-weight: bold;
      }
    }
    .box {
      width: 210px;
      // min-height: 240px;
      // height: 300px;
      // max-height: 390px;
      transition: 0.2s;
      // animation-duration: .2s;
      // overflow: hidden;
      position: absolute;
      top: 49px;
      box-sizing: border-box;
      border: 1px solid @color-line;
      // background-color: #ff0000;
      background-color: #fff;
      border-radius: 2px;
      // z-index: -99;
      .s {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        box-sizing: border-box;
        padding: 0 10px;
        color: #000;
        font-size: 14px;
        .no-wrap;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        font {
          color: @color-theme;
        }
      }
      h5 {
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: @color-text-dd;
        text-align: center;
        margin-top: 5px;
      }
      li {
        width: 100%;
        height: 35px;
        line-height: 35px;
        .no-wrap;
        color: #000;
        span {
          .no-wrap;
          display: inline-block;
        }
        .index {
          color: @color-theme;
          width: 15%;
          text-align: center;
        }
        .name {
          width: 60%;
        }
        .hot {
          width: 25%;
          color: @color-text-dd;
          font-size: @font-size-small-x;
          text-align: center;
        }
      }
      li:hover,
      .s:hover {
        background-color: @color-line;
        cursor: pointer;
      }
    }
  }
  .login {
    height: 100%;
    line-height: 70px;
    button {
      height: 40px;
      width: 50px;
      border-radius: 2px;
      background-color: transparent;
      border: none;
      margin-left: 20px;
      color: #000;
      &:hover {
        cursor: pointer;
        color: @color-theme;
      }
    }
  }
}
.box-enter,
.box-leave-to {
  transform: translateY(-40px);
  // height: 0;
  opacity: 0;
}

.filter-enter,
.filter-leave-to {
  opacity: 0;
}
</style>
