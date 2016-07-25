var Eventproxy = require('eventproxy');
var _ = require('lodash');
var Topic = require('../models/topic');
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
    adminLib.getCatgoryList(function (err, categories) {
        if (err) return next(err);

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

/**
 * 话题列表页面
 */

exports.topicList = function (req, res, next) {
    adminLib.getAllTopics(function (err, topics) {
        if (err) next(err);

        res.render('admin/topic/list', {
            topics: topics
        });
    });
}

/**
 * 话题删除（软删除）
 */

exports.topicDelete = function (req, res, next) {
    var topicId = req.params.id;
    Topic.findByIdAndUpdate(topicId, { $set: { deleted: true } }).exec(function (err, topic) {
        var message = '主题： ' + topic.title + ' 已经被<strong>（逻辑）删除</strong>成功！返回 ' + '<a href="/admin/topics">话题列表</a>';
        res.render('admin/common/message', {
            message: message
        });
    });
}

/**
 * 话题取消删除
 */

exports.topicUndelete = function (req, res, next) {
    var topicId = req.params.id;
    Topic.findByIdAndUpdate(topicId, { $set: { deleted: false } }).exec(function (err, topic) {
        var message = '主题： ' + topic.title + ' 已经<strong>恢复</strong>成功！返回 ' + '<a href="/admin/topics">话题列表</a>';
        res.render('admin/common/message', {
            message: message
        });
    });
}

/**
 * 话题锁定
 */

exports.topicLocked = function (req, res, next) {
    var topicId = req.params.id;
    Topic.findByIdAndUpdate(topicId, { $set: { locked: true } }).exec(function (err, topic) {
        var message = '主题： ' + topic.title + ' 已经<strong>锁定</strong>成功！返回 ' + '<a href="/admin/topics">话题列表</a>';
        res.render('admin/common/message', {
            message: message
        });
    });
}

/**
 * 话题取消锁定
 */

exports.topicUnlock = function (req, res, next) {
    var topicId = req.params.id;
    Topic.findByIdAndUpdate(topicId, { $set: { locked: false } }).exec(function (err, topic) {
        var message = '主题： ' + topic.title + ' 已经<strong>解锁</strong>成功！返回 ' + '<a href="/admin/topics">话题列表</a>';
        res.render('admin/common/message', {
            message: message
        });
    });
}