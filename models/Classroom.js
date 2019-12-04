/**
 * THIS IS THE CLASSROOM MODEL FILE
 */

const mysqlConnection = require('./connection');

module.exports.save = (obj) => {
    mysqlConnection.query('INSERT INTO Class SET ?', obj);
    return true;
};


module.exports.findById = async (id) => {
    // TODO: Create a joint Select to fetch teacher's info
    const rows = await mysqlConnection.query('SELECT * FROM Class WHERE id = ?', id);
    return rows;
};

module.exports.getAll = async () => {
    const sql = "SELECT Class.id AS id, Class.photo AS photo, Class.name AS name, Class.year AS year, Class.description AS description, Teachers.firstname AS teacher_firstname, Teachers.lastname AS teacher_lastname FROM Class JOIN Teachers ON Class.teacher_id = Teachers.id ORDER BY Class.id DESC";
    const rows = await mysqlConnection.query(sql);
    return rows;
};

module.exports.getAllClassID = async () => {
    const rows = await mysqlConnection.query('SELECT id, name FROM Class');
    return rows;
};