import {commonParams, options,PRODUCTION} from './config'
import axios from 'axios'

export function getSingerList(){
    const url = PRODUCTION ? 'http://106.12.198.147/music/api/getSingerList' : '/getSingerList';
    const data = Object.assign({},commonParams,{
        loginUin:0,
        hostUin:0,
        platform:"yqq",
        needNewCode:0,
        data:JSON.stringify({"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}})
    });
    return axios.get(url,{
        params:data
    }).then( res => {
        let list = res.data.singerList.data;
        return Promise.resolve(list);
    })
}

export function getSongList(mid,begin,num){
    const url = PRODUCTION ? 'http://106.12.198.147/music/api/getSongList' : '/getSongList';
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
    return axios.get(url,{
        params:data
    }).then(res => {
        let list = res.data.data; 
        return Promise.resolve(list);
    })
}