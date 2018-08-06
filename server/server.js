const koaBody = require('koa-body');

const ServerEngine = require('./core/serverEngine');
const serverEngine = new ServerEngine();

const Colour = require('./colours');
const colours = new Colour();

const Database = require('./core/db')

var dbAddress = 'colorSwatches.sqlite3';
var db = new Database(dbAddress);

const fs = require('fs');


function   writeImageWithColour(file, swatch){
  var image = fs.readFileSync(file.path);

  db.start();
  db.run("INSERT INTO images (image, filename, swatch, timestamp) VALUES (?, ?, ?, strftime('%Y-%m-%d %H:%M:%S:%f','now'))", [image, file.name, swatch], function(err) {
      if (err) throw err;
      console.log("inserted into DB!");
  });
  // images (id INTEGER PRIMARY KEY AUTOINCREMENT, image BLOB, swatch TEXT, timestamp TEXT)

  db.close();

}


(function setupFileUploadPost(){
  var app = serverEngine.app;

  app.use(koaBody({ multipart: true }));

  // handle uploads
  app.use(async function(ctx, next) {
    // ignore non-POSTs
    if ('POST' != ctx.method) return await next();


    console.log(ctx.request.files.photos);
    var colorResult = await colours.calculateColour(ctx.request.files.photos);

    var dbResult = await writeImageWithColour(ctx.request.files.photos, colorResult);

    console.log("Got the color");
    console.log(colorResult)
    ctx.body = colorResult;

  });
}());


var server = serverEngine.runServerOnPort(3000);
