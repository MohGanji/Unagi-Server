var express = require("express");
var router = express.Router();
var randToken = require("rand-token");
var post = require("../../../../models/post");
var hashtag = require("../../../../models/hashtag");
var findHashtags = require("find-hashtags");

router.post("/", function(req, res, next) {
  var postId = randToken
    .generator({
      chars: "0-9"
    })
    .generate(32);
  var date = new Date();
  var loc = JSON.parse(req.query.location);
  // extract hashtags and add to database
  var hashtags = findHashtags(req.body.content);
  hashtags.forEach(function(tag) {
    hashtag.findOne({ name: tag }, function(err, res) {
      if (err) console.log("error in sendPost.js, finding a hashtag: ", err);
      if (!res) {
        console.log('could not find tag "' + tag, '", adding to database.');
        var tagId = randToken
          .generator({
            chars: "0-9"
          })
          .generate(32);
        var newTag = new hashtag({ name: tag, id: tagId });
        newTag.save(function(error) {
          if (error)
            console.log("ERR: in sendPost.js, saving a new tag:", error);
        });
      }
    });
  });

  var Post = new post({
    name: req.body.name,
    parentName: req.body.parentName,
    postId: postId,
    userId: req.body.userId,
    content: req.body.content,
    parentId: req.body.parentId,
    likes: 0,
    replies: 0,
    hashtags: hashtags,
    // longitude: req.body.location.longitude,
    // latitude: req.body.location.latitude,
    location: {
      type: "Point",
      coordinates: [loc.longitude, loc.latitude]
    },
    date: date
  }).save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).jsonp(err);
    } else {
      post.update(
        { postId: req.body.parentId },
        { $inc: { replies: 1 } },
        function(err) {
          if (err) console.log(err);
          res.status(200).jsonp({ Status: "OK" });
        }
      );
    }
  });
});

module.exports = router;
