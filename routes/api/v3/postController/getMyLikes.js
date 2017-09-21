var express = require("express");
var router = express.Router();
var post = require("../../../../models/post");
var event = require("../../../../models/event");
var findMyLikes = require("../../../../utilities/findMyLikes");

router.get("/", function(req, res, next) {
  var userId = req.query.userId;
  var beforeDate =
    req.query.before === undefined ? new Date() : new Date(req.query.before);
  var postLimit = parseInt(req.query.postLimit) || 10;
  var options = {
    limit: postLimit
  };
  findMyLikes(userId).then(function(myLikesPostIds) {
    var results = [];
    post
      .find(
        {
          postId: { $in: myLikesPostIds },
          date: { $lt: beforeDate.toISOString() }
        },
        null,
        options
      )
      .cursor()
      .on("data", function(item) {
        results.push(item);
      })
      .on("error", function(err) {
        console.log("ERR: in getMyLikes.js, in finding posts cursor: ", err);
      })
      .on("close", function() {
        res.status(200).jsonp(results);
      });
  });
});

module.exports = router;
