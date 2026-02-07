// Quick test script to verify admin login
require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./model/Admin');
const bcrypt = require('bcryptjs');

connectDB();

const testLogin = async () => {
  try {
    const email = 'dorothy@gmail.com';
    const password = '123456';
    
    console.log('Testing admin login...');
    console.log('Email:', email);
    console.log('Password:', password);
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log('❌ Admin not found!');
      console.log('Available admins:');
      const allAdmins = await Admin.find({});
      allAdmins.forEach(a => {
        console.log(`  - ${a.email} (${a.name})`);
      });
      process.exit(1);
    }
    
    console.log('✅ Admin found:', admin.email);
    console.log('Admin name:', admin.name);
    console.log('Admin status:', admin.status);
    console.log('Admin has password:', !!admin.password);
    
    if (!admin.password) {
      console.log('❌ Admin has no password set!');
      process.exit(1);
    }
    
    const isPasswordValid = bcrypt.compareSync(password, admin.password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('✅ Login test PASSED!');
    } else {
      console.log('❌ Login test FAILED - Password mismatch');
      console.log('Try resetting the password or checking the seed data');
    }
    
    process.exit(isPasswordValid ? 0 : 1);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run after a short delay to allow DB connection
setTimeout(testLogin, 2000);
