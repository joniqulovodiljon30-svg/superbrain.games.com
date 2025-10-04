// So'zlar o'yini moduli
class WordsGame {
    constructor() {
        this.currentLevel = 0;
        this.currentWords = [];
        this.userWords = [];
        this.selectedCategory = 'mevalar';
        this.score = 0;
        this.steps = 0;
        this.startTime = null;
        this.timerInterval = null;
    }

    init() {
        this.currentLevel = 0;
        this.currentWords = [];
        this.userWords = [];
        this.score = 0;
        this.steps = 0;
        this.startTime = null;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startGame() {
        this.init();
        this.showCategorySelection();
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

    getElapsedTime() {
        return this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    }

    showCategorySelection() {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="category-selection">
                <div class="selection-header">
                    <h3>Kategoriya Tanlang</h3>
                    <p>Qaysi kategoriya so'zlarini eslab qilmoqchisiz?</p>
                </div>
                
                <div class="categories-grid">
                    <div class="category-card" data-category="mevalar">
                        <div class="category-icon">🍎</div>
                        <div class="category-info">
                            <h4>Mevalar</h4>
                            <p>Turli xil mevalar nomlari</p>
                            <span class="word-count">8 ta so'z</span>
                        </div>
                    </div>
                    
                    <div class="category-card" data-category="sabzavotlar">
                        <div class="category-icon">🥕</div>
                        <div class="category-info">
                            <h4>Sabzavotlar</h4>
                            <p>Turli xil sabzavotlar nomlari</p>
                            <span class="word-count">8 ta so'z</span>
                        </div>
                    </div>
                    
                    <div class="category-card" data-category="hayvonlar">
                        <div class="category-icon">🐘</div>
                        <div class="category-info">
                            <h4>Hayvonlar</h4>
                            <p>Turli xil hayvonlar nomlari</p>
                            <span class="word-count">8 ta so'z</span>
                        </div>
                    </div>
                </div>
                
                <div class="selection-controls">
                    <button id="start-game" class="control-button primary" disabled>
                        <i class="fas fa-play"></i>
                        Boshlash
                    </button>
                </div>
            </div>
        `;

        // Kategoriya kartalariga hodisa qo'shish
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                // Barcha kartalardan active klassini olib tashlash
                document.querySelectorAll('.category-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Tanlangan kartaga active klassini qo'shish
                card.classList.add('active');
                this.selectedCategory = card.dataset.category;
                
                // Boshlash tugmasini faollashtirish
                document.getElementById('start-game').disabled = false;
            });
        });

        // Boshlash tugmasi
        document.getElementById('start-game').addEventListener('click', () => {
            this.showLevel(0);
        });
    }

    showLevel(levelIndex) {
        this.currentLevel = levelIndex;
        const level = gameData.settings.words.levels[levelIndex];
        
        if (!level) {
            this.handleGameComplete();
            return;
        }

        this.startTimer();

        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="level-header">
                <div class="level-indicator">
                    <span class="level-number">${levelIndex + 1}</span>
                    <span class="level-text">Daraja</span>
                </div>
                <div class="level-instruction">
                    <h3>${level.wordCount} ta so'zni eslab qoling</h3>
                    <p>So'zlar ${level.timeToRemember} soniya davomida ko'rsatiladi</p>
                </div>
            </div>
            
            <div class="words-display">
                <div class="words-container" id="words-container"></div>
            </div>
            
            <div class="game-controls">
                <button id="start-memorize" class="control-button primary">
                    <i class="fas fa-play"></i>
                    Ko'rsatishni Boshlash
                </button>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="memorize-progress"></div>
                </div>
                <div class="progress-text" id="progress-text">Tayyor</div>
            </div>
        `;

        this.createWordsDisplay(level.wordCount);
        
        document.getElementById('start-memorize').addEventListener('click', () => {
            this.startMemorization(level);
        });
    }

    createWordsDisplay(wordCount) {
        const container = document.getElementById('words-container');
        container.innerHTML = '';
        
        // Tanlangan kategoriya so'zlarini olish
        const categoryWords = gameData.words.wordLists[this.selectedCategory];
        this.currentWords = Helpers.shuffleArray([...categoryWords]).slice(0, wordCount);

        // So'z kartalarini yaratish
        this.currentWords.forEach((word, index) => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.innerHTML = `
                <div class="card-content">
                    <span class="word-number">${index + 1}</span>
                    <span class="word-text">${word}</span>
                </div>
            `;
            card.dataset.index = index;
            card.dataset.word = word;
            container.appendChild(card);
        });
    }

    startMemorization(level) {
        const cards = document.querySelectorAll('.word-card');
        const startBtn = document.getElementById('start-memorize');
        const progressBar = document.getElementById('memorize-progress');
        const progressText = document.getElementById('progress-text');
        
        // Tugmani o'chirish
        Helpers.setButtonState(startBtn, false, '<i class="fas fa-eye"></i> Ko\'rsatilmoqda...');
        
        // Progress boshlandi
        let progress = 0;
        const totalTime = level.timeToRemember * 1000;
        const progressInterval = setInterval(() => {
            progress += 100;
            const percentage = (progress / totalTime) * 100;
            Helpers.updateProgressBar(progressBar, percentage);
            progressText.textContent = `Eslash: ${Math.round(percentage)}%`;
            
            if (percentage >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);

        // So'zlarni ko'rsatish
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.add('visible');
            });
        }, 500);

