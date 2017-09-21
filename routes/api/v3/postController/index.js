var express = require("express");
var router = express.Router();

var getPosts = require("./getPosts");
var sendPost = require("./sendPost");
var replies = require("./getReplies");
var getMyLikes = require("./getMyLikes");
var tokenMiddleware = require("../../../../utilities/tokenMiddleware");

router.use(tokenMiddleware);

router.use("/replies", replies);
router.get("/", getPosts);
router.post("/", sendPost);
router.use("/mylikes", getMyLikes);

module.exports = router;
