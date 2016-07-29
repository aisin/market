var Notice = require('../models/notice');

/**
 * 根据用户 ID 获取消息
 */

exports.getAll = function(userId, callback){
    Notice.find({ whose: userId })
        .populate([{
            path: 'from',
            select: 'username'
        }, {
                path: 'topic',
                select: 'title'
            }, {
                path: 'comment',
                select: 'content'
            }])
        .sort({ create_at: -1 })
        .exec(callback);
}