var express = require('express');
var router = express.Router();
var topic = require('../controllers/topic');
var auth = require('../middlewares/auth');

router.get('/t/new', auth.userRequired, topic.newTopic);

router.post('/t/new', auth.userRequired, topic.doNewTopic);

router.get('/t/:id', topic.detail);

router.post('/t/like', auth.userRequired, topic.like);

module.exports = router;