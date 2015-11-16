var Movie = require('../models/movie')
var _ = require('underscore')

function acquireData(data) {
    var reg = /Q.PageInfo.playPageInfo\s=\s([^;]*)\;/;
    data = data
            .match(reg)[0]
            .replace(reg, '$1');
    data = eval('(' + data + ')');
    return data;
}
exports.detail = function(req, res) {
    var id = req.params.id
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: movie.subtitle,
            movie: movie
        })
    })
}
exports.new = function(req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            url: '',
            subtitle: '',
            playCount: '',
            duration: '',
            upCount: '',
            downCount: '',
            shareCount: '',
            score: '',
            commentCount: ''
        }
    })
}
// admin update movie
exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
}
// admin post movie
exports.save = function(req, res) {
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

                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            url: movieObj.url,
            subtitle: movieObj.subtitle,
            playCount: movieObj.playCount,
            duration: movieObj.duration,
            upCount: movieObj.upCount,
            downCount: movieObj.downCount,
            commentCount: movieObj.commentCount,
            score: movieObj.score,
            shareCount: movieObj.shareCount
        })

        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/')
        })
    }
}
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: '列表页',
            movies: movies
        })
    })
}
// list delete movie
exports.del = function(req, res) {
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
}
exports.search = function(req, res) {
    var url = req.query.url;

    if (url) {
        Movie.findByUrl(url, function(err, movie) {
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
}
