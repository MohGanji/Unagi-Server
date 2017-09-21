var express = require("express");
var mongoose = require("mongoose");
var user = require("../../../../models/user");
var router = express.Router();
var tokenMiddleware = require("../../../../utilities/tokenMiddleware");

router.use(tokenMiddleware);

router.get("/", function(req, res) {
  var userId = req.query.userId;
  user.findOne(
    {
      userId: userId
    },
    function(err, foundResult) {
      if (err) console.log("ERR: in getUser.js, findOne failed: " + err);
      res.status(200).jsonp(foundResult);
    }
  );
});

module.exports = router;
