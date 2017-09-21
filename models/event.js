var mongoose = require("mongoose");
var db = require("../database");

var eventSchema = mongoose.Schema({
  type: {
    type: String,
    require: true
  },
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

var event = mongoose.model("event", eventSchema);

module.exports = event;
