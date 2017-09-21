var express = require("express");
var router = express.Router();

var getPosts = require("./getPosts");
var sendPost = require("./sendPost");
var tokenAuth = require("../../../../utilities/validation");

router.use(function(req, res, next) {
  tokenAuth(
    {
      token: req.headers.token
    },
    res,
    next
  );
});

router.get("/", getPosts);
router.post("/", sendPost);

module.exports = router;
