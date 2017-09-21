var event = require("../models/event");

function getLikeNumber(postId) {
  var promise = new Promise(function(resolve, reject) {
    var likes = 0;
    event
      .find({
        postId: postId
      })
      .cursor()
      .on("data", function(item) {
        if (item.type === "like") likes++;
        if (item.type === "unlike") likes--;
      })
      .on("error", function(err) {
        // return -10;
        reject(err);
      })
      .on("close", () => {
        // return likes;
        resolve(likes);
      });
  });
  return promise;
}

module.exports = getLikeNumber;
