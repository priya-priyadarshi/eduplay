const express = require('express');
const { getPuzzleQuestion, verifyPuzzleAnswer } = require('../controllers/puzzleGameController');
const router = express.Router();

router.post('/puzzle/question', getPuzzleQuestion);
router.post('/puzzle/verify', verifyPuzzleAnswer);

module.exports = router;