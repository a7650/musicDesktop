const apiRoutes = require('./apiRoutes')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()
const sessionUrl = 'mongodb://localhost:27017/session'
const sessionSecret = Math.random().toString(36).substring(2)


// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });

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
        next();
    })

app.use('/api', apiRoutes)

app.listen(8002, function () {
    console.log('服务器已启动', 'music2 8002')
})

app.use(express.static('../dist'))
