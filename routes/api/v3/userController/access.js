var express = require("express");
var router = express.Router();
var jwt = require("jwt-simple");
var secret = require("../../../../confidentials").secret;
var refreshExpire = require("../../../../confidentials").token.refreshExpire;
const UUID_LENGTH = 16;

router.get("/", function(req, res, next) {
  var refreshToken = req.query.refreshToken;
  var uuid = req.query.uuid;
  var location = JSON.parse(req.query.location);
  var payload;
  var state = 200;
  try {
    payload = jwt.decode(refreshToken, secret); //extract payload data from refresh token
    var tokenDate = new Date(payload.date);
    // log baraye server
    console.log(
      "Refresh token remining time to expire for",
      payload.uname,
      ":",
      refreshExpire - (new Date().getTime() - tokenDate.getTime()),
      "ms"
    );

    // token expiration check
    if (new Date().getTime() - tokenDate.getTime() > refreshExpire) {
      state = 401;
    }
    if (
      new Buffer(payload.uid, "base64").toString().substring(0, UUID_LENGTH) !==
      uuid
    ) {
      state = 403;
    }
  } catch (err) {
    // token signature validation
    console.log("access.js :", err);
    state = 403;
  }
  if (state == 200) {
    // token is valid
    var accessPayload = {
      uid: payload.uid,
      loc: location,
      date: new Date()
    };
    var accessToken = jwt.encode(accessPayload, secret);
    res.status(200).jsonp({ accessToken: accessToken }); // send new access token as response
  } else if (state === 401) {
    res.status(403).jsonp({ error: "Token expired! Please login again" });
  } else if (state === 403) {
    res.status(403).jsonp({ error: "Invalid token! Please login again" });
  }
});

module.exports = router;
