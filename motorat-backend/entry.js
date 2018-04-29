
var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var mysql = require("mysql");

var app = express();

const route = require("./route/routes");



const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyparser.json());

app.use('/api', route);

app.get('/',(req,res)=>{

    res.send("hello from the t server");

})

app.listen(PORT, ()=>{

    console.log("app listening on port:"+PORT);
});