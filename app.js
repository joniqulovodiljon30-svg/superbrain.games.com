// Global o'zgaruvchilar
let currentUser = null;
let currentSection = 'login-section';
let numbersToMemorize = [];
let wordsToMemorize = [];
let facesToMemorize = [];
let imagesToMemorize = [];
let timer;
let timeLeft;
let testHistory = [];

// Flashcards uchun o'zgaruvchilar
let currentFlashcardLanguage = '';
let currentFlashcardTopic = '';
let currentFlashcards = [];
let currentCardIndex = 0;
let knownCards = [];
let unknownCards = [];
let testMode = '';

// DOM yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    console.log("Memory Master dasturi ishga tushdi!");
    loadUserData();
    initializeEventListeners();
});

// Foydalanuvchi ma'lumotlarini yuklash
function loadUserData() {
    const savedUser = localStorage.getItem('memoryMasterUser');
    const savedHistory = localStorage.getItem('memoryMasterHistory');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showSection('dashboard');
        updateProfileDisplay();
    }
    
    if (savedHistory) {
        testHistory = JSON.parse(savedHistory);
        updateDashboardStats();
    }
}

// Event listenerlarni o'rnatish
function initializeEventListeners() {
    // Avatar yuklash
    document.getElementById('avatar-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('avatar-preview').innerHTML = 
                    `<img src="${e.target.result}" alt="Profil rasmi">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Profil yaratish
function createProfile() {
    const name = document.getElementById('user-name').value.trim();
    const surname = document.getElementById('user-surname').value.trim();
    const avatar = document.getElementById('avatar-preview').querySelector('img');
    
    if (!name || !surname) {
        alert('Iltimos, ism va familiyangizni kiriting!');
        return;
    }
    
    currentUser = {
        id: Date.now(),
        name: name,
        surname: surname,
        avatar: avatar ? avatar.src : null,
        joinDate: new Date().toLocaleDateString('uz-UZ'),
        stats: {
            totalTests: 0,
            totalWords: 0,
            successRate: 0,
            numbersBest: 0,
            wordsBest: 0,
            flashcardsLearned: 0,
            facesMemorized: 0,
            imagesRemembered: 0
        }
    };
    
    localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
    showSection('dashboard');
    updateProfileDisplay();
}

// Profilni yangilash
function updateProfileDisplay() {
    if (!currentUser) return;
    
    document.getElementById('user-fullname').textContent = 
        `${currentUser.name} ${currentUser.surname}`;
    
    // Avatar
    const userAvatar = document.getElementById('user-avatar');
    if (currentUser.avatar) {
        userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Profil rasmi">`;
    } else {
        userAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
    }
    
    // Statistika
    document.getElementById('total-tests').textContent = `${currentUser.stats.totalTests} test`;
    document.getElementById('total-words').textContent = `${currentUser.stats.totalWords} so'z`;
    document.getElementById('success-rate').textContent = `${currentUser.stats.successRate}% muvaffaqiyat`;
    
    // Dashboard stats
    document.getElementById('numbers-best').textContent = currentUser.stats.numbersBest;
    document.getElementById('words-best').textContent = `${currentUser.stats.wordsBest}%`;
    document.getElementById('flashcards-learned').textContent = currentUser.stats.flashcardsLearned;
    document.getElementById('faces-memorized').textContent = currentUser.stats.facesMemorized;
    document.getElementById('images-remembered').textContent = currentUser.stats.imagesRemembered;
    document.getElementById('total-results').textContent = currentUser.stats.totalTests;
}

