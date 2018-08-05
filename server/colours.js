const average = require('image-average-color');

const fs = require('fs');
const os = require('os');
const path = require('path');


class Colours{


  calculateColour(file){

    const reader = fs.createReadStream(file.path);
    // const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    // reader.pipe(stream);


    var buffers = [];
    reader.on('data', function(buffer) {
      buffers.push(buffer);
    });

    console.log('uploading %s -> %s', file.name, "stream.path");

    return new Promise((resolve, reject) => {

      reader.on('end', function() {
        var buffer = Buffer.concat(buffers);

        average(buffer, (err, color) => {

          if (err) throw err;

          var colorCssString= `rgba(${color})`;

          console.log("Color: rgba("+color+")");
          // var [red, green, blue, alpha] = color;

          resolve(colorCssString);
        });

        // write to file:
        // fs.writeFile('image/' + part.filename, buffer, function(err) {
          // handle error, return response, etc...
        });
      });

  }

}



module.exports = Colours
