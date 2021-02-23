"use strict";

const Sequelize = require("sequelize");

const env = process.env;

const db = {};
const config = {
  username: env.SQL_DB_USER,
  password: env.SQL_DB_PASSWORD,
  database: env.SQL_DB_NAME,
  host: env.SQL_DB_ADDRESS,
  dialect: "mysql",
  define: {
    // true로 설정하면 쿼리에 default로 createdAt과 updatedAt을 날림
    timestamps: false,
  },
  operatorsAliases: false,
  logging: console.log,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

try {
  sequelize.authenticate();
  console.log("MySQL Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the SQL database:", error);
}

const dbConfig = require("../config/mysql.conf.json");
dbConfig.forEach(({ model, file }) => {
  db[model] = require("./" + file)(sequelize, Sequelize);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
