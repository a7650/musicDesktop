import jsonp from 'common/js/jsonp'
// import { _getLyric } from 'api/song'
// import { Base64 } from 'js-base64'

export default class song {
    constructor({ id, mid, singer, name, album, duration, image, src, rank }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.filename = `C400${this.mid}.m4a`
        this.src = src
        this.rank = rank
    }

    // getLyric() {
    //     if (this.lyric) {
    //         return Promise.resolve(this.lyric)
    //     }
    //     else {
    //         return new Promise((resolve, reject) => {
    //             _getLyric(this.mid).then(data => {
    //                 if (data.retcode == 0) {
    //                     this.lyric = Base64.decode(data.lyric);
    //                     resolve(this.lyric);
    //                 }
    //                 else {
    //                     reject("暂无歌词")
    //                 }
    //             })
    //         })
    //     }
    // }
}



export function createSong(musicData, vkey, r) {
    return new song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        src: "",
        rank: r
    })
}
// export function getLyric() {
//     if (this.lyric) {
//         return Promise.resolve(this.lyric)
//     }
//     else {
//         return new Promise((resolve, reject) => {
//             _getLyric(this.mid).then(data => {
//                 if (data.retcode == 0) {
//                     this.lyric = Base64.decode(data.lyric);
//                     resolve(this.lyric);
//                 }
//                 else {
//                     reject("暂无歌词")
//                 }
//             })
//         })
//     }
// }



function filterSinger(singer) {
    if (!singer) {
        return ''
    }
    return singer.map(function (item) {
        return item.name
    }).join("/");
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


export function _encaseSongList(list, data) {
    let result = [];
    list.forEach((item) => {
        let ITEM = item;
        if (data) {
            ITEM = item[data]
        }
        if (ITEM.songid && ITEM.songmid) {
            result.push(createSong(ITEM))
        }
    })
    result.forEach((item) => {
        getSongVkey(item.mid).then((res) => {
            let vkey = res.data.items[0].vkey;
            item.src = vkey ? `http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}` : "";
        })
    })
    return result;
}