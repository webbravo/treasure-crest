const Blog = require("../models/Blog");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid/v4");
const {
    validationResult
} = require("express-validator");



// Add a Blog Post
module.exports.add = async (req, res, next) => {


    //  Check if there is an error!
    const errors = validationResult(req);

    if (errors.isEmpty()) {

        // Set the Teacher who created the story
        req.body.added_by = req.session.teacherName.firstname + " " + req.session.teacherName.lastname;

        const addPost = await Blog.save(req.body);

        if (addPost === true) {
            req.flash("success", `New Post added!`);
            return res.redirect("back");
        }

    } else {
        res.render("teacher/add-post", {
            pageTitle: "Add a Post | Treasure Crest Integrated School",
            formData: req.body,
            errors: errors.errors
        });
    }

};

module.exports.showAddForm = async (req, res, next) => {
    res.render("teacher/add-post", {
        pageTitle: "Add a Post | Treasure Crest Integrated School",
    });
}


// Show All Blog Post
module.exports.getAll = async (req, res, next) => {
    const posts = await Blog.getAll();
    res.render("teacher/all-blog-post", {
        pageTitle: "Blog post | Treasure Crest Integrated School",
        posts
    });
};



// Get Blog post by Id
module.exports.getPostById = async (req, res, next) => {

    const postId = req.params.id;

    const post = await Blog.getBlogPostById(postId);

    res.render("teacher/edit-post", {
        pageTitle: "Blog post | Treasure Crest Integrated School",
        formData: post
    });
};


// Update the Blog Post
module.exports.updatePost = async (req, res, next) => {
    // TODO: Validation
    const postId = req.params.id;
    if (Blog.update(req.body, postId) === true) {
        req.flash(
            "success",
            `Blog Post has been updated!  Check <a href='/teachers/media/blog/${postId}'>post here</a> `
        );
        return res.redirect("back");
    } else {

        req.flash(
            "error",
            `Server Error, Please try again later!`
        );

        return res.redirect("back");
    }
};


// Delete a Post
module.exports.delete = async (req, res, next) => {
    //  Get the Post Id
    const postId = req.params.id;

    // Delete Post
    const delPost = await Blog.delete(postId);

    if (delPost === true) {
        req.flash("success", `Post Deleted!`);
        return res.redirect("back");
    }
};


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, next) {
        const isPhoto = file.mimetype.startsWith("image/");
        if (isPhoto) {
            next(null, true);
        } else {
            next({
                    message: "That filetype isn't allowed"
                },
                false
            );
        }
    }
};

module.exports.upload = multer(multerOptions).single("photo");

// Resize photo to width of 800px
module.exports.resize = async (req, res, next) => {
    // Check if there is no new file to resize
    if (!req.file) {
        next();
        return;
    }

    const extension = req.file.mimetype.split("/")[1];
    req.body.photo = `${uuid()}.${extension}`;

    // Now we Resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/blog/${req.body.photo}`);

    // Once uploaded file to file system keep going;
    req.body.photo = `/uploads/blog/${req.body.photo}`;
    next();
};