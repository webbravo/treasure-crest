 const util = require('util');
 const mysql = require('mysql');

 const connection = () => {

     const connection = mysql.createConnection({
         host: '127.0.0.1',
         port: 3306,
         user: 'root',
         password: 'myschoolcastle#001',
         database: 'treasure_crest',
         timezone: 'local',
         trace: true,
         charset: 'utf8_general_ci'
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