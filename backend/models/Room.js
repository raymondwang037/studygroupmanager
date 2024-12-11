const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  building: { type: String, required: true },
  number: { type: String, required: true },
}, { optimisticConcurrency: true });

module.exports = mongoose.model('Room', roomSchema);
