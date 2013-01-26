

exports.socketSetup = (function(){
    var connections = {}
    var connectionsArray = function(connObject){
      return Object.keys(connObject).map(function (key){
        return connObject[key];
      })
    }


    return function (io) {
        //for heroku!
        io.configure(function () {
          io.set("transports", ["xhr-polling"]);
          io.set("polling duration", 10);
        });

        io.sockets.on('connection', function (socket) {
          var id = socket.id;

          console.log(socket);

          socket.on('stateChange', function (data) {
            console.log(data);
            var array = connectionsArray(connections);
            array.forEach(function (conn) {
                if(conn !== socket)
                    conn.emit('clientEvent', data);
            });
          })

          socket.on('disconnect', function (){
            delete connections[id];
          });

          connections[id] = socket;
          console.log(Object.keys(connections).length);
        });
    };

}())