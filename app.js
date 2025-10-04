// Memory Master - App.js (Xatosiz versiya)
const App = {
    currentSection: 'profile-section',
    profileData: null,
    isInitialized: false,
    
    // Dasturni ishga tushirish
    init() {
        console.log('🚀 Dastur ishga tushmoqda...');
        
        // Kutubxonalar yuklanganligini tekshirish
        if (!this.checkDependencies()) {
            console.log('⏳ Kutubxonalar yuklanmoqda, kutish...');
            setTimeout(() => this.init(), 100);
            return;
        }

        this.showLoadingScreen();
        
        setTimeout(() => {
            this.setupEventListeners();
            this.loadProfileData();
            this.hideLoadingScreen();
            this.showSection('profile-section');
            this.isInitialized = true;
            console.log('✅ Dastur muvaffaqiyatli ishga tushdi');
        }, 1000);
    },

    // Kutubxonalarni tekshirish
    checkDependencies() {
        const deps = ['StorageManager', 'DataManager'];
        for (const dep of deps) {
            if (typeof window[dep] === 'undefined') {
                console.warn(`❌ ${dep} hali yuklanmadi`);
                return false;
            }
        }
        console.log('✅ Barcha kutubxonalar yuklandi');
        return true;
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
        console.log('🔧 Event listenerlar o\'rnatilmoqda...');
        this.setupProfileImageUpload();
        this.setupGameCards();
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
            StorageManager.updateAvatar(e.target.result);
            this.updateProfileDisplay();
            alert('Profil rasmi yangilandi!');
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

    startGame(gameType) {
        console.log('🎮 Oʻyin boshlanmoqda:', gameType);
        
        const gameModules = {
            'numbers': 'NumbersGame',
            'words': 'WordsGame', 
            'flashcards': 'FlashcardsGame',
            'faces': 'FacesGame',
            'images': 'ImagesGame'
        };

        const moduleName = gameModules[gameType];
        if (moduleName && window[moduleName]) {
            this.showSection(gameType + '-section');
            window[moduleName].init();
        } else if (gameType === 'results') {
            this.showSection('results-section');
            this.loadResultsData();
        } else {
            console.error('❌ Oʻyin moduli topilmadi:', gameType);
            alert('Bu oʻyin hozircha mavjud emas');
        }
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
        try {
            this.profileData = StorageManager.getProfile();
            this.updateProfileDisplay();
        } catch (error) {
            console.error('❌ Profil yuklashda xato:', error);
        }
    },

    updateProfileDisplay() {
        if (!this.profileData) return;

        // Asosiy profil ma'lumotlari
        const elements = {
            'profile-name': this.profileData.name || 'Foydalanuvchi',
            'total-score': this.formatNumber(this.profileData.totalScore || 0),
            'games-played': this.formatNumber(this.profileData.gamesPlayed || 0),
            'numbers-best': this.formatNumber(this.profileData.bestScores?.numbers || 0),
            'words-best': this.formatNumber(this.profileData.bestScores?.words || 0),
            'faces-best': this.formatNumber(this.profileData.bestScores?.faces || 0),
            'images-best': this.formatNumber(this.profileData.bestScores?.images || 0),
            'total-games': this.formatNumber(this.profileData.gamesPlayed || 0)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }

        // Flashcards statistikasi
        const flashcardsCount = document.getElementById('flashcards-count');
        if (flashcardsCount) {
            const progress = StorageManager.getFlashcardsProgress();
            let mastered = 0;
            Object.values(progress).forEach(lang => {
                Object.values(lang).forEach(topic => {
                    mastered += topic.mastered || 0;
                });
            });
            flashcardsCount.textContent = this.formatNumber(mastered);
        }

        // Profil rasmi
        const profileImage = document.getElementById('profile-image');
        if (profileImage && this.profileData.avatar) {
            profileImage.src = this.profileData.avatar;
            profileImage.style.display = 'block';
        }
    },

    loadResultsData() {
        try {
            const stats = StorageManager.getStats();
            const results = StorageManager.getGameResults();

            // Umumiy statistikani yangilash
            document.getElementById('total-games-played').textContent = this.formatNumber(stats.totalGames || 0);
            document.getElementById('average-score').textContent = this.formatNumber(stats.averageScore || 0);
            document.getElementById('best-score').textContent = this.formatNumber(stats.totalScore || 0);

            this.updateResultsHistory(results);
        } catch (error) {
            console.error('❌ Natijalar yuklashda xato:', error);
        }
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

    getScoreColor(percentage) {
        if (percentage >= 90) return '#10b981';
        if (percentage >= 70) return '#f59e0b';
        if (percentage >= 50) return '#f97316';
        return '#ef4444';
    },

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
    }
};

// Dasturni ishga tushirish (xavfsiz)
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

    // Dasturni boshlash (kutubxonalar yuklanishini kutish)
    setTimeout(() => {
        App.init();
    }, 100);
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('🔥 Global xato:', e.error);
});

window.App = App;
console.log('👨‍💻 App.js yuklandi');
