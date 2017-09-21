var mongoose = require("mongoose");
var geolib = require("geolib");
var event = require("./event");
var db = require("../database");

var postSchema = mongoose.Schema(
  {
    postId: {
      type: String,
      unique: true,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    parentId: {
      type: String
    },
    location: {
      type: { type: String },
      coordinates: []
    },
    date: {
      type: Date,
      required: true
    },
    likes: {
      type: Number
    },
    score: {
      type: Number
    },
    replies: {
      type: Number
    },
    name: {
      type: String
    },
    parentName: {
      type: String
    },
    hashtags: {
      type: []
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

postSchema.index({ location: "2dsphere" });
var Post = mongoose.model("post", postSchema);
module.exports = Post;
