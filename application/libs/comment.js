var Comment = require('../models/comment');

/**
 * 根据话题 ID 获取评论
 */

exports.getCommentsByTopic = function(topic_id, callback){
    
    Comment.find({ topic: topic_id })
        .populate([{
            path: 'author',
            select: 'username'
        }])
        .sort({ create_at: -1 })
        .exec(callback);

}

/**
 * 根据话题 ID 获取评论数
 */

exports.getCountByTopic = function(topic_id, callback){

    Comment.count({ topic: topic_id }, callback);
}