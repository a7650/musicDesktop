import { commonParams } from './config'
import { get } from "./axiosConfig"

export function getDiscList(id) {
  const d = JSON.stringify({ "comm": { "ct": 24 }, "playlist": { "method": "get_playlist_by_category", "param": { "id": id, "curPage": 1, "size": 40, "order": 5, "titleid": 9 }, "module": "playlist.PlayListPlazaServer" } })
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: d,
    format: 'json'
  })
  return get('/getDiscList', data).then((data) => {
    let list = data.playlist.data.v_playlist;
    return Promise.resolve(list);
  })
}

export function getDiscSongList(tid) {
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
  return get('/getDiscSongList', data).then(data => {
    return Promise.resolve(data.cdlist[0]);
  })
}

export function getRecommend() {
  return get("/getRecommend")
    .then(data => {
      return Promise.resolve(data)
    })
}