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
                console.log('LocalStorage dan profil:', profile);
                
                if (!profile) {
                    console.log('Profil topilmadi, yangi profil yaratilmoqda...');
                    return this.createDefaultProfile();
                }
                
                const parsedProfile = JSON.parse(profile);
                console.log('Profil muvaffaqiyatli yuklandi:', parsedProfile);
                return parsedProfile;
            } catch (error) {
                console.error('Profil o\'qishda xato:', error);
                return this.createDefaultProfile();
            }
        },

        createDefaultProfile() {
            console.log('Yangi profil yaratilmoqda...');
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
            
            const saved = this.saveProfile(defaultProfile);
            console.log('Profil saqlandi:', saved);
            return defaultProfile;
        },

        saveProfile(profileData) {
            try {
                console.log('Profil saqlanmoqda:', profileData);
                localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profileData));
                
                const saved = localStorage.getItem(this.KEYS.USER_PROFILE);
                console.log('Saqlangan profil:', saved);
                return true;
            } catch (error) {
                console.error('Profil saqlashda xato:', error);
                return false;
            }
        },

        updateAvatar(avatarData) {
            try {
                const profile = this.getProfile();
                console.log('Avvalgi profil:', profile);
                
                profile.avatar = avatarData;
                const saved = this.saveProfile(profile);
                console.log('Rasm yangilandi, saqlandi:', saved);
                return saved;
            } catch (error) {
                console.error('Rasm yangilashda xato:', error);
                return false;
            }
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
                console.error('Statistika o\'qishda xato:', error);
                return { totalGames: 0, totalScore: 0, averageScore: 0, games: {} };
            }
        },

        saveGameResult(gameData) {
            try {
                console.log('O\'yin natijasi saqlanmoqda:', gameData);
                
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
                console.log('Natijalar saqlandi, jami:', results.length);
                
                this.updateStats(gameData);
                return true;
            } catch (error) {
                console.error('Natija saqlashda xato:', error);
                return false;
            }
        },

        getGameResults() {
            try {
                const results = localStorage.getItem(this.KEYS.GAME_RESULTS);
                return results ? JSON.parse(results) : [];
            } catch (error) {
                console.error('Natijalarni o\'qishda xato:', error);
                return [];
            }
        },

        updateStats(gameData) {
            try {
                console.log('Statistika yangilanmoqda...');
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
                    console.log('Yangi eng yaxshi natija:', gameData.gameType, gameData.score);
                }

                localStorage.setItem(this.KEYS.GAME_STATS, JSON.stringify(stats));
                this.saveProfile(profile);
                
                console.log('Statistika yangilandi:', stats);
                console.log('Profil yangilandi:', profile);
                
                return true;
            } catch (error) {
                console.error('Statistika yangilashda xato:', error);
                return false;
            }
        },

        getFlashcardsProgress() {
            try {
                const progress = localStorage.getItem(this.KEYS.FLASHCARDS_PROGRESS);
                return progress ? JSON.parse(progress) : {};
            } catch (error) {
                console.error('Flashcards progress o\'qishda xato:', error);
                return {};
            }
        },

        saveFlashcardsProgress(language, topic, progress) {
            try {
                const allProgress = this.getFlashcardsProgress();
                if (!allProgress[language]) allProgress[language] = {};
                allProgress[language][topic] = progress;
                localStorage.setItem(this.KEYS.FLASHCARDS_PROGRESS, JSON.stringify(allProgress));
                return true;
            } catch (error) {
                console.error('Flashcards progress saqlashda xato:', error);
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

        flashcardsLanguages: ['english', 'korean', 'japanese', 'chinese', 'german', 'french'],
        wordsLanguages: ['english', 'korean', 'japanese', 'chinese', 'german', 'french', 'uzbek'],

        topics: [
            "Oziq-ovqat", "Transport", "Uy-ro'zg'or", "Kasblar", "Sport",
            "Ta'lim", "Texnologiya", "Sog'liq", "Tabiat", "San'at"
        ],

        vocabulary: {
            english: {
                "Oziq-ovqat": [
                    { word: "Apple", pronunciation: "[ˈæp.əl]", translation: "Olma" },
                    { word: "Bread", pronunciation: "[bred]", translation: "Non" },
                    { word: "Cheese", pronunciation: "[tʃiːz]", translation: "Pishloq" },
                    { word: "Orange", pronunciation: "[ˈɒr.ɪndʒ]", translation: "Apelsin" },
                    { word: "Tomato", pronunciation: "[təˈmɑː.təʊ]", translation: "Pomidor" }
                ],
                "Transport": [
                    { word: "Car", pronunciation: "[kɑːr]", translation: "Mashina" },
                    { word: "Bus", pronunciation: "[bʌs]", translation: "Avtobus" },
                    { word: "Train", pronunciation: "[treɪn]", translation: "Poyezd" },
                    { word: "Bicycle", pronunciation: "[ˈbaɪ.sɪ.kəl]", translation: "Velosiped" },
                    { word: "Airplane", pronunciation: "[ˈeə.pleɪn]", translation: "Samolyot" }
                ]
            },
            uzbek: {
                "Oziq-ovqat": [
                    { word: "Olma", pronunciation: "[ol-ma]", translation: "Apple" },
                    { word: "Non", pronunciation: "[non]", translation: "Bread" },
                    { word: "Pishloq", pronunciation: "[pish-loq]", translation: "Cheese" },
                    { word: "Apelsin", pronunciation: "[a-pel-sin]", translation: "Orange" },
                    { word: "Pomidor", pronunciation: "[po-mi-dor]", translation: "Tomato" }
                ],
                "Transport": [
                    { word: "Mashina", pronunciation: "[ma-shi-na]", translation: "Car" },
                    { word: "Avtobus", pronunciation: "[av-to-bus]", translation: "Bus" },
                    { word: "Poyezd", pronunciation: "[po-yezd]", translation: "Train" },
                    { word: "Velosiped", pronunciation: "[ve-lo-si-ped]", translation: "Bicycle" },
                    { word: "Samolyot", pronunciation: "[sa-mo-lyot]", translation: "Airplane" }
                ]
            }
        },

        faces: [
            { id: 1, name: "Ali", image: "👨", description: "Qora soch, jigarrang ko'zlar" },
            { id: 2, name: "Malika", image: "👩", description: "Sariq soch, ko'k ko'zlar" },
            { id: 3, name: "Hasan", image: "👨", description: "Qisqa soch, yashil ko'zlar" },
            { id: 4, name: "Dilnoza", image: "👩", description: "Uzun qora soch, jigarrang ko'zlar" },
            { id: 5, name: "Javohir", image: "👨", description: "Jigarrang soch, kulrang ko'zlar" }
        ],

        images: [
            { id: 1, name: "Tog'", image: "🏔️", description: "Qorli tog' cho'qqisi" },
            { id: 2, name: "Daryo", image: "🌊", description: "Oqimli daryo" },
            { id: 3, name: "O'rmon", image: "🌲", description: "Qalin o'rmon" },
            { id: 4, name: "Shahar", image: "🏙️", description: "Zamonaviy shahar" },
            { id: 5, name: "Dengiz", image: "🌊", description: "Ko'k dengiz" }
        ],

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
        },

        getRandomFaces(count) {
            const shuffled = [...this.faces].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(count, this.faces.length));
        },

        getRandomImages(count) {
            const shuffled = [...this.images].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(count, this.images.length));
        },

        getLanguageName(code) {
            return this.languages[code]?.name || code;
        }
    },

    // ==================== DASTURNI ISHGA TUSHIRISH ====================
    init() {
        console.log('🎮 Memory Master ishga tushmoqda...');
        console.log('LocalStorage mavjud:', !!localStorage);
        
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            console.log('✅ LocalStorage ishlayapti');
        } catch (error) {
            console.error('❌ LocalStorage ishlamayapti:', error);
            alert('LocalStorage ishlamayapti. Brauzeringizda LocalStorage qo\'llab-quvvatlanmaydi.');
            return;
        }

        this.showLoadingScreen();
        
        setTimeout(() => {
            console.log('🔧 Dastur sozlamalari o\'rnatilmoqda...');
            this.setupEventListeners();
            this.loadProfileData();
            this.hideLoadingScreen();
            this.showSection('profile-section');
            console.log('✅ Dastur tayyor! Profil yaratildi va saqlandi.');
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
        } else if (gameType === 'flashcards') {
            this.startFlashcardsGame();
        } else if (gameType === 'faces') {
            this.startFacesGame();
        } else if (gameType === 'images') {
            this.startImagesGame();
        }
    },

    // ==================== PROFIL MA'LUMOTLARI ====================
    loadProfileData() {
        console.log('📊 Profil maʼlumotlari yuklanmoqda...');
        try {
            this.profileData = this.StorageManager.getProfile();
            console.log('Profil maʼlumotlari yuklandi:', this.profileData);
            this.updateProfileDisplay();
        } catch (error) {
            console.error('❌ Profil yuklashda xato:', error);
            this.profileData = this.StorageManager.createDefaultProfile();
            this.updateProfileDisplay();
        }
    },

    updateProfileDisplay() {
        if (!this.profileData) {
            console.error('❌ Profil maʼlumotlari mavjud emas');
            return;
        }

        console.log('🔄 Profil ekrani yangilanmoqda...');

        const elements = {
            'profile-name': this.profileData.name || 'Foydalanuvchi',
            'total-score': this.formatNumber(this.profileData.totalScore || 0),
            'games-played': this.formatNumber(this.profileData.gamesPlayed || 0),
            'numbers-best': this.formatNumber(this.profileData.bestScores?.numbers || 0),
            'words-best': this.formatNumber(this.profileData.bestScores?.words || 0),
            'faces-best': this.formatNumber(this.profileData.bestScores?.faces || 0),
            'images-best': this.formatNumber(this.profileData.bestScores?.images || 0),
            'flashcards-count': '0',
            'total-games': this.formatNumber(this.profileData.gamesPlayed || 0)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                console.log(`✅ ${id}: ${value}`);
            } else {
                console.warn(`❌ Element topilmadi: ${id}`);
            }
        }

        const profileImage = document.getElementById('profile-image');
        if (profileImage) {
            if (this.profileData.avatar) {
                profileImage.src = this.profileData.avatar;
                profileImage.style.display = 'block';
                console.log('✅ Profil rasmi yuklandi');
            } else {
                profileImage.style.display = 'none';
                console.log('ℹ️ Profil rasmi mavjud emas');
            }
        }

        console.log('✅ Profil ekrani yangilandi');
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

    // ==================== SO'ZLAR O'YINI ====================
    startWordsGame() {
        this.createGameSection('words', 'So\'zlar O\'yini', `
            <div class="settings-screen">
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
            <div class="display-screen" style="display:none">
                <div class="timer" id="words-timer">20</div>
                <div class="words-list" id="words-list"></div>
            </div>
            <div class="input-screen" style="display:none">
                <h3>So'zlarni eslab qoling</h3>
                <div class="words-input-list" id="words-input-list"></div>
                <button id="check-words" class="check-btn">Tekshirish</button>
            </div>
            <div class="results-screen" style="display:none">
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
        `);

        document.getElementById('start-words').addEventListener('click', () => {
            const language = document.getElementById('words-language').value;
            const count = parseInt(document.getElementById('words-count').value);
            const time = parseInt(document.getElementById('words-time').value);
            this.startWordsRound(language, count, time);
        });

        document.getElementById('check-words').addEventListener('click', () => {
            this.checkWordsAnswers();
        });
    },

    startWordsRound(language, count, time) {
        const topic = this.DataManager.topics[Math.floor(Math.random() * this.DataManager.topics.length)];
        const words = this.DataManager.getRandomWords(language, topic, count);
        
        if (words.length === 0) {
            alert('So\'zlar topilmadi! Boshqa til yoki mavzu tanlang.');
            return;
        }

        this.currentGame = {
            type: 'words',
            language: language,
            words: words,
            time: time,
            userAnswers: []
        };

        this.showGameScreen('words', 'settings', 'display');

        const wordsList = document.getElementById('words-list');
        wordsList.innerHTML = '';

        words.forEach((word, index) => {
            const div = document.createElement('div');
            div.className = 'word-item';
            div.innerHTML = `
                <strong>${index + 1}. ${word.word}</strong>
                <small>${word.pronunciation}</small>
                <div>${word.translation}</div>
            `;
            wordsList.appendChild(div);
        });

        this.startTimer('words', time, () => this.showWordsInput());
    },

    showWordsInput() {
        this.showGameScreen('words', 'display', 'input');

        const inputList = document.getElementById('words-input-list');
        inputList.innerHTML = '';

        this.currentGame.words.forEach((word, index) => {
            const div = document.createElement('div');
            div.className = 'word-input-item';
            div.innerHTML = `
                <div class="word-input-label">
                    <strong>${index + 1}. ${word.word}</strong>
                    <br><small>${word.pronunciation}</small>
                </div>
                <input type="text" class="word-input-field" placeholder="Tarjimasini yozing..." data-index="${index}">
            `;
            inputList.appendChild(div);
        });
    },

    checkWordsAnswers() {
        const inputs = document.querySelectorAll('#words-input-list .word-input-field');
        const userAnswers = [];
        
        inputs.forEach(input => {
            userAnswers.push(input.value.trim());
        });

        this.currentGame.userAnswers = userAnswers;
        this.showWordsResults();
    },

    showWordsResults() {
        const correctWords = this.currentGame.words;
        const userAnswers = this.currentGame.userAnswers;
        
        let correctCount = 0;
        const results = [];

        correctWords.forEach((word, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer.toLowerCase() === word.translation.toLowerCase();
            if (isCorrect) correctCount++;
            
            results.push({ word, userAnswer, isCorrect, index });
        });

        const percentage = Math.round((correctCount / correctWords.length) * 100);
        const score = Math.round((correctCount / correctWords.length) * 1000);

        this.showGameScreen('words', 'input', 'results');
        document.getElementById('words-score').textContent = score;

        const comparison = document.getElementById('words-comparison');
        comparison.innerHTML = '';
        
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            if (result.isCorrect) {
                div.innerHTML = `
                    <strong>${result.word.word}</strong> 
                    <small>${result.word.pronunciation}</small>
                    <div>Sizning javobingiz: <strong style="color:#10b981">${result.userAnswer}</strong> ✓</div>
                `;
            } else {
                div.innerHTML = `
                    <strong>${result.word.word}</strong> 
                    <small>${result.word.pronunciation}</small>
                    <div>
                        <span style="color:#ef4444">${result.userAnswer || 'Javob yo\'q'}</span> → 
                        <span style="color:#10b981">${result.word.translation}</span>
                    </div>
                `;
            }
            comparison.appendChild(div);
        });

        this.StorageManager.saveGameResult({
            gameType: 'words',
            score: score,
            total: correctWords.length,
            percentage: percentage,
            correctCount: correctCount
        });

        this.setupResultsButtons('words');
    },

    // ==================== YORDAMCHI FUNKSIYALAR ====================
    createGameSection(gameType, title, content) {
        let section = document.getElementById(`${gameType}-section`);
        if (!section) {
            section = document.createElement('div');
            section.id = `${gameType}-section`;
            section.className = 'section';
            section.innerHTML = `
                <div class="game-header">
                    <button class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>${title}</h2>
                </div>
                <div class="game-content">
                    ${content}
                </div>
            `;
            document.getElementById('app').appendChild(section);
            
            section.querySelector('.back-btn').addEventListener('click', () => {
                this.showSection('profile-section');
            });
        }
        this.showSection(`${gameType}-section`);
    },

    showGameScreen(gameType, hideScreen, showScreen) {
        document.getElementById(`${gameType}-${hideScreen}`).style.display = 'none';
        document.getElementById(`${gameType}-${showScreen}`).style.display = 'block';
    },

    startTimer(gameType, time, onComplete) {
        let timeLeft = time;
        const timerElement = document.getElementById(`${gameType}-timer`);
        
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                onComplete();
            }
        }, 1000);
    },

    setupResultsButtons(gameType) {
        document.querySelector(`#${gameType}-results .home-btn`).addEventListener('click', () => {
            this.showSection('profile-section');
        });

        document.querySelector(`#${gameType}-results .retry-btn`).addEventListener('click', () => {
            this[`start${gameType.charAt(0).toUpperCase() + gameType.slice(1)}Game`]();
        });
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

    getGameName(gameType) {
        const names = {
            'numbers': '🔢 Raqamlar',
            'words': '📝 Soʻzlar', 
            'flashcards': '🃏 Flashcards',
            'faces': '👥 Yuz va Ismlar',
            'images': '🖼️ Rasmlar'
        };
        return names[gameType] || gameType;
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
    },

    // ==================== BOSHQA O'YINLAR ====================
    startFlashcardsGame() {
        alert('🃏 Flashcards o\'yini tez orada qo\'shiladi!');
        this.showSection('profile-section');
    },

    startFacesGame() {
        alert('👥 Yuz va Ismlar o\'yini tez orada qo\'shiladi!');
        this.showSection('profile-section');
    },

    startImagesGame() {
        alert('🖼️ Rasmlar o\'yini tez orada qo\'shiladi!');
        this.showSection('profile-section');
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
