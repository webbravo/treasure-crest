const mysqlConnection = require('./connection');

module.exports.save = function (obj) {
    // Execute and Save Students to the DB
    try {
        mysqlConnection.query('INSERT INTO Students SET ?', obj);
        return true;
    } catch (error) {
        console.error(error);
    }

};


module.exports.isDuplicate = async (obj) => {
    try {
        const rows = await mysqlConnection.query('SELECT COUNT (*) AS students FROM Students WHERE firstname = ? AND middlename = ? AND lastname = ? AND gender = ? AND dob = ? OR student_id = ? ', obj);
        if (rows[0].students > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // handle the error
        console.error(error);
    }
}


module.exports.getAll = async function () {
    try {
        const sql = `SELECT
                    Students.id AS id,
                    Students.photo AS photo,
                    CONCAT(Students.firstname, ' ', Students.middlename, ' ', Students.lastname) AS fullname,
                    Students.student_id AS student_id,
                    Students.gender AS gender,
                    Class.id AS class_id,
                    Class.name AS classname,
                    CONCAT(Parents.firstname, ' ', Parents.lastname) as parentName,
                    Parents.phone AS parentPhone
                    FROM
                    Students
                    INNER JOIN Class ON Students.class_id = Class.id
                    INNER JOIN Parents ON Students.parent_1 = Parents.id
                    ORDER BY ID DESC`;

        const rows = await mysqlConnection.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
    }
}