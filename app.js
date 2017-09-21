var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var post = require("./models/post");
var decay = require("decay");
var hackerHotScore = decay.hackerHot(1.8);

var index = require("./routes/index");
var v1 = require("./routes/api/v1");
var v2 = require("./routes/api/v2");
var v3 = require("./routes/api/v3");

var boolParser = require("express-query-boolean");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(boolParser());

app.use("/", index);
app.use("/api/v1", v1);
app.use("/api/v2", v2);
app.use("/api/v3", v3);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

setInterval(function() {
  post.find({}, function(err, res) {
    if (err) {
      console.log("Error in hot update interval: ", err);
      console.log("and result is: ", res);
    }
    if (res)
      res.forEach(function(item) {
        if (item.postId === "12345678") console.log("Memento Mori");
        item.score = hackerHotScore(item.likes, item.date);
        item.save();
      });
  });
}, 1000 * 5 * 60);

module.exports = app;
