const Teachers = require('../models/Teachers');
const h = require('../util/helper');
const bcrypt = require("bcryptjs");
const {
    validationResult,
} = require('express-validator');

// Login a teacher
module.exports.login = (req, res) => {
    // Get form Info
    let {
        email,
        password,
    } = req.body;


    // Search for teacher by email
    Teachers.findByEmail(email).then(foundTeacher => {

        // Check if any Teacher was found
        if (foundTeacher.length === 0) {
            req.flash('error', 'Invalid Email/Password');
            return res.redirect('../teachers/login');
        }

        // Compare password
        bcrypt.compare(password, foundTeacher.password).then(isMatch => {
            if (isMatch) {
                //  If the password matches, Set session
                req.session.teacherID = foundTeacher.id;
                req.session.isAdmin = foundTeacher.is_admin;
                req.session.teacherName = {
                    firstname: foundTeacher.firstname,
                    lastname: foundTeacher.lastname
                };

                // Redirect to dashboard
                res.redirect(req.session.returnTo || '/teachers');
                delete req.session.returnTo;

            } else {
                //  Not Match for email/password
                req.flash('error', 'Invalid Email/Password')
                return res.redirect('../teachers/login');
            }
        }).catch(error => {
            return console.error(error);
        });;

    }).catch(error => {
        return console.error(error);
    });
};

// Create an account for the teacher
module.exports.add = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.redirect('../teachers/add');
    } else {

        let {
            firstname,
            lastname,
            email,
            phone,
            password
        } = req.body;


        // Hash Password
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);

        // Pass teacher Object to DB
        const addTeacher = Teacher.save({
            firstname,
            lastname,
            phone,
            email,
            password
        });

        if (addTeacher === true) {
            req.flash('success', 'Teacher added!')
            return res.redirect('../teachers/add');
        }

    }

};


module.exports.showLoginForm = (req, res, next) => {
    res.render('teacher/login', {
        pageTitle: ' Teacher Login | Treasure Crest Integrated ',
        message: ''
    });
};

module.exports.showDashboard = (req, res) => {
    // Get Dashboard Info!
    // console.log(req.session.teacherName)
    res.render('teacher/index', {
        pageTitle: 'Teacher Dashboard | Treasure Crest Integrated School',
        fullname: `${req.session.teacherName.firstname} ${req.session.teacherName.lastname}`
    });
};


module.exports.getTeacherById = (req, res) => {
    // Write Method get a teacher by ID
};

// This method returns all the Teacher ID, Firstname, lastname
module.exports.getTeachersID = async (req, res) => {
    const foundTeachers = await Teachers.getTeachersID();
    return foundTeachers;
};