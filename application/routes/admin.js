var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin');
var auth = require('../middlewares/auth');

// router.use('/admin/?*', auth.adminRequired); // 生产项目一定要打开！！！！！！！！！！！

router.get('/admin/login', admin.login); //暂时无用

router.get('/admin/dashboard', admin.dashboard);

router.get('/admin/category', admin.categoryList);

router.get('/admin/category/add', admin.categoryAdd);

router.post('/admin/category/add', admin.doCategoryAdd);


module.exports = router;