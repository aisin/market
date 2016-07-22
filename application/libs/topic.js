var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');

/**
 * 获取所有话题
 */

exports.getAllTopics = function (callback) {
    Topic.find({ deleted: false }).sort({ update_at: -1 }).exec(callback);
}

/**
 * 根据分类 ID 获取话题数量
 */

exports.getTopicCountByCategory = function (query, callback) {
    Topic.count(query, callback);
}

/**
 * 根据用户 ID 获取收藏的话题
 */

exports.getCollectTopicsByUser = function (userId, callback) {

    // Topic.find({})
}