var express = require('express')
var path = require('path')
var logger = require('morgan');
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var dbUrl = 'mongodb://localhost/imooc-mej'
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser');

mongoose.connect(dbUrl)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave:false,
    saveUninitialized:true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.locals.moment = require('moment')

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger('dev'));
    app.locals.pretty = true
    mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)

console.log('web page started on port ' + port);