require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_MYSQL_USER,
    password: process.env.DEV_MYSQL_PASSWORD,
    database: process.env.DEV_MYSQL_DB,
    host: process.env.DEV_MYSQL_HOST,
    dialect: "mysql",
    logging: false
  },

  staging: {
    username: process.env.STAGING_MYSQL_USER,
    password: process.env.STAGING_MYSQL_PASSWORD,
    database: process.env.STAGING_MYSQL_DB,
    host: process.env.STAGING_MYSQL_HOST,
    dialect: "mysql",
    logging: false
  },

  production: {
    username: process.env.PROD_MYSQL_USER,
    password: process.env.PROD_MYSQL_PASSWORD,
    database: process.env.PROD_MYSQL_DB,
    host: process.env.PROD_MYSQL_USER,
    dialect: "mysql",
    logging: false
  }
};