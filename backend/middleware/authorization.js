const { hasPermission } = require("../utils/permissions");

// Check if user has specific role(s)
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        status: "fail",
        error: "User role not found",
      });
    }

    const userRoleLower = userRole.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRoleLower)) {
      return res.status(403).json({
        status: "fail",
        error: "You are not authorized to access this resource",
        userRole: userRole,
        requiredRoles: roles,
      });
    }

    next();
  };
};

// Check if user has permission for a specific resource and action
const authorizePermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        status: "fail",
        error: "User role not found",
      });
    }

    if (!hasPermission(userRole, resource, action)) {
      return res.status(403).json({
        status: "fail",
        error: `You do not have permission to ${action} ${resource}`,
        userRole: userRole,
        requiredPermission: `${action} on ${resource}`,
      });
    }

    next();
  };
};

// Legacy authorization function - kept for backward compatibility
const legacyAuthorize = (...role) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    const userRoleLower = userRole?.toLowerCase();
    const allowedRoles = role.map(r => r.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRoleLower)) {
      return res.status(403).json({
        status: "fail",
        error: "You are not authorized to access this",
        details: {
          userRole: userRole,
          requiredRoles: role
        }
      });
    }

    next();
  };
};

module.exports = {
  authorizeRole,
  authorizePermission,
  legacyAuthorize
};

// Also support default export for backward compatibility
module.exports.default = legacyAuthorize;
