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

// 设置 moment 语言

moment.locale('zh-cn');

app.set('port', (process.env.PORT || config.site.port));
app.set('views', path.join(__dirname, config.path.views));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser(config.session.secret));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(csrf({ cookie: true }));

app.set('view engine', 'html');
app.engine('html', ejsMate);
// app.locals._layoutFile = 'layout.html';

app.locals.moment = moment;

// 除了 admin 路由，均使用 layout 模板

app.get(/^(?!\/admin).*$/, function (req, res, next) {
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

// Flash

app.use(flash());

// Error && 404

app.use(require(config.path.msgMiddleware).msg);

// CSRF 生成

app.all('/*', function (req, res, next) {
    res.locals._csrf = req.session ? req.csrfToken() : "";
    next();
});

// CSRF 校验

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
});

// Routes

require('./application/routes')(app);

// Database

require('./application/common/db.js');

app.listen(app.get('port'), function () {
    console.log('Market started: http://localhost:' + app.get('port') + '/');
});