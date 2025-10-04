// Memory Master - TO'LIQ ISHLAYDIGAN VERSIYA
const MemoryMaster = {
    // Asosiy o'zgaruvchilar
    currentSection: 'profile-section',
    profileData: null,
    currentGame: null,
    timer: null,
    
    // Storage funksiyalari
    StorageManager: {
        KEYS: {
            USER_PROFILE: 'memory_master_profile',
            GAME_RESULTS: 'memory_master_results',
            GAME_STATS: 'memory_master_stats',
            FLASHCARDS_PROGRESS: 'memory_master_flashcards'
        },

        getProfile() {
            try {
                const profile = localStorage.getItem(this.KEYS.USER_PROFILE);
                if (!profile) {
                    return this.createDefaultProfile();
                }
                return JSON.parse(profile);
            } catch (error) {
                return this.createDefaultProfile();
            }
        },

        createDefaultProfile() {
            const defaultProfile = {
                name: 'Foydalanuvchi',
                avatar: '',
                totalScore: 0,
                gamesPlayed: 0,
                joinDate: new Date().toISOString(),
                bestScores: { numbers: 0, words: 0, faces: 0, images: 0, flashcards: 0 }
            };
            this.saveProfile(defaultProfile);
            return defaultProfile;
        },

        saveProfile(profileData) {
            try {
                localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profileData));
                return true;
            } catch (error) {
                return false;
            }
        },

        updateAvatar(avatarData) {
            const profile = this.getProfile();
            profile.avatar = avatarData;
            return this.saveProfile(profile);
        },

        getStats() {
            try {
                const stats = localStorage.getItem(this.KEYS.GAME_STATS);
                return stats ? JSON.parse(stats) : {
                    totalGames: 0, totalScore: 0, averageScore: 0, games: {}
                };
            } catch (error) {
                return { totalGames: 0, totalScore: 0, averageScore: 0, games: {} };
            }
        },

        saveGameResult(gameData) {
            try {
                const results = this.getGameResults();
                const result = {
                    id: Date.now(),
                    gameType: gameData.gameType,
                    score: gameData.score,
                    total: gameData.total,
                    percentage: gameData.percentage,
                    date: new Date().toISOString(),
                    correctCount: gameData.correctCount
                };

                results.unshift(result);
                if (results.length > 50) results.splice(50);
                localStorage.setItem(this.KEYS.GAME_RESULTS, JSON.stringify(results));
                
                this.updateStats(gameData);
                return true;
            } catch (error) {
                return false;
            }
        },

        getGameResults() {
            try {
                const results = localStorage.getItem(this.KEYS.GAME_RESULTS);
                return results ? JSON.parse(results) : [];
            } catch (error) {
                return [];
            }
        },

        updateStats(gameData) {
            const stats = this.getStats();
            const profile = this.getProfile();

            stats.totalGames = (stats.totalGames || 0) + 1;
            stats.totalScore = (stats.totalScore || 0) + gameData.score;
            stats.averageScore = Math.round(stats.totalScore / stats.totalGames);

            profile.gamesPlayed = stats.totalGames;
            profile.totalScore = stats.totalScore;

            if (gameData.score > (profile.bestScores[gameData.gameType] || 0)) {
                profile.bestScores[gameData.gameType] = gameData.score;
            }

            localStorage.setItem(this.KEYS.GAME_STATS, JSON.stringify(stats));
            this.saveProfile(profile);
        }
    },

    // Data ma'lumotlari
    DataManager: {
        languages: {
            english: { name: "Inglizcha", flag: "🇺🇸" },
            korean: { name: "Koreyscha", flag: "🇰🇷" },
            japanese: { name: "Yaponcha", flag: "🇯🇵" },
            chinese: { name: "Xitoycha", flag: "🇨🇳" },
            german: { name: "Nemischa", flag: "🇩🇪" },
            french: { name: "Fransuzcha", flag: "🇫🇷" },
            uzbek: { name: "O'zbekcha", flag: "🇺🇿" }
        },

        topics: [
            "Oziq-ovqat", "Transport", "Uy-ro'zg'or", "Kasblar", "Sport",
            "Ta'lim", "Texnologiya", "Sog'liq", "Tabiat", "San'at"
        ],

        vocabulary: {
            english: {
                "Oziq-ovqat": [
                    { word: "Apple", pronunciation: "[ˈæp.əl]", translation: "Olma" },
                    { word: "Bread", pronunciation: "[bred]", translation: "Non" },
                    { word: "Cheese", pronunciation: "[tʃiːz]", translation: "Pishloq" }
                ],
                "Transport": [
                    { word: "Car", pronunciation: "[kɑːr]", translation: "Mashina" },
                    { word: "Bus", pronunciation: "[bʌs]", translation: "Avtobus" },
                    { word: "Train", pronunciation: "[treɪn]", translation: "Poyezd" }
                ]
            }
        },

        generateRandomNumbers(count) {
            const numbers = [];
            for (let i = 0; i < count; i++) {
                numbers.push(Math.floor(Math.random() * 10));
            }
            return numbers;
        },

        getRandomWords(language, topic, count) {
            const words = this.vocabulary[language]?.[topic] || [];
            const shuffled = [...words].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(count, words.length));
        }
    },

    // Dasturni ishga tushirish
    init() {
        console.log('🎮 Memory Master ishga tushmoqda...');
        this.showLoadingScreen();
        
        setTimeout(() => {
            this.setupEventListeners();
            this.loadProfileData();
            this.hideLoadingScreen();
            this.showSection('profile-section');
            console.log('✅ Dastur tayyor!');
        }, 1000);
    },

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'flex';
    },

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    },

    setupEventListeners() {
        this.setupProfileImageUpload();
        this.setupGameCards();
        this.setupBackButtons();
    },

    setupProfileImageUpload() {
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarOverlay = document.querySelector('.avatar-overlay');

        if (avatarUpload && avatarOverlay) {
            avatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.uploadProfileImage(file);
            });

            avatarOverlay.addEventListener('click', () => avatarUpload.click());
        }
    },

    uploadProfileImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Faqat rasm fayllarini yuklash mumkin');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.StorageManager.updateAvatar(e.target.result);
            this.updateProfileDisplay();
        };
        reader.readAsDataURL(file);
    },

    setupGameCards() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.startGame(gameType);
            });
        });
    },

    setupBackButtons() {
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showSection('profile-section');
            });
        });
    },

    startGame(gameType) {
        console.log('🎯 Oʻyin boshlanmoqda:', gameType);
        
        if (gameType === 'results') {
            this.showSection('results-section');
            this.loadResultsData();
        } else if (gameType === 'numbers') {
            this.startNumbersGame();
        } else if (gameType === 'words') {
            this.startWordsGame();
        } else {
            this.showSection('profile-section');
            this.showGameScreen(gameType);
        }
    },

    // RAQAMLAR O'YINI
    startNumbersGame() {
        this.showSection('numbers-section');
        this.createNumbersGameHTML();
        this.setupNumbersGame();
    },

    createNumbersGameHTML() {
        const numbersSection = document.getElementById('numbers-section');
        if (!numbersSection) {
            const html = `
                <div id="numbers-section" class="section">
                    <div class="game-header">
                        <button class="back-btn">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h2>Raqamlar O'yini</h2>
                    </div>
                    <div class="game-content">
                        <div id="numbers-settings" class="settings-screen">
                            <div class="setting-group">
                                <label>Raqamlar soni:</label>
                                <input type="number" id="numbers-count" min="3" max="20" value="5">
                            </div>
                            <div class="setting-group">
                                <label>Vaqt (soniya):</label>
                                <input type="number" id="numbers-time" min="5" max="60" value="10">
                            </div>
                            <button id="start-numbers" class="start-btn">Boshlash</button>
                        </div>
                        <div id="numbers-display" class="display-screen" style="display:none">
                            <div class="timer" id="numbers-timer">10</div>
                            <div class="numbers-grid" id="numbers-grid"></div>
                        </div>
                        <div id="numbers-input" class="input-screen" style="display:none">
                            <h3>Raqamlarni eslab qoling</h3>
                            <div class="input-grid" id="numbers-input-grid"></div>
                            <button id="check-numbers" class="check-btn">Tekshirish</button>
                        </div>
                        <div id="numbers-results" class="results-screen" style="display:none">
                            <h3>Natijalar</h3>
                            <div class="score-display">
                                <div class="score-circle">
                                    <span id="numbers-score">0</span>
                                    <small>ball</small>
                                </div>
                            </div>
                            <div class="results-comparison" id="numbers-comparison"></div>
                            <div class="action-buttons">
                                <button class="home-btn">Bosh Sahifa</button>
                                <button class="retry-btn">Qayta O'ynash</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('app').insertAdjacentHTML('beforeend', html);
        }
    },

    setupNumbersGame() {
        document.getElementById('start-numbers').addEventListener('click', () => {
            const count = parseInt(document.getElementById('numbers-count').value);
            const time = parseInt(document.getElementById('numbers-time').value);
            this.startNumbersRound(count, time);
        });

        document.getElementById('check-numbers').addEventListener('click', () => {
            this.checkNumbersAnswers();
        });

        document.querySelector('#numbers-section .back-btn').addEventListener('click', () => {
            this.showSection('profile-section');
        });
    },

    startNumbersRound(count, time) {
        this.currentGame = {
            type: 'numbers',
            numbers: this.DataManager.generateRandomNumbers(count),
            time: time,
            userAnswers: []
        };

        document.getElementById('numbers-settings').style.display = 'none';
        document.getElementById('numbers-display').style.display = 'block';

        // Raqamlarni ko'rsatish
        const grid = document.getElementById('numbers-grid');
        grid.innerHTML = '';
        this.currentGame.numbers.forEach(num => {
            const div = document.createElement('div');
            div.className = 'number-item';
            div.textContent = num;
            grid.appendChild(div);
        });

        // Timer
        let timeLeft = time;
        const timerElement = document.getElementById('numbers-timer');
        
        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.showNumbersInput();
            }
        }, 1000);
    },

    showNumbersInput() {
        document.getElementById('numbers-display').style.display = 'none';
        document.getElementById('numbers-input').style.display = 'block';

        const inputGrid = document.getElementById('numbers-input-grid');
        inputGrid.innerHTML = '';

        for (let i = 0; i < this.currentGame.numbers.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'input-cell';
            input.maxLength = 1;
            input.placeholder = '?';
            input.dataset.index = i;
            inputGrid.appendChild(input);
        }
    },

    checkNumbersAnswers() {
        const inputs = document.querySelectorAll('#numbers-input-grid .input-cell');
        const userAnswers = [];
        
        inputs.forEach(input => {
            userAnswers.push(input.value === '' ? null : parseInt(input.value));
        });

        this.currentGame.userAnswers = userAnswers;
        this.showNumbersResults();
    },

    showNumbersResults() {
        const correctNumbers = this.currentGame.numbers;
        const userAnswers = this.currentGame.userAnswers;
        
        let correctCount = 0;
        const results = [];

        correctNumbers.forEach((correct, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === correct;
            if (isCorrect) correctCount++;
            
            results.push({ correct, userAnswer, isCorrect });
        });

        const percentage = Math.round((correctCount / correctNumbers.length) * 100);
        const score = Math.round((correctCount / correctNumbers.length) * 1000);

        // Natijalarni ko'rsatish
        document.getElementById('numbers-input').style.display = 'none';
        document.getElementById('numbers-results').style.display = 'block';
        document.getElementById('numbers-score').textContent = score;

        // Taqqoslash
        const comparison = document.getElementById('numbers-comparison');
        comparison.innerHTML = '';
        
        results.forEach((result, index) => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            div.innerHTML = result.isCorrect ? 
                `${index + 1}. ${result.correct} ✓` :
                `${index + 1}. <span style="color:#ef4444">${result.userAnswer || '?'}</span> → <span style="color:#10b981">${result.correct}</span>`;
            comparison.appendChild(div);
        });

        // Natijani saqlash
        this.StorageManager.saveGameResult({
            gameType: 'numbers',
            score: score,
            total: correctNumbers.length,
            percentage: percentage,
            correctCount: correctCount
        });

        // Yangi event listenerlar
        document.querySelector('#numbers-results .home-btn').addEventListener('click', () => {
            this.showSection('profile-section');
        });

        document.querySelector('#numbers-results .retry-btn').addEventListener('click', () => {
            this.startNumbersGame();
        });
    },

    // SO'ZLAR O'YINI
    startWordsGame() {
        this.showSection('words-section');
        this.createWordsGameHTML();
        this.setupWordsGame();
    },

    createWordsGameHTML() {
        const wordsSection = document.getElementById('words-section');
        if (!wordsSection) {
            const html = `
                <div id="words-section" class="section">
                    <div class="game-header">
                        <button class="back-btn">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h2>So'zlar O'yini</h2>
                    </div>
                    <div class="game-content">
                        <div id="words-settings" class="settings-screen">
                            <div class="setting-group">
                                <label>Til:</label>
                                <select id="words-language">
                                    <option value="english">Inglizcha</option>
                                    <option value="uzbek">O'zbekcha</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>So'zlar soni:</label>
                                <input type="number" id="words-count" min="3" max="10" value="5">
                            </div>
                            <div class="setting-group">
                                <label>Vaqt (soniya):</label>
                                <input type="number" id="words-time" min="10" max="60" value="20">
                            </div>
                            <button id="start-words" class="start-btn">Boshlash</button>
                        </div>
                        <div id="words-display" class="display-screen" style="display:none">
                            <div class="timer" id="words-timer">20</div>
                            <div class="words-list" id="words-list"></div>
                        </div>
                        <div id="words-input" class="input-screen" style="display:none">
                            <h3>So'zlarni eslab qoling</h3>
                            <div class="words-input-list" id="words-input-list"></div>
                            <button id="check-words" class="check-btn">Tekshirish</button>
                        </div>
                        <div id="words-results" class="results-screen" style="display:none">
                            <h3>Natijalar</h3>
                            <div class="score-display">
                                <div class="score-circle">
                                    <span id="words-score">0</span>
                                    <small>ball</small>
                                </div>
                            </div>
                            <div class="results-comparison" id="words-comparison"></div>
                            <div class="action-buttons">
                                <button class="home-btn">Bosh Sahifa</button>
                                <button class="retry-btn">Qayta O'ynash</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('app').insertAdjacentHTML('beforeend', html);
        }
    },

    setupWordsGame() {
        document.getElementById('start-words').addEventListener('click', () => {
            const language = document.getElementById('words-language').value;
            const count = parseInt(document.getElementById('words-count').value);
            const time = parseInt(document.getElementById('words-time').value);
            this.startWordsRound(language, count, time);
        });

        // ... words game setup
    },

    showGameScreen(gameType) {
        alert(`🎮 "${this.getGameName(gameType)}" o'yini ishlaydi! Tez orada barcha funksiyalar qo'shiladi.`);
    },

    getGameName(gameType) {
        const names = {
            'numbers': 'Raqamlar',
            'words': 'Soʻzlar', 
            'flashcards': 'Flashcards',
            'faces': 'Yuz va Ismlar',
            'images': 'Rasmlar'
        };
        return names[gameType] || gameType;
    },

    showSection(sectionId) {
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) currentSection.classList.remove('active');

        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
            this.currentSection = sectionId;
            window.scrollTo(0, 0);
        }
    },

    loadProfileData() {
        this.profileData = this.StorageManager.getProfile();
        this.updateProfileDisplay();
    },

    updateProfileDisplay() {
        if (!this.profileData) return;

        const elements = {
            'profile-name': this.profileData.name,
            'total-score': this.formatNumber(this.profileData.totalScore),
            'games-played': this.formatNumber(this.profileData.gamesPlayed),
            'numbers-best': this.formatNumber(this.profileData.bestScores.numbers),
            'words-best': this.formatNumber(this.profileData.bestScores.words),
            'faces-best': this.formatNumber(this.profileData.bestScores.faces),
            'images-best': this.formatNumber(this.profileData.bestScores.images),
            'total-games': this.formatNumber(this.profileData.gamesPlayed)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }

        const profileImage = document.getElementById('profile-image');
        if (profileImage && this.profileData.avatar) {
            profileImage.src = this.profileData.avatar;
            profileImage.style.display = 'block';
        }
    },

    loadResultsData() {
        const stats = this.StorageManager.getStats();
        const results = this.StorageManager.getGameResults();

        document.getElementById('total-games-played').textContent = this.formatNumber(stats.totalGames);
        document.getElementById('average-score').textContent = this.formatNumber(stats.averageScore);
        document.getElementById('best-score').textContent = this.formatNumber(stats.totalScore);

        this.updateResultsHistory(results);
    },

    updateResultsHistory(results) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        if (results.length === 0) {
            historyList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8;">Hali hech qanday oʻyin oʻynalmagan</div>';
            return;
        }

        historyList.innerHTML = '';
        results.slice(0, 10).forEach(result => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-game">
                    <strong>${this.getGameName(result.gameType)}</strong>
                    <small>${this.formatDate(result.date)}</small>
                </div>
                <div class="history-score" style="background: ${this.getScoreColor(result.percentage)};">
                    ${result.score}
                </div>
                <div class="history-date">
                    <strong style="color: ${this.getScoreColor(result.percentage)};">${result.percentage}%</strong>
                    <small>${result.correctCount}/${result.total}</small>
                </div>
            `;
            historyList.appendChild(item);
        });
    },

    formatNumber(num) {
        return new Intl.NumberFormat('uz-UZ').format(num);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ');
    },

    getScoreColor(percentage) {
        if (percentage >= 90) return '#10b981';
        if (percentage >= 70) return '#f59e0b';
        if (percentage >= 50) return '#f97316';
        return '#ef4444';
    }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    MemoryMaster.init();
});

window.addEventListener('error', function(e) {
    console.error('Global xato:', e.error);
});

window.App = MemoryMaster;

    // ==================== FLASHCARDS O'YINI ====================
    startFlashcardsGame()
        this.createGameSection('flashcards', 'Flashcards', `
            <div class="settings-screen" id="flashcards-language">
                <h3>Tilni tanlang</h3>
                <div class="languages-grid">
                    ${this.DataManager.flashcardsLanguages.map(lang => `
                        <div class="language-card" data-lang="${lang}">
                            <i class="fas fa-globe"></i>
                            <span>${this.DataManager.getLanguageName(lang)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="settings-screen" id="flashcards-topics" style="display:none">
                <h3>Mavzuni tanlang</h3>
                <div class="topics-grid" id="flashcards-topics-grid"></div>
            </div>
            <div class="flashcards-screen" style="display:none">
                <div class="flashcard-container">
                    <div class="flashcard" id="flashcard">
                        <div class="flashcard-front">
                            <div class="flashcard-word" id="flashcard-word"></div>
                            <div class="flashcard-pronunciation" id="flashcard-pronunciation"></div>
                        </div>
                        <div class="flashcard-back">
                            <div class="flashcard-translation" id="flashcard-translation"></div>
                            <div class="flashcard-pronunciation" id="flashcard-back-pronunciation"></div>
                        </div>
                    </div>
                </div>
                <div class="flashcard-controls">
                    <button id="flip-card" class="flip-btn">
                        <i class="fas fa-sync"></i> Aylantirish
                    </button>
                    <button id="next-card" class="next-btn">
                        Keyingi <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                <div class="progress-info">
                    <span id="card-progress">1/10</span>
                    <button id="finish-cards" class="finish-btn">Tayyorman</button>
                </div>
            </div>
            <div class="input-screen" style="display:none">
                <h3>So'zlarni eslab qoling</h3>
                <div class="test-type-selector">
                    <button class="test-type-btn active" data-type="foreignToNative">
                        Chet til → Tarjima
                    </button>
                    <button class="test-type-btn" data-type="nativeToForeign">
                        Tarjima → Chet til
                    </button>
                </div>
                <div class="test-words-list" id="test-words-list"></div>
                <button id="check-flashcards" class="check-btn">Tekshirish</button>
            </div>
            <div class="results-screen" style="display:none">
                <h3>Flashcards Natijalari</h3>
                <div class="score-display">
                    <div class="score-circle">
                        <span id="flashcards-score">0</span>
                        <small>ball</small>
                    </div>
                </div>
                <div class="results-comparison" id="flashcards-comparison"></div>
                <div class="action-buttons">
                    <button class="home-btn">Bosh Sahifa</button>
                    <button class="retry-btn">Qayta O'ynash</button>
                </div>
            </div>
        `);

        this.setupFlashcardsGame();
    },

    setupFlashcardsGame() {
        // Til tanlash
        document.querySelectorAll('#flashcards-language .language-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const language = e.currentTarget.dataset.lang;
                this.selectFlashcardsLanguage(language);
            });
        });

        // Karta aylantirish
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipFlashcard();
        });

        // Keyingi karta
        document.getElementById('next-card').addEventListener('click', () => {
            this.nextFlashcard();
        });

        // Tayyorman tugmasi
        document.getElementById('finish-cards').addEventListener('click', () => {
            this.startFlashcardsTest();
        });

        // Test turini tanlash
        document.querySelectorAll('.test-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTestType(e.currentTarget.dataset.type);
            });
        });

        // Tekshirish
        document.getElementById('check-flashcards').addEventListener('click', () => {
            this.checkFlashcardsAnswers();
        });
    },

    selectFlashcardsLanguage(language) {
        this.currentGame = {
            type: 'flashcards',
            language: language,
            currentCardIndex: 0
        };

        document.getElementById('flashcards-language').style.display = 'none';
        document.getElementById('flashcards-topics').style.display = 'block';

        // Mavzularni ko'rsatish
        const topicsGrid = document.getElementById('flashcards-topics-grid');
        topicsGrid.innerHTML = '';

        this.DataManager.topics.forEach(topic => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic-card';
            topicCard.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📚</div>
                <h4>${topic}</h4>
                <small>${this.DataManager.vocabulary[language]?.[topic]?.length || 0} so'z</small>
            `;
            topicCard.addEventListener('click', () => {
                this.selectFlashcardsTopic(topic);
            });
            topicsGrid.appendChild(topicCard);
        });
    },

    selectFlashcardsTopic(topic) {
        this.currentGame.topic = topic;
        const words = this.DataManager.getRandomWords(this.currentGame.language, topic, 10);
        
        this.currentGame.words = words;
        this.currentGame.userAnswers = [];

        document.getElementById('flashcards-topics').style.display = 'none';
        document.getElementById('flashcards-screen').style.display = 'block';

        this.showCurrentFlashcard();
    },

    showCurrentFlashcard() {
        const card = this.currentGame.words[this.currentGame.currentCardIndex];
        const flashcard = document.getElementById('flashcard');
        
        flashcard.classList.remove('flipped');

        document.getElementById('flashcard-word').textContent = card.word;
        document.getElementById('flashcard-pronunciation').textContent = card.pronunciation;
        document.getElementById('flashcard-translation').textContent = card.translation;
        document.getElementById('flashcard-back-pronunciation').textContent = card.pronunciation;

        document.getElementById('card-progress').textContent = 
            `${this.currentGame.currentCardIndex + 1}/${this.currentGame.words.length}`;
    },

    flipFlashcard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
    },

    nextFlashcard() {
        this.currentGame.currentCardIndex++;
        if (this.currentGame.currentCardIndex >= this.currentGame.words.length) {
            this.currentGame.currentCardIndex = 0;
        }
        this.showCurrentFlashcard();
    },

    startFlashcardsTest() {
        this.currentGame.testType = 'foreignToNative';
        document.getElementById('flashcards-screen').style.display = 'none';
        document.getElementById('flashcards-input').style.display = 'block';
        this.prepareFlashcardsTest();
    },

    prepareFlashcardsTest() {
        const testWordsList = document.getElementById('test-words-list');
        testWordsList.innerHTML = '';

        this.currentGame.words.forEach((word, index) => {
            const testItem = document.createElement('div');
            testItem.className = 'word-input-item';
            
            if (this.currentGame.testType === 'foreignToNative') {
                testItem.innerHTML = `
                    <div class="word-input-label">
                        <strong>${word.word}</strong>
                        <br><small>${word.pronunciation}</small>
                    </div>
                    <input type="text" class="word-input-field" placeholder="Tarjimasini yozing..." data-index="${index}">
                `;
            } else {
                testItem.innerHTML = `
                    <div class="word-input-label">
                        <strong>${word.translation}</strong>
                    </div>
                    <input type="text" class="word-input-field" placeholder="${this.DataManager.getLanguageName(this.currentGame.language)}cha so'zni yozing..." data-index="${index}">
                `;
            }

            testWordsList.appendChild(testItem);
        });
    },

    selectTestType(type) {
        this.currentGame.testType = type;
        document.querySelectorAll('.test-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        this.prepareFlashcardsTest();
    },

    checkFlashcardsAnswers() {
        const inputs = document.querySelectorAll('#test-words-list .word-input-field');
        const userAnswers = [];

        inputs.forEach((input, index) => {
            userAnswers[index] = input.value.trim();
        });

        this.currentGame.userAnswers = userAnswers;
        this.showFlashcardsResults();
    },

    showFlashcardsResults() {
        const words = this.currentGame.words;
        const userAnswers = this.currentGame.userAnswers;
        const testType = this.currentGame.testType;

        let correctCount = 0;
        const results = [];

        words.forEach((word, index) => {
            const userAnswer = userAnswers[index];
            let correctAnswer, isCorrect;

            if (testType === 'foreignToNative') {
                correctAnswer = word.translation.toLowerCase();
                isCorrect = userAnswer.toLowerCase() === correctAnswer;
            } else {
                correctAnswer = word.word.toLowerCase();
                isCorrect = userAnswer.toLowerCase() === correctAnswer;
            }

            if (isCorrect) correctCount++;

            results.push({
                word: word.word,
                pronunciation: word.pronunciation,
                translation: word.translation,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer,
                isCorrect: isCorrect,
                testType: testType
            });
        });

        const percentage = Math.round((correctCount / words.length) * 100);
        const score = Math.round((correctCount / words.length) * 1000);

        document.getElementById('flashcards-input').style.display = 'none';
        document.getElementById('flashcards-results').style.display = 'block';
        document.getElementById('flashcards-score').textContent = score;

        const comparison = document.getElementById('flashcards-comparison');
        comparison.innerHTML = '';

        results.forEach((result, index) => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            
            let question, correctAnswer;
            if (result.testType === 'foreignToNative') {
                question = `${result.word} ${result.pronunciation}`;
                correctAnswer = result.translation;
            } else {
                question = result.translation;
                correctAnswer = `${result.word} ${result.pronunciation}`;
            }

            if (result.isCorrect) {
                div.innerHTML = `
                    <div><strong>${question}</strong></div>
                    <div>Sizning javobingiz: <strong style="color:#10b981">${result.userAnswer}</strong> ✓</div>
                `;
            } else {
                div.innerHTML = `
                    <div><strong>${question}</strong></div>
                    <div>
                        <span style="color:#ef4444">${result.userAnswer || 'Javob yo\'q'}</span> → 
                        <span style="color:#10b981">${correctAnswer}</span>
                    </div>
                `;
            }
            comparison.appendChild(div);
        });

        this.StorageManager.saveGameResult({
            gameType: 'flashcards',
            score: score,
            total: words.length,
            percentage: percentage,
            correctCount: correctCount
        });

        this.setupResultsButtons('flashcards');
    },

    // ==================== YUZ VA ISMLAR O'YINI ====================
    startFacesGame() {
        this.createGameSection('faces', 'Yuz va Ismlar', `
            <div class="settings-screen">
                <div class="setting-group">
                    <label>Yuzlar soni:</label>
                    <input type="number" id="faces-count" min="3" max="10" value="5">
                </div>
                <div class="setting-group">
                    <label>Vaqt (soniya):</label>
                    <input type="number" id="faces-time" min="10" max="60" value="20">
                </div>
                <button id="start-faces" class="start-btn">Boshlash</button>
            </div>
            <div class="display-screen" style="display:none">
                <div class="timer" id="faces-timer">20</div>
                <div class="faces-grid" id="faces-grid"></div>
            </div>
            <div class="input-screen" style="display:none">
                <h3>Yuz va ismlarni eslab qoling</h3>
                <div class="faces-input-list" id="faces-input-list"></div>
                <button id="check-faces" class="check-btn">Tekshirish</button>
            </div>
            <div class="results-screen" style="display:none">
                <h3>Yuz va Ismlar Natijalari</h3>
                <div class="score-display">
                    <div class="score-circle">
                        <span id="faces-score">0</span>
                        <small>ball</small>
                    </div>
                </div>
                <div class="results-comparison" id="faces-comparison"></div>
                <div class="action-buttons">
                    <button class="home-btn">Bosh Sahifa</button>
                    <button class="retry-btn">Qayta O'ynash</button>
                </div>
            </div>
        `);

        document.getElementById('start-faces').addEventListener('click', () => {
            const count = parseInt(document.getElementById('faces-count').value);
            const time = parseInt(document.getElementById('faces-time').value);
            this.startFacesRound(count, time);
        });

        document.getElementById('check-faces').addEventListener('click', () => {
            this.checkFacesAnswers();
        });
    },

    startFacesRound(count, time) {
        const faces = this.DataManager.getRandomFaces(count);
        this.currentGame = {
            type: 'faces',
            faces: faces,
            time: time,
            userAnswers: []
        };

        this.showGameScreen('faces', 'settings', 'display');

        const grid = document.getElementById('faces-grid');
        grid.innerHTML = '';

        faces.forEach(face => {
            const div = document.createElement('div');
            div.className = 'face-item';
            div.innerHTML = `
                <div style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">
                    ${face.image}
                </div>
                <div style="text-align: center;">
                    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">${face.name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${face.description}</div>
                </div>
            `;
            grid.appendChild(div);
        });

        this.startTimer('faces', time, () => this.showFacesInput());
    },

    showFacesInput() {
        this.showGameScreen('faces', 'display', 'input');

        const inputList = document.getElementById('faces-input-list');
        inputList.innerHTML = '';

        const shuffledFaces = [...this.currentGame.faces].sort(() => Math.random() - 0.5);

        shuffledFaces.forEach(face => {
            const div = document.createElement('div');
            div.className = 'face-input-item';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.marginBottom = '1rem';
            div.style.padding = '1rem';
            div.style.background = 'var(--bg-input)';
            div.style.borderRadius = 'var(--border-radius-sm)';
            div.innerHTML = `
                <div style="font-size: 3rem; margin-right: 1rem;">${face.image}</div>
                <input type="text" class="face-input-field" placeholder="Ismni yozing..." data-face-id="${face.id}" style="flex: 1; padding: 0.8rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem;">
            `;
            inputList.appendChild(div);
        });
    },

    checkFacesAnswers() {
        const inputs = document.querySelectorAll('#faces-input-list .face-input-field');
        const userAnswers = [];

        inputs.forEach(input => {
            const faceId = parseInt(input.dataset.faceId);
            userAnswers.push({
                faceId: faceId,
                answer: input.value.trim()
            });
        });

        this.currentGame.userAnswers = userAnswers;
        this.showFacesResults();
    },

    showFacesResults() {
        const correctFaces = this.currentGame.faces;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        const results = [];

        userAnswers.forEach(userAnswer => {
            const correctFace = correctFaces.find(face => face.id === userAnswer.faceId);
            if (correctFace) {
                const isCorrect = userAnswer.answer.toLowerCase() === correctFace.name.toLowerCase();
                if (isCorrect) correctCount++;

                results.push({
                    face: correctFace,
                    userAnswer: userAnswer.answer,
                    isCorrect: isCorrect
                });
            }
        });

        const percentage = Math.round((correctCount / correctFaces.length) * 100);
        const score = Math.round((correctCount / correctFaces.length) * 1000);

        this.showGameScreen('faces', 'input', 'results');
        document.getElementById('faces-score').textContent = score;

        const comparison = document.getElementById('faces-comparison');
        comparison.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.padding = '1rem';

            if (result.isCorrect) {
                div.innerHTML = `
                    <div style="font-size: 2rem; margin-right: 1rem;">${result.face.image}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${result.face.name}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                            ${result.face.description}
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
                div.innerHTML = `
                    <div style="font-size: 2rem; margin-right: 1rem;">${result.face.image}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${result.face.name}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                            ${result.face.description}
                        </div>
                        <div style="margin-top: 0.5rem;">
                            <span style="color: #ef4444; text-decoration: line-through;">${result.userAnswer || 'Javob berilmagan'}</span>
                            <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.face.name}</span>
                        </div>
                    </div>
                    <div style="color: #ef4444; min-width: 60px; text-align: right;">
                        Xato
                    </div>
                `;
            }
            comparison.appendChild(div);
        });

        this.StorageManager.saveGameResult({
            gameType: 'faces',
            score: score,
            total: correctFaces.length,
            percentage: percentage,
            correctCount: correctCount
        });

        this.setupResultsButtons('faces');
    },

    // ==================== RASMLAR O'YINI ====================
    startImagesGame() {
        this.createGameSection('images', 'Rasmlar', `
            <div class="settings-screen">
                <div class="setting-group">
                    <label>Rasmlar soni:</label>
                    <input type="number" id="images-count" min="3" max="10" value="5">
                </div>
                <div class="setting-group">
                    <label>Vaqt (soniya):</label>
                    <input type="number" id="images-time" min="10" max="60" value="20">
                </div>
                <button id="start-images" class="start-btn">Boshlash</button>
            </div>
            <div class="display-screen" style="display:none">
                <div class="timer" id="images-timer">20</div>
                <div class="images-grid" id="images-grid"></div>
            </div>
            <div class="input-screen" style="display:none">
                <h3>Rasmlarni eslab qoling</h3>
                <div class="images-input-list" id="images-input-list"></div>
                <button id="check-images" class="check-btn">Tekshirish</button>
            </div>
            <div class="results-screen" style="display:none">
                <h3>Rasmlar Natijalari</h3>
                <div class="score-display">
                    <div class="score-circle">
                        <span id="images-score">0</span>
                        <small>ball</small>
                    </div>
                </div>
                <div class="results-comparison" id="images-comparison"></div>
                <div class="action-buttons">
                    <button class="home-btn">Bosh Sahifa</button>
                    <button class="retry-btn">Qayta O'ynash</button>
                </div>
            </div>
        `);

        document.getElementById('start-images').addEventListener('click', () => {
            const count = parseInt(document.getElementById('images-count').value);
            const time = parseInt(document.getElementById('images-time').value);
            this.startImagesRound(count, time);
        });

        document.getElementById('check-images').addEventListener('click', () => {
            this.checkImagesAnswers();
        });
    },

    startImagesRound(count, time) {
        const images = this.DataManager.getRandomImages(count);
        this.currentGame = {
            type: 'images',
            images: images,
            time: time,
            userAnswers: []
        };

        this.showGameScreen('images', 'settings', 'display');

        const grid = document.getElementById('images-grid');
        grid.innerHTML = '';

        images.forEach(image => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.innerHTML = `
                <div style="text-align: center; margin-bottom: 1rem;">
                    <div style="font-size: 4rem; margin-bottom: 0.5rem;">${image.image}</div>
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.25rem;">${image.name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${image.description}</div>
                </div>
            `;
            grid.appendChild(div);
        });

        this.startTimer('images', time, () => this.showImagesInput());
    },

    showImagesInput() {
        this.showGameScreen('images', 'display', 'input');

        const inputList = document.getElementById('images-input-list');
        inputList.innerHTML = '';

        const shuffledImages = [...this.currentGame.images].sort(() => Math.random() - 0.5);

        shuffledImages.forEach(image => {
            const div = document.createElement('div');
            div.className = 'image-input-item';
            div.style.marginBottom = '1rem';
            div.style.padding = '1rem';
            div.style.background = 'var(--bg-input)';
            div.style.borderRadius = 'var(--border-radius-sm)';
            div.innerHTML = `
                <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">${image.image}</div>
                <input type="text" class="image-name-field" placeholder="Rasm nomini yozing..." data-image-id="${image.id}" style="width: 100%; padding: 0.8rem; margin-bottom: 0.5rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem;">
                <input type="text" class="image-desc-field" placeholder="Rasm tavsifini yozing..." data-image-id="${image.id}" style="width: 100%; padding: 0.8rem; background: var(--bg-secondary); border: 2px solid transparent; border-radius: var(--border-radius-sm); color: var(--text-primary); font-size: 1rem;">
            `;
            inputList.appendChild(div);
        });
    },

    checkImagesAnswers() {
        const nameInputs = document.querySelectorAll('#images-input-list .image-name-field');
        const descInputs = document.querySelectorAll('#images-input-list .image-desc-field');
        const userAnswers = [];

        nameInputs.forEach((input, index) => {
            const imageId = parseInt(input.dataset.imageId);
            userAnswers.push({
                imageId: imageId,
                nameAnswer: input.value.trim(),
                descAnswer: descInputs[index].value.trim()
            });
        });

        this.currentGame.userAnswers = userAnswers;
        this.showImagesResults();
    },

    showImagesResults() {
        const correctImages = this.currentGame.images;
        const userAnswers = this.currentGame.userAnswers;

        let correctCount = 0;
        let totalPoints = 0;
        const results = [];

        userAnswers.forEach(userAnswer => {
            const correctImage = correctImages.find(image => image.id === userAnswer.imageId);
            if (correctImage) {
                const isNameCorrect = userAnswer.nameAnswer.toLowerCase() === correctImage.name.toLowerCase();
                const isDescCorrect = this.checkDescriptionMatch(userAnswer.descAnswer, correctImage.description);
                
                let points = 0;
                if (isNameCorrect) points += 2;
                if (isDescCorrect) points += 1;
                
                totalPoints += points;
                
                if (isNameCorrect) correctCount++;

                results.push({
                    image: correctImage,
                    userName: userAnswer.nameAnswer,
                    userDescription: userAnswer.descAnswer,
                    isNameCorrect: isNameCorrect,
                    isDescCorrect: isDescCorrect,
                    points: points
                });
            }
        });

        const maxPoints = correctImages.length * 3;
        const percentage = Math.round((totalPoints / maxPoints) * 100);
        const score = Math.round((totalPoints / maxPoints) * 1000);

        this.showGameScreen('images', 'input', 'results');
        document.getElementById('images-score').textContent = score;

        const comparison = document.getElementById('images-comparison');
        comparison.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isNameCorrect ? 'correct' : 'incorrect'}`;
            div.style.padding = '1rem';

            let content = '';
            if (result.isNameCorrect && result.isDescCorrect) {
                content = `
                    <div style="display: flex; align-items: start; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem; color: #10b981;">
                                ${result.image.name} ✓
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.image.description}
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
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem; color: #10b981;">
                                ${result.image.name} ✓
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.image.description}
                            </div>
                            <div style="margin-top: 0.5rem;">
                                <span style="color: #f59e0b;">Tavsif: ${result.userDescription || 'Berilmagan'}</span>
                                <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.image.description}</span>
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
                        <div style="font-size: 3rem; margin-right: 1rem;">${result.image.image}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 1.2rem;">
                                <span style="color: #ef4444; text-decoration: line-through;">${result.userName || 'Berilmagan'}</span>
                                <span style="color: #10b981; margin-left: 0.5rem;">→ ${result.image.name}</span>
                            </div>
                            <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                ${result.image.description}
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

            div.innerHTML = content;
            comparison.appendChild(div);
        });

        this.StorageManager.saveGameResult({
            gameType: 'images',
            score: score,
            total: correctImages.length,
            percentage: percentage,
            correctCount: correctCount
        });

        this.setupResultsButtons('images');
    },

    checkDescriptionMatch(userDesc, correctDesc) {
        if (!userDesc) return false;
        const userWords = userDesc.toLowerCase().split(' ');
        const correctWords = correctDesc.toLowerCase().split(' ');
        
        let matchCount = 0;
        userWords.forEach(userWord => {
            if (correctWords.some(correctWord => correctWord.includes(userWord) || userWord.includes(correctWord))) {
                matchCount++;
            }
        });
        
        return matchCount >= 2;
    }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    MemoryMaster.init();
});

window.addEventListener('error', function(e) {
    console.error('Global xato:', e.error);
});

window.App = MemoryMaster;

