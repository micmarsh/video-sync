
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , files = require('./routes/files')
  , http = require('http')
  , path = require('path')
  , AWS = require('aws-sdk');


var app = express();
try{
    AWS.config.loadFromPath('./aws.json');
}catch(e){
    console.log('loading aws credentials from environment variables');
}
files.initAWS(AWS);

require('./configure.js').configure(app, express, path);

app.get('/', routes.index);
app.post('/upload', files.upload);
app.get('/:id', files.serve);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
})
  , io = require('socket.io').listen(server);

require('./sockets.js').socketSetup(io);

