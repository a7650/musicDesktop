const _FN = require("./apiRoutes_fn")
const express = require('express')
const app = express()

const apiRoutes = express.Router()

//LocalServer
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


//ProxyServer 
apiRoutes.get('/getDiscList',_FN.getDiscList)

apiRoutes.get('/getDiscSonglist',_FN.getDiscSonglist)

apiRoutes.get('/getSearch',_FN.getSearch)

apiRoutes.get('/getSingerList',_FN.getSingerList)

apiRoutes.get('/getSongList',_FN.getSongList)

apiRoutes.get('/getLyric',_FN.getLyric)


module.exports = apiRoutes