const StudyGroup = require('../models/StudyGroup');

exports.getStudyGroups = async (req, res) => {
    try {
      const studyGroups = await StudyGroup.find()
        .populate('organizers', 'name')
        .populate('attendance.student', 'name')
        .populate('room');

      res.status(200).json(studyGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.createStudyGroup = async (req, res) => {
    try {
      const { name, date, duration, room, organizers } = req.body;

      const attendance = organizers.map((organizerId) => ({
        student: organizerId,
        attended: false,
      }));

      const newStudyGroup = new StudyGroup({
        name,
        date,
        duration,
        room,
        organizers,
        attendance,
      });

      await newStudyGroup.save();
      res.status(201).json(newStudyGroup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateStudyGroup = async (req, res) => {
    try {
      const { organizers, ...updateData } = req.body;

      const studyGroup = await StudyGroup.findById(req.params.id);
  
      if (!studyGroup) {
        return res.status(404).json({ error: "Study group not found" });
      }

      if (organizers) {
        const currentOrganizerIds = studyGroup.organizers.map(org => org.toString());
        const currentAttendance = studyGroup.attendance;
  
        studyGroup.organizers = organizers;
  
        const updatedAttendance = organizers.map((organizerId) => {
          const existingRecord = currentAttendance.find(att => att.student.toString() === organizerId);
          return existingRecord ? existingRecord : { student: organizerId, attended: false };
        });
  
        studyGroup.attendance = updatedAttendance;
      }
  
      Object.assign(studyGroup, updateData);
      const updatedStudyGroup = await studyGroup.save();
  
      res.status(200).json(updatedStudyGroup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.deleteStudyGroup = async (req, res) => {
  try {
    await StudyGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Study group deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
    try {
      const { id } = req.params;
      const { attendance } = req.body;
  
      const updatedStudyGroup = await StudyGroup.findByIdAndUpdate(
        id,
        { attendance },
        { new: true }
      ).populate('attendance');
  
      res.status(200).json(updatedStudyGroup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.generateReport = async (req, res) => {
    try {
      const { student, room, startDate, endDate } = req.query;
      const query = {};
  
      if (student) query.organizers = student;
      if (room) query.room = room;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
  
      const studyGroups = await StudyGroup.find(query)
        .populate('organizers')
        .populate('attendance.student')
        .populate('room');
  
      const totalGroups = studyGroups.length;
      const totalDuration = studyGroups.reduce((sum, group) => sum + group.duration, 0);
      const averageDuration = totalGroups ? totalDuration / totalGroups : 0;
  
      const totalAttendance = studyGroups.reduce((acc, group) => {
        return acc + group.attendance.filter((a) => a.attended).length;
      }, 0);
      const totalInvited = studyGroups.reduce((acc, group) => acc + group.attendance.length, 0);
      const attendanceRate = totalInvited ? (totalAttendance / totalInvited) * 100 : 0;
  
      res.status(200).json({
        totalGroups,
        averageDuration,
        attendanceRate,
        studyGroups,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };