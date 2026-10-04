const User = require('../models/User');
const College = require('../models/College');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== COLLEGE REGISTRATION (Director) ====================
const registerCollege = async (req, res) => {
    try {
        const { collegeName, domain, directorName, directorEmail, password } = req.body;

        if (!collegeName || !domain || !directorName || !directorEmail || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'All fields are required' 
            });
        }

        const existingCollege = await College.findOne({ $or: [{ name: collegeName }, { domain }] });
        if (existingCollege) {
            return res.status(400).json({ 
                success: false,
                error: 'College already registered with this name or domain' 
            });
        }

        const existingUser = await User.findOne({ email: directorEmail });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'Email already registered' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const college = new College({
            name: collegeName,
            domain: domain,
            totalStudents: 0,
            totalTeachers: 0
        });
        await college.save();

        const director = new User({
            name: directorName,
            email: directorEmail,
            password: hashedPassword,
            role: 'director',
            collegeId: college._id,
            createdBy: null,
            provider: 'email',
            total_points: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0
        });
        await director.save();

        college.directorId = director._id;
        await college.save();

        const token = jwt.sign(
            { 
                id: director._id, 
                email: director.email, 
                role: director.role, 
                name: director.name,
                collegeId: college._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'College registered successfully!',
            token,
            user: {
                id: director._id,
                name: director.name,
                email: director.email,
                role: director.role,
                collegeId: college._id,
                collegeName: college.name,
                total_points: director.total_points,
                level: director.level
            }
        });
    } catch (error) {
        console.error('College registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Registration failed. Please try again.' 
        });
    }
};

// ==================== ADD TEACHER (Director only) ====================
const addTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const directorId = req.user.id;
        const collegeId = req.user.collegeId;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, email and password are required' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'User already exists with this email' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = new User({
            name,
            email,
            password: hashedPassword,
            role: 'teacher',
            collegeId,
            createdBy: directorId,
            provider: 'email',
            total_points: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0
        });
        await teacher.save();

        await College.findByIdAndUpdate(collegeId, {
            $push: { teachers: teacher._id },
            $inc: { totalTeachers: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Teacher added successfully!',
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role
            }
        });
    } catch (error) {
        console.error('Add teacher error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to add teacher' 
        });
    }
};

// ==================== ADD STUDENT (Director or Teacher) ====================
const addStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const collegeId = req.user.collegeId;
        const addedBy = req.user.id;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, email and password are required' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'User already exists with this email' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new User({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            collegeId,
            createdBy: addedBy,
            provider: 'email',
            total_points: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0
        });
        await student.save();

        await College.findByIdAndUpdate(collegeId, {
            $push: { students: student._id },
            $inc: { totalStudents: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Student added successfully!',
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role
            }
        });
    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to add student' 
        });
    }
};

// ==================== NORMAL REGISTER ====================
const register = async (req, res) => {
    try {
        const { name, email, password, role = 'student', preferred_language = 'en', collegeId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, email and password are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                error: 'Password must be at least 6 characters' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'User already exists with this email' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            preferred_language,
            provider: 'email',
            collegeId: collegeId || null,
            total_points: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0
        });

        await user.save();

        if (collegeId && role === 'student') {
            await College.findByIdAndUpdate(collegeId, {
                $push: { students: user._id },
                $inc: { totalStudents: 1 }
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name, collegeId: user.collegeId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferred_language: user.preferred_language,
                total_points: user.total_points,
                level: user.level,
                collegeId: user.collegeId
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Registration failed. Please try again.' 
        });
    }
};

// ==================== NORMAL LOGIN ====================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email or password',
                forgotPassword: true
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email or password',
                forgotPassword: true
            });
        }

        user.last_activity_date = new Date();
        
        const today = new Date().toDateString();
        const lastActive = user.last_activity_date ? new Date(user.last_activity_date).toDateString() : null;
        
        if (lastActive === today) {
            // Already updated today
        } else if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
            user.current_streak += 1;
            if (user.current_streak > user.longest_streak) {
                user.longest_streak = user.current_streak;
            }
        } else {
            user.current_streak = 1;
        }
        
        await user.save();

        let collegeName = null;
        if (user.collegeId) {
            const college = await College.findById(user.collegeId);
            collegeName = college?.name;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name, collegeId: user.collegeId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                total_points: user.total_points,
                level: user.level,
                current_streak: user.current_streak,
                longest_streak: user.longest_streak,
                preferred_language: user.preferred_language,
                collegeId: user.collegeId,
                collegeName: collegeName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed. Please try again.' 
        });
    }
};

