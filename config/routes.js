var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Stat = require('../app/controllers/stat')

module.exports = function(app) {
    // pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user
        app.locals.user = _user
        next()
    })

    // index
    app.get('/', Index.index)

    // user model
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    // stat model
    app.get('/admin/stat/list', User.signinRequired, User.adminRequired, Stat.list)
    app.delete('/admin/stat/list', User.signinRequired, User.adminRequired, Stat.del)
    app.get('/admin/stat/search', User.signinRequired, User.adminRequired, Stat.search)

    // movie model
    app.get('/admin/movie/search', User.signinRequired, User.adminRequired, Movie.search)
    app.get('/admin/movie/add', User.signinRequired, User.adminRequired, Movie.add)
    app.post('/admin/movie/track', User.signinRequired, User.adminRequired, Movie.track)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

}
