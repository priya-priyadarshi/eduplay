const User = require('../models/User');
const College = require('../models/College');
const Progress = require('../models/Progress');
const Degree = require('../models/Degree');

// ==================== GET TEACHER'S CLASSES ====================
const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const collegeId = req.user.collegeId;
        
        // Get all students in the college
        const students = await User.find({ 
            collegeId, 
            role: 'student',
            isActive: true 
        }).select('name email total_points level current_streak');
        
        // Get all subjects (for teacher to add content)
        const degrees = await Degree.find();
        
        res.json({
            success: true,
            stats: {
                totalStudents: students.length,
                averagePoints: students.length > 0 
                    ? Math.floor(students.reduce((sum, s) => sum + s.total_points, 0) / students.length) 
                    : 0,
                activeStudents: students.filter(s => s.current_streak > 0).length
            },
            students: students,
            degrees: degrees
        });
    } catch (error) {
        console.error('Error in getTeacherClasses:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STUDENT PROGRESS (Teacher view) ====================
const getStudentProgress = async (req, res) => {
    try {
        const { studentId } = req.params;
        const teacherCollegeId = req.user.collegeId;
        
        // Check if student belongs to same college
        const student = await User.findOne({ 
            _id: studentId, 
            collegeId: teacherCollegeId,
            role: 'student'
        });
        
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                error: 'Student not found in your college' 
            });
        }
        
        // Get student's progress
        const progress = await Progress.find({ user_id: studentId });
        
        // Get student's stats
        res.json({
            success: true,
            student: {
                name: student.name,
                email: student.email,
                total_points: student.total_points,
                level: student.level,
                current_streak: student.current_streak,
                longest_streak: student.longest_streak
            },
            progress: progress
        });
    } catch (error) {
        console.error('Error in getStudentProgress:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ADD SUBJECT (Teacher) ====================
const addSubject = async (req, res) => {
    try {
        const { degreeId, semesterIndex, branchIndex, subjectName, subjectCode } = req.body;
        const collegeId = req.user.collegeId;
        
        // Find the degree
        const degree = await Degree.findById(degreeId);
        if (!degree) {
            return res.status(404).json({ success: false, error: 'Degree not found' });
        }
        
        // Add subject to the specified branch and semester
        if (branchIndex !== undefined && degree.branches[branchIndex]) {
            degree.branches[branchIndex].semesters[semesterIndex].subjects.push({
                name: subjectName,
                subject_code: subjectCode,
                topics: []
            });
        } else if (degree.semesters[semesterIndex]) {
            degree.semesters[semesterIndex].subjects.push({
                name: subjectName,
                subject_code: subjectCode,
                topics: []
            });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid semester or branch' });
        }
        
        await degree.save();
        
        res.json({
            success: true,
            message: 'Subject added successfully!'
        });
    } catch (error) {
        console.error('Error in addSubject:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ADD TOPIC (Teacher) ====================
const addTopic = async (req, res) => {
    try {
        const { subjectId, topicName, xpReward, gameType, timeLimit } = req.body;
        
        // Find the subject and add topic
        const degree = await Degree.findOne({ 'semesters.subjects._id': subjectId });
        
        if (degree) {
            for (const semester of degree.semesters) {
                for (const subject of semester.subjects) {
                    if (subject._id.toString() === subjectId) {
                        subject.topics.push({
                            topic_name: topicName,
                            topic_order: subject.topics.length + 1,
                            xp_reward: xpReward || 50,
                            game_type: gameType || 'debugger',
                            time_limit: timeLimit || 60
                        });
                        await degree.save();
                        return res.json({ success: true, message: 'Topic added successfully!' });
                    }
                }
            }
        }
        
        // Check in branches structure
        const degreeWithBranch = await Degree.findOne({ 'branches.semesters.subjects._id': subjectId });
        if (degreeWithBranch) {
            for (const branch of degreeWithBranch.branches) {
                for (const semester of branch.semesters) {
                    for (const subject of semester.subjects) {
                        if (subject._id.toString() === subjectId) {
                            subject.topics.push({
                                topic_name: topicName,
                                topic_order: subject.topics.length + 1,
                                xp_reward: xpReward || 50,
                                game_type: gameType || 'debugger',
                                time_limit: timeLimit || 60
                            });
                            await degreeWithBranch.save();
                            return res.json({ success: true, message: 'Topic added successfully!' });
                        }
                    }
                }
            }
        }
        
        res.status(404).json({ success: false, error: 'Subject not found' });
    } catch (error) {
        console.error('Error in addTopic:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getTeacherClasses,
    getStudentProgress,
    addSubject,
    addTopic
};