const User = require('../schemas/user');
const Device = require('../schemas/device');

const DeviceHandlers = function (socket){
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        register: register.bind(this),
        eventFromDevice: eventFromDevice.bind(this),
        eventToDevice: eventToDevice.bind(this)
    };
}

function register(data){

  winston.debug('register: ' + data);
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'register: ' + data);
  }
  
  var data = JSON.parse(data);

  //Check all values exist and authenticate
  if (data.email && data.password && data.components && data.id) {
    User.authenticate(data.email, data.password, function(err, usr){
      if(err){
        winston.debug("Failed to authenticate user, device not registered");
        if(config.debugMode){
          io.sockets.emit('dataToTest', "Failed to authenticate user, device not registered");
        }
      }
      else{
        winston.debug("User authenticated, updating device list");
        User.update(
          { "email" : data.email}, 
          { "$addToSet": { "devices": data.id }}, 
          function(error) {
            
        });

        var deviceData = {
          id: data.id,
          owner_email: data.email,
          components: data.components
          /*,
          switches: data.switches
          **/
        }

        Device.deviceCheckIn(deviceData);
      }
    });
  }
  else{
    winston.debug("Missing data, register failed");
  }
}

function eventFromDevice(data){

  winston.debug('eventFromDevice: ' + data);
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'eventFromDevice: ' + data);
  }
  
  var data = JSON.parse(data);

  //Check all values exist and authenticate
  if (data.id && data.component_id && data.props) {
    Device.updateProps(data.id, data.component_id, data.props, function(error,docs){
      if(error)
      {
        winston.debug(error);
        if(config.debugMode){
          io.sockets.emit('dataToTest', "Failed to update component properties");
        }
      }
      else{
        var json = {};
        for(let i = 0; i < data.props.length; i++)
        {
          json[data.props[i].propName] = data.props[i].propValue;
        }
        
        winston.debug("Device props update: " + docs);
        io.sockets.emit(data.id + data.component_id, json);
      }
      
    });
  }
  else{
    winston.debug("Missing data, register failed");
  }
}

function eventToDevice(data){

  winston.debug('eventToDevice: ' + data);
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'eventToDevice: ' + data);
  }
  
  var data = JSON.parse(data);
  let deviceId = data.id;

  delete data["id"];


  io.sockets.emit(deviceId, data);
  io.sockets.emit('dataToTest', "Data sent from UI event: " + deviceId + ", " + JSON.stringify(data));
}



module.exports = DeviceHandlers;