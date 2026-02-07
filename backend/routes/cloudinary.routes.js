const express = require('express');
const router = express.Router();
// internal
const uploader = require('../middleware/uploder');
const { cloudinaryController } = require('../controller/cloudinary.controller');
const multer = require('multer');

const upload = multer();
//add image
router.post('/add-img',upload.single('image'), cloudinaryController.saveImageCloudinary);

//add multiple images (up to 10)
router.post('/add-multiple-img', upload.array('images', 10), cloudinaryController.addMultipleImageCloudinary);

//delete image
router.delete('/img-delete', cloudinaryController.cloudinaryDeleteController);

module.exports = router;