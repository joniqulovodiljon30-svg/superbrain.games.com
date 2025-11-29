// words.js - So'zlar o'yini moduli
class WordsGame {
    constructor() {
        this.wordsData = {
            en: [
                "Ephemeral", "Ubiquitous", "Serendipity", "Mellifluous", "Sempiternal", "Nefarious", "Pulchritude", "Innocuous", "Quixotic", "Ethereal",
                "Conundrum", "Voracious", "Petrichor", "Luminous", "Eloquence", "Fervent", "Intrepid", "Maneuver", "Oblivion", "Quintessential",
                "Zealous", "Venerable", "Transient", "Surreptitious", "Sophomoric", "Sagacious", "Reclusive", "Querulous", "Pugnacious", "Placid",
                "Onerous", "Nugatory", "Munificent", "Laconic", "Juxtapose", "Inchoate", "Hegemony", "Gratuitous", "Fastidious", "Dilatory",
                "Capricious", "Calamity", "Buttress", "Banal", "Auspicous", "Arbitrary", "Ameliorate", "Alacrity", "Abstruse", "Pensive",
                "Indolent", "Vociferous", "Salient", "Mitigate", "Enervate", "Exacerbate", "Recalcitrant", "Obfuscate", "Pithy", "Sublime"
            ],
            uz: [
                "Tafakkur", "Munosabat", "Barqaror", "Fidoiy", "Samara", "Qiyinchilik", "Mustahkam", "Hayrat", "Ixtiro", "Ilhom",
                "Hissiyot", "Mantiq", "Marhamat", "Tajriba", "Javobgar", "Xayol", "Qadrli", "Imkoniyat", "Ma'naviyat", "Tashabbus",
                "Fursat", "Iymon", "Masofa", "Chorak", "Zarur", "Oqibat", "G'oya", "Hisob", "Hukm", "Faqat",
                "Hafta", "Bahor", "Muzqaymoq", "Tarix", "Davlat", "Asosiy", "Ehtiyoj", "Doimiy", "Aniq", "Yozuv",
                "Jahon", "Qishloq", "Shamol", "Daraja", "Odam", "Harf", "Yangi", "Eski", "Beshik", "Kitob"
            ],
            ru: [
                "Сознание", "Постоянный", "Случайный", "Мелодичный", "Вечный", "Нечестивый", "Красота", "Безвредный", "Донкихотский", "Неземной",
                "Загадка", "Ненасытный", "Петрикор", "Светящийся", "Красноречие", "Пылкий", "Бесстрашный", "Маневр", "Забвение", "Квинтэссенция",
                "Изобилие", "Непрерывный", "Отражение", "Удовлетворение", "Символ", "Торжество", "Рассудок", "Совершенство", "Инициатива", "Возрождение",
                "Убеждение", "Сосредоточение", "Предположение", "Мрачный", "Осведомленность", "Смелость", "Поэзия", "Энергия", "Редкость", "Интуиция",
                "Призвание", "Безопасность", "Радость", "Счастье", "Сияние", "Успех", "Единство", "Намерение", "Творчество", "Сочувствие"
            ],
            es: [
                "Efímero", "Ubicuo", "Serendipia", "Melifluo", "Sempiterno", "Nefario", "Pulcritud", "Inocuo", "Quijotesco", "Etéreo",
                "Dilema", "Voraz", "Petricor", "Luminoso", "Elocuencia", "Ferviente", "Intrépido", "Maniobra", "Olvido", "Quintaesencia",
                "Entusiasta", "Venerable", "Transitorio", "Subrepticio", "Inmaduro", "Sagaz", "Recluso", "Quejumbroso", "Pugnaz", "Plácido",
                "Oneroso", "Nugatorio", "Munífico", "Lacónico", "Yuxtaponer", "Incipiente", "Hegemonía", "Gratuito", "Fastidioso", "Dilatorio",
                "Caprichoso", "Calamidad", "Contrafuerte", "Banal", "Propicio", "Arbitrario", "Mejorar", "Presto", "Abstruso", "Pensativo"
            ],
            zh: [
                "短暂", "无处不在", "意外发现", "甜美", "永恒", "邪恶", "美丽", "无害", "不切实际", "空灵",
                "难题", "贪婪", "雨后泥土香", "明亮", "雄辩", "热情", "无畏", "机动", "遗忘", "典型",
                "热情", "可敬", "短暂", "秘密", "幼稚", "睿智", "隐居", "抱怨", "好斗", "平静",
                "繁重", "琐碎", "慷慨", "简洁", "并列", "刚开始", "霸权", "无故", "挑剔", "拖延",
                "任性", "灾难", "支撑", "平庸", "吉祥", "武断", "改善", "敏捷", "深奥", "沉思"
            ],
            ko: [
                "덧없는", "어디에나 있는", "뜻밖의 발견", "감미로운", "영원한", "사악한", "아름다움", "무해한", "공상적인", "에테르 같은",
                "수수께끼", "탐욕스러운", "비 온 뒤 흙냄새", "빛나는", "웅변", "열렬한", "대담한", "기동", "망각", "본질적인",
                "열성적인", "존경할 만한", "일시적인", "은밀한", "미숙한", "현명한", "은둔적인", "불평하는", "호전적인", "고요한",
                "부담스러운", "하찮은", "관대한", "간결한", "병치", "시작阶段的", "패권", "무료한", "까다로운", "지연하는",
                "변덕스러운", "재난", "버팀목", "평범한", "길조의", "임의의", "개선하다", "민첩함", "난해한", "생각에 잠긴"
            ],
            ja: [
                "儚い", "遍在する", "偶然の幸運", "甘美な", "永遠の", "邪悪な", "美しさ", "無害な", "空想的な", "エーテル的な",
                "難問", "貪欲な", "雨上がりの土の香り", "輝く", "雄弁", "熱心な", "勇敢な", "操作", "忘却", "典型的な",
                "熱心な", "尊敬すべき", "一時的な", "密かな", "未熟な", "賢明な", "世捨て人の", "不平を言う", "好戦的な", "穏やかな",
                "煩わしい", "取るに足らない", "気前の良い", "簡潔な", "並置", "初期の", "覇権", "不当な", "気難しい", "遅延する",
                "気まぐれな", "災難", "支え", "平凡な", "縁起の良い", "任意の", "改善する", "機敏さ", "難解な", "物思いに沈んだ"
            ]
        };

        this.currentGame = {
            words: [],
            userAnswers: [],
            settings: {},
            startTime: null
        };
    }

