const Student = require("../models/Students");
const classController = require("../controllers/classController");
const parentController = require("../controllers/parentsController");

const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid/v4");


const {
    validationResult,
} = require('express-validator');

// Show the add Student form
module.exports.showAddForm = async (req, res) => {
    // Get All Classroom
    classController.getAllClassroomID().then(foundClassroom => {
        // Get All Parent
        parentController.getAllParentsID().then(foundParent => {
            // Render the add a student form
            res.render("teacher/add-student", {
                pageTitle: "Add a Student | Treasure Crest Integrated School",
                classrooms: foundClassroom,
                parents: foundParent
            });
        })
    });

};


// Add a Students
module.exports.add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //  Re-Render The Add Student form with
        classController.getAllClassroomID().then(foundClassroom => {
            // Get All Parent
            parentController.getAllParentsID().then(foundParent => {
                // Render the add a student form
                res.render("teacher/add-student", {
                    pageTitle: "Add a Student | Treasure Crest Integrated School",
                    classrooms: foundClassroom,
                    parents: foundParent,
                    formData: req.body,
                    error: errors.errors
                });
            })
        });
        return;
    } else {

        //  Get Unique Student ID
        const {
            firstname,
            middlename,
            lastname,
            student_id,
            gender,
            dob
        } = req.body

        // TODO: Check for Duplicate entries
        const isDuplicate = await Student.isDuplicate([
            firstname,
            middlename,
            lastname,
            gender,
            dob,
            student_id
        ]);

        if (isDuplicate === true) {
            //  Re-Render The Add Student form with
            classController.getAllClassroomID().then(foundClassroom => {
                // Get All Parent
                parentController.getAllParentsID().then(foundParent => {
                    // Render the add a student form
                    const message =
                        res.render("teacher/add-student", {
                            pageTitle: "Add a Student | Treasure Crest Integrated School",
                            classrooms: foundClassroom,
                            parents: foundParent,
                            formData: req.body,
                            duplicateError: "Student Record Already Exist, Check  <a href='/all-students'>Student list</a> here"
                        });
                })
            });
        } else {

            // Check if the Parent 2 has value
            if (!req.body.parent_2) delete req.body.parent_2

            // Pass Student Object to DB
            if (Student.save(req.body) === true) {
                req.flash('success', "New Student added!");
                return res.redirect('../teachers/add-students');
            }
        }

    }
};


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, next) {
        const isPhoto = file.mimetype.startsWith("image/");
        if (isPhoto) {
            next(null, true);
        } else {
            next({
                    message: "That filetype isn't allowed"
                },
                false
            );
        }
    }
};

module.exports.upload = multer(multerOptions).single("photo");

module.exports.resize = async (req, res, next) => {

    // Check if there is no new file to resize
    if (!req.file) {
        console.log("No file  Selected")
        next();
        return;
    }

    const extension = req.file.mimetype.split("/")[1];
    req.body.photo = `${uuid()}.${extension}`;

    // Now we Resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(
        `./public/uploads/students/${req.body.photo}`
    );

    // Once uploaded file to file system keep going;
    req.body.photo = `./uploads/students/${req.body.photo}`;
    next();

};