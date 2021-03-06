var Eventproxy = require('eventproxy');
var _ = require('lodash');
var XSS = require('xss');
var Comment = require('../models/comment');
var Notice = require('../models/notice');
var topicLib = require('../libs/topic');
var userLib = require('../libs/user');
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

    // 获取被 @ 的用户名
    var atUsers = atLib.fetchUsers(content);
    var proxy = new Eventproxy();
    proxy.fail(next);

    if(!atUsers.length) proxy.unbind();

    // 生成回复或者 @ 的 Notice
    proxy.on('commentId', function(commentId){
        userLib.getUsersByUsernameAry(atUsers, function(atUsersIds){
            atUsersIds.forEach(function(item){
                new Notice({
                    whose: item,
                    from: me,
                    topic: topic_id,
                    comment: commentId,
                    type: 1
                }).save();
            });
        });
    });

    // 生成 Notice

    var ep = new Eventproxy();
    ep.fail(next);

    var events = ['commentId', 'topicAuthorId'];
    ep.all(events, function(commentId, topicAuthorId){
        new Notice({
            whose: topicAuthorId,
            from: me,
            topic: topic_id,
            comment: commentId,
            type: 0
        }).save();
    });

    ep.on('err', function (msg) {
        req.flash('commentAddMsg', msg);
        res.redirect('/t/' + topic_id + '#cmt');
    });

    if (!content) {
        return ep.emit('err', '评论内容不能为空');
    }

    // 创建评论

    new Comment(_comment).save(function (err, ret) {
        res.redirect('/t/' + topic_id);
        proxy.emit('commentId', ret._id);
        ep.emit('commentId', ret._id);
    });

    // 查询话题作者

    topicLib.getAuthorByTopic(topic_id, function(err, ret){
        ep.emit('topicAuthorId', ret.author);
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