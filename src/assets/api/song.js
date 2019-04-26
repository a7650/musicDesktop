import {commonParams, options,PRODUCTION} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function _getLyric(mid){

    // const url = 'http://localhost:8002/api/getLyric'
    const url = PRODUCTION ? 'http://106.12.198.147/music/api/getLyric' : '/getLyric';
    const data = Object.assign({},commonParams,{
        format:"json",
        pachetime:(new Date()).valueOf(),
        songmid:mid,
        loginUin:0,
        hostUin:0,
        notic:0,
        platform:'yqq',
        needNewCode:0
    });
    return axios.get(url,{
        params:data
    }).then(response => {
        let res = response.data;
        return Promise.resolve(res);
    })
}

export function getSongVkey(songmid) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
    const data = Object.assign({}, {
        callback: 'musicJsonCallback',
        loginUin: 3051522991,
        format: 'jsonp',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 3051522991,
        guid: 5931742855,
        songmid: songmid,
        filename: `C400${songmid}.m4a`
    })
    return jsonp(url, data)
}