const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// mongodb url
const MONGO_URI = secret.db_url;

// Connection options for better reliability on serverless
const connectionOptions = {
  serverSelectionTimeoutMS: 15000, // 15s timeout for serverless
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 15000, // 15s connection timeout
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 0, // Allow 0 connections (important for serverless)
  retryWrites: true,
  w: 'majority',
};

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    if (!MONGO_URI) {
      console.error('❌ MongoDB URI is missing! Please set MONGO_URI environment variable.');
      return;
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI, connectionOptions);
    isConnected = true;
    console.log('✅ MongoDB connection successful!');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

  } catch (err) {
    isConnected = false;
    console.error('❌ MongoDB connection failed!', err.message);
    console.error('Full error:', err);
    // Don't throw - let the app continue, but API calls will fail
  }
};

// Export connection status check
const checkConnection = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, checkConnection };
