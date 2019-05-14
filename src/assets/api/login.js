import { get,post } from "./axiosConfig"

function getHash(val) {
    return CryptoJS.SHA256(val).toString()
}

export function login({ name, password }) {
    let h_password = getHash(password)
    return post("/login", { name, password: h_password })
        .then(data => {
            return Promise.resolve(data)
        })
}

export function register({ name, password }) {
    let s = Math.random().toString(36).substring(2);
    let h_password = getHash(getHash(password) + s);
    return post("/register", { name, password: h_password, salt: s })
        .then(data => {
            return Promise.resolve(data)
        })
}

export function sessionLogin() {
    return get("/sessionLogin")
        .then(data => {
            return Promise.resolve(data)
        })
}