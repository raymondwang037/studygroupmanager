const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', studentController.getStudents);
router.post('/', authenticateToken, isAdmin, studentController.createStudent);
router.put('/:id', authenticateToken, studentController.updateStudent);
router.delete('/:id', authenticateToken, studentController.deleteStudent);
router.get('/me', authenticateToken, studentController.getCurrentUser);
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/search', authenticateToken, studentController.searchStudents);

module.exports = router;