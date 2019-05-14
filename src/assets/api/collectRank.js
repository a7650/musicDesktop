import { get } from "./axiosConfig"

export function getSongRank() {
    return get("/getSongRank").then(data => {
        return Promise.resolve(data)
    });
}

export function getAlbumRank() {
    return get("/getAlbumRank").then(data => {
        return Promise.resolve(data)
    });
}