// Dashboard statistikasini yangilash
function updateDashboardStats() {
    if (testHistory.length === 0) return;
    
    const numbersTests = testHistory.filter(t => t.category === 'Raqamlar');
    const wordsTests = testHistory.filter(t => t.category === 'So\'zlar');
    const flashcardsTests = testHistory.filter(t => t.category === 'Flashcards');
    const facesTests = testHistory.filter(t => t.category === 'Yuz va Ismlar');
    const imagesTests = testHistory.filter(t => t.category === 'Rasmlar');
    
    if (numbersTests.length > 0) {
        const bestScore = Math.max(...numbersTests.map(t => t.correct));
        currentUser.stats.numbersBest = bestScore;
    }
    
    if (wordsTests.length > 0) {
        const bestAccuracy = Math.max(...wordsTests.map(t => t.accuracy));
        currentUser.stats.wordsBest = bestAccuracy;
    }
    
    if (flashcardsTests.length > 0) {
        currentUser.stats.flashcardsLearned = flashcardsTests.reduce((sum, test) => sum + test.correct, 0);
    }
    
    if (facesTests.length > 0) {
        currentUser.stats.facesMemorized = facesTests.reduce((sum, test) => sum + test.correct, 0);
    }
    
    if (imagesTests.length > 0) {
        currentUser.stats.imagesRemembered = imagesTests.reduce((sum, test) => sum + test.correct, 0);
    }
    
    currentUser.stats.totalTests = testHistory.length;
    currentUser.stats.totalWords = testHistory.reduce((sum, test) => sum + test.total, 0);
    currentUser.stats.successRate = testHistory.length > 0 ? 
        Math.round(testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length) : 0;
    
    localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
    updateProfileDisplay();
}

// Sahifalarni ko'rsatish
function showSection(sectionId) {
    console.log("Sahifaga o'tish:", sectionId);
    
    // Barcha sahifalarni yashirish
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Tanlangan sahifani ko'rsatish
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // Maxsus sahifalar uchun
    if (sectionId === 'results-section') {
        updateHistoryDisplay();
    }
}

// Chiqish
function logout() {
    currentUser = null;
    localStorage.removeItem('memoryMasterUser');
    showSection('login-section');
    
    // Formani tozalash
    document.getElementById('user-name').value = '';
    document.getElementById('user-surname').value = '';
    document.getElementById('avatar-preview').innerHTML = '<i class="fas fa-user-circle"></i>';
}

// ==================== RAQAMLAR FUNCTIONS ====================

