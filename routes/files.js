var convert = function (success) {

};

exports.upload = function(req, res) {
    var file = req.files.uploadVideo;
    var fs = require('fs');
    console.log(file);
    fs.readFile(file.path, function (err, data) {
        //check file type first!
        var name = file.path.slice(5)
          , newPath = __dirname + "/uploads/" + name;

        fs.writeFile(newPath, data, function (err) {
            if(err) throw err;

            res.render('video', {
                path: newPath,
                title: 'Le Video'
            });
        })
    });
}