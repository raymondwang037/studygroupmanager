const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add password field
  userType: { type: String, enum: ['admin', 'student'], default: 'student' }, // New field
}, { optimisticConcurrency: true });

module.exports = mongoose.model('Student', studentSchema);