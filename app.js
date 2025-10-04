// Memory Master - To'liq birlashtirilgan App.js
const MemoryMaster = {
    // Asosiy o'zgaruvchilar
    currentSection: 'profile-section',
    profileData: null,
    
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
                console.error('Profil o\'qishda xato:', error);
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
                bestScores: { numbers: 0, words: 0, faces: 0, images: 0 }
            };
            this.saveProfile(defaultProfile);
            return defaultProfile;
        },

        saveProfile(profileData) {
            try {
                localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profileData));
                return true;
            } catch (error) {
                console.error('Profil saqlashda xato:', error);
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
                
                // Statistikani yangilash
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
        },

        getFlashcardsProgress() {
            try {
                const progress = localStorage.getItem(this.KEYS.FLASHCARDS_PROGRESS);
                return progress ? JSON.parse(progress) : {};
            } catch (error) {
                return {};
            }
        }
    },

    // Helper funksiyalari
    Helpers: {
        formatNumber(num) {
            return new Intl.NumberFormat('uz-UZ').format(num);
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return "Bugun";
            if (diffDays === 1) return "Kecha";
            if (diffDays < 7) return `${diffDays} kun oldin`;
            
            return date.toLocaleDateString('uz-UZ');
        },

        getScoreColor(percentage) {
            if (percentage >= 90) return '#10b981';
            if (percentage >= 70) return '#f59e0b';
            if (percentage >= 50) return '#f97316';
            return '#ef4444';
        },

        showMessage(message, type = 'info') {
            // Soddalashtirilgan message
            alert(message);
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
        }, 1500);
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
            alert('✅ Profil rasmi yangilandi!');
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
        } else {
            alert(`🎮 "${this.getGameName(gameType)}" o'yini tez orada qo'shiladi!`);
        }
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
        // Hozirgi boʻlimni yashirish
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) currentSection.classList.remove('active');

        // Yangi boʻlimni koʻrsatish
        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
            this.currentSection = sectionId;
            window.scrollTo(0, 0);
        }
    },

    loadProfileData() {
        console.log('📊 Profil maʼlumotlari yuklanmoqda...');
        this.profileData = this.StorageManager.getProfile();
        this.updateProfileDisplay();
    },

    updateProfileDisplay() {
        if (!this.profileData) return;

        // Asosiy profil ma'lumotlari
        const elements = {
            'profile-name': this.profileData.name,
            'total-score': this.Helpers.formatNumber(this.profileData.totalScore),
            'games-played': this.Helpers.formatNumber(this.profileData.gamesPlayed),
            'numbers-best': this.Helpers.formatNumber(this.profileData.bestScores.numbers),
            'words-best': this.Helpers.formatNumber(this.profileData.bestScores.words),
            'faces-best': this.Helpers.formatNumber(this.profileData.bestScores.faces),
            'images-best': this.Helpers.formatNumber(this.profileData.bestScores.images),
            'total-games': this.Helpers.formatNumber(this.profileData.gamesPlayed)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }

        // Flashcards statistikasi
        const flashcardsCount = document.getElementById('flashcards-count');
        if (flashcardsCount) {
            flashcardsCount.textContent = '0';
        }

        // Profil rasmi
        const profileImage = document.getElementById('profile-image');
        if (profileImage && this.profileData.avatar) {
            profileImage.src = this.profileData.avatar;
            profileImage.style.display = 'block';
        }
    },

    loadResultsData() {
        const stats = this.StorageManager.getStats();
        const results = this.StorageManager.getGameResults();

        // Umumiy statistikani yangilash
        document.getElementById('total-games-played').textContent = this.Helpers.formatNumber(stats.totalGames);
        document.getElementById('average-score').textContent = this.Helpers.formatNumber(stats.averageScore);
        document.getElementById('best-score').textContent = this.Helpers.formatNumber(stats.totalScore);

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
                    <small>${this.Helpers.formatDate(result.date)}</small>
                </div>
                <div class="history-score" style="background: ${this.Helpers.getScoreColor(result.percentage)};">
                    ${result.score}
                </div>
                <div class="history-date">
                    <strong style="color: ${this.Helpers.getScoreColor(result.percentage)};">${result.percentage}%</strong>
                    <small>${result.correctCount}/${result.total}</small>
                </div>
            `;
            historyList.appendChild(item);
        });
    }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yuklandi');
    
    // LocalStorage tekshirish
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('💾 LocalStorage ishlayapti');
    } catch (e) {
        console.error('❌ LocalStorage ishlamayapti');
    }

    // Dasturni boshlash
    MemoryMaster.init();
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('🔥 Global xato:', e.error);
});

window.App = MemoryMaster;
console.log('👨‍💻 Memory Master yuklandi');
