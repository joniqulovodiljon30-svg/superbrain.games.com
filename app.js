// Global o'zgaruvchilar
let currentUser = null;
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

// DOM yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Memory Master ishga tushdi!");
    checkUserLogin();
    setupEventListeners();
});

// Foydalanuvchi login holatini tekshirish
function checkUserLogin() {
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
function setupEventListeners() {
    // Avatar yuklash
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

// Avatar yuklash
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').innerHTML = 
                `<img src="${e.target.result}" alt="Profil rasmi" style="width:100%;height:100%;border-radius:50%;">`;
        };
        reader.readAsDataURL(file);
    }
}

// Profil yaratish
function createProfile() {
    const name = document.getElementById('user-name').value.trim();
    const surname = document.getElementById('user-surname').value.trim();
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarImg = avatarPreview.querySelector('img');

    if (!name || !surname) {
        alert('Iltimos, ism va familiyangizni kiriting!');
        return;
    }

    currentUser = {
        id: Date.now(),
        name: name,
        surname: surname,
        avatar: avatarImg ? avatarImg.src : null,
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
        userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Profil rasmi" style="width:100%;height:100%;border-radius:50%;">`;
    } else {
        userAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
    }
    
    // Statistika
    document.getElementById('total-tests').textContent = `${currentUser.stats.totalTests} test`;
    document.getElementById('total-words').textContent = `${currentUser.stats.totalWords} so'z`;
    document.getElementById('success-rate').textContent = `${currentUser.stats.successRate}% muvaffaqiyat`;
}

// Dashboard statistikasini yangilash
function updateDashboardStats() {
    if (!currentUser || testHistory.length === 0) return;
    
    currentUser.stats.totalTests = testHistory.length;
    currentUser.stats.totalWords = testHistory.reduce((sum, test) => sum + test.total, 0);
    currentUser.stats.successRate = testHistory.length > 0 ? 
        Math.round(testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length) : 0;
    
    localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
    updateProfileDisplay();
}

// Sahifalarni ko'rsatish
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    if (sectionId === 'results-section') {
        updateHistoryDisplay();
    }
}

// Chiqish
function logout() {
    currentUser = null;
    localStorage.removeItem('memoryMasterUser');
    document.getElementById('user-name').value = '';
    document.getElementById('user-surname').value = '';
    document.getElementById('avatar-preview').innerHTML = '<i class="fas fa-user-circle"></i>';
    showSection('login-section');
}

// ==================== RAQAMLAR FUNCTIONS ====================

function startNumbersGame() {
    const numbersCount = parseInt(document.getElementById('numbers-count').value);
    timeLimit = parseInt(document.getElementById('numbers-time').value);
    
    numbersToMemorize = generateRandomNumbers(numbersCount);
    document.getElementById('numbers-display').textContent = numbersToMemorize.join(' ');
    
    timeLeft = timeLimit;
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    showSection('numbers-memorization');
    
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
    
    const inputGrid = document.getElementById('numbers-input-grid');
    inputGrid.innerHTML = '';
    
    for (let i = 0; i < numbersToMemorize.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'number-input';
        input.maxLength = 1;
        input.dataset.index = i;
        
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
    
    document.getElementById('numbers-correct-count').textContent = correctCount;
    document.getElementById('numbers-incorrect-count').textContent = incorrectCount;
    document.getElementById('numbers-accuracy').textContent = `${Math.round((correctCount / numbersToMemorize.length) * 100)}%`;
    
    addToHistory('Raqamlar', correctCount, incorrectCount, numbersToMemorize.length);
    showSection('numbers-results');
}

// ==================== SO'ZLAR FUNCTIONS ====================

function startWordsGame() {
    const wordCount = parseInt(document.getElementById('word-count').value);
    timeLimit = parseInt(document.getElementById('word-time').value);
    const language = document.getElementById('word-language').value;
    
    wordsToMemorize = getRandomWords(wordCount, language);
    document.getElementById('words-display').textContent = wordsToMemorize.join(', ');
    
    timeLeft = timeLimit;
    document.getElementById('words-timer').textContent = timeLeft;
    
    showSection('words-memorization');
    
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
    
    document.getElementById('words-correct-count').textContent = correctCount;
    document.getElementById('words-incorrect-count').textContent = incorrectCount;
    document.getElementById('words-accuracy').textContent = `${Math.round((correctCount / wordsToMemorize.length) * 100)}%`;
    
    addToHistory('So\'zlar', correctCount, incorrectCount, wordsToMemorize.length);
    showSection('words-results');
}

// ==================== FLASHCARDS FUNCTIONS ====================

function selectFlashcardLanguage(language) {
    currentFlashcardLanguage = language;
    const langData = flashcardDatabase[language];
    document.getElementById('flashcards-language-title').textContent = `${langData.language} - Mavzular`;
    showSection('flashcards-topics');
    loadFlashcardTopics(language);
}

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

function selectFlashcardTopic(topicKey) {
    currentFlashcardTopic = topicKey;
    const topic = flashcardDatabase[currentFlashcardLanguage].topics[topicKey];
    
    const allWords = [...topic.words];
    currentFlashcards = [];
    
    for (let i = 0; i < Math.min(10, allWords.length); i++) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        currentFlashcards.push(allWords[randomIndex]);
        allWords.splice(randomIndex, 1);
    }
    
    startFlashcardsGame();
}

