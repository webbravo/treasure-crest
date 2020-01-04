const Results = require("../models/Results");
const Students = require("../models/Students");
const Classroom = require('../models/Classroom');

const path = require("path");



const multer = require("multer");
const {
    validationResult
} = require("express-validator");



const multerOptions = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/results')
        },
        filename: function (req, file, cb) {
            req.body.result = '/uploads/results/' + file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    fileFilter: function (req, file, next) {
        const isPDF = file.mimetype.startsWith("application/");
        if (isPDF) {
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

module.exports.upload = multer(multerOptions).single("result");


module.exports.deleteResult = async (req, res, next) => {
    // Catch result
    const resultId = req.params.resultId;

    //  Delete the Result
    const del = Results.delete(resultId);

    if (del) {
        res.redirect("back");
    }
}


// Render the Add Result Form
module.exports.resultSheet = async (req, res, next) => {

    // Catch the Student id
    const studentId = req.params.studentId;

    //  Get students by Id
    const students = await Students.getStudentById(studentId);

    // Get the all classroom
    const classrooms = await Classroom.getAllClassID();

    //  Get Result usg the student ID
    const results = await Results.getResultByStudentId(studentId)

    res.render("teacher/result-sheet", {
        pageTitle: " Result Sheet | Treasure Crest Integrated School",
        students,
        results,
        classrooms
    });
};


module.exports.addResult = async (req, res, next) => {

    //  Get Student Id
    const studentId = req.params.studentId;

    // Set the Teacher who upload the result
    req.body.added_by = req.session.teacherName.firstname + " " + req.session.teacherName.lastname;

    // Set the Student ID
    req.body.student_id = studentId;

    // Pass Result Object to DB
    if (Results.save(req.body) === true) {
        req.flash(
            "success",
            `Student Result added!  Check <a href='/teachers/result-sheet/${studentId}'>Result Sheet</a> here`
        );
        return res.redirect("back");
    }
}


module.exports.editForm = async (req, res, next) => {
    // Get Result ID
    const resultId = req.params.resultId;

    // Get Student Result Id
    const studentId = req.params.studentId;

    // Fetch the Result from DB
    const result = await Results.getResultById(resultId);

    // Get the all classroom
    const classrooms = await Classroom.getAllClassID();

    // Render the Edit form
    res.render("teacher/edit-result", {
        pageTitle: " Edit Result Sheet | Treasure Crest Integrated School",
        result,
        studentId,
        classrooms
    });
}


module.exports.update = async (req, res, next) => {
    // Get Result Id
    const resultId = req.params.resultId;

    // Get Student Result Id
    const studentId = req.params.studentId;

    // Set the Student ID
    req.body.student_id = studentId;

    // Set the Teacher who upload the result
    req.body.added_by = req.session.teacherName.firstname + " " + req.session.teacherName.lastname;

    // Update the Result record
    const updateResult = Results.update(req.body, resultId);

    // Redirect to Result Sheet
    if (updateResult) {
        res.redirect(`../../${studentId}`);
    }

};