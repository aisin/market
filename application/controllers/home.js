var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');
var categoryLib = require('../libs/category');
var commentLib = require('../libs/comment');


/**
 * 首页
 */

exports.index = function (req, res, next) {

    Topic.find({ deleted: false })
        .populate([{
            path: 'category',
            select: 'name'
        }, {
                path: 'author',
                select: 'username'
            }, {
                path: 'last_reply',
                select: 'username'
            }])
        .sort({ create_at: -1 })
        .exec(function (err, topics) {
            var ep = new Eventproxy();
            ep.fail(next);

            var events = ['topics', 'category'];
            ep.all(events, function (topics, categories) {
                res.render('home/index', {
                    title: '首页',
                    user: req.user,
                    topics: topics,
                    categories: categories
                });
            });

            ep.after('comment', topics.length, function(){
                ep.emit('topics', topics);
            });

            // 获取每条话题的评论数

            topics.forEach(function(topic, index) {
                commentLib.getCountByTopic(topic._id, ep.done(function(count){
                    topic.commentsCount = count;
                    ep.emit('comment');
                }));
            });

            // 获取分类

            categoryLib.getAllCategories(function (err, categories) {
                ep.emit('category', categories);
            });
            
        });

};