const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    directorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalXP: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    totalTeachers: {
        type: Number,
        default: 0
    },
    subscription: {
        type: String,
        enum: ['trial', 'basic', 'premium'],
        default: 'trial'
    },
    subscriptionExpiry: {
        type: Date,
        default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days trial
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('College', collegeSchema);