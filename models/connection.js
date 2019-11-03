const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'treasure_crest',
    timezone: 'local',
    trace: true,
    charset: 'utf8_general_ci'
});


connection.connect(err => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);

});


connection.end(err => {
    if (err)
        console.log(`An error occured while closing Mysql ${err}`);
});



module.exports = connection;