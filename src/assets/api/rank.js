import jsonp from 'common/js/jsonp'
import { commonParams, options, PRODUCTION } from './config'
// g_tk: 5381,
//     inCharset: 'utf-8',
//     outCharset: 'utf-8',
//     notice: 0,
//     format: 'jsonp'

export function getRankList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data = Object.assign({}, commonParams, {
        uin: 0,
        forma: "json",
        platform: "h5",
        needNewCode: 1,
        _: 1543418506386
    });
    return jsonp(url, data, options).then(res => {
        return res.data;
    });
}

export function getSongList(topid) {
    const url = 'https://szc.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({}, commonParams, {
        tpl: 3,
        page: "detail",
        topid,
        type: top,
        song_begin: 0,
        song_num: 100,
        loginUin: 0,
        hostUin: 0,
        platform: "yqq",
        needNewCode: 0
    });
    return jsonp(url, data, options);
}
export function getComment(topid, pagenum, pagesize) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg'
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        outCharset: "GB2312",
        platform: "yqq",
        needNewCode: 0,
        cid: 205360772,
        reqtype: 2,
        biztype: 4,
        topid,
        cmd: 8,
        needmusiccrit: 0,
        pagenum,
        pagesize,
        domain: "qq.com",
        ct: 24,
        cv: 101010
    })

    return jsonp(url, data, options).then(data => {
        console.log(data);
    })
}