const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");

// add image
const saveImageCloudinary = async (req, res,next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer
    );
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:{url:result.secure_url,id:result.public_id},
    });
  } catch (err) {
    console.error('Error in saveImageCloudinary:', err);
    if (err.message && err.message.includes('cloud_name')) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured. Please set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
    next(err)
  }
};

// add image
const addMultipleImageCloudinary = async (req, res, next) => {
  try {
    const files = req.files;

    // Check if files exist
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
        data: [],
      });
    }

    // Array to store Cloudinary image upload responses
    const uploadResults = [];

    for (const file of files) {
      try {
        // Check if file has buffer (memory storage)
        if (!file.buffer) {
          console.error('File missing buffer:', file.originalname);
          continue;
        }

        // Upload image to Cloudinary using buffer
        const result = await cloudinaryServices.cloudinaryImageUpload(file.buffer);
        // Store the Cloudinary response in the array
        uploadResults.push(result);
      } catch (fileError) {
        console.error(`Error uploading file ${file.originalname}:`, fileError);
        // Continue with other files even if one fails
        continue;
      }
    }

    if (uploadResults.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload any images. Please check file format and size.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:
        uploadResults.length > 0
          ? uploadResults.map((res) => ({
              url: res.secure_url,
              id: res.public_id,
            }))
          : [],
    });
  } catch (err) {
    console.error('Error in addMultipleImageCloudinary:', err);
    
    // Check for Cloudinary configuration errors
    if (err.message && (err.message.includes('cloud_name') || err.message.includes('Must supply'))) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured. Please set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
    
    res.status(500).json({
      success: false,
      message: err.message || "Failed to upload images",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({
      success: true,
      message: "delete image successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to delete image",
    });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
