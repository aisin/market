var User = require('../models/user');

/**
 * 根据用户 ID 获取用户
 */

exports.getUserById = function (userId, callback) {
    User.findOne({ _id: userId }).exec(callback);
}

/**
 * 根据用户名获取用户
 */

exports.getUserByusername = function (username, callback) {
    User.findOne({ username: username }).exec(callback);
}