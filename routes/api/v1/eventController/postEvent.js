var express = require("express");
var router = express.Router();
var event = require("../../../../models/event");

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
      // console.log(item);
      if (item.length && item[0].type === type) res.sendStatus(403);
      else {
        new event({
          type: type,
          postId: postId,
          userId: userId,
          date: date
        }).save(function(err, user) {
          if (err) res.send(err);
          else
            res.status(200).jsonp({
              Status: "OK"
            });
        });
      }
    });
});
module.exports = router;
