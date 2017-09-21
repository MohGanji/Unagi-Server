var jwt = require("jwt-simple");
var secret = require("../confidentials").secret;
var accessExpire = require("../confidentials").token.accessExpire;
var accessRadius = require("../confidentials").token.accessRadius;
var geolib = require("geolib");

var accessValidation = function(accessToken, location, req, res, next) {
  var payload;
  try {
    payload = jwt.decode(accessToken, secret);
  } catch (err) {
    console.log(err);
    return res.status(403).jsonp({ error: "Invalid token!" });
  }
  var tokenDate = new Date(payload.date);
  var tokenLocation = payload.loc;
  if (
    new Date().getTime() - tokenDate.getTime() > accessExpire || //token expired because of time
    geolib.getDistance(location, tokenLocation) > accessRadius // token expired because of distance
  ) {
    return res
      .status(401)
      .jsonp({ error: "Access token expired! Please get a new one" });
  }
  if (req.method === "GET") {
    req.query["userId"] = payload.uid;
  } else if (req.method === "POST") {
    req.body["userId"] = payload.uid;
  }
  next();
};

module.exports = function(req, res, next) {
  var accessToken = req.query.accessToken;
  var location = JSON.parse(req.query.location);
  accessValidation(accessToken, location, req, res, next);
};
