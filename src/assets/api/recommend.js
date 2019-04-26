import jsonp from 'common/js/jsonp'
import { commonParams, options, PRODUCTION } from './config'
import axios from 'axios'


export function getDistItem(){
  const url = PRODUCTION ? 'http://106.12.198.147/music/api/getDiscItem' : '/getDiscItem';
  const d = JSON.stringify({"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"music.web_album_library","method":"get_album_by_tags","param":{"area":7,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":40,"click_albumid":0}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}})
  const data = Object.assign({},commonParams,{
    '-':'recom3075348628921011',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: d,
    format:'json'
  })
  return axios.get(url, {
    params:data
  }).then((res)=>{
    let list = res.data.category.data.category[0].items;
    return Promise.resolve(list);
  })
}
export function getDiscList(id){
  const url = PRODUCTION ? 'http://106.12.198.147/music/api/getDiscItem' : '/getDiscItem';
  const d = JSON.stringify({"comm":{"ct":24},"playlist":{"method":"get_playlist_by_category","param":{"id":id,"curPage":1,"size":40,"order":5,"titleid":9},"module":"playlist.PlayListPlazaServer"}})
  const data = Object.assign({},commonParams,{
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: d,
    format:'json'
  })
  return axios.get(url, {
    params:data
  }).then((res)=>{
    let list = res.data.playlist.data.v_playlist;
    return Promise.resolve(list);
  })
}


export function getRadioList() {
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: "json",
    platform: "h5",
    needNewCode: 1,
    _: 1543415239583
  });
  return jsonp(url, data, options).then(res => {
    return res.data;
  });
}


export function getDiscSongList(tid) {
  const url = PRODUCTION ? 'http://106.12.198.147/music/api/getDiscSongList' : '/getDiscSongList';
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: tid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(data => {
    return Promise.resolve(data.data.cdlist[0]);
  })
}

export function getRecommend(){
  // const url ='http://localhost:8002/api/getRecommend';
  const url = PRODUCTION ? 'http://106.12.198.147/music2/api/getRecommend' : 'http://localhost:8002/api/getRecommend';
  return axios.get(url)
    .then(data=>{
        return Promise.resolve(data.data)
    })
}