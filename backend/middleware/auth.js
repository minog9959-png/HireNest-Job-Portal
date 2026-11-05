const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Har protected route par pehle ye chalta hai:
// Token check karta hai, sahi ho to req.user me user daal deta hai
async function protect(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Please log in first' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Role check: sirf bataye hue role wale hi ye route use kar sakte hain
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    next();
  };
}

module.exports = { protect, authorize };
