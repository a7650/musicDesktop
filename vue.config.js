const axios = require('axios')
const path = require('path')

function resolve(dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  //基本路径
  publicPath: './',
  //输出文件目录
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: './',
  //以多页模式构建应用程序。
  pages: undefined,
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  //生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  devServer: {
    host: "0.0.0.0",
    port: 9000,
    https: false,
    hotOnly: true,

    before(app) {
      app.get('/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/playlist.html',
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      }),

        app.get('/getSingerList', function (req, res) {
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
        }),

        app.get('/getSongList', function (req, res) {
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
        }),

        app.get('/getLyric', function (req, res) {
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
        }),

        app.get('/getDiscSongList', function (req, res) {
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
        })

      app.get('/getSearch', function (req, res) {
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

      app.get('/getDiscItem', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })
      })


    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'src': resolve('src'),
        'common': resolve('src/assets/common'),
        'components': resolve('src/components'),
        'api': resolve('src/assets/api'),
        'base': 'src/base'
      }
    }
  }
}
