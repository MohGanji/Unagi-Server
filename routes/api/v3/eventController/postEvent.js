var express = require("express");
var router = express.Router();
var event = require("../../../../models/event");
var post = require("../../../../models/post");
var decay = require("decay");
var hackerHotScore = decay.hackerHot(1.8);

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
    .then(function(item, err) {
      if (err) console.log("We are in postEvent line 18:", err);
      if (
        (item.length && item[0].type === type) ||
        (!item.length && type === "unlike")
      ) {
        res.sendStatus(403);
      } else {
        new event({
          type: type,
          postId: postId,
          userId: userId,
          date: date
        }).save(function(err, user) {
          if (err) res.send(err);
          else {
            post.findOneAndUpdate(
              { postId: postId },
              {
                $inc: { likes: type === "like" ? 1 : -1 }
              },
              function(err, item) {
                console.log(item);
                item.score = hackerHotScore(item.likes, item.date);
                item.save(function(err, item) {
                  if (err) console.log(err);
                  res.status(200).jsonp({
                    Status: "OK"
                  });
                });
              }
            );
          }
        });
      }
    });
});
module.exports = router;
