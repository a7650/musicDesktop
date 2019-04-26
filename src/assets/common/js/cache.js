import storage from 'good-storage'
import { Object } from 'core-js';
import {albumRank} from 'api/serverRank'

const SEARCH_KEY = "_SEARCH_HISTORY_"
const MAX_HISTORYNUM = 20
const MYALBUM_KEY = "_MY_ALBUM_"
const COLLECTALBUM_KEY = "_COLLECT_ALBUM_"
const CREATEALBUM_KEY = "_CREATE_ALBUM_"
const PLAYHISTORY_KEY = "_PLAY_HISTORY_"

//search
function resetArray(array, val, compare, maxnum, pos) {
    let n = array.findIndex(compare);
    if (n > -1) {
        array.splice(n, 1)
    }
    if (pos) {
        array.splice(pos + 1, 0, val)
    } else {
        array.unshift(val);
    }
    if (array.length > maxnum) {
        array.pop();
    }
    return array;
}

export function saveSearchHistory(val) {
    let searches = storage.get(SEARCH_KEY, []);
    let newStorage = resetArray(searches, val, (value) => { return value === val }, MAX_HISTORYNUM);
    storage.set(SEARCH_KEY, newStorage);
    return newStorage;
}
export function getSearchHistory() {
    return storage.get(SEARCH_KEY, [])
}

export function clearSearchHistory({ flag, index }) {
    if (flag) {
        storage.set(SEARCH_KEY, []);
        return [];
    }
    else {
        let searches = storage.get(SEARCH_KEY, []);
        searches.splice(index, 1);
        storage.set(SEARCH_KEY, searches);
        return searches;
    }
}

//my-album
export function getMyAlbum() {
    return storage.get(MYALBUM_KEY, [{ name: "我的收藏", pic: "" }]);
}

export function getCreateAlbum(val) {
    if (val) {
        let album = storage.get(CREATEALBUM_KEY, []);
        if (album.length === 0) {
            let f = { name: "我的收藏", pic: './default.png', desc: "这个歌单是由系统生成的默认收藏歌单", songList: [] };
            storage.set(CREATEALBUM_KEY, [f]);
            return f;

        }
        else {
            let n = album.findIndex(item => item.name === val);
            return album[n];
        }
    } else {
        let album = storage.get(CREATEALBUM_KEY, []);
        if (album.length === 0) {
            storage.set(CREATEALBUM_KEY, [{ name: "我的收藏", bgImg: './default.png', desc: "这个歌单是由系统生成的默认收藏歌单", songList: [] }]);
            getCreateAlbum();
            return;
        }
        return album;
    }
}

export function setCreateAlbum(name, song) {
    let album = getCreateAlbum(name);
    let n = album.songList.findIndex(item => item.mid === song.mid);
    if (n > -1) {
        return "这首歌已经在歌单了"
    }
    else {
        try {
            let _song = Object.assign({},song,{src:"",rank:""})
            album.songList.unshift(_song);
            album.pic = _song.image;
            let oldCreateAlbum = getCreateAlbum();
            let newCreateAlbum = resetArray(oldCreateAlbum, album, item => item.name === name, 999, 1);
            storage.set(CREATEALBUM_KEY, newCreateAlbum);
            return "添加成功"
        } catch (e) {
            console.log(e);
            return "添加失败"
        }
    }
}

export function deleteFromAlbum(albumname, song) {
    let album = getCreateAlbum(albumname);
    let n = album.songList.findIndex(item => item.mid === song.mid);
    try {
        album.songList.splice(n, 1);
        let oldCreateAlbum = storage.get(CREATEALBUM_KEY, []);
        let newCreateAlbum = resetArray(oldCreateAlbum, album, (item) => { return item.name === albumname }, 999);
        storage.set(CREATEALBUM_KEY, newCreateAlbum);
        return { type: 1, mes: "删除成功" }
    } catch (e) {
        return { type: 0, mes: "删除失败" }
    }
}

