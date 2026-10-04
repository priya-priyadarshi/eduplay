// ==================== AI POWERED RUNNING GAME WITH GEMINI API ====================
console.log("🎮 ai-game.js loading with AI Question Generator...");

// API Configuration
const AI_API_KEY = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : "AIzaSyCAP1lihaaa8AWOQVuPoih0-AIFdnF1N1o";

// ==================== GEMINI AI QUESTION GENERATOR ====================
async function generateAIQuestions(topic, subject, questionCount) {
    console.log(`🤖 Generating ${questionCount} AI questions for: ${topic} (${subject})`);
    
    const prompt = `Generate ${questionCount} multiple choice questions about "${topic}" in ${subject} subject for college students.
    The questions should be educational, topic-specific, and test deep understanding.
    
    Return ONLY valid JSON array format. No extra text before or after.
    Each question must have:
    - "question": the question text
    - "options": array of 4 options (A, B, C, D)
    - "correct": index of correct answer (0, 1, 2, or 3)
    - "explanation": brief explanation (max 15 words)
    
    Example: [{"question": "What is a variable in programming?", "options": ["A container for storing data", "A type of loop", "A function", "An error"], "correct": 0, "explanation": "Variable stores data in memory"}]`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${AI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error("API Error:", data.error);
            return getFallbackQuestions(topic);
        }
        
        let jsonText = data.candidates[0].content.parts[0].text;
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const questions = JSON.parse(jsonText);
        
        console.log(`✅ Generated ${questions.length} AI questions`);
        localStorage.setItem(`ai_questions_${topic}_${subject}`, JSON.stringify(questions));
        return questions;
        
    } catch (error) {
        console.error("❌ AI Generation Error:", error);
        return getFallbackQuestions(topic);
    }
}

function getFallbackQuestions(topic) {
    return [
        { question: `What is the main concept of ${topic}?`, options: ["Core principle", "Advanced theory", "Practical application", "Historical context"], correct: 0, explanation: "Core concept is fundamental" },
        { question: `Why is ${topic} important?`, options: ["Foundation knowledge", "Optional topic", "Not important", "Just for exam"], correct: 0, explanation: "Provides essential knowledge" },
        { question: `Where is ${topic} applied?`, options: ["Industry", "Academia", "Research", "All areas"], correct: 3, explanation: "Widely applicable" }
    ];
}

