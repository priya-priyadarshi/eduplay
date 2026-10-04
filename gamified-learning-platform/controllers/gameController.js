const mongoose = require('mongoose');
const Degree = require('../models/Degree');
const Progress = require('../models/Progress');
const User = require('../models/User');

// ================= GET DEGREES =================
const getDegrees = async (req, res) => {
    try {
        const degrees = await Degree.find().sort({ display_order: 1 });
        console.log(`🎓 Found ${degrees.length} degrees`);
        res.json({ success: true, degrees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET BRANCHES BY DEGREE ID =================
const getBranches = async (req, res) => {
    try {
        const degree = await Degree.findById(req.params.degree_id);
        
        if (!degree) {
            return res.status(404).json({ success: false, error: 'Degree not found' });
        }
        
        if (degree.branches && degree.branches.length > 0) {
            const branches = degree.branches.map((branch, index) => ({
                id: index,
                name: branch.name,
                code: branch.code,
                semesterCount: branch.semesters?.length || 0,
                _id: branch._id
            }));
            
            res.json({ success: true, hasBranches: true, branches: branches });
        } else if (degree.semesters && degree.semesters.length > 0) {
            const semesters = degree.semesters.map((sem, index) => ({
                id: index,
                semester_number: sem.semester_number,
                year_number: sem.year_number,
                _id: sem._id
            }));
            res.json({ success: true, hasBranches: false, semesters: semesters });
        } else {
            res.json({ success: true, hasBranches: false, semesters: [] });
        }
    } catch (error) {
        console.error('Error in getBranches:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET SEMESTERS BY BRANCH =================
const getSemestersByBranch = async (req, res) => {
    try {
        const { degreeId, branchIndex } = req.query;
        
        const degree = await Degree.findById(degreeId);
        if (!degree) return res.status(404).json({ success: false, error: 'Degree not found' });
        
        const branch = degree.branches[parseInt(branchIndex)];
        if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
        
        const semesters = branch.semesters.map((sem, idx) => ({
            id: idx,
            semester_number: sem.semester_number,
            year_number: sem.year_number,
            _id: sem._id
        }));
        
        res.json({ success: true, semesters: semesters });
    } catch (error) {
        console.error('Error in getSemestersByBranch:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET SUBJECTS BY BRANCH & SEMESTER =================
const getSubjectsByBranchSemester = async (req, res) => {
    try {
        const { degreeId, branchIndex, semesterIndex } = req.query;
        
        const degree = await Degree.findById(degreeId);
        if (!degree) return res.status(404).json({ success: false, error: 'Degree not found' });
        
        const branch = degree.branches[parseInt(branchIndex)];
        if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
        
        const semester = branch.semesters[parseInt(semesterIndex)];
        if (!semester) return res.status(404).json({ success: false, error: 'Semester not found' });
        
        res.json({ success: true, subjects: semester.subjects });
    } catch (error) {
        console.error('Error in getSubjectsByBranchSemester:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET SEMESTERS (OLD - For backward compatibility) =================
const getSemesters = async (req, res) => {
    try {
        const degree = await Degree.findById(req.params.degree_id);
        if (!degree) return res.status(404).json({ success: false, error: 'Degree not found' });
        
        const semesters = degree.semesters?.map((sem, index) => ({
            id: index,
            semester_number: sem.semester_number,
            year_number: sem.year_number,
            _id: sem._id
        })) || [];
        
        res.json({ success: true, semesters: semesters });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET SUBJECTS (OLD) =================
const getSubjects = async (req, res) => {
    try {
        const semesterId = req.params.semester_id;
        const degrees = await Degree.find();
        let semester = null;
        
        for (const degree of degrees) {
            for (const sem of (degree.semesters || [])) {
                if (sem._id.toString() === semesterId) {
                    semester = sem;
                    break;
                }
            }
            if (semester) break;
        }
        
        if (!semester) return res.status(404).json({ success: false, error: 'Semester not found' });
        
        res.json({ success: true, subjects: semester.subjects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET SUBJECTS BY DEGREE ID & SEMESTER INDEX =================
const getSubjectsBySemesterIndex = async (req, res) => {
    try {
        const { degreeId, semesterIndex } = req.query;
        if (!degreeId || semesterIndex === undefined) {
            return res.status(400).json({ success: false, error: 'degreeId and semesterIndex required' });
        }
        
        const degree = await Degree.findById(degreeId);
        if (!degree) return res.status(404).json({ success: false, error: 'Degree not found' });
        
        const semester = degree.semesters?.[parseInt(semesterIndex)];
        if (!semester) return res.status(404).json({ success: false, error: 'Semester not found' });
        
        res.json({ success: true, subjects: semester.subjects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET TOPICS (FIXED WITH SAMPLE DATA) =================
const getTopics = async (req, res) => {
    try {
        const subjectId = req.params.subject_id;
        console.log('🔍 getTopics called for subjectId:', subjectId);
        
        const degrees = await Degree.find();
        let topics = [];
        
        // Search in branches structure
        for (const degree of degrees) {
            for (const branch of (degree.branches || [])) {
                for (const sem of (branch.semesters || [])) {
                    for (const subject of (sem.subjects || [])) {
                        if (subject._id.toString() === subjectId) {
                            topics = subject.topics || [];
                            console.log('✅ Found topics in branch structure:', topics.length);
                            break;
                        }
                    }
                    if (topics.length) break;
                }
                if (topics.length) break;
            }
            if (topics.length) break;
        }
        
        // If no topics found in branches, search in direct semesters
        if (topics.length === 0) {
            for (const degree of degrees) {
                for (const sem of (degree.semesters || [])) {
                    for (const subject of (sem.subjects || [])) {
                        if (subject._id.toString() === subjectId) {
                            topics = subject.topics || [];
                            console.log('✅ Found topics in direct semesters:', topics.length);
                            break;
                        }
                    }
                    if (topics.length) break;
                }
                if (topics.length) break;
            }
        }
        
        // If still no topics, create sample topics for testing
        if (topics.length === 0) {
            console.log('⚠️ No topics found in DB, creating sample topics');
            topics = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    topic_name: "Programming Fundamentals",
                    topic_order: 1,
                    xp_reward: 50,
                    game_type: "debugger",
                    time_limit: 60
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    topic_name: "Advanced Concepts",
                    topic_order: 2,
                    xp_reward: 75,
                    game_type: "debugger",
                    time_limit: 45
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    topic_name: "Problem Solving",
                    topic_order: 3,
                    xp_reward: 100,
                    game_type: "debugger",
                    time_limit: 30
                }
            ];
        }
        
        const userId = req.user?.id;
        let progressMap = {};
        
        if (userId) {
            const progress = await Progress.find({ user_id: userId });
            progress.forEach(p => { progressMap[p.topic_id] = p; });
        }
        
        const topicsWithProgress = topics.map((topic, index) => ({
            _id: topic._id,
            topic_name: topic.topic_name,
            topic_order: topic.topic_order,
            xp_reward: topic.xp_reward,
            game_type: topic.game_type || 'debugger',
            time_limit: topic.time_limit || 60,
            completed: progressMap[topic._id]?.completed || false,
            score: progressMap[topic._id]?.score || 0,
            xp_earned: progressMap[topic._id]?.xp_earned || 0,
            locked: index > 0 && !progressMap[topics[index - 1]?._id]?.completed
        }));
        
        console.log('📤 Sending topics response:', topicsWithProgress.length);
        res.json({ success: true, topics: topicsWithProgress });
        
    } catch (error) {
        console.error('Error in getTopics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= GET GAME DATA =================
const getGameData = async (req, res) => {
    try {
        const { topic_id } = req.params;
        res.json({
            success: true,
            gameData: {
                topic_id: topic_id,
                topic_name: "Code Debugger Challenge",
                game_type: "debugger",
                xp_reward: 100,
                time_limit: 60,
                content: {}
            }
        });
    } catch (error) {
        console.error('Error in getGameData:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= SUBMIT GAME RESULT =================
const submitGameResult = async (req, res) => {
    try {
        const { topic_id } = req.params;
        const { score, time_taken, perfect, xp_earned, game_type, difficulty } = req.body;
        const userId = req.user.id;
        
        let finalXp = xp_earned || 50;
        
        let existingProgress = await Progress.findOne({ user_id: userId, topic_id });
        if (existingProgress?.completed) {
            return res.status(400).json({ success: false, error: 'Topic already completed' });
        }
        
        if (existingProgress) {
            existingProgress.completed = true;
            existingProgress.score = score || 100;
            existingProgress.xp_earned = finalXp;
            existingProgress.attempts += 1;
            existingProgress.best_time = time_taken;
            existingProgress.completed_at = new Date();
            await existingProgress.save();
        } else {
            await new Progress({
                user_id: userId, topic_id: topic_id, completed: true,
                score: score || 100, xp_earned: finalXp, attempts: 1,
                best_time: time_taken, completed_at: new Date()
            }).save();
        }
        
        const user = await User.findById(userId);
        user.total_points += finalXp;
        user.level = Math.floor(user.total_points / 500) + 1;
        user.last_activity_date = new Date();
        await user.save();
        
        res.json({ success: true, message: 'Game completed!', xp_earned: finalXp });
    } catch (error) {
        console.error('Error in submitGameResult:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================= EXPORTS =================
module.exports = {
    getDegrees,
    getBranches,
    getSemesters,
    getSemestersByBranch,
    getSubjects,
    getSubjectsBySemesterIndex,
    getSubjectsByBranchSemester,
    getTopics,
    getGameData,
    submitGameResult
};