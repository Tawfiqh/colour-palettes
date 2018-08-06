const sqlite3 = require('sqlite3');


class DbObject {

  // get db() {
  //   this.db;
  // }

  constructor(dbAddress) {
      this.dbAddress = dbAddress;

      this.start(this.db);

      var callbackDb = this.db;

      this.db.serialize(function() {
        // callbackDb.run("CREATE TABLE IF NOT EXISTS images (id TEXT, userId INTEGER, timestamp TEXT)");
        callbackDb.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, image BLOB, filename TEXT, swatch TEXT, timestamp TEXT)");

      });

      this.close();
      return this;
  }

  start(){
    if (!this.dbAddress){
      throw Error("No database address set");
    }
    // console.log(">>>>>>>Opening connecting to db: "+this.dbAddress);
    this.db = new sqlite3.Database(this.dbAddress);
  }

  close(){
    // console.log(">>>>>>>Closing connecting to db: "+this.dbAddress);
    this.db.close();
  }

  all(query, variables, callback){
    this.log(query, variables);
    this.db.all(query, variables, callback);
  }

  run(query, variables, callback){
    this.log(query, variables);
    this.db.run(query, variables, callback);
  }

  log(query, variables){
    console.log("+db-query :" + query.replace(/\n/g, " ").replace(/  /g," ").substring(0,103) +", variables" );
  }

  parallelize(...args){
    this.db.parallelize(...args);
  }

};

module.exports = DbObject;
