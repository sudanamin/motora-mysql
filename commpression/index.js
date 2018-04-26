/* var thumb = require('node-thumbnail').thumb;
 
// thumb(options, callback);
 
thumb({
  source: 'face.jpg', // could be a filename: dest/path/image.jpg
  destination: 'dest/',
  overwrite: true,
}, function(files, err, stdout, stderr) {
  console.log('All done!');
}); */
/* const sharp = require('sharp');
const fs = require('fs');
/*const readStream = fs.createReadStream(path); */ //const readStream = fs.createReadStream("face.jpg");
/*
var writableStream  = fs.createWriteStream("face_3.jpg");

const roundedCorners = new Buffer(
    '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
  );
  
  const roundedCornerResizer =
    sharp()
      .resize(800, null)
     // .overlayWith(roundedCorners, { cutout: true })
      .png();
  
     readStream
    .pipe(roundedCornerResizer)
    .pipe(writableStream); */

     
    var compress_images = require('compress-images');
    
  
        compress_images('src/*.{jpg,JPG,jpeg,JPEG,png}', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                    {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
                                                    {png: {engine: 'pngquant', command: ['--quality=20-50']}}
                                                    , function(){
        });
    