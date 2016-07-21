var Eventproxy = require('eventproxy');
var _ = require('lodash');
var validator = require('validator');
var utils = require('../common/utils');
var User = require('../models/user');

/**
 * Sign up
 */

exports.signup = function (req, res, next) {
    res.render('user/signup', {
        title: '注册',
        user: req.user,
        message : req.flash('signupMsg')
    });
};

exports.doSignup = function (req, res, next) {
    var username = _.trim(req.body.username),
        email = _.trim(req.body.email),
        password = req.body.password,
        passwordcf = req.body.passwordcf;
        
    var ep = new Eventproxy();
    
    ep.fail(next);
    
    ep.on('err', function(msg){
        req.flash('signupMsg', msg);
        res.redirect('/signup');
    });
        
    if(!username){
        return ep.emit('err', '用户名不能为空');
    }else if(!utils.isUserName(username)){
        return ep.emit('err', '用户名请使用 5-12 位大小写字母、数字、下划线');
    }else if(!email){
        return ep.emit('err', '邮箱不能为空');
    }else if(!validator.isEmail(email)){
        return ep.emit('err', '邮箱格式不正确');
    }else if(!password){
        return ep.emit('err', '密码不能为空');
    }else if(!passwordcf){
        return ep.emit('err', '确认密码不能为空');
    }else if(password !== passwordcf){
        return ep.emit('err', '两次密码输入不一致');
    }else{
        next();
    }
}


/**
 * Log in
 */

exports.login = function (req, res, next) {
    console.log('req.user: ', req.user);
    res.render('user/login', {
        title: '登录',
        user: req.user,
        message: req.flash('loginMsg')
    });
}

exports.doLogin = function (req, res, next) {
    var username = _.trim(req.body.username),
        password = req.body.password;
        
    var ep = new Eventproxy();
    
    ep.fail(next);
    
    ep.on('err', function(msg){
        req.flash('loginMsg', msg);
        res.redirect('/login');
    });
        
    if(!username){
        return ep.emit('err', '用户名不能为空');
    }else if(!password){
        return ep.emit('err', '密码不能为空');
    }else{
        next();
    }
}

/**
 * Profile
 */

exports.profile = function (req, res, next) {
    console.log('req.user : ', req.user);
    res.render('user/profile', {
        title: '个人中心',
        user: req.user
    });
}

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
}