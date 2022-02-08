const Classroom = require('../models/Classroom');
const Teachers = require('../models/Teachers');
const teachersController = require('../controllers/teachersController');

const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid/v4");

const {
    validationResult
} = require("express-validator");


// Show the add classroom form
module.exports.showAddForm = (req, res) => {
    // Get all teacher (Id, firstname, lastname);
    teachersController.getTeachersID().then(teachers => {
        // Render the teacher list to the add clssrom form
        res.render("teacher/add-class", {
            pageTitle: "Add a Classroom | Treasure Crest Integrated School",
            teachers: teachers
        });
    });
};


// Get Classroom  Id and name
module.exports.getAllClassroomID = async (req, res) => {
    const classroomID = await Classroom.getAllClassID();
    return classroomID;
};


module.exports.getClassById = async (id) => {
    const foundClassroom = await Classroom.findById(id);
    return foundClassroom[0];
}


module.exports.listAll = (req, res) => {
    // Fetch Classroom List
    Classroom.getAll().then(foundClassrooms => {
        // Display Record
        res.render("teacher/all-class", {
            pageTitle: "All Classroom List | Treasure Crest Integrated School",
            classrooms: foundClassrooms
        });
    });
}


module.exports.save = (req, res) => {
    // Pass classroom Object to DB
    const addClassrom = Classroom.save(req.body);
    if (addClassrom === true) {
        req.flash('success', "New Class added!");
        return res.redirect('../teachers/add-class');
    }
};



module.exports.update = async (req, res) => {

    //  Get Classroom id
    const classroomId = req.params.id;

    //  Check if there is an error!
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        //  Check if the Classroom is okay
        if (classroomId && classroomId > 0) {
            const foundClassroom = await Classroom.findById(classroomId);
            const teachers = await Teachers.getTeachersID();

            //  Check if any parent was found!
            if (Object.keys(foundClassroom).length > 0) {
                res.render("teacher/edit-class", {
                    pageTitle: "Edit Classroom | Treasure Crest Integrated School",
                    classroom: foundClassroom,
                    teachers: teachers
                });
                return;
            } else {
                req.flash("error", "No record found!");
                return res.redirect("../all-class");
            }
        } else {
            req.flash("error", "That Parent does not exist!");
            return res.redirect("../all-class");
        }
    } else {

        if (Classroom.update(req.body, classroomId) === true) {
            req.flash(
                "success",
                `Class Details updated!  Check <a href='/teachers/view-class/${classroomId}'>Class</a> here`
            );
            return res.redirect("back");
        }

    }
};


// View Student Details
module.exports.viewClass = async (req, res, next) => {

    // Get the Parent ID
    const classroomID = req.params.id;

    // Check if the Class ID is Okay
    if (classroomID && classroomID > 0) {
        const foundClassroom = await Classroom.findById(classroomID);

        //  Check if any parent was found!
        if (Object.keys(foundClassroom).length > 0) {
            res.render("teacher/view-class", {
                pageTitle: ` ${foundClassroom.name} Classroom | Treasure Crest Integrated School`,
                classroom: foundClassroom
            });
        } else {
            req.flash("error", "No record found!");
            return res.redirect("../all-class");
        }
    }
};


// Render the edit-Classroom form
module.exports.renderEditForm = async (req, res, next) => {

    // Get the Parent ID
    const classroomID = req.params.id;

    // Check if Parent ID is okay
    if (classroomID && classroomID > 0) {
        const foundClassroom = await Classroom.findById(classroomID);
        const teachers = await Teachers.getTeachersID();

        //  Check if any parent was found!
        if (Object.keys(foundClassroom).length > 0) {
            res.render("teacher/edit-class", {
                pageTitle: "Edit Classroom | Treasure Crest Integrated School",
                classroom: foundClassroom,
                teachers: teachers
            });
        } else {
            req.flash("error", "No record found!");
            return res.redirect("../all-class");
        }
    } else {
        req.flash("error", "That Parent does not exist!");
        return res.redirect("../all-class");
    }
};


// Delete Class
module.exports.delete = async (req, res, next) => {
    //  Get the Post Id
    const classroomId = req.params.id;

    // Delete Class
    const delClass = await Classroom.delete(classroomId);

    if (delClass === true) {
        req.flash("success", `Classroom was Deleted successfully!`);
        return res.redirect("back");
    }
};