const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  duration: { type: Number, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  attendance: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      attended: { type: Boolean, default: false },
    },
  ],
}, { optimisticConcurrency: true });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);