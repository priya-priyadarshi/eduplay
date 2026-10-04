const User = require('../models/User');
const College = require('../models/College');
const Progress = require('../models/Progress');

// ==================== DELETE TEACHER ====================
const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const collegeId = req.user.collegeId;

        // Check if teacher exists in same college
        const teacher = await User.findOne({ 
            _id: teacherId, 
            collegeId, 
            role: 'teacher' 
        });

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                error: 'Teacher not found in your college' 
            });
        }

        // Delete teacher
        await User.findByIdAndDelete(teacherId);

        // Update college teachers count
        await College.findByIdAndUpdate(collegeId, {
            $pull: { teachers: teacherId },
            $inc: { totalTeachers: -1 }
        });

        res.json({
            success: true,
            message: 'Teacher deleted successfully!'
        });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== DELETE STUDENT ====================
const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const collegeId = req.user.collegeId;

        // Check if student exists in same college
        const student = await User.findOne({ 
            _id: studentId, 
            collegeId, 
            role: 'student' 
        });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                error: 'Student not found in your college' 
            });
        }

        // Delete student's progress records
        await Progress.deleteMany({ user_id: studentId });

        // Delete student
        await User.findByIdAndDelete(studentId);

        // Update college students count
        await College.findByIdAndUpdate(collegeId, {
            $pull: { students: studentId },
            $inc: { totalStudents: -1 }
        });

        res.json({
            success: true,
            message: 'Student deleted successfully!'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET ALL TEACHERS ====================
const getAllTeachers = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;

        const teachers = await User.find({ 
            collegeId, 
            role: 'teacher',
            isActive: true 
        }).select('name email total_points level');

        res.json({
            success: true,
            teachers: teachers
        });
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    deleteTeacher,
    deleteStudent,
    getAllTeachers
};