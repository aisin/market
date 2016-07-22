var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },

    create_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Collect', collectSchema);