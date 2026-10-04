const User = require('../models/User');

const updateUserLanguage = async (req, res) => {
    try {
        const { language_code } = req.body;
        const userId = req.user.id;
        
        await User.findByIdAndUpdate(userId, { preferred_language: language_code });
        
        res.json({
            success: true,
            message: 'Language updated',
            language: language_code
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getLanguages = async (req, res) => {
    try {
        const languages = [
            { code: 'en', name: 'English', native_name: 'English' },
            { code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
            { code: 'mr', name: 'Marathi', native_name: 'मराठी' },
            { code: 'ta', name: 'Tamil', native_name: 'தமிழ்' },
            { code: 'te', name: 'Telugu', native_name: 'తెలుగు' },
            { code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' },
            { code: 'ml', name: 'Malayalam', native_name: 'മലയാളം' },
            { code: 'bn', name: 'Bengali', native_name: 'বাংলা' },
            { code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી' },
            { code: 'or', name: 'Odia', native_name: 'ଓଡ଼ିଆ' },
            { code: 'pa', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ' },
            { code: 'ur', name: 'Urdu', native_name: 'اُردُو' }
        ];
        res.json({ success: true, languages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { updateUserLanguage, getLanguages };