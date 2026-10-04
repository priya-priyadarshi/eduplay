const express = require('express');
const {
    getTeacherClasses,
    getStudentProgress,
    addSubject,
    addTopic
} = require('../controllers/teacherController');
const { authenticateToken, authorizeTeacher } = require('../middleware/auth');

const router = express.Router();

router.get('/classes', authenticateToken, authorizeTeacher, getTeacherClasses);
router.get('/student-progress/:studentId', authenticateToken, authorizeTeacher, getStudentProgress);
router.post('/add-subject', authenticateToken, authorizeTeacher, addSubject);
router.post('/add-topic', authenticateToken, authorizeTeacher, addTopic);

module.exports = router;