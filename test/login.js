var app = require("./helpers/app");
var should = require("should"),
  supertest = require("supertest"),
  data = require("./data/loginData");
var async = require("async");

describe("login test...", function() {
  var i = 1;
  async.each(data, function(item) {
    it("Testing userController.login / Test number " + i, function(done) {
      supertest(app)
        .post("/api/v3/user/login")
        .type("json")
        .send({
          username: item.data.username,
          password: item.data.password,
          userId: new Buffer(item.data.uuid + item.data.username).toString(
            "base64"
          )
        })
        .expect(item.expect)
        .end(function(err, res) {
          res.status.should.equal(item.expect);
          done();
        });
    });
    i++;
  });
});
