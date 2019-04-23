<template>
    <div class="adm-user">
<mHeader>用户列表({{userList.length}})</mHeader>
        <ul>
            <li class="name" v-for="name in userList" :key="name">
                {{name}}
            </li>
        </ul>
    </div>
</template>

<script>
import { getUserList } from "api/adm";
import mHeader from "base/mHeader/mHeader"
export default {
    data(){
        return{
            userList:["zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2","zzp1","zzp2"]
        }
    },
    components:{
        mHeader
    },
    methods:{
        _getUserList(){
            getUserList().then(data=>{
                this.userList = data.nameList
                console.log(this.userList)
                
            })
        }
    },
created(){
    // this._getUserList()
}

}
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
ul{
    width: 1200px;
    margin: 0 auto;
}
.name{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
</style>
