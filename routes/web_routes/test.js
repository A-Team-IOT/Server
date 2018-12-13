var express = require('express');
var router = express.Router();

/* GET test page. */
router.get('/', function(req, res, next) {
  res.render('test/test', {  });
});

/* GET test input page. */
router.get('/input', function(req, res, next) {
  res.render('test/testInput', {  });
});

module.exports = router;
