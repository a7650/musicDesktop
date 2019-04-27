const express = require('express')
const app = express()
const _FN = require("./apiRoutes_fn")

const apiRoutes = express.Router()

apiRoutes.get('/sessionLogin', _FN.sessionLogin)

apiRoutes.post('/login', _FN.login)

apiRoutes.post('/register', _FN.register)

apiRoutes.post('/addSong', _FN.addSong)

apiRoutes.get('/getRecommend', _FN.getRecommend)

apiRoutes.get('/getUserList', _FN.getUserList)

apiRoutes.post('/songRank',_FN.songRank)

apiRoutes.post('/albumRank',_FN.albumRank)

apiRoutes.get('/getSongRank', _FN.getSongRank)

apiRoutes.get('/getAlbumRank', _FN.getAlbumRank)



module.exports = apiRoutes