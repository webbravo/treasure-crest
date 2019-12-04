const Classroom = require('../models/Classroom');
const Teachers = require('../models/Teachers');
const teachersController = require('../controllers/teachersController');

// Show the add classroom form
module.exports.showAddForm = (req, res) => {
    // Get all teacher (Id, firstname, lastname);
    teachersController.getTeachersID().then(teachers => {
        // Render the teacher list to the add clssrom form
        res.render("teacher/add-class", {
            pageTitle: "Add a Classroom | Treasure Crest Integrated School",
            teachers: teachers
        });
    });
};


// Get Classroom  Id and name
module.exports.getAllClassroomID = async (req, res) => {
    const classroomID = await Classroom.getAllClassID();
    return classroomID;
};


module.exports.getClassById = async (id) => {
    const foundClassroom = await Classroom.findById(id);
    return foundClassroom[0];
}


module.exports.listAll = (req, res) => {
    // Fetch Classroom List
    Classroom.getAll().then(foundClassrooms => {
        // Display Record
        res.render("teacher/all-class", {
            pageTitle: "All Classroom List | Treasure Crest Integrated School",
            classrooms: foundClassrooms
        });
    });
}


module.exports.save = (req, res) => {
    // Pass classroom Object to DB
    const addClassrom = Classroom.save(req.body);
    if (addClassrom === true) {
        req.flash('success', "New Class added!");
        return res.redirect('../teachers/add-class');
    }
};