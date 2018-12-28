const User = require('../schemas/user');
const Device = require('../schemas/device');

const DeviceHandlers = function (socket){
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        dataFromDevice: dataFromDevice.bind(this), // use the bind function to access this.app and this.socket in events
        register: register.bind(this),
        eventFromDevice: eventFromDevice.bind(this),
        eventToDevice: eventToDevice.bind(this)
    };
}

function register(data){

  if(!JSON.parse(data)){return;}

  winston.debug('register: ' + JSON.stringify(data));
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'register: ' + JSON.stringify(data));
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
}

function eventFromDevice(data){

  if(!JSON.parse(data)){return;}

  winston.debug('eventFromDevice: ' + JSON.stringify(data));
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'eventFromDevice: ' + JSON.stringify(data));
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
        for(let i = 0; i < props.length; i++)
        {
          json[data.props[i].propName] = data.props[i].propValue;
        }
        
        winston.debug("Device props update: " + JSON.stringify(docs));
        io.sockets.emit(data.id + data.componentId, json);
      }
      
    });
  }
}

function eventToDevice(data){

  if(!JSON.parse(data)){return;}

  winston.debug('eventToDevice: ' + JSON.stringify(data));
  if(config.debugMode){
    io.sockets.emit('dataToTest', 'eventToDevice: ' + JSON.stringify(data));
  }
  
  let data = JSON.parse(data);
  let deviceId = data.id;

  delete data[id];


  io.sockets.emit(deviceId, data);
  io.sockets.emit('dataToTest', "Data sent from UI event: " + deviceId + ", " + data);
}

function dataFromDevice(data){
    try{  
        winston.debug('data from device: ' + JSON.stringify(data));
        io.sockets.emit('dataToTest', data);
        var data = JSON.parse(data);
        winston.debug(data.msg_type);

        //EXAMPLE
        //{"msg_type":"register", "email":"ryan@ryan.com", "password": "ryan", "id":"dev33", "components": [{"component_type":"button", "id":"01", "name":"myButton", "method": "mymethod", "props": {"text":"Click me"} },{"component_type": "light", "id":"02", "name": "light", "method": "mymethod7", "props": {"state":"1"} }]}      
        if(data.msg_type == "register")
        {
          //Check all values exist and authenticate
          if (data.email && data.password && data.components && data.id) {
            User.authenticate(data.email, data.password, function(err, usr){
              if(err){
                winston.debug("Failed to authenticate user, device not registered");
              }
              else{
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
        }
        //EXAMPLE 
        //{"msg_type":"onPropChange", "id":"dev33", "componentId": "1", "propName": "text", "propValue": "new text"}
        else if(data.msg_type == "onPropChange")
        {
          if(data.id && data.componentId && data.propName && data.propValue)
          { 
            Device.updateProp(data.id, data.componentId, data.propName, data.propValue, function(error,docs){
              if(error)
              {
                winston.debug(error);
              }
              else{
                var json = {};
                json[data.propName] = data.propValue;
                winston.debug("Device props update: " + JSON.stringify(docs));
                io.sockets.emit(data.id + data.componentId, json);
              }
              
            });
          }
        }
    }
    catch(e){
    winston.debug('data from device is NOT JSON: ');
    winston.debug(e);
    }
}

module.exports = DeviceHandlers;