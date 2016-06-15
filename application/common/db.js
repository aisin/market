var mongoose = require('mongoose');
var config = require('../../config.js');

//Database
var db = mongoose.connect(config.database.url);

db.connection.on('error', function (error) {
    console.log('Database Error: ' + error);
});

db.connection.on('open', function () {
    console.log('Database Connected to ' + config.database.url + ' successfully!');
});