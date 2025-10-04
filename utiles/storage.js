// utils/storage.js - Tuzatilgan versiya
const StorageManager = {
    // Kalitlar
    KEYS: {
        USER_PROFILE: 'memory_master_profile',
        GAME_RESULTS: 'memory_master_results',
        GAME_STATS: 'memory_master_stats',
        FLASHCARDS_PROGRESS: 'memory_master_flashcards',
        APP_SETTINGS: 'memory_master_settings'
    },

    // Profil ma'lumotlarini saqlash
    saveProfile(profileData) {
        try {
            const profile = {
                ...profileData,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error('Profil saqlashda xato:', error);
            return false;
        }
    },

    // Profil ma'lumotlarini o'qish
    getProfile() {
        try {
            const profile = localStorage.getItem(this.KEYS.USER_PROFILE);
            if (!profile) {
                // Default profil yaratish
                const defaultProfile = {
                    name: 'Foydalanuvchi',
                    avatar: '',
                    totalScore: 0,
                    gamesPlayed: 0,
                    joinDate: new Date().toISOString(),
                    bestScores: {
                        numbers: 0,
                        words: 0,
                        faces: 0,
                        images: 0
                    }
                };
                this.saveProfile(defaultProfile);
                return defaultProfile;
            }
            return JSON.parse(profile);
        } catch (error) {
            console.error('Profil o\'qishda xato:', error);
            return this.getDefaultProfile();
        }
    },

    // Default profil
    getDefaultProfile() {
        return {
            name: 'Foydalanuvchi',
            avatar: '',
            totalScore: 0,
            gamesPlayed: 0,
            joinDate: new Date().toISOString(),
            bestScores: {
                numbers: 0,
                words: 0,
                faces: 0,
                images: 0
            }
        };
    },

    // Profil rasmini yangilash
    updateAvatar(avatarData) {
        try {
            const profile = this.getProfile();
            profile.avatar = avatarData;
            return this.saveProfile(profile);
        } catch (error) {
            console.error('Rasm yangilashda xato:', error);
            return false;
        }
    },

    // O'yin natijasini saqlash
    saveGameResult(gameData) {
        try {
            const results = this.getGameResults();
            const result = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                gameType: gameData.gameType,
                score: gameData.score,
                total: gameData.total,
                percentage: gameData.percentage,
                date: new Date().toISOString(),
                details: gameData.details || {},
                settings: gameData.settings || {}
            };

            results.unshift(result);
            if (results.length > 100) results.splice(100);

            localStorage.setItem(this.KEYS.GAME_RESULTS, JSON.stringify(results));
            this.updateStats(gameData);
            return true;
        } catch (error) {
            console.error('Natija saqlashda xato:', error);
            return false;
        }
    },

    // O'yin natijalarini o'qish
    getGameResults() {
        try {
            const results = localStorage.getItem(this.KEYS.GAME_RESULTS);
            return results ? JSON.parse(results) : [];
        } catch (error) {
            console.error('Natijalarni o\'qishda xato:', error);
            return [];
        }
    },

    // Statistikani yangilash
    updateStats(gameData) {
        try {
            const stats = this.getStats();
            const profile = this.getProfile();

            stats.totalGames = (stats.totalGames || 0) + 1;
            stats.totalScore = (stats.totalScore || 0) + gameData.score;
            stats.averageScore = Math.round(stats.totalScore / stats.totalGames);

            if (!stats.games) stats.games = {};
            if (!stats.games[gameData.gameType]) {
                stats.games[gameData.gameType] = { played: 0, totalScore: 0, bestScore: 0 };
            }

            const gameStats = stats.games[gameData.gameType];
            gameStats.played++;
            gameStats.totalScore += gameData.score;
            if (gameData.score > gameStats.bestScore) {
                gameStats.bestScore = gameData.score;
            }

            profile.gamesPlayed = stats.totalGames;
            profile.totalScore = stats.totalScore;
            if (gameData.score > profile.bestScores[gameData.gameType]) {
                profile.bestScores[gameData.gameType] = gameData.score;
            }

            localStorage.setItem(this.KEYS.GAME_STATS, JSON.stringify(stats));
            this.saveProfile(profile);
            return true;
        } catch (error) {
            console.error('Statistika yangilashda xato:', error);
            return false;
        }
    },

    // Statistikani o'qish
    getStats() {
        try {
            const stats = localStorage.getItem(this.KEYS.GAME_STATS);
            return stats ? JSON.parse(stats) : {
                totalGames: 0,
                totalScore: 0,
                averageScore: 0,
                games: {}
            };
        } catch (error) {
            console.error('Statistika o\'qishda xato:', error);
            return {
                totalGames: 0,
                totalScore: 0,
                averageScore: 0,
                games: {}
            };
        }
    },

    // Flashcards progressini saqlash
    saveFlashcardsProgress(language, topic, progress) {
        try {
            const allProgress = this.getFlashcardsProgress();
            if (!allProgress[language]) allProgress[language] = {};
            
            allProgress[language][topic] = {
                ...progress,
                lastPracticed: new Date().toISOString()
            };

            localStorage.setItem(this.KEYS.FLASHCARDS_PROGRESS, JSON.stringify(allProgress));
            return true;
        } catch (error) {
            console.error('Flashcards progress saqlashda xato:', error);
            return false;
        }
    },

    // Flashcards progressini o'qish
    getFlashcardsProgress() {
        try {
            const progress = localStorage.getItem(this.KEYS.FLASHCARDS_PROGRESS);
            return progress ? JSON.parse(progress) : {};
        } catch (error) {
            console.error('Flashcards progress o\'qishda xato:', error);
            return {};
        }
    },

    // Ma'lum bir til va mavzu progressini o'qish
    getTopicProgress(language, topic) {
        const progress = this.getFlashcardsProgress();
        return progress[language]?.[topic] || {
            practiced: 0,
            correct: 0,
            mastered: 0,
            lastPracticed: null
        };
    }
};

// GLOBAL QILISH MUHIM!
window.StorageManager = StorageManager;
