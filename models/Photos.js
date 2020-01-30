/**
 * THIS IS PHOTO GALLERY MODEL FILE
 */

const mysqlConnection = require("./connection");
const h = require("../util/helper");

// Add a new Photo
module.exports.add = async obj => {
    try {
        mysqlConnection.query("INSERT INTO Photo_gallery SET ?", obj);
        return true;
    } catch (error) {
        console.error(error);
    }
};

// Fetch All Photos
module.exports.getAll = async () => {
    let rows = await mysqlConnection.query(
        "SELECT * FROM Photo_gallery ORDER BY id DESC"
    );

    rows = rows.map(row => ({
        ...row,
        date: h.formatDate(row.date)
    }));
    return rows;
};

// Delete a Photo by ID
module.exports.delete = async photoId => {
    try {
        mysqlConnection.query("DELETE FROM Photo_gallery WHERE id = ? ", photoId);
        return true;
    } catch (error) {
        console.error(error);
    }
};