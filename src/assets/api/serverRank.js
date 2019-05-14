
export function songRank(song) {
    let _song = Object.assign({}, song, { src: "", rank: "" ,lyric:""});
    axios.post("/songRank", _song);
}

export function albumRank(album) {
    let _album = Object.assign({},album,{desc:""})
    axios.post("/albumRank", _album);
}