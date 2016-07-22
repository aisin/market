var Eventproxy = require('eventproxy');
var Category = require('../models/category');
var topicLib = require('../libs/topic');

/**
 * 获取分类列表
 */

exports.getCatgoryList = function (callback) {
    Category.find({}, function(err, categories){
        var ep = new Eventproxy();

        ep.after('count', categories.length, function(){
            callback(err, categories);
        });

        categories.forEach(function(cate, index){
            topicLib.getTopicCountByCategoryId(cate._id, ep.done(function(count){
                cate.count = count;
                ep.emit('count');
            }))
        });
    });
}