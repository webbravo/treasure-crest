/**
 * This is a custom server side validation file
 * Created by michio @PoweredPeople hub
 * Date: 19th Dec 2018
 */

const {
    body,
    validationResult,
    sanitizeBody,
} = require("express-validator");


module.exports = {
    addTeacherValidation: [
        body('firstname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("First name too short! "),

        body('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),

        body("phone")
        .trim()
        .isLength({
            min: 11
        }).withMessage("phone must be leat 11 chars")
        .isNumeric().withMessage("No special chars allowed"),

        body("email")
        .isEmail({
            domain_specific_validation: true
        })
        .withMessage("Enter a valid email address"),

        body("password")
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
        body("email")
        .isEmail({
            domain_specific_validation: true
        })
        .withMessage("Enter a valid email address")
    ],


    addParentValidation: [
        body('firstname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("First name too short! "),

        body('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),

        body("gender")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Enter valid gender"),


        body("phone")
        .trim()
        .isLength({
            min: 11
        }).withMessage("phone must be leat 11 chars")
        .isNumeric().withMessage("No special chars allowed"),

        body("address")
        .trim()
        .isLength({
            min: 10
        }).withMessage("House address is too short!"),



        body("occupation")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Occupation name too short!"),

        body("religion")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Religion name too short!"),


        body("email")
        .trim()
        .isLength({
            min: 3
        })
        .isEmail({
            domain_specific_validation: false
        })
        .withMessage("Enter a valid email address"),


        body("password")
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

    addClassroomValidation: [
        body('name')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Class name too short! "),

        body("year")
        .trim()
        .isLength({
            min: 4
        })
        .withMessage("Enter a valid email address")
        .isNumeric().withMessage("Use only numbers!"),

        body("description")
        .trim()
        .isLength({
            min: 15
        }).withMessage("Description too short!")
    ],

    addStudentValidation: [
        body('firstname')
        .trim()
        .isLength({
            min: 2
        })
        .withMessage("First name too short! "),


        body('middlename')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Middle name too short! "),

        body('lastname')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage("Last name too short! "),


        body("gender")
        .trim()
        .isLength({
            min: 4,
            max: 6
        }).withMessage("Enter Valid gender"),

        body("dob")
        .trim()
        .isLength({
            min: 10,
            max: 10
        }).withMessage("Date of Birth Invalid"),

        body("address")
        .trim()
        .isLength({
            min: 10
        }).withMessage("Address too short!")
        .isLength({
            max: 255
        }).withMessage("Address too long!"),

        body("phone")
        .trim()
        .isLength({
            min: 10
        }).withMessage("phone must be least 11 chars")
        .isLength({
            max: 13
        }).withMessage("Phone number is 14 figures")
        .isNumeric().withMessage("No special chars allowed"),

        body("nationality")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Country name too short!")
        .isLength({
            max: 20
        }).withMessage("Country name too long"),

        body("state_origin")
        .trim()
        .isLength({
            min: 3
        }).withMessage("State name too short!")
        .isLength({
            max: 20
        }).withMessage("State name too long"),

        body("lga_origin")
        .trim()
        .isLength({
            min: 3
        }).withMessage("LGA name too short!")
        .isLength({
            max: 20
        }).withMessage("LGA name too long"),

        body("hometown")
        .trim()
        .isLength({
            min: 3
        }).withMessage("Home town name too short!")
        .isLength({
            max: 30
        }).withMessage("Home town name too Long!"),



        body("religion")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Religion name too short!")
        .isLength({
            max: 10
        }).withMessage("Religion name too Long!"),



        body("student_id")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Student ID too short!"),


        body("previous_school")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Previous School name too short!")
        .isLength({
            max: 30
        }).withMessage("Previous School name too Long!"),


        body("reason_for_leaving")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Reason too short!")
        .isLength({
            max: 250
        }).withMessage("Reason too Long (250 Word Max)!"),

        body("reason_for_leaving")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Reason too short!")
        .isLength({
            max: 250
        }).withMessage("Reason too Long (250 Word Max)!"),


        body("class_id")
        .trim()
        .isLength({
            min: 1
        }).withMessage("Invalid Class name")
        .isLength({
            max: 11
        }).withMessage("Please check the classname!")
        .isNumeric().withMessage("No special chars allowed"),



        body("term")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Term too short!")
        .isLength({
            max: 12
        }).withMessage("Reason too Long (12 Word Max)!"),


        body("academic_session")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Year too short")
        .isLength({
            max: 10
        }).withMessage(" Enter a Valid Year(10 Word Max)!"),


        body("parent_1")
        .trim()
        .isLength({
            min: 1
        }).withMessage("Invalid Parent name")
        .isLength({
            max: 11
        }).withMessage("Please check the Parent!")
        .isNumeric().withMessage("No special chars allowed")


    ],

    addArticleValidation: [
        body('title').trim().isLength({
            min: 5
        }).withMessage('Title Must be at least 5 chars long'),
        body("body").trim().isLength({
            min: 10
        }).withMessage('Body Must be at least 10 chars long')

    ]

}