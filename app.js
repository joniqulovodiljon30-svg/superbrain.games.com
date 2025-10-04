// Memory Master - Tuzatilgan App.js
const App = {
    currentSection: 'profile-section',
    profileData: null,
    
    init() {
        console.log('Dastur ishga tushmoqda...');
        this.showLoadingScreen();
        
        // Ma'lumotlarni tekshirish
        this.checkDependencies();
        
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showSection('profile-section');
            this.updateProfileDisplay();
            console.log('Dastur muvaffaqiyatli ishga tushdi');
        }, 1500);
    },

    // Kutubxonalarni tekshirish
    checkDependencies() {
        if (typeof StorageManager === 'undefined') {
            console.error('StorageManager topilmadi!');
            return false;
        }
        if (typeof Helpers === 'undefined') {
            console.error('Helpers topilmadi!');
            return false;
        }
        if (typeof DataManager === 'undefined') {
            console.error('DataManager topilmadi!');
            return false;
        }
        return true;
    },

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
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
        this.setupResultsSection();
    },

    setupProfileImageUpload() {
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarOverlay = document.querySelector('.avatar-overlay');

        if (avatarUpload && avatarOverlay) {
            avatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.uploadProfileImage(file);
                }
            });

            avatarOverlay.addEventListener('click', () => {
                avatarUpload.click();
            });
        }
    },

    uploadProfileImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showMessage('Faqat rasm fayllarini yuklash mumkin', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('Rasm hajmi 5MB dan oshmasligi kerak', 'error');
            return;
        }

        this.showMessage('Rasm yuklanmoqda...', 'info');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof StorageManager !== 'undefined') {
                StorageManager.updateAvatar(e.target.result);
                this.updateProfileDisplay();
                this.showMessage('Profil rasmi yangilandi!', 'success');
            }
        };
        reader.onerror = (error) => {
            console.error('Rasm yuklashda xato:', error);
            this.showMessage('Rasm yuklashda xato', 'error');
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
        console.log('Oʻyin boshlanmoqda:', gameType);
        
        switch (gameType) {
            case 'numbers':
                this.showSection('numbers-section');
                if (typeof NumbersGame !== 'undefined') {
                    NumbersGame.init();
                }
                break;
            case 'words':
                this.showSection('words-section');
                if (typeof WordsGame !== 'undefined') {
                    WordsGame.init();
                }
                break;
            case 'flashcards':
                this.showSection('flashcards-section');
                if (typeof FlashcardsGame !== 'undefined') {
                    FlashcardsGame.init();
                }
                break;
            case 'faces':
                this.showSection('faces-section');
                if (typeof FacesGame !== 'undefined') {
                    FacesGame.init();
                }
                break;
            case 'images':
                this.showSection('images-section');
                if (typeof ImagesGame !== 'undefined') {
                    ImagesGame.init();
                }
                break;
            case 'results':
                this.showSection('results-section');
                this.loadResultsData();
                break;
            default:
                console.error('Nomaʼlum oʻyin turi:', gameType);
        }
    },

    showSection(sectionId) {
        // Hozirgi boʻlimni yashirish
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) {
            currentSection.classList.remove('active');
        }

        // Yangi boʻlimni koʻrsatish
        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Scroll ni tepaga olib chiqish
            window.scrollTo(0, 0);
        } else {
            console.error('Boʻlim topilmadi:', sectionId);
        }
    },

    loadProfileData() {
        if (typeof StorageManager !== 'undefined') {
            this.profileData = StorageManager.getProfile();
            this.updateProfileDisplay();
        }
    },

    updateProfileDisplay() {
        if (typeof StorageManager === 'undefined') return;
        
        const profileData = StorageManager.getProfile();
        const stats = StorageManager.getStats();

        // Asosiy profil ma'lumotlari
        const profileName = document.getElementById('profile-name');
        const totalScore = document.getElementById('total-score');
        const gamesPlayed = document.getElementById('games-played');

        if (profileName) profileName.textContent = profileData.name || 'Foydalanuvchi';
        if (totalScore) totalScore.textContent = this.formatNumber(profileData.totalScore || 0);
        if (gamesPlayed) gamesPlayed.textContent = this.formatNumber(profileData.gamesPlayed || 0);

        // Profil rasmi
        const profileImage = document.getElementById('profile-image');
        if (profileImage) {
            if (profileData.avatar) {
                profileImage.src = profileData.avatar;
                profileImage.style.display = 'block';
            } else {
                profileImage.style.display = 'none';
            }
        }

        // Oʻyin statistikasi
        this.updateGameStats();
    },

    updateGameStats() {
        if (typeof StorageManager === 'undefined') return;
        
        const stats = StorageManager.getStats();
        const profile = StorageManager.getProfile();

        // Raqamlar
        const numbersBest = document.getElementById('numbers-best');
        if (numbersBest) numbersBest.textContent = this.formatNumber(profile.bestScores?.numbers || 0);
        
        // Soʻzlar
        const wordsBest = document.getElementById('words-best');
        if (wordsBest) wordsBest.textContent = this.formatNumber(profile.bestScores?.words || 0);
        
        // Yuz va ismlar
        const facesBest = document.getElementById('faces-best');
        if (facesBest) facesBest.textContent = this.formatNumber(profile.bestScores?.faces || 0);
        
        // Rasmlar
        const imagesBest = document.getElementById('images-best');
        if (imagesBest) imagesBest.textContent = this.formatNumber(profile.bestScores?.images || 0);
        
        // Flashcards
        const flashcardsCount = document.getElementById('flashcards-count');
        if (flashcardsCount) {
            const flashcardsProgress = StorageManager.getFlashcardsProgress();
            let masteredFlashcards = 0;

            Object.values(flashcardsProgress).forEach(language => {
                Object.values(language).forEach(topic => {
                    masteredFlashcards += topic.mastered || 0;
                });
            });

            flashcardsCount.textContent = this.formatNumber(masteredFlashcards);
        }
        
        // Umumiy oʻyinlar
        const totalGames = document.getElementById('total-games');
        if (totalGames) totalGames.textContent = this.formatNumber(stats.totalGames || 0);
    },

    setupResultsSection() {
        const backBtn = document.querySelector('#results-section .back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showSection('profile-section');
            });
        }
    },

    loadResultsData() {
        if (typeof StorageManager === 'undefined') return;
        
        const stats = StorageManager.getStats();
        const results = StorageManager.getGameResults();

        // Umumiy statistikani yangilash
        const totalGamesPlayed = document.getElementById('total-games-played');
        const averageScore = document.getElementById('average-score');
        const bestScore = document.getElementById('best-score');

        if (totalGamesPlayed) totalGamesPlayed.textContent = this.formatNumber(stats.totalGames || 0);
        if (averageScore) averageScore.textContent = this.formatNumber(stats.averageScore || 0);
        if (bestScore) bestScore.textContent = this.formatNumber(stats.totalScore || 0);

        // Oʻyinlar tarixini yangilash
        this.updateResultsHistory(results);
    },

    updateResultsHistory(results) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        if (results.length === 0) {
            historyList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Hali hech qanday oʻyin oʻynalmagan</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = '';
        results.slice(0, 20).forEach(result => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const gameName = this.getGameName(result.gameType);
            const scoreColor = this.getScoreColor(result.percentage);

            historyItem.innerHTML = `
                <div class="history-game">
                    <div style="font-weight: bold;">${gameName}</div>
                    <small style="color: var(--text-muted);">
                        ${this.formatDate(result.date)}
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

    getGameName(gameType) {
        const gameNames = {
            'numbers': '🔢 Raqamlar',
            'words': '📝 Soʻzlar', 
            'flashcards': '🃏 Flashcards',
            'faces': '👥 Yuz va Ismlar',
            'images': '🖼️ Rasmlar'
        };
        
        return gameNames[gameType] || gameType;
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
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Bugun";
        if (diffDays === 1) return "Kecha";
        if (diffDays < 7) return `${diffDays} kun oldin`;
        
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        const bgColor = type === 'error' ? '#ef4444' : 
                       type === 'success' ? '#10b981' : '#6366f1';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
            }
        }, 3000);
    },

    destroy() {
        console.log('Dastur toʻxtatildi');
    }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yuklandi, dastur ishga tushmoqda...');
    
    // LocalStorage ni tekshirish (soddalashtirilgan)
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('LocalStorage ishlayapti');
    } catch (error) {
        console.error('LocalStorage ishlamayapti:', error);
        App.showMessage('LocalStorage ishlamayapti. Baʼzi funksiyalar ishlamasligi mumkin.', 'error');
    }

    // Dasturni ishga tushirish
    try {
        App.setupEventListeners();
        App.loadProfileData();
        App.init();
    } catch (error) {
        console.error('Dasturni ishga tushirishda xato:', error);
        App.showMessage('Dastur ishga tushirishda xato: ' + error.message, 'error');
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global xato:', e.error);
});

// Sahifa yuklanganida
window.addEventListener('load', function() {
    console.log('Sahifa toʻliq yuklandi');
});

window.App = App;
