import axios from "axios"
import { PRODUCTION } from './config'

export function getSongRank() {
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/getSongRank' : 'http://localhost:8002/api/getSongRank';
    return axios.get(url).then(data => {
        return Promise.resolve(data.data)
    });
}

export function getAlbumRank() {
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/getAlbumRank' : 'http://localhost:8002/api/getAlbumRank';
    return axios.get(url).then(data => {
        return Promise.resolve(data.data)
    });
}