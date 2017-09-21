var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var user = require("../models/user");
var post = require("../models/post");

var randToken = require("rand-token");

// mongoose.connect("mongodb://localhost/db1");
// var db = mongoose.connection;

var promises = [];

var numOfUsers = 10;
var numOfPosts = 1000;

// add random users
var addRandomUsers = function(addRandomPosts) {
  for (var i = 0; i < numOfUsers - 1; i++) {
    var token = randToken.uid(32);
    var username = randToken.uid(8);
    var password = randToken.uid(8);
    var userId = randToken
      .generator({
        chars: "0-9"
      })
      .generate(16);
    dateGen = (start, end) => {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    };
    var date = dateGen(new Date(2012, 0, 1), new Date());
    promises.push(addUser(token, userId, date, username, password));
  }
  // generate a superuser for test
  token = "ValidTokenValidTokenValidTokenVa";
  userId = "1234567812345678";
  username = "superUser";
  password = "MTIzNDU2NzgxMjM0NTY3OHN1cGVyVXNlcg==";
  date = new Date();
  promises.push(addUser(token, userId, date, username, password));
  Promise.all(promises).then(addRandomPosts);
};

function addUser(token, usrId, date, username, password) {
  return new Promise(function(fulfill, reject) {
    var User = new user({
      token: token,
      userId: usrId,
      subDate: date,
      username: username,
      password: password
    }).save(function(err) {
      if (err) {
        reject(err);
      } else {
        fulfill();
      }
    });
  });
}

// add valid fake posts.
var addRandomPosts = function() {
  var NW = {
    lat: 25.712819,
    long: 44.384766
  };
  var SE = {
    lat: 39.337696,
    long: 61.435547
  };
  user.find({}, function(err, users) {
    if (err) {
      console.log(err);
      return null;
    }
    for (var i = 0; i < numOfPosts - 1; i++) {
      var postId = randToken
        .generator({
          chars: "0-9"
        })
        .generate(32);
      var num = Math.random() * numOfUsers;
      var userId = users[parseInt(num)].userId;
      var content = randToken
        .generator({
          chars: "a-z"
        })
        .generate(160);
      var dateGen = (start, end) => {
        return new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
      };
      var date = dateGen(new Date(2012, 0, 1), new Date());
      var lat = Math.random() * (SE.lat - NW.lat) + NW.lat;
      var long = Math.random() * (SE.long - NW.long) + NW.long;
      new post({
        postId,
        userId,
        content,
        date,
        likes: 0,
        score: 0,
        replies: 0,
        // longitude: long,
        // latitude: lat
        location: { type: "Point", coordinates: [long, lat] }
      }).save(function(err, post) {
        if (err) console.log(err);
      });
    }
    // generating a super post from superuser for test
    new post({
      postId: 12345678,
      userId: 12345678,
      content: "master test",
      date: new Date(),
      likes: 0,
      score: 0,
      replies: 0,
      //   longitude: 45,
      //   latitude: 30
      location: { type: "Point", coordinates: [45, 30] }
    }).save(function(err, post) {
      if (err) console.log(err);
    });
  });
};

function generate() {
  addRandomUsers(addRandomPosts);
}

module.exports = generate;
