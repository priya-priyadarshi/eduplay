// ==================== CODE DEBUGGER GAME ====================

let currentGameData = null;
let currentQuestionIndex = 0;
let currentScore = 0;
let currentLives = 3;
let timeLeft = 0;
let timerInterval = null;
let gameActive = false;
let currentDifficulty = 'LOW';
let questions = [];

// Game questions by difficulty
const gameQuestions = {
    LOW: [
        {
            code: `#include <stdio.h>
int main() {
    printf("Hello World")
    return 0;
}`,
            error: "Missing semicolon after printf",
            options: ["Missing semicolon after printf", "Wrong header file", "Missing return statement", "No error"],
            correct: 0,
            explanation: "In C, every statement must end with a semicolon (;)"
        },
        {
            code: `int x = 10;
if (x = 5) {
    printf("x is 5");
}`,
            error: "Assignment operator used instead of comparison",
            options: ["No error", "Wrong variable type", "Assignment operator instead of comparison", "Missing brackets"],
            correct: 2,
            explanation: "Use '==' for comparison, '=' is for assignment"
        }
    ],
    MEDIUM: [
        {
            code: `void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}
int main() {
    int x = 5, y = 10;
    swap(x, y);
    printf("%d %d", x, y);
    return 0;
}`,
            error: "Pass by value - swap won't work",
            options: ["Syntax error", "Pass by value - swap won't work", "Missing return type", "No error"],
            correct: 1,
            explanation: "C uses pass by value. Use pointers to modify original variables"
        }
    ],
    HIGH: [
        {
            code: `int main() {
    char str[5] = "Hello";
    printf("%s", str);
    return 0;
}`,
            error: "Buffer overflow - string too long",
            options: ["No error", "Buffer overflow", "Wrong printf format", "Missing null terminator"],
            correct: 1,
            explanation: "String 'Hello' needs 6 bytes (including null terminator), but array has only 5"
        }
    ]
};

