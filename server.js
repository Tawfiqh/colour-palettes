const average = require('image-average-color');

const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Koa = require('koa');
const fs = require('fs');
const os = require('os');
const path = require('path');

const Router = require('koa-router');

const app = new Koa();

router = new Router();

app.use(logger());

app.use(koaBody({ multipart: true }));

// handle uploads
app.use(async function(ctx, next) {
  // ignore non-POSTs
  if ('POST' != ctx.method) return await next();

  var colourPromise = calculateColour(ctx.request.files.file);

  ctx.body = await colourPromise;

  // ctx.redirect('/');
});


setupEndpoints(app, router);

const port = 3000;
var server = app.listen({ port: port }, () => {
  console.log(`Server ready at localhost:${port}`);
});


console.log('listening on port 3000');



//  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//    Setup Endpoints
//  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function setupEndpoints(app, router){

  // custom 404
  app.use(async function(ctx, next) {
    await next();
    if (ctx.body || !ctx.idempotent) return;
    ctx.redirect('/404.html');
  });


  // serve files from ./publicBasic
  router.redirect('/basic_upload', '/basic_upload.html');
  app.use(serve(path.join(__dirname, '/publicBasic')));



  app.use(router.routes()).use(router.allowedMethods());

  // Load the vue app at root route.
  app.use(serve('./public'));


}




//  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//    Colour processing
//  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


function calculateColour(file){

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
