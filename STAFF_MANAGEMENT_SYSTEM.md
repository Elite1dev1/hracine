# Staff Management and Role-Based Access Control System

## Overview

This document describes the comprehensive Staff Management and Role-Based Access Control (RBAC) system that has been integrated into the e-commerce admin panel. The system enables Super Admins to manage multiple staff members with specific roles and limited permissions.

## Architecture

### Roles and Permissions

The system includes four primary roles with distinct permissions:

#### 1. **Super Admin** - Full Access
- **Dashboard**: View
- **Products**: View, Create, Edit, Delete
- **Categories**: View, Create, Edit, Delete
- **Brands**: View, Create, Edit, Delete
- **Coupons**: View, Create, Edit, Delete
- **Orders**: View, Edit, Delete
- **Users**: View, Edit, Delete
- **Consultations**: View
- **Blogs**: View, Create, Edit, Delete
- **Newsletter**: View
- **Settings**: View, Edit
- **Staff Management**: View, Create, Edit, Delete

#### 2. **Order Manager** - Order Management
- **Dashboard**: View
- **Orders**: View, Edit (status only)
- **Users**: View
- **Consultations**: View

#### 3. **Store Manager** - Inventory Management
- **Dashboard**: View
- **Products**: View, Create, Edit, Delete
- **Categories**: View, Create, Edit, Delete
- **Brands**: View, Create, Edit, Delete
- **Coupons**: View, Create, Edit, Delete

#### 4. **Support Staff** - Customer Support
- **Dashboard**: View
- **Orders**: View
- **Consultations**: View
- **Users**: View

## Backend Implementation

### 1. **Database Schema Updates**

#### Admin Model (`backend/model/Admin.js`)
The Admin model was updated to support the new role system:

```javascript
role: {
  type: String,
  required: true,
  default: "Super Admin",
  enum: [
    "Super Admin",
    "Order Manager",
    "Store Manager",
    "Support Staff",
  ],
}
```

**Note:** The model already had a `status` field to support account activation/deactivation.

### 2. **Permission System** (`backend/utils/permissions.js`)

A comprehensive permissions utility was created to manage role-based access:

```javascript
const rolePermissions = {
  "Super Admin": {
    dashboard: ["view"],
    products: ["view", "create", "edit", "delete"],
    // ... other permissions
  },
  // ... other roles
};
```

**Functions:**
- `hasPermission(role, resource, action)` - Returns true if role has permission
- `getMenuItemsForRole(role)` - Returns filtered menu items based on role

### 3. **Authorization Middleware** (`backend/middleware/authorization.js`)

Two authorization approaches are implemented:

#### a) **Role-Based Authorization**
```javascript
router.post('/staff/add', verifyToken, authorizeRole("Super Admin"), addStaff);
```
- Used when only specific roles should access an endpoint
- More restrictive, checks if user has specified role

#### b) **Permission-Based Authorization**
```javascript
router.patch("/edit-product/:id", verifyToken, 
  authorizePermission("products", "edit"), 
  productController.updateProduct);
```
- Used for resource-specific permissions
- More flexible, checks if role has permission for resource and action

### 4. **Staff Management API Endpoints** (`backend/routes/admin.routes.js`)

All staff management endpoints require Super Admin role:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/staff/add` | Create new staff member |
| GET | `/api/admin/staff/all` | List all staff |
| GET | `/api/admin/staff/:id` | Get staff details |
| PATCH | `/api/admin/staff/:id` | Update staff information |
| PATCH | `/api/admin/staff/status/:id` | Activate/Deactivate staff |
| DELETE | `/api/admin/staff/:id` | Delete staff member |

### 5. **Protected Routes**

Authorization checks were added to all admin routes:

- **Products** - CREATE, EDIT, DELETE require Store Manager or Super Admin
- **Categories** - CREATE, EDIT, DELETE require Store Manager or Super Admin
- **Brands** - CREATE, EDIT, DELETE require Store Manager or Super Admin
- **Coupons** - CREATE, EDIT, DELETE require Store Manager or Super Admin
- **Orders** - VIEW requires Order Manager/Support/Super Admin; EDIT requires Order Manager/Super Admin
- **Consultations** - VIEW requires Support Staff/Order Manager/Super Admin
- **Settings** - Only accessible by Super Admin
- **Staff** - Only accessible by Super Admin

## Frontend Implementation

### 1. **Role-Based Menu Filtering** (`frontend/src/layout/admin/AdminLayout.jsx`)

The AdminLayout component was updated to dynamically filter sidebar menu items based on user role:

```javascript
const roleMenuAccess = {
  "Super Admin": [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'Products', icon: '📦', path: '/admin/products' },
    { name: 'Staff Management', icon: '👨‍💼', path: '/admin/staff' },
    // ... all items
  ],
  "Order Manager": [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'Orders', icon: '🛒', path: '/admin/orders' },
    // ... relevant items
  ],
  // ... other roles
};
```

**Features:**
- Menu items are filtered on component mount
- Role is displayed in the sidebar
- Only accessible pages appear in navigation
- Attempting to access restricted pages via URL will fail at API level

### 2. **Staff Management Page** (`frontend/src/pages/admin/staff/index.jsx`)

A comprehensive staff management interface with:

#### Features:
- **Staff Table** with columns:
  - Name
  - Email
  - Role (with color-coded badges)
  - Status (Active/Inactive)
  - Created Date
  - Actions (Edit, Deactivate/Activate, Delete)

- **Filtering**:
  - Filter by Role
  - Filter by Status

- **Add/Edit Modal**:
  - Form validation
  - Name, Email, Password, Role, Status, Phone fields
  - Edit mode preserves email (prevents duplicate emails)
  - Password field is optional in edit mode

- **Actions**:
  - Add new staff
  - Edit existing staff
  - Toggle staff status (deactivate/activate)
  - Delete staff members

#### Styling:
- Clean SaaS-style design matching the admin dashboard
- Color-coded role badges
- Responsive grid layout for filters
- Modal overlay for add/edit forms
- Hover effects on interactive elements

### 3. **API Client Utility** (`frontend/src/lib/api.js`)

A lightweight fetch-based API wrapper for staff management endpoints:

```javascript
api.get('/admin/staff/all')
api.post('/admin/staff/add', staffData)
api.patch('/admin/staff/:id', updateData)
api.delete('/admin/staff/:id')
```

**Features:**
- Automatic admin token injection from cookies
- Proper error handling and wrapping
- Base URL configuration for dev/prod
- Support for GET, POST, PATCH, PUT, DELETE methods

## Security Features

### 1. **Token-Based Authentication**
- JWT tokens include user role
- Role verification happens on every request
- Tokens expire after 2 days

### 2. **Permission Validation**
- Permissions checked before executing any action
- Inactive staff cannot log in
- Returns 403 Unauthorized for permission denials

### 3. **Data Protection**
- Passwords excluded from API responses (`.select('-password')`)
- Only authorized users can view/edit staff data

## Usage Examples

### Creating a New Staff Member

**Backend Call:**
```bash
curl -X POST http://localhost:7000/api/admin/staff/add \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Manager",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "Order Manager",
    "status": "Active"
  }'
