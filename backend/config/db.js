const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// mongodb url
const MONGO_URI = secret.db_url;

// Connection options for better reliability on serverless
const connectionOptions = {
  serverSelectionTimeoutMS: 30000, // 30s timeout (increased for slow connections)
  socketTimeoutMS: 60000, // Close sockets after 60s of inactivity
  connectTimeoutMS: 30000, // 30s connection timeout (increased)
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 0, // Allow 0 connections (important for serverless)
  retryWrites: true,
  w: 'majority',
  // Additional options for better connection handling
  heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
  retryReads: true,
};

let isConnected = false;
let connectionPromise = null; // Track ongoing connection attempts
let lastConnectionAttempt = 0;
const CONNECTION_RETRY_DELAY = 5000; // Wait 5s between retry attempts

const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  // If there's already a connection attempt in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Throttle connection attempts - don't retry too frequently
  const now = Date.now();
  if (now - lastConnectionAttempt < CONNECTION_RETRY_DELAY) {
    const waitTime = CONNECTION_RETRY_DELAY - (now - lastConnectionAttempt);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Create a new connection promise
  connectionPromise = (async () => {
    try {
      if (!MONGO_URI) {
        console.error('❌ MongoDB URI is missing! Please set MONGO_URI environment variable.');
        console.error('💡 Create a .env file in the backend directory with: MONGO_URI=your_connection_string');
        connectionPromise = null;
        return;
      }

      // Validate connection string format
      if (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://')) {
        console.error('❌ Invalid MongoDB URI format!');
        console.error('💡 MongoDB URI should start with "mongodb://" or "mongodb+srv://"');
        connectionPromise = null;
        return;
      }

      lastConnectionAttempt = Date.now();
      console.log('🔄 Attempting to connect to MongoDB...');
      console.log('⏱️  Connection timeout set to 30 seconds...');
      
      // Set a timeout for the connection attempt
      const connectPromise = mongoose.connect(MONGO_URI, connectionOptions);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout after 30 seconds. Check your network connection and MongoDB server status.'));
        }, 30000);
      });

      await Promise.race([connectPromise, timeoutPromise]);
      
      isConnected = true;
      console.log('✅ MongoDB connection successful!');
      console.log(`📊 Connected to: ${mongoose.connection.host}:${mongoose.connection.port || 'default'}`);
      
      // Handle connection events (only set once)
      if (!mongoose.connection.listenerCount('error')) {
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message);
          isConnected = false;
          connectionPromise = null;
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB disconnected');
          isConnected = false;
          connectionPromise = null;
        });

        mongoose.connection.on('reconnected', () => {
          console.log('✅ MongoDB reconnected');
          isConnected = true;
          connectionPromise = null;
        });
      }

      connectionPromise = null;
    } catch (err) {
      isConnected = false;
      connectionPromise = null;
      console.error('❌ MongoDB connection failed!', err.message);
      
      // Provide helpful error messages
      if (err.message.includes('timeout')) {
        console.error('💡 Troubleshooting tips:');
        console.error('   1. Check if your MongoDB server is running and accessible');
        console.error('   2. Verify your MONGO_URI in the .env file is correct');
        console.error('   3. If using MongoDB Atlas, check your IP whitelist');
        console.error('   4. Check your network connection and firewall settings');
        console.error('   5. Try increasing connection timeout in config/db.js');
      } else if (err.message.includes('authentication')) {
        console.error('💡 Authentication failed. Check your MongoDB username and password in MONGO_URI');
      } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
        console.error('💡 DNS resolution failed. Check if the MongoDB hostname is correct');
      }
      
      console.error('Full error:', err);
      // Don't throw - let the app continue, but API calls will fail
    }
  })();

  return connectionPromise;
};

// Export connection status check
const checkConnection = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, checkConnection };
