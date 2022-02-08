/**
 * This is a custom server side validation file
 * Created by michio @PoweredPeople hub
 * Date: 19th Dec 2018
 */

const {
    check,
    validationResult,
    sanitizeBody,
    sanitizeParam
} = require("express-validator");


module.exports = {
    addTeacherValidation: [
        check('firstname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("First name too short! "),

        check('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),

        check("phone")
        .trim()
        .isLength({
            min: 11
        }).withMessage("phone must be leat 11 chars")
        .isNumeric().withMessage("No special chars allowed"),

        check("email")
        .isEmail({
            domain_specific_validation: true
        })
        .withMessage("Enter a valid email address"),

        check("password")
        .isLength({
            min: 6
        }).withMessage("Password too short")
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.conPassword) {
                return false;
            } else {
                return true;
            }
        }).withMessage("Password don't Match")
    ],

    loginTeacherValidation: [
        check("email")
        .isEmail({
            domain_specific_validation: true
        })
        .withMessage("Enter a valid email address")
    ],


    loginParentValidation: [
        check("email")
        .trim()
        .isEmail({
            domain_specific_validation: true
        })
        .withMessage("Enter a valid email address")
    ],

    addParentValidation: [
        check('firstname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("First name too short! "),

        check('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),

        check("gender")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Enter valid gender"),


        check("phone")
        .trim()
        .isLength({
            min: 11
        }).withMessage("phone must be leat 11 chars")
        .isNumeric().withMessage("No special chars allowed"),



        check("religion")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Religion name too short!"),


        check("email")
        .trim()
        .isLength({
            min: 3
        })
        .isEmail({
            domain_specific_validation: false
        })
        .withMessage("Enter a valid email address"),


        check("password")
        .isLength({
            min: 6
        }).withMessage("Password too short")
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.conPassword) {
                return false;
            } else {
                return true;
            }
        }).withMessage("Password don't Match")
    ],

    updateParentValidation: [
        check('firstname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("First name too short! "),

        check('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),

        check("gender")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Enter valid gender"),


        check("phone")
        .trim()
        .isLength({
            min: 11
        }).withMessage("phone must be leat 11 chars")
        .isNumeric().withMessage("No special chars allowed"),

        check("address")
        .trim()
        .isLength({
            min: 10
        }).withMessage("House address is too short!"),



        check("occupation")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Occupation name too short!"),

        check("religion")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Religion name too short!"),


        check("email")
        .trim()
        .isLength({
            min: 3
        })
        .isEmail({
            domain_specific_validation: false
        })
        .withMessage("Enter a valid email address")

    ],

    addClassroomValidation: [
        check('name')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Class name too short! "),

        check("teacher_id")
        .trim()
        .isLength({
            min: 1
        }).withMessage("Invalid Class teacher ID")
        .isLength({
            max: 11
        }).withMessage("Please Class teacher ID")
        .isNumeric().withMessage("No special chars allowed")
    ],

    addStudentValidation: [
        check('firstname')
        .trim()
        .isLength({
            min: 2
        })
        .withMessage("First name too short! "),

        check('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),


        check("gender")
        .trim()
        .isLength({
            min: 4,
            max: 6
        }).withMessage("Enter Valid gender"),

        check("dob")
        .trim()
        .isLength({
            min: 10,
            max: 10
        }).withMessage("Date of Birth Invalid"),

        check("address")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Address too short!")
        .isLength({
            max: 255
        }).withMessage("Address too long!"),

        check("nationality")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Country name too short!")
        .isLength({
            max: 40
        }).withMessage("Country name too long"),

        check("state_origin")
        .trim()
        .isLength({
            min: 0
        }).withMessage("State name too short!")
        .isLength({
            max: 30
        }).withMessage("State name too long"),

        check("lga_origin")
        .trim()
        .isLength({
            min: 0
        }).withMessage("LGA name too short!")
        .isLength({
            max: 20
        }).withMessage("LGA name too long"),

        check("hometown")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Home town name too short!")
        .isLength({
            max: 30
        }).withMessage("Home town name too Long!"),



        check("religion")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Religion name too short!")
        .isLength({
            max: 10
        }).withMessage("Religion name too Long!"),



        check("student_id")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Student ID too short!"),


        check("previous_school")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Previous School name too short!")
        .isLength({
            max: 30
        }).withMessage("Previous School name too Long!"),


        check("reason_for_leaving")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Reason too short!")
        .isLength({
            max: 250
        }).withMessage("Reason too Long (250 Word Max)!"),

        check("reason_for_leaving")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Reason too short!")
        .isLength({
            max: 250
        }).withMessage("Reason too Long (250 Word Max)!"),


        check("class_id")
        .trim()
        .isLength({
            min: 1
        }).withMessage("Invalid Class name")
        .isLength({
            max: 11
        }).withMessage("Please check the classname!")
        .isNumeric().withMessage("No special chars allowed"),



        check("term")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Term too short!")
        .isLength({
            max: 12
        }).withMessage("Reason too Long (12 Word Max)!"),


        check("academic_session")
        .trim()
        .isLength({
            min: 0
        }).withMessage("Year too short")
        .isLength({
            max: 10
        }).withMessage(" Enter a Valid Year(10 Word Max)!"),


        check("parent_1")
        .trim()
        .isLength({
            min: 1
        }).withMessage("Invalid Parent name")
        .isLength({
            max: 11
        }).withMessage("Please check the Parent!")
        .isNumeric().withMessage("No special chars allowed")


    ],

    addPostValidation: [
        check('title')
        .trim()
        .isLength({
            min: 6
        })
        .withMessage("Title Must be at least 6 chars long"),

        check("content")
        .trim()
        .isLength({
            min: 20
        }).withMessage("Content Must be longer than 20 chars ")
    ],

    sanitizeURLParams: [
        sanitizeParam('id').escape().trim().toInt()
    ]

}