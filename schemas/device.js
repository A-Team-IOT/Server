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


var Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;