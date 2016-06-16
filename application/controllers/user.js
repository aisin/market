var EventProxy = require('eventproxy');
var _ = require('lodash');
var validator = require('validator');
var utils = require('../common/utils');
var User = require('../models/user');

/**
 * Sign up
 */

exports.signup = function (req, res, next) {
    res.render('user/signup', {
        message : req.flash('signupMsg')
    });
};

exports.doSignup = function (req, res, next) {
    var username = _.trim(req.body.username),
        email = _.trim(req.body.email),
        password = req.body.password,
        passwordcf = req.body.passwordcf;
        
    var ep = new EventProxy();
    
    ep.fail(next);
    
    ep.on('err', function(msg){
        req.flash('signupMsg', msg);
        // res.redirect('/signup');
        res.render('user/signup', {
            message : req.flash('signupMsg'),
            username : username,
            email : email
        });
    });
        
    if(!username){
        return ep.emit('err', '用户名不能为空');
    }else if(!utils.isUserName(username)){
        return ep.emit('err', '用户名格式不正确');
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
    res.render('user/login', {
        message: req.flash('loginMsg')
    });
}

exports.doLogin = function (req, res, next) {
    var username = _.trim(req.body.username),
        password = req.body.password;
        
    next();
}

/**
 * Profile
 */

exports.profile = function (req, res, next) {
    res.render('user/profile', {
        user: req.user
    });
}