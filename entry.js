
var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");

var path = require('path');
//var mysql = require("mysql");

var app = express();

const route = require("./route/routes");



const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(bodyparser.json());
app.use(express.static(__dirname + '/images/') );


app.use('/api', route);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req,res) =>{

    res.sendFile(path.join(__dirname, 'public/index.html'));

})

app.get('/',(req,res)=>{

    res.send("hello from the t server");

})

app.listen(PORT, ()=>{

    console.log("app listening on port:"+PORT);
});