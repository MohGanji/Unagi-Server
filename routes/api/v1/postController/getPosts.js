var express = require("express");
var router = express.Router();
var geolib = require("geolib");
// var async = require('async');
var user = require("../../../../models/user");
var post = require("../../../../models/post");

router.get("/", function(req, res, next) {
  var location = JSON.parse(req.query.location);
  var number = req.query.number | 100;
  var radius = 300000;
  var postLimit = 10;
  var results = [];
  post
    .find()
    .cursor()
    .on("data", function(item) {
      if (item.distance(location) < radius) {
        results.push(item);
      }
    })
    .on("error", err => res.send(err))
    .on("close", () => res.jsonp(results.splice(0, postLimit)));
});

module.exports = router;
