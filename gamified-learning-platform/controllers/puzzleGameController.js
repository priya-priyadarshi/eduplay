const Question = require('../models/Question'); // assume you have this
const Progress = require('../models/Progress');

exports.getPuzzleQuestion = async (req, res) => {
  const { subject, topic, step } = req.body;
  const question = await Question.findOne({ subject, topic, step });
  res.json({ question });
};

exports.verifyPuzzleAnswer = async (req, res) => {
  const { userId, subject, topic, step, answer } = req.body;
  const question = await Question.findOne({ subject, topic, step });

  if (question.correctAnswer === answer) {
    // update progress
    await Progress.updateOne(
      { userId, subject, topic },
      { $set: { [`puzzleStep.${step}`]: true } }
    );
    res.json({ success: true, nextStep: step + 1 });
  } else {
    res.json({ success: false, hint: question.hint });
  }
};