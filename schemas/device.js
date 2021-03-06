var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  owner_email: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  components: [{
    component_type: String,
    id: Number,
    name: String,
    method: String,
    props: {}
  }]
  /*,
  switches: [{
    id: Number,
    value: mongoose.Mixed
  }]
  **/
});

//if id is from the same user update or add device
DeviceSchema.statics.deviceCheckIn = function (deviceData) {
  Device.findOne({ id: deviceData.id })
    .exec(function (err, device) {
      if (err) {
        winston.debug(err);
      } 
      else if (!device) {
        //use schema.create to insert device into the db
        Device.create(deviceData, function (err, user) {
          if (err) {
            winston.debug("Error creating device: " + err);
          } else {
            winston.debug("device registered");
          }
        });
      }
      else{
        if(deviceData.owner_email == device.owner_email){
          Device.replaceOne({id: deviceData.id},deviceData, 
            function(error, d) {
              if(err){
                winston.debug(err);
              }
              else{
                winston.debug("Device updated");
              }
          });
        }
        else{
          winston.debug("The device id is taken");
        }
      }
   
    });
}


DeviceSchema.statics.findDevicesByUser = function (email, callback) {
  Device.find({ owner_email: email}, {id: 1, owner_email: 1, _id: 0}, function(err, docs){
    //winston.debug(docs);
    return callback(err, docs);
  });
}

DeviceSchema.statics.updateProps = function (deviceId, componentId, props, callback) {
  var set = {$set: {}};
  for(let i = 0; i < props.length; i++)
  {
    set.$set["components.$.props."+props[i].propName] = props[i].propValue;
  }
  
  winston.debug(JSON.stringify(set));
  Device.updateOne({ id: deviceId, 'components.id': componentId}, set, function(err, docs){
    return callback(err, docs);
  });
}

DeviceSchema.statics.updateProp = function (deviceId, componentId, propName, propValue, callback) {
  var set = {$set: {}};
  set.$set["components.$.props."+propName] = propValue;
  winston.debug(JSON.stringify(set));
  Device.updateOne({ id: deviceId, 'components.id': componentId}, set, function(err, docs){
    return callback(err, docs);
  });
}

var Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;