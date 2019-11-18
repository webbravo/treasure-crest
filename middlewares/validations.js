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

        body("email")
        .trim()
        .isLength({
            min: 3
        })
        .isEmail({
            domain_specific_validation: false
        })
        .withMessage("Enter a valid email address"),

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
        }).withMessage("Address too short!"),

        body("gender")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Enter valid gender"),


        body("occupation")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Occupation name too short!"),

        body("religion")
        .trim()
        .isLength({
            min: 4
        }).withMessage("Religion name too short!")
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

    addArticleValidation: [
        body('title').trim().isLength({
            min: 5
        }).withMessage('Title Must be at least 5 chars long'),
        body("body").trim().isLength({
            min: 10
        }).withMessage('Body Must be at least 10 chars long')

    ]

}