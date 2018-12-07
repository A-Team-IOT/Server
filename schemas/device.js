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
    name: String,
    text: String, 
    method: String
  }]
});

//if id is from the same user update or add device
DeviceSchema.statics.deviceCheckIn = function (deviceData) {
  Device.findOne({ id: deviceData.id })
    .exec(function (err, device) {
      if (err) {
        console.log(err);
      } else if (!device) {
        //use schema.create to insert device into the db
        Device.create(deviceData, function (err, user) {
          if (err) {
            console.log("Error creating device: " + err);
          } else {
            console.log("device registered");
          }
        });
      }
      else{
        if(deviceData.owner_email == device.owner_email){
          Device.replaceOne({id: deviceData.id},deviceData, 
            function(error, d) {
              if(err){
                console.log(err);
              }
              else{
                console.log("Device updated");
              }
          });
        }
        else{
          console.log("The device id is taken");
        }
      }
   
    });
}

var Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;