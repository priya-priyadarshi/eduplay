const User = require('../models/User');
const Progress = require('../models/Progress');
const Degree = require('../models/Degree');

// ==================== GET STUDENT PROFILE ====================
const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        const student = await User.findById(studentId).select('-password');
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        res.json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                total_points: student.total_points,
                level: student.level,
                current_streak: student.current_streak,
                longest_streak: student.longest_streak,
                preferred_language: student.preferred_language
            }
        });
    } catch (error) {
        console.error('Error in getStudentProfile:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STUDENT PROGRESS (Private) ====================
const getStudentProgress = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        const completedTopics = await Progress.countDocuments({ 
            user_id: req.user.id, 
            completed: true 
        });
        
        const degrees = await Degree.find();
        let totalTopics = 0;
        for (const degree of degrees) {
            for (const branch of degree.branches || []) {
                for (const semester of branch.semesters || []) {
                    for (const subject of semester.subjects || []) {
                        totalTopics += subject.topics.length;
                    }
                }
            }
        }
        
        const completionPercentage = totalTopics > 0 
            ? ((completedTopics / totalTopics) * 100).toFixed(1) 
            : 0;
        
        const recentActivity = await Progress.find({ user_id: req.user.id, completed: true })
            .sort({ completed_at: -1 })
            .limit(10);
        
        res.json({
            success: true,
            stats: {
                total_points: student.total_points,
                level: student.level,
                current_streak: student.current_streak,
                longest_streak: student.longest_streak,
                completed_topics: completedTopics,
                total_topics: totalTopics,
                completion_percentage: completionPercentage
            },
            recent_activity: recentActivity
        });
    } catch (error) {
        console.error('Error in getStudentProgress:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STUDENT MARKS (Private) ====================
const getStudentMarks = async (req, res) => {
    try {
        const progress = await Progress.find({ 
            user_id: req.user.id, 
            completed: true 
        }).sort({ completed_at: -1 });
        
        const marksWithSubjects = [];
        
        for (const p of progress) {
            const degrees = await Degree.find();
            let subjectName = 'Unknown Subject';
            
            for (const degree of degrees) {
                for (const branch of degree.branches || []) {
                    for (const semester of branch.semesters || []) {
                        for (const subject of semester.subjects || []) {
                            const topic = subject.topics.id(p.topic_id);
                            if (topic) {
                                subjectName = subject.name;
                                break;
                            }
                        }
                    }
                }
            }
            
            marksWithSubjects.push({
                subject_name: subjectName,
                score: p.score,
                xp_earned: p.xp_earned,
                completed_at: p.completed_at,
                attempts: p.attempts,
                best_time: p.best_time
            });
        }
        
        res.json({
            success: true,
            marks: marksWithSubjects,
            total_marks: marksWithSubjects.length,
            average_score: marksWithSubjects.length > 0 
                ? (marksWithSubjects.reduce((sum, m) => sum + m.score, 0) / marksWithSubjects.length).toFixed(1)
                : 0
        });
    } catch (error) {
        console.error('Error in getStudentMarks:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STUDENT LEADERBOARD ====================
const getStudentLeaderboard = async (req, res) => {
    try {
        const studentId = req.user.id;
        const collegeId = req.user.collegeId;
        
        const students = await User.find({ 
            collegeId, 
            role: 'student',
            isActive: true 
        }).select('name total_points level current_streak')
          .sort({ total_points: -1 });
        
        const leaderboard = students.map((student, index) => ({
            rank: index + 1,
            name: student.name,
            total_points: student.total_points,
            level: student.level,
            streak: student.current_streak,
            isCurrentUser: student._id.toString() === studentId
        }));
        
        const userRank = leaderboard.findIndex(l => l.isCurrentUser) + 1;
        
        res.json({
            success: true,
            leaderboard: leaderboard,
            user_rank: userRank,
            total_students: students.length
        });
    } catch (error) {
        console.error('Error in getStudentLeaderboard:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getStudentProfile,
    getStudentProgress,
    getStudentMarks,
    getStudentLeaderboard
};