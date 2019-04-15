<template>
  <div class="tab" id="tab">
    <div>
      <div class="logo">LOGO</div>
      <div class="items">
        <router-link tag="div" to="/home" replace class="item">推荐</router-link>
        <router-link tag="div" to="/singer" replace class="item">歌手</router-link>
        <router-link tag="div" to="/rank" replace class="item">排行榜</router-link>
        <router-link tag="div" to="/mine" replace class="item">我的</router-link>
      </div>
      <div class="search">
        <input type="text" placeholder="搜索">
        <div class="icon">
          <i class="icon-search"></i>
        </div>
      </div>
      <div class="login">
        <button>登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.tab {
  user-select: none;
  background-color: #fff;
  position: absolute;
  top: 0;
  height: 80px;
  width: 100%;
  border-bottom: 1px solid @color-line;
  z-index: 999;
  min-width: 1200px;
  & > div {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
  .logo {
    width: 150px;
    height: 100%;
    line-height: 80px;
    font-weight: bold;
    text-align: left;
    color: @color-theme;
    font-size: @font-size-large-xx;
  }
  .items {
    width: 400px;
    height: 100%;
    &:hover{
        cursor: pointer;
    }
    .item {
      width: 100px;
      height: 100%;
      line-height: 80px;
      text-align: center;
      float: left;
      font-size: @font-size-large;
      color: #000;
    }
    .item:hover {
      color: @color-theme;
    }
    .router-link-active {
      background-color: @color-theme;
      color: #fff;
    }
    .router-link-active:hover{
        color: #fff;
    }
  }
  .search {
    width: 210px;
    height: 100%;
    line-height: 80px;
    margin-left: 5px;
    input {
      box-sizing: border-box;
      padding-right: 40px;
      width: 200px;
      border: 1px solid rgb(201, 201, 201);
      height: 38px;
      border-radius: 10px;
      padding-left: 8px;
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
  }
  .login {
    height: 100%;
    line-height: 80px;
    button {
      height: 40px;
      width: 40px;
      border-radius: 2px;
      background-color: transparent;
      border: none;
      margin-left: 20px;
      &:hover {
        cursor: pointer;
        color: @color-theme;
      }
    }
  }
}
</style>
