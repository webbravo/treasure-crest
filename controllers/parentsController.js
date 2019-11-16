const {
    validationResult,
} = require('express-validator');
const Parent = require('../models/Parents');


module.exports.listAll = (req, res) => {
    // Fetch Parent List
    const getAll = Parent.getAll(req.pagination.limit).then(foundParents => {
        console.log(foundParents);
        // Display Record
        res.render("teacher/all-parent", {
            pageTitle: "All Parents List | Treasure Crest Integrated School",
            parents: foundParents
        });
        // res.json(foundParents);
    });
}


// Show the add parent form
module.exports.showAddForm = (req, res) => {
    // Render the add a parent form
    res.render("teacher/add-parent", {
        pageTitle: "Add a Parent | Treasure Crest Integrated School"
    });
};

// Add a Parent
module.exports.add = (req, res) => {

    // TODO: fix validation and redirect with a message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        // TODO: DO A PROPER ERROR HANDLING & GIVE
        // errors: [{
        //         value: 'qw',
        //         msg: 'First name too short! ',
        //         param: 'firstname',
        //         location: 'body'
        //     },
        //     {
        //         value: 'qw',
        //         msg: 'Last name too short! ',
        //         param: 'lastname',
        //         location: 'body'
        //     },
        //     {
        //         value: 'qw',
        //         msg: 'Occupation name too short!',
        //         param: 'occupation',
        //         location: 'body'
        //     }
        // ]
        req.flash('error', errors[0].msg)
        return res.redirect('../teachers/add-parents');
    } else {

        // TODO: Check for Duplicate entries

        // Pass teacher Object to DB
        const addParent = Parent.save(req.body);

        if (addParent === true) {
            req.flash('success', "New Parent added!");
            return res.redirect('../teachers/add-parents');
        }

    }
    // res.json(req.body);
};