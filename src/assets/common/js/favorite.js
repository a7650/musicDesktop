import { getCreateAlbum, setCreateAlbum, deleteFromAlbum } from 'common/js/cache'

export function getFavorite() {
    return getCreateAlbum("我的收藏");
}

export function getFavoriteMid() {
    let a = getFavorite();
    let l = a.songList.map(song => { return song.mid });
    return l;
}

export function addFavorite(song) {
    setCreateAlbum("我的收藏", song);
}

export function deleteFavorite(song) {
    deleteFromAlbum("我的收藏", song);
}
export function isFavorite(MID) {
    let n = getFavoriteMid().findIndex(mid => mid === MID);
    return n > -1
}