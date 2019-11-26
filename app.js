const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const morgan = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
const express = require('express');
const indexRoute = require('./routes/index');
const cookieParser = require('cookie-parser');
const teacherRoute = require('./routes/teacherRoute');
const expressValidator = require('express-validator');
const mysqlConnection = require('./models/connection');
const flash = require('connect-flash');


mysqlConnection.query('SHOW DATABASES').then(result => {
    console.log(result);
});

// Session Info retrived from .ENV
const SESSION_LIFETIME = process.env.SESSION_LIFETIME;
const SESSION_NAME = process.env.SESSION_NAME;
const SESSION_SECRET = process.env.SESSION_NAME;


// Init app
const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})

// setup the logger
app.use(morgan('combined', {
    stream: accessLogStream
}))

// SET View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Set Static files
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(cookieParser(SESSION_SECRET));

// Express Session management
app.use(session({
    name: SESSION_NAME,
    resave: false, // forces the session to be saved back to the store
    saveUninitialized: true, // dont save unmodified
    // store: new MySQLStore(helper.MySQLStoreOptions), // Session store for Mysql
    secret: SESSION_SECRET,
    cookie: {
        maxAge: SESSION_LIFETIME * 2,
        sameSite: false, // 'strict '
        secure: false
        // secure: (req) => process.env.NODE_ENV === 'production' ? true : false
    }

}));



// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');

    next();
});


app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.teacherID = req.session.teacherID;
    res.locals.teacherName = req.session.teacherName;
    next();
});


// Route Handling App level Middleware
app.use('/', indexRoute);
app.use('/teachers', teacherRoute);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });


module.exports = app;