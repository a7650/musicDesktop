import { commonParams, options } from './config'
import jsonp from 'common/js/jsonp'
import { get } from "./axiosConfig"

export function _getLyric(mid) {
    const data = Object.assign({}, commonParams, {
        format: "json",
        pachetime: (new Date()).valueOf(),
        songmid: mid,
        loginUin: 0,
        hostUin: 0,
        notic: 0,
        platform: 'yqq',
        needNewCode: 0
    });
    return get("/getLyric", data).then(data => {
        let res = data;
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