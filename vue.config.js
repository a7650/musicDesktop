const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: './',
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
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240
        // deleteOriginAssets:false
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerHost: "127.0.0.1",
        analyzerPort: 8888,
        reportFilename: "report.html",
        defaultSizes: "parsed",
        openAnalyzer: false,
        generateStatsFile: false,
        statsFilename: "stats.json",
        statsOptions: null,
        logLevel: "info"
      })
    ],
    externals: {
      "echarts": "echarts",
      "crypto": "CryptoJS"
    }
  },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
