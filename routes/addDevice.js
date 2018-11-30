var express = require('express');
var router = express.Router();


/* POST add a device via HTTP. Not really using anymore*/
router.post('/', function(req, res) {
    var id = req.body.deviceId;
    console.log(req.body);
    global.list.push(id);
    res.send("Success: " + id);
});



module.exports = router;
