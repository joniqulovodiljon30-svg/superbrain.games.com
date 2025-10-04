// Raqamlar o'yini moduli
class NumbersGame {
    constructor() {
        this.currentLevel = 0;
        this.currentSequence = [];
        this.userSequence = [];
        this.isMemorizing = false;
        this.score = 0;
        this.steps = 0;
        this.startTime = null;
        this.timerInterval = null;
    }

    init() {
        this.currentLevel = 0;
        this.currentSequence = [];
        this.userSequence = [];
        this.isMemorizing = false;
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
        this.showLevel(0);
        this.startTimer();
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

    showLevel(levelIndex) {
        this.currentLevel = levelIndex;
        const level = gameData.settings.numbers.levels[levelIndex];
        
        if (!level) {
            this.handleGameComplete();
            return;
        }

        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="level-header">
                <div class="level-indicator">
                    <span class="level-number">${levelIndex + 1}</span>
                    <span class="level-text">Daraja</span>
                </div>
                <div class="level-instruction">
                    <h3>${level.sequenceLength} ta raqamni eslab qoling</h3>
                    <p>Raqamlar ketma-ketlikda ko'rsatiladi, ularni eslab qoling va takrorlang</p>
                </div>
            </div>
            
            <div class="numbers-display">
                <div class="numbers-grid" id="numbers-grid"></div>
            </div>
            
            <div class="game-controls">
                <button id="start-memorize" class="control-button primary">
                    <i class="fas fa-play"></i>
                    Boshlash
                </button>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="memorize-progress"></div>
                </div>
                <div class="progress-text" id="progress-text">Tayyor</div>
            </div>
        `;

        this.createNumbersGrid(level.sequenceLength);
        
        document.getElementById('start-memorize').addEventListener('click', () => {
            this.startMemorization(level);
        });
    }

    createNumbersGrid(count) {
        const grid = document.getElementById('numbers-grid');
        grid.innerHTML = '';
        
        // Tasodifiy raqamlar ketma-ketligi yaratish
        this.currentSequence = [];
        for (let i = 0; i < count; i++) {
            this.currentSequence.push(Helpers.getRandomInt(1, 9));
        }

        // Raqam kartalarini yaratish
        this.currentSequence.forEach((number, index) => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.innerHTML = `
                <div class="card-front">
                    <span class="number">${number}</span>
                </div>
                <div class="card-back">
                    <i class="fas fa-question"></i>
                </div>
            `;
            card.dataset.index = index;
            card.dataset.number = number;
            grid.appendChild(card);
        });
    }

    startMemorization(level) {
        this.isMemorizing = true;
        const cards = document.querySelectorAll('.number-card');
        const startBtn = document.getElementById('start-memorize');
        const progressBar = document.getElementById('memorize-progress');
        const progressText = document.getElementById('progress-text');
        
        // Tugmani o'chirish
        Helpers.setButtonState(startBtn, false, '<i class="fas fa-spinner fa-spin"></i> Eslash...');
        
        // Progress boshlandi
        let progress = 0;
        const totalTime = level.timeToRemember * 1000;
        const progressInterval = setInterval(() => {
            progress += 100;
            const percentage = (progress / totalTime) * 100;
            Helpers.updateProgressBar(progressBar, percentage);
            
            if (percentage >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);

        // Raqamlarni ketma-ketlikda ko'rsatish
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
                Helpers.animateElement(card, 'pulse');
                
                // Progress text yangilash
                progressText.textContent = `${index + 1}/${cards.length} raqam ko'rsatildi`;
                
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 800);
            }, index * 1200);
        });

        // Eslash vaqtini sozlash
        const memorizeTime = cards.length * 1200 + 1000;
        setTimeout(() => {
            clearInterval(progressInterval);
            Helpers.updateProgressBar(progressBar, 100);
            progressText.textContent = "Endi sizning navbatingiz!";
            this.startUserInput();
        }, memorizeTime);
    }

    startUserInput() {
        this.isMemorizing = false;
        const gameContent = document.getElementById('game-content');
        
        gameContent.innerHTML += `
            <div class="input-section">
                <div class="input-instruction">
                    <h4>Raqamlarni ketma-ketlikda kiriting:</h4>
                    <p>Quyidagi tugmalar yordamida raqamlarni ketma-ketlikda bosing</p>
                </div>
                <div class="sequence-display" id="sequence-display">
                    <div class="sequence-placeholder">
                        <i class="fas fa-mouse-pointer"></i>
                        <span>Raqamlarni bosing</span>
                    </div>
                </div>
                <div class="input-grid" id="input-grid"></div>
                <div class="input-controls">
                    <button id="clear-input" class="control-button secondary">
                        <i class="fas fa-eraser"></i>
                        Tozalash
                    </button>
                    <button id="submit-sequence" class="control-button primary" disabled>
                        <i class="fas fa-check"></i>
                        Tasdiqlash
                    </button>
                </div>
            </div>
        `;

        this.createInputGrid();
        this.bindInputEvents();
    }

    createInputGrid() {
        const inputGrid = document.getElementById('input-grid');
        inputGrid.innerHTML = '';
        
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-input-btn';
            btn.innerHTML = `
                <span class="number">${i}</span>
            `;
            btn.dataset.number = i;
            btn.addEventListener('click', () => this.handleNumberInput(i));
            inputGrid.appendChild(btn);
        }
    }

    bindInputEvents() {
        document.getElementById('clear-input').addEventListener('click', () => {
            this.userSequence = [];
            this.updateSequenceDisplay();
        });

        document.getElementById('submit-sequence').addEventListener('click', () => {
            this.checkAnswer();
        });
    }

    handleNumberInput(number) {
        if (this.userSequence.length >= this.currentSequence.length) {
            return;
        }

        this.userSequence.push(number);
        this.updateSequenceDisplay();
        
        // Tugmani faollashtirish
        const submitBtn = document.getElementById('submit-sequence');
        if (this.userSequence.length === this.currentSequence.length) {
            submitBtn.disabled = false;
        }
    }

    updateSequenceDisplay() {
        const display = document.getElementById('sequence-display');
        
        if (this.userSequence.length === 0) {
            display.innerHTML = `
                <div class="sequence-placeholder">
                    <i class="fas fa-mouse-pointer"></i>
                    <span>Raqamlarni bosing</span>
                </div>
            `;
        } else {
            display.innerHTML = this.userSequence.map(num => `
                <div class="sequence-number">${num}</div>
            `).join('');
        }
    }

    checkAnswer() {
        let correct = true;
        const sequenceDisplay = document.getElementById('sequence-display');
        
        // Har bir raqamni tekshirish
        this.userSequence.forEach((userNum, index) => {
            const correctNum = this.currentSequence[index];
            const numberEl = sequenceDisplay.children[index];
            
            if (userNum === correctNum) {
                numberEl.classList.add('correct');
                Helpers.animateElement(numberEl, 'bounce');
            } else {
                numberEl.classList.add('incorrect');
                numberEl.innerHTML += ` <small>(${correctNum})</small>`;
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
        const level = gameData.settings.numbers.levels[this.currentLevel];
        const levelScore = level.points;
        this.score += levelScore;

        // Ballarni yangilash
        if (window.gameApp) {
            window.gameApp.updateScore(this.score, this.steps);
        }

        Helpers.showMessage(`Daraja ${this.currentLevel + 1} muvaffaqqiyatli yakunlandi! +${levelScore} ball`, 'success');

        // Keyingi darajaga o'tish
        if (this.currentLevel < gameData.settings.numbers.levels.length - 1) {
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
            this.userSequence = [];
            this.updateSequenceDisplay();
            document.getElementById('submit-sequence').disabled = true;
        }, 2000);
    }

    handleGameComplete() {
        this.stopTimer();
        const totalTime = this.getElapsedTime();
        
        // Natijalarni saqlash
        Storage.saveGameResult('numbers', this.score, this.steps, totalTime, this.currentLevel + 1);
        
        // Asosiy app ga natijani yuborish
        if (window.gameApp) {
            const isWin = this.currentLevel === gameData.settings.numbers.levels.length - 1;
            window.gameApp.showResults(this.score, this.steps, totalTime, isWin);
        }
    }
}

// Global instance yaratish
const NumbersGameInstance = new NumbersGame();