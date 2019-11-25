const mysqlConnection = require('./connection');

module.exports.save = function (obj) {
    // Execute and Save Students to the DB
    console.log(obj)
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