import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import { get } from "./axiosConfig"

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: "h5",
        needNewCode: 1,
        _: 1544592660936
    })
    return jsonp(url, data, options);
}

export function search(query,page,perpage,zhida) {
    const data = Object.assign({}, commonParams, {
      w: query,
      p: page,
      perpage,
      n: perpage,
      catZhida: zhida ? 1 : 0,
      zhidaqu: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      remoteplace: 'txt.mqq.all',
      uin: 0,
      needNewCode: 1,
      platform: 'h5',
      format: 'json'
    })
  
    return get("/getSearch", data).then((data) => {
      return Promise.resolve(data.data)
    })
  }