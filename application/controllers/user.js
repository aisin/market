var User = require('../models/user');

/**
 * Sign up
 */

exports.signup = function (req, res, next) {
    res.render('user/signup', {
        message: req.flash('signupMsg')
    });
};


/**
 * Log in
 */

exports.login = function (req, res, next) {
    res.render('user/login', {
        message: req.flash('loginMsg')
    });
}

/**
 * Profile
 */

exports.profile = function (req, res, next) {
    res.render('user/profile', {
        user: req.user
    });
}