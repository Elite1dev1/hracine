require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./model/Admin");
const { secret } = require("./config/secret");

const rollbackAdminRoles = async () => {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(secret.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find all admin accounts
    console.log("\n🔍 Fetching admin accounts...");
    const adminAccounts = await Admin.find({});
    console.log(`📊 Found ${adminAccounts.length} admin account(s)`);

    if (adminAccounts.length === 0) {
      console.log("⚠️  No admin accounts found to rollback.");
      await mongoose.connection.close();
      return;
    }

    // Display current roles
    console.log("\n📋 Current Admin Accounts:");
    console.log("─".repeat(80));
    adminAccounts.forEach((admin, index) => {
      console.log(`${index + 1}. Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Current Role: ${admin.role}`);
      console.log("─".repeat(80));
    });

    // Rollback to old "Admin" role
    console.log("\n⏮️  Rolling back to 'Admin' role...");
    const result = await Admin.updateMany(
      {},
      { role: "Admin" },
      { multi: true }
    );
    console.log(`✅ Rolled back ${result.modifiedCount} account(s)`);

    // Fetch updated accounts to confirm
    console.log("\n🔍 Verifying rolled back accounts...");
    const updatedAccounts = await Admin.find({});
    console.log("\n📋 Rolled Back Admin Accounts:");
    console.log("─".repeat(80));
    updatedAccounts.forEach((admin, index) => {
      console.log(`${index + 1}. Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log("─".repeat(80));
    });

    console.log("\n✨ Rollback completed successfully!");
    console.log("📝 All admin accounts reverted to 'Admin' role.\n");

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Rollback failed:", error.message);
    process.exit(1);
  }
};

rollbackAdminRoles();
