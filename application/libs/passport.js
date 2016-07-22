var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcryptjs");
var _ = require('lodash');
var User = require('../models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
                
            var obj = {};
                
            if((username.indexOf('@') !== -1)){
                username.toLowerCase();
                obj = { 'email': username }
            }else{
                obj = { 'username': username }
            }

            process.nextTick(function () {
                User.findOne(obj, function (err, user) {
                    
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false, req.flash('loginMsg', '该用户不存在'));

                    if (!validPassword(password, user.password))
                        return done(null, false, req.flash('loginMsg', '您输入的密码错误'));

                    else
                        return done(null, user);
                });
            });

        }));
    
    passport.use('signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            
            var email = _.trim(req.body.email);
            
            if (email)
                email = email.toLowerCase();

            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ $or:[ {'username': username}, {'email': email} ] }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('signupMsg', '该邮箱或者用户名已经被注册'));
                        } else {

                            var newUser = new User();
                            
                            newUser.username = username;
                            newUser.email = email;
                            newUser.password = generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });

                } else {
                    return done(null, req.user);
                }

            });

        }));
};

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

function validPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}