var convert = function (title, dest, callback) {
    require('ffmpeg-node').exec(['-i', title, dest ], callback);
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