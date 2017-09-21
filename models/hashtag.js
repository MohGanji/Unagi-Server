var mongoose = require("mongoose");
var db = require("../database");

var hashtagSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  }
});

var hashtag = mongoose.model("hashtag", hashtagSchema);

module.exports = hashtag;
