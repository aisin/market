var express = require('express');
var router = express.Router();
var comment = require('../controllers/comment');
var auth = require('../middlewares/auth');

// router.get('/t/comment/:id', comment.list);

router.post('/t/comment/:id', auth.userRequired, comment.add);

// ajax

router.post('/comment/like', auth.userRequired, comment.like);

module.exports = router;