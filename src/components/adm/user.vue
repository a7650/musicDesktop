<template>
  <div class="adm-user">
    <div v-if="userList.length>0">
      <mHeader>用户列表({{userList.length}})</mHeader>
      <ul>
        <li class="name" v-for="name in userList" :key="name">{{name}}</li>
      </ul>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { getUserList } from "api/adm";
import mHeader from "base/mHeader/mHeader";
import loading from "base/loading/loading";
export default {
  data() {
    return {
      userList: []
    };
  },
  components: {
    mHeader,loading
  },
  methods: {
    _getUserList() {
      getUserList().then(data => {
        this.userList = data.nameList;
      });
    }
  },
  created() {
    this._getUserList();
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.adm-user {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  overflow-y: scroll;
  background-color: #fff;
  min-width: 1200px;
}
ul {
  width: 1200px;
  margin: 0 auto;
}
.name {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
</style>
