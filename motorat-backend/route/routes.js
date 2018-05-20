

const express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
var url = require('url');

//app.use(express.static(__dirname ));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "montana",
    database: "cars",
    port: "3306"
});
router.get('/cars', (req,res,next)=> {

    var whereClause = "WHERE 1 = 1 ";

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    var color = req.query.color;
    var model = req.query.model;
    //var color = req.params.color;
    console.log('color is :'+color);

    if(color != null)
      { 
         whereClause += "AND color LIKE '"+color+"'";
        console.log('cccccccccccc is :'+color);
        //whereClause += "AND description LIKE '%keywords%'"
      }else console.log('ddddddddddd is :'+color);

      if(model != null)
      { 
         whereClause += "AND model LIKE '"+model+"'";
        console.log('mmmmmmmmmm is :'+model);
        //whereClause += "AND description LIKE '%keywords%'"
      }else console.log('lllllllllll is :'+model);
   /*  if(price != null)
      {
        whereClause += "AND price = '%price%'"
       } */


    connection.query("SELECT * FROM `cars_table` "+whereClause, function(err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
        res.send(cars);
        console.log("cars  tttable :  "+cars)
        }

    });
})

router.get('/carsimgs', (req,res,next)=> {

    var whereClause = "WHERE 1 = 1 ";

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    var color = req.query.color;
    var model = req.query.model;
    //var color = req.params.color;
    console.log('color is :'+color);

    if(color != null)
      { 
         whereClause += "AND color LIKE '"+color+"'";
        console.log('cccccccccccc is :'+color);
        //whereClause += "AND description LIKE '%keywords%'"
      }else console.log('ddddddddddd is :'+color);

      if(model != null)
      { 
         whereClause += "AND model LIKE '"+model+"'";
        console.log('mmmmmmmmmm is :'+model);
        //whereClause += "AND description LIKE '%keywords%'"
      }else console.log('lllllllllll is :'+model);
   /*  if(price != null)
      {
        whereClause += "AND price = '%price%'"
       } */


    connection.query("SELECT * FROM `car_images` "+whereClause, function(err, cars) {
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

    connection.query("INSERT INTO `cars_table` (MODEL, COLOR) VALUES (?, ?)", [model,color], function(err) {
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

    connection.query("UPDATE `cars_table` SET MODEL=?, COLOR=? WHERE APPLICATION_ID=? ", [model,color,car_id], function(err,result) {   //to do AND author_id=?
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
    

    connection.query("DELETE FROM `car_images` WHERE REF_app_ID=?", [car_id], function(err,result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else{
       // res.json(result);
        console.log("delete complete for car_images table for car id : "+car_id );
        connection.query("DELETE FROM `cars_table` WHERE APPLICATION_ID=?", [car_id], function(err,result) {
            if (err) {
                res.status(500);
                return next(err);
            }
            else{
            res.json(result);
            console.log("delete complete for cars_table car id : "+car_id );
            }
    
        });
        }

    });
   

})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images/')
    },
    filename: function (req, file, cb) {
      //  console.log("amin is :"+file.path);
       // let mime = fileType(file).mime;
        cb(null,  Date.now() +"_"+file.originalname);
       // console.log("image/"+file.filename);
     /*    connection.query("INSERT INTO `cars_table` (model, color,USER_ID) VALUES (?, ?, ?)", [1,1,file.filename], function(err, result) {
            if (err) {
                res.status(500);
                console.log(err);
            }
            else{
            //res.json({msg:"added"});
            //var msg = "added";
            //return msg;
           // msg = msg+"ccc";
           // res.status(200).json({message: message+msg, result:result})
            console.log("ok");
            }
    
        }); */
     
    }
  });

  var fields = [
    { name: 'image', maxCount: 12 },
    { name: 'color'},
    { name: 'model'},
    { name: 'uid'}
  ]
  var upload = multer({ storage: storage }).fields(fields); // var upload = multer({ storage: storage }).array('image');
 // upload.single('image');
/*const upload = multer({
    dest:'images/', 
    filename: function ( req, file, cb ) {
        //req.body is empty...
        //How could I get the new_file_name property sent from client here?
        cb( null, file.originalname );
    },
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')*/

router.post('/setimg', (req, res,next) => {
 var msg = "aa";
    upload(req, res, function (err) {

           
       

      
       //var name =JSON.parse(JSON.stringify(req.files));
       
       
      
        if (err) {

            res.status(400).json({message: err.message})

        } else {

           // console.log("origana name :"+req.files[0].originalname);
           var name =req.files;
           if(name){
           console.log("json object "+name.image[0].path);
           model = req.body.model;
           color = req.body.color;
           uid = req.body.uid;
           console.log(model+"  :"+"color"+req.body.color);
           connection.query("INSERT INTO `cars_table` (MODEL, COLOR , USER_ID) VALUES (?, ?, ?)", [model,color, uid], function(err, result) {
            if (err) {
                res.status(500);
                return next(err);
            }
            else{
            //res.json({msg:"added"});
            //req.files.image[0].filename
            console.log("added")
            console.log("origana name :"+JSON.stringify(req.files));
            var images  = req.files.image;
            console.log("ffff: "+images[0].size);
            for(let i = 0; i < images.length; i++) {
                var obj = images[i];
            
                console.log(obj.filename);
            
           //  for (let image of images){
            connection.query("INSERT INTO `car_images` ( IMAGE_URL,REF_APP_ID) VALUES ( ?, ?)", ["http://localhost:3000/"+obj.filename , result.insertId ], function(err, result) {
                if (err) {
                    res.status(500);
                    return next(err);
                }
                else{
                //res.json({msg:"added"});
                //var msg = "added";
                //return msg;
                msg = msg+"ccc";
                if(i == images.length - 1)
                {
                    console.log(i +"iamge lenghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ");
                res.status(200).json({ result:result})
            }
                //console.log(message);
                }
        
            });
            } 
        }
    
        });

           // let path = `/images/${req.file.filename}`;
           let path = "/test/";
           message = 'image upload succeffly';
         //  res.status(200).json({message: message})
            
        }
        else res.send("some error occur on the server!") //if name 
    }
    

})
})


router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
})



module.exports = router;
