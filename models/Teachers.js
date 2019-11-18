const mysqlConnection = require('../models/connection');

module.exports.save = function (obj) {

    // Execute to Save teacher to the DB
    mysqlConnection.query('INSERT INTO Teachers SET ?', obj);
    return true;

};


module.exports.findByEmail = async function (email) {
    let results = [];
    const rows = await mysqlConnection.query('SELECT id, firstname, lastname, password, is_admin FROM Teachers WHERE email = ?', email);
    // do something with result
    Object.keys(rows).forEach(function (key) {
        results = rows[key];
    });
    return results;
}


module.exports.findById = function (id) {
    //  Get a teacher by ID
}

module.exports.getTeachersID = async function () {
    const rows = await mysqlConnection.query('SELECT id, firstname, lastname FROM Teachers');
    return rows;
}