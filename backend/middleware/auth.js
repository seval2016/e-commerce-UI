const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  console.log('🔐 Auth middleware DEBUG:', {
    method: req.method,
    url: req.url,
    authHeader: authHeader ? `${authHeader.substring(0, 30)}...` : 'NONE',
    hasToken: !!token,
    tokenStart: token ? token.substring(0, 20) + '...' : 'NO TOKEN',
    allHeaders: Object.keys(req.headers),
    jwtSecret: process.env.JWT_SECRET ? 'AVAILABLE' : 'MISSING'
  });

  // Check if no token
  if (!token) {
    console.log('❌ Auth: Token yok - Authorization header:', authHeader);
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
    console.log('✅ Auth: Token geçerli, user:', req.user);
    next();
  } catch (err) {
    console.log('❌ Auth: Token geçersiz:', {
      error: err.message,
      tokenLength: token?.length,
      jwtSecret: process.env.JWT_SECRET ? 'exists' : 'missing'
    });
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: err.message
    });
  }
}; 