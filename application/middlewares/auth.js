/**
 * 验证 user 权限
 */

exports.userRequired = function(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

/**
 * 验证 admin 权限
 */

exports.adminRequired = function(req, res, next){

    if(req.isAuthenticated() && req.user.role === 'admin') 
        return next();
        
    res.redirect('/');
}