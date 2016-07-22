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

exports.getTopicCountByCategoryId = function (catId, callback) {
    Topic.count(catId, callback);
}