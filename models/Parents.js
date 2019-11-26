const mysqlConnection = require('./connection');

module.exports.save = function (obj) {
    // Execute to Save teacher to the DB
    mysqlConnection.query('INSERT INTO Parents SET ?', obj);
    return true;
};


module.exports.getAll = async function (limit) {
    const rows = await mysqlConnection.query('SELECT * FROM Parents ORDER BY ID DESC LIMIT ' + limit);
    return rows;
}

module.exports.isDuplicate = async (obj) => {
    console.log(obj)
    try {
        const rows = await mysqlConnection.query('SELECT COUNT (*) AS parents FROM Parents WHERE phone = ? OR email = ?  ', obj);
        if (rows[0].parents > 0)
            return true;
        return false;
    } catch (error) {
        console.error(error);
    }
}


module.exports.getAllParentsID = async () => {
    const rows = await mysqlConnection.query("SELECT id, CONCAT(Parents.firstname, ' ', Parents.lastname) AS name FROM Parents");
    return rows;
};

module.exports.findByEmail = async function (email) {
    let results = [];
    const rows = await mysqlConnection.query('SELECT id, firstname, lastname, password, is_admin FROM Parents WHERE email = ?', email);
    // do something with result
    Object.keys(rows).forEach(function (key) {
        results = rows[key];
    });
    return results;
}


module.exports.findById = function (id) {}