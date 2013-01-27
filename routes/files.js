var globalVars = {};

globalVars.S3 = null;
globalVars.domain = null;
globalVars.bucketName = "monkeyCatVideoSync";
globalVars.codecFlags = [];//['-vcodec', 'libvpx', '-acodec', 'libvorbis'];

exports.initAWS = function(aws) {
  globalVars.S3 = new aws.S3();
  globalVars.domain = globalVars.S3.client.endpoint.href;
};

var utils = {};

utils.remove

utils.getName = function(str) {
  return str.slice(5,12);//removes '/tmp/' and shrinks name to 7 characters
}

utils.makeVideoPath = function(vars, fileName) {
  return vars.domain + vars.bucketName + '/' + fileName;
}

//assumes a very specific format for 'io'
utils.ffmpegArray = function(io, codecs) {
  return io.slice(0,2).concat(codecs).concat(io.slice(2));
}

utils.convert = function (path, dest, renderView) {
    var extensions = ['.mp4', '.ogg', '.webm']
      , fs = require('fs')
      , ffmpeg = require('ffmpeg-node');

    (function convertAll(exts) {
      if (exts.length) {
        extension = exts[0];
        var title = dest + extension
          , args = utils.ffmpegArray(['-i', path, title ], globalVars.codecFlags);

        ffmpeg.exec(args, function readAndUpload(ffmpegErr, ffmpegInfo) {
          fs.readFile(title, function sendToS3(err, data) {
            var s3 = globalVars.S3
              , bucketName = globalVars.bucketName
              , fileName = utils.getName(dest) + extension;

            console.log('done converting video:');
            console.log(data);
            s3.client.putObject({
              Bucket: bucketName,
              Key: fileName,
              Body: data,
              ACL: 'public-read'
            },function success(res){
              convertAll(exts.slice(1));
            });
          });
        });
      }else {
        renderView(utils.getName(dest));
      }
    }(extensions));
};

exports.dickAround = function(args) {
    console.log(globalVars.S3);
    globalVars.S3.client.createBucket({Bucket: globalVars.bucketName}, function(err, data) {
      console.log(err);
      console.log('yay a bucket:');
      console.log(data);
    })
};

exports.upload = function(req, res) {
    var file = req.files.uploadVideo
      , name = utils.getName(file.path)
      , dest = '/tmp/' + name;

    console.log('omg about to convert video');
    utils.convert(file.path, dest, function renderFinalVideo(fileName) {
        res.redirect('/'+fileName);
    });

};

exports.serve = function(req, res) {
    var id = req.params.id;

    res.render('video', {
        path: utils.makeVideoPath(globalVars, id),
        title: 'Le Video'
    });

};