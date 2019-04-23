const express = require('express')
const MDB = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const crypto = require("crypto")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()
const url = 'mongodb://localhost:27017'
const sessionUrl = 'mongodb://localhost:27017/session'
const apiRoutes = express.Router()
const sessionSecret = Math.random().toString(36).substring(2)
// const axios = require("axios")
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

app.use(cookieParser())
    .use(session({
        secret: sessionSecret,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            url: sessionUrl,
            ttl: 14 * 24 * 60 * 60 // = 14 days. Default
        }),
        cookie: { httpOnly: true, maxAge: 600000 }
    }))
    .use(bodyParser.json())
    .use(function (req, res, next) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    })

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
            allusers.updateOne({flag:1},{
                $addToSet:{nameList:reqData.name}
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

apiRoutes.get('/getUserList',function(req,res){
    DB.get('allusers', allusers => {
        allusers.find({ flag: 1 }).toArray((err, _res) => {
            res.json({ nameList: _res[0].nameList })
        })
    })
})
// apiRoutes.get('/search', function (req, res) {
//     const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
//     axios.get(url, {
//       headers: {
//         origin: 'https://y.qq.com',
//         referer: 'https://y.qq.com/m/index.html',
//       },
//       params: req.query
//     }).then(response => {
//       res.json(response.data)
//     }).catch(e => {
//       console.log(e)
//     })
//   })

app.use('/api', apiRoutes)

app.listen(8002, function () {
    console.log('服务器已启动', 'music2 8002')
})

app.use(express.static('./dist'))
