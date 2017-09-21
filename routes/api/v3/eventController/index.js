var express = require("express");
var router = express.Router();
var user = require("../../../../models/user");
var postEvent = require("./postEvent");
var validate = require("../../../../utilities/validation");
var tokenMiddleware = require("../../../../utilities/tokenMiddleware");

// validate accessToken, Extract userId from accessToken and append it to request
router.use(tokenMiddleware);

//validate userId and postId
router.use(function(req, res, next) {
  if (req.method == "GET") {
    validate(
      {
        postId: req.query.postId
      },
      res,
      next
    );
  }
  if (req.method == "POST")
    validate(
      {
        userId: req.body.userId,
        postId: req.body.postId
      },
      res,
      next
    );
});

router.post("/", postEvent);

module.exports = router;
