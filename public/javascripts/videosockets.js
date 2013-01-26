(function () {
    var url = {
        origin: window.location.origin,
        pathname: window.location.pathname
    };

    var socket = io.connect(url.origin, {
        client: url.pathname
    });
    var video = document.getElementById('video');

    socket.on('clientEvent', function (data) {
        var event = data.event,
            time = data.time;
        video.currentTime = time;
        video[event]();
    })

    var bindEvent = function (name) {
        return function(e){
            console.log(e);
            socket.emit('stateChange', {
                event: name,
                time: video.currentTime
            });
        }
    }

    var events = ['play', 'pause'];
    for(var i = 0; i < events.length; i++){
        var event = events[i];
        video.addEventListener(event, bindEvent(event));
    }
}())