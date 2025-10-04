// Memory Master - Asosiy Ilova
class GameApp {
    constructor() {
        this.currentGame = null;
        this.currentMode = null;
        this.score = 0;
        this.steps = 0;
        this.gameTime = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeScreen();
        this.hideLoadingScreen();
        this.updateUserProfile();
    }

    bindEvents() {
        // Welcome screen events
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showGameModes();
        });

        // Game mode cards
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startGameMode(mode);
            });
        });

        // Back buttons
        document.getElementById('back-to-welcome').addEventListener('click', () => {
            this.showWelcomeScreen();
        });

        document.getElementById('game-back-btn').addEventListener('click', () => {
            this.showGameModes();
        });

        // Results buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            if (this.currentMode) {
                this.startGameMode(this.currentMode);
            }
        });

        document.getElementById('back-to-modes-btn').addEventListener('click', () => {
            this.showGameModes();
        });

        // Profile modal
        document.getElementById('profile-btn').addEventListener('click', () => {
            this.showProfileModal();
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideProfileModal();
        });

        // Modal background click
        document.getElementById('profile-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideProfileModal();
            }
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading');
            loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    showWelcomeScreen() {
        this.hideAllSections();
        document.getElementById('welcome-section').classList.add('active');
        this.updateScore(0, 0);
    }

    showGameModes() {
        this.hideAllSections();
        document.getElementById('game-modes').classList.add('active');
        this.updateScore(0, 0);
    }

    startGameMode(mode) {
        this.currentMode = mode;
        this.hideAllSections();
        document.getElementById('game-area').classList.add('active');
        
        // Tanlangan o'yinni boshlash
        switch (mode) {
            case 'numbers':
                this.currentGame = NumbersGameInstance;
                break;
            case 'words':
                this.currentGame = WordsGameInstance;
                break;
            case 'flashcards':
                // Keyinroq to'ldiramiz
                this.showComingSoon();
                return;
            case 'faces':
                this.showComingSoon();
                return;
            case 'images':
                this.showComingSoon();
                return;
        }

        if (this.currentGame) {
            this.currentGame.startGame();
        }
    }

    showComingSoon() {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="coming-soon">
                <div class="coming-soon-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <h3>Tez Kunda</h3>
                <p>Ushbu o'yin hozircha ishlab chiqilmoqda. Iltimos, keyinroq qayta urinib ko'ring.</p>
                <button class="control-button primary" onclick="window.gameApp.showGameModes()">
                    <i class="fas fa-arrow-left"></i>
                    O'yinlar Menyusiga Qaytish
                </button>
            </div>
        `;
    }

    showResults(score, steps, time, isWin = true) {
        this.hideAllSections();
        document.getElementById('results-section').classList.add('active');
        
        // Natijalarni yangilash
        document.getElementById('final-score').textContent = Helpers.formatNumber(score);
        document.getElementById('final-steps').textContent = Helpers.formatNumber(steps);
        document.getElementById('final-time').textContent = Helpers.formatTime(time);
        
        // Xabarni yangilash
        const messageText = document.getElementById('result-message-text');
        if (isWin) {
            messageText.textContent = this.getWinMessage(score);
            messageText.style.color = 'var(--success)';
            Helpers.showConfetti();
        } else {
            messageText.textContent = this.getLoseMessage(score);
            messageText.style.color = 'var(--danger)';
        }
        
        // Profil ma'lumotlarini yangilash
        this.updateUserProfile();
    }

    getWinMessage(score) {
        const messages = [
            "Ajoyib natija! Siz haqiqiy Memory Mastersiz! 🏆",
            "Fantastik! Xotirangiz juda kuchli! 💪",
            "Tabriklaymiz! A'lo darajada o'ynadingiz! 🌟",
            "Mukammal! Barcha darajalarni muvaffaqqiyatli yakunladingiz! 🎯"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    getLoseMessage(score) {
        const messages = [
            "Yaxshi urinish! Keyingi safar yaxshiroq natija ko'rsatasiz! 💫",
            "Juda yaxshi! Mashq qilishda davom eting! 📚",
            "Yaxshi natija! Keyingi o'yinda yanada yaxshilashingiz mumkin! 🚀"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    updateScore(score, steps) {
        this.score = score;
        this.steps = steps;
        
        document.getElementById('current-score').textContent = Helpers.formatNumber(score);
        document.getElementById('current-step').textContent = Helpers.formatNumber(steps);
    }

    showProfileModal() {
        document.getElementById('profile-modal').classList.add('active');
    }

    hideProfileModal() {
        document.getElementById('profile-modal').classList.remove('active');
    }

    updateUserProfile() {
        const userData = Storage.getUserData();
        const stats = Storage.getStats();
        
        // Foydalanuvchi ma'lumotlari
        document.getElementById('user-name').textContent = userData.name;
        
        // Statistika
        const statElements = document.querySelectorAll('.stat-number');
        if (statElements.length >= 3) {
            statElements[0].textContent = userData.gamesPlayed;
            statElements[1].textContent = userData.achievements?.length || 0;
            
            // Eng yuqori ball
            const bestScore = Math.max(
                stats.numbers?.bestScore || 0,
                stats.words?.bestScore || 0,
                stats.flashcards?.bestScore || 0,
                stats.faces?.bestScore || 0,
                stats.images?.bestScore || 0
            );
            statElements[2].textContent = Helpers.formatNumber(bestScore);
        }
    }

    hideAllSections() {
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Modalni yopish
        this.hideProfileModal();
    }
}

// Ilovani ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});

// Global funksiyalar
window.showGameModes = function() {
    if (window.gameApp) {
        window.gameApp.showGameModes();
    }
};
window.FlashcardsGameInstance = FlashcardsGameInstance;
window.FacesGameInstance = FacesGameInstance;
window.ImagesGameInstance = ImagesGameInstance;

// Global funksiyalar
window.startFlashcardsGame = function() {
    if (window.gameApp) {
        window.gameApp.startGameMode('flashcards');
    }
};

window.startFacesGame = function() {
    if (window.gameApp) {
        window.gameApp.startGameMode('faces');
    }
};

window.startImagesGame = function() {
    if (window.gameApp) {
        window.gameApp.startGameMode('images');
    }
};
window.UserManager = UserManager;
window.StatsManager = StatsManager;

console.log('🎮 Memory Master app.js loaded successfully');

// Loading screen ni avtomatik yopish
setTimeout(() => {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen && !window.gameApp) {
        console.log('⚠️ GameApp not initialized - auto-hiding loading screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}, 3000);

// Global function for testing
window.testGameApp = function() {
    console.log('🧪 Testing GameApp...');
    
    if (typeof GameApp !== 'undefined') {
        console.log('✅ GameApp class found');
        try {
            window.gameApp = new GameApp();
            console.log('✅ GameApp initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ GameApp initialization failed:', error);
            return false;
        }
    } else {
        console.error('❌ GameApp class not found');
        return false;
    }
};

// Auto-test on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 DOM Content Loaded');
    
    // 2 soniyadan so'ng test qilish
    setTimeout(() => {
        if (!window.gameApp) {
            console.log('🔄 Auto-testing GameApp...');
            window.testGameApp();
        }
    }, 2000);
});

