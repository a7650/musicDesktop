// import crypto from "crypto";
import axios from "axios"
import {PRODUCTION } from './config'

function getHash(val) {
    return CryptoJS.SHA256(val).toString()
}

export function login({name,password}){
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/login' : 'http://localhost:8002/api/login';
    // const url = 'http://localhost:8002/api/login';
    let h_password = getHash(password)
    return axios.post(url,{name,password:h_password})
    .then(data=>{
        return Promise.resolve(data.data)
    })
}

export function register({name,password}){
    const url = PRODUCTION ? 'http://106.12.198.147/music2/api/register' : 'http://localhost:8002/api/register';
    // const url ='http://localhost:8002/api/register';
    let s = Math.random().toString(36).substring(2);
    let h_password = getHash(getHash(password)+s);
    return axios.post(url,{name,password:h_password,salt:s})
    .then(data=>{
        return Promise.resolve(data.data)
    })

}