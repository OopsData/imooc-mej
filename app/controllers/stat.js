var Stat = require('../models/stat')
var Movie = require('../models/movie')
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
        // Movie
        //     .find({title: q})
        //     .exec(function(err, movies) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             var statAll = []
        //             for (var i=0; i<movies.length; i++) {
        //                 (function(i) {
        //                     for (var j=0; j<movies[i].stats.length; j++) {
        //                         statAll.push(movies[i].stats)
        //                     }
        //                 }(i))
        //             }
        //             for (var k=0; k<statAll.length; k++) {
        //                 Stat
        //                     .find({_id: statAll[k]})
        //                     .exec(function(err, stats) {

        //                     })
                        
        //             }
        //         }
        //     })
        // console.log(statAll);
        res.render('statlist', {
            title: '统计列表页',
            stats: {}
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