function showAILoadingModal(text) {
    let modal = document.getElementById('aiLoadingModal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'aiLoadingModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:10000;';
        modal.innerHTML = `<div style="background:linear-gradient(135deg,#667eea,#764ba2); padding:40px; border-radius:30px; text-align:center; color:white;">
            <div style="font-size:60px; animation:pulse 1s infinite;">🤖</div>
            <h3 id="aiLoadingText" style="margin:20px 0;">Generating AI questions...</h3>
            <p>Please wait while AI creates questions for you</p>
            <div style="width:200px; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; margin-top:20px; overflow:hidden;">
                <div style="width:50%; height:100%; background:white; animation:loading 1s infinite;"></div>
            </div>
        </div>`;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                             @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                             @keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }`;
        document.head.appendChild(style);
    }
    document.getElementById('aiLoadingText').innerText = text;
    modal.style.display = 'flex';
}

function hideAILoadingModal() {
    const modal = document.getElementById('aiLoadingModal');
    if(modal) modal.style.display = 'none';
}

function showAIToast(message, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); 
        background: ${type === 'success' ? '#4CAF50' : '#f44336'}; 
        color: white; padding: 10px 20px; border-radius: 10px; 
        z-index: 10001; animation: fadeOut 2s forwards; font-size: 14px;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==================== GAME STATE VARIABLES ====================
let aiGameRunning = false;
let aiCanvas, aiCtx;
let aiGameLoop, aiSpawnLoop;
let aiFrameCount = 0;

let aiPlayer = { x: 100, y: 350, width: 45, height: 45, yVelocity: 0, isJumping: false, gravity: 0.8, jumpPower: -12 };

let aiObstacles = [];
let aiCoins = [];
let aiAnswerBoxes = [];

let aiScore = 0;
let aiCoinsCollected = 0;
let aiLevel = 1;
let aiCurrentQuestions = [];
let aiCurrentQuestionIndex = 0;
let aiCurrentTopic = "";
let aiCurrentSubject = "";

let aiSelectedCharacter = "runner";
const aiCharacters = {
    runner: { name: "Runner", color: "#FF6B6B", icon: "🏃", unlocked: true, price: 0 },
    ninja: { name: "Ninja", color: "#4ECDC4", icon: "🥷", unlocked: false, price: 500 },
    robot: { name: "Robot", color: "#45B7D1", icon: "🤖", unlocked: false, price: 1000 }
};

// ==================== MAIN GAME FUNCTION WITH AI ====================
window.startAIGame = async function(topic, subject) {
    console.log("🎮 AI startAIGame called with:", topic, subject);
    aiCurrentTopic = topic;
    aiCurrentSubject = subject;
    
    aiLevel = parseInt(localStorage.getItem(`ai_game_level_${topic}`)) || 1;
    aiCoinsCollected = parseInt(localStorage.getItem(`ai_game_coins_${topic}`)) || 0;
    aiScore = 0;
    aiCurrentQuestionIndex = 0;
    
    const requiredQ = Math.min(5 + (aiLevel - 1), 10);
    
    // Check cache
    const cached = localStorage.getItem(`ai_questions_${topic}_${subject}`);
    if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.length >= requiredQ) {
            console.log("📦 Using cached questions");
            aiCurrentQuestions = parsed.slice(0, requiredQ);
            startAIGameUI();
            return;
        }
    }
    
    showAILoadingModal(`🤖 Generating ${requiredQ} AI questions for "${topic}"...`);
    
    try {
        const questions = await generateAIQuestions(topic, subject, requiredQ);
        hideAILoadingModal();
        aiCurrentQuestions = questions;
        startAIGameUI();
        showAIToast("✅ AI questions generated!", "success");
    } catch (error) {
        hideAILoadingModal();
        aiCurrentQuestions = getFallbackQuestions(topic);
        startAIGameUI();
        showAIToast("⚠️ Using default questions", "error");
    }
    
    document.getElementById('aiGameModal').style.display = 'flex';
};

function startAIGameUI() {
    const container = document.getElementById('aiGameContainer');
    if (!container) {
        console.error("❌ aiGameContainer not found!");
        return;
    }
    
    container.innerHTML = `
        <div style="position: relative;">
            <canvas id="aiGameCanvas" width="900" height="550" style="background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; display: block; margin: 0 auto; cursor: pointer;"></canvas>
            <div style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.6); padding: 8px 15px; border-radius: 20px; color: white; font-size: 14px;">
                🎯 Level: ${aiLevel} | 💰 Coins: ${aiCoinsCollected} | 🏆 Score: ${aiScore} | ❓ Q: ${aiCurrentQuestionIndex+1}/${aiCurrentQuestions.length}
            </div>
            <div id="aiQuestionPopup" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.95); padding: 25px; border-radius: 20px; color: white; text-align: center; display: none; min-width: 400px; z-index: 100;">
                <h3 id="aiQuestionText"></h3>
                <div id="aiAnswerOptions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px;"></div>
            </div>
            <div id="aiGameOverScreen" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.95); padding: 30px; border-radius: 20px; text-align: center; display: none; z-index: 100;">
                <h2>Game Over!</h2>
                <p>Score: <span id="aiFinalScore">0</span></p>
                <p>Coins: <span id="aiFinalCoins">0</span></p>
                <button onclick="aiReviveGame()" style="background: #FF9800; padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; margin: 10px;">Revive (500 Coins)</button>
                <button onclick="closeAIGameModal()" style="background: #667eea; padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer;">Exit</button>
            </div>
        </div>
    `;
    
    aiCanvas = document.getElementById('aiGameCanvas');
    aiCtx = aiCanvas.getContext('2d');
    
    aiCanvas.onclick = () => {
        if (aiGameRunning && !aiPlayer.isJumping) {
            aiPlayer.isJumping = true;
            aiPlayer.yVelocity = aiPlayer.jumpPower;
        }
    };
    
    document.onkeydown = (e) => {
        if (e.code === 'Space' && aiGameRunning && !aiPlayer.isJumping) {
            e.preventDefault();
            aiPlayer.isJumping = true;
            aiPlayer.yVelocity = aiPlayer.jumpPower;
        }
    };
    
    aiStartGame();
}

function aiStartGame() {
    if (aiGameRunning) return;
    aiGameRunning = true;
    aiScore = 0;
    aiObstacles = [];
    aiCoins = [];
    aiAnswerBoxes = [];
    aiFrameCount = 0;
    aiPlayer.y = 350;
    aiPlayer.yVelocity = 0;
    aiPlayer.isJumping = false;
    
    if (aiGameLoop) clearInterval(aiGameLoop);
    if (aiSpawnLoop) clearInterval(aiSpawnLoop);
    
    aiGameLoop = setInterval(aiUpdateGame, 20);
    aiSpawnLoop = setInterval(aiSpawnObjects, 1200);
}

function aiUpdateGame() {
    if (!aiGameRunning) return;
    
    if (aiPlayer.isJumping) {
        aiPlayer.yVelocity += aiPlayer.gravity;
        aiPlayer.y += aiPlayer.yVelocity;
        if (aiPlayer.y >= 350) {
            aiPlayer.y = 350;
            aiPlayer.isJumping = false;
            aiPlayer.yVelocity = 0;
        }
    }
    
    for (let i = 0; i < aiObstacles.length; i++) {
        aiObstacles[i].x -= 6;
        if (aiObstacles[i].x + aiObstacles[i].width < 0) aiObstacles.splice(i, 1);
        
        if (aiObstacles[i].x < aiPlayer.x + aiPlayer.width && 
            aiObstacles[i].x + aiObstacles[i].width > aiPlayer.x &&
            aiObstacles[i].y < aiPlayer.y + aiPlayer.height && 
            aiObstacles[i].y + aiObstacles[i].height > aiPlayer.y) {
            aiGameOver();
        }
    }
    
    for (let i = 0; i < aiCoins.length; i++) {
        aiCoins[i].x -= 6;
        if (aiCoins[i].x + 15 < 0) aiCoins.splice(i, 1);
        
        if (aiCoins[i].x < aiPlayer.x + aiPlayer.width && 
            aiCoins[i].x + 15 > aiPlayer.x &&
            aiCoins[i].y < aiPlayer.y + aiPlayer.height && 
            aiCoins[i].y + 15 > aiPlayer.y) {
            aiCoinsCollected += 10;
            aiCoins.splice(i, 1);
            aiUpdateUI();
        }
    }
    
    for (let i = 0; i < aiAnswerBoxes.length; i++) {
        aiAnswerBoxes[i].x -= 6;
        if (aiAnswerBoxes[i].x + 60 < 0) aiAnswerBoxes.splice(i, 1);
        
        if (aiAnswerBoxes[i].x < aiPlayer.x + aiPlayer.width && 
            aiAnswerBoxes[i].x + 60 > aiPlayer.x &&
            aiAnswerBoxes[i].y < aiPlayer.y + aiPlayer.height && 
            aiAnswerBoxes[i].y + 60 > aiPlayer.y) {
            aiShowQuestionPopup(aiAnswerBoxes[i]);
            aiAnswerBoxes.splice(i, 1);
        }
    }
    
    aiFrameCount++;
    aiDrawGame();
}

function aiSpawnObjects() {
    if (!aiGameRunning) return;
    const rand = Math.random();
    if (rand < 0.25) {
        aiObstacles.push({ x: 900, y: 360, width: 35, height: 45 });
    } else if (rand < 0.6) {
        aiCoins.push({ x: 900, y: 350, width: 15, height: 15 });
    } else if (rand < 0.9 && aiCurrentQuestionIndex < aiCurrentQuestions.length) {
        const q = aiCurrentQuestions[aiCurrentQuestionIndex];
        aiAnswerBoxes.push({ 
            x: 900, y: 310, width: 60, height: 60, 
            question: q.question, options: q.options, correct: q.correct, explanation: q.explanation
        });
    }
}

function aiDrawGame() {
    aiCtx.clearRect(0, 0, 900, 550);
    
    aiCtx.fillStyle = "#2C1810";
    aiCtx.fillRect(0, 395, 900, 155);
    aiCtx.fillStyle = "#8B5E3C";
    for(let i = 0; i < 25; i++) {
        aiCtx.fillRect((aiFrameCount * 3 + i * 80) % 900, 390, 50, 8);
    }
    
    aiObstacles.forEach(obs => {
        aiCtx.fillStyle = "#D32F2F";
        aiCtx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    
    aiCoins.forEach(coin => {
        aiCtx.fillStyle = "#FFD700";
        aiCtx.beginPath();
        aiCtx.arc(coin.x + 7.5, coin.y + 7.5, 8, 0, Math.PI * 2);
        aiCtx.fill();
    });
    
    aiAnswerBoxes.forEach(box => {
        aiCtx.fillStyle = "#9C27B0";
        aiCtx.fillRect(box.x, box.y, box.width, box.height);
        aiCtx.fillStyle = "white";
        aiCtx.font = "bold 28px Arial";
        aiCtx.fillText("?", box.x + 20, box.y + 42);
    });
    
    const char = aiCharacters[aiSelectedCharacter];
    aiCtx.fillStyle = char.color;
    aiCtx.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
    aiCtx.font = "32px Arial";
    aiCtx.fillText(char.icon, aiPlayer.x + 8, aiPlayer.y + 38);
}

function aiShowQuestionPopup(box) {
    aiGameRunning = false;
    clearInterval(aiGameLoop);
    clearInterval(aiSpawnLoop);
    
    const popup = document.getElementById('aiQuestionPopup');
    document.getElementById('aiQuestionText').innerHTML = `📚 ${box.question}`;
    
    const optionsDiv = document.getElementById('aiAnswerOptions');
    optionsDiv.innerHTML = box.options.map((opt, idx) => `
        <button onclick="aiCheckAnswer(${idx}, ${box.correct}, \`${box.explanation}\`)" 
            style="background: #667eea; color: white; padding: 12px; border: none; border-radius: 12px; cursor: pointer;">
            ${String.fromCharCode(65+idx)}. ${opt}
        </button>
    `).join('');
    
    popup.style.display = 'block';
}

function aiCheckAnswer(selected, correct, explanation) {
    const popup = document.getElementById('aiQuestionPopup');
    popup.style.display = 'none';
    
    if (selected === correct) {
        aiScore += 100;
        aiCurrentQuestionIndex++;
        aiUpdateUI();
        
        if (aiCurrentQuestionIndex >= aiCurrentQuestions.length) {
            aiLevelUp();
        } else {
            aiGameRunning = true;
            aiGameLoop = setInterval(aiUpdateGame, 20);
            aiSpawnLoop = setInterval(aiSpawnObjects, 1200);
        }
    } else {
        alert(`❌ Wrong! ${explanation}`);
        aiGameOver();
    }
}

function aiLevelUp() {
    aiGameRunning = false;
    clearInterval(aiGameLoop);
    clearInterval(aiSpawnLoop);
    
    aiCoinsCollected += 100;
    aiLevel++;
    localStorage.setItem(`ai_game_level_${aiCurrentTopic}`, aiLevel);
    localStorage.setItem(`ai_game_coins_${aiCurrentTopic}`, aiCoinsCollected);
    
    alert(`🎉 Level Up! Level ${aiLevel}\n💰 Bonus: 100 coins!`);
    aiCurrentQuestionIndex = 0;
    const requiredQ = Math.min(5 + (aiLevel - 1), 10);
    aiCurrentQuestions = aiCurrentQuestions.slice(0, requiredQ);
    aiStartGame();
}

function aiGameOver() {
    aiGameRunning = false;
    clearInterval(aiGameLoop);
    clearInterval(aiSpawnLoop);
    
    document.getElementById('aiFinalScore').innerText = aiScore;
    document.getElementById('aiFinalCoins').innerText = aiCoinsCollected;
    document.getElementById('aiGameOverScreen').style.display = 'block';
    localStorage.setItem(`ai_game_coins_${aiCurrentTopic}`, aiCoinsCollected);
}

function aiReviveGame() {
    if (aiCoinsCollected >= 500) {
        aiCoinsCollected -= 500;
        localStorage.setItem(`ai_game_coins_${aiCurrentTopic}`, aiCoinsCollected);
        document.getElementById('aiGameOverScreen').style.display = 'none';
        aiStartGame();
    } else {
        alert(`Need 500 coins! You have ${aiCoinsCollected} coins.`);
    }
}

function aiUpdateUI() {
    const scoreDiv = document.querySelector('#aiGameContainer > div > div:first-child');
    if (scoreDiv) {
        scoreDiv.innerHTML = `🎯 Level: ${aiLevel} | 💰 Coins: ${aiCoinsCollected} | 🏆 Score: ${aiScore} | ❓ Q: ${aiCurrentQuestionIndex+1}/${aiCurrentQuestions.length}`;
    }
}

window.closeAIGameModal = function() {
    if (aiGameLoop) clearInterval(aiGameLoop);
    if (aiSpawnLoop) clearInterval(aiSpawnLoop);
    aiGameRunning = false;
    document.getElementById('aiGameModal').style.display = 'none';
};

console.log("✅ ai-game.js loaded successfully with AI Generator!");