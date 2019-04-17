<template>
    <div class="discList">
        <ul class="items">
            <li class="item" v-for="item in discList" :key="item.tid||item.disstid">
                <div class="pic" @click="selectDiscItem(item)">
                    <img :src="item.cover_url_medium||item.pic" alt="专辑图片">
                    <div class="filter">
                        <div class="icon">
                            <i class="icon-play2"></i>
                        </div>
                    </div>
                </div>
                <div class="text">
                    <div class="title">{{item.title||item.nickname}}</div>
                    <div class="hot" v-if="item.access_num">热度：{{item.access_num | formateHot}}</div>
                    <div class="desc" v-else v-html="item.desc"></div>
                </div>
            </li>
        </ul>
        <loading class="loading" v-if="!noLoading&&!discList.length"></loading>

    </div>
</template>

<script>
import { formateHot } from "common/js/tools";
import loading from "base/loading/loading"
export default {
props:{
    discList:{
        type:Array,
        default:[]
    },
    noLoading:{
        default:false
    }
},
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
    margin-top: 30px;
    position: relative;
}
.items{
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;    
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 50px;
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
            height: 60px;
            display: flex;
            flex-direction: column;
            .title{
                font-size: @font-size-medium;
                height: 20px;
                line-height: 20px;
                margin-top: 10px;
                .no-wrap;
            }
            .hot,.desc{
                flex: 1;
                font-size: @font-size-small-x;
                color: @color-text-dd;
                line-height: 30px;
                .no-wrap;
            }
        }
    }
}
.loading{
    margin-left: -20px;
}
</style>
