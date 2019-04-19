const express = require('express')
const app = express()
const MDB = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const bodyParser = require('body-parser')
const apiRoutes = express.Router()
const crypto = require("crypto")

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


app.use(bodyParser.json());

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
                res.json({ type: 1, mes: "注册成功" })
            })
        })
    })

    app.use('/api', apiRoutes)

    app.listen(8002, function () {
        console.log('服务器已启动', 'music2 8002')
    })

    app.use(express.static('./dist'))
