var express = require("express");
var router = express.Router();
var randToken = require("rand-token");
var post = require("../../../../models/post");

router.post("/", function(req, res, next) {
  var postId = randToken
    .generator({
      chars: "0-9"
    })
    .generate(32);
  var date = new Date();

  var loc = JSON.parse(req.query.location);
  var Post = new post({
    postId: postId,
    userId: req.body.userId,
    content: req.body.content,
    likes: 0,
    score: 0,
    // longitude: req.body.location.longitude,
    // latitude: req.body.location.latitude,
    location: {
      type: "Point",
      coordinates: [loc.longitude, loc.latitude]
    },
    date: date
  }).save(function(err) {
    if (err) console.log(err);
  });
  res.status(200).jsonp({ Status: "OK" });
});

module.exports = router;
