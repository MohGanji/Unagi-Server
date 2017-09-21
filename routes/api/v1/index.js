var express = require('express');
var router = express.Router();

var postController = require('./postController');
var userController = require('./userController');
var likeController = require('./eventController');
router.use('/post', postController);
router.use('/user', userController);
router.use('/event', likeController);

module.exports = router;