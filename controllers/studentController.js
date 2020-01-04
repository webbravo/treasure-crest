const Student = require("../models/Students");
const classController = require("../controllers/classController");
const parentController = require("../controllers/parentsController");
const resultController = require("../controllers/resultController");

const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid/v4");

const {
    validationResult
} = require("express-validator");

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

// Resize student photo to width of 800px
module.exports.resize = async (req, res, next) => {
    // Check if there is no new file to resize
    if (!req.file) {
        next();
        return;
    }

    const extension = req.file.mimetype.split("/")[1];
    req.body.photo = `${uuid()}.${extension}`;

    // Now we Resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/students/${req.body.photo}`);

    // Once uploaded file to file system keep going;
    req.body.photo = `/uploads/students/${req.body.photo}`;
    next();
};

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
        });
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
                    errors: errors.errors
                });
            });
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
        } = req.body;

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
                    res.render("teacher/add-student", {
                        pageTitle: "Add a Student | Treasure Crest Integrated School",
                        classrooms: foundClassroom,
                        parents: foundParent,
                        formData: req.body,
                        duplicateError: "Student Record Already Exist, Check  <a href='/all-students'>Student list</a> here"
                    });
                });
            });
        } else {
            // Check if the Parent 2 has value
            if (!req.body.parent_2) delete req.body.parent_2;

            // Pass Student Object to DB
            if (Student.save(req.body) === true) {
                req.flash(
                    "success",
                    `New Student added!  Check <a href='/teachers/all-students'>Student list</a> here`
                );
                return res.redirect("../teachers/add-students");
            }
        }
    }
};

//  Get the List of all students
module.exports.listAll = async (req, res) => {
    // Fetch Parent List
    Student.getAll().then(foundStudents => {
        res.render("teacher/all-student", {
            pageTitle: "All Student List | Treasure Crest Integrated School",
            students: foundStudents
        });

    });
};

// View Student Details
module.exports.viewStudent = async (req, res, next) => {
    // TODO: De-cluster this Method into (Fetch std info and Render view)

    // TODO: Sanitize AND Validate Query Strings (isNumeric)
    const params = req.query;

    // Check if param is Ok
    if (params.stud_id && params.class_id && params.parent_1) {
        // Get the student
        const student = await Student.getStudentById(params.stud_id);

        // Get the First Parent
        const parent_1 = await parentController.getParentById(params.parent_1);

        // Get the classroom the child belongs to
        const classroom = await classController.getClassById(params.class_id);

        // Get the Second Parent (optional)
        let parent_2;
        if (params.parent_2) {
            parent_2 = await parentController.getParentById(params.parent_2);
        }

        // Render the student view
        res.render("teacher/view-student", {
            pageTitle: `${student.firstname} ${student.lastname} Student Info | Treasure Crest Integrated School`,
            parent1: parent_1,
            parent2: parent_2 || "No record",
            student: student,
            classroom: classroom
        });
    } else {
        req.flash("error", "That Student does not exist!");
        return res.redirect("../teachers/all-students");
    }
};

// Render the edit-student form
module.exports.renderEditForm = async (req, res, next) => {
    // Get the Student ID
    // TODO: Sanitize AND Validate Query Strings (isNumeric)
    const student_id = req.params.id;

    // Check if Student ID is okay
    if (student_id && student_id > 0) {
        const foundStudent = await Student.getStudentById(student_id);

        // Get All classroom the child belongs to
        const classrooms = await classController.getAllClassroomID();

        // Get all the Parent
        const foundParents = await parentController.getAllParentsID();

        //  Check if any student was found!
        if (Object.keys(foundStudent).length > 0) {
            res.render("teacher/edit-student", {
                pageTitle: "Edit Student | Treasure Crest Integrated School",
                student: foundStudent,
                parents: foundParents,
                classrooms: classrooms
            });
        } else {
            req.flash("error", "No record found!");
            return res.redirect("../all-students");
        }
    } else {
        req.flash("error", "That Student does not exist!");
        return res.redirect("../all-students");
    }
};

// Update a student record
module.exports.update = async (req, res, next) => {

    //  Student id
    const studentId = req.params.id;

    //  Check if there is an error!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const foundClassroom = await classController.getAllClassroomID();
        const foundParent = await parentController.getAllParentsID();

        // Re-Render the add a student form
        res.render("teacher/edit-student", {
            pageTitle: "Edit a Student | Treasure Crest Integrated School",
            classrooms: foundClassroom,
            parents: foundParent,
            formData: req.body,
            errors: errors.errors
        });

        return;
    } else {
        // Check if the Parent 2 has value
        if (!req.body.parent_2) delete req.body.parent_2;

        // Pass Student Object to DB
        if (Student.update(req.body, studentId) === true) {
            req.flash(
                "success",
                `Student Details updated!  Check <a href='/teachers/view-student?stud_id=${studentId}&parent_1=${req.body.parent_1}&parent_2=${req.body.parent_2}&class_id=${req.body.class_id}'>Student</a> here`
            );
            return res.redirect("back");

        }
    }
};

module.exports.delete = async (req, res, next) => {
    /**
     * WARNING: This method do not delete the student record,
     *  It only Update it visibility Status.
     */

    // Get the student ID
    const studentId = req.params.id;
    const status = 2;

    // Check if student ID is Ok
    if (studentId && studentId > 0) {
        const result = await Student.updateStatus(status, studentId);
        if (result === true) {
            req.flash("success", "Student record has been deleted!");
            return res.redirect("back");
        } else {
            req.flash("error", "ERROR, Could not delete student record!");
            return res.redirect("back");
        }
    } else {
        req.flash("error", "Can not delete a student record that does not Exist!");
        return res.redirect("../teachers/all-students");
    }
};