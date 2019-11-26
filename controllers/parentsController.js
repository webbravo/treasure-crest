const {
    validationResult,
} = require('express-validator');
const Parents = require('../models/Parents');
const bcrypt = require("bcryptjs");



module.exports.listAll = (req, res) => {
    // Fetch Parent List
    Parents.getAll(req.pagination.limit).then(foundParents => {
        res.render("teacher/all-parent", {
            pageTitle: "All Parents List | Treasure Crest Integrated School",
            parents: foundParents
        });
    });
};


// Get All Parents Id and name
module.exports.getAllParentsID = async (req, res) => {
    const parentsID = await Parents.getAllParentsID();
    return parentsID;
};




// Show the add parent form
module.exports.showAddForm = (req, res) => {
    // Render the add a parent form
    res.render("teacher/add-parent", {
        pageTitle: "Add a Parent | Treasure Crest Integrated School"
    });
};

// Add a Parent
module.exports.add = async (req, res) => {

    // TODO: fix validation and redirect with a message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.errors);

        // Render the add a parent form
        res.render("teacher/add-parent", {
            pageTitle: "Add a Parent | Treasure Crest Integrated School",
            formData: req.body,
            error: errors.errors
        });
    } else {

        //Check for Duplicate entries
        const isDuplicate = await Parents.isDuplicate([
            req.body.phone,
            req.body.email
        ]);

        if (isDuplicate === true) {
            // Re-Render the add a parent form
            res.render("teacher/add-parent", {
                pageTitle: "Add a Parent | Treasure Crest Integrated School",
                formData: req.body,
                duplicateError: "Parent Record Already Exist, Check  <a href='/teachers/all-parents'>Student list</a> here"
            });
        } else {
            // Delete confirm password from the body Object
            delete req.body.conPassword;

            // Hash Password
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

            // Pass Parent Object to DB
            const addParent = Parents.save(req.body);
            if (addParent === true) {
                req.flash('success', "New Parent added!");
                return res.redirect('../teachers/add-parents');
            }
        }




    }
};