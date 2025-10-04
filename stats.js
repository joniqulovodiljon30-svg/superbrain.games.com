// Statistikalar va hisobotlar boshqaruvi
class StatisticsManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Chart.js kutubxonasini yuklash (agar kerak bo'lsa)
        this.loadChartsLibrary();
    }

    // Chart.js kutubxonasini yuklash
    loadChartsLibrary() {
        // Agar Chart.js kerak bo'lsa, dinamik yuklash
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => console.log('Chart.js loaded');
            document.head.appendChild(script);
        }
    }

    // Umumiy statistikani olish
    getGeneralStats() {
        const userData = Storage.getUserData();
        const gameStats = Storage.getStats();
        const gameResults = Storage.getGameResults(100); // Oxirgi 100 ta natija
        
        return {
            user: userData,
            gameStats: gameStats,
            gameResults: gameResults,
            summary: this.calculateSummary(gameStats, gameResults)
        };
    }

    // Statistikalar xulosasi
    calculateSummary(stats, results) {
        const totalGames = Object.values(stats).reduce((sum, stat) => sum + (stat.gamesPlayed || 0), 0);
        const totalScore = Object.values(stats).reduce((sum, stat) => sum + (stat.totalScore || 0), 0);
        const totalTime = Object.values(stats).reduce((sum, stat) => sum + (stat.totalTime || 0), 0);
        
        // O'rtacha ball
        const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
        
        // Kunlik o'rtacha o'yinlar
        const firstGame = results.length > 0 ? new Date(results[results.length - 1].timestamp) : new Date();
        const today = new Date();
        const daysDiff = Math.max(1, Math.ceil((today - firstGame) / (1000 * 60 * 60 * 24)));
        const dailyAverage = Math.round(totalGames / daysDiff);
        
        // Eng yaxshi o'yin
        const bestGame = Object.entries(stats).reduce((best, [game, stat]) => {
            return (!best || stat.bestScore > best.score) ? { game, score: stat.bestScore } : best;
        }, null);
        
        // Faol kunlar
        const activeDays = this.calculateActiveDays(results);
        
        return {
            totalGames,
            totalScore,
            totalTime: Helpers.formatTime(totalTime),
            averageScore,
            dailyAverage,
            bestGame: bestGame ? {
                name: gameData.games[bestGame.game]?.title || bestGame.game,
                score: bestGame.score
            } : null,
            activeDays,
            successRate: this.calculateSuccessRate(results),
            currentStreak: this.calculateCurrentStreak(results)
        };
    }

    // Faol kunlarni hisoblash
    calculateActiveDays(results) {
        const days = new Set();
        results.forEach(result => {
            const date = new Date(result.timestamp).toDateString();
            days.add(date);
        });
        return days.size;
    }

    // Muvaffaqqiyat foizini hisoblash
    calculateSuccessRate(results) {
        if (results.length === 0) return 0;
        
        const successfulGames = results.filter(result => {
            // O'yin turiga qarab muvaffaqqiyatni aniqlash
            const game = gameData.games[result.gameMode];
            if (!game) return false;
            
            // Flashcard lar uchun accuracy
            if (result.gameMode === 'flashcards') {
                return result.score >= 500; // 50% dan yuqori accuracy
            }
            
            // Boshqa o'yinlar uchun ball
            return result.score >= 200;
        });
        
        return Math.round((successfulGames.length / results.length) * 100);
    }

    // Ketma-ketlikni hisoblash
    calculateCurrentStreak(results) {
        if (results.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        const sortedResults = [...results].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        for (let i = 0; i < sortedResults.length; i++) {
            const resultDate = new Date(sortedResults[i].timestamp);
            const diffTime = today - resultDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === i) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // O'yinlar bo'yicha statistikalar
    getGameStats(gameMode) {
        const stats = Storage.getStats();
        const gameResults = Storage.getGameResults().filter(result => result.gameMode === gameMode);
        
        if (!stats[gameMode]) {
            return null;
        }
        
        const gameStat = stats[gameMode];
        const recentResults = gameResults.slice(0, 10); // Oxirgi 10 ta natija
        
        return {
            overview: gameStat,
            recentResults: recentResults,
            progress: this.calculateGameProgress(gameStat, recentResults),
            comparisons: this.compareWithAverage(gameStat)
        };
    }

    // O'yin progressini hisoblash
    calculateGameProgress(gameStat, recentResults) {
        if (recentResults.length < 2) {
            return { trend: 'stable', improvement: 0 };
        }
        
        const firstScores = recentResults.slice(0, 5).map(r => r.score);
        const lastScores = recentResults.slice(-5).map(r => r.score);
        
        const firstAvg = firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
        const lastAvg = lastScores.reduce((a, b) => a + b, 0) / lastScores.length;
        
        const improvement = ((lastAvg - firstAvg) / firstAvg) * 100;
        
        return {
            trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
            improvement: Math.round(improvement),
            firstAverage: Math.round(firstAvg),
            lastAverage: Math.round(lastAvg)
        };
    }

    // O'rtacha ko'rsatkichlar bilan solishtirish
    compareWithAverage(gameStat) {
        const allStats = Storage.getStats();
        const allGames = Object.values(allStats).filter(stat => stat.gamesPlayed > 0);
        
        if (allGames.length === 0) return {};
        
        const totalAverageScore = allGames.reduce((sum, stat) => sum + stat.averageScore, 0) / allGames.length;
        const totalGamesPlayed = allGames.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
        
        return {
            scoreComparison: gameStat.averageScore - totalAverageScore,
            popularity: (gameStat.gamesPlayed / totalGamesPlayed) * 100,
            performance: gameStat.averageScore > totalAverageScore ? 'above' : 'below'
        };
    }

    // Flashcard statistikasi
    getFlashcardStats() {
        const progress = Storage.get('flashcard_progress', {});
        const languages = Object.keys(gameData.languages);
        
        const stats = {
            totalLanguages: languages.length,
            totalCategories: 0,
            totalWords: 0,
            learnedWords: 0,
            languages: []
        };
        
        languages.forEach(langKey => {
            const lang = gameData.languages[langKey];
            const langProgress = progress[langKey] || {};
            const categories = Object.keys(lang.categories);
            
            let langLearned = 0;
            let langTotal = 0;
            
            categories.forEach(catKey => {
                const category = lang.categories[catKey];
                const catProgress = langProgress[catKey] || { learned: 0 };
                
                langTotal += category.words.length;
                langLearned += catProgress.learned || 0;
            });
            
            stats.totalCategories += categories.length;
            stats.totalWords += langTotal;
            stats.learnedWords += langLearned;
            
            stats.languages.push({
                name: lang.name,
                code: langKey,
                flag: lang.flag,
                categories: categories.length,
                learned: langLearned,
                total: langTotal,
                progress: langTotal > 0 ? (langLearned / langTotal) * 100 : 0,
                accuracy: this.calculateLanguageAccuracy(langProgress)
            });
        });
        
        stats.overallProgress = stats.totalWords > 0 ? (stats.learnedWords / stats.totalWords) * 100 : 0;
        stats.languages.sort((a, b) => b.progress - a.progress);
        
        return stats;
    }

    // Til bo'yicha aniqlikni hisoblash
    calculateLanguageAccuracy(langProgress) {
        const categories = Object.values(langProgress);
        if (categories.length === 0) return 0;
        
        const totalAnswers = categories.reduce((sum, cat) => sum + (cat.totalAnswers || 0), 0);
        const correctAnswers = categories.reduce((sum, cat) => sum + (cat.correctAnswers || 0), 0);
        
        return totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
    }

    // Kunlik statistikalar
    getDailyStats(days = 7) {
        const results = Storage.getGameResults(1000); // Ko'proq natijalar
        const dailyStats = {};
        
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyStats[dateKey] = {
                date: date.toLocaleDateString('uz-UZ'),
                games: 0,
                score: 0,
                time: 0,
                gameTypes: new Set()
            };
        }
        
        results.forEach(result => {
            const resultDate = new Date(result.timestamp).toISOString().split('T')[0];
            if (dailyStats[resultDate]) {
                dailyStats[resultDate].games++;
                dailyStats[resultDate].score += result.score;
                dailyStats[resultDate].time += result.time;
                dailyStats[resultDate].gameTypes.add(result.gameMode);
            }
        });
        
        return Object.values(dailyStats).map(day => ({
            ...day,
            gameTypes: day.gameTypes.size,
            averageScore: day.games > 0 ? Math.round(day.score / day.games) : 0
        }));
    }

    // Hisobot yaratish
    generateReport(type = 'weekly') {
        const stats = this.getGeneralStats();
        const flashcardStats = this.getFlashcardStats();
        const dailyStats = this.getDailyStats(type === 'weekly' ? 7 : 30);
        
        return {
            period: type,
            generatedAt: new Date().toISOString(),
            summary: stats.summary,
            games: {
                total: stats.summary.totalGames,
                byType: this.getGamesByType(stats.gameStats),
                recentActivity: dailyStats
            },
            learning: {
                flashcardProgress: flashcardStats.overallProgress,
                wordsLearned: flashcardStats.learnedWords,
                languages: flashcardStats.languages.slice(0, 3) // Top 3 tillar
            },
            achievements: {
                total: (stats.user.achievements || []).length,
                recent: this.getRecentAchievements(stats.user.achievements || [])
            },
            recommendations: this.generateRecommendations(stats, flashcardStats)
        };
    }

    // O'yinlar turlari bo'yicha taqsimot
    getGamesByType(gameStats) {
        return Object.entries(gameStats)
            .filter(([_, stat]) => stat.gamesPlayed > 0)
            .map(([gameMode, stat]) => ({
                game: gameData.games[gameMode]?.title || gameMode,
                gamesPlayed: stat.gamesPlayed,
                bestScore: stat.bestScore,
                averageScore: stat.averageScore
            }))
            .sort((a, b) => b.gamesPlayed - a.gamesPlayed);
    }

    // So'nggi yutuqlar
    getRecentAchievements(achievements) {
        return achievements
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, 5);
    }

    // Tavsiyalar generatsiya qilish
    generateRecommendations(stats, flashcardStats) {
        const recommendations = [];
        
        // O'yin tavsiyalari
        const gameStats = stats.gameStats;
        const leastPlayed = Object.entries(gameStats)
            .filter(([_, stat]) => stat.gamesPlayed > 0)
            .sort((a, b) => a[1].gamesPlayed - b[1].gamesPlayed)
            .slice(0, 2);
        
        if (leastPlayed.length > 0) {
            recommendations.push({
                type: 'game',
                message: `Kam o'ynagan o'yiningiz: ${leastPlayed.map(([game]) => gameData.games[game]?.title).join(', ')}`,
                priority: 'medium'
            });
        }
        
        // Flashcard tavsiyalari
        const lowProgressLanguages = flashcardStats.languages
            .filter(lang => lang.progress < 50)
            .slice(0, 2);
        
        if (lowProgressLanguages.length > 0) {
            recommendations.push({
                type: 'learning',
                message: `Ushbu tillarda mashq qiling: ${lowProgressLanguages.map(lang => lang.name).join(', ')}`,
                priority: 'high'
            });
        }
        
        // Daraja tavsiyalari
        if (stats.user.level < 5) {
            recommendations.push({
                type: 'level',
                message: 'Keyingi darajaga chiqish uchun ko\'proq o\'ynang!',
                priority: 'low'
            });
        }
        
        return recommendations;
    }

    // Statistikani ekranga chiqarish
    displayStats(containerId, statsType = 'general') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let statsHTML = '';
        
        switch (statsType) {
            case 'general':
                statsHTML = this.renderGeneralStats();
                break;
            case 'flashcards':
                statsHTML = this.renderFlashcardStats();
                break;
            case 'daily':
                statsHTML = this.renderDailyStats();
                break;
        }
        
        container.innerHTML = statsHTML;
    }

    // Umumiy statistikani render qilish
    renderGeneralStats() {
        const stats = this.getGeneralStats();
        
        return `
            <div class="stats-container">
                <div class="stats-header">
                    <h3>Umumiy Statistika</h3>
                    <p>O'yin faolligingiz va yutuqlaringiz</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card large">
                        <div class="stat-icon">🎮</div>
                        <div class="stat-value">${stats.summary.totalGames}</div>
                        <div class="stat-label">Jami O'yinlar</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${stats.summary.averageScore}</div>
                        <div class="stat-label">O'rtacha Ball</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value">${stats.summary.currentStreak}</div>
                        <div class="stat-label">Ketma-ketlik</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-value">${stats.summary.successRate}%</div>
                        <div class="stat-label">Muvaffaqqiyat</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Flashcard statistikasini render qilish
    renderFlashcardStats() {
        const stats = this.getFlashcardStats();
        
        return `
            <div class="stats-container">
                <div class="stats-header">
                    <h3>O'rganish Statistikasi</h3>
                    <p>Tillar va so'zlar bo'yicha progress</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card large">
                        <div class="stat-icon">📚</div>
                        <div class="stat-value">${stats.learnedWords}/${stats.totalWords}</div>
                        <div class="stat-label">O'zlashtirilgan So'zlar</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.overallProgress}%"></div>
                            </div>
                            <span>${Math.round(stats.overallProgress)}%</span>
                        </div>
                    </div>
                    
                    ${stats.languages.slice(0, 4).map(lang => `
                        <div class="stat-card">
                            <div class="stat-icon">${lang.flag}</div>
                            <div class="stat-value">${Math.round(lang.progress)}%</div>
                            <div class="stat-label">${lang.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Global instance yaratish
const StatsManager = new StatisticsManager();