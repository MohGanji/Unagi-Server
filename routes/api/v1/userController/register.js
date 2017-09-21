var express = require("express");
var mongoose = require("mongoose");
var randToken = require("rand-token");
var user = require("../../../../models/user");
var router = express.Router();

router.get("/", function(req, res, next) {
  var token = req.headers.token;
  var date = new Date();
  var userId = randToken
    .generator({
      chars: "0-9"
    })
    .generate(16);
  new user({
    token: token,
    subDate: date,
    userId: userId
  }).save(function(err, user) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

module.exports = router;
