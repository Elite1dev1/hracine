
module.exports = (...role) => {

  return (req, res, next) => {
    const userRole = req.user.role;
    
    // Case-insensitive role check
    const userRoleLower = userRole?.toLowerCase();
    const allowedRoles = role.map(r => r.toLowerCase());
    
    if(!userRole || !allowedRoles.includes(userRoleLower)){
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