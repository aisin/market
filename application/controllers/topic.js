var Eventproxy = require('eventproxy');
var _ = require('lodash');
var Topic = require('../models/topic');
var categoryLib = require('../libs/category');

/**
 * 发布主题
 */

exports.newTopic = function (req, res, next) {

    categoryLib.getAllCategories(function (err, categories) {
        if (err) return next(err);

        res.render('topic/new', {
            title: '发布话题',
            user: req.user,
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

    ep.on('ok', function () {
        res.redirect('/');
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

    new Topic(_topic).save(function (err, result) {
        if (err) return next(err);
        ep.emit('ok');
    });
}

/**
 * 话题详情
 */

exports.detail = function (req, res, next) {

    var me = req.user && req.user._id,
        id = req.params.id;
    ep = new Eventproxy();

    var events = ['topic'];
    ep.fail(next);

    ep.all(events, function (topic) {
        res.render('topic/detail', {
            topic: topic
        });
    });

    console.log(me);

    // res.render('topic/detail');


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
                    message: '主题详情'
                });
            }
            if (topic.deleted) {
                ep.unbind();
                return res.renderErr({
                    message: '话题已经被删除'
                });
            }
            // topic.views += 1;
            // topic.save();
            // topic.thanked = thread.thanks.indexOf(me) > -1 ? true : false
            ep.emit('topic', topic);
        });
}

/**
 * 话题 Like
 */

exports.like = function (req, res, next) {

    var me = req.user && req.user._id,
        id = req.body.id;

    Topic.update({ _id: id }, { $push: { like: me } }).exec(function () {
        res.json({ success: true, message: '喜欢成功' });
    });
}