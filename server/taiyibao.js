
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

const apiRoutes = express.Router()


// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        res.sendStatus(200);
    }else {
        next();
    }
})

apiRoutes.post('/productDetail', function (req, res) {
    axios.post("https://camsdev.cpic.com.cn/cams/app/productDetail", req).then(result => {
        res.json(result.data)
    })
})

// app
// .use(bodyParser.json())
// .use(function (req, res, next) {
//     next();
// })

app.use('/api', apiRoutes)

app.listen(8003, function () {
            console.log('服务器已启动', '8003')
        })

// app.use(express.static('../dist'))
