var express = require("express");
var router = express.Router();
var post = require("../../../../models/post");
var event = require("../../../../models/event");
var findLikedPost = require("../../../../utilities/findLikedByMe");

router.get("/", function(req, res, next) {
  var postId = req.query.postId;
  var userId = req.query.userId;
  var promises = [];
  var before =
    req.query.before === undefined ? new Date() : new Date(req.query.before);
  var options = {
    sort: {
      date: -1
    }
  };
  //   post.findOne({ postId: postId }, function(err, res) {
  //     if (err) console.log(err);
  //     results.push(res);
  //   });
  post
    .find(
      {
        parentId: postId,
        date: {
          $lt: before.toISOString()
        }
      },
      null,
      options
    )
    .cursor()
    .on("data", function(item) {
      promises.push(findLikedPost(item, userId));
    })
    .on("error", function(err) {
      console.log(err);
      res.status(500).send(err);
    })
    .on("close", function() {
      Promise.all(promises).then(function(results) {
        res.status(200).jsonp(results);
      });
    });
});

module.exports = router;
