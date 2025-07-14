const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('🔐 Auth middleware:', {
    method: req.method,
    url: req.url,
    hasToken: !!token,
    tokenStart: token ? token.substring(0, 20) + '...' : 'no token'
  });

  // Check if no token
  if (!token) {
    console.log('❌ Auth: Token yok');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId || decoded.id, role: decoded.role };
    console.log('✅ Auth: Token geçerli, user:', req.user);
    next();
  } catch (err) {
    console.log('❌ Auth: Token geçersiz:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 