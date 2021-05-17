const sql = require('mssql');
const { Connection, Request } = require("tedious");
const dbConfig = require('./config/db.config');

const connection = new Connection(dbConfig);

// Attempt to connect and execute queries if connection goes through
connection.connect(function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("database connected successfully!!!");
  }
});

module.exports = { connection };