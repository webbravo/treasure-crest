const path = require('path');
const mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
const express = require('express');
const indexRoute = require('./routes/index');
const teacherRoute = require('./routes/teacher');


// Session Info retrived from .ENV
const SESSION_LIFETIME = process.env.SESSION_LIFETIME;
const SESSION_NAME = process.env.SESSION_NAME;
const SESSION_SECRET = process.env.SESSION_NAME;


// Init app
const app = express();

// SET View Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Session management
app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: SESSION_LIFETIME * 2,
        sameSite: true, // 'strict '
        secure: (req) => process.env.NODE_ENV === 'production' ? true : false,
    },

}))

// Set Static files
app.use(express.static(path.join(__dirname, './public')));

// ROUTE HANDLING
app.use('/', indexRoute);
app.use('/teachers', teacherRoute)


module.exports = app;