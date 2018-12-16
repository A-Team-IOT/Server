const DeviceHandlers = require('./device.js');
const WebpageHandlers = require('./webpage.js');
const TestHandlers = require('./test.js');

const SocketEventLoader = function(){
    this.loadSockets = function(){
        io.on('connection', function(socket) {
            // Create event handlers for this socket
            let eventHandlers = {
                device: new DeviceHandlers(socket),
                webpage: new WebpageHandlers(socket)
            };

            if(config.debugMode){
                eventHandlers.test = new TestHandlers(socket);
            }
    
            // Bind events to handlers
            for (let category in eventHandlers) {
                let handler = eventHandlers[category].handler;
                for (let event in handler) {
                    //console.log("event: " + event + ". handler: " + handler[event]);
                    socket.on(event, handler[event]);
                }
            }    
        });
    }
};

module.exports = SocketEventLoader;