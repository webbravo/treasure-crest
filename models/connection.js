 const util = require('util');
 const mysql = require('mysql');

 const connection = () => {

     const connection = mysql.createConnection({
         host: "remotemysql.com",
         user: "tvoXpSQy4q",
         password: "xEWRbca5OT",
         database: "tvoXpSQy4q",
         port: 3306
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