<template>
  <transition name="login">
    <div class="user-login">
      <div class="window login-window" v-show="window===1">
        <header>登录</header>
        <div class="header-line"></div>
        <div class="name1 name">
          <h5>用户名</h5>
          <input type="text" v-model="name1" ref="name1" @blur="checkName1">
        </div>
        <div class="pas1 pas">
          <h5>密码</h5>
          <input type="password" v-model="pas1" ref="pas1">
        </div>
        <div class="tip" v-html="tip1"></div>
        <button class="login" @click="_login">
          <i class="icon-right"></i>
        </button>
        <div class="more">
          <span @click="window=2">注册账号</span>
          <!-- <span>忘记密码</span> -->
        </div>
      </div>
      <div class="window register-window" v-show="window===2">
        <header>注册</header>
        <div class="header-line"></div>
        <div class="name2-tip">用户名需以字母开头,且至少4位</div>
        <div class="name2 name">
          <h5>用户名</h5>
          <input type="text" v-model="name2" ref="name2" @blur="checkName2">
        </div>
        <div class="pas2 pas">
          <h5>密码</h5>
          <input type="password" v-model="pas2" ref="pas2">
        </div>
        <div class="tip" v-html="tip2"></div>
        <button class="register" @click="_register">
          <i class="icon-right"></i>
        </button>
        <div class="more more2">
          <span class="back" @click="window=1">返回登录界面</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { login, register } from "api/login";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      name1: "",
      pas1: "",
      name2: "",
      pas2: "",
      window: 1,
      tip1: "",
      tip2: ""
    };
  },
  methods: {
    checkName2() {
      var error = false;
      switch (true) {
        case !this.name2:
          this.tip2 = "用户名不能为空";
          error = true;
          break;
        case !/^[a-zA-Z]/.test(this.name2):
          this.tip2 = "用户名必须以字母开头";
          error = true;
          break;
        case this.name2.length < 4:
          this.tip2 = "用户名至少为4位";
          error = true;
          break;
        default:
          this.tip2 = "";
      }
      return error;
    },
    checkName1() {
      var err = false;
      var str = this.name1;
      switch (true) {
        case !str:
          this.tip1 = "用户名不能为空";
          err = true;
          break;
        case !/^[a-zA-Z]/.test(str) || str.length < 4:
          this.tip1 = "用户名不合法";
          err = true;
          break;
        default:
          this.tip1 = "";
      }
      return err;
    },
    _login() {
      let err = this.checkName1();
      let name = this.name1;
      if (err) {
        return;
      } else if (!this.pas1) {
        this.tip1 = "请输入密码";
        return;
      }
      this.tip1 = "正在登录...";
      login({ name: this.name1, password: this.pas1 }).then(data => {
        this.tip1 = data.mes;
        if (data.type) {
          this.SET_USERSTATUS(name);
          this.$emit("close");
        }
      });
    },

    _register() {
      let error = this.checkName2();
      if (error) {
        return;
      } else if (!this.pas2) {
        this.tip2 = "密码不能为空";
        return;
      } else if (this.pas2.length > 15) {
        this.tip2 = "密码最多为15位";
        return;
      }
      this.tip2 = "数据已提交服务器,请稍等...";
      register({ name: this.name2, password: this.pas2 }).then(data => {
        this.tip2 = data.mes;
        if (data.type) {
          this.name1 = this.name2;
          this.pas1 = this.pas2;
        }
      });
    },
    ...mapMutations(["SET_USERSTATUS"])
  }
};
</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.user-login {
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  transition: 0.2s;
  transform-origin: center;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -150px;
}
.window {
  width: 260px;
  // border:1px solid black;
  background-color: #fff;
  padding: 20px 15px 10px;
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;

  header {
    font-size: 35px;
    font-weight: bold;
    text-align: left;
  }
  .header-line {
    margin: 10px 0;
    width: 65px;
    height: 6px;
    background-color: #000;
    border-radius: 3px;
  }
  .name2-tip {
    height: 15px;
    line-height: 15px;
    color: @color-text-dd;
    font-size: 15px;
    margin-bottom: 10px;
    text-align: left;
  }
  .name,
  .pas {
    h5 {
      text-align: left;
      font-size: 12px;
      margin-left: 5px;
      color: @color-text-dd;
      transition: 0.3s;
      width: 50px;
    }
    width: 100%;
    height: 50px;
    // line-height: 50px;
    position: relative;
    input {
      margin-top: 2px;
      position: absolute;
      left: 0;
      width: 100%;
      height: 30px;
      background-color: #fff;
      // border-radius: 5px;
      box-sizing: border-box;
      padding-left: 5px;
      border-bottom: 2px solid @color-line;
      transition: 0.2s;
      font-size: @font-size-large;
    }
    h5:hover {
      color: @color-theme;
      font-size: 16px;
    }
    input:focus {
      border-bottom: 6px solid @color-theme;
    }
  }
  .name {
    margin-top: 20px;
  }
  .pas {
    margin-top: 15px;
  }
  .tip {
    width: 100%;
    height: 15px;
    margin-top: 10px;
    line-height: 15px;
    color: #ff0000;
    font-size: 15px;
    text-align: center;
  }
  .login,
  .register {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-top: 25px;
    background-color: @color-theme;
    border: none;
    color: #fff;
    transform-origin: center;
    transition: 0.2s;
    font-size: 20px;
    font-weight: bold;
  }
  button:hover {
    box-shadow: 0 0 30px rgba(250, 2, 2, 0.7);
    // background-color: #000;
    cursor: pointer;
    transform: scale(1.1);
  }
  .more {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    text-align: center;
    span {
      color: @color-text-dd;
      font-size: 14px;
    }
    span:hover {
      cursor: pointer;
      color: #000;
    }
  }
}

.login-enter-active {
  animation: login 0.4s;
}
.login-leave-to {
  transform: scale(0.3);
  opacity: 0;
}

@keyframes login {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
