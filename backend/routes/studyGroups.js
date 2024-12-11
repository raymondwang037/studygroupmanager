const express = require('express');
const router = express.Router();
const studyGroupController = require('../controllers/studyGroupController');

router.get('/', studyGroupController.getStudyGroups);
router.post('/', studyGroupController.createStudyGroup);
router.put('/:id/attendance', studyGroupController.updateAttendance);
router.get('/report', studyGroupController.generateReport);

const { authenticateToken } = require('../middleware/auth');
router.put('/:id', authenticateToken, studyGroupController.updateStudyGroup);
router.delete('/:id', authenticateToken, studyGroupController.deleteStudyGroup);

module.exports = router;