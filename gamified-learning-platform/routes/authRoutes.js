const express = require('express');
const passport = require('passport');
const { 
    register,
    registerCollege,
    addTeacher,
    addStudent,
    login, 
    checkAccount,
    forgotPassword,
    resetPassword,
    getCollegeLeaderboard,
    getCollegeStats,
    googleLoginSuccess,
    facebookLoginSuccess,
    loginFailure,
    updateLanguage
} = require('../controllers/authController');
const { authenticateToken, authorizeDirector, authorizeTeacher } = require('../middleware/auth');
const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post('/register', register);
router.post('/register-college', registerCollege);
router.post('/login', login);
router.post('/check-account', checkAccount);
// Forgot Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// ==================== PROTECTED ROUTES ====================
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const User = require('../models/User');
        const College = require('../models/College');
        const user = await User.findById(req.user.id).select('-password');
        let collegeName = null;
        if (user.collegeId) {
            const college = await College.findById(user.collegeId);
            collegeName = college?.name;
        }
        res.json({ 
            success: true, 
            user: {
                ...user.toObject(),
                collegeName: collegeName
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// College Management Routes
router.post('/add-teacher', authenticateToken, authorizeDirector, addTeacher);
router.post('/add-student', authenticateToken, authorizeTeacher, addStudent);
router.get('/college-leaderboard', authenticateToken, getCollegeLeaderboard);
router.get('/college-stats', authenticateToken, authorizeTeacher, getCollegeStats);

// Language Route
router.put('/language', authenticateToken, updateLanguage);

// ==================== GOOGLE OAUTH ROUTES ====================
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
                           process.env.GOOGLE_CLIENT_ID !== 'dummy_google_client_id' &&
                           process.env.GOOGLE_CLIENT_ID !== 'placeholder_google_client_id';

if (isGoogleConfigured) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
        googleLoginSuccess
    );
} else {
    router.get('/google', (req, res) => {
        res.json({ success: false, error: 'Google login not configured' });
    });
    router.get('/google/callback', (req, res) => {
        res.redirect('/api/auth/failure');
    });
}

// ==================== FACEBOOK OAUTH ROUTES ====================
const isFacebookConfigured = process.env.FACEBOOK_APP_ID && 
                             process.env.FACEBOOK_APP_ID !== 'dummy_facebook_app_id' &&
                             process.env.FACEBOOK_APP_ID !== 'placeholder_facebook_app_id';

if (isFacebookConfigured) {
    router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    router.get('/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/api/auth/failure' }),
        facebookLoginSuccess
    );
} else {
    router.get('/facebook', (req, res) => {
        res.json({ success: false, error: 'Facebook login not configured' });
    });
    router.get('/facebook/callback', (req, res) => {
        res.redirect('/api/auth/failure');
    });
}

// ==================== SUCCESS/FAILURE ROUTES ====================
router.get('/success', (req, res) => {
    res.redirect('http://localhost:5000');
});
router.get('/failure', loginFailure);

module.exports = router;