const db = require('../config/db');

const detectLanguage = async (req, res, next) => {
    let lang = 'en';
    
    if (req.user && req.user.id) {
        const [users] = await db.query(
            'SELECT preferred_language FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length > 0 && users[0].preferred_language) {
            lang = users[0].preferred_language;
        }
    } else if (req.headers['accept-language']) {
        lang = req.headers['accept-language'].split(',')[0].substring(0, 2);
    }
    
    req.language = lang;
    next();
};

module.exports = { detectLanguage };