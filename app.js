// app.js - Yangilangan Raqamlar O'yini
class MemoryMaster {
    // ... oldingi kodlar o'zgarmaydi ...

    showNumbersGame(container) {
        console.log('🔢 Showing numbers game');
        
        // O'yin darajasini aniqlash
        const level = this.getCurrentLevel();
        const sequenceLength = level.sequenceLength;
        const displayTime = level.displayTime;
        
        // Tasodifiy raqamlar ketma-ketligini yaratish
        const sequence = this.generateRandomSequence(sequenceLength);
        
        container.innerHTML = `
            <div class="numbers-game">
                <div class="game-level-info">
                    <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔢 Raqamlar O'yini</h2>
                    <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                        Daraja: ${level.number} - ${sequenceLength} ta raqam
                    </p>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">
                        ${sequenceLength} ta raqamni ${displayTime/1000} soniya davomida eslab qoling
                    </p>
                </div>
                
                <div class="numbers-display" id="numbers-display">
                    ${sequence.map(num => `
                        <div class="number-display-card showing" data-number="${num}">
                            ${num}
                        </div>
                    `).join('')}
                </div>
                
                <div class="game-timer" style="margin: 1.5rem 0;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);" id="countdown-timer">
                            ${displayTime/1000}
                        </div>
                        <span style="color: var(--text-secondary);">soniya qoldi</span>
                    </div>
                </div>
                
                <button class="action-button primary" onclick="memoryMaster.startNumbersInput()" id="ready-btn" style="display: none; margin: 0 auto;">
                    <i class="fas fa-play"></i>
                    Tayyorman - Raqamlarni kiriting
                </button>
            </div>
        `;

        // Vaqt hisoblagich
        let timeLeft = displayTime / 1000;
        const countdownElement = document.getElementById('countdown-timer');
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (countdownElement) {
                countdownElement.textContent = timeLeft;
                
                // Rang o'zgarishi
                if (timeLeft <= 3) {
                    countdownElement.style.color = 'var(--danger)';
                } else if (timeLeft <= 10) {
                    countdownElement.style.color = 'var(--warning)';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                this.hideNumbersAndShowInput();
            }
        }, 1000);

        // Ketma-ketlikni saqlash
        this.currentSequence = sequence;
        this.currentLevel = level;
    }

    getCurrentLevel() {
        const levels = [
            { number: 1, sequenceLength: 3, displayTime: 3000, points: 100 },
            { number: 2, sequenceLength: 4, displayTime: 4000, points: 150 },
            { number: 3, sequenceLength: 5, displayTime: 5000, points: 200 },
            { number: 4, sequenceLength: 6, displayTime: 6000, points: 250 },
            { number: 5, sequenceLength: 7, displayTime: 7000, points: 300 }
        ];
        
        // Hozirgi darajani aniqlash (keyinchalik progress asosida)
        return levels[0]; // Boshlang'ich daraja
    }

    generateRandomSequence(length) {
        const sequence = [];
        const usedNumbers = new Set();
        
        while (sequence.length < length) {
            const randomNum = Math.floor(Math.random() * 9) + 1;
            if (!usedNumbers.has(randomNum)) {
                sequence.push(randomNum);
                usedNumbers.add(randomNum);
            }
        }
        
        return sequence;
    }

    hideNumbersAndShowInput() {
        const numbers = document.querySelectorAll('.number-display-card');
        numbers.forEach(number => {
            number.classList.remove('showing');
            number.classList.add('hidden');
            number.innerHTML = '?';
        });

        document.getElementById('countdown-timer').style.display = 'none';
        document.getElementById('ready-btn').style.display = 'flex';
        
        // O'yin vaqtini boshlash
        this.startGameTimer();
    }

    startGameTimer() {
        this.gameStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.updateGameInfo(this.currentScore, this.currentSteps, 
                              `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
    }

    // ... qolgan metodlar o'zgarmaydi ...
}
