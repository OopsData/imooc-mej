var Movie = require('../models/movie')
var _ = require('underscore')
var request = require('request')
var async = require('async')
var later = require('later')

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
exports.crawl = function(req, res) {
    var url = req.query.url
    var isStop = req.query.stop
    var sched = later.parse.text('every 5 secs')
    if (url) {
        var timer = later.setInterval(myCrawl, sched);
        function myCrawl() {        
            async.waterfall([
                function(cb) {
                    request(url, function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var ret = acquireData(body);
                            cb(null, ret);
                        } else {
                            console.log(response.statusCode);
                        }
                    });
                },
                function(data, cb) {
                    var mixerUrl = 'http://mixer.video.iqiyi.com/jp/mixin/videos/' + data.tvId
                    var tvId = data.tvId
                    request(mixerUrl, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var reg = /var\s*tvInfoJs\s*=\s*()/
                            var data = body.replace(reg, '$1')
                            data = JSON.parse(data)
                            var tempObj = {
                                "commentCount": data.commentCount,
                                "duration": data.duration,
                                "playCount": data.playCount,
                                "shareCount": data.shareCount,
                                "subtitle": data.subtitle,
                                "tvId": tvId
                            }
                            cb(null, tempObj);
                        } else {
                            console.log(response.statusCode);
                        }
                    })
                },
                function(data, cb) {
                    var upUrl = 'http://up.video.iqiyi.com/ugc-updown/quud.do?dataid=' + data.tvId + '&type=2'
                    var tempObj = data
                    request(upUrl, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var reg = /try{null\((.*)\)}catch\(e\){}/
                            var data = body.replace(reg, '$1')
                            data = JSON.parse(data)
                            var movieObj = {
                                "commentCount": tempObj.commentCount,
                                "duration": tempObj.duration,
                                "playCount": tempObj.playCount,
                                "shareCount": tempObj.shareCount,
                                "subtitle": tempObj.subtitle,
                                "score": data.data.score,
                                "upCount": data.data.up,
                                "downCount": data.data.down
                            }
                            cb(null, movieObj);
                        } else {
                            console.log(response.statusCode);
                        }
                    })
                },
                function(data, cb) {
                    // update mongo by the value
                    var movieObj = data
                    var _movie
                    _movie = new Movie({
                        url: url,
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
                    })
                    // res.json({
                    //     success: 1,
                    //     data: data
                    // })
                }
            ]);
        }
        if (isStop === 0) {
            later.setTimeout(function() {
                console.log('clear!');
                timer.clear()
            })
        }
    }
}