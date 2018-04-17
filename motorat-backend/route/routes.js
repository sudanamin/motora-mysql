

const express = require('express');
var router = express.Router();


router.get('/test_get', (req,res,next)=> {
    res.send('get tested');
})

module.exports = router;
