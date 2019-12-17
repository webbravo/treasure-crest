 const util = require('util');
 const mysql = require('mysql');

 const connection = () => {

     const connection = mysql.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USER,
         password: process.env.DB_PASS,
         database: process.env.DB_NAME,
         port: process.env.DB_PORT
     });

     return {
         query(sql, args) {
             return util.promisify(connection.query)
                 .call(connection, sql, args);
         },
         beginTransaction() {
             return util.promisify(connection.beginTransaction)
                 .call(connection);
         },
         commit() {
             return util.promisify(connection.commit)
                 .call(connection);
         },
         rollback() {
             return util.promisify(connection.rollback)
                 .call(connection);
         },
         close() {
             return util.promisify(connection.end).call(connection);
         }
     };
 };

 module.exports = connection();