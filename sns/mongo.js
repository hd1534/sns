var mongoose = require("mongoose");

module.exports.connectMongo = () => {
  env = process.env;
  var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (env.MONGO_DB_PASSWORD || env.MONGO_DB_USER) {
    options.auth = {};
    if (env.MONGO_DB_USER) options.auth.user = env.MONGO_DB_USER;
    if (env.MONGO_DB_PASSWORD) options.auth.password = env.MONGO_DB_PASSWORD;
  }
  if (env.MONGO_DB_NAME) options.dbName = env.MONGO_DB_NAME;

  mongoose.connect(env.MONGO_DB_ADDRESS, options);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("mongodb is connected"); // we're connected!
  });

  return db;
};
