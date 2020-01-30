/**
 * THIS IS THE BLOG POST MODEL FILE
 */

const mysqlConnection = require('./connection');
const h = require("../util/helper");


// Add a new BlogPost
module.exports.save = async (obj) => {
    try {
        mysqlConnection.query('INSERT INTO Blog SET ?', obj);
        return true;
    } catch (error) {
        console.error(error);

    }
};


// Fetch All BlogPost
module.exports.getAll = async () => {
    let rows = await mysqlConnection.query(
        "SELECT * FROM Blog ORDER BY id DESC"
    );
    rows = rows.map(row => ({
        ...row,
        date: h.formatDate(row.date)
    }));
    return rows;
};


// Fetch a Certain Number of BlogPost
module.exports.getPostByNumbers = async (limit) => {
    let rows = await mysqlConnection.query(
        "SELECT * FROM Blog ORDER BY id DESC LIMIT " + limit
    );
    rows = rows.map(row => ({
        ...row,
        date: h.formatDate(row.date, false)
    }));
    return rows;
};


// Get a Single BlogPost
module.exports.getBlogPostById = async postId => {
    let foundPost = await mysqlConnection.query(
        "SELECT * FROM Blog WHERE id = ?",
        postId
    );
    foundPost = foundPost.map(post => ({
        ...post,
        date: h.formatDate(post.date)
    }));
    return foundPost[0];
};


//  Update a BlogPost by Id
module.exports.update = (obj, postId) => {
    try {
        mysqlConnection.query("UPDATE Blog SET ? WHERE id = ?", [
            obj,
            postId
        ]);
        return true;
    } catch (error) {
        console.error(error);
    }
};


// Delete a BlogPost by ID
module.exports.delete = async postId => {
    try {
        mysqlConnection.query("DELETE FROM Blog WHERE id = ? ", postId);
        return true;
    } catch (error) {
        console.error(error);
    }
};