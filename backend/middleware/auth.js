const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied',
      debug: {
        authHeader: !!authHeader,
        headers: Object.keys(req.headers)
      }
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      id: decoded.userId || decoded.id, 
      role: decoded.role || 'user',
      email: decoded.email 
    };
 
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: err.message
    });
  }
}; 