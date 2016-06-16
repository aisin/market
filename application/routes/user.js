var passport = require('passport');
var user = require('../controllers/user');
var auth = require('../middlewares/auth');

module.exports = function(app){
  
    app.use(passport.initialize());
    app.use(passport.session());

    require('../libs/passport')(passport);

    app.get('/signup', user.signup);

    app.post('/signup', user.doSignup, passport.authenticate('signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/login', user.login);

    app.post('/login', passport.authenticate('login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', auth.userRequired, user.profile);
  
};