function startNumbersGame() {
    const numbersCount = parseInt(document.getElementById('numbers-count').value);
    timeLimit = parseInt(document.getElementById('numbers-time').value);
    
    // Tasodifiy raqamlarni yaratish
    numbersToMemorize = generateRandomNumbers(numbersCount);
    
    // Raqamlarni ko'rsatish
    document.getElementById('numbers-display').textContent = numbersToMemorize.join(' ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    // Eslab qolish sahifasiga o'tish
    showSection('numbers-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateNumbersTimer, 1000);
}

function updateNumbersTimer() {
    timeLeft--;
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        showNumbersInputSection();
    }
}

function showNumbersInputSection() {
    showSection('numbers-input');
    
    // Kirish maydonlarini yaratish
    const inputGrid = document.getElementById('numbers-input-grid');
    inputGrid.innerHTML = '';
    
    for (let i = 0; i < numbersToMemorize.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'number-input';
        input.maxLength = 1;
        input.dataset.index = i;
        
        // Enter bosganda keyingi katakka o'tish
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || this.value.length === 1) {
                const nextIndex = parseInt(this.dataset.index) + 1;
                const nextInput = document.querySelector(`.number-input[data-index="${nextIndex}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
        
        inputGrid.appendChild(input);
    }
    
    // Birinchi katakni fokus qilish
    const firstInput = document.querySelector('.number-input');
    if (firstInput) firstInput.focus();
}

function checkNumbersAnswers() {
    const inputs = document.querySelectorAll('.number-input');
    const resultsList = document.getElementById('numbers-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim();
        const correctAnswer = numbersToMemorize[i].toString();
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer === correctAnswer) {
            resultItem.innerHTML = `<span class="correct">${i + 1}. ${userAnswer}</span>`;
            correctCount++;
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${i + 1}. ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
        }
        
        resultsList.appendChild(resultItem);
    }
    
    // Statistika
    document.getElementById('numbers-correct-count').textContent = correctCount;
    document.getElementById('numbers-incorrect-count').textContent = incorrectCount;
    document.getElementById('numbers-accuracy').textContent = `${Math.round((correctCount / numbersToMemorize.length) * 100)}%`;
    
    // Tarixga qo'shish
    addToHistory('Raqamlar', correctCount, incorrectCount, numbersToMemorize.length);
    
    // Natijalar bo'limini ko'rsatish
    showSection('numbers-results');
}

// ==================== SO'ZLAR FUNCTIONS ====================

function startWordsGame() {
    const wordCount = parseInt(document.getElementById('word-count').value);
    timeLimit = parseInt(document.getElementById('word-time').value);
    const language = document.getElementById('word-language').value;
    
    // Tasodifiy so'zlarni tanlash
    wordsToMemorize = getRandomWords(wordCount, language);
    
    // So'zlarni ko'rsatish
    document.getElementById('words-display').textContent = wordsToMemorize.join(', ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('words-timer').textContent = timeLeft;
    
    // Eslab qolish sahifasiga o'tish
    showSection('words-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateWordsTimer, 1000);
}

function updateWordsTimer() {
    timeLeft--;
    document.getElementById('words-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        showWordsInputSection();
    }
}

function showWordsInputSection() {
    showSection('words-input');
    
    // Kirish maydonlarini yaratish
    const wordInputsContainer = document.getElementById('word-inputs-container');
    wordInputsContainer.innerHTML = '';
    
    for (let i = 0; i < wordsToMemorize.length; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = `${i + 1}. so'z:`;
        label.style.color = 'white';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'word-input';
        input.placeholder = `${i + 1}-so'zni kiriting`;
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        wordInputsContainer.appendChild(inputGroup);
    }
}

function checkWordsAnswers() {
    const inputs = document.querySelectorAll('.word-input');
    const resultsList = document.getElementById('words-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim().toLowerCase();
        const correctAnswer = wordsToMemorize[i].toLowerCase();
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer === correctAnswer) {
            resultItem.innerHTML = `<span class="correct">${i + 1}. ${userAnswer}</span>`;
            correctCount++;
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${i + 1}. ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
        }
        
        resultsList.appendChild(resultItem);
    }
    
    // Statistika
    document.getElementById('words-correct-count').textContent = correctCount;
    document.getElementById('words-incorrect-count').textContent = incorrectCount;
    document.getElementById('words-accuracy').textContent = `${Math.round((correctCount / wordsToMemorize.length) * 100)}%`;
    
    // Tarixga qo'shish
    addToHistory('So\'zlar', correctCount, incorrectCount, wordsToMemorize.length);
    
    // Natijalar bo'limini ko'rsatish
    showSection('words-results');
}

// ==================== FLASHCARDS FUNCTIONS ====================

// Flashcard tili tanlash
function selectFlashcardLanguage(language) {
    currentFlashcardLanguage = language;
    const langData = flashcardDatabase[language];
    
    document.getElementById('flashcards-language-title').textContent = 
        `${langData.language} - Mavzular`;
    showSection('flashcards-topics');
    loadFlashcardTopics(language);
}

// Flashcard mavzularini yuklash
function loadFlashcardTopics(language) {
    const topicsContainer = document.getElementById('topics-container');
    const topics = flashcardDatabase[language].topics;
    
    topicsContainer.innerHTML = '';
    
    Object.entries(topics).forEach(([key, topic]) => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        topicCard.onclick = () => selectFlashcardTopic(key);
        
        topicCard.innerHTML = `
            <h4>${topic.title}</h4>
            <p>${topic.description}</p>
            <div class="topic-stats">
                <span>${topic.words.length} so'z</span>
                <span><i class="fas fa-play-circle"></i> Boshlash</span>
            </div>
        `;
        
        topicsContainer.appendChild(topicCard);
    });
}

// Flashcard mavzusini tanlash
function selectFlashcardTopic(topicKey) {
    currentFlashcardTopic = topicKey;
    const topic = flashcardDatabase[currentFlashcardLanguage].topics[topicKey];
    
    // Tasodifiy 20 ta so'z tanlash (takrorlanmas)
    const allWords = [...topic.words];
    currentFlashcards = [];
    
    for (let i = 0; i < Math.min(20, allWords.length); i++) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        currentFlashcards.push(allWords[randomIndex]);
        allWords.splice(randomIndex, 1);
    }
    
    startFlashcardsGame();
}

