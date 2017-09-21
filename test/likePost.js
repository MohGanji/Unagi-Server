var app = require("./helpers/app");
var should = require("should"),
  supertest = require("supertest"),
  data = require("./data/likeData"),
  userData = require("./data/signupData"),
  async = require("async"),
  event = require("../models/event"),
  userModel = require("../models/user");
describe("eventController test (like) ...", function() {
  var i = 1;
  var user = userData[1];
  var refreshToken;
  var accessToken;
  it("Testing userController.signup / Test number " + i, function(done) {
    supertest(app)
      .post("/api/v3/user/signup")
      .type("json")
      .send({
        username: user.data.username,
        password: user.data.password,
        userId: new Buffer(user.data.uuid + user.data.username).toString(
          "base64"
        )
      })
      .expect(user.expect)
      .end(function(err, res) {
        if (err) {
          console.log("ERR in ending the test!");
        }
        res.status.should.equal(user.expect);
        refreshToken = res.body.refreshToken;
        done();
      });
  });
  async.each(data, function(item) {
    it("getting accessToken / Test number " + i, function(done) {
      supertest(app)
        .get(
          "/api/v3/user/access?location=" +
            JSON.stringify(user.data.location) +
            "&uuid=" +
            user.data.uuid +
            "&refreshToken=" +
            refreshToken
        )
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          accessToken = res.body.accessToken;
          done();
        });
    });
    it("Testing eventController.postEvent + Test number " + i, function(done) {
      supertest(app)
        .post(
          "/api/v3/event?accessToken=" +
            accessToken +
            "&uuid=" +
            item.data.uuid +
            "&location=" +
            JSON.stringify(user.data.location)
        )
        .type("json")
        .send(item.data)
        .expect(item.expect)
        .end(function(err, res) {
          if (err) {
            console.log("ERR in testing postEvent!");
            console.log(err);
          }
          res.status.should.equal(item.expect);
          done();
        });
    });
    i++;
  });
  it("remove excess like", function(done) {
    event.remove({ postId: data[1].data.postId }, function(err) {
      if (err) console.log("ERR in removing excess like in likePost test!");
      done();
    });
  });
  it("delete excess data", function(done) {
    userModel.remove({ username: user.data.username }, function(err) {
      if (err) {
        console.log("ERR in removing data after testing!");
      }
      done();
    });
  });
});
