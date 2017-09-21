var express = require("express");
var router = express.Router();
var event = require("../../../../models/event");
var post = require("../../../../models/post");

router.post("/", function(req, res, next) {
  var type = req.body.type;
  var postId = req.body.postId;
  var userId = req.body.userId;
  var date = new Date();
  var options = {
    sort: { date: -1 }
  };

  event
    .find({ postId: postId, userId: userId }, null, options)
    .then(function(item) {
      if (
        (item.length && item[0].type === type) ||
        (!item.length && type === "unlike")
      )
        res.sendStatus(403);
      else {
        new event({
          type: type,
          postId: postId,
          userId: userId,
          date: date
        }).save(function(err, user) {
          if (err) res.send(err);
          else {
            post.update({postId: postId}, {$inc: {likes: (type === "like" ? 1 : -1)}}, function(){
                  res.status(200).jsonp({
                    Status: "OK"
                  });
            });
           }
        });
      }
    });
});
module.exports = router;
