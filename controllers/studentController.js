/**
 * TODO LIST
 *  Require model file
 *  Use module.export
 *  Require file module
 *  Create method of student
 *      - Add
 *      - View
 *      - Update
 *      - Delete
 *  Student login method
 *  Display result method
 *  Transactions method
 */

const Student = require("../models/Students");
const classController = require("../controllers/classController");
const parentController = require("../controllers/parentsController");
const bcrypt = require("bcryptjs");

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

            // Delete confirm password from the body Object
            delete req.body.conPassword;

            // Hash Password
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

            // Pass Student Object to DB
            const addStudent = Student.save(req.body);
            if (addStudent === true) {
                req.flash('success', "New Student added!");
                return res.redirect('../teachers/add-students');
            }
        }



    }

};