var express = require("express");
var router = express.Router();
var geolib = require("geolib");
var async = require("async");
var user = require("../../../../models/user");
var post = require("../../../../models/post");
var getLikesCount = require("../../../../utilities/getLikes");

router.get("/", function(req, res, next) {
  var location = JSON.parse(req.query.location);
  var postLimit = req.query.postLimit | 10;
  var hot = req.query.hot;
  var before =
    req.query.before === undefined ? new Date() : new Date(req.query.before);
  var radius = 300000;
  var results = [];
  var promises = [];
  var options = {
    sort: { date: -1 },
    limit: postLimit
  };
  var hotOptions = {
    sort: {
      score: -1
    },
    limit: postLimit
  };
  if (hot == undefined) {
    post
      .find(
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude]
              },
              $maxDistance: radius
            }
          },
          date: {
            $lte: before.toISOString()
          }
        },
        null,
        options
      )
      .cursor()
      .on("data", function(item) {
        results.push(item);
      })
      .on("error", err => res.send(err))
      .on("close", function() {
        res.jsonp(results);
      });
  } else if (hot) {
    post
      .find(
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude]
              },
              $maxDistance: radius
            }
          },
          date: {
            $lte: before.toISOString()
          }
        },
        null,
        hotOptions
      )
      .cursor()
      .on("data", function(item) {
        results.push(item);
      })
      .on("error", err => res.send(err))
      .on("close", function() {
        res.jsonp(results);
      });
  }
});

module.exports = router;
