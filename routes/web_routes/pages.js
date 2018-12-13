var express = require('express');
var router = express.Router();
var Device = require('../../schemas/device');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Pass global list with two hard coded values, and any added devices via http, as well as the current light state.
  //res.render('index', { title: 'Express', list: global.list, light: global.light });
  if (req.session.user){
    res.redirect("/dashboard");
  }
  else{
    res.redirect("/login");
  }
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) { 
  if(!req.session.user){res.redirect("/login");}
  Device.findDevicesByUser(req.session.user, function(err, docs){
    if(err){
      console.log(err);
    }
    else{
      var deviceList = docs;
      console.log(deviceList);
      res.render('pages/dashboard', {deviceList: deviceList});
    }
  });
  
});

/* GET controlportal. */
router.get('/ControlPortal', function(req, res, next) { 
  if(!req.session.user){res.redirect("/login");}
  Device.findOne({id: req.query.device}, function(err, docs){
    if(err){
      
    }
    res.render('pages/ControlPortal', {device: docs});
  });
  
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('pages/login', { title: 'Express login'});
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('pages/register', { title: 'Express register'});
});

module.exports = router;
