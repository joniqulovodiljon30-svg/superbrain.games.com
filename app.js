// Asosiy boshqaruv fayli
const App = {
    // Dastur holatlari
    currentSection: 'profile-section',
    profileData: null,
    
    // Dasturni ishga tushirish
    init() {
        this.initializeApp();
        this.setupEventListeners();
        this.loadProfileData();
        this.setupGameModules();
    },

    // Dasturni ishga tushirish
    initializeApp() {
        // Loading ekranini ko'rsatish
        this.showLoadingScreen();
        
        // Ma'lumotlarni yuklash
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showSection('profile-section');
            this.updateProfileDisplay();
        }, 2000);
    },

    // Loading ekranini ko'rsatish
    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
    },

    // Loading ekranini yashirish
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    },

    // Event listenerlarni o'rnatish
    setupEventListeners() {
        // Profil rasmini yuklash
        this.setupProfileImageUpload();
        
        // O'yin kartalari uchun event listenerlar
        this.setupGameCards();
        
        // Natijalar bo'limi
        this.setupResultsSection();
    },

    // Profil rasmini yuklash
    setupProfileImageUpload() {
        const avatarUpload = document.getElementById('avatar-upload');
        const profileImage = document.getElementById('profile-image');
        const avatarOverlay = document.querySelector('.avatar-overlay');

        // Rasm yuklash
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadProfileImage(file);
            }
        });

        // Rasm yuklash tugmasi
        avatarOverlay.addEventListener('click', () => {
            avatarUpload.click();
        });

        // Drag and drop qo'llab-quvvatlash
        const profileAvatar = document.querySelector('.profile-avatar');
        profileAvatar.addEventListener('dragover', (e) => {
            e.preventDefault();
            profileAvatar.style.borderColor = '#6366f1';
        });

        profileAvatar.addEventListener('dragleave', (e) => {
            e.preventDefault();
            profileAvatar.style.borderColor = '';
        });

        profileAvatar.addEventListener('drop', (e) => {
            e.preventDefault();
            profileAvatar.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.uploadProfileImage(file);
            }
        });
    },

    // Profil rasmini yuklash
    uploadProfileImage(file) {
        if (!file.type.startsWith('image/')) {
            Helpers.showError('Faqat rasm fayllarini yuklash mumkin');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            Helpers.showError('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        Helpers.showLoading();
        
        Helpers.fileToBase64(file)
            .then(base64 => {
                StorageManager.updateAvatar(base64);
                this.updateProfileDisplay();
                Helpers.hideLoading();
                Helpers.showSuccess('Profil rasmi muvaffaqiyatli yangilandi!');
            })
            .catch(error => {
                console.error('Rasm yuklashda xato:', error);
                Helpers.hideLoading();
                Helpers.showError('Rasm yuklashda xato yuz berdi');
            });
    },

    // O'yin kartalari uchun event listenerlar
    setupGameCards() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.startGame(gameType);
            });
        });
    },

    // O'yinni boshlash
    startGame(gameType) {
        switch (gameType) {
            case 'numbers':
                this.showSection('numbers-section');
                NumbersGame.init();
                break;
            case 'words':
                this.showSection('words-section');
                WordsGame.init();
                break;
            case 'flashcards':
                this.showSection('flashcards-section');
                FlashcardsGame.init();
                break;
            case 'faces':
                this.showSection('faces-section');
                FacesGame.init();
                break;
            case 'images':
                this.showSection('images-section');
                ImagesGame.init();
                break;
            case 'results':
                this.showSection('results-section');
                this.loadResultsData();
                break;
        }
    },

    // Bo'limni ko'rsatish
    showSection(sectionId) {
        // Hozirgi bo'limni yashirish
        if (this.currentSection) {
            document.getElementById(this.currentSection).classList.remove('active');
        }

        // Yangi bo'limni ko'rsatish
        document.getElementById(sectionId).classList.add('active');
        this.currentSection = sectionId;

        // Scroll ni tepaga olib chiqish
        Helpers.scrollToTop();
    },

    // Profil ma'lumotlarini yuklash
    loadProfileData() {
        this.profileData = StorageManager.getProfile();
        this.updateProfileDisplay();
    },

    // Profil ma'lumotlarini yangilash
    updateProfileDisplay() {
        const profileData = StorageManager.getProfile();
        const stats = StorageManager.getStats();

        // Asosiy profil ma'lumotlari
        document.getElementById('profile-name').textContent = profileData.name;
        document.getElementById('total-score').textContent = Helpers.formatNumber(profileData.totalScore || 0);
        document.getElementById('games-played').textContent = Helpers.formatNumber(profileData.gamesPlayed || 0);

        // Profil rasmi
        const profileImage = document.getElementById('profile-image');
        if (profileData.avatar) {
            profileImage.src = profileData.avatar;
            profileImage.style.display = 'block';
        } else {
            profileImage.style.display = 'none';
            // Default avatar ko'rsatish
            const avatarContainer = document.querySelector('.profile-avatar');
            avatarContainer.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            avatarContainer.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }

        // O'yin statistikasi
        this.updateGameStats();
    },

    // O'yin statistikasini yangilash
    updateGameStats() {
        const stats = StorageManager.getStats();
        const profile = StorageManager.getProfile();

        // Raqamlar
        document.getElementById('numbers-best').textContent = 
            Helpers.formatNumber(profile.bestScores?.numbers || 0);
        
        // So'zlar
        document.getElementById('words-best').textContent = 
            Helpers.formatNumber(profile.bestScores?.words || 0);
        
        // Yuz va ismlar
        document.getElementById('faces-best').textContent = 
            Helpers.formatNumber(profile.bestScores?.faces || 0);
        
        // Rasmlar
        document.getElementById('images-best').textContent = 
            Helpers.formatNumber(profile.bestScores?.images || 0);
        
        // Flashcards
        const flashcardsProgress = StorageManager.getFlashcardsProgress();
        let totalFlashcards = 0;
        let masteredFlashcards = 0;

        Object.values(flashcardsProgress).forEach(language => {
            Object.values(language).forEach(topic => {
                totalFlashcards += topic.practiced || 0;
                masteredFlashcards += topic.mastered || 0;
            });
        });

        document.getElementById('flashcards-count').textContent = 
            Helpers.formatNumber(masteredFlashcards);
        
        // Umumiy o'yinlar
        document.getElementById('total-games').textContent = 
            Helpers.formatNumber(stats.totalGames || 0);
    },

    // O'yin modullarini sozlash
    setupGameModules() {
        // Har bir o'yin moduli uchun HTML elementlarni yaratish
        this.createMissingGameSections();
    },

    // Yo'qolgan o'yin bo'limlarini yaratish
    createMissingGameSections() {
        // Faces bo'limini yaratish
        if (!document.getElementById('faces-section')) {
            this.createFacesSection();
        }

        // Images bo'limini yaratish
        if (!document.getElementById('images-section')) {
            this.createImagesSection();
        }
    },

    // Faces bo'limini yaratish
    createFacesSection() {
        const facesHTML = `
            <div id="faces-section" class="section">
                <div class="game-header">
                    <button class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>Yuz va Ismlar O'yini</h2>
                </div>

                <div class="game-content">
                    <!-- Settings Screen -->
                    <div id="faces-settings" class="settings-screen">
                        <div class="setting-group">
                            <label>Yuzlar soni:</label>
                            <input type="number" id="faces-count" min="3" max="20" value="8">
                        </div>
                        <div class="setting-group">
                            <label>Eslab qolish vaqti (soniya):</label>
                            <input type="number" id="faces-time" min="10" max="180" value="45">
                        </div>
                        <button id="start-faces" class="start-btn">Boshlash</button>
                    </div>

                    <!-- Display Screen -->
                    <div id="faces-display" class="display-screen">
                        <div class="timer" id="faces-timer">45</div>
                        <div class="faces-grid" id="faces-grid"></div>
                    </div>

                    <!-- Input Screen -->
                    <div id="faces-input" class="input-screen">
                        <h3>Yuz va ismlarni eslab qoling</h3>
                        <div class="faces-input-list" id="faces-input-list"></div>
                        <button id="check-faces" class="check-btn">Tekshirish</button>
                    </div>

                    <!-- Results Screen -->
                    <div id="faces-results" class="results-screen">
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
                </div>
            </div>
        `;

        document.getElementById('app').insertAdjacentHTML('beforeend', facesHTML);
    },

    // Images bo'limini yaratish
    createImagesSection() {
        const imagesHTML = `
            <div id="images-section" class="section">
                <div class="game-header">
                    <button class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>Rasmlar O'yini</h2>
                </div>

                <div class="game-content">
                    <!-- Settings Screen -->
                    <div id="images-settings" class="settings-screen">
                        <div class="setting-group">
                            <label>Rasmlar soni:</label>
                            <input type="number" id="images-count" min="3" max="15" value="6">
                        </div>
                        <div class="setting-group">
                            <label>Eslab qolish vaqti (soniya):</label>
                            <input type="number" id="images-time" min="10" max="120" value="30">
                        </div>
                        <button id="start-images" class="start-btn">Boshlash</button>
                    </div>

                    <!-- Display Screen -->
                    <div id="images-display" class="display-screen">
                        <div class="timer" id="images-timer">30</div>
                        <div class="images-grid" id="images-grid"></div>
                    </div>

                    <!-- Input Screen -->
                    <div id="images-input" class="input-screen">
                        <h3>Rasmlarni eslab qoling</h3>
                        <div class="images-input-list" id="images-input-list"></div>
                        <button id="check-images" class="check-btn">Tekshirish</button>
                    </div>

                    <!-- Results Screen -->
                    <div id="images-results" class="results-screen">
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
                </div>
            </div>
        `;

        document.getElementById('app').insertAdjacentHTML('beforeend', imagesHTML);
    },

    // Natijalar bo'limini sozlash
    setupResultsSection() {
        // Natijalar bo'limi event listenerlari
        document.querySelector('#results-section .back-btn')?.addEventListener('click', () => {
            this.showSection('profile-section');
        });
    },

    // Natijalar ma'lumotlarini yuklash
    loadResultsData() {
        const stats = StorageManager.getStats();
        const results = StorageManager.getGameResults();

        // Umumiy statistikani yangilash
        document.getElementById('total-games-played').textContent = 
            Helpers.formatNumber(stats.totalGames || 0);
        document.getElementById('average-score').textContent = 
            Helpers.formatNumber(stats.averageScore || 0);
        document.getElementById('best-score').textContent = 
            Helpers.formatNumber(stats.totalScore || 0);

        // O'yinlar tarixini yangilash
        this.updateResultsHistory(results);
    },

    // Natijalar tarixini yangilash
    updateResultsHistory(results) {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        if (results.length === 0) {
            historyList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Hali hech qanday o'yin o'ynalmagan</p>
                </div>
            `;
            return;
        }

        results.slice(0, 20).forEach(result => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const gameName = this.getGameName(result.gameType);
            const scoreColor = Helpers.getScoreColor(result.percentage);

            historyItem.innerHTML = `
                <div class="history-game">
                    <div style="font-weight: bold;">${gameName}</div>
                    <small style="color: var(--text-muted);">
                        ${Helpers.formatDate(result.date)}
                    </small>
                </div>
                <div class="history-score" style="background: ${scoreColor};">
                    ${result.score}
                </div>
                <div class="history-date" style="text-align: right;">
                    <div style="font-weight: bold; color: ${scoreColor};">
                        ${result.percentage}%
                    </div>
                    <small>${result.correctCount}/${result.total}</small>
                </div>
            `;

            historyList.appendChild(historyItem);
        });
    },

    // O'yin nomini olish
    getGameName(gameType) {
        const gameNames = {
            'numbers': '🔢 Raqamlar',
            'words': '📝 So\'zlar', 
            'flashcards': '🃏 Flashcards',
            'faces': '👥 Yuz va Ismlar',
            'images': '🖼️ Rasmlar'
        };
        
        return gameNames[gameType] || gameType;
    },

    // Dasturni to'xtatish
    destroy() {
        // O'yinlarni to'xtatish
        if (window.NumbersGame) NumbersGame.stopGame();
        if (window.WordsGame) WordsGame.stopGame();
        // Boshqa o'yinlarni ham to'xtatish kerak
        
        console.log('Memory Master dasturi to\'xtatildi');
    }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage ni tekshirish
    if (!StorageManager.checkStorage()) {
        alert('Brauzeringiz LocalStorage ni qo\'llab-quvvatlamaydi. Ba\'zi funksiyalar ishlamasligi mumkin.');
    }

    // Offline qo'llab-quvvatlash
    Helpers.setupOfflineSupport();

    // Dasturni ishga tushirish
    App.init();
});

// Oldindan yuklash optimizatsiyasi
window.addEventListener('load', function() {
    // Resurslarni oldindan yuklash
    const preloadResources = [
        // Ikonkalar va boshqa resurslar
    ];

    // Performance monitoring
    if ('performance' in window) {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Sahifa yuklash vaqti: ${loadTime}ms`);
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global xato:', e.error);
    Helpers.showError('Dasturda xato yuz berdi. Iltimos, sahifani yangilang.');
});

// Global qilish
window.App = App;