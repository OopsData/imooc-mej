var Stat = require('../models/stat')
var Movie = require('../models/movie')

/* {{{ private function _extend() */
var _extend = function(a, b) {
    a = a || {};
    for (var i in b) {
        a[i] = b[i];
    }
    return a;
};
/* }}} */

exports.list = function(req, res) {
    Stat
        .find({})
        .populate('movie', 'subtitle')
        .sort('meta.createAt')
        .exec(function(err, stats) {
            if (err) {
                console.log(err);
            }
            res.render('statlist', {
                title: '统计列表页',
                stats: stats
            })
        })
}
exports.del = function(req, res) {
    var id = req.query.id;

    if (id) {
        Stat
            .remove({_id: id}, function(err, movie) {
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
    var q = req.query.q;

    if (q) {
        Movie
            .find({title: q})
            .exec(function(err, movies) {
                if (err) {
                    console.log(err);
                } else {
                    var statAll = []
                    for (var i=0; i<movies.length; i++) {
                        (function(i) {
                            Stat
                                .find({movie: movies[i]._id})
                                .exec(function(err, stat) {
                                    (function() {
                                        console.log('aaa '+stat);
                                        // statAll.push(stat)
                                        statAll = _extend(statAll, stat)
                                    }())
                                })
                            console.log('bbb '+statAll);
                            // statAll.push(i)
                        }(i))
                    }
                    console.log(statAll);
                    // res.render('statlist', {
                    //     title: '统计列表页',
                    //     stats: statAll
                    // })
                }
            })
    } else {
        Stat
            .find({})
            .populate('movie', 'subtitle')
            .sort('meta.createAt')
            .exec(function(err, stats) {
                if (err) {
                    console.log(err);
                }
                res.render('statlist', {
                    title: '统计列表页',
                    stats: stats
                })
            })
    }
}
