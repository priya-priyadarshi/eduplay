const express = require('express');
const { 
    getDegrees, getBranches, getSemesters, getSemestersByBranch,
    getSubjects, getSubjectsBySemesterIndex, getSubjectsByBranchSemester,
    getTopics, getGameData, submitGameResult
} = require('../controllers/gameController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ================= DEGREE ROUTES =================
router.get('/degrees', authenticateToken, getDegrees);
router.get('/branches/:degree_id', authenticateToken, getBranches);

// ================= SEMESTER ROUTES =================
router.get('/semesters/:degree_id', authenticateToken, getSemesters);
router.get('/semesters-by-branch', authenticateToken, getSemestersByBranch);

// ================= SUBJECT ROUTES =================
router.get('/subjects/:semester_id', authenticateToken, getSubjects);
router.get('/subjects', authenticateToken, getSubjectsBySemesterIndex);
router.get('/subjects-by-branch', authenticateToken, getSubjectsByBranchSemester);

// ================= TOPIC & GAME ROUTES =================
router.get('/topics/:subject_id', authenticateToken, getTopics);
router.get('/play/:topic_id', authenticateToken, getGameData);
router.post('/submit/:topic_id', authenticateToken, submitGameResult);

module.exports = router;