export function createAlbum(nickname, desc) {
    let all = getMyAlbum();
    let n = all.findIndex(item => item.nickname === nickname);
    if (n > -1) {
        return { type: 0, mes: "该歌单已存在" }
    } else {
        try {
            all.splice(1, 0, { nickname, desc });
            storage.set(MYALBUM_KEY, all);
            let album = getCreateAlbum();
            album.splice(1, 0, { nickname, desc, pic: "", songList: [] });
            // console.log(album);
            storage.set(CREATEALBUM_KEY, album);
            return { type: 1, mes: "创建成功" }
        } catch (e) {
            return { type: 0, mes: "创建失败" }
        }
    }
}
export function deleteAlbum(name) {
    if (name === "我的收藏") {
        return { type: "0", mes: "不能删除默认歌单" }
    }
    try {
        let allAlbum = getCreateAlbum();
        let n = allAlbum.findIndex(item => item.name === name);
        if (n < 0) {
            return { type: 0, mes: "该歌单不存在" }
        }
        allAlbum.splice(n, 1);
        storage.set(CREATEALBUM_KEY, allAlbum);
        let myAlbum = getMyAlbum();
        let m = myAlbum.findIndex(item => item.name === name);
        myAlbum.splice(m, 1);
        storage.set(MYALBUM_KEY, myAlbum)
        return { type: 1, mes: "删除成功<br>你还可以再听一下" }
    } catch (e) {
        return { type: 0, mes: "删除失败请重试" }
    }
}

export function editAlbum(name1, name2, desc2) {
    try {
        let allAlbum = getCreateAlbum();
        let n = allAlbum.findIndex(item => item.name === name1);
        if (n < 0) {
            return { type: 0, mes: "该歌单不存在" }
        }
        allAlbum[n].name = name2;
        allAlbum[n].desc = desc2;
        storage.set(CREATEALBUM_KEY, allAlbum);
        let myAlbum = getMyAlbum();
        let m = myAlbum.findIndex(item => item.name === name1);
        console.log(m)
        myAlbum[m].name = name2;
        storage.set(MYALBUM_KEY, myAlbum)
        return { type: 1, mes: "歌单信息已成功更改" }
    } catch (e) {
        console.log(e)
        return { type: 0, mes: "编辑失败，请重试" }
    }
}


export function getCollectAlbum() {
    return storage.get(COLLECTALBUM_KEY, []);
}

// {pic,nickname,dissname,disstid,collectAlbum}
export function setCollectAlbum(album) {
    let allalbum = getCollectAlbum();
    let n = allalbum.findIndex(item => item.disstid === album.disstid);
    if (n > -1) {
        return { type: 0, mes: "你已经收藏过这个歌单了" }
    } else {
        try {
            allalbum.unshift(album)
            storage.set(COLLECTALBUM_KEY, allalbum);
            albumRank(album)
            return { type: 1, mes: "收藏成功" }
        } catch (e) {
            return { type: 0, mes: "收藏失败" }
        }
    }
}

export function deleteCollectAlbum(tid) {
    let allalbum = getCollectAlbum();
    let n = allalbum.findIndex(item => item.disstid === tid);
    try {
        allalbum.splice(n, 1)
        storage.set(COLLECTALBUM_KEY, allalbum);
        return { type: 1, mes: "已取消收藏<br>你还可以再听一下" }
    } catch (e) {
        return { type: 0, mes: "出现错误，请重试，或者刷新页面" }
    }
}

export function isCollect(tid) {
    let allalbum = getCollectAlbum();
    let n = allalbum.findIndex(item => item.disstid === tid);
    return n > -1;
}



export function getPlayHistory() {
    return storage.get(PLAYHISTORY_KEY, []);
}
export function setPlayHistory(song) {
    let newSong = Object.assign({}, song);
    if (song.id2) {
        newSong.id = song.id2;
    }
    let all = getPlayHistory();
    let newall = resetArray(all, newSong, item => item.mid === song.mid, 200);
    storage.set(PLAYHISTORY_KEY, newall)
}

