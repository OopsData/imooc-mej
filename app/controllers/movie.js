var Movie = require('../models/movie')
var _ = require('underscore')
var request = require('request')
var async = require('async')

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
            title: movie.title,
            movie: movie
        })
    })
}

exports.new = function(req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            url: '',
            name: '',
            playCount: '',
            duration: '',
            upCount: '',
            downCount: '',
            imageUrl: ''
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

exports.crawl = function(req, res) {
    var url = req.query.url;

    if (url) {
        async.waterfall([
            function(cb) {
                var iqiyiUrl = url;

                request(iqiyiUrl, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var ret = acquireData(body);
                        cb(null, ret);
                    } else {
                        console.log(response.statusCode);
                    }
                });
            },
            function(data, cb) {
                var dataUrl = 'http://mixer.video.iqiyi.com/jp/recommend/videos?'
                            + 'referenceId=' + data.tvId
                            + '&albumId=' + data.albumId
                            + '&channelId=2&cookieId=&withRefer=true&area=zebra&size=10&type=video&pru=&locale=&playPlatform=PC_QIYI';

                request(dataUrl, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // res.json({
                        //     success: 1,
                        //     data: body
                        // })
                        var reg = /var\s*tvInfoJs\s*=\s*()/
                        var data = body.replace(reg, '$1')
                        data = eval('(' + data + ')')
                        cb(null, data.mixinVideos[0].name);
                    } else {
                        console.log(response.statusCode);
                    }
                })
            },
            function(data, cb) {
                console.log(data);
            }
        ]);
    }
}