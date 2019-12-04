const express = require("express");
const teacherController = require("../controllers/teachersController");
const parentsController = require("../controllers/parentsController");
const studentController = require("../controllers/studentController");
const classroomController = require("../controllers/classController");
const auth = require("../middlewares/authMiddleware");
const validator = require("../middlewares/validations");

let router = express.Router();

router.get("/", auth.isTeacher, teacherController.showDashboard);

router.get("/dashboard", auth.isTeacher, (req, res) => {
  res.json({
    name: "Adegalo"
  });
});

// Show teacher Login form
router.get("/login", auth.redirectTeacherHome, teacherController.showLoginForm);

// Use controllers to Handle the Login Process
router.post(
  "/login",
  validator.loginTeacherValidation,
  teacherController.login
);

// Show Add teachers form
router.get("/add", auth.isTeacher, (req, res) => {
  res.render("teacher/add-teacher", {
    pageTitle: "Treasure crest | Add a teacher"
  });
});

//  Logout the teacher
router.get("/logout", auth.isTeacher, auth.logout);

// Use controllers to add a teacher
router.post("/add", validator.addTeacherValidation, teacherController.add);

// This is a test route
router.get("/is-admin", (req, res) => {
  if (req.session.isAdmin === 1) {
    res.send("<h1>So you are the School Admin right?<h1>");
  } else {
    res.send("<h1>You are not an Admin<h1>");
  }
});

router.get("/recover-password", (req, res) => {
  res.send("<h1>Enter Email addr<h1>");
});

/**==================ALL THE STUDENT RELATED ROUTES====================**/

// Show all Students
router.get("/all-students", auth.isTeacher, studentController.listAll);

// Show a student details
router.get("/view-student", auth.isTeacher, studentController.viewStudent);

// Show add a student form
router.get("/add-students", auth.isTeacher, studentController.showAddForm);
router.post(
  "/add-students",
  auth.isTeacher,
  studentController.upload,
  studentController.resize,
  validator.addStudentValidation,
  studentController.add
);

// Show the edit student form
router.get(
  "/edit-student/:id",
  auth.isTeacher,
  studentController.renderEditForm
);

//  Update the student record
router.post(
  "/edit-student/:id",
  auth.isTeacher,
  studentController.upload,
  studentController.resize,
  validator.addStudentValidation,
  studentController.update
);

// Delete a student record (We do not delete student, but ony update the status)
router.get("/delete-student/:id", studentController.delete);

/**==================ALL PARENT RELATED ROUTES====================**/

// List Parents
router.get(
  "/all-parents",
  auth.isTeacher,
  (req, res, next) => {
    req.pagination = {
      limit: 20
    };
    next();
  },
  parentsController.listAll
);

// Add Parents
router.get("/add-parents", auth.isTeacher, parentsController.showAddForm);
router.post(
  "/add-parents",
  auth.isTeacher,
  validator.addParentValidation,
  parentsController.add
);

/**==================ALL CLASS RELATED ROUTES====================**/

//  Display the lsit of classroom
router.get("/all-class", auth.isTeacher, classroomController.listAll);

// Add A Classroom
router.get("/add-class", auth.isTeacher, classroomController.showAddForm);
router.post(
  "/add-class",
  auth.isTeacher,
  validator.addClassroomValidation,
  classroomController.save
);

module.exports = router;