function initDebuggerGame(level) {
    console.log('🎮 Game initializing - Level:', level);
    currentDifficulty = level;
    currentQuestionIndex = 0;
    currentScore = 0;
    currentLives = 3;
    gameActive = true;
    
    if (level === 'LOW') {
        questions = [...gameQuestions.LOW];
        timeLeft = 60;
    } else if (level === 'MEDIUM') {
        questions = [...gameQuestions.MEDIUM];
        timeLeft = 45;
    } else {
        questions = [...gameQuestions.HIGH];
        timeLeft = 30;
    }
    
    questions = shuffleArray(questions);
    displayCurrentQuestion();
    startGameTimer();
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function displayCurrentQuestion() {
    if (!gameActive) return;
    
    const question = questions[currentQuestionIndex];
    if (!question) {
        completeGame();
        return;
    }
    
    const container = document.getElementById('gameContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="debugger-game-container">
            <div class="game-header-modern">
                <div class="game-level-badge ${currentDifficulty.toLowerCase()}">🔥 ${currentDifficulty}</div>
                <div class="game-stats">
                    <div class="stat">⭐ ${currentScore} XP</div>
                    <div class="stat">❤️ ${currentLives} Lives</div>
                    <div class="stat">📊 ${currentQuestionIndex + 1}/${questions.length}</div>
                </div>
                <div class="timer-container">
                    <div class="timer-bar" id="timerBar"></div>
                    <div class="timer-text">⏱️ ${timeLeft}s</div>
                </div>
            </div>
            <div class="code-editor">
                <div class="code-header"><span>📝 debug.c</span><span>C Programming</span></div>
                <pre class="code-content"><code>${escapeHtml(question.code)}</code></pre>
            </div>
            <div class="question-box">
                <h3>❓ What is the error in this code?</h3>
                <div class="options-grid">
                    ${question.options.map((opt, idx) => `
                        <div class="option-card" onclick="submitAnswer(${idx})">
                            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span class="option-text">${escapeHtml(opt)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="game-footer">
                <div class="hint-section">💡 <strong>Hint:</strong> ${escapeHtml(question.explanation)}</div>
            </div>
        </div>
    `;
    
    updateTimerBar();
}

window.submitAnswer = async function(selectedIndex) {
    if (!gameActive) return;
    
    const question = questions[currentQuestionIndex];
    const isCorrect = (selectedIndex === question.correct);
    
    if (isCorrect) {
        let basePoints = currentDifficulty === 'LOW' ? 50 : (currentDifficulty === 'MEDIUM' ? 100 : 200);
        currentScore += basePoints;
        showFeedback(true, `✅ Correct! +${basePoints} XP\n${question.explanation}`, 'success');
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= questions.length) {
            completeGame();
        } else {
            displayCurrentQuestion();
            restartTimer();
        }
    } else {
        currentLives--;
        showFeedback(false, `❌ Wrong! Correct: ${question.options[question.correct]}\n${question.explanation}`, 'error');
        
        if (currentLives <= 0) {
            gameOver();
        } else {
            updateGameUI();
            displayCurrentQuestion();
            restartTimer();
        }
    }
    updateGameUI();
};

function restartTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = currentDifficulty === 'LOW' ? 60 : (currentDifficulty === 'MEDIUM' ? 45 : 30);
    startGameTimer();
}

function showFeedback(isCorrect, message, type) {
    const container = document.getElementById('gameContainer');
    if (!container) return;
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-overlay`;
    feedbackDiv.innerHTML = `
        <div class="feedback-content">
            <div class="feedback-icon">${isCorrect ? '🎉' : '😢'}</div>
            <div class="feedback-message" style="white-space: pre-line;">${escapeHtml(message)}</div>
            <button class="game-btn primary" onclick="this.parentElement.parentElement.remove()">Continue →</button>
        </div>
    `;
    container.appendChild(feedbackDiv);
}

function startGameTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentLives--;
            updateGameUI();
            
            if (currentLives <= 0) {
                gameOver();
            } else {
                showFeedback(false, '⏰ Time\'s up! You lost a life!', 'error');
                displayCurrentQuestion();
                restartTimer();
            }
        } else {
            timeLeft--;
            updateTimerBar();
            const timerText = document.querySelector('.timer-text');
            if (timerText) timerText.textContent = `⏱️ ${timeLeft}s`;
            if (timeLeft <= 10) {
                const timerBar = document.getElementById('timerBar');
                if (timerBar) timerBar.style.background = '#ff4757';
            }
        }
    }, 1000);
}

function updateTimerBar() {
    const timerBar = document.getElementById('timerBar');
    if (!timerBar) return;
    const maxTime = currentDifficulty === 'LOW' ? 60 : (currentDifficulty === 'MEDIUM' ? 45 : 30);
    timerBar.style.width = `${(timeLeft / maxTime) * 100}%`;
}

function updateGameUI() {
    const stats = document.querySelectorAll('.game-stats .stat');
    if (stats.length >= 3) {
        stats[0].innerHTML = `⭐ ${currentScore} XP`;
        stats[1].innerHTML = `❤️ ${currentLives} Lives`;
        stats[2].innerHTML = `📊 ${currentQuestionIndex + 1}/${questions.length}`;
    }
}

async function completeGame() {
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);
    
    const perfectBonus = (currentLives === 3) ? 100 : 0;
    const totalXP = currentScore + perfectBonus;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="game-complete-screen">
            <div class="trophy-icon">🏆</div>
            <h1>GAME COMPLETE!</h1>
            <div class="completion-stats">
                <div class="stat-card"><div class="stat-value">${currentScore}</div><div class="stat-label">Score</div></div>
                <div class="stat-card"><div class="stat-value">+${perfectBonus}</div><div class="stat-label">Bonus</div></div>
                <div class="stat-card"><div class="stat-value">${totalXP}</div><div class="stat-label">Total XP</div></div>
            </div>
            <div class="game-buttons">
                <button class="game-btn primary" onclick="closeGameModal(); location.reload();">📚 Continue</button>
                <button class="game-btn secondary" onclick="initDebuggerGame('${currentDifficulty}')">🔄 Play Again</button>
            </div>
        </div>
    `;
    
    await submitGameResultToBackend(totalXP);
    await refreshUserData();
}

function gameOver() {
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="game-over-screen">
            <div class="sad-icon">😔</div>
            <h1>GAME OVER!</h1>
            <div class="completion-stats">
                <div class="stat-card"><div class="stat-value">${currentScore}</div><div class="stat-label">Points</div></div>
                <div class="stat-card"><div class="stat-value">${currentQuestionIndex}/${questions.length}</div><div class="stat-label">Completed</div></div>
            </div>
            <div class="game-buttons">
                <button class="game-btn primary" onclick="initDebuggerGame('${currentDifficulty}')">🔄 Try Again</button>
                <button class="game-btn secondary" onclick="closeGameModal();">📚 Back</button>
            </div>
        </div>
    `;
}

async function submitGameResultToBackend(xpEarned) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found');
        return;
    }
    
    try {
        console.log(`📤 Submitting ${xpEarned} XP to backend...`);
        
        const response = await fetch('/api/games/submit/debugger-game', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                xp_earned: xpEarned, 
                game_type: 'debugger', 
                difficulty: currentDifficulty,
                score: currentScore,
                perfect: currentLives === 3,
                time_taken: 60 - timeLeft
            })
        });
        
        const data = await response.json();
        console.log('✅ Server response:', data);
        
        if (data.success) {
            showGameNotification(`🎉 You earned ${xpEarned} XP!`, 'success');
        }
    } catch (error) { 
        console.error('❌ Error submitting game result:', error); 
    }
}

async function refreshUserData() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.user) {
            if (window.currentUser !== undefined) {
                window.currentUser = data.user;
            }
            
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('🔄 User data refreshed:', data.user);
            
            const profilePage = document.getElementById('profilePage');
            if (profilePage && profilePage.classList.contains('active')) {
                if (typeof loadProfile === 'function') {
                    loadProfile();
                }
            }
        }
    } catch (err) {
        console.error('Error refreshing user data:', err);
    }
}

function showGameNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `game-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}