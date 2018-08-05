const koaBody = require('koa-body');

const ServerEngine = require('./core/serverEngine');
const serverEngine = new ServerEngine();

const Colour = require('./colours');
const colours = new Colour();


(function setupFileUploadPost(){
  var app = serverEngine.app;

  app.use(koaBody({ multipart: true }));

  // handle uploads
  app.use(async function(ctx, next) {
    // ignore non-POSTs
    if ('POST' != ctx.method) return await next();

    // console.log("Request file:");
    // console.log(JSON.stringify(ctx.request.files.photos), null, 2);

    var colorResult = await colours.calculateColour(ctx.request.files.photos);

    console.log("Got the color");
    console.log(colorResult)
    ctx.body = colorResult;

  });
}());


var server = serverEngine.runServerOnPort(3000);
