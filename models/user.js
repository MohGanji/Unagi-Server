var mongoose = require("mongoose");
var db = require("../database");

var userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String },
  name: { type: String },
  surname: { type: String },
  username: { type: String, unique: true, required: true },
  password: { type: String },
  subDate: { type: Date, required: true }
});

var User = mongoose.model("user", userSchema);

module.exports = User;
