const {
    validationResult,
} = require('express-validator');
const Parents = require('../models/Parents');
const Students = require('../models/Students');
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


module.exports.getParentById = async (id) => {
    const foundParent = await Parents.findById(id);
    return foundParent;
};


// module.exports.getStudentByParentId = async (parentsId) => {
//     const foundStudent = await Students.
// }


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
            errors: errors.errors
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
                duplicateError: "Parent Record Already Exist, Check  <a href='/teachers/all-parents'>Parent list</a> here"
            });
        } else {
            // Delete confirm password from the body Object
            delete req.body.conPassword;

            // Hash Password
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

            // Pass Parent Object to DB
            const addParent = Parents.save(req.body);
            if (addParent === true) {
                req.flash("success",
                    `A new Parent Added!  Check <a href='/teachers/all-parents'>Parent</a> here`);
                return res.redirect('/teachers/all-parents');
            }
        }

    }
};

module.exports.view = async (req, res) => {
    const id = req.params.id;
    const foundParent = await Parents.findById(id);
    res.render("teacher/view-parent", {
        pageTitle: "Add a Parent | Treasure Crest Integrated School",
        parent: foundParent
    })
}

// Render the edit-Parent form
module.exports.renderEditForm = async (req, res, next) => {
    // Get the Parent ID
    const parentId = req.params.id;

    // Check if Parent ID is okay
    if (parentId && parentId > 0) {
        const foundParent = await Parents.findById(parentId);

        //  Check if any parent was found!
        if (Object.keys(foundParent).length > 0) {
            res.render("teacher/edit-parent", {
                pageTitle: "Edit Parent | Treasure Crest Integrated School",
                parent: foundParent
            });
        } else {
            req.flash("error", "No record found!");
            return res.redirect("../all-parent");
        }
    } else {
        req.flash("error", "That Parent does not exist!");
        return res.redirect("../all-parent");
    }
};


// Update a Parent record
module.exports.update = async (req, res, next) => {

    const parentId = req.params.id;

    //  Chcek if there is an error!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const foundParent = await Parents.findById(parentId);

        // Re-Render the Edit a Parent form
        res.render("teacher/edit-parent", {
            pageTitle: "Edit a Parent | Treasure Crest Integrated School",
            parent: foundParent,
            errors: errors.errors
        });

        return;
    } else {

        if (req.body.password) {
            // Hash Password
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        }

        // Delete confirm password from the body Object
        delete req.body.conPassword;

        // Pass Parent Object to DB
        if (Parents.update(req.body, parentId) === true) {
            req.flash(
                "success",
                `Parent Details updated!  Check <a href='/teachers/view-parent/${parentId}'>Parent</a> here`
            );
            return res.redirect("back");
        }
    }
};


module.exports.delete = async (req, res, next) => {
    /**
     * WARNING:
     *  This method do not delete the parent record,
     *  It only Update it visibility Status.
     */

    // Get the Parent ID
    const parentId = req.params.id;
    const status = 2;

    // Check if Parent ID is Ok
    if (parentId && parentId > 0) {
        const result = await Parents.updateStatus(status, parentId);
        if (result === true) {
            req.flash("success", "Parent record has been deleted!");
            return res.redirect("back");
        } else {
            req.flash("error", "Could not delete Parent record!");
            return res.redirect("back");
        }
    } else {
        req.flash("error", "Can not delete a Parent record that does not Exist!");
        return res.redirect("../teachers/all-parent");
    }
};