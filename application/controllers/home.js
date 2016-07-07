
/**
 * 首页
 */

exports.index = function (req, res, next) {
    res.render('home/index', {
        user: req.user,
        message: req.flash('homeMsg')
    });
};