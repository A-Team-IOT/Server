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
      devices: []
    }
  
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        return res.redirect("/login");
      }
    });
  }
  else{
    res.redirect("/register");
  }
});

/* POST user login */
router.post('/login', function(req, res, next) {
  console.log("login attempt");
  if (req.body.email &&
    req.body.password) {
    

    User.authenticate(req.body.email, req.body.password, function(err, usr){
      if(err || usr == undefined){
        console.log(err);
        res.redirect("/login");
      }
      else{
        console.log(usr.email);
        req.session.user = usr.email;
        res.redirect("/dashboard");
      }
      
    });



    }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect("/login");
});

module.exports = router;
