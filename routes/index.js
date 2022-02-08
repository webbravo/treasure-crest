const express = require('express');
const Blog = require('../models/Blog');
const striptags = require('striptags');

let router = express.Router();

router.get('/', (req, res) => {
	res.render('index');
});


router.get('/about', (req, res) => {
	res.render('about');
});


router.get('/contact', (req, res) => {
	res.render('contact');
});


router.get('/admission', (req, res) => {
	res.render('admission');
});

router.get('/blog', async (req, res) => {
	const posts = await Blog.getAll();
	res.render('blog', {
		posts,
		striptags
	});
});


router.get('/blog/post/:postId', async (req, res) => {
	const post = await Blog.getBlogPostById(req.params.postId);

	// Get 3 Related post
	const relatedPost = await Blog.getPostByNumbers(3);

	res.render('blog-post', {
		post,
		relatedPost

	});
});

router.get('/media/photos', async (req, res) => {
	const photos = await require("../models/Photos").getAll();
	res.render('photo-gallery', {
		photos
	});
});


router.get('/media/videos', (req, res) => {
	res.render('coming-soon');
});




module.exports = router;