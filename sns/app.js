const mongoErr = require("mongoose").Error;

var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");
var bearerToken = require("express-bearer-token");
var path = require("path");

var app = express();

if (process.env.RUNNIG_ENV != "server") {
  var result = require("dotenv").config({ path: "../.env" });
  if (result.error) {
    throw result.error;
  }
  console.log(result.parsed);
} else {
  app.disable("x-powered-by");
}

var mongoDB = require("./mongo").connectMongo();
var sqlDB = require("./models/sql").sequelize;
sqlDB.sync(); // 테이블 확인 후 동기화 (자동 생성)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(logger("dev"));
app.use(cookieParser());
app.use(
  bearerToken({
    bodyKey: false,
    queryKey: false,
    headerKey: "Bearer",
    reqKey: false,
    cookie: false, // by default is disabled
  })
);

// front setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use("/", require("./api/token/token.ctrl").checkAuth);
app.use("/", require("./api"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);

  // instanceof 사용하도록 바꾸기

  // jwt
  if (err.name == "TokenExpiredError") return res.status(401).send(err);
  if (err.name == "JsonWebTokenError") return res.status(401).send(err);
  if (err.name == "NotBeforeError") return res.status(401).send(err);

  // sequelize
  if (err.name == "SequelizeValidationError")
    return res.status(400).send(err.errors.map((err) => err.message));
  if (err.name == "SequelizeDatabaseError")
    return res.status(400).send(err.parent.sqlMessage);
  if (err.name == "SequelizeForeignKeyConstraintError")
    return res
      .status(400)
      .send(err.fields[0].replace("_idx", "") + " is not founded");
  if (err.name == "SequelizeConnectionRefusedError")
    return res.status(500).send("sql server error");

  // mongoose
  if (err instanceof mongoErr) {
    return res.status(400).send(err);
    return res.status(400).send("db error");
  }

  // only provi-ding error in development
  res.status(err.status || 500);
  res.send(req.app.get("env") === "development" ? err : "ERROR");
});

module.exports = app;
