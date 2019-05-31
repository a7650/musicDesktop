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

export function releaseSinger(id) {
    return get("/releaseSinger",{id})
        .then(data => {
            return Promise.resolve(data)
        })
}

export function closeSinger(id) {
    return get("/closeSinger", { id })
        .then(data => {
            return Promise.resolve(data)
        })
}

export function getClosedSinger() {
    return get("/getClosedSinger").then(data => {
        return Promise.resolve(data)
    })
}