// ==================== CHECK EXISTING ACCOUNT ====================
const checkAccount = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: 'Email is required' 
            });
        }
        
        const user = await User.findOne({ email });
        
        res.json({
            success: true,
            exists: !!user,
            provider: user?.provider || 'email'
        });
    } catch (error) {
        console.error('Check account error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ==================== GET PROFILE ====================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }
        
        let collegeName = null;
        if (user.collegeId) {
            const college = await College.findById(user.collegeId);
            collegeName = college?.name;
        }
        
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                total_points: user.total_points,
                level: user.level,
                current_streak: user.current_streak,
                longest_streak: user.longest_streak,
                preferred_language: user.preferred_language,
                collegeId: user.collegeId,
                collegeName: collegeName
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ==================== GET INTER-COLLEGE LEADERBOARD ====================
const getCollegeLeaderboard = async (req, res) => {
    try {
        const colleges = await College.find()
            .select('name totalXP totalStudents totalTeachers')
            .sort({ totalXP: -1 })
            .limit(50);
        
        const rankedLeaderboard = colleges.map((college, index) => ({
            rank: index + 1,
            name: college.name,
            totalXP: college.totalXP,
            totalStudents: college.totalStudents,
            averageXP: college.totalStudents > 0 ? Math.floor(college.totalXP / college.totalStudents) : 0
        }));
        
        res.json({
            success: true,
            leaderboard: rankedLeaderboard
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET COLLEGE STATS ====================
const getCollegeStats = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        
        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ success: false, error: 'College not found' });
        }
        
        const students = await User.find({ 
            collegeId, 
            role: 'student',
            isActive: true 
        }).select('name total_points level current_streak');
        
        const totalPoints = students.reduce((sum, s) => sum + s.total_points, 0);
        const avgPoints = students.length > 0 ? Math.floor(totalPoints / students.length) : 0;
        
        res.json({
            success: true,
            stats: {
                collegeName: college.name,
                totalStudents: college.totalStudents,
                totalTeachers: college.totalTeachers,
                totalCollegeXP: college.totalXP,
                averageStudentXP: avgPoints,
                students: students.map(s => ({
                    name: s.name,
                    total_points: s.total_points,
                    level: s.level,
                    streak: s.current_streak
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== FORGOT PASSWORD ====================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required' 
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ 
                success: true, 
                message: 'If your email is registered, you will receive a reset link' 
            });
        }
        
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        
        const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;
        
        res.json({
            success: true,
            message: 'Password reset link generated',
            resetLink: resetLink
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Something went wrong' 
        });
    }
};

// ==================== RESET PASSWORD ====================
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Token and new password are required' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 6 characters' 
            });
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid or expired reset link' 
            });
        }
        
        const user = await User.findOne({ 
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid or expired reset link' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password reset successfully! You can now login with your new password.'
        });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Something went wrong' 
        });
    }
};

// ==================== GOOGLE LOGIN SUCCESS ====================
const googleLoginSuccess = (req, res) => {
    if (req.user) {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, role: req.user.role, name: req.user.name, collegeId: req.user.collegeId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.redirect(`http://localhost:5000/auth/success?token=${token}`);
    } else {
        res.redirect('http://localhost:5000/auth/failure');
    }
};

// ==================== FACEBOOK LOGIN SUCCESS ====================
const facebookLoginSuccess = (req, res) => {
    if (req.user) {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, role: req.user.role, name: req.user.name, collegeId: req.user.collegeId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.redirect(`http://localhost:5000/auth/success?token=${token}`);
    } else {
        res.redirect('http://localhost:5000/auth/failure');
    }
};

// ==================== LOGIN FAILURE ====================
const loginFailure = (req, res) => {
    res.json({ 
        success: false, 
        error: 'Social login failed' 
    });
};

// ==================== UPDATE USER LANGUAGE ====================
const updateLanguage = async (req, res) => {
    try {
        const { language_code } = req.body;
        const userId = req.user.id;
        
        await User.findByIdAndUpdate(userId, { preferred_language: language_code });
        
        res.json({
            success: true,
            message: 'Language updated successfully',
            language: language_code
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ==================== EXPORTS ====================
module.exports = { 
    register,
    registerCollege,
    addTeacher,
    addStudent,
    login, 
    checkAccount,
    getProfile,
    getCollegeLeaderboard,
    getCollegeStats,
    forgotPassword,
    resetPassword,
    googleLoginSuccess,
    facebookLoginSuccess,
    loginFailure,
    updateLanguage
};