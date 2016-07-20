var path = require('path');
var express = require('express');
var ejsMate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var moment = require('moment');
var csrf = require('csurf');
var config = require('./config.js');

var app = express();

moment.locale('zh-cn');

app.set('port', (process.env.PORT || config.site.port));
app.set('views', path.join(__dirname, config.path.views));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser(config.session.secret));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(csrf({ cookie: true }));

app.set('view engine', 'html');
app.engine('html', ejsMate);
// app.locals._layoutFile = 'layout.html';

app.locals.moment = moment;

app.get(/^(?!\/admin).*$/, function(req, res, next){
    res.locals._layoutFile = 'layout.html';
    next();
});

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

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
});

// Routes
require('./application/routes')(app);

// 数据库连接
require('./application/common/db.js');

app.listen(app.get('port'), function() {
    console.log('Market started: http://localhost:' + app.get('port') + '/');
});