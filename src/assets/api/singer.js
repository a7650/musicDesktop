import {commonParams, options } from './config'
import { get} from "./axiosConfig"


export function getSingerList(){
    const data = Object.assign({},commonParams,{
        loginUin:0,
        hostUin:0,
        platform:"yqq",
        needNewCode:0,
        data:JSON.stringify({"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}})
    });
    return get("/getSingerList",data).then( data => {
        let list = data.singerList.data;
        return Promise.resolve(list);
    })
}

export function getSongList(mid,begin,num){
    const data = Object.assign({},commonParams,{
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        needNewCode: 0,
        platform:'yqq',
        singermid: mid,
        order: 'listen',
        songstatus: 1,
        begin,
        num
    });
    return get("/getSongList",data).then(data => {
        return Promise.resolve(data.data);
    })
}