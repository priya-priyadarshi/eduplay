const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Degree Schema
const degreeSchema = new mongoose.Schema({
    name: String,
    duration_years: Number,
    display_order: Number,
    semesters: Array
});

// Prevent overwrite
const Degree =
    mongoose.models.Degree ||
    mongoose.model('Degree', degreeSchema);

// GET ALL DEGREES
router.get('/', async (req, res) => {
    try {
        const degrees = await Degree.find().sort({
            display_order: 1
        });

        // IMPORTANT
        res.status(200).json({
            success: true,
            degrees: degrees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;