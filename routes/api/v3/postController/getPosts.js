var express = require("express");
var router = express.Router();
var geolib = require("geolib");
var async = require("async");
var user = require("../../../../models/user");
var post = require("../../../../models/post");
var event = require("../../../../models/event");
var getLikesCount = require("../../../../utilities/getLikes");
var findLikedPost = require("../../../../utilities/findLikedByMe");

router.get("/", function(req, res, next) {
  var location = JSON.parse(req.query.location);
  var my = req.query.my;
  var tag = req.query.tag;
  var postLimit = parseInt(req.query.postLimit) || 10;
  var userId = req.query.userId;
  var hot = req.query.hot;
  var beforeDate =
    req.query.before === undefined ? new Date() : new Date(req.query.before);
  var beforeScore =
    req.query.before === undefined ? 10000000000 : parseInt(req.query.before);

  var radius = 300000;
  var promises = [];
  var options = {
    sort: {
      date: -1
    },
    limit: postLimit
  };
  var hotOptions = {
    sort: {
      score: -1
    },
    limit: postLimit
  };

  var getPostQuery = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [location.longitude, location.latitude]
        },
        $maxDistance: radius
      }
    },
    date: { $lt: beforeDate.toISOString() }
  };
  if (hot) {
    delete getPostQuery.date;
    getPostQuery["score"] = { $lt: beforeScore };
  }
  if (my) {
    getPostQuery["userId"] = userId;
  }
  if (tag) {
    getPostQuery["hashtags"] = { $elemMatch: { $eq: tag } };
  }

  if (hot == undefined) {
    post
      .find(getPostQuery, null, options)
      .cursor()
      .on("data", function(item) {
        promises.push(findLikedPost(item, userId));
      })
      .on("error", function(err) {
        console.log(
          "ERR: error in cursor for finding posts with hot option: ",
          err
        );
        res.status(500).send(err);
      })
      .on("close", function() {
        Promise.all(promises)
          .then(function(results) {
            res.status(200).jsonp(results);
          })
          .catch(function(err) {
            console.log(
              "ERR: promise catched in finding likedEvent with hot option: ",
              err
            );
            res.status(500).jsonp(err);
          });
      });
  } else if (hot) {
    post
      .find(getPostQuery, null, hotOptions)
      .cursor()
      .on("data", function(item) {
        promises.push(findLikedPost(item, userId));
      })
      .on("error", function() {
        console.log("ERR: error in cursor for finding posts: ", err);
        res.status(500).send(err);
      })
      .on("close", function() {
        Promise.all(promises)
          .then(function(results) {
            res.status(200).jsonp(results);
          })
          .catch(function(err) {
            console.log("ERR: promise catched in finding likedEvent: ", err);
            res.status(500).jsonp(err);
          });
      });
  }
});

module.exports = router;
