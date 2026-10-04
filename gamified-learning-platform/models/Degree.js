const mongoose = require('mongoose');

// Branch Schema (NEW)
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: String,
    semesters: [{
        semester_number: Number,
        year_number: Number,
        subjects: [{
            name: String,
            subject_code: String,
            topics: [{
                topic_name: String,
                topic_order: Number,
                xp_reward: { type: Number, default: 50 },
                game_type: { type: String, enum: ['match', 'memory'], default: 'match' },
                game_data: { type: mongoose.Schema.Types.Mixed },
                time_limit: { type: Number, default: 60 }
            }]
        }]
    }]
});

// Degree Schema with Branches
const degreeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration_years: { type: Number, default: 4 },
    icon: String,
    display_order: { type: Number, default: 0 },
    branches: [branchSchema],  // NEW - Branches array
    // Keep old semesters for backward compatibility
    semesters: [{
        semester_number: Number,
        year_number: Number,
        subjects: [{
            name: String,
            subject_code: String,
            topics: [{
                topic_name: String,
                topic_order: Number,
                xp_reward: { type: Number, default: 50 },
                game_type: { type: String, enum: ['match', 'memory'], default: 'match' },
                game_data: { type: mongoose.Schema.Types.Mixed },
                time_limit: { type: Number, default: 60 }
            }]
        }]
    }]
});

module.exports = mongoose.model('Degree', degreeSchema);