const mysqlConnection = require("./connection");


// Get the Student Result Sheet
module.exports.getResultByStudentId = async studentId => {
    const foundResultSheet = await mysqlConnection.query(
        "SELECT * FROM Results WHERE status = 1 AND student_id = ? ORDER BY id DESC",
        studentId
    );
    return foundResultSheet;
};

// Get a single result by ID
module.exports.getResultById = async resultId => {
    const foundResult = await mysqlConnection.query(
        "SELECT * FROM Results WHERE status = 1 AND id = ? LIMIT 1",
        resultId
    );
    return foundResult[0];
};



module.exports.save = (obj, studentId) => {
    try {
        mysqlConnection.query("INSERT INTO Results SET ?", [obj]);
        return true;
    } catch (error) {
        console.error(error);
    }
};


module.exports.update = (obj, resultId) => {
    try {
        mysqlConnection.query("UPDATE Results SET ? WHERE id = ? ", [obj, resultId]);
        return true;
    } catch (error) {
        console.error(error);
    }
}


module.exports.delete = (resultId) => {
    try {
        mysqlConnection.query("DELETE FROM Results WHERE id = ? ", resultId);
        return true;
    } catch (error) {
        console.error(error);
    }
}