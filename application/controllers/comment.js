var Eventproxy = require('eventproxy');
var _ = require('lodash');
var XSS = require('xss');
var Comment = require('../models/comment');
var commentLib = require('../libs/comment');
var atLib = require('../libs/at');
var config = require('../../config.js');
var xss = new XSS.FilterXSS(config.xssOptions);

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
        content = xss.process(_.trim(req.body.content)).replace(/\r\n/g, '<br>');

    // console.log('topic_id', topic_id)

    var _comment = {
        author: me,
        topic: topic_id,
        content: atLib.linkUsers(content) // at users
    };

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('err', function (msg) {
        req.flash('commentAddMsg', msg);
        res.redirect('/t/' + topic_id + '#cmt');
    });

    if (!content) {
        return ep.emit('err', '评论内容不能为空');
    }

    new Comment(_comment).save(function (err, ret) {
        res.redirect('/t/' + topic_id);
    });
}

/**
 * 评论点赞
 */

exports.like = function (req, res, next) {

    var me = req.user && req.user._id,
        id = req.body.id;

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('like', function (ret) {
        Comment.update({ _id: id }, ret.run).exec(function () {
            res.json({ success: true, like: ret.like, message: '操作成功' });
        });
    });

    Comment.findOne({ _id: id }, function (err, comment) {
        if (err) return next(err);

        if (comment.like.indexOf(me) > -1) {
            ep.emit('like', {
                run: { $pull: { like: me } },
                like: false
            });
        } else {
            ep.emit('like', {
                run: { $push: { like: me } },
                like: true
            });
        }
    });
}