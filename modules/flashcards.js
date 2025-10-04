// Flashcards moduli
const FlashcardsGame = {
    // O'yin holatlari
    currentGame: null,
    currentCardIndex: 0,
    currentLanguage: null,
    currentTopic: null,
    testType: 'foreignToNative',
    
    // O'yinni boshlash
    init() {
        this.setupEventListeners();
        this.showLanguageSelection();
    },

    // Event listenerlarni o'rnatish
    setupEventListeners() {
        // Til tanlash
        document.querySelectorAll('.language-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const language = e.currentTarget.dataset.lang;
                this.selectLanguage(language);
            });
        });

        // Flashcard aylantirish
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });

        // Keyingi karta
        document.getElementById('next-card').addEventListener('click', () => {
            this.nextCard();
        });

        // Tayyorman tugmasi
        document.getElementById('finish-cards').addEventListener('click', () => {
            this.startTest();
        });

        // Test turini tanlash
        document.querySelectorAll('.test-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTestType(e.currentTarget.dataset.type);
            });
        });

        // Tekshirish tugmasi
        document.getElementById('check-flashcards').addEventListener('click', () => {
            this.checkTestAnswers();
        });

        // Orqaga tugmalari
        document.querySelector('#flashcards-section .back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Bosh sahifa va qayta o'ynash tugmalari
        document.querySelector('#flashcards-results .home-btn').addEventListener('click', () => {
            this.goToHome();
        });

        document.querySelector('#flashcards-results .retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
    },

    // Til tanlash ekranini ko'rsatish
    showLanguageSelection() {
        this.hideAllScreens();
        document.getElementById('flashcards-language').style.display = 'block';
    },

    // Tilni tanlash
    selectLanguage(language) {
        this.currentLanguage = language;
        this.showTopicsSelection();
    },

    // Mavzular tanlash ekranini ko'rsatish
    showTopicsSelection() {
        this.hideAllScreens();
        document.getElementById('flashcards-topics').style.display = 'block';

        // Mavzularni to'ldirish
        this.populateTopicsGrid();
    },

    // Mavzular gridini to'ldirish
    populateTopicsGrid() {
        const topicsGrid = document.getElementById('topics-grid');
        topicsGrid.innerHTML = '';

        DataManager.topics.forEach((topic, index) => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic-card';
            topicCard.dataset.topic = topic;
            
            // Progress ma'lumotlarini olish
            const progress = StorageManager.getTopicProgress(this.currentLanguage, topic);
            const wordCount = DataManager.vocabulary[this.currentLanguage]?.[topic]?.length || 0;

            topicCard.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📚</div>
                <h4 style="margin-bottom: 0.5rem;">${topic}</h4>
                <small style="color: var(--text-muted);">
                    ${wordCount} so'z
                </small>
                ${progress.practiced > 0 ? `
                    <div style="margin-top: 0.5rem;">
                        <div style="background: var(--bg-input); height: 4px; border-radius: 2px;">
                            <div style="background: var(--accent-color); height: 100%; width: ${(progress.mastered / wordCount) * 100}%; border-radius: 2px;"></div>
                        </div>
                        <small style="color: var(--text-muted);">
                            ${progress.mastered}/${wordCount} o'zlashtirildi
                        </small>
                    </div>
                ` : ''}
            `;

            topicCard.addEventListener('click', () => {
                this.selectTopic(topic);
            });

            topicsGrid.appendChild(topicCard);
        });
    },

    // Mavzuni tanlash
    selectTopic(topic) {
        this.currentTopic = topic;
        
        // So'zlarni olish
        const words = DataManager.getRandomWords(this.currentLanguage, this.currentTopic, 20);
        
        if (words.length === 0) {
            Helpers.showError('Tanlangan mavzuda so\'zlar topilmadi');
            return;
        }

        // O'yin ma'lumotlarini yaratish
        this.currentGame = {
            language: this.currentLanguage,
            topic: this.currentTopic,
            words: words,
            currentCardIndex: 0,
            userAnswers: [],
            settings: {
                language: this.currentLanguage,
                topic: this.currentTopic,
                wordsCount: words.length
            }
        };

        this.showPracticeScreen();
    },

    // Mashq ekranini ko'rsatish
    showPracticeScreen() {
        this.hideAllScreens();
        document.getElementById('flashcards-practice').style.display = 'block';
        
        // Birinchi kartani ko'rsatish
        this.showCurrentCard();
    },

    // Joriy kartani ko'rsatish
    showCurrentCard() {
        const card = this.currentGame.words[this.currentGame.currentCardIndex];
        const flashcard = document.getElementById('flashcard');
        
        // Karta orqasiga aylantirilgan bo'lsa, oldiga qaytarish
        flashcard.classList.remove('flipped');

        // Ma'lumotlarni to'ldirish
        document.getElementById('flashcard-word').textContent = card.word;
        document.getElementById('flashcard-pronunciation').textContent = card.pronunciation;
        document.getElementById('flashcard-translation').textContent = card.translation;
        document.getElementById('flashcard-back-pronunciation').textContent = card.pronunciation;

        // Progressni yangilash
        document.getElementById('card-progress').textContent = 
            `${this.currentGame.currentCardIndex + 1}/${this.currentGame.words.length}`;
    },

    // Kartani aylantirish
    flipCard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
    },

    // Keyingi karta
    nextCard() {
        this.currentGame.currentCardIndex++;
        
        if (this.currentGame.currentCardIndex >= this.currentGame.words.length) {
            this.currentGame.currentCardIndex = 0; // Loop back to start
        }
        
        this.showCurrentCard();
    },

    // Testni boshlash
    startTest() {
        this.hideAllScreens();
        document.getElementById('flashcards-test').style.display = 'block';
        
        // Test so'zlarini tayyorlash
        this.prepareTestWords();
    },

    // Test so'zlarini tayyorlash
    prepareTestWords() {
        const testWordsList = document.getElementById('test-words-list');
        testWordsList.innerHTML = '';

        this.currentGame.words.forEach((wordObj, index) => {
            const testItem = document.createElement('div');
            testItem.className = 'word-input-item';
            testItem.style.marginBottom = '1rem';
            
            if (this.testType === 'foreignToNative') {
                // Chet til -> Tarjima
                testItem.innerHTML = `
                    <div class="word-input-label" style="min-width: 200px;">
                        <strong>${wordObj.word}</strong>
                        <br><small style="color: var(--text-muted);">${wordObj.pronunciation}</small>
                    </div>
                    <input type="text" 
                           class="word-input-field" 
                           placeholder="Tarjimasini yozing..." 
                           data-index="${index}">
                `;
            } else {
                // Tarjima -> Chet til
                testItem.innerHTML = `
                    <div class="word-input-label" style="min-width: 200px;">
                        <strong>${wordObj.translation}</strong>
                    </div>
                    <input type="text" 
                           class="word-input-field" 
                           placeholder="${DataManager.getLanguageName(this.currentLanguage)}cha so'zni yozing..." 
                           data-index="${index}">
                `;
            }

            testWordsList.appendChild(testItem);
        });

        // Birinchi input ni focus qilish
        const firstInput = testWordsList.querySelector('.word-input-field');
        if (firstInput) firstInput.focus();
    },

    // Test turini tanlash
    selectTestType(type) {
        this.testType = type;
        
        // Tugmalarni aktiv holatga keltirish
        document.querySelectorAll('.test-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // Test so'zlarini qayta yuklash
        this.prepareTestWords();
    },

    // Test javoblarini tekshirish
    checkTestAnswers() {
        const inputFields = document.querySelectorAll('#test-words-list .word-input-field');
        const userAnswers = [];

        // Javoblarni yig'ish
        inputFields.forEach((input, index) => {
            userAnswers[index] = input.value.trim();
        });

        this.currentGame.userAnswers = userAnswers;
        this.currentGame.testType = this.testType;

        // Natijalarni hisoblash
        this.calculateTestResults();
    },

    // Test natijalarini hisoblash
    calculateTestResults() {
        const words = this.currentGame.words;
        const userAnswers = this.currentGame.userAnswers;
        const testType = this.currentGame.testType;

        let correctCount = 0;
        const results = [];

        // Har bir javobni tekshirish
        words.forEach((wordObj, index) => {
            const userAnswer = userAnswers[index];
            let correctAnswer, isCorrect;

            if (testType === 'foreignToNative') {
                // Chet til -> Tarjima
                correctAnswer = wordObj.translation.toLowerCase();
                isCorrect = userAnswer.toLowerCase() === correctAnswer;
            } else {
                // Tarjima -> Chet til
                correctAnswer = wordObj.word.toLowerCase();
                isCorrect = userAnswer.toLowerCase() === correctAnswer;
            }

            if (isCorrect) {
                correctCount++;
            }

            results.push({
                index: index,
                word: wordObj.word,
                pronunciation: wordObj.pronunciation,
                translation: wordObj.translation,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer,
                isCorrect: isCorrect,
                testType: testType
            });
        });

        // Ballarni hisoblash
        const percentage = Helpers.calculatePercentage(correctCount, words.length);
        const score = Math.round((correctCount / words.length) * 1000);

        // Progressni yangilash
        this.updateProgress(correctCount, words.length);

        // O'yin natijasini saqlash
        const gameResult = {
            gameType: 'flashcards',
            score: score,
            total: words.length,
            percentage: percentage,
            correctCount: correctCount,
            details: {
                language: this.currentLanguage,
                topic: this.currentTopic,
                testType: testType,
                results: results
            },
            settings: this.currentGame.settings
        };

        // Natijalarni ko'rsatish
        this.showResultsScreen(gameResult, results);

        // Natijani saqlash
        StorageManager.saveGameResult(gameResult);
    },

    // Progressni yangilash
    updateProgress(correctCount, totalWords) {
        const progress = StorageManager.getTopicProgress(this.currentLanguage, this.currentTopic);
        
        progress.practiced += totalWords;
        progress.correct += correctCount;
        progress.mastered = Math.max(progress.mastered, correctCount);
        progress.lastPracticed = new Date().toISOString();

        StorageManager.saveFlashcardsProgress(this.currentLanguage, this.currentTopic, progress);
    },

    // Natijalar ekranini ko'rsatish
    showResultsScreen(gameResult, results) {
        this.hideAllScreens();
        document.getElementById('flashcards-results').style.display = 'block';

        // Ballarni ko'rsatish
        document.getElementById('flashcards-score').textContent = gameResult.score;

        // Natijalarni solishtirish
        this.displayComparison(results);

        // Konfet animatsiyasi (agar yaxshi natija bo'lsa)
        if (gameResult.percentage >= 80) {
            Helpers.showConfetti();
        }
    },

    // Solishtirish natijalarini ko'rsatish
    displayComparison(results) {
        const comparisonElement = document.getElementById('flashcards-comparison');
        comparisonElement.innerHTML = '';

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;

            let question, correctAnswer;
            
            if (result.testType === 'foreignToNative') {
                question = `${result.word} ${result.pronunciation}`;
                correctAnswer = result.translation;
            } else {
                question = result.translation;
                correctAnswer = `${result.word} ${result.pronunciation}`;
            }

            let content = '';
            
            if (result.isCorrect) {
                content = `
                    <div class="result-answer" style="flex: 1;">
                        <div><strong>${question}</strong></div>
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
                        <div><strong>${question}</strong></div>
                        <div style="margin-top: 0.5rem;">
                            <span style="color: #ef4444; text-decoration: line-through;">${result.userAnswer || 'Javob berilmagan'}</span>
                            <span style="color: #10b981; margin-left: 0.5rem;">→ ${correctAnswer}</span>
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
            'flashcards-language',
            'flashcards-topics',
            'flashcards-practice',
            'flashcards-test',
            'flashcards-results'
        ];

        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.style.display = 'none';
        });
    },

    // Orqaga qaytish
    goBack() {
        if (document.getElementById('flashcards-results').style.display === 'block') {
            this.showPracticeScreen();
        } else if (document.getElementById('flashcards-test').style.display === 'block') {
            this.showPracticeScreen();
        } else if (document.getElementById('flashcards-practice').style.display === 'block') {
            this.showTopicsSelection();
        } else if (document.getElementById('flashcards-topics').style.display === 'block') {
            this.showLanguageSelection();
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
        this.currentCardIndex = 0;
        this.showLanguageSelection();
    }
};

// Global qilish
window.FlashcardsGame = FlashcardsGame;