const WebpageHandlers = function (socket){
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        dataFromWebpage: dataFromWebpage.bind(this) // use the bind function to access this.app and this.socket in events
    };
}

function dataFromWebpage(data){
    winston.debug(data);
    io.sockets.emit("dev123", data);
    io.sockets.emit('dataToTest', "Button clicked on UI");
}

module.exports = WebpageHandlers;