/**
 * THIS IS THE CLASSROOM MODEL FILE
 */

const mysqlConnection = require('./connection');

module.exports.save = (obj) => {
    mysqlConnection.query('INSERT INTO Class SET ?', obj);
    return true;
};

module.exports.update = (obj, classroomId) => {
    // Execute and Update Classroom Details
    try {
        mysqlConnection.query("UPDATE Class SET ? WHERE id = ?", [
            obj,
            classroomId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};


module.exports.findById = async (id) => {
    try {
        const sql = `SELECT
                        Class.id AS id,
                        Class.name AS name,
                        Class.description AS description,
                        Class.photo AS photo,
                        Class.year AS year,
                        Teachers.id AS teacher_id,
                        CONCAT (Teachers.firstname, ' ', Teachers.lastname) AS teachername
                        FROM Class
                        INNER JOIN Teachers ON Class.teacher_id = Teachers.id
                        WHERE Class.id = ? AND Class.status = 1
                    `;
        const rows = await mysqlConnection.query(sql, id);
        return rows[0];
    } catch (error) {
        console.error(error);
    }

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