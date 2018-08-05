const logger = require('koa-logger');

const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

class ServerEngine{

  constructor() {

    this.app = new Koa();
    this.router = new Router();

    this.enableCors();
    this.app.use(logger());
    this.setupStaticServeEndpoints();

    return this;

  }




  enableCors(){
    this.app.use(async (ctx, next) => {
      console.log("hi from CORS");
      ctx.set('Access-Control-Allow-Origin', "http://localhost:8080");
      ctx.set('Access-Control-Allow-Credentials', 'true');
      await next();
    });
  }



  setupStaticServeEndpoints(){

    // serve files from ./publicBasic
    this.router.redirect('/basic_upload', '/basic_upload.html');
    this.app.use(serve(path.join(__dirname, '/publicBasic')));


    this.app.use(this.router.routes()).use(this.router.allowedMethods());

    // Load the vue app at root route.
    this.app.use(serve('./public'));

  }


  runServerOnPort(port){

    return this.app.listen({ port: port }, () => {
      console.log(`Server ready at localhost:${port}`);
    });

  }

}



module.exports = ServerEngine;
