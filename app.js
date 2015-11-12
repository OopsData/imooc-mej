var express = require('express')
var path = require('path')
var logger = require('morgan');
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/imooc-mej')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port);

app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })
})

app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
})

app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            name: '',
            playCount: '',
            duration: '',
            upCount: '',
            downCount: '',
            imageUrl: ''
        }
    })
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/')
            })
        })
    } else {
        _movie = new Movie({
            name: movieObj.name,
            playCount: movieObj.playCount,
            duration: movieObj.duration,
            upCount: movieObj.upCount,
            downCount: movieObj.downCount,
            imageUrl: movieObj.imageUrl
        })

        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/')
        })
    }
})

app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
})

app.get('/admin/list_target', function(req, res) {
    var name = req.query.name;

    if (name) {
        Movie.findByName(name, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1,
                    movie: movie
                })
            }
        })
    }
})

// list delete movie
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({
            _id: id
        }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
})
