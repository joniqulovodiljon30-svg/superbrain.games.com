// Yordamchi funksiyalar
class Helpers {
    // Tasodifiy son generatsiya qilish
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Massivni aralashtirish (Fisher-Yates algorithm)
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Vaqtni formatlash (mm:ss)
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Sonni formatlash (1,000)
    static formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Animatsiya
    static animateElement(element, animationClass, duration = 500) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }

    // Progress bar yangilash
    static updateProgressBar(progressBar, percentage) {
        if (progressBar) {
            progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
    }

    // Matnni kesish
    static truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // O'yin darajasini hisoblash
    static calculateLevel(experience) {
        return Math.floor(Math.sqrt(experience / 100)) + 1;
    }

    // Ballarni hisoblash
    static calculateScore(basePoints, multiplier = 1, bonus = 0) {
        return Math.floor(basePoints * multiplier) + bonus;
    }

    // Tugma holatini o'zgartirish
    static setButtonState(button, enabled, text = null) {
        button.disabled = !enabled;
        if (text !== null) {
            button.innerHTML = text;
        }
        
        if (enabled) {
            button.classList.remove('disabled');
        } else {
            button.classList.add('disabled');
        }
    }

    // Xabarni ko'rsatish
    static showMessage(message, type = 'info', duration = 3000) {
        // Message container yaratish
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(messageContainer);
        }

        // Message element yaratish
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // CSS qo'shish
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                .message {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                    animation: slideInRight 0.3s ease;
                    border-left: 4px solid var(--primary);
                }
                
                .message-success { border-left-color: var(--success); }
                .message-error { border-left-color: var(--danger); }
                .message-warning { border-left-color: var(--accent); }
                
                .message-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        messageContainer.appendChild(messageEl);

        // Avtomatik olib tashlash
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, duration);

        // Animatsiya CSS qo'shish
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Message iconlari
    static getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Sound effects (keyinroq to'ldiriladi)
    static playSound(soundType) {
        // Bu funksiyani keyinroq to'ldiramiz
        console.log('Playing sound:', soundType);
    }

    // Confetti animatsiyasi
    static showConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.innerHTML = '🎉';
            confetti.style.cssText = `
                position: absolute;
                font-size: 20px;
                animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;

            // Animatsiya CSS qo'shish
            if (!document.querySelector('#confetti-animation')) {
                const style = document.createElement('style');
                style.id = 'confetti-animation';
                style.textContent = `
                    @keyframes confetti-fall {
                        0% {
                            transform: translateY(-100px) rotate(0deg);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }
}