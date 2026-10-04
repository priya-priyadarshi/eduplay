const User = require('../models/User');

const getLeaderboard = async (req, res) => {
    try {
        const { type = 'overall' } = req.query;
        
        let sortField = 'total_points';
        if (type === 'streak') {
            sortField = 'current_streak';
        }
        
        const leaderboard = await User.find({ role: 'student' })
            .sort({ [sortField]: -1 })
            .limit(50)
            .select('name total_points level current_streak');
        
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            total_points: user.total_points,
            level: user.level,
            streak: user.current_streak
        }));
        
        const userId = req.user.id;
        const allUsers = await User.find({ role: 'student' }).sort({ total_points: -1 });
        const userRank = allUsers.findIndex(u => u._id.toString() === userId) + 1;
        
        res.json({
            success: true,
            leaderboard: rankedLeaderboard,
            user_rank: userRank
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getLeaderboard };