var _ = require('lodash');

/**
 * 发布主题
 */

exports.newTopic = function (req, res, next) {

    console.log(req.user);
    console.log(req.user._id);
    res.render('topic/new', {
        user: req.user,
        csrfToken: req.csrfToken(),
        message: req.flash('newTopicMsg')
    });
    
};

exports.doNewTopic = function (req, res, next) {

    var _topic = {
        title : _.trim(req.body.title),
        content : _.trim(req.body.content),
        nodes : req.body.nodes,
        author_id : req.user._id,
        last_reply : req.user._id
    };

    console.log(_topic);
}