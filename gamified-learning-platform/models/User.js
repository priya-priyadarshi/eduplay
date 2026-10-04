const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'director'], 
        default: 'student' 
    },
    preferred_language: { type: String, default: 'en' },
    total_points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    current_streak: { type: Number, default: 0 },
    longest_streak: { type: Number, default: 0 },
    last_activity_date: { type: Date },
    badges: [{
        badge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        awarded_at: { type: Date, default: Date.now }
    }],
    provider: { type: String, default: 'email' },
    
    // College Management Fields
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: false  // ✅ CHANGED FROM true TO false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Forgot Password Fields
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);