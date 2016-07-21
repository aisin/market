/**
 * 验证 user 权限
 */

exports.userRequired = function(req, res, next) {

    if (req.isAuthenticated()) return next();

    return req.xhr ? res.json({ success: false, message: '请登录后再操作'}) : res.redirect('/login');
}

/**
 * 验证 admin 权限
 */

exports.adminRequired = function(req, res, next){

    if(req.isAuthenticated() && req.user.role === 'admin') return next();

    return req.xhr ? res.json({ success: false, message: '请登录管理员账号后再操作'}) : res.redirect('/');
}