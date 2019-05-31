import * as types from './mutation-types'
import { getFavoriteMid, addFavorite, deleteFavorite } from 'common/js/favorite'
import { saveSearchHistory, clearSearchHistory, getMyAlbum, getCollectAlbum, getCreateAlbum } from 'common/js/cache'
import { songRank } from 'api/serverRank'


const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING](state, flag) {
        state.playing = flag;
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list;
    },
    [types.SET_SEQUENCELIST](state, list) {
        state.sequenceList = list;
    },
    [types.SET_CURRENTINDEX](state, index) {
        state.currentIndex = index;
    },
    [types.SET_PLAYMODE](state, mode) {
        state.playMode = mode;
    },
    [types.ADD_FAVORITE](state, song) {
        addFavorite(song);
        state.favoriteMid = getFavoriteMid();
        songRank(song)
    },

    [types.DELETE_FAVORITE](state, song) {
        deleteFavorite(song);
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_FAVORITE](state) {
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_MYALBUM](state) {
        state.myAlbum = getMyAlbum();
    },

    [types.REFRESH_COLLECTALBUM](state) {
        state.collectAlbum = getCollectAlbum();
    },

    [types.DELETE_PLAYLIST](state, index) {
        console.log(index)
        let len = state.playList.length - 1;
        state.playList.splice(index, 1);
        if (state.currentIndex == len && index == len) {
            let i = state.playList.length == 0 ? -1 : 0;
            state.currentIndex = i;
        }
        else if (state.currentIndex > index) {
            state.currentIndex--;
        }
        state.sequenceList = state.playList;
    },

    [types.SET_SEARCHTEXT](state, str) {
        state.searchText = str
    },

    [types.SAVE_SEARCHHISTORY](state, val) {
        state.searchHistory = saveSearchHistory(val);
    },

    [types.CLEAR_SEARCHHISTORY](state, payload) {
        state.searchHistory = clearSearchHistory(payload);
    },

    [types.SET_USERSTATUS](state, name) {
        state.userStatus = name
    },

    [types.LOGIN](state, flag) {
        state.loginWindow = flag
    },

    [types.SET_MINILISTFAV](state, payload) {
        if (Object.prototype.toString.call(payload) === "[object Object]") {
            state.miniListFav = payload
        } else if (Object.prototype.toString.call(payload) === "[object Array]") {
            state.miniListFav[payload[0]] = payload[1]
        }
    }
}

export default mutations