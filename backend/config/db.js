const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// local url 
const DB_URL = 'mongodb://0.0.0.0:27017/shofy'; 
// mongodb url
const MONGO_URI = secret.db_url;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error('MongoDB URI is missing! Please set MONGO_URI environment variable.');
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log('mongodb connection success!');
  } catch (err) {
    console.error('mongodb connection failed!', err.message);
    // Don't throw - let the app continue, but API calls will fail
    // This allows the app to start even if DB connection fails initially
  }
};

module.exports = connectDB;
