var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
    username : String,
    email : String,
    password : String,
    
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