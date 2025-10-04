// Yuzlar O'yini Moduli
class FacesGame {
    constructor() {
        this.currentLevel = 0;
        this.faces = [];
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
        this.faces = this.generateFaces();
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
                    <i class="fas fa-user-friends"></i>
                </div>
                <h3>Yuzlar O'yini Tez Kunda</h3>
                <p>Yuzlarni eslab qolish va ularni tanib olish qobiliyatini sinovdan o'tkazadigan qiziqarli o'yin.</p>
                
                <div class="feature-preview">
                    <div class="feature-item">
                        <i class="fas fa-brain"></i>
                        <span>Yuz xotirasini rivojlantirish</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-users"></i>
                        <span>Turli xil yuzlar bilan mashq</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Progressni kuzatish</span>
                    </div>
                </div>
                
                <button class="control-button primary" onclick="window.gameApp.showGameModes()">
                    <i class="fas fa-arrow-left"></i>
                    O'yinlar Menyusiga Qaytish
                </button>
            </div>
        `;
    }

    generateFaces() {
        // Yuzlar ma'lumotlarini generatsiya qilish
        // Hozircha demo ma'lumotlar
        return [
            { id: 1, name: "Ayol #1", features: "qora soch, ko'k ko'z", emoji: "👩" },
            { id: 2, name: "Erkak #1", features: "jigarrang soch, yashil ko'z", emoji: "👨" },
            { id: 3, name: "Ayol #2", features: "sariq soch, jigarrang ko'z", emoji: "👩‍🦰" },
            { id: 4, name: "Erkak #2", features: "kal soch, ko'k ko'z", emoji: "👨‍🦲" },
            { id: 5, name: "Ayol #3", features: "qora soch, qora ko'z", emoji: "👩‍🦱" },
            { id: 6, name: "Erkak #3", features: "jigarrang soch, qora ko'z", emoji: "👨‍🦳" }
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
const FacesGameInstance = new FacesGame();