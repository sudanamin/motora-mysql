

const express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "montana",
    database: "cars",
    port: "3306"
});
router.get('/cars', (req,res,next)=> {
    res.send('get tested');
})

router.post('/car', (req,res,next)=>{

    model = req.body.model;
    color = req.body.color;

    connection.query("INSERT INTO `cars_table` (model, color) VALUES (?, ?)", ['2009', "red"], function(err) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
        res.send("done");
        console.log("done")
        }

    });

})

router.put('/car', (req,res,next)=>{


})

router.delete('/car', (req,res,next)=>{

})

module.exports = router;
