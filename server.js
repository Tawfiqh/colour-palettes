const average = require('image-average-color');

const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Koa = require('koa');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = new Koa();

app.use(logger());

app.use(koaBody({ multipart: true }));

// custom 404

app.use(async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/404.html');
});

// serve files from ./public
app.use(serve(path.join(__dirname, '/publicBasic')));

// handle uploads

app.use(async function(ctx, next) {
  // ignore non-POSTs
  if ('POST' != ctx.method) return await next();

  var colourPromise = calculateColour(ctx.request.files.file);

  ctx.body = await colourPromise;

  // ctx.redirect('/');
});

// listen

app.use(router.routes()).use(router.allowedMethods());

app.use(serve('./public'));

app.listen(3000);
console.log('listening on port 3000');




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
