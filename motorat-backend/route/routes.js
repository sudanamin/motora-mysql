

const express = require('express');
var router = express.Router();
//var mysql = require("mysql");
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
var url = require('url');
require('dotenv').config()


/* var pg = require('pg');
/* var conString = "postgres://postgres:root@localhost:5432/cars";   

 
var connection = new pg.Client(conString);
connection.connect(); */

const { Client } = require('pg');

const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

connection.connect();

//var hostName = "http://localhost:8080/";

//app.use(express.static(__dirname ));

/* var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "montana",
    database: "cars",
    port: "3306"
}); */
router.get('/cars', (req, res, next) => {

    var whereClause = "WHERE 1 = 1 ";

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    var color = req.query.color;
    var model = req.query.model;
    //var color = req.params.color;
    console.log('color is :' + color);

    if (color != null) {
        whereClause += "AND color = '" + color + "'";
        console.log('color is :' + color);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('color is :' + color);

    if (model != null) {
        whereClause += "AND model = '" + model + "'";
        console.log('model is :' + model);
        //whereClause += "AND description LIKE '%keywords%'"
    } else console.log('model  is :' + model);
    /*  if(price != null)
       {
         whereClause += "AND price = '%price%'"
        } */


    connection.query("SELECT * FROM cars_table " + whereClause, function (err, cars) {
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


router.get('/manufacturers', (req, res, next) => {

    connection.query("SELECT MANUFACTURE_NAME FROM manufacture ", function (err, manufactures) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            res.send(manufactures.rows);

        }

    });
})

router.get('/models', (req, res, next) => {

    manufacturer = req.query.manufacturer;
    var whereClause = "WHERE 1 = 1 ";

    if (manufacturer != null && manufacturer != 'All') {
        whereClause += "AND MANUFACTURE_NAME = '" + manufacturer + "'";

    }

    connection.query(`SELECT MODEL_NAME , MANUFACTURE_NAME FROM  cars_models   inner  JOIN  manufacture
     on manufacture_REF = manufacture.MANUFACTURE_ID `+ whereClause, function (err, models) {
            if (err) {
                res.status(500);
                return next(err);
            }
            else {
                res.send(models.rows);
                console.log("models  tttable :  " + models)
            }

        });
})


router.post('/car', (req, res, next) => {

    model = req.body.model;
    color = req.body.color;
    console.log(model + "  :" + "color" + color)

    connection.query("INSERT INTO cars_table (MODEL, COLOR) VALUES ($1, $2)", [model, color], function (err) {
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

    connection.query("UPDATE cars_table SET MODEL=$1, COLOR=$2 WHERE APPLICATION_ID=$3 ", [model, color, car_id], function (err, result) {   //to do AND author_id=?
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


    connection.query("DELETE FROM car_images WHERE REF_app_ID=$1", [car_id], function (err, result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            // res.json(result);
            console.log("delete complete for car_images table for car id : " + car_id);
            connection.query("DELETE FROM cars_table WHERE APPLICATION_ID=$1", [car_id], function (err, result) {
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
    image_url1 =    image_name;
    image_url2 = image_url1.replace("_thumb", "");

    /* fs_url1 = image_url1.replace(hostName, "images\\");
    fs_url2 = image_url2.replace(hostName, "images\\"); */
    fs_url1 = /* "images\\"+ */image_url1
    fs_url2 = /* "images\\"+ */image_url2;

    console.log('image to delte is ' + image_url1)

    fs.unlink(fs_url1, (err) => {
        /*  if (err) throw err; */
        if (err) console.log(err);
        else console.log('path/file.txt was deleted' + fs_url1);
        //res.json(result);

    });

    fs.unlink(fs_url2, (err) => {
        if (err) console.log(err);
        /*  if (err) throw err; */
        else console.log('path/file.txt was deleted');


    });


    connection.query("DELETE  FROM car_images WHERE IMAGE_URL=$1 or IMAGE_URL=$2", [image_url1, image_url2], function (err, result) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {

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
    destination: './images/'
     /*function (req, file, cb) {
        cb(null, './images/')
    }*/,
    filename: function (req, file, cb) {
        //  console.log("amin is :"+file.path);
        // let mime = fileType(file).mime;
        //cb(null, Date.now() + "_" + file.originalname);
        cb(null, file.originalname);


    }
});

var fields = [
    { name: 'image', maxCount: 20 },

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
var upload = multer({ storage: storage, limits: { fileSize: 20000000, files: 20 } }).fields(fields); // var upload = multer({ storage: storage }).array('image');
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
    return parsed;
}
router.post('/setimg/:app_id', (req, res, next) => {

    console.log('  this is app id' + req.params.app_id)
    var msg = "aa";

    String.prototype.contains = function (test) {
        return this.indexOf(test) == -1 ? false : true;
    };



    upload(req, res, function (err) {





        //var name =JSON.parse(JSON.stringify(req.files));



        if (err) {

            res.status(400).json({ message: 'error form mutler' + err.message })
            console.log('error from mutler ' + err);

        } else {

            // console.log("origana name :"+req.files[0].originalname);
            //var name = req.files;
            console.log("description is  " + req.body.description);
            // console.log("name of req.files: "+ req.files[0].originalname );
            if (req.body.model !== undefined) {
                // console.log("json object " + name.image[0].path);
                // console.log("set image req.body.color 2: " + req.body.color);
                //price =0;
                // price = Number(req.body.price);
                price = roughScale(req.body.price, 10);
                model = req.body.model;


                year = roughScale(req.body.year, 10);
                manufacturer = req.body.manufacturer;
                //kilometers =0;
                // kilometers = Number(req.body.kilometers);
                kilometers = roughScale(req.body.kilometers, 10);
                uid = req.body.uid;
                city = roughScale(req.body.city, 10);
                // city = Number(req.body.city);
                description = req.body.description;
                ddate = Date.now();
                //waranty =0;
                // waranty = Number(req.body.waranty);
                warranty = roughScale(req.body.warranty, 10);
                //phone = roughScale(req.body.phone, 10);
                (req.body.phone) ? phone = req.body.phone : phone = '';

                color = req.body.color;

                cylinders = roughScale(req.body.cylinders, 10);


                transmission = roughScale(req.body.transmission, 10);
                specs = roughScale(req.body.specs, 10);

                console.log('user manufacturer is   : ' + manufacturer);
                console.log('user model is : ' + model);
                console.log('user city is : ' + city);
                console.log('user id is : ' + uid);
                console.log('user waranty is : ' + warranty);
                console.log('user kilometers is : ' + kilometers);
                console.log('user phone is : ' + phone);

                /*   (1992-02-02 select cars.MANUFACTURE.MANUFACTURE_ID from cars.MANUFACTURE where MANUFACTURE_NAME = ? ) */
                console.log(" usr color" + req.body.color);
                /*   connection.query(`INSERT INTO cars.cars_table (PRICE,MODEL,YEAR,MANUFACTURE,MILES,USER_ID,EMIRATE,DETAILS,DDATE,WARANTY,PHONE,COLOR) VALUES (? ,
                      (select cars.cars_models.MODEL_ID from cars.cars_models where MODEL_NAME = ? ),
                      ?,?,
                      
                      ?,?,?,?,?,?,?,
                      (select cars.colors.COLOR_ID from cars.colors where COLOR_NAME = ? ))` */
                if (req.params.app_id == 0)        //new insertion 
                {

                    /*  /////////////////////////test isert 1000 values 
                      for(var i = 0;i<=100 ;i++){ */

                    connection.query(`INSERT INTO cars_table (PRICE,MODEL,YEAR,MANUFACTURE,MILES,USER_ID,
                        EMIRATE,DETAILS,DDATE,WARANTY,PHONE,COLOR, CYLINDERS ,SPECS, TRANSMISSION) VALUES ($1,
                        (select cars_models.MODEL_ID from cars_models where MODEL_NAME = $2 ),
                        $3,(select MANUFACTURE.MANUFACTURE_ID from MANUFACTURE where MANUFACTURE_NAME = $4 )
                        ,
                        $5,$6,$7,$8,NOW(),$9,$10,
                        $11,$12,$13,$14) RETURNING application_id`
                        , [price, model, year, manufacturer, kilometers, uid, city, description, /*ddate,*/warranty, phone, color, cylinders, specs, transmission], function (err, result) {
                            /*  /* (select cars.colors.COLOR_ID from cars.colors where COLOR_NAME = ? )   , [model/* , uid, city?,ddate  ,color] , function (err, result) {*/
                            if (err) {
                                res.status(500);
                                //  console.log('amin eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerror while inserting to data base'+err);
                                return next(err);
                            }

                            else {
                                if (req.files.image !== undefined) {
                                    //res.json({msg:"added"});
                                    //req.files.image[0].filename
                                    console.log("added")
                                    console.log("origana name :" + JSON.stringify(req.files));
                                    var images = req.files.image;
                                    // console.log("ffff: " + images[0].size);
                                    for (let i = 0; i < images.length; i++) {
                                        var obj = images[i];

                                        console.log(obj.filename);

                                        var string = obj.filename;
                                        var thumb = string.contains("_thumb_");
                                        console.log('result is : '+JSON.stringify(result));

                                        //  for (let image of images){
                                        connection.query("INSERT INTO car_images ( IMAGE_URL,REF_APP_ID,thumb) VALUES ( $1, $2 ,$3)", [/* hostName + */ obj.filename,  result.rows[0].application_id, thumb], function (err, result) {
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
                                                    //  console.log(i + "iamge lenghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ");
                                                    res.status(200).json({ result: result })
                                                }
                                                //console.log(message);
                                            }

                                        });
                                    }
                                }
                                else { res.status(200).json({ result: result }) }
                            }

                        });
                } else          //update not new car
                {
                    connection.query(`UPDATE  cars_table set PRICE = $1 ,
                MODEL =(select cars_models.MODEL_ID from  cars_models where MODEL_NAME = $2 ),YEAR = $3 ,
                MANUFACTURE = (select MANUFACTURE.MANUFACTURE_ID from MANUFACTURE where MANUFACTURE_NAME = $4 ) ,MILES = $5 ,USER_ID = $6 ,
                    EMIRATE = $7 ,DETAILS = $8 ,DDATE = NOW() ,WARANTY = $9 ,PHONE = $10 ,TRANSMISSION = $11,
                    COLOR = $12, CYLINDERS = $13 ,SPECS = $14 where APPLICATION_ID =$15`
                        , [price, model, year, manufacturer, kilometers, uid, city, description, /*ddate,*/warranty, phone, transmission, color, cylinders, specs, req.params.app_id], function (err, result) {
                            /*   , [model/* , uid, city?,ddate  ,color] , function (err, result) {*/
                            if (err) {

                                res.status(500);

                                return next(err);
                            }
                            else {
                                if (req.files.image !== undefined) {
                                    //res.json({msg:"added"});
                                    //req.files.image[0].filename
                                    console.log("added")
                                    console.log("origana name :" + JSON.stringify(req.files));
                                    var images = req.files.image;
                                    // console.log("ffff: " + images[0].size);
                                    for (let i = 0; i < images.length; i++) {
                                        var obj = images[i];

                                        console.log(obj.filename);

                                        var string = obj.filename;
                                        var thumb = string.contains("_thumb_");

                                        //  for (let image of images){

                                        connection.query("INSERT INTO car_images ( IMAGE_URL,REF_APP_ID,thumb) VALUES ( $1, $2, $3)", [/* hostName + */ obj.filename, req.params.app_id, thumb], function (err, result) {
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
                                else { res.status(200).json({ result: result }) }
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





router.get('/cimages', (req, res, next) => {

    //   connection.query("SELECT REF_APP_ID,GROUP_CONCAT(IMAGE_URL) as gofi FROM `car_images` GROUP BY REF_APP_ID;", function(err, cars) {
    //var whereClause = "WHERE `IMAGE_URL` LIKE '%%' "; 
    var whereClause = "WHERE 1 = 1 ";
    var orderBY = '';

    /* var url_parts = url.parse(req.url, true);
    var query = url_parts.query; */
    var offset;
    if (req.query.offset)
        offset = req.query.offset;
    else offset = '0'
    var sortby = req.query.sortby;
    var userId = req.query.userID;

    var city = req.query.city;
    var manufacturer = req.query.manufacturer;
    var model = req.query.model;
    var color = req.query.color;

    var minYear = req.query.minYear;
    var maxYear = req.query.maxYear;
    var minKilo = req.query.minKilo;
    var maxKilo = req.query.maxKilo;
    var minPrice = req.query.minPrice;
    var maxPrice = req.query.maxPrice;

    var cylinder = req.query.cylinder;
    var specification = req.query.specification;
    var transmission = req.query.transmission;


    //var test = -1;
    console.log('manufacturer:' + manufacturer + "  model: " + model + " user id" + userId);

    if (city != null && city != '' && city != '0') {
        whereClause += " AND EMIRATE = '" + city + "'";
        
    }

    if (manufacturer != null && manufacturer != '') {
        whereClause += " AND MANUFACTURE_NAME = '" + manufacturer + "'";
    }
    /*  if (color != null && color != '' && color != '-1') {
         whereClause += " AND color LIKE '" + color + "'";
         //   console.log('color is :' + color);
         //whereClause += "AND description LIKE '%keywords%'"
     }  //console.log('color is :' + color); */

    if (model != null && model != '' && model != 'undefined') {
        whereClause += " AND model_NAME = '" + model + "'";
        // console.log('model is :' + model);
        //whereClause += "AND description LIKE '%keywords%'"
    }  //console.log('modell is :' + model);

    if (color != null && color != '' && color != '-1') {
        whereClause += " AND COLOR = '" + color + "'";
    }

    if (minYear != null && minYear != '' && minYear != '1990') {
        whereClause += " AND YEAR >= '" + minYear + "'";
    }

    if (maxYear != null && maxYear != '') {
        whereClause += " AND YEAR <= '" + maxYear + "'";
    }

    if (minKilo != null && minKilo != '') {
        whereClause += " AND MILES >= '" + minKilo + "'";
    }

    if (maxKilo != null && maxKilo != '' && maxKilo != '200000') {
        whereClause += " AND MILES <= '" + maxKilo + "'";
    }

    if (minPrice != null && minPrice != '') {
        whereClause += " AND PRICE >= '" + minPrice + "'";
    }

    if (maxPrice != null && maxPrice != '' && maxPrice != '100000') {
        whereClause += " AND PRICE <= '" + maxPrice + "'";
    }

    if (cylinder != null && cylinder != '') {
        whereClause += " AND CYLINDERS = '" + cylinder + "'";
    }

    if (specification != null && specification != '' && specification != '0') {
        whereClause += " AND SPECS = '" + specification + "'";
    }

    if (transmission != null && transmission != '' && transmission != '0') {
        whereClause += " AND TRANSMISSION = '" + transmission + "'";
    }



    if (userId != null && userId != '') {
        whereClause += " AND USER_ID = '" + userId + "'";
    }

    if (sortby != null && sortby != '') {
        switch (sortby) {
            case 'APrice': { orderBY += "  ORDER BY cars_table.price ASC"; break; }
            case 'DPrice': { orderBY += "  ORDER BY cars_table.price DESC"; break; }
            case 'Date': { orderBY += "  ORDER BY cars_table.ddate DESC"; break; }
            default: {
                //statements; 
                break;
            }

        }

    }


    /*  connection.query("SELECT cars_table.MODEL ,cars_table.COLOR,USER_ID ,car_images.REF_APP_ID,GROUP_CONCAT(car_images.IMAGE_URL) as gofi from car_images INNER JOIN cars_table ON car_images.REF_APP_ID =cars_table.APPLICATION_ID "+whereClause+" GROUP BY car_images.REF_APP_ID ;", function (err, cars) {
   */


    console.log('where clause is : ' + whereClause);

    var countt = Array.of(0);

    var queryforCount = `SELECT count(*) as count from (select REF_APP_ID, 
        group_concat(image_url) as gofi FROM car_images 
        where thumb = 'true' GROUP BY REF_APP_ID ) as im
        right JOIN  cars_table on cars_table.APPLICATION_ID = im.REF_APP_ID   
        left join  cars_models  on  MODEL = cars_models.MODEL_ID
        left join   manufacture  on  manufacture = manufacture.manufacture_Id `;

    connection.query(queryforCount, function (err, count) {
        if (err) {
            res.status(500);
            return next(err);
        }
        else {
            // res.send(count);
            countt = Array.of(count.rows[0]);

            var query = `SELECT * FROM  (select REF_APP_ID, group_concat(image_url) as gofi FROM car_images 
            where thumb = 'true' GROUP BY REF_APP_ID ) as im
right JOIN  cars_table on cars_table.APPLICATION_ID = im.REF_APP_ID   
left join  cars_models  on  MODEL = cars_models.MODEL_ID
left join   manufacture  on  manufacture = manufacture.manufacture_Id `+
whereClause+ ' '+orderBY+' limit 100'+' OFFSET '+offset;
           var query =  connection.query(query, function (err, cars) {
                if (err) {
                    res.status(500);

                    return next(err);
                }
                else {

                   // res.send(countt.concat(cars.rows[0]));
                   //res.send(countt.concat(cars.fields[0].name));
                   res.send(countt.concat(cars.rows));
                    // console.log( cars)
                }

            });

             
              
            
            // console.log( cars)
        }

    });




})



module.exports = router;
