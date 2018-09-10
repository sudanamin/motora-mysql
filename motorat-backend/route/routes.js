

const express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
var url = require('url');

var hostName = "http://localhost:3000/";

//app.use(express.static(__dirname ));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "montana",
    database: "cars",
    port: "3306"
});
router.get('/cars', (req, res, next) => {

    var whereClause = "WHERE 1 = 1 ";

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    var color = req.query.color;
    var model = req.query.model;
    //var color = req.params.color;
    console.log('color is :' + color);

    if (color != null) {
        whereClause += "AND color LIKE '" + color + "'";
        console.log('color is :' + color);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('color is :' + color);

    if (model != null) {
        whereClause += "AND model LIKE '" + model + "'";
        console.log('model is :' + model);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('model  is :' + model);
    /*  if(price != null)
       {
         whereClause += "AND price = '%price%'"
        } */


    connection.query("SELECT * FROM `cars_table` " + whereClause, function (err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.send(cars);
            console.log("cars  tttable :  " + cars)
        }

    });
})

/*router.get('/carsimgs', (req, res, next) => {

    var whereClause = "WHERE 1 = 1 ";

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    var color = req.query.color;
    var model = req.query.model;
    //var color = req.params.color;
    console.log('color is :' + color);

    if (color != null) {
        whereClause += "AND color LIKE '" + color + "'";
        console.log('cccccccccccc is :' + color);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('ddddddddddd is :' + color);

    if (model != null) {
        whereClause += "AND model LIKE '" + model + "'";
        console.log('mmmmmmmmmm is :' + model);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('lllllllllll is :' + model);
    /*  if(price != null)
       {
         whereClause += "AND price = '%price%'"
        } */

/*
    connection.query("SELECT * FROM `car_images` " + whereClause, function (err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.send(cars);
            console.log(cars)
        }

    });
})*/

router.post('/car', (req, res, next) => {

    model = req.body.model;
    color = req.body.color;
    console.log(model + "  :" + "color" + color)

    connection.query("INSERT INTO `cars_table` (MODEL, COLOR) VALUES (?, ?)", [model, color], function (err) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.json({ msg: "added" });
            console.log("added")
        }

    });

})

router.put('/car/:id', (req, res, next) => {

    car_id = req.params.id;
    model = req.body.model;
    color = req.body.color;

    connection.query("UPDATE `cars_table` SET MODEL=?, COLOR=? WHERE APPLICATION_ID=? ", [model, color, car_id], function (err, result) {   //to do AND author_id=?
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.json(result);
            console.log("updated")
        }

    });


})


/* router.post('/updateCar' */

router.delete('/car/:id', (req, res, next) => {

    car_id = req.params.id;


    connection.query("DELETE FROM `car_images` WHERE REF_app_ID=?", [car_id], function (err, result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            // res.json(result);
            console.log("delete complete for car_images table for car id : " + car_id);
            connection.query("DELETE FROM `cars_table` WHERE APPLICATION_ID=?", [car_id], function (err, result) {
                if (err) {
                    res.status(500);
                    return next(err);
                }
                else {
                    res.json(result);
                    console.log("delete complete for cars_table car id : " + car_id);
                }

            });
        }

    });


})

