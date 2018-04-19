

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
    connection.query("SELECT * FROM `cars_table`", function(err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
        res.send(cars);
        console.log(cars)
        }

    });
})

router.post('/car', (req,res,next)=>{

    model = req.body.model;
    color = req.body.color;
    console.log(model+"  :"+"color"+color)

    connection.query("INSERT INTO `cars_table` (model, color) VALUES (?, ?)", [model,color], function(err) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
        res.json({msg:"added"});
        console.log("added")
        }

    });

})

router.put('/car/:id', (req,res,next)=>{

    car_id = req.params.id;
    model = req.body.model;
    color = req.body.color;

    connection.query("UPDATE `cars_table` SET model=?, color=? WHERE car_id=? ", [model,color,car_id], function(err,result) {   //to do AND author_id=?
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
            res.json(result);
        console.log("updated")
        }

    });


})

router.delete('/car/:id', (req,res,next)=>{

    car_id = req.params.id;
    
    connection.query("DELETE FROM `cars_table` WHERE car_id=?", [car_id], function(err,result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
        res.json(result);
        console.log("delete complete")
        }

    });

})

module.exports = router;
