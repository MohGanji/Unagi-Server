var express = require("express");
var mongoose = require("mongoose");
var randToken = require("rand-token");
var user = require("../../../../models/user");
var router = express.Router();
var tokenMiddleware = require("../../../../utilities/tokenMiddleware");
var hash = require("../../../../utilities/hashing");

router.use(tokenMiddleware);

router.post("/", function(req, res) {
  var userId = req.body.userId;
  var changedPrefs = req.body.user;
  if (changedPrefs.password)
    changedPrefs.password = hash(changedPrefs.password, userId);
  user.update(
    {
      userId: userId
    },
    { $set: changedPrefs },
    function(err) {
      if (err) {
        console.log("ERR: in user update.js: " + err);
        res.status(500).jsonp("user update failed. " + err);
      } else {
        res.status(200).jsonp("user updated successfully.");
      }
    }
  );
});

module.exports = router;
