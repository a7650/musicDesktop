const _FN = require("./apiRoutes_fn")
const express = require('express')
const app = express()

const apiRoutes = express.Router()

//LocalServer
apiRoutes.post('/login', _FN.login)

apiRoutes.post('/register', _FN.register)

apiRoutes.post('/addSong', _FN.addSong)

apiRoutes.post('/songRank',_FN.songRank)

apiRoutes.post('/albumRank',_FN.albumRank)

apiRoutes.get('/sessionLogin', _FN.sessionLogin)

apiRoutes.get('/getRecommend', _FN.getRecommend)

apiRoutes.get('/getUserList', _FN.getUserList)

apiRoutes.get('/getSongRank', _FN.getSongRank)

apiRoutes.get('/getAlbumRank', _FN.getAlbumRank)

apiRoutes.get('/closeSinger',_FN.closeSinger)

apiRoutes.get('/releaseSinger',_FN.releaseSinger)

apiRoutes.get('/getClosedSinger',_FN.getClosedSinger)
//ProxyServer 
apiRoutes.get('/getDiscList',_FN.getDiscList)

apiRoutes.get('/getDiscSonglist',_FN.getDiscSonglist)

apiRoutes.get('/getSearch',_FN.getSearch)

apiRoutes.get('/getSingerList',_FN.getSingerList)

apiRoutes.get('/getSongList',_FN.getSongList)

apiRoutes.get('/getLyric',_FN.getLyric)


module.exports = apiRoutes