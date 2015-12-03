var Movie = require('../models/movie')
var Stat = require('../models/stat')
var request = require('request')
var cheerio = require('cheerio')
var async = require('async')

/* {{{ private function _extend() */
var _extend = function(a, b) {
    a = a || {};
    for (var i in b) {
        a[i] = b[i];
    }
    return a;
};
/* }}} */

var _acquireData = function(data, q) {
    var $ = cheerio.load(data)
    var list_item = $('.mod_result_list .list_item')
    var albumid
    list_item.each(function() {
        if ($(this).attr('data-widget-searchlist-tvname') == q) {
            albumid = $(this).attr('data-widget-searchlist-albumid')
            return false // break the loop
        }
    })
    return albumid
}
exports.search = function(req, res) {
    var q = req.query.q;

    if (q) {
        Movie
            .fetch(q, function(err, movies) {
                if (err) {
                    console.log(err);
                }

                res.render('movielist', {
                    title: '资源列表页',
                    movies: movies
                })
            })
    } else {
        Movie
            .fetch(null, function(err, movies) {
                if (err) {
                    console.log(err);
                }

                res.render('movielist', {
                    title: '资源列表页',
                    movies: movies
                })
            })
    }
}
exports.add = function(req, res) {
    var q = req.query.q

    if (q) {
        async.waterfall([
            function(cb) {
                // http://so.iqiyi.com/so/q_琅琊榜
                var requrl = 'http://so.iqiyi.com/so/q_' + encodeURIComponent(q)
                request(requrl, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var ret = _acquireData(body, q)
                        cb(null, ret)
                    } else {
                        console.log(error);
                    }
                })
            },
            function(data, cb) {
                // http://cache.video.qiyi.com/jp/avlist/202121101/0/'
                var requrl = 'http://cache.video.qiyi.com/jp/avlist/' + data + '/0/'
                console.log(requrl);
                request(requrl, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var reg = /var\s*tvInfoJs\s*=\s*()/
                        var vdata = body.replace(reg, '$1')
                        vdata = JSON.parse(vdata).data.vlist
                        cb(null, vdata)
                    } else {
                        console.log(error);
                    }
                })
            },
            function(data, cb) {
                for (var i=0; i<data.length; i++) {
                    (function(i) {
                        Movie.findOne({url: data[i].vurl}, function(err, movie) {
                            if (err) {
                                console.log(err);
                            }
                            if (movie === null) {
                                var _movie
                                _movie = new Movie({
                                    url: data[i].vurl,
                                    vn: data[i].vn.replace(/[^0-9]/ig, ""),
                                    state: true,
                                    duration: data[i].timeLength,
                                    subtitle: data[i].vt,
                                    title: q,
                                    publishTime: data[i].publishTime
                                })
                                _movie.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                                cb(null)
                            } else {
                                cb('already exist!')
                            }
                        })
                    }(i))
                }
            }
        ], function(err, result) {
            console.log(err);
        })
    }
}
exports.track = function(req, res) {
    var url = req.body.url.split(',')
    var state = req.body.state == 1 ? true : false
    var movieObj = {
        state: state
    }
    var _movie

    if (url) {
        for (var i=0; i<url.length; i++) {
            (function(i) {
                Movie
                    .findOne({url: url[i]}, function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        if (data) {
                            _movie = _extend(data, movieObj)
                            _movie.save(function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        } else {
                            _movie = new Movie({
                                url: url,
                                state: state,
                            })
                            _movie.save(function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        }
                    })
            }(i))
        }
    }
}
exports.list = function(req, res) {
    Movie
        .fetch(null, function(err, movies) {
            if (err) {
                console.log(err);
            }
            
            res.render('movielist', {
                title: '资源列表页',
                movies: movies
            })
        })
}
exports.del = function(req, res) {
    var id = req.query.id.split(',')

    if (id) {
        for (var i=0; i<id.length; i++) {
            (function(i) {
                async.series([
                    function(cb) {
                        Movie
                            .remove({_id: id[i]}, function(err, movie) {
                                if (err) {
                                    cb('remove movie error')
                                }
                                cb(null)
                            })
                    },
                    function(cb) {
                        Stat
                            .remove({'movie': id[i]}, function(err, stats) {
                                if (err) {
                                    cb('remove stat error')
                                }
                                cb(null)
                            })
                    }
                ],
                function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                })
            }(i))
        }
    }
    res.send()
}
