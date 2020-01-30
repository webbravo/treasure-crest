/**
 * Photo Gallery Controller File
 */

const Photos = require("../models/Photos");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid/v4");
const {
    validationResult
} = require("express-validator");

// Add a Photo
module.exports.addPhotos = async (req, res, next) => {
    const addPhoto = await Photos.add(req.body);
    if (addPhoto === true) {
        req.flash("success", `New Photo added!`);
        return res.redirect("back");
    }
};

// Show photos page
module.exports.showPhotos = async (req, res, next) => {
    const photos = await Photos.getAll();
    res.render("teacher/all-photo", {
        pageTitle: "Photo GALLERY | Treasure Crest Integrated School",
        photos: photos
    });
};

// Delete a Photo
module.exports.delete = async (req, res, next) => {
    //  Get the Photo Id
    const photoId = req.params.id;

    // Delete photo
    const delPhoto = await Photos.delete(photoId);

    if (delPhoto === true) {
        req.flash("success", `Photo Deleted!`);
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
    await photo.write(`./public/uploads/gallery/photos/${req.body.photo}`);

    // Once uploaded file to file system keep going;
    req.body.photo = `/uploads/gallery/photos/${req.body.photo}`;
    next();
};


// Render the Photo
// module.exports.showPhotoGallery