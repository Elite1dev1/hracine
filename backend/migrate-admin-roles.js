require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./model/Admin");
const { secret } = require("./config/secret");

const migrateAdminRoles = async () => {
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
      console.log("⚠️  No admin accounts found to migrate.");
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
      console.log(`   Status: ${admin.status}`);
      console.log("─".repeat(80));
    });

    // Update all admin accounts to "Super Admin" role
    console.log("\n🚀 Updating admin accounts to 'Super Admin' role...");
    const result = await Admin.updateMany(
      {},
      { role: "Super Admin" },
      { multi: true }
    );
    console.log(`✅ Updated ${result.modifiedCount} account(s)`);

    // Fetch updated accounts to confirm
    console.log("\n🔍 Verifying updated accounts...");
    const updatedAccounts = await Admin.find({});
    console.log("\n📋 Updated Admin Accounts:");
    console.log("─".repeat(80));
    updatedAccounts.forEach((admin, index) => {
      console.log(`${index + 1}. Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Updated Role: ${admin.role}`);
      console.log(`   Status: ${admin.status}`);
      console.log("─".repeat(80));
    });

    console.log("\n✨ Migration completed successfully!");
    console.log(
      "📝 All admin accounts now have the 'Super Admin' role.",
    );
    console.log("💡 You can now manage staff roles through the Staff Management page.\n");

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrateAdminRoles();
