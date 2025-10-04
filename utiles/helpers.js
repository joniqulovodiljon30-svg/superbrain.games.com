// Yordamchi funksiyalar
const Helpers = {
    // Raqamni formatlash
    formatNumber(num) {
        return new Intl.NumberFormat('uz-UZ').format(num);
    },

    // Sana formatlash
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return "Bugun";
        } else if (diffDays === 1) {
            return "Kecha";
        } else if (diffDays < 7) {
            return `${diffDays} kun oldin`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${hafta} hafta oldin`;
        } else {
            return date.toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    },

    // Vaqt formatlash (soniyalarni daqiqa:soniya ko'rinishida)
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Ballarni foizga aylantirish
    calculatePercentage(score, total) {
        if (total === 0) return 0;
        return Math.round((score / total) * 100);
    },

    // Foizga qarab rang berish
    getScoreColor(percentage) {
        if (percentage >= 90) return '#10b981'; // Yashil - a'lo
        if (percentage >= 70) return '#f59e0b'; // Sariq - yaxshi
        if (percentage >= 50) return '#f97316'; // Apelsin - o'rtacha
        return '#ef4444'; // Qizil - yomon
    },

    // Tasodifiy rang generatsiya qilish
    getRandomColor() {
        const colors = [
            '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
            '#06b6d4', '#3b82f6', '#f97316', '#84cc16', '#d946ef'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Matnni truncate qilish
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // So'zlar ro'yxatini aralashtirish
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Takrorlanmas ID generatsiya qilish
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Rasm faylini base64 ga aylantirish
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    // Tepadagi elementga smooth scroll qilish
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Elementni ko'rinish maydoniga scroll qilish
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Klaviatura tugmasi bosilishini tekshirish
    isEnterKey(event) {
        return event.key === 'Enter' || event.keyCode === 13;
    },

    // Escape tugmasi bosilishini tekshirish
    isEscapeKey(event) {
        return event.key === 'Escape' || event.keyCode === 27;
    },

    // Matnni clipboard ga nusxalash
    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(resolve).catch(reject);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (err) {
                    reject(err);
                }
                document.body.removeChild(textArea);
            }
        });
    },

    // LocalStorage dan ma'lumot o'qish (xavfsiz)
    safeGetFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Storage dan o'qishda xato (${key}):`, error);
            return defaultValue;
        }
    },

    // LocalStorage ga ma'lumot saqlash (xavfsiz)
    safeSetToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage ga saqlashda xato (${key}):`, error);
            return false;
        }
    },

    // Vibratsiya (agar qo'llab-quvvatlansa)
    vibrate(pattern = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    },

    // O'yin uchun timer yaratish
    createTimer(duration, onTick, onComplete) {
        let timeLeft = duration;
        const timer = setInterval(() => {
            timeLeft--;
            if (onTick) onTick(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 1000);

        return {
            stop: () => clearInterval(timer),
            getTimeLeft: () => timeLeft
        };
    },

    // Sound effect (agar kerak bo'lsa)
    playSound(type = 'click') {
        // Bu yerda audio fayllar qo'shishingiz mumkin
        console.log(`Playing sound: ${type}`);
    },

    // Konfet animatsiyasi (muvaffaqiyatli natija uchun)
    showConfetti() {
        // Soddalashtirilgan konfet effekti
        const confettiCount = 50;
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(container);

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                border-radius: 2px;
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            container.appendChild(confetti);
        }

        setTimeout(() => {
            document.body.removeChild(container);
        }, 3000);
    },

    // Xato messageni ko'rsatish
    showError(message) {
        // Soddalashtirilgan xato ko'rsatish
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                document.body.removeChild(errorDiv);
            }
        }, 3000);
    },

    // Muvaffaqiyat messageni ko'rsatish
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        successDiv.textContent = message;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                document.body.removeChild(successDiv);
            }
        }, 3000);
    },

    // Loading spinner ko'rsatish
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'global-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingDiv.innerHTML = `
            <div style="
                background: #1e293b;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                color: white;
            ">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #334155;
                    border-top: 4px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p>Yuklanmoqda...</p>
            </div>
        `;

        document.body.appendChild(loadingDiv);
    },

    // Loading spinnerni yashirish
    hideLoading() {
        const loadingDiv = document.getElementById('global-loading');
        if (loadingDiv && loadingDiv.parentNode) {
            document.body.removeChild(loadingDiv);
        }
    },

    // Internet aloqasini tekshirish
    checkOnlineStatus() {
        return navigator.onLine;
    },

    // Ofline holatda ishlash uchun
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.showSuccess('Internet aloqasi tiklandi!');
        });

        window.addEventListener('offline', () => {
            this.showError('Internet aloqasi uzildi!');
        });
    },

    // Performance measurement
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} executed in ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Utility funksiyalarni global qilish
window.Helpers = Helpers;