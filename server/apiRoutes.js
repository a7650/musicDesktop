const express = require('express')
const app = express()
const crypto = require("crypto")
const MDB = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const axios = require("axios")
const apiRoutes = express.Router()

function getHash(val) {
    let hash = crypto.createHash("sha256");
    hash.update(val);
    return hash.digest("hex");
}

function connectMDB(fn) {
    MDB.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            throw new Error('error:connectMDB() error', err.message)
        }
        fn(db)
    })
}

const DB = {
    get(name, fn) {
        connectMDB(db => {
            let _db = db.db('music2users')
            var _collection = _db.collection(name)
            fn(_collection)
            // db.close()
        })
    },
    create(name, fn) {
        connectMDB(db => {
            let users = db.db('music2users')
            users.createCollection(name, (err, res) => {
                if (err) {
                    throw new Error('error:user-create() error', err.message)
                }
                fn(res)
                db.close()
            })
        })
    }
}


apiRoutes.get('/sessionLogin', function (req, res) {
    let sess = req.session
    if (sess && sess.login === 1) {
        res.json({ type: 1, name: sess.name })
        req.session.touch()
    } else {
        res.json({ type: 0 })
    }
})

apiRoutes.post('/login', function (req, res) {
    let reqData = req.body;
    DB.get('allusers', allusers => {
        allusers.find({ f: 0 }).toArray((err, _res) => {
            if (err) {
                console(err)
            } else {
                let u = _res[0]
                let userData = u[reqData.name]
                if (!userData) {
                    res.json({ type: 0, mes: "账号或密码错误,请重试" })
                } else {
                    let h_password = getHash(reqData.password + userData.salt);
                    let resData = h_password === userData.password ? { type: 1, mes: "登录成功" } : { type: 0, mes: "账号或密码错误,请重试" }
                    if (resData.type === 1) {
                        let sess = req.session
                        sess.name = reqData.name
                        sess.login = 1
                        // console.log(req.session)
                    }
                    res.json(resData)
                }
            }
        })
    })
})

apiRoutes.post('/register', function (req, res) {
    let reqData = req.body;
    DB.get('allusers', allusers => {
        new Promise(function (resolve, reject) {
            allusers.find({ f: 0 }).toArray((err, _res) => {
                if (err) {
                    reject(err)
                } else {
                    let u = _res[0]
                    if (u[reqData.name]) {
                        res.json({ type: 0, mes: "账号已存在" })
                        reject()
                    } else {
                        resolve()
                    }
                }
            })
        }).then(function () {
            let userData = {}
            userData[reqData.name] = { password: reqData.password, salt: reqData.salt }
            allusers.updateOne({ f: 0 }, {
                $set: userData
            })
            allusers.updateOne({ flag: 1 }, {
                $addToSet: { nameList: reqData.name }
            })
            res.json({ type: 1, mes: "注册成功" })
        })
    })
})

apiRoutes.post('/addSong', function (req, res) {
    let reqData = req.body
    DB.get('recommend', recommend => {
        recommend.updateOne({ flag: 1 }, {
            $addToSet: { songList: { $each: reqData } }
        })
    })
    res.json({ type: 1, mes: "添加成功" })
})

apiRoutes.get('/getRecommend', function (req, res) {
    DB.get('recommend', recommend => {
        recommend.find({ flag: 1 }).toArray((err, _res) => {
            res.json({ songList: _res[0].songList })
        })
    })
})

apiRoutes.get('/getUserList', function (req, res) {
    DB.get('allusers', allusers => {
        allusers.find({ flag: 1 }).toArray((err, _res) => {
            res.json({ nameList: _res[0].nameList })
        })
    })
})

apiRoutes.post('/songRank',function(req,res){
    let reqData = req.body;
    DB.get('rank', rank => {
        rank.find({flag:1}).toArray((err,_res)=>{
            let songList = _res[0].songList;
           let n = songList.findIndex(item=>item.id===reqData.id);
           if(n>-1){
               rank.updateOne({ flag: 1 ,"songList.id":reqData.id}, {
                   $inc: { "songList.$.num":1 }
               })
           }else{
               reqData.num = 1;
                rank.updateOne({ flag: 1 }, {
                   $addToSet: { songList: reqData }
               })
           }
        })
    })
})

apiRoutes.post('/albumRank',function(req,res){
    let reqData = req.body;
    DB.get('rank', rank => {
        rank.find({flag:2}).toArray((err,_res)=>{
            let albumList = _res[0].albumList;
           let n = albumList.findIndex(item=>item.disstid===reqData.disstid);
           if(n>-1){
               rank.updateOne({ flag: 2 ,"albumList.disstid":reqData.disstid}, {
                   $inc: { "albumList.$.num":1 }
               })
           }else{
               reqData.num = 1;
                rank.updateOne({ flag: 2 }, {
                   $addToSet: { albumList: reqData }
               })
           }
        })
    })
})

apiRoutes.get('/getSongRank', function (req, res) {
    DB.get('rank', rank => {
        rank.find({ flag: 1 }).toArray((err, _res) => {
            res.json({ songList: _res[0].songList })
        })
    })
})

apiRoutes.get('/getAlbumRank', function (req, res) {
    DB.get('rank', rank => {
        rank.find({ flag: 2 }).toArray((err, _res) => {
            res.json({ albumList: _res[0].albumList })
        })
    })
})

apiRoutes.get('/search', function (req, res) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
      params: req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e)
    })
  })

  apiRoutes.get('/getLyric', function (req, res) {
    const url = 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/portal/player.html'
      },
      params: req.query
    }).then(response => {
      let data = response.data
      if (typeof data === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = data.match(reg)
        if (matches) {
          data = JSON.parse(matches[1])
        }
      }
      res.json(data)
    }).catch(e => {
      console.log(e)
    })
  })

module.exports = apiRoutes