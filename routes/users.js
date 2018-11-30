var express = require('express');
var router = express.Router();
var User = require('../schemas/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var users;
  User.find({}, function(err, docs) {
    if (!err){ 
        //console.log(docs);
        users = JSON.stringify(docs);
        console.log(users);
        res.send( users );
        process.exit();
    } else {throw err;}
})

  
});

/* POST add a new user. */
router.post('/addUser', function(req, res, next) {
  console.log("POST adding user");
  //Check all values exist
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf==req.body.password) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }
  
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        return res.send('Success bitch!');
      }
    });
  }
  else{
    res.send("Complete all fields and match passwords bitch");
  }
});

/* POST user login */
router.post('/login', function(req, res, next) {
  console.log("login attempt");
  if (req.body.email &&
    req.body.password) {
    

    User.authenticate(req.body.email, req.body.password, function(err, usr){
      if(err){
        console.log(err);
        res.send(err);
      }
      else{
        console.log(usr);
        res.send(usr);
      }
      
    });



    }
});

module.exports = router;
