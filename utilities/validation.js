var user = require("../models/user");
var post = require("../models/post");

function validator(toAuth, res, next) {
  var promises = [];

  for (var key in toAuth) {
    promises.push(validate(key, toAuth, res, next));
  }
  Promise.all(promises)
    .then(function(res) {
      // if all validations confirmed pass the middleware
      next();
    })
    .catch(function(error) {
      // some validations rejected!
      console.log(error);
      return res.sendStatus(403);
    });
}

function validate(key, toAuth, res, next) {
  return new Promise(function(fulfill, reject) {
    if (key === "userId" || key === "token") buffer = user;
    else if (key === "postId") buffer = post;
    var found = 0;
    var query = {};
    query[key] = toAuth[key];
    buffer
      .find(query)
      .cursor()
      .on("data", function(specUser) {
        found = 1; // match found!
      })
      .on("close", function() {
        if (found) {
          fulfill(); // data recived. it means validation confirmed!
        } else reject("accessToken auth failed"); // all recordes visited and no match found!
      });
  });
}

module.exports = validator;
