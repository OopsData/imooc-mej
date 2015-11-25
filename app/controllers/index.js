exports.index = function(req, res) {
    console.log('user in session: ');
    console.log(req.session.user);

    res.render('index', {
        title: '首页'
    })
}
