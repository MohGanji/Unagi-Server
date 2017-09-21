var User = require("../models/user");

var validateUser = function(username, password) {
  return new Promise(function(fulfill, reject) {
    User.findOne({ username: username }, function(err, res) {
      console.log(("username exists for login:", res));
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (res) {
          console.log("comparing passwords: ", password, res.password);
          if (res.password === password) {
            fulfill("login successful");
          } else reject();
        } else {
          reject(err);
        }
      }
    });
  });
};

module.exports = validateUser;
