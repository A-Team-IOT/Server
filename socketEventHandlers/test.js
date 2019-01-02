

const TestHandlers = function (socket){
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        testData: testData.bind(this)
    };
}

//this listener just outputs data to the test page, with no action taken
function testData(data){
  let dt = new Date();
  let utcDate = dt.toUTCString();
  try{

  }
  catch(e){}

  winston.debug('testData: ' + utcDate + ". testData: " + data);
  io.sockets.emit('dataToTest', utcDate + ". testData: " + data);
}

module.exports = TestHandlers;