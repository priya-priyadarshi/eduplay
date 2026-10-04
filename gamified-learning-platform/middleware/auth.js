const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'User not found' 
            });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ 
                success: false,
                error: 'Account is deactivated' 
            });
        }
        
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            collegeId: user.collegeId
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                success: false,
                error: 'Token expired. Please login again.' 
            });
        }
        return res.status(403).json({ 
            success: false,
            error: 'Invalid token.' 
        });
    }
};

// Check if user is director of their college
const authorizeDirector = async (req, res, next) => {
    if (req.user.role !== 'director') {
        return res.status(403).json({ 
            success: false,
            error: 'Director access only.' 
        });
    }
    next();
};

// Check if user is teacher of their college
const authorizeTeacher = async (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'director') {
        return res.status(403).json({ 
            success: false,
            error: 'Teacher or Director access only.' 
        });
    }
    next();
};

// Check if user is from same college
const checkSameCollege = async (req, res, next) => {
    const targetCollegeId = req.params.collegeId || req.body.collegeId;
    
    if (targetCollegeId && req.user.collegeId.toString() !== targetCollegeId) {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied. You can only access your own college data.' 
        });
    }
    next();
};

module.exports = { 
    authenticateToken, 
    authorizeDirector, 
    authorizeTeacher,
    checkSameCollege 
};