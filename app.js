var path = require('path');
var express = require('express');
var ejsMate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var config = require('./config.js');

var app = express();

app.set('port', (process.env.PORT || config.site.port));
app.set('views', path.join(__dirname, config.path.views));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser(config.session.secret));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

app.set('view engine', 'html');
app.engine('html', ejsMate);
app.locals._layoutFile = 'layout.html';

// Session
app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: config.session.maxage
    }
}));

app.use(flash());

// Routes
require('./application/routes')(app);

// 数据库连接
require('./application/common/db.js');

app.listen(app.get('port'), function() {
    console.log('Market started: http://localhost:' + app.get('port') + '/');
});