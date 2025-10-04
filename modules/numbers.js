// Raqamlar moduli
const NumbersGame = {
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
        document.getElementById('start-numbers').addEventListener('click', () => {
            this.startGame();
        });

        // Tekshirish tugmasi
        document.getElementById('check-numbers').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Orqaga tugmasi
        document.querySelector('#numbers-section .back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Bosh sahifa va qayta o'ynash tugmalari
        document.querySelector('#numbers-results .home-btn').addEventListener('click', () => {
            this.goToHome();
        });

        document.querySelector('#numbers-results .retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
    },

    // Sozlamalar ekranini ko'rsatish
    showSettingsScreen() {
        this.hideAllScreens();
        document.getElementById('numbers-settings').style.display = 'block';
    },

    // O'yinni boshlash
    startGame() {
        const numbersCount = parseInt(document.getElementById('numbers-count').value);
        const studyTime = parseInt(document.getElementById('numbers-time').value);

        // Sozlamalarni tekshirish
        if (numbersCount < 3 || numbersCount > 50) {
            Helpers.showError('Raqamlar soni 3 dan 50 gacha bo\'lishi kerak');
            return;
        }

        if (studyTime < 5 || studyTime > 300) {
            Helpers.showError('Vaqt 5 soniyadan 300 soniyagacha bo\'lishi kerak');
            return;
        }

        // O'yin ma'lumotlarini yaratish
        this.currentGame = {
            numbers: DataManager.generateRandomNumbers(numbersCount),
            studyTime: studyTime,
            userAnswers: [],
            startTime: new Date(),
            settings: {
                numbersCount: numbersCount,
                studyTime: studyTime
            }
        };

        this.showDisplayScreen();
    },

    // Ko'rsatish ekranini ko'rsatish
    showDisplayScreen() {
        this.hideAllScreens();
        document.getElementById('numbers-display').style.display = 'block';

        // Raqamlarni ko'rsatish
        this.displayNumbers();

        // Timer ni boshlash
        this.startTimer();
    },

    // Raqamlarni ekranga chiqarish
    displayNumbers() {
        const grid = document.getElementById('numbers-grid');
        grid.innerHTML = '';

        this.currentGame.numbers.forEach((number, index) => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number-item';
            numberElement.textContent = number;
            numberElement.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(numberElement);
        });
    },

    // Timer ni boshlash
    startTimer() {
        let timeLeft = this.currentGame.studyTime;
        const timerElement = document.getElementById('numbers-timer');

        const updateTimer = () => {
            timerElement.textContent = timeLeft;
            
            // Rangni o'zgartirish
            if (timeLeft <= 10) {
                timerElement.style.color = '#ef4444'; // Qizil
                timerElement.style.animation = 'pulse 0.5s infinite';
            } else if (timeLeft <= 30) {
                timerElement.style.color = '#f59e0b'; // Sariq
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
        document.getElementById('numbers-input').style.display = 'block';

        // Input kataklarini yaratish
        this.createInputCells();
    },

    // Input kataklarini yaratish
    createInputCells() {
        const inputGrid = document.getElementById('numbers-input-grid');
        inputGrid.innerHTML = '';

        const numbersCount = this.currentGame.numbers.length;

        for (let i = 0; i < numbersCount; i++) {
            const inputCell = document.createElement('input');
            inputCell.type = 'text';
            inputCell.className = 'input-cell';
            inputCell.maxLength = 1;
            inputCell.placeholder = '?';
            inputCell.dataset.index = i;

            // Faqat raqam qabul qilish
            inputCell.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
                // Keyingi input ga o'tish
                if (e.target.value !== '' && i < numbersCount - 1) {
                    const nextInput = inputGrid.querySelector(`[data-index="${i + 1}"]`);
                    if (nextInput) nextInput.focus();
                }
            });

            // Klaviatura navigatsiyasi
            inputCell.addEventListener('keydown', (e) => {
                if (Helpers.isEnterKey(e)) {
                    e.preventDefault();
                    if (i < numbersCount - 1) {
                        const nextInput = inputGrid.querySelector(`[data-index="${i + 1}"]`);
                        if (nextInput) nextInput.focus();
                    } else {
                        document.getElementById('check-numbers').focus();
                    }
                } else if (e.key === 'Backspace' && e.target.value === '' && i > 0) {
                    const prevInput = inputGrid.querySelector(`[data-index="${i - 1}"]`);
                    if (prevInput) prevInput.focus();
                }
            });

            inputGrid.appendChild(inputCell);
        }

        // Birinchi input ni focus qilish
        const firstInput = inputGrid.querySelector('[data-index="0"]');
        if (firstInput) firstInput.focus();
    },

    // Javoblarni tekshirish
    checkAnswers() {
        const inputCells = document.querySelectorAll('#numbers-input-grid .input-cell');
        const userAnswers = [];

        // Javoblarni yig'ish
        inputCells.forEach((input, index) => {
            userAnswers[index] = input.value === '' ? null : parseInt(input.value);
        });

        this.currentGame.userAnswers = userAnswers;

        // Natijalarni hisoblash
        this.calculateResults();
    },

    // Natijalarni hisoblash
    calculateResults() {
        const correctNumbers = this.currentGame.numbers;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        const results = [];

        // Har bir javobni tekshirish
        correctNumbers.forEach((correctNumber, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === correctNumber;

            if (isCorrect) {
                correctCount++;
            }

            results.push({
                index: index,
                correct: correctNumber,
                userAnswer: userAnswer,
                isCorrect: isCorrect
            });
        });

        // Ballarni hisoblash
        const percentage = Helpers.calculatePercentage(correctCount, correctNumbers.length);
        const score = Math.round((correctCount / correctNumbers.length) * 1000);

        // O'yin natijasini saqlash
        const gameResult = {
            gameType: 'numbers',
            score: score,
            total: correctNumbers.length,
            percentage: percentage,
            correctCount: correctCount,
            details: {
                numbers: correctNumbers,
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
        document.getElementById('numbers-results').style.display = 'block';

        // Ballarni ko'rsatish
        document.getElementById('numbers-score').textContent = gameResult.score;

        // Natijalarni solishtirish
        this.displayComparison(results);

        // Konfet animatsiyasi (agar yaxshi natija bo'lsa)
        if (gameResult.percentage >= 80) {
            Helpers.showConfetti();
        }
    },

    // Solishtirish natijalarini ko'rsatish
    displayComparison(results) {
        const comparisonElement = document.getElementById('numbers-comparison');
        comparisonElement.innerHTML = '';

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;

            let content = '';
            
            if (result.isCorrect) {
                content = `
                    <div class="result-answer">
                        <strong>${index + 1}.</strong> ${result.correct} ✓
                    </div>
                    <div class="result-status" style="color: #10b981;">
                        To'g'ri
                    </div>
                `;
            } else {
                content = `
                    <div class="result-answer">
                        <strong>${index + 1}.</strong> 
                        <span class="result-user-answer">${result.userAnswer !== null ? result.userAnswer : '---'}</span>
                        <span class="result-correct-answer">→ ${result.correct}</span>
                    </div>
                    <div class="result-status" style="color: #ef4444;">
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
            'numbers-settings',
            'numbers-display',
            'numbers-input',
            'numbers-results'
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
        if (document.getElementById('numbers-results').style.display === 'block') {
            this.showInputScreen();
        } else if (document.getElementById('numbers-input').style.display === 'block') {
            this.showDisplayScreen();
        } else if (document.getElementById('numbers-display').style.display === 'block') {
            this.showSettingsScreen();
        } else {
            this.goToHome();
        }
    },

    // Bosh sahifaga qaytish
    goToHome() {
        // App.js dagi asosiy funksiyani chaqiramiz
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
window.NumbersGame = NumbersGame;