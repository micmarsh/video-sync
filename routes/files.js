var globalVars = {};

globalVars.S3 = null;
globalVars.domain = null;
globalVars.bucketName = "monkeyCatVideoSync";
globalVars.codecFlags = ['-vcodec', 'libvpx', '-acodec', 'libvorbis'];

var utils = {};

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

utils.convert = function (title, dest, renderView) {
    //needs to:
    //1. convert video, store it somewhere in tmp (look up heroku filesystem)
    //2. read the file, upload it to amazon.
    //3. Call the the callback that was originaly passed into here
    var fs = require('fs');
    var args = utils.ffmpegArray(['-i', title, dest ], globalVars.codecFlags);

    console.log(args);

    require('ffmpeg-node').exec(args, function uploadToAmazon(ffmpegErr, ffmpegInfo) {
        fs.readFile(dest, function sendToS3(err, data) {
          var s3 = globalVars.S3
            , bucketName = globalVars.bucketName
            , fileName = utils.getName(dest);
          console.log('done converting video:');
          console.log(data);
          s3.client.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
          },function success(res){
            renderView(ffmpegErr, ffmpegInfo, {
              name: fileName
            });
          });
        });
    });
};

exports.initAWS = function(aws) {
  globalVars.S3 = new aws.S3();
  globalVars.domain = globalVars.S3.client.endpoint.href;
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
      , dest = '/tmp/' + name + '.webm';

    console.log('omg about to convert video');
    utils.convert(file.path, dest, function renderFinalVideo(err, info, options) {
        var fileName = options.name;

        console.log(err);
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