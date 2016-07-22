var Eventproxy = require('eventproxy');
var _ = require('lodash');
var Topic = require('../models/topic');
var Comment = require('../models/comment');
var categoryLib = require('../libs/category');
var commentLib = require('../libs/comment');

/**
 * 发布主题
 */

exports.newTopic = function (req, res, next) {

    categoryLib.getAllCategories(function (err, categories) {
        if (err) return next(err);

        res.render('topic/new', {
            user: req.user,
            title: '发布话题',
            categories: categories,
            message: req.flash('newTopicMsg')
        });
    });
};

/**
 * 发布话题操作
 */

exports.doNewTopic = function (req, res, next) {

    var _topic = {
        title: _.trim(req.body.title),
        content: _.trim(req.body.content),
        category: req.body.category,
        author: req.user._id,
        last_reply: req.user._id
    };

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('ok', function (topic) {
        res.redirect('/t/' + topic._id);
    });

    ep.on('err', function (msg) {
        req.flash('newTopicMsg', msg);
        res.redirect('/t/new');
    });

    if (!_topic.title) {
        return ep.emit('err', '标题不能为空');
    } else if (!_topic.content) {
        return ep.emit('err', '话题内容不能为空');
    } else if (!_topic.category) {
        return ep.emit('err', '请为话题选择一个节点');
    }

    new Topic(_topic).save(function (err, topic) {
        if (err) return next(err);
        ep.emit('ok', topic);
    });
}

/**
 * 话题详情
 */

exports.detail = function (req, res, next) {

    var me = req.user && req.user._id,
        id = req.params.id;

    var ep = new Eventproxy();
    var events = ['topic', 'comments'];
    ep.fail(next);

    ep.all(events, function (topic, comments) {
        res.render('topic/detail', {
            user: req.user,
            title: topic.title,
            topic: topic,
            comments: comments,
            message: req.flash('commentAddMsg')
        });
    });

    Topic.findOne({ _id: id /*, deleted: false*/ })
        .populate([{
            path: 'category',
            select: 'name'
        }, {
                path: 'author',
                select: 'username'
            }])
        .exec(function (err, topic) {
            if (!topic) {
                ep.unbind();
                return res.renderErr({
                    message: '话题不存在'
                });
            }
            if (topic.deleted) {
                ep.unbind();
                return res.renderErr({
                    message: '话题已经被删除'
                });
            }
            topic.views += 1;
            topic.save();
            topic.liked = topic.like.indexOf(me) > -1 ? true : false
            ep.emit('topic', topic);
        });

    // 获取评论

    commentLib.getCommentsByTopic(id, function (err, comments) {

        var proxy = new Eventproxy();

        proxy.after('commentList', comments.length, function () {
            ep.emit('comments', comments);
        });

        comments.forEach(function (comment, index) {
            comment.liked = comment.like.indexOf(me) > -1 ? true : false;
            proxy.emit('commentList');
        });
    });

}

/**
 * 话题 Like
 */

exports.like = function (req, res, next) {

    var me = req.user && req.user._id,
        id = req.body.id;

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('like', function (ret) {
        Topic.update({ _id: id }, ret.run).exec(function () {
            res.json({ success: true, like: ret.like, message: '操作成功' });
        });
    });

    Topic.findOne({ _id: id }, function (err, topic) {
        if (err) return next(err);

        if (topic.like.indexOf(me) > -1) {
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