var Eventproxy = require('eventproxy');
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

exports.getUserByUsername = function (username, callback) {
    User.findOne({ username: username }).exec(callback);
}

/**
 * 根据应户名数组返回用户 ID 数组
 */

exports.getUsersByUsernameAry = function(ary, callback){
    var idAry = [];
    var ep = new Eventproxy();

    if (!ary || !ary.length) return callback(idAry);

    ep.after('user', ary.length, function () {
        return callback(idAry);
    });

    ary.forEach(function(item){
        User.findOne({ username: item }).exec(function(err, user){
            idAry.push(user._id);
            ep.emit('user', user._id);
        });
    });
}