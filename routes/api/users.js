var express = require('express');
var router = express.Router();
var User = require('../../schemas/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var users;
  User.find({}, function(err, docs) {
    if (!err){ 
        //console.log(docs);
        users = JSON.stringify(docs);
        console.log(users);
        res.send( users );
    } else {throw err;}
})

  
});

/* POST add a new user. */
router.post('/', function(req, res, next) {
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
      devices: []
    }
  
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return res.send(err);
      } else {
        return res.send(user);
      }
    });
  }
  else{
    res.status(400);
    res.send();
  }
});

/* POST user login */
router.post('/login', function(req, res, next) {
  console.log("login attempt");
  if (req.body.email &&
    req.body.password) {
    

    User.authenticate(req.body.email, req.body.password, function(err, usr){
      if(err || usr == undefined){
        res.status(401);
        res.send(err);
      }
      else{
        req.session.user = usr.email;
        res.send(usr);
      }
      
    });



    }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.send();
});

module.exports = router;
