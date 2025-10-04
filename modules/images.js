// Rasmlar moduli
const ImagesGame = {
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
        document.getElementById('start-images').addEventListener('click', () => {
            this.startGame();
        });

        // Tekshirish tugmasi
        document.getElementById('check-images').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Orqaga tugmasi
        document.querySelector('#images-section .back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Bosh sahifa va qayta o'ynash tugmalari
        document.querySelector('#images-results .home-btn').addEventListener('click', () => {
            this.goToHome();
        });

        document.querySelector('#images-results .retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
    },

    // Sozlamalar ekranini ko'rsatish
    showSettingsScreen() {
        this.hideAllScreens();
        document.getElementById('images-settings').style.display = 'block';
    },

    // O'yinni boshlash
    startGame() {
        const imagesCount = parseInt(document.getElementById('images-count').value);
        const studyTime = parseInt(document.getElementById('images-time').value);

        // Sozlamalarni tekshirish
        if (imagesCount < 3 || imagesCount > 15) {
            Helpers.showError('Rasmlar soni 3 dan 15 gacha bo\'lishi kerak');
            return;
        }

        if (studyTime < 10 || studyTime > 120) {
            Helpers.showError('Vaqt 10 soniyadan 120 soniyagacha bo\'lishi kerak');
            return;
        }

        // Tasodifiy rasmlarni olish
        const images = DataManager.getRandomImages(imagesCount);
        
        if (images.length === 0) {
            Helpers.showError('Rasmlar ma\'lumotlari topilmadi');
            return;
        }

        // O'yin ma'lumotlarini yaratish
        this.currentGame = {
            images: images,
            studyTime: studyTime,
            userAnswers: [],
            startTime: new Date(),
            settings: {
                imagesCount: imagesCount,
                studyTime: studyTime
            }
        };

        this.showDisplayScreen();
    },

    // Ko'rsatish ekranini ko'rsatish
    showDisplayScreen() {
        this.hideAllScreens();
        document.getElementById('images-display').style.display = 'block';

        // Rasmlarni ko'rsatish
        this.displayImages();

        // Timer ni boshlash
        this.startTimer();
    },

    // Rasmlarni ekranga chiqarish
    displayImages() {
        const imagesGrid = document.getElementById('images-grid');
        imagesGrid.innerHTML = '';

        this.currentGame.images.forEach((image, index) => {
            const imageElement = document.createElement('div');
            imageElement.className = 'image-item';
            imageElement.innerHTML = `
                <div class="image-container" style="text-align: center; margin-bottom: 1rem;">
                    <div style="font-size: 4rem; margin-bottom: 0.5rem;">${image.image}</div>
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.25rem;">${image.name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${image.description}</div>
                </div>
            `;
            imageElement.style.animationDelay = `${index * 0.2}s`;
            imagesGrid.appendChild(imageElement);
        });
    },

    // Timer ni boshlash
    startTimer() {
        let timeLeft = this.currentGame.studyTime;
        const timerElement = document.getElementById('images-timer');

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
        document.getElementById('images-input').style.display = 'block';

        // Input kataklarini yaratish
        this.createInputFields();
    },

    // Input kataklarini yaratish
    createInputFields() {
        const inputList = document.getElementById('images-input-list');
        inputList.innerHTML = '';

        // Rasmlarni aralashtirish (test uchun)
        const shuffledImages = Helpers.shuffleArray([...this.currentGame.images]);

        shuffledImages.forEach((image, index) => {
            const inputItem = document.createElement('div');
            inputItem.className = 'image-input-item';
            inputItem.style.display = 'flex';
            inputItem.style.alignItems = 'center';
            inputItem.style.marginBottom = '1rem';
            inputItem.style.padding = '1rem';
            inputItem.style.background = 'var(--bg-input)';
            inputItem.style.borderRadius = 'var(--border-radius-sm)';
            
            inputItem.innerHTML = `
                <div class="image-input-icon" style="font-size: 3rem; margin-right: 1rem;">
                    ${image.image}
                </div>
                <div style="flex: 1;">
                    <input type="text" 
                           class="image-input-field" 
                           placeholder="Rasm nomini yozing..." 
                           data-image-id="${image.id}"
                           style="width: 100%; padding: 0.8rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem; margin-bottom: 0.5rem;">
                    <input type="text" 
                           class="image-desc-field" 
                           placeholder="Rasm tavsifini yozing..." 
                           data-image-id="${image.id}"
                           style="width: 100%; padding: 0.8rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem;">
                </div>
            `;

            inputList.appendChild(inputItem);
        });

        // Birinchi input ni focus qilish
        const firstInput = inputList.querySelector('.image-input-field');
        if (firstInput) firstInput.focus();

        // Enter bosganda keyingi input ga o'tish
        const nameInputs = inputList.querySelectorAll('.image-input-field');
        const descInputs = inputList.querySelectorAll('.image-desc-field');
        
        nameInputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (Helpers.isEnterKey(e)) {
                    e.preventDefault();
                    descInputs[index].focus();
                }
            });
        });

        descInputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (Helpers.isEnterKey(e)) {
                    e.preventDefault();
                    if (index < nameInputs.length - 1) {
                        nameInputs[index + 1].focus();
                    } else {
                        document.getElementById('check-images').focus();
                    }
                }
            });
        });
    },

    // Javoblarni tekshirish
    checkAnswers() {
        const nameInputs = document.querySelectorAll('#images-input-list .image-input-field');
        const descInputs = document.querySelectorAll('#images-input-list .image-desc-field');
        const userAnswers = [];

        // Javoblarni yig'ish
        nameInputs.forEach((input, index) => {
            const imageId = parseInt(input.dataset.imageId);
            const nameAnswer = input.value.trim();
            const descAnswer = descInputs[index].value.trim();
            
            userAnswers.push({
                imageId: imageId,
                nameAnswer: nameAnswer,
                descAnswer: descAnswer
            });
        });

        this.currentGame.userAnswers = userAnswers;

        // Natijalarni hisoblash
        this.calculateResults();
    },

    // Natijalarni hisoblash
    calculateResults() {
        const correctImages = this.currentGame.images;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        let totalPoints = 0;
        const results = [];

        // Har bir javobni tekshirish
        userAnswers.forEach(userAnswer => {
            const correctImage = correctImages.find(image => image.id === userAnswer.imageId);
            
            if (correctImage) {
                // Nomni tekshirish
                const isNameCorrect = userAnswer.nameAnswer.toLowerCase() === correctImage.name.toLowerCase();
                
                // Tavsifni tekshirish (qisman moslik)
                const isDescCorrect = this.checkDescriptionMatch(userAnswer.descAnswer, correctImage.description);
                
                // Ballarni hisoblash
                let points = 0;
                if (isNameCorrect) points += 2;
                if (isDescCorrect) points += 1;
                
                totalPoints += points;
                
                // Agar nom to'g'ri bo'lsa, correct hisoblanadi
                if (isNameCorrect) {
                    correctCount++;
                }

                results.push({
                    imageId: correctImage.id,
                    image: correctImage.image,
                    correctName: correctImage.name,
                    correctDescription: correctImage.description,
                    userName: userAnswer.nameAnswer,
                    userDescription: userAnswer.descAnswer,
                    isNameCorrect: isNameCorrect,
                    isDescCorrect: isDescCorrect,
                    points: points
                });
            }
        });

        // Ballarni hisoblash (maksimum 3 ball har bir rasm uchun)
        const maxPoints = correctImages.length * 3;
        const percentage = Helpers.calculatePercentage(totalPoints, maxPoints);
        const score = Math.round((totalPoints / maxPoints) * 1000);

        // O'yin natijasini saqlash
        const gameResult = {
            gameType: 'images',
            score: score,
            total: correctImages.length,
            percentage: percentage,
            correctCount: correctCount,
            totalPoints: totalPoints,
            maxPoints: maxPoints,
            details: {
                images: correctImages,
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

    // Tavsif mosligini tekshirish
    checkDescriptionMatch(userDesc, correctDesc) {
        if (!userDesc) return false;
        
        const userWords = userDesc.toLowerCase().split(' ');
        const correctWords = correctDesc.toLowerCase().split(' ');
        
        // Kamida 2 ta so'z mos kelishi kerak
        let matchCount = 0;
        userWords.forEach(userWord => {
            if (correctWords.some(correctWord => correctWord.includes(userWord) || userWord.includes(correctWord))) {
                matchCount++;
            }
        });
        
        return matchCount >= 2;
    },

    // Natijalar ekranini ko'rsatish
    showResultsScreen(gameResult, results) {
        this.hideAllScreens();
        document.getElementById('images-results').style.display = 'block';

        // Ballarni ko'rsatish
        document.getElementById('images-score').textContent = gameResult.score;

        // Natijalarni solishtirish
        this.displayComparison(results);

        // Konfet animatsiyasi (agar yaxshi natija bo'lsa)
        if (gameResult.percentage >= 80) {
            Helpers.showConfetti();
        }
    },

    // Solishtirish natijalarini ko'rsatish
    displayComparison(results) {
        const comparisonElement = document.getElementById('images-comparison');
        comparisonElement.innerHTML = '';

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isNameCorrect ? 'correct' : 'incorrect'}`;
            resultItem.style.padding = '1rem';

            let content = '';
            
            if (result.isNameCorrect && result.isDescCorrect) {
                content = `
                    <div style="display: flex; align-items: start; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem; color: #10b981;">
                                ${result.correctName} ✓
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.correctDescription}
                            </div>
                            <div style="margin-top: 0.5rem; color: var(--text-secondary);">
                                Sizning tavsifingiz: <strong style="color: #10b981;">${result.userDescription}</strong>
                            </div>
                        </div>
                        <div style="color: #10b981; font-weight: bold;">
                            ${result.points}/3 ball
                        </div>
                    </div>
                `;
            } else if (result.isNameCorrect) {
                content = `
                    <div style="display: flex; align-items: start; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem; color: #10b981;">
                                ${result.correctName} ✓
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.correctDescription}
                            </div>
                            <div style="margin-top: 0.5rem;">
                                <span style="color: #f59e0b;">Tavsif: ${result.userDescription || 'Berilmagan'}</span>
                                <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.correctDescription}</span>
                            </div>
                        </div>
                        <div style="color: #f59e0b; font-weight: bold;">
                            ${result.points}/3 ball
                        </div>
                    </div>
                `;
            } else {
                content = `
                    <div style="display: flex; align-items: start; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem;">
                                <span style="color: #ef4444; text-decoration: line-through;">${result.userName || 'Berilmagan'}</span>
                                <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.correctName}</span>
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.correctDescription}
                            </div>
                            <div style="margin-top: 0.5rem;">
                                <span style="color: #ef4444;">Tavsif: ${result.userDescription || 'Berilmagan'}</span>
                            </div>
                        </div>
                        <div style="color: #ef4444; font-weight: bold;">
                            ${result.points}/3 ball
                        </div>
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
            'images-settings',
            'images-display',
            'images-input',
            'images-results'
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
        if (document.getElementById('images-results').style.display === 'block') {
            this.showInputScreen();
        } else if (document.getElementById('images-input').style.display === 'block') {
            this.showDisplayScreen();
        } else if (document.getElementById('images-display').style.display === 'block') {
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
window.ImagesGame = ImagesGame;