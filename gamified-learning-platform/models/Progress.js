const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic_id: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    xp_earned: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    best_time: Number,
    completed_at: Date
});

progressSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);