exports.index = function(req, res, next){
    req.flash('homeMsg', 'this is the home page.');
    res.render('home/index', {
        message: req.flash('homeMsg')
    });
}