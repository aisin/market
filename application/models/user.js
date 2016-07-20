var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
    username : String,
    email : String,
    password : String,

    role : {
        type : String,
        default : 'user'
    },
    
    create_at : {
        type : Date,
        default : Date.now
    },
    update_at : {
        type : Date,
        default : Date.now
    }
  
});

module.exports = mongoose.model('User', userSchema);