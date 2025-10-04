// Flash Kartalar O'yini Moduli
class FlashcardsGame {
    constructor() {
        this.currentLanguage = null;
        this.currentCategory = null;
        this.currentWords = [];
        this.currentCardIndex = 0;
        this.learningMode = true; // true = o'rganish, false = test
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswers = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.cardStates = {}; // Kartalarning holatlari
    }

    init() {
        this.currentLanguage = null;
        this.currentCategory = null;
        this.currentWords = [];
        this.currentCardIndex = 0;
        this.learningMode = true;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswers = 0;
        this.startTime = null;
        this.cardStates = {};
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startGame() {
        this.init();
        this.showLanguageSelection();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('game-timer').textContent = Helpers.formatTime(elapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    showLanguageSelection() {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="language-selection">
                <div class="selection-header">
                    <h3>Til Tanlang</h3>
                    <p>Qaysi tilda so'zlarni o'rganmoqchisiz?</p>
                </div>
                
                <div class="languages-grid">
                    ${Object.entries(gameData.languages).map(([key, lang]) => `
                        <div class="language-card" data-language="${key}">
                            <div class="language-flag">${lang.flag}</div>
                            <div class="language-info">
                                <h4>${lang.name}</h4>
                                <p>${Object.keys(lang.categories).length} ta mavzu</p>
                                <div class="language-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${this.getLanguageProgress(key)}%"></div>
                                    </div>
                                    <span>${Math.round(this.getLanguageProgress(key))}%</span>
                                </div>
                            </div>
                            <div class="language-badge">
                                <i class="fas fa-book-open"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Til kartalariga hodisa qo'shish
        document.querySelectorAll('.language-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentLanguage = card.dataset.language;
                this.showCategorySelection();
            });
        });
    }

    getLanguageProgress(languageKey) {
        const progress = Storage.getFlashcardProgress(languageKey, 'overall') || {
            learned: 0,
            total: 0,
            correctAnswers: 0,
            totalAnswers: 0
        };
        
        const totalWords = Object.values(gameData.languages[languageKey].categories)
            .reduce((sum, category) => sum + category.words.length, 0);
        
        return progress.learned > 0 ? (progress.learned / totalWords) * 100 : 0;
    }

    showCategorySelection() {
        const language = gameData.languages[this.currentLanguage];
        const gameContent = document.getElementById('game-content');
        
        gameContent.innerHTML = `
            <div class="category-selection">
                <div class="selection-header">
                    <div class="back-button" onclick="FlashcardsGameInstance.showLanguageSelection()">
                        <i class="fas fa-arrow-left"></i>
                        Tillarga qaytish
                    </div>
                    <h3>${language.name} - Mavzular</h3>
                    <p>Qaysi mavzuni o'rganmoqchisiz?</p>
                </div>
                
                <div class="categories-grid">
                    ${Object.entries(language.categories).map(([key, category]) => {
                        const progress = Storage.getFlashcardProgress(this.currentLanguage, key);
                        const progressPercent = progress.total > 0 ? (progress.learned / category.words.length) * 100 : 0;
                        
                        return `
                            <div class="category-card" data-category="${key}">
                                <div class="category-header">
                                    <h4>${category.name}</h4>
                                    <span class="word-count">${category.words.length} so'z</span>
                                </div>
                                <div class="category-progress">
                                    <div class="progress-info">
                                        <span>O'zlashtirilgan: ${progress.learned}/${category.words.length}</span>
                                        <span>${Math.round(progressPercent)}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                    </div>
                                </div>
                                <div class="category-actions">
                                    <button class="action-btn learn-btn" onclick="event.stopPropagation(); FlashcardsGameInstance.startLearning('${key}')">
                                        <i class="fas fa-graduation-cap"></i>
                                        O'rganish
                                    </button>
                                    <button class="action-btn test-btn" onclick="event.stopPropagation(); FlashcardsGameInstance.startTest('${key}')">
                                        <i class="fas fa-clipboard-check"></i>
                                        Test
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    startLearning(categoryKey) {
        this.currentCategory = categoryKey;
        this.learningMode = true;
        this.currentWords = [...gameData.languages[this.currentLanguage].categories[categoryKey].words];
        this.currentCardIndex = 0;
        this.startTimer();
        this.showLearningCard();
    }

    startTest(categoryKey) {
        this.currentCategory = categoryKey;
        this.learningMode = false;
        this.currentWords = Helpers.shuffleArray([...gameData.languages[this.currentLanguage].categories[categoryKey].words]);
        this.currentCardIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswers = 0;
        this.startTimer();
        this.showTestCard();
    }

    showLearningCard() {
        if (this.currentCardIndex >= this.currentWords.length) {
            this.completeLearning();
            return;
        }

        const word = this.currentWords[this.currentCardIndex];
        const progress = ((this.currentCardIndex + 1) / this.currentWords.length) * 100;
        
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="flashcard-learning">
                <div class="learning-header">
                    <div class="progress-info">
                        <span>${this.currentCardIndex + 1}/${this.currentWords.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <button class="control-button secondary" onclick="FlashcardsGameInstance.showCategorySelection()">
                        <i class="fas fa-times"></i>
                        Yakunlash
                    </button>
                </div>
                
                <div class="flashcard-container">
                    <div class="flashcard" id="flashcard">
                        <div class="card-front">
                            <div class="card-content">
                                <div class="word-main">
                                    <h2>${word.word}</h2>
                                    <div class="pronunciation">${word.pronunciation}</div>
                                </div>
                                <div class="card-hint">
                                    <i class="fas fa-sync-alt"></i>
                                    Kartani aylantirish uchun bosing
                                </div>
                            </div>
                        </div>
                        <div class="card-back">
                            <div class="card-content">
                                <div class="translation">
                                    <h3>${word.translation}</h3>
                                    <div class="emoji">${word.emoji}</div>
                                </div>
                                <div class="definition">
                                    <p>${word.definition}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="learning-controls">
                    <button class="control-button secondary" onclick="FlashcardsGameInstance.markAsDifficult()">
                        <i class="fas fa-exclamation-triangle"></i>
                        Qiyin
                    </button>
                    <button class="control-button primary" onclick="FlashcardsGameInstance.nextCard()">
                        <i class="fas fa-arrow-right"></i>
                        Keyingi Karta
                    </button>
                </div>
            </div>
        `;

        // Karta aylanish effekti
        const flashcard = document.getElementById('flashcard');
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    }

    showTestCard() {
        if (this.currentCardIndex >= this.currentWords.length) {
            this.completeTest();
            return;
        }

        const word = this.currentWords[this.currentCardIndex];
        const progress = ((this.currentCardIndex + 1) / this.currentWords.length) * 100;
        
        // Test variantlarini tayyorlash
        const options = this.generateTestOptions(word);
        
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="flashcard-test">
                <div class="test-header">
                    <div class="progress-info">
                        <span>${this.currentCardIndex + 1}/${this.currentWords.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div class="score-display">
                        <i class="fas fa-star"></i>
                        ${this.correctAnswers}/${this.totalAnswers}
                    </div>
                </div>
                
                <div class="test-question">
                    <div class="question-text">
                        <h3>"${this.learningMode ? word.translation : word.word}" so'zining ${this.learningMode ? this.currentLanguage + 'cha' : 'o\'zbekcha'} tarjimasini toping:</h3>
                    </div>
                    
                    <div class="test-options">
                        ${options.map((option, index) => `
                            <div class="option-card" data-correct="${option.correct}" onclick="FlashcardsGameInstance.checkAnswer(this, ${option.correct})">
                                <div class="option-content">
                                    <span class="option-text">${option.text}</span>
                                    ${option.pronunciation ? `<span class="option-pronunciation">${option.pronunciation}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="test-stats">
                    <div class="stat-item">
                        <i class="fas fa-check-circle"></i>
                        To'g'ri: <strong>${this.correctAnswers}</strong>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-times-circle"></i>
                        Noto'g'ri: <strong>${this.totalAnswers - this.correctAnswers}</strong>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-percentage"></i>
                        Aniqlik: <strong>${this.totalAnswers > 0 ? Math.round((this.correctAnswers / this.totalAnswers) * 100) : 0}%</strong>
                    </div>
                </div>
            </div>
        `;
    }

    generateTestOptions(correctWord) {
        const language = gameData.languages[this.currentLanguage];
        const category = language.categories[this.currentCategory];
        
        // Boshqa so'zlardan 3 ta noto'g'ri variant olish
        const otherWords = category.words.filter(w => 
            w.word !== correctWord.word && w.translation !== correctWord.translation
        );
        
        const wrongOptions = Helpers.shuffleArray(otherWords).slice(0, 3);
        
        // Variantlarni tayyorlash
        const options = [
            {
                text: this.learningMode ? correctWord.word : correctWord.translation,
                pronunciation: this.learningMode ? correctWord.pronunciation : '',
                correct: true
            },
            ...wrongOptions.map(word => ({
                text: this.learningMode ? word.word : word.translation,
                pronunciation: this.learningMode ? word.pronunciation : '',
                correct: false
            }))
        ];
        
        return Helpers.shuffleArray(options);
    }

    checkAnswer(optionElement, isCorrect) {
        this.totalAnswers++;
        
        if (isCorrect) {
            this.correctAnswers++;
            this.score += 10;
            optionElement.classList.add('correct');
            Helpers.showMessage('Toʻgʻri! ✅', 'success');
        } else {
            optionElement.classList.add('incorrect');
            // To'g'ri javobni ko'rsatish
            const correctOption = document.querySelector('.option-card[data-correct="true"]');
            correctOption.classList.add('correct');
            Helpers.showMessage('Notoʻgʻri! ❌', 'error');
        }
        
        // Barcha tugmalarni o'chirish
        document.querySelectorAll('.option-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        // Keyingi savolga o'tish
        setTimeout(() => {
            this.currentCardIndex++;
            this.showTestCard();
        }, 2000);
    }

    nextCard() {
        // Kartani o'zlashtirilgan deb belgilash
        this.markCardAsLearned();
        
        this.currentCardIndex++;
        this.showLearningCard();
    }

    markCardAsLearned() {
        const word = this.currentWords[this.currentCardIndex];
        const progress = Storage.getFlashcardProgress(this.currentLanguage, this.currentCategory);
        
        if (!progress.learnedWords) {
            progress.learnedWords = [];
        }
        
        if (!progress.learnedWords.includes(word.word)) {
            progress.learnedWords.push(word.word);
            progress.learned = progress.learnedWords.length;
        }
        
        Storage.saveFlashcardProgress(this.currentLanguage, this.currentCategory, progress);
    }

    markAsDifficult() {
        const word = this.currentWords[this.currentCardIndex];
        const progress = Storage.getFlashcardProgress(this.currentLanguage, this.currentCategory);
        
        if (!progress.difficultWords) {
            progress.difficultWords = [];
        }
        
        if (!progress.difficultWords.includes(word.word)) {
            progress.difficultWords.push(word.word);
        }
        
        Storage.saveFlashcardProgress(this.currentLanguage, this.currentCategory, progress);
        Helpers.showMessage('Qiyin soʻz sifatida belgilandi 📝', 'warning');
        
        this.nextCard();
    }

    completeLearning() {
        this.stopTimer();
        const totalTime = this.getElapsedTime();
        
        Helpers.showMessage(`Mashq yakunlandi! ${this.currentWords.length} ta soʻzni koʻrib chiqdingiz 🎓`, 'success');
        
        setTimeout(() => {
            this.showCategorySelection();
        }, 2000);
    }

    completeTest() {
        this.stopTimer();
        const totalTime = this.getElapsedTime();
        const accuracy = this.totalAnswers > 0 ? (this.correctAnswers / this.totalAnswers) * 100 : 0;
        
        // Natijalarni saqlash
        Storage.saveGameResult('flashcards', this.score, this.totalAnswers, totalTime, Math.round(accuracy));
        
        // Progress yangilash
        const progress = Storage.getFlashcardProgress(this.currentLanguage, this.currentCategory);
        progress.correctAnswers += this.correctAnswers;
        progress.totalAnswers += this.totalAnswers;
        Storage.saveFlashcardProgress(this.currentLanguage, this.currentCategory, progress);
        
        // Natijalarni ko'rsatish
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="test-results">
                <div class="results-header">
                    <div class="results-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>Test Yakunlandi!</h3>
                    <p>${gameData.languages[this.currentLanguage].name} - ${gameData.languages[this.currentLanguage].categories[this.currentCategory].name}</p>
                </div>
                
                <div class="results-stats">
                    <div class="result-card">
                        <div class="result-value">${this.correctAnswers}/${this.totalAnswers}</div>
                        <div class="result-label">To'g'ri Javoblar</div>
                    </div>
                    <div class="result-card">
                        <div class="result-value">${Math.round(accuracy)}%</div>
                        <div class="result-label">Aniqlik</div>
                    </div>
                    <div class="result-card">
                        <div class="result-value">${this.score}</div>
                        <div class="result-label">Ball</div>
                    </div>
                    <div class="result-card">
                        <div class="result-value">${Helpers.formatTime(totalTime)}</div>
                        <div class="result-label">Vaqt</div>
                    </div>
                </div>
                
                <div class="results-message">
                    <p>${this.getTestMessage(accuracy)}</p>
                </div>
                
                <div class="results-actions">
                    <button class="control-button secondary" onclick="FlashcardsGameInstance.showCategorySelection()">
                        <i class="fas fa-th-large"></i>
                        Mavzularga Qaytish
                    </button>
                    <button class="control-button primary" onclick="FlashcardsGameInstance.startTest('${this.currentCategory}')">
                        <i class="fas fa-redo"></i>
                        Qayta Urinish
                    </button>
                </div>
            </div>
        `;
    }

    getTestMessage(accuracy) {
        if (accuracy >= 90) return "Ajoyib natija! Siz bu mavzuni mukammal bilasiz! 🌟";
        if (accuracy >= 70) return "Yaxshi natija! Biroz mashq qilish kerak. 💪";
        if (accuracy >= 50) return "Yaxshi boshlanish! Mashqda davom eting. 📚";
        return "Qaytadan urinib ko'ring, siz yaxshilashingiz mumkin! 🚀";
    }

    getElapsedTime() {
        return this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    }
}

// Global instance yaratish
const FlashcardsGameInstance = new FlashcardsGame();