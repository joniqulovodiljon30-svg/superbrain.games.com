// Memory Master - TO'LIQ ISHLAYDIGAN VERSIYA
const MemoryMaster = {
    // Asosiy o'zgaruvchilar
    currentSection: 'profile-section',
    profileData: null,
    currentGame: null,
    timer: null,
    
    // ==================== STORAGE MANAGER ====================
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
                bestScores: { 
                    numbers: 0, 
                    words: 0, 
                    faces: 0, 
                    images: 0, 
                    flashcards: 0 
                }
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
                if (!stats) {
                    const newStats = {
                        totalGames: 0, 
                        totalScore: 0, 
                        averageScore: 0, 
                        games: {}
                    };
                    localStorage.setItem(this.KEYS.GAME_STATS, JSON.stringify(newStats));
                    return newStats;
                }
                return JSON.parse(stats);
            } catch (error) {
                return { totalGames: 0, totalScore: 0, averageScore: 0, games: {} };
            }
        },

        saveGameResult(gameData) {
            try {
                const results = this.getGameResults();
                const result = {
                    id: Date.now() + Math.random(),
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
            try {
                const stats = this.getStats();
                const profile = this.getProfile();

                stats.totalGames = (stats.totalGames || 0) + 1;
                stats.totalScore = (stats.totalScore || 0) + gameData.score;
                stats.averageScore = Math.round(stats.totalScore / stats.totalGames);

                if (!stats.games) stats.games = {};
                if (!stats.games[gameData.gameType]) {
                    stats.games[gameData.gameType] = {
                        played: 0,
                        totalScore: 0,
                        bestScore: 0
                    };
                }

                const gameStats = stats.games[gameData.gameType];
                gameStats.played++;
                gameStats.totalScore += gameData.score;
                
                if (gameData.score > gameStats.bestScore) {
                    gameStats.bestScore = gameData.score;
                }

                profile.gamesPlayed = stats.totalGames;
                profile.totalScore = stats.totalScore;

                if (gameData.score > (profile.bestScores[gameData.gameType] || 0)) {
                    profile.bestScores[gameData.gameType] = gameData.score;
                }

                localStorage.setItem(this.KEYS.GAME_STATS, JSON.stringify(stats));
                this.saveProfile(profile);
                return true;
            } catch (error) {
                return false;
            }
        }
    },

    // ==================== DATA MANAGER ====================
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

    // ==================== DASTURNI ISHGA TUSHIRISH ====================
    init() {
        console.log('🎮 Memory Master ishga tushmoqda...');
        this.showLoadingScreen();
        
        setTimeout(() => {
            this.setupEventListeners();
            this.loadProfileData();
            this.hideLoadingScreen();
            this.showSection('profile-section');
        }, 1);
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
        console.log('Oʻyin boshlanmoqda:', gameType);
        
        if (gameType === 'results') {
            this.showSection('results-section');
            this.loadResultsData();
        } else if (gameType === 'numbers') {
            this.startNumbersGame();
        } else if (gameType === 'words') {
            this.startWordsGame();
        } else {
            alert(`"${this.getGameName(gameType)}" o'yini tez orada qo'shiladi!`);
            this.showSection('profile-section');
        }
    },

    // ==================== PROFIL MA'LUMOTLARI ====================
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
            'flashcards-count': '0',
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

    // ==================== RAQAMLAR O'YINI ====================
    startNumbersGame() {
        this.createGameSection('numbers', 'Raqamlar O\'yini', `
            <div class="settings-screen">
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
            <div class="display-screen" style="display:none">
                <div class="timer" id="numbers-timer">10</div>
                <div class="numbers-grid" id="numbers-grid"></div>
            </div>
            <div class="input-screen" style="display:none">
                <h3>Raqamlarni eslab qoling</h3>
                <div class="input-grid" id="numbers-input-grid"></div>
                <button id="check-numbers" class="check-btn">Tekshirish</button>
            </div>
            <div class="results-screen" style="display:none">
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
        `);

        document.getElementById('start-numbers').addEventListener('click', () => {
            const count = parseInt(document.getElementById('numbers-count').value);
            const time = parseInt(document.getElementById('numbers-time').value);
            this.startNumbersRound(count, time);
        });

        document.getElementById('check-numbers').addEventListener('click', () => {
            this.checkNumbersAnswers();
        });
    },

    startNumbersRound(count, time) {
        this.currentGame = {
            type: 'numbers',
            numbers: this.DataManager.generateRandomNumbers(count),
            time: time,
            userAnswers: []
        };

        this.showGameScreen('numbers', 'settings', 'display');

        const grid = document.getElementById('numbers-grid');
        grid.innerHTML = '';
        this.currentGame.numbers.forEach(num => {
            const div = document.createElement('div');
            div.className = 'number-item';
            div.textContent = num;
            grid.appendChild(div);
        });

        this.startTimer('numbers', time, () => this.showNumbersInput());
    },

    showNumbersInput() {
        this.showGameScreen('numbers', 'display', 'input');

        const inputGrid = document.getElementById('numbers-input-grid');
        inputGrid.innerHTML = '';

        for (let i = 0; i < this.currentGame.numbers.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'input-cell';
            input.maxLength = '1';
            input.placeholder = '?';
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
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
            
            results.push({ correct, userAnswer, isCorrect, index });
        });

        const percentage = Math.round((correctCount / correctNumbers.length) * 100);
        const score = Math.round((correctCount / correctNumbers.length) * 1000);

        this.showGameScreen('numbers', 'input', 'results');
        document.getElementById('numbers-score').textContent = score;

        const comparison = document.getElementById('numbers-comparison');
        comparison.innerHTML = '';
        
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            div.innerHTML = result.isCorrect ? 
                `<strong>${result.index + 1}.</strong> ${result.correct} ✓` :
                `<strong>${result.index + 1}.</strong> <span style="color:#ef4444">${result.userAnswer || '?'}</span> → <span style="color:#10b981">${result.correct}</span>`;
            comparison.appendChild(div);
        });

        this.StorageManager.saveGameResult({
            gameType: 'numbers',
            score: score,
            total: correctNumbers.length,
            percentage: percentage,
            correctCount: correctCount
        });

        this.setupResultsButtons('numbers');
    },

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    MemoryMaster.init();
});

window.addEventListener('error', function(e) {
    console.error('Global xato:', e.error);
});

window.App = MemoryMaster;
