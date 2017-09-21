var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.get('/generateData', function (req, res, next) {
  require('./generateData')();
  res.render('generateData', {
    title: 'Data Generation Complete!'
  })
});

module.exports = router;