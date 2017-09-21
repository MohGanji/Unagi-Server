var express = require('express');
var router = express.Router();

var registerUser = require('./register');

router.get('/', registerUser);




module.exports = router;