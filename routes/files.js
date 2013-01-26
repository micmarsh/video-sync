var convert = function (title, dest, callback) {
    require('ffmpeg-node').exec(['-i', title, dest ], callback);
};

var S3 = null;

exports.initAWS = function(aws) {
  S3 = new aws.S3();
};

exports.dickAround = function(args) {
  S3.createBucket({Bucket: 'videos'}, function(err, data) {
    console.log(err);
    console.log('yay a bucket:');
    console.log(data);
  })
};

exports.upload = function(req, res) {
    var file = req.files.uploadVideo
      , fs = require('fs')
      , name = file.path.slice(5)
      , dest = '/videos/' + name + '.webm'
      , encodeTo = './public' + dest;

    console.log('omg about to convert video');
    convert(file.path, encodeTo, function (err, info) {
        console.log(err);
        res.redirect('/'+name);
    });

};

exports.serve = function(req, res) {
    var id = req.params.id;

    res.render('video', {
        path: '/videos/'+ id + '.webm',
        title: 'Le Video'
    });

};