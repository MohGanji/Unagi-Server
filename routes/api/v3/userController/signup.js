var express = require("express");
var mongoose = require("mongoose");
var randToken = require("rand-token");
var jwt = require("jwt-simple");
var secret = require("../../../../confidentials").secret;
var user = require("../../../../models/user");
var uniqueUsername = require("../../../../utilities/uniqueUsername");
var hash = require("../../../../utilities/hashing");

var router = express.Router();

router.post("/", function(req, res, next) {
  var date = new Date();
  var username = req.body.username;
  var userId = req.body.userId;
  var password = hash(req.body.password, userId);
  uniqueUsername(username)
    .then(function() {
      var payload = {
        uname: username,
        uid: userId,
        date: date
      };
      var jwtToken = jwt.encode(payload, secret);

      new user({
        subDate: date,
        username: username,
        password: password,
        userId: userId,
        name: "",
        surname: ""
      }).save(function(err, user) {
        if (err) {
          console.log("signup.js save:", err);
          res.status(500).send(err);
        } else res.status(200).jsonp({ refreshToken: jwtToken });
      });
    })
    .catch(function(err) {
      if (err) console.log("signup.js catch:", err);
      res.status("403").jsonp({ error: "Username exists" });
    });

  // var nickname = req.body.nickname;
  // var email = req.body.email;
});

module.exports = router;
