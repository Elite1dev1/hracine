// Role-based permissions configuration
const rolePermissions = {
  "Super Admin": {
    dashboard: ["view"],
    products: ["view", "create", "edit", "delete"],
    categories: ["view", "create", "edit", "delete"],
    brands: ["view", "create", "edit", "delete"],
    coupons: ["view", "create", "edit", "delete"],
    orders: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    consultations: ["view"],
    blogs: ["view", "create", "edit", "delete"],
    newsletter: ["view"],
    settings: ["view", "edit"],
    staff: ["view", "create", "edit", "delete"],
  },
  "Order Manager": {
    dashboard: ["view"],
    orders: ["view", "edit"],
    consultations: ["view"],
    users: ["view"],
  },
  "Store Manager": {
    dashboard: ["view"],
    products: ["view", "create", "edit", "delete"],
    categories: ["view", "create", "edit", "delete"],
    brands: ["view", "create", "edit", "delete"],
    coupons: ["view", "create", "edit", "delete"],
  },
  "Support Staff": {
    dashboard: ["view"],
    consultations: ["view"],
    orders: ["view"],
    users: ["view"],
  },
};

// Helper function to check if a role has permission for a resource and action
const hasPermission = (role, resource, action) => {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;
  return resourcePermissions.includes(action);
};

// Helper function to get menu items for a role
const getMenuItemsForRole = (role) => {
  const allMenuItems = [
    { name: "Dashboard", icon: "📊", path: "/admin", resource: "dashboard" },
    { name: "Products", icon: "📦", path: "/admin/products", resource: "products" },
    { name: "Categories", icon: "📁", path: "/admin/categories", resource: "categories" },
    { name: "Brands", icon: "🏷️", path: "/admin/brands", resource: "brands" },
    { name: "Coupons", icon: "🎫", path: "/admin/coupons", resource: "coupons" },
    { name: "Users", icon: "👥", path: "/admin/users", resource: "users" },
    { name: "Orders", icon: "🛒", path: "/admin/orders", resource: "orders" },
    { name: "Consultations", icon: "💬", path: "/admin/consultations", resource: "consultations" },
    { name: "Blogs", icon: "📝", path: "/admin/blogs", resource: "blogs" },
    { 
      name: "Marketing", 
      icon: "📧", 
      path: "/admin/marketing", 
      resource: "marketing",
      submenu: [
        { name: "Newsletter Subscribers", path: "/admin/newsletter", resource: "newsletter" },
      ]
    },
    { name: "Settings", icon: "⚙️", path: "/admin/settings", resource: "settings" },
    { name: "Staff Management", icon: "👨‍💼", path: "/admin/staff", resource: "staff" },
  ];

  const permissions = rolePermissions[role];
  if (!permissions) return [];

  return allMenuItems.filter(item => {
    if (item.submenu) {
      // Filter submenu items
      const filteredSubmenu = item.submenu.filter(
        subItem => permissions[subItem.resource] && permissions[subItem.resource].length > 0
      );
      return filteredSubmenu.length > 0;
    }
    return permissions[item.resource] && permissions[item.resource].length > 0;
  });
};

module.exports = {
  rolePermissions,
  hasPermission,
  getMenuItemsForRole,
};
