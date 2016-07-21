var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');
var categoryLib = require('../libs/category');


/**
 * 首页
 */

exports.index = function (req, res, next) {
    // res.render('home/index', {
    //     title: '首页',
    //     user: req.user,
    //     message: req.flash('homeMsg')
    // });

    //
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
        .sort({ update_at: -1 })
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
                })
            });

            ep.emit('topics', topics);

            // 获取分类

            categoryLib.getAllCategories(function (err, categories) {
                ep.emit('category', categories);
            })
        });

};