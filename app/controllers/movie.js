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
    Movie
        .fetch(function(err, movies) {
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
    var id = req.query.id;

    if (id) {
        Movie
            .remove({
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
        Movie
            .findByUrl(url, function(err, movie) {
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
