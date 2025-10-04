// Rasmlar O'yini Moduli
class ImagesGame {
    constructor() {
        this.currentLevel = 0;
        this.images = [];
        this.currentSequence = [];
        this.userSequence = [];
        this.isMemorizing = false;
        this.score = 0;
        this.steps = 0;
        this.startTime = null;
        this.timerInterval = null;
    }

    init() {
        this.currentLevel = 0;
        this.images = this.generateImages();
        this.currentSequence = [];
        this.userSequence = [];
        this.isMemorizing = false;
        this.score = 0;
        this.steps = 0;
        this.startTime = null;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startGame() {
        this.init();
        this.showComingSoon();
    }

    showComingSoon() {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="coming-soon">
                <div class="coming-soon-icon">
                    <i class="fas fa-images"></i>
                </div>
                <h3>Rasmlar O'yini Tez Kunda</h3>
                <p>Rasmlar ketma-ketligini eslab qolish va ularni takrorlash qobiliyatini sinovdan o'tkazadigan vizual o'yin.</p>
                
                <div class="feature-preview">
                    <div class="feature-item">
                        <i class="fas fa-palette"></i>
                        <span>Ranglar va shakllar bilan ishlash</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-memory"></i>
                        <span>Vizual xotirani rivojlantirish</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-shapes"></i>
                        <span>Turli xil tasvirlar</span>
                    </div>
                </div>
                
                <button class="control-button primary" onclick="window.gameApp.showGameModes()">
                    <i class="fas fa-arrow-left"></i>
                    O'yinlar Menyusiga Qaytish
                </button>
            </div>
        `;
    }

    generateImages() {
        // Rasmlar ma'lumotlarini generatsiya qilish
        // Hozircha demo ma'lumotlar
        return [
            { id: 1, name: "Qizil Doira", emoji: "🔴", color: "#ef4444" },
            { id: 2, name: "Yashil Kvadrat", emoji: "🟢", color: "#22c55e" },
            { id: 3, name: "Ko'k Uchburchak", emoji: "🔵", color: "#3b82f6" },
            { id: 4, name: "Sariq Yulduz", emoji: "⭐", color: "#eab308" },
            { id: 5, name: "Binafsha Heart", emoji: "💜", color: "#a855f7" },
            { id: 6, name: "To'q Sariq Rom", emoji: "◇", color: "#f59e0b" }
        ];
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('game-timer').textContent = Helpers.formatTime(elapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Global instance yaratish
const ImagesGameInstance = new ImagesGame();