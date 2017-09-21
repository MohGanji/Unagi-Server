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

  var Post = new post({
    postId: postId,
    userId: req.body.userId,
    content: req.body.content,
    longitude: req.query.location.longitude,
    latitude: req.query.location.latitude,
    date: date
  }).save(function(err) {
    if (err) console.log(err);
  });
  res.status(200).jsonp({ Status: "OK" });
});

module.exports = router;
