// Yuz va Ismlar moduli
const FacesGame = {
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
        document.getElementById('start-faces').addEventListener('click', () => {
            this.startGame();
        });

        // Tekshirish tugmasi
        document.getElementById('check-faces').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Orqaga tugmasi
        document.querySelector('#faces-section .back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Bosh sahifa va qayta o'ynash tugmalari
        document.querySelector('#faces-results .home-btn').addEventListener('click', () => {
            this.goToHome();
        });

        document.querySelector('#faces-results .retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
    },

    // Sozlamalar ekranini ko'rsatish
    showSettingsScreen() {
        this.hideAllScreens();
        document.getElementById('faces-settings').style.display = 'block';
    },

    // O'yinni boshlash
    startGame() {
        const facesCount = parseInt(document.getElementById('faces-count').value);
        const studyTime = parseInt(document.getElementById('faces-time').value);

        // Sozlamalarni tekshirish
        if (facesCount < 3 || facesCount > 20) {
            Helpers.showError('Yuzlar soni 3 dan 20 gacha bo\'lishi kerak');
            return;
        }

        if (studyTime < 10 || studyTime > 180) {
            Helpers.showError('Vaqt 10 soniyadan 180 soniyagacha bo\'lishi kerak');
            return;
        }

        // Tasodifiy yuzlarni olish
        const faces = DataManager.getRandomFaces(facesCount);
        
        if (faces.length === 0) {
            Helpers.showError('Yuzlar ma\'lumotlari topilmadi');
            return;
        }

        // O'yin ma'lumotlarini yaratish
        this.currentGame = {
            faces: faces,
            studyTime: studyTime,
            userAnswers: [],
            startTime: new Date(),
            settings: {
                facesCount: facesCount,
                studyTime: studyTime
            }
        };

        this.showDisplayScreen();
    },

    // Ko'rsatish ekranini ko'rsatish
    showDisplayScreen() {
        this.hideAllScreens();
        document.getElementById('faces-display').style.display = 'block';

        // Yuzlarni ko'rsatish
        this.displayFaces();

        // Timer ni boshlash
        this.startTimer();
    },

    // Yuzlarni ekranga chiqarish
    displayFaces() {
        const facesGrid = document.getElementById('faces-grid');
        facesGrid.innerHTML = '';

        this.currentGame.faces.forEach((face, index) => {
            const faceElement = document.createElement('div');
            faceElement.className = 'face-item';
            faceElement.innerHTML = `
                <div class="face-image" style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">
                    ${face.image}
                </div>
                <div class="face-info" style="text-align: center;">
                    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">${face.name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${face.description}</div>
                </div>
            `;
            faceElement.style.animationDelay = `${index * 0.2}s`;
            facesGrid.appendChild(faceElement);
        });
    },

    // Timer ni boshlash
    startTimer() {
        let timeLeft = this.currentGame.studyTime;
        const timerElement = document.getElementById('faces-timer');

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
        document.getElementById('faces-input').style.display = 'block';

        // Input kataklarini yaratish
        this.createInputFields();
    },

    // Input kataklarini yaratish
    createInputFields() {
        const inputList = document.getElementById('faces-input-list');
        inputList.innerHTML = '';

        // Yuzlarni aralashtirish (test uchun)
        const shuffledFaces = Helpers.shuffleArray([...this.currentGame.faces]);

        shuffledFaces.forEach((face, index) => {
            const inputItem = document.createElement('div');
            inputItem.className = 'face-input-item';
            inputItem.style.display = 'flex';
            inputItem.style.alignItems = 'center';
            inputItem.style.marginBottom = '1rem';
            inputItem.style.padding = '1rem';
            inputItem.style.background = 'var(--bg-input)';
            inputItem.style.borderRadius = 'var(--border-radius-sm)';
            
            inputItem.innerHTML = `
                <div class="face-input-image" style="font-size: 3rem; margin-right: 1rem;">
                    ${face.image}
                </div>
                <input type="text" 
                       class="face-input-field" 
                       placeholder="Ismni yozing..." 
                       data-face-id="${face.id}"
                       style="flex: 1; padding: 0.8rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem;">
            `;

            inputList.appendChild(inputItem);
        });

        // Birinchi input ni focus qilish
        const firstInput = inputList.querySelector('.face-input-field');
        if (firstInput) firstInput.focus();

        // Enter bosganda keyingi input ga o'tish
        const inputs = inputList.querySelectorAll('.face-input-field');
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (Helpers.isEnterKey(e)) {
                    e.preventDefault();
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        document.getElementById('check-faces').focus();
                    }
                }
            });
        });
    },

    // Javoblarni tekshirish
    checkAnswers() {
        const inputFields = document.querySelectorAll('#faces-input-list .face-input-field');
        const userAnswers = [];

        // Javoblarni yig'ish
        inputFields.forEach((input) => {
            const faceId = parseInt(input.dataset.faceId);
            const answer = input.value.trim();
            
            userAnswers.push({
                faceId: faceId,
                answer: answer
            });
        });

        this.currentGame.userAnswers = userAnswers;

        // Natijalarni hisoblash
        this.calculateResults();
    },

    // Natijalarni hisoblash
    calculateResults() {
        const correctFaces = this.currentGame.faces;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        const results = [];

        // Har bir javobni tekshirish
        userAnswers.forEach(userAnswer => {
            const correctFace = correctFaces.find(face => face.id === userAnswer.faceId);
            
            if (correctFace) {
                const isCorrect = userAnswer.answer.toLowerCase() === correctFace.name.toLowerCase();
                
                if (isCorrect) {
                    correctCount++;
                }

                results.push({
                    faceId: correctFace.id,
                    image: correctFace.image,
                    correctName: correctFace.name,
                    description: correctFace.description,
                    userAnswer: userAnswer.answer,
                    isCorrect: isCorrect
                });
            }
        });

        // Ballarni hisoblash
        const percentage = Helpers.calculatePercentage(correctCount, correctFaces.length);
        const score = Math.round((correctCount / correctFaces.length) * 1000);

        // O'yin natijasini saqlash
        const gameResult = {
            gameType: 'faces',
            score: score,
            total: correctFaces.length,
            percentage: percentage,
            correctCount: correctCount,
            details: {
                faces: correctFaces,
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
        document.getElementById('faces-results').style.display = 'block';

        // Ballarni ko'rsatish
        document.getElementById('faces-score').textContent = gameResult.score;

        // Natijalarni solishtirish
        this.displayComparison(results);

        // Konfet animatsiyasi (agar yaxshi natija bo'lsa)
        if (gameResult.percentage >= 80) {
            Helpers.showConfetti();
        }
    },

    // Solishtirish natijalarini ko'rsatish
    displayComparison(results) {
        const comparisonElement = document.getElementById('faces-comparison');
        comparisonElement.innerHTML = '';

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            resultItem.style.display = 'flex';
            resultItem.style.alignItems = 'center';
            resultItem.style.padding = '1rem';

            let content = '';
            
            if (result.isCorrect) {
                content = `
                    <div style="font-size: 2rem; margin-right: 1rem;">${result.image}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${result.correctName}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                            ${result.description}
                        </div>
                        <div style="margin-top: 0.5rem; color: var(--text-secondary);">
                            Sizning javobingiz: <strong style="color: #10b981;">${result.userAnswer}</strong> ✓
                        </div>
                    </div>
                    <div style="color: #10b981; min-width: 60px; text-align: right;">
                        To'g'ri
                    </div>
                `;
            } else {
                content = `
                    <div style="font-size: 2rem; margin-right: 1rem;">${result.image}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${result.correctName}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                            ${result.description}
                        </div>
                        <div style="margin-top: 0.5rem;">
                            <span style="color: #ef4444; text-decoration: line-through;">${result.userAnswer || 'Javob berilmagan'}</span>
                            <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.correctName}</span>
                        </div>
                    </div>
                    <div style="color: #ef4444; min-width: 60px; text-align: right;">
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
            'faces-settings',
            'faces-display',
            'faces-input',
            'faces-results'
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
        if (document.getElementById('faces-results').style.display === 'block') {
            this.showInputScreen();
        } else if (document.getElementById('faces-input').style.display === 'block') {
            this.showDisplayScreen();
        } else if (document.getElementById('faces-display').style.display === 'block') {
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
window.FacesGame = FacesGame;