<template>
    <div class="discList">
        <ul class="items">
            <li class="item" v-for="item in discList" :key="item.tid">
                <div class="pic" @click="selectDiscItem(item)">
                    <img :src="item.cover_url_medium" alt="专辑图片">
                    <div class="filter">
                        <div class="icon">
                            <i class="icon-play2"></i>
                        </div>
                    </div>
                </div>
                <div class="text">
                    <div class="title">{{item.title}}</div>
                    <div class="hot">热度：{{item.access_num | formateHot}}</div>
                </div>
            </li>
        </ul>
        <loading v-if="!discList.length"></loading>
    </div>
</template>

<script>
import { formateHot } from "common/js/tools";
import loading from "base/loading/loading"
export default {
props:['discList'],
methods:{
    selectDiscItem(item){
        this.$emit("selectDiscItem",item)
    }
},
components:{
    loading
},
filters:{
    formateHot
}   
}

</script>

<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.discList{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    margin-top: 30px;
    position: relative;
}
.items{
    width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;    
    align-items: center;
    box-sizing: border-box;
    .item{
        margin-bottom: 20px;
        width: 200px;
        height: 270px;
        margin-right: 20px;
        .pic{
            width: 200px;
            height: 200px;
            overflow: hidden;
            position: relative;
            border-radius: 5px;
            .filter{
                width: 200px;
                height: 200px;
                position: absolute;
                top: 0;
                background-color: rgba(0, 0, 0, .4);
                transition: .4s;
                transform-origin: center;
                opacity: 0;
                transform: scale(1.4);
                .icon{
                    width: 60px;
                    height: 60px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin: -30px 0 0 -30px;
                    i{
                        font-size: 60px;
                        color: #fff;
                    }
                }
            }
            img{
                width: 200px;
                height: 200px;
                transition: .2s;
                transform-origin: center;
            }
            &:hover{
                cursor: pointer;
            }
            &:hover>img{
                transform: scale(1.2)
            }
            &:hover>.filter{
                opacity: 1;
                transform: scale(1.1)
            }
        }
        .text{
            margin-top: 10px;
            .title{
                height: 25px;
                font-size: @font-size-medium;
            }
            .hot{
                height: 25px;
                font-size: @font-size-small-x;
                color: @color-text-dd;
                line-height: 25px;
            }
        }
    }
}
</style>
