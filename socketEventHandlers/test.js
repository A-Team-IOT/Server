const User = require('../schemas/user');
const Device = require('../schemas/device');

const TestHandlers = function (socket){
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        //register: register.bind(this), // use the bind function to access this.app and this.socket in events
        //deviceEvent: deviceEvent.bind(this),
        //testData: testData.bind(this)
    };
}

function register(data){
    console.log("REGISTER");
    io.sockets.emit('dataToTest', "Register event: " + data);
    var data1 = {"msg_type":"register", "email":"ryan2@ryan2.com", "password": "ryan2", "id":"dev123", "components": [{"component_type":"button", "id":"01", "name":"myButton", "method": "mymethod", "props": {"text":"Click me"} },{"component_type": "light", "id":"02", "name": "light", "method": "mymethod7", "props": {"state":"1"} }]}  
    io.sockets.emit('dataToTest', JSON.stringify(data1));
    User.authenticate(data1.email, data1.password, function(err, usr){
        if(err){
          console.log("Failed to authenticate user, device not registered");
        }
        else{
          User.update(
            { "email" : data1.email}, 
            { "$addToSet": { "devices": data1.id }}, 
            function(error) {
          });

          var deviceData = {
            id: data1.id,
            owner_email: data1.email,
            components: data1.components
            /*,
            switches: data.switches
            **/
          }

          Device.deviceCheckIn(deviceData);
        }      
    });
}

function deviceEvent(data){
    io.sockets.emit('dataToTest', "Device event: " + data);
      var data1 = {"msg_type":"onPropChange", "id":"dev123", "componentId": "2", "propName": "state", "propValue": data}
      io.sockets.emit('dataToTest', JSON.stringify(data1));
      Device.updateProp(data1.id, data1.componentId, data1.propName, data1.propValue, function(error,docs){
        if(error)
        {
          console.log(error);
        }
        else{
          var json = {};
          json[data1.propName] = data1.propValue;
          console.log("Device props update: " + JSON.stringify(docs));
          io.sockets.emit(data1.id + data1.componentId, json);
        }
        
     });
}

//this listener just outputs data to the test page, with no action taken
function testData(data){
  let dataOut;
  let dt = new Date();
  let utcDate = dt.toUTCString();
  try{
    dataOut = JSON.stringify(data);
  }
  catch(e){}
  io.sockets.emit('dataToTest', utcDate + ". testData: " + data);
}

module.exports = TestHandlers;