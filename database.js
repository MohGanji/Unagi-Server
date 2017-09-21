var mongoose = require("mongoose");
var conf = require("./confidentials");
mongoose.connect(
  "mongodb://" +
  conf.db.username +
  ":" +
  conf.db.password +
  "@138.197.114.83/db1"
);

// mongoose.connect("mongodb://localhost:27017/db1");

var db = mongoose.connection;

module.exports = db;