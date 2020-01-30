const mysqlConnection = require('./connection');

module.exports.save = function (obj) {
    // Execute to Save teacher to the DB
    mysqlConnection.query('INSERT INTO Parents SET ?', obj);
    return true;
};


module.exports.getAll = async function (limit) {
    const rows = await mysqlConnection.query('SELECT * FROM Parents WHERE status = 1 ORDER BY ID DESC LIMIT ' + limit);
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
    const rows = await mysqlConnection.query('SELECT id, firstname, lastname, password FROM Parents WHERE email = ? LIMIT 1', email);
    return rows[0];
}


module.exports.findById = async (id) => {
    const rows = await mysqlConnection.query("SELECT * FROM Parents WHERE id = ?", id);
    return rows[0];
}


// Execute and Update Details Parent to the DB
module.exports.update = (obj, parentId) => {
    try {
        mysqlConnection.query("UPDATE Parents SET ? WHERE id = ?", [
            obj,
            parentId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};

//
module.exports.updateStatus = async (status, parentId) => {
    try {
        await mysqlConnection.query(`UPDATE Parents SET status = ? WHERE id = ?`, [
            status,
            parentId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};