var Eventproxy = require('eventproxy');
var _ = require('lodash');
var Comment = require('../models/comment');
var commentLib = require('../libs/comment');

/**
 * 评论列表
 */

exports.list = function (req, res, next) {

    var topic_id = req.params.id;

    commentLib.getCommentsByTopic(topic_id, function (err, comments) {
        res.render('comment/list', {
            comments: comments
        });
    });
}

/**
 * 添加评论
 */

exports.add = function (req, res, next) {

    var me = req.user && req.user._id,
        topic_id = req.params.id,
        content = _.trim(req.body.content);

    console.log('topic_id', topic_id)

    var _comment = {
        author: me,
        topic: topic_id,
        content: content
    };

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('err', function (msg) {
        req.flash('commentAddMsg', msg);
        res.redirect('/t/' + topic_id +'#commentDo');
    });

    if (!content) {
        return ep.emit('err', '评论内容不能为空');
    }

    new Comment(_comment).save(function (err, ret) {
        res.redirect('/t/' + topic_id);
    });
}