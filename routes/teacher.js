const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: 'Adegalo'
    })
});


router.get('/login', (res, req) => {
    res.send('This is Login route');
});

router.get('/login', (res, req) => {
    res.send('This is Login route');
});