var convert = function (title, dest, callback) {
    require('ffmpeg-node').exec(['-i', title, dest ], callback);
};

exports.upload = function(req, res) {
    var file = req.files.uploadVideo
      , fs = require('fs')
      , name = file.path.slice(5)
      , newPath = __dirname + "/uploads/" + name + '.ogg' ;

    convert(file.path, newPath, function (err, info) {
        console.log(err);

        res.render('video', {
            path: newPath,
            title: 'Le Video'
        });
    });

}