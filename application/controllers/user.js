var Eventproxy = require('eventproxy');
var _ = require('lodash');
var validator = require('validator');
var User = require('../models/user');
var Collect = require('../models/collect');
var Topic = require('../models/topic');
var commentLib = require('../libs/comment');
var userLib = require('../libs/user');
var topicLib = require('../libs/topic');
var noticeLib = require('../libs/notice');
var utils = require('../common/utils');


/**
 * 注册页面
 */

exports.signup = function (req, res, next) {
    res.render('user/signup', {
        title: '注册',
        me: req.user,
        message: req.flash('signupMsg')
    });
};

/**
 * 注册操作
 */

exports.doSignup = function (req, res, next) {
    var username = _.trim(req.body.username),
        email = _.trim(req.body.email),
        password = req.body.password,
        passwordcf = req.body.passwordcf;

    var ep = new Eventproxy();
    ep.fail(next);

    ep.on('err', function (msg) {
        req.flash('signupMsg', msg);
        res.redirect('/signup');
    });

    if (!username) {
        return ep.emit('err', '用户名不能为空');
    } else if (!utils.isUserName(username)) {
        return ep.emit('err', '用户名请使用 5-12 位大小写字母、数字、下划线');
    } else if (!email) {
        return ep.emit('err', '邮箱不能为空');
    } else if (!validator.isEmail(email)) {
        return ep.emit('err', '邮箱格式不正确');
    } else if (!password) {
        return ep.emit('err', '密码不能为空');
    } else if (!passwordcf) {
        return ep.emit('err', '确认密码不能为空');
    } else if (password !== passwordcf) {
        return ep.emit('err', '两次密码输入不一致');
    } else {
        next();
    }
}

/**
 * 登录页面
 */

exports.login = function (req, res, next) {
    res.render('user/login', {
        title: '登录',
        me: req.user,
        message: req.flash('loginMsg')
    });
}

/**
 * 登录操作
 */

exports.doLogin = function (req, res, next) {
    var username = _.trim(req.body.username),
        password = req.body.password;

    var ep = new Eventproxy();

    ep.fail(next);

    ep.on('err', function (msg) {
        req.flash('loginMsg', msg);
        res.redirect('/login');
    });

    if (!username) {
        return ep.emit('err', '用户名不能为空');
    } else if (!password) {
        return ep.emit('err', '密码不能为空');
    } else {
        next();
    }
}

/**
 * 用户页面
 */

exports.user = function (req, res, next) {

    var me = req.user && req.user._id,
        username = req.params.username;

    var ep = new Eventproxy();
    ep.fail(next);

    var events = ['user', 'topics'];
    ep.all(events, function (user, topics) {
        res.render('user/user', {
            title: '个人中心',
            me: req.user,
            user: user,
            topics: topics
        });
    });

    // 判断是否是自己的页面

    userLib.getUserByUsername(username, function (err, user) {
        user.isme = user._id.equals(me);
        ep.emit('getCollect', user._id);
        ep.emit('user', user);
    });

    // 获取每一条话题的评论数

    ep.on('getCounts', function (topics) {

        var proxy = new Eventproxy();

        proxy.after('counts', topics.length, function () {
            ep.emit('topics', topics);
        });

        topics.forEach(function (topic, index) {
            commentLib.getCountByTopic(topic._id, function (err, count) {
                topic.commentsCount = count;
                proxy.emit('counts');
            });
        });
    });

    // 获取收藏主题列表

    ep.on('getCollect', function (userId) {
        Collect.find({ user: userId })
            .populate([{
                path: 'topic',
                populate: [{
                    path: 'category',
                    select: 'name'
                }, {
                    path: 'author',
                    select: 'username'
                }]
            }])
            .sort({ create_at: -1 })
            .exec(function (err, collects) {
                var topics = collects.map(function (collect) {
                    return collect.topic;
                });
                ep.emit('getCounts', topics);
            });
    });

}

/**
 * 用户创建的话题列表
 */

exports.created = function (req, res, next) {

    var me = req.user && req.user._id,
        username = req.params.username;

    var ep = new Eventproxy();
    ep.fail(next);

    var events = ['user', 'topics'];
    ep.all(events, function (user, topics) {
        res.render('user/created', {
            title: '个人中心',
            me: req.user,
            user: user,
            topics: topics
        });
    });

    // 判断是否是自己的页面

    userLib.getUserByUsername(username, function (err, user) {
        user.isme = user._id.equals(me);
        ep.emit('getTopics', user._id);
        ep.emit('user', user);
    });

    // 获取创建主题列表

    ep.on('getTopics', function (userId) {
        topicLib.getTopicsByQuery({ author: userId }, function (err, topics) {
            ep.emit('topics', topics);
        });
    });
}

/**
 * 修改信息
 */

exports.setting = function (req, res, next) {

    var me = req.user && req.user._id;

    userLib.getUserById(me, function(err, user){
        user.isme = _.noop();  // 个人信息页面故意不显示“修改资料”
        res.render('user/setting', {
            me: req.user,
            title: '个人信息',
            user: user
        });
    });  
}

/**
 * 系统消息
 */

exports.notice = function(req, res, next){

    var me = req.user && req.user._id;
    noticeLib.getAll(me, function(err, notices){
        res.render('user/notice', {
            title: '个人中心',
            me: req.user,
            notices: notices
        });
    });
}

/**
 * 登出
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
}