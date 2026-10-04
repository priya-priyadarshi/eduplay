const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  step: Number,
  text: String,
  correctAnswer: String,
  hint: String
});
module.exports = mongoose.model('Question', questionSchema);