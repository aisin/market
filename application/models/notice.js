var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noticeSchema = new Schema({

    whose: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    /**
     * Notice:
     *
     * 0: 回复话题; 1: @ 回复评论; 2: 赞话题; 3: 收藏话题 4: 赞评论
     *
     */
    type: Number,
    read: {
        type: Boolean,
        default: false
    },
    create_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notice', noticeSchema);