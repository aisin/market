var User = require('../models/user');

/**
 * 根据用户名获取用户
 */

exports.getUserByusername = function (username, callback) {
    User.findOne({ username: username }).exec(callback);
}