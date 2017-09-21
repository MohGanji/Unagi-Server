var event = require("../models/event");

var findMyLikes = function(userId) {
  return new Promise(function(fulfill, reject) {
    var seen = [];
    var results = [];
    var options = {
      sort: {
        date: -1
      }
    };
    event
      .find(
        {
          userId: userId
        },
        null,
        options
      )
      .cursor()
      .on("data", function(item) {
        if (!seen.includes(item.postId)) {
          seen.push(item.postId);
          if (item.type === "like") results.push(item.postId);
        }
      })
      .on("error", function(err) {
        console.log("ERR: in findMyLikes.js, fetching my likes postIds: ", err);
        reject(err);
      })
      .on("close", function() {
        console.log("in findMyLikes: ", results);
        fulfill(results);
      });
  });
};

module.exports = findMyLikes;
