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
// ==================== SO'ZLAR FUNCTIONS ====================

function startWordsGame() {
    console.log("🔤 So'zlar o'yini boshlandi...");
    
    const wordCount = parseInt(document.getElementById('word-count').value);
    timeLimit = parseInt(document.getElementById('word-time').value);
    const language = document.getElementById('word-language').value;
    
    console.log("📊 Sozlamalar:", { wordCount, timeLimit, language });
    
    // Tasodifiy so'zlarni tanlash
    wordsToMemorize = getRandomWords(wordCount, language);
    console.log("📝 Tanlangan so'zlar:", wordsToMemorize);
    
    // So'zlarni ko'rsatish
    document.getElementById('words-display').textContent = wordsToMemorize.join(', ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('words-timer').textContent = timeLeft;
    console.log("⏰ Taymer sozlandi:", timeLeft + " sekund");
    
    // Eslab qolish sahifasiga o'tish
    showSection('words-memorization');
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(updateWordsTimer, 1000);
    console.log("✅ Taymer ishga tushdi");
}

function updateWordsTimer() {
    timeLeft--;
    console.log("⏰ Vaqt:", timeLeft);
    document.getElementById('words-timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        console.log("⏰ Vaqt tugadi! Kirish sahifasiga o'tilmoqda...");
        clearInterval(timer);
        showWordsInputSection();
    }
}

function showWordsInputSection() {
    console.log("⌨️ So'zlar kirish sahifasiga o'tilmoqda...");
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
    
    console.log("✅ So'z kirish maydonlari yaratildi");
}

function checkWordsAnswers() {
    console.log("📝 So'z javoblarini tekshirish...");
    
    const inputs = document.querySelectorAll('.word-input');
    const resultsList = document.getElementById('words-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim().toLowerCase();
        const correctAnswer = wordsToMemorize[i].toLowerCase();
        
        console.log(`❓ ${i + 1}. Foydalanuvchi: "${userAnswer}", To'g'ri: "${correctAnswer}"`);
        
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
    document.getElementById('words-correct-count').textContent = correctCount;
    document.getElementById('words-incorrect-count').textContent = incorrectCount;
    document.getElementById('words-accuracy').textContent = `${Math.round((correctCount / wordsToMemorize.length) * 100)}%`;
    
    console.log("📊 So'z natijalari:", { correctCount, incorrectCount, accuracy: Math.round((correctCount / wordsToMemorize.length) * 100) + '%' });
    
    // Tarixga qo'shish
    addToHistory('So\'zlar', correctCount, incorrectCount, wordsToMemorize.length);
    
    // Natijalar bo'limini ko'rsatish
    showSection('words-results');
    console.log("🎯 So'z natijalar sahifasiga o'tildi");
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
