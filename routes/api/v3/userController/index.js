var express = require("express");
var router = express.Router();

var signup = require("./signup");
var login = require("./login");
var access = require("./access");
var update = require("./update");
var getUser = require("./getUser");

router.use("/access", access);
router.use("/signup", signup);
router.use("/login", login);
router.use("/update", update);
router.use("/profile", getUser);

module.exports = router;
