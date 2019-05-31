import { post } from "./axiosConfig"

export function songRank(song) {
    let _song = Object.assign({}, song, { src: "", rank: "" ,lyric:""});
    post("/songRank", _song);
}

export function albumRank(album) {
    let _album = Object.assign({},album,{desc:""})
    post("/albumRank", _album);
}