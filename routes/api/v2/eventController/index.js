var express = require("express");
var router = express.Router();
var user = require("../../../../models/user");
var postEvent = require("./postEvent");
var getEvents = require("./getEvents");
var validate = require("../../../../utilities/validation");

// validate token & userId & postId
router.use(function(req, res, next) {
  if (req.method == "GET") {
    validate(
      {
        token: req.headers.token,
        postId: req.query.postId
      },
      res,
      next
    );
  }
  if (req.method == "POST")
    validate(
      {
        token: req.headers.token,
        userId: req.body.userId,
        postId: req.body.postId
      },
      res,
      next
    );
});
router.post("/", postEvent);
router.get("/", getEvents);

module.exports = router;
