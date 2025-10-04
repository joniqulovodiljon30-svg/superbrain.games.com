// LocalStorage boshqaruvi
class StorageManager {
    constructor() {
        this.prefix = 'memory_master_';
    }

    // Ma'lumot saqlash
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Saqlashda xatolik:', error);
            return false;
        }
    }

    // Ma'lumot o'qish
    get(key, defaultValue = null) {
        try {
            const storageKey = this.prefix + key;
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('O\'qishda xatolik:', error);
            return defaultValue;
        }
    }

    // Ma'lumot o'chirish
    remove(key) {
        try {
            const storageKey = this.prefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('O\'chirishda xatolik:', error);
            return false;
        }
    }

    // O'yin natijalarini saqlash
    saveGameResult(gameMode, score, steps, time, level = 1) {
        const results = this.get('game_results', []);
        const result = {
            gameMode,
            score,
            steps,
            time,
            level,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('uz-UZ')
        };
        
        results.unshift(result); // Yangi natijani boshiga qo'shish
        results.splice(50); // Faqat oxirgi 50 ta natijani saqlash
        
        this.set('game_results', results);
        
        // Statistika yangilash
        this.updateStats(gameMode, score);
        
        return result;
    }

    // Statistika yangilash
    updateStats(gameMode, score) {
        const stats = this.get('user_stats', gameData.user.stats);
        
        if (!stats[gameMode]) {
            stats[gameMode] = { bestScore: 0, gamesPlayed: 0 };
        }
        
        stats[gameMode].gamesPlayed++;
        
        if (score > stats[gameMode].bestScore) {
            stats[gameMode].bestScore = score;
        }
        
        this.set('user_stats', stats);
        
        // Umumiy statistika
        const totalGames = Object.values(stats).reduce((sum, stat) => sum + stat.gamesPlayed, 0);
        const userData = this.get('user_data', gameData.user);
        userData.gamesPlayed = totalGames;
        this.set('user_data', userData);
        
        return stats;
    }

    // O'yin natijalarini olish
    getGameResults(limit = 10) {
        const results = this.get('game_results', []);
        return results.slice(0, limit);
    }

    // Statistika olish
    getStats() {
        return this.get('user_stats', gameData.user.stats);
    }

    // Foydalanuvchi ma'lumotlarini olish
    getUserData() {
        return this.get('user_data', gameData.user);
    }

    // Foydalanuvchi ma'lumotlarini yangilash
    updateUserData(userData) {
        return this.set('user_data', { ...gameData.user, ...userData });
    }

    // Flashcard progress saqlash
    saveFlashcardProgress(language, category, progress) {
        const flashcardProgress = this.get('flashcard_progress', {});
        
        if (!flashcardProgress[language]) {
            flashcardProgress[language] = {};
        }
        
        flashcardProgress[language][category] = {
            ...progress,
            lastPracticed: new Date().toISOString()
        };
        
        this.set('flashcard_progress', flashcardProgress);
        return progress;
    }

    // Flashcard progress olish
    getFlashcardProgress(language, category) {
        const flashcardProgress = this.get('flashcard_progress', {});
        return flashcardProgress[language]?.[category] || {
            learned: 0,
            total: 0,
            correctAnswers: 0,
            totalAnswers: 0
        };
    }

    // Barcha ma'lumotlarni tozalash
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
        return true;
    }
}

// Global storage instance yaratish
const Storage = new StorageManager();