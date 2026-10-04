const express = require('express');
const { getUserProgress } = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, getUserProgress);

module.exports = router;