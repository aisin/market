var express = require('express');
var router = express.Router();
var topic = require('../controllers/topic');
var auth = require('../middlewares/auth');

router.get('/t/new', auth.userRequired, topic.newTopic);

module.exports = router;