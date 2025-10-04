// So'zlar moduli
const WordsGame = {
    // O'yin holatlari
    currentGame: null,
    timer: null,
    
    // O'yinni boshlash
    init() {
        this.setupEventListeners();
        this.showSettingsScreen();
    },

    // Event listenerlarni o'rnatish
    setupEventListeners() {
        // Boshlash tugmasi
        document.getElementById('start-words').addEventListener('click', () => {
            this.startGame();
        });

        // Tekshirish tugmasi
        document.getElementById('check-words').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Orqaga tugmasi
        document.querySelector('#words-section .back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Bosh sahifa va qayta o'ynash tugmalari
        document.querySelector('#words-results .home-btn').addEventListener('click', () => {
            this.goToHome();
        });

        document.querySelector('#words-results .retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
    },

    // Sozlamalar ekranini ko'rsatish
    showSettingsScreen() {
        this.hideAllScreens();
        document.getElementById('words-settings').style.display = 'block';
        
        // Tillarni to'ldirish
        this.populateLanguageSelect();
    },

    // Tillar selectini to'ldirish
    populateLanguageSelect() {
        const select = document.getElementById('words-language');
        select.innerHTML = '';
        
        DataManager.wordsLanguages.forEach(langCode => {
            const language = DataManager.languages[langCode];
            const option = document.createElement('option');
            option.value = langCode;
            option.textContent = `${language.flag} ${language.name}`;
            select.appendChild(option);
        });
    },

    // O'yinni boshlash
    startGame() {
        const language = document.getElementById('words-language').value;
        const wordsCount = parseInt(document.getElementById('words-count').value);
        const studyTime = parseInt(document.getElementById('words-time').value);

        // Sozlamalarni tekshirish
        if (wordsCount < 5 || wordsCount > 100) {
            Helpers.showError('So\'zlar soni 5 dan 100 gacha bo\'lishi kerak');
            return;
        }

        if (studyTime < 10 || studyTime > 600) {
            Helpers.showError('Vaqt 10 soniyadan 600 soniyagacha bo\'lishi kerak');
            return;
        }

        // Tasodifiy mavzu tanlash
        const randomTopic = DataManager.topics[Math.floor(Math.random() * DataManager.topics.length)];
        
        // So'zlarni olish
        const words = DataManager.getRandomWords(language, randomTopic, wordsCount);
        
        if (words.length === 0) {
            Helpers.showError('Tanlangan til va mavzuda so\'zlar topilmadi');
            return;
        }

        // O'yin ma'lumotlarini yaratish
        this.currentGame = {
            language: language,
            words: words,
            studyTime: studyTime,
            userAnswers: [],
            startTime: new Date(),
            settings: {
                language: language,
                wordsCount: wordsCount,
                studyTime: studyTime,
                topic: randomTopic
            }
        };

        this.showDisplayScreen();
    },

    // Ko'rsatish ekranini ko'rsatish
    showDisplayScreen() {
        this.hideAllScreens();
        document.getElementById('words-display').style.display = 'block';

        // So'zlarni ko'rsatish
        this.displayWords();

        // Timer ni boshlash
        this.startTimer();
    },

    // So'zlarni ekranga chiqarish
    displayWords() {
        const wordsList = document.getElementById('words-list');
        wordsList.innerHTML = '';

        const language = DataManager.languages[this.currentGame.language];
        
        wordsList.innerHTML = `
            <div class="language-info" style="text-align: center; margin-bottom: 1rem; color: var(--text-secondary);">
                <strong>${language.flag} ${language.name}</strong>
            </div>
        `;

        this.currentGame.words.forEach((wordObj, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold;">${index + 1}. ${wordObj.word}</span>
                    <small style="color: var(--text-muted);">${wordObj.pronunciation}</small>
                </div>
                <div style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                    ${wordObj.translation}
                </div>
            `;
            wordElement.style.animationDelay = `${index * 0.2}s`;
            wordsList.appendChild(wordElement);
        });
    },

    // Timer ni boshlash
    startTimer() {
        let timeLeft = this.currentGame.studyTime;
        const timerElement = document.getElementById('words-timer');

        const updateTimer = () => {
            timerElement.textContent = Helpers.formatTime(timeLeft);
            
            // Rangni o'zgartirish
            if (timeLeft <= 10) {
                timerElement.style.color = '#ef4444';
                timerElement.style.animation = 'pulse 0.5s infinite';
            } else if (timeLeft <= 30) {
                timerElement.style.color = '#f59e0b';
            }

            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(this.timer);
                this.showInputScreen();
            }
        };

        // Dastlabki yangilash
        updateTimer();
        
        // Har soniyada yangilash
        this.timer = setInterval(updateTimer, 1000);
    },

    // Kiritish ekranini ko'rsatish
    showInputScreen() {
        this.hideAllScreens();
        document.getElementById('words-input').style.display = 'block';

        // Input kataklarini yaratish
        this.createInputFields();
    },

    // Input kataklarini yaratish
    createInputFields() {
        const inputList = document.getElementById('words-input-list');
        inputList.innerHTML = '';

        const language = DataManager.languages[this.currentGame.language];

        this.currentGame.words.forEach((wordObj, index) => {
            const inputItem = document.createElement('div');
            inputItem.className = 'word-input-item';
            
            inputItem.innerHTML = `
                <div class="word-input-label">
                    <strong>${index + 1}.</strong> ${wordObj.word}
                    <br><small style="color: var(--text-muted);">${wordObj.pronunciation}</small>
                </div>
                <input type="text" 
                       class="word-input-field" 
                       placeholder="${language.name}da tarjimasini yozing..." 
                       data-index="${index}">
            `;

            inputList.appendChild(inputItem);
        });

        // Birinchi input ni focus qilish
        const firstInput = inputList.querySelector('.word-input-field');
        if (firstInput) firstInput.focus();

        // Enter bosganda keyingi input ga o'tish
        const inputs = inputList.querySelectorAll('.word-input-field');
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (Helpers.isEnterKey(e)) {
                    e.preventDefault();
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        document.getElementById('check-words').focus();
                    }
                }
            });
        });
    },

    // Javoblarni tekshirish
    checkAnswers() {
        const inputFields = document.querySelectorAll('#words-input-list .word-input-field');
        const userAnswers = [];

        // Javoblarni yig'ish
        inputFields.forEach((input, index) => {
            userAnswers[index] = input.value.trim();
        });

        this.currentGame.userAnswers = userAnswers;

        // Natijalarni hisoblash
        this.calculateResults();
    },

    // Natijalarni hisoblash
    calculateResults() {
        const correctWords = this.currentGame.words;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        const results = [];

        // Har bir javobni tekshirish
        correctWords.forEach((wordObj, index) => {
            const userAnswer = userAnswers[index];
            const correctTranslation = wordObj.translation.toLowerCase();
            const isCorrect = userAnswer.toLowerCase() === correctTranslation;

            if (isCorrect) {
                correctCount++;
            }

            results.push({
                index: index,
                word: wordObj.word,
                pronunciation: wordObj.pronunciation,
                correct: correctTranslation,
                userAnswer: userAnswer,
                isCorrect: isCorrect
            });
        });

        // Ballarni hisoblash
        const percentage = Helpers.calculatePercentage(correctCount, correctWords.length);
        const score = Math.round((correctCount / correctWords.length) * 1000);

        // O'yin natijasini saqlash
        const gameResult = {
            gameType: 'words',
            score: score,
            total: correctWords.length,
            percentage: percentage,
            correctCount: correctCount,
            details: {
                language: this.currentGame.language,
                words: correctWords,
                userAnswers: userAnswers,
                results: results
            },
            settings: this.currentGame.settings
        };

        // Natijalarni ko'rsatish
        this.showResultsScreen(gameResult, results);

        // Natijani saqlash
        StorageManager.saveGameResult(gameResult);
    },

    // Natijalar ekranini ko'rsatish
    showResultsScreen(gameResult, results) {
        this.hideAllScreens();
        document.getElementById('words-results').style.display = 'block';

        // Ballarni ko'rsatish
        document.getElementById('words-score').textContent = gameResult.score;

        // Natijalarni solishtirish
        this.displayComparison(results);

        // Konfet animatsiyasi (agar yaxshi natija bo'lsa)
        if (gameResult.percentage >= 80) {
            Helpers.showConfetti();
        }
    },

    // Solishtirish natijalarini ko'rsatish
    displayComparison(results) {
        const comparisonElement = document.getElementById('words-comparison');
        comparisonElement.innerHTML = '';

        const language = DataManager.languages[this.currentGame.language];

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;

            let content = '';
            
            if (result.isCorrect) {
                content = `
                    <div class="result-answer" style="flex: 1;">
                        <div><strong>${result.word}</strong> <small>${result.pronunciation}</small></div>
                        <div style="margin-top: 0.5rem; color: var(--text-secondary);">
                            Sizning javobingiz: <strong style="color: #10b981;">${result.userAnswer}</strong> ✓
                        </div>
                    </div>
                    <div class="result-status" style="color: #10b981; min-width: 60px; text-align: right;">
                        To'g'ri
                    </div>
                `;
            } else {
                content = `
                    <div class="result-answer" style="flex: 1;">
                        <div><strong>${result.word}</strong> <small>${result.pronunciation}</small></div>
                        <div style="margin-top: 0.5rem;">
                            <span style="color: #ef4444; text-decoration: line-through;">${result.userAnswer || 'Javob berilmagan'}</span>
                            <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.correct}</span>
                        </div>
                    </div>
                    <div class="result-status" style="color: #ef4444; min-width: 60px; text-align: right;">
                        Xato
                    </div>
                `;
            }

            resultItem.innerHTML = content;
            comparisonElement.appendChild(resultItem);
        });
    },

    // Barcha ekranlarni yashirish
    hideAllScreens() {
        const screens = [
            'words-settings',
            'words-display',
            'words-input',
            'words-results'
        ];

        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.style.display = 'none';
        });

        // Timerni to'xtatish
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    // Orqaga qaytish
    goBack() {
        if (document.getElementById('words-results').style.display === 'block') {
            this.showInputScreen();
        } else if (document.getElementById('words-input').style.display === 'block') {
            this.showDisplayScreen();
        } else if (document.getElementById('words-display').style.display === 'block') {
            this.showSettingsScreen();
        } else {
            this.goToHome();
        }
    },

    // Bosh sahifaga qaytish
    goToHome() {
        if (window.App && typeof window.App.showSection === 'function') {
            window.App.showSection('profile-section');
        }
    },

    // Qayta o'ynash
    retryGame() {
        this.currentGame = null;
        this.showSettingsScreen();
    },

    // O'yinni to'xtatish
    stopGame() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.currentGame = null;
    }
};

// Global qilish
window.WordsGame = WordsGame;