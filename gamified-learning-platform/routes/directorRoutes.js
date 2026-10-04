const express = require('express');
const {
    deleteTeacher,
    deleteStudent,
    getAllTeachers
} = require('../controllers/directorController');
const { authenticateToken, authorizeDirector } = require('../middleware/auth');

const router = express.Router();

router.delete('/teacher/:teacherId', authenticateToken, authorizeDirector, deleteTeacher);
router.delete('/student/:studentId', authenticateToken, authorizeDirector, deleteStudent);
router.get('/teachers', authenticateToken, authorizeDirector, getAllTeachers);

module.exports = router;
