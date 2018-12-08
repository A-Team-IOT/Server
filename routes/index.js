var express = require('express');
var router = express.Router();

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
  if (req.session.user){
    res.render('dashboard', {});
  }
  else{
    res.redirect("/login");
  }
});

/* GET controlportal. */
router.get('/ControlPortal', function(req, res, next) { 
  if (req.session.user){
    res.render('ControlPortal', {});
  }
  else{
    res.redirect("/login");
  }
});

module.exports = router;
