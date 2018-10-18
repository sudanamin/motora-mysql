var express = require('express');

var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}


//var Promise = require('bluebird');
const {Storage} = require('@google-cloud/storage');

//var GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));

var storage = new Storage ({
  projectId: 'bookshelf-219806' ,
  keyFilename: 'keyfile.json'
  
})

var BUCKET_NAME = 'bookshelf-219806'
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket
var myBucket = storage.bucket(BUCKET_NAME)

// check if a file exists in bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/file?method=exists
/* var file = myBucket.file('myImage.png')
file.existsAsync()
  .then(exists => {
    if (exists) {
      // file exists in bucket
    }
  })
  .catch(err => {
     return err
  }) */
    
    
// upload file to bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket?method=upload
let localFileLocation = './public/images/ze.png'
myBucket.upload(localFileLocation, { public: true })
  .then(file => {
    // file saved
       console.log(getPublicThumbnailUrlForItem("ze.png"));

  })
    
// get public url for file
var getPublicThumbnailUrlForItem = file_name => {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${file_name}`
}