
var express = require("express");
var mysql = require("mysql");
var bodyparser = require("body-parser");
var cors = require("cors");

var app = express();

const route = require("./route/routes");

//mysql.createConnection

const PORT = 3000;

app.use(cors());

app.use(bodyparser.json());

app.use('/api', route);

app.get('/',(req,res)=>{

    res.send("hello from the t server");

})

app.get('/aaa',(req,res)=>{

    res.send("aaaa ");

})
app.listen(PORT, ()=>{

    console.log("app listening on port:"+PORT);
});