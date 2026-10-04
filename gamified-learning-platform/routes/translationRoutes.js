const express = require('express');
const { updateUserLanguage, getLanguages } = require('../controllers/translationController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.put('/language', authenticateToken, updateUserLanguage);
router.get('/languages', authenticateToken, getLanguages);

module.exports = router;