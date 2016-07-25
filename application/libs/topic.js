var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');
var Category = require('../models/category');
var commentLib = require('./comment');
var config = require('../../config.js');

/**
 * 获取所有话题
 */

exports.getAllTopics = function (callback) {
    Topic.find({ deleted: false }).sort({ update_at: -1 }).exec(callback);
}

/**
 * 根据分类 ID 获取话题数量
 */

exports.getTopicCountByCategoryId = function (catId, callback) {
    Topic.count({ category: catId }, callback);
}

/**
 * 根据分类 ID 获取分类
 */

exports.getCategoryById = function (catId, callback) {
    Category.findOne({ _id: catId }).exec(callback);
}

/**
 * 根据条件获取话题列表
 * 返回带话题信息的通用列表，例如：首页列表、分类页列表
 * 
 * 查询条件：query
 * 翻页页码：page
 * 回调函数：callback
 */

exports.getTopicsByQuery = function (query, page, callback) {

    var parPage = config.countPerPage;
    var skipNum = page && (page - 1) * parPage || 0;

    var ep = new Eventproxy();

    // 根据条件查询话题

    Topic.find(query)    // eg: { deleted: false }
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
        .skip(skipNum)
        .limit(parPage)
        .exec(function (err, topics) {

            ep.after('comment', topics.length, function () {
                ep.emit('topics', callback(err, topics));
            });

            // 获取每条话题的评论数

            topics.forEach(function (topic, index) {
                commentLib.getCountByTopic(topic._id, ep.done(function (count) {
                    topic.commentsCount = count;
                    ep.emit('comment');
                }));
            });
        });
}