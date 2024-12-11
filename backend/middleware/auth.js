const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

exports.authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) throw new Error('Invalid token');
    req.user = student; // Attach user to request
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};