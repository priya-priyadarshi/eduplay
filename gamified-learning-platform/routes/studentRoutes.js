const express = require('express');
const {
    getStudentProfile,
    getStudentProgress,
    getStudentMarks,
    getStudentLeaderboard
} = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, getStudentProfile);
router.get('/progress', authenticateToken, getStudentProgress);
router.get('/marks', authenticateToken, getStudentMarks);
router.get('/leaderboard', authenticateToken, getStudentLeaderboard);

module.exports = router;