    // Sozlamalarni o'rnatish
    initializeSettings(settings) {
        this.currentGame.settings = settings;
    }

    // So'zlarni tanlash va aralashtirish
    generateWords() {
        const lang = this.currentGame.settings.language || 'en';
        const count = this.currentGame.settings.wordsCount || 15;
        
        let availableWords = this.wordsData[lang] || this.wordsData.en;
        
        // Agar so'ralgan so'zlar soni mavjud so'zlardan ko'p bo'lsa
        if (count > availableWords.length) {
            availableWords = availableWords.concat(
                this.wordsData.en.slice(0, count - availableWords.length)
            );
        }
        
        // So'zlarni aralashtirish
        const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
        this.currentGame.words = shuffled.slice(0, count);
        
        return this.currentGame.words;
    }

    // O'yinni boshlash
    startGame() {
        this.currentGame.startTime = new Date();
        this.currentGame.userAnswers = [];
        return this.generateWords();
    }

    // Foydalanuvchi javoblarini qabul qilish
    addUserAnswer(index, answer) {
        this.currentGame.userAnswers[index] = answer;
    }

    // Natijalarni hisoblash
    calculateResults() {
        let correctCount = 0;
        const results = [];
        
        this.currentGame.words.forEach((word, index) => {
            const userAnswer = this.currentGame.userAnswers[index] || '';
            const isCorrect = word.toLowerCase() === userAnswer.toLowerCase();
            
            if (isCorrect) {
                correctCount++;
            }
            
            results.push({
                word: word,
                userAnswer: userAnswer,
                isCorrect: isCorrect,
                index: index
            });
        });
        
        const totalWords = this.currentGame.words.length;
        const score = Math.round((correctCount / totalWords) * 100);
        const timeSpent = Math.round((new Date() - this.currentGame.startTime) / 1000);
        
        return {
            score: score,
            correctCount: correctCount,
            totalWords: totalWords,
            results: results,
            timeSpent: timeSpent,
            settings: this.currentGame.settings
        };
    }

    // O'yin statistikasini olish
    getGameStats() {
        return {
            words: this.currentGame.words,
            settings: this.currentGame.settings,
            userAnswers: this.currentGame.userAnswers
        };
    }

    // Sozlamalarni qaytarish
    getDefaultSettings() {
        return {
            language: 'english',
            wordsCount: 15,
            studyTime: 60
        };
    }

    // Til kodini o'zgartirish
    mapLanguageCode(language) {
        const languageMap = {
            'english': 'en',
            'korean': 'ko', 
            'japanese': 'ja',
            'chinese': 'zh',
            'german': 'de',
            'french': 'fr',
            'uzbek': 'uz'
        };
        
        return languageMap[language] || 'en';
    }
}

// Global o'zgaruvchi yaratish
window.wordsGame = new WordsGame();
