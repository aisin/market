
/**
 * 发布主题
 */

exports.newTopic = function (req, res, next) {
    res.render('topic/new', {
        user: req.user,
        csrfToken: req.csrfToken(),
        message: req.flash('newTopicMsg')
    });
};