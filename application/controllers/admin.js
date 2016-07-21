var Eventproxy = require('eventproxy');
var _ = require('lodash');
var Category = require('../models/category');
var adminLib = require('../libs/admin');

exports.login = function (req, res, next) {
    res.render('admin/login');
}

/**
 * 后台管理面板
 */

exports.dashboard = function (req, res, next) {
    res.render('admin/dashboard');
}

/**
 * 分类列表页面
 */

exports.categoryList = function (req, res, next) {
    adminLib.getCatgoryList(function(err, categories){
        if(err) return next(err);

        res.render('admin/category/list', {
            categories: categories
        });
    });
}

/**
 * 添加分类页面
 */

exports.categoryAdd = function (req, res, next) {
    res.render('admin/category/add', {
        message: req.flash('categoryMsg')
    });
}

/**
 * 添加分类操作
 */

exports.doCategoryAdd = function (req, res, next) {
    var name = _.trim(req.body.categoryName);
    var category = new Category();

    var ep = new Eventproxy();

    ep.fail(next);

    ep.on('err', function (msg) {
        req.flash('categoryMsg', msg);
        res.redirect('/admin/category/add');
    });

    if (name) {
        category.name = name;
        category.save(function (err, result) {
            if (err) return next(err);
            res.redirect('/admin/category');
        });
    } else {
        ep.emit('err', '分类名称不能为空');
    }
}