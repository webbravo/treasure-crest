const SESSION_SECRET = process.env.SESSION_NAME;

// Teacher
module.exports.isTeacher = (req, res, next) => {
    if (!req.session.teacherID) {
        req.session.returnTo = req.originalUrl || '/';
        req.flash('warning', "Please Login");
        return res.redirect('/teachers/login');
    }
    next();
};

// Student
module.exports.isParent = (req, res, next) => {
    if (!req.session.parentID) {
        req.session.returnTo = req.originalUrl || '/';
        req.flash('warning', "Please Login");
        return res.redirect('/parents/login');
    }
    next();
};



// This Middleware checks for authorizaion
module.exports.isAdmin = (req, res, next) => {
    if (req.session.isAdmin === 1) {
        next();
    }

};

module.exports.redirectTeacherHome = (req, res, next) => {
    if (req.session.teacherID) {
        res.redirect("../teachers/");
    }
    next();
};

module.exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }

        // Clear cookies
        res.clearCookie(SESSION_SECRET);

        // Redirect to login
        if (this.isTeacher) {
            return res.redirect("../teachers/login");
        }
    });
}



module.exports.parentLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }

        // Clear cookies
        res.clearCookie(SESSION_SECRET);

        // Redirect to login
        if (this.isParent) {
            return res.redirect("../parents/login");
        }
    });
}