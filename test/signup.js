var app = require("./helpers/app");
var should = require("should"),
  supertest = require("supertest"),
  data = require("./data/signupData");
var async = require("async");
var user = require("../models/user");

describe("signup test...", function() {
  var i = 1;
  async.each(data, function(item) {
    it("Testing userController.signup / Test number " + i, function(done) {
      supertest(app)
        .post("/api/v3/user/signup")
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
          if (err) {
            console.log("ERR in ending the test!");
          }
          res.status.should.equal(item.expect);
          done();
        });
    });
    i++;
  });
  it("delete excess data", function(done) {
    user.remove({ username: data[1].data.username }, function(err) {
      if (err) {
        console.log("ERR in removing data after testing!");
      }
      done();
    });
  });
});
