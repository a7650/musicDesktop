import { get, post } from "./axiosConfig"

export function addSingle(song) {
    return post("/addSong", [song])
        .then(data => {
            return Promise.resolve(data)
        })
}

export function addAll(list) {
    return post("/addSong", list)
        .then(data => {
            return Promise.resolve(data)
        })
}

export function getUserList(params) {
    return get("/getUserList")
        .then(data => {
            return Promise.resolve(data)
        })
}