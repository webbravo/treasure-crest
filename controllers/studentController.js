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



module.exports.profile = {
    add: function (req, res, next) {
        res.json({
            name: 'Student name'
        });
    },

    viewStudent: (req, res, next) => {
        res.json({
            student: req.param.studentID
        })
    }

}