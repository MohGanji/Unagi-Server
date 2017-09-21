var app = require("./helpers/app");
var should = require("should"),
  supertest = require("supertest"),
  data = require("./data/postData"),
  userData = require("./data/loginData"),
  async = require("async"),
  post = require("../models/post");
describe("postController test...", function() {
  var i = 1;
  var user = userData[1];
  var refreshToken;
  var accessToken;
  async.each(data, function(item) {
    it("login as superUser / Test number " + i, function(done) {
      supertest(app)
        .post("/api/v3/user/login")
        .type("json")
        .send({
          username: user.data.username,
          password: user.data.password,
          userId: new Buffer(user.data.uuid + user.data.username).toString(
            "base64"
          )
        })
        .expect(user.data.expect)
        .end(function(err, res) {
          res.status.should.equal(user.expect);
          refreshToken = res.body.refreshToken;
          done();
        });
    });
    it("getting accessToken / Test number " + i, function(done) {
      supertest(app)
        .get(
          "/api/v3/user/access?location=" +
            JSON.stringify(item.data.location) +
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
    it("Testing postController.sendPost / Test number " + i, function(done) {
      supertest(app)
        .post(
          "/api/v3/post?" +
            "location=" +
            JSON.stringify(item.data.location) +
            "&accessToken=" +
            accessToken
        )
        .type("json")
        .send(item.data)
        .expect(item.expect)
        .end(function(err, res) {
          res.status.should.equal(item.expect);
          done();
        });
    });
    i++;
  });
  it("removing excess post", function(done) {
    post.findOneAndRemove(
      { content: data[1].data.content },
      { sort: { date: -1 } },
      function(err) {
        if (err) console.log("ERR in removing sendPost data after testing!");
        done();
      }
    );
  });
});
