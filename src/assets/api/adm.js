import crypto from "crypto";
import axios from "axios"
import {PRODUCTION } from './config'

const addUrl = PRODUCTION ? 'http://106.12.198.147/music2/api/addSong' : 'http://localhost:8002/api/addSong';
// const addUrl ='http://localhost:8002/api/addSong';

export function addSingle(song) {
    return axios.post(addUrl,[song])
    .then(data=>{
        return Promise.resolve(data.data)
    })
}

export function addAll(list) {
    return axios.post(addUrl,list)
    .then(data=>{
        return Promise.resolve(data.data)
    })
}
