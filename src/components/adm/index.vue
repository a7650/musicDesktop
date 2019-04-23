<template>
    <div class="adm-index">
        <header>管理员</header>
        <div class="content">
        <router-link to="/adm/song" tag="div" class="item" >管理推荐歌曲</router-link>
        <router-link to="/adm/user" tag="div" class="item" >查看当前注册用户</router-link>
        <router-link to="/adm/singer" tag="div" class="item" >管理歌手</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.adm-index {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
header{
    margin-top: 100px;
    text-align: center;
    height: 100px;
    font-size: 40px;
    line-height: 100px;
    font-weight: bold;
}
.content{
    margin-top: 100px;
    width: 200px;
    height: 300px;
}
.item{
    width: 100%;
    height: 80px;
    margin-bottom: 20px;
    border-radius: 3px;
    background-color: @color-theme2;
    color: #fff;
    font-size: 22px;
    line-height: 80px;
    text-align: center;
    transition: .2s;
}
.item:hover{
    cursor: pointer;
    background-color: lighten(@color-theme2,10%);
}

</style>
