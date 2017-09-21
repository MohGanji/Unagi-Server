var User = require("../models/user");

var uniqueUsername = function(usr) {
  return new Promise(function(fulfill, reject) {
    User.findOne({ username: usr }, function(err, res) {
      if (res) {
        console.log(err);
        reject(err);
      } else fulfill();
    });
  });
};

module.exports = uniqueUsername;
