 const util = require('util');
 const mysql = require('mysql');
 // const createError = require('http-errors');



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
         close() {
             return util.promisify(connection.end).call(connection);
         }
     };
 };

 module.exports = connection();

 //  const result = await mysqlConnection.query('SHOW DATABASES');