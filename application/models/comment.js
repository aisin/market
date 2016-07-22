var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({

    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    content: String,

    like: [Schema.Types.ObjectId],
    
    create_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Comment', commentSchema);