var express = require("express");
var mongoose = require("mongoose");
var randToken = require("rand-token");
var jwt = require("jwt-simple");
var secret = require("../../../../confidentials").secret;
var user = require("../../../../models/user");
var validateUser = require("../../../../utilities/userValidation");
var hash = require("../../../../utilities/hashing");
var router = express.Router();

router.post("/", function(req, res, next) {
  var date = new Date();
  var username = req.body.username;
  var userId = req.body.userId;
  var password = hash(req.body.password, userId);
  validateUser(username, password)
    .then(function(result) {
      var payload = {
        uname: username,
        uid: userId,
        date: date
      };
      var jwtToken = jwt.encode(payload, secret);
      res.status(200).jsonp({ refreshToken: jwtToken });
    })
    .catch(function(err) {
      console.log("login.js", err);
      res.status(403).jsonp({ error: "wrong username or password" });
    });
});

module.exports = router;
