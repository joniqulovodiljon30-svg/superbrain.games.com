// Memory Master - Ma'lumotlar Bazasi
const gameData = {
    // O'yin ma'lumotlari
    games: {
        numbers: {
            title: "Raqamlar",
            description: "Raqamlar ketma-ketligini eslab qoling va takrorlang",
            icon: "fas fa-sort-numeric-up",
            difficulty: "medium",
            duration: "2-5 daqiqa",
            levels: 5
        },
        words: {
            title: "So'zlar", 
            description: "So'zlar ketma-ketligini eslab qoling va takrorlang",
            icon: "fas fa-font",
            difficulty: "medium",
            duration: "3-6 daqiqa",
            levels: 5
        },
        flashcards: {
            title: "Flash Kartalar",
            description: "6 xil tilda so'zlarni o'rganing va yodlang",
            icon: "fas fa-layer-group",
            difficulty: "hard",
            duration: "Cheksiz",
            levels: 10,
            premium: true
        },
        faces: {
            title: "Yuzlar",
            description: "Yuzlarni eslab qoling va ularni tanib oling",
            icon: "fas fa-user-friends",
            difficulty: "easy",
            duration: "4 daqiqa",
            levels: 3
        },
        images: {
            title: "Rasmlar",
            description: "Rasmlar ketma-ketligini eslab qoling va takrorlang",
            icon: "fas fa-images",
            difficulty: "medium",
            duration: "3-5 daqiqa",
            levels: 4
        }
    },

    // So'zlar bazasi - 6 til
    languages: {
        english: {
            name: "Ingliz",
            code: "en",
            flag: "🇺🇸",
            categories: {
                everyday: {
                    name: "Kundalik Hayot",
                    words: [
                        { word: "hello", pronunciation: "heˈləʊ", translation: "salom", definition: "Xush kelibsiz degan ma'no", emoji: "👋" },
                        { word: "goodbye", pronunciation: "ɡʊdˈbaɪ", translation: "xayr", definition: "Xayrlashish", emoji: "👋" },
                        { word: "thank you", pronunciation: "θæŋk juː", translation: "rahmat", definition: "Minmatdorlik bildirish", emoji: "🙏" },
                        { word: "please", pronunciation: "pliːz", translation: "iltimos", definition: "Iltimos so'roq", emoji: "🥺" },
                        { word: "yes", pronunciation: "jes", translation: "ha", definition: "Ijobiy javob", emoji: "✅" },
                        { word: "no", pronunciation: "nəʊ", translation: "yo'q", definition: "Salbiy javob", emoji: "❌" },
                        { word: "water", pronunciation: "ˈwɔːtə", translation: "suv", definition: "Suv ichimlik", emoji: "💧" },
                        { word: "food", pronunciation: "fuːd", translation: "ovqat", definition: "Ovqatlanish", emoji: "🍕" },
                        { word: "house", pronunciation: "haʊs", translation: "uy", definition: "Turar joy", emoji: "🏠" },
                        { word: "car", pronunciation: "kɑː", translation: "mashina", definition: "Transport vositasi", emoji: "🚗" }
                    ]
                },
                family: {
                    name: "Oila",
                    words: [
                        { word: "mother", pronunciation: "ˈmʌðə", translation: "ona", definition: "Ota-ona", emoji: "👩" },
                        { word: "father", pronunciation: "ˈfɑːðə", translation: "ota", definition: "Ota-ona", emoji: "👨" },
                        { word: "brother", pronunciation: "ˈbrʌðə", translation: "aka", definition: "Ukasi", emoji: "👦" },
                        { word: "sister", pronunciation: "ˈsɪstə", translation: "opa", definition: "Singlisi", emoji: "👧" },
                        { word: "family", pronunciation: "ˈfæməli", translation: "oila", definition: "Qarindoshlar", emoji: "👨‍👩‍👧‍👦" }
                    ]
                }
            }
        },
        russian: {
            name: "Rus",
            code: "ru", 
            flag: "🇷🇺",
            categories: {
                basic: {
                    name: "Asosiy So'zlar",
                    words: [
                        { word: "привет", pronunciation: "privét", translation: "salom", definition: "Salomlashish", emoji: "👋" },
                        { word: "спасибо", pronunciation: "spasíba", translation: "rahmat", definition: "Minmatdorlik", emoji: "🙏" },
                        { word: "да", pronunciation: "da", translation: "ha", definition: "Ha", emoji: "✅" },
                        { word: "нет", pronunciation: "net", translation: "yo'q", definition: "Yo'q", emoji: "❌" }
                    ]
                }
            }
        },
        arabic: {
            name: "Arab",
            code: "ar",
            flag: "🇸🇦", 
            categories: {
                basic: {
                    name: "Asosiy So'zlar",
                    words: [
                        { word: "مرحبا", pronunciation: "marḥaban", translation: "salom", definition: "Salomlashish", emoji: "👋" },
                        { word: "شكرا", pronunciation: "shukran", translation: "rahmat", definition: "Minmatdorlik", emoji: "🙏" }
                    ]
                }
            }
        },
        korean: {
            name: "Koreys",
            code: "ko",
            flag: "🇰🇷",
            categories: {
                basic: {
                    name: "Asosiy So'zlar", 
                    words: [
                        { word: "안녕하세요", pronunciation: "annyeonghaseyo", translation: "salom", definition: "Salomlashish", emoji: "👋" },
                        { word: "감사합니다", pronunciation: "gamsahamnida", translation: "rahmat", definition: "Minmatdorlik", emoji: "🙏" }
                    ]
                }
            }
        },
        chinese: {
            name: "Xitoy",
            code: "zh", 
            flag: "🇨🇳",
            categories: {
                basic: {
                    name: "Asosiy So'zlar",
                    words: [
                        { word: "你好", pronunciation: "nǐ hǎo", translation: "salom", definition: "Salomlashish", emoji: "👋" },
                        { word: "谢谢", pronunciation: "xièxiè", translation: "rahmat", definition: "Minmatdorlik", emoji: "🙏" }
                    ]
                }
            }
        },
        spanish: {
            name: "Ispan",
            code: "es",
            flag: "🇪🇸",
            categories: {
                basic: {
                    name: "Asosiy So'zlar",
                    words: [
                        { word: "hola", pronunciation: "óla", translation: "salom", definition: "Salomlashish", emoji: "👋" },
                        { word: "gracias", pronunciation: "grásyas", translation: "rahmat", definition: "Minmatdorlik", emoji: "🙏" }
                    ]
                }
            }
        }
    },

    // O'yin sozlamalari
    settings: {
        numbers: {
            levels: [
                { sequenceLength: 3, timeToRemember: 5, points: 100 },
                { sequenceLength: 4, timeToRemember: 6, points: 150 },
                { sequenceLength: 5, timeToRemember: 7, points: 200 },
                { sequenceLength: 6, timeToRemember: 8, points: 250 },
                { sequenceLength: 7, timeToRemember: 9, points: 300 }
            ]
        },
        words: {
            levels: [
                { wordCount: 3, timeToRemember: 10, points: 100 },
                { wordCount: 4, timeToRemember: 12, points: 150 },
                { wordCount: 5, timeToRemember: 15, points: 200 },
                { wordCount: 6, timeToRemember: 18, points: 250 },
                { wordCount: 7, timeToRemember: 20, points: 300 }
            ]
        }
    },

    // Foydalanuvchi ma'lumotlari
    user: {
        name: "Mehmon Foydalanuvchi",
        level: 1,
        experience: 0,
        gamesPlayed: 0,
        achievements: [],
        stats: {
            numbers: { bestScore: 0, gamesPlayed: 0 },
            words: { bestScore: 0, gamesPlayed: 0 },
            flashcards: { bestScore: 0, gamesPlayed: 0 },
            faces: { bestScore: 0, gamesPlayed: 0 },
            images: { bestScore: 0, gamesPlayed: 0 }
        }
    }
};