```

**Frontend Usage:**
```javascript
const staffData = {
  name: "John Manager",
  email: "john@example.com",
  password: "securepass123",
  role: "Order Manager",
  status: "Active"
};

const response = await api.post('/admin/staff/add', staffData);
```

### Accessing Staff Management Page

1. Log in as Super Admin
2. Navigate to Admin Panel
3. Check sidebar - "Staff Management" appears for Super Admin only
4. Click on Staff Management
5. View all staff members in table format

### Attempting Unauthorized Access

**Scenario:** Order Manager tries to access Product Management

1. Order Manager logs in
2. "Products" menu item is hidden from sidebar
3. If user tries to access `/admin/products` directly:
   - API call fails with 403 Unauthorized
   - Frontend handles error and can redirect to allowed pages

## Adding New Roles

### Step 1: Update Admin Model
Add new role to the enum:
```javascript
enum: ["Super Admin", "Order Manager", "Store Manager", "Support Staff", "NewRole"]
```

### Step 2: Update Permissions
Add permissions in `backend/utils/permissions.js`:
```javascript
"NewRole": {
  dashboard: ["view"],
  products: ["view"],
  // ... other permissions
}
```

### Step 3: Update Frontend Menu
Add menu access in `AdminLayout.jsx`:
```javascript
"NewRole": [
  { name: 'Dashboard', icon: '📊', path: '/admin' },
  { name: 'Products', icon: '📦', path: '/admin/products' },
  // ... menu items
]
```

### Step 4: Update Route Protections
Add permission checks to routes as needed:
```javascript
router.get('/products', verifyToken, 
  authorizePermission("products", "view"), 
  getProducts);
```

## Testing the System

### Test Cases:

1. **Inactive Account Login**
   - Create an inactive staff member
   - Try to log in with their credentials
   - Expected: Login fails with "account inactive" message

2. **Permission Denial**
   - Log in as Order Manager
   - Try to access product API: `PATCH /api/product/edit-product/:id`
   - Expected: 403 Unauthorized response

3. **Staff List Filtering**
   - Log in as Super Admin
   - Go to Staff Management
   - Filter by role and status
   - Expected: Table updates to show filtered results

4. **Menu Access Control**
   - Log in as different roles
   - Verify sidebar shows only allowed menu items
   - Expected: Each role sees different menu items

5. **Staff Status Toggle**
   - Add a staff member with Active status
   - Click "Deactivate" button
   - Verify status changes to Inactive
   - Try logging in with that account
   - Expected: Login fails with inactive account message

## Deployment Considerations

1. **Environment Variables**
   - Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly
   - Backend API should be accessible from frontend

2. **Database**
   - Admin collection already stores roles
   - No migration needed if updating existing system

3. **Backward Compatibility**
   - Old admin accounts should be migrated to High role or Super Admin
   - Update script may be needed for existing data

4. **Performance**
   - Permission checks happen at middleware level (fast)
   - Menu filtering happens client-side (no performance impact)
   - Consider caching strategies for large staff lists

## Future Enhancements

1. **Activity Logging** - Log actions by each staff member
2. **Custom Roles** - Allow Super Admin to create custom roles
3. **Audit Trail** - Track all administrative actions
4. **Session Management** - Limit concurrent sessions per user
5. **Two-Factor Authentication** - Enhance security with 2FA
6. **Bulk Operations** - Bulk import/export staff members
7. **Approval Workflows** - Require approval for sensitive actions
8. **Role Templates** - Pre-built role configurations

## Troubleshooting

### Issue: Staff member can access unauthorized pages
- **Solution**: Verify token contains correct role information
- Check authorization middleware is applied to all routes

### Issue: Menu items not filtering correctly
- **Solution**: Verify roleMenuAccess object in AdminLayout matches roles
- Check browser console for JavaScript errors

### Issue: Password field shows errors unexpectedly
- **Solution**: Verify form validation logic in StaffModal
- Check password requirements in backend API

## Support and Questions

For questions or issues with the Staff Management system:
1. Check API response messages for specific error details
2. Verify user role using admin cookie inspection
3. Check browser network tab for API calls
4. Review server logs for permission-related errors

---

**Version:** 1.0  
**Last Updated:** March 14, 2026  
**Status:** Production Ready
