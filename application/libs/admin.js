var Eventproxy = require('eventproxy');
var Topic = require('../models/topic');
var Category = require('../models/category');
var topicLib = require('../libs/topic');

/**
 * 获取分类列表
 */

exports.getCatgoryList = function (callback) {

    Category.find({}, function (err, categories) {

        var ep = new Eventproxy();

        ep.after('count', categories.length, function () {
            callback(err, categories);
        });

        categories.forEach(function (cate, index) {
            topicLib.getTopicCountByCategoryId(cate._id, ep.done(function (count) {
                // console.log(count)
                cate.count = count;
                ep.emit('count');
            }))
        });
    });
}

/**
 * 获取所有话题列表
 */

exports.getAllTopics = function(callback){

    Topic.find({})
        .populate('author')
        .sort({ create_at: -1 })
        .exec(callback);
}