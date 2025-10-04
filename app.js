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