function startFlashcardsGame() {
    currentCardIndex = 0;
    showSection('flashcards-game');
    showCurrentCard();
}

function showCurrentCard() {
    if (currentCardIndex >= currentFlashcards.length) {
        finishFlashcards();
        return;
    }
    
    const card = currentFlashcards[currentCardIndex];
    const flashcard = document.getElementById('flashcard');
    
    flashcard.classList.remove('flipped');
    
    document.getElementById('card-word').textContent = card.word;
    document.getElementById('card-pronunciation').textContent = card.pronunciation;
    document.getElementById('card-translation').textContent = card.translation;
    document.getElementById('card-definition').textContent = card.definition;
    document.getElementById('card-example').textContent = card.example;
    
    document.getElementById('current-card').textContent = currentCardIndex + 1;
    document.getElementById('total-cards').textContent = currentFlashcards.length;
    
    if (currentCardIndex === currentFlashcards.length - 1) {
        document.querySelector('.finish-btn').style.display = 'block';
    }
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
    currentCardIndex++;
    showCurrentCard();
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCurrentCard();
    }
}

function finishFlashcards() {
    alert("Flashcards tugadi! Keyingi qadamlar tez orada qo'shiladi.");
    showSection('dashboard');
}

// ==================== YUZ VA ISMLAR FUNCTIONS ====================

function startFacesGame() {
    const facesCount = parseInt(document.getElementById('faces-count').value);
    timeLimit = parseInt(document.getElementById('faces-time').value);
    
    facesToMemorize = getRandomFaces(facesCount);
    
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
    
    timeLeft = timeLimit;
    document.getElementById('faces-timer').textContent = timeLeft;
    
    showSection('faces-memorization');
    
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
    
    const facesInputContainer = document.getElementById('faces-input-container');
    facesInputContainer.innerHTML = '';
    
    facesToMemorize.forEach((face, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = `${index + 1}. ${face.avatar} - Ismni kiriting:`;
        label.style.color = 'white';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'face-input';
        input.placeholder = 'Ismni yozing...';
        input.dataset.correct = face.name;
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        facesInputContainer.appendChild(inputGroup);
    });
}

function checkFacesAnswers() {
    const inputs = document.querySelectorAll('.face-input');
    const resultsList = document.getElementById('faces-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    inputs.forEach((input, index) => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.correct;
        const face = facesToMemorize[index];
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            resultItem.innerHTML = `
                <span class="correct">${index + 1}. ${face.avatar} ${userAnswer} ✓</span>
            `;
            correctCount++;
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${index + 1}. ${face.avatar} ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
        }
        
        resultsList.appendChild(resultItem);
    });
    
    document.getElementById('faces-correct-count').textContent = correctCount;
    document.getElementById('faces-incorrect-count').textContent = incorrectCount;
    document.getElementById('faces-accuracy').textContent = `${Math.round((correctCount / facesToMemorize.length) * 100)}%`;
    
    addToHistory('Yuz va Ismlar', correctCount, incorrectCount, facesToMemorize.length);
    showSection('faces-results');
}

// ==================== RASMLAR FUNCTIONS ====================

