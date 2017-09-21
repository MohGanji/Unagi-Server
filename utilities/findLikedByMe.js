var event = require("../models/event");

function findLikedPost(item, userId) {
  return new Promise(function(fulfill, reject) {
    var likedByMeOptions = {
      sort: {
        date: -1
      }
    };
    event.findOne(
      {
        userId: userId,
        postId: item.postId
      },
      null,
      likedByMeOptions,
      function(err, res) {
        if (err) console.log(err);
        if (res && res.type === "like") {
          fulfill({
            post: item,
            likedByMe: true
          });
        } else {
          fulfill({
            post: item,
            likedByMe: false
          });
        }
      }
    );
  });
}

module.exports = findLikedPost;
