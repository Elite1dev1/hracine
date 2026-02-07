const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");
const { secret } = require("../config/secret");

dotenv.config();
const cloudinary = cloudinaryModule.v2;

// Validate Cloudinary configuration
if (!secret.cloudinary_name || !secret.cloudinary_api_key || !secret.cloudinary_api_secret) {
  console.error('⚠️  WARNING: Cloudinary credentials are missing!');
  console.error('Please set the following environment variables in your .env file:');
  console.error('  - CLOUDINARY_NAME');
  console.error('  - CLOUDINARY_API_KEY');
  console.error('  - CLOUDINARY_API_SECRET');
  console.error('  - CLOUDINARY_UPLOAD_PRESET');
  console.error('\nImage uploads will fail until these are configured.\n');
} else {
  cloudinary.config({
    cloud_name: secret.cloudinary_name,
    api_key: secret.cloudinary_api_key,
    api_secret: secret.cloudinary_api_secret,
  });
  console.log('✅ Cloudinary configured successfully');
}

module.exports = cloudinary;