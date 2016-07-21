var express = require('express');
var router = express.Router();

router.get('*', function (req, res, next) {
    res.status(404).render('msg/404');
});

module.exports = router;