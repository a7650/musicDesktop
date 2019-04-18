import {playMode} from 'common/config'
import {getSearchHistory,getMyAlbum,getCollectAlbum} from 'common/js/cache'
import {getFavoriteMid} from 'common/js/favorite'

const state = {
    singer:{},
    playList:[],
    sequenceList:[],
    playing:false,
    currentIndex:-1,
    playMode:playMode.sequence,
    favoriteMid:getFavoriteMid()||[],
    myAlbum:getMyAlbum(),
    favoriteSong:[],
    collectAlbum:getCollectAlbum(),
    searchText:"",
    searchHistory:getSearchHistory()
}
export default state