router.delete('/image/:imageName', (req, res, next) => {

    image_name = req.params.imageName;
    image_url1 = hostName+image_name;
    image_url2 = image_url1.replace("_thumb", "");
    console.log('image to delte is '+image_url1)


    connection.query("DELETE  FROM `car_images` WHERE IMAGE_URL=? or IMAGE_URL=?", [image_url1,image_url2], function (err, result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            // res.json(result);
            console.log("delete complete for car_images table for image id : " + image_url1);
            res.json(result);
           /*  connection.query("DELETE FROM `cars_table` WHERE APPLICATION_ID=?", [image_id], function (err, result) {
                if (err) {
                    res.status(500);
                    return next(err);
                }
                else {
                    res.json(result);
                    console.log("delete complete for cars_table car id : " + car_id);
                }

            }); */
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
        //cb(null, Date.now() + "_" + file.originalname);
        cb(null,  file.originalname);
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

    { name: 'city' },
    { name: 'manufacturer' },
    { name: 'price' },
    { name: 'year' },

    { name: 'kilometers' },
    { name: 'model' },
    { name: 'specs' },
    { name: 'cylinders' },
    
    { name: 'warranty' },
    { name: 'color' },
    { name: 'transmission' },
    { name: 'phone' },
    
    { name: 'description' },
    { name: 'uid' },
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
function roughScale(x, base) {
    var parsed = parseInt(x, base);
    if (isNaN(parsed)) { return 0 }
    return parsed ;
  }
router.post('/setimg/:app_id', (req, res, next) => {

    console.log('  this is app id'+req.params.app_id )
    var msg = "aa";
    upload(req, res, function (err) {





        //var name =JSON.parse(JSON.stringify(req.files));



        if (err) {

            res.status(400).json({ message: err.message })

        } else {

            // console.log("origana name :"+req.files[0].originalname);
            //var name = req.files;
            console.log("description is  "+req.body.description);
            // console.log("name of req.files: "+ req.files[0].originalname );
            if (  req.body.model !==  undefined ) {
               // console.log("json object " + name.image[0].path);
               console.log("set image req.body.color 2: "+req.body.color);
                //price =0;
               // price = Number(req.body.price);
                price = roughScale(req.body.price,10);
                model = req.body.model; 

                
                year = roughScale(req.body.year,10);
                manufacturer = req.body.manufacturer;
                //kilometers =0;
               // kilometers = Number(req.body.kilometers);
                kilometers = roughScale(req.body.kilometers,10);
                uid = req.body.uid;
                city = roughScale(req.body.city,10);
               // city = Number(req.body.city);
                description = req.body.description;
                ddate = Date.now();
                //waranty =0;
               // waranty = Number(req.body.waranty);
                warranty = roughScale(req.body.warranty,10);
                phone = roughScale(req.body.phone,10);
              
                color = req.body.color;

                cylinders =  roughScale(req.body.cylinders,10);

                
                transmission = roughScale(req.body.transmission,10);
                specs =  roughScale(req.body.specs,10);

                console.log('user manufacturer is AAAAAAAAAA : '+manufacturer);
                console.log('user model is : '+model);
                console.log('user city is : '+city);
                console.log('user id is : '+uid);
                console.log('user waranty is : '+warranty);
                console.log('user kilometers is : '+kilometers);
                console.log('user phone is : '+phone);
                
              /*   (1992-02-02 select cars.MANUFACTURE.MANUFACTURE_ID from cars.MANUFACTURE where MANUFACTURE_NAME = ? ) */
                console.log(model + "  :" + "color" + req.body.color);
              /*   connection.query(`INSERT INTO cars.cars_table (PRICE,MODEL,YEAR,MANUFACTURE,MILES,USER_ID,EMIRATE,DETAILS,DDATE,WARANTY,PHONE,COLOR) VALUES (? ,
                    (select cars.cars_models.MODEL_ID from cars.cars_models where MODEL_NAME = ? ),
                    ?,?,
                    
                    ?,?,?,?,?,?,?,
                    (select cars.colors.COLOR_ID from cars.colors where COLOR_NAME = ? ))` */
                    if(req.params.app_id == 0)        //new insertion 
                    {
                    connection.query(`INSERT INTO cars.cars_table (PRICE,MODEL,YEAR,MANUFACTURE,MILES,USER_ID,
                        EMIRATE,DETAILS,DDATE,WARANTY,PHONE,COLOR, CYLINDERS ,SPECS, TRANSMISSION) VALUES (? ,
                        (select cars.cars_models.MODEL_ID from cars.cars_models where MODEL_NAME = ? ),
                        ?,(select cars.MANUFACTURE.MANUFACTURE_ID from cars.MANUFACTURE where MANUFACTURE_NAME = ? )
                        ,
                        ?,?,?,?,NOW(),?,?,
                        (select cars.colors.COLOR_ID from cars.colors where COLOR_NAME = ? ),?,?,?)`
                     , [price,model,year,manufacturer, kilometers, uid,city,description , /*ddate,*/warranty, phone ,color,cylinders,specs,transmission], function (err, result) { 
                  /*   , [model/* , uid, city?,ddate  ,color] , function (err, result) {*/
                    if (err) {
                        res.status(500);
                        return next(err);
                    }
                    else {   if(  req.files.image !== undefined  ) {
                        //res.json({msg:"added"});
                        //req.files.image[0].filename
                        console.log("added")
                        console.log("origana name :" + JSON.stringify(req.files));
                        var images = req.files.image;
                       // console.log("ffff: " + images[0].size);
                        for (let i = 0; i < images.length; i++) {
                            var obj = images[i];

                            console.log(obj.filename);

                            //  for (let image of images){
                            connection.query("INSERT INTO `car_images` ( IMAGE_URL,REF_APP_ID) VALUES ( ?, ?)", [hostName + obj.filename, result.insertId], function (err, result) {
                                if (err) {
                                    res.status(500);
                                    return next(err);
                                }
                                else {
                                    //res.json({msg:"added"});
                                    //var msg = "added";
                                    //return msg;
                                    msg = msg + "ccc";
                                    if (i == images.length - 1) {
                                        console.log(i + "iamge lenghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ");
                                        res.status(200).json({ result: result })
                                    }
                                    //console.log(message);
                                }

                            });
                        }
                      }
                      else{res.status(200).json({ result: result })}
                  }

                });
            }else          //update not new car
            {
                connection.query(`UPDATE  cars.cars_table set PRICE = ? ,
                MODEL =(select cars.cars_models.MODEL_ID from cars.cars_models where MODEL_NAME = ? ),YEAR = ? ,
                MANUFACTURE = (select cars.MANUFACTURE.MANUFACTURE_ID from cars.MANUFACTURE where MANUFACTURE_NAME = ? ) ,MILES = ? ,USER_ID = ? ,
                    EMIRATE = ? ,DETAILS = ? ,DDATE = NOW() ,WARANTY = ? ,PHONE = ? ,TRANSMISSION = ?,
                    COLOR = ?, CYLINDERS = ? ,SPECS = ? where APPLICATION_ID =?`
                 , [price,model,year,manufacturer, kilometers, uid,city,description , /*ddate,*/warranty, phone ,transmission,color,cylinders,specs,req.params.app_id], function (err, result) { 
              /*   , [model/* , uid, city?,ddate  ,color] , function (err, result) {*/
                if (err) {
                    res.status(500);
                    return next(err);
                }
                else {   if(  req.files.image !== undefined  ) {
                    //res.json({msg:"added"});
                    //req.files.image[0].filename
                    console.log("added")
                    console.log("origana name :" + JSON.stringify(req.files));
                    var images = req.files.image;
                   // console.log("ffff: " + images[0].size);
                    for (let i = 0; i < images.length; i++) {
                        var obj = images[i];

                        console.log(obj.filename);

                        //  for (let image of images){
                        connection.query("INSERT INTO `car_images` ( IMAGE_URL,REF_APP_ID) VALUES ( ?, ?)", [hostName + obj.filename, req.params.app_id], function (err, result) {
                            if (err) {
                                res.status(500);
                                return next(err);
                            }
                            else {
                                //res.json({msg:"added"});
                                //var msg = "added";
                                //return msg;
                                msg = msg + "ccc";
                                if (i == images.length - 1) {
                                    console.log(i + "iamge lenghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ");
                                    res.status(200).json({ result: result })
                                }
                                //console.log(message);
                            }

                        });
                    }
                  }
                  else{res.status(200).json({ result: result })}
              }

            });
            }

                // let path = `/images/${req.file.filename}`;
                let path = "/test/";
                message = 'image upload succeffly';
                //  res.status(200).json({message: message})

            }
            else res.send("some error occur on the server!!") //if name 
        }


    })
})


/*router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

    res.writeHead(200, { 'Content-Type': mime })
    res.end(image, 'binary')
})*/


router.get('/cimages', (req, res,next) => {

    //   connection.query("SELECT REF_APP_ID,GROUP_CONCAT(IMAGE_URL) as gofi FROM `car_images` GROUP BY REF_APP_ID;", function(err, cars) {
        //var whereClause = "WHERE `IMAGE_URL` LIKE '%%' "; 
        var whereClause = "WHERE 1 = 1 "; 
       
        /* var url_parts = url.parse(req.url, true);
        var query = url_parts.query; */
    
    
        var color = req.query.color;
        var model = req.query.model;
        var userId = req.query.userID;
        console.log('modle and color to search:'+model +"  color: "+color+" user id"+userId) ;
        //var color = req.params.color;
      //  console.log('color is :' + color);
    
        if (color != null && color !='') {
            whereClause += " AND color LIKE '" + color + "'";
         //   console.log('color is :' + color);
            //whereClause += "AND description LIKE '%keywords%'"
        }  //console.log('color is :' + color);
    
        if (model != null && model !='') {
            whereClause += " AND model LIKE '" + model + "'";
           // console.log('model is :' + model);
            //whereClause += "AND description LIKE '%keywords%'"
        }  //console.log('modell is :' + model);

        if (userId != null && userId !='') {
            whereClause += " AND USER_ID LIKE '" + userId + "'";
             console.log('user id  is :' + userId);
            //whereClause += "AND description LIKE '%keywords%'"
        }

  /*  connection.query("SELECT cars_table.MODEL ,cars_table.COLOR,USER_ID ,car_images.REF_APP_ID,GROUP_CONCAT(car_images.IMAGE_URL) as gofi from car_images INNER JOIN cars_table ON car_images.REF_APP_ID =cars_table.APPLICATION_ID "+whereClause+" GROUP BY car_images.REF_APP_ID ;", function (err, cars) {
 */
console.log('color and model to search for'+whereClause);
connection.query(`SELECT * FROM  (select REF_APP_ID, GROUP_CONCAT(IMAGE_URL) as gofi from car_images where IMAGE_URL LIKE '%thum%' GROUP BY REF_APP_ID ) as im
right JOIN  cars_table on cars_table.APPLICATION_ID = im.REF_APP_ID   
left join  cars_models  on  MODEL = cars_models.MODEL_ID
left join   manufacture  on  manufacture = manufacture.manufacture_ID
 `+whereClause, function (err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.send(cars);
           // console.log( cars)
        }

    });
})



/* router.get('/carThum', (req, res) => {
    let REF_APP_ID = req.query.REF_APP_ID
    connection.query("SELECT REF_APP_ID,IMAGE_URL FROM `car_images` where REF_APP_ID = ?  && `IMAGE_URL` LIKE '%thum%'", [REF_APP_ID], function (err, cars) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.send(cars);
            console.log(cars)
        }

    });
}) */

module.exports = router;
