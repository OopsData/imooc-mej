var User = require('../models/user')

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    })
}

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    })
}

// sign up
exports.signup = function(req, res) {
    var _user = req.body.user

    User
        .find({
            name: _user.name
        }, function(err, users) {
            if (err) {
                console.log(err);
            }
            if (users) {
                return res.redirect('/signup')
            } else {
                var user = new User(_user)
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/')
                })
            }
        })
}

// sign in
exports.signin = function(req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User
        .findOne({
            name: name
        }, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                return res.redirect('/signin')
            }
            user
                .comparePassword(password, function(err, isMatch) {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        req.session.user = user

                        return res.redirect('/')
                    } else {
                        return res.redirect('/signin')
                        console.log('Password is not matched');
                    }
                })
        })
}

// log out
exports.logout = function(req, res) {
    delete req.session.user
        // delete app.locals.user
    res.redirect('/')
}

// middleware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user
    if (!user) {
        return res.redirect('/signin')
    }
    next()
}

// middleware for user
exports.adminRequired = function(req, res, next) {
    var user = req.session.user

    // if (user.role <= 10) {
    //     return res.redirect('/signin')
    // }
    next()
}

exports.list = function(req, res) {
    User
        .fetch(function(err, users) {
            if (err) {
                console.log(err);
            }

            res.render('userlist', {
                title: '用户列表页',
                users: users
            })
        })
}
