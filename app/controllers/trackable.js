var Trackable = require('../models/trackable')
var _ = require('underscore')

exports.track = function(req, res) {
    var url = req.query.url;
    var state = req.query.trackable == 1 ? true : false
    var trackableObj = {
        state: state
    }
    var _trackable

    if (url) {
        Trackable.findByUrl(url, function(err, data) {
            if (err) {
                console.log(err);
            }
            if (data) {
                _trackable = _.extend(data, trackableObj)
                _trackable.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
            } else {
                _trackable = new Trackable({
                    url: url,
                    state: state
                })
                _trackable.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        })
    }
}
exports.list = function(req, res) {
    Trackable.find({}, function(err, trackable) {
        if (err) {
            console.log(err);
        }

        res.render('tracklist', {
            title: '跟踪列表页',
            trackable: trackable
        })
    })
}
