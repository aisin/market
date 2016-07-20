var Category = require('../models/category');

/**
 * 获取所有分类
 */

exports.getAllCategories = function (callback) {
    Category.find({}, function (err, categories) {
        callback(err, categories);
    });
}