const mysqlConnection = require("./connection");

module.exports.save = obj => {
    // Execute and Save Students to the DB
    try {
        mysqlConnection.query("INSERT INTO Students SET ?", obj);
        return true;
    } catch (error) {
        console.error(error);
    }
};


module.exports.countStudents = async function () {
    const rows = await mysqlConnection.query('SELECT COUNT(*) AS numbers FROM Students');
    return rows[0].numbers;
}



module.exports.update = (obj, studentId) => {
    // Execute and Update Details Students to the DB
    try {
        mysqlConnection.query("UPDATE Students SET ? WHERE id = ?", [
            obj,
            studentId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};

module.exports.isDuplicate = async obj => {
    try {
        const rows = await mysqlConnection.query(
            "SELECT COUNT (*) AS students FROM Students WHERE firstname = ? AND middlename = ? AND lastname = ? AND gender = ? AND dob = ? OR student_id = ? ",
            obj
        );
        if (rows[0].students > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // handle the error
        console.error(error);
    }
};

module.exports.getAll = async () => {
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
                    Parents.phone AS parentPhone,
                    Students.parent_1 as parent_1,
                    Students.parent_2 as parent_2
                    FROM
                    Students
                    INNER JOIN Class ON Students.class_id = Class.id
                    INNER JOIN Parents ON Students.parent_1 = Parents.id
                    WHERE Students.status = 1
                    ORDER BY Students.id DESC LIMIT 20`;

        const rows = await mysqlConnection.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
    }
};

module.exports.getStudentById = async studentId => {
    const foundStudent = await mysqlConnection.query(
        "SELECT * FROM Students WHERE status = 1 AND id = ?",
        studentId
    );
    return foundStudent[0];
};




module.exports.getStudentByParentId = async parentId => {
    const foundStudents = await mysqlConnection.query(`SELECT * FROM Students WHERE status = 1 AND parent_1 = ${parentId} OR parent_2 = ${parentId}`);
    return foundStudents;
};

module.exports.updateStatus = async (status, studentId) => {
    try {
        await mysqlConnection.query(`UPDATE Students SET status = ? WHERE id = ?`, [
            status,
            studentId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};



// module.exports.getStudentFullDetails = async studentId => {
//     try {
//         const sql = `SELECT
//                     Students.*,
//                     Class.id AS class_id,
//                     Class.name AS classname,
//                     CONCAT(Parents.firstname, ' ', Parents.lastname) as parentName,
//                     Parents.phone AS parentPhone,
//                     Students.parent_1 as parent_1,
//                     Students.parent_2 as parent_2,
//                     FROM
//                     Students
//                     INNER JOIN Class ON Students.class_id = Class.id
//                     INNER JOIN Parents ON Students.parent_1 = Parents.id
//                     INNER JOIN Results ON Students.id = Results.student_id
//                     WHERE

//                     Students.id = ${studentId}
//                     `;

//         const foundStudents = await mysqlConnection.query(sql);
//         return foundStudents[0];
//     } catch (error) {
//         console.error(error);
//     }
// };