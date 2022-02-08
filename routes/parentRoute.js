const express = require('express');
const Parents = require('../models/Parents');
const Students = require('../models/Students');
const Results = require('../models/Results');
const Classroom = require('../models/Classroom');
const auth = require("../middlewares/authMiddleware");
const h = require('../util/helper');
const bcrypt = require("bcryptjs");
const validator = require("../middlewares/validations");
const {
	validationResult,
} = require('express-validator');



let router = express.Router();


router.get('/', auth.isParent, async (req, res) => {

	// Select the student related to this Parent
	const students = await Students.getStudentByParentId(req.session.parentID);

	//	Render the Student
	res.render('parents/index', {
		students
	});
});


router.get('/login', async (req, res) => {
	res.render('parents/login');
});

router.post('/login', validator.loginParentValidation, async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return res.redirect('/parents/login');
	}

	// Get form Info
	let {
		email,
		password,
	} = req.body;

	const foundParent = await Parents.findByEmail(email);

	if (!foundParent) {
		req.flash('error', 'Invalid Email/Password');
		return res.redirect('/parents/login');
	} else {
		// Compare password
		bcrypt.compare(password, foundParent.password).then(isMatch => {
			if (isMatch) {
				//  If the password matches, Set session
				req.session.parentID = foundParent.id;

				//  Redirect to dashboard
				res.redirect('/parents');
				delete req.session.returnTo;

			} else {
				//  Not Match for email/password
				req.flash('error', 'Invalid Email/Password')
				return res.redirect('/parents/login');
			}
		}).catch(error => {
			return console.error(error);
		});
	}

	// console.log(foundParent);
});



router.get('/child/:id', auth.isParent, async (req, res) => {

	const studentId = req.params.id;

	// Get Student
	const student = await Students.getStudentById(studentId);

	// Get the classroom the child belongs to
	const classroom = await Classroom.findById(student.class_id);

	// Get the student result Sheet
	const results = await Results.getResultByStudentId(studentId);

	res.render("parents/student-info", {
		student,
		classroom,
		results
	});
});


//  Logout the teacher
router.get("/logout", auth.isParent, auth.parentLogout);




module.exports = router;