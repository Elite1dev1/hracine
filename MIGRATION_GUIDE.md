# Admin Role Migration Guide

## Overview

Two migration scripts have been created to help manage admin role transitions:

1. **migrate-admin-roles.js** - Updates all admin accounts to "Super Admin" role
2. **rollback-admin-roles.js** - Reverts all admin accounts back to old roles

## Updated Admin Seed Data

The admin seed data (`backend/utils/admin.js`) has been updated with the new role system:

| Email | Name | Role | Password |
|-------|------|------|----------|
| dorothy@gmail.com | Dorothy R. Brown | **Super Admin** | 123456 |
| porter@gmail.com | Alice B. Porter | **Order Manager** | 123456 |
| corrie@gmail.com | Corrie H. Cates | **Store Manager** | 123456 |
| palmer@gmail.com | Shawn E. Palmer | **Support Staff** | 123456 |
| meikle@gmail.com | Stacey J. Meikle | **Super Admin** | 123456 |

## Running the Migration Script

### Prerequisites
- Node.js installed
- Backend server running or environment variables configured
- MongoDB connection working

### Method 1: Run from Backend Directory

```bash
# Navigate to backend folder
cd backend

# Run the migration script
node migrate-admin-roles.js
```

### Method 2: Using npm script

Add to `backend/package.json`:
```json
{
  "scripts": {
    "migrate:admin-roles": "node migrate-admin-roles.js",
    "rollback:admin-roles": "node rollback-admin-roles.js"
  }
}
```

Then run:
```bash
npm run migrate:admin-roles
```

## Expected Output

### When running migration:

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

🔍 Fetching admin accounts...
📊 Found 5 admin account(s)

📋 Current Admin Accounts:
────────────────────────────────────────────────────────────────────────────────
1. Name: Dorothy R. Brown
   Email: dorothy@gmail.com
   Current Role: Admin
   Status: Active
────────────────────────────────────────────────────────────────────────────────
[... more accounts ...]

🚀 Updating admin accounts to 'Super Admin' role...
✅ Updated 5 account(s)

🔍 Verifying updated accounts...

📋 Updated Admin Accounts:
────────────────────────────────────────────────────────────────────────────────
1. Name: Dorothy R. Brown
   Email: dorothy@gmail.com
   Updated Role: Super Admin
   Status: Active
────────────────────────────────────────────────────────────────────────────────
[... more accounts ...]

✨ Migration completed successfully!
📝 All admin accounts now have the 'Super Admin' role.
💡 You can now manage staff roles through the Staff Management page.
```

## Rollback Instructions

If you need to revert the changes:

```bash
# Using node directly
node rollback-admin-roles.js

# Or using npm script
npm run rollback:admin-roles
```

## Options After Migration

After running the migration, you have three options:

### Option 1: Keep All as Super Admins
All admins have full access. This maintains backward compatibility.

### Option 2: Manually Update Roles
Use the Staff Management page to change individual role assignments:

1. Log in as Super Admin
2. Go to Staff Management (👨‍💼)
3. Click Edit next to each staff member
4. Change their role to appropriate level
5. Save changes

### Option 3: Re-seed with New Roles
Delete and re-seed the database with updated seed data:

```bash
# Run the seed script
node seed.js

# Or if you have an npm script
npm run seed
```

This will automatically create admins with the new roles from `backend/utils/admin.js`.

## Verification

To verify the migration was successful:

1. **Check in Staff Management Page:**
   - Log in as Super Admin
   - Go to Staff Management
   - View all staff members and their roles

2. **Check via API:**
   ```bash
   curl -X GET http://localhost:7000/api/admin/staff/all \
     -H "Authorization: Bearer {your_admin_token}"
   ```

3. **Check in Database:**
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.admins.find({}, { name: 1, email: 1, role: 1 })
   ```

## Troubleshooting

### Issue: "Error: Cannot find module"
**Solution:** Ensure you're running the script from the backend directory with correct paths:
```bash
cd backend
node migrate-admin-roles.js
```

### Issue: "Connection timeout"
**Solution:** Verify MongoDB is running and `secret.dbUrl` is correctly configured in `.env`

### Issue: "No admin accounts found to migrate"
**Solution:** This is normal if the database is empty. Run `npm run seed` to create admin accounts first.

### Issue: Script exits with code 1
**Solution:** Check the error message. Common causes:
- Invalid MongoDB connection string
- Missing environment variables
- Database permissions issue

## Next Steps

After migration:

1. ✅ **Log in** with updated credentials (see table above)
2. ✅ **Access Staff Management** to adjust roles as needed
3. ✅ **Test permissions** by logging in as different roles
4. ✅ **Create additional staff** with appropriate roles

## File References

- **Migration Script:** `backend/migrate-admin-roles.js`
- **Rollback Script:** `backend/rollback-admin-roles.js`
- **Seed Data:** `backend/utils/admin.js`
- **Seed Script:** `backend/seed.js`

---

**Need Help?**
- Check the error messages - they're detailed
- Review `STAFF_MANAGEMENT_SYSTEM.md` for full system documentation
- Verify database connection before running scripts
