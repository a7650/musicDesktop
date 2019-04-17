import * as types from './mutation-types'
import {getFavoriteMid,addFavorite,deleteFavorite} from 'common/js/favorite'
import {saveSearchHistory,clearSearchHistory,getMyAlbum,getCollectAlbum,getCreateAlbum} from 'common/js/cache'


const mutations = {
    [types.SET_SINGER](state,singer){
        state.singer = singer
    },
    [types.SET_PLAYING](state,flag){
        state.playing = flag;
    },
    [types.SET_PLAYLIST](state,list){
        state.playList = list;
    },
    [types.SET_SEQUENCELIST](state,list){
        state.sequenceList = list;
    },
    [types.SET_CURRENTINDEX](state,index){
        state.currentIndex = index;
    },
    [types.SET_PLAYMODE](state,mode){
        state.playMode = mode;
    },
    [types.ADD_FAVORITE](state,song){
        addFavorite(song);
        state.favoriteMid =  getFavoriteMid();
    },

    [types.DELETE_FAVORITE](state,song){
        deleteFavorite(song);
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_FAVORITE](state){
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_MYALBUM](state){
        state.myAlbum = getMyAlbum();
    },

    [types.REFRESH_COLLECTALBUM](state){
        state.collectAlbum = getCollectAlbum();
    },

    [types.DELETE_PLAYLIST](state,index){
        let len = state.playList.length-1;
        state.playList.splice(index,1);
        if(state.currentIndex==len&&index==len){
            let i = state.playList.length==0 ? -1 : 0;
            state.currentIndex = i ;
        }
        else if(state.currentIndex>index){
            state.currentIndex--;
        }
        state.sequenceList = state.playList;
    },

    
}

export default mutations