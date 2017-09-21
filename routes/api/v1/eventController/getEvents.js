var express = require("express");
var router = express.Router();
var event = require("../../../../models/event");

router.get('/', function (req, res, next) {
    var likes = 0;
    var postId = req.query.postId;
    event.find({
            postId: postId
        }).cursor()
        .on('data', function (item) {
            if (item.type === 'like')
                likes++;
            if (item.type === 'unlike')
                likes--;
        })
        .on('error', function (err) {
            res.status(500).send(err);
        })
        .on('close', () => {
            res.jsonp({
                likes: likes
            });
        });
});

module.exports = router;