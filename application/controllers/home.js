var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');
var categoryLib = require('../libs/category');
var commentLib = require('../libs/comment');
var topicLib = require('../libs/topic');

/**
 * 首页
 */

exports.index = function (req, res, next) {

    var ep = new Eventproxy();
    ep.fail(next);

    // 渲染任务列表
    var events = ['topics', 'categories'];

    ep.all(events, function (topics, categories) {
        res.render('home/index', {
            title: '首页',
            me: req.user,
            topics: topics,
            categories: categories
        });
    });

    // 获取话题列表

    topicLib.getTopicsByQuery({ deleted: false }, function (err, topics) {
        ep.emit('topics', topics);
    });

    // 获取分类

    categoryLib.getAllCategories(function (err, categories) {
        ep.emit('categories', categories);
    });

};