const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  try {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);
    
    // Check if the Authorization header is present and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      console.log('Token received:', token);

      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('Decoded token:', decoded);

      // Find the user by ID from the decoded token
      req.user = await User.findById(decoded.id).select("-password");

      console.log('Decoded user:', req.user);

      // Proceed to the next middleware or route handler
      next();
    } else {
      console.log('No token provided or malformed token');
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: "Not authorized, invalid token" });
    } else {
      res.status(500).json({ message: "Server error during authentication" });
    }
  }
};

// Middleware to check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: "Server error during authorization" });
    }
  };
};

module.exports = { protect, authorize };