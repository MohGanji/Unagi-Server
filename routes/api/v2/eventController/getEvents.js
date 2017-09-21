var express = require("express");
var router = express.Router();
var event = require("../../../../models/event");
var getLikeNumber = require("../../../../utilities/getLikes");

router.get("/", function(req, res, next) {
  getLikeNumber(req.query.postId).then(function(result) {
    res.jsonp({
      likes: result
    });
  });
});

module.exports = router;
