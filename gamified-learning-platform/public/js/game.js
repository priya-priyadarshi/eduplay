// ==================== GAME FUNCTIONS ====================

let currentGameData = null;
let currentTopicId = null;
let gameStartTime = null;
let gameTimerInterval = null;
let selectedDegreeId = null;
let selectedSemesterId = null;
let selectedSubjectId = null;

// ==================== LOAD DEGREES ====================
async function loadDegrees() {
    console.log('🟢 loadDegrees() called');
    const token = localStorage.getItem('token');
    console.log('Token present?', token ? 'YES' : 'NO');
    
    if (!token) {
        console.log('🔴 No token, showing auth modal');
        showAuthModal();
        return;
    }
    
    try {
        console.log('🟡 Fetching /api/games/degrees...');
        const response = await fetch('/api/games/degrees', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('🟢 API Response:', data);
        
        if (data.success && data.degrees) {
            console.log('🟢 Degrees found:', data.degrees.length);
            displayDegrees(data.degrees);
        } else {
            console.log('🔴 No degrees in response');
            const container = document.getElementById('degreeList');
            if (container) {
                container.innerHTML = '<p style="color:white; text-align:center;">❌ No degrees available. Run node seed.js</p>';
            }
        }
    } catch (error) {
        console.error('🔴 Error loading degrees:', error);
        showNotification('Failed to load degrees', 'error');
    }
}

// ==================== DISPLAY DEGREES ====================
function displayDegrees(degrees) {
    console.log('🟢 displayDegrees() called with', degrees.length, 'degrees');
    const container = document.getElementById('degreeList');
    if (!container) {
        console.log('🔴 degreeList container not found!');
        return;
    }
    
    if (!degrees || degrees.length === 0) {
        container.innerHTML = '<p style="color:white; text-align:center;">No degrees available</p>';
        return;
    }
    
    container.innerHTML = degrees.map(degree => `
        <div class="degree-card" onclick="selectDegree('${degree._id}')">
            <h3>🎓 ${degree.name}</h3>
            <p>${degree.duration_years} Years</p>
            <small>Click to explore →</small>
        </div>
    `).join('');
    
    console.log('🟢 Degrees displayed successfully!');
}

// ==================== SELECT DEGREE ====================
async function selectDegree(degreeId) {
    console.log('🟢 selectDegree() called with ID:', degreeId);
    const token = localStorage.getItem('token');
    selectedDegreeId = degreeId;
    
    try {
        const response = await fetch(`/api/games/semesters/${degreeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('🟢 Semesters response:', data);
        
        if (data.success && data.semesters) {
            displaySemesters(data.semesters);
            document.getElementById('semesterSection').style.display = 'block';
            document.getElementById('subjectSection').style.display = 'none';
            document.getElementById('topicSection').style.display = 'none';
        } else {
            console.log('🔴 No semesters found');
            showNotification('No semesters available for this degree', 'error');
        }
    } catch (error) {
        console.error('🔴 Error loading semesters:', error);
        showNotification('Failed to load semesters', 'error');
    }
}

// ==================== DISPLAY SEMESTERS ====================
function displaySemesters(semesters) {
    console.log('🟢 displaySemesters() called with', semesters.length, 'semesters');
    const container = document.getElementById('semesterList');
    if (!container) return;
    
    container.innerHTML = semesters.map(semester => `
        <div class="semester-card" onclick="selectSemester('${semester.id}')">
            <h3>📚 Semester ${semester.semester_number}</h3>
            <p>Year ${semester.year_number}</p>
        </div>
    `).join('');
}

// ==================== SELECT SEMESTER ====================
async function selectSemester(semesterId) {
    console.log('🟢 selectSemester() called with ID:', semesterId);
    const token = localStorage.getItem('token');
    selectedSemesterId = semesterId;
    
    try {
        const response = await fetch(`/api/games/subjects/${semesterId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('🟢 Subjects response:', data);
        
        if (data.success && data.subjects) {
            displaySubjects(data.subjects);
            document.getElementById('subjectSection').style.display = 'block';
            document.getElementById('topicSection').style.display = 'none';
        } else {
            console.log('🔴 No subjects found');
            showNotification('No subjects available for this semester', 'error');
        }
    } catch (error) {
        console.error('🔴 Error loading subjects:', error);
        showNotification('Failed to load subjects', 'error');
    }
}

// ==================== DISPLAY SUBJECTS ====================
function displaySubjects(subjects) {
    console.log('🟢 displaySubjects() called with', subjects.length, 'subjects');
    const container = document.getElementById('subjectList');
    if (!container) return;
    
    container.innerHTML = subjects.map(subject => `
        <div class="subject-card" onclick="selectSubject('${subject._id}')">
            <h3>📖 ${subject.name}</h3>
            <p>${subject.subject_code || ''}</p>
        </div>
    `).join('');
}

// ==================== SELECT SUBJECT ====================
async function selectSubject(subjectId) {
    console.log('🟢 selectSubject() called with ID:', subjectId);
    const token = localStorage.getItem('token');
    selectedSubjectId = subjectId;
    
    try {
        const response = await fetch(`/api/games/topics/${subjectId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('🟢 Topics response:', data);
        
        if (data.success && data.topics) {
            displayTopics(data.topics);
            document.getElementById('topicSection').style.display = 'block';
        } else {
            console.log('🔴 No topics found');
            showNotification('No topics available for this subject', 'error');
        }
    } catch (error) {
        console.error('🔴 Error loading topics:', error);
        showNotification('Failed to load topics', 'error');
    }
}

// ==================== DISPLAY TOPICS ====================
function displayTopics(topics) {
    console.log('🟢 displayTopics() called with', topics.length, 'topics');
    const container = document.getElementById('topicList');
    if (!container) return;
    
    container.innerHTML = topics.map(topic => `
        <div class="topic-card ${topic.completed ? 'completed' : ''} ${topic.locked ? 'locked' : ''}" 
             onclick="${!topic.locked && !topic.completed ? `startGame('${topic._id}', '${topic.game_type}')` : ''}">
            <h3>🎮 ${topic.topic_name}</h3>
            <p>⭐ ${topic.xp_reward} XP</p>
            ${topic.completed ? '<p>✅ Completed ✓</p>' : ''}
            ${topic.locked ? '<p>🔒 Complete previous level first</p>' : ''}
        </div>
    `).join('');
}

// ==================== BACK NAVIGATION ====================
function goBackToDegrees() {
    console.log('🟢 goBackToDegrees() called');
    document.getElementById('semesterSection').style.display = 'none';
    document.getElementById('subjectSection').style.display = 'none';
    document.getElementById('topicSection').style.display = 'none';
    loadDegrees();
}

function goBackToSemesters() {
    console.log('🟢 goBackToSemesters() called');
    document.getElementById('subjectSection').style.display = 'none';
    document.getElementById('topicSection').style.display = 'none';
    if (selectedDegreeId) {
        selectDegree(selectedDegreeId);
    }
}

function goBackToSubjects() {
    console.log('🟢 goBackToSubjects() called');
    document.getElementById('topicSection').style.display = 'none';
    if (selectedSemesterId) {
        selectSemester(selectedSemesterId);
    }
}

// ==================== START GAME ====================
async function startGame(topicId, gameType) {
    console.log('🟢 startGame() called with topicId:', topicId, 'gameType:', gameType);
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/games/play/${topicId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.gameData) {
            currentGameData = data.gameData;
            currentTopicId = topicId;
            gameStartTime = Date.now();
            
            if (gameType === 'match') {
                initMatchGame(data.gameData);
            } else {
                initMemoryGame(data.gameData);
            }
            
            document.getElementById('gameModal').style.display = 'block';
        } else {
            showNotification('Failed to load game', 'error');
        }
    } catch (error) {
        console.error('🔴 Error starting game:', error);
        showNotification('Failed to start game', 'error');
    }
}

// ==================== INIT MATCH GAME ====================
function initMatchGame(gameData) {
    console.log('🟢 initMatchGame() called');
    const container = document.getElementById('gameContainer');
    const content = gameData.content || { pairs: [] };
    
    let matches = 0;
    const totalPairs = content.pairs ? content.pairs.length : 4;
    let selectedItem = null;
    let selectedType = null;
    
    const defaultPairs = [
        { id: 1, term: 'Variable', definition: 'Container to store data' },
        { id: 2, term: 'Function', definition: 'Reusable block of code' },
        { id: 3, term: 'Loop', definition: 'Repeated execution' },
        { id: 4, term: 'Array', definition: 'Collection of elements' }
    ];
    
    const pairs = content.pairs && content.pairs.length > 0 ? content.pairs : defaultPairs;
    
    container.innerHTML = `
        <div class="game-header">
            <div>🎮 ${gameData.topic_name || 'Game'}</div>
            <div>⭐ Reward: ${gameData.xp_reward || 50} XP</div>
            <div>⏱️ Time: <span id="gameTimer">0</span>s</div>
            <div>🎯 Matches: <span id="matchCount">0</span>/${totalPairs}</div>
        </div>
        <div class="match-game">
            <div class="terms-column">
                <h3>📝 Terms</h3>
                <div id="termsList"></div>
            </div>
            <div class="defs-column">
                <h3>📖 Definitions</h3>
                <div id="defsList"></div>
            </div>
        </div>
        <div class="game-footer">
            <p>💡 Click on a term, then click on its matching definition</p>
        </div>
    `;
    
    // Shuffle arrays
    const terms = [...pairs];
    const defs = [...pairs];
    terms.sort(() => Math.random() - 0.5);
    defs.sort(() => Math.random() - 0.5);
    
    const termsContainer = document.getElementById('termsList');
    const defsContainer = document.getElementById('defsList');
    
    terms.forEach(term => {
        const termDiv = document.createElement('div');
        termDiv.className = 'term-card';
        termDiv.textContent = term.term;
        termDiv.dataset.id = term.id;
        termDiv.onclick = () => selectMatchItem(termDiv, 'term');
        termsContainer.appendChild(termDiv);
    });
    
    defs.forEach(def => {
        const defDiv = document.createElement('div');
        defDiv.className = 'def-card';
        defDiv.textContent = def.definition;
        defDiv.dataset.id = def.id;
        defDiv.onclick = () => selectMatchItem(defDiv, 'def');
        defsContainer.appendChild(defDiv);
    });
    
    function selectMatchItem(element, type) {
        if (element.classList.contains('matched')) return;
        
        if (!selectedItem) {
            selectedItem = element;
            selectedType = type;
            element.classList.add('selected');
        } else {
            const firstId = parseInt(selectedItem.dataset.id);
            const secondId = parseInt(element.dataset.id);
            
            if (firstId === secondId && selectedType !== type) {
                selectedItem.classList.add('matched');
                element.classList.add('matched');
                matches++;
                document.getElementById('matchCount').textContent = matches;
                
                if (matches === totalPairs) {
                    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
                    submitGameResult(true, timeTaken);
                }
            } else {
                selectedItem.classList.remove('selected');
            }
            
            selectedItem = null;
            selectedType = null;
        }
    }
    
    startGameTimer();
}

// ==================== INIT MEMORY GAME ====================
function initMemoryGame(gameData) {
    console.log('🟢 initMemoryGame() called');
    const container = document.getElementById('gameContainer');
    const content = gameData.content || { cards: [] };
    
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    
    const defaultCards = [
        { id: 1, text: 'HTML', pairId: 2 },
        { id: 2, text: 'Hypertext Markup Language', pairId: 1 },
        { id: 3, text: 'CSS', pairId: 4 },
        { id: 4, text: 'Cascading Style Sheets', pairId: 3 }
    ];
    
    let cards = content.cards && content.cards.length > 0 ? content.cards : defaultCards;
    const totalPairs = cards.length / 2;
    
    cards.sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="game-header">
            <div>🎮 ${gameData.topic_name || 'Memory Game'}</div>
            <div>⭐ Reward: ${gameData.xp_reward || 50} XP</div>
            <div>⏱️ Time: <span id="gameTimer">0</span>s</div>
            <div>🎯 Matches: <span id="matchesCount">0</span>/${totalPairs}</div>
        </div>
        <div class="memory-game" id="memoryGrid"></div>
        <div class="game-footer">
            <p>💡 Click on cards to find matching pairs</p>
        </div>
    `;
    
    const grid = document.getElementById('memoryGrid');
    
    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.cardId = card.id;
        cardDiv.dataset.pairId = card.pairId;
        cardDiv.textContent = '?';
        cardDiv.onclick = () => flipCard(cardDiv, card);
        grid.appendChild(cardDiv);
    });
    
    function flipCard(element, card) {
        if (!canFlip) return;
        if (element.classList.contains('flipped')) return;
        if (element.classList.contains('matched')) return;
        
        element.textContent = card.text;
        element.classList.add('flipped');
        flippedCards.push({ element, card });
        
        if (flippedCards.length === 2) {
            canFlip = false;
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.card.pairId === card2.card.pairId) {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            document.getElementById('matchesCount').textContent = matchedPairs;
            
            if (matchedPairs === totalPairs) {
                const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
                submitGameResult(true, timeTaken);
            }
            
            flippedCards = [];
            canFlip = true;
        } else {
            setTimeout(() => {
                card1.element.textContent = '?';
                card2.element.textContent = '?';
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
    
    startGameTimer();
}

// ==================== GAME TIMER ====================
function startGameTimer() {
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    
    let seconds = 0;
    const timerElement = document.getElementById('gameTimer');
    
    gameTimerInterval = setInterval(() => {
        seconds++;
        if (timerElement) timerElement.textContent = seconds;
        
        if (seconds >= 120 && currentGameData) {
            clearInterval(gameTimerInterval);
            showNotification('Time\'s up!', 'info');
            submitGameResult(false, seconds);
        }
    }, 1000);
}

// ==================== SUBMIT GAME RESULT ====================
async function submitGameResult(perfect, timeTaken) {
    console.log('🟢 submitGameResult() called');
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/games/submit/${currentTopicId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                score: perfect ? 100 : 70,
                time_taken: timeTaken,
                perfect: perfect
            })
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification(`🎉 Game Complete! +${data.xp_earned || 50} XP Earned!`, 'success');
            closeGameModal();
            
            if (selectedSubjectId) {
                selectSubject(selectedSubjectId);
            }
        } else {
            showNotification(data.error || 'Failed to submit game', 'error');
        }
    } catch (error) {
        console.error('🔴 Error submitting game:', error);
        showNotification('Failed to submit game result', 'error');
    }
}

// ==================== CLOSE GAME MODAL ====================
function closeGameModal() {
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    document.getElementById('gameModal').style.display = 'none';
    document.getElementById('gameContainer').innerHTML = '';
    currentGameData = null;
    currentTopicId = null;
}

// ==================== PAGE LOAD CHECK ====================
window.addEventListener('load', function() {
    console.log('🟢 Window loaded, checking active page...');
    if (document.getElementById('playPage').classList.contains('active')) {
        console.log('🟢 Play page is active, loading degrees...');
        loadDegrees();
    }
});

// Override showPage to detect play page
const originalShowPage = window.showPage;
window.showPage = function(pageName) {
    console.log('🟢 showPage() called with:', pageName);
    originalShowPage(pageName);
    if (pageName === 'play') {
        console.log('🟢 Switched to play page, loading degrees...');
        setTimeout(loadDegrees, 100);
    }
};cons