// Flashcards o'yinini boshlash
function startFlashcardsGame() {
    currentCardIndex = 0;
    knownCards = [];
    unknownCards = [];
    
    showSection('flashcards-game');
    showCurrentCard();
    
    // "Tayyorman" tugmasini yashirish
    document.querySelector('.finish-btn').style.display = 'none';
}

// Joriy kartani ko'rsatish
function showCurrentCard() {
    if (currentCardIndex >= currentFlashcards.length) {
        finishFlashcards();
        return;
    }
    
    const card = currentFlashcards[currentCardIndex];
    const flashcard = document.getElementById('flashcard');
    
    // Karta holatini qaytarish
    flashcard.classList.remove('flipped');
    
    // Old qismi
    document.getElementById('card-word').textContent = card.word;
    document.getElementById('card-pronunciation').textContent = card.pronunciation;
    
    // Orqa qismi
    document.getElementById('card-translation').textContent = card.translation;
    document.getElementById('card-definition').textContent = card.definition;
    document.getElementById('card-example').textContent = card.example;
    
    // Progress
    document.getElementById('current-card').textContent = currentCardIndex + 1;
    document.getElementById('total-cards').textContent = currentFlashcards.length;
    
    // Agar oxirgi karta bo'lsa, "Tayyorman" tugmasini ko'rsatish
    if (currentCardIndex === currentFlashcards.length - 1) {
        document.querySelector('.finish-btn').style.display = 'block';
    }
}

// Kartani aylantirish
function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

// Keyingi karta
function nextCard() {
    currentCardIndex++;
    showCurrentCard();
}

// Oldingi karta
function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCurrentCard();
    }
}

// "Bilaman" tugmasi
function markAsKnown() {
    knownCards.push(currentFlashcards[currentCardIndex]);
    nextCard();
}

// "Bilmayman" tugmasi
function markAsUnknown() {
    unknownCards.push(currentFlashcards[currentCardIndex]);
    nextCard();
}

// Flashcardsni tugatish
function finishFlashcards() {
    showSection('flashcards-test-mode');
    
    // Test rejimi statistikasini yangilash
    document.getElementById('mode1-stats').textContent = `${currentFlashcards.length} so'z`;
    document.getElementById('mode2-stats').textContent = `${currentFlashcards.length} so'z`;
}

// Flashcards testini boshlash
function startFlashcardsTest(mode) {
    testMode = mode;
    showSection('flashcards-test');
    
    const testContainer = document.getElementById('test-container');
    const typeText = mode === 'foreign-to-native' ? 
        'Chet til so\'zlarini tarjima qiling' : 
        'O\'zbekcha so\'zlarni chet tiliga tarjima qiling';
    
    document.getElementById('test-type').textContent = typeText;
    
    testContainer.innerHTML = '';
    
    currentFlashcards.forEach((card, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'test-question';
        
        if (mode === 'foreign-to-native') {
            questionDiv.innerHTML = `
                <h4>${index + 1}. "${card.word}" so'zining tarjimasini yozing:</h4>
                <p class="pronunciation">${card.pronunciation}</p>
                <input type="text" class="answer-input" data-correct="${card.translation}" 
                       placeholder="Tarjimasini yozing...">
            `;
        } else {
            questionDiv.innerHTML = `
                <h4>${index + 1}. "${card.translation}" so'zining ${flashcardDatabase[currentFlashcardLanguage].language} tilidagi moslashuvini yozing:</h4>
                <input type="text" class="answer-input" data-correct="${card.word}" 
                       placeholder="${flashcardDatabase[currentFlashcardLanguage].language} tilida yozing...">
            `;
        }
        
        testContainer.appendChild(questionDiv);
    });
}

// Flashcards testini tekshirish
function checkFlashcardsTest() {
    const inputs = document.querySelectorAll('.answer-input');
    let correctCount = 0;
    let incorrectCount = 0;
    const results = [];
    
    inputs.forEach((input, index) => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.correct.toLowerCase();
        const card = currentFlashcards[index];
        
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }
        
        results.push({
            question: testMode === 'foreign-to-native' ? card.word : card.translation,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            card: card
        });
    });
    
    // Natijalarni saqlash
    saveFlashcardsResults(correctCount, incorrectCount, results);
    
    // Natijalar sahifasiga o'tkazish
    showFlashcardsResults(correctCount, incorrectCount, results);
}

