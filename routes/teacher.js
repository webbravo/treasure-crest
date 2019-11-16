const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: 'Adegalo'
    })
});


// Show teacher Login form
router.get('/login', (req, res) => {
    res.render('teacher/login', {
        pageTitle: 'Treasure crest | Teacher Area - Login'
    });
});

router.post('/login', (req, res) => {
    res.send('Teacher Login details Received here!');
});

module.exports = router;