function startImagesGame() {
    const imagesCount = parseInt(document.getElementById('images-count').value);
    timeLimit = parseInt(document.getElementById('images-time').value);
    
    imagesToMemorize = getRandomImages(imagesCount);
    
    const imagesDisplay = document.getElementById('images-display');
    imagesDisplay.innerHTML = '';
    
    imagesToMemorize.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <div class="image-preview">${image.emoji}</div>
            <div class="image-description">${image.description}</div>
            <div class="image-category">${image.category}</div>
        `;
        imagesDisplay.appendChild(imageItem);
    });
    
    timeLeft = timeLimit;
    document.getElementById('images-timer').textContent = timeLeft;
    
    showSection('images-memorization');
    
    clearInterval(timer);
    timer = setInterval(updateImagesTimer, 1000);
}

function updateImagesTimer() {
    timeLeft--;
    document.getElementById('images-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        showImagesInputSection();
    }
}

function showImagesInputSection() {
    showSection('images-input');
    
    const imagesInputContainer = document.getElementById('images-input-container');
    imagesInputContainer.innerHTML = '';
    
    imagesToMemorize.forEach((image, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = `${index + 1}. ${image.emoji} - Tavsifni kiriting:`;
        label.style.color = 'white';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'image-input';
        input.placeholder = 'Tavsifni yozing...';
        input.dataset.correct = image.description;
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        imagesInputContainer.appendChild(inputGroup);
    });
}

function checkImagesAnswers() {
    const inputs = document.querySelectorAll('.image-input');
    const resultsList = document.getElementById('images-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    inputs.forEach((input, index) => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.correct;
        const image = imagesToMemorize[index];
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            resultItem.innerHTML = `
                <span class="correct">${index + 1}. ${image.emoji} ${userAnswer} ✓</span>
            `;
            correctCount++;
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${index + 1}. ${image.emoji} ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
        }
        
        resultsList.appendChild(resultItem);
    });
    
    document.getElementById('images-correct-count').textContent = correctCount;
    document.getElementById('images-incorrect-count').textContent = incorrectCount;
    document.getElementById('images-accuracy').textContent = `${Math.round((correctCount / imagesToMemorize.length) * 100)}%`;
    
    addToHistory('Rasmlar', correctCount, incorrectCount, imagesToMemorize.length);
    showSection('images-results');
}

// ==================== YORDAMCHI FUNKSIYALAR ====================

function generateRandomNumbers(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers;
}

function getRandomWords(count, language) {
    const words = [...wordDatabase[language]];
    const selectedWords = [];
    
    for (let i = 0; i < count; i++) {
        if (words.length === 0) break;
        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randomIndex]);
        words.splice(randomIndex, 1);
    }
    
    return selectedWords;
}

function getRandomFaces(count) {
    const allFaces = [...facesDatabase];
    const selectedFaces = [];
    
    for (let i = 0; i < Math.min(count, allFaces.length); i++) {
        const randomIndex = Math.floor(Math.random() * allFaces.length);
        selectedFaces.push(allFaces[randomIndex]);
        allFaces.splice(randomIndex, 1);
    }
    
    return selectedFaces;
}

function getRandomImages(count) {
    const allImages = [...imagesDatabase];
    const selectedImages = [];
    
    for (let i = 0; i < Math.min(count, allImages.length); i++) {
        const randomIndex = Math.floor(Math.random() * allImages.length);
        selectedImages.push(allImages[randomIndex]);
        allImages.splice(randomIndex, 1);
    }
    
    return selectedImages;
}

function addToHistory(category, correct, incorrect, total) {
    const testResult = {
        id: Date.now(),
        date: new Date().toLocaleString('uz-UZ'),
        category: category,
        correct: correct,
        incorrect: incorrect,
        total: total,
        accuracy: Math.round((correct / total) * 100)
    };
    
    testHistory.unshift(testResult);
    localStorage.setItem('memoryMasterHistory', JSON.stringify(testHistory));
    
    if (currentUser) {
        currentUser.stats.totalTests++;
        currentUser.stats.totalWords += total;
        
        const allTests = testHistory.length;
        const totalAccuracy = testHistory.reduce((sum, test) => sum + test.accuracy, 0);
        currentUser.stats.successRate = Math.round(totalAccuracy / allTests);
        
        localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
        updateDashboardStats();
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('results-history');
    
    if (testHistory.length === 0) {
        historyList.innerHTML = '<p class="info-text">Hali test natijalari mavjud emas.</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    testHistory.forEach(result => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-category">${result.category}</div>
                <div class="history-date">${result.date}</div>
            </div>
            <div class="history-stats">
                <span class="history-score">${result.correct}/${result.total}</span>
                <span class="history-accuracy">${result.accuracy}%</span>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function filterResults() {
    const filter = document.getElementById('results-filter').value;
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        const category = item.querySelector('.history-category').textContent.toLowerCase();
        
        if (filter === 'all' || category.includes(filter)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Global funksiyalar
window.showSection = showSection;
window.createProfile = createProfile;
window.logout = logout;
window.uploadAvatar = function() {
    document.getElementById('avatar-input').click();
};

// Raqamlar
window.startNumbersGame = startNumbersGame;
window.checkNumbersAnswers = checkNumbersAnswers;

// So'zlar
window.startWordsGame = startWordsGame;
window.checkWordsAnswers = checkWordsAnswers;

// Flashcards
window.selectFlashcardLanguage = selectFlashcardLanguage;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.finishFlashcards = finishFlashcards;

// Yuz va Ismlar
window.startFacesGame = startFacesGame;
window.checkFacesAnswers = checkFacesAnswers;

// Rasmlar
window.startImagesGame = startImagesGame;
window.checkImagesAnswers = checkImagesAnswers;

// Natijalar
window.filterResults = filterResults;

// ==================== RAQAMLAR FUNCTIONS ====================

function startNumbersGame() {
    console.log("🔢 Raqamlar o'yini boshlandi...");
    
    const numbersCount = parseInt(document.getElementById('numbers-count').value);
    timeLimit = parseInt(document.getElementById('numbers-time').value);
    
    console.log("📊 Sozlamalar:", { numbersCount, timeLimit });
    
    // Tasodifiy raqamlarni yaratish
    numbersToMemorize = generateRandomNumbers(numbersCount);
    console.log("🎲 Yaratilgan raqamlar:", numbersToMemorize);
    
    // Raqamlarni ko'rsatish
    document.getElementById('numbers-display').textContent = numbersToMemorize.join(' ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('numbers-timer').textContent = timeLeft;
    console.log("⏰ Taymer sozlandi:", timeLeft + " sekund");
    
    // Eslab qolish sahifasiga o'tish
    showSection('numbers-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateNumbersTimer, 1000);
    console.log("✅ Taymer ishga tushdi");
}

function updateNumbersTimer() {
    timeLeft--;
    console.log("⏰ Vaqt:", timeLeft);
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        console.log("⏰ Vaqt tugadi! Kirish sahifasiga o'tilmoqda...");
        clearInterval(timer);
        showNumbersInputSection();
    }
}

function showNumbersInputSection() {
    console.log("⌨️ Kirish sahifasiga o'tilmoqda...");
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
    if (firstInput) {
        firstInput.focus();
        console.log("✅ Birinchi katak fokuslandi");
    }
}

function checkNumbersAnswers() {
    console.log("📝 Javoblarni tekshirish...");
    
    const inputs = document.querySelectorAll('.number-input');
    const resultsList = document.getElementById('numbers-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim();
        const correctAnswer = numbersToMemorize[i].toString();
        
        console.log(`❓ ${i + 1}. Foydalanuvchi: ${userAnswer}, To'g'ri: ${correctAnswer}`);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer === correctAnswer) {
            resultItem.innerHTML = `<span class="correct">${i + 1}. ${userAnswer}</span>`;
            correctCount++;
            console.log(`✅ ${i + 1}. To'g'ri`);
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${i + 1}. ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
            console.log(`❌ ${i + 1}. Xato`);
        }
        
        resultsList.appendChild(resultItem);
    }
    
    // Statistika
    document.getElementById('numbers-correct-count').textContent = correctCount;
    document.getElementById('numbers-incorrect-count').textContent = incorrectCount;
    document.getElementById('numbers-accuracy').textContent = `${Math.round((correctCount / numbersToMemorize.length) * 100)}%`;
    
    console.log("📊 Natijalar:", { correctCount, incorrectCount, accuracy: Math.round((correctCount / numbersToMemorize.length) * 100) + '%' });
    
    // Tarixga qo'shish
    addToHistory('Raqamlar', correctCount, incorrectCount, numbersToMemorize.length);
    
    // Natijalar bo'limini ko'rsatish
    showSection('numbers-results');
    console.log("🎯 Natijalar sahifasiga o'tildi");
}

// Yordamchi funksiyalar
function generateRandomNumbers(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers;
}

function addToHistory(category, correct, incorrect, total) {
    const testResult = {
        id: Date.now(),
        date: new Date().toLocaleString('uz-UZ'),
        category: category,
        correct: correct,
        incorrect: incorrect,
        total: total,
        accuracy: Math.round((correct / total) * 100)
    };
    
    // Tarixni saqlash
    let testHistory = JSON.parse(localStorage.getItem('memoryMasterHistory') || '[]');
    testHistory.unshift(testResult);
    localStorage.setItem('memoryMasterHistory', JSON.stringify(testHistory));
    
    console.log("💾 Tarixga qo'shildi:", testResult);
    // Global funksiyalar
window.showSection = showSection;
window.createProfile = createProfile;
window.logout = logout;
window.uploadAvatar = function() {
    document.getElementById('avatar-input').click();
};

// Raqamlar funksiyalari
window.startNumbersGame = startNumbersGame;
window.checkNumbersAnswers = checkNumbersAnswers;

// So'zlar funksiyalari  
window.startWordsGame = startWordsGame;
window.checkWordsAnswers = checkWordsAnswers;

console.log("🎉 app.js to'liq yuklandi! Barcha funksiyalar mavjud!");
}
// ==================== RAQAMLAR FUNCTIONS ====================

function startNumbersGame() {
    console.log("🔢 Raqamlar o'yini boshlandi...");
    
    const numbersCount = parseInt(document.getElementById('numbers-count').value);
    timeLimit = parseInt(document.getElementById('numbers-time').value);
    
    console.log("📊 Sozlamalar:", { numbersCount, timeLimit });
    
    // Tasodifiy raqamlarni yaratish
    numbersToMemorize = generateRandomNumbers(numbersCount);
    console.log("🎲 Yaratilgan raqamlar:", numbersToMemorize);
    
    // Raqamlarni ko'rsatish
    document.getElementById('numbers-display').textContent = numbersToMemorize.join(' ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('numbers-timer').textContent = timeLeft;
    console.log("⏰ Taymer sozlandi:", timeLeft + " sekund");
    
    // Eslab qolish sahifasiga o'tish
    showSection('numbers-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateNumbersTimer, 1000);
    console.log("✅ Taymer ishga tushdi");
}

function updateNumbersTimer() {
    timeLeft--;
    console.log("⏰ Vaqt:", timeLeft);
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        console.log("⏰ Vaqt tugadi! Kirish sahifasiga o'tilmoqda...");
        clearInterval(timer);
        showNumbersInputSection();
    }
}

function showNumbersInputSection() {
    console.log("⌨️ Kirish sahifasiga o'tilmoqda...");
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
    if (firstInput) {
        firstInput.focus();
        console.log("✅ Birinchi katak fokuslandi");
    }
}

function checkNumbersAnswers() {
    console.log("📝 Javoblarni tekshirish...");
    
    const inputs = document.querySelectorAll('.number-input');
    const resultsList = document.getElementById('numbers-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim();
        const correctAnswer = numbersToMemorize[i].toString();
        
        console.log(`❓ ${i + 1}. Foydalanuvchi: ${userAnswer}, To'g'ri: ${correctAnswer}`);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer === correctAnswer) {
            resultItem.innerHTML = `<span class="correct">${i + 1}. ${userAnswer}</span>`;
            correctCount++;
            console.log(`✅ ${i + 1}. To'g'ri`);
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${i + 1}. ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
            console.log(`❌ ${i + 1}. Xato`);
        }
        
        resultsList.appendChild(resultItem);
    }
    
    // Statistika
    document.getElementById('numbers-correct-count').textContent = correctCount;
    document.getElementById('numbers-incorrect-count').textContent = incorrectCount;
    document.getElementById('numbers-accuracy').textContent = `${Math.round((correctCount / numbersToMemorize.length) * 100)}%`;
    
    console.log("📊 Natijalar:", { correctCount, incorrectCount, accuracy: Math.round((correctCount / numbersToMemorize.length) * 100) + '%' });
    
    // Tarixga qo'shish
    addToHistory('Raqamlar', correctCount, incorrectCount, numbersToMemorize.length);
    
    // Natijalar bo'limini ko'rsatish
    showSection('numbers-results');
    console.log("🎯 Natijalar sahifasiga o'tildi");
}

// Yordamchi funksiyalar
function generateRandomNumbers(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers;
}

function addToHistory(category, correct, incorrect, total) {
    const testResult = {
        id: Date.now(),
        date: new Date().toLocaleString('uz-UZ'),
        category: category,
        correct: correct,
        incorrect: incorrect,
        total: total,
        accuracy: Math.round((correct / total) * 100)
    };
    
    // Tarixni saqlash
    let testHistory = JSON.parse(localStorage.getItem('memoryMasterHistory') || '[]');
    testHistory.unshift(testResult);
    localStorage.setItem('memoryMasterHistory', JSON.stringify(testHistory));
    
    console.log("💾 Tarixga qo'shildi:", testResult);
}