        // So'zlarni yashirish va foydalanuvchi kiritishini boshlash
        setTimeout(() => {
            clearInterval(progressInterval);
            Helpers.updateProgressBar(progressBar, 100);
            
            cards.forEach(card => {
                card.classList.remove('visible');
                card.classList.add('hidden');
            });
            
            setTimeout(() => {
                this.startUserInput();
            }, 1000);
        }, totalTime + 500);
    }

    startUserInput() {
        const gameContent = document.getElementById('game-content');
        
        gameContent.innerHTML += `
            <div class="input-section">
                <div class="input-instruction">
                    <h4>So'zlarni ketma-ketlikda kiriting:</h4>
                    <p>Esingizdagi so'zlarni ketma-ketlikda kiriting</p>
                </div>
                
                <div class="word-inputs" id="word-inputs"></div>
                
                <div class="input-controls">
                    <button id="submit-words" class="control-button primary">
                        <i class="fas fa-check"></i>
                        Tasdiqlash
                    </button>
                </div>
            </div>
        `;

        this.createWordInputs();
    }

    createWordInputs() {
        const inputsContainer = document.getElementById('word-inputs');
        inputsContainer.innerHTML = '';
        
        for (let i = 0; i < this.currentWords.length; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.innerHTML = `
                <label class="input-label">
                    <span class="label-number">${i + 1}.</span>
                    <span class="label-text">So'z</span>
                </label>
                <input type="text" class="word-input" data-index="${i}" 
                       placeholder="So'zni kiriting...">
            `;
            inputsContainer.appendChild(inputGroup);
        }

        document.getElementById('submit-words').addEventListener('click', () => {
            this.collectUserInput();
        });
    }

    collectUserInput() {
        this.userWords = [];
        const inputs = document.querySelectorAll('.word-input');
        
        inputs.forEach(input => {
            this.userWords.push(input.value.trim().toLowerCase());
        });

        this.checkAnswer();
    }

    checkAnswer() {
        let correct = true;
        const inputGroups = document.querySelectorAll('.input-group');
        
        // Har bir so'zni tekshirish
        this.userWords.forEach((userWord, index) => {
            const correctWord = this.currentWords[index].toLowerCase();
            const inputGroup = inputGroups[index];
            const input = inputGroup.querySelector('.word-input');
            
            if (userWord === correctWord) {
                input.classList.add('correct');
                Helpers.animateElement(input, 'bounce');
            } else {
                input.classList.add('incorrect');
                input.value += ` (${correctWord})`;
                correct = false;
            }
        });

        // Natijani qayta ishlash
        setTimeout(() => {
            if (correct) {
                this.handleLevelComplete();
            } else {
                this.handleLevelFailed();
            }
        }, 2000);
    }

    handleLevelComplete() {
        this.steps++;
        const level = gameData.settings.words.levels[this.currentLevel];
        const levelScore = level.points;
        this.score += levelScore;

        // Ballarni yangilash
        if (window.gameApp) {
            window.gameApp.updateScore(this.score, this.steps);
        }

        Helpers.showMessage(`Daraja ${this.currentLevel + 1} muvaffaqqiyatli yakunlandi! +${levelScore} ball`, 'success');

        // Keyingi darajaga o'tish
        if (this.currentLevel < gameData.settings.words.levels.length - 1) {
            setTimeout(() => {
                this.showLevel(this.currentLevel + 1);
            }, 1500);
        } else {
            setTimeout(() => {
                this.handleGameComplete();
            }, 1500);
        }
    }

    handleLevelFailed() {
        this.steps++;
        Helpers.showMessage('Noto\'g\'ri ketma-ketlik! Qaytadan urinib ko\'ring.', 'error');
        
        // Foydalanuvchi kiritishini qayta faollashtirish
        setTimeout(() => {
            this.userWords = [];
            const inputs = document.querySelectorAll('.word-input');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
        }, 2000);
    }

    handleGameComplete() {
        this.stopTimer();
        const totalTime = this.getElapsedTime();
        
        // Natijalarni saqlash
        Storage.saveGameResult('words', this.score, this.steps, totalTime, this.currentLevel + 1);
        
        // Asosiy app ga natijani yuborish
        if (window.gameApp) {
            const isWin = this.currentLevel === gameData.settings.words.levels.length - 1;
            window.gameApp.showResults(this.score, this.steps, totalTime, isWin);
        }
    }
}

// Global instance yaratish
const WordsGameInstance = new WordsGame();