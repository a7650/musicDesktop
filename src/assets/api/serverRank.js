import axios from "axios"
import {PRODUCTION } from './config'

export function songRank(song) {
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/songRank' : 'http://localhost:8002/api/songRank';
    let _song = Object.assign({}, song, { src: "", rank: "" ,lyric:""});
    axios.post(url, _song);
}

export function albumRank(album) {
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/albumRank' : 'http://localhost:8002/api/albumRank';
    let _album = Object.assign({},album,{desc:""})
    axios.post(url, _album);
}