const connection = require("./pg_connect");
const dotenv = require('dotenv');
dotenv.config();
connection.exec({
    "host": process.env.HOST,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE,
    "acquireTimeout ": 20000
  })