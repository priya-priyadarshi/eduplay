const Progress = require('../models/Progress');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Degree = require('../models/Degree');

const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        
        // Get total topics count
        const degrees = await Degree.find();
        let totalTopics = 0;
        for (const degree of degrees) {
            for (const semester of degree.semesters) {
                for (const subject of semester.subjects) {
                    totalTopics += subject.topics.length;
                }
            }
        }
        
        const completed = await Progress.countDocuments({ user_id: userId, completed: true });
        
        const badges = await Badge.find();
        
        const userBadges = [];
        // Simple badge logic
        if (completed >= 1) {
            userBadges.push({ name: 'First Victory', description: 'Complete first topic', icon: '🏆' });
        }
        if (user.current_streak >= 7) {
            userBadges.push({ name: '7-Day Warrior', description: '7 day streak', icon: '⚔️' });
        }
        
        const recentProgress = await Progress.find({ user_id: userId, completed: true })
            .sort({ completed_at: -1 })
            .limit(5);
        
        const recentActivity = recentProgress.map(p => ({
            topic_name: p.topic_id,
            xp_earned: p.xp_earned,
            completed_at: p.completed_at
        }));
        
        res.json({
            success: true,
            stats: {
                total_points: user.total_points,
                level: user.level,
                current_streak: user.current_streak,
                longest_streak: user.longest_streak,
                completed_topics: completed,
                total_topics: totalTopics,
                completion_percentage: totalTopics > 0 ? ((completed / totalTopics) * 100).toFixed(1) : 0
            },
            badges: userBadges,
            recent_activity: recentActivity
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getUserProgress };