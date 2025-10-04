// Foydalanuvchi profili boshqaruvi
class UserProfile {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
    }

    loadUserData() {
        this.userData = Storage.getUserData();
        return this.userData;
    }

    saveUserData() {
        return Storage.updateUserData(this.userData);
    }

    // Foydalanuvchi nomini o'zgartirish
    updateUserName(newName) {
        if (newName && newName.trim().length > 0) {
            this.userData.name = newName.trim();
            this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }

    // Darajani yangilash
    updateLevel() {
        const oldLevel = this.userData.level;
        this.userData.level = Helpers.calculateLevel(this.userData.experience);
        
        if (this.userData.level > oldLevel) {
            this.handleLevelUp(oldLevel, this.userData.level);
            return true;
        }
        return false;
    }

    // Tajriba qo'shish
    addExperience(amount) {
        if (amount > 0) {
            this.userData.experience += amount;
            const leveledUp = this.updateLevel();
            this.saveUserData();
            this.updateUI();
            
            if (leveledUp) {
                Helpers.showMessage(`Tabriklaymiz! ${this.userData.level}-darajaga ko'tarildingiz! 🎉`, 'success');
                Helpers.showConfetti();
            }
            
            return leveledUp;
        }
        return false;
    }

    // O'yin natijasiga ko'ra tajriba qo'shish
    addGameExperience(gameMode, score, time) {
        let exp = 0;
        
        // Ballarga ko'ra tajriba
        exp += Math.floor(score / 10);
        
        // O'yin turiga ko'ra bonus
        const gameBonuses = {
            numbers: 5,
            words: 7,
            flashcards: 10,
            faces: 8,
            images: 6
        };
        
        exp += gameBonuses[gameMode] || 5;
        
        // Vaqtga ko'ra bonus (qisqa vaqtda tugatilsa)
        if (time < 300) { // 5 daqiqadan kam
            exp += Math.floor((300 - time) / 30);
        }
        
        return this.addExperience(exp);
    }

    // Daraja ko'tarilganda
    handleLevelUp(oldLevel, newLevel) {
        // Yangi yutuq ochish
        this.unlockAchievement(`level_${newLevel}`, `${newLevel}-darajaga erishish`);
        
        // Daraja bonuslari
        const levelBonuses = {
            5: { title: "Tajribali O'yinchi", description: "5-darajaga erishish" },
            10: { title: "Professional", description: "10-darajaga erishish" },
            20: { title: "Memory Master", description: "20-darajaga erishish" },
            50: { title: "Legenda", description: "50-darajaga erishish" }
        };
        
        if (levelBonuses[newLevel]) {
            this.unlockAchievement(levelBonuses[newLevel].title.toLowerCase().replace(' ', '_'), levelBonuses[newLevel].description);
        }
    }

    // Yutuq ochish
    unlockAchievement(achievementId, description) {
        if (!this.userData.achievements) {
            this.userData.achievements = [];
        }
        
        const existingAchievement = this.userData.achievements.find(a => a.id === achievementId);
        if (!existingAchievement) {
            const achievement = {
                id: achievementId,
                name: this.getAchievementName(achievementId),
                description: description,
                unlockedAt: new Date().toISOString(),
                icon: this.getAchievementIcon(achievementId)
            };
            
            this.userData.achievements.push(achievement);
            this.saveUserData();
            
            // Yutuq ochilganini bildirish
            this.showAchievementNotification(achievement);
            
            return true;
        }
        return false;
    }

    // Yutuq nomlari
    getAchievementName(achievementId) {
        const names = {
            'level_5': "Tajribali O'yinchi",
            'level_10': "Professional",
            'level_20': "Memory Master", 
            'level_50': "Legenda",
            'first_game': "Birinchi Qadam",
            'perfect_score': "Mukammal Natija",
            'speed_demon': "Tezkor O'yinchi",
            'word_master': "So'z Ustasi",
            'number_genius': "Raqam Geniyasi",
            'polyglot': "Poliglot"
        };
        
        return names[achievementId] || achievementId;
    }

    // Yutuq ikonkasi
    getAchievementIcon(achievementId) {
        const icons = {
            'level_5': "🥉",
            'level_10': "🥈", 
            'level_20': "🥇",
            'level_50': "🏆",
            'first_game': "🎯",
            'perfect_score': "⭐",
            'speed_demon': "⚡",
            'word_master': "📚",
            'number_genius': "🔢",
            'polyglot': "🌍"
        };
        
        return icons[achievementId] || "🎖️";
    }

    // Yutuq bildirishnomasi
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">Yangi Yutuq!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `;
        
        // CSS qo'shish
        if (!document.querySelector('#achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 3.5s forwards;
                    max-width: 350px;
                    border-left: 4px solid var(--accent);
                }
                
                .achievement-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .achievement-icon {
                    font-size: 2rem;
                }
                
                .achievement-info {
                    flex: 1;
                }
                
                .achievement-title {
                    font-size: 0.8rem;
                    opacity: 0.9;
                    margin-bottom: 0.25rem;
                }
                
                .achievement-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                
                .achievement-description {
                    font-size: 0.8rem;
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // 4 soniyadan keyin olib tashlash
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // O'yin statistikasini yangilash
    updateGameStats(gameMode, score, time) {
        const stats = Storage.getStats();
        
        if (!stats[gameMode]) {
            stats[gameMode] = {
                bestScore: 0,
                gamesPlayed: 0,
                totalScore: 0,
                totalTime: 0,
                averageScore: 0,
                lastPlayed: null
            };
        }
        
        stats[gameMode].gamesPlayed++;
        stats[gameMode].totalScore += score;
        stats[gameMode].totalTime += time;
        stats[gameMode].averageScore = Math.round(stats[gameMode].totalScore / stats[gameMode].gamesPlayed);
        stats[gameMode].lastPlayed = new Date().toISOString();
        
        if (score > stats[gameMode].bestScore) {
            stats[gameMode].bestScore = score;
            
            // Eng yuqori ball yutuqi
            if (score >= 1000) {
                this.unlockAchievement('high_scorer', `${gameMode} o'yinida 1000+ ball to'plash`);
            }
        }
        
        Storage.set('user_stats', stats);
        
        // Tajriba qo'shish
        this.addGameExperience(gameMode, score, time);
        
        // Birinchi o'yin yutuqi
        if (stats[gameMode].gamesPlayed === 1) {
            this.unlockAchievement('first_game', `Birinchi ${gameData.games[gameMode].title} o'yini`);
        }
        
        // Mukammal natija yutuqi
        if (score >= 500) {
            this.unlockAchievement('perfect_score', `${gameData.games[gameMode].title} o'yinda 500+ ball`);
        }
        
        // Tez o'yinchi yutuqi
        if (time < 180 && score > 200) { // 3 daqiqadan kam va 200+ ball
            this.unlockAchievement('speed_demon', `Tez va samarali o'ynash`);
        }
        
        return stats;
    }

    // Foydalanuvchi ma'lumotlarini olish
    getUserStats() {
        const stats = Storage.getStats();
        const achievements = this.userData.achievements || [];
        
        return {
            user: this.userData,
            stats: stats,
            achievements: achievements,
            summary: this.getStatsSummary(stats)
        };
    }

    // Statistikalar xulosasi
    getStatsSummary(stats) {
        const totalGames = Object.values(stats).reduce((sum, stat) => sum + (stat.gamesPlayed || 0), 0);
        const totalScore = Object.values(stats).reduce((sum, stat) => sum + (stat.totalScore || 0), 0);
        const totalTime = Object.values(stats).reduce((sum, stat) => sum + (stat.totalTime || 0), 0);
        const bestScore = Math.max(...Object.values(stats).map(stat => stat.bestScore || 0));
        
        return {
            totalGames,
            totalScore,
            totalTime: Helpers.formatTime(totalTime),
            bestScore,
            averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
            favoriteGame: this.getFavoriteGame(stats)
        };
    }

    // Sevimli o'yin
    getFavoriteGame(stats) {
        const games = Object.entries(stats)
            .filter(([_, stat]) => stat.gamesPlayed > 0)
            .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed);
        
        return games.length > 0 ? games[0][0] : null;
    }

    // UI ni yangilash
    updateUI() {
        // Profil modalini yangilash
        if (document.getElementById('profile-modal')?.classList.contains('active')) {
            this.updateProfileModal();
        }
        
        // Header dagi foydalanuvchi ma'lumotlarini yangilash
        this.updateHeaderInfo();
    }

    // Profil modalini yangilash
    updateProfileModal() {
        const userData = this.userData;
        const stats = Storage.getStats();
        const summary = this.getStatsSummary(stats);
        
        // Foydalanuvchi nomi
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
        
        // Statistika raqamlari
        const statElements = document.querySelectorAll('.stat-number');
        if (statElements.length >= 3) {
            statElements[0].textContent = summary.totalGames;
            statElements[1].textContent = (userData.achievements || []).length;
            statElements[2].textContent = Helpers.formatNumber(summary.bestScore);
        }
    }

    // Header ma'lumotlarini yangilash
    updateHeaderInfo() {
        // Kelajakda headerda foydalanuvchi darajasi ko'rsatilishi mumkin
    }

    // Foydalanuvchi ma'lumotlarini qayta o'rnatish
    resetUserData() {
        this.userData = { ...gameData.user };
        this.saveUserData();
        Storage.remove('user_stats');
        Storage.remove('game_results');
        Storage.remove('flashcard_progress');
        return true;
    }

    // Foydalanuvchi progressini olish
    getUserProgress() {
        const stats = Storage.getStats();
        const flashcardProgress = Storage.get('flashcard_progress', {});
        
        const totalWords = Object.values(gameData.languages).reduce((sum, lang) => 
            sum + Object.values(lang.categories).reduce((catSum, category) => 
                catSum + category.words.length, 0
            ), 0
        );
        
        const learnedWords = Object.values(flashcardProgress).reduce((sum, lang) => 
            sum + Object.values(lang).reduce((catSum, category) => 
                catSum + (category.learned || 0), 0
            ), 0
        );
        
        return {
            gamesPlayed: this.getStatsSummary(stats).totalGames,
            wordsLearned: learnedWords,
            totalWords: totalWords,
            learningProgress: totalWords > 0 ? (learnedWords / totalWords) * 100 : 0,
            level: this.userData.level,
            experience: this.userData.experience,
            nextLevelExp: this.getNextLevelExp()
        };
    }

    // Keyingi daraja uchun kerak bo'ladigan tajriba
    getNextLevelExp() {
        const currentLevel = this.userData.level;
        return Math.pow(currentLevel, 2) * 100;
    }
}

// Global instance yaratish
const UserManager = new UserProfile();