// Flashcards natijalarini ko'rsatish
function showFlashcardsResults(correct, incorrect, results) {
    const total = correct + incorrect;
    const accuracy = Math.round((correct / total) * 100);
    
    document.getElementById('fc-correct').textContent = correct;
    document.getElementById('fc-incorrect').textContent = incorrect;
    document.getElementById('fc-accuracy').textContent = `${accuracy}%`;
    
    const resultsList = document.getElementById('flashcards-results-list');
    resultsList.innerHTML = '';
    
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        resultItem.innerHTML = `
            <div class="result-question">
                <strong>${index + 1}. ${result.question}</strong>
            </div>
            <div class="result-answers">
                <span class="user-answer">Sizning javobingiz: ${result.userAnswer || "Javob yo'q"}</span>
                ${!result.isCorrect ? `<span class="correct-answer">To'g'ri javob: ${result.correctAnswer}</span>` : ''}
            </div>
            ${result.isCorrect ? '<div class="result-status correct">✓ To\'g\'ri</div>' : '<div class="result-status incorrect">✗ Xato</div>'}
        `;
        
        resultsList.appendChild(resultItem);
    });
    
    showSection('flashcards-results');
}

// Flashcards natijalarini saqlash
function saveFlashcardsResults(correct, incorrect, results) {
    const testResult = {
        id: Date.now(),
        date: new Date().toLocaleString('uz-UZ'),
        category: 'Flashcards',
        language: flashcardDatabase[currentFlashcardLanguage].language,
        topic: flashcardDatabase[currentFlashcardLanguage].topics[currentFlashcardTopic].title,
        correct: correct,
        incorrect: incorrect,
        total: correct + incorrect,
        accuracy: Math.round((correct / (correct + incorrect)) * 100),
        mode: testMode,
        details: results
    };
    
    testHistory.unshift(testResult);
    localStorage.setItem('memoryMasterHistory', JSON.stringify(testHistory));
    
    // Foydalanuvchi statistikasini yangilash
    if (currentUser) {
        currentUser.stats.totalTests++;
        currentUser.stats.totalWords += testResult.total;
        currentUser.stats.flashcardsLearned += correct;
        
        // Success rate yangilash
        const allTests = testHistory.length;
        const totalAccuracy = testHistory.reduce((sum, test) => sum + test.accuracy, 0);
        currentUser.stats.successRate = Math.round(totalAccuracy / allTests);
        
        localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
        updateDashboardStats();
    }
}

// Flashcards testini qayta urinish
function retryFlashcardsTest() {
    startFlashcardsTest(testMode);
}

// ==================== YUZ VA ISMLAR FUNCTIONS ====================

function startFacesGame() {
    const facesCount = parseInt(document.getElementById('faces-count').value);
    timeLimit = parseInt(document.getElementById('faces-time').value);
    
    // Tasodifiy yuzlarni tanlash
    facesToMemorize = getRandomFaces(facesCount);
    
    // Yuzlarni ko'rsatish
    const facesDisplay = document.getElementById('faces-display');
    facesDisplay.innerHTML = '';
    
    facesToMemorize.forEach((face, index) => {
        const faceItem = document.createElement('div');
        faceItem.className = 'face-item';
        faceItem.innerHTML = `
            <div class="face-avatar">${face.avatar}</div>
            <div class="face-name">${face.name}</div>
            <div class="face-country">${face.country} • ${face.age}</div>
        `;
        facesDisplay.appendChild(faceItem);
    });
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('faces-timer').textContent = timeLeft;
    
    // Eslab qolish sahifasiga o'tish
    showSection('faces-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateFacesTimer, 1000);
}

function updateFacesTimer() {
    timeLeft--;
    document.getElementById('faces-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        showFacesInputSection();
    }
}

function showFacesInputSection() {
    showSection('faces-input');
    
    // Kirish maydonlarini yaratish
    const facesInputContainer = document.getElementById('faces-input-container');
    facesInputContainer.innerHTML = '';
    
    facesToMemorize.forEach((face, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = `${index + 1.