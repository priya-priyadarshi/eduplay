// ==================== LEADERBOARD ====================

// Load leaderboard
async function loadLeaderboard(type = 'overall') {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showAuthModal();
        return;
    }
    
    try {
        const response = await fetch(`/api/leaderboard?type=${type}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            displayLeaderboard(data.leaderboard, data.user_rank);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showNotification('Failed to load leaderboard', 'error');
    }
}

// Display leaderboard
function displayLeaderboard(leaderboard, userRank) {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    
    if (!leaderboard || leaderboard.length === 0) {
        container.innerHTML = '<div class="leaderboard-row">No players yet. Be the first!</div>';
        return;
    }
    
    let html = `
        <div class="leaderboard-row header">
            <div>🏆 Rank</div>
            <div>👤 Player</div>
            <div>⭐ Points</div>
            <div>🎯 Level</div>
        </div>
    `;
    
    leaderboard.forEach(user => {
        let rankClass = '';
        if (user.rank === 1) rankClass = 'rank-1';
        else if (user.rank === 2) rankClass = 'rank-2';
        else if (user.rank === 3) rankClass = 'rank-3';
        
        html += `
            <div class="leaderboard-row ${rankClass}">
                <div><strong>#${user.rank}</strong></div>
                <div>${user.name || 'Anonymous'}</div>
                <div>⭐ ${user.total_points || 0}</div>
                <div>🎯 ${user.level || 1}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Display user rank
    const rankCard = document.getElementById('userRankCard');
    if (rankCard && userRank) {
        if (userRank <= 10) {
            rankCard.innerHTML = `
                <h3>🎉 Congratulations! 🎉</h3>
                <p>You are ranked <strong>#${userRank}</strong> globally!</p>
                <p>Keep playing to reach the top!</p>
            `;
        } else {
            rankCard.innerHTML = `
                <h3>📊 Your Global Rank</h3>
                <p style="font-size: 2rem; font-weight: bold;">#${userRank}</p>
                <p>Play more games to improve your ranking!</p>
            `;
        }
    }
}

// Update leaderboard tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});