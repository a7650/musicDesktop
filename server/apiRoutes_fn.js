const MDB = require('mongodb').MongoClient
const crypto = require("crypto")
const url = 'mongodb://localhost:27017'
const axios = require('axios')
const sortInterval = 1000 * 60 * 60   //每小时排序

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

let rankSortTimer = setInterval(() => {
    DB.get('rank', rank => {
        rank.find({ flag: 2 }).toArray((err, _res) => {
            let albumList = _res[0].albumList;
            albumList.sort((a, b) => {
                return b.num - a.num
            })
            rank.updateOne({ flag: 4 }, {
                $set: { albumList: albumList.splice(0, 100) }
            })
        })
        rank.find({ flag: 1 }).toArray((err, _res) => {
            let songList = _res[0].songList;
            songList.sort((a, b) => {
                return b.num - a.num
            })
            rank.updateOne({ flag: 3 }, {
                $set: { songList: songList.splice(0, 100) }
            })
        })
    })
}, sortInterval);

const LocalServer = {
    sessionLogin(req, res) {
        let sess = req.session
        if (sess && sess.login === 1) {
            res.json({ type: 1, name: sess.name })
            req.session.touch()
        } else {
            res.json({ type: 0 })
        }
    },
    login(req, res) {
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
    },
    register(req, res) {
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
    },
    addSong(req, res) {
        let reqData = req.body
        DB.get('recommend', recommend => {
            recommend.updateOne({ flag: 1 }, {
                $addToSet: { songList: { $each: reqData } }
            })
        })
        res.json({ type: 1, mes: "添加成功" })
    },
    getRecommend(req, res) {
        DB.get('recommend', recommend => {
            recommend.find({ flag: 1 }).toArray((err, _res) => {
                res.json({ songList: _res[0].songList })
            })
        })
    },
    getUserList(req, res) {
        DB.get('allusers', allusers => {
            allusers.find({ flag: 1 }).toArray((err, _res) => {
                res.json({ nameList: _res[0].nameList })
            })
        })
    },
    songRank(req, res) {
        res.end()
        let reqData = req.body;
        DB.get('rank', rank => {
            rank.find({ flag: 1, "songList.id": reqData.id }).toArray((err, _res) => {
                if (_res.length) {
                    rank.updateOne({ flag: 1, "songList.id": reqData.id }, {
                        $inc: { "songList.$.num": 1 }
                    })
                } else {
                    reqData.num = 1;
                    rank.updateOne({ flag: 1 }, {
                        $addToSet: { songList: reqData }
                    })
                }
            })
        })
    },
    albumRank(req, res) {
        res.end()
        let reqData = req.body;
        DB.get('rank', rank => {
            rank.find({ flag: 2, "albumList.disstid": reqData.disstid }).toArray((err, _res) => {
                if (_res.length) {
                    rank.updateOne({ flag: 2, "albumList.disstid": reqData.disstid }, {
                        $inc: { "albumList.$.num": 1 }
                    })
                } else {
                    reqData.num = 1;
                    rank.updateOne({ flag: 2 }, {
                        $addToSet: { albumList: reqData }
                    })
                }
            })
        })
    },
    getSongRank(req, res) {
        DB.get('rank', rank => {
            rank.find({ flag: 3 }).toArray((err, _res) => {
                res.json({ songList: _res[0].songList })
            })
        })
    },
    getAlbumRank(req, res) {
        DB.get('rank', rank => {
            rank.find({ flag: 4 }).toArray((err, _res) => {
                res.json({ albumList: _res[0].albumList })
            })
        })
    },
    releaseSinger(req,res){
        res.end()
        let id = req.query.id;
        DB.get('singer', singer => {
            singer.updateOne({ flag: 1 }, {
                $pull: { closed:id }
            })
        })
    },
    closeSinger(req,res){
        res.end()
        let id = req.query.id;
        DB.get('singer', singer => {
            singer.updateOne({ flag: 1 }, {
                $addToSet: { closed:id }
            })
        })
    },
    getClosedSinger(req,res){
        DB.get('singer', singer => {
            singer.find({flag:1}).toArray((err,_res)=>{
                res.json(_res[0].closed)
            })
        })
    }
}

const ProxyServer = {
    getDiscList(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
            params: req.query
        }).then(response => {
            res.json(response.data)
        }).catch(e => {
            console.log(e)
        })
    },
    getDiscSonglist(req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://y.qq.com/n/yqq/playsquare'
            },
            params: req.query
        }).then(response => {
            res.json(response.data)
        }).catch(e => {
            console.log(e);
        })
    },
    getSearch(req, res) {
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
    },
    getSingerList(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://y.qq.com/portal/singer_list.html'
            },
            params: req.query
        }).then(response => {
            res.json(response.data)
        }).catch(e => {
            console.log(e)
        })
    },
    getSongList(req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://y.qq.com/n/yqq/singer/'
            },
            params: req.query
        }).then(response => {
            res.json(response.data)
        }).catch(e => {
            console.log(e)
        })
    },
    getLyric(req, res) {
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
    }
}





module.exports = { ...LocalServer, ...ProxyServer }

