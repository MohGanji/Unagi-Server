var app = require("./helpers/app");
var should = require("should"),
  supertest = require("supertest"),
  item = require("./data/masterData");
var async = require("async");
var user = require("../models/user");
var post = require("../models/post");
var event = require("../models/event");

describe("Master (O_O) test...", function() {
  var refreshToken, accessToken;
  it("Signing up :)", function(done) {
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
          console.log("ERR in signing up!", err);
        }
        res.status.should.equal(item.expect);
        refreshToken = res.body.refreshToken;
        done();
      });
  });
  it("getting accessToken", function(done) {
    supertest(app)
      .get(
        "/api/v3/user/access?location=" +
          JSON.stringify(item.data.location) +
          "&uuid=" +
          item.data.uuid +
          "&refreshToken=" +
          refreshToken
      )
      .expect(item.expect)
      .end(function(err, res) {
        if (err) console.log("ERR in getting access token in masterTest");
        res.status.should.equal(item.expect);
        accessToken = res.body.accessToken;
        done();
      });
  });
  it("sending a post ", function(done) {
    supertest(app)
      .post(
        "/api/v3/post?" +
          "location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken
      )
      .type("json")
      .send(item.sendPostData)
      .expect(item.expect)
      .end(function(err, res) {
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("liking my own post :( ", function(done) {
    supertest(app)
      .post(
        "/api/v3/event?accessToken=" +
          accessToken +
          "&uuid=" +
          item.data.uuid +
          "&location=" +
          JSON.stringify(item.data.location)
      )
      .type("json")
      .send(item.likeData)
      .expect(item.expect)
      .end(function(err, res) {
        if (err) {
          console.log("ERR in testing postEvent!");
        }
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("getting my likes", function(done) {
    supertest(app)
      .get(
        "/api/v3/post/mylikes?location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken
      )
      .expect(item.expect)
      .end(function(err, res) {
        if (err)
          console.log("ERR: in masterTest, getting posts I liked: ", err);
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("replying to master post!", function(done) {
    supertest(app)
      .post(
        "/api/v3/post?" +
          "location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken
      )
      .type("json")
      .send(item.replyData)
      .expect(item.expect)
      .end(function(err, res) {
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("getting posts with a special tag", function(done) {
    supertest(app)
      .get(
        "/api/v3/post?accessToken=" +
          accessToken +
          "&location=" +
          JSON.stringify(item.data.location) +
          "&tag=burn"
      )
      .expect(item.expect)
      .end(function(err, res) {
        if (err)
          console.log(
            'ERR: in masterTest, getting posts with tag "cage": ' + err
          );
        res.status.should.equal(item.expect);
        console.log("getting post with a special tag result: ", res.body);
        done();
      });
  });
  it("getting my posts :|", function(done) {
    supertest(app)
      .get(
        "/api/v3/post?location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken +
          "&my=true"
      )
      .expect(item.expect)
      .end(function(err, res) {
        if (err)
          console.log("ERR: in masterTest, getting my own posts: " + err);
        res.status.should.equal(item.expect);
        console.log(res.body);
        done();
      });
  });
  it("getting replies of master post", function(done) {
    supertest(app)
      .get(
        "/api/v3/post/replies?location=" +
          JSON.stringify(item.data.location) +
          "&postId=" +
          item.replyData.parentId +
          "&accessToken=" +
          accessToken
      )
      .expect(item.expect)
      .end(function(err, res) {
        res.status.should.equal(item.expect);
        console.log(res.body);
        done();
      });
  });
  it("getting my profile", function(done) {
    supertest(app)
      .get(
        "/api/v3/user/profile?location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken
      )
      .expect(item.expect)
      .end(function(err, res) {
        if (err) console.log("ERR: in masterTest, getting profile: ", err);
        console.log("userProfile result: " + res.body.username);
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("updating my profile", function(done) {
    supertest(app)
      .post(
        "/api/v3/user/update?location=" +
          JSON.stringify(item.data.location) +
          "&accessToken=" +
          accessToken
      )
      .type("json")
      .send({ user: item.updatedUser })
      .expect(item.expect)
      .end(function(err, res) {
        if (err) console.log("ERR: in masterTest, updating profile: ", err);
        res.status.should.equal(item.expect);
        done();
      });
  });
  it("remove excess like", function(done) {
    event.remove({ postId: item.likeData.postId }, function(err) {
      if (err) console.log("ERR in removing excess like in likePost test!");
      done();
    });
  });
  it("removing excess posts", function(done) {
    post.remove(
      {
        $or: [
          { content: item.sendPostData.content },
          { content: item.replyData.content }
        ]
      },
      function(err) {
        if (err) console.log("ERR in removing sendPost data after testing!");
        done();
      }
    );
  });
  it("delete excess data", function(done) {
    user.remove({ username: item.data.username }, function(err) {
      if (err) {
        console.log("ERR in removing excess user after testing!");
      }
      done();
    });
  });
});
